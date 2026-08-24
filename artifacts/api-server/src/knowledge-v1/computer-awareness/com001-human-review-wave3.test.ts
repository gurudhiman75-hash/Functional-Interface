import { strict as assert } from "node:assert";

import { generateCom001Ql009ExamConventionV2 } from "./com001-ql009-exam-convention-v2";

const samples = ["A", "B", "C", "D", "E", "F", "G", "H"].map((variant) =>
  generateCom001Ql009ExamConventionV2(`human-review-wave3:COM-001-QL-009:${variant}`),
);

assert.equal(samples.length, 8);
assert.ok(samples.every((q) => q.qlId === "COM-001-QL-009"));
assert.ok(samples.every((q) => q.humanReviewV2.status === "REMEDIATED_CANDIDATE"));
assert.ok(samples.every((q) => q.options.length === 4 && new Set(q.options).size === 4));
assert.ok(samples.every((q) => !/\bMiB\b|\bGiB\b|\bKiB\b/u.test(q.stem)));

for (const [index, q] of samples.entries()) {
  console.log(`[COM001-HUMAN-REVIEW-WAVE3 ${String(index + 1).padStart(2, "0")}/08] ${JSON.stringify({
    stem: q.stem,
    options: q.options,
    correctIndex: q.correctIndex,
    canonicalAnswer: q.canonicalAnswer,
    explanation: q.explanation,
    sourceIds: q.sourceIds,
    sourceFactIds: q.sourceFactIds,
  })}`);
}
