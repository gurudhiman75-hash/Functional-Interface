import assert from "node:assert/strict";
import { DI003_SINGLE_CANONICAL_PROBLEM_ID, DI003_SINGLE_RUNTIME_MODE, generateDi003QuestionStudioBatch } from "../DI-003/question-studio-adapter";
import { DI004_SINGLE_CANONICAL_PROBLEM_ID, DI004_SINGLE_RUNTIME_MODE, generateDi004QuestionStudioBatch } from "../DI-004/question-studio-adapter";

const bar=await generateDi003QuestionStudioBatch({canonicalProblemId:DI003_SINGLE_CANONICAL_PROBLEM_ID,language:"en",examProfile:"SSC_CGL_TIER_I",count:20,seed:"DI-SINGLE-BAR-QS"});
assert.equal(bar.generationContext.runtimeMode,DI003_SINGLE_RUNTIME_MODE);
assert.equal(bar.generationContext.questionBankWritable,false);
for(const q of bar.questions){
  assert.equal(q.canonicalProblemId,DI003_SINGLE_CANONICAL_PROBLEM_ID);
  assert(q.stimulusSvgs[0].includes('data-single-series-bar="true"'));
  assert(!q.stimulusSvgs[0].includes("SERIES_B"));
  assert.equal(q.reviewOnly,true);
}

const line=await generateDi004QuestionStudioBatch({canonicalProblemId:DI004_SINGLE_CANONICAL_PROBLEM_ID,language:"en",examProfile:"BANKING_PRELIMS",count:20,seed:"DI-SINGLE-LINE-QS"});
assert.equal(line.generationContext.runtimeMode,DI004_SINGLE_RUNTIME_MODE);
assert.equal(line.generationContext.questionBankWritable,false);
for(const q of line.questions){
  assert.equal(q.canonicalProblemId,DI004_SINGLE_CANONICAL_PROBLEM_ID);
  assert(q.stimulusSvgs[0].includes('data-single-series-line="true"'));
  assert(!q.stimulusSvgs[0].includes("SERIES_B"));
  assert.equal(q.reviewOnly,true);
}
console.log("DI_SINGLE_SERIES_QUESTION_STUDIO_V1",JSON.stringify({barQuestions:bar.questions.length,lineQuestions:line.questions.length,lifecycleLocked:true}));
