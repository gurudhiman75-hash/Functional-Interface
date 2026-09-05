import { strict as assert } from "node:assert";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE1_V2,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V2,
} from "./com003-localization-v2-wave1-v2";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE1_V3,
  COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V3,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V3,
} from "./com003-localization-v2-wave1-v3";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";

const QLS = ["COM-003-QL-001", "COM-003-QL-002", "COM-003-QL-003", "COM-003-QL-004"];
const EN = COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((q) => QLS.includes(q.qlId));
const EN_BY_ID = new Map(EN.map((q) => [q.questionId, q]));

assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V3.authorityId, "COM-003-LOCALIZATION-V2-WAVE1-CANDIDATE-3");
assert.equal(COM003_HINDI_LOCALIZATION_V2_WAVE1_V3.length, 48);
assert.equal(COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V3.length, 48);
assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V3.localizedQuestionCount, 96);

for (const [language, before, after] of [
  ["hi", COM003_HINDI_LOCALIZATION_V2_WAVE1_V2, COM003_HINDI_LOCALIZATION_V2_WAVE1_V3],
  ["pa", COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V2, COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V3],
] as const) {
  assert.equal(new Set(after.map((q) => q.localizationId)).size, 48, `${language}:duplicate-id`);
  assert.equal(new Set(after.map((q) => q.sourceQuestionId)).size, 48, `${language}:duplicate-source`);

  for (let index = 0; index < after.length; index += 1) {
    const oldItem = before[index]!;
    const item = after[index]!;
    const source = EN_BY_ID.get(item.sourceQuestionId);
    assert.ok(source, `${language}:${item.localizationId}:missing-source`);
    assert.equal(item.sourceQuestionId, oldItem.sourceQuestionId);
    assert.equal(item.qlId, oldItem.qlId);
    assert.equal(item.cpId, oldItem.cpId);
    assert.equal(item.examSurfaceFamily, oldItem.examSurfaceFamily);
    assert.equal(item.surfaceMode, oldItem.surfaceMode);
    assert.equal(item.targetFactId, oldItem.targetFactId);
    assert.deepEqual(item.options, oldItem.options);
    assert.equal(item.correctIndex, oldItem.correctIndex);
    assert.equal(item.canonicalAnswer, oldItem.canonicalAnswer);
    assert.equal(item.explanation, oldItem.explanation);
    assert.deepEqual(item.sourceIds, oldItem.sourceIds);
    assert.deepEqual(item.sourceFactIds, oldItem.sourceFactIds);
    assert.equal(item.versionScoped, oldItem.versionScoped);
    assert.equal(item.solverAuthority, oldItem.solverAuthority);
    assert.equal(item.correctIndex, source!.correctIndex);
    assert.equal(item.qlId, source!.qlId);
    assert.equal(item.cpId, source!.cpId);
    assert.equal(item.targetFactId, source!.targetFactId);
    assert.equal(item.surfaceMode, source!.surfaceMode);
    assert.equal(item.options[item.correctIndex], item.canonicalAnswer, `${item.localizationId}:answer-position`);
    assert.equal(new Set(item.options.map((v) => v.trim().toLowerCase())).size, 4, `${item.localizationId}:option-collision`);
    assert.ok(item.stem.trim().length >= 18, `${item.localizationId}:thin-stem`);
    assert.ok(item.explanation.trim().length >= 18, `${item.localizationId}:thin-explanation`);

    if (language === "hi") {
      assert.match(item.stem, /[\u0900-\u097F]/, `${item.localizationId}:missing-devanagari`);
      assert.doesNotMatch(item.stem, /\b(?:duplicates|stores|removes|open the|save the)\b/i, `${item.localizationId}:english-sentence-leak`);
      assert.doesNotMatch(item.stem, /(?:बनाना|करना|खुलती है) के लिए/, `${item.localizationId}:infinitive-postposition-grammar`);
      assert.doesNotMatch(item.stem, /करता है वाला Word कमांड|डालता है वाला Word कमांड|रखता है.*वाला Word कमांड/, `${item.localizationId}:effect-wala-construction`);
    } else {
      assert.match(item.stem, /[\u0A00-\u0A7F]/, `${item.localizationId}:missing-gurmukhi`);
      assert.doesNotMatch(item.stem, /\b(?:duplicates|stores|removes|open the|save the)\b/i, `${item.localizationId}:english-sentence-leak`);
      assert.doesNotMatch(item.stem, /(?:ਬਣਾਉਣਾ|ਕਰਨਾ|ਖੁੱਲ੍ਹਦੀ ਹੈ) ਲਈ/, `${item.localizationId}:infinitive-postposition-grammar`);
      assert.doesNotMatch(item.stem, /ਕਰਦਾ ਹੈ ਵਾਲਾ Word ਕਮਾਂਡ|ਪਾਂਦਾ ਹੈ ਵਾਲਾ Word ਕਮਾਂਡ|ਰੱਖਦਾ ਹੈ.*ਵਾਲਾ Word ਕਮਾਂਡ/, `${item.localizationId}:effect-wala-construction`);
    }

    if (item.versionScoped && /SHORTCUT/i.test(item.surfaceMode)) {
      assert.match(item.stem, /Windows desktop/, `${item.localizationId}:lost-version-context`);
    }
    assert.equal(item.localizationReviewOnly, true);
    assert.equal(item.localizationFrozen, false);
    assert.equal(item.runtimeRegistered, false);
    assert.equal(item.productionReleased, false);
  }

  for (const qlId of QLS) {
    const items = after.filter((q) => q.qlId === qlId);
    assert.equal(items.length, 12, `${language}:${qlId}:count`);
    assert.equal(new Set(items.map((q) => q.stem.trim().toLowerCase())).size, 12, `${language}:${qlId}:duplicate-stem`);
  }
}

assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V3.governance.localizationFrozen, false);
assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V3.governance.questionStudioRuntimeAuthorized, false);
assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V3.governance.questionBankWritesAuthorized, false);
assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V3.governance.testEligibilityAuthorized, false);
assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V3.governance.automaticPublicationAuthorized, false);

console.log("[COM003-LOCALIZATION-V2-WAVE1-V3]", {
  authority: COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V3.authorityId,
  qls: QLS.length,
  questionsPerLanguage: 48,
  localized: 96,
  uniqueHindiStems: new Set(COM003_HINDI_LOCALIZATION_V2_WAVE1_V3.map((q) => q.stem)).size,
  uniquePunjabiStems: new Set(COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V3.map((q) => q.stem)).size,
  runtimeAuthorized: false,
});
