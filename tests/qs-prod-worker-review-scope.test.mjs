import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {assertProductionWorkerReviewInput} from "../artifacts/api-server/prod-worker-review-scope.mjs";
const id="471d9323-d4c3-44e5-9b5a-9067f8c4b001";
const now=Date.parse("2026-10-22T02:00:00Z");
const scope={engineId:"reasoning-v1",packageId:"OPS-001",cpId:"OPS-CP-001",reviewOnly:true};
const env={EXAMTREE_API_RUNTIME:"cloud-run",EXAMTREE_API_STAGING:"false",EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_APPROVED:"true",EXAMTREE_QS_PRODUCTION_CANARY_ONLY:"true",EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID:id,EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT:"2026-10-22T02:10:00Z",EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_JSON:JSON.stringify([scope])};
const input={count:1,selectedCpIds:[scope.cpId],request:{engineId:scope.engineId,packageId:scope.packageId,canonicalProblemId:scope.cpId,count:1,language:"en",seed:"qs-async:"+id}};
test("only pinned explicitly approved review CP can compute",()=>assert.equal(assertProductionWorkerReviewInput(input,env,now),true));
for(const [name,params] of [
 ["no approval",{env:{EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_APPROVED:"false"}}],
 ["expired",{now:now+11*60000}],
 ["multiquestion",{input:{...input,count:2}}],
 ["different CP",{input:{...input,selectedCpIds:["OPS-CP-002"]}}],
 ["different engine",{input:{...input,request:{...input.request,engineId:"quant-v4"}}}],
 ["different seed",{input:{...input,request:{...input.request,seed:"qs-async:other"}}}],
 ["not production",{env:{EXAMTREE_API_STAGING:"true"}}],
 ["broad scope",{env:{EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_JSON:JSON.stringify([scope,scope])}}],
 ])test(name+" denied",()=>assert.throws(()=>assertProductionWorkerReviewInput(params.input??input,{...env,...params.env},params.now??now)));
test("legacy worker guard retained and review gate precedes execution",()=>{
 const worker=readFileSync("artifacts/api-server/universal-question-studio-worker-service.mjs","utf8");
 assert.match(worker,/assertProductionWorkerCanaryInput\(input\)/);
 assert.match(worker,/assertProductionWorkerReviewInput\(input\)/);
 assert.ok(worker.indexOf("assertProductionWorkerReviewInput(input)")<worker.indexOf("const batch = await execute(input)"));
});
