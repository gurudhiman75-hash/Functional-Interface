import assert from "node:assert/strict";
import {
  SYL_FREEZE_READINESS_V10,
  SYL_FREEZE_REQUIREMENTS_V10,
} from "./freeze-readiness-v10";

assert.equal(SYL_FREEZE_READINESS_V10.status, "QUESTION_STUDIO_READY__PROFILE_FREEZE_STILL_BLOCKED");
assert.equal(SYL_FREEZE_READINESS_V10.bankingFactorizedPlannerImplemented, true);
assert.equal(SYL_FREEZE_READINESS_V10.sscProfileBoundaryResolved, true);
assert.equal(SYL_FREEZE_READINESS_V10.sscAdaptedPracticeMockWeight, 0);
assert.equal(SYL_FREEZE_READINESS_V10.punjabPoliceProfileBounded, true);
assert.equal(SYL_FREEZE_READINESS_V10.punjabStatewideProfileFrozen, false);
assert.equal(SYL_FREEZE_READINESS_V10.bankingModalLatestEditorialAuthoritiesReferenced, true);
assert.equal(SYL_FREEZE_READINESS_V10.bankingModalHumanProductApprovalRecorded, false);
assert.equal(SYL_FREEZE_READINESS_V10.permanentQl019Created, false);

assert.equal(SYL_FREEZE_READINESS_V10.questionStudioGenerationPermitted, true);
assert.equal(SYL_FREEZE_READINESS_V10.questionBankWritePermitted, false);
assert.equal(SYL_FREEZE_READINESS_V10.testDeliveryPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V10.mockDeliveryPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V10.publicPublishingPermitted, false);

assert.equal(SYL_FREEZE_READINESS_V10.bankingExactWeightingFrozen, false);
assert.equal(SYL_FREEZE_READINESS_V10.difficultyCalibrationFrozen, false);
assert.equal(SYL_FREEZE_READINESS_V10.profileActivationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V10.generatorProfileIntegrationPermitted, false);

assert.ok(SYL_FREEZE_REQUIREMENTS_V10.some((entry) =>
  entry.requirementId === "INACTIVE_PROFILE_ARCHITECTURE_PROVEN" && entry.status === "MET"));
assert.ok(SYL_FREEZE_REQUIREMENTS_V10.some((entry) =>
  entry.requirementId === "SOURCE_PROFILE_FROZEN" && entry.status === "BLOCKED"));

console.log(JSON.stringify({
  status: "PASS_SYL_001_FREEZE_READINESS_V10",
  counts: SYL_FREEZE_READINESS_V10.counts,
  questionStudioReady: true,
  profileFreezeBlocked: true,
}, null, 2));
