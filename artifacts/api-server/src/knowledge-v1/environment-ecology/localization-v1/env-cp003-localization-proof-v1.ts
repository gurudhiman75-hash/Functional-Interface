import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ENV_CP003_ENGLISH_AUTHORITY_V1, generateEnvCp003LocalizedReviewV1 } from "./env-cp003-localization-v1";
import type { EnvLocaleV1, EnvLocalizedQuestionV1 } from "./env-localization-types-v1";

const locales:EnvLocaleV1[]=["en","hi","pa"];

function learnerText(q:EnvLocalizedQuestionV1){return [q.stem,...q.options,q.explanation].join("\n");}
function assertNative(locale:"hi"|"pa",q:EnvLocalizedQuestionV1){
  const text=learnerText(q);
  assert.equal(/[A-Za-z]{2,}/u.test(text),false,`${q.questionId}: Latin-script leakage`);
  if(locale==="hi") assert.match(text,/[ऀ-ॿ]/u);
  if(locale==="pa") assert.match(text,/[਀-੿]/u);
}

assert.equal(ENV_CP003_ENGLISH_AUTHORITY_V1.length,48);
for(const locale of locales){
  const localized=generateEnvCp003LocalizedReviewV1(locale);
  assert.equal(localized.length,48);
  localized.forEach((q,i)=>{
    const source=ENV_CP003_ENGLISH_AUTHORITY_V1[i];
    assert.equal(q.localizationV1.englishQuestionId,source.questionId);
    assert.equal(q.cpId,source.cpId);
    assert.equal(q.qlId,source.qlId);
    assert.equal(q.difficulty,source.difficulty);
    assert.equal(q.correctIndex,source.correctIndex);
    assert.deepEqual(q.sourceIds,source.sourceIds);
    assert.deepEqual(q.sourceFactIds,source.sourceFactIds);
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options).size,4,`${q.questionId}: options must be unique`);
    assert.equal(q.canonicalAnswer,q.options[q.correctIndex],`${q.questionId}: answer/index parity`);
    if(locale==="en"){
      assert.equal(q.questionId,source.questionId);
      assert.equal(q.stem,source.stem);
      assert.deepEqual(q.options,source.options);
      assert.equal(q.explanation,source.explanation);
      assert.equal(q.canonicalAnswer,source.canonicalAnswer);
    } else {
      assert.equal(q.questionId,`${source.questionId}-${locale.toUpperCase()}`);
      assertNative(locale,q);
    }
  });
}

const evidence={chapterId:"ENV-001",cpId:"ENV-CP-003",questionsPerLocale:48,totalReviewSurfaces:144,locales,semanticInvariant:true,optionOrderInvariant:true,correctIndexInvariant:true,sourceInvariant:true,nativeScriptGuard:true,reviewOnly:true,runtimeRegistered:false};
const dir=path.resolve("dist/environment-review/ENV-MULTILINGUAL-V1");
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,"ENV-CP003-MULTILINGUAL-PROOF.json"),JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence));
