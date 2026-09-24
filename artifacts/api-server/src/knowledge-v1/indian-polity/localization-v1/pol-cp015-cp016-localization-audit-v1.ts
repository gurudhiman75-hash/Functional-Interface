import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { generatePolCp015ReviewBatchV1 } from "../chief-minister-state-council/pol-cp015-review-generator-v1";
import { generatePolCp016ReviewBatchV2 } from "../state-legislature/pol-cp016-review-generator-v2";
import { generatePolCp015LocalizedReviewV1 } from "./pol-cp015-localization-v1";
import { generatePolCp016LocalizedReviewV1 } from "./pol-cp016-localization-v1";
import type { PolLocalizedQuestionV1 } from "./pol-localization-types-v1";

const locales=["en","hi","pa"] as const;
const cps=[
 ["POL-CP-015",generatePolCp015ReviewBatchV1(),generatePolCp015LocalizedReviewV1],
 ["POL-CP-016",generatePolCp016ReviewBatchV2(),generatePolCp016LocalizedReviewV1],
] as const;
const learnerText=(q:PolLocalizedQuestionV1)=>[q.stem,...q.options,q.explanation].join("\n");
const legalTokens=(s:string)=>s.match(/\d+(?:\([0-9A-Za-z]+\))*%?|\bRe\.?\s*\d+\b/gu)??[];
const PA_BANNED=["ਸੰਸ਼ੋਧਨ","ਪ੍ਰਸੰਨਤਾ","ਕਿਸਦੀ ਪ੍ਰਸੰਨਤਾ","ਸੰਬੰਧਿਤ","ਅਪ੍ਰਸੰਗਿਕ","ਬਾਧਕ","ਉਪਚਾਰ","ਗਤੀਰੋਧ"] as const;
const PA_STEM_BANNED=["ਕਿਹੜੇ ਅਨੁਛੇਦ ਹੇਠ","ਕਿਸ ਅਨੁਛੇਦ ਦਾ ਵਿਸ਼ਾ","ਕਿਹੜੇ ਕਿਸਮ","ਹੇਠ ਹੇਠ"] as const;
const HI_STEM_BANNED=["इस अध्याय में मुख्यतः","किससे संबंधित है?","किस पूर्व देश"] as const;

function native(locale:"hi"|"pa",q:PolLocalizedQuestionV1){
 const original=learnerText(q);
 const stripped=original.replace(/\b(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\b/gu,"").replace(/\b(?:Re|Rs)\.?/gu,"");
 assert.equal(/[A-Za-z]{2,}/u.test(stripped),false,`${q.questionId}: Latin-script leakage`);
 assert.match(original,locale==="hi"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u,`${q.questionId}: native script missing`);
 if(locale==="pa"){
  for(const phrase of PA_BANNED)assert.equal(original.includes(phrase),false,`${q.questionId}: non-native Punjabi remains: ${phrase}`);
  for(const phrase of PA_STEM_BANNED)assert.equal(q.stem.includes(phrase),false,`${q.questionId}: Punjabi stem defect: ${phrase}`);
  assert.equal(/ਦਾ ਵਰਤੋਂ/u.test(original),false,`${q.questionId}: Punjabi agreement error`);
 }else for(const phrase of HI_STEM_BANNED)assert.equal(q.stem.includes(phrase),false,`${q.questionId}: Hindi mechanical stem: ${phrase}`);
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
   assert.equal(q.chapterId,"POL-001");assert.equal(q.cpId,cpId);assert.equal(q.qlId,e.qlId);assert.equal(q.difficulty,e.difficulty);
   assert.equal(q.correctIndex,e.correctIndex);assert.deepEqual(q.sourceIds,e.sourceIds);assert.deepEqual(q.sourceFactIds,e.sourceFactIds);
   assert.equal(q.reviewOnly,true);assert.equal(q.runtimeRegistered,false);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
   assert.equal(q.canonicalAnswer,q.options[q.correctIndex],`${q.questionId}: answer/index parity`);
   if(locale==="en"){assert.equal(q.questionId,e.questionId);assert.equal(q.stem,e.stem);assert.deepEqual(q.options,e.options);assert.equal(q.explanation,e.explanation);}
   else{
    assert.equal(q.questionId,`${e.questionId}-${locale.toUpperCase()}`);native(locale,q);
    const expected=legalTokens([e.stem,...e.options].join("\n"));const got=new Set(legalTokens([q.stem,...q.options].join("\n")));
    for(const token of expected)assert.equal(got.has(token),true,`${q.questionId}: numeric/legal token changed or lost: ${token}`);
   }
  });
 }
}
assert.equal(generatePolCp015ReviewBatchV1().length,80);
assert.equal(generatePolCp016ReviewBatchV2().length,96);
assert.equal(total,176);

for(const locale of ["hi","pa"] as const){
 const cp16=generatePolCp016LocalizedReviewV1(locale);
 for(const i of [18,19]){
  const e=cp16[i]!.explanation;
  assert.match(e,/173/);assert.match(e,/25/);assert.match(e,/30/);
  assert.match(e,locale==="hi"?/नागरिक/:/ਨਾਗਰਿਕ/);
  assert.match(e,locale==="hi"?/शपथ/:/ਸਹੁੰ/);
  assert.match(e,locale==="hi"?/संसद/:/ਸੰਸਦ/);
 }
}

const evidence={chapterId:"POL-001",cps:["POL-CP-015","POL-CP-016"],localizationVersion:"POL-LOCALIZATION-V1",englishQuestions:total,questionsPerLocale:total,locales,totalReviewSurfaces:total*3,semanticInvariant:true,optionOrderInvariant:true,correctIndexInvariant:true,qlInvariant:true,sourceInvariant:true,numericLegalFormInvariant:true,punjabiNativeEditorialGuard:true,stemGrammarGuard:true,cp016Article173QualificationGuard:true,reviewOnly:true,runtimeRegistered:false};
const dir=path.resolve("dist/polity-review/POL-MULTILINGUAL-V1");fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,"POL-CP015-CP016-MULTILINGUAL-PROOF.json"),JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
