#!/usr/bin/env bash
set -euo pipefail
set +x
# Opt-in positive scored attempt smoke. Writes one disposable attempt to Neon main.
[[ "${EXAMTREE_ATTEMPT_WRITE_APPROVED:-}" == yes ]] || { echo 'FAIL: approval flag required'; exit 2; }
[[ -t 0 ]] || { echo 'FAIL: interactive TTY required'; exit 2; }
[[ "$(gcloud config get-value project 2>/dev/null)" == sarbedutech ]] || { echo 'FAIL: wrong project'; exit 2; }
TEST_ID=137cd15c-e3ad-424f-8a2e-482f42457ba8
URL="$(gcloud run services describe examtree-api-staging --project sarbedutech --region asia-south1 --format='value(status.url)')"
[[ "$URL" =~ ^https://[a-zA-Z0-9.-]+[.]run[.]app$ ]] || { echo 'FAIL: staging URL'; exit 2; }
read -r -p 'Type SCORE-DISPOSABLE-ATTEMPT to authorize one scored fixture write: ' CONFIRM
[[ "$CONFIRM" == SCORE-DISPOSABLE-ATTEMPT ]] || { echo 'FAIL: confirmation required'; exit 2; }
umask 077
TMP="$(mktemp -d)"
TOKEN=''
trap 'TOKEN=""; rm -rf "$TMP"' EXIT
read -r -s -p 'Paste existing disposable student Firebase ID token (hidden): ' TOKEN
echo
[[ "$TOKEN" =~ ^[A-Za-z0-9_-]+[.][A-Za-z0-9_-]+[.][A-Za-z0-9_-]+$ ]] || { echo 'FAIL: expected JWT'; exit 2; }
req() {
 local method="$1" path="$2" payload="${3:-}" status
 if [[ -n "$payload" ]]; then
   printf '%s' "$payload" > "$TMP/payload"
   status="$(printf 'header = "Authorization: Bearer %s"\nheader = "Content-Type: application/json"\n' "$TOKEN" | curl --config - -sS --max-time 90 -X "$method" --data-binary @"$TMP/payload" -o "$TMP/body" -w '%{http_code}' "$URL$path")"
 else
   status="$(printf 'header = "Authorization: Bearer %s"\n' "$TOKEN" | curl --config - -sS --max-time 90 -X "$method" -o "$TMP/body" -w '%{http_code}' "$URL$path")"
 fi
 printf '%s' "$status"
}
need() {
 [[ "$1" == "$2" ]] || { echo "FAIL: $3 HTTP $1 (expected $2)" >&2; exit 1; }
}
need "$(req GET "/api/commerce/access/tests/$TEST_ID")" 200 access
python3 - "$TMP/body" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
assert d.get('allowed') is True and d.get('paidAccessRequired') is False, 'fixture must be free'
print('PASS: free fixture access')
PY
need "$(req GET "/api/tests/$TEST_ID")" 200 questions
python3 - "$TMP/body" "$TMP/submit.json" "$TEST_ID" <<'PY'
import json,sys
data=json.load(open(sys.argv[1]))
qs=[q for s in data['sections'] for q in s['questions']]
assert len(qs)==3, 'fixture questions changed'
# Fixture DB answer keys verified on 2026-10-11: D/C/A. Test selects D on
# first (correct), A on second (wrong), third unattempted.
assert all(len(q['options'])==4 for q in qs), 'fixture options changed'
payload={'testId':sys.argv[3],'responses':[
  {'questionId':qs[0]['id'],'selectedOption':3,'timeTaken':12},
  {'questionId':qs[1]['id'],'selectedOption':0,'timeTaken':8}],
  'timeSpent':1,'attemptType':'REAL'}
json.dump(payload,open(sys.argv[2],'w'))
PY
need "$(req POST /api/attempt-sessions "{\"testId\":\"$TEST_ID\"}")" 201 session
python3 - "$TMP/body" "$TMP/submit.json" <<'PY'
import json,sys
s=json.load(open(sys.argv[1]))
p=json.load(open(sys.argv[2]))
assert s['status']=='in_progress'
p['attemptId']=s['id']
json.dump(p,open(sys.argv[2],'w'))
print('PASS: scored session created')
PY
need "$(req POST /api/attempts "$(cat "$TMP/submit.json")")" 201 submit
cp "$TMP/body" "$TMP/first-result.json"
python3 - "$TMP/body" "$TMP/attempt-id" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
assert (d['correct'],d['wrong'],d['unanswered'],d['totalQuestions'])==(1,1,1,3),d
assert abs(float(d['actualScore'])-1.5)<0.001,d
assert d['score']==33,d
open(sys.argv[2],'w').write(d['id'])
print('PASS: correct=1 wrong=1 unanswered=1, score=1.5/6, accuracy=33% of all questions')
PY
ID="$(cat "$TMP/attempt-id")"
need "$(req GET "/api/attempts/$ID")" 200 result
python3 - "$TMP/body" "$TMP/first-result.json" <<'PY'
import json,sys
a=json.load(open(sys.argv[1]));b=json.load(open(sys.argv[2]))
assert a['id']==b['id'] and a['actualScore']==b['actualScore']
print('PASS: scored result persisted')
PY
need "$(req POST /api/attempts "$(cat "$TMP/submit.json")")" 200 replay
python3 - "$TMP/body" "$ID" <<'PY'
import json,sys
assert json.load(open(sys.argv[1]))['id']==sys.argv[2]
print('PASS: repeat submission idempotent')
PY
echo "PASS: scored attempt gate ID=$ID"
