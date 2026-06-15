import variableRanges from "./variable-ranges.library.json" assert { type: "json" };
import { getAnswerType, getCommonQuestionLanguageIds, getExplanationId, getQuestionEntry, getRequiredVariables, getTaskKind } from "./library";
import { stableBucket } from "./math";
import { PCT_001_ARCHETYPE_ID, PCT_001_CP_IDS, type Pct001CanonicalProblemId, type Pct001DifficultyBand, type Pct001Language, type Pct001Parameters, type Pct001TaskKind, type Pct001Variables } from "./types";

type RangeKey = keyof typeof variableRanges.variables;

export interface Pct001ParameterInput {
  seed?: string;
  language?: Pct001Language;
  questionLanguageId?: string;
  difficultyBand?: Pct001DifficultyBand;
}

function pick<T>(items: readonly T[], seed: string): T {
  return items[stableBucket(seed, items.length)]!;
}

function rangeValue(name: RangeKey, difficulty: Pct001DifficultyBand, seed: string) {
  const entry = variableRanges.variables[name] as Record<string, number[]>;
  const values = entry[difficulty.toLowerCase()] ?? entry.medium ?? entry.easy ?? entry.hard ?? [10];
  return pick(values, seed);
}

function variableDomain(name: string, difficulty: Pct001DifficultyBand, seed: string) {
  if (name in variableRanges.variables) return rangeValue(name as RangeKey, difficulty, seed);
  const domains: Record<string, readonly number[]> = {
    value: [120, 200, 300, 450, 600, 800, 1200, 2400, 6000],
    value1: [100, 150, 200, 250, 300, 400, 500, 600],
    rate1: [10, 15, 20, 25, 30, 40, 45, 50, 60, 80],
    rate2: [10, 15, 20, 25, 30, 40, 50, 60],
    rate3: [10, 15, 20, 25],
    newRate: [10, 20, 25, 40, 50, 60, 75],
    passRate: [30, 33, 35, 40, 50],
    marksObtained: [120, 135, 150, 180, 210, 240],
    failMargin: [5, 10, 15, 20, 25],
    marks: [120, 150, 180, 240, 300],
    totalPopulation: [1000, 2000, 5000, 8000, 12000],
    totalWeight: [40, 50, 80, 100, 120],
    totalQuantity: [50, 80, 100, 120, 150],
    waterRate: [75, 80, 85, 90],
    dryWaterRate: [10, 15, 20, 25],
  };
  return pick(domains[name] ?? [10, 20, 25, 40, 50, 100], seed);
}

function buildRequiredVariables(requiredVariables: readonly string[], difficulty: Pct001DifficultyBand, seed: string): Pct001Variables {
  return Object.fromEntries(requiredVariables.map((name) => [name, variableDomain(name, difficulty, `${seed}:${name}`)]));
}

function chooseGreaterThan(name: string, threshold: number, difficulty: Pct001DifficultyBand, seed: string) {
  const values = Array.from({ length: 80 }, (_value, index) => variableDomain(name, difficulty, `${seed}:${index}`)).filter((value) => Number(value) > threshold && Number(value) < 100);
  return Number(pick(values.length ? values : [threshold + 10], `${seed}:gt`));
}

function chooseLessThan(name: string, threshold: number, difficulty: Pct001DifficultyBand, seed: string) {
  const values = Array.from({ length: 80 }, (_value, index) => variableDomain(name, difficulty, `${seed}:${index}`)).filter((value) => Number(value) > 0 && Number(value) < threshold);
  return Number(pick(values.length ? values : [Math.max(5, threshold / 2)], `${seed}:lt`));
}

function constrainVariables(taskKind: Pct001TaskKind, variables: Pct001Variables, difficulty: Pct001DifficultyBand, seed: string): Pct001Variables {
  const output = { ...variables };
  if (taskKind === "winnerVotes") output.percentageRate = chooseGreaterThan("percentageRate", 50, difficulty, `${seed}:winner`);
  if (taskKind === "cancelledVotes") output.rate2 = chooseGreaterThan("rate2", 50, difficulty, `${seed}:cancelled`);
  if (taskKind === "loserVotes") output.rate1 = chooseLessThan("rate1", 50, difficulty, `${seed}:loser`);
  if (taskKind === "incomePartition") {
    output.rate1 = chooseLessThan("rate1", 40, difficulty, `${seed}:income1`);
    output.rate2 = chooseLessThan("rate2", 35, difficulty, `${seed}:income2`);
    output.rate3 = chooseLessThan("rate3", 25, difficulty, `${seed}:income3`);
  }
  if (taskKind === "twoShareRemainder") {
    output.rate1 = chooseLessThan("rate1", 45, difficulty, `${seed}:share1`);
    output.rate2 = chooseLessThan("rate2", 40, difficulty, `${seed}:share2`);
  }
  if (taskKind === "dryFromFresh") {
    output.waterRate = chooseGreaterThan("waterRate", 50, difficulty, `${seed}:fresh`);
    output.dryWaterRate = chooseLessThan("dryWaterRate", Number(output.waterRate), difficulty, `${seed}:dry`);
  }
  if (taskKind === "freshFromDry") {
    output.rate1 = chooseGreaterThan("rate1", 50, difficulty, `${seed}:fresh`);
    output.rate2 = chooseLessThan("rate2", Number(output.rate1), difficulty, `${seed}:dry`);
  }
  if (taskKind === "dilutionAddWater") {
    output.newRate = chooseLessThan("newRate", Number(output.percentageRate), difficulty, `${seed}:dilute`);
  }
  if (taskKind === "addSolute" || taskKind === "addPureComponent" || taskKind === "evaporationOriginal") {
    output.newRate = chooseGreaterThan("newRate", Number(output.percentageRate), difficulty, `${seed}:strengthen`);
  }
  return output;
}

export function selectQuestionLanguageId(cpId: Pct001CanonicalProblemId, language: Pct001Language, seed: string) {
  const ids = getCommonQuestionLanguageIds(cpId);
  return ids[stableBucket(seed, ids.length)]!;
}

export function generatePct001Parameters(cpId: Pct001CanonicalProblemId, input: Pct001ParameterInput = {}): Pct001Parameters {
  const language = input.language ?? "en";
  const seed = input.seed ?? `PCT-001:${cpId}`;
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(cpId, language, `${seed}:ql`);
  const questionEntry = getQuestionEntry(cpId, questionLanguageId, "en");
  const difficultyBand = input.difficultyBand ?? questionEntry.difficulty;
  const taskKind = getTaskKind(cpId, questionLanguageId);
  const answerType = getAnswerType(cpId, questionLanguageId);
  const requiredVariables = getRequiredVariables(cpId, questionLanguageId);
  const variables = constrainVariables(taskKind, buildRequiredVariables(requiredVariables, difficultyBand, seed), difficultyBand, seed);

  return {
    archetypeId: PCT_001_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${questionLanguageId}:${stableBucket(seed, 100000)}`,
    questionLanguageId,
    explanationId: getExplanationId(cpId),
    language,
    difficultyBand,
    taskKind,
    answerType,
    requiredVariables,
    variables,
    sourceTrace: {
      questionLanguageSource: `question-language.${language}.json`,
      explanationSource: `explanation.${language}.json`,
      variableRangeSource: "variable-ranges.library.json",
    },
  };
}

export function getPct001ActiveCanonicalProblemIds() {
  return [...PCT_001_CP_IDS] as Pct001CanonicalProblemId[];
}
