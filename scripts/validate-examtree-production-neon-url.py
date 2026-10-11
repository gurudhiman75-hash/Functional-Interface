#!/usr/bin/env python3
"""Stdin-only, non-logging guard for the exact PRODUCTION Neon MAIN URL.

Protects against accidentally binding Cloud Run production to the isolated
staging branch or an unrelated database. No credentials are printed; this
script never connects to Neon or modifies resources.
"""
import sys
from urllib.parse import parse_qs, urlsplit

PRODUCTION_HOST = "ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech"
STAGING_HOST = "ep-wild-water-atrzmssw.c-9.us-east-1.aws.neon.tech"


def validate(value):
    value = value.strip()
    if not value or any(char.isspace() for char in value):
        return False, "missing or malformed raw connection URL"
    try:
        url = urlsplit(value)
        port = url.port
    except ValueError:
        return False, "malformed PostgreSQL URL"
    if url.scheme not in ("postgres", "postgresql"):
        return False, "PostgreSQL URI required"
    if url.hostname != PRODUCTION_HOST:
        return False, "NOT PRODUCTION MAIN; staging/pooler/unknown host refused"
    if url.path != "/neondb" or port not in (None, 5432):
        return False, "wrong database name or PostgreSQL port"
    if not url.username or not url.password or url.fragment:
        return False, "missing role/password or invalid fragment"
    if parse_qs(url.query).get("sslmode") not in (["require"], ["verify-full"]):
        return False, "TLS sslmode=require or verify-full required"
    return True, "production Neon MAIN connection selected"


if __name__ == "__main__":
    ok, message = validate(sys.stdin.read())
    print(("PASS: " if ok else "FAIL: ") + message, file=sys.stdout if ok else sys.stderr)
    raise SystemExit(0 if ok else 1)
