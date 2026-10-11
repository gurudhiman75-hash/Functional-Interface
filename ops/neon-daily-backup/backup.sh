#!/usr/bin/env bash
set -euo pipefail
umask 077

cleanup() {
  status=$?
  if (( status != 0 )); then
    echo "EXAMTREE_NEON_DAILY_BACKUP_FAILED exit=$status" >&2
  fi
  if [[ -n "${workdir:-}" ]]; then rm -rf -- "$workdir"; fi
  unset PGPASSWORD BACKUP_PASSPHRASE ACCESS_TOKEN DATABASE_URL 2>/dev/null || true
}
trap cleanup EXIT

# Cloud Run Job: encrypt Neon PG17 backup, verify its entire archive, then
# upload and independently check the encrypted copy in a private GCS bucket.
# No plaintext dump file, user/customer details, tokens or keys in logs.
: "${DATABASE_URL:?Cloud Run Secret Manager injection required for DATABASE_URL}"
: "${BACKUP_PASSPHRASE:?Cloud Run Secret Manager injection required for BACKUP_PASSPHRASE}"
[[ "${#BACKUP_PASSPHRASE}" -ge 32 ]] || { echo "Backup passphrase shorter than 32 characters" >&2; exit 2; }
[[ "${BACKUP_BUCKET:-}" == sarbedutech ]] || { echo "Backup bucket must be sarbedutech" >&2; exit 2; }
[[ "${BACKUP_PREFIX:-}" == neon-backups/daily ]] || { echo "Backup prefix must be neon-backups/daily" >&2; exit 2; }

for cmd in python3 gpg pg_dump pg_restore sha256sum mktemp curl; do
  command -v "$cmd" >/dev/null || { echo "Missing tool: $cmd" >&2; exit 2; }
done
for tool in pg_dump pg_restore; do
  version="$($tool --version)"
  [[ "$version" =~ ^[a-z_]+\ \(PostgreSQL\)\ 17\. ]] || { echo "PostgreSQL 17 tool required: $tool" >&2; exit 2; }
done

# Only the canonical production DB is allowed; staging and restore branches
# are rejected. Enforce real hostname and CA-verified TLS, not URL sslmode.
exports="$(python3 - <<'PY'
import os, shlex, sys
from urllib.parse import unquote, urlsplit
u = urlsplit(os.environ['DATABASE_URL'])
allowed = {
  'ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech',
  'ep-polished-king-atj47i5y-pooler.c-9.us-east-1.aws.neon.tech',
}
if u.scheme not in ('postgres', 'postgresql') or u.hostname not in allowed or u.path != '/neondb':
    sys.exit('Refusing noncanonical Examtree Neon database endpoint')
if not u.username or not u.password or u.port not in (None, 5432):
    sys.exit('Invalid source connection details')
for key, value in {
    'PGHOST': u.hostname, 'PGPORT': '5432', 'PGUSER': unquote(u.username),
    'PGPASSWORD': unquote(u.password), 'PGDATABASE': 'neondb',
    'PGSSLMODE': 'verify-full', 'PGSSLROOTCERT': '/etc/ssl/certs/ca-certificates.crt',
    'PGCONNECT_TIMEOUT': '20', 'PGAPPNAME': 'examtree-daily-neon-backup',
}.items():
    print('export ' + key + '=' + shlex.quote(value))
PY
)"
eval "$exports"
unset exports DATABASE_URL
[[ -s "$PGSSLROOTCERT" ]] || { echo "Trusted CA bundle unavailable" >&2; exit 2; }

workdir="$(mktemp -d)"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
name="examtree-neon-daily-${stamp}-${HOSTNAME:-job}.dump.gpg"
name="${name//[^a-zA-Z0-9_.-]/_}"
archive="$workdir/$name"
manifest="$archive.sha256"

pg_dump --format=custom --compress=6 --no-owner --no-acl \
  --lock-wait-timeout=5s --dbname=neondb |
  gpg --batch --yes --no-tty --pinentry-mode loopback \
    --cipher-algo AES256 --passphrase-fd 3 --symmetric --output "$archive" \
    3<<<"$BACKUP_PASSPHRASE"
[[ -s "$archive" ]] || { echo "Encrypted backup is empty" >&2; exit 1; }

# pg_restore --list exits after catalogue; drain remaining bytes to avoid EPIPE.
gpg --batch --yes --no-tty --pinentry-mode loopback \
  --passphrase-fd 3 --decrypt "$archive" 3<<<"$BACKUP_PASSPHRASE" |
  { pg_restore --list >/dev/null; cat >/dev/null; }
(cd "$workdir" && sha256sum "$name" > "$name.sha256")
local_digest="$(sha256sum "$archive" | awk '{print $1}')"
local_size="$(stat -c %s "$archive")"
echo "PASS: encrypted dump and full decryption/catalogue verification ($local_size bytes)."

# Cloud Run metadata token is obtained as the dedicated job service account.
# Keep it out of process argv via a private temporary HTTP header file.
ACCESS_TOKEN="$(curl --silent --show-error --fail --noproxy '*' \
  --header 'Metadata-Flavor: Google' \
  'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token' |
  python3 -c 'import json,sys;print(json.load(sys.stdin)["access_token"])')"
[[ -n "$ACCESS_TOKEN" ]] || { echo "No Cloud Run service identity token" >&2; exit 1; }
header_file="$workdir/auth.headers"
printf 'Authorization: Bearer %s\n' "$ACCESS_TOKEN" > "$header_file"
unset ACCESS_TOKEN

make_url() {
  python3 - "$1" "$2" <<'PY'
import sys
from urllib.parse import quote
name='neon-backups/daily/' + sys.argv[2]
bucket='sarbedutech'
if sys.argv[1] == 'upload':
    print('https://storage.googleapis.com/upload/storage/v1/b/'+bucket+'/o?uploadType=media&name='+quote(name,safe='')+'&ifGenerationMatch=0')
else:
    print('https://storage.googleapis.com/storage/v1/b/'+bucket+'/o/'+quote(name,safe='')+'?alt=media')
PY
}
upload() {
  local source="$1" object="$2" url
  url="$(make_url upload "$object")"
  curl --silent --show-error --fail --retry 2 --retry-all-errors \
    --max-time 900 --request POST --upload-file "$source" \
    --header "@$header_file" --header 'Content-Type: application/octet-stream' \
    --output /dev/null "$url"
}
upload "$archive" "$name"
upload "$manifest" "$name.sha256"

# Verify the actual encrypted objects downloaded from GCS after upload.
remote_digest="$(curl --silent --show-error --fail --retry 2 --retry-all-errors \
  --max-time 900 --header "@$header_file" "$(make_url download "$name")" |
  sha256sum | awk '{print $1}')"
[[ "$remote_digest" == "$local_digest" ]] || { echo "GCS encrypted object SHA256 mismatch" >&2; exit 1; }
remote_manifest_digest="$(curl --silent --show-error --fail --retry 2 --retry-all-errors \
  --max-time 90 --header "@$header_file" "$(make_url download "$name.sha256")" |
  sha256sum | awk '{print $1}')"
[[ "$remote_manifest_digest" == "$(sha256sum "$manifest" | awk '{print $1}')" ]] ||
  { echo "GCS checksum manifest mismatch" >&2; exit 1; }

echo "PASS: private GCS copy verified: gs://sarbedutech/neon-backups/daily/$name"
echo "Backup job completed successfully. Keep GPG recovery passphrase offsite."
