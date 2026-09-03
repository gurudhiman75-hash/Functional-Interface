import { FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1 } from "./figure-formation-source-saturated-discovery-v1";
import { FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10 } from "./spatial-permanent-ql-allocation-v10";

export const FIGURE_FORMATION_INTERNAL_ACTIVATION_V1 = Object.freeze({
  authorityId: "SPA-FFM-001-INTERNAL-ACTIVATION-V1" as const,
  chapterCode: "FFM-001" as const,
  sourceDiscoveryAuthorityId: FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  permanentQlIds: Object.freeze(FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10.map((entry) => entry.permanentQlId)),
  activationMode: "ACTIVE_INTERNAL_TEST_BUILDER" as const,
  questionStudioDiscoverable: true as const,
  registrationStatus: "REGISTERED" as const,
  persistenceAllowed: true as const,
  databaseWriteEnabled: true as const,
  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankWritable: true as const,
  questionBankAcceptanceMode: "FULL_RELEASE" as const,
  testEligibility: "ELIGIBLE" as const,
  testEligible: true as const,
  testBuilderEligible: true as const,
  publiclyPublishable: true as const,
  mockTestEligible: false as const,
  publicReleaseAuthorized: false as const,
  studentDeliveryAuthorized: false as const,
  manualApprovalRequired: true as const,
  manualQuestionPublicationRequired: true as const,
  futureGeneratedItemsAutomaticallyApproved: false as const,
  automaticStudentPublication: false as const,
  learnerContentFreezeStatus: "RUNTIME_REVIEW_AND_MANUAL_APPROVAL_REQUIRED" as const,
  nextGate: "SPA_FFM_001_EDITORIAL_REVIEW_AND_CHAPTER_FREEZE_V1" as const,
} as const);

if (FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.permanentQlIds.join(",") !== "SPA-QL-051,SPA-QL-052,SPA-QL-053") {
  throw new Error("FFM-001 activation must own exactly SPA-QL-051..SPA-QL-053.");
}
if (FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.mockTestEligible || FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.publicReleaseAuthorized) {
  throw new Error("FFM-001 implementation must not open mock/public release gates.");
}
