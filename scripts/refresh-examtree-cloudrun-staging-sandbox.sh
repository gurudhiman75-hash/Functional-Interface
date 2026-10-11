#!/usr/bin/env bash
# Rebuild and refresh ONLY the already-isolated Cloud Run STAGING API.
# Reuse existing Cashfree sandbox credentials; DO NOT touch the staging job,
# production Cloud Run, Render, Cloudflare, live Neon or real Cashfree settings.
set -euo pipefail
set +x

PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-api-staging
JOB=examtree-api-background-staging
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ "${EXAMTREE_STAGING_SANDBOX_REFRESH_APPROVED:-}" != "yes" ||
      "${EXAMTREE_BUDGET_READY:-}" != "yes" ]]; then
  echo "REFUSED: cloud build and staging revision may incur costs. Require EXAMTREE_STAGING_SANDBOX_REFRESH_APPROVED=yes EXAMTREE_BUDGET_READY=yes." >&2
  exit 2
fi
if [[ "$(gcloud config get-value project 2>/dev/null)" != "$PROJECT" ]]; then
  echo "FAIL: select GCP project sarbedutech." >&2
  exit 1
fi
if [[ "$(git branch --show-current)" != "New-main" ||
      -n "$(git status --porcelain --untracked-files=no)" ||
      "$(git rev-parse HEAD)" != "$(git rev-parse origin/New-main)" ]]; then
  echo "FAIL: use a clean up-to-date New-main checkout before building." >&2
  exit 1
fi

# Validate that the EXISTING STAGING service has isolated Neon, sandbox
# Cashfree secrets, and disabled background workers. No secrets are read.
check_staging() {
  gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json |
    python3 -c '
import json,sys
try:
 s=json.load(sys.stdin)
 containers=s["spec"]["template"]["spec"]["containers"]
 assert len(containers)==1
 values={e.get("name"):e.get("value") for e in containers[0].get("env",[])}
 secrets={e.get("name"):((e.get("valueFrom") or {}).get("secretKeyRef") or {}).get("name") for e in containers[0].get("env",[])}
 assert values.get("EXAMTREE_API_RUNTIME")=="cloud-run"
 assert values.get("EXAMTREE_API_STAGING")=="true"
 assert values.get("OUTBOX_PUBLISHER_ENABLED")=="false"
 assert values.get("GENERATION_JOB_WORKER_ENABLED")=="false"
 assert values.get("EXAMTREE_PAYMENT_PROVIDER")=="cashfree"
 assert values.get("CASHFREE_ENV")=="sandbox"
 assert secrets.get("DATABASE_URL")=="examtree-api-staging-database-url"
 assert secrets.get("CASHFREE_CLIENT_ID")=="examtree-cashfree-sandbox-client-id"
 assert secrets.get("CASHFREE_CLIENT_SECRET")=="examtree-cashfree-sandbox-client-secret"
 assert values.get("EXAMTREE_PUBLIC_ORIGIN")=="https://examtree.in"
except (KeyError,AssertionError,TypeError,ValueError) as exc:
 print("FAIL: stage is missing isolated Neon / Cashfree SANDBOX / disabled worker configuration. No changes made.",file=sys.stderr)
 sys.exit(1)
print("PASS: existing Cloud Run stage uses isolated Neon, Cashfree SANDBOX and disabled API workers")
'
}
check_inert_job() {
  gcloud run jobs describe "$JOB" --project="$PROJECT" --region="$REGION" --format=json |
    python3 -c '
import json,sys
try:
 j=json.load(sys.stdin)
 spec=j["spec"]["template"]["spec"]
 if "template" in spec: spec=spec["template"]["spec"]
 cs=spec["containers"]
 assert len(cs)==1
 cmd=cs[0].get("command") or []
 assert cmd==["/usr/bin/false"]
 env={e.get("name"):e for e in cs[0].get("env",[])}
 assert (env.get("EXAMTREE_API_STAGING") or {}).get("value")=="true"
 assert ((env.get("DATABASE_URL") or {}).get("valueFrom") or {}).get("secretKeyRef",{}).get("name")=="examtree-api-staging-database-url"
except (KeyError,AssertionError,TypeError,ValueError):
 print("FAIL: background staging job must stay inert (/usr/bin/false) on isolated Neon. No changes made.",file=sys.stderr)
 sys.exit(1)
print("PASS: staging background job is non-executable")
'
}
check_staging
check_inert_job

REVISION="$(git rev-parse HEAD)"
IMAGE="$REGION-docker.pkg.dev/$PROJECT/examtree-workers/examtree-api:$REVISION"
gcloud artifacts repositories describe examtree-workers --project="$PROJECT" --location="$REGION" >/dev/null
echo "Building approved New-main $REVISION for STAGING only."
gcloud builds submit "$ROOT" --project="$PROJECT" --region="$REGION" \
  --config="$ROOT/cloudbuild.examtree-cloudrun-api.yaml" \
  --ignore-file="$ROOT/Dockerfile.question-studio-worker.dockerignore" \
  --substitutions="_IMAGE=$IMAGE"

# Update only the staging service IMAGE: keep current sandbox env vars and
# staging Secret Manager refs. Do not redeploy or change the job definition.
gcloud run services update "$SERVICE" --project="$PROJECT" --region="$REGION" \
  --image="$IMAGE" --quiet >/dev/null

check_staging
check_inert_job
URL="$(gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
if [[ "$URL" != https://*.run.app ]]; then
  echo "FAIL: unexpected staging service URL." >&2
  exit 1
fi
curl --fail --silent --show-error --max-time 60 "$URL/health" |
  python3 -c '
import sys,json
d=json.load(sys.stdin)
assert d.get("status")=="ok"
print("PASS: staging /health 200 status=ok")
'
curl --fail --silent --show-error --max-time 60 "$URL/api/commerce/products" |
  python3 -c '
import sys,json
d=json.load(sys.stdin)
assert d.get("checkoutProvider")=="cashfree"
print("PASS: staging catalog reports Cashfree (sandbox config checked separately)")
'
echo "PASS: latest staging API build deployed; inert background job unchanged."
echo "UNCHANGED: Cloudflare, Render, production Neon, Cashfree production, live webhooks, Android, and background schedules."
echo "NOTE: staging remains on sandbox/test keys; this is NOT production cutover."
