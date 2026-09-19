import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  ENV_CP009_ENGLISH_AUTHORITY_V1,
  generateEnvCp009LocalizedReviewV1,
} from "./env-cp009-localization-v1";
import {
  ENV_CP010_ENGLISH_AUTHORITY_V1,
  generateEnvCp010LocalizedReviewV1,
} from "./env-cp010-localization-v1";
import {
  ENV_CP011_ENGLISH_AUTHORITY_V1,
  generateEnvCp011LocalizedReviewV1,
} from "./env-cp011-localization-v1";
import type { EnvLocaleV1, EnvLocalizedQuestionV1 } from "./env-localization-types-v1";

const locales:EnvLocaleV1[]=["en","hi","pa"];
const batches=[
  ["ENV-CP-009",ENV_CP009_ENGLISH_AUTHORITY_V1,generateEnvCp009LocalizedReviewV1],
  ["ENV-CP-010",ENV_CP010_ENGLISH_AUTHORITY_V1,generateEnvCp010LocalizedReviewV1],
  ["ENV-CP-011",ENV_CP011_ENGLISH_AUTHORITY_V1,generateEnvCp011LocalizedReviewV1],
] as const;

function learnerText(q:EnvLocalizedQuestionV1){return [q.stem,...q.options,q.explanation].join("\n");}
function stripAllowedRoman(text:string){
  return text
    .replace(/\bIUCN\b/gu,"")
    .replace(/\b(?:26A|36A|36C)\b/gu,"")
    .replace(/\b(?:IVA|IV|VI|I)\b/gu,"");
}
function assertNative(locale:"hi"|"pa",q:EnvLocalizedQuestionV1){
  const text=learnerText(q);
  const unauthorized=stripAllowedRoman(text).match(/[A-Za-z]+/gu) ?? [];
  assert.deepEqual(unauthorized,[],`${q.questionId}: unauthorized Latin leakage: ${unauthorized.join(", ")}`);
  if(locale==="hi") assert.match(text,/[\u0900-\u097F]/u);
  if(locale==="pa") assert.match(text,/[\u0A00-\u0A7F]/u);
}

for(const [cpId,source,generate] of batches){
  assert.equal(source.length,48,`${cpId}: English authority size`);
  for(const locale of locales){
    const localized=generate(locale);
    assert.equal(localized.length,48,`${cpId}/${locale}: localized size`);
    localized.forEach((q,i)=>{
      const english=source[i];
      assert.equal(q.localizationV1.englishQuestionId,english.questionId);
      assert.equal(q.cpId,english.cpId);
      assert.equal(q.qlId,english.qlId);
      assert.equal(q.difficulty,english.difficulty);
      assert.equal(q.correctIndex,english.correctIndex);
      assert.deepEqual(q.sourceIds,english.sourceIds);
      assert.deepEqual(q.sourceFactIds,english.sourceFactIds);
      assert.equal(q.options.length,4);
      assert.equal(new Set(q.options).size,4);
      assert.equal(q.canonicalAnswer,q.options[q.correctIndex]);
      assert.equal(q.reviewOnly,true);
      assert.equal(q.runtimeRegistered,false);

      if(locale==="en"){
        assert.equal(q.questionId,english.questionId);
        assert.equal(q.stem,english.stem);
        assert.deepEqual(q.options,english.options);
        assert.equal(q.explanation,english.explanation);
        assert.equal(q.canonicalAnswer,english.canonicalAnswer);
      }else{
        assert.equal(q.questionId,`${english.questionId}-${locale.toUpperCase()}`);
        assertNative(locale,q);
      }
    });
  }
}

const evidence={
  chapterId:"ENV-001",
  cps:["ENV-CP-009","ENV-CP-010","ENV-CP-011"],
  questionsPerCpPerLocale:48,
  questionsPerLocale:144,
  totalReviewSurfaces:432,
  qlsPerCp:12,
  locales,
  semanticInvariant:true,
  optionOrderInvariant:true,
  correctIndexInvariant:true,
  sourceInvariant:true,
  nativeScriptGuard:true,
  reviewOnly:true,
  runtimeRegistered:false,
};
const dir=path.resolve("dist/environment-review/ENV-MULTILINGUAL-V1");
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,"ENV-CP009-CP011-MULTILINGUAL-PROOF.json"),JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence));
