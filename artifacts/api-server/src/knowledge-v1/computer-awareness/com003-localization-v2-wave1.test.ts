import { strict as assert } from "node:assert";
import { COM003_ENGLISH_FREEZE_AUTHORITY_V2 } from "./com003-english-freeze-v2";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE1,
  COM003_LOCALIZATION_V2_WAVE1_AUTHORITY,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE1,
} from "./com003-localization-v2-wave1";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";

const qlIds = ["COM-003-QL-001", "COM-003-QL-002", "COM-003-QL-003", "COM-003-QL-004"];
const english = COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((q) => qlIds.includes(q.qlId));
const enById = new Map(english.map((q) => [q.questionId, q]));

assert.equal(COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId, "COM-003-ENGLISH-FREEZE-V2");
assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY.sourceEnglishAuthorityId, COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId);
assert.equal(english.length, 48);
assert.equal(COM003_HINDI_LOCALIZATION_V2_WAVE1.length, 48);
assert.equal(COM003_PUNJABI_LOCALIZATION_V2_WAVE1.length, 48);
assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY.localizedQuestionCount, 96);

for (const [language, items] of [
  ["hi", COM003_HINDI_LOCALIZATION_V2_WAVE1],
  ["pa", COM003_PUNJABI_LOCALIZATION_V2_WAVE1],
] as const) {
  assert.equal(new Set(items.map((q) => q.localizationId)).size, 48, `${language}:duplicate-localization-id`);
  assert.equal(new Set(items.map((q) => q.sourceQuestionId)).size, 48, `${language}:duplicate-source-id`);

  for (const item of items) {
    const source = enById.get(item.sourceQuestionId);
    assert.ok(source, `${language}:${item.localizationId}:unknown-source`);
    assert.equal(item.sourceEnglishAuthorityId, COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId);
    assert.equal(item.qlId, source!.qlId);
    assert.equal(item.cpId, source!.cpId);
    assert.equal(item.examSurfaceFamily, source!.examSurfaceFamily);
    assert.equal(item.surfaceMode, source!.surfaceMode);
    assert.equal(item.targetFactId, source!.targetFactId);
    assert.equal(item.correctIndex, source!.correctIndex);
    assert.deepEqual(item.sourceIds, source!.sourceIds);
    assert.deepEqual(item.sourceFactIds, source!.sourceFactIds);
    assert.equal(item.versionScoped, source!.versionScoped);
    assert.equal(item.solverAuthority, source!.solverAuthority);
    assert.equal(item.options.length, source!.options.length);
    assert.equal(new Set(item.options.map((v) => v.trim().toLowerCase())).size, item.options.length, `${item.localizationId}:option-collision`);
    assert.equal(item.options[item.correctIndex], item.canonicalAnswer, `${item.localizationId}:answer-position`);
    assert.ok(item.stem.trim().length >= 18, `${item.localizationId}:thin-stem`);
    assert.ok(item.explanation.trim().length >= 18, `${item.localizationId}:thin-explanation`);
    assert.equal(item.localizationReviewOnly, true);
    assert.equal(item.localizationFrozen, false);
    assert.equal(item.runtimeRegistered, false);
    assert.equal(item.productionReleased, false);
    if (language === "hi") {
      assert.match(item.stem, /[\u0900-\u097F]/, `${item.localizationId}:missing-devanagari`);
      assert.doesNotMatch(item.stem, /दिए गए विकल्पों में से|सही विकल्प चुनते हुए|इस Computer Awareness प्रश्न में|परीक्षा के संदर्भ में/);
    } else {
      assert.match(item.stem, /[\u0A00-\u0A7F]/, `${item.localizationId}:missing-gurmukhi`);
      assert.doesNotMatch(item.stem, /ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ|ਸਹੀ ਵਿਕਲਪ ਚੁਣਦੇ ਹੋਏ|ਇਸ Computer Awareness ਪ੍ਰਸ਼ਨ ਵਿੱਚ|ਪਰੀਖਿਆ ਦੇ ਸੰਦਰਭ ਵਿੱਚ/);
    }
    if (item.versionScoped && /SHORTCUT/i.test(item.surfaceMode)) {
      assert.match(item.stem, /Windows desktop/, `${item.localizationId}:lost-version-context`);
    }
  }

  for (const qlId of qlIds) {
    const qlItems = items.filter((q) => q.qlId === qlId);
    assert.equal(qlItems.length, 12, `${language}:${qlId}:count`);
    assert.equal(new Set(qlItems.map((q) => q.stem.trim().toLowerCase())).size, 12, `${language}:${qlId}:duplicate-stem`);
  }
}

for (let index = 0; index < 48; index += 1) {
  assert.equal(COM003_HINDI_LOCALIZATION_V2_WAVE1[index]!.sourceQuestionId, english[index]!.questionId);
  assert.equal(COM003_PUNJABI_LOCALIZATION_V2_WAVE1[index]!.sourceQuestionId, english[index]!.questionId);
  assert.equal(COM003_HINDI_LOCALIZATION_V2_WAVE1[index]!.correctIndex, COM003_PUNJABI_LOCALIZATION_V2_WAVE1[index]!.correctIndex);
}

console.log("[COM003-LOCALIZATION-V2-WAVE1]", {
  sourceAuthority: COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
  qls: qlIds.length,
  english: english.length,
  hindi: COM003_HINDI_LOCALIZATION_V2_WAVE1.length,
  punjabi: COM003_PUNJABI_LOCALIZATION_V2_WAVE1.length,
  localized: COM003_LOCALIZATION_V2_WAVE1_AUTHORITY.localizedQuestionCount,
  runtimeAuthorized: COM003_LOCALIZATION_V2_WAVE1_AUTHORITY.governance.questionStudioRuntimeAuthorized,
});
