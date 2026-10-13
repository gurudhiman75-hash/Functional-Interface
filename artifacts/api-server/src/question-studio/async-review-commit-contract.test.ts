import assert from "node:assert/strict";
import {validateQuestionStudioAsyncReviewBatch,QuestionStudioReviewCommitError} from "./async-review-commit-contract";
import type {UniversalStudioComputeResult} from "./universal-executor";

const snapshot={
  queueVersion:1,
  request:{
    engineId:"reasoning-v1",packageId:"OPS-001",
    count:2,language:"en",topic:"Mathematical Operations",
    subtopic:"Mathematical Operations",difficulty:"Mixed",
    seed:"persisted-once",
  },
  count:2,
  selectedCpIds:[],
};
const batch:UniversalStudioComputeResult={
  engineId:"reasoning-v1",packageId:"OPS-001",
  quantPlan:null,generationContexts:[{context:{engineId:"reasoning-v1"}}],
  questions:[
    {stem:"Which operation is correct?",options:["One","Two","Three","Four"],correctIndex:2,explanation:"Substitute the signs."},
    {text:"Find the result?",options:["1","2","3"],correct:0,explanationLines:["Apply the rule."]},
  ],
};
const canonical=validateQuestionStudioAsyncReviewBatch(snapshot,batch);
assert.equal(canonical.count,2);
assert.equal(canonical.request.packageId,"OPS-001");
assert.deepEqual(canonical.selectedCpIds,[]);
for(const changed of [
  {...snapshot,queueVersion:2},
  {...snapshot,count:3},
  {...snapshot,request:{...snapshot.request,packageId:"BAD-001"}},
  {...snapshot,request:{...snapshot.request,engineId:"quant-v4"}},
  {...snapshot,request:{...snapshot.request,count:1}},
  {...snapshot,selectedCpIds:null},
]){
  assert.throws(()=>validateQuestionStudioAsyncReviewBatch(changed,batch),QuestionStudioReviewCommitError);
}
for(const wrong of [
  {...batch,questions:batch.questions.slice(0,1)},
  {...batch,engineId:"knowledge-v1"},
  {...batch,packageId:"COM-001"},
  {...batch,generationContexts:[]},
  {...batch,questions:[{...batch.questions[0],options:[]},batch.questions[1]]},
  {...batch,questions:[{...batch.questions[0],stem:"",text:""},batch.questions[1]]},
  {...batch,questions:[{...batch.questions[0],correctIndex:undefined,correct:undefined,answer:undefined},batch.questions[1]]},
  {...batch,questions:[{...batch.questions[0],explanation:"",explanationLines:undefined},batch.questions[1]]},
]){
  assert.throws(()=>validateQuestionStudioAsyncReviewBatch(snapshot,wrong as UniversalStudioComputeResult),QuestionStudioReviewCommitError);
}
const quantSnapshot={...snapshot,count:1,
  request:{...snapshot.request,engineId:"quant-v4",packageId:"TRG-002",count:1,difficulty:"Medium"}};
const quantBatch={...batch,engineId:"quant-v4",packageId:"TRG-002",quantPlan:null,questions:batch.questions.slice(0,1)};
assert.throws(()=>validateQuestionStudioAsyncReviewBatch(quantSnapshot,quantBatch as UniversalStudioComputeResult),
  QuestionStudioReviewCommitError);
console.log("PASS: review input package, engine, count, context, options, answer and explanation guards");
