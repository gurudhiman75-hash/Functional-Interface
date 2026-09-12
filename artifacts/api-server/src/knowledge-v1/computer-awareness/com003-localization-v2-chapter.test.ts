import { strict as assert } from "node:assert";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";
import {
  COM003_HINDI_LOCALIZATION_V2_CHAPTER,
  COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY,
  COM003_PUNJABI_LOCALIZATION_V2_CHAPTER,
} from "./com003-localization-v2-chapter";

const QLS = Array.from({ length: 19 }, (_, index) => `COM-003-QL-${String(index + 1).padStart(3, "0")}`);
const HIGH_DIVERSITY_QLS = new Set(["COM-003-QL-011", "COM-003-QL-014", "COM-003-QL-017", "COM-003-QL-019"]);
const enById = new Map(COM003_ENGLISH_REVIEW_CORPUS_V16_2.map((q) => [q.questionId, q]));

assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V16_2.length, 228);
assert.equal(COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.sourceEnglishAuthorityId, "COM-003-ENGLISH-FREEZE-V2");
assert.equal(COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.hindiQuestionCount, 228);
assert.equal(COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.punjabiQuestionCount, 228);
assert.equal(COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.localizedQuestionCount, 456);
assert.equal(COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.questionLanguageArtifactCount, 684);

const diversity: Record<string, Record<string, { stems: number; explanations: number; englishExplanations: number }>> = {
  hi: {},
  pa: {},
};

for (const [language, items] of [
  ["hi", COM003_HINDI_LOCALIZATION_V2_CHAPTER],
  ["pa", COM003_PUNJABI_LOCALIZATION_V2_CHAPTER],
] as const) {
  assert.equal(items.length, 228, `${language}:chapter-count`);
  assert.equal(new Set(items.map((q) => q.localizationId)).size, 228, `${language}:localization-id-uniqueness`);
  assert.equal(new Set(items.map((q) => q.sourceQuestionId)).size, 228, `${language}:source-id-uniqueness`);

  for (const item of items) {
    const en = enById.get(item.sourceQuestionId);
    assert.ok(en, `${item.localizationId}:missing-english-source`);
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
    assert.ok(item.stem.trim().length >= 20, `${item.localizationId}:thin-stem`);
    assert.ok(item.explanation.trim().length >= 25, `${item.localizationId}:thin-explanation`);
    assert.equal(item.sourceEnglishFrozen, true);
    assert.equal(item.localizationReviewOnly, true);
    assert.equal(item.localizationFrozen, false);
    assert.equal(item.runtimeRegistered, false);
    assert.equal(item.productionReleased, false);
    if (language === "hi") {
      assert.equal(item.locale, "hi-IN");
      assert.match(item.stem, /[ऀ-ॿ]/, `${item.localizationId}:missing-devanagari-stem`);
      assert.match(item.explanation, /[ऀ-ॿ]/, `${item.localizationId}:missing-devanagari-explanation`);
    } else {
      assert.equal(item.locale, "pa-IN");
      assert.match(item.stem, /[਀-੿]/, `${item.localizationId}:missing-gurmukhi-stem`);
      assert.match(item.explanation, /[਀-੿]/, `${item.localizationId}:missing-gurmukhi-explanation`);
    }
    assert.doesNotMatch(
      item.explanation,
      /सही उत्तर है|ਸਹੀ ਉੱਤਰ ਹੈ|canonical fact|दिए गए तथ्य के अनुसार|ਦਿੱਤੇ ਤੱਥ ਅਨੁਸਾਰ/i,
      `${item.localizationId}:generic-explanation`,
    );
  }

  for (const qlId of QLS) {
    const localized = items.filter((q) => q.qlId === qlId);
    const english = COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((q) => q.qlId === qlId);
    assert.equal(localized.length, 12, `${language}:${qlId}:count`);
    assert.equal(english.length, 12, `${qlId}:english-count`);
    const stems = new Set(localized.map((q) => q.stem.trim().toLowerCase())).size;
    const explanations = new Set(localized.map((q) => q.explanation.trim().toLowerCase())).size;
    const englishExplanations = new Set(english.map((q) => q.explanation.trim().toLowerCase())).size;
    diversity[language]![qlId] = { stems, explanations, englishExplanations };
    assert.equal(stems, 12, `${language}:${qlId}:duplicate-stem`);
    if (HIGH_DIVERSITY_QLS.has(qlId)) {
      assert.equal(explanations, 12, `${language}:${qlId}:requires-12-unique-explanations`);
    } else {
      assert.ok(explanations >= 4, `${language}:${qlId}:requires-at-least-4-unique-explanations`);
    }
  }
}

const governance = COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.governance;
assert.equal(governance.localizationFrozen, false);
assert.equal(governance.chapterFreezeAuthorized, false);
assert.equal(governance.questionStudioRuntimeAuthorized, false);
assert.equal(governance.questionBankWritesAuthorized, false);
assert.equal(governance.testEligibilityAuthorized, false);
assert.equal(governance.mockTestEligibilityAuthorized, false);
assert.equal(governance.automaticPublicationAuthorized, false);
assert.equal(governance.publiclyPublishable, false);
assert.equal(governance.productionReleased, false);

console.log("[COM003-LOCALIZATION-V2-CHAPTER]", {
  english: 228,
  hindi: COM003_HINDI_LOCALIZATION_V2_CHAPTER.length,
  punjabi: COM003_PUNJABI_LOCALIZATION_V2_CHAPTER.length,
  diversity,
  governance,
});
