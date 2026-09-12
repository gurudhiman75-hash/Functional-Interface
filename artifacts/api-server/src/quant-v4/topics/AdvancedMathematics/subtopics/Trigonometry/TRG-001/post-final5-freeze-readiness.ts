import { TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL6_VERSION } from "./localization-native-v5-pedagogic-review-final6";
import { TRG_001_POST_FREEZE_REMEDIATION_V1_VERSION } from "./production-post-freeze-remediation-v1";

export const TRG_001_POST_FINAL5_FREEZE_READINESS = Object.freeze({
  manifestVersion: "TRG001_POST_FINAL5_FREEZE_READINESS_V1" as const,
  packageId: "TRG-001" as const,
  candidate: {
    englishRemediationVersion: TRG_001_POST_FREEZE_REMEDIATION_V1_VERSION,
    localizationVersion: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL6_VERSION,
    reviewedSourceHead: "cd6fc6bec42892b1d366617442cbe8dbebb48069" as const,
    mergedViaPullRequest: 1299 as const,
    mergedCommit: "5f819b129643bc74651473cf226142d0b239c635" as const,
  },
  historicalEnglishAuthority: {
    qls: 144 as const,
    approvedFingerprint: "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611" as const,
    inheritedByCandidate: false as const,
    changedQlIds: ["TRG-001-QL-093"] as const,
    newHumanReviewRequired: true as const,
  },
  localizedScope: {
    qls: 144 as const,
    locales: ["hi-IN", "pa-IN"] as const,
    localizedSurfaces: 288 as const,
    remediatedQlIds: [
      "TRG-001-QL-069",
      "TRG-001-QL-093",
      "TRG-001-QL-098",
      "TRG-001-QL-100",
      "TRG-001-QL-113",
      "TRG-001-QL-114",
      "TRG-001-QL-115",
      "TRG-001-QL-142",
    ] as const,
  },
  evidence: {
    workflowRunId: 33370572812 as const,
    artifactId: 9749893158 as const,
    artifactDigest: "sha256:e393b69a2ac89416c5bbb926681319e0938df28e9a5b849ba49fa6e0566bb834" as const,
    englishCases: 432 as const,
    localizedCases: 864 as const,
    correctionAssertions: 48 as const,
    ql142ConjugateVariants: ["cos", "sin"] as const,
    reviewRows: 144 as const,
    localizedReviewSurfaces: 288 as const,
    unresolvedTemplatePlaceholders: 0 as const,
    failures: 0 as const,
  },
  engineeringReviewReadiness: "PASS" as const,
  humanReview: "PENDING" as const,
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

export type Trg001PostFinal5FreezeReadiness = typeof TRG_001_POST_FINAL5_FREEZE_READINESS;
