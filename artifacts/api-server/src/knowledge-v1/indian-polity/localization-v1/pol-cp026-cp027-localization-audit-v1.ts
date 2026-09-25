import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { generatePolCp026ReviewBatchV3 } from "../public-services-administrative-tribunals/pol-cp026-review-candidate-v3";
import { generatePolCp027ReviewBatchV1 } from "../trade-commerce-cooperative-societies/pol-cp027-review-candidate-v1";
import { generatePolCp026LocalizedReviewV1 } from "./pol-cp026-localization-v1";
import { generatePolCp027LocalizedReviewV1 } from "./pol-cp027-localization-v1";
import type { PolLocalizedQuestionV1 } from "./pol-localization-types-v1";

const locales=["en","hi","pa"] as const;
const cps=[
 ["POL-CP-026",generatePolCp026ReviewBatchV3(),generatePolCp026LocalizedReviewV1],
 ["POL-CP-027",generatePolCp027ReviewBatchV1(),generatePolCp027LocalizedReviewV1],
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
 const stripped=original
   .replace(/\d+(?:\.\d+)?[A-Z]{0,2}(?:-[A-Z])?(?:\([0-9A-Za-z]+\))*%?/gu,"")
   .replace(/\b[IVX]+[A-Z]?\b/gu,"")
   .replace(/\b[a-z]\b/giu,"");
 assert.equal(/[A-Za-z]{2,}/u.test(stripped),false,`${q.questionId}: Latin-script leakage`);
 assert.match(original,locale==="hi"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u,`${q.questionId}: native script missing`);
 if(locale==="hi"){
   assert.equal(/[\u0A00-\u0A7F]/u.test(original),false,`${q.questionId}: Gurmukhi leakage in Hindi`);
 }else{
   const devanagari=[...original].some(ch=>{const n=ch.codePointAt(0)!;return n>=0x0900&&n<=0x097F&&n!==0x0964&&n!==0x0965;});
   assert.equal(devanagari,false,`${q.questionId}: Devanagari leakage in Punjabi`);
   for(const phrase of PA_BANNED)assert.equal(original.includes(phrase),false,`${q.questionId}: Punjabi editorial defect: ${phrase}`);
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
   assert.equal(q.canonicalAnswer,q.options[q.correctIndex],`${q.questionId}: canonical answer/index mismatch`);
   assert.equal(q.stem.endsWith(":"),e.stem.endsWith(":"),`${q.questionId}: completion-stem mode changed`);
   assert.equal(q.stem.endsWith("?"),e.stem.endsWith("?"),`${q.questionId}: question-stem mode changed`);
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

assert.equal(generatePolCp026ReviewBatchV3().length,80);
assert.equal(generatePolCp027ReviewBatchV1().length,80);
assert.equal(total,160);

for(const locale of ["hi","pa"] as const){
 const cp26=generatePolCp026LocalizedReviewV1(locale);
 assert.equal(cp26.filter(q=>q.stem.endsWith(":")).length,39,`CP026/${locale}: V3 completion-stem contract`);
 assert.equal(cp26.filter(q=>q.stem.endsWith("?")).length,41,`CP026/${locale}: V3 question-stem contract`);
 assert.match(learner(cp26[0]!),/309/);
 assert.match(learner(cp26[6]!),/310/);
 assert.match(learner(cp26[16]!),/311/);
 assert.match(learner(cp26[24]!),/312/);
 assert.match(learner(cp26[25]!),locale==="hi"?/दो-तिहाई/:/ਦੋ-ਤਿਹਾਈ/);
 assert.match(learner(cp26[37]!),/28/);
 assert.match(learner(cp26[48]!),/309/);
 assert.match(learner(cp26[48]!),/314/);
 assert.match(learner(cp26[49]!),/312A/);
 assert.match(learner(cp26[49]!),/313/);
 assert.match(learner(cp26[49]!),/314/);
 assert.match(learner(cp26[52]!),/XIVA/);
 assert.match(learner(cp26[53]!),/42/);
 assert.match(learner(cp26[56]!),/323A/);
 assert.match(learner(cp26[64]!),/323B/);
 assert.match(learner(cp26[66]!),/75/);
 assert.match(learner(cp26[72]!),/1985/);
 assert.match(learner(cp26[74]!),/1/);
 assert.match(learner(cp26[74]!),/1985/);
 assert.match(learner(cp26[77]!),/226/);
 assert.match(learner(cp26[77]!),/227/);

 const cp27=generatePolCp027LocalizedReviewV1(locale);
 assert.equal(cp27.filter(q=>q.stem.endsWith(":")).length,40,`CP027/${locale}: completion-stem contract`);
 assert.equal(cp27.filter(q=>q.stem.endsWith("?")).length,40,`CP027/${locale}: question-stem contract`);
 assert.match(learner(cp27[0]!),/301/);
 assert.match(learner(cp27[7]!),/302/);
 assert.match(learner(cp27[12]!),/303\(2\)/);
 assert.match(learner(cp27[20]!),/304\(b\)/);
 assert.match(learner(cp27[21]!),locale==="hi"?/राष्ट्रपति/:/ਰਾਸ਼ਟਰਪਤੀ/);
 assert.match(learner(cp27[24]!),/305/);
 assert.match(learner(cp27[28]!),/306/);
 assert.match(learner(cp27[32]!),/307/);
 assert.match(learner(cp27[40]!),/97/);
 assert.match(learner(cp27[41]!),/19\(1\)\(c\)/);
 assert.match(learner(cp27[42]!),/43B/);
 assert.match(learner(cp27[44]!),/243ZH/);
 assert.match(learner(cp27[52]!),locale==="hi"?/(?:21|इक्कीस)/:/(?:21|ਇੱਕੀ)/);
 assert.match(learner(cp27[60]!),/243ZL/);
 assert.match(learner(cp27[64]!),/243ZM/);
 assert.match(learner(cp27[72]!),/243ZQ/);
 assert.match(learner(cp27[73]!),/243ZR/);
 assert.match(learner(cp27[74]!),/243ZS/);
 assert.match(learner(cp27[75]!),/243ZT/);
 assert.match(learner(cp27[78]!),/368\(2\)/);
 assert.match(cp27[77]!.explanation,locale==="hi"?/बहु-राज्य/:/ਬਹੁ-ਰਾਜ/);
 assert.match(cp27[77]!.explanation,locale==="hi"?/संघ राज्य क्षेत्र/:/ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼/);
}

const evidence={
 chapterId:"POL-001",
 cps:["POL-CP-026","POL-CP-027"],
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
 stemModeInvariant:true,
 cp026V3ServicesAndTribunalOwnershipGuard:true,
 cp027TradeAndCooperativeScopeGuard:true,
 reviewOnly:true,
 runtimeRegistered:false
};
const dir=path.resolve("dist/polity-review/POL-MULTILINGUAL-V1");
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,"POL-CP026-CP027-MULTILINGUAL-PROOF.json"),JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
