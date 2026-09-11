import { strict as assert } from "node:assert";
import { auditGeoRiv001Cp015ReviewBatchV1, GEO_RIV_001_CP015_REVIEW_BATCH_V1 } from "./geo-riv-001-cp015-review-batch-v1";

const audit = auditGeoRiv001Cp015ReviewBatchV1();
if (!audit.valid) throw new Error(`CP015 qualification failed: ${audit.issues.join(" | ")}`);
assert.equal(GEO_RIV_001_CP015_REVIEW_BATCH_V1.length, 64);
assert.deepEqual(audit.positions, [16, 16, 16, 16]);
assert.equal(audit.sourceQlCoverage, 63);
assert.equal(audit.uniqueSemanticCount, 64);
assert.equal(audit.upstreamAuditsValid, true);
console.log(JSON.stringify(audit, null, 2));
