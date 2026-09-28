import assert from "node:assert/strict";
import {
  DI005_COMPARATIVE_CANONICAL_PROBLEM_ID,
  DI005_COMPARATIVE_RUNTIME_MODE,
  generateDi005QuestionStudioBatch,
} from "./question-studio-adapter";

const result=await generateDi005QuestionStudioBatch({
  canonicalProblemId:DI005_COMPARATIVE_CANONICAL_PROBLEM_ID,
  examProfile:"BANKING_MAINS",
  language:"en",
  count:30,
  seed:"DI-005-COMP-QS-INTEGRATION",
});
assert.equal(result.generationContext.runtimeMode,DI005_COMPARATIVE_RUNTIME_MODE);
assert.equal(result.generationContext.questionStudioMode,"CONTROLLED_REVIEW");
assert.equal(result.generationContext.questionBankWritable,false);
assert.equal(result.questions.length,30);
for(const q of result.questions){
  assert.equal(q.canonicalProblemId,DI005_COMPARATIVE_CANONICAL_PROBLEM_ID);
  assert.equal(q.runtimeMode,DI005_COMPARATIVE_RUNTIME_MODE);
  assert.equal(q.reviewOnly,true);
  assert.equal(q.questionBankWritable,false);
  assert.equal(q.publiclyPublishable,false);
  assert.equal(q.stimulusSvgs.length,2);
  assert(q.stimulusSvgs.every((svg:string)=>svg.includes("<svg")&&!svg.includes(">?</text>")));
}
await assert.rejects(
  ()=>generateDi005QuestionStudioBatch({canonicalProblemId:DI005_COMPARATIVE_CANONICAL_PROBLEM_ID,language:"hi",count:1,seed:"blocked-hi"}),
  /English review-only/u,
);
console.log("DI005_COMPARATIVE_QUESTION_STUDIO_V1",JSON.stringify({questions:result.questions.length,lifecycleLocked:true}));
