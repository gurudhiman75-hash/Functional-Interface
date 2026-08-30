import assert from "node:assert/strict";

import {
  COM002_LOCALIZATION_VERSION_V3,
  localizeCom002QuestionV3,
} from "./com002-localization-v3";
import { generateCom002ReviewQuestionV4 } from "./com002-review-synthesis-v4";

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);
const languages = ["hi", "pa"] as const;

let audited = 0;
let ql004CoreDescriptionAudited = 0;
let ql013Audited = 0;

for (const qlId of qlIds) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `english-v4-localization-v3:${qlId}:${index}`;
    const english = generateCom002ReviewQuestionV4({ qlId, seed });

    for (const language of languages) {
      const question = localizeCom002QuestionV3({ qlId, seed, language });
      const replay = localizeCom002QuestionV3({ qlId, seed, language });

      assert.deepEqual(replay, question, `${qlId}/${seed}/${language}: V3 replay drift`);
      assert.equal(question.localizationV3.version, COM002_LOCALIZATION_VERSION_V3);
      assert.equal(
        question.localizationV3.englishGeneratorVersion,
        "COM-002-ENGLISH-GENERATOR-V4-CANDIDATE-1",
      );
      assert.equal(
        question.localizationV3.englishAuthorityStatus,
        "V4_CANDIDATE_EXECUTED_GREEN_AWAITING_EXPLICIT_APPROVAL",
      );
      assert.equal(question.localizationV3.englishQuestionId, english.questionId);
      assert.equal(question.localizationV3.editorialGrammarOverlayOnly, true);
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
      assert.equal("localizationV2" in question, false);
      assert.equal("lifecycleV2" in question, false);
      assert.equal(question.lifecycleV3.englishV4Approved, false);
      assert.equal(question.lifecycleV3.localizationFrozen, false);
      assert.equal(question.lifecycleV3.questionStudioActive, false);
      assert.equal(question.lifecycleV3.reviewRunPersistenceAllowed, false);
      assert.equal(question.lifecycleV3.canonicalQuestionPersistenceAllowed, false);
      assert.equal(question.lifecycleV3.questionBankWritable, false);
      assert.equal(question.lifecycleV3.testEligible, false);
      assert.equal(question.lifecycleV3.mockTestEligible, false);
      assert.equal(question.lifecycleV3.publiclyPublishable, false);
      assert.equal(question.lifecycleV3.productionReleaseAuthorized, false);

      if (language === "hi") {
        assert.match(question.stem, /[\u0900-\u097F]/u, `${qlId}/${seed}: Hindi stem missing Devanagari`);
        assert.match(question.explanation, /[\u0900-\u097F]/u, `${qlId}/${seed}: Hindi explanation missing Devanagari`);
        assert.doesNotMatch(
          `${question.stem}\n${question.explanation}`,
          /ना के लिए/u,
          `${qlId}/${seed}: Hindi purpose infinitive was not inflected`,
        );
      } else {
        assert.match(question.stem, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi stem missing Gurmukhi`);
        assert.match(question.explanation, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi explanation missing Gurmukhi`);
        assert.doesNotMatch(
          `${question.stem}\n${question.explanation}`,
          /(?:ਣਾ|ਨਾ) ਲਈ/u,
          `${qlId}/${seed}: Punjabi purpose infinitive was not inflected`,
        );
      }

      if (
        qlId === "COM-002-QL-004" &&
        english.surfaceMode === "COMPONENT_TO_ROLE" &&
        english.targetFactId === "com002-kernel-core"
      ) {
        ql004CoreDescriptionAudited += 1;
        assert.doesNotMatch(question.stem, language === "hi" ? /प्रमुख भूमिका/u : /ਮੁੱਖ ਭੂਮਿਕਾ/u);
        assert.match(
          question.explanation,
          language === "hi" ? /मुख्य घटक है।$/u : /ਮੁੱਖ ਘਟਕ ਹੈ।$/u,
        );
      }

      if (qlId === "COM-002-QL-013") {
        ql013Audited += 1;
      }

      audited += 1;
    }
  }
}

const knownSeed = "localization-human-review-v2:COM-002-QL-004";
for (const language of languages) {
  const known = localizeCom002QuestionV3({
    qlId: "COM-002-QL-004",
    seed: knownSeed,
    language,
  });
  assert.equal(known.targetFactId, "com002-kernel-core");
  assert.equal(known.surfaceMode, "COMPONENT_TO_ROLE");
  assert.match(
    known.explanation,
    language === "hi" ? /मुख्य घटक है।$/u : /ਮੁੱਖ ਘਟਕ ਹੈ।$/u,
  );
}

const purposeStemSeed = "english-v4-localization-v3:COM-002-QL-012:0";
const purposeStemHi = localizeCom002QuestionV3({
  qlId: "COM-002-QL-012",
  seed: purposeStemSeed,
  language: "hi",
});
const purposeStemPa = localizeCom002QuestionV3({
  qlId: "COM-002-QL-012",
  seed: purposeStemSeed,
  language: "pa",
});
assert.match(purposeStemHi.stem, /रीफ़्रेश करने के लिए/u);
assert.doesNotMatch(purposeStemHi.stem, /रीफ़्रेश करना के लिए/u);
assert.match(purposeStemPa.stem, /ਰਿਫ੍ਰੈਸ਼ ਕਰਨ ਲਈ/u);
assert.doesNotMatch(purposeStemPa.stem, /ਰਿਫ੍ਰੈਸ਼ ਕਰਨਾ ਲਈ/u);

assert.equal(audited, 1040);
assert.ok(ql004CoreDescriptionAudited > 0);
assert.equal(ql013Audited, 80);
console.log("[com002-localization-v3] PASS", {
  questions: audited,
  ql004CoreDescriptionAudited,
  ql013Audited,
  grammarOverlay: true,
  purposeStemRegressionLocked: true,
});
