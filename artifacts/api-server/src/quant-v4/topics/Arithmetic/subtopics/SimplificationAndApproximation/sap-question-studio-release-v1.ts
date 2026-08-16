import {
  SAP_QUESTION_STUDIO_CHECKPOINTS,
  SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  SAP_QUESTION_STUDIO_PACKAGE_V1,
  SAP_QUESTION_STUDIO_QLS,
  generateSapQuestionStudioQuestion,
  type GenerateSapStudioBatchInput,
  type SapStudioQlDescriptor,
  type SapStudioQuestion,
} from "./sap-question-studio-runtime-v1";

export {
  SAP_QUESTION_STUDIO_CHECKPOINTS,
  SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  SAP_QUESTION_STUDIO_PACKAGE_V1,
  SAP_QUESTION_STUDIO_QLS,
  generateSapQuestionStudioQuestion,
};
export type {
  GenerateSapStudioBatchInput,
  SapStudioCheckpointId,
  SapStudioDifficulty,
  SapStudioExamProfile,
  SapStudioQlDescriptor,
  SapStudioQlId,
  SapStudioQuestion,
} from "./sap-question-studio-runtime-v1";

function seededHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function eligibleDescriptors(input: GenerateSapStudioBatchInput): readonly SapStudioQlDescriptor[] {
  let list = SAP_QUESTION_STUDIO_QLS;
  if (input.qlId) list = list.filter((entry) => entry.qlId === input.qlId);
  if (input.checkpointId) list = list.filter((entry) => entry.checkpointId === input.checkpointId);
  if (!input.qlId) list = list.filter((entry) => entry.defaultWeight > 0);
  if (!list.length) throw new Error("No Simplification & Approximation QL matches the selected filters.");
  return list;
}

function weightedPool(list: readonly SapStudioQlDescriptor[]): readonly SapStudioQlDescriptor[] {
  const pool: SapStudioQlDescriptor[] = [];
  for (const entry of list) {
    const copies = Math.max(1, Math.round(entry.defaultWeight * 4));
    for (let index = 0; index < copies; index += 1) pool.push(entry);
  }
  return pool;
}

function generateMatchingQuestion(
  input: GenerateSapStudioBatchInput,
  list: readonly SapStudioQlDescriptor[],
  pool: readonly SapStudioQlDescriptor[],
  seed: string,
  slot: number,
): SapStudioQuestion {
  const examProfile = input.examProfile ?? "SSC";
  const maxAttempts = input.qlId ? 100 : Math.max(200, pool.length * 6);

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const descriptor = input.qlId
      ? list[0]!
      : pool[seededHash(`${seed}:slot:${slot}:pick:${attempt}`) % pool.length]!;
    const questionSeed = attempt === 0
      ? seed
      : `${seed}:slot:${slot}:difficulty-attempt:${attempt}`;
    const question = generateSapQuestionStudioQuestion(
      descriptor.qlId,
      questionSeed,
      examProfile,
      slot * 1000 + attempt,
    );
    if (!input.difficulty || question.difficultyBand === input.difficulty) return question;
  }

  const scope = input.qlId ?? input.checkpointId ?? "the selected SAP scope";
  throw new Error(
    input.difficulty
      ? `Unable to generate ${input.difficulty} questions from ${scope}; choose another difficulty or QL/checkpoint.`
      : `Unable to generate a question from ${scope}.`,
  );
}

export function generateSapQuestionStudioBatch(input: GenerateSapStudioBatchInput = {}) {
  const count = Math.max(1, Math.min(50, Math.floor(input.count ?? 5)));
  const seed = input.seed?.trim() || "sap-question-studio-batch";
  const eligible = eligibleDescriptors(input);
  const pool = weightedPool(eligible);
  const questions: SapStudioQuestion[] = [];

  for (let slot = 0; slot < count; slot += 1) {
    questions.push(generateMatchingQuestion(input, eligible, pool, seed, slot));
  }

  return Object.freeze({
    packageId: "SAP" as const,
    integrationAuthority: SAP_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    reviewOnly: true as const,
    questions: Object.freeze(questions),
  });
}
