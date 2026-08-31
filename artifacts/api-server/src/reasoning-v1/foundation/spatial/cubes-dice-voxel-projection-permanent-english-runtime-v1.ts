import {
  CND_001_VOXEL_PROJECTION_RUNTIME_AUTHORITY_V2,
  generateCubesDiceVoxelRuntimeQuestionV2,
  type CubesDiceVoxelRuntimeQuestionV2,
  type CubesDiceVoxelRuntimeTaskKindV2,
} from "./cubes-dice-voxel-projection-runtime-v2";
import {
  SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V8,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8,
  type CubesDicePermanentQlIdV8,
} from "./spatial-permanent-ql-allocation-v8";

export type CubesDiceVoxelPermanentEnglishQuestionV1 = Readonly<
  Omit<CubesDiceVoxelRuntimeQuestionV2, "version" | "proposedPermanentQlId" | "lifecycle"> & {
    version: "CND-001-VOXEL-PROJECTION-PERMANENT-ENGLISH-QUESTION-V1";
    permanentQlId: CubesDicePermanentQlIdV8;
    permanentQlTitle: string;
    language: "en";
    locale: "en-IN";
    qlStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME";
    allocationAuthorityId: typeof SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.authorityId;
    runtimeAuthorityId: "CND-001-VOXEL-PROJECTION-PERMANENT-ENGLISH-RUNTIME-V1";
    lifecycle: Readonly<{
      reviewOnly: true;
      permanentQlAllocated: true;
      englishRuntimeImplemented: true;
      englishImplementationFrozen: false;
      questionStudioRegistered: false;
      persistenceAllowed: false;
      questionBankWritable: false;
      testEligible: false;
      publiclyPublishable: false;
      automaticStudentPublication: false;
    }>;
  }
>;

const TITLES: Readonly<Record<CubesDicePermanentQlIdV8, string>> = Object.freeze({
  "SPA-QL-046": "Reason about stable unit-cube stacks",
  "SPA-QL-047": "Infer top, front and right views of unit-cube stacks",
});

export const CND_001_VOXEL_PROJECTION_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-VOXEL-PROJECTION-PERMANENT-ENGLISH-RUNTIME-V1" as const,
  chapterCode: "CND-001" as const,
  sourceRuntimeAuthorityId: CND_001_VOXEL_PROJECTION_RUNTIME_AUTHORITY_V2.authorityId,
  allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.authorityId,
  permanentQlIds: Object.freeze(["SPA-QL-046", "SPA-QL-047"] as const),
  permanentQlRange: "SPA-QL-046..SPA-QL-047" as const,
  nextPermanentQlId: "SPA-QL-048" as const,
  language: "en" as const,
  locale: "en-IN" as const,
  runtimeStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME_IMPLEMENTED_NOT_YET_FROZEN" as const,
  questionStudioRegistrationAuthorized: false,
  persistenceAllowed: false,
  questionBankWritesAuthorized: false,
  testEligibilityAuthorized: false,
  automaticPublicationAuthorized: false,
  nextGate: "CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1" as const,
});

if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.nextAvailablePermanentQlId !== "SPA-QL-048") {
  throw new Error("CND voxel/projection permanent English runtime expects SPA-QL-046/047 to be allocated.");
}
if (SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V8.map((row) => row.permanentQlId).join(",") !== "SPA-QL-046,SPA-QL-047") {
  throw new Error("CND voxel/projection permanent English runtime allocation mismatch.");
}

export function generateCubesDiceVoxelPermanentEnglishQuestionV1(input: Readonly<{
  seed: string;
  taskKind: CubesDiceVoxelRuntimeTaskKindV2;
  templateId?: string;
}>): CubesDiceVoxelPermanentEnglishQuestionV1 {
  const source = generateCubesDiceVoxelRuntimeQuestionV2(input);
  const permanentQlId = source.proposedPermanentQlId;
  const allocation = SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V8.find((row) => row.permanentQlId === permanentQlId);
  if (!allocation) throw new Error(`${input.seed}: permanent allocation ${permanentQlId} not found.`);
  if (allocation.proposalId !== source.canonicalSkillId) throw new Error(`${input.seed}: permanent allocation skill mismatch.`);

  return Object.freeze({
    ...source,
    version: "CND-001-VOXEL-PROJECTION-PERMANENT-ENGLISH-QUESTION-V1",
    permanentQlId,
    permanentQlTitle: TITLES[permanentQlId],
    language: "en",
    locale: "en-IN",
    qlStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME",
    allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.authorityId,
    runtimeAuthorityId: CND_001_VOXEL_PROJECTION_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.authorityId,
    lifecycle: Object.freeze({
      reviewOnly: true as const,
      permanentQlAllocated: true as const,
      englishRuntimeImplemented: true as const,
      englishImplementationFrozen: false as const,
      questionStudioRegistered: false as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}
