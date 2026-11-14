// Explicitly gated admin bulk-review orchestration. Each child is one existing
// independently guarded chapter-review run, never an automatic publication.
// Reservation is not dispatch; every child requires an admin action.
import { Router } from "express";
import { createHash, randomUUID } from "node:crypto";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { reserveAsyncBulkReviewOperation } from "../question-studio/async-bulk-reservations";
import { recordQuestionStudioEnqueueIntent } from "../question-studio/async-enqueue-foundation";
import { digestCanonicalEnqueueRequest } from "../question-studio/async-enqueue-contract";
import { validateAsyncTaskComputeInput } from "../question-studio/async-task-package-capabilities";
import type { UniversalStudioComputeInput } from "../question-studio/universal-executor";
import { assertChapterDispatchLaunchApproved, launchProductionChapterDispatch } from "../question-studio/prod-chapter-dispatch-launch";
import { productionChapterReleaseActive, readCanonicalChapterManifest,
 readProductionChapterScope, validateProductionChapterReview } from "../question-studio/prod-chapter-review-policy.mjs";
import { planAsyncChapterReviewBatches } from "../question-studio/async-bulk-plan.mjs";
import { summarizeAsyncBulkReview } from "../question-studio/async-bulk-progress.mjs";

const router = Router();
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TOP = new Set(["request","count","selectedCpIds","examProfileId","difficultyPreset",
  "difficultyDistribution","forwardLegacyExamProfile","difficultyFilterSupported"]);
const REQUEST = new Set(["engineId","packageId","canonicalProblemId","questionLanguageId","exam",
  "examProfile","subject","topic","subtopic","language","difficulty","count","runtimeMode","patternId","optionCount"]);
const finished = new Set(["review","approved","partially_approved"]);
function object(value: unknown): value is Record<string,unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function gate() {
  return process.env.EXAMTREE_QS_BULK_ASYNC_REVIEW_ENABLED === "true" &&
    process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED === "true" &&
    process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED === "true" &&
    process.env.EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_ROUTE_APPROVED === "true" &&
    productionChapterReleaseActive();
}
function childCompute(parent: UniversalStudioComputeInput, count: number, cpIds: string[]): UniversalStudioComputeInput {
  return {...parent, count, selectedCpIds:cpIds, request:{...parent.request,count}};
}
function scopeCheck(compute: UniversalStudioComputeInput) {
  const manifest=readCanonicalChapterManifest();
  const scope=readProductionChapterScope(process.env,manifest);
  return validateProductionChapterReview({...compute,queueVersion:1},manifest,scope);
}
function validateBody(body: unknown): body is UniversalStudioComputeInput {
  if(!object(body) || !object(body.request) ||
     JSON.stringify(body).length>16384 ||
     Object.keys(body).some(k=>!TOP.has(k)) ||
     Object.keys(body.request).some(k=>!REQUEST.has(k)) ||
     !Array.isArray(body.selectedCpIds) ||
     !Number.isSafeInteger(body.count) || body.count<1 || body.count>250 ||
     body.request.count!==body.count || body.request.seed!==undefined) return false;
  return true;
}
async function parentForActor(id: string, uid: string, admin: string) {
  const rows=await sqlClient`
    SELECT id,requested_count,child_count,status,canonical_request
    FROM content.generation_bulk_operations
    WHERE id=${id}::uuid AND actor_firebase_uid=${uid} AND requested_by=${admin}::uuid
    LIMIT 1
  `;
  return rows[0] ?? null;
}
async function progress(id: string, uid: string, admin: string) {
  const parent=await parentForActor(id,uid,admin);
  if(!parent) return null;
  const rows=await sqlClient`
    SELECT c.batch_index,c.requested_count,c.status AS child_status,
           c.idempotency_key,
           c.selected_cp_ids,c.generation_run_id,
           r.status::text AS run_status,
           r.started_at AS started_at,
           r.completed_at AS completed_at,
           r.failure_reason AS failure_reason,
           r.due_at AS due_at,
           (r.due_at IS NOT NULL AND r.due_at <= now()) AS deadline_expired,
           (r.due_at IS NOT NULL AND r.due_at < now()-interval '10 minutes') AS recovery_grace_elapsed,
           (l.generation_run_id IS NOT NULL AND l.completed_at IS NULL
             AND l.lease_expires_at > now()) AS lease_active,
           e.id::text AS outbox_event_id,
           e.published_at AS dispatch_acknowledged_at,
           e.last_error AS dispatch_last_error,
           e.attempts AS dispatch_attempts,
           (SELECT count(*)::int FROM content.generation_run_items i
             WHERE i.generation_run_id=c.generation_run_id) AS generated_count
    FROM content.generation_bulk_children c
    LEFT JOIN content.generation_runs r ON r.id=c.generation_run_id
    LEFT JOIN content.generation_run_task_leases l ON l.generation_run_id=r.id
    LEFT JOIN LATERAL (
      SELECT id,published_at,last_error,attempts
      FROM platform.outbox_events
      WHERE aggregate_id=c.generation_run_id AND aggregate_type='generation_run'
        AND event_type='question_studio.generation_run.chapter_review_queued.v1'
      ORDER BY occurred_at LIMIT 1
    ) e ON true
    WHERE c.operation_id=${id}::uuid
    ORDER BY c.batch_index
  `;
  const children=rows.map(r=>{
    const runStatus=r.run_status?String(r.run_status):null;
    const generated=Number(r.generated_count ?? 0);
    const requested=Number(r.requested_count);
    // A terminal run with fewer saved items must be flagged for attention,
    // rather than blocking the entire parent progress endpoint.
    // A Cloud Task can disappear after exhausting retries, leaving a
    // "running" database row forever. Project a non-retryable attention state
    // once the deadline and any active lease have both expired. Do not mutate
    // the original run or imply that the remaining children were launched.
    const safeClosedFailure=runStatus==="failed" &&
      !r.started_at && Boolean(r.completed_at) &&
      String(r.failure_reason??"").startsWith("Operator-approved closure ") &&
      String(r.failure_reason??"").includes("without Cloud Task");
    const overdue=Boolean(r.deadline_expired) && !Boolean(r.lease_active) &&
      (runStatus==="queued" || runStatus==="running" || runStatus==="validation");
    const status=overdue ? "needs_reconciliation" :
      runStatus && finished.has(runStatus) && generated !== requested ? "failed" :
      runStatus && finished.has(runStatus) ? "review" :
      runStatus === "failed" || runStatus === "cancelled" ? "failed" :
      runStatus === "running" || runStatus === "validation" ? "running" :
      runStatus === "queued" ? "queued" : String(r.child_status);
    return {batchIndex:Number(r.batch_index),count:Number(r.requested_count),
      generatedCount:generated,status,
      runId:r.generation_run_id ? String(r.generation_run_id):null,
      selectedCpIds:r.selected_cp_ids,
      deadlineExpired:Boolean(r.deadline_expired),
      leaseActive:Boolean(r.lease_active),
      overdueNeedsAttention:overdue,
      canRecoverExpired:(overdue || safeClosedFailure) && generated===0 &&
        !Boolean(r.lease_active) && Boolean(r.outbox_event_id) &&
        String(r.idempotency_key??"").startsWith("chapterbulk:") &&
        Boolean(r.recovery_grace_elapsed),
      dueAt:r.due_at ?? null,
      // Acknowledgement does not prove that the Cloud Task still exists.
      dispatchState:!r.generation_run_id ? "not_requested" :
        !r.outbox_event_id ? "unknown" :
        r.dispatch_acknowledged_at ? "acknowledged" : "pending",
      dispatchAcknowledgedAt:r.dispatch_acknowledged_at ?? null,
      dispatchAttempts:Number(r.dispatch_attempts ?? 0),
      dispatchLastError:r.dispatch_last_error ? String(r.dispatch_last_error) : null,
      expectedTaskId:r.outbox_event_id
        ? "qs-" + String(r.outbox_event_id).replaceAll("-","").toLowerCase() : null};
  });
  const summary=summarizeAsyncBulkReview({requestedCount:Number(parent.requested_count)},children);
  return {id, status: summary.readyForReview ? "completed" :
    summary.requiresAttention ? "partial_failure" :
    summary.activeBatches>0 || summary.completedBatches>0 ? "in_progress" : "planned",
    ...summary,
    // The pure summarizer intentionally projects only core fields; retain the
    // read-only diagnostics in the owner-scoped API response.
    batches:children};
}
router.post("/bulk-async",requireAdminPermission("content.generation.run"),async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  if(!gate()){res.status(503).json({code:"QS_BULK_ASYNC_DISABLED"});return;}
  if(!req.user?.id || !req.adminSession?.user?.id){res.status(403).json({code:"QS_BULK_ADMIN_REQUIRED"});return;}
  const key=req.get("Idempotency-Key");
  if(typeof key!=="string" || !/^[a-zA-Z0-9:_-]{8,64}$/.test(key) ||
     !validateBody(req.body)){res.status(400).json({code:"QS_BULK_REQUEST_INVALID"});return;}
  try {
    const compute=req.body as UniversalStudioComputeInput;
    const planned=planAsyncChapterReviewBatches({totalCount:compute.count,
      selectedCpIds:compute.selectedCpIds,operationId:key});
    for(const part of planned) {
      const child=childCompute(compute,part.count,[...part.selectedCpIds]);
      if(!scopeCheck(child)){res.status(403).json({code:"QS_BULK_SCOPE_DENIED"});return;}
      validateAsyncTaskComputeInput(child);
    }
    const receipt=await reserveAsyncBulkReviewOperation({identity:{
      actorFirebaseUid:req.user.id,identityUserId:req.adminSession.user.id,idempotencyKey:key,
    },compute});
    res.status(receipt.reused?200:202).json({id:receipt.id,reused:receipt.reused,
      status:receipt.status,requestedCount:receipt.requestedCount,childCount:receipt.children.length});
  } catch(error) {
    const e=error as {code?:string;statusCode?:number};
    res.status(e.statusCode && e.statusCode>=400 && e.statusCode<500?e.statusCode:503)
      .json({code:e.code??"QS_BULK_RESERVATION_UNAVAILABLE"});
  }
});
router.get("/bulk-async/:operationId",requireAdminPermission("content.generation.read"),async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  if(process.env.EXAMTREE_QS_BULK_ASYNC_REVIEW_ENABLED!=="true"){
    res.status(503).json({code:"QS_BULK_ASYNC_DISABLED"});return;
  }
  const id=String(req.params.operationId??"");
  if(!UUID.test(id)){res.status(400).json({code:"QS_BULK_ID_INVALID"});return;}
  if(!req.user?.id || !req.adminSession?.user?.id){res.status(403).json({code:"QS_BULK_ADMIN_REQUIRED"});return;}
  try{
    const result=await progress(id,req.user.id,req.adminSession.user.id);
    if(!result){res.status(404).json({code:"QS_BULK_NOT_FOUND"});return;}
    res.json(result);
  }catch{res.status(503).json({code:"QS_BULK_PROGRESS_UNAVAILABLE"});}
});
router.post("/bulk-async/:operationId/children/:index/launch",
  requireAdminPermission("content.generation.run"),async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  if(!gate()){res.status(503).json({code:"QS_BULK_ASYNC_DISABLED"});return;}
  if(!req.user?.id || !req.adminSession?.user?.id){res.status(403).json({code:"QS_BULK_ADMIN_REQUIRED"});return;}
  const id=String(req.params.operationId??"");
  const index=Number(req.params.index);
  if(!UUID.test(id) || !Number.isSafeInteger(index) || index<0 || index>12){
    res.status(400).json({code:"QS_BULK_CHILD_INVALID"});return;
  }
  try {
    assertChapterDispatchLaunchApproved();
    const parent=await parentForActor(id,req.user.id,req.adminSession.user.id);
    if(!parent){res.status(404).json({code:"QS_BULK_NOT_FOUND"});return;}
    const candidates=await sqlClient`
      SELECT c.batch_index,c.requested_count,c.selected_cp_ids,c.status,
             c.generation_run_id,r.status::text AS run_status,
             (SELECT count(*)::int FROM content.generation_run_items i
               WHERE i.generation_run_id=c.generation_run_id) AS generated_count
      FROM content.generation_bulk_children c
      LEFT JOIN content.generation_runs r ON r.id=c.generation_run_id
      WHERE c.operation_id=${id}::uuid ORDER BY c.batch_index
    `;
    const terminalComplete=(row: Record<string,unknown>) =>
      finished.has(String(row.run_status)) &&
      Number(row.generated_count)===Number(row.requested_count);
    const target=candidates.find(r=>Number(r.batch_index)===index);
    if(!target || target.status!=="planned" || target.generation_run_id ||
       candidates.some(r=>Number(r.batch_index)<index && !terminalComplete(r)) ||
       candidates.some(r=>Number(r.batch_index)>index && r.status!=="planned")){
      res.status(409).json({code:"QS_BULK_CHILD_NOT_READY"});return;
    }
    const compute=childCompute(parent.canonical_request as UniversalStudioComputeInput,
      Number(target.requested_count),target.selected_cp_ids as string[]);
    if(!scopeCheck(compute)){res.status(403).json({code:"QS_BULK_SCOPE_DENIED"});return;}
    validateAsyncTaskComputeInput(compute);
    // Atomic claim. A concurrent request cannot enqueue the same child.
    // Claim is deliberately not reset after an uncertain network outcome.
    const claim=await sqlClient.begin(async tx=>{
      // Serialize admission across bulk parents; refuse an additional launch
      // while any chapter-review run or uncertain bulk reservation is active.
      await tx`SELECT pg_advisory_xact_lock(6218, 20261105)`;
      const busy=await tx`
        SELECT 1 FROM content.generation_bulk_children c
        LEFT JOIN content.generation_runs r ON r.id=c.generation_run_id
        WHERE (c.generation_run_id IS NULL AND
                 c.status IN ('reserved','needs_reconciliation'))
           OR (c.generation_run_id IS NOT NULL AND
                 (r.id IS NULL OR r.status IN ('queued','running','validation')))
        LIMIT 1
      `;
      if(busy.length>0) return false;
      const activeChapter=await tx`
        SELECT 1 FROM content.generation_runs r
        WHERE r.status IN ('queued','running','validation')
          AND EXISTS (
            SELECT 1 FROM platform.outbox_events o
            WHERE o.aggregate_id=r.id AND o.aggregate_type='generation_run'
              AND o.event_type='question_studio.generation_run.chapter_review_queued.v1'
          )
        LIMIT 1
      `;
      if(activeChapter.length>0) return false;
      const locked=await tx`
        SELECT id FROM content.generation_bulk_operations
        WHERE id=${id}::uuid AND actor_firebase_uid=${req.user!.id}
          AND requested_by=${req.adminSession!.user.id}::uuid
        FOR UPDATE
      `;
      if(locked.length!==1) return false;
      const siblings=await tx`
        SELECT c.batch_index,c.status,c.requested_count,c.generation_run_id,
               r.status::text AS run_status,
               (SELECT count(*)::int FROM content.generation_run_items i
               WHERE i.generation_run_id=c.generation_run_id) AS generated_count
        FROM content.generation_bulk_children c
        LEFT JOIN content.generation_runs r ON r.id=c.generation_run_id
        WHERE c.operation_id=${id}::uuid ORDER BY c.batch_index
      `;
      if(siblings.some(r=>(Number(r.batch_index)<index && !terminalComplete(r)) ||
                        (Number(r.batch_index)>index && r.status!=="planned") ||
                        (Number(r.batch_index)===index && (r.status!=="planned" || r.generation_run_id)))) return false;
      const updated=await tx`
        UPDATE content.generation_bulk_children SET status='reserved',updated_at=now()
        WHERE operation_id=${id}::uuid AND batch_index=${index} AND status='planned'
        RETURNING batch_index
      `;
      return updated.length===1;
    });
    if(!claim){res.status(409).json({code:"QS_BULK_CHILD_ALREADY_CLAIMED"});return;}
    let receipt;
    try{
      const keyRow=await sqlClient`
        SELECT idempotency_key FROM content.generation_bulk_children
        WHERE operation_id=${id}::uuid AND batch_index=${index}
      `;
      if(typeof keyRow[0]?.idempotency_key !== "string") throw new Error("BULK_CHILD_KEY_MISSING");
      receipt=await recordQuestionStudioEnqueueIntent({identity:{
        actorFirebaseUid:req.user.id,identityUserId:req.adminSession.user.id,
        idempotencyKey:String(keyRow[0].idempotency_key),
      },compute},"chapter_review");
    }catch{
      await sqlClient`UPDATE content.generation_bulk_children
        SET status='needs_reconciliation',updated_at=now()
        WHERE operation_id=${id}::uuid AND batch_index=${index} AND status='reserved'`;
      res.status(503).json({code:"QS_BULK_CHILD_RECONCILIATION_REQUIRED"});return;
    }
    await sqlClient`
      UPDATE content.generation_bulk_children
      SET generation_run_id=${receipt.id}::uuid,status='queued',updated_at=now()
      WHERE operation_id=${id}::uuid AND batch_index=${index} AND status='reserved'
    `;
    // Dispatch is independently approved and may return uncertain; do not retry here.
    let dispatchRequested=false;
    if(receipt.status==="queued"){
      try{await launchProductionChapterDispatch(receipt.id);dispatchRequested=true;}
      catch{ /* persisted run is recoverable using existing exact-run endpoint */ }
    }
    res.status(202).json({runId:receipt.id,status:receipt.status,dispatchRequested,
      needsDispatchAttention:!dispatchRequested});
  }catch{
    res.status(503).json({code:"QS_BULK_CHILD_LAUNCH_UNAVAILABLE"});
  }
});

/** Read-only reconciliation against the original durable enqueue reservation.
 * Never create a new generation run, Cloud Task, or dispatcher execution. */
router.post("/bulk-async/:operationId/children/:index/reconcile",
  requireAdminPermission("content.generation.run"),async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  if(process.env.EXAMTREE_QS_BULK_ASYNC_REVIEW_ENABLED!=="true"){
    res.status(503).json({code:"QS_BULK_ASYNC_DISABLED"});return;
  }
  if(!req.user?.id || !req.adminSession?.user?.id){
    res.status(403).json({code:"QS_BULK_ADMIN_REQUIRED"});return;
  }
  const id=String(req.params.operationId??"");
  const index=Number(req.params.index);
  if(!UUID.test(id)|| !Number.isSafeInteger(index)||index<0||index>12){
    res.status(400).json({code:"QS_BULK_CHILD_INVALID"});return;
  }
  try {
    const parent=await parentForActor(id,req.user.id,req.adminSession.user.id);
    if(!parent){res.status(404).json({code:"QS_BULK_NOT_FOUND"});return;}
    const children=await sqlClient`
      SELECT batch_index,requested_count,selected_cp_ids,idempotency_key,
             generation_run_id,status
      FROM content.generation_bulk_children
      WHERE operation_id=${id}::uuid AND batch_index=${index} LIMIT 1
    `;
    const child=children[0];
    if(!child){res.status(404).json({code:"QS_BULK_CHILD_NOT_FOUND"});return;}
    if(child.generation_run_id){
      res.json({runId:String(child.generation_run_id),reconciled:true,alreadyLinked:true});return;
    }
    if(!["reserved","needs_reconciliation"].includes(String(child.status))){
      res.status(409).json({code:"QS_BULK_CHILD_NOT_RESERVED"});return;
    }
    const compute=childCompute(parent.canonical_request as UniversalStudioComputeInput,
      Number(child.requested_count),child.selected_cp_ids as string[]);
    const requestHash=digestCanonicalEnqueueRequest(compute);
    const reservationKey="chapter:"+createHash("sha256")
      .update(String(child.idempotency_key)).digest("hex");
    const matches=await sqlClient`
      SELECT r.id,r.request_snapshot
      FROM content.generation_enqueue_idempotency e
      JOIN content.generation_runs r ON r.id=e.generation_run_id
      WHERE e.actor_firebase_uid=${req.user.id}
        AND e.idempotency_key=${reservationKey}
        AND e.request_sha256=${requestHash}
        AND r.requested_by=${req.adminSession.user.id}::uuid
        AND r.request_snapshot->>'requestedByFirebaseUid'=${req.user.id}
        AND EXISTS (
          SELECT 1 FROM platform.outbox_events o
          WHERE o.aggregate_id=r.id AND o.aggregate_type='generation_run'
            AND o.event_type='question_studio.generation_run.chapter_review_queued.v1'
        )
      LIMIT 1
    `;
    if(matches.length!==1){
      res.status(409).json({code:"QS_BULK_CHILD_NEEDS_OPERATOR_REVIEW"});return;
    }
    const runId=String(matches[0].id);
    const linked=await sqlClient`
      UPDATE content.generation_bulk_children
      SET generation_run_id=${runId}::uuid,status='queued',updated_at=now()
      WHERE operation_id=${id}::uuid AND batch_index=${index}
        AND generation_run_id IS NULL AND status IN ('reserved','needs_reconciliation')
      RETURNING generation_run_id
    `;
    if(linked.length!==1){
      res.status(409).json({code:"QS_BULK_CHILD_LINK_CONFLICT"});return;
    }
    res.json({runId,reconciled:true,alreadyLinked:false,
      message:"Existing generation run recovered; no dispatch requested."});
  }catch{
    res.status(503).json({code:"QS_BULK_CHILD_RECONCILIATION_UNAVAILABLE"});
  }
});

/** Deliberate operator-only repair of an expired, empty, unleased child.
 * This never creates a generation run or task. The original failed run and
 * its outbox remain queryable and the transition is audit logged. */
router.post("/bulk-async/:operationId/children/:index/recover-expired",
  requireAdminPermission("content.generation.run"),async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  if(!gate()){res.status(503).json({code:"QS_BULK_ASYNC_DISABLED"});return;}
  if(!req.user?.id || !req.adminSession?.user?.id){
    res.status(403).json({code:"QS_BULK_ADMIN_REQUIRED"});return;
  }
  const id=String(req.params.operationId??"");
  const index=Number(req.params.index);
  if(!UUID.test(id)||!Number.isSafeInteger(index)||index<0||index>12){
    res.status(400).json({code:"QS_BULK_CHILD_INVALID"});return;
  }
  try {
    const recovered=await sqlClient.begin(async tx=>{
      await tx`SELECT pg_advisory_xact_lock(6218, 20261105)`;
      // Lock the same run row first as the worker claim and atomic commit.
      const rows=await tx`
        SELECT r.id::text AS "runId", r.status::text AS status,
               r.due_at, r.started_at AS "startedAt",
               r.completed_at AS "completedAt",
               r.failure_reason AS "failureReason",
               c.idempotency_key AS "idempotencyKey",
               c.status AS "childStatus"
        FROM content.generation_bulk_children c
        JOIN content.generation_bulk_operations o ON o.id=c.operation_id
        JOIN content.generation_runs r ON r.id=c.generation_run_id
        WHERE o.id=${id}::uuid AND c.batch_index=${index}
          AND o.actor_firebase_uid=${req.user!.id}
          AND o.requested_by=${req.adminSession!.user.id}::uuid
        FOR UPDATE OF r
      `;
      const run=rows[0];
      const previouslyClosed=run && String(run.status)==="failed" &&
        !run.startedAt && Boolean(run.completedAt) &&
        String(run.failureReason??"").startsWith("Operator-approved closure ") &&
        String(run.failureReason??"").includes("without Cloud Task");
      if(!run || (!["queued","running"].includes(String(run.status)) && !previouslyClosed) ||
         typeof run.idempotencyKey!=="string" ||
         !run.idempotencyKey.startsWith("chapterbulk:"))
        return {recovered:false,code:"QS_BULK_RECOVERY_RUN_NOT_ELIGIBLE"};
      if(!run.due_at || new Date(run.due_at).getTime()>Date.now()-600_000)
        return {recovered:false,code:"QS_BULK_RECOVERY_DEADLINE_NOT_EXPIRED"};
      const leases=await tx`
        SELECT lease_expires_at,completed_at
        FROM content.generation_run_task_leases
        WHERE generation_run_id=${run.runId}::uuid FOR UPDATE
      `;
      if(leases.some(l=>l.completed_at===null &&
         new Date(l.lease_expires_at).getTime()>Date.now()))
        return {recovered:false,code:"QS_BULK_RECOVERY_ACTIVE_LEASE"};
      const evidence=await tx`
        SELECT (SELECT COUNT(*)::int FROM content.generation_run_items i
                WHERE i.generation_run_id=${run.runId}::uuid) AS items,
               EXISTS(SELECT 1 FROM platform.outbox_events e
                WHERE e.aggregate_id=${run.runId}::uuid
                  AND e.aggregate_type='generation_run'
                  AND e.event_type='question_studio.generation_run.chapter_review_queued.v1') AS outbox
      `;
      if(Number(evidence[0]?.items)!==0)
        return {recovered:false,code:"QS_BULK_RECOVERY_ITEMS_EXIST"};
      if(evidence[0]?.outbox!==true)
        return {recovered:false,code:"QS_BULK_RECOVERY_OUTBOX_MISSING"};
      const newKey="chapterretry:"+createHash("sha256")
        .update(String(run.idempotencyKey)+":recovery:1").digest("hex");
      // Already failed and operator-closed runs are immutable history. Do not
      // rewrite them just to detach their empty bulk child.
      if(!previouslyClosed){
        const failed=await tx`
          UPDATE content.generation_runs
          SET status='failed'::generation_run_status,
              failure_reason='Chapter review task expired with no saved questions; operator recovered its bulk child',
              completed_at=COALESCE(completed_at,now()),updated_at=now()
          WHERE id=${run.runId}::uuid AND status IN ('queued','running')
          RETURNING id
        `;
        if(failed.length!==1)
          return {recovered:false,code:"QS_BULK_RECOVERY_RUN_CHANGED"};
      }
      const reset=await tx`
        UPDATE content.generation_bulk_children
        SET status='planned',generation_run_id=NULL,idempotency_key=${newKey},updated_at=now()
        WHERE operation_id=${id}::uuid AND batch_index=${index}
          AND generation_run_id=${run.runId}::uuid
        RETURNING operation_id
      `;
      if(reset.length!==1)throw new Error("QS_BULK_RECOVERY_RACE");
      await tx`
        INSERT INTO platform.audit_events (
          id,actor_type,actor_user_id,action_key,entity_type,entity_id,
          reason,summary,metadata
        ) VALUES (
          ${randomUUID()}::uuid,'user'::audit_actor_type,
          ${req.adminSession!.user.id}::uuid,
          'question_studio.generation_run.expired_bulk_recovery',
          'generation_run',${run.runId}::uuid,
          'Explicit administrator recovery after run deadline and retry grace; no active lease or saved item',
          'Reset empty expired bulk child to planned; no generation dispatched',
          (${JSON.stringify({operationId:id,batchIndex:index,oldRunId:run.runId,reasonCode:previouslyClosed?"OPERATOR_CLOSED_EMPTY":"EXPIRED_EMPTY"})}::text)::jsonb
        )
      `;
      return {recovered:true,oldRunId:String(run.runId),batchIndex:index};
    });
    if(!recovered?.recovered){
      res.status(409).json({code:recovered && "code" in recovered ? recovered.code : "QS_BULK_EXPIRED_RECOVERY_NOT_SAFE"});return;
    }
    res.status(200).json(recovered);
  }catch(error){
    // Keep error details in server logs, not the admin response.
    console.error("QS_BULK_EXPIRED_RECOVERY_UNAVAILABLE",{
      operationId:id,batchIndex:index,
      errorCode:(error as {code?:string})?.code??"UNKNOWN",
      message:error instanceof Error?error.message:"Unknown recovery transaction error",
    });
    res.status(503).json({code:"QS_BULK_EXPIRED_RECOVERY_UNAVAILABLE"});
  }
});

export default router;
