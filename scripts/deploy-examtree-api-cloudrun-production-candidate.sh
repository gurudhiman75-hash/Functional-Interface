#!/usr/bin/env bash
# Provision PRIVATE production candidate and INERT production job only.
# Does not change Cloudflare, DNS, Render, Cashfree webhook, or Scheduler.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-api
JOB=examtree-api-background
ACCOUNT=examtree-api-prod-runtime
DB_SECRET=examtree-api-database-url
CASHFREE_ID_SECRET=examtree-cashfree-production-client-id
CASHFREE_KEY_SECRET=examtree-cashfree-production-client-secret
AI_SECRET=examtree-openai-api-key
REGISTRY=examtree-workers

if [[ "$(printenv EXAMTREE_PRODUCTION_CANDIDATE_APPROVED 2>/dev/null || true)" != "yes" ||
      "$(printenv EXAMTREE_BUDGET_READY 2>/dev/null || true)" != "yes" ]]; then
  echo "REFUSED: this can incur Cloud Build / Cloud Run costs. Explicitly set EXAMTREE_PRODUCTION_CANDIDATE_APPROVED=yes and EXAMTREE_BUDGET_READY=yes." >&2
  exit 2
fi
if [[ "$(gcloud config get-value project 2>/dev/null)" != "$PROJECT" ]]; then
  echo "FAIL: select Google Cloud project sarbedutech" >&2
  exit 1
fi
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if [[ "$(git branch --show-current)" != "New-main" ]] ||
   [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  echo "FAIL: use clean, reviewed New-main checkout" >&2
  exit 1
fi
if gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" >/dev/null 2>&1; then
  echo "FAIL: production Cloud Run service already exists; manual review required before changing it." >&2
  exit 1
fi
if gcloud run jobs describe "$JOB" --project="$PROJECT" --region="$REGION" >/dev/null 2>&1; then
  echo "FAIL: production background job already exists; manual review required." >&2
  exit 1
fi
gcloud artifacts repositories describe "$REGISTRY" --project="$PROJECT" --location="$REGION" >/dev/null || {
  echo "FAIL: required existing Artifact Registry repository is unavailable." >&2
  exit 1
}

for key in "$DB_SECRET" "$CASHFREE_ID_SECRET" "$CASHFREE_KEY_SECRET" "$AI_SECRET"; do
  if ! gcloud secrets describe "$key" --project="$PROJECT" >/dev/null 2>&1 ||
     ! gcloud secrets versions list "$key" --project="$PROJECT" --filter='state:enabled' --format='value(name)' | grep -q .; then
    echo "PENDING: enabled production Secret Manager secret '$key' not found. No Cloud Run resources changed." >&2
    exit 2
  fi
done
# Never reuse the staging DB, Cashfree sandbox keys or a pooled/unknown Neon
# endpoint. Main URL stays in Secret Manager; validated via a stdin pipe.
if ! gcloud secrets versions access latest --secret="$DB_SECRET" --project="$PROJECT" |
     python3 "$ROOT/scripts/validate-examtree-production-neon-url.py"; then
  echo "FAIL: production DB secret is not exact Neon main; nothing deployed." >&2
  exit 1
fi

echo "PRECHECK: live Neon main, distinct production Cashfree/AI secrets, and existing registry."
echo "PRECHECK: this creates a PRIVATE Cloud Run service and an INERT job; no public traffic/webhook changes."
FULL_REVISION="$(git rev-parse HEAD)"
IMAGE="$REGION-docker.pkg.dev/$PROJECT/$REGISTRY/examtree-api:$FULL_REVISION"
SA="$ACCOUNT@$PROJECT.iam.gserviceaccount.com"
if ! gcloud iam service-accounts describe "$SA" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$ACCOUNT" --project="$PROJECT" --display-name="Examtree production Cloud Run runtime" >/dev/null
fi
for key in "$DB_SECRET" "$CASHFREE_ID_SECRET" "$CASHFREE_KEY_SECRET" "$AI_SECRET"; do
  gcloud secrets add-iam-policy-binding "$key" --project="$PROJECT" --member="serviceAccount:$SA" --role=roles/secretmanager.secretAccessor >/dev/null
done

gcloud builds submit "$ROOT" --project="$PROJECT" --region="$REGION" \
  --config="$ROOT/cloudbuild.examtree-cloudrun-api.yaml" \
  --ignore-file="$ROOT/Dockerfile.question-studio-worker.dockerignore" \
  --substitutions="_IMAGE=$IMAGE"

# Absolutely no public IAM invocation while Render handles real customers.
gcloud run deploy "$SERVICE" --project="$PROJECT" --region="$REGION" \
  --platform=managed --image="$IMAGE" --service-account="$SA" \
  --memory=2Gi --cpu=1 --concurrency=10 --min-instances=0 --max-instances=1 \
  --timeout=180 --cpu-throttling --no-allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,EXAMTREE_API_RUNTIME=cloud-run,EXAMTREE_API_STAGING=false,EXAMTREE_PUBLIC_ORIGIN=https://examtree.in,FIREBASE_PROJECT_ID=$PROJECT,FIREBASE_STORAGE_BUCKET=$PROJECT.firebasestorage.app,GENERATION_JOB_WORKER_ENABLED=false,OUTBOX_PUBLISHER_ENABLED=false,AI_EXTRACTION_PROVIDER=openai,EXAMTREE_PAYMENT_PROVIDER=cashfree,CASHFREE_ENV=production" \
  --set-secrets="DATABASE_URL=$DB_SECRET:latest,CASHFREE_CLIENT_ID=$CASHFREE_ID_SECRET:latest,CASHFREE_CLIENT_SECRET=$CASHFREE_KEY_SECRET:latest,OPENAI_API_KEY=$AI_SECRET:latest" \
  --quiet

# Set the future callback origin to the candidate's own Cloud Run URL while
# it is still PRIVATE; no Cashfree provider webhook registration changes here.
URL="$(gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
if [[ "$URL" != https://*.run.app ]]; then
  echo "FAIL: unexpected production candidate hostname, no cutover." >&2
  exit 1
fi
gcloud run services update "$SERVICE" --project="$PROJECT" --region="$REGION" \
  --update-env-vars="EXAMTREE_API_ORIGIN=$URL" --quiet >/dev/null

# Never promote a candidate with the broad public invoker role.
gcloud run services get-iam-policy "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json |
python3 -c '
import sys,json
policy=json.load(sys.stdin)
for binding in policy.get("bindings",[]):
 assert not any(member in ("allUsers","allAuthenticatedUsers") for member in binding.get("members",[]))
print("PASS: production API candidate has no public Cloud Run invoker bindings")
'

# Inert job definition only: NO execution and NO Cloud Scheduler. This job
# cannot dispatch notifications/outbox while Render is still live.
gcloud run jobs deploy "$JOB" --project="$PROJECT" --region="$REGION" \
  --image="$IMAGE" --service-account="$SA" --memory=2Gi --cpu=1 \
  --tasks=1 --parallelism=1 --task-timeout=600 --max-retries=0 \
  --command=/usr/bin/false \
  --set-env-vars="NODE_ENV=production,EXAMTREE_API_RUNTIME=cloud-run,EXAMTREE_API_STAGING=false,FIREBASE_PROJECT_ID=$PROJECT,FIREBASE_STORAGE_BUCKET=$PROJECT.firebasestorage.app" \
  --set-secrets="DATABASE_URL=$DB_SECRET:latest" --quiet >/dev/null

# Verify production configuration and that unauthenticated invocation is still
# blocked, without trying orders, webhook callbacks, user attempts or workers.
gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json |
python3 -c '
import json,sys
s=json.load(sys.stdin)
c=s["spec"]["template"]["spec"]["containers"][0]
env={e["name"]:e for e in c["env"]}
assert env["EXAMTREE_API_RUNTIME"]["value"]=="cloud-run"
assert env["EXAMTREE_API_STAGING"]["value"]=="false"
assert env["OUTBOX_PUBLISHER_ENABLED"]["value"]=="false"
assert env["GENERATION_JOB_WORKER_ENABLED"]["value"]=="false"
assert env["CASHFREE_ENV"]["value"]=="production"
assert env["DATABASE_URL"]["valueFrom"]["secretKeyRef"]["name"]=="examtree-api-database-url"
assert env["OPENAI_API_KEY"]["valueFrom"]["secretKeyRef"]["name"]=="examtree-openai-api-key"
print("PASS: production API candidate has main Neon secret, live Cashfree config and disabled API workers")
'
echo "PASS: production Cloud Run PRIVATE candidate and INERT job defined."
echo "NOT DONE: public invocation, background scheduler, live payment webhooks, Cloudflare cutover, Render shutdown."
echo "Next: run scripts/inspect-examtree-cloudrun-production-handover.py, then independently verify IAM, app readiness and credentials before approval."
