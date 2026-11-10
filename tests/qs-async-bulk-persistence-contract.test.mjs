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
test("complete state requires every requested generated question",()=>{
 assert.throws(()=>summarizeAsyncBulkReview({requestedCount:5},[
   {batchIndex:0,count:5,generatedCount:4,status:"review",runId:"saved"}
 ]),/BULK_ASYNC_INCOMPLETE_REVIEW_BATCH/);
 const done=summarizeAsyncBulkReview({requestedCount:5},[
   {batchIndex:0,count:5,generatedCount:5,status:"review",runId:"saved"}
 ]);
 assert.equal(done.readyForReview,true);
});

test("bulk persistence is default-off and safely guarded",()=>{
 const migration=readFileSync("artifacts/api-server/migrations/20261105_question_studio_async_bulk_operations.sql","utf8");
 const reserve=readFileSync("artifacts/api-server/src/question-studio/async-bulk-reservations.ts","utf8");
 const route=readFileSync("artifacts/api-server/src/routes/admin-question-studio-bulk-hardening.ts","utf8");
 assert.match(migration,/UNIQUE \(actor_firebase_uid,idempotency_key\)/);
 assert.match(migration,/generation_run_id uuid UNIQUE REFERENCES content\.generation_runs/);
 assert.match(reserve,/ON CONFLICT \(actor_firebase_uid,idempotency_key\) DO NOTHING/);
 assert.match(reserve,/planAsyncChapterReviewBatches/);
 assert.match(reserve,/BULK_ASYNC_RESERVATION_INCOMPLETE/);
 assert.doesNotMatch(reserve,/enqueueAndDispatchChapter|launchProductionChapterDispatch|createTask\(/);
 assert.match(route,/adminQuestionStudioAsyncBulkRouter/);
 const bulk=readFileSync("artifacts/api-server/src/routes/admin-question-studio-async-bulk.ts","utf8");
 assert.match(bulk,/EXAMTREE_QS_BULK_ASYNC_REVIEW_ENABLED/);
 assert.ok(bulk.includes('requireAdminPermission("content.generation.run")'));
 assert.match(bulk,/validateProductionChapterReview/);
 assert.match(bulk,/QS_BULK_CHILD_RECONCILIATION_REQUIRED/);
 assert.match(bulk,/digestCanonicalEnqueueRequest/);
 assert.match(bulk,/terminalComplete\(r\)/);
 assert.match(bulk,/Number\(row\.generated_count\)===Number\(row\.requested_count\)/);
 assert.match(bulk,/needs_reconciliation/);
 assert.ok(!bulk.includes("content.questions") && !bulk.includes("automaticStudentPublication:true"));
});

test("bulk flow preserves latest multilingual review workflow",()=>{
 const page=readFileSync("artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx","utf8");
 assert.match(page,/const \[languages, setLanguages\]/);
 assert.match(page,/setQueuedLanguageRuns/);
 assert.match(page,/applyRevision\(result\.item\)/);
 assert.match(page,/languages\.length !== 1/);
 assert.match(page,/reserveQuestionStudioBulkReview/);
 assert.match(page,/reconcileQuestionStudioBulkReviewChild/);
 assert.match(page,/BULK_ASYNC_ENABLED/);
});

test("bulk dispatch diagnostics distinguish outbox acknowledgement from live task confirmation",()=>{
 const api=readFileSync("artifacts/api-server/src/routes/admin-question-studio-async-bulk.ts","utf8");
 const page=readFileSync("artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx","utf8");
 assert.match(api,/event_type='question_studio\.generation_run\.chapter_review_queued\.v1'/);
 assert.match(api,/dispatchAcknowledgedAt/);
 assert.match(api,/deadlineExpired/);
 assert.match(api,/expectedTaskId/);
 const retry=readFileSync("artifacts/api-server/src/routes/admin-question-studio-async-production-chapters.ts","utf8");
 assert.match(retry,/QS_PROD_CHAPTER_DISPATCH_ALREADY_ACKNOWLEDGED/);
 assert.match(retry,/QS_PROD_CHAPTER_RUN_EXPIRED/);
 assert.match(page,/Cloud Task not independently verified/);
 assert.match(page,/batch\.dispatchState==='pending' && !batch\.deadlineExpired/);
 assert.match(page,/Run deadline expired\. Do not redispatch/);
 assert.match(page,/Queue pause\/resume remains an operator-only Cloud Tasks action/);
 assert.match(page,/Run all remaining batches \(up to 250\)/);
 assert.match(page,/bulkAutoAttemptedChildren\.current\.add\(attemptKey\)/);
 assert.match(page,/bulkAsyncOperation\.requiresAttention/);
 assert.match(page,/previous\.status === 'review' \|\| previous\.status === 'completed'/);
 assert.match(page,/setBulkAutoAdvance\(false\)/);
});

test("overdue production child is projected as attention, never silently left active",()=>{
 const route=readFileSync("artifacts/api-server/src/routes/admin-question-studio-async-bulk.ts","utf8");
 const ui=readFileSync("artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx","utf8");
 const transport=readFileSync("artifacts/api-server/src/question-studio/async-cloud-tasks-transport.ts","utf8");
 const lease=readFileSync("artifacts/api-server/src/question-studio/async-task-lease-policy.ts","utf8");
 assert.match(lease,/QUESTION_STUDIO_TASK_LEASE_SECONDS = 240/);
 const claims=readFileSync("artifacts/api-server/src/question-studio/async-task-lease-claim.ts","utf8");
 const receiver=readFileSync("artifacts/api-server/src/async-task-receiver-prod-standalone.ts","utf8");
 assert.match(claims,/releaseQuestionStudioAsyncTaskLeaseAfterFailure/);
 assert.match(claims,/AND lease_token=\$\{leaseToken\}::uuid/);
 assert.match(claims,/SET lease_expires_at=now\(\)/);
 assert.match(receiver,/await releaseQuestionStudioAsyncTaskLeaseAfterFailure/);
 assert.match(receiver,/activeClaim=null/);
 assert.match(transport,/dispatchDeadline: "300s"/);
 assert.match(route,/const overdue=Boolean\(r\.deadline_expired\) && !Boolean\(r\.lease_active\)/);
 assert.match(route,/const status=overdue \? "needs_reconciliation"/);
 assert.match(ui,/backend diagnostics may not be deployed/);
 assert.match(ui,/batch\.overdueNeedsAttention/);
 assert.match(ui,/batch\.status==='needs_reconciliation' && !batch\.runId/);
});

test("expired child recovery is explicit, owner-bound, empty-only and never auto-dispatched",()=>{
 const route=readFileSync("artifacts/api-server/src/routes/admin-question-studio-async-bulk.ts","utf8");
 const ui=readFileSync("artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx","utf8");
 const endpoint=route.slice(route.indexOf('router.post("/bulk-async/:operationId/children/:index/recover-expired"'));
 assert.match(endpoint,/requireAdminPermission\("content\.generation\.run"\)/);
 assert.match(endpoint,/o\.actor_firebase_uid/);
 assert.match(endpoint,/o\.requested_by/);
 assert.match(endpoint,/new Date\(run\.due_at\)\.getTime\(\)>Date\.now\(\)-600_000/);
 assert.match(endpoint,/lease_expires_at/);
 assert.match(endpoint,/Number\(evidence\[0\]\?\.items\)!==0/);
 assert.match(endpoint,/chapterretry:/);
 assert.match(endpoint,/status='failed'::generation_run_status/);
 assert.match(endpoint,/generation_run_id=NULL/);
 assert.match(endpoint,/platform\.audit_events/);
 assert.doesNotMatch(endpoint,/launchProductionChapterDispatch\(|recordQuestionStudioEnqueueIntent\(/);
 assert.match(ui,/Recover expired empty batch/);
 assert.match(ui,/window\.confirm\('Request guarded recovery of this expired, empty batch/);
});

test("operator-closed empty bulk run becomes recoverable without overwriting failure history",()=>{
 const route=readFileSync("artifacts/api-server/src/routes/admin-question-studio-async-bulk.ts","utf8");
 const page=readFileSync("artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx","utf8");
 const endpoint=route.slice(route.indexOf('router.post("/bulk-async/:operationId/children/:index/recover-expired"'));
 assert.match(route,/const safeClosedFailure=runStatus==="failed"/);
 assert.match(route,/!r\.started_at && Boolean\(r\.completed_at\)/);
 assert.match(route,/String\(r\.failure_reason\?\?""\)\.startsWith\("Operator-approved closure "\)/);
 assert.match(route,/canRecoverExpired:\(overdue \|\| safeClosedFailure\)/);
 assert.match(route,/Boolean\(r\.outbox_event_id\)/);
 assert.match(endpoint,/const previouslyClosed=run && String\(run\.status\)==="failed"/);
 assert.match(endpoint,/!run\.startedAt && Boolean\(run\.completedAt\)/);
 assert.match(endpoint,/AND failure_reason LIKE '%without Cloud Task%'/);
 assert.match(endpoint,/CASE WHEN status='failed' THEN failure_reason/);
 assert.match(endpoint,/completed_at=COALESCE\(completed_at,now\(\)\)/);
 assert.match(endpoint,/Number\(evidence\[0\]\?\.items\)!==0/);
 assert.match(endpoint,/generation_run_id=NULL/);
 assert.match(endpoint,/platform\.audit_events/);
 assert.match(page,/batch\.runId && batch\.canRecoverExpired && canRun/);
 assert.doesNotMatch(endpoint,/launchProductionChapterDispatch\(|recordQuestionStudioEnqueueIntent\(/);
});

test("expired failed empty batch offers server-guarded recovery even if projection omits eligibility",()=>{
 const ui=readFileSync("artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx","utf8");
 const endpoint=readFileSync("artifacts/api-server/src/routes/admin-question-studio-async-bulk.ts","utf8")
   .split('router.post("/bulk-async/:operationId/children/:index/recover-expired"')[1];
 assert.match(ui,/batch\.status==='failed' && batch\.generatedCount===0/);
 assert.match(ui,/batch\.deadlineExpired && !batch\.leaseActive/);
 assert.match(ui,/batch\.dispatchState==='acknowledged'/);
 assert.match(ui,/batch\.canRecoverExpired \|\|/);
 assert.match(endpoint,/o\.actor_firebase_uid/);
 assert.match(endpoint,/o\.requested_by/);
 assert.match(endpoint,/lease_expires_at/);
 assert.match(endpoint,/Number\(evidence\[0\]\?\.items\)!==0/);
 assert.match(endpoint,/generation_run_id=NULL/);
 assert.doesNotMatch(endpoint,/launchProductionChapterDispatch\(/);
});
