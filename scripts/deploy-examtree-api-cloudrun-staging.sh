#!/usr/bin/env bash
set -euo pipefail

# Safe first deployment of the Express API; no public traffic changes.
PROJECT="\${1:-sarbedutech}"
REGION="asia-south1"
SERVICE="examtree-api-staging"
JOB="examtree-api-background-staging"
ACCOUNT="examtree-api-runtime"
SECRET="examtree-api-database-url"
TOKEN_SECRET="examtree-trg002-worker-token"
REGISTRY="examtree-workers"
if [[ "$PROJECT" != "sarbedutech" || "\${EXAMTREE_BUDGET_READY:-}" != "yes" ]]; then
  echo "Usage: EXAMTREE_BUDGET_READY=yes bash scripts/deploy-examtree-api-cloudrun-staging.sh sarbedutech" >&2
  exit 2
fi
ROOT="$(cd "$(dirname "\${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
gcloud config set project "$PROJECT" >/dev/null
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com --project "$PROJECT" >/dev/null
gcloud artifacts repositories describe "$REGISTRY" --location="$REGION" --project="$PROJECT" >/dev/null || {
  echo "Artifact Registry '$REGISTRY' is missing. Refusing to create unbudgeted resources." >&2; exit 1;
}
for required in "$SECRET" "$TOKEN_SECRET"; do
  gcloud secrets describe "$required" --project="$PROJECT" >/dev/null || {
    echo "Missing Secret Manager secret $required. Create it securely as described in docs/cloud-run-api-migration.md." >&2; exit 1;
  }
  gcloud secrets versions list "$required" --project="$PROJECT" --filter='state:enabled' --format='value(name)' | grep -q . || {
    echo "Secret $required has no enabled version" >&2; exit 1;
  }
done
SA="$ACCOUNT@$PROJECT.iam.gserviceaccount.com"
if ! gcloud iam service-accounts describe "$SA" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$ACCOUNT" --project="$PROJECT" --display-name="Examtree Cloud Run API" >/dev/null
fi
for secret in "$SECRET" "$TOKEN_SECRET"; do
  gcloud secrets add-iam-policy-binding "$secret" --project="$PROJECT" \
    --member="serviceAccount:$SA" --role=roles/secretmanager.secretAccessor >/dev/null
done
FULL_REVISION="$(git rev-parse HEAD)"
IMAGE="$REGION-docker.pkg.dev/$PROJECT/$REGISTRY/examtree-api:$FULL_REVISION"
echo "[api-staging] Building revision $FULL_REVISION"
gcloud builds submit "$ROOT" --project="$PROJECT" --region="$REGION" \
  --config="$ROOT/cloudbuild.examtree-cloudrun-api.yaml" \
  --ignore-file="$ROOT/Dockerfile.question-studio-worker.dockerignore" \
  --substitutions="_IMAGE=$IMAGE"

# Production Firebase JSON keys are NOT exported from Render. The Cloud Run
# service account uses ADC and the existing Firebase project directly.
# 0 minimum instances + 1 maximum protects staging cost; scheduled jobs are
# deliberately not activated by this script.
gcloud run deploy "$SERVICE" --project="$PROJECT" --region="$REGION" \
  --platform=managed --image="$IMAGE" \
  --service-account="$SA" \
  --memory=2Gi --cpu=1 --concurrency=10 \
  --min-instances=0 --max-instances=1 --timeout=180 \
  --cpu-throttling --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,EXAMTREE_API_RUNTIME=cloud-run,FIREBASE_PROJECT_ID=$PROJECT,FIREBASE_STORAGE_BUCKET=$PROJECT.firebasestorage.app,EXAMTREE_PUBLIC_ORIGIN=https://functional-interface.pages.dev,GENERATION_JOB_WORKER_ENABLED=false,OUTBOX_PUBLISHER_ENABLED=false,DB_POOL_MAX=4,QUESTION_STUDIO_SHARED_WORKER_URL=https://examtree-generation-staging-1083299267005.asia-south1.run.app,QUESTION_STUDIO_TRG002_WORKER_URL=https://examtree-trg002-staging-ttnfjefqka-el.a.run.app" \
  --set-secrets="DATABASE_URL=$SECRET:latest,QUESTION_STUDIO_WORKER_TOKEN=$TOKEN_SECRET:latest" --quiet

URL="$(gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
[[ "$URL" == https://*.run.app ]] || { echo "Cloud Run did not return an HTTPS URL" >&2; exit 1; }
# Checkout and Cashfree webhook URLs must resolve to the API itself, not the
# previous Render hostname. This causes another revision, still staging-only.
gcloud run services update "$SERVICE" --project="$PROJECT" --region="$REGION" \
  --update-env-vars="EXAMTREE_API_ORIGIN=$URL" --quiet >/dev/null

echo "[api-staging] Verifying public health endpoint"
RESULT="$(mktemp)"
trap 'rm -f "$RESULT"' EXIT
curl --fail-with-body --silent --show-error --retry 2 --retry-delay 3 --max-time 75 "$URL/health" --output "$RESULT"
node - "$RESULT" <<'NODE'
const fs = require('node:fs');
const result = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
if (result.status !== 'ok') process.exit(1);
console.log("PASS: API health 200");
NODE

# Do not run the job against live Neon while Render might still dispatch work.
gcloud run jobs deploy "$JOB" --project="$PROJECT" --region="$REGION" \
  --image="$IMAGE" --service-account="$SA" \
  --memory=2Gi --cpu=1 --tasks=1 --parallelism=1 --task-timeout=600 \
  --max-retries=0 --command=node \
  --args="artifacts/api-server/dist/cloud-run-background.mjs" \
  --set-env-vars="NODE_ENV=production,EXAMTREE_API_RUNTIME=cloud-run,FIREBASE_PROJECT_ID=$PROJECT,FIREBASE_STORAGE_BUCKET=$PROJECT.firebasestorage.app,DB_POOL_MAX=4" \
  --set-secrets="DATABASE_URL=$SECRET:latest" --quiet >/dev/null

echo "EXAMTREE API STAGING READY: $URL"
echo "Cloud Run job '$JOB' is deployed but NOT scheduled or executed."
echo "Cloudflare and mobile still use Render. Cashfree webhooks remain unchanged."
echo "Do not turn off Render until auth, attempt, payment, webhook, and scheduled-job checks pass."
