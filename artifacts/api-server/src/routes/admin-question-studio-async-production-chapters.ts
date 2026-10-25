// Production chapter-level review enqueue, separately opt-in and admin/RBAC
// protected. Not the legacy COM-001 canary and never a publishing endpoint.
// Every request is rechecked against the canonical build-time manifest.
import {Router} from "express";
import {requireAdminPermission} from "../lib/admin-rbac";
import {recordQuestionStudioEnqueueIntent} from "../question-studio/async-enqueue-foundation";
import {validateAsyncTaskComputeInput} from "../question-studio/async-task-package-capabilities";
import type {UniversalStudioComputeInput} from "../question-studio/universal-executor";
import {EnqueueValidationError} from "../question-studio/async-enqueue-contract";
import {sqlClient} from "../lib/db";
import {createProductionChapterSnapshotGuard} from "../question-studio/prod-chapter-review-runtime.mjs";
import {
  assertChapterDispatchLaunchApproved, ChapterDispatchLaunchError,
  enqueueAndDispatchChapter, launchProductionChapterDispatch,
} from "../question-studio/prod-chapter-dispatch-launch";
import {
  productionChapterReleaseActive,readCanonicalChapterManifest,
  readProductionChapterScope,validateProductionChapterReview
} from "../question-studio/prod-chapter-review-policy.mjs";

const router=Router();
const TOP_FIELDS=new Set(["request","count","selectedCpIds","examProfileId",
  "difficultyPreset","difficultyDistribution","forwardLegacyExamProfile",
  "difficultyFilterSupported"]);
const REQ_FIELDS=new Set(["engineId","packageId","canonicalProblemId",
  "questionLanguageId","exam","examProfile","subject","topic","subtopic",
  "language","difficulty","count","runtimeMode","patternId"]);
function plain(x:unknown):x is Record<string,unknown>{
  return !!x && typeof x==="object" && !Array.isArray(x);
}
router.post("/runs/async-production-chapter",
  requireAdminPermission("content.generation.run"),async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  const env=process.env;
  if(!productionChapterReleaseActive(env) ||
     env.EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_ROUTE_APPROVED!=="true" ||
     env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED!=="true" ||
     env.EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED!=="true"){
    res.status(503).json({code:"QS_PROD_CHAPTER_ENQUEUE_DISABLED"});return;
  }
  if(!req.user?.id || !req.adminSession?.user?.id){
    res.status(403).json({code:"QS_PROD_CHAPTER_ADMIN_REQUIRED"});return;
  }
  const key=req.get("Idempotency-Key");
  if(typeof key!=="string" || !/^[a-zA-Z0-9:_-]{8,128}$/.test(key)){
    res.status(400).json({code:"QS_PROD_CHAPTER_IDEMPOTENCY_REQUIRED"});return;
  }
  if(!plain(req.body) || !plain(req.body.request) ||
     !Array.isArray(req.body.selectedCpIds) ||
     JSON.stringify(req.body).length>16384 ||
     Object.keys(req.body).some(k=>!TOP_FIELDS.has(k)) ||
     Object.keys(req.body.request).some(k=>!REQ_FIELDS.has(k))){
    res.status(400).json({code:"QS_PROD_CHAPTER_PAYLOAD_INVALID"});return;
  }
  try {
    assertChapterDispatchLaunchApproved(env);
    const compute=req.body as UniversalStudioComputeInput;
    // Prevent a request from supplying its own run identifier or seed.
    const manifest=readCanonicalChapterManifest();
    if(compute.request.seed!==undefined ||
       !validateProductionChapterReview({...compute,queueVersion:1},
         manifest,readProductionChapterScope(env,manifest))){
      res.status(403).json({code:"QS_PROD_CHAPTER_SCOPE_DENIED"});return;
    }
    validateAsyncTaskComputeInput(compute);
    const identity={actorFirebaseUid:req.user.id,
      identityUserId:req.adminSession.user.id,idempotencyKey:key};
    const receipt=await enqueueAndDispatchChapter(()=>recordQuestionStudioEnqueueIntent({
      identity,compute,
    }, "chapter_review"));
    res.status(receipt.reused?200:202).json({
      id:receipt.id,publicCode:receipt.publicCode,status:receipt.status,
      reused:receipt.reused,retryAfterSeconds:receipt.retryAfterSeconds,
      dispatchRequested:receipt.dispatchRequested,
    });
  } catch(error){
    if(error instanceof ChapterDispatchLaunchError){
      // Launch approval is checked before enqueue, so this path has no writes.
      res.status(503).json({code:error.code});return;
    }
    if(error instanceof EnqueueValidationError){
      res.status(error.statusCode).json({code:error.code});return;
    }
    // Never print DB errors, privileged snapshot or identity tokens.
    console.error("QS_PROD_CHAPTER_ENQUEUE_REJECTED");
    res.status(503).json({code:"QS_PROD_CHAPTER_ENQUEUE_UNAVAILABLE"});
  }
});

// Recovery after a lost response, interrupted API process or transient Run API
// failure. This never enqueues a new run or changes the persisted request.
router.post("/runs/:runId/dispatch-production-chapter",
  requireAdminPermission("content.generation.run"),async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  if(!req.user?.id || !req.adminSession?.user?.id){
    res.status(403).json({code:"QS_PROD_CHAPTER_ADMIN_REQUIRED"});return;
  }
  const runId=String(req.params.runId??"");
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(runId)){
    res.status(400).json({code:"QS_CHAPTER_DISPATCH_RUN_ID_INVALID"});return;
  }
  try {
    assertChapterDispatchLaunchApproved();
    const rows=await sqlClient`
      SELECT r.status::text AS status, r.request_snapshot AS snapshot
      FROM content.generation_runs r
      WHERE r.id=${runId}::uuid
        AND r.requested_by=${req.adminSession.user.id}::uuid
        AND r.request_snapshot->>'requestedByFirebaseUid'=${req.user.id}
        AND EXISTS (
          SELECT 1 FROM platform.outbox_events e
          WHERE e.aggregate_id=r.id AND e.aggregate_type='generation_run'
            AND e.event_type='question_studio.generation_run.chapter_review_queued.v1'
        )
      LIMIT 1
    `;
    const run=rows[0];
    if(!run){res.status(404).json({code:"QS_PROD_CHAPTER_RUN_NOT_FOUND"});return;}
    const guard=createProductionChapterSnapshotGuard(runId);
    if(!guard || !guard(run.snapshot)){
      res.status(403).json({code:"QS_PROD_CHAPTER_SCOPE_DENIED"});return;
    }
    if(run.status!=="queued"){
      res.status(200).json({id:runId,status:run.status,dispatchRequested:false});return;
    }
    await launchProductionChapterDispatch(runId);
    res.status(202).json({id:runId,status:run.status,dispatchRequested:true});
  } catch(error){
    res.status(503).json({code:error instanceof ChapterDispatchLaunchError
      ?error.code:"QS_PROD_CHAPTER_DISPATCH_UNAVAILABLE"});
  }
});
export default router;
