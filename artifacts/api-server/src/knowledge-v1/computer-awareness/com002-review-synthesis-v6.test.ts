import assert from "node:assert/strict";

import { generateCom002ReviewQuestionV5 } from "./com002-review-synthesis-v5";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V6,
  generateCom002ReviewQuestionV6,
  listCom002ReviewV6QlIds,
} from "./com002-review-synthesis-v6";

const qlIds = listCom002ReviewV6QlIds();
assert.equal(COM002_ENGLISH_GENERATOR_VERSION_V6, "COM-002-ENGLISH-GENERATOR-V6-ERRATA-REVIEW-CANDIDATE-2");
assert.equal(qlIds.length, 13);

const bannedEditorialDefects = [
  /\ba executable program file\b/i,
  /\bA Real-time operating system\b/,
  /^How does Command-line interface \(CLI\) work\?$/i,
  /is classified as open-source operating system\./i,
  /is associated with Portable Document Format file\./i,
  /is commonly used for executable program file\./i,
  /Therefore, [IVX, ]+(?:and [IVX]+ )?only is correct\./i,
  /^Which function best matches Windows taskbar\?$/i,
  /^Which file-management item matches this description: can display hidden items when the relevant view option is enabled\?$/i,
];

let audited = 0;
let repairedSurfaces = 0;
let ql003PropertyStems = 0;

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
    for (const pattern of bannedEditorialDefects) {
      assert.doesNotMatch(learnerText, pattern, `${qlId}/${seed}: known English editorial defect survived V6`);
    }

    if (qlId === "COM-002-QL-003" && question.surfaceMode === "TYPE_TO_PROPERTY") {
      assert.doesNotMatch(question.stem, /^What is a .+ operating system\?$/i);
      ql003PropertyStems += 1;
    }

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

// Exact review/export seeds are regression surfaces because human-readable
// packs exposed grammar that the original structural audit did not catch.
for (const qlId of [
  "COM-002-QL-003",
  "COM-002-QL-005",
  "COM-002-QL-007",
  "COM-002-QL-008",
  "COM-002-QL-009",
  "COM-002-QL-013",
] as const) {
  const seeds = [
    `human-review-wave1:${qlId}:A`,
    `human-review-wave1:${qlId}:B`,
    `localization-human-review-v4:${qlId}`,
  ];
  for (const seed of seeds) {
    const question = generateCom002ReviewQuestionV6({ qlId, seed });
    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    for (const pattern of bannedEditorialDefects) {
      assert.doesNotMatch(learnerText, pattern, `${seed}: known English editorial defect survived V6`);
    }
  }
}

assert.equal(
  generateCom002ReviewQuestionV6({
    qlId: "COM-002-QL-003",
    seed: "localization-human-review-v4:COM-002-QL-003",
  }).stem,
  "Which statement describes a real-time operating system?",
);
assert.equal(
  generateCom002ReviewQuestionV6({
    qlId: "COM-002-QL-005",
    seed: "localization-human-review-v4:COM-002-QL-005",
  }).stem,
  "How does a command-line interface (CLI) work?",
);
assert.equal(
  generateCom002ReviewQuestionV6({
    qlId: "COM-002-QL-007",
    seed: "localization-human-review-v4:COM-002-QL-007",
  }).stem,
  "Which function best matches the Windows taskbar?",
);
assert.equal(
  generateCom002ReviewQuestionV6({
    qlId: "COM-002-QL-008",
    seed: "localization-human-review-v4:COM-002-QL-008",
  }).stem,
  "Which file-management item can display hidden items when the relevant view option is enabled?",
);

assert.equal(audited, 520);
assert.ok(ql003PropertyStems > 0, "V6 audit must exercise QL-003 property stems");
console.log("[COM002-REVIEW-SYNTHESIS-V6] PASS", {
  questions: audited,
  repairedSurfaces,
  ql003PropertyStems,
  exactExportStemRegressions: true,
  semanticProvenancePreserved: true,
  candidateOnly: true,
});
