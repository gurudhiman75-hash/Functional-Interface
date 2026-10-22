import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const receiver=readFileSync("artifacts/api-server/src/async-task-receiver-prod-standalone.ts","utf8");
const gate=readFileSync("artifacts/api-server/src/question-studio/prod-review-receiver-gate.mjs","utf8");
test("OIDC verified and fixed run checked before any SQL import",()=>{
 assert.ok(receiver.indexOf("await verifyOidc(")<receiver.indexOf('import("./question-studio/async-task-lease-claim")'));
 assert.ok(receiver.indexOf("assertProdCanaryRequest(runId)")<receiver.indexOf('import("./question-studio/async-task-lease-claim")'));
});
test("legacy production COM-001 snapshot restriction remains default",()=>{
 assert.match(receiver,/reviewGuard \?\? isProdCanarySnapshot/);
 assert.match(receiver,/claimQuestionStudioAsyncTask\(runId,reviewGuard \?\? isProdCanarySnapshot\)/);
});
test("no scope activation via request and safe denial before lease",()=>{
 assert.match(receiver,/QS_PRODUCTION_REVIEW_SCOPE_NOT_AUTHORIZED/);
 assert.ok(receiver.indexOf("createProdReviewSnapshotGuard(runId)")<receiver.indexOf("claimQuestionStudioAsyncTask(runId"));
 assert.match(gate,/EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_APPROVED/);
 assert.match(gate,/scope.length!==1/);
 assert.doesNotMatch(gate,/process\.env\.[A-Z_]+\s*=|tasks\.queues\.resume/);
});
