import assert from "node:assert/strict";
import {
  GEO_PHY_001_CP011_REVIEW_BATCH_V1,
  auditGeoPhy001Cp011ReviewBatchV1,
} from "./geo-phy-001-cp011-review-batch-v1";

const audit = auditGeoPhy001Cp011ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.deepEqual(audit.answerPositions, [14, 14, 13, 13]);
assert.ok(audit.hardAnswerVariety >= 4, "hard answer pattern is too repetitive");
assert.equal(new Set(GEO_PHY_001_CP011_REVIEW_BATCH_V1.map((q) => q.qlId)).size, 9);
assert.ok(audit.usedSourceFactCount >= 20, "comparison coverage is too shallow");

for (const question of GEO_PHY_001_CP011_REVIEW_BATCH_V1) {
  const learner = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
  assert.doesNotMatch(
    learner,
    /\bNCERT\b|sourceFact|review-only|runtimeRegistered|generator|qualification gate|provenance/i,
    question.questionId,
  );
  assert.ok(question.explanation.trim().length >= 40, `${question.questionId}: explanation too short`);
  assert.equal(question.options.length, 4, question.questionId);
  assert.equal(new Set(question.options).size, 4, `${question.questionId}: repeated option`);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer, `${question.questionId}: answer mismatch`);
  assert.ok(question.sourceIds.length > 0, `${question.questionId}: missing source`);
  assert.ok(question.sourceFactIds.length > 0, `${question.questionId}: missing source fact`);
  assert.equal(question.reviewOnly, true, `${question.questionId}: review lifecycle broken`);
  assert.equal(question.runtimeRegistered, false, `${question.questionId}: runtime registration must remain off`);
}

console.log(JSON.stringify(audit, null, 2));
