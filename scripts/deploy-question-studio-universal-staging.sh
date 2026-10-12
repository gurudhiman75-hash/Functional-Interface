#!/usr/bin/env bash
# Isolated deterministic four-engine worker STAGING ONLY. No Neon or admin API.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
REGISTRY=examtree-workers
SERVICE=examtree-universal-staging
SA=examtree-gen-runtime@$PROJECT.iam.gserviceaccount.com
TOKEN_SECRET=examtree-trg002-worker-token
[[ "${EXAMTREE_BUDGET_READY:-}" == "yes" && "${EXAMTREE_UNIVERSAL_STAGING_APPROVED:-}" == "yes" ]] || {
  echo "REFUSED: review billing budget and explicitly approve staging deployment" >&2
  exit 2
}
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
[[ "$(git branch --show-current)" == "New-main" && -z "$(git status --porcelain --untracked-files=no)" ]] || {
  echo "REFUSED: checkout clean New-main first" >&2; exit 2
}
[[ "$(git rev-parse HEAD)" == "$(git rev-parse origin/New-main)" ]] || {
  echo "REFUSED: fetch latest New-main first" >&2; exit 2
}
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || {
  echo "REFUSED: set gcloud project sarbedutech" >&2; exit 2
}
gcloud artifacts repositories describe "$REGISTRY" --location="$REGION" --project="$PROJECT" >/dev/null
gcloud iam service-accounts describe "$SA" --project="$PROJECT" >/dev/null
gcloud secrets describe "$TOKEN_SECRET" --project="$PROJECT" >/dev/null
[[ -n "$(gcloud secrets versions list "$TOKEN_SECRET" --project="$PROJECT" --filter='state:enabled' --format='value(name)')" ]] || {
  echo "REFUSED: shared staging worker token secret has no enabled version" >&2; exit 2
}
if gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" >/dev/null 2>&1; then
  echo "REFUSED: staging universal service already exists; inspect before redeploying" >&2
  exit 2
fi
gcloud secrets add-iam-policy-binding "$TOKEN_SECRET" --project="$PROJECT" \
  --member="serviceAccount:$SA" --role=roles/secretmanager.secretAccessor >/dev/null
SHA="$(git rev-parse HEAD)"
IMAGE="$REGION-docker.pkg.dev/$PROJECT/$REGISTRY/examtree-universal-staging:$SHA"
gcloud builds submit "$ROOT" --project="$PROJECT" --region="$REGION" \
  --config="$ROOT/cloudbuild.question-studio-universal.yaml" \
  --ignore-file="$ROOT/Dockerfile.question-studio-worker.dockerignore" \
  --substitutions="_IMAGE=$IMAGE"
gcloud run deploy "$SERVICE" --project="$PROJECT" --region="$REGION" \
  --platform managed --image="$IMAGE" --service-account="$SA" \
  --memory=2Gi --cpu=1 --concurrency=1 --min-instances=0 --max-instances=1 \
  --timeout=180 --cpu-throttling \
  --set-secrets="QUESTION_STUDIO_WORKER_TOKEN=$TOKEN_SECRET:latest" \
  --allow-unauthenticated --quiet
URL="$(gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
[[ "$URL" == https://*.run.app ]] || { echo "FAIL: invalid Cloud Run worker URL" >&2; exit 1; }
curl -fsS --max-time 35 "$URL/health" >/dev/null
CODE="$(curl -sS --max-time 35 -o /dev/null -w '%{http_code}' \
  -X POST "$URL/internal/question-studio/universal/generate")"
[[ "$CODE" == 401 ]] || { echo "FAIL: worker accepted anonymous request: HTTP $CODE" >&2; exit 1; }
echo "PASS: isolated universal worker staging health and unauthorized request rejection"
echo "STAGING_URL: $URL"
echo "NOT DONE: all-package parity, 1/3/20-question performance, Cloud Tasks, API environment switch, Neon persistence, Cloudflare changes."
