import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V6,
} from "./spatial-permanent-ql-allocation-v6";
import type { SpatialPermanentDifficultyV1 } from "./spatial-permanent-ql-allocation-v1";
import { CND_001_CP004_AUTHORITY_V1 } from "./cubes-dice-cp004-distractors-allocation-v1";
import { CND_001_CANONICAL_SKILLS_V1, CND_001_MERGE_SPLIT_AUTHORITY_V1 } from "./cubes-dice-merge-split-v1";

export type CubesDicePermanentQlIdV7 = "SPA-QL-043" | "SPA-QL-044" | "SPA-QL-045";
export type CubesDiceCanonicalSkillIdV7 =
  | "CND-CAN-A-DIE-FACE-RELATIONS"
  | "CND-CAN-B-CUBE-NET-FOLDING"
  | "CND-CAN-C-PAINTED-CUBE-EXPOSURE";

export interface SpatialCubesDicePermanentQlAllocationV7 {
  permanentQlId: CubesDicePermanentQlIdV7;
  proposalId: CubesDiceCanonicalSkillIdV7;
  chapterCode: "CND-001";
  skillMode:
    | "CUBE_ROTATION_ASSIGNMENT_AND_FACE_ADJACENCY"
    | "ORTHOGONAL_NET_TO_3D_FACE_NORMALS"
    | "UNIT_CUBE_COORDINATE_BOUNDARY_EXPOSURE";
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
  permanentQlId: CubesDicePermanentQlIdV7;
  proposalId: CubesDiceCanonicalSkillIdV7;
  skillMode: SpatialCubesDicePermanentQlAllocationV7["skillMode"];
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
}>): SpatialCubesDicePermanentQlAllocationV7 {
  return {
    ...input,
    chapterCode: "CND-001",
    equivalencePolicy: "SEMANTIC_SKILL_NOT_STEM_OR_REPRESENTATION_VARIANT",
    allocationStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME_PENDING",
    englishRuntimeImplemented: false,
    englishImplementationFrozen: false,
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  };
}

if (!CND_001_CP004_AUTHORITY_V1.permanentQlAllocationAuthorized) throw new Error("CND-001 CP004 has not authorized permanent QL allocation.");
if (CND_001_CP004_AUTHORITY_V1.mergeSplitAuthorityId !== CND_001_MERGE_SPLIT_AUTHORITY_V1.authorityId) throw new Error("CND-001 CP004 is not bound to the current merge/split authority.");
if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.nextAvailablePermanentQlId !== "SPA-QL-043") throw new Error("SPA-QL-043 is no longer the next available Spatial permanent QL.");

const retained = CND_001_CANONICAL_SKILLS_V1.filter((skill) => skill.status === "RETAIN_FOR_PRE_ALLOCATION_APPROVAL");
if (retained.length !== 3) throw new Error("CND-001 allocation requires exactly three retained pre-allocation skills.");
if (retained.map((skill) => skill.earliestPermanentQlId).join(",") !== "SPA-QL-043,SPA-QL-044,SPA-QL-045") throw new Error("CND-001 retained skill IDs no longer match the approved permanent range.");

export const SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V7 = Object.freeze([
  allocation({
    permanentQlId: "SPA-QL-043",
    proposalId: "CND-CAN-A-DIE-FACE-RELATIONS",
    skillMode: "CUBE_ROTATION_ASSIGNMENT_AND_FACE_ADJACENCY",
    name: "Infer die face relations under proper cube rotation",
    baseDifficulty: "MODERATE",
  }),
  allocation({
    permanentQlId: "SPA-QL-044",
    proposalId: "CND-CAN-B-CUBE-NET-FOLDING",
    skillMode: "ORTHOGONAL_NET_TO_3D_FACE_NORMALS",
    name: "Fold a cube net and infer face relations",
    baseDifficulty: "MODERATE",
  }),
  allocation({
    permanentQlId: "SPA-QL-045",
    proposalId: "CND-CAN-C-PAINTED-CUBE-EXPOSURE",
    skillMode: "UNIT_CUBE_COORDINATE_BOUNDARY_EXPOSURE",
    name: "Count subdivided cubes by painted-face exposure",
    baseDifficulty: "MODERATE",
  }),
] as const satisfies readonly SpatialCubesDicePermanentQlAllocationV7[]);

export const SPATIAL_PERMANENT_QL_ALLOCATIONS_V7 = Object.freeze([
  ...SPATIAL_PERMANENT_QL_ALLOCATIONS_V6,
  ...SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V7,
]);

export const SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7 = Object.freeze({
  authorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V7-CND" as const,
  status: "PERMANENT_QL_ALLOCATION_EXTENDED_CND_ENGLISH_RUNTIME_PENDING" as const,
  baseAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.authorityId,
  verifiedNewMainHeadAtAllocation: "6e0b830e45739f71661750bb6a8032d59c7e94d3" as const,
  verifiedBaseRange: "SPA-QL-001..SPA-QL-042" as const,
  verifiedBaseNextAvailablePermanentQlId: "SPA-QL-043" as const,
  cp004AuthorityId: CND_001_CP004_AUTHORITY_V1.authorityId,
  mergeSplitAuthorityId: CND_001_MERGE_SPLIT_AUTHORITY_V1.authorityId,
  allocations: SPATIAL_PERMANENT_QL_ALLOCATIONS_V7,
  cubesDiceAllocations: SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V7,
  permanentQlCount: 45,
  permanentQlRange: "SPA-QL-001..SPA-QL-045" as const,
  allocatedRange: "SPA-QL-043..SPA-QL-045" as const,
  nextAvailablePermanentQlId: "SPA-QL-046" as const,
  chapterCounts: {
    ...SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.chapterCounts,
    "CND-001": 3,
  },
  invariants: {
    semanticSkillNotStemVariant: true,
    dieOppositeAdjacentCommonFaceAndViewValidityRemainOneQl: true,
    cubeNetOppositeAndFoldedViewQueriesRemainOneQl: true,
    paintedFaceCountCategoriesRemainOneQl: true,
    voxelStackOccupancyHeldForRuntimeProof: true,
    orthographicProjectionHeldForRuntimeProof: true,
    distractorMechanismCreatesStandaloneQl: false,
  },
  lifecycle: {
    englishRuntimeImplemented: false,
    englishImplementationFrozen: false,
    localizationAllowed: false,
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
  nextGate: "CND_001_PERMANENT_ENGLISH_RUNTIME_V1" as const,
} as const);
