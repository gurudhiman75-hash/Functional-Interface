#!/usr/bin/env bash
# Deploy only examtree-universal-staging as a zero-traffic Cloud Run candidate.
# Never change live API, Pages, Neon, Cloud Tasks state, worker traffic or IAM.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-universal-staging
REGISTRY=examtree-workers
SA=examtree-gen-runtime@sarbedutech.iam.gserviceaccount.com
TAG=qs197
MODE="$(printenv MODE || echo check)"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
die(){ echo "STOP: $*" >&2; exit 2; }
[[ "$MODE" == check || "$MODE" == deploy ]] || die "MODE must be check or deploy"
[[ "$(expr length "$SERVICE$TAG")" -le 46 ]] || die "Cloud Run tag limit"
[[ "$(git branch --show-current)" == New-main ]] || die "Checkout New-main"
[[ -z "$(git status --porcelain)" ]] || die "Working tree must be clean"
[[ "$(git rev-parse HEAD)" == "$(git rev-parse origin/New-main)" ]] || die "Fetch/pull New-main"
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || die "Select project sarbedutech"
gcloud artifacts repositories describe "$REGISTRY" --project="$PROJECT" --location="$REGION" >/dev/null
gcloud iam service-accounts describe "$SA" --project="$PROJECT" >/dev/null
gcloud secrets describe examtree-trg002-worker-token --project="$PROJECT" >/dev/null
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json > "$TMP/before.json"
gcloud tasks queues describe examtree-qs-staging --project="$PROJECT" --location="$REGION" --format=json > "$TMP/queue.json"
python3 - "$TMP/before.json" "$TMP/queue.json" "$TAG" <<'PY'
import json,sys
s=json.load(open(sys.argv[1]));q=json.load(open(sys.argv[2]))
assert q.get("state")=="PAUSED","staging Cloud Tasks queue must remain paused"
traffic=s.get("status",{}).get("traffic",[])
assert sum(int(x.get("percent",0)) for x in traffic)==100,"traffic total not 100%"
old=[x for x in traffic if int(x.get("percent",0))==100]
assert len(old)==1 and old[0].get("revisionName"),"require one 100%-serving revision"
assert not any(x.get("tag")==sys.argv[3] for x in traffic),"candidate tag already exists"
spec=s["spec"]["template"]["spec"]
assert spec.get("serviceAccountName")=="examtree-gen-runtime@sarbedutech.iam.gserviceaccount.com","wrong service account"
env={x.get("name"):x for x in spec["containers"][0].get("env",[])}
secret=env.get("QUESTION_STUDIO_WORKER_TOKEN",{}).get("valueFrom",{}).get("secretKeyRef",{})
assert secret.get("name")=="examtree-trg002-worker-token","wrong worker secret"
assert not any(x in env for x in ("DATABASE_URL","OPENAI_API_KEY","CASHFREE_CLIENT_SECRET","FIREBASE_PRIVATE_KEY")),"forbidden worker secret present"
open(sys.argv[1]+".oldrev","w").write(old[0]["revisionName"])
print("PASS: 100% old traffic, paused queue, safe identity and worker secret")
PY
if [[ "$MODE" == check ]]; then echo "CHECK ONLY: no changes made"; exit 0; fi
[[ "$(printenv EXAMTREE_BUDGET_READY || true)" == yes && "$(printenv EXAMTREE_UNIVERSAL_197_STAGING_APPROVED || true)" == yes ]] || die "Budget review and explicit staging approval required"
SHA="$(git rev-parse HEAD)"
IMAGE="$REGION-docker.pkg.dev/$PROJECT/$REGISTRY/examtree-universal-staging:$SHA"
gcloud builds submit "$ROOT" --project="$PROJECT" --region="$REGION" \
  --config="$ROOT/cloudbuild.question-studio-universal.yaml" \
  --ignore-file="$ROOT/Dockerfile.question-studio-worker.dockerignore" \
  --substitutions="_IMAGE=$IMAGE"
gcloud run deploy "$SERVICE" --project="$PROJECT" --region="$REGION" --platform=managed \
  --image="$IMAGE" --service-account="$SA" --no-traffic --tag="$TAG" \
  --memory=2Gi --cpu=1 --concurrency=1 --min-instances=0 --max-instances=1 \
  --timeout=180 --cpu-throttling --quiet
gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json > "$TMP/after.json"
URL="$(python3 - "$TMP/before.json.oldrev" "$TMP/after.json" "$TAG" <<'PY'
import json,sys
old=open(sys.argv[1]).read().strip();s=json.load(open(sys.argv[2]))
state=s.get("status",{});ready=state.get("latestReadyRevisionName")
assert ready and ready!=old and ready==state.get("latestCreatedRevisionName"),"candidate not ready"
traffic=state.get("traffic",[])
assert sum(int(x.get("percent",0)) for x in traffic if x.get("revisionName")==old)==100,"previous staging traffic changed"
assert sum(int(x.get("percent",0)) for x in traffic if x.get("revisionName")==ready)==0,"candidate is unexpectedly serving"
cand=[x for x in traffic if x.get("tag")==sys.argv[3] and x.get("revisionName")==ready]
assert len(cand)==1 and cand[0].get("url","").startswith("https://"),"candidate URL missing"
print(cand[0]["url"])
PY
)"
CODE="$(curl -sS --max-time 45 -o /dev/null -w '%{http_code}' "$URL/health")"
[[ "$CODE" == 200 ]] || die "candidate health not 200"
CODE="$(curl -sS --max-time 45 -X POST -o /dev/null -w '%{http_code}' "$URL/internal/question-studio/universal/generate")"
[[ "$CODE" == 401 ]] || die "anonymous generate not rejected"
echo "PASS: new 197-package worker candidate READY at 0% staging traffic; previous revision still 100%"
echo "NO API, production, queue, DB, frontend, or traffic changes"
