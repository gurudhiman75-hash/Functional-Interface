import assert from "node:assert/strict";
import {
  DI008_ADVANCED_CANONICAL_PROBLEM_ID,
  DI008_ADVANCED_RUNTIME_MODE,
  generateDi008QuestionStudioBatch,
} from "./question-studio-adapter";

const result=await generateDi008QuestionStudioBatch({
  canonicalProblemId:DI008_ADVANCED_CANONICAL_PROBLEM_ID,
  examProfile:"BANKING_MAINS",
  language:"en",
  count:42,
  seed:"DI-008-ADV-QS-INTEGRATION",
});
assert.equal(result.generationContext.runtimeMode,DI008_ADVANCED_RUNTIME_MODE);
assert.equal(result.generationContext.questionStudioMode,"CONTROLLED_REVIEW");
assert.equal(result.generationContext.questionBankWritable,false);
assert.equal(result.generationContext.productionReleaseAuthorized,false);
assert.equal(result.questions.length,42);
const domains=new Set<string>();
for(const question of result.questions){
  assert.equal(question.canonicalProblemId,DI008_ADVANCED_CANONICAL_PROBLEM_ID);
  assert.equal(question.runtimeMode,DI008_ADVANCED_RUNTIME_MODE);
  assert.equal(question.language,"en");
  assert.equal(question.reviewOnly,true);
  assert.equal(question.questionBankWritable,false);
  assert.equal(question.testEligible,false);
  assert.equal(question.publiclyPublishable,false);
  assert(question.stimulusHtml.includes(question.stimulus.note));
  domains.add(question.domain);
}
assert.equal(domains.size,6,"Question Studio preview should exercise all six advanced arithmetic domains.");
await assert.rejects(
  () => generateDi008QuestionStudioBatch({canonicalProblemId:DI008_ADVANCED_CANONICAL_PROBLEM_ID,language:"hi",count:1,seed:"blocked-hi"}),
  /English review-only/u,
);
console.log("DI008_ADVANCED_ARITHMETIC_QUESTION_STUDIO_V1",JSON.stringify({questions:result.questions.length,domains:[...domains].sort(),lifecycleLocked:true}));
