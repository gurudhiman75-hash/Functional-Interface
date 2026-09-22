import assert from "node:assert/strict";
import { generateBiologyLocalizedCpV1, SCI_BIOLOGY_WAVE1_SUPPORTED_CPS_V1 } from "./sci-biology-localization-generator-v1";

const nativeLocales=["hi","pa"] as const;
const forbiddenEnglishProse=/\b(which|what|why|how|select|correct|incorrect|statement|option|answer|because|contains|cell|cells|nucleus|membrane|protein|gene|chromosome|mitosis|meiosis|plant|animal)\b/i;
const optionAnalysis=/\b(option|choice)\s*[ABCD]\b/i;
const internalLeakage=/\b(review[- ]only|runtimeRegistered|sourceFactIds|candidate v\d+|question line|ql id)\b/i;
const devanagari=/[\u0900-\u097F]/;
const gurmukhi=/[\u0A00-\u0A7F]/;

for(const cpId of SCI_BIOLOGY_WAVE1_SUPPORTED_CPS_V1){
 const en=generateBiologyLocalizedCpV1(cpId,"en");
 assert.equal(en.length,60,`${cpId}/en: expected 60`);
 for(const locale of nativeLocales){
  const localized=generateBiologyLocalizedCpV1(cpId,locale);
  assert.equal(localized.length,60,`${cpId}/${locale}: expected 60`);
  const ids=new Set<string>();const stems=new Set<string>();const positions=[0,0,0,0];const difficulty:Record<string,number>={Easy:0,Medium:0,Hard:0};
  localized.forEach((q,index)=>{
   const source=en[index];
   assert.equal(q.localizationV1.englishQuestionId,source.questionId,`${q.questionId}: English linkage drift`);
   assert.equal(q.cpId,source.cpId,`${q.questionId}: CP drift`);
   assert.equal(q.qlId,source.qlId,`${q.questionId}: QL drift`);
   assert.equal(q.difficulty,source.difficulty,`${q.questionId}: difficulty drift`);
   assert.equal(q.correctIndex,source.correctIndex,`${q.questionId}: correct-index drift`);
   assert.deepEqual(q.sourceIds,source.sourceIds,`${q.questionId}: source IDs drift`);
   assert.deepEqual(q.sourceFactIds,source.sourceFactIds,`${q.questionId}: source fact IDs drift`);
   assert.equal(q.reviewOnly,true,`${q.questionId}: review-only lifecycle lost`);
   assert.equal(q.runtimeRegistered,false,`${q.questionId}: runtime opened before approval`);
   assert.equal(q.options.length,4,`${q.questionId}: expected four options`);
   assert.equal(new Set(q.options).size,4,`${q.questionId}: duplicate visible options`);
   assert.equal(q.options[q.correctIndex],q.canonicalAnswer,`${q.questionId}: answer-key mismatch`);
   assert.notEqual(q.stem,source.stem,`${q.questionId}: English stem was not localized`);
   assert.notEqual(q.explanation,source.explanation,`${q.questionId}: English explanation was not localized`);
   assert.ok(q.explanation.length>=28,`${q.questionId}: explanation too thin`);
   assert.ok(locale==="hi"?devanagari.test(q.stem):gurmukhi.test(q.stem),`${q.questionId}: native script missing from stem`);
   assert.ok(locale==="hi"?devanagari.test(q.explanation):gurmukhi.test(q.explanation),`${q.questionId}: native script missing from explanation`);
   const learnerText=[q.stem,...q.options,q.explanation].join(" ");
   assert.ok(!forbiddenEnglishProse.test(learnerText),`${q.questionId}: accidental English prose leakage`);
   assert.ok(!optionAnalysis.test(q.explanation),`${q.questionId}: option analysis leakage`);
   assert.ok(!internalLeakage.test(learnerText),`${q.questionId}: internal metadata leakage`);
   assert.ok(locale==="hi"?devanagari.test(q.qlName):gurmukhi.test(q.qlName),`${q.questionId}: QL name not localized`);
   assert.ok(!ids.has(q.questionId),`${q.questionId}: duplicate localized ID`);ids.add(q.questionId);
   const stemKey=q.stem.trim().replace(/\s+/g," ").toLowerCase();assert.ok(!stems.has(stemKey),`${q.questionId}: duplicate localized stem`);stems.add(stemKey);
   positions[q.correctIndex]+=1;difficulty[q.difficulty]+=1;
  });
  assert.deepEqual(positions,[15,15,15,15],`${cpId}/${locale}: answer-position drift`);
  assert.deepEqual(difficulty,{Easy:18,Medium:30,Hard:12},`${cpId}/${locale}: difficulty drift`);
 }
}
const nativeQuestions=SCI_BIOLOGY_WAVE1_SUPPORTED_CPS_V1.flatMap(cpId=>nativeLocales.flatMap(locale=>[...generateBiologyLocalizedCpV1(cpId,locale)]));
assert.equal(nativeQuestions.length,120,"Wave 1 must expose 120 native localized questions");
assert.equal(new Set(nativeQuestions.map(q=>q.questionId)).size,120,"Localized IDs must be unique");
console.log(JSON.stringify({status:"PASS",wave:"Biology localization V1 Wave 1",cps:[...SCI_BIOLOGY_WAVE1_SUPPORTED_CPS_V1],nativeLocales:[...nativeLocales],questionsPerLocale:60,nativeQuestions:120,lifecycle:"review-only / runtime closed"},null,2));
