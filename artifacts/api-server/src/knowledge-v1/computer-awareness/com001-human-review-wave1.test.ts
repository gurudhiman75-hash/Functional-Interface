import { strict as assert } from "node:assert";

import { generateCom001LocalizedReviewQuestionV1 } from "./com001-localization-v1";
import { generateCom001ReviewQuestion, listCom001ReviewQlIds } from "./com001-review-synthesis";

const samples: Array<Record<string, unknown>> = [];

for (const qlId of listCom001ReviewQlIds()) {
  for (const variant of ["A", "B"] as const) {
    const seed = `human-review-wave1:${qlId}:${variant}`;
    const q = generateCom001ReviewQuestion({ qlId, seed });
    samples.push({
      language: "en",
      qlId,
      seed,
      stem: q.stem,
      options: q.options,
      correctIndex: q.correctIndex,
      canonicalAnswer: q.canonicalAnswer,
      explanation: q.explanation,
      sourceFactIds: q.sourceFactIds,
      solverAuthority: q.solverAuthority,
    });
  }
}

for (const qlId of [
  "COM-001-QL-003",
  "COM-001-QL-007",
  "COM-001-QL-008",
  "COM-001-QL-009",
] as const) {
  for (const language of ["hi", "pa"] as const) {
    const seed = `human-review-wave1:${qlId}:localized`;
    const q = generateCom001LocalizedReviewQuestionV1({ qlId, seed, language });
    samples.push({
      language,
      qlId,
      seed,
      stem: q.stem,
      options: q.options,
      correctIndex: q.correctIndex,
      canonicalAnswer: q.canonicalAnswer,
      explanation: q.explanation,
      sourceFactIds: q.sourceFactIds,
      solverAuthority: q.solverAuthority,
    });
  }
}

assert.equal(samples.length, 26);
for (const [index, sample] of samples.entries()) {
  console.log(`[COM001-HUMAN-REVIEW-WAVE1 ${String(index + 1).padStart(2, "0")}/26] ${JSON.stringify(sample)}`);
}
