import assert from "node:assert/strict";
import {
  DI006_ADVANCED_CANONICAL_PROBLEM_ID,
  DI006_ADVANCED_RUNTIME_MODE,
  generateDi006QuestionStudioBatch,
} from "./question-studio-adapter";

const result=await generateDi006QuestionStudioBatch({
  canonicalProblemId:DI006_ADVANCED_CANONICAL_PROBLEM_ID,
  examProfile:"BANKING_MAINS",
  language:"en",
  count:35,
  seed:"DI-006-ADV-QS-INTEGRATION",
});
assert.equal(result.generationContext.runtimeMode,DI006_ADVANCED_RUNTIME_MODE);
assert.equal(result.generationContext.questionStudioMode,"CONTROLLED_REVIEW");
assert.equal(result.generationContext.questionBankWritable,false);
assert.equal(result.generationContext.productionReleaseAuthorized,false);
assert.equal(result.questions.length,35);
const topologies=new Set<string>();
for(const question of result.questions){
  assert.equal(question.canonicalProblemId,DI006_ADVANCED_CANONICAL_PROBLEM_ID);
  assert.equal(question.runtimeMode,DI006_ADVANCED_RUNTIME_MODE);
  assert.equal(question.language,"en");
  assert.equal(question.reviewOnly,true);
  assert.equal(question.questionBankWritable,false);
  assert.equal(question.testEligible,false);
  assert.equal(question.publiclyPublishable,false);
  assert(question.stimulus.learnerText.length>50);
  topologies.add(question.stimulus.topology);
}
assert.equal(topologies.size,5,"Question Studio preview should exercise all five advanced topologies.");
await assert.rejects(
  () => generateDi006QuestionStudioBatch({canonicalProblemId:DI006_ADVANCED_CANONICAL_PROBLEM_ID,language:"pa",count:1,seed:"blocked-pa"}),
  /English review-only/u,
);
console.log("DI006_ADVANCED_CASELET_QUESTION_STUDIO_V1",JSON.stringify({questions:result.questions.length,topologies:[...topologies].sort(),lifecycleLocked:true}));
