import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const file=readFileSync("artifacts/api-server/src/question-studio/prod-reviewed-enqueue-transaction.ts","utf8");
const legacy=readFileSync("artifacts/api-server/src/question-studio/prod-one-run-enqueue.ts","utf8");
test("prospective enqueue cannot execute from existing job or HTTP",()=>{
 assert.doesNotMatch(legacy,/prod-reviewed-enqueue-transaction|enqueueOneProductionReview/);
 assert.doesNotMatch(file,/app\.post\(|scheduler\.resume|tasks\.run\(/);
 assert.doesNotMatch(file,/process\.argv\[1\]|enqueueOneProductionReview\(\)\.catch/);
});
test("scope guard precedes database import and lock precedes writes",()=>{
 assert.ok(file.indexOf("authorizeProductionReviewEnqueue(")<file.indexOf('import("../lib/db")'));
 assert.ok(file.indexOf("validateAsyncTaskComputeInput(snapshot)")<file.indexOf('import("../lib/db")'));
 assert.ok(file.indexOf("pg_advisory_xact_lock")<file.indexOf("INSERT INTO content.generation_runs"));
 assert.ok(file.indexOf("active_runs")<file.indexOf("INSERT INTO content.generation_runs"));
});
test("review enqueue remains one-run atomic and keeps identity protections",()=>{
 for(const marker of ["sqlClient.begin(async tx=>","ap.user_id IS NULL",
 "NOT EXISTS (SELECT 1 FROM identity.user_roles ur","JOIN identity.auth_identities",
 "generation_enqueue_idempotency","platform.outbox_events","platform.audit_events",
 "QS_PROD_REVIEW_ENQUEUE_NOT_IDLE","qs-prod-review:","now()+interval '10 minutes'",
 "count:1","reviewOnly:true"]) assert.ok(file.includes(marker),marker);
});
