import assert from "node:assert/strict";
import { GEO_RIV_001_CP013_FACTS_V1, GEO_RIV_001_CP013_ROWS_V1 } from "./geo-riv-001-cp013-facts";
import { GEO_RIV_001_CP013_REVIEW_BATCH_V1, auditGeoRiv001Cp013ReviewBatchV1 } from "./geo-riv-001-cp013-review-batch-v1";

const audit=auditGeoRiv001Cp013ReviewBatchV1();
assert.equal(audit.valid,true,audit.issues.join("\n"));
assert.equal(audit.total,54);
assert.deepEqual(audit.positions,[14,14,13,13]);
assert.equal(GEO_RIV_001_CP013_ROWS_V1.length,12);
assert.ok(GEO_RIV_001_CP013_FACTS_V1.length>=30);
assert.equal(new Set(GEO_RIV_001_CP013_REVIEW_BATCH_V1.map(q=>q.questionId)).size,54);
assert.ok(GEO_RIV_001_CP013_REVIEW_BATCH_V1.every(q=>q.reviewOnly&&!q.runtimeRegistered));
console.log(JSON.stringify(audit,null,2));
