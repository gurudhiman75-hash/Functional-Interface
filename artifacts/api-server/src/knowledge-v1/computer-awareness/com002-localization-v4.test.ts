import assert from "node:assert/strict";

import { COM002_ENGLISH_FREEZE_AUTHORITY_V5 } from "./com002-english-freeze-v5";
import {
  COM002_LOCALIZATION_VERSION_V4,
  localizeCom002QuestionV4,
} from "./com002-localization-v4";
import { generateCom002ReviewQuestionV5 } from "./com002-review-synthesis-v5";

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);
const languages = ["hi", "pa"] as const;

let audited = 0;
let ql004KernelCoreAudited = 0;
let ql013Audited = 0;

for (const qlId of qlIds) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `english-v5-localization-v4:${qlId}:${index}`;
    const english = generateCom002ReviewQuestionV5({ qlId, seed });

    for (const language of languages) {
      const question = localizeCom002QuestionV4({ qlId, seed, language });
      const replay = localizeCom002QuestionV4({ qlId, seed, language });

      assert.deepEqual(replay, question, `${qlId}/${seed}/${language}: V4 replay drift`);
      assert.equal(question.localizationV4.version, COM002_LOCALIZATION_VERSION_V4);
      assert.equal(question.localizationV4.englishGeneratorVersion, "COM-002-ENGLISH-GENERATOR-V5-SIMPLIFIED-APPROVED-1");
      assert.equal(question.localizationV4.englishFreezeAuthorityId, COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId);
      assert.equal(question.localizationV4.englishCombinedFingerprint, COM002_ENGLISH_FREEZE_AUTHORITY_V5.fingerprints.combinedFingerprint);
      assert.equal(question.localizationV4.englishQuestionId, english.questionId);
      assert.equal(question.localizationV4.localizedLearnerSurfaceInheritedFromGrammarPolishedV3, true);
      assert.equal(question.localizationV4.v5EnglishSimplificationIsSemanticNoOpForLocalization, true);
      assert.equal(question.qlId, english.qlId);
      assert.equal(question.cpId, english.cpId);
      assert.equal(question.surfaceMode, english.surfaceMode);
      assert.equal(question.targetFactId, english.targetFactId);
      assert.deepEqual(question.sourceIds, english.sourceIds);
      assert.deepEqual(question.sourceFactIds, english.sourceFactIds);
      assert.equal(question.solverAuthority, english.solverAuthority);
      assert.equal(question.correctIndex, english.correctIndex);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
      assert.equal(question.reviewOnly, true);
      assert.equal(question.runtimeRegistered, false);
      assert.equal("localizationV3" in question, false);
      assert.equal("lifecycleV3" in question, false);
      assert.equal(question.lifecycleV4.englishV5Frozen, true);
      assert.equal(question.lifecycleV4.localizationHumanReviewAccepted, false);
      assert.equal(question.lifecycleV4.localizationFingerprintsPinned, false);
      assert.equal(question.lifecycleV4.localizationFrozen, false);
      assert.equal(question.lifecycleV4.questionStudioActive, false);
      assert.equal(question.lifecycleV4.reviewRunPersistenceAllowed, false);
      assert.equal(question.lifecycleV4.canonicalQuestionPersistenceAllowed, false);
      assert.equal(question.lifecycleV4.questionBankWritable, false);
      assert.equal(question.lifecycleV4.testEligible, false);
      assert.equal(question.lifecycleV4.mockTestEligible, false);
      assert.equal(question.lifecycleV4.publiclyPublishable, false);
      assert.equal(question.lifecycleV4.productionReleaseAuthorized, false);

      if (language === "hi") {
        assert.match(question.stem, /[\u0900-\u097F]/u, `${qlId}/${seed}: Hindi stem missing Devanagari`);
        assert.match(question.explanation, /[\u0900-\u097F]/u, `${qlId}/${seed}: Hindi explanation missing Devanagari`);
        assert.doesNotMatch(`${question.stem}\n${question.explanation}`, /ना के लिए/u);
      } else {
        assert.match(question.stem, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi stem missing Gurmukhi`);
        assert.match(question.explanation, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi explanation missing Gurmukhi`);
        assert.doesNotMatch(`${question.stem}\n${question.explanation}`, /(?:ਣਾ|ਨਾ) ਲਈ/u);
      }

      if (
        qlId === "COM-002-QL-004" &&
        english.targetFactId === "com002-kernel-core"
      ) {
        ql004KernelCoreAudited += 1;
        assert.match(question.explanation, language === "hi" ? /मुख्य घटक है।$/u : /ਮੁੱਖ ਘਟਕ ਹੈ।$/u);
      }

      if (qlId === "COM-002-QL-013") ql013Audited += 1;
      audited += 1;
    }
  }
}

// Explicitly prove that the exact approved English V5 seeds can be rebound
// without changing answer position or semantic provenance.
for (const suffix of ["A", "B"] as const) {
  const seed = `human-review-wave1:COM-002-QL-004:${suffix}`;
  const english = generateCom002ReviewQuestionV5({ qlId: "COM-002-QL-004", seed });
  for (const language of languages) {
    const localized = localizeCom002QuestionV4({ qlId: "COM-002-QL-004", seed, language });
    assert.equal(localized.correctIndex, english.correctIndex);
    assert.deepEqual(localized.sourceFactIds, english.sourceFactIds);
    assert.equal(localized.targetFactId, english.targetFactId);
  }
}

assert.equal(audited, 1040);
assert.ok(ql004KernelCoreAudited > 0);
assert.equal(ql013Audited, 80);
console.log("[com002-localization-v4] PASS", {
  questions: audited,
  englishFreeze: COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId,
  ql004KernelCoreAudited,
  ql013Audited,
  inheritedGrammarPolish: true,
  v5SemanticRebind: true,
});
