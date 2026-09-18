import assert from "node:assert/strict";
import {
  GEO_CLI_001_CP013_REVIEW_BATCH_V1,
  auditGeoCli001Cp013ReviewBatchV1,
} from "./geo-cli-001-cp013-review-batch-v1";

const audit = auditGeoCli001Cp013ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 108);
assert.equal(audit.qlCount, 108);
assert.equal(audit.stemCount, 108);
assert.equal(audit.semanticCount, 108);
assert.deepEqual(audit.difficultyCounts, { Easy: 36, Medium: 60, Hard: 12 });
assert.deepEqual(audit.answerPositions, [27, 27, 27, 27]);
assert.equal(audit.synchronizedCp012Representatives, 9);

for (let n = 1; n <= 108; n += 1) {
  const qlId = `GEO-CLI-001-QL-${String(n).padStart(3, "0")}`;
  assert.equal(audit.qlCounts[qlId], 1, `${qlId} should appear exactly once`);
}

for (const question of GEO_CLI_001_CP013_REVIEW_BATCH_V1) {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.ok(question.sourceQuestionId.length > 0);
  assert.ok(question.sourceIds.length > 0);
  assert.ok(question.sourceFactIds.length > 0);
  const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
  assert.equal(/\bbroad(?:ly)?\b/i.test(learnerText), false);
}

console.log(JSON.stringify(audit, null, 2));
