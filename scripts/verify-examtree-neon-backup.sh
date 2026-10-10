#!/usr/bin/env bash
set -euo pipefail
umask 077
[[ "$#" -eq 1 ]] || { echo "Usage: bash scripts/verify-examtree-neon-backup.sh /absolute/path/backup.dump.gpg" >&2; exit 2; }
for binary in gpg sha256sum realpath; do
  command -v "$binary" >/dev/null 2>&1 || { echo "Missing command: $binary" >&2; exit 2; }
done
# Cloud Shell may default to pg_restore 16 even when client 17 is installed.
# Use a versioned executable like the backup script itself.
PG_BIN_DIR="${EXAMTREE_PG_BIN_DIR:-}"
if [[ -z "$PG_BIN_DIR" ]]; then
  for candidate in /usr/lib/postgresql/17/bin /usr/local/pgsql/bin; do
    if [[ -x "$candidate/pg_restore" ]]; then PG_BIN_DIR="$candidate"; break; fi
  done
fi
if [[ -n "$PG_BIN_DIR" ]]; then
  PG_RESTORE="$PG_BIN_DIR/pg_restore"
else
  PG_RESTORE="$(command -v pg_restore || true)"
fi
if [[ -z "$PG_RESTORE" || ! -x "$PG_RESTORE" ]]; then
  echo "PostgreSQL 17 pg_restore required to verify Neon backups." >&2
  exit 2
fi
RESTORE_VERSION="$("$PG_RESTORE" --version)"
RESTORE_MAJOR="$(printf '%s\n' "$RESTORE_VERSION" | awk '{ split($3, version, "."); print version[1] }')"
if [[ ! "$RESTORE_MAJOR" =~ ^[0-9]+$ ]] || (( RESTORE_MAJOR < 17 )); then
  echo "PostgreSQL 17+ pg_restore required to verify Neon backups; detected: $RESTORE_VERSION" >&2
  exit 2
fi
ARCHIVE="$(realpath -- "$1")"
[[ -f "$ARCHIVE" && "$ARCHIVE" == *.dump.gpg ]] || { echo "Expected an encrypted .dump.gpg archive" >&2; exit 2; }
DIR="$(dirname "$ARCHIVE")"
BASE="$(basename "$ARCHIVE")"
[[ -f "$ARCHIVE.sha256" ]] || { echo "Missing checksum manifest" >&2; exit 2; }
(cd "$DIR" && sha256sum --check --status "$BASE.sha256") || { echo "Encrypted archive SHA256 mismatch" >&2; exit 1; }

GPG_ARGS=(--batch --yes --no-tty --pinentry-mode loopback)
if [[ -n "${EXAMTREE_BACKUP_KEY_FILE:-}" ]]; then
  [[ -f "$EXAMTREE_BACKUP_KEY_FILE" ]] || { echo "Key file missing" >&2; exit 2; }
  GPG_ARGS+=(--passphrase-file "$EXAMTREE_BACKUP_KEY_FILE")
  gpg "${GPG_ARGS[@]}" --decrypt "$ARCHIVE" | { "$PG_RESTORE" --list >/dev/null; cat >/dev/null; }
else
  [[ -r /dev/tty ]] || { echo "Interactive terminal or EXAMTREE_BACKUP_KEY_FILE is required" >&2; exit 2; }
  read -r -s -p "Backup passphrase: " BACKUP_PASSPHRASE </dev/tty
  printf '\n' >/dev/tty
  GPG_ARGS+=(--passphrase-fd 3)
  gpg "${GPG_ARGS[@]}" --decrypt "$ARCHIVE" 3<<<"$BACKUP_PASSPHRASE" | { "$PG_RESTORE" --list >/dev/null; cat >/dev/null; }
  unset BACKUP_PASSPHRASE
fi
echo "PASS: SHA256, full GPG decryption, and PostgreSQL archive catalogue verified."
echo "No database restore was performed; test restoring onto an isolated branch before production."
