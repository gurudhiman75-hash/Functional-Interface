import { strict as assert } from "node:assert";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";
import { COM003_HINDI_LOCALIZATION_V2_WAVE3, COM003_LOCALIZATION_V2_WAVE3_AUTHORITY, COM003_PUNJABI_LOCALIZATION_V2_WAVE3 } from "./com003-localization-v2-wave3";

const QLS=["COM-003-QL-010","COM-003-QL-011","COM-003-QL-012","COM-003-QL-013","COM-003-QL-014"];
const EN=COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter(q=>QLS.includes(q.qlId));
const enById=new Map(EN.map(q=>[q.questionId,q]));
assert.equal(EN.length,60);
assert.equal(COM003_LOCALIZATION_V2_WAVE3_AUTHORITY.sourceEnglishAuthorityId,"COM-003-ENGLISH-FREEZE-V2");
assert.equal(COM003_LOCALIZATION_V2_WAVE3_AUTHORITY.localizedQuestionCount,120);
assert.equal(COM003_HINDI_LOCALIZATION_V2_WAVE3.length,60);
assert.equal(COM003_PUNJABI_LOCALIZATION_V2_WAVE3.length,60);

for(const [language,items] of [["hi",COM003_HINDI_LOCALIZATION_V2_WAVE3],["pa",COM003_PUNJABI_LOCALIZATION_V2_WAVE3]] as const){
  assert.equal(new Set(items.map(q=>q.localizationId)).size,60);
  assert.equal(new Set(items.map(q=>q.sourceQuestionId)).size,60);
  for(const item of items){
    const en=enById.get(item.sourceQuestionId); assert.ok(en,`${language}:${item.sourceQuestionId}:missing-en`);
    assert.equal(item.sourceEnglishAuthorityId,"COM-003-ENGLISH-FREEZE-V2");
    assert.equal(item.qlId,en.qlId); assert.equal(item.cpId,en.cpId); assert.equal(item.examSurfaceFamily,en.examSurfaceFamily);
    assert.equal(item.surfaceMode,en.surfaceMode); assert.equal(item.targetFactId,en.targetFactId); assert.equal(item.correctIndex,en.correctIndex);
    assert.deepEqual(item.sourceIds,en.sourceIds); assert.deepEqual(item.sourceFactIds,en.sourceFactIds); assert.equal(item.versionScoped,en.versionScoped);
    assert.equal(item.solverAuthority,en.solverAuthority); assert.equal(item.options.length,4); assert.equal(item.canonicalAnswer,item.options[item.correctIndex]);
    assert.ok(item.stem.length>=20,`${item.localizationId}:thin-stem`); assert.ok(item.explanation.length>=25,`${item.localizationId}:thin-explanation`);
    assert.equal(item.sourceEnglishFrozen,true); assert.equal(item.localizationReviewOnly,true); assert.equal(item.localizationFrozen,false);
    assert.equal(item.runtimeRegistered,false); assert.equal(item.productionReleased,false);
    if(language==="hi") { assert.equal(item.locale,"hi-IN"); assert.match(item.stem,/[ऀ-ॿ]/); assert.match(item.explanation,/[ऀ-ॿ]/); }
    else { assert.equal(item.locale,"pa-IN"); assert.match(item.stem,/[਀-੿]/); assert.match(item.explanation,/[਀-੿]/); }
    assert.doesNotMatch(item.explanation,/सही उत्तर है|सਹੀ ਉੱਤਰ ਹੈ|canonical fact|दिए गए तथ्य के अनुसार|ਦਿੱਤੇ ਤੱਥ ਅਨੁਸਾਰ/i,`${item.localizationId}:generic-explanation`);
  }
  for(const ql of QLS){
    const xs=items.filter(q=>q.qlId===ql); assert.equal(xs.length,12,`${language}:${ql}:count`);
    assert.equal(new Set(xs.map(q=>q.stem.trim().toLowerCase())).size,12,`${language}:${ql}:duplicate-stem`);
  }
}

const governance=COM003_LOCALIZATION_V2_WAVE3_AUTHORITY.governance;
assert.equal(governance.localizationFrozen,false);assert.equal(governance.questionStudioRuntimeAuthorized,false);assert.equal(governance.questionBankWritesAuthorized,false);
assert.equal(governance.testEligibilityAuthorized,false);assert.equal(governance.mockTestEligibilityAuthorized,false);assert.equal(governance.automaticPublicationAuthorized,false);
assert.equal(governance.publiclyPublishable,false);assert.equal(governance.productionReleased,false);
console.log("[COM003-LOCALIZATION-V2-WAVE3]",{english:EN.length,hindi:60,punjabi:60,qls:QLS,governance});
