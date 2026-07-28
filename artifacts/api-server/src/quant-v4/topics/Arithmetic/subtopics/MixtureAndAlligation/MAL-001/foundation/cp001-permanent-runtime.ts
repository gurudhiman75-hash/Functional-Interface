import { generateMalCp001FoundationQuestion } from "./cp001-foundation-normalizer";
import type { MalCp001DiscoveryPrototypeId } from "./cp001-gap-registry";
import {
  MAL_CP001_PERMANENT_QL_IDS,
  getMalCp001PermanentAllocation,
} from "./cp001-permanent-allocation";
import type {
  MalCp001PermanentAllocationEntry,
  MalCp001PermanentQlId,
} from "./cp001-permanent-allocation";

function hashIndex(text: string, modulus: number): number {
  let hash = 2166136261;
  for (const character of text) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % modulus;
}

function selectPrototype(
  entry: MalCp001PermanentAllocationEntry,
  seed: string,
): MalCp001DiscoveryPrototypeId {
  if (entry.prototypeIds.length === 0) {
    throw new Error(`${entry.qlId} has no executable prototype allocation.`);
  }
  return entry.prototypeIds[
    hashIndex(`${entry.qlId}:${seed}:prototype`, entry.prototypeIds.length)
  ]!;
}

export interface MalCp001PermanentRuntimeInput {
  questionLanguageId?: MalCp001PermanentQlId;
  seed?: string;
  language?: "en";
}

type MalCp001FoundationQuestion = ReturnType<
  typeof generateMalCp001FoundationQuestion
>;

type ReplacedFoundationFields =
  | "permanentQlId"
  | "questionLanguageId"
  | "difficulty"
  | "taskDirection"
  | "answerSemantic"
  | "publiclyPublishable"
  | "questionStudioDiscoverable";

export type MalCp001PermanentQuestion = Omit<
  MalCp001FoundationQuestion,
  ReplacedFoundationFields
> & {
  permanentQlId: MalCp001PermanentQlId;
  questionLanguageId: MalCp001PermanentQlId;
  questionId: string;
  language: "en";
  difficulty: MalCp001PermanentAllocationEntry["difficulty"];
  taskDirection: MalCp001PermanentAllocationEntry["taskDirection"];
  answerSemantic: MalCp001PermanentAllocationEntry["answerSemantic"];
  maturity: "IMPLEMENTATION_PROOF";
  allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF";
  permanentIdentityFrozen: true;
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
  traceability: {
    packageId: "MAL-001";
    canonicalProblemId: "MAL-CP-001";
    questionLanguageId: MalCp001PermanentQlId;
    qlTemplateId: MalCp001PermanentAllocationEntry["qlTemplateId"];
    solveModeId: MalCp001PermanentAllocationEntry["solveModeId"];
    prototypeId: MalCp001DiscoveryPrototypeId;
    answerSemantic: MalCp001PermanentAllocationEntry["answerSemantic"];
    taskDirection: MalCp001PermanentAllocationEntry["taskDirection"];
    difficulty: MalCp001PermanentAllocationEntry["difficulty"];
    language: "en";
  };
};

/**
 * Generates one permanently identified CP-001 question in implementation-proof
 * mode. The package is deliberately inactive and cannot be routed to any
 * public, Question Studio, Question Bank or test surface.
 */
export function runMalCp001PermanentPipeline(
  input: MalCp001PermanentRuntimeInput = {},
): MalCp001PermanentQuestion {
  const questionLanguageId =
    input.questionLanguageId ?? MAL_CP001_PERMANENT_QL_IDS[0];
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(
      `MAL-CP-001 permanent runtime only supports English; received ${language}.`,
    );
  }

  const allocation = getMalCp001PermanentAllocation(questionLanguageId);
  const seed = input.seed ?? `mal-001:${questionLanguageId}:default`;
  const prototypeId = selectPrototype(allocation, seed);
  const foundationQuestion = generateMalCp001FoundationQuestion(prototypeId, seed);

  if (!foundationQuestion.validation.ok) {
    throw new Error(
      `${questionLanguageId}/${seed} failed foundation validation: ${foundationQuestion.validation.errors.join("; ")}`,
    );
  }
  if (!allocation.prototypeIds.includes(prototypeId)) {
    throw new Error(
      `${questionLanguageId}/${seed} selected an unallocated prototype.`,
    );
  }
  if (foundationQuestion.foundationQlTemplateId !== allocation.qlTemplateId) {
    throw new Error(
      `${questionLanguageId}/${seed} template mismatch: ${foundationQuestion.foundationQlTemplateId}/${allocation.qlTemplateId}.`,
    );
  }
  if (foundationQuestion.foundationSolveModeId !== allocation.solveModeId) {
    throw new Error(
      `${questionLanguageId}/${seed} solve-mode mismatch: ${foundationQuestion.foundationSolveModeId}/${allocation.solveModeId}.`,
    );
  }

  return {
    ...foundationQuestion,
    permanentQlId: allocation.qlId,
    questionLanguageId: allocation.qlId,
    questionId: `MAL-001:${allocation.qlId}:${seed}`,
    language: "en",
    difficulty: allocation.difficulty,
    taskDirection: allocation.taskDirection,
    answerSemantic: allocation.answerSemantic,
    maturity: "IMPLEMENTATION_PROOF",
    allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
    permanentIdentityFrozen: true,
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    traceability: {
      packageId: "MAL-001",
      canonicalProblemId: "MAL-CP-001",
      questionLanguageId: allocation.qlId,
      qlTemplateId: allocation.qlTemplateId,
      solveModeId: allocation.solveModeId,
      prototypeId,
      answerSemantic: allocation.answerSemantic,
      taskDirection: allocation.taskDirection,
      difficulty: allocation.difficulty,
      language: "en",
    },
  };
}
