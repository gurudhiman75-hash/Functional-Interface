import assert from "node:assert/strict";

import { generateCom002ReviewQuestionV5 } from "./com002-review-synthesis-v5";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V6,
  generateCom002ReviewQuestionV6,
  listCom002ReviewV6QlIds,
} from "./com002-review-synthesis-v6";

const qlIds = listCom002ReviewV6QlIds();
assert.equal(COM002_ENGLISH_GENERATOR_VERSION_V6, "COM-002-ENGLISH-GENERATOR-V6-ERRATA-REVIEW-CANDIDATE-1");
assert.equal(qlIds.length, 13);

let audited = 0;
let repairedSurfaces = 0;

for (const qlId of qlIds) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `english-v6-candidate:${qlId}:${index}`;
    const v5 = generateCom002ReviewQuestionV5({ qlId, seed });
    const question = generateCom002ReviewQuestionV6({ qlId, seed });
    const replay = generateCom002ReviewQuestionV6({ qlId, seed });

    assert.deepEqual(replay, question, `${qlId}/${seed}: deterministic V6 replay drift`);
    assert.ok(question.questionId.endsWith("-V6"), `${qlId}/${seed}: V6 questionId missing`);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);

    // V6 is editorial errata only: semantic ownership/provenance stays V5-identical.
    assert.equal(question.qlId, v5.qlId);
    assert.equal(question.cpId, v5.cpId);
    assert.equal(question.surfaceMode, v5.surfaceMode);
    assert.equal(question.targetFactId, v5.targetFactId);
    assert.equal(question.correctIndex, v5.correctIndex);
    assert.deepEqual(question.sourceIds, v5.sourceIds);
    assert.deepEqual(question.sourceFactIds, v5.sourceFactIds);
    assert.equal(question.solverAuthority, v5.solverAuthority);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, false);

    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    assert.doesNotMatch(learnerText, /\ba executable program file\b/i, `${qlId}/${seed}: bad article survived V6`);

    if (
      question.stem !== v5.stem ||
      question.explanation !== v5.explanation ||
      question.options.some((option, optionIndex) => option !== v5.options[optionIndex])
    ) {
      repairedSurfaces += 1;
    }

    audited += 1;
  }
}

// The approved review-wave seeds are part of the regression surface because
// QL-009 exposed the original article defect in the bilingual review artifact.
for (const suffix of ["A", "B"] as const) {
  const seed = `human-review-wave1:COM-002-QL-009:${suffix}`;
  const question = generateCom002ReviewQuestionV6({ qlId: "COM-002-QL-009", seed });
  const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
  assert.doesNotMatch(learnerText, /\ba executable program file\b/i, `${seed}: approved review seed kept bad article`);
}

assert.equal(audited, 520);
console.log("[COM002-REVIEW-SYNTHESIS-V6] PASS", {
  questions: audited,
  repairedSurfaces,
  semanticProvenancePreserved: true,
  candidateOnly: true,
});
