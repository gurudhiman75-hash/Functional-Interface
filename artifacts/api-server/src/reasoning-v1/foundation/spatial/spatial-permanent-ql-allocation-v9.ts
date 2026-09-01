import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V8,
} from "./spatial-permanent-ql-allocation-v8";
import type { SpatialPermanentDifficultyV1 } from "./spatial-permanent-ql-allocation-v1";
import { SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1 } from "./spatial-final-held-gap-saturation-v1";

export type SpatialFinalHeldGapPermanentQlIdV9 = "SPA-QL-048" | "SPA-QL-049" | "SPA-QL-050";
export type SpatialFinalHeldGapProposalIdV9 =
  | "FCT-CAND-B-STRAIGHT-LINE-ENUMERATION"
  | "FCT-CAND-C-CURVED-PRIMITIVE-ENUMERATION"
  | "EMB-PROP-02";

export interface SpatialFinalHeldGapPermanentQlAllocationV9 {
  permanentQlId: SpatialFinalHeldGapPermanentQlIdV9;
  proposalId: SpatialFinalHeldGapProposalIdV9;
  chapterCode: "FCT-001" | "EMB-001";
  skillMode:
    | "SYSTEMATIC_STRAIGHT_LINE_ENUMERATION"
    | "SYSTEMATIC_CURVED_PRIMITIVE_ENUMERATION"
    | "ROTATION_ALLOWED_EMBEDDED_SUBGRAPH";
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
  allocationStatus: "PERMANENT_QL_ALLOCATED_REVIEW_RUNTIME_PENDING";
  sourceAuditAuthorityId: typeof SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.authorityId;
  learnerContentFrozen: false;
  questionStudioDiscoverable: false;
  persistenceAllowed: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

function allocation(input: Readonly<{
  permanentQlId: SpatialFinalHeldGapPermanentQlIdV9;
  proposalId: SpatialFinalHeldGapProposalIdV9;
  chapterCode: "FCT-001" | "EMB-001";
  skillMode: SpatialFinalHeldGapPermanentQlAllocationV9["skillMode"];
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
}>): SpatialFinalHeldGapPermanentQlAllocationV9 {
  return Object.freeze({
    ...input,
    allocationStatus: "PERMANENT_QL_ALLOCATED_REVIEW_RUNTIME_PENDING" as const,
    sourceAuditAuthorityId: SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.authorityId,
    learnerContentFrozen: false as const,
    questionStudioDiscoverable: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });
}

if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.nextAvailablePermanentQlId !== "SPA-QL-048") {
  throw new Error("SPA-QL-048 is no longer the next available Spatial permanent QL.");
}
if (!SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.lifecycle.permanentIdentityAllocationAuthorizedForPromotedQls) {
  throw new Error("Final Spatial held-gap audit has not authorized permanent identity allocation.");
}
if (SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.promotedQlIds.join(",") !== "SPA-QL-048,SPA-QL-049,SPA-QL-050") {
  throw new Error("Final Spatial held-gap audit is not pinned to SPA-QL-048..SPA-QL-050.");
}

export const SPATIAL_FINAL_HELD_GAP_PERMANENT_QL_ALLOCATIONS_V9 = Object.freeze([
  allocation({
    permanentQlId: "SPA-QL-048",
    proposalId: "FCT-CAND-B-STRAIGHT-LINE-ENUMERATION",
    chapterCode: "FCT-001",
    skillMode: "SYSTEMATIC_STRAIGHT_LINE_ENUMERATION",
    name: "Systematic counting of straight lines",
    baseDifficulty: "MODERATE",
  }),
  allocation({
    permanentQlId: "SPA-QL-049",
    proposalId: "FCT-CAND-C-CURVED-PRIMITIVE-ENUMERATION",
    chapterCode: "FCT-001",
    skillMode: "SYSTEMATIC_CURVED_PRIMITIVE_ENUMERATION",
    name: "Systematic counting of circles and semicircles",
    baseDifficulty: "MODERATE",
  }),
  allocation({
    permanentQlId: "SPA-QL-050",
    proposalId: "EMB-PROP-02",
    chapterCode: "EMB-001",
    skillMode: "ROTATION_ALLOWED_EMBEDDED_SUBGRAPH",
    name: "Embedded figure identification with rotation allowed",
    baseDifficulty: "MODERATE",
  }),
] as const satisfies readonly SpatialFinalHeldGapPermanentQlAllocationV9[]);

export const SPATIAL_PERMANENT_QL_ALLOCATIONS_V9 = Object.freeze([
  ...SPATIAL_PERMANENT_QL_ALLOCATIONS_V8,
  ...SPATIAL_FINAL_HELD_GAP_PERMANENT_QL_ALLOCATIONS_V9,
]);

export const SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9 = Object.freeze({
  authorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V9-FINAL-HELD-GAPS" as const,
  status: "PERMANENT_QL_RANGE_EXTENDED_TO_050_REVIEW_RUNTIMES_PENDING" as const,
  baseAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.authorityId,
  sourceAuditAuthorityId: SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.authorityId,
  verifiedNewMainHeadBeforeAllocation: "19c69dd5a6d64564634a1924ec7a41d5d2ca93d7" as const,
  verifiedBaseRange: "SPA-QL-001..SPA-QL-047" as const,
  verifiedBaseNextAvailablePermanentQlId: "SPA-QL-048" as const,
  allocations: SPATIAL_PERMANENT_QL_ALLOCATIONS_V9,
  newAllocations: SPATIAL_FINAL_HELD_GAP_PERMANENT_QL_ALLOCATIONS_V9,
  permanentQlCount: 50,
  permanentQlRange: "SPA-QL-001..SPA-QL-050" as const,
  allocatedRange: "SPA-QL-048..SPA-QL-050" as const,
  nextAvailablePermanentQlId: "SPA-QL-051" as const,
  chapterCounts: Object.freeze({
    ...SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.chapterCounts,
    "FCT-001": 3,
    "EMB-001": 2,
  }),
  invariants: Object.freeze({
    semanticSkillNotRepresentationVariant: true,
    straightLineCountingSeparateFromClosedPolygonCounting: true,
    circleAndSemicircleTargetTypeParameterWithinCurvedCountingQl: true,
    rotationAllowedSeparateFromFixedOrientationEmbedding: true,
    reflectionAllowedNotAllocated: true,
    analogClockWaterDiagramNotAllocated: true,
    identitySetReplacementStandaloneQlNotAllocated: true,
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
  nextGate: "SPA_FINAL_HELD_GAP_PERMANENT_RUNTIME_REVIEW_V1" as const,
} as const);
