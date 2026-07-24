import {
  getMen001QuestionEntries,
  getMen001QuestionEntry,
  getMen001RegistryEntry,
} from "./library";
import { getMen001SolveModeDefinition } from "./solve-mode-registry.all";
import {
  MEN_001_PACKAGE_ID,
  type Men001ActiveCanonicalProblemId,
  type Men001Difficulty,
  type Men001Parameters,
} from "./types";

export interface Men001ParameterInput {
  language?: "en" | "hi" | "pa";
  difficultyBand?: Men001Difficulty;
  questionLanguageId?: string;
  seed?: string;
}

function seedHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick<T>(values: readonly T[], seed: string, salt: string) {
  if (values.length === 0) throw new Error(`MEN-001 cannot pick from an empty list: ${salt}`);
  return values[seedHash(`${seed}:${salt}`) % values.length]!;
}

export function generateMen001Parameters(
  cpId: Men001ActiveCanonicalProblemId,
  input: Men001ParameterInput = {},
): Men001Parameters {
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(`MEN-001 runtime proof supports English only; received ${language}.`);
  }

  const seed = input.seed ?? `men-001:${Date.now()}`;
  const candidates = getMen001QuestionEntries().filter(
    (entry) => entry.cpId === cpId && (!input.difficultyBand || entry.difficulty === input.difficultyBand),
  );
  if (candidates.length === 0) {
    throw new Error(`MEN-001 has no active QLs for ${cpId}${input.difficultyBand ? ` at ${input.difficultyBand}` : ""}.`);
  }

  const entry = input.questionLanguageId
    ? getMen001QuestionEntry(input.questionLanguageId)
    : pick(candidates, seed, "question-language");
  if (entry.cpId !== cpId) throw new Error(`${entry.qlId} belongs to ${entry.cpId}, not ${cpId}.`);
  if (input.difficultyBand && entry.difficulty !== input.difficultyBand) {
    throw new Error(`${entry.qlId} has difficulty ${entry.difficulty}, not ${input.difficultyBand}.`);
  }

  const registry = getMen001RegistryEntry(entry.qlId);
  const definition = getMen001SolveModeDefinition(entry.solveMode);
  const values = definition.generateValues(seed);
  const renderVariables = Object.fromEntries(
    entry.requiredVariables.map((variable) => {
      const value = values[variable as keyof typeof values];
      if (value === undefined) throw new Error(`${entry.qlId} did not generate required variable ${variable}.`);
      return [variable, value];
    }),
  );

  return {
    packageId: MEN_001_PACKAGE_ID,
    canonicalProblemId: cpId,
    questionId: `${MEN_001_PACKAGE_ID}:${entry.qlId}:${seedHash(seed).toString(16)}`,
    questionLanguageId: entry.qlId,
    language,
    difficulty: entry.difficulty,
    taskKind: registry.taskKind,
    solveMode: entry.solveMode,
    answerDimension: entry.answerDimension,
    unitPolicy: entry.unitPolicy,
    seed,
    values,
    renderVariables,
  };
}
