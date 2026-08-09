import assert from "node:assert/strict";

import {
  BLR_CP003_V9_WAVE02_APPROVAL_DATE,
  BLR_CP003_V9_WAVE02_APPROVAL_SCOPE,
  BLR_CP003_V9_WAVE02_STRUCTURAL_STAGING_APPROVAL_VERSION,
  generateBlrCp003V9Wave02StructuralStagingApprovedRecords,
} from "./cp003-v9-wave02-structural-staging-approved";

const records = generateBlrCp003V9Wave02StructuralStagingApprovedRecords();

assert.equal(
  BLR_CP003_V9_WAVE02_STRUCTURAL_STAGING_APPROVAL_VERSION,
  "BLR_CP003_V9_WAVE02_STRUCTURAL_STAGING_APPROVAL_V1",
);
assert.equal(BLR_CP003_V9_WAVE02_APPROVAL_SCOPE, "STRUCTURAL_STAGING_ONLY");
assert.equal(BLR_CP003_V9_WAVE02_APPROVAL_DATE, "2026-08-01");
assert.equal(records.length, 72);
assert.equal(new Set(records.map((record) => record.itemId)).size, 72);
assert.equal(
  new Set(records.map((record) => record.metadata.semanticFingerprint)).size,
  72,
);
assert.deepEqual(
  [0, 1, 2, 3].map(
    (position) => records.filter((record) => record.correctIndex === position).length,
  ),
  [18, 18, 18, 18],
);

for (const record of records) {
  assert.equal(record.metadata.approvedBy, "PROJECT_OWNER");
  assert.equal(record.metadata.approvalDirective, "FINISH_CP");
  assert.equal(record.metadata.humanReviewApproved, true);
  assert.equal(record.metadata.wave02StructuralStagingApproved, true);
  assert.equal(record.metadata.editorialBaselineApproved, false);
  assert.equal(record.metadata.structuralSaturationApproved, false);
  assert.equal(record.metadata.productionStagingApproved, false);
  assert.equal(record.permanentQlId, null);
  assert.equal(record.prototypeOnly, true);
  assert.equal(record.reviewOnly, true);
  assert.equal(record.publiclyPublishable, false);
  assert.equal(record.questionStudioVisible, false);
  assert.equal(record.questionBankEligible, false);
  assert.equal(record.mockTestEligible, false);
  assert.equal(record.options.length, 4);
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(record.options[record.correctIndex]?.isCorrect, true);
}

console.log(
  JSON.stringify(
    {
      approvalVersion:
        BLR_CP003_V9_WAVE02_STRUCTURAL_STAGING_APPROVAL_VERSION,
      approvalScope: BLR_CP003_V9_WAVE02_APPROVAL_SCOPE,
      records: records.length,
      humanReviewApproved: true,
      structuralStagingApproved: true,
      permanentQlCount: 0,
      verdict:
        "BLR-CP-003 V9 WAVE 02 APPROVED FOR STRUCTURAL STAGING WITHOUT RELEASE-SURFACE LEAKAGE",
    },
    null,
    2,
  ),
);
