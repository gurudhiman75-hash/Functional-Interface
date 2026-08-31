import assert from "node:assert/strict";

import { generateCom002ReviewQuestionV3 } from "./com002-review-synthesis-v3";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V4,
  generateCom002ReviewQuestionV4,
  listCom002ReviewV4QlIds,
} from "./com002-review-synthesis-v4";

function withoutId<T extends { questionId: string }>(value: T) {
  const { questionId: _questionId, ...rest } = value;
  return rest;
}

const qlIds = listCom002ReviewV4QlIds();
assert.equal(COM002_ENGLISH_GENERATOR_VERSION_V4, "COM-002-ENGLISH-GENERATOR-V4-CANDIDATE-1");
assert.equal(qlIds.length, 13);

let audited = 0;
let correctedCoreDescriptionCount = 0;

for (const qlId of qlIds) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `english-v4-candidate:${qlId}:${index}`;
    const v3 = generateCom002ReviewQuestionV3({ qlId, seed });
    const question = generateCom002ReviewQuestionV4({ qlId, seed });
    const replay = generateCom002ReviewQuestionV4({ qlId, seed });

    assert.deepEqual(replay, question, `${qlId}/${seed}: deterministic V4 replay drift`);
    assert.ok(question.questionId.endsWith("-V4"), `${qlId}/${seed}: V4 questionId missing`);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, false);

    const scopedCorrection =
      qlId === "COM-002-QL-004" &&
      v3.surfaceMode === "COMPONENT_TO_ROLE" &&
      v3.targetFactId === "com002-kernel-core";

    if (scopedCorrection) {
      correctedCoreDescriptionCount += 1;
      assert.equal(
        question.stem,
        "Which statement correctly identifies the kernel in an operating system?",
      );
      assert.equal(
        question.explanation,
        "The kernel is the core component of an operating system.",
      );
      assert.deepEqual(question.options, v3.options);
      assert.equal(question.correctIndex, v3.correctIndex);
      assert.equal(question.canonicalAnswer, v3.canonicalAnswer);
      assert.equal(question.targetFactId, v3.targetFactId);
      assert.deepEqual(question.sourceIds, v3.sourceIds);
      assert.deepEqual(question.sourceFactIds, v3.sourceFactIds);
      assert.equal(question.solverAuthority, v3.solverAuthority);
    } else {
      assert.deepEqual(
        withoutId(question),
        withoutId(v3),
        `${qlId}/${seed}: V4 drifted outside the one approved editorial correction`,
      );
    }

    audited += 1;
  }
}

const knownProblemSeed = "localization-human-review-v2:COM-002-QL-004";
const knownV3 = generateCom002ReviewQuestionV3({
  qlId: "COM-002-QL-004",
  seed: knownProblemSeed,
});
const knownV4 = generateCom002ReviewQuestionV4({
  qlId: "COM-002-QL-004",
  seed: knownProblemSeed,
});
assert.equal(knownV3.surfaceMode, "COMPONENT_TO_ROLE");
assert.equal(knownV3.targetFactId, "com002-kernel-core");
assert.match(knownV3.stem, /principal role/i);
assert.doesNotMatch(knownV4.stem, /principal role/i);
assert.equal(
  knownV4.stem,
  "Which statement correctly identifies the kernel in an operating system?",
);

assert.equal(audited, 520);
assert.ok(
  correctedCoreDescriptionCount > 0,
  "V4 520-question audit must exercise the scoped QL-004 core-description correction",
);

console.log("[COM002-REVIEW-SYNTHESIS-V4] PASS", {
  questions: audited,
  correctedCoreDescriptionCount,
  knownProblemSeedCorrected: true,
});
