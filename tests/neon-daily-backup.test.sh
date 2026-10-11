#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$WORK/bin" "$WORK/gcs"

cat > "$WORK/bin/pg_dump" <<'MOCK'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "--version" ]]; then echo 'pg_dump (PostgreSQL) 17.7'; exit; fi
[[ "$PGHOST" == 'ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech' ]]
[[ "$PGSSLMODE" == 'verify-full' ]]
[[ "$PGDATABASE" == 'neondb' ]]
[[ "$PGPASSWORD" == 'example-mock-only' ]]
printf 'PGDMP-MOCK-DATA-'
head -c 1048576 /dev/zero
MOCK
cat > "$WORK/bin/pg_restore" <<'MOCK'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "--version" ]]; then echo 'pg_restore (PostgreSQL) 17.7'; exit; fi
[[ "${1:-}" == '--list' ]]
[[ "$(head -c 5)" == 'PGDMP' ]]
# Early exit like real pg_restore --list; caller must drain GPG output.
MOCK
cat > "$WORK/bin/curl" <<'MOCK'
#!/usr/bin/env bash
set -euo pipefail
args=("$@")
url="${args[${#args[@]}-1]}"
if [[ "$url" == http://metadata.google.internal/* ]]; then
  printf '{"access_token":"MOCK_TEST_TOKEN"}'
  exit 0
fi
[[ "$url" == https://storage.googleapis.com/* ]] || exit 22
file=''
for ((i=0;i<${#args[@]};i++)); do
  if [[ "${args[i]}" == '--upload-file' ]]; then file="${args[i+1]}"; fi
done
object="$(python3 - "$url" <<'PY'
import sys
from urllib.parse import urlsplit, parse_qs, unquote
u=urlsplit(sys.argv[1]); parts=u.path
if parts.startswith('/upload/'):
    assert parse_qs(u.query).get('ifGenerationMatch')==['0']
    print(parse_qs(u.query)['name'][0])
else:
    print(unquote(parts.split('/o/', 1)[1]))
PY
)"
[[ "$object" == neon-backups/daily/* ]] || exit 22
localpath="$FAKE_GCS_ROOT/$object"
if [[ -n "$file" ]]; then
  [[ "${FAKE_FAIL_UPLOAD:-0}" == 0 ]] || exit 22
  [[ ! -e "$localpath" ]] || exit 22
  mkdir -p "$(dirname "$localpath")"
  cp "$file" "$localpath"
else
  [[ -f "$localpath" ]] || exit 22
  if [[ "${FAKE_TAMPER_DOWNLOAD:-0}" == 1 && "$localpath" == *.dump.gpg ]]; then
    printf 'tampered instead of real archive'
  else
    cat "$localpath"
  fi
fi
MOCK
chmod +x "$WORK/bin/pg_dump" "$WORK/bin/pg_restore" "$WORK/bin/curl"
export PATH="$WORK/bin:$PATH" FAKE_GCS_ROOT="$WORK/gcs"
export DATABASE_URL='postgresql://mock:example-mock-only@ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require'
export BACKUP_BUCKET=sarbedutech BACKUP_PREFIX=neon-backups/daily
export BACKUP_PASSPHRASE='offline-real-32-plus-character-test-only-backup-secret'

bash "$ROOT/ops/neon-daily-backup/backup.sh" >"$WORK/success.log" 2>&1
[[ "$(find "$WORK/gcs" -type f | wc -l)" -eq 2 ]]
grep -q 'PASS: private GCS copy verified' "$WORK/success.log"
! grep -q "$BACKUP_PASSPHRASE" "$WORK/success.log"
! grep -q 'example-mock-only' "$WORK/success.log"

if DATABASE_URL='postgresql://mock:example-mock-only@ep-test.c-9.us-east-1.aws.neon.tech/neondb' \
  bash "$ROOT/ops/neon-daily-backup/backup.sh" >"$WORK/unsafe-host.log" 2>&1; then
  echo 'FAIL: wrong source host accepted' >&2; exit 1
fi
grep -q 'Refusing noncanonical' "$WORK/unsafe-host.log"

if BACKUP_BUCKET='sarbedutech.firebasestorage.app' \
  bash "$ROOT/ops/neon-daily-backup/backup.sh" >"$WORK/unsafe-bucket.log" 2>&1; then
  echo 'FAIL: image bucket accepted' >&2; exit 1
fi
if FAKE_FAIL_UPLOAD=1 \
  bash "$ROOT/ops/neon-daily-backup/backup.sh" >"$WORK/upload-failure.log" 2>&1; then
  echo 'FAIL: upload failure reported success' >&2; exit 1
fi
! grep -q 'PASS: private GCS copy verified' "$WORK/upload-failure.log"

if FAKE_TAMPER_DOWNLOAD=1 \
  bash "$ROOT/ops/neon-daily-backup/backup.sh" >"$WORK/download-tamper.log" 2>&1; then
  echo 'FAIL: corrupt remote copy reported success' >&2; exit 1
fi
grep -q 'GCS encrypted object SHA256 mismatch' "$WORK/download-tamper.log"
echo 'PASS: daily GPG backup, GCS readback, source guard and failure tests'
