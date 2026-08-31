import { TRG_001_LOCALIZATION_FREEZE_READINESS } from "./localization-freeze-readiness";

export const TRG_001_LOCALIZATION_HUMAN_APPROVAL_BOUNDARY_VERSION =
  "TRG001_HI_PA_HUMAN_APPROVAL_BOUNDARY_V1" as const;

export const TRG_001_LOCALIZATION_REQUIRED_APPROVAL_STATEMENT =
  "I approve the TRG-001 Final5 Hindi/Punjabi localization candidate for multilingual freeze and internal activation." as const;

export type Trg001LocalizationHumanApprovalRecord = Readonly<{
  boundaryVersion: typeof TRG_001_LOCALIZATION_HUMAN_APPROVAL_BOUNDARY_VERSION;
  packageId: "TRG-001";
  decision: "APPROVED";
  approvalStatement: typeof TRG_001_LOCALIZATION_REQUIRED_APPROVAL_STATEMENT;
  reviewer: string;
  approvedAtIso: string;
  candidateVersion: typeof TRG_001_LOCALIZATION_FREEZE_READINESS.candidateVersion;
  candidateSourceHead: typeof TRG_001_LOCALIZATION_FREEZE_READINESS.candidateSourceHead;
  frozenEnglishFingerprint: typeof TRG_001_LOCALIZATION_FREEZE_READINESS.englishAuthority.fingerprint;
  locales: readonly ["hi-IN", "pa-IN"];
  localizedSurfaces: 288;
  evidenceArtifactId: typeof TRG_001_LOCALIZATION_FREEZE_READINESS.evidence.reviewReadiness.artifactId;
  evidenceArtifactDigest: typeof TRG_001_LOCALIZATION_FREEZE_READINESS.evidence.reviewReadiness.artifactDigest;
}>;

export const TRG_001_LOCALIZATION_APPROVAL_BOUNDARY_STATE = Object.freeze({
  packageId: "TRG-001",
  engineeringReviewReadiness: TRG_001_LOCALIZATION_FREEZE_READINESS.engineeringReviewReadiness,
  humanLanguageApproval: "PENDING" as const,
  approvalRecordPresent: false,
  multilingualFreezeGranted: false,
  freezeAuthorized: false,
  activationAuthorized: false,
  questionStudioEnabledForLocalizedSurface: false,
  questionBankWritableForLocalizedSurface: false,
  testBuilderEligibleForLocalizedSurface: false,
  publiclyPublishable: false,
  publicReleaseAuthorized: false,
});

function fail(message: string): never {
  throw new Error(`TRG-001 localization approval rejected: ${message}`);
}

export function validateTrg001LocalizationHumanApprovalRecord(
  record: Trg001LocalizationHumanApprovalRecord,
) {
  const readiness = TRG_001_LOCALIZATION_FREEZE_READINESS;

  if (readiness.engineeringReviewReadiness !== "PASS") fail("engineering review readiness is not PASS.");
  if (record.boundaryVersion !== TRG_001_LOCALIZATION_HUMAN_APPROVAL_BOUNDARY_VERSION) fail("boundary version mismatch.");
  if (record.packageId !== "TRG-001") fail("package mismatch.");
  if (record.decision !== "APPROVED") fail("decision is not APPROVED.");
  if (record.approvalStatement !== TRG_001_LOCALIZATION_REQUIRED_APPROVAL_STATEMENT) fail("approval statement mismatch.");
  if (!record.reviewer.trim()) fail("reviewer is empty.");
  if (!Number.isFinite(Date.parse(record.approvedAtIso))) fail("approval timestamp is invalid.");
  if (record.candidateVersion !== readiness.candidateVersion) fail("candidate version mismatch.");
  if (record.candidateSourceHead !== readiness.candidateSourceHead) fail("candidate source head mismatch.");
  if (record.frozenEnglishFingerprint !== readiness.englishAuthority.fingerprint) fail("frozen English fingerprint mismatch.");
  if (record.locales.length !== 2 || record.locales[0] !== "hi-IN" || record.locales[1] !== "pa-IN") fail("locale scope mismatch.");
  if (record.localizedSurfaces !== readiness.localizedScope.localizedSurfaces) fail("localized surface count mismatch.");
  if (record.evidenceArtifactId !== readiness.evidence.reviewReadiness.artifactId) fail("evidence artifact id mismatch.");
  if (record.evidenceArtifactDigest !== readiness.evidence.reviewReadiness.artifactDigest) fail("evidence artifact digest mismatch.");

  return Object.freeze({
    status: "APPROVAL_RECORD_VALID" as const,
    packageId: "TRG-001" as const,
    reviewer: record.reviewer,
    approvedAtIso: record.approvedAtIso,
    candidateVersion: record.candidateVersion,
    candidateSourceHead: record.candidateSourceHead,
    frozenEnglishFingerprint: record.frozenEnglishFingerprint,
    locales: record.locales,
    localizedSurfaces: record.localizedSurfaces,
    evidenceArtifactId: record.evidenceArtifactId,
    evidenceArtifactDigest: record.evidenceArtifactDigest,
  });
}

/**
 * This function validates a supplied approval record only. It does not mutate
 * Question Studio, Question Bank, Test Builder, public release, or freeze state.
 * A separate activation change must explicitly consume a committed approval
 * record after this validator passes.
 */
export function buildTrg001LocalizationActivationAuthorization(
  record: Trg001LocalizationHumanApprovalRecord,
) {
  const approval = validateTrg001LocalizationHumanApprovalRecord(record);
  return Object.freeze({
    ...approval,
    multilingualFreezeAuthorizedByRecord: true,
    internalActivationAuthorizedByRecord: true,
    publicReleaseAuthorizedByRecord: false,
    automaticStudentPublicationAuthorizedByRecord: false,
  });
}
