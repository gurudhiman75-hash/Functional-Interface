#!/usr/bin/env bash
# PRIVATE, READ-ONLY Examtree Cloud Run PRODUCTION candidate verification.
# Safe for live Neon: health and catalog GET, plus two intentionally rejected
# requests with no identity or valid purchase payload. No jobs, writes,
# public IAM changes, DNS changes or Cloudflare cutover.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-api
JOB=examtree-api-background
echo "EXAMTREE PRIVATE PRODUCTION CANDIDATE — NONMUTATING READINESS"
echo "No Firebase tokens or payment credentials requested."
if [[ "$(gcloud config get-value project 2>/dev/null)" != "$PROJECT" ]]; then
  echo "FAIL: select Google Cloud project sarbedutech" >&2; exit 2
fi
TMP="$(mktemp -d)"
PID=""
cleanup() {
  if [[ -n "$PID" ]]; then kill "$PID" 2>/dev/null || true; wait "$PID" 2>/dev/null || true; fi
  rm -rf "$TMP"
}
trap cleanup EXIT

# Do not expose private service publicly just to run verification.
gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json > "$TMP/service.json"
gcloud run services get-iam-policy "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json > "$TMP/iam.json"
gcloud run jobs describe "$JOB" --project="$PROJECT" --region="$REGION" --format=json > "$TMP/job.json"
python3 - "$TMP/service.json" "$TMP/iam.json" "$TMP/job.json" <<'PY'
import json,sys
service,iam,job=[json.load(open(p)) for p in sys.argv[1:]]
def container(resource,is_job=False):
    s=resource["spec"]["template"]["spec"]
    if is_job:s=s["template"]["spec"]
    cs=s["containers"]
    assert len(cs)==1
    return cs[0]
api=container(service)
values={e["name"]:e.get("value") for e in api.get("env",[])}
secrets={e["name"]:((e.get("valueFrom") or {}).get("secretKeyRef") or {}).get("name") for e in api.get("env",[])}
assert values.get("EXAMTREE_API_RUNTIME")=="cloud-run"
assert values.get("EXAMTREE_API_STAGING")=="false"
assert values.get("EXAMTREE_SALES_DISABLED")=="true"
assert values.get("EXAMTREE_PAYMENT_PROVIDER")=="none"
assert values.get("EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER")=="true"
assert values.get("GENERATION_JOB_WORKER_ENABLED")=="false"
assert values.get("OUTBOX_PUBLISHER_ENABLED")=="false"
assert values.get("FIREBASE_PROJECT_ID")=="sarbedutech"
assert secrets.get("DATABASE_URL")=="examtree-api-database-url"
assert not secrets.get("CASHFREE_CLIENT_ID") and not secrets.get("CASHFREE_CLIENT_SECRET")
assert not secrets.get("OPENAI_API_KEY")
assert all("allUsers" not in b.get("members",[]) and "allAuthenticatedUsers" not in b.get("members",[]) for b in iam.get("bindings",[]))
status=service.get("status") or {}
latest=status.get("latestReadyRevisionName")
assert latest and latest==status.get("latestCreatedRevisionName")
assert sum(int(t.get("percent",0)) for t in status.get("traffic",[]) if t.get("revisionName")==latest or t.get("latestRevision"))==100
jobc=container(job,True)
assert jobc.get("command")==["/usr/bin/false"]
je={e["name"]:e for e in jobc.get("env",[])}
assert je.get("EXAMTREE_API_STAGING",{}).get("value")=="false"
assert je.get("DATABASE_URL",{}).get("valueFrom",{}).get("secretKeyRef",{}).get("name")=="examtree-api-database-url"
print("PASS: production API revision ready (100% private-service traffic), sales off, admin delegated, no payment/AI keys")
print("PASS: production job inert; private Cloud Run IAM; live Neon MAIN secret reference")
print("REVISION: "+latest)
print("IMAGE_TAG: "+api.get("image","").rsplit(":",1)[-1][:16])
PY

# Ensure the production scheduler is not accidentally enabled.
gcloud scheduler jobs list --project="$PROJECT" --location="$REGION" --format=json > "$TMP/schedulers.json"
python3 - "$TMP/schedulers.json" <<'PY'
import json,sys
jobs=json.load(open(sys.argv[1]))
assert isinstance(jobs,list)
assert not any(j.get("name","").endswith("/examtree-api-background-every-5m") for j in jobs)
print("PASS: production Cloud Run worker scheduler absent")
PY

# Reserve a local ephemeral port. Local gcloud proxy authenticates to a
# private Cloud Run service with Cloud Shell identity.
PORT="$(python3 - <<'PY'
import socket
s=socket.socket();s.bind(("127.0.0.1",0));print(s.getsockname()[1]);s.close()
PY
)"
gcloud run services proxy "$SERVICE" --project="$PROJECT" --region="$REGION" --port="$PORT" >"$TMP/proxy.log" 2>&1 &
PID=$!
BASE="http://127.0.0.1:$PORT"
READY=0
for attempt in $(seq 1 25); do
  if ! kill -0 "$PID" 2>/dev/null; then
    echo "FAIL: private Cloud Run proxy stopped. Check gcloud auth / Cloud Run invoker permission." >&2; exit 1
  fi
  CODE="$(curl -sS --max-time 10 -o "$TMP/health.json" -w '%{http_code}' "$BASE/health" 2>/dev/null || true)"
  if [[ "$CODE" == "200" ]]; then READY=1; break; fi
  sleep 2
done
[[ "$READY" == 1 ]] || { echo "FAIL: private production /health did not return HTTP 200; cutover BLOCKED." >&2; exit 1; }
python3 - "$TMP/health.json" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
assert d.get("status")=="ok"
print("PASS: private production Cloud Run /health returns HTTP 200")
PY

CATALOG_CODE="$(curl -sS --max-time 60 -o "$TMP/catalog.json" -w '%{http_code}' "$BASE/api/commerce/products")"
if [[ "$CATALOG_CODE" != 200 ]]; then
  echo "FAIL: catalog GET returned HTTP $CATALOG_CODE; live Neon read not verified. Cutover BLOCKED." >&2; exit 1
fi
python3 - "$TMP/catalog.json" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
assert isinstance(d,dict) and isinstance(d.get("products"),list)
assert d.get("salesEnabled") is False
assert d.get("checkoutProvider")=="disabled"
print("PASS: live Neon product catalog GET 200, salesEnabled=false, checkoutProvider=disabled; products="+str(len(d["products"])))
PY

ORDER_CODE="$(curl -sS --max-time 30 -o "$TMP/order.json" -w '%{http_code}' \
  -H 'Content-Type: application/json' -X POST -d '{}' "$BASE/api/commerce/orders")"
python3 - "$TMP/order.json" "$ORDER_CODE" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
assert sys.argv[2]=="503" and d.get("code")=="SALES_TEMPORARILY_UNAVAILABLE"
print("PASS: unauthenticated empty order POST blocked with 503 before checkout/database write")
PY

ADMIN_CODE="$(curl -sS --max-time 30 -o "$TMP/admin.json" -w '%{http_code}' "$BASE/api/admin/session")"
python3 - "$TMP/admin.json" "$ADMIN_CODE" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
assert sys.argv[2]=="503" and d.get("code")=="ADMIN_HANDLED_BY_RENDER_DURING_CUTOVER"
print("PASS: direct Cloud Run admin endpoint denied; Cloudflare admin must stay on Render")
PY

echo "RESULT: candidate preflight PASSED for PRIVATE service. Cloudflare/Render production routing UNCHANGED."
echo "NEXT GATE: authenticated student read and public-invoker / gateway cutover coordination."
