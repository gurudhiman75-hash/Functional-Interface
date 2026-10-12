#!/usr/bin/env bash
# Read-only production admin handover preflight. Never fetches secret values.
# Does not deploy, switch Pages, trigger workers, or touch payments.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-api
AI_SECRET=examtree-openai-api-key
gcloud config set project "$PROJECT" >/dev/null
command -v python3 >/dev/null
SERVICE_JSON="$(mktemp)"
trap 'rm -f "$SERVICE_JSON"' EXIT
gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json > "$SERVICE_JSON"
python3 - "$SERVICE_JSON" <<'PY'
import json, sys
with open(sys.argv[1]) as f:
    s=json.load(f)
c=s['spec']['template']['spec']['containers'][0]
env={v['name']:v for v in c.get('env',[])}
def value(k): return (env.get(k) or {}).get('value')
def secret(k): return ((env.get(k) or {}).get('valueFrom') or {}).get('secretKeyRef',{}).get('name')
required={
    'EXAMTREE_API_RUNTIME':'cloud-run',
    'EXAMTREE_API_STAGING':'false',
    'EXAMTREE_SALES_DISABLED':'true',
    'EXAMTREE_PAYMENT_PROVIDER':'none',
    'GENERATION_JOB_WORKER_ENABLED':'false',
    'OUTBOX_PUBLISHER_ENABLED':'false',
    'FIREBASE_PROJECT_ID':'sarbedutech',
}
for name,wanted in required.items():
    if value(name)!=wanted: raise SystemExit('FAIL: production safety setting '+name)
if secret('DATABASE_URL')!='examtree-api-database-url':
    raise SystemExit('FAIL: expected exact production Neon secret reference')
if any(k in env for k in ('CASHFREE_CLIENT_ID','CASHFREE_CLIENT_SECRET','CASHFREE_ENV')):
    raise SystemExit('FAIL: payment credentials found on sales-paused API')
if s.get('status',{}).get('latestReadyRevisionName') != s.get('status',{}).get('latestCreatedRevisionName'):
    raise SystemExit('FAIL: most recent revision is not ready')
admin=value('EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER')
if admin not in ('true','false'):
    raise SystemExit('FAIL: explicit admin delegation flag missing')
if admin=='false' and secret('OPENAI_API_KEY')!='examtree-openai-api-key':
    raise SystemExit('FAIL: admin active without expected OpenAI Secret Manager reference')
print('PASS: main Neon, sales-paused, workers-off and revision readiness')
print('INFO: production admin delegation = '+('Render' if admin=='true' else 'Cloud Run'))
print('INFO: OpenAI Secret Manager mapping = '+('present' if secret('OPENAI_API_KEY')== 'examtree-openai-api-key' else 'not bound'))
PY
if ! gcloud secrets describe "$AI_SECRET" --project="$PROJECT" >/dev/null 2>&1; then
  echo "PENDING: production OpenAI secret does not exist in Secret Manager (name only)"
  exit 2
fi
if [[ -z "$(gcloud secrets versions list "$AI_SECRET" --project="$PROJECT" --filter='state:enabled' --format='value(name)')" ]]; then
  echo "PENDING: production OpenAI secret has no enabled version"
  exit 2
fi
echo "PASS: production OpenAI secret exists with an enabled version (value never read)"
echo "NEXT: stage a new Cloud Run admin-capable revision, validate authenticated admin GETs, then explicitly enable the separate Cloudflare admin upstream flag."
