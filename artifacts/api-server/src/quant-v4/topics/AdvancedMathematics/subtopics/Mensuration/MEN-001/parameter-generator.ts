import {
  getMen001QuestionEntries,
  getMen001QuestionEntry,
  getMen001RegistryEntry,
} from "./library";
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

function generateValues(solveMode: string, seed: string) {
  switch (solveMode) {
    case "findTriangleAreaBaseHeight": {
      const [base, height] = pick(
        [
          [12, 9],
          [16, 11],
          [18, 14],
          [24, 15],
          [28, 18],
          [30, 16],
        ] as const,
        seed,
        "base-height",
      );
      return { base, height };
    }
    case "findMissingHeightFromAreaAndBase": {
      const [base, height] = pick(
        [
          [12, 9],
          [15, 8],
          [16, 11],
          [18, 14],
          [24, 15],
          [30, 16],
        ] as const,
        seed,
        "reverse-height",
      );
      return { base, height, area: (base * height) / 2 };
    }
    case "findTriangleAreaHeron": {
      const [sideA, sideB, sideC] = pick(
        [
          [13, 14, 15],
          [5, 5, 6],
          [5, 12, 13],
          [10, 10, 12],
          [13, 13, 10],
        ] as const,
        seed,
        "heron-triple",
      );
      return { sideA, sideB, sideC };
    }
    case "findRightTriangleAreaFromLegs": {
      const [legA, legB] = pick(
        [
          [6, 8],
          [9, 12],
          [12, 16],
          [15, 20],
          [18, 24],
        ] as const,
        seed,
        "right-legs",
      );
      return { legA, legB };
    }
    case "findEquilateralTriangleArea": {
      const side = pick([4, 6, 8, 10, 12, 14] as const, seed, "equilateral-side");
      return { side };
    }
    default:
      throw new Error(`Unsupported MEN-001 solve mode: ${solveMode}`);
  }
}

export function generateMen001Parameters(
  cpId: Men001ActiveCanonicalProblemId,
  input: Men001ParameterInput = {},
): Men001Parameters {
  if (cpId !== "MEN-CP-001") {
    throw new Error(`MEN-001 runtime proof only activates MEN-CP-001; received ${cpId}.`);
  }
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(`MEN-001 runtime proof supports English only; received ${language}.`);
  }
  const seed = input.seed ?? `men-001:${Date.now()}`;
  const candidates = getMen001QuestionEntries().filter(
    (entry) =>
      entry.cpId === cpId &&
      (!input.difficultyBand || entry.difficulty === input.difficultyBand),
  );
  const entry = input.questionLanguageId
    ? getMen001QuestionEntry(input.questionLanguageId)
    : pick(candidates, seed, "question-language");
  if (entry.cpId !== cpId) {
    throw new Error(`${entry.qlId} belongs to ${entry.cpId}, not ${cpId}.`);
  }
  if (input.difficultyBand && entry.difficulty !== input.difficultyBand) {
    throw new Error(
      `${entry.qlId} has difficulty ${entry.difficulty}, not ${input.difficultyBand}.`,
    );
  }
  const registry = getMen001RegistryEntry(entry.qlId);
  const values = generateValues(entry.solveMode, seed);
  const renderVariables = Object.fromEntries(
    entry.requiredVariables.map((variable) => {
      const value = values[variable as keyof typeof values];
      if (value === undefined) {
        throw new Error(`${entry.qlId} did not generate required variable ${variable}.`);
      }
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
