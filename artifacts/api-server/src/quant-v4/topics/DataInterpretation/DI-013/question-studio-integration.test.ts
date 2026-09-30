import assert from "node:assert/strict";
import {
  DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI013_QUESTION_STUDIO_RUNTIME_MODE,
  generateDi013QuestionStudioBatch,
} from "./question-studio-adapter";
import { generateDi013RadarSet, DI013_TASKS } from "./radar-set";
import { localizeDi013Set } from "./localization-review-v1";

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
for(const language of ["hi","pa"] as const){
  const localized=await generateDi013QuestionStudioBatch({canonicalProblemId:DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,examProfile:"BANKING_MAINS",language,count:30,seed:"DI-013-QS-INTEGRATION"});
  assert.equal(localized.generationContext.reviewStatus,"HI_PA_REVIEW_CANDIDATE");
  assert.equal(localized.generationContext.questionBankWritable,false);
  for(const q of localized.questions){
    assert.equal(q.language,language);
    assert.equal(q.reviewStatus,"HI_PA_REVIEW_CANDIDATE");
    assert.equal(q.options[q.correctIndex],q.answer);
    assert.match(q.stem,language==="hi"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u);
    assert(q.stem.endsWith("?"),`DI-013 ${language} stem is not a direct exam question: ${q.stem}`);
    assert.doesNotMatch(q.stem,/(पहले|फिर|ज्ञात कीजिए|निकालिए|जोड़िए|जोड़ो|ਪਹਿਲਾਂ|ਫਿਰ|ਕੱਢੋ|ਜੋੜੋ)/u);
    assert.doesNotMatch(q.stem,/[A-Za-z]{3,}/u);
    if(q.kind==="TWO_CATEGORY_GROUP_RATIO")assert.doesNotMatch(q.stem,/(इन श्रेणियों में|ਇਨ੍ਹਾਂ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ)/u);
    if(q.kind==="CROSS_SERIES_CATEGORY_RATIO")assert.doesNotMatch(q.stem,/(के लिए|ਲਈ)/u);
    assert.match(q.stimulus.instruction,language==="hi"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u);
    assert(q.stimulusSvgs[0].includes('data-radar-chart="true"'));
    assert(q.stimulusSvgs[0].includes(q.stimulus.title));
    assert.equal(q.questionBankWritable,false);
    assert.equal(q.testEligible,false);
    assert.equal(q.publiclyPublishable,false);
  }
  for(let i=0;i<localized.questions.length;i++){
    const source=result.questions[i]!,candidate=localized.questions[i]!;
    assert.equal(candidate.correctIndex,source.correctIndex);
    if(/^\d|\d:\d/u.test(source.answer))assert.equal(candidate.answer,source.answer);
    else assert.equal(candidate.answer,candidate.options[candidate.correctIndex]);
  }
}
for(const locale of ["hi-IN","pa-IN"] as const){
  const contexts=new Set<string>(),tasks=new Set<string>();
  for(let i=0;i<320;i++){
    const source=generateDi013RadarSet({seed:`DI013-LOCALIZATION-STRESS-${i}`,examProfile:"BANKING_MAINS"}),localized=localizeDi013Set(source,locale);
    contexts.add(source.stimulus.contextId);
    assert.equal(localized.questions.length,source.questions.length);
    for(let n=0;n<source.questions.length;n++){
      const a=source.questions[n]!,b=localized.questions[n]!;tasks.add(b.kind);
      assert.equal(b.kind,a.kind);assert.equal(b.difficulty,a.difficulty);assert.equal(b.correctIndex,a.correctIndex);
      assert.equal(b.options[b.correctIndex],b.answer);
      const categoryIndex=source.stimulus.points.findIndex(p=>p.category===a.answer);
      assert.equal(b.answer,categoryIndex>=0?localized.stimulus.points[categoryIndex]!.category:a.answer);
      assert.doesNotMatch(b.stem,/[A-Za-z]{3,}/u);
    }
  }
  assert.deepEqual([...tasks].sort(),[...DI013_TASKS].sort());assert.equal(contexts.size,8);
}
console.log("DI013_RADAR_QUESTION_STUDIO_V1",JSON.stringify({questions:result.questions.length,bilingualCandidate:true,lifecycleLocked:true}));
