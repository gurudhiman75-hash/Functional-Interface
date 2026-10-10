#!/usr/bin/env bash
set -euo pipefail

# Safe first deployment of the Express API; no public traffic changes.
# The existing Neon main database contains TEST DATA ONLY per the owner.
# Use its URL only via Google Secret Manager; no second Neon compute needed.
# Do NOT activate duplicate background pollers while Render is still live.
PROJECT="${1:-sarbedutech}"
REGION="asia-south1"
SERVICE="examtree-api-staging"
JOB="examtree-api-background-staging"
ACCOUNT="examtree-api-runtime"
SECRET="examtree-api-database-url"
TOKEN_SECRET="examtree-trg002-worker-token"
# Default remains unconfigured/disabled for Cashfree. Explicitly opting into
# sandbox requires two dedicated sandbox secrets and never changes production.
CASHFREE_SANDBOX="${EXAMTREE_ENABLE_CASHFREE_SANDBOX:-no}"
CASHFREE_CLIENT_ID_SECRET="examtree-cashfree-sandbox-client-id"
CASHFREE_CLIENT_SECRET_SECRET="examtree-cashfree-sandbox-client-secret"
REGISTRY="examtree-workers"
if [[ "$CASHFREE_SANDBOX" != "yes" && "$CASHFREE_SANDBOX" != "no" ]]; then
  echo "EXAMTREE_ENABLE_CASHFREE_SANDBOX must be yes or no; refusing ambiguous payment configuration" >&2
  exit 2
fi
if [[ "$PROJECT" != "sarbedutech" || "${EXAMTREE_BUDGET_READY:-}" != "yes" ]]; then
  echo "Usage: EXAMTREE_BUDGET_READY=yes bash scripts/deploy-examtree-api-cloudrun-staging.sh sarbedutech" >&2
  exit 2
fi
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
gcloud config set project "$PROJECT" >/dev/null
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com --project "$PROJECT" >/dev/null
gcloud artifacts repositories describe "$REGISTRY" --location="$REGION" --project="$PROJECT" >/dev/null || {
  echo "Artifact Registry '$REGISTRY' is missing. Refusing to create unbudgeted resources." >&2; exit 1;
}
REQUIRED_SECRETS=("$SECRET" "$TOKEN_SECRET")
if [[ "$CASHFREE_SANDBOX" == "yes" ]]; then
  REQUIRED_SECRETS+=("$CASHFREE_CLIENT_ID_SECRET" "$CASHFREE_CLIENT_SECRET_SECRET")
fi
for required in "${REQUIRED_SECRETS[@]}"; do
  gcloud secrets describe "$required" --project="$PROJECT" >/dev/null || {
    echo "Missing Secret Manager secret $required. Follow docs/examtree-cashfree-cloudrun-staging-setup.md for sandbox credentials." >&2; exit 1;
  }
  gcloud secrets versions list "$required" --project="$PROJECT" --filter='state:enabled' --format='value(name)' | grep -q . || {
    echo "Secret $required has no enabled version" >&2; exit 1;
  }
done
SA="$ACCOUNT@$PROJECT.iam.gserviceaccount.com"
if ! gcloud iam service-accounts describe "$SA" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$ACCOUNT" --project="$PROJECT" --display-name="Examtree Cloud Run API" >/dev/null
fi
for secret in "${REQUIRED_SECRETS[@]}"; do
  gcloud secrets add-iam-policy-binding "$secret" --project="$PROJECT" \
    --member="serviceAccount:$SA" --role=roles/secretmanager.secretAccessor >/dev/null
done
API_ENV_VARS="NODE_ENV=production,EXAMTREE_API_RUNTIME=cloud-run,EXAMTREE_API_STAGING=true,FIREBASE_PROJECT_ID=$PROJECT,FIREBASE_STORAGE_BUCKET=$PROJECT.firebasestorage.app,EXAMTREE_PUBLIC_ORIGIN=https://examtree.in,GENERATION_JOB_WORKER_ENABLED=false,OUTBOX_PUBLISHER_ENABLED=false,QUESTION_STUDIO_SHARED_WORKER_URL=https://examtree-generation-staging-1083299267005.asia-south1.run.app,QUESTION_STUDIO_TRG002_WORKER_URL=https://examtree-trg002-staging-ttnfjefqka-el.a.run.app"
API_SECRETS="DATABASE_URL=$SECRET:latest,QUESTION_STUDIO_WORKER_TOKEN=$TOKEN_SECRET:latest"
if [[ "$CASHFREE_SANDBOX" == "yes" ]]; then
  API_ENV_VARS+=",EXAMTREE_PAYMENT_PROVIDER=cashfree,CASHFREE_ENV=sandbox"
  API_SECRETS+=",CASHFREE_CLIENT_ID=$CASHFREE_CLIENT_ID_SECRET:latest,CASHFREE_CLIENT_SECRET=$CASHFREE_CLIENT_SECRET_SECRET:latest"
  echo "[api-staging] Enabling Cashfree SANDBOX only; live payment credentials and Render are unchanged"
else
  echo "[api-staging] Cashfree is not enabled for this staging deployment"
fi

FULL_REVISION="$(git rev-parse HEAD)"
IMAGE="$REGION-docker.pkg.dev/$PROJECT/$REGISTRY/examtree-api:$FULL_REVISION"
echo "[api-staging] Building revision $FULL_REVISION against existing Neon TEST data"
gcloud builds submit "$ROOT" --project="$PROJECT" --region="$REGION" \
  --config="$ROOT/cloudbuild.examtree-cloudrun-api.yaml" \
  --ignore-file="$ROOT/Dockerfile.question-studio-worker.dockerignore" \
  --substitutions="_IMAGE=$IMAGE"

# Production Firebase JSON keys are NOT exported from Render. The Cloud Run
# service account uses ADC and the existing Firebase project directly.
# 0 minimum instances + 1 maximum protects staging cost; scheduled jobs are
# deliberately not activated by this script.
# Capture the actual Cloud Run application failure without leaking secrets.
# A failed revision does not route traffic and must not be treated as ready.
if ! gcloud run deploy "$SERVICE" --project="$PROJECT" --region="$REGION" \
  --platform=managed --image="$IMAGE" \
  --service-account="$SA" \
  --memory=2Gi --cpu=1 --concurrency=10 \
  --min-instances=0 --max-instances=1 --timeout=180 \
  --cpu-throttling --allow-unauthenticated \
  --set-env-vars="$API_ENV_VARS" \
  --set-secrets="$API_SECRETS" --quiet; then
  echo "FAILED: Cloud Run API revision did not become ready." >&2
  echo "Recent application startup errors (never paste private environment values):" >&2
  gcloud logging read \
    "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"$SERVICE\"" \
    --project="$PROJECT" --freshness=30m --limit=35 \
    --format='table(timestamp,severity,textPayload,jsonPayload.message)' >&2 || true
  exit 1
fi

URL="$(gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
[[ "$URL" == https://*.run.app ]] || { echo "Cloud Run did not return an HTTPS URL" >&2; exit 1; }
# Checkout and Cashfree webhook URLs must resolve to the API itself, not the
# previous Render hostname. This causes another revision, still staging-only.
gcloud run services update "$SERVICE" --project="$PROJECT" --region="$REGION" \
  --update-env-vars="EXAMTREE_API_ORIGIN=$URL" --quiet >/dev/null

echo "[api-staging] Verifying health and protected endpoint failures"
RESULT="$(mktemp)"
trap 'rm -f "$RESULT"' EXIT
curl --fail-with-body --silent --show-error --retry 2 --retry-delay 3 --max-time 75 "$URL/health" --output "$RESULT"
node - "$RESULT" <<'NODE'
const fs = require('node:fs');
const result = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
if (result.status !== 'ok') process.exit(1);
console.log("PASS: API health 200");
NODE
bash "$ROOT/scripts/smoke-examtree-api-staging.sh" "$URL"
if [[ "$CASHFREE_SANDBOX" == "yes" ]]; then
  # No financial operations: confirm the public catalog identifies sandbox
  # checkout, and an unsigned webhook is REJECTED (400, not unconfigured 503).
  curl --fail-with-body --silent --show-error --max-time 75 \
    "$URL/api/commerce/products" --output "$RESULT"
  node - "$RESULT" <<'NODE'
const fs = require('node:fs');
const result = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
if (result.checkoutProvider !== 'cashfree') throw new Error('Staging Cashfree checkout provider is not selected');
console.log('PASS: Cashfree is the configured staging checkout provider');
NODE
  UNSIGNED_STATUS="$(curl --silent --show-error --max-time 75 \
    --output "$RESULT" --write-out '%{http_code}' \
    -H 'Content-Type: application/json' \
    --data '{"type":"PAYMENT_SUCCESS_WEBHOOK"}' \
    "$URL/api/billing/cashfree/webhook")"
  if [[ "$UNSIGNED_STATUS" != "400" ]]; then
    echo "FAILED: Cashfree SANDBOX webhook returned $UNSIGNED_STATUS, expected signed-webhook rejection 400" >&2
    exit 1
  fi
  echo "PASS: Cashfree SANDBOX webhook is configured and rejects unsigned requests"
  echo "NOTE: This does not create a Cashfree order or verify provider delivery"
fi

# Do not EXECUTE or SCHEDULE this job while Render still dispatches
# notifications/outbox events against the same TEST database.
gcloud run jobs deploy "$JOB" --project="$PROJECT" --region="$REGION" \
  --image="$IMAGE" --service-account="$SA" \
  --memory=2Gi --cpu=1 --tasks=1 --parallelism=1 --task-timeout=600 \
  --max-retries=0 --command=node \
  --args="--import=/app/artifacts/api-server/cloud-run-preload.mjs,artifacts/api-server/dist/cloud-run-background.mjs" \
  --set-env-vars="NODE_ENV=production,EXAMTREE_API_RUNTIME=cloud-run,FIREBASE_PROJECT_ID=$PROJECT,FIREBASE_STORAGE_BUCKET=$PROJECT.firebasestorage.app" \
  --set-secrets="DATABASE_URL=$SECRET:latest" --quiet >/dev/null

echo "EXAMTREE API STAGING READY: $URL"
echo "Cloud Run job '$JOB' is deployed but NOT scheduled or executed."
echo "Cloudflare and mobile still use Render; no production webhook subscriptions were modified."
if [[ "$CASHFREE_SANDBOX" == "yes" ]]; then
  echo "New staging Cashfree SANDBOX checkout orders will notify the Cloud Run staging webhook URL."
fi
echo "Existing Neon main test DB was reused; no new Neon compute required."
echo "Do not turn off Render until auth, attempt, payment, webhook, and scheduled-job checks pass."
