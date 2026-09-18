#!/usr/bin/env python3
"""Check that Nginx serves every deployed file, including all generated pages."""

from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.request import Request, urlopen

root = Path("/var/www/serialcoders/current/site")
checked = 0
for file in root.rglob("*"):
    if not file.is_file():
        continue
    path = "/" + file.relative_to(root).as_posix()
    if path == "/404.html":
        continue  # Nginx intentionally exposes this page only through error handling.
    if path.endswith("/index.html"):
        path = path[:-10]
    request = Request("http://127.0.0.1" + quote(path), headers={"Host": "serialcoders.fr"})
    with urlopen(request, timeout=10) as response:
        if response.status != 200 or response.read() != file.read_bytes():
            raise SystemExit(f"Served content differs: {path}")
    checked += 1
try:
    urlopen(Request("http://127.0.0.1/verification-page-absente-serialcoders/",
                    headers={"Host": "serialcoders.fr"}), timeout=10)
except HTTPError as error:
    if error.code != 404:
        raise
    if error.read() != (root / "404.html").read_bytes():
        raise SystemExit("Missing page does not serve the custom 404 page")
else:
    raise SystemExit("Missing page did not return 404")
print(f"OK: {checked} files served identically; missing page returns 404.")
