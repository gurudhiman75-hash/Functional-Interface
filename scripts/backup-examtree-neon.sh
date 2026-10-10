#!/usr/bin/env bash
set -euo pipefail
umask 077

# Offline, encrypted backup. No uploads, paid resources, or plaintext .dump.
OUT_DIR="${1:-$HOME/examtree-private-backups}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$(realpath -m -- "$OUT_DIR")"
case "$OUT_DIR/" in
  "$REPO_ROOT/"*) echo "Refusing to store a database backup inside the repository" >&2; exit 2 ;;
esac

for command in python3 gpg sha256sum mktemp; do
  command -v "$command" >/dev/null 2>&1 || { echo "Missing command: $command" >&2; exit 2; }
done

# Neon currently runs PostgreSQL 17. Cloud Shell can have pg_dump 16 as
# its default even after postgresql-client-17 has been installed alongside it.
# Resolve both utilities from the same versioned installation and fail early.
PG_BIN_DIR="${EXAMTREE_PG_BIN_DIR:-}"
if [[ -z "$PG_BIN_DIR" ]]; then
  for candidate in /usr/lib/postgresql/17/bin /usr/local/pgsql/bin; do
    if [[ -x "$candidate/pg_dump" && -x "$candidate/pg_restore" ]]; then
      PG_BIN_DIR="$candidate"
      break
    fi
  done
fi
if [[ -n "$PG_BIN_DIR" ]]; then
  PG_DUMP="$PG_BIN_DIR/pg_dump"
  PG_RESTORE="$PG_BIN_DIR/pg_restore"
else
  PG_DUMP="$(command -v pg_dump || true)"
  PG_RESTORE="$(command -v pg_restore || true)"
fi
if [[ -z "$PG_DUMP" || -z "$PG_RESTORE" || ! -x "$PG_DUMP" || ! -x "$PG_RESTORE" ]]; then
  echo "PostgreSQL 17 client tools required: install postgresql-client-17." >&2
  exit 2
fi
DUMP_VERSION="$("$PG_DUMP" --version)"
RESTORE_VERSION="$("$PG_RESTORE" --version)"
DUMP_MAJOR="$(printf '%s\n' "$DUMP_VERSION" | awk '{ split($3, version, "."); print version[1] }')"
RESTORE_MAJOR="$(printf '%s\n' "$RESTORE_VERSION" | awk '{ split($3, version, "."); print version[1] }')"
if [[ ! "$DUMP_MAJOR" =~ ^[0-9]+$ || ! "$RESTORE_MAJOR" =~ ^[0-9]+$ ]] ||
   (( DUMP_MAJOR < 17 || RESTORE_MAJOR < 17 || DUMP_MAJOR != RESTORE_MAJOR )); then
  echo "Unsupported PostgreSQL client version: pg_dump=$DUMP_MAJOR pg_restore=$RESTORE_MAJOR; Neon server is PostgreSQL 17." >&2
  echo "Install postgresql-client-17, then use EXAMTREE_PG_BIN_DIR=/usr/lib/postgresql/17/bin if needed." >&2
  exit 2
fi
echo "PostgreSQL backup client: pg_dump $DUMP_MAJOR / pg_restore $RESTORE_MAJOR"
[[ -n "${DATABASE_URL:-}" ]] || { echo "DATABASE_URL must be provided securely in environment" >&2; exit 2; }

# Parse URL into libpq env values to keep password OFF process arguments.
# Only Neon hostnames over verified TLS are accepted; never print the URL.
PG_EXPORTS="$(python3 - <<'PY'
import os, shlex, sys
from urllib.parse import urlsplit, unquote
u = urlsplit(os.environ["DATABASE_URL"])
if u.scheme not in ("postgresql", "postgres") or not u.hostname or not u.hostname.endswith(".neon.tech"):
    sys.exit("Expected a Neon PostgreSQL database connection URL")
if not u.username or not u.password or not u.path or u.path == "/":
    sys.exit("Incomplete Neon connection URL")
fields = {
    "PGHOST": u.hostname,
    "PGPORT": str(u.port or 5432),
    "PGUSER": unquote(u.username),
    "PGPASSWORD": unquote(u.password),
    "PGDATABASE": unquote(u.path.lstrip("/")),
    "PGSSLMODE": "verify-full",
}
for key, value in fields.items():
    print("export " + key + "=" + shlex.quote(value))
PY
)"
eval "$PG_EXPORTS"
unset PG_EXPORTS DATABASE_URL

# PostgreSQL's verify-full TLS mode otherwise searches ~/.postgresql/root.crt,
# which is not normally present in Google Cloud Shell. Prefer the system trust
# bundle explicitly while retaining CA and hostname verification.
# Honour an operator-supplied PGSSLROOTCERT, but fail closed if it is missing.
if [[ -z "${PGSSLROOTCERT:-}" ]]; then
  for bundle in \
    /etc/ssl/certs/ca-certificates.crt \
    /etc/pki/tls/certs/ca-bundle.crt \
    /etc/ssl/cert.pem; do
    if [[ -s "$bundle" && -r "$bundle" ]]; then
      export PGSSLROOTCERT="$bundle"
      break
    fi
  done
fi
if [[ -z "${PGSSLROOTCERT:-}" ]]; then
  echo "No trusted system root CA bundle found. Set PGSSLROOTCERT to a readable trusted CA bundle; TLS verification remains required." >&2
  exit 2
fi
if [[ "$PGSSLROOTCERT" != "system" && ! -s "$PGSSLROOTCERT" ]]; then
  echo "PGSSLROOTCERT does not point to a non-empty trusted CA bundle; refusing unverified TLS." >&2
  exit 2
fi
echo "PostgreSQL TLS: verify-full with a configured trusted root certificate."

# Passphrase is off argv. For noninteractive jobs a chmod-600 private key
# file can be provided; never put that key in this repository or backup dir.
GPG_ARGS=(--batch --yes --no-tty --pinentry-mode loopback --cipher-algo AES256)
USE_KEY_FILE=false
if [[ -n "${EXAMTREE_BACKUP_KEY_FILE:-}" ]]; then
  [[ -f "$EXAMTREE_BACKUP_KEY_FILE" ]] || { echo "Encryption key file not found" >&2; exit 2; }
  permissions="$(stat -c %a "$EXAMTREE_BACKUP_KEY_FILE")"
  [[ "$permissions" == "600" || "$permissions" == "400" ]] || { echo "Encryption key file must be mode 600 or 400" >&2; exit 2; }
  [[ "$(wc -c < "$EXAMTREE_BACKUP_KEY_FILE")" -ge 24 ]] || { echo "Encryption key file is too short" >&2; exit 2; }
  GPG_ARGS+=(--passphrase-file "$EXAMTREE_BACKUP_KEY_FILE")
  USE_KEY_FILE=true
else
  [[ -r /dev/tty ]] || { echo "Interactive terminal or EXAMTREE_BACKUP_KEY_FILE is required" >&2; exit 2; }
  read -r -s -p "New backup passphrase (24+ characters): " BACKUP_PASSPHRASE </dev/tty
  printf '\n' >/dev/tty
  read -r -s -p "Repeat passphrase: " BACKUP_PASSPHRASE_CONFIRM </dev/tty
  printf '\n' >/dev/tty
  [[ "$BACKUP_PASSPHRASE" == "$BACKUP_PASSPHRASE_CONFIRM" ]] || { echo "Passphrases differ" >&2; exit 2; }
  [[ "${#BACKUP_PASSPHRASE}" -ge 24 ]] || { echo "Passphrase is too short" >&2; exit 2; }
  unset BACKUP_PASSPHRASE_CONFIRM
  GPG_ARGS+=(--passphrase-fd 3)
fi

mkdir -p -- "$OUT_DIR"
chmod 700 -- "$OUT_DIR"
base="examtree-neon-$(date -u +%Y%m%dT%H%M%SZ)-$$.dump.gpg"
tmp="$(mktemp "$OUT_DIR/.${base}.XXXXXX")"
final="$OUT_DIR/$base"
trap 'rm -f -- "$tmp"; unset PGPASSWORD BACKUP_PASSPHRASE 2>/dev/null || true' EXIT

echo "Creating encrypted PostgreSQL archive; no plaintext dump is written."
if [[ "$USE_KEY_FILE" == true ]]; then
  "$PG_DUMP" --format=custom --compress=6 --no-owner --no-acl --lock-wait-timeout=5s \
    --dbname="$PGDATABASE" | gpg "${GPG_ARGS[@]}" --symmetric --output "$tmp"
  gpg "${GPG_ARGS[@]}" --decrypt "$tmp" | "$PG_RESTORE" --list >/dev/null
else
  "$PG_DUMP" --format=custom --compress=6 --no-owner --no-acl --lock-wait-timeout=5s \
    --dbname="$PGDATABASE" | gpg "${GPG_ARGS[@]}" --symmetric --output "$tmp" 3<<<"$BACKUP_PASSPHRASE"
  gpg "${GPG_ARGS[@]}" --decrypt "$tmp" 3<<<"$BACKUP_PASSPHRASE" | "$PG_RESTORE" --list >/dev/null
fi
test -s "$tmp"
mv -- "$tmp" "$final"
(cd "$OUT_DIR" && sha256sum "$base" > "$base.sha256")
echo "PASS: encrypted archive created and pg_restore catalogue verified."
echo "Backup: $final"
echo "SHA256 manifest: $final.sha256"
echo "IMPORTANT: copy .gpg and .sha256 to a private location OUTSIDE Neon and Cloud Shell."
echo "Keep the passphrase separately. No full database restore was performed."
