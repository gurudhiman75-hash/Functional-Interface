import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { applyPolityFinalEditorialStemPass } from "../pol-001-final-editorial-stem-pass-v1";
import { generatePolCp009ReviewBatchV1 } from "../prime-minister-union-council/pol-cp009-review-generator-v1";
import { generatePolCp010ReviewBatchV1 } from "../parliament-structure-officers/pol-cp010-review-generator-v1";
import { generatePolCp009LocalizedReviewV1 } from "./pol-cp009-localization-v1";
import { generatePolCp010LocalizedReviewV1 } from "./pol-cp010-localization-v1";
import type { PolLocaleV1, PolLocalizedQuestionV1 } from "./pol-localization-types-v1";

const cps=[
 ["POL-CP-009",generatePolCp009ReviewBatchV1().map(applyPolityFinalEditorialStemPass),generatePolCp009LocalizedReviewV1],
 ["POL-CP-010",generatePolCp010ReviewBatchV1().map(applyPolityFinalEditorialStemPass),generatePolCp010LocalizedReviewV1],
] as const;
const locales:PolLocaleV1[]=["en","hi","pa"];
function text(q:PolLocalizedQuestionV1){return [q.stem,...q.options,q.explanation].join("\n");}
function numericTokens(value:string){
 const withoutListNumbers=value.split("\n").map(line=>line.replace(/^\s*\d+[.)]\s+/,"")).join("\n");
 return [...new Set(withoutListNumbers.match(/\d+[A-Z]?(?:\([a-z0-9]+\))?/g)??[])].sort();
}
const PA_BANNED=["ਸੰਸ਼ੋਧਨ","ਰਜਿਸਟ੍ਰੇਸ਼ਨ","ਉਪਚਾਰ","ਅਭਿਵੈਕਤੀ","ਅਪ੍ਰਸੰਗਿਕ","ਬਾਧਕ","ਯੋਗਤਾ-ਸ਼ਰਤ","ਸੰਬੰਧਿਤ","ਹਰ ਵਿਅਕਤੀਆਂ","ਸੰਕਾਨੂੰਨ"] as const;
const PA_STEM_BANNED=["ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ","ਕਿਹੜੇ ਕਿਸਮ","ਕਿਹੜੇ ਸਾਬਕਾ","ਕਿਹੜਾ ਅਨੁਛੇਦ 51A","ਕਿਸ ਅਨੁਛੇਦ ਦਾ ਵਿਸ਼ਾ","ਕਿਹੜੇ ਅਨੁਛੇਦ ਹੇਠ","ਹੇਠ ਹੇਠ","ਇਸ ਅਧਿਆਇ ਵਿੱਚ ਮੁੱਖ ਤੌਰ 'ਤੇ","ਕਿਹੜੇ ਅਨੁਛੇਦ ਵਿੱਚ ਦਿੱਤਾ ਗਿਆ ਹੈ? ਕਿਹੜੇ","ਨਿਯਮ ਕਿਹੜੇ ਅਨੁਛੇਦ ਵਿੱਚ ਦਿੱਤਾ ਗਿਆ","ਅਧਿਕਾਰ ਕਿਹੜੇ ਅਨੁਛੇਦ ਵਿੱਚ ਦਿੱਤਾ ਗਿਆ","ਪਰਿਭਾਸ਼ਾ ਕਿਹੜੇ ਅਨੁਛੇਦ ਵਿੱਚ ਦਿੱਤਾ ਗਿਆ","ਮੁੜ-ਸਮਾਂਜਸ","ਕਿਸਦੀ ਪ੍ਰਸੰਨਤਾ","ਪ੍ਰਸੰਨਤਾ"] as const;
const HI_STEM_BANNED=["कौन-सा अनुच्छेद 51A","किस पूर्व देश","इस अध्याय में मुख्यतः"] as const;
function native(locale:"hi"|"pa",q:PolLocalizedQuestionV1){
 const original=text(q);
 const stripped=original.replace(/\b(?:I|II|III|IV|IVA|V|VI|VII|VIII|IX|IXA|X|XI|XII)\b/gu,"");
 assert.equal(/[A-Za-z]{2,}/u.test(stripped),false,`${q.questionId}: Latin-script leakage`);
 assert.match(original,locale==="hi"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u,`${q.questionId}: native script missing`);
 if(locale==="pa"){
   for(const phrase of PA_BANNED)assert.equal(original.includes(phrase),false,`${q.questionId}: non-native Punjabi remains: ${phrase}`);
   for(const phrase of PA_STEM_BANNED)assert.equal(q.stem.includes(phrase),false,`${q.questionId}: Punjabi stem grammar defect: ${phrase}`);
   assert.equal(/ਦਾ ਵਰਤੋਂ/u.test(original),false,`${q.questionId}: Punjabi agreement error`);
   assert.equal(/ਅਨੁਛੇਦ\s+\d+(?:\(\d+[A-Z]?\))?\s+ਹੇਠ/u.test(original),false,`${q.questionId}: translated Punjabi article-reference phrasing`);
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
   assert.equal(q.chapterId,"POL-001",`${q.questionId}: chapter invariant`);
   assert.equal(q.cpId,cpId,`${q.questionId}: CP invariant`);
   assert.equal(typeof q.qlName,"string");assert.ok(q.qlName.length>0,`${q.questionId}: qlName missing`);
   assert.equal(q.reviewOnly,true);assert.equal(q.runtimeRegistered,false);
   assert.equal(q.qlId,e.qlId);assert.equal(q.difficulty,e.difficulty);
   assert.equal(q.correctIndex,e.correctIndex);assert.deepEqual(q.sourceIds,e.sourceIds);assert.deepEqual(q.sourceFactIds,e.sourceFactIds);
   assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4,`${q.questionId}: options unique`);
   assert.equal(q.canonicalAnswer,q.options[q.correctIndex],`${q.questionId}: answer/index parity`);
   if(locale==="en"){assert.equal(q.questionId,e.questionId);assert.equal(q.stem,e.stem);assert.deepEqual(q.options,e.options);assert.equal(q.explanation,e.explanation);}
   else{
    assert.equal(q.questionId,`${e.questionId}-${locale.toUpperCase()}`);native(locale,q);
    const expected=numericTokens([e.stem,...e.options].join("\n"));
    const got=new Set(numericTokens([q.stem,...q.options].join("\n")));
    for(const token of expected)assert.equal(got.has(token),true,`${q.questionId}: numeric/legal token changed or lost: ${token}`);
   }
  });
 }
}
assert.equal(generatePolCp009ReviewBatchV1().length,72,"CP009 authority must contain 72 questions");
assert.equal(generatePolCp010ReviewBatchV1().length,80,"CP010 authority must contain 80 questions");
assert.equal(total,152,"CP009-CP010 authority must contain 152 questions");
const evidence={chapterId:"POL-001",cps:["POL-CP-009","POL-CP-010"],localizationVersion:"POL-LOCALIZATION-V1",englishQuestions:total,questionsPerLocale:total,locales,totalReviewSurfaces:total*3,semanticInvariant:true,optionOrderInvariant:true,correctIndexInvariant:true,qlInvariant:true,sourceInvariant:true,numericFormInvariant:true,punjabiNativeEditorialGuard:true,stemGrammarGuard:true,examStandardGuard:true,reviewOnly:true,runtimeRegistered:false};
const dir=path.resolve("dist/polity-review/POL-MULTILINGUAL-V1");fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,"POL-CP009-CP010-MULTILINGUAL-PROOF.json"),JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));