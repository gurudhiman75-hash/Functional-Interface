#!/usr/bin/env bash
set -euo pipefail
set +x
# GET-only Cloud Run staging checks with existing Firebase TEST accounts.
# The existing auth middleware may refresh Firebase-to-Neon identity metadata
# even on GET. Do not test with new students or production payment accounts.
MODE="${1:-}"
[[ "$MODE" == student || "$MODE" == admin || "$MODE" == both ]] || {
  echo 'Usage: bash scripts/verify-examtree-cloudrun-authenticated.sh student|admin|both' >&2
  exit 2
}
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-api-staging
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || {
  echo 'FAIL: wrong GCP project.' >&2; exit 2;
}
URL="$(gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
[[ "$URL" =~ ^https://[a-zA-Z0-9.-]+[.]run[.]app$ ]] || {
  echo 'FAIL: no trusted staging Cloud Run URL.' >&2; exit 2;
}
TMP="$(mktemp -d)"
STUDENT_TOKEN=''
ADMIN_TOKEN=''
TOKEN_RESULT=''
trap 'STUDENT_TOKEN=""; ADMIN_TOKEN=""; TOKEN_RESULT=""; rm -rf "$TMP"' EXIT
read_one_token() {
  local label="$1"
  [[ -t 0 ]] || { echo 'FAIL: interactive terminal required. Never pass tokens on the command line or in chat.' >&2; exit 2; }
  read -r -s -p "Paste existing $label Firebase ID token (hidden input): " TOKEN_RESULT
  echo
  if [[ ! "$TOKEN_RESULT" =~ ^[A-Za-z0-9_-]+[.][A-Za-z0-9_-]+[.][A-Za-z0-9_-]+$ ]]; then
    TOKEN_RESULT=''
    echo 'FAIL: expected Firebase ID token JWT (3 parts), not a GCP or Google access token.' >&2
    exit 2
  fi
}
# curl reads Authorization from stdin instead of process arguments, files,
# or exported variables. No response bodies or tokens are printed.
auth_get() {
  local token="$1" path="$2"
  [[ "$path" == /api/* ]] || { echo 'FAIL: invalid API path.' >&2; return 2; }
  printf 'header = "Authorization: Bearer %s"\n' "$token" |
    curl --config - --silent --show-error --max-time 90 --request GET \
      --output "$TMP/body" --dump-header "$TMP/headers" \
      --write-out '%{http_code}' "$URL$path"
}
expect_200() {
  local label="$1" token="$2" path="$3" required="$4" status=''
  status="$(auth_get "$token" "$path")"
  if [[ "$status" != 200 ]]; then
    echo "FAIL: $label: HTTP $status (expected 200). Inspect Cloud Run logs." >&2
    return 1
  fi
  python3 - "$TMP/body" "$label" "$required" <<'PY'
import json,sys
with open(sys.argv[1],encoding='utf8') as f: value=json.load(f)
if not isinstance(value,dict) or any(key not in value for key in sys.argv[3].split(',')):
    sys.exit('FAIL: '+sys.argv[2]+' response shape mismatch')
print('PASS: '+sys.argv[2]+' response authenticated and structured')
PY
}
student_denied() {
  local label="$1" path="$2" status=''
  status="$(auth_get "$STUDENT_TOKEN" "$path")"
  [[ "$status" == 403 ]] || {
    echo "FAIL: student access to $label returned HTTP $status; expected RBAC 403." >&2
    return 1
  }
  echo "PASS: test student denied $label (403)"
}
if [[ "$MODE" == student || "$MODE" == both ]]; then
  echo 'STUDENT: use an EXISTING disposable student login, not the superadmin.'
  read_one_token student
  STUDENT_TOKEN="$TOKEN_RESULT"; TOKEN_RESULT=''
  expect_200 "student profile" "$STUDENT_TOKEN" /api/users/me/profile 'email,preferredLanguageCode'
  expect_200 "student purchases" "$STUDENT_TOKEN" /api/commerce/purchases 'orders,items,entitlements'
  student_denied "admin order list" /api/admin/commerce/orders
  student_denied "admin reconciliation" /api/admin/commerce/orders/reconciliation/health
  echo 'PASS: student reads and finance RBAC separation.'
fi
if [[ "$MODE" == admin || "$MODE" == both ]]; then
  echo 'ADMIN: use an EXISTING, bootstrapped superadmin login.'
  read_one_token superadmin
  ADMIN_TOKEN="$TOKEN_RESULT"; TOKEN_RESULT=''
  expect_200 "admin order list" "$ADMIN_TOKEN" /api/admin/commerce/orders 'orders'
  expect_200 "admin reconciliation" "$ADMIN_TOKEN" /api/admin/commerce/orders/reconciliation/health 'requiresProviderVerification,summary,unresolvedRefunds,conflictingSuccesses,expiredPendingOrders'
  python3 - "$TMP/body" <<'PY'
import json,sys
with open(sys.argv[1],encoding='utf8') as f: r=json.load(f)
s=r.get('summary') or {}
if r.get('requiresProviderVerification') is not True or any(
        not isinstance(s.get(k),int) for k in
        ('unresolvedRefunds','conflictingSuccessOrders','expiredPendingOrders')):
    sys.exit('FAIL: admin reconciliation summary malformed or no provider verification requirement')
print('PASS: finance reconciliation still requires provider evidence')
PY
fi
echo 'PASS: authenticated staging GET checks complete.'
echo 'NOTE: Auth middleware can update identity mapping; no refund, payment, attempt, or worker action was requested.'
