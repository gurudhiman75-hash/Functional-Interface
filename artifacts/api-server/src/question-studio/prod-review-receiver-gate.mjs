// Production receiver alternate review gate: fail closed, with no default rollout.
// Never read a scope from a request or database snapshot. Configuration is
// operator-provided on the isolated Cloud Run receiver and pinned to one run.
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {isProductionReviewScopeAuthorized} from "./prod-review-scope-preflight.mjs";

export function createProdReviewSnapshotGuard(runId,env=process.env,now=Date.now()) {
  if(env.EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_APPROVED!=="true") return null;
  let scope, manifest;
  try {
    const raw=env.EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_JSON;
    if(typeof raw!=="string" || raw.length>8192) return null;
    scope=JSON.parse(raw);
    if(!Array.isArray(scope) || scope.length!==1 ||
       scope[0]?.reviewOnly!==true) return null;
    const candidates=[
      join(process.cwd(),"artifacts/api-server/dist/question-studio-capabilities.json"),
      join(process.cwd(),"dist/question-studio-capabilities.json"),
    ];
    for(const file of candidates) {
      try {manifest=JSON.parse(readFileSync(file,"utf8"));break;}catch {}
    }
    if(!manifest) return null;
  } catch {return null;}
  return snapshot=>isProductionReviewScopeAuthorized(runId,snapshot,manifest,scope,env,now);
}
