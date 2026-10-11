#!/usr/bin/env bash
set -euo pipefail
# GET-only validation. No Firebase credentials, DB writes, payment POSTs,
# background jobs, refund reconciliation or live traffic changes.
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-api-staging
REQUIRED_COMMIT=038fe2d1d5ddcab77588fe2079d8f40075924f24
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || { echo "FAIL: wrong GCP project" >&2; exit 2; }
URL="$(gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
[[ "$URL" =~ ^https://[a-zA-Z0-9.-]+[.]run[.]app$ ]] || { echo "FAIL: invalid staging host" >&2; exit 2; }
IMAGE="$(gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format='value(spec.template.spec.containers[0].image)')"
PREFIX="$REGION-docker.pkg.dev/$PROJECT/examtree-workers/examtree-api:"
[[ "$IMAGE" == "$PREFIX"* ]] || { echo "FAIL: unknown Cloud Run image provenance" >&2; exit 2; }
REV="${IMAGE#"$PREFIX"}"
[[ "$REV" =~ ^[0-9a-f]{40}$ ]] || { echo "FAIL: no source commit pinned on image" >&2; exit 2; }
git -C "$ROOT" cat-file -e "$REV^{commit}" 2>/dev/null || { echo 'FAIL: pull New-main first' >&2; exit 2; }
git -C "$ROOT" merge-base --is-ancestor "$REQUIRED_COMMIT" "$REV" || { echo "FAIL: deployed API predates refund safety patch" >&2; exit 2; }
echo "PASS: Cloud Run source includes verified refund safety patch (${REV:0:12})."
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
get() { local path="$1"; shift; curl --silent --show-error --max-time 120 --output "$WORK/body" --dump-header "$WORK/headers" --write-out '%{http_code}' --request GET "$@" "$URL$path"; }
denied() {
  local label="$1" path="$2"; shift 2
  local status; status="$(get "$path" "$@")"
  [[ "$status" == 401 || "$status" == 403 ]] || { echo "FAIL: $label GET returned HTTP $status (expected 401/403)" >&2; exit 1; }
  echo "PASS: $label denied ($status)"
}
status="$(get /health)"
[[ "$status" == 200 ]] || { echo "FAIL: health HTTP $status" >&2; exit 1; }
python3 - "$WORK/body" <<'PY'
import json,sys
with open(sys.argv[1],encoding="utf8") as f: data=json.load(f)
if data.get("status")!="ok": sys.exit("FAIL: health JSON not ok")
print("PASS: health")
PY
status="$(get /api/commerce/products)"
[[ "$status" == 200 ]] || { echo "FAIL: catalog HTTP $status" >&2; exit 1; }
python3 - "$WORK/body" <<'PY'
import json,sys
with open(sys.argv[1],encoding="utf8") as f: data=json.load(f)
if data.get("checkoutProvider")!="cashfree" or not isinstance(data.get("products"),list):
    sys.exit("FAIL: expected Cashfree sandbox checkout catalog")
print("PASS: Cashfree catalog")
PY
denied "student profile" /api/users/me
denied "purchase history" /api/commerce/purchases
denied "admin orders" /api/admin/commerce/orders
denied "admin reconciliation queue" /api/admin/commerce/orders/reconciliation/health
denied "entitlement" /api/commerce/access/tests/89d983e5-84e4-4f7d-9e4b-bd9e02002a59
denied "attempt session" /api/attempt-sessions/00000000-0000-4000-8000-000000000000
denied "forged Firebase token" /api/users/me -H 'Authorization: Bearer invalid-staging-token'
status="$(get /health -H 'Origin: https://examtree.in')"
[[ "$status" == 200 ]] || { echo 'FAIL: allowed origin HTTP status' >&2; exit 1; }
origin="$(awk 'tolower($1)=="access-control-allow-origin:"{gsub("\r","",$2);print $2}' "$WORK/headers" | tail -1)"
[[ "$origin" == 'https://examtree.in' ]] || { echo 'FAIL: allowed origin CORS mismatch' >&2; exit 1; }
echo 'PASS: permitted website origin CORS'
status="$(get /health -H 'Origin: https://unauthorized.example')"
origin="$(awk 'tolower($1)=="access-control-allow-origin:"{gsub("\r","",$2);print $2}' "$WORK/headers" | tail -1)"
[[ "$origin" != 'https://unauthorized.example' && "$origin" != '*' ]] || { echo 'FAIL: untrusted CORS origin reflected' >&2; exit 1; }
echo 'PASS: foreign origin not allowed'
echo 'PASS: staging source, health, catalog, protected GETs, invalid token and CORS validated.'
echo 'NOTE: successful authenticated sessions, webhooks, refunds and background jobs still require separate acceptance.'
