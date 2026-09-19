import assert from "node:assert/strict";
import {
  GEO_CLI_001_CP002_REVIEW_BATCH_V5,
  auditGeoCli001Cp002ReviewBatchV5,
} from "./geo-cli-001-cp002-review-batch-v5";

const audit = auditGeoCli001Cp002ReviewBatchV5();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.equal(audit.stemCount, 54);
assert.equal(audit.semanticCount, 54);
assert.equal(audit.explanationCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.deepEqual(audit.answerPositions, [14, 14, 13, 13]);
assert.ok(audit.hardAnswerVariety >= 3);
assert.ok(audit.statementStemCount <= 10);
assert.ok(audit.mascareneCoverage >= 2);
assert.ok(audit.tibetanCoverage >= 2);

for (let i = 10; i <= 18; i += 1) {
  const qlId = "GEO-CLI-001-QL-" + String(i).padStart(3, "0");
  assert.equal(audit.qlCounts[qlId], 6, qlId + " should own six questions");
}

for (const question of GEO_CLI_001_CP002_REVIEW_BATCH_V5) {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.ok(question.explanation.length >= 55);
  assert.ok(question.stem.length >= 28);
  assert.ok(question.stem.length <= 360);
  assert.ok(question.stem.trim().endsWith("?"));
  assert.doesNotMatch(
    question.stem + "\n" + question.options.join("\n") + "\n" + question.explanation,
    /\bbroad(?:ly)?\b|\bmainly\b/i,
  );
}

console.log(JSON.stringify(audit, null, 2));
