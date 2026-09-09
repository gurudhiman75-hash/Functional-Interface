import { strict as assert } from "node:assert";

import {
  GEO_RIV_001_CP002_REVIEW_BATCH_V1,
  auditGeoRiv001Cp002ReviewBatchV1,
} from "./geo-riv-001-cp002-review-batch-v1";

const audit = auditGeoRiv001Cp002ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticUniqueCount, 54);
assert.equal(Object.keys(audit.qlCounts).length, 9);
assert.equal(
  Object.values(audit.qlCounts).reduce((sum, value) => sum + Number(value), 0),
  54,
);

assert.equal(new Set(GEO_RIV_001_CP002_REVIEW_BATCH_V1.map((q) => q.questionId)).size, 54);
assert.equal(new Set(GEO_RIV_001_CP002_REVIEW_BATCH_V1.map((q) => q.qlId)).size, 9);
assert.equal(
  GEO_RIV_001_CP002_REVIEW_BATCH_V1.every((q) => q.reviewOnly && !q.runtimeRegistered),
  true,
);
assert.equal(
  GEO_RIV_001_CP002_REVIEW_BATCH_V1.every(
    (q) => q.options.length === 4 && new Set(q.options).size === 4,
  ),
  true,
);
