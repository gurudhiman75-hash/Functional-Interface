import assert from "node:assert/strict";
import { GEO_MIN_001_CP005_REVIEW_BATCH_V1, auditGeoMin001Cp005ReviewBatchV1 } from "./geo-min-001-cp005-review-batch-v1";

const audit = auditGeoMin001Cp005ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.ok(audit.questionCount >= 1);
assert.ok(audit.permanentQlCount >= 1);
assert.equal(audit.stemCount, audit.questionCount);
assert.equal(audit.explanationCount, audit.questionCount);
assert.equal(audit.difficultyCounts.Easy + audit.difficultyCounts.Medium + audit.difficultyCounts.Hard, audit.questionCount);
assert.ok(
  Math.max(...audit.answerPositions) - Math.min(...audit.answerPositions) <= Math.max(2, Math.ceil(audit.questionCount * 0.04)),
);
for (const count of Object.values(audit.qlCounts)) assert.ok(count >= 4);
for (const q of GEO_MIN_001_CP005_REVIEW_BATCH_V1) {
  assert.equal(q.options.length, 4);
  assert.equal(new Set(q.options).size, 4);
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
  assert.equal(q.reviewOnly, true);
  assert.equal(q.runtimeRegistered, false);
}
console.log(JSON.stringify(audit, null, 2));
