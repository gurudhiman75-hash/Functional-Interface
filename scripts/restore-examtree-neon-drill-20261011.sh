#!/usr/bin/env bash
set -euo pipefail
umask 077

# One-time Examtree backup restore drill (11 Oct 2026), NOT a production restore.
# Never accepts a caller-supplied destination: only the vetted isolated Neon
# endpoint and the empty test database created for this particular drill.
TARGET_HOST="ep-green-king-atrz5vrx.c-9.us-east-1.aws.neon.tech"
TARGET_DB="examtree_backup_restore_20261011"
SOURCE_HOST="ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech"
SOURCE_POOL_HOST="ep-polished-king-atj47i5y-pooler.c-9.us-east-1.aws.neon.tech"

[[ "$#" -eq 1 ]] || { echo "Usage: bash $0 /path/to/backup.dump.gpg" >&2; exit 2; }
ARCHIVE="$(realpath -- "$1")"
[[ -f "$ARCHIVE" && "$ARCHIVE" == *.dump.gpg ]] ||
  { echo "Expected an existing encrypted .dump.gpg archive" >&2; exit 2; }
DIR="$(dirname "$ARCHIVE")"
BASE="$(basename "$ARCHIVE")"
[[ -f "$ARCHIVE.sha256" ]] || { echo "Missing backup checksum file" >&2; exit 2; }
(cd "$DIR" && sha256sum --check --status "$BASE.sha256") ||
  { echo "Backup SHA256 verification failed; refusing restore" >&2; exit 1; }
echo "PASS: encrypted backup SHA256 matches its manifest."

[[ -n "$DATABASE_URL" ]] ||
  { echo "Provide source Neon URL via DATABASE_URL environment variable" >&2; exit 2; }
PG_BIN_DIR="/usr/lib/postgresql/17/bin"
if [[ -v EXAMTREE_PG_BIN_DIR && -n "$EXAMTREE_PG_BIN_DIR" ]]; then
  PG_BIN_DIR="$EXAMTREE_PG_BIN_DIR"
fi
PG_PSQL="$PG_BIN_DIR/psql"
PG_RESTORE="$PG_BIN_DIR/pg_restore"
[[ -x "$PG_PSQL" && -x "$PG_RESTORE" ]] ||
  { echo "PostgreSQL 17 psql and pg_restore are required" >&2; exit 2; }
for app in "$PG_PSQL" "$PG_RESTORE"; do
  version="$("$app" --version)"
  major="$(printf '%s\n' "$version" | awk '{split($3, v, "."); print v[1]}')"
  if [[ ! "$major" =~ ^[0-9]+$ ]] || (( major != 17 )); then
    echo "This restore drill requires PostgreSQL 17: $version" >&2
    exit 2
  fi
done

# ONLY reuse auth credentials from the already-established canonical source.
# Never use its host/database as the destination. Keep passwords out of argv.
SOURCE_EXPORTS="$(python3 - "$SOURCE_HOST" "$SOURCE_POOL_HOST" <<'PY'
import os, shlex, sys
from urllib.parse import urlsplit, unquote
url = urlsplit(os.environ["DATABASE_URL"])
if url.scheme not in ("postgres", "postgresql"):
    sys.exit("Invalid PostgreSQL source URL")
if url.hostname not in (sys.argv[1], sys.argv[2]):
    sys.exit("Source URL is not the expected Examtree main Neon endpoint; refusing restore")
if not url.username or not url.password:
    sys.exit("Source URL is missing credentials")
for key, value in {
    "PGUSER": unquote(url.username),
    "PGPASSWORD": unquote(url.password),
    "PGPORT": "5432",
}.items():
    print("export " + key + "=" + shlex.quote(value))
PY
)"
eval "$SOURCE_EXPORTS"
unset DATABASE_URL SOURCE_EXPORTS
trap 'unset PGPASSWORD PASSPHRASE 2>/dev/null || true' EXIT

export PGHOST="$TARGET_HOST"
export PGDATABASE="$TARGET_DB"
export PGSSLMODE=verify-full
export PGAPPNAME=examtree-backup-restore-drill
export PGCONNECT_TIMEOUT=15
if [[ ! -v PGSSLROOTCERT || -z "$PGSSLROOTCERT" ]]; then
  export PGSSLROOTCERT=/etc/ssl/certs/ca-certificates.crt
fi
[[ "$PGSSLROOTCERT" == system || ( -s "$PGSSLROOTCERT" && -r "$PGSSLROOTCERT" ) ]] ||
  { echo "A trusted TLS CA root is required; refusing restore" >&2; exit 2; }

# Fail closed if there are any existing user tables or the database name differs.
# The destination is hardcoded; this script never runs DROP/CLEAN/CREATE DATABASE.
identity="$("$PG_PSQL" -X -v ON_ERROR_STOP=1 -A -t -q -c \
  "SELECT current_database() || '|' || (SELECT count(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema'))")"
if [[ "$identity" != "$TARGET_DB|0" ]]; then
  echo "STOP: restore target is not the expected EMPTY test database (got $identity)" >&2
  exit 1
fi
echo "PASS: connected using verified TLS to isolated, empty restore database."
echo "Restore destination: $TARGET_DB on $TARGET_HOST"

# No plaintext dump file. Single transaction with error-stop avoids a partial
# restore. The GPG passphrase is never passed on the process command line.
if [[ -v EXAMTREE_BACKUP_KEY_FILE && -n "$EXAMTREE_BACKUP_KEY_FILE" ]]; then
  [[ -f "$EXAMTREE_BACKUP_KEY_FILE" ]] || { echo "Key file not found" >&2; exit 2; }
  permissions="$(stat -c %a "$EXAMTREE_BACKUP_KEY_FILE")"
  [[ "$permissions" == 600 || "$permissions" == 400 ]] ||
    { echo "Key file requires mode 600 or 400" >&2; exit 2; }
  gpg --batch --yes --no-tty --pinentry-mode loopback \
    --passphrase-file "$EXAMTREE_BACKUP_KEY_FILE" --decrypt "$ARCHIVE" |
    "$PG_RESTORE" --dbname="$TARGET_DB" --no-owner --no-acl \
      --exit-on-error --single-transaction
else
  [[ -r /dev/tty ]] || { echo "Interactive terminal required" >&2; exit 2; }
  read -r -s -p "Backup encryption passphrase: " PASSPHRASE </dev/tty
  printf '\n' >/dev/tty
  gpg --batch --yes --no-tty --pinentry-mode loopback \
    --passphrase-fd 3 --decrypt "$ARCHIVE" 3<<<"$PASSPHRASE" |
    "$PG_RESTORE" --dbname="$TARGET_DB" --no-owner --no-acl \
      --exit-on-error --single-transaction
  unset PASSPHRASE
fi

table_count="$("$PG_PSQL" -X -v ON_ERROR_STOP=1 -A -t -q -c \
  "SELECT count(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema')")"
[[ "$table_count" =~ ^[0-9]+$ && "$table_count" -gt 0 ]] ||
  { echo "Restore did not produce user tables" >&2; exit 1; }
echo "PASS: isolated restore completed; user tables: $table_count"
echo "No application has been connected to the restore database."
echo "Keep the temporary Neon compute running only until independent checks finish."
