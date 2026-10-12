#!/usr/bin/env bash
# Read-only Cloud Run tagged-admin acceptance. Never logs token or JSON records.
# Does not create generation runs, edit users, access finance, or promote traffic.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-api
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || {
  echo "REFUSED: must run in sarbedutech Cloud Shell" >&2; exit 2;
}
[[ -t 0 ]] || {
  echo "REFUSED: an interactive terminal is required for hidden Firebase token entry" >&2; exit 2;
}
TMP="$(mktemp -d)"
umask 077
cleanup(){ unset ID_TOKEN; rm -rf "$TMP"; }
trap cleanup EXIT
gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json > "$TMP/service.json"
CANDIDATE_URL="$(python3 - "$TMP/service.json" <<'PY'
import json,sys
with open(sys.argv[1]) as f:s=json.load(f)
status=s.get('status',{})
rev=status.get('latestReadyRevisionName')
tag=next((x for x in status.get('traffic',[]) if x.get('tag')=='admin-candidate' and x.get('revisionName')==rev),None)
assert tag and int(tag.get('percent',0))==0, 'zero-traffic admin candidate tag not found'
assert sum(int(x.get('percent',0)) for x in status.get('traffic',[]) if x.get('revisionName')!=rev)==100
print(tag['url'])
PY
)"
[[ "$CANDIDATE_URL" == https://*.run.app ]] || { echo "FAIL: candidate URL" >&2; exit 2; }
echo "Read-only admin verification on tagged 0%-traffic Cloud Run candidate."
echo "Use a fresh, existing superadmin Firebase ID token; never paste it in chat."
IFS= read -r -s -p "Firebase superadmin ID token (hidden): " ID_TOKEN
printf '\n'
[[ ${#ID_TOKEN} -gt 150 ]] || { echo "REFUSED: token absent/too short" >&2; exit 2; }

for case in question_studio review notes_capabilities notes_periods; do
  case "$case" in
    question_studio) PATH_QUERY='/api/admin/question-studio/capabilities' ;;
    review) PATH_QUERY='/api/admin/question-studio/review-page?page=1&pageSize=1' ;;
    notes_capabilities) PATH_QUERY='/api/admin/notes-studio-v2/capabilities' ;;
    notes_periods) PATH_QUERY='/api/admin/notes-studio-v2/periods' ;;
  esac
  CODE="$(curl -sS --max-time 120 -o "$TMP/$case.json" -w '%{http_code}' \
    -H "Authorization: Bearer $ID_TOKEN" "$CANDIDATE_URL$PATH_QUERY")"
  CASE="$case" CODE="$CODE" python3 - "$TMP/$case.json" <<'PY'
import json,os,sys
case=os.environ['CASE']
status=os.environ['CODE']
with open(sys.argv[1]) as f:d=json.load(f)
assert status=='200',(case,'HTTP '+status,d.get('code') if isinstance(d,dict) else 'response')
if case=='question_studio':
 assert isinstance(d.get('packages'),list) and len(d['packages'])>0
elif case=='review':
 assert isinstance(d.get('runs'),list) and isinstance(d.get('pagination'),dict)
elif case=='notes_capabilities':
 assert d.get('product')=='notes-studio-v2'
elif case=='notes_periods':
 assert isinstance(d,list)
print('PASS: authenticated read-only',case)
PY
done
unset ID_TOKEN
echo "PASS: admin Question Studio and Notes Studio read acceptance."
echo "NOT DONE: student RBAC denial, media permissions, real generation writes or public traffic promotion."
