import assert from "node:assert/strict";
import { GEO_RIV_001_CP012_REVIEW_BATCH_V1, auditGeoRiv001Cp012ReviewBatchV1 } from "./geo-riv-001-cp012-review-batch-v1";
import { GEO_RIV_001_CP012_QL_IDS_V1 } from "./geo-riv-001-cp012-review-generator-v1";

const audit=auditGeoRiv001Cp012ReviewBatchV1();
assert.equal(audit.valid,true,audit.issues.join("\n"));
assert.equal(audit.questionCount,54);
assert.deepEqual(audit.difficultyCounts,{Easy:18,Medium:24,Hard:12});
assert.deepEqual(audit.answerPositions,{0:14,1:14,2:13,3:13});
for(const id of GEO_RIV_001_CP012_QL_IDS_V1) assert.equal(audit.qlCounts[id],6);
for(const q of GEO_RIV_001_CP012_REVIEW_BATCH_V1){
  assert.equal(q.options[q.correctIndex],q.canonicalAnswer);
  assert.equal(q.reviewOnly,true);
  assert.equal(q.runtimeRegistered,false);
  assert.ok(q.sourceIds.length>0);
  assert.ok(q.sourceFactIds.length>0);
  assert.match(q.explanation,/River /);
}
console.log(JSON.stringify(audit));
