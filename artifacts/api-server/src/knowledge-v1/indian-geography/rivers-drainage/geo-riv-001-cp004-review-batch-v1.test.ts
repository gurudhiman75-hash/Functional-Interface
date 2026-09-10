import { strict as assert } from "node:assert";
import {
  GEO_RIV_001_CP004_REVIEW_BATCH_V1,
  auditGeoRiv001Cp004ReviewBatchV1,
} from "./geo-riv-001-cp004-review-batch-v1";

const audit = auditGeoRiv001Cp004ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(", "));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticUniqueCount, 54);
assert.equal(new Set(GEO_RIV_001_CP004_REVIEW_BATCH_V1.map((q) => q.qlId)).size, 9);
assert.equal(new Set(GEO_RIV_001_CP004_REVIEW_BATCH_V1.map((q) => q.questionId)).size, 54);
