#!/usr/bin/env bash
set -euo pipefail
set +x

# POSITIVE WRITE TEST. Requires an explicitly disposable, published, FREE test.
# This intentionally creates a session, writes a draft, submits an attempt, and
# verifies that a replay does not create a second attempt.
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-api-staging
[[ "${EXAMTREE_ATTEMPT_WRITE_APPROVED:-}" == "yes" ]] || {
  echo "FAIL: set EXAMTREE_ATTEMPT_WRITE_APPROVED=yes after approving disposable write test" >&2; exit 2;
}
[[ -t 0 ]] || { echo "FAIL: interactive terminal required" >&2; exit 2; }
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || {
  echo "FAIL: select Google Cloud project sarbedutech" >&2; exit 2;
}
read -r -p 'Enter published FREE disposable test UUID: ' TEST_ID
[[ "$TEST_ID" =~ ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$ ]] || {
  echo "FAIL: expected UUID" >&2; exit 2;
}
read -r -p 'Type WRITE-DISPOSABLE-ATTEMPT to acknowledge Neon main will change: ' CONFIRM
[[ "$CONFIRM" == "WRITE-DISPOSABLE-ATTEMPT" ]] || { echo "FAIL: not approved" >&2; exit 2; }
URL="$(gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format='value(status.url)')"
[[ "$URL" =~ ^https://[a-zA-Z0-9.-]+[.]run[.]app$ ]] || { echo "FAIL: invalid staging host" >&2; exit 2; }
umask 077
WORK="$(mktemp -d)"
TOKEN=''
trap 'TOKEN=""; rm -rf "$WORK"' EXIT
read -r -s -p 'Paste disposable student Firebase ID token (hidden input): ' TOKEN
echo
[[ "$TOKEN" =~ ^[A-Za-z0-9_-]+[.][A-Za-z0-9_-]+[.][A-Za-z0-9_-]+$ ]] || {
  echo "FAIL: expected Firebase ID-token JWT" >&2; exit 2;
}

request() {
  local method="$1" path="$2" data="${3:-}"
  local status
  if [[ -n "$data" ]]; then
    printf '%s' "$data" > "$WORK/request.json"
    status="$(printf 'header = "Authorization: Bearer %s"\nheader = "Content-Type: application/json"\n' "$TOKEN" |
      curl --config - --silent --show-error --max-time 120 --request "$method" \
      --data-binary @"$WORK/request.json" --output "$WORK/response.json" \
      --write-out '%{http_code}' "$URL$path")"
  else
    status="$(printf 'header = "Authorization: Bearer %s"\n' "$TOKEN" |
      curl --config - --silent --show-error --max-time 120 --request "$method" \
      --output "$WORK/response.json" --write-out '%{http_code}' "$URL$path")"
  fi
  printf '%s' "$status"
}
json_field() {
  python3 - "$WORK/response.json" "$1" <<'PY'
import json,sys
with open(sys.argv[1],encoding="utf-8") as f: data=json.load(f)
value=data
for key in sys.argv[2].split("."):
    if not isinstance(value,dict) or key not in value: raise SystemExit("FAIL: missing JSON key "+sys.argv[2])
    value=value[key]
if isinstance(value,(dict,list)): print(json.dumps(value,separators=(",",":")))
elif value is None: print("null")
else: print(value)
PY
}
STATUS="$(request GET "/api/commerce/access/tests/$TEST_ID")"
[[ "$STATUS" == 200 ]] || { echo "FAIL: entitlement lookup HTTP $STATUS" >&2; exit 1; }
python3 - "$WORK/response.json" <<'PY'
import json,sys
with open(sys.argv[1],encoding="utf-8") as f: d=json.load(f)
if d.get("allowed") is not True or d.get("paidAccessRequired") is not False:
    sys.exit("FAIL: fixture must be genuinely accessible and FREE (not a paid override)")
print("PASS: free fixture authorized; no paid entitlement manipulation")
PY
STATUS="$(request GET "/api/tests/$TEST_ID")"
[[ "$STATUS" == 200 ]] || { echo "FAIL: cannot read published test (HTTP $STATUS)" >&2; exit 1; }
STATUS="$(request POST /api/attempt-sessions "{\"testId\":\"$TEST_ID\"}")"
[[ "$STATUS" == 201 ]] || { echo "FAIL: session create HTTP $STATUS" >&2; exit 1; }
ATTEMPT_ID="$(json_field id)"
REVISION="$(json_field revision)"
[[ "$ATTEMPT_ID" =~ ^[0-9a-fA-F-]{36}$ ]] || { echo "FAIL: session ID" >&2; exit 1; }
[[ "$REVISION" =~ ^[0-9]+$ ]] || { echo "FAIL: session revision" >&2; exit 1; }
STATUS="$(request PATCH "/api/attempt-sessions/$ATTEMPT_ID" "{\"expectedRevision\":$REVISION,\"state\":{\"testId\":\"$TEST_ID\",\"testName\":\"Cloud Run disposable fixture\",\"category\":\"Smoke\",\"answers\":{},\"flags\":{},\"attemptType\":\"REAL\"}}")"
[[ "$STATUS" == 200 ]] || { echo "FAIL: save draft HTTP $STATUS" >&2; exit 1; }
SAVED_REV="$(json_field revision)"
[[ "$SAVED_REV" =~ ^[0-9]+$ ]] && (( SAVED_REV > REVISION )) || { echo "FAIL: revision not advanced" >&2; exit 1; }
STATUS="$(request GET "/api/attempt-sessions/$ATTEMPT_ID")"
[[ "$STATUS" == 200 ]] || { echo "FAIL: reload saved draft HTTP $STATUS" >&2; exit 1; }
[[ "$(json_field revision)" == "$SAVED_REV" ]] || { echo "FAIL: saved revision lost" >&2; exit 1; }
[[ "$(json_field state.testId)" == "$TEST_ID" ]] || { echo "FAIL: saved draft lost" >&2; exit 1; }
echo "PASS: canonical session written and persisted draft reloaded"

# Empty responses intentionally avoids guessing answer indexes or question IDs;
# the canonical scorer still verifies the published immutable question version.
PAYLOAD="{\"testId\":\"$TEST_ID\",\"attemptId\":\"$ATTEMPT_ID\",\"responses\":[],\"timeSpent\":0,\"attemptType\":\"REAL\"}"
STATUS="$(request POST /api/attempts "$PAYLOAD")"
[[ "$STATUS" == 201 ]] || { echo "FAIL: attempt submission HTTP $STATUS" >&2; exit 1; }
[[ "$(json_field id)" == "$ATTEMPT_ID" ]] || { echo "FAIL: submitted attempt ID changed" >&2; exit 1; }
STATUS="$(request GET "/api/attempts/$ATTEMPT_ID")"
[[ "$STATUS" == 200 ]] || { echo "FAIL: persisted result lookup HTTP $STATUS" >&2; exit 1; }
[[ "$(json_field id)" == "$ATTEMPT_ID" ]] || { echo "FAIL: persisted result ID changed" >&2; exit 1; }
STATUS="$(request POST /api/attempts "$PAYLOAD")"
[[ "$STATUS" == 200 ]] || { echo "FAIL: idempotent replay HTTP $STATUS" >&2; exit 1; }
[[ "$(json_field id)" == "$ATTEMPT_ID" ]] || { echo "FAIL: replay created another attempt" >&2; exit 1; }
echo "PASS: submission persisted, result retrievable, replay idempotent"
echo "PASS: disposable Cloud Run positive attempt gate, attempt=$ATTEMPT_ID"
echo "NOTE: this covers blank-answer scoring; separate UI E2E is needed for actual answer selections."
