import assert from "node:assert/strict";

import { COM002_EDITORIALLY_APPROVED_FACTS } from "./com002-editorial-review";
import { localizeCom002QuestionEditorialV1 } from "./com002-localization-editorial-v1";
import {
  COM002_LOCALIZATION_VERSION_V2,
  localizeCom002QuestionV2,
} from "./com002-localization-v2";
import { generateCom002ReviewQuestionV3 } from "./com002-review-synthesis-v3";

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);
const languages = ["hi", "pa"] as const;
const safeQ13Relations = new Set([
  "license_class",
  "file_operation_effect",
  "extension_file_type",
  "shortcut_action",
]);

function v1Surface(question: ReturnType<typeof localizeCom002QuestionEditorialV1>) {
  return {
    language: question.language,
    locale: question.locale,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
    explanation: question.explanation,
  };
}

function v2Surface(question: ReturnType<typeof localizeCom002QuestionV2>) {
  return {
    language: question.language,
    locale: question.locale,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
    explanation: question.explanation,
  };
}

let audited = 0;
let ql004Audited = 0;
let ql013Audited = 0;

for (const qlId of qlIds) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `english-v3-localization-v2:${qlId}:${index}`;
    const english = generateCom002ReviewQuestionV3({ qlId, seed });

    for (const language of languages) {
      const localized = localizeCom002QuestionV2({ qlId, seed, language });
      const replay = localizeCom002QuestionV2({ qlId, seed, language });

      assert.deepEqual(replay, localized, `${qlId}/${seed}/${language}: localization V2 replay drift`);
      assert.equal(localized.localizationV2.version, COM002_LOCALIZATION_VERSION_V2);
      assert.equal(localized.localizationV2.englishGeneratorVersion, "COM-002-ENGLISH-GENERATOR-V3-CANDIDATE-1");
      assert.equal(localized.localizationV2.englishAuthorityStatus, "V3_CANDIDATE_AWAITING_EXECUTION_AND_EXPLICIT_APPROVAL");
      assert.equal(localized.localizationV2.englishQuestionId, english.questionId);
      assert.equal(localized.qlId, english.qlId);
      assert.equal(localized.cpId, english.cpId);
      assert.equal(localized.surfaceMode, english.surfaceMode);
      assert.equal(localized.targetFactId, english.targetFactId);
      assert.deepEqual(localized.sourceIds, english.sourceIds);
      assert.deepEqual(localized.sourceFactIds, english.sourceFactIds);
      assert.equal(localized.solverAuthority, english.solverAuthority);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.options.length, 4);
      assert.equal(new Set(localized.options).size, 4);
      assert.equal(localized.options[localized.correctIndex], localized.canonicalAnswer);
      assert.equal(localized.reviewOnly, true);
      assert.equal(localized.runtimeRegistered, false);
      assert.equal(localized.lifecycleV2.englishV3Approved, false);
      assert.equal(localized.lifecycleV2.localizationReviewOnly, true);
      assert.equal(localized.lifecycleV2.localizationFrozen, false);
      assert.equal(localized.lifecycleV2.questionStudioActive, false);
      assert.equal(localized.lifecycleV2.reviewRunPersistenceAllowed, false);
      assert.equal(localized.lifecycleV2.canonicalQuestionPersistenceAllowed, false);
      assert.equal(localized.lifecycleV2.questionBankWritable, false);
      assert.equal(localized.lifecycleV2.testEligible, false);
      assert.equal(localized.lifecycleV2.mockTestEligible, false);
      assert.equal(localized.lifecycleV2.publiclyPublishable, false);
      assert.equal(localized.lifecycleV2.productionReleaseAuthorized, false);
      assert.equal("localizationV1" in localized, false);
      assert.equal("lifecycleV1" in localized, false);

      if (language === "hi") {
        assert.match(localized.stem, /[\u0900-\u097F]/u, `${qlId}/${seed}: Hindi stem missing Devanagari prose`);
        assert.match(localized.explanation, /[\u0900-\u097F]/u, `${qlId}/${seed}: Hindi explanation missing Devanagari prose`);
      } else {
        assert.match(localized.stem, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi stem missing Gurmukhi prose`);
        assert.match(localized.explanation, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi explanation missing Gurmukhi prose`);
      }

      assert.doesNotMatch(localized.stem, /^(Which|What|Identify|Select|Consider)\b/u);

      if (qlId !== "COM-002-QL-004" && qlId !== "COM-002-QL-013") {
        const historical = localizeCom002QuestionEditorialV1({ qlId, seed, language });
        assert.deepEqual(
          v2Surface(localized),
          v1Surface(historical),
          `${qlId}/${seed}/${language}: localization V2 drifted outside V3 safety scope`,
        );
      }

      if (qlId === "COM-002-QL-004") {
        ql004Audited += 1;
        if (english.surfaceMode === "CORE_COMPONENT") {
          assert.equal(english.targetFactId, "com002-kernel-core");
          assert.match(
            localized.explanation,
            language === "hi" ? /मुख्य घटक है/u : /ਮੁੱਖ ਘਟਕ ਹੈ/u,
          );
        }
        if (english.surfaceMode === "COMPONENT_TO_ROLE") {
          assert.match(
            localized.stem,
            language === "hi" ? /प्रमुख भूमिका/u : /ਮੁੱਖ ਭੂਮਿਕਾ/u,
          );
        }
      }

      if (qlId === "COM-002-QL-013") {
        ql013Audited += 1;
        for (const factId of localized.sourceFactIds) {
          const fact = COM002_EDITORIALLY_APPROVED_FACTS.find((candidate) => candidate.factId === factId);
          assert.ok(fact, `${seed}: unknown localized QL-013 fact ${factId}`);
          assert.ok(safeQ13Relations.has(fact!.relation), `${seed}: unsafe localized QL-013 relation ${fact!.relation}`);
        }
        assert.doesNotMatch(localized.stem, /macOS.*mobile/u);
      }

      audited += 1;
    }
  }
}

assert.equal(audited, 1040);
assert.equal(ql004Audited, 80);
assert.equal(ql013Audited, 80);
console.log(`[com002-localization-v2] PASS questions=${audited} ql004=${ql004Audited} ql013=${ql013Audited}`);
