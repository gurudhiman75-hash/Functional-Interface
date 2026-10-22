import test from "node:test";
import assert from "node:assert/strict";
import {validateReviewOnlyRollout} from "../artifacts/api-server/src/question-studio/review-only-rollout-policy.mjs";
const cases=[
 ["quant-v4","TRG-002","TRG-CP-007"],
 ["reasoning-v1","OPS-001","OPS-CP-001"],
 ["language-v1","ENG-001","ENG-001-CP013"],
 ["knowledge-v1","COM-001","COM-001-CP-001"],
];
function snapshot(engineId,packageId,cp) {
 return {queueVersion:1,count:1,selectedCpIds:[cp],
   request:{engineId,packageId,canonicalProblemId:cp,count:1,language:"en",seed:"rollout-policy-test-1"}};
}
function canonical(engineId,packageId,cp) {
 return {source:"canonical-question-studio-engine-registry",schemaVersion:1,
  packages:[{enabled:true,engineId,packageId,cpIds:[cp],reviewSurfaceRequired:true,
    manualApprovalRequired:true,questionBankWritable:false,automaticStudentPublication:false,
    productionReleaseAuthorized:false,publiclyPublishable:false,testEligible:false,
    mockTestEligible:false,supportedLanguages:["en"]}]};
}
function scope(engineId,packageId,cp) {
 return [{engineId,packageId,cpId:cp,reviewOnly:true}];
}
for (const [engine,pkg,cp] of cases) {
 const s=snapshot(engine,pkg,cp), m=canonical(engine,pkg,cp), a=scope(engine,pkg,cp);
 test(engine+" exact canonical + approved CP accepted",()=>assert.equal(validateReviewOnlyRollout(s,m,a),true));
 test(engine+" arbitrary CP denied",()=>assert.equal(validateReviewOnlyRollout(snapshot(engine,pkg,cp+"-OTHER"),m,a),false));
 test(engine+" empty approval denied",()=>assert.equal(validateReviewOnlyRollout(s,m,[]),false));
 test(engine+" disabled canonical package denied",()=>assert.equal(validateReviewOnlyRollout(s,{...m,packages:[{...m.packages[0],enabled:false}]},a),false));
 test(engine+" automatic publication denied",()=>assert.equal(validateReviewOnlyRollout(s,{...m,packages:[{...m.packages[0],automaticStudentPublication:true}]},a),false));
 test(engine+" writable Question Bank denied",()=>assert.equal(validateReviewOnlyRollout(s,{...m,packages:[{...m.packages[0],questionBankWritable:true}]},a),false));
 test(engine+" duplicate approvals denied",()=>assert.equal(validateReviewOnlyRollout(s,m,[...a,...a]),false));
 test(engine+" duplicate canonical package denied",()=>assert.equal(validateReviewOnlyRollout(s,{...m,packages:[...m.packages,...m.packages]},a),false));
 test(engine+" wrong manifest provenance denied",()=>assert.equal(validateReviewOnlyRollout(s,{...m,source:"untrusted"},a),false));
 test(engine+" missing manual review denied",()=>assert.equal(validateReviewOnlyRollout(s,{...m,packages:[{...m.packages[0],manualApprovalRequired:false}]},a),false));
}
test("multiple questions denied",()=>{const [e,p,c]=cases[0],s=snapshot(e,p,c);s.count=2;s.request.count=2;assert.equal(validateReviewOnlyRollout(s,canonical(e,p,c),scope(e,p,c)),false);});
test("unknown engine denied",()=>{const e="custom-v99",p="COM-001",c="COM-001-CP-001";assert.equal(validateReviewOnlyRollout(snapshot(e,p,c),canonical(e,p,c),scope(e,p,c)),false);});
