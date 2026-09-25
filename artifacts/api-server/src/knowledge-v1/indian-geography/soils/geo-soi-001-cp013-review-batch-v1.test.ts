import assert from "node:assert/strict";
import { GEO_SOI_001_CP013_REVIEW_BATCH_V1, auditGeoSoi001Cp013ReviewBatchV1 } from "./geo-soi-001-cp013-review-batch-v1";
const audit = auditGeoSoi001Cp013ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 108);
assert.equal(audit.stemCount, 108);
assert.equal(audit.explanationCount, 108);
assert.deepEqual(audit.difficultyCounts, { Easy: 36, Medium: 60, Hard: 12 });
assert.deepEqual(audit.answerPositions, [27, 27, 27, 27]);
for (let n = 1; n <= 108; n += 1) {
  const qlId = "GEO-SOI-001-QL-" + String(n).padStart(3, "0");
  assert.equal(audit.qlCounts[qlId], 1);
}
for (const q of GEO_SOI_001_CP013_REVIEW_BATCH_V1) {
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
  assert.equal(new Set(q.options).size, 4);
}
console.log(JSON.stringify(audit, null, 2));
