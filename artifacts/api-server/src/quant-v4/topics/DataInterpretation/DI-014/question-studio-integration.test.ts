import assert from "node:assert/strict";
import {
  DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
  DI014_QUESTION_STUDIO_RUNTIME_MODE,
  generateDi014QuestionStudioBatch,
} from "./question-studio-adapter";
import { generateDi014RadarPieSet, DI014_TASKS } from "./radar-pie-set";
import { localizeDi014Set } from "./localization-review-v1";

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
for(const language of ["hi","pa"] as const){
  const localized=await generateDi014QuestionStudioBatch({canonicalProblemId:DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,examProfile:"BANKING_MAINS",language,count:30,seed:"DI-014-QS-INTEGRATION"});
  assert.equal(localized.generationContext.reviewStatus,"HI_PA_REVIEW_CANDIDATE");
  for(const q of localized.questions){
    assert.equal(q.language,language);
    assert.match(q.stem,language==="hi"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u);
    assert(q.stem.endsWith("?"),`DI-014 ${language} stem is not a direct exam question: ${q.stem}`);
    assert.doesNotMatch(q.stem,/(पहले|फिर|ज्ञात कीजिए|निकालिए|जोड़िए|जोड़ो|ਪਹਿਲਾਂ|ਫਿਰ|ਕੱਢੋ|ਜੋੜੋ)/u);
    assert.doesNotMatch(q.stem,/[A-Za-z]{3,}/u);
    assert.equal(q.reviewStatus,"HI_PA_REVIEW_CANDIDATE");
    assert.equal(q.options[q.correctIndex],q.answer);
    assert.equal(q.questionBankWritable,false);
    assert.equal(q.testEligible,false);
    assert.equal(q.publiclyPublishable,false);
    assert(q.stimulusSvgs[0].includes(q.stimulus.radar.title));
    assert(q.stimulusSvgs[1].includes(q.stimulus.pie.title));
  }
  for(let i=0;i<result.questions.length;i++){
    const original=result.questions[i]!,candidate=localized.questions[i]!;
    const expected=original.answer.replace(/^(\d+) percentage points$/u,(_m:string,n:string)=>`${n} ${language==="hi"?"प्रतिशत-अंक":"ਪ੍ਰਤੀਸ਼ਤ-ਅੰਕ"}`);
    assert.equal(candidate.answer,expected);
  }
}
for(const locale of ["hi-IN","pa-IN"] as const){
  const contexts=new Set<string>(),tasks=new Set<string>();
  for(let i=0;i<320;i++){
    const source=generateDi014RadarPieSet({seed:`DI014-LOCALIZATION-STRESS-${i}`}),localized=localizeDi014Set(source,locale);
    contexts.add(source.radar.title.split(" — ")[0]!);
    for(let n=0;n<source.questions.length;n++){
      const a=source.questions[n]!,b=localized.questions[n]!;tasks.add(b.kind);
      const expected=a.answer.replace(/^(\d+) percentage points$/u,(_m,n)=>`${n} ${locale==="hi-IN"?"प्रतिशत-अंक":"ਪ੍ਰਤੀਸ਼ਤ-ਅੰਕ"}`);
      assert.equal(b.answer,expected);assert.equal(b.options[b.correctIndex],b.answer);assert.equal(b.correctIndex,a.correctIndex);
      if(b.kind==="GROUP_APPLICATION_TO_APPROVAL_RATIO")assert.match(b.stem,locale==="hi-IN"?/में प्राप्त आवेदनों की कुल संख्या का स्वीकृत आवेदनों की कुल संख्या से अनुपात क्या है\?$/u:/में प्राप्त अर्जी|ਵਿੱਚ ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਦਾ ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ\?$/u);
      if(b.kind==="TOTAL_APPLICATION_TO_APPROVAL_RATIO")assert.match(b.stem,locale==="hi-IN"?/सभी श्रेणियों में प्राप्त आवेदनों की कुल संख्या का स्वीकृत आवेदनों की कुल संख्या से अनुपात क्या है\?$/u:/ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਪ੍ਰਾਪਤ ਅਰਜ਼ੀਆਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਦਾ ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ\?$/u);
      assert.doesNotMatch(b.stem,/[A-Za-z]{3,}/u);
    }
  }
  assert.deepEqual([...tasks].sort(),[...DI014_TASKS].sort());assert.equal(contexts.size,8);
}
console.log("DI014_RADAR_PIE_QS_V1",JSON.stringify({questions:result.questions.length,bilingualCandidate:true,lifecycleLocked:true}));
