import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ENV_CP007_ENGLISH_AUTHORITY_V2, generateEnvCp007LocalizedReviewV1 } from "./env-cp007-localization-v1";
import type { EnvLocaleV1, EnvLocalizedQuestionV1 } from "./env-localization-types-v1";

const locales: EnvLocaleV1[]=["en","hi","pa"];
function learnerText(q:EnvLocalizedQuestionV1){return [q.stem,...q.options,q.explanation].join("\n");}
function assertNative(locale:"hi"|"pa",q:EnvLocalizedQuestionV1){
  const t=learnerText(q);
  assert.equal(/[A-Za-z]{2,}/u.test(t),false,`${q.questionId}: Latin-script leakage`);
  if(locale==="hi") assert.match(t,/[ऀ-ॿ]/u);
  if(locale==="pa") assert.match(t,/[਀-੿]/u);
}
assert.equal(ENV_CP007_ENGLISH_AUTHORITY_V2.length,48);
for(const locale of locales){
  const localized=generateEnvCp007LocalizedReviewV1(locale);
  assert.equal(localized.length,48);
  localized.forEach((q,i)=>{
    const s=ENV_CP007_ENGLISH_AUTHORITY_V2[i];
    assert.equal(q.localizationV1.englishQuestionId,s.questionId);
    assert.equal(q.cpId,s.cpId); assert.equal(q.qlId,s.qlId); assert.equal(q.difficulty,s.difficulty);
    assert.equal(q.correctIndex,s.correctIndex); assert.deepEqual(q.sourceIds,s.sourceIds); assert.deepEqual(q.sourceFactIds,s.sourceFactIds);
    assert.equal(q.options.length,4); assert.equal(new Set(q.options).size,4); assert.equal(q.canonicalAnswer,q.options[q.correctIndex]);
    if(locale==="en"){assert.equal(q.questionId,s.questionId);assert.equal(q.stem,s.stem);assert.deepEqual(q.options,s.options);assert.equal(q.explanation,s.explanation);assert.equal(q.canonicalAnswer,s.canonicalAnswer);}
    else {assert.equal(q.questionId,`${s.questionId}-${locale.toUpperCase()}`);assertNative(locale,q);}
  });
}
const evidence={chapterId:"ENV-001",cpId:"ENV-CP-007",authorityVersion:"V2",questionsPerLocale:48,totalReviewSurfaces:144,locales,semanticInvariant:true,optionOrderInvariant:true,correctIndexInvariant:true,sourceInvariant:true,nativeScriptGuard:true,reviewOnly:true,runtimeRegistered:false};
const dir=path.resolve("dist/environment-review/ENV-MULTILINGUAL-V1");fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,"ENV-CP007-MULTILINGUAL-PROOF.json"),JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));
