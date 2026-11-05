import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {summarizeAsyncBulkReview} from "../artifacts/api-server/src/question-studio/async-bulk-progress.mjs";

test("partial progress retains completed review work and shows unresolved batches",()=>{
 const summary=summarizeAsyncBulkReview({requestedCount:42},[
   {batchIndex:0,count:14,generatedCount:14,status:"review",runId:"run-a"},
   {batchIndex:1,count:14,generatedCount:0,status:"needs_reconciliation",runId:null},
   {batchIndex:2,count:14,generatedCount:6,status:"running",runId:"run-c"},
 ]);
 assert.equal(summary.generatedCount,20);
 assert.equal(summary.awaitingReview,14);
 assert.equal(summary.completedBatches,1);
 assert.equal(summary.needsReconciliationBatches,1);
 assert.equal(summary.activeBatches,1);
 assert.equal(summary.requiresAttention,true);
 assert.equal(summary.readyForReview,false);
 assert.equal(summary.batches[0].runId,"run-a");
});
test("progress rejects missing, duplicated and over-counted children",()=>{
 const op={requestedCount:21};
 for(const rows of [
   [{batchIndex:0,count:20,generatedCount:20,status:"review"}],
   [{batchIndex:0,count:20,generatedCount:20,status:"review"},{batchIndex:0,count:1,generatedCount:0,status:"planned"}],
   [{batchIndex:0,count:20,generatedCount:21,status:"review"},{batchIndex:1,count:1,generatedCount:0,status:"planned"}],
 ]) assert.throws(()=>summarizeAsyncBulkReview(op,rows));
});
test("bulk persistence is source-only and has no production dispatcher wiring",()=>{
 const migration=readFileSync("artifacts/api-server/migrations/20261105_question_studio_async_bulk_operations.sql","utf8");
 const reserve=readFileSync("artifacts/api-server/src/question-studio/async-bulk-reservations.ts","utf8");
 const route=readFileSync("artifacts/api-server/src/routes/admin-question-studio-bulk-hardening.ts","utf8");
 assert.match(migration,/UNIQUE \(actor_firebase_uid,idempotency_key\)/);
 assert.match(migration,/generation_run_id uuid UNIQUE REFERENCES content\.generation_runs/);
 assert.match(reserve,/ON CONFLICT \(actor_firebase_uid,idempotency_key\) DO NOTHING/);
 assert.match(reserve,/planAsyncChapterReviewBatches/);
 assert.match(reserve,/BULK_ASYNC_RESERVATION_INCOMPLETE/);
 assert.doesNotMatch(reserve,/enqueueAndDispatchChapter|launchProductionChapterDispatch|createTask\(/);
 assert.doesNotMatch(route,/async-bulk-reservations|async-bulk-progress/);
});
