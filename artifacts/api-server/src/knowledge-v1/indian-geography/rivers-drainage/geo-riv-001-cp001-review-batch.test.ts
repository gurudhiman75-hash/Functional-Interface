import { strict as assert } from "node:assert";

import {
  GEO_RIV_001_CP001_REVIEW_BATCH_V1,
  auditGeoRiv001Cp001ReviewBatch,
} from "./geo-riv-001-cp001-review-batch";

const audit = auditGeoRiv001Cp001ReviewBatch();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.deepEqual(audit.difficultyCounts, {
  Easy: 18,
  Medium: 25,
  Hard: 11,
});

assert.equal(
  GEO_RIV_001_CP001_REVIEW_BATCH_V1.every(
    (question) =>
      question.reviewOnly === true &&
      question.runtimeRegistered === false &&
      question.sourceIds.length > 0 &&
      question.sourceFactIds.length > 0,
  ),
  true,
);

const qlSet = new Set(
  GEO_RIV_001_CP001_REVIEW_BATCH_V1.map((question) => question.qlId),
);
assert.equal(qlSet.size, 9);
