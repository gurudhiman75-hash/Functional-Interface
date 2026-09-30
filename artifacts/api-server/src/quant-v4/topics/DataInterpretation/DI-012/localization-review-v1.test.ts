import assert from "node:assert/strict";
import { generateDi012Set, DI012_MODEL_KINDS } from "./advanced-missing-set";
import { localizeDi012Set } from "./localization-review-v1";
import { renderDi012TableHtml } from "./render-table";
import { generateDi012QuestionStudioBatch } from "./question-studio-adapter";

const models=new Set<string>(),tasks=new Set<string>();
for(let i=0;i<350;i++){
  const seed=`DI-012-HI-PA-COVERAGE-${i}`,source=generateDi012Set({seed,examProfile:i%2?"BANKING_MAINS":"BANKING_PRELIMS"});
  models.add(source.stimulus.modelKind);
  for(const locale of ["hi-IN","pa-IN"] as const){
    const candidate=localizeDi012Set(source,locale);
    assert.deepEqual(candidate.questions.map(q=>q.kind),source.questions.map(q=>q.kind));
    assert.deepEqual(candidate.questions.map(q=>q.answer),source.questions.map(q=>q.answer));
    assert.deepEqual(candidate.questions.map(q=>q.correctIndex),source.questions.map(q=>q.correctIndex));
    assert.equal(candidate.solution.x,source.solution.x);assert.equal(candidate.solution.y,source.solution.y);
    assert.match(candidate.stimulus.title,locale==="hi-IN"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u);
    assert.match(candidate.stimulus.condition,locale==="hi-IN"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u);
    const html=renderDi012TableHtml(candidate.stimulus);
    assert(html.includes(candidate.stimulus.title));assert(html.includes(candidate.stimulus.condition));
    assert(!html.includes(">Category</th>"));assert(!html.includes("Additional information:"));
    for(let q=0;q<candidate.questions.length;q++){
      const localized=candidate.questions[q]!,original=source.questions[q]!;tasks.add(localized.kind);
      assert.match(localized.stem,locale==="hi-IN"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u);
      assert(localized.stem.endsWith("?"),`DI-012 ${locale} stem is not a direct exam question: ${localized.stem}`);
      assert.doesNotMatch(localized.stem,/(पहले|फिर|ज्ञात करने के बाद|हल करने के बाद|ज्ञात कीजिए|निकालिए|जोड़िए|ਪਹਿਲਾਂ|ਫਿਰ|ਕੱਢੋ|ਜੋੜੋ)/u);
      assert.doesNotMatch(localized.stem,/[A-Za-z]{3,}/u);
      assert.equal(localized.options[localized.correctIndex],localized.answer);
      assert.equal(localized.answer,original.answer);
      assert.equal(localized.explanation.steps.length,original.explanation.steps.length);
    }
  }
}
assert.deepEqual([...models].sort(),[...DI012_MODEL_KINDS].sort());
assert.equal(tasks.size,10);
const englishBatch=await generateDi012QuestionStudioBatch({language:"en",count:24,seed:"DI-012-ADAPTER-LOCALIZATION"});
for(const language of ["hi","pa"] as const){
  const localized=await generateDi012QuestionStudioBatch({language,count:24,seed:"DI-012-ADAPTER-LOCALIZATION"});
  assert.equal(localized.generationContext.language,language);
  assert.equal(localized.generationContext.reviewStatus,"HI_PA_REVIEW_CANDIDATE");
  assert.equal(localized.generationContext.questionBankWritable,false);
  assert.deepEqual(localized.questions.map((q:any)=>q.answer),englishBatch.questions.map((q:any)=>q.answer));
  for(const q of localized.questions){
    assert.equal(q.language,language);assert.equal(q.questionBankWritable,false);assert.equal(q.testEligible,false);assert.equal(q.publiclyPublishable,false);
    assert.match(q.stimulusHtml,language==="hi"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u);
  }
}
console.log("PASS_DI_012_HI_PA_REVIEW_CANDIDATE",JSON.stringify({sets:350,models:models.size,tasks:tasks.size,answerParity:true,tableLabelsLocalized:true}));
