// Staging-only Google Cloud Tasks callback. Exposed by app.ts ONLY if six
// explicit staging/queue readiness switches are enabled. Rejects all browser
// Firebase tokens and spoofed Cloud Tasks headers. OIDC service-account JWT
// verification happens BEFORE the first Neon lookup or compute invocation.
import {Router} from "express";
import {
  createQuestionStudioTaskOidcVerifier,
  getQuestionStudioTaskOidcConfig,
  validateQuestionStudioTaskBody,
  QuestionStudioTaskAuthError,
} from "../question-studio/async-cloud-tasks-oidc";
import {claimQuestionStudioAsyncTask} from "../question-studio/async-task-lease-claim";
import {computeInputFromQueuedSnapshot} from "../question-studio/async-task-receiver-snapshot";
import {validateUniversalStudioComputeInput} from "../question-studio/universal-executor";
import {runUniversalStudioRemote} from "../question-studio/remote-universal-studio-client";
import {commitQuestionStudioAsyncReview} from "../question-studio/async-review-commit";

const router=Router();
const verifyOidc=createQuestionStudioTaskOidcVerifier();

router.post("/async-task",async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  try{
    const config=getQuestionStudioTaskOidcConfig();
    await verifyOidc(req.get("Authorization"),config);
    const {runId}=validateQuestionStudioTaskBody(req.body);

    // Fail closed before claim if the compute service cannot be reached.
    if(!process.env.QUESTION_STUDIO_UNIVERSAL_WORKER_URL?.trim() ||
       !process.env.QUESTION_STUDIO_WORKER_TOKEN?.trim() ||
       process.env.QUESTION_STUDIO_WORKER_TOKEN.trim().length<32){
      res.status(503).json({code:"ASYNC_COMPUTE_UNAVAILABLE"});return;
    }
    const claim=await claimQuestionStudioAsyncTask(runId);
    if(["terminal","not_found","exhausted"].includes(claim.kind)){
      // Cloud Tasks is at-least-once. Already reviewed/cancelled/failed or
      // abandoned tasks are acknowledged as no-ops; nothing is generated.
      res.status(204).end();return;
    }
    if(claim.kind==="busy"){
      // Another request still has the lease; Cloud Tasks must retry later.
      res.status(503).json({code:"ASYNC_TASK_LEASE_BUSY"});return;
    }
    if(claim.kind!=="claimed"){
      res.status(503).json({code:"ASYNC_TASK_RUN_NOT_CLAIMABLE"});return;
    }
    const compute=computeInputFromQueuedSnapshot(claim.requestSnapshot);
    validateUniversalStudioComputeInput(compute);
    const batch=await runUniversalStudioRemote(compute);
    const review=await commitQuestionStudioAsyncReview({
      runId:claim.runId,leaseToken:claim.leaseToken,batch,
    });
    if(review.status!=="review"&&review.status!=="already_committed"){
      res.status(503).json({code:"ASYNC_REVIEW_NOT_COMMITTED"});return;
    }
    res.status(204).end();
  }catch(error){
    // Never log the Authorization header, private prompt, generated content,
    // raw provider responses or Firebase ID tokens.
    if(error instanceof QuestionStudioTaskAuthError){
      res.status(error.statusCode).json({code:error.code,error:"Task authorization failed"});return;
    }
    const code=error&&typeof error==="object"&&"code" in error
      ?String(error.code).slice(0,75):"ASYNC_TASK_EXECUTION_RETRY";
    console.error("Question Studio internal task retry", {code});
    res.status(503).json({code:"ASYNC_TASK_EXECUTION_RETRY"});
  }
});

export default router;
