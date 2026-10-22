// Secondary worker-side check, independent from receiver. Off by default.
// Does not alter the original COM-001 canary behavior.
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {isProductionReviewScopeAuthorized} from "./src/question-studio/prod-review-scope-preflight.mjs";

export function assertProductionWorkerReviewInput(input,env=process.env,now=Date.now()){
  const runId=env.EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID;
  if(env.EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_APPROVED!=="true" ||
     typeof runId!=="string" ||
     input?.request?.seed!=="qs-async:"+runId ||
     input?.count!==1 || input?.request?.count!==1 ||
     !Array.isArray(input?.selectedCpIds) ||
     input.selectedCpIds.length!==1 ||
     input.request.canonicalProblemId!==input.selectedCpIds[0])
    throw new Error("QS_PROD_WORKER_REVIEW_SCOPE_DENIED");
  let approved,manifest;
  try{
    const raw=env.EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_JSON;
    if(typeof raw!=="string" || raw.length>8192) throw new Error("scope");
    approved=JSON.parse(raw);
    if(!Array.isArray(approved) || approved.length!==1) throw new Error("scope");
    for(const file of [
      join(process.cwd(),"artifacts/api-server/dist/question-studio-capabilities.json"),
      join(process.cwd(),"dist/question-studio-capabilities.json"),
    ]) {
      try{manifest=JSON.parse(readFileSync(file,"utf8"));break;}catch{}
    }
  }catch{}
  if(!isProductionReviewScopeAuthorized(runId,{
      request:input.request,count:input.count,
      selectedCpIds:input.selectedCpIds,queueVersion:1,
    },manifest,approved,env,now))
    throw new Error("QS_PROD_WORKER_REVIEW_SCOPE_DENIED");
  return true;
}
