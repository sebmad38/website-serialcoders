"""Exercise archive validation and activation rollback without a remote host or mail."""
import importlib.util
import hashlib
import io
import json
import os
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("release", Path(__file__).resolve().parents[2] / "deploy/release.py")
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)


def seal_bundle(directory):
    files = {path.relative_to(directory).as_posix(): hashlib.sha256(path.read_bytes()).hexdigest()
             for path in directory.rglob("*") if path.is_file() and path.name != "bundle-manifest.json"}
    (directory / "bundle-manifest.json").write_text(json.dumps({"version": 1, "files": files}), encoding="utf-8")


class ReleaseTests(unittest.TestCase):
    def test_archive_rejects_traversal_links_and_private_files(self):
        with tempfile.TemporaryDirectory(prefix="serialcoders-archive-") as temporary:
            directory = Path(temporary)
            for name, kind in [("site/../../escape", tarfile.REGTYPE), ("server/link", tarfile.SYMTYPE), (".env", tarfile.REGTYPE)]:
                archive = directory / "bad.tar.gz"
                with tarfile.open(archive, "w:gz") as bundle:
                    member = tarfile.TarInfo(name)
                    member.type = kind
                    member.linkname = "/etc/passwd" if kind == tarfile.SYMTYPE else ""
                    bundle.addfile(member, io.BytesIO(b""))
                with self.assertRaises(ValueError):
                    release.extract_release(archive, directory / "output")

    def test_manifest_rejects_incomplete_release(self):
        with tempfile.TemporaryDirectory(prefix="serialcoders-manifest-") as temporary:
            directory = Path(temporary)
            (directory / "site").mkdir()
            (directory / "site/release-manifest.json").write_text(json.dumps({"version": 1, "files": {}}))
            seal_bundle(directory)
            with self.assertRaisesRegex(ValueError, "Required file missing"):
                release.verify_release(directory)

    def test_bundle_rejects_modified_server(self):
        with tempfile.TemporaryDirectory(prefix="serialcoders-server-integrity-") as temporary:
            directory = Path(temporary)
            site = directory / "site"
            files = {}
            for name in ["index.html", "contact/index.html", "contact.js", "site.js", "404.html"]:
                target = site / name
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(b"test")
                files[name] = hashlib.sha256(b"test").hexdigest()
            (site / "release-manifest.json").write_text(json.dumps({"version": 1, "files": files}))
            (directory / "server").mkdir()
            entry = directory / "server/index.mjs"
            entry.write_text("export const version = 1;")
            seal_bundle(directory)
            release.verify_release(directory)
            entry.write_text("export const version = 2;")
            with self.assertRaisesRegex(ValueError, "Bundle checksum mismatch: server/index.mjs"):
                release.verify_release(directory)

    def test_failed_activation_restores_previous_link(self):
        # Mock filesystem operations so this also runs without Windows symlink privileges.
        current = Path("/var/www/serialcoders/current")
        for failure in ["restart", "health"]:
            with self.subTest(failure=failure):
                commands = []

                def run(command, **_kwargs):
                    commands.append(command)
                    if len(commands) == 1 and failure == "restart":
                        raise RuntimeError("activation failed")

                def health():
                    raise RuntimeError("activation failed")

                with (
                    patch.object(Path, "is_symlink", side_effect=[True, False]),
                    patch.object(Path, "exists", return_value=False),
                    patch.object(Path, "symlink_to") as symlink,
                    patch.object(os, "readlink", return_value="releases/old"),
                    patch.object(os, "replace") as replace,
                ):
                    with self.assertRaisesRegex(RuntimeError, "activation failed"):
                        release.activate_release(
                            Path("releases/new"), current, run=run, health=health
                        )
                    self.assertEqual(replace.call_count, 2)
                    self.assertEqual(symlink.call_args.args[0], "releases/old")
                    self.assertEqual(len(commands), 2)

    def test_healthy_activation_keeps_new_release(self):
        with (
            patch.object(Path, "is_symlink", side_effect=[True, False]),
            patch.object(Path, "exists", return_value=False),
            patch.object(Path, "symlink_to") as symlink,
            patch.object(os, "readlink", return_value="releases/old"),
            patch.object(os, "replace") as replace,
        ):
            release.activate_release(
                Path("releases/new"), Path("current"),
                run=lambda *_args, **_kwargs: None, health=lambda: None,
            )
            self.assertEqual(replace.call_count, 1)
            self.assertEqual(symlink.call_args.args[0], Path("releases/new"))


if __name__ == "__main__":
    unittest.main()
