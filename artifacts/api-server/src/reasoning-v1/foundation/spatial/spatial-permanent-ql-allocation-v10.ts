import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V9,
} from "./spatial-permanent-ql-allocation-v9";
import type { SpatialPermanentDifficultyV1 } from "./spatial-permanent-ql-allocation-v1";
import { FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1 } from "./figure-formation-source-saturated-discovery-v1";

export type FigureFormationPermanentQlIdV10 = "SPA-QL-051" | "SPA-QL-052" | "SPA-QL-053";
export type FigureFormationProposalIdV10 = "FFM-PROP-01" | "FFM-PROP-02" | "FFM-PROP-03";
export type FigureFormationSkillModeV10 =
  | "ASSEMBLE_ALL_PIECES_TO_RESULT"
  | "SELECT_PIECE_SUBSET_FOR_TARGET"
  | "IDENTIFY_PIECE_SET_FOR_TARGET";

export interface FigureFormationPermanentQlAllocationV10 {
  permanentQlId: FigureFormationPermanentQlIdV10;
  proposalId: FigureFormationProposalIdV10;
  chapterCode: "FFM-001";
  skillMode: FigureFormationSkillModeV10;
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
  allocationStatus: "PERMANENT_QL_ALLOCATED_RUNTIME_IMPLEMENTED";
  sourceAuditAuthorityId: typeof FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.authorityId;
  learnerContentFrozen: false;
  questionStudioDiscoverable: false;
  persistenceAllowed: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

function allocation(input: Readonly<{
  permanentQlId: FigureFormationPermanentQlIdV10;
  proposalId: FigureFormationProposalIdV10;
  skillMode: FigureFormationSkillModeV10;
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
}>): FigureFormationPermanentQlAllocationV10 {
  return Object.freeze({
    ...input,
    chapterCode: "FFM-001" as const,
    allocationStatus: "PERMANENT_QL_ALLOCATED_RUNTIME_IMPLEMENTED" as const,
    sourceAuditAuthorityId: FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });
}

if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.nextAvailablePermanentQlId !== "SPA-QL-051") {
  throw new Error("SPA-QL-051 is no longer the next available Spatial permanent QL.");
}
if (!FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.decision.chapterImplementationAuthorized) {
  throw new Error("FFM-001 source discovery has not authorized implementation.");
}

export const FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10 = Object.freeze([
  allocation({
    permanentQlId: "SPA-QL-051",
    proposalId: "FFM-PROP-01",
    skillMode: "ASSEMBLE_ALL_PIECES_TO_RESULT",
    name: "Choose the figure formed by all given pieces",
    baseDifficulty: "MODERATE",
  }),
  allocation({
    permanentQlId: "SPA-QL-052",
    proposalId: "FFM-PROP-02",
    skillMode: "SELECT_PIECE_SUBSET_FOR_TARGET",
    name: "Choose the subset of pieces that forms the target",
    baseDifficulty: "MODERATE",
  }),
  allocation({
    permanentQlId: "SPA-QL-053",
    proposalId: "FFM-PROP-03",
    skillMode: "IDENTIFY_PIECE_SET_FOR_TARGET",
    name: "Choose the piece set that can form the target",
    baseDifficulty: "MODERATE",
  }),
] as const satisfies readonly FigureFormationPermanentQlAllocationV10[]);

export const SPATIAL_PERMANENT_QL_ALLOCATIONS_V10 = Object.freeze([
  ...SPATIAL_PERMANENT_QL_ALLOCATIONS_V9,
  ...FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10,
]);

export const SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10 = Object.freeze({
  authorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V10-FFM-001" as const,
  status: "PERMANENT_QL_RANGE_EXTENDED_TO_053_FFM_RUNTIME_IMPLEMENTED" as const,
  baseAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.authorityId,
  sourceAuditAuthorityId: FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  verifiedNewMainHeadBeforeAllocation: "b16c291fc64a2b2976f2695004e168267f0efb3b" as const,
  verifiedBaseRange: "SPA-QL-001..SPA-QL-050" as const,
  verifiedBaseNextAvailablePermanentQlId: "SPA-QL-051" as const,
  allocations: SPATIAL_PERMANENT_QL_ALLOCATIONS_V10,
  newAllocations: FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10,
  permanentQlCount: 53,
  permanentQlRange: "SPA-QL-001..SPA-QL-053" as const,
  allocatedRange: "SPA-QL-051..SPA-QL-053" as const,
  nextAvailablePermanentQlId: "SPA-QL-054" as const,
  chapterCounts: Object.freeze({
    ...SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.chapterCounts,
    "FFM-001": 3,
  }),
  invariants: Object.freeze({
    semanticSkillNotRepresentationVariant: true,
    rotationAllowedWithinFigureFormation: true,
    reflectionAllowedWithinFigureFormation: false,
    twoVsThreePiecesNotSeparateQl: true,
    tangramStyleNotSeparateQl: true,
    boundaryMatchingIsCommonSolverConstraint: true,
    constructionSquareTriangleRoutedByTaskSemantics: true,
  }),
  lifecycle: Object.freeze({
    permanentIdentityAllocated: true,
    reviewRuntimeImplemented: true,
    learnerContentFrozen: false,
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  }),
  nextGate: "SPA_FFM_001_RUNTIME_VALIDATION_AND_MULTILINGUAL_FREEZE_V1" as const,
} as const);

if (SPATIAL_PERMANENT_QL_ALLOCATIONS_V10.length !== 53) {
  throw new Error(`Expected 53 permanent Spatial QLs after FFM-001 allocation, got ${SPATIAL_PERMANENT_QL_ALLOCATIONS_V10.length}.`);
}
