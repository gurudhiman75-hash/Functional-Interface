import { FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1 } from "./figure-formation-source-saturated-discovery-v1";
import { FIGURE_FORMATION_SOURCE_EVIDENCE_V2 } from "./figure-formation-source-evidence-v2";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10 } from "./spatial-permanent-ql-allocation-v10";

export const FIGURE_FORMATION_REVIEW_AUTHORITY_V3 = Object.freeze({
  authorityId: "SPA-FFM-001-REVIEW-AUTHORITY-V3" as const,
  chapterCode: "FFM-001" as const,
  permanentQlIds: Object.freeze(["SPA-QL-051", "SPA-QL-052", "SPA-QL-053"] as const),
  sourceDiscoveryAuthorityId: FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  sourceEvidenceAuthorityId: FIGURE_FORMATION_SOURCE_EVIDENCE_V2.authorityId,
  allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.authorityId,
  rendererStandard: Object.freeze({
    background: "WHITE" as const,
    stroke: "#111827" as const,
    strokeWidth: 1.35 as const,
    linecap: "round" as const,
    linejoin: "round" as const,
    noRandomTilt: true as const,
    noClippedEdges: true as const,
  }),
  validationContract: Object.freeze({
    deterministicReplayRequired: true as const,
    exactCoverSolverRequired: true as const,
    uniqueAnswerRequired: true as const,
    rotationAllowed: true as const,
    reflectionAllowed: false as const,
    squareAndTriangleCoverageRequired: true as const,
    multilingualGeometryParityRequired: true as const,
    learnerExplanationMustBeItemSpecific: true as const,
  }),
  lifecycle: Object.freeze({
    reviewOnly: true as const,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    registrationStatus: "NOT_REGISTERED" as const,
    persistenceAllowed: false as const,
    databaseWriteEnabled: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    testBuilderEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    publicReleaseAuthorized: false as const,
    studentDeliveryAuthorized: false as const,
    automaticStudentPublication: false as const,
  }),
  nextGate: "PRODUCT_OWNER_VISUAL_APPROVAL_THEN_FFM_001_FREEZE_AND_INTEGRATION" as const,
} as const);

if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.nextAvailablePermanentQlId !== "SPA-QL-054") {
  throw new Error("FFM-001 review authority expects SPA-QL-054 to remain the next free permanent identity.");
}
