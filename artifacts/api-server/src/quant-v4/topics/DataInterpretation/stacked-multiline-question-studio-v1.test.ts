import assert from "node:assert/strict";
import {
  DI003_STACKED_CANONICAL_PROBLEM_ID,
  DI003_STACKED_RUNTIME_MODE,
  generateDi003QuestionStudioBatch,
} from "./DI-003/question-studio-adapter";
import {
  DI004_MULTI_CANONICAL_PROBLEM_ID,
  DI004_MULTI_RUNTIME_MODE,
  generateDi004QuestionStudioBatch,
} from "./DI-004/question-studio-adapter";

const stacked=await generateDi003QuestionStudioBatch({
  canonicalProblemId:DI003_STACKED_CANONICAL_PROBLEM_ID,
  examProfile:"BANKING_MAINS",
  language:"en",
  count:25,
  seed:"DI-STACKED-QS-INTEGRATION",
});
assert.equal(stacked.generationContext.runtimeMode,DI003_STACKED_RUNTIME_MODE);
assert.equal(stacked.generationContext.questionStudioMode,"CONTROLLED_REVIEW");
assert.equal(stacked.generationContext.questionBankWritable,false);
for(const q of stacked.questions){
  assert.equal(q.canonicalProblemId,DI003_STACKED_CANONICAL_PROBLEM_ID);
  assert.equal(q.reviewOnly,true);
  assert(q.stimulusSvgs[0].includes('data-stacked-bar="true"'));
}

const multi=await generateDi004QuestionStudioBatch({
  canonicalProblemId:DI004_MULTI_CANONICAL_PROBLEM_ID,
  examProfile:"BANKING_MAINS",
  language:"en",
  count:25,
  seed:"DI-MULTI-LINE-QS-INTEGRATION",
});
assert.equal(multi.generationContext.runtimeMode,DI004_MULTI_RUNTIME_MODE);
assert.equal(multi.generationContext.questionStudioMode,"CONTROLLED_REVIEW");
assert.equal(multi.generationContext.questionBankWritable,false);
for(const q of multi.questions){
  assert.equal(q.canonicalProblemId,DI004_MULTI_CANONICAL_PROBLEM_ID);
  assert.equal(q.reviewOnly,true);
  assert(q.stimulusSvgs[0].includes('data-multi-line="true"'));
  assert(q.stimulusSvgs[0].includes('data-series-count="3"'));
}
console.log("DI_STACKED_MULTILINE_QS_V1",JSON.stringify({stacked:stacked.questions.length,multi:multi.questions.length,lifecycleLocked:true}));
