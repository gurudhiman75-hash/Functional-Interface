import assert from "node:assert/strict";

import { buildSea002Cp007FrozenAuthority } from "./freeze-contract-v1.ts";
import { SEA002_CP007_PREFREEZE_AUTHORITY_V1 } from "./prefreeze-authority-v1.ts";

const testApproval = Object.freeze({
  approvedBy: "PRODUCT_OWNER" as const,
  approvedAt: "2099-01-01T00:00:00Z",
  englishReviewFingerprint: SEA002_CP007_PREFREEZE_AUTHORITY_V1.english.reviewFingerprint,
  localizationReviewFingerprint: SEA002_CP007_PREFREEZE_AUTHORITY_V1.localization.reviewFingerprint,
  englishArtifactId: SEA002_CP007_PREFREEZE_AUTHORITY_V1.english.artifactId,
  localizationArtifactId: SEA002_CP007_PREFREEZE_AUTHORITY_V1.localization.artifactId,
});

const frozen = buildSea002Cp007FrozenAuthority(testApproval);
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
assert.equal(frozen.nextPermanentQlId, "SEA-QL-029");

assert.throws(
  () => buildSea002Cp007FrozenAuthority({ ...testApproval, approvedAt: "not-a-timestamp" }),
  /explicit UTC ISO timestamp/iu,
);
assert.throws(
  () => buildSea002Cp007FrozenAuthority({ ...testApproval, englishArtifactId: 1 as typeof testApproval.englishArtifactId }),
  /English approval artifact is stale or incorrect/iu,
);
assert.throws(
  () => buildSea002Cp007FrozenAuthority({ ...testApproval, localizationArtifactId: 1 as typeof testApproval.localizationArtifactId }),
  /localization approval artifact is stale or incorrect/iu,
);
assert.throws(
  () => buildSea002Cp007FrozenAuthority({
    ...testApproval,
    englishReviewFingerprint: "stale" as typeof testApproval.englishReviewFingerprint,
  }),
  /English approval fingerprint does not match/iu,
);
assert.throws(
  () => buildSea002Cp007FrozenAuthority({
    ...testApproval,
    localizationReviewFingerprint: "stale" as typeof testApproval.localizationReviewFingerprint,
  }),
  /localization approval fingerprint does not match/iu,
);

assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.productOwnerApprovalStatus, "PENDING", "test-only freeze construction must not mutate repository lifecycle state");
assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.freezeStatus, "NOT_FROZEN");
assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.questionStudioActivationEligible, false);

console.log("PASS_SEA002_CP007_FREEZE_CONTRACT_V1");
console.log("test-only valid transition", "APPROVED -> FROZEN");
console.log("repository approval state", SEA002_CP007_PREFREEZE_AUTHORITY_V1.productOwnerApprovalStatus);
console.log("repository freeze state", SEA002_CP007_PREFREEZE_AUTHORITY_V1.freezeStatus);
console.log("Studio active", false);
