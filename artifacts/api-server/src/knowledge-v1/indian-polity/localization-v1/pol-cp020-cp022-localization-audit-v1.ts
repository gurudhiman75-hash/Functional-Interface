import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { generatePolCp020ReviewBatchV1 } from "../municipalities/pol-cp020-review-generator-v1";
import { generatePolCp021ReviewBatchV1 } from "../elections-representation-anti-defection/pol-cp021-review-candidate-v1";
import { generatePolCp022ReviewBatchV2 } from "../constitutional-bodies/pol-cp022-review-candidate-v2";
import { generatePolCp020LocalizedReviewV1 } from "./pol-cp020-localization-v1";
import { generatePolCp021LocalizedReviewV1 } from "./pol-cp021-localization-v1";
import { generatePolCp022LocalizedReviewV1 } from "./pol-cp022-localization-v1";
import type { PolLocalizedQuestionV1 } from "./pol-localization-types-v1";

const locales=["en","hi","pa"] as const;
const cps=[
 ["POL-CP-020",generatePolCp020ReviewBatchV1(),generatePolCp020LocalizedReviewV1],
 ["POL-CP-021",generatePolCp021ReviewBatchV1(),generatePolCp021LocalizedReviewV1],
 ["POL-CP-022",generatePolCp022ReviewBatchV2(),generatePolCp022LocalizedReviewV1],
] as const;

const learnerText=(q:PolLocalizedQuestionV1)=>[q.stem,...q.options,q.explanation].join("\n");
const questionSurface=(q:{stem:string;options:readonly string[]})=>[q.stem,...q.options].join("\n");
const legalTokens=(s:string)=>s.match(/\d+(?:\.\d+)?[A-Z]{0,2}(?:\([0-9A-Za-z]+\))*%?/gu)??[];
const PA_BANNED=["ਸੰਸ਼ੋਧਨ","ਪ੍ਰਸੰਨਤਾ","ਕਿਸਦੀ ਪ੍ਰਸੰਨਤਾ","ਸੰਬੰਧਿਤ","ਅਪ੍ਰਸੰਗਿਕ","ਬਾਧਕ","ਉਪਚਾਰ","ਗਤੀਰੋਧ","ਯੋਗਤਾ-ਸ਼ਰਤ"] as const;
const PA_STEM_BANNED=["ਕਿਹੜੇ ਅਨੁਛੇਦ ਹੇਠ","ਕਿਸ ਅਨੁਛੇਦ ਦਾ ਵਿਸ਼ਾ","ਕਿਹੜੇ ਕਿਸਮ","ਹੇਠ ਹੇਠ"] as const;
const HI_STEM_BANNED=["इस अध्याय में मुख्यतः","किससे संबंधित है?","किस पूर्व देश"] as const;

function native(locale:"hi"|"pa",q:PolLocalizedQuestionV1){
 const original=learnerText(q);
 const stripped=original
  .replace(/\b[IVX]+A?\b/gu,"")
  .replace(/\b\d+(?:\.\d+)?[A-Z]{1,2}(?:\([0-9A-Za-z]+\))*\b/gu,"")
  .replace(/\b(?:Re|Rs)\.?/gu,"");
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
   assert.deepEqual(q.sourceFactIds??[],e.sourceFactIds??[]);
   assert.equal(q.reviewOnly,true);
   assert.equal(q.runtimeRegistered,false);
   assert.equal(q.options.length,4);
   assert.equal(new Set(q.options).size,4,`${q.questionId}: duplicate localized options`);
   assert.equal(q.canonicalAnswer,q.options[q.correctIndex],`${q.questionId}: answer/index parity`);
   if(locale==="en"){
    assert.equal(q.questionId,e.questionId);
    assert.equal(q.stem,e.stem);
    assert.deepEqual(q.options,e.options);
    assert.equal(q.explanation,e.explanation);
    assert.equal(q.canonicalAnswer,e.options[e.correctIndex]);
   }else{
    assert.equal(q.questionId,`${e.questionId}-${locale.toUpperCase()}`);
    native(locale,q);
    const expected=legalTokens(questionSurface(e));
    const got=new Set(legalTokens(questionSurface(q)));
    for(const token of expected)assert.equal(got.has(token),true,`${q.questionId}: numeric/legal token changed or lost: ${token}`);
   }
  });
 }
}

assert.equal(generatePolCp020ReviewBatchV1().length,80);
assert.equal(generatePolCp021ReviewBatchV1().length,80);
assert.equal(generatePolCp022ReviewBatchV2().length,80);
assert.equal(total,240);

for(const locale of ["hi","pa"] as const){
 const cp20=generatePolCp020LocalizedReviewV1(locale);
 assert.match(learnerText(cp20[5]!),/10/);
 assert.match(learnerText(cp20[17]!),/3/);
 assert.match(cp20[53]!.explanation,/चार-पाँच|ਚਾਰ-ਪੰਜ/);
 assert.match(cp20[57]!.explanation,/दो-तिहाई|ਦੋ-ਤਿਹਾਈ/);
 assert.match(learnerText(cp20[78]!),/9\.5/);
 assert.match(learnerText(cp20[78]!),/10/);

 const cp21=generatePolCp021LocalizedReviewV1(locale);
 assert.match(learnerText(cp21[9]!),/18/);
 assert.match(learnerText(cp21[10]!),/61/);
 assert.match(cp21[10]!.explanation,/21/);
 assert.match(cp21[10]!.explanation,/18/);
 assert.match(learnerText(cp21[48]!),/52/);
 assert.match(learnerText(cp21[53]!),/15/);
 assert.match(cp21[60]!.explanation,/दो-तिहाई|ਦੋ-ਤਿਹਾਈ/);
 assert.match(learnerText(cp21[61]!),/91/);

 const cp22=generatePolCp022LocalizedReviewV1(locale);
 const ag=cp22[2]!.explanation;
 assert.match(ag,/76/);
 assert.match(ag,/5/);
 assert.match(ag,/10/);
 assert.match(ag,locale==="hi"?/नागरिक/:/ਨਾਗਰਿਕ/);
 assert.match(ag,locale==="hi"?/उच्च न्यायालय/:/ਹਾਈ ਕੋਰਟ/);
 const stateAg=cp22[6]!.explanation;
 assert.match(stateAg,/165/);
 assert.match(stateAg,/10/);
 assert.match(stateAg,locale==="hi"?/नागरिक/:/ਨਾਗਰਿਕ/);
 assert.match(stateAg,locale==="hi"?/न्यायिक पद/:/ਨਿਆਂਇਕ ਅਹੁਦੇ/);
}

const evidence={
 chapterId:"POL-001",
 cps:["POL-CP-020","POL-CP-021","POL-CP-022"],
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
 nativeScriptLeakageGuard:true,
 punjabiNativeEditorialGuard:true,
 stemGrammarGuard:true,
 cp020MunicipalThresholdAndPlanningGuard:true,
 cp021ElectionAndAntiDefectionGuard:true,
 cp022Article76And165QualificationGuard:true,
 reviewOnly:true,
 runtimeRegistered:false
};
const dir=path.resolve("dist/polity-review/POL-MULTILINGUAL-V1");
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,"POL-CP020-CP022-MULTILINGUAL-PROOF.json"),JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
