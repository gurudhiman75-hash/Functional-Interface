import { TRG_001_POST_FINAL5_FREEZE_READINESS } from "./post-final5-freeze-readiness";

export const TRG_001_POST_FINAL5_HUMAN_APPROVAL_BOUNDARY_VERSION =
  "TRG001_POST_FINAL5_HUMAN_APPROVAL_BOUNDARY_V1" as const;

export const TRG_001_POST_FINAL5_REQUIRED_APPROVAL_STATEMENT =
  "I approve the TRG-001 post-Final5 English remediation and Final6 Hindi/Punjabi localization candidate for new freeze and internal activation." as const;

export type Trg001PostFinal5HumanApprovalRecord = Readonly<{
  boundaryVersion: typeof TRG_001_POST_FINAL5_HUMAN_APPROVAL_BOUNDARY_VERSION;
  packageId: "TRG-001";
  decision: "APPROVED";
  approvalStatement: typeof TRG_001_POST_FINAL5_REQUIRED_APPROVAL_STATEMENT;
  reviewer: string;
  approvedAtIso: string;
  englishRemediationVersion: typeof TRG_001_POST_FINAL5_FREEZE_READINESS.candidate.englishRemediationVersion;
  localizationVersion: typeof TRG_001_POST_FINAL5_FREEZE_READINESS.candidate.localizationVersion;
  reviewedSourceHead: typeof TRG_001_POST_FINAL5_FREEZE_READINESS.candidate.reviewedSourceHead;
  mergedCommit: typeof TRG_001_POST_FINAL5_FREEZE_READINESS.candidate.mergedCommit;
  historicalEnglishFingerprint: typeof TRG_001_POST_FINAL5_FREEZE_READINESS.historicalEnglishAuthority.approvedFingerprint;
  englishChangedQlIds: readonly ["TRG-001-QL-093"];
  locales: readonly ["hi-IN", "pa-IN"];
  localizedSurfaces: 288;
  evidenceWorkflowRunId: typeof TRG_001_POST_FINAL5_FREEZE_READINESS.evidence.workflowRunId;
  evidenceArtifactId: typeof TRG_001_POST_FINAL5_FREEZE_READINESS.evidence.artifactId;
  evidenceArtifactDigest: typeof TRG_001_POST_FINAL5_FREEZE_READINESS.evidence.artifactDigest;
}>;

export const TRG_001_POST_FINAL5_APPROVAL_BOUNDARY_STATE = Object.freeze({
  packageId: "TRG-001" as const,
  engineeringReviewReadiness: TRG_001_POST_FINAL5_FREEZE_READINESS.engineeringReviewReadiness,
  humanReview: "PENDING" as const,
  approvalRecordPresent: false as const,
  newEnglishFreezeGranted: false as const,
  multilingualFreezeGranted: false as const,
  freezeAuthorized: false as const,
  activationAuthorized: false as const,
  questionStudioEnabled: false as const,
  questionBankWritable: false as const,
  testBuilderEligible: false as const,
  publiclyPublishable: false as const,
  publicReleaseAuthorized: false as const,
});

function fail(message: string): never {
  throw new Error(`TRG-001 post-Final5 approval rejected: ${message}`);
}

export function validateTrg001PostFinal5HumanApprovalRecord(
  record: Trg001PostFinal5HumanApprovalRecord,
) {
  const readiness = TRG_001_POST_FINAL5_FREEZE_READINESS;

  if (readiness.engineeringReviewReadiness !== "PASS") fail("engineering review readiness is not PASS.");
  if (readiness.historicalEnglishAuthority.inheritedByCandidate !== false) fail("historical English freeze inheritance is not explicitly disabled.");
  if (record.boundaryVersion !== TRG_001_POST_FINAL5_HUMAN_APPROVAL_BOUNDARY_VERSION) fail("boundary version mismatch.");
  if (record.packageId !== "TRG-001") fail("package mismatch.");
  if (record.decision !== "APPROVED") fail("decision is not APPROVED.");
  if (record.approvalStatement !== TRG_001_POST_FINAL5_REQUIRED_APPROVAL_STATEMENT) fail("approval statement mismatch.");
  if (!record.reviewer.trim()) fail("reviewer is empty.");
  if (!Number.isFinite(Date.parse(record.approvedAtIso))) fail("approval timestamp is invalid.");
  if (record.englishRemediationVersion !== readiness.candidate.englishRemediationVersion) fail("English remediation version mismatch.");
  if (record.localizationVersion !== readiness.candidate.localizationVersion) fail("localization version mismatch.");
  if (record.reviewedSourceHead !== readiness.candidate.reviewedSourceHead) fail("reviewed source head mismatch.");
  if (record.mergedCommit !== readiness.candidate.mergedCommit) fail("merged commit mismatch.");
  if (record.historicalEnglishFingerprint !== readiness.historicalEnglishAuthority.approvedFingerprint) fail("historical English fingerprint mismatch.");
  if (record.englishChangedQlIds.length !== 1 || record.englishChangedQlIds[0] !== "TRG-001-QL-093") fail("English changed-QL scope mismatch.");
  if (record.locales.length !== 2 || record.locales[0] !== "hi-IN" || record.locales[1] !== "pa-IN") fail("locale scope mismatch.");
  if (record.localizedSurfaces !== readiness.localizedScope.localizedSurfaces) fail("localized surface count mismatch.");
  if (record.evidenceWorkflowRunId !== readiness.evidence.workflowRunId) fail("evidence workflow run mismatch.");
  if (record.evidenceArtifactId !== readiness.evidence.artifactId) fail("evidence artifact id mismatch.");
  if (record.evidenceArtifactDigest !== readiness.evidence.artifactDigest) fail("evidence artifact digest mismatch.");

  return Object.freeze({
    status: "APPROVAL_RECORD_VALID" as const,
    packageId: "TRG-001" as const,
    reviewer: record.reviewer,
    approvedAtIso: record.approvedAtIso,
    englishRemediationVersion: record.englishRemediationVersion,
    localizationVersion: record.localizationVersion,
    reviewedSourceHead: record.reviewedSourceHead,
    mergedCommit: record.mergedCommit,
    historicalEnglishFingerprint: record.historicalEnglishFingerprint,
    englishChangedQlIds: record.englishChangedQlIds,
    locales: record.locales,
    localizedSurfaces: record.localizedSurfaces,
    evidenceWorkflowRunId: record.evidenceWorkflowRunId,
    evidenceArtifactId: record.evidenceArtifactId,
    evidenceArtifactDigest: record.evidenceArtifactDigest,
  });
}

/**
 * Produces authorization evidence from an explicit, exact approval record.
 * It does not mutate freeze manifests, Question Studio, Question Bank,
 * Test Builder, public release, or runtime activation state.
 */
export function buildTrg001PostFinal5ActivationAuthorization(
  record: Trg001PostFinal5HumanApprovalRecord,
) {
  const approval = validateTrg001PostFinal5HumanApprovalRecord(record);
  return Object.freeze({
    ...approval,
    newEnglishFreezeAuthorizedByRecord: true as const,
    multilingualFreezeAuthorizedByRecord: true as const,
    internalActivationAuthorizedByRecord: true as const,
    publicReleaseAuthorizedByRecord: false as const,
    automaticStudentPublicationAuthorizedByRecord: false as const,
  });
}
