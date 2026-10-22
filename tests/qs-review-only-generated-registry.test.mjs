import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateReviewOnlyRollout} from "../artifacts/api-server/src/question-studio/review-only-rollout-policy.mjs";
const path="artifacts/api-server/dist/question-studio-capabilities.json";
const manifest=JSON.parse(readFileSync(path,"utf8"));
const cases=[
 ["quant-v4","TRG-002","TRG-CP-007"],
 ["reasoning-v1","OPS-001","OPS-CP-001"],
 ["language-v1","ENG-001","ENG-001-CP013"],
 ["knowledge-v1","COM-001","COM-001-CP-001"],
];
for(const [engineId,packageId,cpId] of cases){
 const snapshot={queueVersion:1,count:1,selectedCpIds:[cpId],
   request:{engineId,packageId,canonicalProblemId:cpId,count:1,language:"en",seed:"manifest-verify-seed"}};
 const scope=[{engineId,packageId,cpId,reviewOnly:true}];
 const p=manifest.packages.filter(x=>x.packageId===packageId && x.engineId===engineId);
 assert.equal(p.length,1,"missing or ambiguous package: "+packageId);
 assert.equal(p[0].enabled,true,"disabled package: "+packageId);
 assert.ok(p[0].cpIds.includes(cpId),"CP not present in canonical manifest: "+cpId);
 const accepted=validateReviewOnlyRollout(snapshot,manifest,scope);
 console.log(packageId,cpId,accepted?"REVIEW_ONLY_ELIGIBLE":"BLOCKED_BY_CANONICAL_SAFETY_FIELDS");
 // Not every registered package qualifies for review-only rollout.
 // Fail closed and record the result, rather than silently overriding metadata.
 assert.equal(validateReviewOnlyRollout(snapshot,manifest,[]),false);
}
console.log("PASS: all four source-backed package/CP IDs exist, canonical safety policy evaluated");
