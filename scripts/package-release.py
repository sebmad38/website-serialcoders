#!/usr/bin/env python3
"""Package an already verified build and its API, excluding repository and credentials."""
import json
from pathlib import Path
import tarfile
import hashlib
import io

root = Path(__file__).resolve().parent.parent
site = root / "dist"
manifest = json.loads((site / "release-manifest.json").read_text(encoding="utf-8"))
actual = {path.relative_to(site).as_posix() for path in site.rglob("*") if path.is_file()}
if set(manifest["files"]) != actual - {"release-manifest.json"}:
    raise SystemExit("Build manifest is incomplete; run npm run build")
for name, expected in manifest["files"].items():
    source = (site / name).resolve()
    if not source.is_relative_to(site.resolve()) or hashlib.sha256(source.read_bytes()).hexdigest() != expected:
        raise SystemExit(f"Build differs from manifest: {name}")
output = root / "artifacts" / "serialcoders-release.tar.gz"
output.parent.mkdir(exist_ok=True)
# Hash exactly the bytes written to the archive, covering the API as well as the site.
files = {}
for source_dir, prefix in [(site, "site"), (root / "server", "server")]:
    for source in sorted(source_dir.rglob("*")):
        if source.is_symlink():
            raise SystemExit(f"Symbolic link not allowed: {source}")
        if source.is_file() and (prefix == "site" or source.suffix == ".mjs"):
            files[prefix + "/" + source.relative_to(source_dir).as_posix()] = source.read_bytes()
bundle_manifest = {"version": 1, "files": {name: hashlib.sha256(data).hexdigest() for name, data in files.items()}}
files["bundle-manifest.json"] = (json.dumps(bundle_manifest, indent=2) + "\n").encode("utf-8")
with tarfile.open(output, "w:gz") as archive:
    for name, data in files.items():
        member = tarfile.TarInfo(name)
        member.size = len(data)
        member.mode = 0o644
        archive.addfile(member, io.BytesIO(data))
print(output)
