import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V11,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V11,
} from "./spatial-permanent-ql-allocation-v11";
import type { SpatialPermanentDifficultyV1 } from "./spatial-permanent-ql-allocation-v1";
import { FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1 } from "./figure-matrix-source-saturated-discovery-v1";

export type FigureMatrixPermanentQlIdV12 =
  | "SPA-QL-055"
  | "SPA-QL-056"
  | "SPA-QL-057"
  | "SPA-QL-058"
  | "SPA-QL-059"
  | "SPA-QL-060";

export type FigureMatrixProposalIdV12 =
  | "FMT-PROP-01"
  | "FMT-PROP-02"
  | "FMT-PROP-03"
  | "FMT-PROP-04"
  | "FMT-PROP-05"
  | "FMT-PROP-06";

export type FigureMatrixSkillModeV12 =
  | "REPEATED_UNARY_TRANSFORM"
  | "BINARY_FIGURE_COMPOSITION"
  | "QUANTITATIVE_COUNT_RELATION"
  | "CYCLIC_DISTRIBUTION_OR_PERMUTATION"
  | "ORTHOGONAL_ROW_COLUMN_ATTRIBUTES"
  | "COMPOUND_MATRIX_RULE";

export interface FigureMatrixPermanentQlAllocationV12 {
  permanentQlId: FigureMatrixPermanentQlIdV12;
  proposalId: FigureMatrixProposalIdV12;
  chapterCode: "FMT-001";
  skillMode: FigureMatrixSkillModeV12;
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
  allocationStatus: "PERMANENT_QL_ALLOCATED_SOURCE_DISCOVERY_ONLY";
  sourceAuditAuthorityId: typeof FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.authorityId;
  learnerContentFrozen: false;
  questionStudioDiscoverable: false;
  persistenceAllowed: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V11.nextAvailablePermanentQlId !== "SPA-QL-055") {
  throw new Error("SPA-QL-055 is no longer the next available Spatial permanent QL.");
}
if (!FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.decision.chapterImplementationAuthorized) {
  throw new Error("FMT-001 source discovery has not authorized implementation.");
}
if (FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.decision.allocatePermanentQlCount !== 6) {
  throw new Error("FMT-001 discovery must authorize exactly six consolidated permanent QLs.");
}

export const FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12 = Object.freeze([
  Object.freeze({
    permanentQlId: "SPA-QL-055" as const,
    proposalId: "FMT-PROP-01" as const,
    chapterCode: "FMT-001" as const,
    skillMode: "REPEATED_UNARY_TRANSFORM" as const,
    name: "Repeated unary transformation across matrix rows or columns",
    baseDifficulty: "MODERATE" as SpatialPermanentDifficultyV1,
    allocationStatus: "PERMANENT_QL_ALLOCATED_SOURCE_DISCOVERY_ONLY" as const,
    sourceAuditAuthorityId: FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  }),
  Object.freeze({
    permanentQlId: "SPA-QL-056" as const,
    proposalId: "FMT-PROP-02" as const,
    chapterCode: "FMT-001" as const,
    skillMode: "BINARY_FIGURE_COMPOSITION" as const,
    name: "Binary figure composition across matrix cells",
    baseDifficulty: "MODERATE" as SpatialPermanentDifficultyV1,
    allocationStatus: "PERMANENT_QL_ALLOCATED_SOURCE_DISCOVERY_ONLY" as const,
    sourceAuditAuthorityId: FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  }),
  Object.freeze({
    permanentQlId: "SPA-QL-057" as const,
    proposalId: "FMT-PROP-03" as const,
    chapterCode: "FMT-001" as const,
    skillMode: "QUANTITATIVE_COUNT_RELATION" as const,
    name: "Count relation across dots lines or repeated elements",
    baseDifficulty: "EASY" as SpatialPermanentDifficultyV1,
    allocationStatus: "PERMANENT_QL_ALLOCATED_SOURCE_DISCOVERY_ONLY" as const,
    sourceAuditAuthorityId: FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  }),
  Object.freeze({
    permanentQlId: "SPA-QL-058" as const,
    proposalId: "FMT-PROP-04" as const,
    chapterCode: "FMT-001" as const,
    skillMode: "CYCLIC_DISTRIBUTION_OR_PERMUTATION" as const,
    name: "Cyclic distribution of motifs positions orientations or fill states",
    baseDifficulty: "MODERATE" as SpatialPermanentDifficultyV1,
    allocationStatus: "PERMANENT_QL_ALLOCATED_SOURCE_DISCOVERY_ONLY" as const,
    sourceAuditAuthorityId: FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  }),
  Object.freeze({
    permanentQlId: "SPA-QL-059" as const,
    proposalId: "FMT-PROP-05" as const,
    chapterCode: "FMT-001" as const,
    skillMode: "ORTHOGONAL_ROW_COLUMN_ATTRIBUTES" as const,
    name: "Independent row and column attributes constrain the missing cell",
    baseDifficulty: "HARD" as SpatialPermanentDifficultyV1,
    allocationStatus: "PERMANENT_QL_ALLOCATED_SOURCE_DISCOVERY_ONLY" as const,
    sourceAuditAuthorityId: FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  }),
  Object.freeze({
    permanentQlId: "SPA-QL-060" as const,
    proposalId: "FMT-PROP-06" as const,
    chapterCode: "FMT-001" as const,
    skillMode: "COMPOUND_MATRIX_RULE" as const,
    name: "Two coordinated transformations complete the matrix",
    baseDifficulty: "HARD" as SpatialPermanentDifficultyV1,
    allocationStatus: "PERMANENT_QL_ALLOCATED_SOURCE_DISCOVERY_ONLY" as const,
    sourceAuditAuthorityId: FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  }),
] as const satisfies readonly FigureMatrixPermanentQlAllocationV12[]);

export const SPATIAL_PERMANENT_QL_ALLOCATIONS_V12 = Object.freeze([
  ...SPATIAL_PERMANENT_QL_ALLOCATIONS_V11,
  ...FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12,
]);

export const SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12 = Object.freeze({
  authorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V12-FMT-001" as const,
  status: "PERMANENT_QL_RANGE_EXTENDED_TO_060_FMT_DISCOVERY" as const,
  baseAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V11.authorityId,
  sourceAuditAuthorityId: FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  verifiedNewMainHeadBeforeAllocation: "0e3e66b18546406746d45d815c3d7032ac6d99db" as const,
  verifiedBaseRange: "SPA-QL-001..SPA-QL-054" as const,
  verifiedBaseNextAvailablePermanentQlId: "SPA-QL-055" as const,
  allocations: SPATIAL_PERMANENT_QL_ALLOCATIONS_V12,
  newAllocations: FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12,
  permanentQlCount: 60,
  permanentQlRange: "SPA-QL-001..SPA-QL-060" as const,
  allocatedRange: "SPA-QL-055..SPA-QL-060" as const,
  nextAvailablePermanentQlId: "SPA-QL-061" as const,
  chapterCounts: Object.freeze({
    ...SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V11.chapterCounts,
    "FMT-001": 6,
  }),
  invariants: Object.freeze({
    semanticSkillNotRepresentationVariant: true as const,
    matrixSizeNotSeparateQl: true as const,
    rowVsColumnNotSeparateQl: true as const,
    transformAngleNotSeparateQl: true as const,
    primitiveChoiceNotSeparateQl: true as const,
    pureFigureAnalogyExcluded: true as const,
    figureGroupingExcluded: true as const,
  }),
  lifecycle: Object.freeze({
    permanentIdentityAllocated: true,
    reviewRuntimeImplemented: false,
    learnerContentFrozen: false,
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  }),
  nextGate: "SPA_FMT_001_REVIEW_RUNTIME_AND_VISUAL_PROOF_V1" as const,
} as const);

if (SPATIAL_PERMANENT_QL_ALLOCATIONS_V12.length !== 60) {
  throw new Error(`Expected 60 permanent Spatial QLs after FMT-001 allocation, got ${SPATIAL_PERMANENT_QL_ALLOCATIONS_V12.length}.`);
}
if (FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.length !== 6) {
  throw new Error("FMT-001 allocation must retain six consolidated semantic QLs.");
}
