// Shared read-only policy facade. Receiver validates under Neon run-row lock;
// private compute worker independently checks the same exact canonical scope.
// No production activation: absent explicit opt-in every call rejects.
import {
  productionChapterReleaseActive,readProductionChapterScope,
  readCanonicalChapterManifest,validateProductionChapterReview
} from "./prod-chapter-review-policy.mjs";

export function createProductionChapterSnapshotGuard(runId,env=process.env){
  if(typeof runId!=="string" || !productionChapterReleaseActive(env)) return null;
  try {
    const manifest=readCanonicalChapterManifest();
    const scope=readProductionChapterScope(env,manifest);
    return snapshot=>productionChapterReleaseActive(env) &&
      validateProductionChapterReview(snapshot,manifest,scope,{runId});
  } catch {return null;}
}

export function assertProductionChapterWorkerInput(input,env=process.env){
  const seed=input?.request?.seed;
  const runId=typeof seed==="string"&&seed.startsWith("qs-async:")
    ?seed.slice("qs-async:".length):null;
  if(!productionChapterReleaseActive(env) || !runId)
    throw Error("QS_PROD_CHAPTER_WORKER_DISABLED");
  let allowed=false;
  try {
    const manifest=readCanonicalChapterManifest();
    const scope=readProductionChapterScope(env,manifest);
    allowed=validateProductionChapterReview(
      {queueVersion:1,request:input.request,count:input.count,
       selectedCpIds:input.selectedCpIds},
      manifest,scope,{runId}
    );
  } catch {}
  if(!allowed)throw Error("QS_PROD_CHAPTER_WORKER_SCOPE_DENIED");
  return true;
}
