import {
  CND_001_CP004_AUTHORITY_V1,
  generateCubesDiceCp004QuestionV1,
  type CubesDiceCp004QuestionV1,
  type CubesDiceCp004TaskKindV1,
  type CubesDicePermanentQlIdV1,
} from "./cubes-dice-cp004-distractors-allocation-v1";
import {
  SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V7,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7,
} from "./spatial-permanent-ql-allocation-v7";

export type CubesDicePermanentEnglishQuestionV1 = Readonly<
  Omit<CubesDiceCp004QuestionV1, "version" | "lifecycle"> & {
    version: "CND-001-PERMANENT-ENGLISH-QUESTION-V1";
    permanentQlTitle: string;
    language: "en";
    locale: "en-IN";
    qlStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME";
    allocationAuthorityId: typeof SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.authorityId;
    runtimeAuthorityId: "CND-001-PERMANENT-ENGLISH-RUNTIME-V1";
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

export const CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-PERMANENT-ENGLISH-RUNTIME-V1" as const,
  chapterCode: "CND-001" as const,
  cp004AuthorityId: CND_001_CP004_AUTHORITY_V1.authorityId,
  allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.authorityId,
  permanentQlIds: ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045"] as const,
  permanentQlRange: "SPA-QL-043..SPA-QL-045" as const,
  nextPermanentQlId: "SPA-QL-046" as const,
  language: "en" as const,
  locale: "en-IN" as const,
  runtimeStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME_IMPLEMENTED_NOT_YET_FROZEN" as const,
  governance: Object.freeze({
    englishRuntimeImplemented: true,
    englishImplementationFrozen: false,
    localizationGenerationAllowed: false,
    questionStudioRegistrationAuthorized: false,
    persistenceAllowed: false,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    deploymentAuthorized: false,
  }),
  nextGate: "CND_001_PERMANENT_ENGLISH_FREEZE_V1" as const,
});

const TASK_METADATA: Readonly<Record<CubesDiceCp004TaskKindV1, Readonly<{
  permanentQlId: CubesDicePermanentQlIdV1;
  permanentQlTitle: string;
}>>> = Object.freeze({
  DICE_OPPOSITE_FROM_TWO_VIEWS: Object.freeze({
    permanentQlId: "SPA-QL-043",
    permanentQlTitle: "Infer die face relations under proper cube rotation",
  }),
  CUBE_NET_OPPOSITE_FACE: Object.freeze({
    permanentQlId: "SPA-QL-044",
    permanentQlTitle: "Fold a cube net and infer face relations",
  }),
  PAINTED_CUBE_EXACT_FACE_COUNT: Object.freeze({
    permanentQlId: "SPA-QL-045",
    permanentQlTitle: "Count subdivided cubes by painted-face exposure",
  }),
});

if (SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V7.length !== 3) {
  throw new Error("CND permanent English runtime expects exactly three allocated QLs.");
}
for (const allocation of SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V7) {
  if (!CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.permanentQlIds.includes(allocation.permanentQlId)) {
    throw new Error(`Unexpected CND allocation ${allocation.permanentQlId}.`);
  }
}
if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.nextAvailablePermanentQlId !== "SPA-QL-046") {
  throw new Error("CND permanent English runtime is not pinned to the SPA-QL-043..045 allocation boundary.");
}

export function generateCubesDicePermanentEnglishQuestionV1(input: Readonly<{
  seed: string;
  taskKind: CubesDiceCp004TaskKindV1;
}>): CubesDicePermanentEnglishQuestionV1 {
  const source = generateCubesDiceCp004QuestionV1(input);
  const metadata = TASK_METADATA[input.taskKind];
  if (source.permanentQlId !== metadata.permanentQlId) {
    throw new Error(`${input.seed}: CND permanent English allocation mismatch.`);
  }
  return Object.freeze({
    ...source,
    version: "CND-001-PERMANENT-ENGLISH-QUESTION-V1",
    permanentQlTitle: metadata.permanentQlTitle,
    language: "en",
    locale: "en-IN",
    qlStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME",
    allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.authorityId,
    runtimeAuthorityId: CND_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.authorityId,
    lifecycle: Object.freeze({
      reviewOnly: true,
      permanentQlAllocated: true,
      englishRuntimeImplemented: true,
      englishImplementationFrozen: false,
      questionStudioRegistered: false,
      persistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    }),
  });
}

export function generateCubesDicePermanentEnglishBatchV1(input: Readonly<{
  seed: string;
  countPerQl: number;
}>): readonly CubesDicePermanentEnglishQuestionV1[] {
  if (!Number.isInteger(input.countPerQl) || input.countPerQl < 1 || input.countPerQl > 100) {
    throw new Error("CND permanent English countPerQl must be an integer from 1 to 100.");
  }
  const taskKinds = Object.keys(TASK_METADATA) as CubesDiceCp004TaskKindV1[];
  const questions: CubesDicePermanentEnglishQuestionV1[] = [];
  for (const taskKind of taskKinds) {
    for (let index = 0; index < input.countPerQl; index += 1) {
      questions.push(generateCubesDicePermanentEnglishQuestionV1({
        seed: `${input.seed}:${taskKind}:${index}`,
        taskKind,
      }));
    }
  }
  return Object.freeze(questions);
}
