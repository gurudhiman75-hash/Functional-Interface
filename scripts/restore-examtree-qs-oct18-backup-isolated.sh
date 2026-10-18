#!/usr/bin/env bash
# One-time, isolated, fail-closed restore of the verified 18 Oct encrypted GCS backup.
# NEVER connects to, modifies, or restores over production Neon main.
set -euo pipefail
set +x
umask 077

PROJECT=sarbedutech
TARGET_HOST=ep-dawn-scene-aty54zjw.c-9.us-east-1.aws.neon.tech
TARGET_DB=examtree_qs_backup_restore_20261018
ARCHIVE=examtree-neon-daily-20261018T130740Z-localhost.dump.gpg
URI="gs://sarbedutech/neon-backups/daily/$ARCHIVE"

[[ "$#" -eq 0 ]] || { echo "STOP: no arguments accepted; fixed isolated restore only" >&2; exit 2; }
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] ||
  { echo "STOP: active GCP project must be sarbedutech" >&2; exit 2; }
for command in gcloud python3 gpg sha256sum mktemp; do
  command -v "$command" >/dev/null || { echo "STOP: missing $command" >&2; exit 2; }
done
BIN_DIR="${EXAMTREE_PG_BIN_DIR:-/usr/lib/postgresql/17/bin}"
PSQL="$BIN_DIR/psql"
RESTORE="$BIN_DIR/pg_restore"
for command in "$PSQL" "$RESTORE"; do
  [[ -x "$command" ]] || { echo "STOP: PostgreSQL 17 client required" >&2; exit 2; }
  [[ "$("$command" --version)" == *"PostgreSQL) 17."* ]] ||
    { echo "STOP: PostgreSQL 17 required" >&2; exit 2; }
done
[[ -r /etc/ssl/certs/ca-certificates.crt ]] ||
  { echo "STOP: no verified TLS root bundle" >&2; exit 2; }

# The secret is read ONLY to reuse the source database role credentials on
# the isolated pre-protection child branch; the source host is NEVER connected to.
SOURCE_URL="$(gcloud secrets versions access latest --project="$PROJECT" --secret=examtree-api-database-url)"
EXPORTS="$(SOURCE_URL="$SOURCE_URL" python3 - <<'PY'
import os,shlex
from urllib.parse import urlsplit,unquote
u=urlsplit(os.environ['SOURCE_URL'])
allowed={
  'ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech',
  'ep-polished-king-atj47i5y-pooler.c-9.us-east-1.aws.neon.tech',
}
if u.scheme not in ('postgres','postgresql') or u.hostname not in allowed or u.path!='/neondb' or not u.username or not u.password:
  raise SystemExit('STOP: source secret does not identify canonical Neon main')
for k,v in {'PGUSER':unquote(u.username),'PGPASSWORD':unquote(u.password)}.items():
  print('export '+k+'='+shlex.quote(v))
PY
)"
unset SOURCE_URL
eval "$EXPORTS"
unset EXPORTS
export PGHOST="$TARGET_HOST" PGPORT=5432 PGDATABASE="$TARGET_DB"
export PGSSLMODE=verify-full PGSSLROOTCERT=/etc/ssl/certs/ca-certificates.crt
export PGCONNECT_TIMEOUT=15 PGAPPNAME=examtree-qs-oct18-restore-drill

cleanup(){
  status=$?
  unset PGPASSWORD KEY SOURCE_URL EXPORTS 2>/dev/null || true
  [[ -z "${WORKDIR:-}" ]] || rm -rf -- "$WORKDIR"
  if (( status != 0 )); then echo "STOP: restore drill failed safely. Do not retry on a nonempty database." >&2; fi
}
trap cleanup EXIT

# We accept only the exact, separately verified empty database on the exact
# temporary Neon branch endpoint; this is NOT the main Neon host or 'neondb'.
IDENTITY="$("$PSQL" -X -A -t -q -v ON_ERROR_STOP=1 -c   "SELECT current_database() || '|' || (SELECT count(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema'))")"
[[ "$IDENTITY" == "$TARGET_DB|0" ]] ||
  { echo "STOP: not the expected empty isolated restore database" >&2; exit 2; }
echo "PASS: isolated target pinned and empty ($TARGET_DB)."

WORKDIR="$(mktemp -d)"
gcloud storage cp --quiet "$URI" "$WORKDIR/$ARCHIVE"
gcloud storage cp --quiet "$URI.sha256" "$WORKDIR/$ARCHIVE.sha256"
(cd "$WORKDIR" && sha256sum --check --status "$ARCHIVE.sha256") ||
  { echo "STOP: backup checksum invalid" >&2; exit 2; }
echo "PASS: October 18 encrypted GCS archive checksum."

# Secret Manager passphrase never printed, saved to disk, or passed on argv.
KEY="$(gcloud secrets versions access latest --project="$PROJECT" --secret=examtree-neon-backup-passphrase)"
[[ "${#KEY}" -ge 32 ]] ||
  { echo "STOP: backup secret unavailable or invalid" >&2; exit 2; }
gpg --batch --yes --no-tty --pinentry-mode loopback --passphrase-fd 3   --decrypt "$WORKDIR/$ARCHIVE" 3<<<"$KEY" |
  "$RESTORE" --dbname="$TARGET_DB" --no-owner --no-acl     --single-transaction --exit-on-error
unset KEY

# Fixed target identity is checked again after restore.
RESULT="$("$PSQL" -X -A -t -q -v ON_ERROR_STOP=1 -c   "SELECT current_database() || '|' ||
    (SELECT count(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema')) || '|' ||
    (SELECT count(*) FROM content.generation_runs) || '|' ||
    (SELECT count(*) FROM platform.outbox_events)")"
echo "RESTORE_COUNTS: database|tables|generation_runs|outbox_events = $RESULT"
case "$RESULT" in
  "$TARGET_DB"\|[1-9]*\|*\|*) echo "PASS: full Oct 18 backup restored into isolated database; production main untouched." ;;
  *) echo "FAIL: restored table or key data verification failed" >&2; exit 1 ;;
esac
