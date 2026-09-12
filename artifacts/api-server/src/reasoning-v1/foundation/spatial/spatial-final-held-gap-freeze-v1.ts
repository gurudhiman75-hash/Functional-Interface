import { SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3 } from "./spatial-final-held-gap-review-runtime-v3";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9 } from "./spatial-permanent-ql-allocation-v9";

export const SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1 = Object.freeze({
  approvalId: "SPA-FND-001-FINAL-HELD-GAP-PRODUCT-OWNER-APPROVAL-V1" as const,
  approvalDate: "2026-09-01" as const,
  approvalSource: "EXPLICIT_PRODUCT_OWNER_APPROVED_AFTER_DIRECT_V3_VISUAL_REVIEW" as const,
  approvedQlIds: Object.freeze(["SPA-QL-048", "SPA-QL-049", "SPA-QL-050"] as const),
  approvedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  approvedRuntimeAuthorityId: SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.authorityId,
  reviewedPullRequest: 1359,
  reviewedMergeCommit: "33e4f4cf3f9d0dcd411fab95ede09dc59fd52788" as const,
  reviewedCi: Object.freeze({
    workflowName: "Validate SPA Final Held-Gap Review V3" as const,
    workflowRunId: 33516904251,
    artifactId: 9803972485,
    artifactDigest: "sha256:2acc0a0a2657f30cb70932e08b1fcd08956e184f15e372490e8084402353ca6b" as const,
    result: "SUCCESS" as const,
    structuralQuestionCount: 288,
    localizedSurfaceCount: 72,
    deterministicReplayChecks: 288,
    svgChecks: 744,
    visualReviewSurfaceCount: 36,
  }),
  directVisualReview: Object.freeze({
    reviewed: true,
    whiteBackgroundRequired: true,
    examStrokeWidth: 1.35,
    randomWholeFigureTiltAllowed: false,
    brokenOrClippedEdgesAccepted: false,
    ql048ExamCompositeFiguresApproved: true,
    ql049ExamCompositeFiguresApproved: true,
    ql050RotationAllowedReflectionDisallowedApproved: true,
  }),
  productOwnerVerdict: "APPROVED" as const,
  approved: true,
} as const);

if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.nextAvailablePermanentQlId !== "SPA-QL-051") {
  throw new Error("Final Spatial held-gap freeze expects the permanent range to end at SPA-QL-050.");
}
if (SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1.approvedRuntimeAuthorityId !== SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.authorityId) {
  throw new Error("Final Spatial held-gap approval is not pinned to the V3 exam-real runtime.");
}

export const SPATIAL_FINAL_HELD_GAP_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "SPA-FND-001-FINAL-HELD-GAP-FREEZE-V1" as const,
  approvalId: SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  sourceRuntimeAuthorityId: SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.authorityId,
  allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.authorityId,
  permanentQlIds: SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1.approvedQlIds,
  supportedLanguages: SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1.approvedLanguages,
  canonicalLanguage: "en" as const,
  status: "APPROVED_MULTILINGUAL_LEARNER_RUNTIME_FROZEN" as const,
  learnerContentFrozen: true,
  geometryFrozen: true,
  answerOwnershipFrozen: true,
  rendererFrozen: true,
  localizationFrozen: true,
  contentMutationAuthorized: false,
  rendererPolicy: SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.rendererPolicy,
  countingFigurePolicy: SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.countingFigurePolicy,
  solvePolicies: SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.solvePolicies,
  lifecycle: Object.freeze({
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false,
    testBuilderEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    publicReleaseAuthorized: false,
    studentDeliveryAuthorized: false,
    automaticStudentPublication: false,
  }),
  nextGate: "SPA_FINAL_HELD_GAP_INTERNAL_QUESTION_STUDIO_ACTIVATION_V1" as const,
} as const);

export const SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1 = Object.freeze({
  authorityId: "SPA-FND-001-FINAL-HELD-GAP-INTERNAL-ACTIVATION-V1" as const,
  sourceFreezeAuthorityId: SPATIAL_FINAL_HELD_GAP_FREEZE_AUTHORITY_V1.authorityId,
  permanentQlIds: SPATIAL_FINAL_HELD_GAP_FREEZE_AUTHORITY_V1.permanentQlIds,
  supportedLanguages: SPATIAL_FINAL_HELD_GAP_FREEZE_AUTHORITY_V1.supportedLanguages,
  status: "ACTIVE_QUESTION_STUDIO_QUESTION_BANK_INTERNAL_TEST_BUILDER" as const,
  activationScope: "QUESTION_STUDIO_QUESTION_BANK_AND_INTERNAL_TEST_BUILDER" as const,
  runtimeMode: "CANONICAL_REVIEW" as const,
  reviewStatus: "APPROVED_EDITORIAL_CANONICAL" as const,
  questionStudioDiscoverable: true,
  questionStudioGenerationEnabled: true,
  persistenceAllowed: true,
  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankWritable: true,
  questionBankAcceptanceMode: "FULL_RELEASE" as const,
  manualApprovalRequired: true,
  manualQuestionPublicationRequired: true,
  testEligibility: "ELIGIBLE" as const,
  testEligible: true,
  testBuilderEligible: true,
  publicationTarget: "INTERNAL_TEST_BUILDER" as const,
  // `publiclyPublishable` is required by the normal Question Bank -> Test Builder gate.
  // Public/student delivery remains independently closed below.
  publiclyPublishable: true,
  mockTestEligible: false,
  publicReleaseAuthorized: false,
  studentDeliveryAuthorized: false,
  automaticStudentPublication: false,
  contentMutationAuthorized: false,
} as const);
