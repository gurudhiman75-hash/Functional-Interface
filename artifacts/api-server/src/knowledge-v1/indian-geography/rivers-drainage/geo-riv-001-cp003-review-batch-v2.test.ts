import { strict as assert } from "node:assert";

import {
  GEO_RIV_001_CP003_REVIEW_BATCH_V2,
  auditGeoRiv001Cp003ReviewBatchV2,
} from "./geo-riv-001-cp003-review-batch-v2";

const audit = auditGeoRiv001Cp003ReviewBatchV2();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticUniqueCount, 54);
assert.equal(Object.keys(audit.qlCounts).length, 9);
assert.equal(new Set(GEO_RIV_001_CP003_REVIEW_BATCH_V2.map((q) => q.questionId)).size, 54);
assert.equal(new Set(GEO_RIV_001_CP003_REVIEW_BATCH_V2.map((q) => q.qlId)).size, 9);
assert.equal(GEO_RIV_001_CP003_REVIEW_BATCH_V2.every((q) => q.reviewOnly && !q.runtimeRegistered), true);
assert.equal(
  GEO_RIV_001_CP003_REVIEW_BATCH_V2.every((q) => q.options.length === 4 && new Set(q.options).size === 4),
  true,
);
assert.equal(
  GEO_RIV_001_CP003_REVIEW_BATCH_V2.every((q) => q.options[q.correctIndex] === q.canonicalAnswer),
  true,
);

const ql021 = GEO_RIV_001_CP003_REVIEW_BATCH_V2.filter((q) => q.qlId === "GEO-RIV-001-QL-021");
assert.equal(ql021.some((q) => q.stem === "Which of the following is a right-bank tributary of the Ganga?"), true);
assert.equal(ql021.some((q) => q.stem === "Which of the following is a left-bank tributary of the Ganga?"), true);
assert.equal(ql021.some((q) => q.stem === "Which pair consists of right-bank tributaries of the Ganga?"), true);
assert.equal(ql021.some((q) => q.stem === "Which pair consists only of left-bank tributaries of the Ganga?"), true);
