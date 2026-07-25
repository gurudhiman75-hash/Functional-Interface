import {
  createSeededRandom,
  hashSeed,
  pickSeeded,
} from "./math";
import {
  getPnc002QuestionEntries,
  getPnc002QuestionEntry,
  getPnc002VariableRanges,
} from "./library";
import type {
  Pnc002GeneratedValue,
  Pnc002ParameterInput,
  Pnc002Parameters,
  Pnc002QuestionEntry,
} from "./types";
import { PNC_002_PACKAGE_ID } from "./types";

function asState<T extends Record<string, number>>(value: T): T {
  return { ...value };
}

function forwardTogether(totalObjects: number, blockSize: number): number {
  let unitsFactorial = 1;
  for (let factor = 2; factor <= totalObjects - blockSize + 1; factor += 1) unitsFactorial *= factor;
  let internalFactorial = 1;
  for (let factor = 2; factor <= blockSize; factor += 1) internalFactorial *= factor;
  return unitsFactorial * internalFactorial;
}

function forwardApart(totalObjects: number, blockSize: number): number {
  let unrestricted = 1;
  for (let factor = 2; factor <= totalObjects; factor += 1) unrestricted *= factor;
  return unrestricted - forwardTogether(totalObjects, blockSize);
}

function buildValues(entry: Pnc002QuestionEntry, seed: string): Record<string, Pnc002GeneratedValue> {
  const ranges = getPnc002VariableRanges();
  const random = createSeededRandom(`${seed}:${entry.qlId}:parameters`);
  const pools = ranges.pools;

  switch (entry.scenarioFamily) {
    case "pairTogetherPeople":
    case "pairApartPeople":
      return { totalObjects: pickSeeded(pools.singlePairTotalObjects, random), blockSize: 2 };
    case "groupTogetherBooks":
    case "groupNotAllConsecutiveFiles":
      return asState(pickSeeded(pools.singleGroupStates, random));
    case "twoPairsTogether":
      return { totalObjects: pickSeeded(pools.twoPairTotalObjects, random), blockSizes: [2, 2] };
    case "pairAndTrioTogether":
      return { totalObjects: pickSeeded(pools.pairTrioTotalObjects, random), blockSizes: [2, 3] };
    case "threePairsTogether":
      return { totalObjects: pickSeeded(pools.threePairTotalObjects, random), blockSizes: [2, 2, 2] };
    case "twoVariableGroupsTogether": {
      const state = asState(pickSeeded(pools.twoVariableGroupStates, random));
      return { ...state, blockSizes: [state.firstBlockSize, state.secondBlockSize] };
    }
    case "blockTogetherExternalPairApart":
      return asState(pickSeeded(pools.blockExternalApartStates, random));
    case "recoverNPairTogether": {
      const solution = pickSeeded(pools.inverseN, random);
      return {
        totalObjects: solution,
        blockSize: 2,
        target: forwardTogether(solution, 2),
        searchMinimum: Math.min(...pools.inverseN),
        searchMaximum: Math.max(...pools.inverseN),
      };
    }
    case "recoverNPairApart": {
      const solution = pickSeeded(pools.inverseN, random);
      return {
        totalObjects: solution,
        blockSize: 2,
        target: forwardApart(solution, 2),
        searchMinimum: Math.min(...pools.inverseN),
        searchMaximum: Math.max(...pools.inverseN),
      };
    }
    case "recoverBlockSizeTogether": {
      const solution = pickSeeded(pools.inverseBlockSize, random);
      return {
        totalObjects: 8,
        blockSize: solution,
        target: forwardTogether(8, solution),
        searchMinimum: Math.min(...pools.inverseBlockSize),
        searchMaximum: Math.max(...pools.inverseBlockSize),
      };
    }
  }
  throw new Error(`Unsupported PNC-002 scenario family: ${entry.scenarioFamily}`);
}

function numericValue(values: Record<string, Pnc002GeneratedValue>, key: string): number {
  const value = values[key];
  if (typeof value !== "number") throw new Error(`PNC-002 render variable ${key} is not numeric`);
  return value;
}

export function generatePnc002Parameters(input: Pnc002ParameterInput = {}): Pnc002Parameters {
  const language = input.language ?? "en";
  if (language !== "en") throw new Error(`PNC-002 language ${language} is not implemented`);

  const seed = input.seed ?? "pnc-002-default-seed";
  const requestedCp = input.canonicalProblemId ?? input.cpId;
  const requestedDifficulty = input.difficulty ?? input.difficultyBand;

  let entry: Pnc002QuestionEntry;
  if (input.questionLanguageId) {
    entry = getPnc002QuestionEntry(input.questionLanguageId);
    if (requestedCp && entry.cpId !== requestedCp) throw new Error("Requested CP does not own the selected PNC-002 QL");
    if (requestedDifficulty && entry.difficulty !== requestedDifficulty) throw new Error("Requested difficulty does not match the selected PNC-002 QL");
  } else {
    const candidates = getPnc002QuestionEntries().filter((candidate) =>
      (!requestedCp || candidate.cpId === requestedCp)
      && (!requestedDifficulty || candidate.difficulty === requestedDifficulty),
    );
    if (!candidates.length) throw new Error("No active PNC-002 QL matches the requested filters");
    entry = pickSeeded(candidates, createSeededRandom(`${seed}:entry`));
  }

  const values = buildValues(entry, seed);
  const renderVariables = Object.fromEntries(
    entry.requiredVariables.map((key) => [key, numericValue(values, key)]),
  );
  const suffix = hashSeed(`${seed}:${entry.qlId}`).toString(16).padStart(8, "0");

  return {
    packageId: PNC_002_PACKAGE_ID,
    canonicalProblemId: entry.cpId,
    questionLanguageId: entry.qlId,
    questionId: `${entry.qlId}-${suffix}`,
    seed,
    language: "en",
    difficulty: entry.difficulty,
    taskKind: entry.taskKind,
    solveMode: entry.solveMode,
    answerType: entry.answerType,
    explanationId: entry.explanationId,
    requiredVariables: [...entry.requiredVariables],
    scenarioFamily: entry.scenarioFamily,
    constraintProfile: entry.constraintProfile,
    distractorProfile: entry.distractorProfile,
    values,
    renderVariables,
  };
}
