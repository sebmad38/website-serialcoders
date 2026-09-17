#!/usr/bin/env bash
set -euo pipefail

# Use the official LTS binaries and verify the archive before installation.
node_stage=$(mktemp -d)
trap 'rm -rf -- "$node_stage"' EXIT
cd "$node_stage"
curl -fsSLO https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt
node_archive=$(awk '$2 ~ /^node-v24\.[0-9]+\.[0-9]+-linux-x64.tar.xz$/ {print $2}' SHASUMS256.txt)
test -n "$node_archive"
curl -fsSLO "https://nodejs.org/dist/latest-v24.x/$node_archive"
grep " $node_archive\$" SHASUMS256.txt | sha256sum -c -
tar -xJf "$node_archive" -C /usr/local --strip-components=1
node --version

# This host sends contact mail only; it must not expose an SMTP listener.
postconf -e 'inet_interfaces = loopback-only'
postconf -e 'inet_protocols = ipv4'
postconf -e 'myhostname = forms.serialcoders.fr'
postconf -e 'mydestination = localhost'
postconf -e 'message_size_limit = 20000000'
postconf -e 'authorized_submit_users = root, www-data'
# Keep outgoing mail disabled until an authenticated relay is configured.
postconf -e 'default_transport = error:SMTP relay not configured'
systemctl restart postfix

install -d -m 755 /var/www/serialcoders/releases /opt/serialcoders/scripts
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
