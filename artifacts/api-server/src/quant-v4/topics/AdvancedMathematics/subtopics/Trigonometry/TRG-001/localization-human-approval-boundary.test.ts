import assert from "node:assert/strict";

import { TRG_001_LOCALIZATION_FREEZE_READINESS } from "./localization-freeze-readiness";
import {
  TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE,
  TRG_001_LOCALIZATION_HUMAN_APPROVAL_BOUNDARY_VERSION,
  TRG_001_LOCALIZATION_REQUIRED_APPROVAL_STATEMENT,
  buildTrg001LocalizationActivationAuthorization,
  validateTrg001LocalizationHumanApprovalRecord,
  type Trg001LocalizationHumanApprovalRecord,
} from "./localization-human-approval-boundary";

const readiness = TRG_001_LOCALIZATION_FREEZE_READINESS;

assert.equal(readiness.engineeringReviewReadiness, "PASS");
assert.equal(readiness.candidateVersion, "TRG001_HI_PA_LOCALIZATION_NATIVE_REVIEW_FINAL5");
assert.equal(readiness.candidateSourceHead, "830cb5bad4b0364780da8e4376c27cc10b694125");
assert.equal(readiness.englishAuthority.fingerprint, "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611");
assert.deepEqual(readiness.localizedScope.locales, ["hi-IN", "pa-IN"]);
assert.equal(readiness.localizedScope.localizedSurfaces, 288);
assert.equal(readiness.evidence.reviewReadiness.artifactId, 9731397083);
assert.equal(readiness.evidence.reviewReadiness.artifactDigest, "sha256:f7730983265a12199b071a6171aad7852956b575a7d766f5884c1ddc0db0f800");

assert.equal(TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.humanLanguageApproval, "PENDING");
assert.equal(TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.approvalRecordPresent, false);
assert.equal(TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.multilingualFreezeGranted, false);
assert.equal(TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.freezeAuthorized, false);
assert.equal(TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.activationAuthorized, false);
assert.equal(TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.questionStudioEnabledForLocalizedSurface, false);
assert.equal(TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.questionBankWritableForLocalizedSurface, false);
assert.equal(TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.testBuilderEligibleForLocalizedSurface, false);
assert.equal(TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.publiclyPublishable, false);
assert.equal(TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.publicReleaseAuthorized, false);

const fixture: Trg001LocalizationHumanApprovalRecord = {
  boundaryVersion: TRG_001_LOCALIZATION_HUMAN_APPROVAL_BOUNDARY_VERSION,
  packageId: "TRG-001",
  decision: "APPROVED",
  approvalStatement: TRG_001_LOCALIZATION_REQUIRED_APPROVAL_STATEMENT,
  reviewer: "TEST_FIXTURE_ONLY",
  approvedAtIso: "2026-08-31T00:00:00.000Z",
  candidateVersion: readiness.candidateVersion,
  candidateSourceHead: readiness.candidateSourceHead,
  frozenEnglishFingerprint: readiness.englishAuthority.fingerprint,
  locales: ["hi-IN", "pa-IN"],
  localizedSurfaces: 288,
  evidenceArtifactId: readiness.evidence.reviewReadiness.artifactId,
  evidenceArtifactDigest: readiness.evidence.reviewReadiness.artifactDigest,
};

const validation = validateTrg001LocalizationHumanApprovalRecord(fixture);
assert.equal(validation.status, "APPROVAL_RECORD_VALID");
assert.equal(validation.reviewer, "TEST_FIXTURE_ONLY");
assert.equal(validation.candidateSourceHead, readiness.candidateSourceHead);

const authorization = buildTrg001LocalizationActivationAuthorization(fixture);
assert.equal(authorization.multilingualFreezeAuthorizedByRecord, true);
assert.equal(authorization.internalActivationAuthorizedByRecord, true);
assert.equal(authorization.publicReleaseAuthorizedByRecord, false);
assert.equal(authorization.automaticStudentPublicationAuthorizedByRecord, false);

function expectReject(mutator: (value: any) => void, pattern: RegExp) {
  const value: any = structuredClone(fixture);
  mutator(value);
  assert.throws(() => validateTrg001LocalizationHumanApprovalRecord(value), pattern);
}

expectReject((value) => { value.candidateVersion = "WRONG"; }, /candidate version mismatch/u);
expectReject((value) => { value.candidateSourceHead = "0000000000000000000000000000000000000000"; }, /candidate source head mismatch/u);
expectReject((value) => { value.frozenEnglishFingerprint = "wrong"; }, /frozen English fingerprint mismatch/u);
expectReject((value) => { value.locales = ["pa-IN", "hi-IN"]; }, /locale scope mismatch/u);
expectReject((value) => { value.localizedSurfaces = 287; }, /localized surface count mismatch/u);
expectReject((value) => { value.evidenceArtifactId = 1; }, /evidence artifact id mismatch/u);
expectReject((value) => { value.evidenceArtifactDigest = "sha256:wrong"; }, /evidence artifact digest mismatch/u);
expectReject((value) => { value.approvalStatement = "approved"; }, /approval statement mismatch/u);
expectReject((value) => { value.reviewer = "   "; }, /reviewer is empty/u);
expectReject((value) => { value.approvedAtIso = "not-a-date"; }, /approval timestamp is invalid/u);

console.log(JSON.stringify({
  status: "TRG001_FINAL5_HUMAN_APPROVAL_BOUNDARY_PASS",
  engineeringReviewReadiness: readiness.engineeringReviewReadiness,
  currentHumanApproval: TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.humanLanguageApproval,
  currentFreezeAuthorized: TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.freezeAuthorized,
  currentActivationAuthorized: TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.activationAuthorized,
  candidateVersion: readiness.candidateVersion,
  candidateSourceHead: readiness.candidateSourceHead,
  localizedSurfaces: readiness.localizedScope.localizedSurfaces,
  evidenceArtifactId: readiness.evidence.reviewReadiness.artifactId,
}, null, 2));
