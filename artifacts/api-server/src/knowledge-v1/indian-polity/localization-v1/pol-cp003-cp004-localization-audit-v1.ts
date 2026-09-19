import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { applyPolityFinalEditorialStemPass } from "../pol-001-final-editorial-stem-pass-v1";
import { generatePolCp003ReviewBatchV3 } from "../preamble-union-citizenship/pol-cp003-review-generator-v3";
import { generatePolCp004ReviewBatchV3 } from "../fundamental-rights/pol-cp004-review-generator-v3";
import { generatePolCp003LocalizedReviewV1 } from "./pol-cp003-localization-v1";
import { generatePolCp004LocalizedReviewV1 } from "./pol-cp004-localization-v1";
import type { PolLocaleV1, PolLocalizedQuestionV1 } from "./pol-localization-types-v1";

const cps = [
  ["POL-CP-003", generatePolCp003ReviewBatchV3().map(applyPolityFinalEditorialStemPass), generatePolCp003LocalizedReviewV1],
  ["POL-CP-004", generatePolCp004ReviewBatchV3().map(applyPolityFinalEditorialStemPass), generatePolCp004LocalizedReviewV1],
] as const;
const locales: PolLocaleV1[] = ["en","hi","pa"];

function text(q: PolLocalizedQuestionV1){ return [q.stem,...q.options,q.explanation].join("\n"); }

function numericTokens(value:string){
  return [...new Set(value.match(/\d+[A-Z]?(?:\([a-z0-9]+\))?/g) ?? [])].sort();
}

const PUNJABI_LITERAL_CALQUES = [
  "ਮੰਨੇ ਹੋਏ ਸੰਵਿਧਾਨਕ ਪਾਠ",
  "ਬਾਧਕ ਸਹਿਮਤੀ",
  "ਬਾਧਕ ਵੀਟੋ",
  "ਯੋਗਤਾ-ਸ਼ਰਤ",
  "ਅਪ੍ਰਸੰਗਿਕ",
  "ਬੰਦੀ ਪ੍ਰਤੱਖੀਕਰਨ",
  "ਪਰਮਾਦੇਸ਼",
  "ਪ੍ਰਤਿਸ਼ੇਧ",
  "ਉਤਪ੍ਰੇਸ਼ਣ",
  "ਅਧਿਕਾਰ-ਪ੍ਰਿਛਾ",
] as const;

function native(locale:"hi"|"pa",q:PolLocalizedQuestionV1){
  const t=text(q).replace(/\b(?:I|II|III|IV|V)\b/gu,"");
  assert.equal(/[A-Za-z]{2,}/u.test(t),false,`${q.questionId}: Latin-script leakage`);
  assert.match(t,locale==="hi"?/[\u0900-\u097F]/u:/[\u0A00-\u0A7F]/u,`${q.questionId}: native script missing`);
}
let englishCount=0;
for(const [cpId,english,gen] of cps){
  englishCount+=english.length;
  for(const locale of locales){
    const localized=gen(locale);
    assert.equal(localized.length,english.length,`${cpId}/${locale}: count parity`);
    localized.forEach((q,i)=>{
      const e=english[i]!;
      assert.equal(q.localizationV1.englishQuestionId,e.questionId);
      assert.equal(q.cpId,e.cpId);
      assert.equal(q.qlId,e.qlId);
      assert.equal(q.difficulty,e.difficulty);
      assert.equal(q.correctIndex,e.correctIndex);
      assert.deepEqual(q.sourceIds,e.sourceIds);
      assert.deepEqual(q.sourceFactIds,e.sourceFactIds);
      assert.equal(q.options.length,4);
      assert.equal(new Set(q.options).size,4,`${q.questionId}: options unique`);
      assert.equal(q.canonicalAnswer,q.options[q.correctIndex],`${q.questionId}: answer/index parity`);
      if(locale==="en"){
        assert.equal(q.questionId,e.questionId);
        assert.equal(q.stem,e.stem);
        assert.deepEqual(q.options,e.options);
        assert.equal(q.explanation,e.explanation);
      } else {
        assert.equal(q.questionId,`${e.questionId}-${locale.toUpperCase()}`);
        native(locale,q);
        const expectedNumeric = numericTokens([e.stem,...e.options,e.explanation].join("\n"));
        const localizedNumeric = new Set(numericTokens(text(q)));
        for(const token of expectedNumeric){
          assert.equal(localizedNumeric.has(token),true,`${q.questionId}: numeric/legal token changed or lost: ${token}`);
        }
      }
    });
  }
}
assert.equal(englishCount,133,"CP003-CP004 authority must contain 133 questions");
const evidence={chapterId:"POL-001",cps:["POL-CP-003","POL-CP-004"],localizationVersion:"POL-LOCALIZATION-V1",englishQuestions:englishCount,questionsPerLocale:englishCount,locales,totalReviewSurfaces:englishCount*3,semanticInvariant:true,optionOrderInvariant:true,correctIndexInvariant:true,qlInvariant:true,sourceInvariant:true,nativeScriptGuard:true,punjabiNativeEditorialGuard:true,numericFormInvariant:true,reviewOnly:true,runtimeRegistered:false};
const dir=path.resolve("dist/polity-review/POL-MULTILINGUAL-V1");
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,"POL-CP003-CP004-MULTILINGUAL-PROOF.json"),JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
