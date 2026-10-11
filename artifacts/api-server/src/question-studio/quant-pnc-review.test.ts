import {strict as assert} from "node:assert";
import {generatePncReviewBatch,pncReviewPackages} from "./quant-pnc-review";
let checked=0;
for(let n=1;n<=269;n++)for(const language of (['en','hi','pa'])as ('en'|'hi'|'pa')[]) {
 const ql=`PNC-QL-${String(n).padStart(3,'0')}`,request={packageId:n<=106?'PNC-001':'PNC-002',questionLanguageId:ql,language,seed:'integration-check',count:1};
 const result=generatePncReviewBatch(request)!;assert.equal(result.questions.length,1);const q=result.questions[0];assert.equal(q.qlId,ql);assert.equal(q.language,language);assert.equal(q.publiclyPublishable,false);assert.equal(q.questionBankWritable,false);assert.equal(q.testEligible,false);assert.equal(q.mockTestEligible,false);assert.equal(q.answer,q.options![q.correctIndex!]);assert.equal(new Set(q.options).size,4);assert(q.explanation!.length>10);assert.doesNotThrow(()=>JSON.stringify(result));checked++;
}
for(const packageId of ['PNC-001','PNC-002'])for(const difficulty of ['Easy','Medium','Hard']) {
 const r={packageId,difficulty,seed:'batch-seed',count:5};const a=generatePncReviewBatch(r)!;assert.deepEqual(a,generatePncReviewBatch(r));assert(a.questions.every(q=>q.difficulty===difficulty));assert.equal(new Set(a.questions.map(q=>q.stem)).size,5);
}
assert.deepEqual(pncReviewPackages()[0].supportedLanguages,['en','hi','pa']);assert.deepEqual(pncReviewPackages()[1].supportedLanguages,['en','hi','pa']);
assert.equal(generatePncReviewBatch({packageId:'PNC-001',language:'hi'})!.questions[0].metadata!.nativeAuthority,'PNC-001-AUTHORED-REVIEW-CANDIDATE');assert.throws(()=>generatePncReviewBatch({packageId:'PNC-002',canonicalProblemId:'PNC-CP-001'}));assert.equal(generatePncReviewBatch({packageId:'TSD-001'}),null);
console.log(JSON.stringify({status:'PASS',learnerSurfaces:checked,difficultyBatches:6}));
