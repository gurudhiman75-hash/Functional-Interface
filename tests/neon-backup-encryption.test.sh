#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf -- "$WORK"' EXIT
mkdir -p "$WORK/bin" "$WORK/backups"
printf 'example-testing-passphrase-2026-keep-offline\n' > "$WORK/test-key"
chmod 600 "$WORK/test-key"

# Mock only the Postgres I/O. GPG/SHA256 remain REAL binaries, so the
# end-to-end pipeline tests encryption, decryption and tamper detection.
cat > "$WORK/bin/pg_dump" <<'MOCK'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "--version" ]]; then
  echo "pg_dump (PostgreSQL) ${MOCK_PG_MAJOR:-17}.9"
  exit 0
fi
[[ "$PGHOST" == "test-neon.neon.tech" ]]
[[ "$PGDATABASE" == "demo" ]]
[[ "$PGPASSWORD" == "test-only" ]]
[[ "$PGSSLMODE" == "verify-full" ]]
[[ "${PGSSLROOTCERT:-}" == "system" || ( -s "$PGSSLROOTCERT" && -r "$PGSSLROOTCERT" ) ]]
printf 'PGDMP-FIXTURE-ONLY-DATA-NEVER-A-REAL-DATABASE'
# pg_restore --list consumes only a small catalogue portion of a real dump.
# Four MiB of decoded trailing bytes reproduces GPG EPIPE in a naive pipeline.
head -c 4194304 /dev/zero
MOCK
cat > "$WORK/bin/pg_restore" <<'MOCK'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "--version" ]]; then
  echo "pg_restore (PostgreSQL) ${MOCK_PG_MAJOR:-17}.9"
  exit 0
fi
[[ "$1" == "--list" ]]
# Deliberately read ONLY the catalogue prefix, like real pg_restore --list.
# If the caller does not drain the rest, GPG gets a broken pipe.
[[ "$(head -c 5)" == "PGDMP" ]]
MOCK
chmod 700 "$WORK/bin/pg_dump" "$WORK/bin/pg_restore"
export PATH="$WORK/bin:$PATH"
# Never touch a real client or a real database in this test.
export EXAMTREE_PG_BIN_DIR="$WORK/bin"
export EXAMTREE_BACKUP_KEY_FILE="$WORK/test-key"
export DATABASE_URL='postgresql://tester:test-only@test-neon.neon.tech/demo?sslmode=require'

# A PostgreSQL 16 client must be rejected BEFORE opening a network connection,
# writing an archive, or prompting for encryption credentials.
if MOCK_PG_MAJOR=16 bash "$ROOT/scripts/backup-examtree-neon.sh" "$WORK/backups" >"$WORK/old-client.log" 2>&1; then
  echo "FAIL: outdated PostgreSQL 16 client was accepted" >&2
  exit 1
fi
grep -q 'Unsupported PostgreSQL client version' "$WORK/old-client.log"
[[ -z "$(find "$WORK/backups" -maxdepth 1 -name '*.dump.gpg' -print -quit)" ]]

bash "$ROOT/scripts/backup-examtree-neon.sh" "$WORK/backups"
archive="$(find "$WORK/backups" -maxdepth 1 -name '*.dump.gpg' -type f | head -n 1)"
[[ -n "$archive" ]]
[[ -f "$archive.sha256" ]]
[[ "$(head -c 5 "$archive")" != "PGDMP" ]]
bash "$ROOT/scripts/verify-examtree-neon-backup.sh" "$archive"
# The standalone verifier must select a compatible PostgreSQL 17 client.
if MOCK_PG_MAJOR=16 bash "$ROOT/scripts/verify-examtree-neon-backup.sh" "$archive" >"$WORK/old-verifier.log" 2>&1; then
  echo "FAIL: PostgreSQL 16 archive verifier was accepted" >&2
  exit 1
fi
grep -q 'PostgreSQL 17+ pg_restore required' "$WORK/old-verifier.log"

# A changed encrypted archive must be rejected BEFORE any restore command.
printf 'garbage' >> "$archive"
if bash "$ROOT/scripts/verify-examtree-neon-backup.sh" "$archive" >/dev/null 2>&1; then
  echo "FAIL: checksum tampering was not caught" >&2
  exit 1
fi

# Never permit backups inside source-tree (accidental git commits).
if bash "$ROOT/scripts/backup-examtree-neon.sh" "$ROOT/.unsafe-backup" >/dev/null 2>&1; then
  echo "FAIL: repository output directory was not rejected" >&2
  exit 1
fi
echo "PASS: encrypted backup, catalogue, checksum tamper and repo path tests"
