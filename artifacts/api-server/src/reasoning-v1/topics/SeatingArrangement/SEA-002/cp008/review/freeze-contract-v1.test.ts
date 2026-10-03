import assert from "node:assert/strict";

import { SEA002_CP008_PREFREEZE_AUTHORITY_V1 } from "./prefreeze-authority-v1.ts";
import { buildSea002Cp008FrozenAuthority } from "./freeze-contract-v1.ts";

const validApproval = Object.freeze({
  approvedBy: "PRODUCT_OWNER" as const,
  approvedAt: "2026-08-26T04:40:00Z",
  englishReviewFingerprint: SEA002_CP008_PREFREEZE_AUTHORITY_V1.english.reviewFingerprint,
  localizationReviewFingerprint: SEA002_CP008_PREFREEZE_AUTHORITY_V1.localization.reviewFingerprint,
});

const frozen = buildSea002Cp008FrozenAuthority(validApproval);
assert.equal(frozen.checkpointId, "SEA-CP-008");
assert.deepEqual(frozen.permanentQlIds, SEA002_CP008_PREFREEZE_AUTHORITY_V1.permanentQlIds);
assert.equal(frozen.permanentAuthorityCount, 7);
assert.equal(frozen.productOwnerApprovalStatus, "APPROVED");
assert.equal(frozen.englishFreezeStatus, "FROZEN");
assert.equal(frozen.localizationFreezeStatus, "FROZEN");
assert.equal(frozen.freezeStatus, "FROZEN");
assert.equal(frozen.questionStudioActivationEligible, true);
assert.equal(frozen.questionStudioRegistered, false);
assert.equal(frozen.questionBankWritable, false);
assert.equal(frozen.testEligible, false);
assert.equal(frozen.mockTestEligible, false);
assert.equal(frozen.productionStaging, false);
assert.equal(frozen.publiclyPublishable, false);
assert.equal(frozen.automaticStudentDelivery, false);
assert.equal(frozen.nextPermanentQlId, "SEA-QL-036");

assert.throws(() => buildSea002Cp008FrozenAuthority({
  ...validApproval,
  approvedBy: "REVIEWER" as never,
}), /PRODUCT_OWNER approval/iu);
assert.throws(() => buildSea002Cp008FrozenAuthority({
  ...validApproval,
  approvedAt: "2026-08-26",
}), /UTC ISO timestamp/iu);
assert.throws(() => buildSea002Cp008FrozenAuthority({
  ...validApproval,
  englishReviewFingerprint: "0".repeat(64),
}), /English approval fingerprint/iu);
assert.throws(() => buildSea002Cp008FrozenAuthority({
  ...validApproval,
  localizationReviewFingerprint: "f".repeat(64),
}), /localization approval fingerprint/iu);

assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.productOwnerApprovalStatus, "PENDING");
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.freezeStatus, "NOT_FROZEN");
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.questionStudioActivationEligible, false);

console.log("PASS_SEA002_CP008_FREEZE_CONTRACT_V1");
console.log("valid explicit approval can construct frozen authority", true);
console.log("stale English fingerprint rejected", true);
console.log("stale localization fingerprint rejected", true);
console.log("repository lifecycle mutated by contract", false);
console.log("actual approval/freeze", "PENDING", "NOT_FROZEN");
