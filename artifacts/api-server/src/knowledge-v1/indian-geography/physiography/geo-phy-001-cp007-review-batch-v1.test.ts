import assert from "node:assert/strict";
import {
  GEO_PHY_001_CP007_REQUIRED_FACTS_V1,
  GEO_PHY_001_CP007_REVIEW_BATCH_V1,
  auditGeoPhy001Cp007ReviewBatchV1,
} from "./geo-phy-001-cp007-review-batch-v1";

const audit = auditGeoPhy001Cp007ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.deepEqual(audit.answerPositions, [14, 14, 13, 13]);
assert.ok(audit.hardAnswerVariety >= 3, "hard answer pattern is too repetitive");
assert.equal(new Set(GEO_PHY_001_CP007_REVIEW_BATCH_V1.map((question) => question.qlId)).size, 9);

const usedFacts = new Set(GEO_PHY_001_CP007_REVIEW_BATCH_V1.flatMap((question) => question.sourceFactIds));
for (const factId of GEO_PHY_001_CP007_REQUIRED_FACTS_V1) {
  assert.ok(usedFacts.has(factId), `required CP007 fact is dormant: ${factId}`);
}

for (const question of GEO_PHY_001_CP007_REVIEW_BATCH_V1) {
  const learner = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
  assert.doesNotMatch(
    learner,
    /\bNCERT\b|sourceFact|review-only|runtimeRegistered|generator|qualification gate|physiographic nomenclature|geological provenance|morphological characteristic/i,
    question.questionId,
  );
  assert.ok(question.explanation.trim().length >= 40, `${question.questionId}: explanation too short`);
  assert.equal(question.options.length, 4, question.questionId);
  assert.equal(new Set(question.options).size, 4, `${question.questionId}: repeated option`);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer, `${question.questionId}: answer mismatch`);
}

console.log(JSON.stringify(audit, null, 2));
