// Pure, fail-closed admission for a SINGLE named chapter-review run.
// No Cloud SDK, DB, task creation or side effects.
import {
  productionChapterReleaseActive,
  readProductionChapterScope,
  isProductionChapterGenerationEligiblePackage,
} from "./prod-chapter-review-policy.mjs";

const UUID_V4=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const CHAPTER_DISPATCH_QUEUE="examtree-qs-chapter-prod";

export function assertIsolatedChapterDispatch(env,config,manifest,now=Date.now()){
  if(env?.CLOUD_RUN_JOB!=="examtree-qs-chapter-dispatch-prod" ||
     env.CLOUD_RUN_TASK_COUNT!=="1" || env.CLOUD_RUN_TASK_INDEX!=="0" ||
     !productionChapterReleaseActive(env,now) ||
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
  if(typeof runId!=="string" || !UUID_V4.test(runId))
    throw new Error("QS_CHAPTER_DISPATCH_RUN_ID_INVALID");

  if(!config || config.projectId!=="sarbedutech" ||
     config.region!=="asia-south1" ||
     config.queueId!==CHAPTER_DISPATCH_QUEUE ||
     config.serviceAccount!=="examtree-qs-task-prod@sarbedutech.iam.gserviceaccount.com") {
    throw new Error("QS_CHAPTER_DISPATCH_TARGET_INVALID");
  }
  let endpoint;
  try {endpoint=new URL(config.handlerUrl);}
  catch {throw new Error("QS_CHAPTER_DISPATCH_RECEIVER_INVALID");}
  if(endpoint.protocol!=="https:" ||
     !endpoint.hostname.startsWith("examtree-qs-receiver-prod-") ||
     !endpoint.hostname.endsWith(".run.app") ||
     endpoint.pathname!=="/internal/question-studio/async-task" ||
     endpoint.search || endpoint.hash || endpoint.username || endpoint.password ||
     config.audience!==endpoint.origin) {
    throw new Error("QS_CHAPTER_DISPATCH_RECEIVER_INVALID");
  }
  const scope=readProductionChapterScope(env,manifest);
  if(!manifest || manifest.source!=="canonical-question-studio-engine-registry" ||
     manifest.schemaVersion!==1 || !Array.isArray(manifest.packages) ||
     !scope.length) {
    throw new Error("QS_CHAPTER_DISPATCH_MANIFEST_INVALID");
  }
  // Each release-scope entry must resolve to an explicit reviewed package.
  // The run-row guard additionally validates the complete snapshot under lock.
  for(const requested of scope){
    const matches=manifest.packages.filter(p=>
      p.engineId===requested.engineId && p.packageId===requested.packageId &&
      isProductionChapterGenerationEligiblePackage(p));
    if(matches.length!==1)throw new Error("QS_CHAPTER_DISPATCH_SCOPE_INVALID");
  }
  return runId;
}
