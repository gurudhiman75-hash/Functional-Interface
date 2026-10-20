import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {assertProductionWorkerCanaryEnvironment,assertProductionWorkerCanaryInput}
  from "../artifacts/api-server/production-canary-worker-scope.mjs";
const now=Date.parse("2026-10-19T08:00:00Z");
const runId="471d9323-d4c3-44e5-9b5a-9067f8c4b001";
const env={EXAMTREE_QS_PRODUCTION_CANARY_ONLY:"true",
  EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID:runId,
  EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT:"2026-10-19T08:10:00Z"};
const input={count:1,selectedCpIds:["COM-001-CP-001"],
  request:{engineId:"knowledge-v1",packageId:"COM-001",
    canonicalProblemId:"COM-001-CP-001",language:"en",difficulty:"Easy",
    count:1,seed:"qs-async:"+runId}};

test("production worker allows only timeboxed one-question canonical input",()=>{
  assert.equal(assertProductionWorkerCanaryEnvironment(env,now),runId);
  assert.equal(assertProductionWorkerCanaryInput(input,env,now),true);
});
test("production worker rejects missing approval and elapsed 15-minute window",()=>{
  assert.throws(()=>assertProductionWorkerCanaryInput(input,{},now));
  assert.throws(()=>assertProductionWorkerCanaryInput(input,env,now+10*60*1000));
  assert.throws(()=>assertProductionWorkerCanaryInput(input,
    {...env,EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT:"2026-10-19T08:30:00Z"},now));
});
test("production worker rejects wrong question, run, count, language and difficulty",()=>{
  for(const changed of [
    {...input,count:2},
    {...input,selectedCpIds:["COM-001-CP-002"]},
    {...input,request:{...input.request,count:2}},
    {...input,request:{...input.request,seed:"qs-async:another-run"}},
    {...input,request:{...input.request,packageId:"OPS-001"}},
    {...input,request:{...input.request,canonicalProblemId:"COM-001-CP-002"}},
    {...input,request:{...input.request,language:"hi"}},
    {...input,request:{...input.request,difficulty:"Hard"}},
  ])assert.throws(()=>assertProductionWorkerCanaryInput(changed,env,now));
});
test("production compute checks worker gate on each request before execution",()=>{
  const worker=readFileSync("artifacts/api-server/universal-question-studio-worker-service.mjs","utf8");
  const facade=readFileSync("artifacts/api-server/prod-universal-worker-service.mjs","utf8");
  const docker=readFileSync("Dockerfile.examtree-qs-prod-universal-worker","utf8");
  assert.ok(worker.indexOf("assertProductionWorkerCanaryInput(input)") <
            worker.indexOf("const batch = await execute(input)"));
  assert.match(facade,/assertProductionWorkerCanaryEnvironment\(env\)/);
  assert.match(docker,/production-canary-worker-scope\.mjs/);
});
test("one-time enqueue is not an HTTP route and always uses DB transaction",()=>{
  const source=readFileSync("artifacts/api-server/src/question-studio/prod-one-run-enqueue.ts","utf8");
  assert.match(source,/CLOUD_RUN_JOB!=="examtree-qs-prod-one-run-enqueue"/);
  assert.match(source,/CLOUD_RUN_TASK_ATTEMPT!=="0"/);
  assert.match(source,/sqlClient\.begin\(async tx=>/);
  assert.match(source,/pg_advisory_xact_lock/);
  assert.match(source,/generation_enqueue_idempotency/);
  assert.match(source,/question_studio\.generation_run\.queued\.v1/);
  assert.match(source,/EXAMTREE_QS_PRODUCTION_CANARY_ADMIN_USER_ID/);
  assert.doesNotMatch(source,/app\.post\(|express\(|tasks\.run\(|scheduler\.resume/);
});
test("built enqueue entry has no eager database connection",async()=>{
  const path="artifacts/api-server/dist/prod-one-run-enqueue.mjs";
  assert.ok(existsSync(path),"build isolated receiver first");
  const mod=await import("../"+path);
  const snapshot=mod.canarySnapshot(runId);
  assert.equal(snapshot.request.count,1);
  assert.equal(snapshot.request.seed,"qs-async:"+runId);
  assert.equal(snapshot.selectedCpIds[0],"COM-001-CP-001");
  assert.throws(()=>mod.assertCanaryEnqueueEnvironment({},now));
});

test("isolated canary enqueue binds Firebase UID to active non-admin Neon user",()=>{
  const source=readFileSync("artifacts/api-server/src/question-studio/prod-one-run-enqueue.ts","utf8");
  for(const clause of [
    "JOIN identity.auth_identities ai ON ai.user_id=u.id",
    "ai.provider='firebase' AND ai.provider_subject=$2",
    "WHERE u.id=$1::uuid AND u.status='active'",
    "ap.user_id IS NULL",
    "NOT EXISTS (SELECT 1 FROM identity.user_roles ur",
    "[adminId,actor]",
    "QS_CANARY_TEST_IDENTITY_INVALID"
  ])assert.ok(source.includes(clause),"Missing identity guard: "+clause);
});
