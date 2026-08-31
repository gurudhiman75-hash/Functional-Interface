import assert from "node:assert/strict";

import { TRG_001_LOCALIZATION_FREEZE_READINESS } from "./localization-freeze-readiness";
import {
  TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE,
  TRG_001_LOCALIZATION_HUMAN_APPROVAL_BOUNDARY_SUPERSEDED,
  TRG_001_LOCALIZATION_HUMAN_APPROVAL_BOUNDARY_SUPERSEDED_BY,
  TRG_001_LOCALIZATION_HUMAN_APPROVAL_BOUNDARY_VERSION,
  TRG_001_LOCALIZATION_REQUIRED_APPROVAL_STATEMENT,
  buildTrg001LocalizationActivationAuthorization,
  validateTrg001LocalizationHumanApprovalRecord,
  type Trg001LocalizationHumanApprovalRecord,
} from "./localization-human-approval-boundary";

const readiness = TRG_001_LOCALIZATION_FREEZE_READINESS;

assert.equal(readiness.candidateVersion, "TRG001_HI_PA_LOCALIZATION_NATIVE_REVIEW_FINAL5");
assert.equal(readiness.candidateSourceHead, "830cb5bad4b0364780da8e4376c27cc10b694125");
assert.equal(readiness.evidence.reviewReadiness.artifactId, 9731397083);
assert.equal(TRG_001_LOCALIZATION_HUMAN_APPROVAL_BOUNDARY_SUPERSEDED, true);
assert.equal(TRG_001_LOCALIZATION_HUMAN_APPROVAL_BOUNDARY_SUPERSEDED_BY, "TRG001_POST_FINAL5_HUMAN_APPROVAL_BOUNDARY_V1");
assert.equal(TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.superseded, true);
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

const historicalFixture: Trg001LocalizationHumanApprovalRecord = {
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

assert.throws(
  () => validateTrg001LocalizationHumanApprovalRecord(historicalFixture),
  /boundary superseded by the post-Final5 remediation approval boundary/u,
);
assert.throws(
  () => buildTrg001LocalizationActivationAuthorization(historicalFixture),
  /boundary superseded by the post-Final5 remediation approval boundary/u,
);

console.log(JSON.stringify({
  status: "TRG001_FINAL5_HUMAN_APPROVAL_BOUNDARY_SUPERSEDED_PASS",
  historicalCandidateVersion: readiness.candidateVersion,
  historicalCandidateSourceHead: readiness.candidateSourceHead,
  historicalEvidenceArtifactId: readiness.evidence.reviewReadiness.artifactId,
  superseded: TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.superseded,
  supersededBy: TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.supersededBy,
  currentFreezeAuthorized: TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.freezeAuthorized,
  currentActivationAuthorized: TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE.activationAuthorized,
}, null, 2));
