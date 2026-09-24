import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { generatePolCp023ReviewBatchV1 } from "../statutory-executive-bodies/pol-cp023-review-candidate-v1";
import { generatePolCp024ReviewBatchV1 } from "../official-language-scheduled-tribal-areas/pol-cp024-review-candidate-v1";
import { generatePolCp025ReviewBatchV1 } from "../union-territories-special-state-provisions/pol-cp025-review-candidate-v1";
import { generatePolCp023LocalizedReviewV1 } from "./pol-cp023-localization-v1";
import { generatePolCp024LocalizedReviewV1 } from "./pol-cp024-localization-v1";
import { generatePolCp025LocalizedReviewV1 } from "./pol-cp025-localization-v1";
import type { PolLocalizedQuestionV1 } from "./pol-localization-types-v1";

const locales=["en","hi","pa"] as const;
const cps=[
 ["POL-CP-023",generatePolCp023ReviewBatchV1(),generatePolCp023LocalizedReviewV1],
 ["POL-CP-024",generatePolCp024ReviewBatchV1(),generatePolCp024LocalizedReviewV1],
 ["POL-CP-025",generatePolCp025ReviewBatchV1(),generatePolCp025LocalizedReviewV1],
] as const;

const learner=(q:PolLocalizedQuestionV1)=>[q.stem,...q.options,q.explanation].join("\n");
const questionSurface=(q:{stem:string;options:readonly string[]})=>[q.stem,...q.options].join("\n");
const legalTokens=(s:string)=>s.match(/\d+(?:\.\d+)?[A-Z]{0,2}(?:-[A-Z])?(?:\([0-9A-Za-z]+\))*%?/gu)??[];

const PA_BANNED=[
 "ਸੰਸ਼ੋਧਨ","ਪ੍ਰਸੰਨਤਾ","ਕਿਸਦੀ ਪ੍ਰਸੰਨਤਾ","ਸੰਬੰਧਿਤ","ਅਪ੍ਰਸੰਗਿਕ",
 "ਬਾਧਕ","ਉਪਚਾਰ","ਗਤੀਰੋਧ","ਯੋਗਤਾ-ਸ਼ਰਤ","ਕਿਹੜੇ ਅਨੁਛੇਦ ਹੇਠ",
 "ਕਿਹੜੇ ਕਿਸਮ","ਹੇਠ ਹੇਠ"
] as const;

function native(locale:"hi"|"pa",q:PolLocalizedQuestionV1){
 const original=learner(q);
 let stripped=original
   .replace(/\b\d+(?:\.\d+)?[A-Z]{1,2}(?:-[A-Z])?(?:\([0-9A-Za-z]+\))*\b/gu,"")
   .replace(/\b[IVX]+A?\b/gu,"")
;
 assert.equal(/[A-Za-z]{2,}/u.test(stripped),false,`${q.questionId}: Latin-script leakage`);
 assert.match(original,locale==="hi"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u,`${q.questionId}: native script missing`);
 if(locale==="pa")for(const phrase of PA_BANNED)assert.equal(original.includes(phrase),false,`${q.questionId}: Punjabi editorial defect: ${phrase}`);
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
   assert.equal(q.canonicalAnswer,q.options[q.correctIndex],`${q.questionId}: canonical answer/index mismatch`);
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
    for(const token of expected)assert.equal(got.has(token),true,`${q.questionId}: legal/numeric token lost: ${token}`);
   }
  });
 }
}

assert.equal(generatePolCp023ReviewBatchV1().length,80);
assert.equal(generatePolCp024ReviewBatchV1().length,80);
assert.equal(generatePolCp025ReviewBatchV1().length,80);
assert.equal(total,240);

for(const locale of ["hi","pa"] as const){
 const cp23=generatePolCp023LocalizedReviewV1(locale);
 assert.match(learner(cp23[0]!),/2015/);
 assert.match(learner(cp23[8]!),/1993/);
 assert.match(learner(cp23[12]!),locale==="hi"?/मुख्य न्यायाधीश/:/ਮੁੱਖ ਨਿਆਂਧੀਸ਼/);
 assert.match(learner(cp23[30]!),/65/);
 assert.match(learner(cp23[53]!),locale==="hi"?/(?:8|आठ)/:/(?:8|ਅੱਠ)/);
 assert.match(learner(cp23[54]!),locale==="hi"?/(?:50|पचास)/:/(?:50|ਪੰਜਾਹ)/);
 assert.match(learner(cp23[61]!),locale==="hi"?/(?:25|पच्चीस)/:/(?:25|ਪੱਚੀ)/);
 assert.match(learner(cp23[62]!),/45/);
 assert.match(learner(cp23[63]!),/70/);
 assert.match(learner(cp23[68]!),/1963/);
 assert.match(learner(cp23[69]!),/1946/);
 assert.match(learner(cp23[72]!),/5/);
 assert.match(learner(cp23[73]!),/6/);

 const cp24=generatePolCp024LocalizedReviewV1(locale);
 assert.match(learner(cp24[0]!),/343/);
 assert.match(cp24[0]!.explanation,locale==="hi"?/देवनागरी/:/ਦੇਵਨਾਗਰੀ/);
 assert.match(learner(cp24[8]!),/344/);
 assert.match(learner(cp24[12]!),locale==="hi"?/(?:30|तीस)/:/(?:30|ਤੀਹ)/);
 assert.match(learner(cp24[13]!),locale==="hi"?/(?:20|बीस)/:/(?:20|ਵੀਹ)/);
 assert.match(learner(cp24[14]!),locale==="hi"?/(?:10|दस)/:/(?:10|ਦਸ)/);
 assert.match(learner(cp24[48]!),locale==="hi"?/(?:22|बाईस)/:/(?:22|ਬਾਈ)/);
 assert.match(learner(cp24[49]!),/344\(1\)/);
 assert.match(learner(cp24[56]!),/244\(1\)/);
 assert.match(learner(cp24[57]!),/244\(2\)/);
 assert.match(learner(cp24[61]!),locale==="hi"?/(?:20|बीस)/:/(?:20|ਵੀਹ)/);
 assert.match(learner(cp24[62]!),locale==="hi"?/तीन-चौथाई/:/ਤਿੰਨ-ਚੌਥਾਈ/);
 assert.match(learner(cp24[72]!),locale==="hi"?/(?:30|तीस)/:/(?:30|ਤੀਹ)/);
 assert.match(cp24[73]!.explanation,locale==="hi"?/चार/:/ਚਾਰ/);

 const cp25=generatePolCp025LocalizedReviewV1(locale);
 const completions=cp25.filter(q=>q.stem.endsWith(":")).length;
 const questions=cp25.filter(q=>q.stem.endsWith("?")).length;
 assert.equal(completions,43,`CP025/${locale}: completion-stem contract`);
 assert.equal(questions,37,`CP025/${locale}: question-stem contract`);
 assert.match(learner(cp25[0]!),/239/);
 assert.match(learner(cp25[8]!),/239AA/);
 assert.match(learner(cp25[9]!),/69/);
 assert.match(learner(cp25[14]!),/324/);
 assert.match(learner(cp25[14]!),/329/);
 assert.match(learner(cp25[19]!),/10/);
 assert.match(learner(cp25[20]!),/239AB/);
 assert.match(learner(cp25[21]!),/239B/);
 assert.match(learner(cp25[22]!),/240/);
 assert.match(learner(cp25[23]!),/241/);
 assert.match(learner(cp25[52]!),/371A/);
 assert.match(learner(cp25[60]!),/371D/);
 assert.match(learner(cp25[64]!),/371F/);
 assert.match(learner(cp25[66]!),/371G/);
 assert.match(learner(cp25[68]!),/371H/);
 assert.match(learner(cp25[71]!),/371J/);
 assert.match(learner(cp25[77]!),/371A/);
 assert.match(learner(cp25[77]!),/371G/);
}

const evidence={
 chapterId:"POL-001",
 cps:["POL-CP-023","POL-CP-024","POL-CP-025"],
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
 cp023StatutoryExecutiveBodyGuard:true,
 cp024OfficialLanguageAndTribalAdministrationGuard:true,
 cp025V3StemModeAndSpecialProvisionsGuard:true,
 reviewOnly:true,
 runtimeRegistered:false
};
const dir=path.resolve("dist/polity-review/POL-MULTILINGUAL-V1");
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,"POL-CP023-CP025-MULTILINGUAL-PROOF.json"),JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
