#!/usr/bin/env bash
# Read-only inventory for ExamTree Render -> Cloud Run retirement.
# Does not create revisions, reveal secret values, change traffic or run workers.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-api

command -v gcloud >/dev/null
command -v python3 >/dev/null
TEMP="$(mktemp)"
trap 'rm -f "$TEMP"' EXIT

gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json >"$TEMP"
python3 - "$TEMP" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
spec=d.get("spec",{}).get("template",{}).get("spec",{})
c=spec.get("containers",[{}])[0]
env={e.get("name"):e for e in c.get("env",[])}
print("=== LIVE CLOUD RUN SERVICE ===")
print("Service:",d.get("metadata",{}).get("name"))
print("Service account:",spec.get("serviceAccountName","UNKNOWN"))
print("Latest ready revision:",d.get("status",{}).get("latestReadyRevisionName","UNKNOWN"))
for t in d.get("status",{}).get("traffic",[]):
 print("TRAFFIC:",t.get("revisionName",""),str(t.get("percent",0))+"%","tag="+str(t.get("tag","")))
print("=== SAFEGUARDS (nonsecret values only) ===")
for key in ("EXAMTREE_API_RUNTIME","EXAMTREE_API_STAGING",
 "EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER","EXAMTREE_ADMIN_DETERMINISTIC_ONLY",
 "EXAMTREE_SALES_DISABLED","EXAMTREE_PAYMENT_PROVIDER",
 "EXAMTREE_FINANCE_CLOUDRUN_APPROVED","EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED",
 "EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED",
 "EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_LAUNCH_APPROVED",
 "GENERATION_JOB_WORKER_ENABLED","OUTBOX_PUBLISHER_ENABLED"):
 print(key+":",env.get(key,{}).get("value","UNSET"))
print("=== REQUIRED SECRET REFERENCES (names only) ===")
for key in ("DATABASE_URL","OPENAI_API_KEY","CASHFREE_CLIENT_ID",
 "CASHFREE_CLIENT_SECRET","RAZORPAY_KEY_ID","RAZORPAY_KEY_SECRET"):
 e=env.get(key,{})
 ref=((e.get("valueFrom") or {}).get("secretKeyRef") or {}).get("name")
 print(key+":",("SECRET:"+ref if ref else "NO_SECRET_REFERENCE"))
print("=== DEPLOYMENT READINESS ===")
if env.get("EXAMTREE_SALES_DISABLED",{}).get("value") != "true":
 print("CHECK: sales must not be re-enabled as part of admin-only promotion")
if env.get("GENERATION_JOB_WORKER_ENABLED",{}).get("value") != "false":
 print("STOP: generation worker flag is not disabled")
if env.get("OUTBOX_PUBLISHER_ENABLED",{}).get("value") != "false":
 print("STOP: outbox publisher flag is not disabled")
print("INFO: live service inventory only; this is NOT an approval to switch admin or payments")
PY

echo "=== SECRET MANAGER METADATA ONLY ==="
for name in examtree-openai-api-key examtree-question-studio-prod-worker-token examtree-cashfree-sandbox-client-id examtree-cashfree-sandbox-client-secret examtree-cashfree-production-client-id examtree-cashfree-production-client-secret; do
  if gcloud secrets describe "$name" --project="$PROJECT" --format='value(name)' >/dev/null 2>&1; then
    N=$(gcloud secrets versions list "$name" --project="$PROJECT" --filter='state:enabled' --format='value(name)' | wc -l | tr -d ' ')
    echo "$name: exists; enabled versions=$N"
  else
    echo "$name: not readable or absent (verify with cloud owner)"
  fi
done

echo "INFO: sandbox Cashfree secrets may be used only with an isolated sandbox database, NEVER the production API service."
echo "NO CHANGES MADE: service, traffic, Cloudflare, queues, Neon, payment providers"
