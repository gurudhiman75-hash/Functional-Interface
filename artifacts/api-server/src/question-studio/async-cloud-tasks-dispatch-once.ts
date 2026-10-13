// Explicit one-shot staging Cloud Tasks publisher entry point.
// Never imported by the API or ordinary background workers.
import {runQuestionStudioTaskDispatchOnce} from "./async-cloud-tasks-dispatcher";
import {sqlClient} from "../lib/db";

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
  const handled=await runQuestionStudioTaskDispatchOnce();
  console.log(handled?"STAGING_OUTBOX_EVENT_PROCESSED":"STAGING_OUTBOX_EMPTY");
}
main().catch(error=>{
  console.error("STAGING_DISPATCH_FAILED",error instanceof Error?error.message:"unknown");
  process.exitCode=1;
}).finally(async()=>{
  await sqlClient.end();
});
