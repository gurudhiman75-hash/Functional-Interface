import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP005_REVIEW_BATCH_V4, auditGeoRiv001Cp005ReviewBatchV4 } from "./geo-riv-001-cp005-review-batch-v4";

const audit = auditGeoRiv001Cp005ReviewBatchV4();
assert.equal(audit.valid, true, audit.issues.join(", "));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticUniqueCount, 54);
assert.deepEqual(audit.answerPositions, { 0: 14, 1: 14, 2: 13, 3: 13 });
assert.deepEqual(audit.difficultyCounts, { Easy: 9, Medium: 35, Hard: 10 });
assert.equal(new Set(GEO_RIV_001_CP005_REVIEW_BATCH_V4.map((q) => q.questionId)).size, 54);
