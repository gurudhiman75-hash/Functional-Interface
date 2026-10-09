#!/usr/bin/env bash
set -euo pipefail

# Examtree Cloud Run staging compute deployment. Nothing runs automatically.
# Set Cloud Billing budget and spend cap where eligible before running.
PROJECT="${1:-${GOOGLE_CLOUD_PROJECT:-}}"
REGION="asia-south1"
REGISTRY="examtree-workers"
SERVICE="examtree-trg002-staging"
SECRET="examtree-trg002-worker-token"
SA_NAME="examtree-gen-runtime"

if [[ -z "$PROJECT" || ! "$PROJECT" =~ ^[a-z][a-z0-9-]{4,28}[a-z0-9]$ ]]; then
  echo "Usage: EXAMTREE_BUDGET_READY=yes bash scripts/deploy-trg002-cloudrun-staging.sh PROJECT_ID" >&2
  exit 2
fi
if [[ "${EXAMTREE_BUDGET_READY:-}" != "yes" ]]; then
  echo "Create a billing budget/alerts first, then set EXAMTREE_BUDGET_READY=yes." >&2
  echo "https://console.cloud.google.com/billing" >&2
  exit 2
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
gcloud config set project "$PROJECT"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
  artifactregistry.googleapis.com secretmanager.googleapis.com --project "$PROJECT"

if ! gcloud artifacts repositories describe "$REGISTRY" --location "$REGION" --project "$PROJECT" >/dev/null 2>&1; then
  gcloud artifacts repositories create "$REGISTRY" --repository-format=docker \
    --location "$REGION" --description="Examtree question-generation worker images" --project "$PROJECT"
fi
SA_EMAIL="$SA_NAME@$PROJECT.iam.gserviceaccount.com"
if ! gcloud iam service-accounts describe "$SA_EMAIL" --project "$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$SA_NAME" \
    --display-name="Examtree isolated generation" --project "$PROJECT"
fi
if ! gcloud secrets describe "$SECRET" --project "$PROJECT" >/dev/null 2>&1; then
  # Token is never printed or committed.
  openssl rand -hex 32 | tr -d '\n' | \
    gcloud secrets create "$SECRET" --replication-policy=automatic \
      --data-file=- --project "$PROJECT"
fi
gcloud secrets add-iam-policy-binding "$SECRET" \
  --member="serviceAccount:$SA_EMAIL" --role="roles/secretmanager.secretAccessor" \
  --project "$PROJECT" >/dev/null

VERSION="$(git rev-parse --short HEAD)"
IMAGE="$REGION-docker.pkg.dev/$PROJECT/$REGISTRY/trg002-worker:$VERSION"
gcloud builds submit "$ROOT" --project "$PROJECT" --region "$REGION" \
  --config "$ROOT/cloudbuild.trg002.yaml" \
  --ignore-file "$ROOT/Dockerfile.question-studio-worker.dockerignore" \
  --substitutions="_IMAGE=$IMAGE"

# The generation route uses its own 64-character random token over TLS.
# Public ingress is deliberately enabled only for this authenticated endpoint.
gcloud run deploy "$SERVICE" --project "$PROJECT" --region "$REGION" \
  --platform managed --image "$IMAGE" --service-account "$SA_EMAIL" \
  --memory 2Gi --cpu 1 --concurrency 1 --min-instances 0 --max-instances 1 \
  --timeout 180 --cpu-throttling \
  --set-secrets="QUESTION_STUDIO_WORKER_TOKEN=$SECRET:latest" \
  --allow-unauthenticated --quiet

URL="$(gcloud run services describe "$SERVICE" --project "$PROJECT" \
  --region "$REGION" --format='value(status.url)')"
[[ "$URL" == https://* ]] || { echo "Invalid Cloud Run URL" >&2; exit 1; }

curl --fail --silent --show-error --max-time 30 "$URL/health" >/dev/null
UNAUTH="$(curl --silent --show-error --output /dev/null \
  --write-out '%{http_code}' --max-time 30 --request POST "$URL/internal/trg002/generate")"
[[ "$UNAUTH" == "401" ]] || { echo "Worker authentication check failed: $UNAUTH" >&2; exit 1; }

TOKEN="$(gcloud secrets versions access latest --secret="$SECRET" --project "$PROJECT")"
RESULT="$(mktemp)"
trap 'rm -f "$RESULT"; unset TOKEN' EXIT

for COUNT in 1 3; do
  BODY="$(printf '{"request":{"engineId":"quant-v4","packageId":"TRG-002","count":%s,"exam":"SSC CGL Tier 1","subject":"Quantitative Aptitude","topic":"Advanced Mathematics","subtopic":"Trigonometry — Heights & Distances","language":"en","difficulty":"Medium","seed":"trg002-staging-smoke-%s"},"selectedCpIds":[],"count":%s}' "$COUNT" "$COUNT" "$COUNT")"
  curl --fail-with-body --silent --show-error --max-time 165 \
    --header "Content-Type: application/json" \
    --header "X-Examtree-Worker-Token: $TOKEN" \
    --data "$BODY" --output "$RESULT" "$URL/internal/trg002/generate"
  python3 - "$RESULT" "$COUNT" <<'PY'
import json, sys
with open(sys.argv[1], encoding="utf-8") as stream:
    reply = json.load(stream)
questions = reply.get("batch", {}).get("questions", [])
count = int(sys.argv[2])
assert reply.get("ok") is True and isinstance(questions, list) and len(questions) == count, "Generation failed"
print(f"PASS: generated {count} questions")
PY
done

echo "STAGING READY: $URL"
echo "Production Render API remains unchanged. Do NOT paste the secret into chat."
