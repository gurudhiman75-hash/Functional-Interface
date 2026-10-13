#!/usr/bin/env bash
# Upgrade EXISTING Examtree universal staging worker as a tagged ZERO-TRAFFIC
# candidate. Retain the current working service revision until all 6 staging
# acceptance cases pass. Does not touch production API/finance/Neon/Cloudflare.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-universal-staging
REGISTRY=examtree-workers
TOKEN_SECRET=examtree-trg002-worker-token
SA=examtree-gen-runtime@$PROJECT.iam.gserviceaccount.com
TAG=fix-candidate

[[ "${EXAMTREE_BUDGET_READY:-}" == "yes" && "${EXAMTREE_UNIVERSAL_STAGING_FIX_APPROVED:-}" == "yes" ]] || {
 echo "REFUSED: review billing and approve an isolated staging fix candidate" >&2
 exit 2
}
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
[[ "$(git branch --show-current)" == "New-main" && -z "$(git status --porcelain --untracked-files=no)" ]] || {
 echo "REFUSED: clean New-main required" >&2; exit 2
}
[[ "$(git rev-parse HEAD)" == "$(git rev-parse origin/New-main)" ]] || {
 echo "REFUSED: pull current origin/New-main" >&2; exit 2
}
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || {
 echo "REFUSED: incorrect gcloud project" >&2; exit 2
}
gcloud artifacts repositories describe "$REGISTRY" --project="$PROJECT" --location="$REGION" >/dev/null
gcloud iam service-accounts describe "$SA" --project="$PROJECT" >/dev/null
gcloud secrets describe "$TOKEN_SECRET" --project="$PROJECT" >/dev/null
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json > "$TMP/before.json"
python3 - "$TMP/before.json" <<'PY'
import json,sys
with open(sys.argv[1]) as f:s=json.load(f)
status=s['status']
ready=status.get('latestReadyRevisionName')
assert ready and ready==status.get('latestCreatedRevisionName'), "old staging revision not ready"
traffic=status.get('traffic',[])
assert sum(int(x.get('percent',0)) for x in traffic)==100,"staging traffic incomplete"
assert sum(int(x.get('percent',0)) for x in traffic if x.get('revisionName')==ready)==100,"staging service has unexpected existing split"
assert not any(x.get('tag')=='fix-candidate' for x in traffic),"fix-candidate tag already exists: inspect manually"
spec=s['spec']['template']['spec']
container=spec['containers'][0]
assert spec.get('serviceAccountName')=='examtree-gen-runtime@sarbedutech.iam.gserviceaccount.com'
env={x['name']:x for x in container.get('env',[])}
assert env.get('QUESTION_STUDIO_WORKER_TOKEN',{}).get('valueFrom',{}).get('secretKeyRef',{}).get('name')=='examtree-trg002-worker-token'
assert not any(k in env for k in ('DATABASE_URL','OPENAI_API_KEY','CASHFREE_CLIENT_SECRET','FIREBASE_PRIVATE_KEY'))
with open(sys.argv[1]+'.rev','w') as f:f.write(ready)
print("PASS: verified existing staging revision and 100% traffic preservation prerequisite")
PY
SHA="$(git rev-parse HEAD)"
IMAGE="$REGION-docker.pkg.dev/$PROJECT/$REGISTRY/examtree-universal-staging:$SHA"
gcloud builds submit "$ROOT" --project="$PROJECT" --region="$REGION" \
 --config="$ROOT/cloudbuild.question-studio-universal.yaml" \
 --ignore-file="$ROOT/Dockerfile.question-studio-worker.dockerignore" \
 --substitutions="_IMAGE=$IMAGE"
gcloud run deploy "$SERVICE" --project="$PROJECT" --region="$REGION" \
 --platform managed --image="$IMAGE" --service-account="$SA" \
 --no-traffic --tag="$TAG" \
 --memory=2Gi --cpu=1 --concurrency=1 --min-instances=0 --max-instances=1 \
 --timeout=180 --cpu-throttling \
 --update-secrets="QUESTION_STUDIO_WORKER_TOKEN=$TOKEN_SECRET:latest" \
 --allow-unauthenticated --quiet
gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json > "$TMP/after.json"
CANDIDATE_URL="$(python3 - "$TMP/before.json.rev" "$TMP/after.json" <<'PY'
import json,sys
with open(sys.argv[1]) as f:old=f.read().strip()
with open(sys.argv[2]) as f:s=json.load(f)
status=s['status']
ready=status.get('latestReadyRevisionName')
assert ready and ready!=old and ready==status.get('latestCreatedRevisionName'),"candidate revision not ready"
traffic=status.get('traffic',[])
assert sum(int(x.get('percent',0)) for x in traffic if x.get('revisionName')==old)==100,"FAIL: old staging traffic was moved"
assert sum(int(x.get('percent',0)) for x in traffic if x.get('revisionName')==ready)==0,"FAIL: candidate unexpectedly serving traffic"
tag=next((x for x in traffic if x.get('tag')=='fix-candidate' and x.get('revisionName')==ready),None)
assert tag and tag.get('url','').startswith('https://'),"tagged candidate URL missing"
print(tag['url'])
PY
)"
curl -fsS --max-time 35 "$CANDIDATE_URL/health" > "$TMP/health"
CODE="$(curl -sS --max-time 35 -o /dev/null -w '%{http_code}' -X POST "$CANDIDATE_URL/internal/question-studio/universal/generate")"
[[ "$CODE" == 401 ]] || { echo "FAIL: candidate generation did not reject anonymous request (HTTP $CODE)" >&2; exit 1; }
echo "PASS: fix candidate deployed and healthy at 0% staging traffic; existing revision retains 100%."
echo "Next command (compute-only 6 cases, never saves to Neon):"
echo "EXAMTREE_BUDGET_READY=yes EXAMTREE_UNIVERSAL_STAGING_CHECK_APPROVED=yes EXAMTREE_UNIVERSAL_STAGING_TAG=fix-candidate bash scripts/verify-question-studio-universal-staging.sh"
