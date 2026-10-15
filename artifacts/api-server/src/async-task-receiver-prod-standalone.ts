// Production-only signed Cloud Tasks HTTP receiver. Never mounted in app.ts.
// This is buildable but requires distinct production-only Cloud Run, IAM,
// worker identity, Neon binding and explicit activation before use.
import express from "express";
import {createQuestionStudioTaskOidcVerifier,getQuestionStudioTaskOidcConfig,
  validateQuestionStudioTaskBody,QuestionStudioTaskAuthError}
  from "./question-studio/async-cloud-tasks-oidc";
import {computeInputFromQueuedSnapshot} from "./question-studio/async-task-receiver-snapshot";
import {validateAsyncTaskComputeInput} from "./question-studio/async-task-package-capabilities";
import {runUniversalStudioRemote} from "./question-studio/remote-universal-studio-client";

const requiredTrue=[
  "EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED",
  "EXAMTREE_QS_PRODUCTION_DATABASE_BINDING_VERIFIED",
  "EXAMTREE_QS_PRODUCTION_RECEIVER_OIDC_VERIFIED",
  "EXAMTREE_QS_PRODUCTION_WORKER_BINDING_VERIFIED",
  "EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED",
  "EXAMTREE_QUESTION_STUDIO_TASK_CLAIM_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_TASK_REVIEW_COMMIT_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_ROUTE_ENABLED",
] as const;

function assertProductionReceiverConfig():void {
  const env=process.env;
  if(env.EXAMTREE_API_RUNTIME!=="cloud-run" ||
     env.EXAMTREE_API_STAGING!=="false" ||
     env.K_SERVICE!=="examtree-qs-receiver-prod" ||
     env.EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED==="true" ||
     requiredTrue.some(k=>env[k]!=="true")) {
    throw new Error("QS_PRODUCTION_RECEIVER_NOT_APPROVED");
  }
  const config=getQuestionStudioTaskOidcConfig(env);
  const host=new URL(config.audience).hostname;
  if(config.serviceAccount!=="examtree-qs-task-prod@sarbedutech.iam.gserviceaccount.com" ||
     !host.startsWith("examtree-qs-receiver-prod-") || !host.endsWith(".run.app")) {
    throw new Error("QS_PRODUCTION_RECEIVER_OIDC_TARGET_INVALID");
  }
  const rawWorker=env.QUESTION_STUDIO_UNIVERSAL_WORKER_URL;
  let worker:URL;
  try {worker=new URL(rawWorker??"");}
  catch {throw new Error("QS_PRODUCTION_WORKER_NOT_ISOLATED");}
  if(worker.protocol!=="https:" ||
     !worker.hostname.startsWith("examtree-universal-prod-") ||
     !worker.hostname.endsWith(".run.app") ||
     worker.pathname!=="/" || worker.search || worker.hash ||
     worker.username || worker.password ||
     (env.QUESTION_STUDIO_WORKER_TOKEN?.trim().length??0)<32) {
    throw new Error("QS_PRODUCTION_WORKER_NOT_ISOLATED");
  }
}

const verifyOidc=createQuestionStudioTaskOidcVerifier();
const app=express();
app.disable("x-powered-by");
app.get("/health",(_req,res)=>res.status(200).json({status:"ok",service:"qs-receiver-prod",ready:false}));

app.post("/internal/question-studio/async-task",express.json({limit:"2kb"}),async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  try {
    assertProductionReceiverConfig();
  } catch {
    res.status(503).json({code:"QS_PRODUCTION_RECEIVER_DISABLED"});return;
  }
  try {
    const config=getQuestionStudioTaskOidcConfig();
    await verifyOidc(req.get("Authorization"),config);
    const {runId}=validateQuestionStudioTaskBody(req.body);
    // CRITICAL: Do not import the Neon SQL client during process startup.
    // Production receiver must bind PORT and answer health/disabled requests
    // without DATABASE_URL or production worker secrets. The two write-capable
    // modules are loaded only after every production flag, identity and signed
    // Google OIDC task token have been verified.
    const [{claimQuestionStudioAsyncTask},{commitQuestionStudioAsyncReview}]=await Promise.all([
      import("./question-studio/async-task-lease-claim"),
      import("./question-studio/async-review-commit"),
    ]);
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
  } catch(error){
    if(error instanceof QuestionStudioTaskAuthError){
      res.status(error.statusCode).json({code:error.code,error:"Task authorization failed"});return;
    }
    const code=error && typeof error==="object" && "code" in error
      ?String(error.code).slice(0,75):"ASYNC_TASK_EXECUTION_RETRY";
    console.error("QS_PROD_TASK_RETRY",{code});
    res.status(503).json({code:"ASYNC_TASK_EXECUTION_RETRY"});
  }
});
const port=Number(process.env.PORT||8080);
app.listen(port,"0.0.0.0",()=>console.info("QS_PROD_RECEIVER_LISTENING"));
