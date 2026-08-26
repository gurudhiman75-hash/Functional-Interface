import { PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1 } from "./paper-folding-question-studio-visual-direction-remediation-v1";
import { PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_AUTHORITY_V1_2 } from "./paper-folding-question-studio-operator-review-v1-2";
import { PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1_1 } from "./paper-folding-question-studio-editorial-v1-1";

export const PFC_TPF_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 = Object.freeze({
  approvalId: "PFC-TPF-QUESTION-STUDIO-PRODUCT-OWNER-APPROVAL-V1" as const,
  packageId: "SPA-001" as const,
  chapterCodes: ["PFC-001", "TPF-001"] as const,
  pullRequestNumber: 870,
  permanentQlRange: "SPA-QL-035..SPA-QL-040" as const,
  approvedLanguages: ["en", "hi", "pa"] as const,
  approvedOperatorReviewCandidate: "PFC-TPF-QUESTION-STUDIO-OPERATOR-REVIEW-V1.3" as const,
  baseOperatorReviewAuthorityId: PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_AUTHORITY_V1_2.authorityId,
  editorialAuthorityId: PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1_1.authorityId,
  visualRemediationAuthorityId: PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1.authorityId,
  approvedHeadSha: "48f6a46a42683d11279201b6ce7b5e38917ac4a6" as const,
  approvedExactHeadCi: {
    workflowName: "Validate SPA PFC TPF Question Studio Operator Review V1.3" as const,
    workflowRunId: 32825848760,
    artifactId: 9555142851,
    artifactDigest: "sha256:85c10e6ad24ae0dddfa5d9b56ffac3f60541073fc7829aa2dbe474880bf4377c" as const,
    result: "SUCCESS" as const,
  },
  approvalSource: "EXPLICIT_PRODUCT_OWNER_APPROVAL_IN_PROJECT_CHAT" as const,
  approvalRecordedAt: "2026-08-26T06:54:00+05:30" as const,
  approvalScope: "PFC_TPF_STANDARD_QUESTION_STUDIO_INTEGRATION_AND_V1_3_REVIEWED_LEARNER_SURFACE" as const,
  productOwnerVerdict: "APPROVED" as const,
  approved: true,
  governance: {
    productOwnerApprovalGranted: true,
    questionStudioIntegrationApproved: true,
    reviewedLearnerSurfaceApproved: true,
    standardQuestionStudioRegistrationAuthorized: true,
    persistenceIntoGenerationReviewRunsAuthorized: true,
    questionBankConversionAfterManualItemApprovalAuthorized: true,
    testEligibilityAfterManualItemApprovalAuthorized: true,
    futureGeneratedItemsAutomaticallyApproved: false,
    manualGeneratedItemApprovalStillRequired: true,
    automaticStudentPublicationAuthorized: false,
    mergeAuthorizedByThisApproval: false,
    deploymentAuthorizedByThisApproval: false,
  },
  nextGate: "PFC_TPF_STANDARD_QUESTION_STUDIO_INTEGRATION_CI" as const,
} as const);
