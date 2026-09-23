import assert from "node:assert/strict";
import { SCI_CP019_REVIEW_V1 } from "../cell-biology/sci-cp019-review-v1";
import { SCI_BIOLOGY_CP019_HI_V1, SCI_BIOLOGY_CP019_PA_V1, validateSciBiologyCp019LocalizationV1 } from "./sci-biology-localization-generator-v1";

const structural=validateSciBiologyCp019LocalizationV1();
assert.equal(structural.valid,true,structural.errors.join("\n"));

const audits = [
  ["hi",SCI_BIOLOGY_CP019_HI_V1,/[ऀ-ॿ]/],
  ["pa",SCI_BIOLOGY_CP019_PA_V1,/[਀-੿]/]
] as const;

const report:any={cpId:"SCI-CP-019",english:SCI_CP019_REVIEW_V1.length,locales:{}};

for(const [locale,rows,script] of audits){
  assert.equal(rows.length,60);
  const stems=new Set<string>();
  let scriptFailures=0, englishStemCopies=0, englishExplanationCopies=0;
  rows.forEach((q,index)=>{
    const en=SCI_CP019_REVIEW_V1[index];
    assert.equal(q.localizationV1.englishQuestionId,en.questionId);
    assert.equal(q.cpId,en.cpId);
    assert.equal(q.qlId,en.qlId);
    assert.equal(q.difficulty,en.difficulty);
    assert.equal(q.correctIndex,en.correctIndex);
    assert.deepEqual(q.sourceIds,en.sourceIds);
    assert.deepEqual(q.sourceFactIds,en.sourceFactIds);
    assert.equal(q.options[q.correctIndex],q.canonicalAnswer);
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options).size,4);
    assert.equal(q.reviewOnly,true);
    assert.equal(q.runtimeRegistered,false);
    if(!script.test(q.stem)||!script.test(q.explanation)) scriptFailures++;
    if(q.stem===en.stem) englishStemCopies++;
    if(q.explanation===en.explanation) englishExplanationCopies++;
    assert.ok(!stems.has(q.stem),`${locale}: duplicate stem ${q.questionId}`);
    stems.add(q.stem);
  });
  assert.equal(scriptFailures,0,`${locale}: native-script failure`);
  assert.equal(englishStemCopies,0,`${locale}: untranslated English stems`);
  assert.equal(englishExplanationCopies,0,`${locale}: untranslated English explanations`);
  report.locales[locale]={questions:rows.length,uniqueStems:stems.size,scriptFailures,englishStemCopies,englishExplanationCopies};
}

console.log(JSON.stringify(report,null,2));
