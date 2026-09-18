import assert from "node:assert/strict";
import {
  PGK_001_CP002_EXPLANATIONS_V3,
  PGK_001_CP002_REVIEW_BATCH_V3,
  auditPgk001Cp002ReviewBatchV3,
} from "./pgk-001-cp002-review-batch-v3";

const audit = auditPgk001Cp002ReviewBatchV3();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(PGK_001_CP002_REVIEW_BATCH_V3.length, 42);
assert.equal(PGK_001_CP002_EXPLANATIONS_V3.length, 42);

const banned = [
  "the correct answer is",
  "according to the question",
  "the option",
  "the other options",
  "this question tests",
  "official snapshot records",
];

for (const question of PGK_001_CP002_REVIEW_BATCH_V3) {
  const explanation = question.explanation.toLowerCase();
  for (const phrase of banned) {
    assert.equal(explanation.includes(phrase), false, `${question.questionId} contains explanation boilerplate: ${phrase}`);
  }
  assert.ok(question.explanation.length <= 360, `${question.questionId} explanation is too long`);
}
