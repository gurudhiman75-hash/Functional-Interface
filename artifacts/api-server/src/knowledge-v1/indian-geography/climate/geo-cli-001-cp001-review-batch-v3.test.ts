import assert from "node:assert/strict";
import {
  GEO_CLI_001_CP001_REVIEW_BATCH_V3,
  auditGeoCli001Cp001ReviewBatchV3,
} from "./geo-cli-001-cp001-review-batch-v3";

const audit = auditGeoCli001Cp001ReviewBatchV3();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.deepEqual(audit.answerPositions, [14, 14, 13, 13]);
assert.ok(audit.hardAnswerVariety >= 3);

for (let i = 1; i <= 9; i += 1) {
  const qlId = `GEO-CLI-001-QL-${String(i).padStart(3, "0")}`;
  assert.equal(audit.qlCounts[qlId], 6, `${qlId} should own six questions`);
}

for (const question of GEO_CLI_001_CP001_REVIEW_BATCH_V3) {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.ok(question.explanation.length >= 40);
  assert.ok(question.stem.length <= 260);
}

const ql006 = GEO_CLI_001_CP001_REVIEW_BATCH_V3.filter(
  (question) => question.qlId === "GEO-CLI-001-QL-006",
);
assert.equal(ql006.length, 6);
assert.ok(ql006.every((question) => question.qlName === "Ocean currents and coastal influence"));

console.log(JSON.stringify(audit, null, 2));
