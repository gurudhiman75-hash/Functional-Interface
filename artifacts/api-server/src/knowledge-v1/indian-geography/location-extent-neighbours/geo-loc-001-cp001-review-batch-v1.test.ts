import assert from "node:assert/strict";
import {
  GEO_LOC_001_CP001_REVIEW_BATCH_V1,
  auditGeoLoc001Cp001ReviewBatchV1,
} from "./geo-loc-001-cp001-review-batch-v1";

const audit = auditGeoLoc001Cp001ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.equal(audit.stemCount, 54);
assert.equal(audit.explanationCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.deepEqual(audit.answerPositions, [14, 14, 13, 13]);

for (let n = 1; n <= 9; n += 1) {
  const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
  assert.equal(audit.qlCounts[qlId], 6);
}

for (const q of GEO_LOC_001_CP001_REVIEW_BATCH_V1) {
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
  assert.equal(new Set(q.options).size, 4);
  assert.equal(q.reviewOnly, true);
  assert.equal(q.runtimeRegistered, false);
}

console.log(JSON.stringify(audit, null, 2));
