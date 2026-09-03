import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9, SPATIAL_PERMANENT_QL_ALLOCATIONS_V9 } from "./spatial-permanent-ql-allocation-v9";
import { FFM_001_SOURCE_SATURATION_AUTHORITY_V2 } from "./figure-formation-source-saturation-v2";

export type FigureFormationPermanentQlIdV10 = "SPA-QL-051" | "SPA-QL-052";
export type FigureFormationSkillModeV10 =
  | "ASSEMBLE_ALL_GIVEN_PIECES_TO_MATCH_TARGET"
  | "SELECT_PIECES_TO_FORM_DECLARED_TARGET";

function ffmAllocation(input: Readonly<{
  permanentQlId: FigureFormationPermanentQlIdV10;
  proposalId: "FFM-PQL-01" | "FFM-PQL-02";
  skillMode: FigureFormationSkillModeV10;
  name: string;
  baseDifficulty: "FOUNDATIONAL" | "MODERATE" | "ADVANCED";
}>) {
  return Object.freeze({
    ...input,
    chapterCode: "FFM-001" as const,
    allocationStatus: "PERMANENT_QL_ALLOCATED_REVIEW_RUNTIME_ONLY" as const,
    sourceAuditAuthorityId: FFM_001_SOURCE_SATURATION_AUTHORITY_V2.authorityId,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    studentDeliveryAuthorized: false as const,
    automaticStudentPublication: false as const,
  });
}

if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.nextAvailablePermanentQlId !== "SPA-QL-051") {
  throw new Error("FFM-001 allocation requires SPA-QL-051 to be the next free Spatial identity.");
}

export const FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10 = Object.freeze([
  ffmAllocation({
    permanentQlId: "SPA-QL-051",
    proposalId: "FFM-PQL-01",
    skillMode: "ASSEMBLE_ALL_GIVEN_PIECES_TO_MATCH_TARGET",
    name: "Figure formation from all supplied pieces",
    baseDifficulty: "MODERATE",
  }),
  ffmAllocation({
    permanentQlId: "SPA-QL-052",
    proposalId: "FFM-PQL-02",
    skillMode: "SELECT_PIECES_TO_FORM_DECLARED_TARGET",
    name: "Select pieces that form a square or triangle",
    baseDifficulty: "MODERATE",
  }),
] as const);

export const SPATIAL_PERMANENT_QL_ALLOCATIONS_V10 = Object.freeze([
  ...SPATIAL_PERMANENT_QL_ALLOCATIONS_V9,
  ...FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10,
]);

export const SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10 = Object.freeze({
  authorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V10-FFM-001-TWO-QL" as const,
  status: "PERMANENT_RANGE_EXTENDED_TO_052_FFM_REVIEW_ONLY" as const,
  baseAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.authorityId,
  sourceAuditAuthorityId: FFM_001_SOURCE_SATURATION_AUTHORITY_V2.authorityId,
  allocations: SPATIAL_PERMANENT_QL_ALLOCATIONS_V10,
  newAllocations: FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10,
  permanentQlCount: 52,
  permanentQlRange: "SPA-QL-001..SPA-QL-052" as const,
  allocatedRange: "SPA-QL-051..SPA-QL-052" as const,
  nextAvailablePermanentQlId: "SPA-QL-053" as const,
  chapterCounts: Object.freeze({
    ...SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.chapterCounts,
    "FFM-001": 2,
  }),
  consolidation: FFM_001_SOURCE_SATURATION_AUTHORITY_V2.consolidation,
  lifecycle: Object.freeze({
    permanentIdentityAllocated: true,
    reviewRuntimeImplemented: false,
    learnerContentFrozen: false,
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    studentDeliveryAuthorized: false,
    automaticStudentPublication: false,
  }),
  nextGate: "FFM_001_TWO_QL_REVIEW_RUNTIME_V1" as const,
} as const);

if (FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10.length !== 2) throw new Error("FFM-001 must allocate exactly two permanent QLs.");
if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.nextAvailablePermanentQlId !== "SPA-QL-053") throw new Error("SPA-QL-053 must remain free after FFM-001 V2 allocation.");
