import { strict as assert } from "node:assert";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";
import {
  COM003_HINDI_LOCALIZATION_V2_CHAPTER_CANDIDATE,
  COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY,
  COM003_PUNJABI_LOCALIZATION_V2_CHAPTER_CANDIDATE,
} from "./com003-localization-v2-chapter-candidate";

const english = COM003_ENGLISH_REVIEW_CORPUS_V16_2;
const enById = new Map(english.map(q => [q.questionId, q]));
assert.equal(english.length, 228);
assert.equal(COM003_HINDI_LOCALIZATION_V2_CHAPTER_CANDIDATE.length, 228);
assert.equal(COM003_PUNJABI_LOCALIZATION_V2_CHAPTER_CANDIDATE.length, 228);
assert.equal(COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.localizedQuestionCount, 456);
assert.equal(COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.questionLanguageArtifactCount, 684);
assert.equal(COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.sourceEnglishAuthorityId, "COM-003-ENGLISH-FREEZE-V2");

const expectedIds = [...enById.keys()].sort();
for (const [language, items] of [
  ["hi", COM003_HINDI_LOCALIZATION_V2_CHAPTER_CANDIDATE],
  ["pa", COM003_PUNJABI_LOCALIZATION_V2_CHAPTER_CANDIDATE],
] as const) {
  assert.deepEqual(items.map(q => q.sourceQuestionId).sort(), expectedIds, `${language}:source-identity`);
  assert.equal(new Set(items.map(q => q.localizationId)).size, 228, `${language}:localization-id-uniqueness`);
  for (const item of items) {
    const en = enById.get(item.sourceQuestionId);
    assert.ok(en, `${language}:${item.sourceQuestionId}:missing-English`);
    assert.equal(item.sourceEnglishAuthorityId, "COM-003-ENGLISH-FREEZE-V2");
    assert.equal(item.qlId, en.qlId);
    assert.equal(item.cpId, en.cpId);
    assert.equal(item.examSurfaceFamily, en.examSurfaceFamily);
    assert.equal(item.surfaceMode, en.surfaceMode);
    assert.equal(item.targetFactId, en.targetFactId);
    assert.equal(item.correctIndex, en.correctIndex);
    assert.deepEqual(item.sourceIds, en.sourceIds);
    assert.deepEqual(item.sourceFactIds, en.sourceFactIds);
    assert.equal(item.versionScoped, en.versionScoped);
    assert.equal(item.solverAuthority, en.solverAuthority);
    assert.equal(item.options.length, 4);
    assert.equal(item.canonicalAnswer, item.options[item.correctIndex]);
    assert.equal(item.sourceEnglishFrozen, true);
    assert.equal(item.localizationReviewOnly, true);
    assert.equal(item.localizationFrozen, false);
    assert.equal(item.runtimeRegistered, false);
    assert.equal(item.productionReleased, false);
  }
  for (let i = 1; i <= 19; i += 1) {
    const qlId = `COM-003-QL-${String(i).padStart(3, "0")}`;
    const ql = items.filter(q => q.qlId === qlId);
    assert.equal(ql.length, 12, `${language}:${qlId}:count`);
    assert.equal(new Set(ql.map(q => q.stem.trim().toLowerCase())).size, 12, `${language}:${qlId}:stem-diversity`);
  }
}

for (const sourceId of expectedIds) {
  const hi = COM003_HINDI_LOCALIZATION_V2_CHAPTER_CANDIDATE.find(q => q.sourceQuestionId === sourceId)!;
  const pa = COM003_PUNJABI_LOCALIZATION_V2_CHAPTER_CANDIDATE.find(q => q.sourceQuestionId === sourceId)!;
  assert.equal(hi.qlId, pa.qlId, `${sourceId}:cross-language-ql`);
  assert.equal(hi.cpId, pa.cpId, `${sourceId}:cross-language-cp`);
  assert.equal(hi.targetFactId, pa.targetFactId, `${sourceId}:cross-language-target`);
  assert.equal(hi.correctIndex, pa.correctIndex, `${sourceId}:cross-language-answer-position`);
  assert.deepEqual(hi.sourceIds, pa.sourceIds, `${sourceId}:cross-language-source`);
  assert.deepEqual(hi.sourceFactIds, pa.sourceFactIds, `${sourceId}:cross-language-source-fact`);
}

const g = COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.governance;
assert.equal(g.humanLanguageReviewRequired, true);
assert.equal(g.localizationFrozen, false);
assert.equal(g.questionStudioRuntimeAuthorized, false);
assert.equal(g.questionBankWritesAuthorized, false);
assert.equal(g.testEligibilityAuthorized, false);
assert.equal(g.mockTestEligibilityAuthorized, false);
assert.equal(g.automaticPublicationAuthorized, false);
assert.equal(g.publiclyPublishable, false);
assert.equal(g.productionReleased, false);

console.log("[COM003-LOCALIZATION-V2-CHAPTER-CANDIDATE]", {
  english: english.length,
  hindi: COM003_HINDI_LOCALIZATION_V2_CHAPTER_CANDIDATE.length,
  punjabi: COM003_PUNJABI_LOCALIZATION_V2_CHAPTER_CANDIDATE.length,
  totalArtifacts: COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.questionLanguageArtifactCount,
  status: COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.status,
});
