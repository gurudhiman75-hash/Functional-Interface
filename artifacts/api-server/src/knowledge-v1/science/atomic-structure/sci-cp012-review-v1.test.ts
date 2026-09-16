import assert from "node:assert/strict";
import { SCI_CP012_REVIEW_V1, validateSciCp012ReviewV1 } from "./sci-cp012-review-v1";

const validation = validateSciCp012ReviewV1();

assert.equal(validation.valid, true, validation.errors.join("; "));
assert.equal(validation.totalQuestions, 60);
assert.deepEqual(validation.difficultyCounts, { Easy: 18, Medium: 30, Hard: 12 });
assert.deepEqual(validation.answerPositionCounts, { A: 15, B: 15, C: 15, D: 15 });

for (let ql = 1; ql <= 10; ql += 1) {
  const qlId = `SCI-012-QL-${ql.toString().padStart(3, "0")}`;
  assert.equal(validation.qlCounts[qlId], 6, `${qlId} must contain 6 questions`);
}

assert.equal(new Set(SCI_CP012_REVIEW_V1.map((question) => question.stem)).size, 60);
assert.ok(SCI_CP012_REVIEW_V1.every((question) => question.reviewOnly && !question.runtimeRegistered));
assert.ok(SCI_CP012_REVIEW_V1.every((question) => question.explanation.length >= 60));

const corpus = SCI_CP012_REVIEW_V1.map((q) => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
for (const required of ["constant proportions", "molecular mass", "formula unit", "ammonium", "sulphate", "covalent", "John Dalton"]) {
  assert.ok(corpus.includes(required), `missing remediation coverage: ${required}`);
}
