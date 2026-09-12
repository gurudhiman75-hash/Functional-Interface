import assert from "node:assert/strict";
import { GEO_PHY_001_CP001_REVIEW_BATCH_V1, auditGeoPhy001Cp001ReviewBatchV1 } from "./geo-phy-001-cp001-review-batch-v1";

const audit = auditGeoPhy001Cp001ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 24, Hard: 12 });
assert.deepEqual(audit.answerPositions, [14, 14, 13, 13]);
assert.equal(new Set(GEO_PHY_001_CP001_REVIEW_BATCH_V1.map((q) => q.qlId)).size, 9);

for (const question of GEO_PHY_001_CP001_REVIEW_BATCH_V1) {
  const visible = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
  assert.doesNotMatch(visible, /\ba\s+[aeiou][a-z-]*\b/i, question.questionId);
  assert.doesNotMatch(visible, /\bNCERT\b|generator|sourceFact|review-only|runtimeRegistered/i, question.questionId);
  assert.doesNotMatch(visible, /\bThe Islands is\b|\bThe Coastal Plains is coastal lowlands\b/i, question.questionId);
}

console.log(JSON.stringify(audit, null, 2));
