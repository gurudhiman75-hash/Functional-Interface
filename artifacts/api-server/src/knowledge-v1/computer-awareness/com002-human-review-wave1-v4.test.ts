import assert from "node:assert/strict";

import { COM002_EDITORIALLY_APPROVED_FACTS } from "./com002-editorial-review";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V4,
  generateCom002ReviewQuestionV4,
} from "./com002-review-synthesis-v4";

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);
const safeQ13Relations = new Set([
  "license_class",
  "file_operation_effect",
  "extension_file_type",
  "shortcut_action",
]);

let number = 0;
for (const qlId of qlIds) {
  for (const suffix of ["A", "B"] as const) {
    number += 1;
    const seed = `human-review-wave1:${qlId}:${suffix}`;
    const question = generateCom002ReviewQuestionV4({ qlId, seed });
    const replay = generateCom002ReviewQuestionV4({ qlId, seed });
    assert.deepEqual(replay, question);
    assert.ok(question.questionId.endsWith("-V4"));
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);

    if (
      qlId === "COM-002-QL-004" &&
      question.surfaceMode === "COMPONENT_TO_ROLE" &&
      question.targetFactId === "com002-kernel-core"
    ) {
      assert.equal(
        question.stem,
        "Which statement correctly identifies the kernel in an operating system?",
      );
      assert.doesNotMatch(question.stem, /principal role/i);
    }

    if (qlId === "COM-002-QL-013") {
      for (const factId of question.sourceFactIds) {
        const fact = COM002_EDITORIALLY_APPROVED_FACTS.find((candidate) => candidate.factId === factId);
        assert.ok(fact);
        assert.ok(safeQ13Relations.has(fact!.relation));
      }
    }

    console.log(`\n[COM002-HUMAN-REVIEW-V4] Q${String(number).padStart(2, "0")} ${qlId} ${question.surfaceMode}`);
    console.log(`Generator: ${COM002_ENGLISH_GENERATOR_VERSION_V4}`);
    console.log(`Seed: ${seed}`);
    console.log(question.stem);
    question.options.forEach((option, index) => {
      console.log(`${String.fromCharCode(65 + index)}. ${option}${index === question.correctIndex ? "  <-- CORRECT" : ""}`);
    });
    console.log(`Answer: ${question.canonicalAnswer}`);
    console.log(`Explanation: ${question.explanation}`);
    console.log(`Sources: ${question.sourceIds.join(", ")}`);
    console.log(`Facts: ${question.sourceFactIds.join(", ")}`);
  }
}

assert.equal(number, 26);
console.log(`\n[com002-human-review-wave1-v4] PASS questions=${number}`);
