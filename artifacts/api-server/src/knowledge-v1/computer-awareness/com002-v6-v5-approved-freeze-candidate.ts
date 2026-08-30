import { COM002_V6_V5_HUMAN_APPROVAL_AUTHORITY } from "./com002-v6-v5-human-approval-authority";
import { COM002_LOCALIZATION_VERSION_V5 } from "./com002-localization-v5";
import { COM002_ENGLISH_GENERATOR_VERSION_V6 } from "./com002-review-synthesis-v6";

export const COM002_V6_V5_APPROVED_FREEZE_PINS = Object.freeze({
  englishV6CorpusFingerprint: "PENDING",
  englishV6ReviewPackFingerprint: "PENDING",
  englishV6CombinedFingerprint: "PENDING",
  hindiV5CorpusFingerprint: "PENDING",
  punjabiV5CorpusFingerprint: "PENDING",
  bilingualV5ReviewFingerprint: "7303161552dc11354f1cb4765cc56a85d94755fd8835adffb2de3514100e5e16",
  localizationV5CombinedFingerprint: "PENDING",
} as const);

/**
 * Product-owner-approved operational freeze candidate for the latest COM-002
 * learner-facing chain. The exact V5 bilingual review surface is pinned from
 * the green run #585 artifact. Full deterministic corpus hashes remain
 * fail-closed until the V6/V5 fingerprint exporter is executed.
 */
export const COM002_V6_V5_APPROVED_FREEZE_CANDIDATE = Object.freeze({
  authorityId: "COM-002-V6-V5-APPROVED-FREEZE-CANDIDATE" as const,
  chapterId: "COM-002" as const,
  status: "APPROVED_REVIEW_PINNED_AWAITING_FULL_CORPUS_FINGERPRINT_EXPORT" as const,
  approvalAuthorityId: COM002_V6_V5_HUMAN_APPROVAL_AUTHORITY.authorityId,
  englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V6,
  localizationVersion: COM002_LOCALIZATION_VERSION_V5,
  executionEvidence: Object.freeze({
    featureHeadSha: "10946db756a0eb92c17282998e72ae5d46fc3890" as const,
    pullRequestNumber: 1019,
    workflowName: "Validate Question Studio Content Engine Foundation V1" as const,
    workflowRunNumber: 585,
    workflowRunId: 33293025383,
    workflowJobId: 99207851940,
    conclusion: "SUCCESS" as const,
    bilingualReviewArtifactId: 9726555301,
    bilingualReviewArtifactName: "COM002-Hindi-Punjabi-V5-Review-Pack" as const,
    bilingualReviewArtifactDigest: "sha256:abbcf92326134c5ab6678db59bb98fea1b9940c5afdd3a1a3e1fee9541bfe141" as const,
    bilingualReviewQuestionGroups: 13,
    approvedLocalizedReviewSurfaces: 26,
    hindiCorpusTargetQuestions: 520,
    punjabiCorpusTargetQuestions: 520,
  }),
  fingerprints: COM002_V6_V5_APPROVED_FREEZE_PINS,
  guarantees: Object.freeze({
    explicitHumanApprovalVerified: true,
    latestReviewedSurfaceBound: true,
    greenV6V5ExecutionExists: true,
    exactBilingualReviewArtifactPinned: true,
    exactBilingualReviewFingerprintPinned: true,
    semanticProvenanceInvariantRequired: true,
    optionOrderAndCorrectIndexInvariantRequired: true,
    sourceAuthorityInvariantRequired: true,
    fullCorpusFingerprintsPinned: false,
  }),
  lifecycle: Object.freeze({
    humanReviewAccepted: true,
    machineFreezePromotable: false,
    englishV6Frozen: false,
    localizationV5Frozen: false,
    questionStudioDiscoverable: false,
    questionStudioRegistrationAllowed: false,
    reviewRunPersistenceAllowed: false,
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  }),
  nextGate: "EXECUTE_COM002_V6_V5_APPROVED_FINGERPRINT_EXPORT_AND_PIN_ALL_PENDING_HASHES" as const,
});

export function auditCom002V6V5ApprovedFreezeCandidate() {
  const issues: string[] = [];
  const pins = COM002_V6_V5_APPROVED_FREEZE_PINS;
  if (!COM002_V6_V5_HUMAN_APPROVAL_AUTHORITY.approval.explicitApprovalVerified) {
    issues.push("EXPLICIT_HUMAN_APPROVAL_MISSING");
  }
  if (COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.executionEvidence.conclusion !== "SUCCESS") {
    issues.push("CANONICAL_V6_V5_EXECUTION_NOT_GREEN");
  }
  if (pins.bilingualV5ReviewFingerprint === "PENDING") issues.push("BILINGUAL_V5_REVIEW_FINGERPRINT_PENDING");
  for (const [name, value] of Object.entries(pins)) {
    if (name === "bilingualV5ReviewFingerprint") continue;
    if (value === "PENDING") issues.push(`${name.toUpperCase()}_PENDING`);
  }
  return {
    validReviewBinding: !issues.includes("EXPLICIT_HUMAN_APPROVAL_MISSING") &&
      !issues.includes("CANONICAL_V6_V5_EXECUTION_NOT_GREEN") &&
      !issues.includes("BILINGUAL_V5_REVIEW_FINGERPRINT_PENDING"),
    promotable: issues.length === 0,
    issues,
    authority: COM002_V6_V5_APPROVED_FREEZE_CANDIDATE,
  };
}
