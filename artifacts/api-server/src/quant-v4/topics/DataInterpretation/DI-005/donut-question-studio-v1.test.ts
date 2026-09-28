import assert from "node:assert/strict";
import {
  DI005_DONUT_CANONICAL_PROBLEM_ID,
  DI005_DONUT_RUNTIME_MODE,
  generateDi005QuestionStudioBatch,
} from "./question-studio-adapter";

const result=await generateDi005QuestionStudioBatch({
  canonicalProblemId:DI005_DONUT_CANONICAL_PROBLEM_ID,
  examProfile:"BANKING_MAINS",
  language:"en",
  count:25,
  seed:"DI-005-DONUT-QS-INTEGRATION",
});
assert.equal(result.generationContext.runtimeMode,DI005_DONUT_RUNTIME_MODE);
assert.equal(result.generationContext.questionStudioMode,"CONTROLLED_REVIEW");
assert.equal(result.generationContext.questionBankWritable,false);
assert.equal(result.questions.length,25);
for(const q of result.questions){
  assert.equal(q.canonicalProblemId,DI005_DONUT_CANONICAL_PROBLEM_ID);
  assert.equal(q.runtimeMode,DI005_DONUT_RUNTIME_MODE);
  assert.equal(q.reviewOnly,true);
  assert.equal(q.questionBankWritable,false);
  assert.equal(q.publiclyPublishable,false);
  assert(q.stimulusSvgs[0].includes('data-donut-chart="true"'));
  assert(q.stimulusSvgs[0].includes('data-donut-hole="true"'));
  assert(!q.stimulusSvgs[0].includes(">?</text>"));
}
await assert.rejects(
  ()=>generateDi005QuestionStudioBatch({canonicalProblemId:DI005_DONUT_CANONICAL_PROBLEM_ID,language:"pa",count:1,seed:"blocked-pa"}),
  /English review-only/u,
);
console.log("DI005_DONUT_QUESTION_STUDIO_V1",JSON.stringify({questions:result.questions.length,lifecycleLocked:true}));
