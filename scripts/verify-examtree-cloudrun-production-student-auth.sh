#!/usr/bin/env bash
# Read-only authenticated student checks of the PRIVATE PRODUCTION Cloud Run API.
# Run ONLY with a previously used disposable student account. Firebase auth
# middleware may update identity mapping on GET; no purchases, attempts,
# payment reconciliation or worker actions are requested.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-api
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || {
  echo "FAIL: select Google Cloud project sarbedutech." >&2; exit 2
}
[[ -t 0 ]] || {
  echo "FAIL: run from an interactive Cloud Shell terminal to hide the token." >&2; exit 2
}
TMP="$(mktemp -d)"
chmod 700 "$TMP"
PID=''
TOKEN=''
cleanup() {
  TOKEN=''
  if [[ -n "$PID" ]]; then kill "$PID" 2>/dev/null || true; wait "$PID" 2>/dev/null || true; fi
  rm -rf "$TMP"
}
trap cleanup EXIT
echo "PRODUCTION CLOUD RUN: EXISTING DISPOSABLE STUDENT GET-ONLY GATE"
echo "Do not use the superadmin. No payment, test submission or admin changes."
read -r -s -p "Paste an existing disposable STUDENT Firebase ID token (hidden): " TOKEN
echo
if [[ ! "$TOKEN" =~ ^[A-Za-z0-9_-]+[.][A-Za-z0-9_-]+[.][A-Za-z0-9_-]+$ ]]; then
  echo "FAIL: expected an existing Firebase ID token JWT, not a GCP OAuth/access token." >&2
  exit 2
fi
# Local gcloud proxy supplies Cloud Run invoker auth. Student Firebase JWT
# remains in the original Authorization header for the application.
PORT="$(python3 - <<'PY'
import socket
s=socket.socket();s.bind(("127.0.0.1",0));print(s.getsockname()[1]);s.close()
PY
)"
gcloud run services proxy "$SERVICE" --project="$PROJECT" --region="$REGION" --port="$PORT" >"$TMP/proxy.log" 2>&1 &
PID=$!
BASE="http://127.0.0.1:$PORT"
READY=no
for _ in $(seq 1 25); do
  if ! kill -0 "$PID" 2>/dev/null; then
    echo "FAIL: local Cloud Run proxy exited; check your invoker permissions." >&2; exit 1
  fi
  CODE="$(curl -sS --max-time 10 -o "$TMP/health" -w '%{http_code}' "$BASE/health" 2>/dev/null || true)"
  if [[ "$CODE" == 200 ]]; then READY=yes; break; fi
  sleep 2
done
if [[ "$READY" != yes ]]; then
  echo "FAIL: private production API health did not return HTTP 200." >&2
  exit 1
fi
auth_get() {
  local path="$1"
  printf 'header = "Authorization: Bearer %s"\n' "$TOKEN" |
    curl --config - --silent --show-error --max-time 75 \
      --request GET --output "$TMP/response" --write-out '%{http_code}' "$BASE$path"
}
expect_profile() {
  local code="$1"
  [[ "$code" == 200 ]] || { echo "FAIL: student profile HTTP $code (expected 200). No cutover." >&2; exit 1; }
  python3 - "$TMP/response" <<'PY'
import json,sys
with open(sys.argv[1],encoding="utf-8") as f: d=json.load(f)
if not isinstance(d,dict) or any(k not in d for k in ("email","preferredLanguageCode")):
    sys.exit("FAIL: student profile shape mismatch")
print("PASS: PRIVATE production student profile authenticated and structured (200)")
PY
}
expect_purchases() {
  local code="$1"
  [[ "$code" == 200 ]] || { echo "FAIL: student purchases HTTP $code (expected 200). No cutover." >&2; exit 1; }
  python3 - "$TMP/response" <<'PY'
import json,sys
with open(sys.argv[1],encoding="utf-8") as f: d=json.load(f)
if not isinstance(d,dict) or any(k not in d for k in ("orders","items","entitlements")):
    sys.exit("FAIL: purchases response shape mismatch")
print("PASS: PRIVATE production student purchases/entitlements authenticated and structured (200)")
PY
}
expect_admin_denied() {
  local code="$1"
  [[ "$code" == 503 ]] || { echo "FAIL: direct production admin route HTTP $code (expected delegated 503). No cutover." >&2; exit 1; }
  python3 - "$TMP/response" <<'PY'
import json,sys
with open(sys.argv[1],encoding="utf-8") as f: d=json.load(f)
if d.get("code")!="ADMIN_HANDLED_BY_RENDER_DURING_CUTOVER":
    sys.exit("FAIL: production admin delegation response mismatch")
print("PASS: private production admin namespace stays delegated to Render (503)")
PY
}
expect_profile "$(auth_get /api/users/me/profile)"
expect_purchases "$(auth_get /api/commerce/purchases)"
expect_admin_denied "$(auth_get /api/admin/commerce/orders)"
TOKEN=''
echo "RESULT: production student authentication GET gate PASSED."
echo "Production Cloud Run remains PRIVATE; examtree.in public API still on Render."
echo "NEXT: verify Cloudflare gateway and same-domain rollback BEFORE public cutover."
echo "NOTE: Firebase authentication GET can update identity mapping; no purchase, attempt, refund or worker action was requested."
