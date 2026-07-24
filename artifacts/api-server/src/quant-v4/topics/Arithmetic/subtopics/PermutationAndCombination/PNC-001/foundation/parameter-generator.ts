import {
  getPnc001QuestionEntries,
  getPnc001QuestionEntry,
  getPnc001VariableRanges,
} from "./library";
import { createSeededRandom, hashSeed, pickSeeded, productExact } from "./math";
import {
  PNC_001_PACKAGE_ID,
  type Pnc001ActiveCanonicalProblemId,
  type Pnc001Difficulty,
  type Pnc001ParameterInput,
  type Pnc001Parameters,
  type Pnc001QuestionEntry,
} from "./types";

function pickValues(pool: readonly number[], count: number, random: () => number, preferDistinct: boolean): number[] {
  if (!preferDistinct || pool.length < count) return Array.from({ length: count }, () => pickSeeded(pool, random));
  const available = [...pool];
  const result: number[] = [];
  while (result.length < count) {
    const index = Math.floor(random() * available.length);
    result.push(available.splice(index, 1)[0]!);
  }
  return result;
}

function selectEntry(input: Pnc001ParameterInput, seed: string): Pnc001QuestionEntry {
  if (input.questionLanguageId) {
    const entry = getPnc001QuestionEntry(input.questionLanguageId);
    const requestedDifficulty = input.difficulty ?? input.difficultyBand;
    if (requestedDifficulty && requestedDifficulty !== entry.difficulty) {
      throw new Error(`PNC-001 QL ${entry.qlId} is ${entry.difficulty}, not ${requestedDifficulty}`);
    }
    return entry;
  }

  const difficulty = input.difficulty ?? input.difficultyBand;
  const eligible = getPnc001QuestionEntries().filter((entry) => !difficulty || entry.difficulty === difficulty);
  if (eligible.length === 0) throw new Error(`No active PNC-001 QLs for difficulty ${difficulty ?? "any"}`);
  return pickSeeded(eligible, createSeededRandom(`${seed}:ql`));
}

function buildValues(entry: Pnc001QuestionEntry, seed: string): Record<string, number> {
  const ranges = getPnc001VariableRanges();
  const pool = ranges.ranges[entry.difficulty];
  const random = createSeededRandom(`${seed}:${entry.qlId}:values`);
  const distinct = ranges.generation.preferDistinctStageCounts;

  switch (entry.solveMode) {
    case "countSequentialIndependentChoices":
    case "countMutuallyExclusiveAlternatives": {
      const stageCount = entry.requiredVariables.includes("choiceC") ? 3 : 2;
      const selected = pickValues(stageCount === 3 ? pool.threeStage : pool.twoStage, stageCount, random, distinct);
      return {
        choiceA: selected[0]!,
        choiceB: selected[1]!,
        ...(stageCount === 3 ? { choiceC: selected[2]! } : {}),
      };
    }
    case "countDisjointCasePartition": {
      const selected = pickValues(pool.twoStage, 4, random, false);
      return {
        caseAFirst: selected[0]!,
        caseARest: selected[1]!,
        caseBFirst: selected[2]!,
        caseBRest: selected[3]!,
      };
    }
    case "countUsingSimpleComplement": {
      const [choiceA, choiceB] = pickValues(pool.twoStage, 2, random, distinct);
      const total = productExact([choiceA!, choiceB!], ranges.answerCeiling);
      const invalidCandidates = pool.invalid.filter((value) => value > 0 && value < total);
      const invalidChoices = pickSeeded(invalidCandidates.length ? invalidCandidates : [1], random);
      return { choiceA: choiceA!, choiceB: choiceB!, invalidChoices };
    }
    case "recoverMissingStageChoiceCount": {
      const [knownChoices, missingChoices] = pickValues(pool.recovered, 2, random, distinct);
      const totalChoices = productExact([knownChoices!, missingChoices!], ranges.answerCeiling);
      return { knownChoices: knownChoices!, missingChoices: missingChoices!, totalChoices };
    }
    default: {
      const exhaustive: never = entry.solveMode;
      throw new Error(`Unsupported PNC-001 solve mode: ${exhaustive}`);
    }
  }
}

export function generatePnc001Parameters(input: Pnc001ParameterInput = {}): Pnc001Parameters {
  const cpId = (input.canonicalProblemId ?? input.cpId ?? "PNC-CP-001") as Pnc001ActiveCanonicalProblemId;
  if (cpId !== "PNC-CP-001") throw new Error(`PNC-001 runtime proof currently supports only PNC-CP-001; received ${cpId}`);
  const language = input.language ?? "en";
  if (language !== "en") throw new Error("PNC-001 runtime proof is English only");

  const seed = input.seed ?? `pnc-001:${input.questionLanguageId ?? input.difficulty ?? input.difficultyBand ?? "mixed"}:default`;
  const entry = selectEntry(input, seed);
  if (entry.cpId !== cpId) throw new Error(`PNC-001 QL ${entry.qlId} does not belong to ${cpId}`);
  const values = buildValues(entry, seed);
  const suffix = hashSeed(`${seed}:${entry.qlId}`).toString(16).padStart(8, "0");

  return {
    packageId: PNC_001_PACKAGE_ID,
    canonicalProblemId: cpId,
    questionLanguageId: entry.qlId,
    questionId: `${entry.qlId}-${suffix}`,
    seed,
    language: "en",
    difficulty: entry.difficulty as Pnc001Difficulty,
    taskKind: entry.taskKind,
    solveMode: entry.solveMode,
    answerType: entry.answerType,
    explanationId: entry.explanationId,
    requiredVariables: [...entry.requiredVariables],
    scenarioFamily: entry.scenarioFamily,
    constraintProfile: entry.constraintProfile,
    distractorProfile: entry.distractorProfile,
    values,
    renderVariables: Object.fromEntries(entry.requiredVariables.map((key) => [key, values[key]!])),
  };
}
