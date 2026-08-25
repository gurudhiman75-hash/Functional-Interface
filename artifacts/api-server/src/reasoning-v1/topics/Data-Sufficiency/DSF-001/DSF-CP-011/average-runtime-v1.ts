import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import { solveAvg001 } from "../../../../../quant-v4/topics/Arithmetic/subtopics/Average/AVG-001/foundation/solver.ts";
import { rational } from "../../../../../quant-v4/topics/Arithmetic/subtopics/Average/AVG-001/foundation/math.ts";
import type { Avg001Parameters } from "../../../../../quant-v4/topics/Arithmetic/subtopics/Average/AVG-001/foundation/types.ts";

export const DSF_CP011_AVERAGE_RUNTIME_VERSION = "DSF_CP011_AVERAGE_RUNTIME_V1" as const;
export const DSF_CP011_AVERAGE_SOLVE_MODES = [
  "DSF-SM-AVG-TOTAL-FROM-GROUP",
  "DSF-SM-AVG-AVERAGE-FROM-GROUP",
] as const;

export type DsfCp011AverageSolveMode = (typeof DSF_CP011_AVERAGE_SOLVE_MODES)[number];
export type DsfCp011AverageDifficulty = "Easy" | "Medium" | "Hard";
export type DsfCp011AverageTargetKind = "TOTAL" | "AVERAGE";

type AverageContextId =
  | "CLASS_MARKS"
  | "CRICKET_INNINGS"
  | "PARCEL_WEIGHT"
  | "DAILY_SALES"
  | "WORKER_WAGES"
  | "BOOKS_PER_SHELF";

type StatementFamily =
  | "COUNT_EXACT"
  | "AVERAGE_EXACT"
  | "TOTAL_EXACT"
  | "COUNT_AVERAGE_PAIR"
  | "COUNT_TOTAL_PAIR"
  | "COUNT_BOUND"
  | "AVERAGE_BOUND"
  | "TOTAL_BOUND"
  | "PARITY";

interface AverageContext {
  readonly id: AverageContextId;
  readonly countNoun: string;
  readonly averageNoun: string;
  readonly totalNoun: string;
  readonly intro: readonly string[];
}

interface AverageWorld {
  readonly count: number;
  readonly average: number;
  readonly total: number;
}

interface AverageProblem {
  readonly anchor: AverageWorld;
  readonly targetKind: DsfCp011AverageTargetKind;
  readonly solveMode: DsfCp011AverageSolveMode;
  readonly context: AverageContext;
  readonly surfaceVariant: number;
}

interface AverageStatement {
  readonly id: string;
  readonly family: StatementFamily;
  readonly complexity: 1 | 2 | 3;
  readonly text: string;
  readonly test: (world: AverageWorld) => boolean;
}

interface SynthesizedAveragePair {
  readonly statementI: AverageStatement;
  readonly statementII: AverageStatement;
  readonly evaluation: TwoStatementSufficiencyEvaluation<string>;
  readonly qualityScore: number;
}

const CONTEXTS: readonly AverageContext[] = [
  {
    id: "CLASS_MARKS",
    countNoun: "students",
    averageNoun: "average mark",
    totalNoun: "total marks scored by the class",
    intro: [
      "A class has a number of students whose marks are being considered.",
      "The marks obtained by all students in a class are under consideration.",
      "Consider the marks of the students in one class.",
      "A teacher is analysing the marks of a class.",
    ],
  },
  {
    id: "CRICKET_INNINGS",
    countNoun: "innings",
    averageNoun: "batting average",
    totalNoun: "total runs scored",
    intro: [
      "A batter has completed a number of innings.",
      "Consider a batter's scores over several completed innings.",
      "A player's batting record over some innings is being examined.",
      "A batter's aggregate and average are to be analysed.",
    ],
  },
  {
    id: "PARCEL_WEIGHT",
    countNoun: "parcels",
    averageNoun: "average weight per parcel",
    totalNoun: "combined weight of the parcels",
    intro: [
      "A consignment contains several parcels.",
      "Several parcels form one consignment.",
      "Consider a consignment made up of a number of parcels.",
      "The weights of the parcels in a consignment are being checked.",
    ],
  },
  {
    id: "DAILY_SALES",
    countNoun: "days",
    averageNoun: "average daily sales",
    totalNoun: "total sales over the period",
    intro: [
      "A shop's sales are recorded over a number of days.",
      "Consider the sales made by a shop during several days.",
      "A sales record covers a number of consecutive days.",
      "The shopkeeper is reviewing sales for a period of several days.",
    ],
  },
  {
    id: "WORKER_WAGES",
    countNoun: "workers",
    averageNoun: "average wage per worker",
    totalNoun: "total wage bill",
    intro: [
      "A team of workers is paid for a day's work.",
      "Consider the wages paid to a group of workers.",
      "A contractor has a group of workers on the payroll for a day.",
      "The daily wage bill for a group of workers is being examined.",
    ],
  },
  {
    id: "BOOKS_PER_SHELF",
    countNoun: "shelves",
    averageNoun: "average number of books per shelf",
    totalNoun: "total number of books",
    intro: [
      "Books are arranged on a number of shelves.",
      "A library section contains books spread across several shelves.",
      "Consider a set of shelves containing books.",
      "A librarian is checking the distribution of books across shelves.",
    ],
  },
] as const;

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  const text = `${DSF_CP011_AVERAGE_RUNTIME_VERSION}:${seed}:${salt}`;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: number, salt: string): () => number {
  let state = hashSeed(seed, salt) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function pick<T>(random: () => number, values: readonly T[]): T {
  return values[Math.floor(random() * values.length)]!;
}

function desiredClass(seed: number): SufficiencyClass {
  return SUFFICIENCY_CLASSES[hashSeed(seed, "semantic-class") % SUFFICIENCY_CLASSES.length]!;
}

function makeSourceParameters(world: AverageWorld, targetKind: DsfCp011AverageTargetKind): Avg001Parameters {
  return {
    packageId: "AVG-001",
    canonicalProblemId: "AVG-CP-001",
    questionLanguageId: "AVG-DSF-CP011-SOURCE-REUSE",
    seed: `${world.count}:${world.average}:${targetKind}`,
    language: "en",
    difficulty: "Medium",
    taskKind: "sumCountMappingApplication",
    solveMode: targetKind === "TOTAL" ? "findSumFromAverageAndCount" : "findAverageFromSumAndCount",
    answerType: targetKind === "TOTAL" ? "ABSOLUTE" : "AVERAGE",
    displayPolicy: "EXACT_INTEGER",
    contextDomain: "DATA_SUFFICIENCY_SOURCE_REUSE",
    scenarioVariant: "DSF_CP011",
    values: {
      count: world.count,
      average: rational(world.average),
      total: rational(world.total),
    },
    renderVariables: {},
  };
}

function sourceAnswer(world: AverageWorld, targetKind: DsfCp011AverageTargetKind): string {
  return solveAvg001(makeSourceParameters(world, targetKind)).answer;
}

function enumerateWorlds(): readonly AverageWorld[] {
  const worlds: AverageWorld[] = [];
  for (let count = 3; count <= 12; count += 1) {
    for (let average = 12; average <= 40; average += 2) {
      worlds.push({ count, average, total: count * average });
    }
  }
  return worlds;
}

const BASE_WORLDS = enumerateWorlds();

const adapter = {
  adapterId: "DSF-ADAPTER-AVG-001-CP011-V1",
  domainFamily: "QUANT" as const,
  sourceChapterId: "AVG-001",
  enumerateBaseWorlds(_problem: AverageProblem): readonly AverageWorld[] {
    return BASE_WORLDS;
  },
  statementHolds(_problem: AverageProblem, world: AverageWorld, statement: AverageStatement): boolean {
    return statement.test(world);
  },
  evaluateTarget(problem: AverageProblem, world: AverageWorld): string {
    return sourceAnswer(world, problem.targetKind);
  },
  normalizeAnswer(answer: string): string {
    return answer;
  },
};

function buildProblem(seed: number, attempt = 0): AverageProblem {
  const random = createRng(seed + attempt * 7919, "problem");
  const count = 4 + Math.floor(random() * 8);
  const average = 14 + 2 * Math.floor(random() * 13);
  const targetKind: DsfCp011AverageTargetKind = random() < 0.52 ? "TOTAL" : "AVERAGE";
  const context = pick(random, CONTEXTS);
  const surfaceVariant = Math.floor(random() * context.intro.length);
  return {
    anchor: { count, average, total: count * average },
    targetKind,
    solveMode: targetKind === "TOTAL" ? "DSF-SM-AVG-TOTAL-FROM-GROUP" : "DSF-SM-AVG-AVERAGE-FROM-GROUP",
    context,
    surfaceVariant,
  };
}

function buildStatementPool(problem: AverageProblem): readonly AverageStatement[] {
  const { anchor, context } = problem;
  const countLow = Math.max(2, anchor.count - 2);
  const countHigh = Math.min(13, anchor.count + 2);
  const averageLow = anchor.average - 4;
  const averageHigh = anchor.average + 4;
  const totalWindow = Math.max(12, anchor.count * 4);

  return [
    {
      id: `COUNT_EQ_${anchor.count}`,
      family: "COUNT_EXACT",
      complexity: 1,
      text: `There are exactly ${anchor.count} ${context.countNoun}.`,
      test: (world) => world.count === anchor.count,
    },
    {
      id: `AVERAGE_EQ_${anchor.average}`,
      family: "AVERAGE_EXACT",
      complexity: 1,
      text: `The ${context.averageNoun} is ${anchor.average}.`,
      test: (world) => world.average === anchor.average,
    },
    {
      id: `TOTAL_EQ_${anchor.total}`,
      family: "TOTAL_EXACT",
      complexity: 1,
      text: `The ${context.totalNoun} is ${anchor.total}.`,
      test: (world) => world.total === anchor.total,
    },
    {
      id: `COUNT_AVERAGE_PAIR_${anchor.count}_${anchor.average}`,
      family: "COUNT_AVERAGE_PAIR",
      complexity: 2,
      text: `There are ${anchor.count} ${context.countNoun}, and the ${context.averageNoun} is ${anchor.average}.`,
      test: (world) => world.count === anchor.count && world.average === anchor.average,
    },
    {
      id: `COUNT_TOTAL_PAIR_${anchor.count}_${anchor.total}`,
      family: "COUNT_TOTAL_PAIR",
      complexity: 2,
      text: `There are ${anchor.count} ${context.countNoun}, and the ${context.totalNoun} is ${anchor.total}.`,
      test: (world) => world.count === anchor.count && world.total === anchor.total,
    },
    {
      id: `COUNT_GT_${countLow}`,
      family: "COUNT_BOUND",
      complexity: 2,
      text: `The number of ${context.countNoun} is greater than ${countLow}.`,
      test: (world) => world.count > countLow,
    },
    {
      id: `COUNT_LT_${countHigh}`,
      family: "COUNT_BOUND",
      complexity: 2,
      text: `The number of ${context.countNoun} is less than ${countHigh}.`,
      test: (world) => world.count < countHigh,
    },
    {
      id: `AVERAGE_GT_${averageLow}`,
      family: "AVERAGE_BOUND",
      complexity: 2,
      text: `The ${context.averageNoun} is greater than ${averageLow}.`,
      test: (world) => world.average > averageLow,
    },
    {
      id: `AVERAGE_LT_${averageHigh}`,
      family: "AVERAGE_BOUND",
      complexity: 2,
      text: `The ${context.averageNoun} is less than ${averageHigh}.`,
      test: (world) => world.average < averageHigh,
    },
    {
      id: `TOTAL_GT_${anchor.total - totalWindow}`,
      family: "TOTAL_BOUND",
      complexity: 3,
      text: `The ${context.totalNoun} is greater than ${anchor.total - totalWindow}.`,
      test: (world) => world.total > anchor.total - totalWindow,
    },
    {
      id: `TOTAL_LT_${anchor.total + totalWindow}`,
      family: "TOTAL_BOUND",
      complexity: 3,
      text: `The ${context.totalNoun} is less than ${anchor.total + totalWindow}.`,
      test: (world) => world.total < anchor.total + totalWindow,
    },
    {
      id: `COUNT_${anchor.count % 2 === 0 ? "EVEN" : "ODD"}`,
      family: "PARITY",
      complexity: 2,
      text: `The number of ${context.countNoun} is ${anchor.count % 2 === 0 ? "even" : "odd"}.`,
      test: (world) => world.count % 2 === anchor.count % 2,
    },
  ];
}

function survivors(statement: AverageStatement): readonly AverageWorld[] {
  return BASE_WORLDS.filter(statement.test);
}

function pairQuality(first: AverageStatement, second: AverageStatement, evaluation: TwoStatementSufficiencyEvaluation<string>): number {
  const familyBonus = first.family === second.family ? -4 : 5;
  const conjunctionBonus = evaluation.classification === "BOTH_TOGETHER_ONLY" ? 8 : 0;
  const insufficientBonus = evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER" ? 3 : 0;
  const breadth = Math.min(survivors(first).length, 40) + Math.min(survivors(second).length, 40);
  return familyBonus + conjunctionBonus + insufficientBonus + Math.floor(breadth / 20) - first.complexity - second.complexity;
}

function synthesizePair(problem: AverageProblem, seed: number, targetClass: SufficiencyClass): SynthesizedAveragePair {
  const statements = buildStatementPool(problem);
  const candidates: SynthesizedAveragePair[] = [];
  for (const statementI of statements) {
    for (const statementII of statements) {
      if (statementI.id === statementII.id) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
        if (evaluation.classification !== targetClass) continue;
        candidates.push({
          statementI,
          statementII,
          evaluation,
          qualityScore: pairQuality(statementI, statementII, evaluation),
        });
      } catch {
        // Empty conjunctions and other DSF invariant failures are generation rejects.
      }
    }
  }
  if (candidates.length === 0) throw new Error(`No AVG-001 pair for ${targetClass}/${problem.targetKind}`);
  const best = Math.max(...candidates.map((candidate) => candidate.qualityScore));
  const shortlist = candidates.filter((candidate) => candidate.qualityScore >= best - 2);
  return pick(createRng(seed, `pair:${targetClass}:${problem.targetKind}`), shortlist);
}

function targetPrompt(problem: AverageProblem): string {
  if (problem.targetKind === "TOTAL") return `What is the ${problem.context.totalNoun}?`;
  return `What is the ${problem.context.averageNoun}?`;
}

function explanationForStatement(label: string, targetAnswers: readonly string[], sufficient: boolean): string {
  if (sufficient) {
    return `${label} fixes the asked value at ${targetAnswers[0]}. Therefore, ${label} alone is sufficient.`;
  }
  const examples = targetAnswers.slice(0, 2);
  if (examples.length >= 2) {
    return `${label} permits at least two different answers, ${examples[0]} and ${examples[1]}. Therefore, ${label} alone is not sufficient.`;
  }
  return `${label} does not fix a unique answer. Therefore, ${label} alone is not sufficient.`;
}

function difficultyFor(pair: SynthesizedAveragePair): DsfCp011AverageDifficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  if (pair.statementI.complexity === 1 && pair.statementII.complexity === 1) return "Easy";
  return "Medium";
}

function generationIdentity(seed: number, problem: AverageProblem, pair: SynthesizedAveragePair): string {
  return createHash("sha256")
    .update(`${DSF_CP011_AVERAGE_RUNTIME_VERSION}|${seed}|${problem.context.id}|${problem.targetKind}|${pair.statementI.id}|${pair.statementII.id}`)
    .digest("hex")
    .slice(0, 24);
}

export function normalizeDsfCp011Surface(text: string): string {
  return text
    .toLowerCase()
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/[^a-z#]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function generateDsfCp011AverageQuestion(seed: number) {
  const targetClass = desiredClass(seed);
  let problem: AverageProblem | undefined;
  let pair: SynthesizedAveragePair | undefined;
  let lastError: unknown;
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const candidateProblem = buildProblem(seed, attempt);
    try {
      const candidatePair = synthesizePair(candidateProblem, seed + attempt * 104729, targetClass);
      problem = candidateProblem;
      pair = candidatePair;
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (!problem || !pair) throw lastError instanceof Error ? lastError : new Error(`Unable to synthesize AVG-001 DS question for seed ${seed}`);

  const evaluation = pair.evaluation;
  const prompt = targetPrompt(problem);
  const stem = `${problem.context.intro[problem.surfaceVariant]} ${prompt}`;
  const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
  const togetherExplanation = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? (evaluation.together.sufficient
      ? `Using both statements together fixes the asked value at ${evaluation.together.normalizedTargetAnswers[0]}. So the two statements together are sufficient.`
      : `Even together, the statements allow different answers such as ${evaluation.together.normalizedTargetAnswers.slice(0, 2).join(" and ")}. So they are still insufficient.`)
    : undefined;

  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-011" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP011_AVERAGE_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficultyFor(pair),
    domainFamily: "QUANT" as const,
    sourceChapterId: "AVG-001" as const,
    sourceCapability: "AVG-001/foundation/solver::solveAvg001" as const,
    solveModeId: problem.solveMode,
    targetKind: problem.targetKind,
    contextId: problem.context.id,
    answerContractId: "DS_STANDARD_5" as const,
    taskDirection: "DATA_SUFFICIENCY" as const,
    answerSemantic: "SUFFICIENCY_CLASS" as const,
    stem,
    questionPrompt: prompt,
    statements: [
      { id: "I" as const, statementRuleId: pair.statementI.id, statementFamily: pair.statementI.family, text: pair.statementI.text },
      { id: "II" as const, statementRuleId: pair.statementII.id, statementFamily: pair.statementII.family, text: pair.statementII.text },
    ] as const,
    options: DS_STANDARD_5_EN.options.map((option) => ({
      key: option.key,
      value: option.text,
      semanticClass: option.semanticClass,
      isCorrect: option.semanticClass === evaluation.classification,
    })),
    correctIndex: DS_STANDARD_5_EN.options.findIndex((option) => option.semanticClass === evaluation.classification),
    canonicalAnswer: evaluation.classification,
    explanation: {
      askedTarget: `We need to determine ${prompt.charAt(0).toLowerCase()}${prompt.slice(1)}`,
      statementI: explanationForStatement("Statement I", evaluation.statementI.normalizedTargetAnswers, evaluation.statementI.sufficient),
      statementII: explanationForStatement("Statement II", evaluation.statementII.normalizedTargetAnswers, evaluation.statementII.sufficient),
      ...(togetherExplanation ? { together: togetherExplanation } : {}),
      conclusion: correct.text,
    },
    proof: {
      baseWorldCount: BASE_WORLDS.length,
      statementIWorldCount: evaluation.statementI.worldCount,
      statementIIWorldCount: evaluation.statementII.worldCount,
      togetherWorldCount: evaluation.together.worldCount,
      statementITargetAnswers: evaluation.statementI.normalizedTargetAnswers,
      statementIITargetAnswers: evaluation.statementII.normalizedTargetAnswers,
      togetherTargetAnswers: evaluation.together.normalizedTargetAnswers,
      minimalSufficientSets: evaluation.minimalSufficientSets,
      sourceSolver: "solveAvg001" as const,
    },
    sourceAncestry: ["AVG-001", "AVG-001/foundation/solver::solveAvg001"] as const,
    generationIdentity: generationIdentity(seed, problem, pair),
    studentSurfaceFingerprint: `${normalizeDsfCp011Surface(stem)}|${problem.targetKind}|${pair.statementI.family}|${pair.statementII.family}`,
    lifecycle: {
      contentStatus: "CP011_EXPANSION_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}

export function generateDsfCp011AverageBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp011AverageQuestion);
}
