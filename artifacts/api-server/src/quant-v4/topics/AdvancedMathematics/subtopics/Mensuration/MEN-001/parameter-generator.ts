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
  type Men001SolveMode,
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

const BASE_HEIGHT_STATES = [
  [12, 9], [16, 11], [18, 14], [24, 15],
  [28, 18], [30, 16], [32, 21], [36, 25],
] as const;

const HERON_STATES = [
  [13, 14, 15], [5, 5, 6], [5, 12, 13], [10, 10, 12],
  [13, 13, 10], [6, 8, 10], [15, 20, 25],
] as const;

const RIGHT_TRIANGLE_STATES = [
  [6, 8], [9, 12], [12, 16], [15, 20], [18, 24], [21, 28],
] as const;

const ISOSCELES_STATES = [
  [5, 6, 4], [10, 12, 8], [13, 10, 12],
  [17, 16, 15], [25, 14, 24], [25, 30, 20],
] as const;

const RATIO_STATES = [
  [3, 4, 5], [5, 5, 6], [5, 12, 13], [13, 14, 15],
] as const;

function ratioState(seed: string) {
  const [ratioA, ratioB, ratioC] = pick(RATIO_STATES, seed, "ratio-state");
  const scale = pick([2, 3, 4, 5, 6] as const, seed, "ratio-scale");
  const sideA = ratioA * scale;
  const sideB = ratioB * scale;
  const sideC = ratioC * scale;
  return {
    ratioA,
    ratioB,
    ratioC,
    scale,
    sideA,
    sideB,
    sideC,
    perimeter: sideA + sideB + sideC,
  };
}

function generateValues(solveMode: Men001SolveMode, seed: string): Men001Parameters["values"] {
  switch (solveMode) {
    case "findTriangleAreaBaseHeight": {
      const [base, height] = pick(BASE_HEIGHT_STATES, seed, "base-height");
      return { base, height, area: (base * height) / 2 };
    }
    case "findMissingHeightFromAreaAndBase": {
      const [base, height] = pick(BASE_HEIGHT_STATES, seed, "reverse-height");
      return { base, height, area: (base * height) / 2 };
    }
    case "findMissingBaseFromAreaAndHeight": {
      const [base, height] = pick(BASE_HEIGHT_STATES, seed, "reverse-base");
      return { base, height, area: (base * height) / 2 };
    }
    case "findTriangleAreaHeron": {
      const [sideA, sideB, sideC] = pick(HERON_STATES, seed, "heron-triple");
      return { sideA, sideB, sideC };
    }
    case "findRightTriangleAreaFromLegs": {
      const [legA, legB] = pick(RIGHT_TRIANGLE_STATES, seed, "right-legs");
      return { legA, legB, area: (legA * legB) / 2 };
    }
    case "findEquilateralTriangleArea": {
      const side = pick([4, 6, 8, 10, 12, 14, 16, 18] as const, seed, "equilateral-side");
      return { side, areaCoefficient: (side * side) / 4, perimeter: 3 * side };
    }
    case "findEquilateralPerimeterFromArea": {
      const side = pick([6, 8, 10, 12, 14, 16, 18] as const, seed, "equilateral-reverse-area");
      return { side, areaCoefficient: (side * side) / 4, perimeter: 3 * side };
    }
    case "findEquilateralSideFromPerimeter": {
      const side = pick([6, 8, 10, 12, 14, 16, 18, 20] as const, seed, "equilateral-perimeter");
      return { side, perimeter: 3 * side };
    }
    case "findIsoscelesTriangleArea":
    case "findIsoscelesHeight": {
      const [equalSide, base, height] = pick(ISOSCELES_STATES, seed, "isosceles-state");
      return { equalSide, base, height, area: (base * height) / 2 };
    }
    case "findTriangleAreaFromSideRatioAndPerimeter":
    case "findLargestTriangleSideFromRatioAndPerimeter":
    case "findSmallestTriangleSideFromRatioAndPerimeter":
      return ratioState(seed);
    case "findTriangularPlotCost": {
      const [base, height] = pick(BASE_HEIGHT_STATES, seed, "cost-base-height");
      const ratePerSquareMetre = pick([12, 15, 18, 20, 25, 30, 40, 50] as const, seed, "cost-rate");
      const area = (base * height) / 2;
      return { base, height, area, ratePerSquareMetre, cost: area * ratePerSquareMetre };
    }
  }
}

export function generateMen001Parameters(
  cpId: Men001ActiveCanonicalProblemId,
  input: Men001ParameterInput = {},
): Men001Parameters {
  if (cpId !== "MEN-CP-001") {
    throw new Error(`MEN-001 currently activates only MEN-CP-001; received ${cpId}.`);
  }
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(`MEN-001 runtime proof supports English only; received ${language}.`);
  }
  const seed = input.seed ?? `men-001:${Date.now()}`;
  const candidates = getMen001QuestionEntries().filter(
    (entry) => entry.cpId === cpId && (!input.difficultyBand || entry.difficulty === input.difficultyBand),
  );
  const entry = input.questionLanguageId
    ? getMen001QuestionEntry(input.questionLanguageId)
    : pick(candidates, seed, "question-language");
  if (entry.cpId !== cpId) throw new Error(`${entry.qlId} belongs to ${entry.cpId}, not ${cpId}.`);
  if (input.difficultyBand && entry.difficulty !== input.difficultyBand) {
    throw new Error(`${entry.qlId} has difficulty ${entry.difficulty}, not ${input.difficultyBand}.`);
  }
  const registry = getMen001RegistryEntry(entry.qlId);
  const values = generateValues(entry.solveMode, seed);
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
