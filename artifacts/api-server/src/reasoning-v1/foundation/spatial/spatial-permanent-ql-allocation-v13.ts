import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V12,
} from "./spatial-permanent-ql-allocation-v12";
import type { SpatialPermanentDifficultyV1 } from "./spatial-permanent-ql-allocation-v1";
import { IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1 } from "./identical-figure-source-saturated-discovery-v1";

export type IdenticalFigurePermanentQlIdV13 = "SPA-QL-061" | "SPA-QL-062" | "SPA-QL-063";
export type IdenticalFigureProposalIdV13 = "IDF-PROP-01" | "IDF-PROP-02" | "IDF-PROP-03";
export type IdenticalFigureSkillModeV13 =
  | "COMPONENT_IDENTITY_GROUPING"
  | "TOPOLOGICAL_RELATION_GROUPING"
  | "TRANSFORM_EQUIVALENCE_GROUPING";

export interface IdenticalFigurePermanentQlAllocationV13 {
  permanentQlId: IdenticalFigurePermanentQlIdV13;
  proposalId: IdenticalFigureProposalIdV13;
  chapterCode: "IDF-001";
  skillMode: IdenticalFigureSkillModeV13;
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
  allocationStatus: "PERMANENT_QL_ALLOCATED_SOURCE_DISCOVERY_ONLY";
  sourceAuditAuthorityId: typeof IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.authorityId;
  learnerContentFrozen: false;
  questionStudioDiscoverable: false;
  persistenceAllowed: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12.nextAvailablePermanentQlId !== "SPA-QL-061") {
  throw new Error("SPA-QL-061 is no longer the next available Spatial permanent QL.");
}
if (!IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.decision.chapterImplementationAuthorized) {
  throw new Error("IDF-001 source discovery has not authorized implementation.");
}

export const IDENTICAL_FIGURE_PERMANENT_QL_ALLOCATIONS_V13 = Object.freeze([
  Object.freeze({
    permanentQlId: "SPA-QL-061" as const,
    proposalId: "IDF-PROP-01" as const,
    chapterCode: "IDF-001" as const,
    skillMode: "COMPONENT_IDENTITY_GROUPING" as const,
    name: "Group figures by stable component identity",
    baseDifficulty: "EASY" as SpatialPermanentDifficultyV1,
    allocationStatus: "PERMANENT_QL_ALLOCATED_SOURCE_DISCOVERY_ONLY" as const,
    sourceAuditAuthorityId: IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  }),
  Object.freeze({
    permanentQlId: "SPA-QL-062" as const,
    proposalId: "IDF-PROP-02" as const,
    chapterCode: "IDF-001" as const,
    skillMode: "TOPOLOGICAL_RELATION_GROUPING" as const,
    name: "Group figures by containment overlap or intersection relation",
    baseDifficulty: "MODERATE" as SpatialPermanentDifficultyV1,
    allocationStatus: "PERMANENT_QL_ALLOCATED_SOURCE_DISCOVERY_ONLY" as const,
    sourceAuditAuthorityId: IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  }),
  Object.freeze({
    permanentQlId: "SPA-QL-063" as const,
    proposalId: "IDF-PROP-03" as const,
    chapterCode: "IDF-001" as const,
    skillMode: "TRANSFORM_EQUIVALENCE_GROUPING" as const,
    name: "Group asymmetric figures under declared rotation or reflection equivalence",
    baseDifficulty: "HARD" as SpatialPermanentDifficultyV1,
    allocationStatus: "PERMANENT_QL_ALLOCATED_SOURCE_DISCOVERY_ONLY" as const,
    sourceAuditAuthorityId: IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  }),
] as const satisfies readonly IdenticalFigurePermanentQlAllocationV13[]);

export const SPATIAL_PERMANENT_QL_ALLOCATIONS_V13 = Object.freeze([
  ...SPATIAL_PERMANENT_QL_ALLOCATIONS_V12,
  ...IDENTICAL_FIGURE_PERMANENT_QL_ALLOCATIONS_V13,
]);

export const SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13 = Object.freeze({
  authorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V13-IDF-001" as const,
  status: "PERMANENT_QL_RANGE_EXTENDED_TO_063_IDF_DISCOVERY" as const,
  baseAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12.authorityId,
  sourceAuditAuthorityId: IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  verifiedNewMainHeadBeforeAllocation: "e9f4d78572fbb10725b9d8d68a3194118e9cdb4c" as const,
  verifiedBaseRange: "SPA-QL-001..SPA-QL-060" as const,
  verifiedBaseNextAvailablePermanentQlId: "SPA-QL-061" as const,
  allocations: SPATIAL_PERMANENT_QL_ALLOCATIONS_V13,
  newAllocations: IDENTICAL_FIGURE_PERMANENT_QL_ALLOCATIONS_V13,
  permanentQlCount: 63,
  permanentQlRange: "SPA-QL-001..SPA-QL-063" as const,
  allocatedRange: "SPA-QL-061..SPA-QL-063" as const,
  nextAvailablePermanentQlId: "SPA-QL-064" as const,
  chapterCounts: Object.freeze({
    ...SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12.chapterCounts,
    "IDF-001": 3,
  }),
  invariants: Object.freeze({
    semanticSkillNotRepresentationVariant: true as const,
    groupOrderingNotSeparateQl: true as const,
    absoluteRotationNotSeparateQl: true as const,
    motifChoiceNotSeparateQl: true as const,
    oddOneOutExcludedToFigureClassification: true as const,
    missingCellExcludedToFigureMatrix: true as const,
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
  nextGate: "SPA_IDF_001_REVIEW_RUNTIME_AND_VISUAL_PROOF_V1" as const,
} as const);

if (SPATIAL_PERMANENT_QL_ALLOCATIONS_V13.length !== 63) {
  throw new Error(`Expected 63 permanent Spatial QLs after IDF-001 allocation, got ${SPATIAL_PERMANENT_QL_ALLOCATIONS_V13.length}.`);
}
if (IDENTICAL_FIGURE_PERMANENT_QL_ALLOCATIONS_V13.length !== 3) {
  throw new Error("IDF-001 allocation must retain three consolidated semantic QLs.");
}
