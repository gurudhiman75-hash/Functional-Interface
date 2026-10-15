// Production-only, one-event Cloud Tasks publisher. Not mounted by the API.
// This executable is never imported by staging. A build alone does not enable
// production async generation, create any queue, or configure any Cloud Run job.
import {runQuestionStudioTaskDispatchOnce} from "./async-cloud-tasks-dispatcher";
import {getQuestionStudioTaskConfig} from "./async-cloud-tasks-transport";
import {sqlClient} from "../lib/db";

export function assertProductionQuestionStudioDispatch(env: NodeJS.ProcessEnv = process.env):void {
  // All approvals are deliberately positive, separate, and default-off.
  if (env.EXAMTREE_API_RUNTIME !== "cloud-run" ||
      env.EXAMTREE_API_STAGING !== "false" ||
      env.EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED !== "true" ||
      env.EXAMTREE_QS_PRODUCTION_DATABASE_BINDING_VERIFIED !== "true" ||
      env.EXAMTREE_QS_PRODUCTION_RECEIVER_OIDC_VERIFIED !== "true" ||
      env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED !== "true" ||
      env.EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED !== "true" ||
      env.EXAMTREE_QUESTION_STUDIO_TASK_DISPATCH_ENABLED !== "true" ||
      env.EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED !== "true" ||
      env.EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED === "true" ||
      env.EXAMTREE_QS_STAGING_EXPIRED_RECOVERY_ENABLED === "true") {
    throw new Error("QS_PRODUCTION_DISPATCH_NOT_APPROVED");
  }
  const config=getQuestionStudioTaskConfig(env);
  if (config.projectId !== "sarbedutech" ||
      config.region !== "asia-south1" ||
      config.queueId !== "examtree-qs-prod" ||
      config.serviceAccount !== "examtree-qs-task-prod@sarbedutech.iam.gserviceaccount.com") {
    throw new Error("QS_PRODUCTION_DISPATCH_TARGET_INVALID");
  }
  // Production receiver must be its own Cloud Run service, never the
  // existing publicly accessible staging admin API or task receiver.
  const host=new URL(config.handlerUrl).hostname;
  if (!host.startsWith("examtree-qs-receiver-prod-") ||
      !host.endsWith(".run.app") ||
      config.audience !== new URL(config.handlerUrl).origin) {
    throw new Error("QS_PRODUCTION_RECEIVER_NOT_ISOLATED");
  }
}

async function main():Promise<void> {
  assertProductionQuestionStudioDispatch();
  const handled=await runQuestionStudioTaskDispatchOnce();
  console.info(handled?"QS_PROD_OUTBOX_EVENT_PROCESSED":"QS_PROD_OUTBOX_EMPTY");
}

main().catch(error=>{
  const code=error && typeof error==="object" && "code" in error
    ?String(error.code).slice(0,60):"QS_PRODUCTION_DISPATCH_FAILED";
  console.error("QS_PRODUCTION_DISPATCH_FAILED",{code});
  process.exitCode=1;
}).finally(async()=>{await sqlClient.end();});
