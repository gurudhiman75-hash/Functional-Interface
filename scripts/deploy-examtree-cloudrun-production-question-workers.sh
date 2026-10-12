#!/usr/bin/env bash
# Deploy isolated PRODUCTION Question Studio compute (no Neon credentials).
# Does NOT change API traffic, Cloudflare, Render, payment keys, or schedulers.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
REGISTRY=examtree-workers
SERVICE_ACCOUNT=examtree-gen-prod-runtime
SECRET=examtree-question-studio-prod-worker-token
[[ "${EXAMTREE_BUDGET_READY:-}" == "yes" && "${EXAMTREE_PRODUCTION_WORKERS_APPROVED:-}" == "yes" ]] || {
  echo "REFUSED: confirm budget and explicit production worker approval first." >&2
  exit 2
}
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
[[ "$(git branch --show-current)" == "New-main" && -z "$(git status --porcelain --untracked-files=no)" ]] || {
  echo "REFUSED: use clean New-main" >&2; exit 2;
}
[[ "$(git rev-parse HEAD)" == "$(git rev-parse origin/New-main)" ]] || {
  echo "REFUSED: git pull --ff-only origin New-main first" >&2; exit 2;
}
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || {
  echo "REFUSED: gcloud project must be sarbedutech" >&2; exit 2;
}
gcloud artifacts repositories describe "$REGISTRY" --location="$REGION" --project="$PROJECT" >/dev/null
SA="$SERVICE_ACCOUNT@$PROJECT.iam.gserviceaccount.com"
for service in examtree-trg002-prod examtree-generation-prod; do
  if gcloud run services describe "$service" --project="$PROJECT" --region="$REGION" >/dev/null 2>&1; then
    echo "REFUSED: production worker $service already exists. Verify it before changing." >&2
    exit 2
  fi
done
if ! gcloud iam service-accounts describe "$SA" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$SERVICE_ACCOUNT" --project="$PROJECT" \
    --display-name="Examtree dedicated production generation workers" >/dev/null
fi
if ! gcloud secrets describe "$SECRET" --project="$PROJECT" >/dev/null 2>&1; then
  # No key appears in the shell command line, logs, Git or chat.
  openssl rand -hex 32 | tr -d '\n' | gcloud secrets create "$SECRET" \
    --project="$PROJECT" --replication-policy=automatic --data-file=- >/dev/null
fi
[[ -n "$(gcloud secrets versions list "$SECRET" --project="$PROJECT" --filter='state:enabled' --format='value(name)')" ]] || {
  echo "REFUSED: production worker secret lacks an enabled version" >&2; exit 2;
}
gcloud secrets add-iam-policy-binding "$SECRET" --project="$PROJECT" \
  --member="serviceAccount:$SA" --role=roles/secretmanager.secretAccessor >/dev/null

SHA="$(git rev-parse HEAD)"
TMP="$(mktemp -d)"
umask 077
cleanup(){ rm -rf "$TMP"; unset TOKEN; }
trap cleanup EXIT
for kind in trg002 shared; do
  if [[ "$kind" == "trg002" ]]; then
    SERVICE=examtree-trg002-prod
    CONFIG=cloudbuild.trg002.yaml
    IMAGE="$REGION-docker.pkg.dev/$PROJECT/$REGISTRY/examtree-trg002-prod:$SHA"
    ENDPOINT=/internal/trg002/generate
  else
    SERVICE=examtree-generation-prod
    CONFIG=cloudbuild.question-studio-shared.yaml
    IMAGE="$REGION-docker.pkg.dev/$PROJECT/$REGISTRY/examtree-generation-prod:$SHA"
    ENDPOINT=/internal/question-studio/generate
  fi
  echo "BUILD: $SERVICE from approved commit ${SHA:0:12}"
  gcloud builds submit "$ROOT" --project="$PROJECT" --region="$REGION" \
    --config="$ROOT/$CONFIG" \
    --ignore-file="$ROOT/Dockerfile.question-studio-worker.dockerignore" \
    --substitutions="_IMAGE=$IMAGE"
  gcloud run deploy "$SERVICE" --project="$PROJECT" --region="$REGION" \
    --platform managed --image="$IMAGE" --service-account="$SA" \
    --memory=2Gi --cpu=1 --concurrency=1 --min-instances=0 --max-instances=1 \
    --timeout=180 --cpu-throttling \
    --set-secrets="QUESTION_STUDIO_WORKER_TOKEN=$SECRET:latest" \
    --allow-unauthenticated --quiet
  URL="$(gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
  [[ "$URL" == https://*.run.app ]] || { echo "FAIL: invalid worker URL" >&2; exit 1; }
  curl -fsS --max-time 30 "$URL/health" >/dev/null
  UNAUTH="$(curl -sS --max-time 30 -o /dev/null -w '%{http_code}' -X POST "$URL$ENDPOINT")"
  [[ "$UNAUTH" == "401" ]] || { echo "FAIL: worker did not reject missing token (HTTP $UNAUTH)" >&2; exit 1; }
  echo "PASS: $SERVICE health and unauthorized request rejection"
done

# Run non-persistent deterministic compute only: no DB access or publication.
TOKEN="$(gcloud secrets versions access latest --secret="$SECRET" --project="$PROJECT")"
for service in examtree-trg002-prod examtree-generation-prod; do
  URL="$(gcloud run services describe "$service" --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
  if [[ "$service" == "examtree-trg002-prod" ]]; then
    ENDPOINT=/internal/trg002/generate
    PACKAGES=(TRG-002)
  else
    ENDPOINT=/internal/question-studio/generate
    PACKAGES=(TRG-002 NUM-001)
  fi
  for package in "${PACKAGES[@]}"; do
    for count in 1 3; do
      PACKAGE="$package" COUNT="$count" python3 - > "$TMP/request.json" <<'PY'
import json,os
p=os.environ["PACKAGE"]
trg=p=="TRG-002"
print(json.dumps({
    "request":{
        "engineId":"quant-v4","packageId":p,
        "count":int(os.environ["COUNT"]),"exam":"SSC CGL Tier 1",
        "subject":"Quantitative Aptitude",
        "topic":"Advanced Mathematics" if trg else "Arithmetic",
        "subtopic":"Trigonometry — Heights & Distances" if trg else "Number System",
        "language":"en","difficulty":"Medium" if trg else "Mixed",
        "runtimeMode":"RELEASED" if trg else "QUESTION_STUDIO_ACTIVE",
        "seed":"prod-worker-readonly-"+p+"-"+os.environ["COUNT"]
    },
    "selectedCpIds":["TRG-CP-007" if trg else "NUM-CP-001"],
    "count":int(os.environ["COUNT"])
}))
PY
      curl --fail-with-body -sS --max-time 170 \
        -H "Content-Type: application/json" \
        -H "X-Examtree-Worker-Token: $TOKEN" \
        --data-binary "@$TMP/request.json" -o "$TMP/result.json" "$URL$ENDPOINT"
      PACKAGE="$package" COUNT="$count" python3 - "$TMP/result.json" <<'PY'
import json,os,sys
with open(sys.argv[1]) as f:
    r=json.load(f)
count=int(os.environ["COUNT"])
qs=r.get("batch",{}).get("questions",[])
assert r.get("ok") is True and len(qs)==count,"Worker returned incorrect count"
if os.environ["PACKAGE"]=="NUM-001":
    assert all(q.get("questionBankWritable") is False and q.get("testEligible") is False for q in qs)
print("PASS:",os.environ["PACKAGE"],count,"generated safely (worker only)")
PY
    done
  done
done
echo "PASS: production compute workers ready; no API or Cloudflare changes."
echo "NEXT: admin canary deployment (requires existing OpenAI key in Secret Manager)."
