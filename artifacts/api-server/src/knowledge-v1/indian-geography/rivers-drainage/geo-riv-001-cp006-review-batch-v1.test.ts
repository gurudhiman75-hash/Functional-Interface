import { strict as assert } from "node:assert";
import { auditGeoRiv001Cp006ReviewBatchV1, GEO_RIV_001_CP006_REVIEW_BATCH_V1 } from "./geo-riv-001-cp006-review-batch-v1";
const audit=auditGeoRiv001Cp006ReviewBatchV1();
if(!audit.valid)throw new Error(`CP006 qualification failed: ${audit.issues.join(" | ")}`);
assert.equal(GEO_RIV_001_CP006_REVIEW_BATCH_V1.length,54);
assert.deepEqual(audit.positions,[14,14,13,13]);
assert.equal(audit.riverCount,6);
assert.ok(audit.tributaryCount>=16);
console.log(JSON.stringify(audit,null,2));
