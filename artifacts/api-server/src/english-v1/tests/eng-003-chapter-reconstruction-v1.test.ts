import assert from "node:assert/strict";
import { materializeEng003Cp003AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP003/eng-003-cp003-v1";
import { materializeEng003Cp004AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP004/eng-003-cp004-v1";
import { materializeEng003Cp005AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP005/eng-003-cp005-v1";
import { materializeEng003Cp006AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP006/eng-003-cp006-v1";
import { materializeEng003Cp007AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP007/eng-003-cp007-v1";
import { materializeEng003Cp008AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP008/eng-003-cp008-v1";
import { materializeEng003Cp009AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP009/eng-003-cp009-v1";
import { materializeEng003Cp010AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP010/eng-003-cp010-v1";
import { materializeEng003Cp011AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP011/eng-003-cp011-v1";
import { materializeEng003Cp012AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP012/eng-003-cp012-v1";
import { materializeEng003Cp013AnswerV1 } from "../chapters/grammar-fillers/ENG-003/CP013/eng-003-cp013-v1";

import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../../question-studio/engine-registry";

const materializers: Record<string,(segments:readonly string[],blankIndex:number,answer:string)=>string> = {
  "ENG-003-CP004":materializeEng003Cp004AnswerV1,
  "ENG-003-CP005":materializeEng003Cp005AnswerV1,
  "ENG-003-CP006":materializeEng003Cp006AnswerV1,
  "ENG-003-CP007":materializeEng003Cp007AnswerV1,
  "ENG-003-CP008":materializeEng003Cp008AnswerV1,
  "ENG-003-CP009":materializeEng003Cp009AnswerV1,
  "ENG-003-CP010":materializeEng003Cp010AnswerV1,
  "ENG-003-CP011":materializeEng003Cp011AnswerV1,
  "ENG-003-CP012":materializeEng003Cp012AnswerV1,
  "ENG-003-CP013":materializeEng003Cp013AnswerV1,
};
const PACKAGE_ID = "english-eng003-grammar-fillers-v1";
const CPS = Array.from({length:13},(_,i)=>`ENG-003-CP${String(i+1).padStart(3,"0")}`);
const LEVELS = ["Easy","Medium","Hard"] as const;
const normalize = (v:string)=>v.replace(/\\s+([,.!?;:])/g,"$1").replace(/\\s+/g," ").trim();
const text = (v:unknown)=>typeof v==="string"?v.trim():"";
const pkg = listQuestionStudioPackages().find(p=>p.engineId==="language-v1"&&p.packageId===PACKAGE_ID);
assert.ok(pkg,"ENG-003 cumulative Question Studio package is unavailable");
assert.deepEqual(pkg.cpIds,CPS);
assert.equal(pkg.questionBankWritable,false);
assert.equal(pkg.testEligible,false);
assert.equal(pkg.mockTestEligible,false);
assert.equal(pkg.productionReleaseAuthorized,false);
const ruleIds = pkg.metadata?.grammarRuleIds;
assert.ok(Array.isArray(ruleIds)&&ruleIds.length===131,"ENG-003 must preserve all 131 registered grammar rules");

let checked=0;
for (const cpId of CPS) {
  for (const difficulty of LEVELS) {
    for (let index=0;index<12;index++) {
      const request={
        engineId:"language-v1" as const,
        packageId:PACKAGE_ID,
        canonicalProblemId:cpId,
        patternId:cpId,
        difficulty,
        language:"en" as const,
        runtimeMode:"review-only" as const,
        count:1,
        seed:`eng003-chapter-reconstruction-v1:${cpId}:${difficulty}:${index}`
      };
      const result=await generateQuestionStudioQuestions(request);
      assert.equal(result.questions.length,1,`${cpId}/${difficulty}/${index} returned wrong question count`);
      const q=result.questions[0]!;
      const stem=text(q.stem),sentence=text(q.sentence),explanation=text(q.explanation);
      const correctedSentence=text(q.correctedSentence),options=Array.isArray(q.options)?q.options.map(x=>String(x).trim()):[];
      const correctIndex=Number(q.correctIndex??q.correct);
      assert.equal(text(q.cpId),cpId);
      assert.equal(text(q.packageId),PACKAGE_ID);
      assert.match(stem,/fill in the blank/i);
      assert.equal((sentence.match(/_____/g)??[]).length,1,`${cpId} must present exactly one blank`);
      assert.equal(options.length,4);
      assert.equal(new Set(options.map(x=>x.toLowerCase())).size,4);
      assert.ok(Number.isInteger(correctIndex)&&correctIndex>=0&&correctIndex<4);
      assert.ok(!options.some(x=>/no improvement/i.test(x)),`${cpId} leaked Sentence Improvement mode`);
      const answer=options[correctIndex]!;
      const reconstructed=cpId==="ENG-003-CP003"
        ? materializeEng003Cp003AnswerV1(sentence,answer)
        : materializers[cpId]
          ? materializers[cpId]!(q.segments as string[], Number(q.blankIndex),answer)
          : normalize(sentence.replace("_____",answer));
      assert.equal(reconstructed,normalize(correctedSentence),
        `${cpId}/${difficulty}/${index} correct filler does not reconstruct approved sentence`);
      assert.ok(explanation.includes(answer),`${cpId} explanation omits selected filler`);
      assert.ok(explanation.includes(correctedSentence),`${cpId} explanation omits full corrected sentence`);
      assert.equal(q.reviewOnly,true);
      assert.equal(q.productionReleased,false);
      if(index===0){
        const replay=await generateQuestionStudioQuestions(request);
        assert.deepEqual(result,replay,`${cpId}/${difficulty} deterministic replay failed`);
      }
      checked++;
    }
  }
}
assert.equal(checked,468);
console.log("ENG-003 chapter-wide reconstruction audit passed.",{cps:CPS.length,registeredRules:ruleIds.length,samples:checked});
