import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V10,
} from "./spatial-permanent-ql-allocation-v10";
import type { SpatialPermanentDifficultyV1 } from "./spatial-permanent-ql-allocation-v1";
import { DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1 } from "./dot-situation-source-saturated-discovery-v1";

export type DotSituationPermanentQlIdV11 = "SPA-QL-054";
export type DotSituationProposalIdV11 = "DOT-PROP-01";
export type DotSituationSkillModeV11 = "MATCH_DOT_REGION_MEMBERSHIP_SIGNATURES";

export interface DotSituationPermanentQlAllocationV11 {
  permanentQlId: DotSituationPermanentQlIdV11;
  proposalId: DotSituationProposalIdV11;
  chapterCode: "DOT-001";
  skillMode: DotSituationSkillModeV11;
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
  allocationStatus: "PERMANENT_QL_ALLOCATED_REVIEW_RUNTIME_IMPLEMENTED";
  sourceAuditAuthorityId: typeof DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1.authorityId;
  learnerContentFrozen: false;
  questionStudioDiscoverable: false;
  persistenceAllowed: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.nextAvailablePermanentQlId !== "SPA-QL-054") {
  throw new Error("SPA-QL-054 is no longer the next available Spatial permanent QL.");
}
if (!DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1.decision.chapterImplementationAuthorized) {
  throw new Error("DOT-001 source discovery has not authorized implementation.");
}

export const DOT_SITUATION_PERMANENT_QL_ALLOCATIONS_V11 = Object.freeze([
  Object.freeze({
    permanentQlId: "SPA-QL-054" as const,
    proposalId: "DOT-PROP-01" as const,
    chapterCode: "DOT-001" as const,
    skillMode: "MATCH_DOT_REGION_MEMBERSHIP_SIGNATURES" as const,
    name: "Preserve complete dot-region membership across rearranged shapes",
    baseDifficulty: "MODERATE" as SpatialPermanentDifficultyV1,
    allocationStatus: "PERMANENT_QL_ALLOCATED_REVIEW_RUNTIME_IMPLEMENTED" as const,
    sourceAuditAuthorityId: DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  }),
] as const satisfies readonly DotSituationPermanentQlAllocationV11[]);

export const SPATIAL_PERMANENT_QL_ALLOCATIONS_V11 = Object.freeze([
  ...SPATIAL_PERMANENT_QL_ALLOCATIONS_V10,
  ...DOT_SITUATION_PERMANENT_QL_ALLOCATIONS_V11,
]);

export const SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V11 = Object.freeze({
  authorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V11-DOT-001" as const,
  status: "PERMANENT_QL_RANGE_EXTENDED_TO_054_DOT_REVIEW_RUNTIME" as const,
  baseAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.authorityId,
  sourceAuditAuthorityId: DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  verifiedNewMainHeadBeforeAllocation: "f00991daeaa08702889089d2d35edc72c8f10639" as const,
  verifiedBaseRange: "SPA-QL-001..SPA-QL-053" as const,
  verifiedBaseNextAvailablePermanentQlId: "SPA-QL-054" as const,
  allocations: SPATIAL_PERMANENT_QL_ALLOCATIONS_V11,
  newAllocations: DOT_SITUATION_PERMANENT_QL_ALLOCATIONS_V11,
  permanentQlCount: 54,
  permanentQlRange: "SPA-QL-001..SPA-QL-054" as const,
  allocatedRange: "SPA-QL-054" as const,
  nextAvailablePermanentQlId: "SPA-QL-055" as const,
  chapterCounts: Object.freeze({
    ...SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.chapterCounts,
    "DOT-001": 1,
  }),
  invariants: Object.freeze({
    semanticSkillNotRepresentationVariant: true as const,
    singleVsMultipleDotsNotSeparateQl: true as const,
    simpleVsComplexOverlapNotSeparateQl: true as const,
    twoVsThreeVsFourShapesNotSeparateQl: true as const,
    fullInsideOutsideSignatureIsAuthority: true as const,
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
  nextGate: "SPA_DOT_001_RUNTIME_VALIDATION_AND_VISUAL_REVIEW_V1" as const,
} as const);

if (SPATIAL_PERMANENT_QL_ALLOCATIONS_V11.length !== 54) {
  throw new Error(`Expected 54 permanent Spatial QLs after DOT-001 allocation, got ${SPATIAL_PERMANENT_QL_ALLOCATIONS_V11.length}.`);
}
