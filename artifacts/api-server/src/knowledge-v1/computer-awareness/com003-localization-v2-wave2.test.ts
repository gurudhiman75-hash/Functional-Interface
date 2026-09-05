import { strict as assert } from "node:assert";
import { COM003_ENGLISH_FREEZE_AUTHORITY_V2 } from "./com003-english-freeze-v2";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE2,
  COM003_LOCALIZATION_V2_WAVE2_AUTHORITY,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE2,
} from "./com003-localization-v2-wave2";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";

const QL_IDS = ["COM-003-QL-005","COM-003-QL-006","COM-003-QL-007","COM-003-QL-008","COM-003-QL-009"];
const ENGLISH = COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((q) => QL_IDS.includes(q.qlId));
const ENGLISH_BY_ID = new Map(ENGLISH.map((q) => [q.questionId, q]));

assert.equal(COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId, "COM-003-ENGLISH-FREEZE-V2");
assert.equal(COM003_LOCALIZATION_V2_WAVE2_AUTHORITY.sourceEnglishAuthorityId, COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId);
assert.equal(COM003_LOCALIZATION_V2_WAVE2_AUTHORITY.authorityId, "COM-003-LOCALIZATION-V2-WAVE2-CANDIDATE-1");
assert.equal(ENGLISH.length, 60);
assert.equal(COM003_HINDI_LOCALIZATION_V2_WAVE2.length, 60);
assert.equal(COM003_PUNJABI_LOCALIZATION_V2_WAVE2.length, 60);
assert.equal(COM003_LOCALIZATION_V2_WAVE2_AUTHORITY.localizedQuestionCount, 120);

const FEATURE_LABEL: Record<string, string> = {
  "com003-word-replace-purpose": "Replace",
  "com003-word-autocorrect-purpose": "AutoCorrect",
  "com003-word-grammar-check": "Grammar Check",
  "com003-word-find-purpose": "Find",
};

for (const [language, items] of [
  ["hi", COM003_HINDI_LOCALIZATION_V2_WAVE2],
  ["pa", COM003_PUNJABI_LOCALIZATION_V2_WAVE2],
] as const) {
  assert.equal(new Set(items.map((q) => q.localizationId)).size, 60, `${language}:duplicate-localization-id`);
  assert.equal(new Set(items.map((q) => q.sourceQuestionId)).size, 60, `${language}:duplicate-source-id`);
  for (const item of items) {
    const source = ENGLISH_BY_ID.get(item.sourceQuestionId);
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
    assert.equal(item.options.length, 4);
    assert.equal(new Set(item.options.map((v) => v.trim().toLowerCase())).size, 4, `${item.localizationId}:option-collision`);
    assert.equal(item.options[item.correctIndex], item.canonicalAnswer, `${item.localizationId}:answer-position`);
    assert.ok(item.stem.trim().length >= 24, `${item.localizationId}:thin-stem`);
    assert.ok(item.explanation.trim().length >= 24, `${item.localizationId}:thin-explanation`);
    assert.equal(item.localizationReviewOnly, true);
    assert.equal(item.localizationFrozen, false);
    assert.equal(item.runtimeRegistered, false);
    assert.equal(item.productionReleased, false);

    if (language === "hi") {
      assert.match(item.stem, /[\u0900-\u097F]/, `${item.localizationId}:missing-devanagari`);
      assert.match(item.explanation, /[\u0900-\u097F]/, `${item.localizationId}:missing-devanagari-explanation`);
      assert.doesNotMatch(item.stem, /दिए गए विकल्पों में से|सही विकल्प चुनते हुए|इस Computer Awareness प्रश्न में|परीक्षा के संदर्भ में/);
    } else {
      assert.match(item.stem, /[\u0A00-\u0A7F]/, `${item.localizationId}:missing-gurmukhi`);
      assert.match(item.explanation, /[\u0A00-\u0A7F]/, `${item.localizationId}:missing-gurmukhi-explanation`);
      assert.doesNotMatch(item.stem, /ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ|ਸਹੀ ਵਿਕਲਪ ਚੁਣਦੇ ਹੋਏ|ਇਸ Computer Awareness ਪ੍ਰਸ਼ਨ ਵਿੱਚ|ਪਰੀਖਿਆ ਦੇ ਸੰਦਰਭ ਵਿੱਚ/);
    }

    if (item.qlId === "COM-003-QL-005" && item.surfaceMode === "PURPOSE_FROM_FEATURE") {
      const label = FEATURE_LABEL[item.targetFactId];
      assert.ok(label, `${item.localizationId}:missing-feature-direction-contract`);
      assert.match(item.stem, new RegExp(label!, "i"), `${item.localizationId}:feature-name-missing`);
    }
    if (item.qlId === "COM-003-QL-006" && item.surfaceMode === "ORIENTATION_FROM_DIMENSIONS") {
      if (language === "hi") assert.match(item.stem, /चौड़ाई|ऊँचाई/);
      else assert.match(item.stem, /ਚੌੜਾਈ|ਉਚਾਈ/);
    }
    if (item.qlId === "COM-003-QL-008" && /address-(?:row|column)-part/.test(item.targetFactId)) {
      assert.match(item.stem, /B7/, `${item.localizationId}:address-example-lost`);
    }
    if (item.qlId === "COM-003-QL-009" && item.surfaceMode === "OPERATION_TO_OPERATOR") {
      const symbol = source!.canonicalAnswer;
      assert.ok(["+", "-", "*", "/"].includes(symbol));
      if (symbol === "-") assert.doesNotMatch(item.stem, /(?:^|\s)-(?:\s|$)/, `${item.localizationId}:operator-answer-leaked`);
      else assert.ok(!item.stem.includes(symbol), `${item.localizationId}:operator-answer-leaked`);
    }
  }
  for (const qlId of QL_IDS) {
    const qlItems = items.filter((q) => q.qlId === qlId);
    assert.equal(qlItems.length, 12, `${language}:${qlId}:count`);
    assert.equal(new Set(qlItems.map((q) => q.stem.trim().toLowerCase())).size, 12, `${language}:${qlId}:duplicate-stem`);
  }
}

for (let index = 0; index < 60; index += 1) {
  const en = ENGLISH[index]!, hi = COM003_HINDI_LOCALIZATION_V2_WAVE2[index]!, pa = COM003_PUNJABI_LOCALIZATION_V2_WAVE2[index]!;
  assert.equal(hi.sourceQuestionId, en.questionId);
  assert.equal(pa.sourceQuestionId, en.questionId);
  assert.equal(hi.correctIndex, pa.correctIndex);
  assert.equal(hi.targetFactId, pa.targetFactId);
  assert.equal(hi.surfaceMode, pa.surfaceMode);
}

const governance = COM003_LOCALIZATION_V2_WAVE2_AUTHORITY.governance;
assert.equal(governance.localizationFrozen, false);
assert.equal(governance.questionStudioRuntimeAuthorized, false);
assert.equal(governance.questionBankWritesAuthorized, false);
assert.equal(governance.testEligibilityAuthorized, false);
assert.equal(governance.mockTestEligibilityAuthorized, false);
assert.equal(governance.automaticPublicationAuthorized, false);
assert.equal(governance.publiclyPublishable, false);
assert.equal(governance.productionReleased, false);

console.log("[COM003-LOCALIZATION-V2-WAVE2]", {
  authority: COM003_LOCALIZATION_V2_WAVE2_AUTHORITY.authorityId,
  qls: QL_IDS.length, english: ENGLISH.length,
  hindi: COM003_HINDI_LOCALIZATION_V2_WAVE2.length,
  punjabi: COM003_PUNJABI_LOCALIZATION_V2_WAVE2.length,
  localized: COM003_LOCALIZATION_V2_WAVE2_AUTHORITY.localizedQuestionCount,
  runtimeAuthorized: governance.questionStudioRuntimeAuthorized,
});