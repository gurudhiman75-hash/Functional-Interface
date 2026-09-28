import assert from "node:assert/strict";
import { GEO_IND_001_CP011_REVIEW_BATCH_V1, auditGeoInd001Cp011ReviewBatchV1 } from "./geo-ind-001-cp011-review-batch-v1";
const a=auditGeoInd001Cp011ReviewBatchV1();
assert.equal(a.valid,true,a.issues.join("\n"));
assert.equal(a.stemCount,a.questionCount);
assert.equal(a.explanationCount,a.questionCount);
for(const n of Object.values(a.qlCounts)) assert.ok(n>=4);
for(const q of GEO_IND_001_CP011_REVIEW_BATCH_V1) {
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options).size,4);
  assert.equal(q.options[q.correctIndex],q.canonicalAnswer);
  assert.equal(q.reviewOnly,true);
  assert.equal(q.runtimeRegistered,false);
}
console.log(JSON.stringify(a,null,2));