import assert from "node:assert/strict";
import { SCI_CP013_REVIEW_V1, validateSciCp013ReviewV1 } from "./sci-cp013-review-v1";

const validation = validateSciCp013ReviewV1();

assert.equal(validation.valid, true, validation.errors.join("\n"));
assert.equal(validation.totalQuestions, 60);
assert.deepEqual(validation.difficultyCounts, { Easy: 18, Medium: 30, Hard: 12 });
assert.deepEqual(validation.answerPositionCounts, { A: 15, B: 15, C: 15, D: 15 });

for (let ql = 1; ql <= 10; ql += 1) {
  const qlId = `SCI-013-QL-${ql.toString().padStart(3, "0")}`;
  assert.equal(validation.qlCounts[qlId], 6, `${qlId} must contain 6 questions`);
}

assert.ok(SCI_CP013_REVIEW_V1.every((question) => question.reviewOnly && !question.runtimeRegistered));
