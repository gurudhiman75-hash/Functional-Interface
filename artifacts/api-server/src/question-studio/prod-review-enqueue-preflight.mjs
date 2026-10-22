// Future production enqueue authorization. Inert unless explicitly invoked.
// Rejects replay of the completed historical COM-001 canary and never creates a task.
import {isProductionReviewScopeAuthorized} from "./prod-review-scope-preflight.mjs";
const PREVIOUS_SUCCESS="c71b5ccb-8aa6-44e0-b0a5-01a3607a9c98";
const PREVIOUS_CANCELLED="48aaff58-d0cb-4345-be5f-491089b72f10";
export function authorizeProductionReviewEnqueue(runId,snapshot,manifest,scope,env,now=Date.now()){
  if(runId===PREVIOUS_SUCCESS || runId===PREVIOUS_CANCELLED ||
    env?.CLOUD_RUN_JOB!=="examtree-qs-prod-one-run-enqueue" ||
    env?.CLOUD_RUN_TASK_COUNT!=="1" || env?.CLOUD_RUN_TASK_INDEX!=="0" ||
    env?.CLOUD_RUN_TASK_ATTEMPT!=="0" ||
    env?.GOOGLE_CLOUD_PROJECT!=="sarbedutech" ||
    env?.EXAMTREE_QS_PRODUCTION_CANARY_ENQUEUE_APPROVED!=="true" ||
    env?.EXAMTREE_QS_PRODUCTION_DATABASE_BINDING_VERIFIED!=="true" ||
    env?.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED!=="true" ||
    env?.EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED!=="true" ||
    !Array.isArray(scope) || scope.length!==1 ||
    snapshot?.request?.seed!=="qs-async:"+runId) return false;
  return isProductionReviewScopeAuthorized(runId,snapshot,manifest,scope,env,now);
}
