import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {assertProdCanaryRequest,isProdCanarySnapshot}
  from "../artifacts/api-server/src/question-studio/prod-one-run-canary-guard.mjs";

const runId="471d9323-d4c3-44e5-9b5a-9067f8c4b001";
const now=Date.parse("2026-10-19T12:00:00.000Z");
const env=(changes={})=>({
  EXAMTREE_QS_PRODUCTION_CANARY_ONLY:"true",
  EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID:runId,
  EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT:"2026-10-19T12:10:00.000Z",
  ...changes,
});
const snapshot=(changes={})=>({
  queueVersion:1,count:1,selectedCpIds:["COM-001-CP-001"],
  request:{engineId:"knowledge-v1",packageId:"COM-001",canonicalProblemId:"COM-001-CP-001",
           count:1,language:"en",seed:"qs-async:testseed-12345"},
  ...changes,
});

test("one pinned canary run in 15-minute window is permitted",()=>{
  assert.equal(assertProdCanaryRequest(runId,env(),now),true);
});
test("deny absent activation and all unknown run IDs",()=>{
  assert.throws(()=>assertProdCanaryRequest(runId,env({EXAMTREE_QS_PRODUCTION_CANARY_ONLY:"false"}),now));
  assert.throws(()=>assertProdCanaryRequest("00000000-0000-4000-8000-000000000000",env(),now));
  assert.throws(()=>assertProdCanaryRequest(runId,{},now));
});
test("deny expired, oversized and malformed activation windows",()=>{
  assert.throws(()=>assertProdCanaryRequest(runId,env(),now+10*60*1000));
  assert.throws(()=>assertProdCanaryRequest(runId,env({EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT:"2026-10-19T12:30:00.000Z"}),now));
  assert.throws(()=>assertProdCanaryRequest(runId,env({EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT:"not-a-date"}),now));
});
test("accept exactly one deterministic COM-001 English review snapshot",()=>{
  assert.equal(isProdCanarySnapshot(snapshot()),true);
});
test("deny multiquestion, alternative engine, package, language or CP",()=>{
  for(const candidate of [
    snapshot({count:2}),snapshot({selectedCpIds:["COM-001-CP-001","COM-001-CP-002"]}),
    snapshot({request:{...snapshot().request,count:2}}),
    snapshot({request:{...snapshot().request,packageId:"NUM-001"}}),
    snapshot({request:{...snapshot().request,engineId:"quant-v4"}}),
    snapshot({request:{...snapshot().request,language:"hi"}}),
    snapshot({request:{...snapshot().request,seed:""}}),
  ])assert.equal(isProdCanarySnapshot(candidate),false);
});
test("receiver checks run ID before importing write-capable DB modules",()=>{
  const source=readFileSync("artifacts/api-server/src/async-task-receiver-prod-standalone.ts","utf8");
  const guard=source.indexOf("assertProdCanaryRequest(runId)");
  const importer=source.indexOf('import("./question-studio/async-task-lease-claim")');
  const claim=source.indexOf("claimQuestionStudioAsyncTask(runId,reviewGuard ?? isProdCanarySnapshot)");
  assert.ok(guard>0 && importer>guard && claim>importer);
});
test("lease claim verifies allowed snapshot while row locked and before first write",()=>{
  const source=readFileSync("artifacts/api-server/src/question-studio/async-task-lease-claim.ts","utf8");
  const guard=source.indexOf("if(allowSnapshot && !allowSnapshot(run.requestSnapshot))");
  const leaseWrite=source.indexOf("      INSERT INTO content.generation_run_task_leases");
  assert.ok(guard>0 && leaseWrite>guard);
});
