// STAGING ONLY: explicitly enqueue a validated Question Studio compute input.
// This route does not modify the existing POST /runs Generate behavior.
import {Router} from "express";
import {requireAdminPermission} from "../lib/admin-rbac";
import {recordQuestionStudioEnqueueIntent} from "../question-studio/async-enqueue-foundation";
import {validateUniversalStudioComputeInput,
  type UniversalStudioComputeInput} from "../question-studio/universal-executor";
import {EnqueueValidationError} from "../question-studio/async-enqueue-contract";

const router=Router();
const REQUIRED_TRUE=[
  "EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_STAGING_ENQUEUE_APPROVED",
] as const;
function isIsolatedStaging() {
  return process.env.EXAMTREE_API_RUNTIME==="cloud-run" &&
    process.env.EXAMTREE_API_STAGING==="true" &&
    REQUIRED_TRUE.every(key=>process.env[key]==="true");
}
function plain(value:unknown):value is Record<string,unknown> {
  return Boolean(value) && typeof value==="object" && !Array.isArray(value);
}

router.post("/runs/async-staging",requireAdminPermission("content.generation.run"),async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  if(!isIsolatedStaging()){
    res.status(503).json({code:"QUESTION_STUDIO_STAGING_ENQUEUE_DISABLED"});
    return;
  }
  if(!req.user?.id || !req.adminSession?.user.id){
    res.status(403).json({code:"QUESTION_STUDIO_STAGING_ADMIN_REQUIRED"});
    return;
  }
  const key=String(req.get("Idempotency-Key") ?? "");
  if(!/^[a-zA-Z0-9:_-]{8,128}$/.test(key)){
    res.status(400).json({code:"QUESTION_STUDIO_IDEMPOTENCY_KEY_REQUIRED"});
    return;
  }
  if(!plain(req.body) || !plain(req.body.request) ||
      !Array.isArray(req.body.selectedCpIds) ||
      JSON.stringify(req.body).length>16_384 ||
      Object.keys(req.body).some(key=>![
        "request","count","selectedCpIds","examProfileId",
        "difficultyPreset","difficultyDistribution",
        "forwardLegacyExamProfile","difficultyFilterSupported",
      ].includes(key))){
    res.status(400).json({code:"QUESTION_STUDIO_STAGING_PAYLOAD_INVALID"});
    return;
  }
  try{
    const compute=req.body as UniversalStudioComputeInput;
    validateUniversalStudioComputeInput(compute);
    const receipt=await recordQuestionStudioEnqueueIntent({
      identity:{
        actorFirebaseUid:req.user.id,
        identityUserId:req.adminSession.user.id,
        idempotencyKey:key,
      },
      compute,
    });
    res.status(receipt.reused?200:202).json({
      id:receipt.id,
      publicCode:receipt.publicCode,
      status:receipt.status,
      reused:receipt.reused,
      retryAfterSeconds:receipt.retryAfterSeconds,
    });
  }catch(error){
    if(error instanceof EnqueueValidationError){
      res.status(error.statusCode).json({code:error.code,error:error.message});
      return;
    }
    // Never echo an SQL error, request snapshot, ID token, or privileged input.
    console.error("Question Studio staged enqueue failed",
      {code:error&&typeof error==="object"&&"code" in error?String(error.code).slice(0,64):"ENQUEUE_FAILED"});
    res.status(503).json({code:"QUESTION_STUDIO_STAGING_ENQUEUE_UNAVAILABLE"});
  }
});
export default router;
