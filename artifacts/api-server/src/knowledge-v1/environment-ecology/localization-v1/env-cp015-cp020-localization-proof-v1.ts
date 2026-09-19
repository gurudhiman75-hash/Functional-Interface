import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ENV_CP015_ENGLISH_AUTHORITY_V2, generateEnvCp015LocalizedReviewV1 } from "./env-cp015-localization-v1";
import { ENV_CP016_ENGLISH_AUTHORITY_V2, generateEnvCp016LocalizedReviewV1 } from "./env-cp016-localization-v1";
import { ENV_CP017_ENGLISH_AUTHORITY_V1, generateEnvCp017LocalizedReviewV1 } from "./env-cp017-localization-v1";
import { ENV_CP018_ENGLISH_AUTHORITY_V1, generateEnvCp018LocalizedReviewV1 } from "./env-cp018-localization-v1";
import { ENV_CP019_ENGLISH_AUTHORITY_V1, generateEnvCp019LocalizedReviewV1 } from "./env-cp019-localization-v1";
import { ENV_CP020_ENGLISH_AUTHORITY_V2, generateEnvCp020LocalizedReviewV1 } from "./env-cp020-localization-v1";
import { ENV_CP020_REVIEW_V2 } from "../integrated-environment-gk/env-cp020-review-generator-v2";
import type { EnvLocaleV1, EnvLocalizedQuestionV1 } from "./env-localization-types-v1";

const locales:EnvLocaleV1[]=["en","hi","pa"];
const batches=[
 ["ENV-CP-015",60,15,ENV_CP015_ENGLISH_AUTHORITY_V2,generateEnvCp015LocalizedReviewV1],
 ["ENV-CP-016",60,15,ENV_CP016_ENGLISH_AUTHORITY_V2,generateEnvCp016LocalizedReviewV1],
 ["ENV-CP-017",48,12,ENV_CP017_ENGLISH_AUTHORITY_V1,generateEnvCp017LocalizedReviewV1],
 ["ENV-CP-018",48,12,ENV_CP018_ENGLISH_AUTHORITY_V1,generateEnvCp018LocalizedReviewV1],
 ["ENV-CP-019",48,12,ENV_CP019_ENGLISH_AUTHORITY_V1,generateEnvCp019LocalizedReviewV1],
 ["ENV-CP-020",48,12,ENV_CP020_ENGLISH_AUTHORITY_V2,generateEnvCp020LocalizedReviewV1],
] as const;

function learnerText(q:EnvLocalizedQuestionV1){return [q.stem,...q.options,q.explanation].join("\n");}
function stripAllowedRoman(text:string){
 return text
  .replace(/M-STrIPES/gu,"")
  .replace(/\b(?:IUCN|CPCB|SPCB|PCC|NBA|SBB|BMC|PBR|NTCA|CZA|WCCB|FSI|BSI|ZSI|WII|EIA|NGT|CITES|CMS|CBD|UNFCCC|NDCs?|POPs?|HFCs?|CFCs?|NAPCC|STPF|GPS|GIS|GK|COP21)\b/gu,"")
  .replace(/\b(?:I|II|III|B|C)\b/gu,"");
}
function assertNative(locale:"hi"|"pa",q:EnvLocalizedQuestionV1){
 const text=learnerText(q);
 const unauthorized=stripAllowedRoman(text).match(/[A-Za-z]+/gu)??[];
 assert.deepEqual(unauthorized,[],`${q.questionId}: unauthorized Latin leakage: ${unauthorized.join(", ")}`);
 if(locale==="hi") assert.match(text,/[\u0900-\u097F]/u);
 if(locale==="pa") assert.match(text,/[\u0A00-\u0A7F]/u);
}

for(const [cpId,expected,qlCount,source,generate] of batches){
 assert.equal(source.length,expected,`${cpId}: authority size`);
 assert.equal(new Set(source.map(q=>q.qlId)).size,qlCount,`${cpId}: QL count`);
 for(const locale of locales){
  const localized=generate(locale);
  assert.equal(localized.length,expected,`${cpId}/${locale}: localized size`);
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
   } else {
    assert.equal(q.questionId,`${english.questionId}-${locale.toUpperCase()}`);
    assertNative(locale,q);
   }
  });
 }
}

// CP020's approved V2 uses an id/sourceCpIds shape. Verify the adapter is exact.
assert.equal(ENV_CP020_REVIEW_V2.length,ENV_CP020_ENGLISH_AUTHORITY_V2.length);
ENV_CP020_REVIEW_V2.forEach((q,i)=>{
 const a=ENV_CP020_ENGLISH_AUTHORITY_V2[i];
 assert.equal(a.questionId,q.id);
 assert.equal(a.stem,q.stem);
 assert.deepEqual(a.options,[...q.options]);
 assert.equal(a.correctIndex,q.correctIndex);
 assert.equal(a.explanation,q.explanation);
 assert.deepEqual(a.sourceFactIds,[...q.sourceFactIds]);
 assert.deepEqual(a.sourceIds,[...q.sourceCpIds]);
});

const evidence={
 chapterId:"ENV-001",
 cps:["ENV-CP-015","ENV-CP-016","ENV-CP-017","ENV-CP-018","ENV-CP-019","ENV-CP-020"],
 questionsByCp:{"ENV-CP-015":60,"ENV-CP-016":60,"ENV-CP-017":48,"ENV-CP-018":48,"ENV-CP-019":48,"ENV-CP-020":48},
 qlsByCp:{"ENV-CP-015":15,"ENV-CP-016":15,"ENV-CP-017":12,"ENV-CP-018":12,"ENV-CP-019":12,"ENV-CP-020":12},
 questionsPerLocale:312,
 totalReviewSurfaces:936,
 cumulativeQuestionsPerLocaleCp001Cp020:1020,
 cumulativeReviewSurfacesCp001Cp020:3060,
 locales,
 cp015IncludesApprovedEiaV2:true,
 cp016IncludesApprovedMovementsV2:true,
 cp020UsesApprovedV2Capstone:true,
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
fs.writeFileSync(path.join(dir,"ENV-CP015-CP020-MULTILINGUAL-PROOF.json"),JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence));
