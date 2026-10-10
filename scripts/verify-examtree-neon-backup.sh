#!/usr/bin/env bash
set -euo pipefail
umask 077
[[ "$#" -eq 1 ]] || { echo "Usage: bash scripts/verify-examtree-neon-backup.sh /absolute/path/backup.dump.gpg" >&2; exit 2; }
for binary in gpg pg_restore sha256sum realpath; do
  command -v "$binary" >/dev/null 2>&1 || { echo "Missing command: $binary" >&2; exit 2; }
done
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
  gpg "${GPG_ARGS[@]}" --decrypt "$ARCHIVE" | pg_restore --list >/dev/null
else
  [[ -r /dev/tty ]] || { echo "Interactive terminal or EXAMTREE_BACKUP_KEY_FILE is required" >&2; exit 2; }
  read -r -s -p "Backup passphrase: " BACKUP_PASSPHRASE </dev/tty
  printf '\n' >/dev/tty
  GPG_ARGS+=(--passphrase-fd 3)
  gpg "${GPG_ARGS[@]}" --decrypt "$ARCHIVE" 3<<<"$BACKUP_PASSPHRASE" | pg_restore --list >/dev/null
  unset BACKUP_PASSPHRASE
fi
echo "PASS: SHA256, decryption, and PostgreSQL archive catalogue verified."
echo "No database restore was performed; test restoring onto an isolated branch before production."
