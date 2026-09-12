import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V7,
} from "./spatial-permanent-ql-allocation-v7";
import type { SpatialPermanentDifficultyV1 } from "./spatial-permanent-ql-allocation-v1";
import { CND_001_VOXEL_PROJECTION_RUNTIME_AUTHORITY_V2 } from "./cubes-dice-voxel-projection-runtime-v2";

export type CubesDicePermanentQlIdV8 = "SPA-QL-046" | "SPA-QL-047";
export type CubesDiceCanonicalSkillIdV8 =
  | "CND-CAN-D-VOXEL-STACK-OCCUPANCY"
  | "CND-CAN-E-ORTHOGRAPHIC-PROJECTION";

export interface SpatialCubesDicePermanentQlAllocationV8 {
  permanentQlId: CubesDicePermanentQlIdV8;
  proposalId: CubesDiceCanonicalSkillIdV8;
  chapterCode: "CND-001";
  skillMode:
    | "STABLE_VOXEL_OCCUPANCY_COUNT_SURFACE_AND_COMPLETION"
    | "ORTHOGRAPHIC_TOP_FRONT_RIGHT_PROJECTION";
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
  equivalencePolicy: "SEMANTIC_SKILL_NOT_STEM_OR_REPRESENTATION_VARIANT";
  allocationStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME_PENDING";
  englishRuntimeImplemented: false;
  englishImplementationFrozen: false;
  active: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

function allocation(input: Readonly<{
  permanentQlId: CubesDicePermanentQlIdV8;
  proposalId: CubesDiceCanonicalSkillIdV8;
  skillMode: SpatialCubesDicePermanentQlAllocationV8["skillMode"];
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
}>): SpatialCubesDicePermanentQlAllocationV8 {
  return Object.freeze({
    ...input,
    chapterCode: "CND-001" as const,
    equivalencePolicy: "SEMANTIC_SKILL_NOT_STEM_OR_REPRESENTATION_VARIANT" as const,
    allocationStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME_PENDING" as const,
    englishRuntimeImplemented: false as const,
    englishImplementationFrozen: false as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });
}

if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.nextAvailablePermanentQlId !== "SPA-QL-046") {
  throw new Error("SPA-QL-046 is no longer the next available Spatial permanent QL.");
}
if (!CND_001_VOXEL_PROJECTION_RUNTIME_AUTHORITY_V2.permanentQlAllocationAuthorized) {
  throw new Error("CND voxel/projection review has not authorized permanent QL allocation.");
}
if (CND_001_VOXEL_PROJECTION_RUNTIME_AUTHORITY_V2.proposedPermanentQlRange !== "SPA-QL-046..SPA-QL-047") {
  throw new Error("CND voxel/projection runtime is not pinned to SPA-QL-046..SPA-QL-047.");
}

export const SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V8 = Object.freeze([
  allocation({
    permanentQlId: "SPA-QL-046",
    proposalId: "CND-CAN-D-VOXEL-STACK-OCCUPANCY",
    skillMode: "STABLE_VOXEL_OCCUPANCY_COUNT_SURFACE_AND_COMPLETION",
    name: "Reason about stable unit-cube stacks",
    baseDifficulty: "MODERATE",
  }),
  allocation({
    permanentQlId: "SPA-QL-047",
    proposalId: "CND-CAN-E-ORTHOGRAPHIC-PROJECTION",
    skillMode: "ORTHOGRAPHIC_TOP_FRONT_RIGHT_PROJECTION",
    name: "Infer top, front and right views of unit-cube stacks",
    baseDifficulty: "MODERATE",
  }),
] as const satisfies readonly SpatialCubesDicePermanentQlAllocationV8[]);

export const SPATIAL_PERMANENT_QL_ALLOCATIONS_V8 = Object.freeze([
  ...SPATIAL_PERMANENT_QL_ALLOCATIONS_V7,
  ...SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V8,
]);

export const SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8 = Object.freeze({
  authorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V8-CND-VOXEL-PROJECTION" as const,
  status: "PERMANENT_QL_ALLOCATION_EXTENDED_CND_VOXEL_PROJECTION_ENGLISH_RUNTIME_PENDING" as const,
  baseAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.authorityId,
  verifiedNewMainHeadBeforeAllocation: "b941b8aeb0ac8620a0d76494f056f903afc0990a" as const,
  verifiedBaseRange: "SPA-QL-001..SPA-QL-045" as const,
  verifiedBaseNextAvailablePermanentQlId: "SPA-QL-046" as const,
  runtimeReviewAuthorityId: CND_001_VOXEL_PROJECTION_RUNTIME_AUTHORITY_V2.authorityId,
  reviewEvidencePullRequest: CND_001_VOXEL_PROJECTION_RUNTIME_AUTHORITY_V2.reviewEvidencePullRequest,
  productOwnerReviewStatus: CND_001_VOXEL_PROJECTION_RUNTIME_AUTHORITY_V2.productOwnerReviewStatus,
  allocations: SPATIAL_PERMANENT_QL_ALLOCATIONS_V8,
  cubesDiceAllocations: SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V8,
  permanentQlCount: 47,
  permanentQlRange: "SPA-QL-001..SPA-QL-047" as const,
  allocatedRange: "SPA-QL-046..SPA-QL-047" as const,
  nextAvailablePermanentQlId: "SPA-QL-048" as const,
  chapterCounts: Object.freeze({
    ...SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.chapterCounts,
    "CND-001": 5,
  }),
  invariants: Object.freeze({
    semanticSkillNotStemVariant: true,
    stackTotalExposedAndCompletionRemainOneOccupancyQl: true,
    topFrontRightProjectionRemainOneOrthographicQl: true,
    taskVariantDoesNotCreateStandaloneQl: true,
    rendererVariantDoesNotCreateStandaloneQl: true,
    explanationFormatDoesNotCreateStandaloneQl: true,
  }),
  lifecycle: Object.freeze({
    englishRuntimeImplemented: false,
    englishImplementationFrozen: false,
    localizationAllowed: false,
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  }),
  nextGate: "CND_001_VOXEL_PROJECTION_PERMANENT_ENGLISH_RUNTIME_V1" as const,
} as const);
