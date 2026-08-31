import assert from "node:assert/strict";

import { TRG_001_POST_FINAL5_FREEZE_READINESS } from "./post-final5-freeze-readiness";
import {
  TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE,
  TRG_001_POST_FINAL5_HUMAN_APPROVAL_BOUNDARY_VERSION,
  TRG_001_POST_FINAL5_REQUIRED_APPROVAL_STATEMENT,
  buildTrg001PostFinal5ActivationAuthorization,
  validateTrg001PostFinal5HumanApprovalRecord,
  type Trg001PostFinal5HumanApprovalRecord,
} from "./post-final5-human-approval-boundary";

const readiness = TRG_001_POST_FINAL5_FREEZE_READINESS;

assert.equal(readiness.engineeringReviewReadiness, "PASS");
assert.equal(readiness.candidate.englishRemediationVersion, "TRG001_POST_FREEZE_REMEDIATION_V1");
assert.equal(readiness.candidate.localizationVersion, "TRG001_HI_PA_LOCALIZATION_NATIVE_REVIEW_FINAL6");
assert.equal(readiness.candidate.reviewedSourceHead, "cd6fc6bec42892b1d366617442cbe8dbebb48069");
assert.equal(readiness.candidate.mergedCommit, "5f819b129643bc74651473cf226142d0b239c635");
assert.equal(readiness.historicalEnglishAuthority.inheritedByCandidate, false);
assert.deepEqual(readiness.historicalEnglishAuthority.changedQlIds, ["TRG-001-QL-093"]);
assert.deepEqual(readiness.localizedScope.locales, ["hi-IN", "pa-IN"]);
assert.equal(readiness.localizedScope.localizedSurfaces, 288);
assert.equal(readiness.evidence.workflowRunId, 33370572812);
assert.equal(readiness.evidence.artifactId, 9749893158);
assert.equal(readiness.evidence.artifactDigest, "sha256:e393b69a2ac89416c5bbb926681319e0938df28e9a5b849ba49fa6e0566bb834");

assert.equal(TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE.humanReview, "PENDING");
assert.equal(TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE.approvalRecordPresent, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE.newEnglishFreezeGranted, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE.multilingualFreezeGranted, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE.freezeAuthorized, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE.activationAuthorized, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE.questionStudioEnabled, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE.questionBankWritable, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE.testBuilderEligible, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE.publiclyPublishable, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE.publicReleaseAuthorized, false);

const fixture: Trg001PostFinal5HumanApprovalRecord = {
  boundaryVersion: TRG_001_POST_FINAL5_HUMAN_APPROVAL_BOUNDARY_VERSION,
  packageId: "TRG-001",
  decision: "APPROVED",
  approvalStatement: TRG_001_POST_FINAL5_REQUIRED_APPROVAL_STATEMENT,
  reviewer: "TEST_FIXTURE_ONLY",
  approvedAtIso: "2026-08-31T08:00:00.000Z",
  englishRemediationVersion: readiness.candidate.englishRemediationVersion,
  localizationVersion: readiness.candidate.localizationVersion,
  reviewedSourceHead: readiness.candidate.reviewedSourceHead,
  mergedCommit: readiness.candidate.mergedCommit,
  historicalEnglishFingerprint: readiness.historicalEnglishAuthority.approvedFingerprint,
  englishChangedQlIds: ["TRG-001-QL-093"],
  locales: ["hi-IN", "pa-IN"],
  localizedSurfaces: 288,
  evidenceWorkflowRunId: readiness.evidence.workflowRunId,
  evidenceArtifactId: readiness.evidence.artifactId,
  evidenceArtifactDigest: readiness.evidence.artifactDigest,
};

const validation = validateTrg001PostFinal5HumanApprovalRecord(fixture);
assert.equal(validation.status, "APPROVAL_RECORD_VALID");
assert.equal(validation.reviewer, "TEST_FIXTURE_ONLY");
assert.equal(validation.reviewedSourceHead, readiness.candidate.reviewedSourceHead);
assert.equal(validation.mergedCommit, readiness.candidate.mergedCommit);

const authorization = buildTrg001PostFinal5ActivationAuthorization(fixture);
assert.equal(authorization.newEnglishFreezeAuthorizedByRecord, true);
assert.equal(authorization.multilingualFreezeAuthorizedByRecord, true);
assert.equal(authorization.internalActivationAuthorizedByRecord, true);
assert.equal(authorization.publicReleaseAuthorizedByRecord, false);
assert.equal(authorization.automaticStudentPublicationAuthorizedByRecord, false);

function expectReject(mutator: (value: any) => void, pattern: RegExp) {
  const value: any = structuredClone(fixture);
  mutator(value);
  assert.throws(() => validateTrg001PostFinal5HumanApprovalRecord(value), pattern);
}

expectReject((value) => { value.boundaryVersion = "WRONG"; }, /boundary version mismatch/u);
expectReject((value) => { value.approvalStatement = "approved"; }, /approval statement mismatch/u);
expectReject((value) => { value.reviewer = "   "; }, /reviewer is empty/u);
expectReject((value) => { value.approvedAtIso = "not-a-date"; }, /approval timestamp is invalid/u);
expectReject((value) => { value.englishRemediationVersion = "WRONG"; }, /English remediation version mismatch/u);
expectReject((value) => { value.localizationVersion = "WRONG"; }, /localization version mismatch/u);
expectReject((value) => { value.reviewedSourceHead = "0000000000000000000000000000000000000000"; }, /reviewed source head mismatch/u);
expectReject((value) => { value.mergedCommit = "0000000000000000000000000000000000000000"; }, /merged commit mismatch/u);
expectReject((value) => { value.historicalEnglishFingerprint = "wrong"; }, /historical English fingerprint mismatch/u);
expectReject((value) => { value.englishChangedQlIds = []; }, /English changed-QL scope mismatch/u);
expectReject((value) => { value.locales = ["pa-IN", "hi-IN"]; }, /locale scope mismatch/u);
expectReject((value) => { value.localizedSurfaces = 287; }, /localized surface count mismatch/u);
expectReject((value) => { value.evidenceWorkflowRunId = 1; }, /evidence workflow run mismatch/u);
expectReject((value) => { value.evidenceArtifactId = 1; }, /evidence artifact id mismatch/u);
expectReject((value) => { value.evidenceArtifactDigest = "sha256:wrong"; }, /evidence artifact digest mismatch/u);

console.log(JSON.stringify({
  status: "TRG001_POST_FINAL5_HUMAN_APPROVAL_BOUNDARY_PASS",
  engineeringReviewReadiness: readiness.engineeringReviewReadiness,
  currentHumanReview: TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE.humanReview,
  currentFreezeAuthorized: TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE.freezeAuthorized,
  currentActivationAuthorized: TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE.activationAuthorized,
  reviewedSourceHead: readiness.candidate.reviewedSourceHead,
  mergedCommit: readiness.candidate.mergedCommit,
  localizedSurfaces: readiness.localizedScope.localizedSurfaces,
  evidenceArtifactId: readiness.evidence.artifactId,
}, null, 2));
