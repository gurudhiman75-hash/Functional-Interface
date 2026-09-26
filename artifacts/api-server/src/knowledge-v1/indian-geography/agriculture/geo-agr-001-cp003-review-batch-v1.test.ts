import assert from "node:assert/strict";
import {
  GEO_AGR_001_CP003_REVIEW_BATCH_V1,
  auditGeoAgr001Cp003ReviewBatchV1,
} from "./geo-agr-001-cp003-review-batch-v1";

const audit = auditGeoAgr001Cp003ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 108);
assert.equal(audit.permanentQlCount, 18);
assert.equal(audit.stemCount, 108);
assert.equal(audit.explanationCount, 108);
assert.deepEqual(audit.difficultyCounts, { Easy: 36, Medium: 60, Hard: 12 });
assert.ok(Math.max(...audit.answerPositions) - Math.min(...audit.answerPositions) <= 3);

for (let n = 55; n <= 72; n += 1) {
  const qlId = "GEO-AGR-001-QL-" + String(n).padStart(3, "0");
  assert.equal(audit.qlCounts[qlId], 6);
}
for (const q of GEO_AGR_001_CP003_REVIEW_BATCH_V1) {
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
  assert.equal(new Set(q.options).size, 4);
  assert.equal(q.reviewOnly, true);
  assert.equal(q.runtimeRegistered, false);
}
console.log(JSON.stringify(audit, null, 2));
