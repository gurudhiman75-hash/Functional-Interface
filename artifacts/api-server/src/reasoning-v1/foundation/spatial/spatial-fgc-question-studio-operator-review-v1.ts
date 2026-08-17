import { FGC_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "./figure-completion-english-freeze-v1";
import { FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "./figure-completion-hi-pa-localization-freeze-v1";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V1 } from "./spatial-question-studio-integration-v1";

export const SPATIAL_FGC_QUESTION_STUDIO_OPERATOR_REVIEW_V1 = Object.freeze({
  reviewId: "SPA-FGC-001-QUESTION-STUDIO-OPERATOR-REVIEW-V1" as const,
  chapterCode: "FGC-001" as const,
  packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId,
  reviewedIntegrationHead: "d1235666788e4d2b83b3e3579424dba0c6ca9492" as const,
  pullRequestNumber: 861,
  permanentQlRange: "SPA-QL-031..SPA-QL-034" as const,
  reviewedPermanentQls: ["SPA-QL-031", "SPA-QL-032", "SPA-QL-033", "SPA-QL-034"] as const,
  reviewedLanguages: ["en", "hi", "pa"] as const,
  reviewScope: "RETAINED_FGC_001_EN_HI_PA_LEARNER_PACK_PLUS_STANDARD_QUESTION_STUDIO_SURFACE" as const,
  reviewMethod: "DIRECT_RENDERED_LEARNER_VIEW_PLUS_TEXT_EXPLANATION_AUDIT" as const,
  reviewerAuthority: "ASSISTANT_OPERATOR_REVIEW" as const,
  learnerReviewStatus: "NO_BLOCKER_FOUND_OPERATOR_REVIEW" as const,
  reviewerVerdict: "NO_LEARNER_FACING_BLOCKER_FOUND" as const,
  integrationEvidence: {
    workflowName: "Validate SPA-FND-001 Question Studio Integration V1" as const,
    workflowRunId: 32034757693,
    artifactId: 9290248586,
    artifactDigest: "sha256:a7755f18d9a29cbc58aebc001540851c1a3cce7db164a03e228f78d3a2f74d88" as const,
    result: "SUCCESS" as const,
    integrationMarker: "PASS_SPA_FGC_001_STANDARD_QUESTION_STUDIO_INTEGRATION_V1" as const,
  },
  sourceReviewAuthorities: {
    english: {
      authorityId: FGC_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      reviewedHead: FGC_001_ENGLISH_FREEZE_AUTHORITY_V1.exactReviewedAuthority.headSha,
      artifactId: FGC_001_ENGLISH_FREEZE_AUTHORITY_V1.exactReviewedAuthority.artifactId,
      artifactDigest: FGC_001_ENGLISH_FREEZE_AUTHORITY_V1.exactReviewedAuthority.artifactDigest,
      verdict: FGC_001_ENGLISH_FREEZE_AUTHORITY_V1.exactReviewedAuthority.reviewVerdict,
    },
    hindiPunjabi: {
      authorityId: FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      reviewedHead: FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedAuthority.headSha,
      artifactId: FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedAuthority.artifactId,
      artifactDigest: FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedAuthority.artifactDigest,
      verdict: FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedAuthority.reviewVerdict,
    },
  },
  learnerFindings: {
    ql031ContinuityAndJunction: "CLEAR_NO_BLOCKER" as const,
    ql032CountDirectionAndMarker: "SUBTLE_BUT_DISTINGUISHABLE_AT_104PX_NO_BLOCKER" as const,
    ql033QuadrantSymmetry: "CLEAR_NO_BLOCKER" as const,
    ql034CompoundStateAndContact: "ABSTRACT_BUT_DISTINGUISHABLE_NO_BLOCKER" as const,
    recommendedStimulusPixels: 384,
    mobileMinimumOptionPixels: 104,
    englishWording: "ACCEPTABLE_NO_BLOCKER" as const,
    hindiWording: "ACCEPTABLE_NO_BLOCKER" as const,
    punjabiWording: "ACCEPTABLE_NO_BLOCKER" as const,
    explanations: "QUESTION_SPECIFIC_AND_LEARNER_USABLE_NO_BLOCKER" as const,
  },
  governance: {
    productOwnerApprovalGranted: false,
    mergeAuthorized: false,
    deploymentAuthorized: false,
    generatedItemApprovalAuthorized: false,
    automaticStudentPublicationAuthorized: false,
    manualApprovalStillRequired: true,
  },
  nextGate: "EXPLICIT_PRODUCT_OWNER_QUESTION_STUDIO_APPROVAL" as const,
} as const);
