import assert from "node:assert/strict";
import {
  GEO_CLI_001_CP003_REVIEW_BATCH_V1,
  auditGeoCli001Cp003ReviewBatchV1,
} from "./geo-cli-001-cp003-review-batch-v1";

const audit = auditGeoCli001Cp003ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.equal(audit.stemCount, 54);
assert.equal(audit.semanticCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.deepEqual(audit.answerPositions, [14, 14, 13, 13]);
assert.ok(audit.hardAnswerVariety >= 3);
assert.ok(audit.statementStemCount <= 10);

for (let i = 19; i <= 27; i += 1) {
  const qlId = `GEO-CLI-001-QL-${String(i).padStart(3, "0")}`;
  assert.equal(audit.qlCounts[qlId], 6, `${qlId} should own six questions`);
}

for (const question of GEO_CLI_001_CP003_REVIEW_BATCH_V1) {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.ok(question.explanation.length >= 55);
  assert.ok(question.stem.length >= 28);
  assert.ok(question.stem.length <= 220);
  assert.ok(question.stem.trim().endsWith("?"));
}

console.log(JSON.stringify(audit, null, 2));
