import assert from "node:assert/strict";

import { SEA002_CP008_PREFREEZE_AUTHORITY_V2 } from "./prefreeze-authority-v2.ts";
import { buildSea002Cp008FrozenAuthorityV2 } from "./freeze-contract-v2.ts";

const validApproval = Object.freeze({
  approvedBy: "PRODUCT_OWNER" as const,
  approvedAt: "2026-08-26T04:45:00Z",
  englishReviewFingerprint: SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.reviewFingerprint,
  localizationReviewFingerprint: SEA002_CP008_PREFREEZE_AUTHORITY_V2.localization.reviewFingerprint,
});

const frozen = buildSea002Cp008FrozenAuthorityV2(validApproval);
assert.equal(frozen.productOwnerApprovalStatus, "APPROVED");
assert.equal(frozen.freezeStatus, "FROZEN");
assert.equal(frozen.englishFreezeStatus, "FROZEN");
assert.equal(frozen.localizationFreezeStatus, "FROZEN");
assert.equal(frozen.questionStudioActivationEligible, true);
assert.equal(frozen.questionStudioRegistered, false);
assert.equal(frozen.questionBankWritable, false);
assert.equal(frozen.testEligible, false);
assert.equal(frozen.mockTestEligible, false);
assert.equal(frozen.productionStaging, false);
assert.equal(frozen.publiclyPublishable, false);
assert.equal(frozen.automaticStudentDelivery, false);
assert.equal(frozen.nextPermanentQlId, "SEA-QL-036");

assert.throws(() => buildSea002Cp008FrozenAuthorityV2({ ...validApproval, approvedBy: "REVIEWER" as never }), /PRODUCT_OWNER approval/iu);
assert.throws(() => buildSea002Cp008FrozenAuthorityV2({ ...validApproval, approvedAt: "2026-08-26" }), /UTC ISO timestamp/iu);
assert.throws(() => buildSea002Cp008FrozenAuthorityV2({ ...validApproval, englishReviewFingerprint: "0".repeat(64) }), /English approval fingerprint/iu);
assert.throws(() => buildSea002Cp008FrozenAuthorityV2({ ...validApproval, localizationReviewFingerprint: "f".repeat(64) }), /localization approval fingerprint/iu);

assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.productOwnerApprovalStatus, "PENDING");
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.freezeStatus, "NOT_FROZEN");
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.questionStudioActivationEligible, false);

console.log("PASS_SEA002_CP008_FREEZE_CONTRACT_V2");
console.log("exact V2 review fingerprints required", true);
console.log("explicit PRODUCT_OWNER approval required", true);
console.log("repository lifecycle mutated", false);
console.log("actual approval/freeze", "PENDING", "NOT_FROZEN");
