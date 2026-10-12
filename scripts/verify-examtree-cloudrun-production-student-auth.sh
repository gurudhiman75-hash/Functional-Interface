#!/usr/bin/env bash
# GET-only Firebase student authentication check against PRIVATE production
# Cloud Run. X-Serverless-Authorization supplies Cloud Run IAM credentials,
# preserving the application's separate Firebase Authorization header.
# Use an existing disposable student. Some auth GETs may reconcile identity.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-api
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || {
  echo "FAIL: select Google Cloud project sarbedutech." >&2; exit 2
}
[[ -t 0 ]] || {
  echo "FAIL: interactive Cloud Shell required. Never put ID tokens in shell history or chat." >&2; exit 2
}
TMP="$(mktemp -d)"
chmod 700 "$TMP"
TOKEN=''
IAM_TOKEN=''
cleanup() { TOKEN=''; IAM_TOKEN=''; rm -rf "$TMP"; }
trap cleanup EXIT
echo "PRODUCTION CLOUD RUN: PRIVATE EXISTING DISPOSABLE STUDENT GET-ONLY GATE"
echo "A NEWLY REFRESHED Firebase ID token is required, not an older saved token."
read -r -s -p "Paste an existing disposable STUDENT Firebase ID token (hidden): " TOKEN
echo
[[ "$TOKEN" =~ ^[A-Za-z0-9_-]+[.][A-Za-z0-9_-]+[.][A-Za-z0-9_-]+$ ]] || {
  echo "FAIL: three-part Firebase ID token expected (not a Cloud IAM token)." >&2; exit 2
}
# A local, non-cryptographic freshness/project screen, not a replacement for
# Firebase Admin signature verification at the backend. Never display claims.
if ! printf %s "$TOKEN" | python3 -c '
import base64,json,sys,time
try:
    token=sys.stdin.read()
    parts=token.split(".")
    def payload(s):
        return json.loads(base64.urlsafe_b64decode(s+"="*(-len(s)%4)))
    h=payload(parts[0]);p=payload(parts[1]);now=int(time.time())
    assert h.get("alg")=="RS256"
    assert p.get("aud")=="sarbedutech"
    assert p.get("iss")=="https://securetoken.google.com/sarbedutech"
    assert isinstance(p.get("exp"),int) and p["exp"]>now+120
    assert isinstance(p.get("iat"),int) and p["iat"]<=now+60
except Exception:
    print("FAIL: Firebase token expired, wrong project, or malformed. Refresh token from existing test-user login.")
    sys.exit(2)
print("PASS: Firebase ID token has matching project and future expiry (signature checked by server)")
'; then exit 2; fi

URL="$(gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
[[ "$URL" =~ ^https://examtree-api-[A-Za-z0-9-]+[.](asia-south1[.]run[.]app|a[.]run[.]app)$ ]] || {
  echo "FAIL: unexpected production Cloud Run hostname. No cutover." >&2; exit 2
}
# Unlike the local Cloud Run proxy (which attaches its IAM bearer token),
# send both credentials to Cloud Run explicitly. Google's edge checks only
# X-Serverless-Authorization and passes Firebase Authorization to the app.
IAM_TOKEN="$(gcloud auth print-identity-token 2>/dev/null)" || {
  echo "FAIL: unable to obtain Cloud Shell invoker identity; check gcloud auth." >&2; exit 2
}
[[ "$IAM_TOKEN" =~ ^[A-Za-z0-9_-]+[.][A-Za-z0-9_-]+[.][A-Za-z0-9_-]+$ ]] || {
  echo "FAIL: gcloud did not return an IAM identity token." >&2; exit 2
}
get_status() {
  local path="$1"
  [[ "$path" == /api/* ]] || return 2
  # Sensitive headers go through stdin, not process arguments or temp files.
  printf 'header = "Authorization: Bearer %s"\nheader = "X-Serverless-Authorization: Bearer %s"\n' "$TOKEN" "$IAM_TOKEN" |
    curl --config - --silent --show-error --max-time 75 --request GET \
      --output "$TMP/response" --write-out '%{http_code}' "$URL$path"
}
diagnose_status() {
  local label="$1" code="$2"
  # Never dump response body or user data; log only a stable application code.
  python3 - "$TMP/response" "$label" "$code" <<'PY'
import json,sys,re
try:
  with open(sys.argv[1],encoding="utf8") as f:
    data=json.load(f)
  reason=data.get("code","UNKNOWN") if isinstance(data,dict) else "UNKNOWN"
  if not isinstance(reason,str) or not re.fullmatch(r"[A-Z0-9_]{1,80}",reason):
    reason="UNKNOWN"
except Exception:
  reason="UNKNOWN"
print(f"FAIL: {sys.argv[2]} HTTP {sys.argv[3]}; API code={reason}. No cutover.")
PY
}
expect_json() {
  local label="$1" code="$2" keys="$3"
  if [[ "$code" != 200 ]]; then diagnose_status "$label" "$code"; return 1; fi
  python3 - "$TMP/response" "$label" "$keys" <<'PY'
import json,sys
with open(sys.argv[1],encoding="utf8") as f: data=json.load(f)
if not isinstance(data,dict) or any(k not in data for k in sys.argv[3].split(",")):
  sys.exit("FAIL: "+sys.argv[2]+" response structure mismatch. No cutover.")
print("PASS: "+sys.argv[2]+" authenticated and structured HTTP 200")
PY
}
status="$(get_status /api/users/me/profile)"
expect_json "student profile" "$status" "email,preferredLanguageCode"
status="$(get_status /api/commerce/purchases)"
expect_json "student purchases / entitlements" "$status" "orders,items,entitlements"
status="$(get_status /api/admin/commerce/orders)"
if [[ "$status" != 503 ]]; then diagnose_status "direct admin delegation" "$status"; exit 1; fi
python3 - "$TMP/response" <<'PY'
import json,sys
with open(sys.argv[1],encoding="utf8") as f: d=json.load(f)
if d.get("code")!="ADMIN_HANDLED_BY_RENDER_DURING_CUTOVER":
  sys.exit("FAIL: production admin delegation code mismatch. No cutover.")
print("PASS: direct production admin endpoint delegated to Render HTTP 503")
PY
TOKEN=''; IAM_TOKEN=''
echo "RESULT: private production Firebase student read gate PASSED."
echo "No production traffic was changed. Render still handles examtree.in."
echo "NOTE: Firebase auth GET can update disposable-student identity mapping; no purchase, attempt, refund, or worker operation was requested."
