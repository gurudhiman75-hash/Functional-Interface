#!/usr/bin/env bash
# Prepare a NO-AI, TAGGED, ZERO-TRAFFIC Cloud Run admin revision from reviewed New-main.
# Does not change public Cloud Run service URL traffic, Cloudflare, Render,
# Neon schema, payment callbacks or background schedules.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-api
API_SA=examtree-api-prod-runtime@sarbedutech.iam.gserviceaccount.com
WORKER_SECRET=examtree-question-studio-prod-worker-token
DB_SECRET=examtree-api-database-url
REGISTRY=examtree-workers
[[ "${EXAMTREE_BUDGET_READY:-}" == "yes" && "${EXAMTREE_PRODUCTION_ADMIN_CANARY_APPROVED:-}" == "yes" ]] || {
  echo "REFUSED: confirm budget and explicit zero-traffic admin canary approval first." >&2
  exit 2
}
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || {
  echo "REFUSED: gcloud project must be sarbedutech" >&2; exit 2;
}
[[ "$(git branch --show-current)" == "New-main" && -z "$(git status --porcelain --untracked-files=no)" ]] || {
  echo "REFUSED: use a clean New-main checkout" >&2; exit 2;
}
[[ "$(git rev-parse HEAD)" == "$(git rev-parse origin/New-main)" ]] || {
  echo "REFUSED: git pull --ff-only origin New-main first" >&2; exit 2;
}
for secret in "$WORKER_SECRET" "$DB_SECRET"; do
  if ! gcloud secrets describe "$secret" --project="$PROJECT" >/dev/null 2>&1; then
    echo "PENDING: missing secret $secret (no deployment performed)" >&2
    exit 2
  fi
  [[ -n "$(gcloud secrets versions list "$secret" --project="$PROJECT" --filter='state:enabled' --format='value(name)')" ]] || {
    echo "PENDING: enabled version missing for $secret" >&2; exit 2;
  }
done

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json > "$TMP/before.json"
python3 - "$TMP/before.json" <<'PY'
import json,sys
with open(sys.argv[1]) as f: s=json.load(f)
c=s['spec']['template']['spec']['containers'][0]
env={x['name']:x for x in c.get('env',[])}
def value(k):return env.get(k,{}).get('value')
def secret(k):return env.get(k,{}).get('valueFrom',{}).get('secretKeyRef',{}).get('name')
for k,v in {
 'EXAMTREE_API_RUNTIME':'cloud-run',
 'EXAMTREE_API_STAGING':'false',
 'EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER':'true',
 'EXAMTREE_SALES_DISABLED':'true',
 'EXAMTREE_PAYMENT_PROVIDER':'none',
 'GENERATION_JOB_WORKER_ENABLED':'false',
 'OUTBOX_PUBLISHER_ENABLED':'false',
 'FIREBASE_PROJECT_ID':'sarbedutech',
}.items(): assert value(k)==v,"unsafe production flag "+k
assert secret('DATABASE_URL')=='examtree-api-database-url'
assert all(x not in env for x in ('CASHFREE_CLIENT_ID','CASHFREE_CLIENT_SECRET','CASHFREE_ENV','OPENAI_API_KEY','AI_EXTRACTION_PROVIDER','AI_EXTRACTION_REQUIRED','OPENAI_EXTRACTION_REQUIRED'))
status=s['status']
old=status['latestReadyRevisionName']
assert old and old==status['latestCreatedRevisionName'],"revision not ready"
traffic=status.get('traffic',[])
assert sum(int(t.get('percent',0)) for t in traffic)==100
assert sum(int(t.get('percent',0)) for t in traffic if t.get('revisionName')==old)==100, "unexpected traffic split"
with open(sys.argv[1]+'.old','w') as out:out.write(old)
print("PASS: verified 100% of student traffic remains on the current healthy revision")
PY

for service in examtree-trg002-prod examtree-generation-prod; do
  gcloud run services describe "$service" --project="$PROJECT" --region="$REGION" --format=json > "$TMP/$service.json"
done
python3 - "$TMP/examtree-trg002-prod.json" "$TMP/examtree-generation-prod.json" <<'PY'
import json,sys
for fn in sys.argv[1:]:
 with open(fn) as f:s=json.load(f)
 assert s.get('status',{}).get('latestReadyRevisionName'),"worker has no ready revision"
 c=s['spec']['template']['spec']['containers'][0]
 refs={e['name']:e.get('valueFrom',{}).get('secretKeyRef',{}).get('name') for e in c.get('env',[])}
 assert refs.get('QUESTION_STUDIO_WORKER_TOKEN')=='examtree-question-studio-prod-worker-token'
 assert str(s.get('status',{}).get('url','')).startswith('https://')
print('PASS: dedicated production compute workers ready with matching token reference')
PY
TRG_URL="$(gcloud run services describe examtree-trg002-prod --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
SHARED_URL="$(gcloud run services describe examtree-generation-prod --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
[[ "$TRG_URL" == https://*.run.app && "$SHARED_URL" == https://*.run.app ]] || {
  echo "FAIL: production worker URLs invalid" >&2; exit 1;
}
gcloud secrets add-iam-policy-binding "$WORKER_SECRET" --project="$PROJECT" \
 --member="serviceAccount:$API_SA" --role=roles/secretmanager.secretAccessor >/dev/null
FULL_SHA="$(git rev-parse HEAD)"
IMAGE="$REGION-docker.pkg.dev/$PROJECT/$REGISTRY/examtree-api:$FULL_SHA"
gcloud builds submit "$ROOT" --project="$PROJECT" --region="$REGION" \
 --config="$ROOT/cloudbuild.examtree-cloudrun-api.yaml" \
 --ignore-file="$ROOT/Dockerfile.question-studio-worker.dockerignore" \
 --substitutions="_IMAGE=$IMAGE"

# gcloud --no-traffic freezes existing LATEST traffic on the previously
# serving revision and adds a tagged candidate accessible only by tag URL.
gcloud run deploy "$SERVICE" --project="$PROJECT" --region="$REGION" \
 --platform managed --image="$IMAGE" --service-account="$API_SA" \
 --no-traffic --tag=admin-candidate \
 --memory=2Gi --cpu=1 --concurrency=10 --min-instances=0 --max-instances=1 \
 --timeout=180 --cpu-throttling \
 --update-env-vars="EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER=false,EXAMTREE_ADMIN_DETERMINISTIC_ONLY=true,QUESTION_STUDIO_TRG002_WORKER_URL=$TRG_URL,QUESTION_STUDIO_SHARED_WORKER_URL=$SHARED_URL" \
 --update-secrets="QUESTION_STUDIO_WORKER_TOKEN=$WORKER_SECRET:latest" \
 --quiet
gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json > "$TMP/after.json"
CANDIDATE_URL="$(python3 - "$TMP/before.json.old" "$TMP/after.json" <<'PY'
import json,sys
with open(sys.argv[1]) as f: old=f.read().strip()
with open(sys.argv[2]) as f:s=json.load(f)
status=s['status']
latest=status.get('latestReadyRevisionName')
assert latest and latest!=old and latest==status.get('latestCreatedRevisionName')
traffic=status.get('traffic',[])
assert sum(int(t.get('percent',0)) for t in traffic if t.get('revisionName')==old)==100, "STOP: live student traffic changed"
assert sum(int(t.get('percent',0)) for t in traffic if t.get('revisionName')==latest)==0, "STOP: candidate unexpectedly serving traffic"
tag=next((t for t in traffic if t.get('tag')=='admin-candidate' and t.get('revisionName')==latest),None)
assert tag and str(tag.get('url','')).startswith('https://'),"candidate tag URL missing"
env={x['name']:x for x in s['spec']['template']['spec']['containers'][0]['env']}
assert env['EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER']['value']=='false'
assert env['EXAMTREE_SALES_DISABLED']['value']=='true'
assert env['EXAMTREE_PAYMENT_PROVIDER']['value']=='none'
assert env['GENERATION_JOB_WORKER_ENABLED']['value']=='false'
assert env['OUTBOX_PUBLISHER_ENABLED']['value']=='false'
assert 'OPENAI_API_KEY' not in env and 'AI_EXTRACTION_PROVIDER' not in env
assert env['EXAMTREE_ADMIN_DETERMINISTIC_ONLY']['value']=='true'
assert env['QUESTION_STUDIO_WORKER_TOKEN']['valueFrom']['secretKeyRef']['name']=='examtree-question-studio-prod-worker-token'
print(tag['url'])
PY
)"
[[ "$CANDIDATE_URL" == https://*.run.app ]] || {
  echo "FAIL: missing tagged admin URL" >&2; exit 1;
}
CODE="$(curl -sS --max-time 75 -o "$TMP/health" -w '%{http_code}' "$CANDIDATE_URL/health")"
[[ "$CODE" == 200 ]] || { echo "FAIL: candidate health HTTP $CODE" >&2; exit 1; }
CODE="$(curl -sS --max-time 75 -o "$TMP/finance" -w '%{http_code}' "$CANDIDATE_URL/api/admin/commerce/orders")"
python3 - "$TMP/finance" "$CODE" <<'PY'
import json,sys
with open(sys.argv[1]) as f:d=json.load(f)
assert sys.argv[2]=='503' and d.get('code')=='FINANCE_HANDLED_BY_RENDER_DURING_CUTOVER'
print("PASS: candidate refuses finance admin calls (Render remains owner)")
PY
CODE="$(curl -sS --max-time 90 -o "$TMP/auth" -w '%{http_code}' "$CANDIDATE_URL/api/admin/question-studio/capabilities")"
[[ "$CODE" == 401 ]] || { echo "FAIL: candidate admin auth barrier HTTP $CODE" >&2; exit 1; }
# No credential can be supplied at this stage; all unverified admin and
# AI-backed routes must be blocked even via the direct tagged run.app URL.
for path in /api/admin/notes-studio-v2/capabilities /api/admin/current-affairs /api/admin/students; do
  CODE="$(curl -sS --max-time 60 -o "$TMP/blocked" -w '%{http_code}' "$CANDIDATE_URL$path")"
  BLOCK_STATUS="$CODE" python3 - "$TMP/blocked" <<'PY'
import json,os,sys
with open(sys.argv[1]) as f:d=json.load(f)
assert os.environ['BLOCK_STATUS']=='503'
assert d.get('code')=='ADMIN_FEATURE_HANDLED_BY_RENDER_DURING_CUTOVER'
print('PASS: unverified admin / AI route blocked directly')
PY
done
CODE="$(curl -sS --max-time 75 -o "$TMP/products" -w '%{http_code}' "$CANDIDATE_URL/api/commerce/products")"
python3 - "$TMP/products" "$CODE" <<'PY'
import json,sys
with open(sys.argv[1]) as f:d=json.load(f)
assert sys.argv[2]=='200' and d.get('salesEnabled') is False and d.get('checkoutProvider')=='disabled'
print("PASS: tagged candidate student read works and sales are disabled")
PY
echo "PASS: NO-AI tagged admin candidate is ready with 0% public traffic."
echo "CANDIDATE_URL: $CANDIDATE_URL"
echo "NEXT: verify authorized admin token and deterministic Question Studio, confirm AI/Notes Studio is blocked directly, then decide promotion."
