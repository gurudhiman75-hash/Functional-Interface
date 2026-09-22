import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { generatePolCp011ReviewBatchV2 } from "../parliament-procedure-finance/pol-cp011-review-generator-v2";
import { generatePolCp012ReviewBatchV3 } from "../supreme-court/pol-cp012-review-generator-v3";
import { generatePolCp011LocalizedReviewV1 } from "./pol-cp011-localization-v1";
import { generatePolCp012LocalizedReviewV1 } from "./pol-cp012-localization-v1";
import type { PolLocaleV1, PolLocalizedQuestionV1 } from "./pol-localization-types-v1";

const cps=[
 ["POL-CP-011",generatePolCp011ReviewBatchV2(),generatePolCp011LocalizedReviewV1],
 ["POL-CP-012",generatePolCp012ReviewBatchV3(),generatePolCp012LocalizedReviewV1],
] as const;
const locales:PolLocaleV1[]=["en","hi","pa"];
function learnerText(q:PolLocalizedQuestionV1){return [q.stem,...q.options,q.explanation].join("\n");}
function numericTokens(value:string){
 const withoutListNumbers=value.split("\n").map(line=>line.replace(/^\s*\d+[.)]\s+/,"")).join("\n");
 return [...new Set(withoutListNumbers.match(/\d+[A-Z]?(?:\([a-z0-9]+\))?/g)??[])].sort();
}
const PA_BANNED=["ਸੰਸ਼ੋਧਨ","ਪ੍ਰਸੰਨਤਾ","ਕਿਸਦੀ ਪ੍ਰਸੰਨਤਾ","ਸੰਬੰਧਿਤ","ਅਪ੍ਰਸੰਗਿਕ","ਬਾਧਕ","ਉਪਚਾਰ"] as const;
const PA_STEM_BANNED=["ਕਿਹੜੇ ਅਨੁਛੇਦ ਹੇਠ","ਕਿਸ ਅਨੁਛੇਦ ਦਾ ਵਿਸ਼ਾ","ਇਸ ਅਧਿਆਇ ਵਿੱਚ ਮੁੱਖ ਤੌਰ 'ਤੇ","ਹੇਠ ਹੇਠ"] as const;
const HI_STEM_BANNED=["इस अध्याय में मुख्यतः","किस पूर्व देश"] as const;
function native(locale:"hi"|"pa",q:PolLocalizedQuestionV1){
 const original=learnerText(q);
 const stripped=original
  .replace(/\b(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\b/gu,"")
  .replace(/\b(?:Re|Rs)\.?/gu,"");
 assert.equal(/[A-Za-z]{2,}/u.test(stripped),false,`${q.questionId}: Latin-script leakage`);
 assert.match(original,locale==="hi"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u,`${q.questionId}: native script missing`);
 if(locale==="pa"){
  for(const phrase of PA_BANNED)assert.equal(original.includes(phrase),false,`${q.questionId}: non-native Punjabi remains: ${phrase}`);
  for(const phrase of PA_STEM_BANNED)assert.equal(q.stem.includes(phrase),false,`${q.questionId}: Punjabi stem grammar defect: ${phrase}`);
  assert.equal(/ਦਾ ਵਰਤੋਂ/u.test(original),false,`${q.questionId}: Punjabi agreement error`);
 }else{
  for(const phrase of HI_STEM_BANNED)assert.equal(q.stem.includes(phrase),false,`${q.questionId}: Hindi stem grammar defect: ${phrase}`);
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
   assert.deepEqual(q.sourceFactIds,e.sourceFactIds);
   assert.equal(q.reviewOnly,true);assert.equal(q.runtimeRegistered,false);
   assert.equal(q.options.length,4);
   assert.equal(new Set(q.options).size,4,`${q.questionId}: options unique`);
   assert.equal(q.canonicalAnswer,q.options[q.correctIndex],`${q.questionId}: answer/index parity`);
   if(locale==="en"){
    assert.equal(q.questionId,e.questionId);
    assert.equal(q.stem,e.stem);
    assert.deepEqual(q.options,e.options);
    assert.equal(q.explanation,e.explanation);
   }else{
    assert.equal(q.questionId,`${e.questionId}-${locale.toUpperCase()}`);
    native(locale,q);
    const expected=numericTokens([e.stem,...e.options].join("\n"));
    const got=new Set(numericTokens([q.stem,...q.options].join("\n")));
    for(const token of expected)assert.equal(got.has(token),true,`${q.questionId}: numeric/legal token changed or lost: ${token}`);
   }
  });
 }
}
assert.equal(generatePolCp011ReviewBatchV2().length,88,"CP011 authority must contain 88 questions");
assert.equal(generatePolCp012ReviewBatchV3().length,80,"CP012 authority must contain 80 questions");
assert.equal(total,168,"CP011-CP012 authority must contain 168 questions");

for(const locale of ["hi","pa"] as const){
 const cp12=generatePolCp012LocalizedReviewV1(locale);
 for(const i of [12,13,14,15]){
  const q=cp12[i]!;
  assert.match(q.explanation,/124\(3\)/,`${q.questionId}: qualification overlay must preserve Article 124(3)`);
  assert.match(q.explanation,/5/,`${q.questionId}: five-year qualification missing`);
  assert.match(q.explanation,/10/,`${q.questionId}: ten-year qualification missing`);
 }
}
const evidence={chapterId:"POL-001",cps:["POL-CP-011","POL-CP-012"],localizationVersion:"POL-LOCALIZATION-V1",englishQuestions:total,questionsPerLocale:total,locales,totalReviewSurfaces:total*3,semanticInvariant:true,optionOrderInvariant:true,correctIndexInvariant:true,qlInvariant:true,sourceInvariant:true,numericFormInvariant:true,punjabiNativeEditorialGuard:true,stemGrammarGuard:true,cp012QualificationOverlayGuard:true,reviewOnly:true,runtimeRegistered:false};
const dir=path.resolve("dist/polity-review/POL-MULTILINGUAL-V1");fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,"POL-CP011-CP012-MULTILINGUAL-PROOF.json"),JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
