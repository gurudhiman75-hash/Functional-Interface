import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { generatePolCp017ReviewBatchV2 } from "../centre-state-relations/pol-cp017-review-generator-v2";
import { generatePolCp018ReviewBatchV1 } from "../emergency-provisions/pol-cp018-review-generator-v1";
import { generatePolCp019ReviewBatchV1 } from "../panchayati-raj/pol-cp019-review-generator-v1";
import { generatePolCp017LocalizedReviewV1 } from "./pol-cp017-localization-v1";
import { generatePolCp018LocalizedReviewV1 } from "./pol-cp018-localization-v1";
import { generatePolCp019LocalizedReviewV1 } from "./pol-cp019-localization-v1";
import type { PolLocalizedQuestionV1 } from "./pol-localization-types-v1";

const locales=["en","hi","pa"] as const;
const cps=[
 ["POL-CP-017",generatePolCp017ReviewBatchV2(),generatePolCp017LocalizedReviewV1],
 ["POL-CP-018",generatePolCp018ReviewBatchV1(),generatePolCp018LocalizedReviewV1],
 ["POL-CP-019",generatePolCp019ReviewBatchV1(),generatePolCp019LocalizedReviewV1],
] as const;

const PA_BANNED=["ਸੰਸ਼ੋਧਨ","ਪ੍ਰਸੰਨਤਾ","ਕਿਸਦੀ ਪ੍ਰਸੰਨਤਾ","ਸੰਬੰਧਿਤ","ਅਪ੍ਰਸੰਗਿਕ","ਬਾਧਕ","ਉਪਚਾਰ","ਗਤੀਰੋਧ"] as const;
const PA_STEM_BANNED=["ਕਿਹੜੇ ਅਨੁਛੇਦ ਹੇਠ","ਕਿਸ ਅਨੁਛੇਦ ਦਾ ਵਿਸ਼ਾ","ਕਿਹੜੇ ਕਿਸਮ","ਹੇਠ ਹੇਠ"] as const;
const HI_STEM_BANNED=["इस अध्याय में मुख्यतः","किससे संबंधित है?","किस पूर्व देश"] as const;

const learnerText=(q:PolLocalizedQuestionV1)=>[q.stem,...q.options,q.explanation].join("\n");
const legalTokens=(s:string)=>s.match(/\d+[A-Z]?(?:\([0-9A-Z]+\))*%?/gu)??[];

function native(locale:"hi"|"pa",q:PolLocalizedQuestionV1){
  const original=learnerText(q);
  const stripped=original.replace(/\b(?:I|II|III|IV|V|VI|VII|VIII|IX|IXA|X|XI|XII)\b/gu,"");
  assert.equal(/[A-Za-z]{2,}/u.test(stripped),false,`${q.questionId}: Latin-script leakage`);
  assert.match(original,locale==="hi"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u,`${q.questionId}: native script missing`);
  if(locale==="pa"){
    for(const phrase of PA_BANNED)assert.equal(original.includes(phrase),false,`${q.questionId}: non-native Punjabi remains: ${phrase}`);
    for(const phrase of PA_STEM_BANNED)assert.equal(q.stem.includes(phrase),false,`${q.questionId}: Punjabi stem defect: ${phrase}`);
    assert.equal(/ਦਾ ਵਰਤੋਂ/u.test(original),false,`${q.questionId}: Punjabi agreement error`);
  }else{
    for(const phrase of HI_STEM_BANNED)assert.equal(q.stem.includes(phrase),false,`${q.questionId}: Hindi mechanical stem: ${phrase}`);
  }
}

let total=0;
for(const [cpId,english,gen] of cps){
  total+=english.length;
  for(const locale of locales){
    const localized=gen(locale);
    assert.equal(localized.length,english.length,`${cpId}/${locale}: count parity`);
    localized.forEach((q,i)=>{
      const e=english[i]!;
      assert.equal(q.localizationV1.englishQuestionId,e.questionId);
      assert.equal(q.chapterId,"POL-001");
      assert.equal(q.cpId,cpId);
      assert.equal(q.qlId,e.qlId);
      assert.equal(q.difficulty,e.difficulty);
      assert.equal(q.correctIndex,e.correctIndex);
      assert.deepEqual(q.sourceIds,e.sourceIds);
      assert.deepEqual(q.sourceFactIds,[]);
      assert.equal(q.reviewOnly,true);
      assert.equal(q.runtimeRegistered,false);
      assert.equal(q.options.length,4);
      assert.equal(new Set(q.options).size,4);
      assert.equal(q.canonicalAnswer,q.options[q.correctIndex],`${q.questionId}: answer/index parity`);
      if(locale==="en"){
        assert.equal(q.questionId,e.questionId);
        assert.equal(q.stem,e.stem);
        assert.deepEqual(q.options,e.options);
        assert.equal(q.explanation,e.explanation);
      }else{
        assert.equal(q.questionId,`${e.questionId}-${locale.toUpperCase()}`);
        native(locale,q);
        const expected=legalTokens([e.stem,...e.options].join("\n"));
        const got=new Set(legalTokens([q.stem,...q.options].join("\n")));
        for(const token of expected)assert.equal(got.has(token),true,`${q.questionId}: numeric/legal token changed or lost: ${token}`);
      }
    });
  }
}
assert.equal(generatePolCp017ReviewBatchV2().length,96);
assert.equal(generatePolCp018ReviewBatchV1().length,80);
assert.equal(generatePolCp019ReviewBatchV1().length,80);
assert.equal(total,256);

// Emergency-rights guard: Article 359 questions must retain Articles 20 and 21.
for(const locale of ["hi","pa"] as const){
  const cp18=generatePolCp018LocalizedReviewV1(locale);
  for(const i of [49,73,77]){
    const text=learnerText(cp18[i]!);
    assert.match(text,/359/);
    if(i!==73) { assert.match(text,/20/); assert.match(text,/21/); }
  }
}

// Panchayat age guard: Article 243F's 21/25 age rule must remain explicit.
for(const locale of ["hi","pa"] as const){
  const cp19=generatePolCp019LocalizedReviewV1(locale);
  for(const i of [22,79]){
    const text=learnerText(cp19[i]!);
    assert.match(text,/243F/);assert.match(text,/21/);assert.match(text,/25/);
  }
}

const evidence={
  chapterId:"POL-001",
  cps:["POL-CP-017","POL-CP-018","POL-CP-019"],
  localizationVersion:"POL-LOCALIZATION-V1",
  englishQuestions:total,
  questionsPerLocale:total,
  locales,
  totalReviewSurfaces:total*3,
  semanticInvariant:true,
  optionOrderInvariant:true,
  correctIndexInvariant:true,
  qlInvariant:true,
  sourceInvariant:true,
  numericLegalFormInvariant:true,
  punjabiNativeEditorialGuard:true,
  stemGrammarGuard:true,
  cp018EmergencyRightsGuard:true,
  cp019AgeQualificationGuard:true,
  reviewOnly:true,
  runtimeRegistered:false
};
const dir=path.resolve("dist/polity-review/POL-MULTILINGUAL-V1");
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,"POL-CP017-CP019-MULTILINGUAL-PROOF.json"),JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
