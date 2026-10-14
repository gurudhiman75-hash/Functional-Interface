// Isolated Cloud Run HTTP process for the signed Question Studio callback.
// Deliberately does not import app.ts, admin routes, engine-registry or the
// in-process generation engine. The Universal worker owns all computation.
import express from "express";
import {createQuestionStudioTaskOidcVerifier, getQuestionStudioTaskOidcConfig,
        validateQuestionStudioTaskBody, QuestionStudioTaskAuthError}
  from "./question-studio/async-cloud-tasks-oidc";
import {claimQuestionStudioAsyncTask} from "./question-studio/async-task-lease-claim";
import {computeInputFromQueuedSnapshot} from "./question-studio/async-task-receiver-snapshot";
import {validateAsyncTaskComputeInput} from "./question-studio/async-task-package-capabilities";
import {runUniversalStudioRemote} from "./question-studio/remote-universal-studio-client";
import {commitQuestionStudioAsyncReview} from "./question-studio/async-review-commit";

const gateFlags=[
  "EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED",
  "EXAMTREE_QUESTION_STUDIO_TASK_CLAIM_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_TASK_REVIEW_COMMIT_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_ROUTE_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED",
];
const verifyOidc=createQuestionStudioTaskOidcVerifier();
const app=express();
app.disable("x-powered-by");
app.get("/health",(_req,res)=>res.status(200).json({status:"ok",service:"qs-task-receiver"}));

app.post("/internal/question-studio/async-task",express.json({limit:"2kb"}),async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  if(process.env.EXAMTREE_API_RUNTIME!=="cloud-run" ||
     process.env.EXAMTREE_API_STAGING!=="true" ||
     gateFlags.some(flag=>process.env[flag]!=="true")){
    res.status(503).json({code:"QUESTION_STUDIO_ASYNC_RECEIVER_DISABLED"});return;
  }
  try {
    const config=getQuestionStudioTaskOidcConfig();
    await verifyOidc(req.get("Authorization"),config);
    const {runId}=validateQuestionStudioTaskBody(req.body);
    if(!process.env.QUESTION_STUDIO_UNIVERSAL_WORKER_URL?.trim() ||
       (process.env.QUESTION_STUDIO_WORKER_TOKEN?.trim().length??0)<32){
      res.status(503).json({code:"ASYNC_COMPUTE_UNAVAILABLE"});return;
    }
    // Claim first: unknown and terminal runs never touch the generator.
    const claim=await claimQuestionStudioAsyncTask(runId);
    if(["terminal","not_found","exhausted"].includes(claim.kind)){
      res.status(204).end();return;
    }
    if(claim.kind==="busy"){
      res.status(503).json({code:"ASYNC_TASK_LEASE_BUSY"});return;
    }
    if(claim.kind!=="claimed"){
      res.status(503).json({code:"ASYNC_TASK_RUN_NOT_CLAIMABLE"});return;
    }
    const compute=computeInputFromQueuedSnapshot(claim.requestSnapshot);
    validateAsyncTaskComputeInput(compute);
    const batch=await runUniversalStudioRemote(compute);
    const receipt=await commitQuestionStudioAsyncReview({
      runId:claim.runId,leaseToken:claim.leaseToken,batch,
    });
    if(receipt.status!=="review" && receipt.status!=="already_committed"){
      res.status(503).json({code:"ASYNC_REVIEW_NOT_COMMITTED"});return;
    }
    res.status(204).end();
  }catch(error){
    if(error instanceof QuestionStudioTaskAuthError){
      res.status(error.statusCode).json({code:error.code,error:"Task authorization failed"});return;
    }
    const code=error&&typeof error==="object"&&"code" in error
      ?String(error.code).slice(0,75):"ASYNC_TASK_EXECUTION_RETRY";
    console.error("Question Studio isolated task retry",{code});
    res.status(503).json({code:"ASYNC_TASK_EXECUTION_RETRY"});
  }
});
const port=Number(process.env.PORT||8080);
app.listen(port,"0.0.0.0",()=>console.log("QS isolated receiver listening",port));
