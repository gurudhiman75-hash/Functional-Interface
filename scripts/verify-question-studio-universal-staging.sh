#!/usr/bin/env bash
# Read-only/compute-only Cloud Run staging acceptance for universal Question Studio.
# No Neon URL, Firebase user token, production API route or finance access.
set -euo pipefail
set +x
PROJECT=sarbedutech
REGION=asia-south1
SERVICE=examtree-universal-staging
SECRET=examtree-trg002-worker-token
ENDPOINT=/internal/question-studio/universal/generate
[[ "${EXAMTREE_BUDGET_READY:-}" == "yes" && "${EXAMTREE_UNIVERSAL_STAGING_CHECK_APPROVED:-}" == "yes" ]] || {
  echo "REFUSED: review billing budget/alerts and approve staging compute checks." >&2
  exit 2
}
[[ "$(gcloud config get-value project 2>/dev/null)" == "$PROJECT" ]] || {
  echo "REFUSED: select Google Cloud project sarbedutech." >&2
  exit 2
}
TMP="$(mktemp -d)"
umask 077
cleanup(){ unset TOKEN; rm -rf "$TMP"; }
trap cleanup EXIT
gcloud run services describe "$SERVICE" --project="$PROJECT" --region="$REGION" --format=json > "$TMP/service.json"
URL="$(python3 - "$TMP/service.json" <<'PY'
import json,sys,os
with open(sys.argv[1]) as f:s=json.load(f)
status=s.get('status',{})
ready=status.get('latestReadyRevisionName')
assert ready and ready==status.get('latestCreatedRevisionName'),"staging revision not healthy"
traffic=status.get('traffic',[])
assert sum(int(x.get('percent',0)) for x in traffic)==100,"staging traffic not ready"
candidate=os.environ.get('EXAMTREE_UNIVERSAL_STAGING_TAG','').strip()
if candidate:
 assert candidate=="fix-candidate","Only the reviewed fix-candidate tag is permitted"
 matches=[x for x in traffic if x.get('tag')==candidate and x.get('revisionName')==ready]
 assert len(matches)==1 and int(matches[0].get('percent',0))==0,"candidate must be ready and serve zero percent"
 assert sum(int(x.get('percent',0)) for x in traffic if x.get('revisionName')!=ready)==100, "previous revision must retain all live staging traffic"
 url=matches[0].get('url','')
else:
 url=status.get('url','')
spec=s['spec']['template']['spec']
c=spec['containers'][0]
assert not any(x['name'] in ('DATABASE_URL','CASHFREE_CLIENT_SECRET','OPENAI_API_KEY','FIREBASE_PRIVATE_KEY') for x in c.get('env',[])), "forbidden worker credential present"
assert any(x.get('name')=='QUESTION_STUDIO_WORKER_TOKEN' for x in c.get('env',[])), "worker token secret not configured"
assert url.startswith('https://') and url.endswith('.run.app'),"invalid staging run.app URL"
print(url)
PY
)"
curl --fail --silent --show-error --max-time 30 -o "$TMP/health.json" "$URL/health"
python3 - "$TMP/health.json" <<'PY'
import json,sys
with open(sys.argv[1]) as f:x=json.load(f)
assert x.get("status")=="ok"
assert set(x.get("engineFamilies",[]))=={"quant-v4","reasoning-v1","language-v1","knowledge-v1"}
print("PASS: universal staging health and all four engine families advertised")
PY
CODE="$(curl -sS --max-time 30 -o /dev/null -w '%{http_code}' -X POST "$URL$ENDPOINT")"
[[ "$CODE" == "401" ]] || { echo "FAIL: anonymous generation HTTP $CODE (expected 401)" >&2; exit 1; }
CODE="$(curl -sS --max-time 30 -o /dev/null -w '%{http_code}' "$URL/internal/unknown")"
[[ "$CODE" == "404" ]] || { echo "FAIL: unexpected route HTTP $CODE (expected 404)" >&2; exit 1; }
echo "PASS: worker authorization and path isolation"
TOKEN="$(gcloud secrets versions access latest --secret="$SECRET" --project="$PROJECT")"
[[ ${#TOKEN} -ge 32 ]] || { echo "FAIL: worker secret malformed" >&2; exit 1; }

# No source content, personally identifying data or customer DB writes.
# Quant NUM-001 exercises the specialized data-backed CP as a separate 3-Q case.
CASES=(
  'quant-v4|TRG-002|Advanced Mathematics|Trigonometry — Heights & Distances|Medium|RELEASED|TRG-CP-007|1'
  'reasoning-v1|OPS-001|Mathematical Operations|Mathematical Operations|Mixed|review-only||1'
  'language-v1|ENG-001|Error Spotting|Common Usage / Idiomatic Grammar|Medium|review-only|ENG-001-CP013|1'
  'knowledge-v1|COM-001|Computer Awareness|Computer Basics|Mixed|review-only||1'
  'quant-v4|TRG-002|Advanced Mathematics|Trigonometry — Heights & Distances|Medium|RELEASED|TRG-CP-007|3'
  'quant-v4|NUM-001|Arithmetic|Number System|Mixed|QUESTION_STUDIO_ACTIVE|NUM-CP-001|3'
)
for test_case in "${CASES[@]}"; do
  IFS='|' read -r ENGINE PACKAGE TOPIC SUBTOPIC DIFF MODE CP COUNT <<< "$test_case"
  ENGINE="$ENGINE" PACKAGE="$PACKAGE" TOPIC="$TOPIC" SUBTOPIC="$SUBTOPIC" \
  DIFF="$DIFF" MODE="$MODE" CP="$CP" COUNT="$COUNT" python3 - > "$TMP/request.json" <<'PY'
import json,os
g=os.environ
p=g["PACKAGE"]
cp=g["CP"]
req={
 "engineId":g["ENGINE"],"packageId":p,"count":int(g["COUNT"]),
 "exam":"SSC CGL Tier 1",
 "subject":("Quantitative Aptitude" if g["ENGINE"]=="quant-v4" else "Reasoning Ability" if g["ENGINE"]=="reasoning-v1" else "English" if g["ENGINE"]=="language-v1" else "Static GK"),
 "topic":g["TOPIC"],"subtopic":g["SUBTOPIC"],"language":"en","difficulty":g["DIFF"],
 "runtimeMode":g["MODE"],"seed":"cloudrun-universal-staging-parity-"+p+"-"+g["COUNT"],
}
if cp: req["canonicalProblemId"]=cp
payload={"request":req,"selectedCpIds":[cp] if cp else [],"count":int(g["COUNT"])}
# NUM-001 uses source-defined difficulty labels; the profile planner may
# assign mixed buckets but MUST NOT forward Easy/Medium/Hard to this engine.
# Mirrors the canonical admin API, allowing the existing Cloud Run candidate
# to be tested without deploying or reconfiguring it.
if p=="NUM-001":
 payload["difficultyFilterSupported"]=False
 payload["forwardLegacyExamProfile"]=True
print(json.dumps(payload))
PY
  STATUS="$(curl -sS --max-time 170 -o "$TMP/response.json" -w '%{http_code}' \
      -H 'Content-Type: application/json' \
      -H "X-Examtree-Worker-Token: $TOKEN" \
      --data-binary "@$TMP/request.json" "$URL$ENDPOINT")"
  CODE="$STATUS" ENGINE="$ENGINE" PACKAGE="$PACKAGE" COUNT="$COUNT" python3 - "$TMP/response.json" <<'PY'
import json,os,sys
with open(sys.argv[1]) as f:d=json.load(f)
code=os.environ["CODE"]; engine=os.environ["ENGINE"]; package=os.environ["PACKAGE"]
count=int(os.environ["COUNT"])
if code!="200" or d.get("ok") is not True:
 print("FAIL:",package,count,"HTTP",code,"code",d.get("code","UNKNOWN"),"reason",str(d.get("error",""))[:160])
 raise SystemExit(1)
batch=d.get("batch",{})
qs=batch.get("questions",[])
assert batch.get("engineId")==engine and batch.get("packageId")==package, "worker routed wrong engine/package"
assert isinstance(qs,list) and len(qs)==count,"wrong question count"
assert isinstance(batch.get("generationContexts"),list),"missing review provenance"
if engine=="quant-v4": assert isinstance(batch.get("quantPlan"),dict),"quant plan missing"
if package=="NUM-001":
 assert all(q.get("generationContext",{}).get("difficultyFilterApplied") is False for q in qs), "NUM-001 source difficulty filter must remain disabled"
for q in qs:
 assert isinstance(q,dict),"question not a record"
 assert isinstance(q.get("options"),list) and len(q["options"])>=2,"options missing"
 assert any(isinstance(q.get(x),str) and q[x].strip() for x in ("stem","text")),"stem missing"
 assert any(q.get(x) is not None for x in ("correct","correctIndex","answer")),"answer missing"
 assert isinstance(q.get("explanation"),str) and q["explanation"].strip(),"explanation missing"
print("PASS:",engine,package,count,"questions with answers and explanations (compute only)")
PY
done
echo "PASS: all universal Cloud Run staging generation cases completed."
echo "No DB write, Queue activation, production worker deployment or website routing change was requested."
