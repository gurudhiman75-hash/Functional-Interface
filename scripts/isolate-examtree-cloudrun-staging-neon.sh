#!/usr/bin/env bash
# Isolate ONLY the existing Cloud Run API staging service & its inert background Job
# from production Neon. No production cutover, migrations, generation or job execution.
set -euo pipefail
set +x

PROJECT=sarbedutech
REGION=asia-south1
API=examtree-api-staging
JOB=examtree-api-background-staging
SECRET=examtree-api-staging-database-url
EXPECTED_STAGING_HOST=ep-wild-water-atrzmssw.c-9.us-east-1.aws.neon.tech
EXPECTED_MAIN_HOST=ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech
SA=examtree-api-runtime@sarbedutech.iam.gserviceaccount.com

if [[ "${EXAMTREE_STAGING_DB_SWITCH_APPROVED:-}" != "yes" ]]; then
  echo "FAIL: set EXAMTREE_STAGING_DB_SWITCH_APPROVED=yes to authorize a staging-only DB secret/revision update." >&2
  exit 2
fi
if [[ "$(gcloud config get-value project 2>/dev/null)" != "$PROJECT" ]]; then
  echo "FAIL: select GCP project sarbedutech first." >&2
  exit 2
fi
if ! gcloud run services describe "$API" --region="$REGION" --project="$PROJECT" --format=json |
    python3 -c '
import sys,json
s=json.load(sys.stdin)
e={x.get("name"):x.get("value") for c in (((s.get("spec") or {}).get("template") or {}).get("spec") or {}).get("containers",[]) for x in c.get("env",[])}
assert e.get("EXAMTREE_API_RUNTIME")=="cloud-run"
assert e.get("EXAMTREE_API_STAGING")=="true"
assert e.get("OUTBOX_PUBLISHER_ENABLED")=="false"
assert e.get("GENERATION_JOB_WORKER_ENABLED")=="false"
' 2>/dev/null; then
  echo "FAIL: staging service safety flags missing; nothing changed." >&2
  exit 1
fi
gcloud run jobs describe "$JOB" --region="$REGION" --project="$PROJECT" >/dev/null || {
  echo "FAIL: expected staging background job does not exist." >&2; exit 1;
}
echo "STAGING ONLY: Cloud Run service $API + inert job $JOB."
echo "The existing Neon staging branch has its own 0.25-CU endpoint and may consume free-plan compute usage."
echo "Expected staging endpoint: $EXPECTED_STAGING_HOST"
echo "Retrieve the connection string for branch examtree-cloudrun-api-staging-20261010 from Neon (NOT main)."
read -r -s -p "Neon STAGING branch DATABASE_URL (hidden): " STAGING_DATABASE_URL
echo
trap 'unset STAGING_DATABASE_URL' EXIT
# The URL is supplied only through stdin. Never print it or put it on a command line.
if ! printf '%s' "$STAGING_DATABASE_URL" | python3 -c '
import sys
from urllib.parse import urlsplit, parse_qs
s=sys.stdin.read()
try:
 u=urlsplit(s)
 assert u.scheme in ("postgres","postgresql")
 assert u.hostname == "ep-wild-water-atrzmssw.c-9.us-east-1.aws.neon.tech"
 assert u.hostname != "ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech"
 assert u.path == "/neondb"
 assert u.username and u.password and u.port in (None, 5432)
 assert parse_qs(u.query).get("sslmode")==["require"]
except (AssertionError,ValueError):
 sys.exit(1)
' ; then
  echo "FAIL: URL is not the exact STAGING branch, PostgreSQL database, and required TLS. Nothing changed." >&2
  exit 1
fi
if ! gcloud secrets describe "$SECRET" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud secrets create "$SECRET" --replication-policy=automatic --project="$PROJECT" >/dev/null
fi
# Add a new staging-specific secret version, without displaying its value.
printf '%s' "$STAGING_DATABASE_URL" | gcloud secrets versions add "$SECRET" --data-file=- --project="$PROJECT" >/dev/null
unset STAGING_DATABASE_URL

gcloud secrets add-iam-policy-binding "$SECRET" --project="$PROJECT" \
  --member="serviceAccount:$SA" --role=roles/secretmanager.secretAccessor >/dev/null
echo "Staging-only Neon URL installed in a separate Secret Manager secret."

# Stop if the service was unexpectedly reconfigured since our preflight.
if ! gcloud run services describe "$API" --region="$REGION" --project="$PROJECT" --format=json |
    python3 -c '
import sys,json
s=json.load(sys.stdin); cs=(((s.get("spec") or {}).get("template") or {}).get("spec") or {}).get("containers",[])
assert len(cs)==1
e={x.get("name"):x.get("value") for x in cs[0].get("env",[])}
assert e.get("EXAMTREE_API_STAGING")=="true" and e.get("OUTBOX_PUBLISHER_ENABLED")=="false"
assert e.get("GENERATION_JOB_WORKER_ENABLED")=="false"
' 2>/dev/null; then
  echo "FAIL: service changed during preparation; staging secret saved but not mounted." >&2
  exit 1
fi

# Disable the currently deployed background command with /usr/bin/false; a
# future deployed image additionally checks EXAMTREE_API_STAGING at runtime.
gcloud run jobs update "$JOB" --project="$PROJECT" --region="$REGION" \
  --update-secrets="DATABASE_URL=$SECRET:latest" \
  --update-env-vars="EXAMTREE_API_STAGING=true" \
  --command=/usr/bin/false --quiet >/dev/null
echo "PASS: inert staging background job now references isolated Neon secret (NOT EXECUTED)."

# Trigger a revision ONLY for the staging API, without changing traffic or webhook URLs.
gcloud run services update "$API" --project="$PROJECT" --region="$REGION" \
  --update-secrets="DATABASE_URL=$SECRET:latest" --quiet >/dev/null

gcloud run services describe "$API" --project="$PROJECT" --region="$REGION" --format=json |
  python3 -c '
import json,sys
s=json.load(sys.stdin)
cs=(((s.get("spec") or {}).get("template") or {}).get("spec") or {}).get("containers",[])
assert len(cs)==1
e={x.get("name"):x for x in cs[0].get("env",[])}
assert (e.get("DATABASE_URL") or {}).get("valueFrom",{}).get("secretKeyRef",{}).get("name")=="examtree-api-staging-database-url"
assert e["EXAMTREE_API_STAGING"].get("value")=="true"
assert e["OUTBOX_PUBLISHER_ENABLED"].get("value")=="false"
assert e["GENERATION_JOB_WORKER_ENABLED"].get("value")=="false"
print("PASS: Cloud Run staging API mounted isolated Neon secret; API worker flags disabled")
'
# Basic non-mutating readiness check.
URL="$(gcloud run services describe "$API" --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
[[ "$URL" == https://examtree-api-staging-*.run.app ]] || {
  echo "FAIL: unexpected Cloud Run URL"; exit 1;
}
curl --fail --silent --show-error --max-time 60 "$URL/health" -o /dev/null
echo "PASS: staging API health after isolated Neon cutover."
echo "NOTE: Earlier NUM-001 runs remain in MAIN Neon, which Render still uses; they are NOT expected on isolated staging."
echo "NOTE: Cloudflare, Render, Firebase accounts, Cashfree, and production traffic are unchanged."
