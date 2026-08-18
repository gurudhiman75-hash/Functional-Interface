import { SPATIAL_FGC_QUESTION_STUDIO_OPERATOR_REVIEW_V1 } from "./spatial-fgc-question-studio-operator-review-v1";

export const SPATIAL_FGC_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 = Object.freeze({
  approvalId: "SPA-FGC-001-QUESTION-STUDIO-PRODUCT-OWNER-APPROVAL-V1" as const,
  chapterCode: "FGC-001" as const,
  packageId: "SPA-001" as const,
  pullRequestNumber: 861,
  approvedIntegrationHead: "315ba2ef26e4615bd891a75374d85557150345c8" as const,
  approvedOperatorReviewId: SPATIAL_FGC_QUESTION_STUDIO_OPERATOR_REVIEW_V1.reviewId,
  permanentQlRange: "SPA-QL-031..SPA-QL-034" as const,
  approvedLanguages: ["en", "hi", "pa"] as const,
  approvalSource: "EXPLICIT_PRODUCT_OWNER_APPROVAL_IN_PROJECT_CHAT" as const,
  approvalRecordedAt: "2026-08-18T08:00:00+05:30" as const,
  approvalScope: "FGC_001_STANDARD_QUESTION_STUDIO_INTEGRATION_AND_REVIEWED_LEARNER_SURFACE" as const,
  productOwnerVerdict: "APPROVED" as const,
  reviewedEvidence: {
    finalExactHeadCi: {
      headSha: "315ba2ef26e4615bd891a75374d85557150345c8" as const,
      workflowName: "Validate SPA-FND-001 Question Studio Integration V1" as const,
      workflowRunId: 32040861339,
      artifactId: 9291930499,
      artifactDigest: "sha256:42e691a9ef459385c7fa786dc03c6326facc54589c0df782b3c149bb2605b893" as const,
      result: "SUCCESS" as const,
    },
    englishLearnerReview: SPATIAL_FGC_QUESTION_STUDIO_OPERATOR_REVIEW_V1.sourceReviewAuthorities.english,
    hindiPunjabiLearnerReview: SPATIAL_FGC_QUESTION_STUDIO_OPERATOR_REVIEW_V1.sourceReviewAuthorities.hindiPunjabi,
  },
  governance: {
    productOwnerApprovalGranted: true,
    questionStudioIntegrationApproved: true,
    reviewedLearnerSurfaceApproved: true,
    futureGeneratedItemsAutomaticallyApproved: false,
    manualGeneratedItemApprovalStillRequired: true,
    mergeAuthorizedByThisApproval: false,
    deploymentAuthorizedByThisApproval: false,
    automaticStudentPublicationAuthorized: false,
  },
  nextGate: "STACKED_PR_MERGE_SEQUENCE_WHEN_EXPLICITLY_AUTHORIZED" as const,
} as const);
