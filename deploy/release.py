#!/usr/bin/env python3
"""Validate a complete release, switch one symlink, and roll back failed activation."""

import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tarfile
import time
from urllib.request import urlopen


def extract_release(archive, destination):
    """Only regular site/server files are allowed; never extract links or traversal paths."""
    destination = destination.resolve()
    with tarfile.open(archive, "r:gz") as bundle:
        members = bundle.getmembers()
        names = set()
        for member in members:
            parts = member.name.split("/")
            is_manifest = member.name == "bundle-manifest.json" and member.isfile()
            if ((parts[0] not in {"site", "server"} and not is_manifest) or ".." in parts
                    or "\\" in member.name or member.name in names
                    or not (member.isfile() or member.isdir())):
                raise ValueError(f"Unsafe archive entry: {member.name}")
            target = (destination / member.name).resolve()
            if not target.is_relative_to(destination):
                raise ValueError("Archive escapes release directory")
            names.add(member.name)
        for member in members:
            target = destination / member.name
            if member.isdir():
                target.mkdir(parents=True, exist_ok=True)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                with bundle.extractfile(member) as source, target.open("xb") as output:
                    import shutil
                    shutil.copyfileobj(source, output)
                target.chmod(0o644)
        for directory in destination.rglob("*"):
            if directory.is_dir():
                directory.chmod(0o755)


def verify_release(directory):
    bundle = json.loads((directory / "bundle-manifest.json").read_text(encoding="utf-8"))
    files = {file.relative_to(directory).as_posix() for file in directory.rglob("*") if file.is_file()}
    if bundle.get("version") != 1 or set(bundle["files"]) != files - {"bundle-manifest.json"}:
        raise ValueError("Incomplete bundle manifest")
    for name, expected in bundle["files"].items():
        target = (directory / name).resolve()
        if not target.is_relative_to(directory.resolve()) or hashlib.sha256(target.read_bytes()).hexdigest() != expected:
            raise ValueError(f"Bundle checksum mismatch: {name}")
    site = directory / "site"
    manifest = json.loads((site / "release-manifest.json").read_text(encoding="utf-8"))
    actual = {file.relative_to(site).as_posix() for file in site.rglob("*") if file.is_file()}
    if manifest.get("version") != 1 or set(manifest["files"]) != actual - {"release-manifest.json"}:
        raise ValueError("Incomplete release manifest")
    for name, expected in manifest["files"].items():
        file = (site / name).resolve()
        if not file.is_relative_to(site.resolve()):
            raise ValueError("Unsafe manifest path")
        if hashlib.sha256(file.read_bytes()).hexdigest() != expected:
            raise ValueError(f"Release checksum mismatch: {name}")
    for name in ["index.html", "contact/index.html", "contact.js", "site.js", "404.html"]:
        if name not in manifest["files"]:
            raise ValueError(f"Required file missing: {name}")
    if not (directory / "server/index.mjs").is_file():
        raise ValueError("API entry point missing")


def check_health():
    for attempt in range(10):
        try:
            with urlopen("http://127.0.0.1:4180/health", timeout=2) as response:
                if response.status == 200 and json.load(response) == {"status": "ok"}:
                    return
        except (OSError, ValueError):
            pass
        if attempt < 9:
            time.sleep(0.5)
    raise RuntimeError("API health check failed")


def activate_release(release, current, run=subprocess.run, health=check_health):
    """The website and API share a release link; configuration is provisioned separately."""
    previous = os.readlink(current) if current.is_symlink() else None
    if current.exists() and not current.is_symlink():
        raise ValueError("current must be a symbolic link")
    temporary = current.with_name(".current-next")
    if temporary.exists() or temporary.is_symlink():
        raise ValueError("Another activation appears to be in progress")
    temporary.symlink_to(release, target_is_directory=True)
    os.replace(temporary, current)
    try:
        run(["systemctl", "restart", "serialcoders-contact"], check=True)
        health()
    except BaseException:
        if previous is not None:
            temporary.symlink_to(previous, target_is_directory=True)
            os.replace(temporary, current)
            run(["systemctl", "restart", "serialcoders-contact"], check=True)
        else:
            current.unlink()
            run(["systemctl", "stop", "serialcoders-contact"], check=True)
        raise


def main():
    if len(sys.argv) != 2 or not re.fullmatch(r"[0-9]{8}-[0-9]{6}", sys.argv[1]):
        raise SystemExit("Usage: sudo python3 deploy/release.py YYYYMMDD-HHMMSS")
    if os.geteuid() != 0:
        raise SystemExit("Run as root")
    import fcntl
    with open("/run/serialcoders-release.lock", "w", encoding="utf-8") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        base = Path("/var/www/serialcoders")
        release = base / "releases" / sys.argv[1]
        # Never reuse or recursively delete a release: rollback history stays available.
        release.mkdir(parents=True, exist_ok=False, mode=0o755)
        extract_release("/tmp/serialcoders-release.tar.gz", release)
        verify_release(release)
        for source in (release / "server").rglob("*.mjs"):
            subprocess.run(["/usr/local/bin/node", "--check", str(source)], check=True)
        # Run as the actual service account, not root, and use a fake mail transport.
        subprocess.run(["runuser", "-u", "www-data", "--", "/usr/local/bin/node", str(release / "server/preflight.mjs")], check=True, timeout=15)
        nginx = subprocess.run(["nginx", "-T"], check=True, capture_output=True, text=True)
        if "root /var/www/serialcoders/current/site;" not in nginx.stdout:
            raise SystemExit("Provision the Nginx site root before using this installer")
        unit = subprocess.run(["systemctl", "show", "serialcoders-contact", "--property=ExecStart", "--value"], check=True, capture_output=True, text=True)
        if "/var/www/serialcoders/current/server/index.mjs" not in unit.stdout:
            raise SystemExit("Provision the updated systemd unit before using this installer")
        activate_release(release, base / "current")
        print(f"Release {sys.argv[1]} activated; SMTP delivery requires a separate check.")


if __name__ == "__main__":
    main()
