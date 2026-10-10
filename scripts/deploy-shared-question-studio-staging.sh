#!/usr/bin/env bash
set -euo pipefail
# Manual staging deploy: retains the existing TRG-002 service and all Render
# environment variables. Do not run without a billing budget.
PROJECT="${1:-${GOOGLE_CLOUD_PROJECT:-}}"
REGION="asia-south1"
REGISTRY="examtree-workers"
SERVICE="examtree-generation-staging"
SECRET="examtree-trg002-worker-token"
SA_NAME="examtree-gen-runtime"
if [[ -z "$PROJECT" || ! "$PROJECT" =~ ^[a-z][a-z0-9-]{4,28}[a-z0-9]$ ]]; then
  echo "Usage: EXAMTREE_BUDGET_READY=yes bash scripts/deploy-shared-question-studio-staging.sh PROJECT_ID" >&2
  exit 2
fi
if [[ "${EXAMTREE_BUDGET_READY:-}" != "yes" ]]; then
  echo "Confirm Cloud Billing budget/alerts before starting, then set EXAMTREE_BUDGET_READY=yes." >&2
  exit 2
fi
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
gcloud config set project "$PROJECT"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com --project "$PROJECT"
# Reuse only EXISTING project resources from the already verified TRG-002
# service. Fail closed rather than provisioning unbudgeted accounts or keys.
gcloud artifacts repositories describe "$REGISTRY" --location="$REGION" --project="$PROJECT" >/dev/null
SA_EMAIL="$SA_NAME@$PROJECT.iam.gserviceaccount.com"
gcloud iam service-accounts describe "$SA_EMAIL" --project="$PROJECT" >/dev/null
gcloud secrets describe "$SECRET" --project="$PROJECT" >/dev/null
gcloud secrets add-iam-policy-binding "$SECRET" --member="serviceAccount:$SA_EMAIL" --role="roles/secretmanager.secretAccessor" --project="$PROJECT" >/dev/null

VERSION="$(git rev-parse --short HEAD)"
echo "Building $SERVICE from commit $(git rev-parse HEAD) in project $PROJECT ($REGION)"
IMAGE="$REGION-docker.pkg.dev/$PROJECT/$REGISTRY/generation-worker:$VERSION"
gcloud builds submit "$ROOT" --project "$PROJECT" --region "$REGION" \
  --config "$ROOT/cloudbuild.question-studio-shared.yaml" \
  --ignore-file "$ROOT/Dockerfile.question-studio-worker.dockerignore" \
  --substitutions="_IMAGE=$IMAGE"

gcloud run deploy "$SERVICE" --project "$PROJECT" --region "$REGION" \
  --platform managed --image "$IMAGE" --service-account "$SA_EMAIL" \
  --memory 2Gi --cpu 1 --concurrency 1 --min-instances 0 --max-instances 1 \
  --timeout 180 --cpu-throttling \
  --set-secrets="QUESTION_STUDIO_WORKER_TOKEN=$SECRET:latest" \
  --allow-unauthenticated --quiet

URL="$(gcloud run services describe "$SERVICE" --project "$PROJECT" --region "$REGION" --format='value(status.url)')"
[[ "$URL" == https://* ]] || { echo "Invalid Cloud Run URL" >&2; exit 1; }
curl --fail --silent --show-error --max-time 30 "$URL/health" >/dev/null
UNAUTH="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' --max-time 30 \
  --request POST "$URL/internal/question-studio/generate")"
[[ "$UNAUTH" == "401" ]] || { echo "Shared worker authentication check failed: $UNAUTH" >&2; exit 1; }

TOKEN="$(gcloud secrets versions access latest --secret="$SECRET" --project="$PROJECT")"
RESULT="$(mktemp)"
trap 'rm -f "$RESULT"; unset TOKEN' EXIT

for PKG in TRG-002 NUM-001; do
  for COUNT in 1 3; do
    if [[ "$PKG" == "TRG-002" ]]; then
      TOPIC="Advanced Mathematics"
      SUBTOPIC="Trigonometry — Heights & Distances"
      CP='TRG-CP-007'
      MODE="RELEASED"
    else
      TOPIC="Arithmetic"
      SUBTOPIC="Number System"
      CP='NUM-CP-001'
      MODE="QUESTION_STUDIO_ACTIVE"
    fi
    BODY="$(PKG="$PKG" COUNT="$COUNT" TOPIC="$TOPIC" SUBTOPIC="$SUBTOPIC" CP="$CP" MODE="$MODE" python3 - <<'PY'
import json, os
print(json.dumps({
  "request": {
    "engineId":"quant-v4", "packageId":os.environ["PKG"],
    "count":int(os.environ["COUNT"]), "exam":"SSC CGL Tier 1",
    "subject":"Quantitative Aptitude", "topic":os.environ["TOPIC"],
    "subtopic":os.environ["SUBTOPIC"], "language":"en",
    "difficulty":"Mixed" if os.environ["PKG"]=="NUM-001" else "Medium",
    "runtimeMode":os.environ["MODE"],
    "seed":"shared-worker-smoke-"+os.environ["PKG"]+"-"+os.environ["COUNT"]
  },
  "selectedCpIds":[os.environ["CP"]],
  "count":int(os.environ["COUNT"])
}))
PY
)"
    if ! curl --fail-with-body --silent --show-error --max-time 165 \
      --header "Content-Type: application/json" \
      --header "X-Examtree-Worker-Token: $TOKEN" \
      --data "$BODY" --output "$RESULT" "$URL/internal/question-studio/generate"; then
      # curl --output writes even non-2xx JSON responses. Report the safe error
      # code and message, never the token or the full question payload.
      python3 - "$RESULT" "$COUNT" "$PKG" <<'PYERROR'
import json, sys
try:
    with open(sys.argv[1], encoding="utf-8") as stream:
        result = json.load(stream)
    print(f"FAILED: {sys.argv[3]} ({sys.argv[2]} questions): "
          f"{result.get('code','UNKNOWN')}: {result.get('error','unknown error')}", file=sys.stderr)
except (OSError, ValueError) as exc:
    print(f"FAILED: {sys.argv[3]} ({sys.argv[2]} questions); non-JSON upstream error: {type(exc).__name__}", file=sys.stderr)
PYERROR
      exit 1
    fi
    python3 - "$RESULT" "$COUNT" "$PKG" <<'PY'
import json, sys
with open(sys.argv[1], encoding="utf-8") as source:
  reply=json.load(source)
questions=reply.get("batch",{}).get("questions",[])
count=int(sys.argv[2])
assert reply.get("ok") is True and isinstance(questions,list) and len(questions)==count, "Wrong generation count"
for question in questions:
  assert question.get("questionBankWritable") is not True or sys.argv[3]=="TRG-002", "NUM-001 review-only gate violated"
print(f"PASS: {sys.argv[3]} generated {count} questions")
PY
  done
done
echo "SHARED STAGING READY: $URL"
echo "Render remains unchanged. Do not paste the secret into chat."
echo "Check Artifact Registry total image storage before increasing rollout."
