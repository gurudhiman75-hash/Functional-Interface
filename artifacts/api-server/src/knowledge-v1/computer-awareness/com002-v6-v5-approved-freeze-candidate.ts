import { COM002_V6_V5_HUMAN_APPROVAL_AUTHORITY } from "./com002-v6-v5-human-approval-authority";
import { COM002_LOCALIZATION_VERSION_V5 } from "./com002-localization-v5";
import { COM002_ENGLISH_GENERATOR_VERSION_V6 } from "./com002-review-synthesis-v6";

export const COM002_V6_V5_APPROVED_FREEZE_PINS = Object.freeze({
  englishV6CorpusFingerprint: "8f8231ca8bbc9d90ead4d862b0505a4b5b716ce50908419754fd9b35cd87af14",
  englishV6ReviewPackFingerprint: "f0697394e6797aaec6a4e3af503340593aa74c4fad36673727271b880f1ae1af",
  englishV6ExportReferenceFingerprint: "a2f8c44e9d88c11c61fbc318a973c0b41690d3fd04a7b3127ad60a10a20b8aec",
  englishV6CombinedFingerprint: "d41ad6eab504f88f154a1e3487db730f188f754ba784f1d1e9f94ce4f9b118f6",
  hindiV5CorpusFingerprint: "7c750564746d331852e8ede6bea3f135d2437b53c76413367cecc6b6fac06a11",
  punjabiV5CorpusFingerprint: "686c6e6e3db14494baaceb2403162d4ba4ad2ab1da199a37da9ac3f0497997ea",
  bilingualV5ReviewFingerprint: "7303161552dc11354f1cb4765cc56a85d94755fd8835adffb2de3514100e5e16",
  localizationV5CombinedFingerprint: "361d48f97a4982b58f589cd5ed003ed8ad1a91bd5f9bd2f4a6c1d3ecc7a4296c",
} as const);

/**
 * Product-owner-approved machine freeze candidate for the latest COM-002
 * learner-facing chain. Human-review evidence remains bound to canonical run
 * #585. Full deterministic V6/V5 fingerprints were exported independently by
 * the lightweight one-off fingerprint run so no broad CI fanout was restored.
 */
export const COM002_V6_V5_APPROVED_FREEZE_CANDIDATE = Object.freeze({
  authorityId: "COM-002-V6-V5-APPROVED-FREEZE-CANDIDATE" as const,
  chapterId: "COM-002" as const,
  status: "APPROVED_REVIEW_AND_FULL_CORPUS_FINGERPRINTS_PINNED_READY_FOR_OPERATIONAL_FREEZE" as const,
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
  machineFingerprintEvidence: Object.freeze({
    featureHeadSha: "1134369a3f61438f2245da0ecc3e6563e16b7ee3" as const,
    workflowName: "COM-002 V6 V5 Fingerprint One-Off" as const,
    workflowRunId: 33315236675,
    workflowJobId: 99267308124,
    conclusion: "SUCCESS" as const,
    artifactId: 9733227660,
    artifactName: "COM002-V6-V5-Approved-Fingerprint-Manifest-OneOff" as const,
    artifactDigest: "sha256:aa852b498327aa1de0ae3a22fe1eab957d1c9b53056c9a7759ee566c3a842960" as const,
    englishCorpusQuestions: 520,
    englishHumanReviewQuestions: 26,
    englishBilingualExportReferences: 13,
    hindiCorpusQuestions: 520,
    punjabiCorpusQuestions: 520,
    approvedBilingualReviewItems: 13,
    approvedLocalizedReviewSurfaces: 26,
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
    fullCorpusFingerprintsPinned: true,
    fingerprintManifestExecutedGreen: true,
  }),
  lifecycle: Object.freeze({
    humanReviewAccepted: true,
    machineFreezePromotable: true,
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
  nextGate: "CREATE_COM002_V6_V5_OPERATIONAL_FREEZE_THEN_AUDIT_STANDARD_REVIEW_ONLY_ADAPTER" as const,
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
  if (COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.machineFingerprintEvidence.conclusion !== "SUCCESS") {
    issues.push("FINGERPRINT_MANIFEST_EXECUTION_NOT_GREEN");
  }
  for (const [name, value] of Object.entries(pins)) {
    if (!/^[a-f0-9]{64}$/.test(value)) issues.push(`${name.toUpperCase()}_INVALID`);
  }
  return {
    validReviewBinding: !issues.includes("EXPLICIT_HUMAN_APPROVAL_MISSING") &&
      !issues.includes("CANONICAL_V6_V5_EXECUTION_NOT_GREEN"),
    promotable: issues.length === 0,
    issues,
    authority: COM002_V6_V5_APPROVED_FREEZE_CANDIDATE,
  };
}
