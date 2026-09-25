import assert from "node:assert/strict";
import { GEO_VEG_001_CP006_REVIEW_BATCH_V1, auditGeoVeg001Cp006ReviewBatchV1 } from "./geo-veg-001-cp006-review-batch-v1";
const audit=auditGeoVeg001Cp006ReviewBatchV1();
assert.equal(audit.valid,true,audit.issues.join("\n"));
assert.equal(audit.questionCount,54);
assert.equal(audit.stemCount,54);
assert.equal(audit.explanationCount,54);
assert.deepEqual(audit.difficultyCounts,{Easy:18,Medium:30,Hard:6});
assert.deepEqual(audit.answerPositions,[14,14,13,13]);
for(let i=46;i<=54;i+=1){const id="GEO-VEG-001-QL-"+String(i).padStart(3,"0");assert.equal(audit.qlCounts[id],6);}
for(const q of GEO_VEG_001_CP006_REVIEW_BATCH_V1){assert.equal(q.options[q.correctIndex],q.canonicalAnswer);assert.equal(new Set(q.options).size,4);assert.equal(q.reviewOnly,true);assert.equal(q.runtimeRegistered,false);}
console.log(JSON.stringify(audit,null,2));
