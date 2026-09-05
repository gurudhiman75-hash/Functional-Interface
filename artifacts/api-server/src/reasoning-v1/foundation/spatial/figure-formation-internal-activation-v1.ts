import { FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1 } from "./figure-formation-source-saturated-discovery-v1";
import { FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10 } from "./spatial-permanent-ql-allocation-v10";

// Compatibility authority retained because the transplanted V1 solver imports this symbol.
// It is intentionally review-only: no route, registry, persistence, Question Bank or Test Builder
// activation is authorized until the product-owner visual review is approved.
export const FIGURE_FORMATION_INTERNAL_ACTIVATION_V1 = Object.freeze({
  authorityId: "SPA-FFM-001-REVIEW-COMPATIBILITY-V1" as const,
  chapterCode: "FFM-001" as const,
  sourceDiscoveryAuthorityId: FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  permanentQlIds: Object.freeze(FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10.map((entry) => entry.permanentQlId)),
  activationMode: "REVIEW_ONLY_NOT_ACTIVATED" as const,
  questionStudioDiscoverable: false as const,
  registrationStatus: "NOT_REGISTERED" as const,
  persistenceAllowed: false as const,
  databaseWriteEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  questionBankAcceptanceMode: "NONE" as const,
  testEligibility: "NOT_ELIGIBLE" as const,
  testEligible: false as const,
  testBuilderEligible: false as const,
  publiclyPublishable: false as const,
  mockTestEligible: false as const,
  publicReleaseAuthorized: false as const,
  studentDeliveryAuthorized: false as const,
  manualApprovalRequired: true as const,
  manualQuestionPublicationRequired: true as const,
  futureGeneratedItemsAutomaticallyApproved: false as const,
  automaticStudentPublication: false as const,
  learnerContentFreezeStatus: "REVIEW_PENDING_PRODUCT_OWNER_VISUAL_APPROVAL" as const,
  nextGate: "PRODUCT_OWNER_VISUAL_APPROVAL_THEN_FFM_001_FREEZE_AND_INTEGRATION" as const,
} as const);

if (FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.permanentQlIds.join(",") !== "SPA-QL-051,SPA-QL-052,SPA-QL-053") {
  throw new Error("FFM-001 review compatibility authority must own exactly SPA-QL-051..SPA-QL-053.");
}
if (
  FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable ||
  FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.persistenceAllowed ||
  FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.questionBankWritable ||
  FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.testBuilderEligible ||
  FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.mockTestEligible ||
  FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.publicReleaseAuthorized ||
  FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.studentDeliveryAuthorized
) {
  throw new Error("FFM-001 review compatibility authority must not activate downstream delivery gates.");
}
