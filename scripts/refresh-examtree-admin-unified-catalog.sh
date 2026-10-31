#!/usr/bin/env bash
# Refresh the admin-only Cloud Run tagged revision for the full four-engine
# Question Studio catalogue. Never changes normal student traffic or finance.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-api
REPO_IMAGE="$REGION-docker.pkg.dev/$PROJECT/examtree-workers/examtree-api"
[[ "${EXAMTREE_QS_ADMIN_CATALOG_PROMOTION_APPROVED:-}" == "yes" ]] || {
  echo "STOP: explicit approval required for public admin-candidate tag switch" >&2
  exit 2
}
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
[[ "$(git branch --show-current)" == "New-main" ]] || { echo "STOP: use New-main"; exit 2; }
[[ -z "$(git status --porcelain --untracked-files=no)" ]] || { echo "STOP: dirty checkout"; exit 2; }
[[ "$(git rev-parse HEAD)" == "$(git rev-parse origin/New-main)" ]] || { echo "STOP: sync New-main"; exit 2; }
command -v gcloud >/dev/null
command -v python3 >/dev/null
TEMP="$(mktemp -d)"
trap 'rm -rf "$TEMP"' EXIT
gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json > "$TEMP/before.json"
python3 - "$TEMP/before.json" "$TEMP/old-admin" "$TEMP/student-revision" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
spec=d['spec']['template']['spec']
env={x['name']:x for x in spec['containers'][0].get('env',[])}
def v(k): return env.get(k,{}).get('value')
def ref(k): return (env.get(k,{}).get('valueFrom') or {}).get('secretKeyRef',{}).get('name')
required={
 'EXAMTREE_API_RUNTIME':'cloud-run','EXAMTREE_API_STAGING':'false',
 'EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER':'false',
 'EXAMTREE_ADMIN_DETERMINISTIC_ONLY':'false',
 'EXAMTREE_SALES_DISABLED':'true','EXAMTREE_PAYMENT_PROVIDER':'none',
 'GENERATION_JOB_WORKER_ENABLED':'false','OUTBOX_PUBLISHER_ENABLED':'false',
 'EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED':'false',
 'EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED':'false',
 'EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_LAUNCH_APPROVED':'false'}
for k,want in required.items():
 if v(k)!=want: raise SystemExit('STOP: unsafe service template '+k)
for k,secret in {'DATABASE_URL':'examtree-api-database-url',
                 'OPENAI_API_KEY':'examtree-openai-api-key',
                 'QUESTION_STUDIO_WORKER_TOKEN':'examtree-question-studio-prod-worker-token'}.items():
 if ref(k)!=secret: raise SystemExit('STOP: missing required secret reference '+k)
if spec.get('serviceAccountName')!='examtree-api-prod-runtime@sarbedutech.iam.gserviceaccount.com':
 raise SystemExit('STOP: unexpected runtime service account')
traffic=d['status'].get('traffic',[])
live=[x for x in traffic if x.get('percent')==100]
old=[x for x in traffic if x.get('tag')=='admin-candidate']
qs=[x for x in traffic if x.get('tag')=='qs-chapter-6f96fb3441']
if len(live)!=1 or len(old)!=1 or len(qs)!=1:
 raise SystemExit('STOP: traffic/tag topology changed')
if old[0].get('percent',0)!=0 or qs[0].get('percent',0)!=0:
 raise SystemExit('STOP: tagged revision has normal traffic')
if old[0].get('revisionName')==live[0].get('revisionName'):
 raise SystemExit('STOP: admin tag is already on normal traffic')
open(sys.argv[2],'w').write(old[0]['revisionName'])
open(sys.argv[3],'w').write(live[0]['revisionName'])
print('PASS: admin candidate, secrets, disabled queues, student and QS traffic verified')
print('ROLLBACK TAG: admin-candidate='+old[0]['revisionName'])
PY
OLD_ADMIN="$(cat "$TEMP/old-admin")"
STUDENT_REV="$(cat "$TEMP/student-revision")"
IMAGE="$REPO_IMAGE:$(git rev-parse HEAD)"
gcloud builds submit . --project="$PROJECT" --region="$REGION" \
 --config=cloudbuild.examtree-cloudrun-api.yaml \
 --ignore-file=Dockerfile.question-studio-worker.dockerignore \
 --substitutions="_IMAGE=$IMAGE"
gcloud run deploy "$SERVICE" --project="$PROJECT" --region="$REGION" \
 --image="$IMAGE" --no-traffic --tag=admin-catalog-next \
 --update-env-vars="EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER=false,EXAMTREE_ADMIN_DETERMINISTIC_ONLY=false" \
 --quiet
gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json > "$TEMP/after.json"
python3 - "$TEMP/after.json" "$STUDENT_REV" "$OLD_ADMIN" "$TEMP/new-revision" "$TEMP/new-url" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
student,old=sys.argv[2:4]
ts=d['status'].get('traffic',[])
new=[x for x in ts if x.get('tag')=='admin-catalog-next']
current=[x for x in ts if x.get('tag')=='admin-candidate']
qs=[x for x in ts if x.get('tag')=='qs-chapter-6f96fb3441']
if (len(new)!=1 or len(current)!=1 or len(qs)!=1
 or new[0].get('percent',0)!=0 or new[0].get('revisionName')==old
 or current[0].get('revisionName')!=old or current[0].get('percent',0)!=0
 or sum(x.get('percent',0) for x in ts if x.get('revisionName')==student)!=100):
 raise SystemExit('STOP: candidate tag/normal traffic changed unexpectedly')
open(sys.argv[4],'w').write(new[0]['revisionName'])
open(sys.argv[5],'w').write(new[0]['url'])
print('PASS: refreshed admin image remains tagged 0%; student traffic unchanged')
PY
URL="$(cat "$TEMP/new-url")"
for endpoint in health api/commerce/products; do
 CODE="$(curl --retry 2 --retry-delay 3 -sS -o "$TEMP/check.json" -w '%{http_code}' --max-time 70 "$URL/$endpoint")"
 [[ "$CODE" == 200 ]] || { echo "STOP: candidate $endpoint HTTP $CODE"; exit 1; }
done
CODE="$(curl -sS -o "$TEMP/auth.json" -w '%{http_code}' --max-time 70 "$URL/api/admin/question-studio/capabilities")"
[[ "$CODE" == 401 ]] || { echo "STOP: anonymous admin permissions HTTP $CODE"; exit 1; }
CODE="$(curl -sS -o "$TEMP/finance.json" -w '%{http_code}' --max-time 70 "$URL/api/admin/commerce/orders")"
[[ "$CODE" == 503 ]] || { echo "STOP: finance guard HTTP $CODE"; exit 1; }
python3 - "$TEMP/finance.json" <<'PY'
import json,sys
assert json.load(open(sys.argv[1])).get('code')=='FINANCE_HANDLED_BY_RENDER_DURING_CUTOVER'
PY
echo "PASS: new candidate health, catalog, auth rejection, finance protection"
echo "NOTICE: switching only admin-candidate TAG; current authenticated admin sessions will use new image."
NEW_REV="$(cat "$TEMP/new-revision")"
gcloud run services update-traffic "$SERVICE" --project="$PROJECT" --region="$REGION" \
 --update-tags="admin-candidate=$NEW_REV" --quiet
gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json > "$TEMP/final.json"
python3 - "$TEMP/final.json" "$STUDENT_REV" "$NEW_REV" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
ts=d['status'].get('traffic',[])
student,new=sys.argv[2:4]
assert sum(x.get('percent',0) for x in ts if x.get('revisionName')==student)==100
assert any(x.get('tag')=='admin-candidate' and x.get('revisionName')==new
               and x.get('percent',0)==0 for x in ts)
assert any(x.get('tag')=='qs-chapter-6f96fb3441' and x.get('percent',0)==0 for x in ts)
print('PASS: refreshed admin canary routed with 0% normal traffic; student and QS preserved')
PY
echo "ADMIN TAG ROLLBACK (if admin errors):"
echo "gcloud run services update-traffic $SERVICE --project=$PROJECT --region=$REGION --update-tags=admin-candidate=$OLD_ADMIN"
echo "NEXT: refresh https://examtree.in/admin/question-studio and verify Quant, Reasoning, English and Static GK"
