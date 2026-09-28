import assert from "node:assert/strict";
import {
  DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI013_QUESTION_STUDIO_RUNTIME_MODE,
  generateDi013QuestionStudioBatch,
} from "./question-studio-adapter";

const result=await generateDi013QuestionStudioBatch({
  canonicalProblemId:DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  examProfile:"BANKING_MAINS",
  language:"en",
  count:30,
  seed:"DI-013-QS-INTEGRATION",
});
assert.equal(result.generationContext.runtimeMode,DI013_QUESTION_STUDIO_RUNTIME_MODE);
assert.equal(result.generationContext.questionStudioMode,"CONTROLLED_REVIEW");
assert.equal(result.generationContext.questionBankWritable,false);
assert.equal(result.questions.length,30);
for(const q of result.questions){
  assert.equal(q.packageId,"DI-013");
  assert.equal(q.canonicalProblemId,DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID);
  assert.equal(q.runtimeMode,DI013_QUESTION_STUDIO_RUNTIME_MODE);
  assert.equal(q.reviewOnly,true);
  assert.equal(q.questionBankWritable,false);
  assert.equal(q.publiclyPublishable,false);
  assert(q.stimulusSvgs[0].includes('data-radar-chart="true"'));
  for(const point of q.stimulus.points){
    assert(q.stimulus.radialTicks.includes(point.seriesA));
    assert(q.stimulus.radialTicks.includes(point.seriesB));
  }
}
await assert.rejects(
  ()=>generateDi013QuestionStudioBatch({canonicalProblemId:DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,language:"pa",count:1,seed:"blocked-pa"}),
  /English review-only/u,
);
console.log("DI013_RADAR_QUESTION_STUDIO_V1",JSON.stringify({questions:result.questions.length,lifecycleLocked:true}));
