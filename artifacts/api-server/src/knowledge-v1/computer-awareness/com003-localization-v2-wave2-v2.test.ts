import { strict as assert } from "node:assert";
import { COM003_HINDI_LOCALIZATION_V2_WAVE2, COM003_PUNJABI_LOCALIZATION_V2_WAVE2 } from "./com003-localization-v2-wave2";
import { COM003_HINDI_LOCALIZATION_V2_WAVE2_V2, COM003_LOCALIZATION_V2_WAVE2_AUTHORITY_V2, COM003_PUNJABI_LOCALIZATION_V2_WAVE2_V2 } from "./com003-localization-v2-wave2-v2";

const QLS=["COM-003-QL-005","COM-003-QL-006","COM-003-QL-007","COM-003-QL-008","COM-003-QL-009"];
assert.equal(COM003_LOCALIZATION_V2_WAVE2_AUTHORITY_V2.authorityId,"COM-003-LOCALIZATION-V2-WAVE2-CANDIDATE-2");
assert.equal(COM003_HINDI_LOCALIZATION_V2_WAVE2_V2.length,60);
assert.equal(COM003_PUNJABI_LOCALIZATION_V2_WAVE2_V2.length,60);

for(const [language,before,after] of [
  ["hi",COM003_HINDI_LOCALIZATION_V2_WAVE2,COM003_HINDI_LOCALIZATION_V2_WAVE2_V2],
  ["pa",COM003_PUNJABI_LOCALIZATION_V2_WAVE2,COM003_PUNJABI_LOCALIZATION_V2_WAVE2_V2],
] as const){
  for(let i=0;i<60;i+=1){
    const a=before[i]!, b=after[i]!;
    assert.equal(b.sourceQuestionId,a.sourceQuestionId);
    assert.equal(b.qlId,a.qlId); assert.equal(b.cpId,a.cpId);
    assert.equal(b.examSurfaceFamily,a.examSurfaceFamily); assert.equal(b.surfaceMode,a.surfaceMode);
    assert.equal(b.targetFactId,a.targetFactId); assert.deepEqual(b.options,a.options);
    assert.equal(b.correctIndex,a.correctIndex); assert.equal(b.canonicalAnswer,a.canonicalAnswer);
    assert.deepEqual(b.sourceIds,a.sourceIds); assert.deepEqual(b.sourceFactIds,a.sourceFactIds);
    assert.equal(b.versionScoped,a.versionScoped); assert.equal(b.solverAuthority,a.solverAuthority);
    assert.equal(b.sourceEnglishAuthorityId,a.sourceEnglishAuthorityId);
    assert.equal(b.localizationReviewOnly,true); assert.equal(b.localizationFrozen,false);
    assert.equal(b.runtimeRegistered,false); assert.equal(b.productionReleased,false);
    assert.notEqual(b.localizationId,a.localizationId);
    if(language==="hi"){assert.match(b.stem,/[\u0900-\u097F]/);assert.match(b.explanation,/[\u0900-\u097F]/);}else{assert.match(b.stem,/[\u0A00-\u0A7F]/);assert.match(b.explanation,/[\u0A00-\u0A7F]/);}
    assert.doesNotMatch(`${b.stem}\n${b.explanation}`,/merged documents|recipient data|field values|recipient records|vertical line|horizontal line|coordinate|cell reference|cell range|cell address|arithmetic operator/i,`${b.localizationId}:raw-English-fragment`);
  }
  for(const ql of QLS){const xs=after.filter(q=>q.qlId===ql);assert.equal(xs.length,12);assert.equal(new Set(xs.map(q=>q.stem.trim().toLowerCase())).size,12,`${language}:${ql}:duplicate-stem`);}
}
const changedHi=COM003_HINDI_LOCALIZATION_V2_WAVE2_V2.filter((q,i)=>q.stem!==COM003_HINDI_LOCALIZATION_V2_WAVE2[i]!.stem||q.explanation!==COM003_HINDI_LOCALIZATION_V2_WAVE2[i]!.explanation).length;
const changedPa=COM003_PUNJABI_LOCALIZATION_V2_WAVE2_V2.filter((q,i)=>q.stem!==COM003_PUNJABI_LOCALIZATION_V2_WAVE2[i]!.stem||q.explanation!==COM003_PUNJABI_LOCALIZATION_V2_WAVE2[i]!.explanation).length;
assert.ok(changedHi>=15,`expected meaningful Hindi polish, got ${changedHi}`); assert.ok(changedPa>=15,`expected meaningful Punjabi polish, got ${changedPa}`);
const governance=COM003_LOCALIZATION_V2_WAVE2_AUTHORITY_V2.governance;
assert.equal(governance.localizationFrozen,false);assert.equal(governance.questionStudioRuntimeAuthorized,false);assert.equal(governance.questionBankWritesAuthorized,false);assert.equal(governance.testEligibilityAuthorized,false);assert.equal(governance.mockTestEligibilityAuthorized,false);assert.equal(governance.automaticPublicationAuthorized,false);assert.equal(governance.publiclyPublishable,false);assert.equal(governance.productionReleased,false);
console.log("[COM003-LOCALIZATION-V2-WAVE2-CANDIDATE-2]",{hindi:60,punjabi:60,changedHi,changedPa,governance});