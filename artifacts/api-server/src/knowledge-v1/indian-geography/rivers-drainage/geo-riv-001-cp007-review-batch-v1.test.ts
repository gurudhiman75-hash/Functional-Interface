import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP007_REVIEW_BATCH_V1, auditGeoRiv001Cp007ReviewBatchV1 } from "./geo-riv-001-cp007-review-batch-v1";

const audit = auditGeoRiv001Cp007ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 60);
assert.equal(audit.semanticUniqueCount, 60);
assert.deepEqual(audit.answerPositions, { 0: 15, 1: 15, 2: 15, 3: 15 });
assert.equal(Object.keys(audit.qlCounts).length, 10);
assert.equal(audit.upstreamCounts.cp006, undefined);
for (const token of ["cp002", "cp003", "cp004", "cp005"]) assert.ok((audit.upstreamCounts[token] ?? 0) > 0);
for (const question of GEO_RIV_001_CP007_REVIEW_BATCH_V1) {
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
}
console.log(JSON.stringify(audit, null, 2));
