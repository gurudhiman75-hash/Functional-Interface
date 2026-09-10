import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP008_REVIEW_BATCH_V2, auditGeoRiv001Cp008ReviewBatchV2 } from "./geo-riv-001-cp008-review-batch-v2";

const audit = auditGeoRiv001Cp008ReviewBatchV2();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticUniqueCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 24, Hard: 12 });
assert.deepEqual(audit.answerPositions, { 0: 14, 1: 14, 2: 13, 3: 13 });
for (const upstream of ["cp001", "cp002", "cp003", "cp004", "cp005"]) assert.ok(audit.upstreamCounts[upstream] > 0);
assert.equal(GEO_RIV_001_CP008_REVIEW_BATCH_V2.every((question) => question.reviewOnly && !question.runtimeRegistered), true);
console.log(JSON.stringify(audit, null, 2));
