// One exact-run production chapter review event -> dedicated Cloud Tasks queue.
// Never imported by the ordinary production/staging publisher or the API.
// Defaults to deny; zero scheduler, queue, IAM, traffic or DB migrations here.
import {runQuestionStudioTaskDispatchOnce} from "./async-cloud-tasks-dispatcher";
import {getQuestionStudioTaskConfig} from "./async-cloud-tasks-transport";
import {productionChapterReleaseActive,readProductionChapterScope,readCanonicalChapterManifest}
  from "./prod-chapter-review-policy.mjs";
import {sqlClient} from "../lib/db";

const RUN_ID=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function assertIsolatedChapterDispatch(env:NodeJS.ProcessEnv=process.env):string {
  if(env.CLOUD_RUN_JOB!=="examtree-qs-chapter-dispatch-prod" ||
     env.CLOUD_RUN_TASK_COUNT!=="1" || env.CLOUD_RUN_TASK_INDEX!=="0" ||
     !productionChapterReleaseActive(env) ||
     env.EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_APPROVED!=="true" ||
     env.EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED==="true" ||
     env.EXAMTREE_QS_PRODUCTION_DATABASE_BINDING_VERIFIED!=="true" ||
     env.EXAMTREE_QS_PRODUCTION_RECEIVER_OIDC_VERIFIED!=="true" ||
     env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED!=="true" ||
     env.EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED!=="true" ||
     env.EXAMTREE_QUESTION_STUDIO_TASK_DISPATCH_ENABLED!=="true" ||
     env.EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED!=="true" ||
     env.EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED==="true") {
    throw new Error("QS_CHAPTER_DISPATCH_NOT_APPROVED");
  }
  const runId=env.EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_RUN_ID;
  if(!runId || !RUN_ID.test(runId)) throw new Error("QS_CHAPTER_DISPATCH_RUN_ID_INVALID");

  const c=getQuestionStudioTaskConfig(env);
  if(c.projectId!=="sarbedutech" || c.region!=="asia-south1" ||
     c.queueId!=="examtree-qs-chapter-prod" ||
     c.serviceAccount!=="examtree-qs-task-prod@sarbedutech.iam.gserviceaccount.com") {
    throw new Error("QS_CHAPTER_DISPATCH_TARGET_INVALID");
  }
  const endpoint=new URL(c.handlerUrl);
  if(!endpoint.hostname.startsWith("examtree-qs-receiver-prod-") ||
     !endpoint.hostname.endsWith(".run.app") ||
     c.audience!==endpoint.origin) {
    throw new Error("QS_CHAPTER_DISPATCH_RECEIVER_INVALID");
  }

  // Validate exact reviewed scope and a canonical manifest before importing
  // Neon or creating even one task.
  const scope=readProductionChapterScope(env);
  const manifest=readCanonicalChapterManifest();
  if(!scope.length || !manifest.packages.length) {
    throw new Error("QS_CHAPTER_DISPATCH_MANIFEST_INVALID");
  }
  return runId;
}

async function main():Promise<void> {
  const runId=assertIsolatedChapterDispatch();
  const handled=await runQuestionStudioTaskDispatchOnce({chapterReviewRunId:runId});
  console.info(handled?"QS_CHAPTER_OUTBOX_EVENT_HANDLED":"QS_CHAPTER_OUTBOX_EMPTY");
}

main().catch(error=>{
  const code=error && typeof error==="object" && "code" in error
    ?String(error.code).slice(0,60):"QS_CHAPTER_DISPATCH_FAILED";
  console.error("QS_CHAPTER_DISPATCH_FAILED",{code});
  process.exitCode=1;
}).finally(async()=>{await sqlClient.end();});
