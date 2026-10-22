import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(p,"utf8");
const route=read("artifacts/api-server/src/routes/admin-question-studio-async-staging.ts");
const gate=read("artifacts/api-server/src/question-studio/staging-rollout-authorization.ts");
test("existing authenticated admin route remains isolated staging only",()=>{
 assert.match(route,/requireAdminPermission\("content\.generation\.run"\)/);
 assert.match(route,/EXAMTREE_API_STAGING/);
 assert.match(route,/QUESTION_STUDIO_STAGING_ENQUEUE_DISABLED/);
});
test("scope must be authorized BEFORE Neon enqueue",()=>{
 assert.ok(route.indexOf("stagingRolloutAllowed(")>route.indexOf("validateUniversalStudioComputeInput(compute)"));
 assert.ok(route.indexOf("stagingRolloutAllowed(")<route.indexOf("recordQuestionStudioEnqueueIntent("));
 assert.match(route,/QUESTION_STUDIO_STAGING_ROLLOUT_SCOPE_DENIED/);
});
test("no permissive scope defaults or unsafe production path",()=>{
 assert.match(gate,/EXAMTREE_QS_STAGING_REVIEW_SCOPE_APPROVED/);
 assert.match(gate,/EXAMTREE_QS_STAGING_REVIEW_SCOPE_JSON/);
 assert.match(gate,/validateReviewOnlyRollout/);
 assert.match(gate,/return false;/);
 assert.doesNotMatch(gate,/run\.services\.update|tasks\.queues\.resume/);
});
