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
import { buildPnc002Cp008Values } from "./parameter-generator-cp008";
import {
  buildPnc002Cp008SaturationValues,
  isPnc002Cp008SaturationScenario,
} from "./parameter-generator-cp008-saturation";
import type {
  Pnc002GeneratedValue,
  Pnc002ParameterInput,
  Pnc002AnyParameters,
  Pnc002QuestionEntry,
} from "./types";
import { PNC_002_PACKAGE_ID } from "./types";

function asState<T extends Record<string, number>>(value: T): T { return { ...value }; }
function factorial(argument: number): number { let result = 1; for (let factor = 2; factor <= argument; factor += 1) result *= factor; return result; }
function forwardTogether(totalObjects: number, blockSize: number): number { return factorial(totalObjects - blockSize + 1) * factorial(blockSize); }
function forwardApart(totalObjects: number, blockSize: number): number { return factorial(totalObjects) - forwardTogether(totalObjects, blockSize); }
function forwardSeparatedPairBlocks(totalObjects: number): number {
  const unitCount = totalObjects - 2;
  return (factorial(unitCount) - 2 * factorial(unitCount - 1)) * 4;
}

function buildCp007Values(entry: Pnc002QuestionEntry, seed: string): Record<string, Pnc002GeneratedValue> {
  const ranges = getPnc002VariableRanges();
  const random = createSeededRandom(`${seed}:${entry.qlId}:parameters`);
  const pools = ranges.pools;
  switch (entry.scenarioFamily) {
    case "pairTogetherPeople":
    case "pairApartPeople": return { totalObjects: pickSeeded(pools.singlePairTotalObjects, random), blockSize: 2 };
    case "groupTogetherBooks":
    case "groupNotAllConsecutiveFiles": return asState(pickSeeded(pools.singleGroupStates, random));
    case "twoPairsTogether": return { totalObjects: pickSeeded(pools.twoPairTotalObjects, random), blockSizes: [2, 2] };
    case "pairAndTrioTogether": return { totalObjects: pickSeeded(pools.pairTrioTotalObjects, random), blockSizes: [2, 3] };
    case "threePairsTogether": return { totalObjects: pickSeeded(pools.threePairTotalObjects, random), blockSizes: [2, 2, 2] };
    case "twoVariableGroupsTogether": {
      const state = asState(pickSeeded(pools.twoVariableGroupStates, random));
      return { ...state, blockSizes: [state.firstBlockSize, state.secondBlockSize] };
    }
    case "blockTogetherExternalPairApart": return asState(pickSeeded(pools.blockExternalApartStates, random));
    case "twoPairsTogetherBlocksSeparated": return { totalObjects: pickSeeded(pools.separatedTwoPairTotalObjects, random), blockSizes: [2, 2] };
    case "pairTrioTogetherBlocksSeparated": return { totalObjects: pickSeeded(pools.separatedPairTrioTotalObjects, random), blockSizes: [2, 3] };
    case "blockTogetherOutsiderNotAdjacent": return asState(pickSeeded(pools.blockOutsiderStates, random));
    case "pairTogetherTrioBroken": return { totalObjects: pickSeeded(pools.pairTogetherTrioBrokenTotalObjects, random), blockSizes: [2, 3] };
    case "atLeastOnePairBroken": return { totalObjects: pickSeeded(pools.atLeastOnePairBrokenTotalObjects, random), blockSizes: [2, 2] };
    case "recoverNPairTogether": {
      const solution = pickSeeded(pools.inverseN, random);
      return { totalObjects: solution, blockSize: 2, target: forwardTogether(solution, 2), searchMinimum: Math.min(...pools.inverseN), searchMaximum: Math.max(...pools.inverseN) };
    }
    case "recoverNPairApart": {
      const solution = pickSeeded(pools.inverseN, random);
      return { totalObjects: solution, blockSize: 2, target: forwardApart(solution, 2), searchMinimum: Math.min(...pools.inverseN), searchMaximum: Math.max(...pools.inverseN) };
    }
    case "recoverBlockSizeTogether": {
      const solution = pickSeeded(pools.inverseBlockSize, random);
      return { totalObjects: 8, blockSize: solution, target: forwardTogether(8, solution), searchMinimum: Math.min(...pools.inverseBlockSize), searchMaximum: Math.max(...pools.inverseBlockSize) };
    }
    case "recoverNSeparatedPairBlocks": {
      const solution = pickSeeded(pools.inverseSeparatedN, random);
      return { totalObjects: solution, blockSizes: [2, 2], target: forwardSeparatedPairBlocks(solution), searchMinimum: Math.min(...pools.inverseSeparatedN), searchMaximum: Math.max(...pools.inverseSeparatedN) };
    }
  }
  throw new Error(`Unsupported PNC-002 CP-007 scenario family: ${entry.scenarioFamily}`);
}

function numericValue(values: Record<string, Pnc002GeneratedValue>, key: string): number {
  const value = values[key];
  if (typeof value !== "number") throw new Error(`PNC-002 render variable ${key} is not numeric`);
  return value;
}

export function generatePnc002Parameters(input: Pnc002ParameterInput = {}): Pnc002AnyParameters {
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
      (!requestedCp || candidate.cpId === requestedCp) && (!requestedDifficulty || candidate.difficulty === requestedDifficulty),
    );
    if (!candidates.length) throw new Error("No active PNC-002 QL matches the requested filters");
    entry = pickSeeded(candidates, createSeededRandom(`${seed}:entry`));
  }
  const values = isPnc002Cp008SaturationScenario(entry)
    ? buildPnc002Cp008SaturationValues(entry, seed)
    : entry.cpId === "PNC-CP-008"
      ? buildPnc002Cp008Values(entry, seed)
      : buildCp007Values(entry, seed);
  const renderVariables = Object.fromEntries(entry.requiredVariables.map((key) => [key, numericValue(values, key)]));
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
