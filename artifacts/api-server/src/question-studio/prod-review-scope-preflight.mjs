// Prospective production authorization only. No runtime imports, no activation.
// Both pinning and expiry are mandatory even after operator approved a CP.
import {readFileSync} from "node:fs";
import {validateReviewOnlyRollout} from "./review-only-rollout-policy.mjs";
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function isProductionReviewScopeAuthorized(runId,snapshot,manifest,scope,env,now=Date.now()) {
  if(env?.EXAMTREE_API_RUNTIME!=="cloud-run" ||
     env?.EXAMTREE_API_STAGING!=="false" ||
     env?.EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_APPROVED!=="true" ||
     env?.EXAMTREE_QS_PRODUCTION_CANARY_ONLY!=="true" ||
     typeof runId!=="string" || !UUID.test(runId) ||
     env?.EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID!==runId) return false;
  const raw=env.EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT;
  if(typeof raw!=="string" || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(raw)) return false;
  const expires=Date.parse(raw);
  if(!Number.isFinite(now) || !Number.isFinite(expires) || expires<=now ||
     expires-now>15*60*1000) return false;
  // No user-supplied manifest/approval can grant access to a different run.
  return validateReviewOnlyRollout(snapshot,manifest,scope);
}
