import assert from "node:assert/strict";
import {
  GEO_AGR_001_CP001_REVIEW_BATCH_V1,
  auditGeoAgr001Cp001ReviewBatchV1,
} from "./geo-agr-001-cp001-review-batch-v1";

const audit = auditGeoAgr001Cp001ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 162);
assert.equal(audit.permanentQlCount, 27);
assert.equal(audit.stemCount, 162);
assert.equal(audit.explanationCount, 162);
assert.deepEqual(audit.difficultyCounts, { Easy: 54, Medium: 90, Hard: 18 });
assert.ok(Math.max(...audit.answerPositions) - Math.min(...audit.answerPositions) <= 3);

for (let n = 1; n <= 27; n += 1) {
  const qlId = "GEO-AGR-001-QL-" + String(n).padStart(3, "0");
  assert.equal(audit.qlCounts[qlId], 6);
}
for (const q of GEO_AGR_001_CP001_REVIEW_BATCH_V1) {
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
  assert.equal(new Set(q.options).size, 4);
  assert.equal(q.reviewOnly, true);
  assert.equal(q.runtimeRegistered, false);
}
console.log(JSON.stringify(audit, null, 2));
