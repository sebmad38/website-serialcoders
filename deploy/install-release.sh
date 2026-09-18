#!/usr/bin/env bash
set -euo pipefail
# Infrastructure (TLS, Nginx and systemd unit) is provisioned separately.
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
exec python3 "$script_dir/release.py" "${1:?Release identifier required}"
