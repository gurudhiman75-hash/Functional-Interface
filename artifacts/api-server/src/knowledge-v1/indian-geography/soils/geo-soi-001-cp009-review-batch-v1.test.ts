import assert from "node:assert/strict";
import {
  GEO_SOI_001_CP009_REVIEW_BATCH_V1,
  auditGeoSoi001Cp009ReviewBatchV1,
} from "./geo-soi-001-cp009-review-batch-v1";

const audit = auditGeoSoi001Cp009ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.equal(audit.stemCount, 54);
assert.equal(audit.explanationCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.deepEqual(audit.answerPositions, [13, 13, 14, 14]);
for (let n = 73; n <= 81; n += 1) {
  const qlId = "GEO-SOI-001-QL-" + String(n).padStart(3, "0");
  assert.equal(audit.qlCounts[qlId], 6);
}
for (const q of GEO_SOI_001_CP009_REVIEW_BATCH_V1) {
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
  assert.equal(new Set(q.options).size, 4);
  assert.equal(q.reviewOnly, true);
  assert.equal(q.runtimeRegistered, false);
}
console.log(JSON.stringify(audit, null, 2));
