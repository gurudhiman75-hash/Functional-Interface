import test from "node:test";
import assert from "node:assert/strict";
import {authorizeProductionReviewEnqueue as authorize} from "../artifacts/api-server/src/question-studio/prod-review-enqueue-preflight.mjs";
const runId="f12a0b38-62da-4eb0-9af8-6bb6dc3ca115",now=Date.parse("2026-10-22T04:00:00Z");
const scope=[{engineId:"reasoning-v1",packageId:"OPS-001",cpId:"OPS-CP-001",reviewOnly:true}];
const snapshot={queueVersion:1,count:1,selectedCpIds:["OPS-CP-001"],request:{engineId:"reasoning-v1",packageId:"OPS-001",canonicalProblemId:"OPS-CP-001",language:"en",count:1,seed:"qs-async:"+runId}};
const manifest={source:"canonical-question-studio-engine-registry",schemaVersion:1,packages:[{engineId:"reasoning-v1",packageId:"OPS-001",cpIds:["OPS-CP-001"],enabled:true,reviewSurfaceRequired:true,manualApprovalRequired:true,questionBankWritable:false,automaticStudentPublication:false,productionReleaseAuthorized:false,supportedLanguages:["en"]}]};
const env={CLOUD_RUN_JOB:"examtree-qs-prod-one-run-enqueue",CLOUD_RUN_TASK_COUNT:"1",CLOUD_RUN_TASK_INDEX:"0",CLOUD_RUN_TASK_ATTEMPT:"0",GOOGLE_CLOUD_PROJECT:"sarbedutech",EXAMTREE_API_RUNTIME:"cloud-run",EXAMTREE_API_STAGING:"false",EXAMTREE_QS_PRODUCTION_CANARY_ENQUEUE_APPROVED:"true",EXAMTREE_QS_PRODUCTION_DATABASE_BINDING_VERIFIED:"true",EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED:"true",EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED:"true",EXAMTREE_QS_PRODUCTION_CANARY_ONLY:"true",EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID:runId,EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT:"2026-10-22T04:10:00Z",EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_APPROVED:"true"};
test("one approved run allowed under controlled environment",()=>assert.equal(authorize(runId,snapshot,manifest,scope,env,now),true));
for(const [label,override] of [
 ["enqueuer approval absent",{EXAMTREE_QS_PRODUCTION_CANARY_ENQUEUE_APPROVED:"false"}],
 ["outbox disabled",{EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED:"false"}],
 ["second task attempt",{CLOUD_RUN_TASK_ATTEMPT:"1"}],
 ["wrong job",{CLOUD_RUN_JOB:"another-job"}],
 ["scope not approved",{EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_APPROVED:"false"}],
 ["expired",{EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT:"2026-10-22T03:59:00Z"}],
 ["wrong pinned run",{EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID:"3d3b9a87-20bc-4182-984d-60237457495f"}],
])test(label+" denied",()=>assert.equal(authorize(runId,snapshot,manifest,scope,{...env,...override},now),false));
test("no replay of completed canary",()=>assert.equal(authorize("c71b5ccb-8aa6-44e0-b0a5-01a3607a9c98",snapshot,manifest,scope,env,now),false));
test("different seed denied",()=>assert.equal(authorize(runId,{...snapshot,request:{...snapshot.request,seed:"bad"}},manifest,scope,env,now),false));
test("no broad scope",()=>assert.equal(authorize(runId,snapshot,manifest,[...scope,...scope],env,now),false));
