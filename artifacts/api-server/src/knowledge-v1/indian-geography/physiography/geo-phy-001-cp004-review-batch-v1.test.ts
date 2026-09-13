import assert from "node:assert/strict";
import {
  GEO_PHY_001_CP004_REVIEW_BATCH_V1,
  auditGeoPhy001Cp004ReviewBatchV1,
} from "./geo-phy-001-cp004-review-batch-v1";

const audit = auditGeoPhy001Cp004ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.deepEqual(audit.answerPositions, [14, 14, 13, 13]);
assert.equal(new Set(GEO_PHY_001_CP004_REVIEW_BATCH_V1.map((question) => question.qlId)).size, 9);

for (const question of GEO_PHY_001_CP004_REVIEW_BATCH_V1) {
  const learner = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
  assert.doesNotMatch(
    learner,
    /physiographic division|sourceFact|review-only|runtimeRegistered|generator|qualification gate/i,
    question.questionId,
  );
  assert.ok(question.explanation.trim().length >= 45, `${question.questionId}: explanation too short`);
  assert.doesNotMatch(question.explanation.trim(), /^This pair is (?:correct|incorrect)\.?$/i, question.questionId);
  if (question.stem.trim().endsWith("?")) {
    assert.match(question.stem, /\b(?:which|what|how many|consider)\b/i, `${question.questionId}: unnatural question stem`);
  }
}

console.log(JSON.stringify(audit, null, 2));
