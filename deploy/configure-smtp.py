#!/usr/bin/env python3
"""Configure an authenticated SMTP relay without exposing its password in history."""

import getpass
import os
from pathlib import Path
import re
import subprocess


def configure_smtp():
    if os.geteuid() != 0:
        raise SystemExit("Run with sudo.")
    host = input("SMTP hostname [in-v3.mailjet.com]: ").strip() or "in-v3.mailjet.com"
    port = input("SMTP port [587]: ").strip() or "587"
    username = getpass.getpass("Mailjet API key (hidden): ").strip()
    sender = input("Authorized sender [contact@serialcoders.fr]: ").strip() or "contact@serialcoders.fr"
    recipient = input("Recipient [contact@serialcoders.fr]: ").strip() or "contact@serialcoders.fr"
    if not re.fullmatch(r"[a-zA-Z0-9.-]+", host) or port not in {"587", "465"}:
        raise SystemExit("Invalid SMTP host or port.")
    email_pattern = r"[a-zA-Z0-9_.+%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    if not all(re.fullmatch(email_pattern, address) for address in (sender, recipient)):
        raise SystemExit("Invalid email address.")
    if not username or re.search(r"[\s:\x00]", username):
        raise SystemExit("Invalid SMTP username.")
    password = getpass.getpass("Mailjet secret key (hidden): ")
    if not password or any(character in password for character in "\r\n\x00"):
        raise SystemExit("Invalid password.")

    os.umask(0o077)
    relay = f"[{host}]:{port}"
    credentials = Path("/etc/postfix/sasl_passwd")
    credentials.write_text(f"{relay} {username}:{password}\n", encoding="utf-8")
    credentials.chmod(0o600)
    subprocess.run(["postmap", f"hash:{credentials}"], check=True)
    Path(str(credentials) + ".db").chmod(0o600)
    settings = {
        "relayhost": relay,
        "smtp_sasl_auth_enable": "yes",
        "smtp_sasl_password_maps": f"hash:{credentials}",
        "smtp_sasl_security_options": "noanonymous",
        "smtp_sasl_tls_security_options": "noanonymous",
        # Verify the provider certificate as well as requiring encryption.
        "smtp_tls_security_level": "verify",
        "smtp_tls_CAfile": "/etc/ssl/certs/ca-certificates.crt",
        "smtp_tls_wrappermode": "yes" if port == "465" else "no",
        "default_transport": "smtp",
        "inet_interfaces": "loopback-only",
        "mydestination": "localhost",
    }
    for name, value in settings.items():
        subprocess.run(["postconf", "-e", f"{name} = {value}"], check=True)
    environment = Path("/etc/serialcoders-contact.env")
    environment.write_text(
        f"CONTACT_ORIGIN=https://serialcoders.fr\nCONTACT_FROM={sender}\n"
        f"CONTACT_TO={recipient}\nCONTACT_SENDMAIL=/usr/sbin/sendmail\n",
        encoding="utf-8",
    )
    environment.chmod(0o600)
    subprocess.run(["postfix", "check"], check=True)
    subprocess.run(["systemctl", "restart", "postfix", "serialcoders-contact"], check=True)
    print("SMTP configured. A real contact delivery must still be verified.")


if __name__ == "__main__":
    configure_smtp()
