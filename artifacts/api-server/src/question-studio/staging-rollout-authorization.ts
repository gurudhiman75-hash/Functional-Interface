// Staging-only, fail-closed authorization before the async Neon enqueue.
import {readFileSync} from "node:fs";
import path from "node:path";
import {validateReviewOnlyRollout} from "./review-only-rollout-policy.mjs";
const ALLOWED_CP=/^[A-Z][A-Z0-9-]{1,80}$/;
export function stagingRolloutAllowed(compute:unknown,env:NodeJS.ProcessEnv=process.env):boolean {
  if(env.EXAMTREE_API_RUNTIME!=="cloud-run" || env.EXAMTREE_API_STAGING!=="true" ||
     env.EXAMTREE_QS_STAGING_REVIEW_SCOPE_APPROVED!=="true") return false;
  const raw=env.EXAMTREE_QS_STAGING_REVIEW_SCOPE_JSON;
  if(typeof raw!=="string" || raw.length>8192) return false;
  try {
    const approved=JSON.parse(raw) as unknown;
    if(!Array.isArray(approved) || approved.length<1 || approved.length>20 ||
       approved.some(x=>!x || typeof x!=="object" || x.reviewOnly!==true ||
         typeof x.engineId!=="string" || typeof x.packageId!=="string" ||
         typeof x.cpId!=="string" || !ALLOWED_CP.test(x.cpId))) return false;
    const candidate=path.join(process.cwd(),"artifacts/api-server/dist/question-studio-capabilities.json");
    const fallback=path.join(process.cwd(),"dist/question-studio-capabilities.json");
    let manifest;
    try {manifest=JSON.parse(readFileSync(candidate,"utf8"));}
    catch {manifest=JSON.parse(readFileSync(fallback,"utf8"));}
    // No permissive fallback or default CP selection.
    return validateReviewOnlyRollout(compute,manifest,approved);
  } catch {return false;}
}
