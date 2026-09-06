import { strict as assert } from "node:assert";

import { generateCom001LocalizedReviewQuestionV2 } from "./com001-localization-v2";
import {
  generateCom001ReviewQuestionV2,
  listCom001ReviewV2QlIds,
} from "./com001-review-synthesis-v2";

const devanagariLetters = /[\u0904-\u0939\u0958-\u0961]/u;
const gurmukhiLetters = /[\u0A05-\u0A39\u0A59-\u0A5E]/u;
const forbiddenEnglishProse = [
  /Which of the following/iu,
  /Which storage/iu,
  /Identify the/iu,
  /How many .* are there in/iu,
  /is the correct answer/iu,
  /Therefore,/iu,
];

let audited = 0;
for (const qlId of listCom001ReviewV2QlIds()) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `localization-v2-audit:${qlId}:${index}`;
    const english = generateCom001ReviewQuestionV2({ qlId, seed });

    for (const language of ["hi", "pa"] as const) {
      audited += 1;
      const localized = generateCom001LocalizedReviewQuestionV2({ qlId, seed, language });
      const replay = generateCom001LocalizedReviewQuestionV2({ qlId, seed, language });

      assert.deepEqual(localized, replay, `${localized.questionId} ${language} replay drift`);
      assert.equal(localized.qlId, english.qlId);
      assert.deepEqual(localized.sourceIds, english.sourceIds);
      assert.deepEqual(localized.sourceFactIds, english.sourceFactIds);
      assert.equal(localized.solverAuthority, english.solverAuthority);
      assert.equal(localized.reviewV2Mode, english.reviewV2Mode);
      assert.equal(localized.relationalSurfaceMode, english.relationalSurfaceMode);
      assert.equal(localized.capacityConvention, english.capacityConvention);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.options.length, english.options.length);
      assert.equal(new Set(localized.options).size, localized.options.length);
      assert.equal(localized.canonicalAnswer, localized.options[localized.correctIndex]);
      assert.equal(localized.localizationV2.englishQuestionId, english.questionId);
      assert.equal(localized.localizationV2.semanticStateInvariant, true);
      assert.equal(localized.localizationV2.optionOrderInvariant, true);
      assert.equal(localized.localizationV2.correctIndexInvariant, true);
      assert.equal(localized.lifecycleV2.localizationReviewOnly, true);
      assert.equal(localized.lifecycleV2.questionStudioV2Active, false);
      assert.equal(localized.lifecycleV2.questionBankWritable, false);
      assert.equal(localized.lifecycleV2.testEligible, false);
      assert.equal(localized.lifecycleV2.publiclyPublishable, false);

      if (language === "hi") {
        assert.equal(devanagariLetters.test(localized.stem), true, `${localized.questionId} lacks Hindi script`);
        assert.equal(gurmukhiLetters.test(localized.stem), false, `${localized.questionId} leaks Gurmukhi into Hindi`);
      } else {
        assert.equal(gurmukhiLetters.test(localized.stem), true, `${localized.questionId} lacks Punjabi script`);
        assert.equal(devanagariLetters.test(localized.stem), false, `${localized.questionId} leaks Devanagari letters into Punjabi`);
      }

      for (const pattern of forbiddenEnglishProse) {
        assert.equal(pattern.test(localized.stem), false, `${localized.questionId} ${language} leaks English stem prose`);
        assert.equal(pattern.test(localized.explanation), false, `${localized.questionId} ${language} leaks English explanation prose`);
      }

      if (qlId === "COM-001-QL-007") {
        assert.equal(localized.options.some((option) => /RDX/u.test(option)), false);
      }
      if (qlId === "COM-001-QL-009" && english.capacityConvention === "TRADITIONAL_EXAM_1024") {
        assert.equal(/\bKiB\b|\bMiB\b|\bGiB\b/u.test(localized.stem), false);
        if (!english.sourceFactIds.includes("com001-exam-byte-bits")) {
          assert.equal(/1024/u.test(localized.explanation), true);
        }
      }
    }
  }
}

assert.equal(audited, 720);

for (const qlId of ["COM-001-QL-001", "COM-001-QL-002", "COM-001-QL-003", "COM-001-QL-004", "COM-001-QL-005"]) {
  const modes = new Set<string>();
  for (let index = 0; index < 80; index += 1) {
    const question = generateCom001LocalizedReviewQuestionV2({
      qlId,
      seed: `localization-v2-surface:${qlId}:${index}`,
      language: "hi",
    });
    if (question.relationalSurfaceMode) modes.add(question.relationalSurfaceMode);
  }
  assert.equal(modes.size >= 2, true, `${qlId} localization did not exercise both relational directions`);
}
