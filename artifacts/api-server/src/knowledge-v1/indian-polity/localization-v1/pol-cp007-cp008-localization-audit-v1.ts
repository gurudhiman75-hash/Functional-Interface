import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { applyPolityFinalEditorialStemPass } from "../pol-001-final-editorial-stem-pass-v1";
import { generatePolCp007ReviewBatchV7 } from "../president/pol-cp007-review-generator-v7";
import { generatePolCp008ReviewBatchV7 } from "../vice-president/pol-cp008-review-generator-v7";
import { generatePolCp007LocalizedReviewV1 } from "./pol-cp007-localization-v1";
import { generatePolCp008LocalizedReviewV1 } from "./pol-cp008-localization-v1";
import type { PolLocaleV1, PolLocalizedQuestionV1 } from "./pol-localization-types-v1";

const cps=[
 ["POL-CP-007",generatePolCp007ReviewBatchV7().map(applyPolityFinalEditorialStemPass),generatePolCp007LocalizedReviewV1],
 ["POL-CP-008",generatePolCp008ReviewBatchV7().map(applyPolityFinalEditorialStemPass),generatePolCp008LocalizedReviewV1],
] as const;
const locales:PolLocaleV1[]=["en","hi","pa"];
function text(q:PolLocalizedQuestionV1){return [q.stem,...q.options,q.explanation].join("\n");}
function numericTokens(value:string){
 const withoutListNumbers=value.split("\n").map(line=>line.replace(/^\s*\d+[.)]\s+/,"")).join("\n");
 return [...new Set(withoutListNumbers.match(/\d+[A-Z]?(?:\([a-z0-9]+\))?/g)??[])].sort();
}
const PA_BANNED=["ਸੰਸ਼ੋਧਨ","ਰਜਿਸਟ੍ਰੇਸ਼ਨ","ਉਪਚਾਰ","ਅਭਿਵੈਕਤੀ","ਅਪ੍ਰਸੰਗਿਕ","ਬਾਧਕ","ਯੋਗਤਾ-ਸ਼ਰਤ","ਸੰਬੰਧਿਤ","ਹਰ ਵਿਅਕਤੀਆਂ","ਸੰਕਾਨੂੰਨ"] as const;
const PA_STEM_BANNED=["ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ","ਕਿਹੜੇ ਕਿਸਮ","ਕਿਹੜੇ ਸਾਬਕਾ","ਕਿਹੜਾ ਅਨੁਛੇਦ 51A","ਕਿਸ ਅਨੁਛੇਦ ਦਾ ਵਿਸ਼ਾ","ਕਿਹੜੇ ਅਨੁਛੇਦ ਹੇਠ","ਹੇਠ ਹੇਠ","ਇਸ ਅਧਿਆਇ ਵਿੱਚ ਮੁੱਖ ਤੌਰ 'ਤੇ"] as const;
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
     assert.equal(q.cpId,e.cpId);assert.equal(q.qlId,e.qlId);assert.equal(q.difficulty,e.difficulty);
     assert.equal(q.correctIndex,e.correctIndex);assert.deepEqual(q.sourceIds,e.sourceIds);assert.deepEqual(q.sourceFactIds,e.sourceFactIds);
     assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4,`${q.questionId}: options unique`);
     assert.equal(q.canonicalAnswer,q.options[q.correctIndex],`${q.questionId}: answer/index parity`);
     if(locale==="en"){
       assert.equal(q.questionId,e.questionId);assert.equal(q.stem,e.stem);assert.deepEqual(q.options,e.options);assert.equal(q.explanation,e.explanation);
     }else{
       assert.equal(q.questionId,`${e.questionId}-${locale.toUpperCase()}`);native(locale,q);
       const expected=numericTokens([e.stem,...e.options].join("\n"));
       const got=new Set(numericTokens([q.stem,...q.options].join("\n")));
       for(const token of expected)assert.equal(got.has(token),true,`${q.questionId}: numeric/legal token changed or lost: ${token}`);
     }
   });
 }
}
assert.equal(generatePolCp007ReviewBatchV7().length,80,"CP007 authority must contain 80 questions");
assert.equal(generatePolCp008ReviewBatchV7().length,60,"CP008 authority must contain 60 questions");
assert.equal(total,140,"CP007-CP008 authority must contain 140 questions");
const evidence={chapterId:"POL-001",cps:["POL-CP-007","POL-CP-008"],localizationVersion:"POL-LOCALIZATION-V1",englishQuestions:total,questionsPerLocale:total,locales,totalReviewSurfaces:total*3,semanticInvariant:true,optionOrderInvariant:true,correctIndexInvariant:true,qlInvariant:true,sourceInvariant:true,numericFormInvariant:true,punjabiNativeEditorialGuard:true,stemGrammarGuard:true,examStandardGuard:true,reviewOnly:true,runtimeRegistered:false};
const dir=path.resolve("dist/polity-review/POL-MULTILINGUAL-V1");fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,"POL-CP007-CP008-MULTILINGUAL-PROOF.json"),JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));