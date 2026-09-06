import assert from "node:assert/strict";

import { generateCom002ReviewQuestionV4 } from "./com002-review-synthesis-v4";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V5,
  generateCom002ReviewQuestionV5,
  listCom002ReviewV5QlIds,
} from "./com002-review-synthesis-v5";

const qlIds = listCom002ReviewV5QlIds();
assert.equal(COM002_ENGLISH_GENERATOR_VERSION_V5, "COM-002-ENGLISH-GENERATOR-V5-SIMPLIFIED-APPROVED-1");
assert.equal(qlIds.length, 13);

const bannedHardPhrases = [
  /primarily associated with which software/i,
  /Select the activity that belongs to operating-system resource management/i,
  /principal role/i,
  /described as follows: browse and manage files/i,
  /What is the effect of the Delete operation/i,
  /What is the purpose of the Restore action/i,
  /Consider the following statements/i,
];

let audited = 0;
let learnerFacingChanged = 0;
let kernelCoreDescriptionCases = 0;

for (const qlId of qlIds) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `english-v5-candidate:${qlId}:${index}`;
    const v4 = generateCom002ReviewQuestionV4({ qlId, seed });
    const question = generateCom002ReviewQuestionV5({ qlId, seed });
    const replay = generateCom002ReviewQuestionV5({ qlId, seed });

    assert.deepEqual(replay, question, `${qlId}/${seed}: deterministic V5 replay drift`);
    assert.ok(question.questionId.endsWith("-V5"), `${qlId}/${seed}: V5 questionId missing`);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);

    // V5 is editorial only: semantic ownership/provenance must remain identical to V4.
    assert.equal(question.qlId, v4.qlId);
    assert.equal(question.cpId, v4.cpId);
    assert.equal(question.surfaceMode, v4.surfaceMode);
    assert.equal(question.targetFactId, v4.targetFactId);
    assert.equal(question.correctIndex, v4.correctIndex);
    assert.deepEqual(question.sourceIds, v4.sourceIds);
    assert.deepEqual(question.sourceFactIds, v4.sourceFactIds);
    assert.equal(question.solverAuthority, v4.solverAuthority);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, false);

    for (const pattern of bannedHardPhrases) {
      assert.doesNotMatch(question.stem, pattern, `${qlId}/${seed}: hard-language stem survived V5`);
    }

    if (
      question.qlId === "COM-002-QL-004" &&
      question.surfaceMode === "COMPONENT_TO_ROLE" &&
      question.targetFactId === "com002-kernel-core"
    ) {
      assert.equal(
        question.stem,
        "Which statement correctly describes the kernel in an operating system?",
        `${qlId}/${seed}: kernel-core fact must remain a description question, not a role question`,
      );
      assert.equal(question.explanation, "The kernel is the core component of an operating system.");
      kernelCoreDescriptionCases += 1;
    }

    if (
      question.stem !== v4.stem ||
      question.explanation !== v4.explanation ||
      question.canonicalAnswer !== v4.canonicalAnswer ||
      question.options.some((option, optionIndex) => option !== v4.options[optionIndex])
    ) {
      learnerFacingChanged += 1;
    }

    audited += 1;
  }
}

assert.equal(audited, 520);
assert.ok(learnerFacingChanged > 100, "V5 simplification must materially affect the learner-facing corpus");
assert.ok(kernelCoreDescriptionCases > 0, "V5 audit must exercise kernel-core COMPONENT_TO_ROLE cases");

console.log("[COM002-REVIEW-SYNTHESIS-V5] PASS", {
  questions: audited,
  learnerFacingChanged,
  kernelCoreDescriptionCases,
  semanticProvenancePreserved: true,
  simplifiedLanguage: true,
});
