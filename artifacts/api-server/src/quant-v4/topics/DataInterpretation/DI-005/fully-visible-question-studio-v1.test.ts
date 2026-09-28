import assert from "node:assert/strict";
import { DI005_FULLY_VISIBLE_CANONICAL_PROBLEM_ID, DI005_FULLY_VISIBLE_RUNTIME_MODE, generateDi005QuestionStudioBatch } from "./question-studio-adapter";

const result=await generateDi005QuestionStudioBatch({
  canonicalProblemId:DI005_FULLY_VISIBLE_CANONICAL_PROBLEM_ID,
  examProfile:"BANKING_PRELIMS",
  language:"en",
  count:30,
  seed:"DI-005-FV-QS-INTEGRATION",
});
assert.equal(result.generationContext.runtimeMode,DI005_FULLY_VISIBLE_RUNTIME_MODE);
assert.equal(result.generationContext.questionStudioMode,"CONTROLLED_REVIEW");
assert.equal(result.generationContext.questionBankWritable,false);
assert.equal(result.generationContext.productionReleaseAuthorized,false);
assert.equal(result.questions.length,30);
for(const question of result.questions){
  assert.equal(question.canonicalProblemId,DI005_FULLY_VISIBLE_CANONICAL_PROBLEM_ID);
  assert.equal(question.runtimeMode,DI005_FULLY_VISIBLE_RUNTIME_MODE);
  assert.equal(question.language,"en");
  assert.equal(question.reviewOnly,true);
  assert.equal(question.questionBankWritable,false);
  assert.equal(question.publiclyPublishable,false);
  assert.equal(question.stimulus.hiddenPercentIndex,-1);
  assert(question.stimulus.slices.every((slice:any)=>slice.displayPercent===slice.percent));
  assert(question.stimulusSvgs[0].includes("<svg"));
  assert(!question.stimulusSvgs[0].includes(">?</text>"));
}
await assert.rejects(
  () => generateDi005QuestionStudioBatch({canonicalProblemId:DI005_FULLY_VISIBLE_CANONICAL_PROBLEM_ID,language:"hi",count:1,seed:"blocked-hi"}),
  /English review-only/u,
);
console.log("DI005_FULLY_VISIBLE_QUESTION_STUDIO_V1",JSON.stringify({questions:result.questions.length,runtimeMode:result.generationContext.runtimeMode,lifecycleLocked:true}));
