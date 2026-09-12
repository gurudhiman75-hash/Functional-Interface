import assert from "node:assert/strict";
import { GEO_PHY_001_CP002_REVIEW_BATCH_V1, auditGeoPhy001Cp002ReviewBatchV1 } from "./geo-phy-001-cp002-review-batch-v1";

const audit = auditGeoPhy001Cp002ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.deepEqual(audit.answerPositions, [14, 14, 13, 13]);
assert.equal(new Set(GEO_PHY_001_CP002_REVIEW_BATCH_V1.map((q) => q.qlId)).size, 9);

for (const q of GEO_PHY_001_CP002_REVIEW_BATCH_V1) {
  const visible = `${q.stem}\n${q.options.join("\n")}\n${q.explanation}`;
  assert.doesNotMatch(visible, /generator|sourceFact|review-only|runtimeRegistered|qualified relation/i, q.questionId);
  assert.doesNotMatch(visible, /\ba\s+[aeiou][a-z-]*\b/i, q.questionId);

  // Editorial anti-template guards. These phrases were characteristic of the
  // rejected mechanical realization and must not return in future revisions.
  assert.doesNotMatch(q.stem, /identified by the clue|is described as/i, q.questionId);
  assert.doesNotMatch(q.explanation, /This clue identifies|The pair .+ is (?:correct|incorrect)\.|of the three statements are correct\./i, q.questionId);

  assert.ok(q.explanation.length >= 85, `${q.questionId}: explanation is too thin`);
}

console.log(JSON.stringify(audit, null, 2));
