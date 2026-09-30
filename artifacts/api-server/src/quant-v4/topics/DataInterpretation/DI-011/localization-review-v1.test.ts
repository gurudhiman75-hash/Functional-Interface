import assert from "node:assert/strict";
import { generateDi011QuestionStudioBatch } from "./question-studio-adapter";

const seenPairs=new Set<string>(),seenTasks=new Set<string>();
for(let i=0;i<80;i++){
  const seed=`DI-011-HI-PA-COVERAGE-${i}`;
  const en=await generateDi011QuestionStudioBatch({language:"en",count:5,seed});
  for(const locale of ["hi","pa"] as const){
    const localized=await generateDi011QuestionStudioBatch({language:locale,count:5,seed});
    assert.equal(localized.generationContext.localizationStatus,"HI_PA_REVIEW_CANDIDATE");
    assert.equal(localized.generationContext.questionBankWritable,false);
    assert.equal(localized.questions.length,en.questions.length);
    for(let n=0;n<en.questions.length;n++){
      const source=en.questions[n]!,candidate=localized.questions[n]!;
      seenTasks.add(candidate.taskKind);
      assert.equal(candidate.taskKind,source.taskKind);
      assert.equal(candidate.correctIndex,source.correctIndex);
      assert.equal(candidate.questionBankWritable,false);
      assert.equal(candidate.testEligible,false);
      assert.equal(candidate.mockTestEligible,false);
      assert.equal(candidate.publiclyPublishable,false);
      assert.match(candidate.stem,locale==="hi"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u);
      assert(candidate.stem.endsWith("?"),`DI-011 ${locale} stem is not a direct exam question: ${candidate.stem}`);
      assert.doesNotMatch(candidate.stem,/(पहले|फिर|ज्ञात कीजिए|निकालिए|जोड़िए|जोड़ो|ਪਹਿਲਾਂ|ਫਿਰ|ਕੱਢੋ|ਜੋੜੋ)/u);
      if(candidate.taskKind==="TWO_GROUP_CROSS_RATIO"){
        assert.match(candidate.stem,locale==="hi"?/समूह 1 .* में .* और समूह 2 .* में .* का अनुपात क्या है\?$/u:/ਸਮੂਹ 1 .* ਵਿੱਚ .* ਅਤੇ ਸਮੂਹ 2 .* ਵਿੱਚ .* ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ\?$/u);
        assert.doesNotMatch(candidate.stem,/(के लिए .* कुल का अनुपात|ਲਈ .* ਕੁੱਲ ਦਾ ਅਨੁਪਾਤ)/u);
      }
      if(candidate.taskKind==="SAME_CATEGORY_COMBINED_TOTAL"&&candidate.metadata.pairKind==="PIE_TABLE"){
        assert.match(candidate.stem,locale==="hi"?/पाई चार्ट/u:/ਪਾਈ ਚਾਰਟ/u);
        assert.doesNotMatch(candidate.stem,/(तालिका के अनुसार|सारणी के अनुसार|ਸਾਰਣੀ ਮੁਤਾਬਕ)/u);
        assert.doesNotMatch(candidate.stem,/(सबसे बड़ा हिस्सा रखने वाले|सबसे बड़ा हिस्सा रखने वाली|ਸਭ ਤੋਂ ਵੱਧ ਹਿੱਸੇ ਵਾਲੇ|ਸਭ ਤੋਂ ਵੱਧ ਹਿੱਸੇ ਵਾਲੀ)/u);
        assert.match(candidate.stem,locale==="hi"?/जिस .* का पाई चार्ट में हिस्सा सबसे बड़ा है/u:/ਜਿਸ .* ਦਾ ਪਾਈ ਚਾਰਟ ਵਿੱਚ ਹਿੱਸਾ ਸਭ ਤੋਂ ਵੱਧ ਹੈ/u);
      }
      assert.doesNotMatch(candidate.stem,/[A-Za-z]{3,}/u);
      assert.doesNotMatch(candidate.explanation,/The |What |Find |Total =/u);
      assert.match(candidate.stimulus.instruction,locale==="hi"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u);
      assert(candidate.stimulusSvgs[0].includes(candidate.stimulus.title));
      const sourceAnswer=source.answer,candidateAnswer=candidate.answer;
      if(/^\d|\d:\d/.test(sourceAnswer))assert.equal(candidateAnswer,sourceAnswer);
      else assert.equal(candidate.options[candidate.correctIndex],candidateAnswer);
    }
    seenPairs.add(localized.questionPackages[0]!.stimulus.pairKind);
  }
}
assert.equal(seenPairs.size,5,"DI-011 localization sweep did not reach every mixed representation pair.");
assert.equal(seenTasks.size,10,"DI-011 localization sweep did not reach every task family.");
console.log("PASS_DI_011_HI_PA_REVIEW_CANDIDATE",JSON.stringify({seeds:80,pairs:seenPairs.size,tasks:seenTasks.size,lifecycleLocked:true}));
