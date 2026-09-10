import { strict as assert } from "node:assert";
import {
  GEO_RIV_001_CP005_REVIEW_BATCH_V2,
  auditGeoRiv001Cp005ReviewBatchV2,
} from "./geo-riv-001-cp005-review-batch-v2";

const audit = auditGeoRiv001Cp005ReviewBatchV2();
assert.equal(audit.valid, true, audit.issues.join(", "));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticUniqueCount, 54);
assert.equal(new Set(GEO_RIV_001_CP005_REVIEW_BATCH_V2.map((q) => q.qlId)).size, 9);
assert.equal(new Set(GEO_RIV_001_CP005_REVIEW_BATCH_V2.map((q) => q.questionId)).size, 54);
assert.equal(audit.qlCounts["GEO-RIV-001-QL-037"], 7);
assert.equal(audit.qlCounts["GEO-RIV-001-QL-038"], 6);
assert.equal(audit.qlCounts["GEO-RIV-001-QL-039"], 8);
assert.equal(audit.qlCounts["GEO-RIV-001-QL-040"], 5);
assert.equal(audit.qlCounts["GEO-RIV-001-QL-041"], 7);
assert.equal(audit.qlCounts["GEO-RIV-001-QL-042"], 7);
assert.equal(audit.qlCounts["GEO-RIV-001-QL-043"], 4);
assert.equal(audit.qlCounts["GEO-RIV-001-QL-044"], 6);
assert.equal(audit.qlCounts["GEO-RIV-001-QL-045"], 4);
