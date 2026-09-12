import { TRG_001_LOCALIZATION_FREEZE_READINESS } from "./localization-freeze-readiness";

export const TRG_001_LOCALIZATION_HUMAN_APPROVAL_BOUNDARY_VERSION =
  "TRG001_HI_PA_HUMAN_APPROVAL_BOUNDARY_V1" as const;

export const TRG_001_LOCALIZATION_REQUIRED_APPROVAL_STATEMENT =
  "I approve the TRG-001 Final5 Hindi/Punjabi localization candidate for multilingual freeze and internal activation." as const;

export const TRG_001_LOCALIZATION_HUMAN_APPROVAL_BOUNDARY_SUPERSEDED = true as const;
export const TRG_001_LOCALIZATION_HUMAN_APPROVAL_BOUNDARY_SUPERSEDED_BY =
  "TRG001_POST_FINAL5_HUMAN_APPROVAL_BOUNDARY_V1" as const;

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
  packageId: "TRG-001" as const,
  historicalCandidateVersion: TRG_001_LOCALIZATION_FREEZE_READINESS.candidateVersion,
  historicalEngineeringReviewReadiness: TRG_001_LOCALIZATION_FREEZE_READINESS.engineeringReviewReadiness,
  superseded: true as const,
  supersededBy: TRG_001_LOCALIZATION_HUMAN_APPROVAL_BOUNDARY_SUPERSEDED_BY,
  humanLanguageApproval: "PENDING" as const,
  approvalRecordPresent: false as const,
  multilingualFreezeGranted: false as const,
  freezeAuthorized: false as const,
  activationAuthorized: false as const,
  questionStudioEnabledForLocalizedSurface: false as const,
  questionBankWritableForLocalizedSurface: false as const,
  testBuilderEligibleForLocalizedSurface: false as const,
  publiclyPublishable: false as const,
  publicReleaseAuthorized: false as const,
});

function superseded(): never {
  throw new Error(
    "TRG-001 Final5 localization approval rejected: boundary superseded by the post-Final5 remediation approval boundary.",
  );
}

/**
 * Historical Final5 approval records are no longer authorizable because the
 * merged post-Final5 remediation changes learner-facing English/localized
 * content. The Final5 evidence remains provenance only.
 */
export function validateTrg001LocalizationHumanApprovalRecord(
  _record: Trg001LocalizationHumanApprovalRecord,
): never {
  return superseded();
}

export function buildTrg001LocalizationActivationAuthorization(
  _record: Trg001LocalizationHumanApprovalRecord,
): never {
  return superseded();
}
