#!/usr/bin/env bash
set -euo pipefail
set +x
# Staging-only, GET-only paid-test access regression; test database not changed
# intentionally. Firebase auth middleware can update identity/login metadata.
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-api-staging
TEST_ID=89d983e5-84e4-4f7d-9e4b-bd9e02002a59

[[ -t 0 ]] || { echo 'FAIL: interactive terminal required; do not pass tokens in arguments' >&2; exit 2; }
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || {
  echo 'FAIL: switch gcloud project to sarbedutech' >&2; exit 2;
}
URL="$(gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
[[ "$URL" =~ ^https://[a-zA-Z0-9.-]+[.]run[.]app$ ]] || {
  echo 'FAIL: invalid Cloud Run staging host' >&2; exit 2;
}

umask 077
WORK="$(mktemp -d)"
FIREBASE_TOKEN=''
trap 'FIREBASE_TOKEN=""; rm -rf "$WORK"' EXIT
read -r -s -p 'Paste EXISTING test-student Firebase ID token (hidden input): ' FIREBASE_TOKEN
echo
[[ "$FIREBASE_TOKEN" =~ ^[A-Za-z0-9_-]+[.][A-Za-z0-9_-]+[.][A-Za-z0-9_-]+$ ]] || {
  echo 'FAIL: expected Firebase ID-token JWT' >&2; exit 2;
}

safe_get() {
  local path="$1"
  [[ "$path" == /api/* ]] || { echo 'FAIL: request outside API not allowed' >&2; exit 2; }
  printf 'header = "Authorization: Bearer %s"\n' "$FIREBASE_TOKEN" |
    curl --config - --silent --show-error --max-time 120 --request GET \
    --output "$WORK/body" --dump-header "$WORK/headers" \
    --write-out '%{http_code}' "$URL$path"
}

STATUS="$(safe_get "/api/commerce/access/tests/$TEST_ID")"
[[ "$STATUS" == 200 ]] || { echo "FAIL: entitlement lookup returned HTTP $STATUS, expected 200" >&2; exit 1; }
python3 - "$WORK/body" <<'PY'
import json,sys
with open(sys.argv[1],encoding="utf-8") as stream:
    evidence=json.load(stream)
if not isinstance(evidence,dict):
    sys.exit("FAIL: entitlement response shape")
if evidence.get("allowed") is not False:
    sys.exit("FAIL: student has test access; no expired-entitlement scenario to verify")
if evidence.get("paidAccessRequired") is not True:
    sys.exit("FAIL: paid test not identified as paid")
if evidence.get("reason")!="entitlement_required":
    sys.exit("FAIL: unexpected denial reason")
print("PASS: expired or absent paid entitlement is correctly denied")
PY

STATUS="$(safe_get "/api/tests/$TEST_ID")"
[[ "$STATUS" == 403 ]] || {
  echo "FAIL: paid test detail returned HTTP $STATUS instead of entitlement guard 403" >&2
  exit 1
}
echo "PASS: paid test questions protected from account without effective entitlement (403)"
echo "PASS: Cloud Run paid-test entitlement negative gate; no test attempts, payments or refunds requested"
echo "NOTE: positive attempt persistence requires a separate authorized disposable fixture"
