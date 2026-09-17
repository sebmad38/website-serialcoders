#!/usr/bin/env bash
set -euo pipefail

release_id=${1:?Release identifier required}
[[ "$release_id" =~ ^[0-9]{8}-[0-9]{6}$ ]] || exit 2
release_dir="/var/www/serialcoders/releases/$release_id"
install -d -m 755 "$release_dir"
tar -xzf /tmp/serialcoders-site.tar.gz -C "$release_dir" --no-same-owner
chown -R root:root "$release_dir"
find "$release_dir" -type d -exec chmod 755 {} +
find "$release_dir" -type f -exec chmod 644 {} +
ln -sfn "$release_dir" /var/www/serialcoders/current
install -m 644 /tmp/serialcoders-contact-api.mjs /opt/serialcoders/scripts/contact-api.mjs
install -m 644 /tmp/serialcoders-contact.service /etc/systemd/system/serialcoders-contact.service
if [[ ! -e /etc/serialcoders-contact.env ]]; then
    # Missing SMTP values deliberately make the API return an unavailable error.
    printf '%s\n' 'CONTACT_ORIGIN=https://serialcoders.fr' > /etc/serialcoders-contact.env
    chmod 600 /etc/serialcoders-contact.env
fi
install -m 644 /tmp/serialcoders-nginx.conf /etc/nginx/sites-available/serialcoders
ln -sfn /etc/nginx/sites-available/serialcoders /etc/nginx/sites-enabled/serialcoders
nginx -t
systemctl daemon-reload
systemctl enable --now serialcoders-contact
systemctl restart serialcoders-contact
systemctl reload nginx
