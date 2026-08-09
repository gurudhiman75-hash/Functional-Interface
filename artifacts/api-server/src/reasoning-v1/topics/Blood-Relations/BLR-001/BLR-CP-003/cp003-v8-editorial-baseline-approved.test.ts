import assert from "node:assert/strict";

import {
  BLR_CP003_V8_EDITORIAL_APPROVAL_SCOPE,
  BLR_CP003_V8_EDITORIAL_BASELINE_APPROVAL_VERSION,
  generateBlrCp003V8EditorialBaselineApprovedRecords,
} from "./cp003-v8-editorial-baseline-approved";

const records = generateBlrCp003V8EditorialBaselineApprovedRecords();
const itemIds = new Set<string>();
const fingerprints = new Set<string>();

assert.equal(records.length, 130);
assert.equal(
  BLR_CP003_V8_EDITORIAL_BASELINE_APPROVAL_VERSION,
  "BLR_CP003_V8_EDITORIAL_BASELINE_APPROVAL_V1",
);
assert.equal(BLR_CP003_V8_EDITORIAL_APPROVAL_SCOPE, "EDITORIAL_STAGING_ONLY");

for (const record of records) {
  assert.ok(!itemIds.has(record.itemId));
  itemIds.add(record.itemId);
  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);

  assert.equal(record.metadata.editorialBaselineApproved, true);
  assert.equal(record.metadata.approvalScope, "EDITORIAL_STAGING_ONLY");
  assert.equal(record.metadata.approvedQualityScore, 9.3);
  assert.equal(record.metadata.structuralSaturationApproved, false);
  assert.equal(record.metadata.productionStagingApproved, false);
  assert.equal(record.metadata.humanReviewApproved, false);

  assert.equal(record.permanentQlId, null);
  assert.equal(record.prototypeOnly, true);
  assert.equal(record.reviewOnly, true);
  assert.equal(record.publiclyPublishable, false);
  assert.equal(record.questionStudioVisible, false);
  assert.equal(record.questionBankEligible, false);
  assert.equal(record.mockTestEligible, false);
}

assert.equal(itemIds.size, 130);
assert.equal(fingerprints.size, 130);

console.log(
  JSON.stringify(
    {
      approvalVersion: BLR_CP003_V8_EDITORIAL_BASELINE_APPROVAL_VERSION,
      approvalScope: BLR_CP003_V8_EDITORIAL_APPROVAL_SCOPE,
      approvedBaselineRecords: records.length,
      approvedQualityScore: 9.3,
      structuralSaturationApproved: false,
      productionStagingApproved: false,
      permanentQlCount: 0,
      verdict:
        "BLR-CP-003 V8 EDITORIAL BASELINE IS HUMAN-APPROVED FOR EDITORIAL STAGING ONLY; STRUCTURAL FREEZE AND ALL RELEASE STATES REMAIN BLOCKED",
    },
    null,
    2,
  ),
);
