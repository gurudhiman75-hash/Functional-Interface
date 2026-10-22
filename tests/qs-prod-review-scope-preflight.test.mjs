import test from "node:test";
import assert from "node:assert/strict";
import {isProductionReviewScopeAuthorized as ok} from "../artifacts/api-server/src/question-studio/prod-review-scope-preflight.mjs";
const id="c71b5ccb-8aa6-44e0-b0a5-01a3607a9c98",now=Date.parse("2026-10-22T02:00:00Z");
const snapshot={queueVersion:1,count:1,selectedCpIds:["COM-001-CP-001"],request:{engineId:"knowledge-v1",packageId:"COM-001",canonicalProblemId:"COM-001-CP-001",language:"en",count:1,seed:"production-review-test"}};
const manifest={source:"canonical-question-studio-engine-registry",schemaVersion:1,packages:[{engineId:"knowledge-v1",packageId:"COM-001",cpIds:["COM-001-CP-001"],enabled:true,reviewSurfaceRequired:true,manualApprovalRequired:true,questionBankWritable:false,automaticStudentPublication:false,productionReleaseAuthorized:false,supportedLanguages:["en"]}]};
const scope=[{engineId:"knowledge-v1",packageId:"COM-001",cpId:"COM-001-CP-001",reviewOnly:true}];
const env={EXAMTREE_API_RUNTIME:"cloud-run",EXAMTREE_API_STAGING:"false",EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_APPROVED:"true",EXAMTREE_QS_PRODUCTION_CANARY_ONLY:"true",EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID:id,EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT:"2026-10-22T02:10:00Z"};
test("accept exact separately authorized pinned review run only",()=>assert.equal(ok(id,snapshot,manifest,scope,env,now),true));
for(const [label,change] of [
 ["approval off",{EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_APPROVED:"false"}],
 ["not canary",{EXAMTREE_QS_PRODUCTION_CANARY_ONLY:"false"}],
 ["staging",{EXAMTREE_API_STAGING:"true"}],
 ["wrong run",{EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID:"48aaff58-d0cb-4345-be5f-491089b72f10"}],
 ["expired",{EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT:"2026-10-22T01:59:59Z"}],
 ["too far",{EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT:"2026-10-22T02:16:00Z"}],
 ]) test(label+" is denied",()=>assert.equal(ok(id,snapshot,manifest,scope,{...env,...change},now),false));
test("empty approved CP scope denied",()=>assert.equal(ok(id,snapshot,manifest,[],env,now),false));
test("two-question snapshot denied",()=>assert.equal(ok(id,{...snapshot,count:2},manifest,scope,env,now),false));
