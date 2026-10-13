#!/usr/bin/env bash
# Deploy the updated NUM-001 source-policy universal worker as a NEW
# zero-traffic tagged revision of the EXISTING STAGING service. The serving
# revision retains 100% traffic. Never deploy to production from this script.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-universal-staging
REGISTRY=examtree-workers
TOKEN_SECRET=examtree-trg002-worker-token
SA=examtree-gen-runtime@$PROJECT.iam.gserviceaccount.com
TAG=numfix
# Cloud Run constrains the combined service name and tag to 46 characters.
# Check this before ANY billed Cloud Build work starts.
if (( ${#SERVICE} + ${#TAG} > 46 )); then
  echo "REFUSED: Cloud Run service+tag length exceeds 46 characters." >&2
  exit 2
fi

[[ "${EXAMTREE_BUDGET_READY:-}" == "yes" && "${EXAMTREE_UNIVERSAL_STAGING_NUM_CONTRACT_APPROVED:-}" == "yes" ]] || {
 echo "REFUSED: review billing and explicitly approve the NUM-contract staging candidate" >&2
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
assert ready, "no ready staging revision exists"
# A previous Cloud Run API validation error can leave the latest-created
# revision unready. The serving revision and traffic are the safety authority.
traffic=status.get('traffic',[])
assert sum(int(x.get('percent',0)) for x in traffic)==100,"staging traffic incomplete"
serving=[x for x in traffic if int(x.get('percent',0))==100]
assert len(serving)==1 and serving[0].get('revisionName'),"exactly one 100%-serving staging revision is required"
assert sum(int(x.get('percent',0)) for x in traffic if x.get('revisionName')!=serving[0]['revisionName'])==0,"unexpected traffic split"
assert not any(x.get('tag')=='numfix' for x in traffic),"num-contract-candidate already exists: inspect manually"
assert any(x.get('tag')=='fix-candidate' and int(x.get('percent',0))==0 for x in traffic),"previous tested fix-candidate tag missing"
old=serving[0]['revisionName']
spec=s['spec']['template']['spec']
container=spec['containers'][0]
assert spec.get('serviceAccountName')=='examtree-gen-runtime@sarbedutech.iam.gserviceaccount.com'
env={x['name']:x for x in container.get('env',[])}
assert env.get('QUESTION_STUDIO_WORKER_TOKEN',{}).get('valueFrom',{}).get('secretKeyRef',{}).get('name')=='examtree-trg002-worker-token'
assert not any(k in env for k in ('DATABASE_URL','OPENAI_API_KEY','CASHFREE_CLIENT_SECRET','FIREBASE_PRIVATE_KEY'))
with open(sys.argv[1]+'.rev','w') as f:f.write(old)
print("PASS: verified old revision serves 100%; existing fix-candidate remains at 0%")
PY
SHA="$(git rev-parse HEAD)"
REUSE_SHA="${EXAMTREE_UNIVERSAL_REUSE_IMAGE_SHA:-}"
if [[ -n "$REUSE_SHA" ]]; then
  [[ "$REUSE_SHA" =~ ^[0-9a-f]{40}$ ]] || { echo "REFUSED: invalid prebuilt image commit SHA" >&2; exit 2; }
  git merge-base --is-ancestor "$REUSE_SHA" HEAD || {
    echo "REFUSED: prebuilt image source is not an ancestor of current New-main" >&2; exit 2;
  }
  SHA="$REUSE_SHA"
fi
IMAGE="$REGION-docker.pkg.dev/$PROJECT/$REGISTRY/examtree-universal-staging:$SHA"
if [[ -n "$REUSE_SHA" ]]; then
  # Cloud Build already completed for this source. Do not build again.
  gcloud artifacts docker images describe "$IMAGE" --project="$PROJECT" --format='value(image_summary.digest)' >/dev/null
  echo "PASS: verified prebuilt Artifact Registry image; skipping Cloud Build."
else
  gcloud builds submit "$ROOT" --project="$PROJECT" --region="$REGION" \
   --config="$ROOT/cloudbuild.question-studio-universal.yaml" \
   --ignore-file="$ROOT/Dockerfile.question-studio-worker.dockerignore" \
   --substitutions="_IMAGE=$IMAGE"
fi
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
assert ready and ready!=old and ready==status.get('latestCreatedRevisionName'),"NUM-contract candidate revision not ready"
traffic=status.get('traffic',[])
assert sum(int(x.get('percent',0)) for x in traffic if x.get('revisionName')==old)==100,"FAIL: old staging traffic was moved"
assert sum(int(x.get('percent',0)) for x in traffic if x.get('revisionName')==ready)==0,"FAIL: candidate unexpectedly serving traffic"
tag=next((x for x in traffic if x.get('tag')=='numfix' and x.get('revisionName')==ready),None)
assert tag and tag.get('url','').startswith('https://'),"tagged candidate URL missing"
print(tag['url'])
PY
)"
curl -fsS --max-time 35 "$CANDIDATE_URL/health" > "$TMP/health"
CODE="$(curl -sS --max-time 35 -o /dev/null -w '%{http_code}' -X POST "$CANDIDATE_URL/internal/question-studio/universal/generate")"
[[ "$CODE" == 401 ]] || { echo "FAIL: candidate generation did not reject anonymous request (HTTP $CODE)" >&2; exit 1; }
echo "PASS: NUM-contract candidate deployed healthy at 0%; original staging revision retains 100%."
echo "Next command (compute-only 7 cases, never saves to Neon):"
echo "EXAMTREE_BUDGET_READY=yes EXAMTREE_UNIVERSAL_STAGING_CHECK_APPROVED=yes EXAMTREE_UNIVERSAL_STAGING_TAG=numfix bash scripts/verify-question-studio-universal-staging.sh"
