import assert from "node:assert/strict";
import { GEO_MIN_001_CP002_REVIEW_BATCH_V1, auditGeoMin001Cp002ReviewBatchV1 } from "./geo-min-001-cp002-review-batch-v1";

const audit = auditGeoMin001Cp002ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.equal(audit.permanentQlCount, 9);
assert.equal(audit.stemCount, 54);
assert.equal(audit.explanationCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.ok(Math.max(...audit.answerPositions) - Math.min(...audit.answerPositions) <= 2);
for (let n = 10; n <= 18; n += 1) {
  assert.equal(audit.qlCounts["GEO-MIN-001-QL-" + String(n).padStart(3, "0")], 6);
}
for (const q of GEO_MIN_001_CP002_REVIEW_BATCH_V1) {
  assert.equal(q.options.length, 4);
  assert.equal(new Set(q.options).size, 4);
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
  assert.equal(q.reviewOnly, true);
  assert.equal(q.runtimeRegistered, false);
}
console.log(JSON.stringify(audit, null, 2));
