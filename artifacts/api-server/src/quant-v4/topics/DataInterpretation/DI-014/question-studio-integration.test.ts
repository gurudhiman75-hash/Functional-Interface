import assert from "node:assert/strict";
import {
  DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI014_QUESTION_STUDIO_RUNTIME_MODE,
  generateDi014QuestionStudioBatch,
} from "./question-studio-adapter";

const result=await generateDi014QuestionStudioBatch({
  canonicalProblemId:DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  examProfile:"BANKING_MAINS",
  language:"en",
  count:30,
  seed:"DI-014-QS-INTEGRATION",
});
assert.equal(result.generationContext.runtimeMode,DI014_QUESTION_STUDIO_RUNTIME_MODE);
assert.equal(result.generationContext.questionStudioMode,"CONTROLLED_REVIEW");
assert.equal(result.generationContext.questionBankWritable,false);
assert.equal(result.questions.length,30);
for(const q of result.questions){
  assert.equal(q.packageId,"DI-014");
  assert.equal(q.canonicalProblemId,DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID);
  assert.equal(q.runtimeMode,DI014_QUESTION_STUDIO_RUNTIME_MODE);
  assert.equal(q.reviewOnly,true);
  assert.equal(q.questionBankWritable,false);
  assert.equal(q.publiclyPublishable,false);
  assert.equal(q.stimulusSvgs.length,2);
  assert(q.stimulusSvgs[0].includes('data-radar-pie-radar="true"'));
  assert(q.stimulusSvgs[1].includes('data-pie-chart="true"'));
  assert(!q.stimulusSvgs[1].includes(">?</text>"));
}
await assert.rejects(
  ()=>generateDi014QuestionStudioBatch({canonicalProblemId:DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,language:"hi",count:1,seed:"blocked-hi"}),
  /English review-only/u,
);
console.log("DI014_RADAR_PIE_QS_V1",JSON.stringify({questions:result.questions.length,lifecycleLocked:true}));
