// Production chapter-level review enqueue, separately opt-in and admin/RBAC
// protected. Not the legacy COM-001 canary and never a publishing endpoint.
// Every request is rechecked against the canonical build-time manifest.
import {Router} from "express";
import {requireAdminPermission} from "../lib/admin-rbac";
import {recordQuestionStudioEnqueueIntent} from "../question-studio/async-enqueue-foundation";
import {validateAsyncTaskComputeInput} from "../question-studio/async-task-package-capabilities";
import type {UniversalStudioComputeInput} from "../question-studio/universal-executor";
import {EnqueueValidationError} from "../question-studio/async-enqueue-contract";
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
    const compute=req.body as UniversalStudioComputeInput;
    // Prevent a request from supplying its own run identifier or seed.
    if(compute.request.seed!==undefined ||
       !validateProductionChapterReview({...compute,queueVersion:1},
         readCanonicalChapterManifest(),readProductionChapterScope(env))){
      res.status(403).json({code:"QS_PROD_CHAPTER_SCOPE_DENIED"});return;
    }
    validateAsyncTaskComputeInput(compute);
    const receipt=await recordQuestionStudioEnqueueIntent({
      identity:{actorFirebaseUid:req.user.id,
        identityUserId:req.adminSession.user.id,idempotencyKey:key},
      compute,
    });
    res.status(receipt.reused?200:202).json({
      id:receipt.id,publicCode:receipt.publicCode,status:receipt.status,
      reused:receipt.reused,retryAfterSeconds:receipt.retryAfterSeconds
    });
  } catch(error){
    if(error instanceof EnqueueValidationError){
      res.status(error.statusCode).json({code:error.code});return;
    }
    // Never print DB errors, privileged snapshot or identity tokens.
    console.error("QS_PROD_CHAPTER_ENQUEUE_REJECTED");
    res.status(503).json({code:"QS_PROD_CHAPTER_ENQUEUE_UNAVAILABLE"});
  }
});
export default router;
