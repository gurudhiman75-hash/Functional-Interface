// Second independent production compute gate. No database, HTTP, or publishing.
// The receiver verifies the canonical manifest under the DB claim lock.
import {assertProductionWorkerCanaryEnvironment} from "./production-canary-worker-scope.mjs";
const ENGINES=new Set(["quant-v4","reasoning-v1","language-v1","knowledge-v1"]);
export function assertProductionWorkerReviewInput(input,env=process.env,now=Date.now()){
  const runId=assertProductionWorkerCanaryEnvironment(env,now);
  const request=input?.request;
  let scope;
  try {
    const raw=env.EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_JSON;
    if(env.EXAMTREE_API_RUNTIME!=="cloud-run" ||
       env.EXAMTREE_API_STAGING!=="false" ||
       env.EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_APPROVED!=="true" ||
       typeof raw!=="string" || raw.length>8192) throw Error("denied");
    scope=JSON.parse(raw);
  } catch {throw Error("QS_PROD_WORKER_REVIEW_SCOPE_DENIED");}
  const approved=scope?.[0];
  if(!Array.isArray(scope) || scope.length!==1 ||
     !approved || approved.reviewOnly!==true ||
     !ENGINES.has(request?.engineId) ||
     request?.engineId!==approved.engineId ||
     request?.packageId!==approved.packageId ||
     request?.canonicalProblemId!==approved.cpId ||
     request?.seed!=="qs-async:"+runId ||
     request?.language!=="en" || input?.count!==1 || request?.count!==1 ||
     !Array.isArray(input?.selectedCpIds) ||
     input.selectedCpIds.length!==1 ||
     input.selectedCpIds[0]!==approved.cpId)
    throw Error("QS_PROD_WORKER_REVIEW_SCOPE_DENIED");
  return true;
}
