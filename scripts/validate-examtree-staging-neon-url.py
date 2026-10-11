#!/usr/bin/env python3
"""Validate an ExamTree Cloud Run STAGING Neon URL supplied only via stdin.

Never prints the original connection string, username, password, or arbitrary
URL parts. Output is a safe reason code identifying which Neon Console choice
to correct. Does not connect to the database or mutate Google Cloud.
"""
import sys
from urllib.parse import parse_qs, urlsplit

STAGING_HOST = "ep-wild-water-atrzmssw.c-9.us-east-1.aws.neon.tech"
STAGING_POOLER_HOST = "ep-wild-water-atrzmssw-pooler.c-9.us-east-1.aws.neon.tech"
PRODUCTION_HOST = "ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech"
PRODUCTION_POOLER_HOST = "ep-polished-king-atj47i5y-pooler.c-9.us-east-1.aws.neon.tech"


def check_connection_string(raw: str) -> tuple[bool, str]:
    value = raw.strip()
    if not value:
        return False, "EMPTY_INPUT: copy the Neon connection string"
    if value.startswith(("psql ", "PGPASSWORD=", "DATABASE_URL=")) or value[0] in ("'", '"', "`"):
        return False, "FULL_COMMAND_OR_QUOTES: paste only the raw postgresql:// URI, not the psql command or surrounding quotes"
    if any(c.isspace() for c in value):
        return False, "WHITESPACE: paste only the raw connection URI (encode password special characters)"
    try:
        url = urlsplit(value)
        host = url.hostname
        port = url.port
    except ValueError:
        return False, "INVALID_URL: paste a raw postgresql:// connection URI"
    if url.scheme not in ("postgres", "postgresql"):
        return False, "FORMAT: select connection string (URI), not a psql command"
    if host in (PRODUCTION_HOST, PRODUCTION_POOLER_HOST):
        return False, "PRODUCTION_BLOCKED: choose examtree-cloudrun-api-staging-20261010, NOT main"
    if host == STAGING_POOLER_HOST:
        return False, "POOLER_HOST: disable Connection pooling in the Neon connection dialog and recopy"
    if host != STAGING_HOST:
        return False, "WRONG_ENDPOINT: choose staging branch examtree-cloudrun-api-staging-20261010 and its direct connection"
    if url.path != "/neondb":
        return False, "DATABASE_NAME: select neondb in the Neon connection dialog"
    if not url.username or not url.password:
        return False, "MISSING_CREDENTIALS: copy the authenticated connection URI containing a role and password"
    if port not in (None, 5432):
        return False, "PORT: only the Neon PostgreSQL default port 5432 is allowed"
    if url.fragment:
        return False, "FRAGMENT: paste the connection URI without a fragment"
    params = parse_qs(url.query, keep_blank_values=True)
    if params.get("sslmode") not in (["require"], ["verify-full"]):
        return False, "TLS: choose the connection URI with sslmode=require (or verify-full)"
    return True, "isolated Neon staging branch, direct host, neondb and TLS verified"


def main() -> int:
    if len(sys.argv) != 1:
        print("FAIL: usage: echo-hidden-URL | python3 scripts/validate-examtree-staging-neon-url.py", file=sys.stderr)
        return 2
    ok, reason = check_connection_string(sys.stdin.read())
    print(("PASS: " if ok else "FAIL: ") + reason, file=(sys.stdout if ok else sys.stderr))
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
