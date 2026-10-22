import test from "node:test";
import assert from "node:assert/strict";
import {validateReviewOnlyRollout} from "../artifacts/api-server/src/question-studio/review-only-rollout-policy.mjs";
const cases=[
 ["quant-v4","TRG-002","TRG-002-CP-001"],
 ["reasoning-v1","OPS-001","OPS-001-CP-001"],
 ["language-v1","ENG-001","ENG-001-CP-001"],
 ["knowledge-v1","COM-001","COM-001-CP-001"],
];
function snap(engineId,packageId,cp) {
 return {queueVersion:1,count:1,selectedCpIds:[cp],
   request:{engineId,packageId,canonicalProblemId:cp,count:1,language:"en",seed:"rollout-policy-test-1"}};
}
for (const [engine,pkg,cp] of cases) {
 const manifest=[{enabled:true,engineId:engine,packageId:pkg,cpIds:[cp],reviewOnly:true,maxQuestions:1}];
 test(engine+" exact scoped entry accepted",()=>assert.equal(validateReviewOnlyRollout(snap(engine,pkg,cp),manifest),true));
 test(engine+" arbitrary CP denied",()=>assert.equal(validateReviewOnlyRollout(snap(engine,pkg,cp+"-OTHER"),manifest),false));
 test(engine+" disabled entry denied",()=>assert.equal(validateReviewOnlyRollout(snap(engine,pkg,cp),[{...manifest[0],enabled:false}]),false));
 test(engine+" non-review entry denied",()=>assert.equal(validateReviewOnlyRollout(snap(engine,pkg,cp),[{...manifest[0],reviewOnly:false}]),false));
}
test("multi question request denied",()=>{
 const [e,p,c]=cases[0];const s=snap(e,p,c);s.count=2;s.request.count=2;
 assert.equal(validateReviewOnlyRollout(s,[{enabled:true,engineId:e,packageId:p,cpIds:[c],reviewOnly:true,maxQuestions:1}]),false);
});
test("unknown engine denied",()=>assert.equal(validateReviewOnlyRollout(snap("custom-v99","COM-001","COM-001-CP-001"),[{enabled:true,engineId:"custom-v99",packageId:"COM-001",cpIds:["COM-001-CP-001"],reviewOnly:true,maxQuestions:1}]),false));
test("duplicate matches denied",()=>{
 const [e,p,c]=cases[0],entry={enabled:true,engineId:e,packageId:p,cpIds:[c],reviewOnly:true,maxQuestions:1};
 assert.equal(validateReviewOnlyRollout(snap(e,p,c),[entry,entry]),false);
});
