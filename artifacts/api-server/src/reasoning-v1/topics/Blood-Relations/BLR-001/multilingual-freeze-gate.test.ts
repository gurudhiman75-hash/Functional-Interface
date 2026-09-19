import { strict as assert } from "node:assert";

import { BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION } from "./multilingual-human-review-pack";
import {
  assertBlr001MultilingualFreezeApproved,
  buildBlr001MultilingualFreezeReadiness,
  validateBlr001MultilingualApprovalReceipt,
} from "./multilingual-freeze-gate";

assert.deepEqual(
  validateBlr001MultilingualApprovalReceipt(undefined),
  ["PRODUCT_OWNER_APPROVAL_RECEIPT_MISSING"],
);
assert.throws(
  () => assertBlr001MultilingualFreezeApproved(undefined),
  /PRODUCT_OWNER_APPROVAL_RECEIPT_MISSING/,
);

const partial = {
  reviewPackVersion: BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION,
  reviewedPermanentQlRange: "BLR-QL-001..BLR-QL-030" as const,
  approvedBy: "PRODUCT_OWNER" as const,
  approvedAt: "2026-09-19",
  cp001ThroughCp005HindiPunjabiApproved: true as const,
};
assert.deepEqual(
  validateBlr001MultilingualApprovalReceipt(partial),
  ["CP006_EDITORIAL_V3_TRILINGUAL_APPROVAL_MISSING"],
);

const wrongVersion = {
  ...partial,
  reviewPackVersion: "stale-pack",
  cp006EditorialV3TrilingualApproved: true as const,
};
assert.deepEqual(
  validateBlr001MultilingualApprovalReceipt(wrongVersion as any),
  ["REVIEW_PACK_VERSION_MISMATCH"],
);

const approved = {
  reviewPackVersion: BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION,
  reviewedPermanentQlRange: "BLR-QL-001..BLR-QL-030" as const,
  approvedBy: "PRODUCT_OWNER" as const,
  approvedAt: "2026-09-19",
  cp001ThroughCp005HindiPunjabiApproved: true as const,
  cp006EditorialV3TrilingualApproved: true as const,
};
assert.doesNotThrow(() => assertBlr001MultilingualFreezeApproved(approved));

const readiness = buildBlr001MultilingualFreezeReadiness(approved);
assert.equal(readiness.freezeEligible, true);
assert.equal(readiness.approvalReceiptAccepted, true);
assert.deepEqual(readiness.approvalBlockers, []);
assert.deepEqual(readiness.releaseState, {
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
});

const missing = buildBlr001MultilingualFreezeReadiness();
assert.equal(missing.freezeEligible, false);
assert.equal(missing.releaseState.questionBankWritable, false);
assert.equal(missing.releaseState.testEligible, false);
assert.equal(missing.releaseState.publiclyPublishable, false);

console.log(JSON.stringify({
  verdict: "BLR_001_MULTILINGUAL_FREEZE_GATE_FAILS_CLOSED",
  reviewPackVersion: BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION,
  explicitProductOwnerApprovalRequired: true,
  freezeIsNotRelease: true,
  currentQuestionBankWritable: false,
  currentTestEligible: false,
  currentPubliclyPublishable: false,
}, null, 2));
