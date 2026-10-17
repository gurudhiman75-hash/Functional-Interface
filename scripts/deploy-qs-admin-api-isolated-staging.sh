#!/usr/bin/env bash
# Dedicated Question Studio admin API preview: NEVER replaces examtree-api-staging,
# examtree-qs-api-staging, Render, or the live Cloudflare API bridge.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
QUEUE=examtree-qs-staging
SERVICE=examtree-qs-admin-api-staging
SA_NAME=examtree-qs-admin-api-staging
SA="$SA_NAME@$PROJECT.iam.gserviceaccount.com"
DB_SECRET=examtree-qs-validation-database-url
PREVIEW_ORIGIN=https://examtree-qs-admin-preview.pages.dev
EXPECTED_ENDPOINT=ep-fancy-dawn-atvvlmom
MODE="${MODE:-check}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

[[ "$MODE" == check || "$MODE" == deploy ]] || { echo "STOP: MODE=check or deploy only"; exit 2; }
[[ "$(gcloud tasks queues describe "$QUEUE" --project="$PROJECT" --location="$REGION" --format='value(state)')" == PAUSED ]] || {
  echo "STOP: isolated Cloud Tasks queue must remain PAUSED"; exit 2;
}
[[ "$(git branch --show-current)" == New-main ]] || { echo "STOP: checkout New-main first"; exit 2; }
[[ -z "$(git status --porcelain)" ]] || { echo "STOP: working tree is not clean"; exit 2; }
gcloud secrets describe "$DB_SECRET" --project="$PROJECT" >/dev/null
# Connection URL is secret: validate only its hostname, DB and TLS and never print it.
gcloud secrets versions access latest --secret="$DB_SECRET" --project="$PROJECT" | \
  EXPECTED_ENDPOINT="$EXPECTED_ENDPOINT" python3 -c '
import os,sys
from urllib.parse import urlsplit,parse_qs
try:
    x=urlsplit(sys.stdin.read().strip())
    expected=os.environ["EXPECTED_ENDPOINT"]
    valid=(x.scheme in ("postgres","postgresql")
         and (x.hostname or "").startswith(expected + ".")
         and x.path=="/neondb"
         and bool(x.username and x.password)
         and x.port in (None,5432)
         and parse_qs(x.query).get("sslmode") in (["require"],["verify-full"]))
except Exception:
    valid=False
if not valid: sys.exit("STOP: wrong or unsafe Neon secret endpoint")
print("PASS: isolated validation Neon endpoint only (credentials not shown)")
'
echo "PASS: Cloud Tasks queue paused"
echo "Target: $SERVICE (separate Cloud Run service)"
echo "Preview CORS: $PREVIEW_ORIGIN"
if [[ "$MODE" == check ]]; then
  echo "CHECK ONLY: no IAM, build or deployment changes"
  exit 0
fi
[[ "${EXAMTREE_BUDGET_READY:-}" == yes && "${EXAMTREE_QS_ADMIN_STAGING_DEPLOY_APPROVED:-}" == yes ]] || {
  echo "STOP: budget and isolated admin staging approval required"; exit 2;
}
[[ "$(git rev-parse HEAD)" == "$(git rev-parse origin/New-main)" ]] || {
  echo "STOP: New-main local commit must match origin/New-main"; exit 2;
}
if ! gcloud iam service-accounts describe "$SA" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$SA_NAME" --project="$PROJECT" --display-name="Question Studio isolated staging admin API"
fi
# authenticate() verifies Firebase ID tokens with checkRevoked=true, which
# reads the Firebase user record to check revocation/disabled state. This
# dedicated staging identity must have firebaseauth.users.get, but no Firebase
# Authentication write permission or long-lived service-account key.
gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:$SA" --role=roles/firebaseauth.viewer \
  --condition=None --quiet >/dev/null
echo "PASS: staging Firebase revocation read permission (viewer only)"
gcloud secrets add-iam-policy-binding "$DB_SECRET" --project="$PROJECT" \
  --member="serviceAccount:$SA" --role=roles/secretmanager.secretAccessor >/dev/null

IMAGE="$REGION-docker.pkg.dev/$PROJECT/examtree-workers/examtree-qs-admin-api-staging:$(git rev-parse --short=12 HEAD)"
echo "[qs-admin-api] Building $IMAGE"
gcloud builds submit . --project="$PROJECT" --region="$REGION" \
  --config=cloudbuild.examtree-cloudrun-api.yaml \
  --substitutions="_IMAGE=$IMAGE"

# The auth middleware and content.generation.run/read admin RBAC still guard
# Question Studio endpoints; Cloud Run ingress is reachable for browser OAuth.
# Do not mount job scheduler/outbox publisher in this API runtime.
gcloud run deploy "$SERVICE" --project="$PROJECT" --region="$REGION" \
  --image="$IMAGE" --platform=managed --service-account="$SA" \
  --memory=2Gi --cpu=1 --concurrency=5 --timeout=180 \
  --min-instances=0 --max-instances=1 --cpu-throttling \
  --allow-unauthenticated \
  --set-secrets="DATABASE_URL=$DB_SECRET:latest" \
  --set-env-vars="NODE_ENV=production,EXAMTREE_API_RUNTIME=cloud-run,EXAMTREE_API_STAGING=true,FIREBASE_PROJECT_ID=$PROJECT,EXAMTREE_SALES_DISABLED=true,GENERATION_JOB_WORKER_ENABLED=false,OUTBOX_PUBLISHER_ENABLED=false,EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED=true,EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED=true,EXAMTREE_QUESTION_STUDIO_STAGING_ENQUEUE_APPROVED=true,CORS_ORIGINS=$PREVIEW_ORIGIN" \
  --quiet
URL="$(gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
[[ "$URL" == https://*.run.app ]] || { echo "STOP: Cloud Run service URL missing"; exit 2; }
HEALTH="$(curl -sS --max-time 90 --retry 1 -o /tmp/qs-admin-staging-health.json -w '%{http_code}' "$URL/health")"
[[ "$HEALTH" == 200 ]] || { echo "STOP: isolated API health HTTP $HEALTH"; exit 2; }
CORS="$(curl -sS --max-time 45 -D - -o /dev/null -X OPTIONS \
  -H "Origin: $PREVIEW_ORIGIN" \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: authorization,content-type,idempotency-key' \
  "$URL/api/admin/question-studio/runs/async-staging")"
grep -iq 'access-control-allow-origin: https://examtree-qs-admin-preview.pages.dev' <<<"$CORS" || {
  echo "STOP: preview CORS origin not accepted"; exit 2;
}
grep -iq 'access-control-allow-headers:.*Idempotency-Key' <<<"$CORS" || {
  echo "STOP: Idempotency-Key header not accepted"; exit 2;
}
echo "PASS: staging API health 200"
echo "PASS: browser staging CORS preflight"
echo "DEPLOYED: $SERVICE"
echo "API_ORIGIN=$URL"
echo "Queue remains PAUSED. No admin frontend or production service was modified."
