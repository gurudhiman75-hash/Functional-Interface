// Explicit one-shot staging Cloud Tasks publisher entry point.
// Never imported by the API or ordinary background workers.
import {runQuestionStudioTaskDispatchOnce} from "./async-cloud-tasks-dispatcher";
import {sqlClient} from "../lib/db";
import { inspectQuestionStudioAsyncIncidents, recoverOneExpiredQuestionStudioStagingRun } from "./async-staging-watchdog";

async function main():Promise<void> {
  const env=process.env;
  if (env.EXAMTREE_API_RUNTIME!=="cloud-run" || env.EXAMTREE_API_STAGING!=="true" ||
      env.EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED!=="true" ||
      env.EXAMTREE_QUESTION_STUDIO_TASK_DISPATCH_ENABLED!=="true" ||
      env.EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED!=="true") {
    throw new Error("STAGING_CLOUD_TASKS_DISPATCH_NOT_APPROVED");
  }
  const queue=env.EXAMTREE_QUESTION_STUDIO_TASK_QUEUE;
  const project=env.EXAMTREE_QUESTION_STUDIO_TASK_PROJECT;
  const region=env.EXAMTREE_QUESTION_STUDIO_TASK_REGION;
  if(queue!=="examtree-qs-staging" || project!=="sarbedutech" || region!=="asia-south1") {
    throw new Error("STAGING_CLOUD_TASKS_DISPATCH_TARGET_INVALID");
  }
  // Optional fail-closed recovery precedes dispatch; a terminal run's
  // unpublished outbox event will be acknowledged without creating a task.
  const recovery=await recoverOneExpiredQuestionStudioStagingRun();
  if(recovery.kind==="marked_failed"){
    console.error("EXAMTREE_QS_STAGING_RECOVERY_COMPLETED",recovery.publicCode);
  }
  const handled=await runQuestionStudioTaskDispatchOnce();
  console.log(handled?"STAGING_OUTBOX_EVENT_PROCESSED":"STAGING_OUTBOX_EMPTY");
  try {
    await inspectQuestionStudioAsyncIncidents();
  } catch(error) {
    // Make health-check failure visible to Cloud Logging even if there was
    // no eligible dispatch event. Fail the job so Cloud Run alerts can fire.
    console.error("EXAMTREE_QS_STAGING_HEALTH_CHECK_FAILED",{
      code:error&&typeof error==="object"&&"code" in error
        ?String(error.code).slice(0,60):"WATCHDOG_QUERY_FAILED",
    });
    throw error;
  }
}
main().catch(error=>{
  console.error("STAGING_DISPATCH_FAILED",error instanceof Error?error.message:"unknown");
  process.exitCode=1;
}).finally(async()=>{
  await sqlClient.end();
});
