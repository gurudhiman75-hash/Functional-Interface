import assert from "node:assert/strict";
import { GEO_PHY_001_CP003_REVIEW_BATCH_V1, auditGeoPhy001Cp003ReviewBatchV1 } from "./geo-phy-001-cp003-review-batch-v1";

const audit = auditGeoPhy001Cp003ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.deepEqual(audit.answerPositions, [14, 14, 13, 13]);
assert.equal(new Set(GEO_PHY_001_CP003_REVIEW_BATCH_V1.map((q) => q.qlId)).size, 9);

for (const q of GEO_PHY_001_CP003_REVIEW_BATCH_V1) {
  const visible = `${q.stem}\n${q.options.join("\n")}\n${q.explanation}`;
  assert.doesNotMatch(visible, /identified by the clue|this clue identifies|is described as/i, q.questionId);
  assert.doesNotMatch(visible, /generator|sourceFact|review-only|runtimeRegistered|qualification gate/i, q.questionId);
  assert.doesNotMatch(visible, /physiographic|regional division/i, q.questionId);
  if (q.qlId === "GEO-PHY-001-QL-026" || q.qlId === "GEO-PHY-001-QL-027") {
    assert.match(q.explanation, /correct/i, q.questionId);
  }
}

console.log(JSON.stringify(audit, null, 2));
