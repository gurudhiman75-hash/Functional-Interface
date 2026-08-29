import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  DSF_PERMANENT_QL_REGISTRY,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import {
  formatPercent,
  formatRatio,
  percentOf,
  roundTo,
} from "../../../../../quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/math.ts";

export const DSF_CP001_PERCENTAGE_RUNTIME_VERSION = "DSF_CP001_PERCENTAGE_RUNTIME_V1" as const;
export const DSF_CP001_PERCENTAGE_SOLVE_MODES = [
  "DSF-SM-PCT-NET-SUCCESSIVE-CHANGE",
  "DSF-SM-PCT-FINAL-DIRECTION",
] as const;

export type DsfCp001PercentageSolveMode = (typeof DSF_CP001_PERCENTAGE_SOLVE_MODES)[number];
export type DsfCp001PercentageDifficulty = "Easy" | "Medium" | "Hard";
export type DsfCp001PercentageTargetKind = "NET_PERCENT_CHANGE" | "FINAL_DIRECTION";
export type DsfCp001PercentageTargetAnswer = string;

type PercentageStatementFamily =
  | "EXACT_RATE"
  | "SUM"
  | "DIFFERENCE"
  | "RATIO"
  | "PRODUCT"
  | "COMPARISON"
  | "RATE_BOUND"
  | "SUM_BOUND";

interface PercentageWorld {
  readonly increaseRate: number;
  readonly decreaseRate: number;
}

interface PercentageProblem {
  readonly allowedRates: readonly number[];
  readonly anchorIncreaseRate: number;
  readonly anchorDecreaseRate: number;
  readonly solveMode: DsfCp001PercentageSolveMode;
}

interface PercentageStatementDefinition {
  readonly id: string;
  readonly family: PercentageStatementFamily;
  readonly complexity: 1 | 2 | 3;
  readonly text: string;
  readonly test: (world: PercentageWorld) => boolean;
}

interface SynthesizedPercentagePair {
  readonly statementI: PercentageStatementDefinition;
  readonly statementII: PercentageStatementDefinition;
  readonly evaluation: TwoStatementSufficiencyEvaluation<DsfCp001PercentageTargetAnswer>;
  readonly qualityScore: number;
}

export interface DsfCp001PercentageQuestion {
  readonly packageId: "DSF-001";
  readonly checkpointId: "DSF-CP-001";
  readonly qlId: "DSF-QL-001";
  readonly runtimeVersion: typeof DSF_CP001_PERCENTAGE_RUNTIME_VERSION;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: DsfCp001PercentageDifficulty;
  readonly domainFamily: "QUANT";
  readonly sourceChapterId: "PCT-001";
  readonly sourceCapability: "PCT-001/math::{percentOf,roundTo,formatPercent,formatRatio}";
  readonly solveModeId: DsfCp001PercentageSolveMode;
  readonly targetKind: DsfCp001PercentageTargetKind;
  readonly answerContractId: "DS_STANDARD_5";
  readonly taskDirection: "DATA_SUFFICIENCY";
  readonly answerSemantic: "SUFFICIENCY_CLASS";
  readonly baseCondition: string;
  readonly stem: string;
  readonly questionPrompt: string;
  readonly statements: readonly [
    {
      readonly id: "I";
      readonly statementRuleId: string;
      readonly statementFamily: PercentageStatementFamily;
      readonly text: string;
    },
    {
      readonly id: "II";
      readonly statementRuleId: string;
      readonly statementFamily: PercentageStatementFamily;
      readonly text: string;
    },
  ];
  readonly options: readonly {
    readonly key: "A" | "B" | "C" | "D" | "E";
    readonly value: string;
    readonly semanticClass: SufficiencyClass;
    readonly isCorrect: boolean;
    readonly misconceptionId?: string;
  }[];
  readonly correctIndex: number;
  readonly canonicalAnswer: SufficiencyClass;
  readonly explanation: {
    readonly askedTarget: string;
    readonly statementI: string;
    readonly statementII: string;
    readonly together?: string;
    readonly conclusion: string;
  };
  readonly proof: {
    readonly allowedRates: readonly number[];
    readonly baseWorldCount: number;
    readonly statementIWorldCount: number;
    readonly statementIIWorldCount: number;
    readonly togetherWorldCount: number;
    readonly statementITargetAnswers: readonly string[];
    readonly statementIITargetAnswers: readonly string[];
    readonly togetherTargetAnswers: readonly string[];
    readonly statementIExampleWorlds: readonly string[];
    readonly statementIIExampleWorlds: readonly string[];
    readonly togetherExampleWorlds: readonly string[];
    readonly minimalSufficientSets: readonly (readonly string[])[];
  };
  readonly sourceAncestry: readonly [
    "PCT-001",
    "PCT-001/math::{percentOf,roundTo,formatPercent,formatRatio}",
  ];
  readonly generationIdentity: string;
  readonly validation: { readonly ok: true; readonly errors: readonly [] };
  readonly lifecycle: {
    readonly contentStatus: "ENGLISH_REVIEW_CANDIDATE";
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

const ALLOWED_RATES = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50] as const;

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  const text = `${DSF_CP001_PERCENTAGE_RUNTIME_VERSION}:${seed}:${salt}`;
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
  if (values.length === 0) throw new Error("Cannot pick from an empty list");
  return values[Math.floor(random() * values.length)]!;
}

function desiredClass(seed: number): SufficiencyClass {
  return SUFFICIENCY_CLASSES[hashSeed(seed, "class") % SUFFICIENCY_CLASSES.length]!;
}

function buildProblem(seed: number, attempt: number): PercentageProblem {
  const random = createRng(seed + attempt * 1031, "problem");
  const anchorIncreaseRate = pick(random, ALLOWED_RATES);
  const anchorDecreaseRate = pick(random, ALLOWED_RATES);
  const solveMode = random() < 0.58
    ? "DSF-SM-PCT-NET-SUCCESSIVE-CHANGE"
    : "DSF-SM-PCT-FINAL-DIRECTION";
  return {
    allowedRates: ALLOWED_RATES,
    anchorIncreaseRate,
    anchorDecreaseRate,
    solveMode,
  };
}

function enumerateWorlds(problem: PercentageProblem): readonly PercentageWorld[] {
  const worlds: PercentageWorld[] = [];
  for (const increaseRate of problem.allowedRates) {
    for (const decreaseRate of problem.allowedRates) {
      worlds.push({ increaseRate, decreaseRate });
    }
  }
  return worlds;
}

function netPercentageChange(world: PercentageWorld): number {
  const original = 100;
  const afterIncrease = original + percentOf(world.increaseRate, original);
  const finalValue = afterIncrease - percentOf(world.decreaseRate, afterIncrease);
  return roundTo(finalValue - original, 2);
}

function targetAnswer(problem: PercentageProblem, world: PercentageWorld): DsfCp001PercentageTargetAnswer {
  const netChange = netPercentageChange(world);
  if (problem.solveMode === "DSF-SM-PCT-NET-SUCCESSIVE-CHANGE") {
    return formatPercent(netChange);
  }
  if (netChange > 0) return "ABOVE";
  if (netChange < 0) return "BELOW";
  return "SAME";
}

function buildStatementPool(problem: PercentageProblem): readonly PercentageStatementDefinition[] {
  const p = problem.anchorIncreaseRate;
  const q = problem.anchorDecreaseRate;
  const sum = p + q;
  const difference = p - q;
  const ratio = formatRatio(p, q);
  const product = p * q;
  const statements: PercentageStatementDefinition[] = [];

  const add = (
    id: string,
    family: PercentageStatementFamily,
    complexity: 1 | 2 | 3,
    text: string,
    test: (world: PercentageWorld) => boolean,
  ) => statements.push({ id, family, complexity, text, test });

  add(`P_EQUALS_${p}`, "EXACT_RATE", 2, `P = ${p}%.`, (world) => world.increaseRate === p);
  add(`Q_EQUALS_${q}`, "EXACT_RATE", 2, `Q = ${q}%.`, (world) => world.decreaseRate === q);
  add(`P_PLUS_Q_EQUALS_${sum}`, "SUM", 1, `P + Q = ${sum}%.`, (world) => world.increaseRate + world.decreaseRate === sum);

  if (difference > 0) {
    add(
      `P_EXCEEDS_Q_BY_${difference}`,
      "DIFFERENCE",
      1,
      `P is ${difference} percentage points greater than Q.`,
      (world) => world.increaseRate - world.decreaseRate === difference,
    );
  } else if (difference < 0) {
    add(
      `Q_EXCEEDS_P_BY_${Math.abs(difference)}`,
      "DIFFERENCE",
      1,
      `Q is ${Math.abs(difference)} percentage points greater than P.`,
      (world) => world.decreaseRate - world.increaseRate === Math.abs(difference),
    );
  } else {
    add("P_EQUALS_Q", "DIFFERENCE", 1, "P and Q are equal.", (world) => world.increaseRate === world.decreaseRate);
  }

  add(
    `P_TO_Q_RATIO_${ratio.replace(":", "_")}`,
    "RATIO",
    1,
    `P : Q = ${ratio.replace(":", " : ")}.`,
    (world) => formatRatio(world.increaseRate, world.decreaseRate) === ratio,
  );
  add(
    `P_TIMES_Q_EQUALS_${product}`,
    "PRODUCT",
    2,
    `The product of the numerical values of P and Q is ${product}.`,
    (world) => world.increaseRate * world.decreaseRate === product,
  );

  if (p > q) {
    add("P_GREATER_THAN_Q", "COMPARISON", 1, "P is greater than Q.", (world) => world.increaseRate > world.decreaseRate);
  } else if (q > p) {
    add("Q_GREATER_THAN_P", "COMPARISON", 1, "Q is greater than P.", (world) => world.decreaseRate > world.increaseRate);
  } else {
    add("P_AND_Q_EQUAL", "COMPARISON", 1, "P = Q.", (world) => world.increaseRate === world.decreaseRate);
  }

  const pLower = Math.max(5, p - 10);
  const pUpper = Math.min(50, p + 10);
  const qLower = Math.max(5, q - 10);
  const qUpper = Math.min(50, q + 10);
  add(`P_AT_LEAST_${pLower}`, "RATE_BOUND", 1, `P is at least ${pLower}%.`, (world) => world.increaseRate >= pLower);
  add(`P_AT_MOST_${pUpper}`, "RATE_BOUND", 1, `P is at most ${pUpper}%.`, (world) => world.increaseRate <= pUpper);
  add(`Q_AT_LEAST_${qLower}`, "RATE_BOUND", 1, `Q is at least ${qLower}%.`, (world) => world.decreaseRate >= qLower);
  add(`Q_AT_MOST_${qUpper}`, "RATE_BOUND", 1, `Q is at most ${qUpper}%.`, (world) => world.decreaseRate <= qUpper);

  const sumLower = Math.max(10, sum - 10);
  const sumUpper = Math.min(100, sum + 10);
  add(
    `P_PLUS_Q_AT_LEAST_${sumLower}`,
    "SUM_BOUND",
    1,
    `P + Q is at least ${sumLower}%.`,
    (world) => world.increaseRate + world.decreaseRate >= sumLower,
  );
  add(
    `P_PLUS_Q_AT_MOST_${sumUpper}`,
    "SUM_BOUND",
    1,
    `P + Q is at most ${sumUpper}%.`,
    (world) => world.increaseRate + world.decreaseRate <= sumUpper,
  );

  return statements;
}

const percentageAdapter = {
  adapterId: "DSF-ADAPTER-PERCENTAGE-CP001-V1",
  domainFamily: "QUANT" as const,
  sourceChapterId: "PCT-001",
  enumerateBaseWorlds(problem: PercentageProblem): readonly PercentageWorld[] {
    return enumerateWorlds(problem);
  },
  statementHolds(
    _problem: PercentageProblem,
    world: PercentageWorld,
    statement: PercentageStatementDefinition,
  ): boolean {
    return statement.test(world);
  },
  evaluateTarget(problem: PercentageProblem, world: PercentageWorld): DsfCp001PercentageTargetAnswer {
    return targetAnswer(problem, world);
  },
  normalizeAnswer(answer: DsfCp001PercentageTargetAnswer): string {
    return answer;
  },
};

function survivorKey(world: PercentageWorld): string {
  return `${world.increaseRate}:${world.decreaseRate}`;
}

function statementSurvivors(
  worlds: readonly PercentageWorld[],
  statement: PercentageStatementDefinition,
): readonly PercentageWorld[] {
  return worlds.filter(statement.test);
}

function sameWorldSet(left: readonly PercentageWorld[], right: readonly PercentageWorld[]): boolean {
  if (left.length !== right.length) return false;
  const rightSet = new Set(right.map(survivorKey));
  return left.every((world) => rightSet.has(survivorKey(world)));
}

function isSubset(left: readonly PercentageWorld[], right: readonly PercentageWorld[]): boolean {
  const rightSet = new Set(right.map(survivorKey));
  return left.every((world) => rightSet.has(survivorKey(world)));
}

function pairQuality(
  worlds: readonly PercentageWorld[],
  statementI: PercentageStatementDefinition,
  statementII: PercentageStatementDefinition,
  evaluation: TwoStatementSufficiencyEvaluation<DsfCp001PercentageTargetAnswer>,
): number {
  const worldsI = statementSurvivors(worlds, statementI);
  const worldsII = statementSurvivors(worlds, statementII);
  const familyBonus = statementI.family === statementII.family ? -3 : 5;
  const interactionBonus = evaluation.classification === "BOTH_TOGETHER_ONLY" ? 8 : 0;
  const projectionBonus = [evaluation.statementI, evaluation.statementII, evaluation.together]
    .filter((entry) => entry.sufficient && entry.worldCount > 1).length * 3;
  const implicationPenalty = isSubset(worldsI, worldsII) || isSubset(worldsII, worldsI) ? 2 : 0;
  const breadthBonus = Math.floor((Math.min(worldsI.length, 20) + Math.min(worldsII.length, 20)) / 7);
  return familyBonus + interactionBonus + projectionBonus + breadthBonus
    - statementI.complexity - statementII.complexity - implicationPenalty;
}

function synthesizePair(
  problem: PercentageProblem,
  seed: number,
  targetClass: SufficiencyClass,
): SynthesizedPercentagePair {
  const worlds = enumerateWorlds(problem);
  const usable = buildStatementPool(problem).filter((statement) => {
    const count = statementSurvivors(worlds, statement).length;
    return count > 0 && count < worlds.length;
  });
  const candidates: SynthesizedPercentagePair[] = [];

  for (const statementI of usable) {
    const worldsI = statementSurvivors(worlds, statementI);
    for (const statementII of usable) {
      if (statementI.id === statementII.id) continue;
      const worldsII = statementSurvivors(worlds, statementII);
      if (sameWorldSet(worldsI, worldsII)) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(percentageAdapter, problem, statementI, statementII);
        if (evaluation.classification !== targetClass) continue;
        candidates.push({
          statementI,
          statementII,
          evaluation,
          qualityScore: pairQuality(worlds, statementI, statementII, evaluation),
        });
      } catch {
        // Empty intersections and invariant failures are generation rejects.
      }
    }
  }

  if (candidates.length === 0) {
    throw new Error(`${problem.solveMode}: no percentage statement pair for ${targetClass}`);
  }

  const bestScore = Math.max(...candidates.map((candidate) => candidate.qualityScore));
  const shortlist = candidates.filter((candidate) => candidate.qualityScore >= bestScore - 2);
  return pick(createRng(seed, `pair:${targetClass}:${problem.solveMode}`), shortlist);
}

function targetKind(problem: PercentageProblem): DsfCp001PercentageTargetKind {
  return problem.solveMode === "DSF-SM-PCT-NET-SUCCESSIVE-CHANGE"
    ? "NET_PERCENT_CHANGE"
    : "FINAL_DIRECTION";
}

function targetPrompt(problem: PercentageProblem): string {
  return problem.solveMode === "DSF-SM-PCT-NET-SUCCESSIVE-CHANGE"
    ? "What is the net percentage change from the original value?"
    : "Is the final value above, below or equal to the original value?";
}

function difficultyFor(
  problem: PercentageProblem,
  pair: SynthesizedPercentagePair,
): DsfCp001PercentageDifficulty {
  const complexity = pair.statementI.complexity + pair.statementII.complexity;
  if (pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY") {
    return problem.solveMode === "DSF-SM-PCT-NET-SUCCESSIVE-CHANGE" || complexity >= 4 ? "Hard" : "Medium";
  }
  if (problem.solveMode === "DSF-SM-PCT-FINAL-DIRECTION" && complexity <= 2) return "Easy";
  return complexity >= 4 ? "Hard" : "Medium";
}

function formatTargetAnswers(values: readonly string[]): string {
  if (values.length === 0) return "none";
  if (values.length <= 4) return values.join(", ");
  return `${values.slice(0, 4).join(", ")} ...`;
}

function semanticStatementExplanation(
  label: "Statement I" | "Statement II" | "Both statements together",
  evaluation: { readonly sufficient: boolean; readonly worldCount: number; readonly normalizedTargetAnswers: readonly string[] },
): string {
  if (evaluation.sufficient) {
    return `${label} leaves ${evaluation.worldCount} valid rate pair(s), all with target answer ${formatTargetAnswers(evaluation.normalizedTargetAnswers)}; therefore it is sufficient.`;
  }
  return `${label} leaves ${evaluation.worldCount} valid rate pair(s) and multiple target answers (${formatTargetAnswers(evaluation.normalizedTargetAnswers)}); therefore it is not sufficient.`;
}

function buildExplanation(
  problem: PercentageProblem,
  pair: SynthesizedPercentagePair,
): DsfCp001PercentageQuestion["explanation"] {
  const evaluation = pair.evaluation;
  const together = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? semanticStatementExplanation("Both statements together", evaluation.together)
    : undefined;
  return {
    askedTarget: targetPrompt(problem),
    statementI: semanticStatementExplanation("Statement I", evaluation.statementI),
    statementII: semanticStatementExplanation("Statement II", evaluation.statementII),
    ...(together ? { together } : {}),
    conclusion: optionForClass(DS_STANDARD_5_EN, evaluation.classification).text,
  };
}

function worldLabel(world: PercentageWorld): string {
  return `P=${world.increaseRate}%, Q=${world.decreaseRate}%`;
}

function misconceptionFor(semanticClass: SufficiencyClass): string {
  return `DSF-MC-CHOSE-${semanticClass}`;
}

function generationIdentity(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 24);
}

export function generateDsfCp001PercentageQuestion(seed: number): DsfCp001PercentageQuestion {
  if (!Number.isSafeInteger(seed)) {
    throw new Error(`DSF CP-001 Percentage seed must be a safe integer: ${seed}`);
  }
  const ql = DSF_PERMANENT_QL_REGISTRY[0];
  if (!ql || ql.qlId !== "DSF-QL-001") throw new Error("DSF-QL-001 is not allocated");

  const targetClass = desiredClass(seed);
  let problem: PercentageProblem | undefined;
  let pair: SynthesizedPercentagePair | undefined;

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const candidateProblem = buildProblem(seed, attempt);
    try {
      const candidatePair = synthesizePair(candidateProblem, seed + attempt * 1019, targetClass);
      problem = candidateProblem;
      pair = candidatePair;
      break;
    } catch {
      // Retry with another anchor/target profile.
    }
  }

  if (!problem || !pair) {
    throw new Error(`DSF CP-001 Percentage failed to synthesize seed ${seed}/${targetClass}`);
  }

  const worlds = enumerateWorlds(problem);
  const worldsI = worlds.filter(pair.statementI.test);
  const worldsII = worlds.filter(pair.statementII.test);
  const worldsTogether = worlds.filter((world) => pair!.statementI.test(world) && pair!.statementII.test(world));
  const correctDefinition = optionForClass(DS_STANDARD_5_EN, pair.evaluation.classification);
  const options = DS_STANDARD_5_EN.options.map((option) => ({
    key: option.key,
    value: option.text,
    semanticClass: option.semanticClass,
    isCorrect: option.semanticClass === pair!.evaluation.classification,
    ...(option.semanticClass === pair!.evaluation.classification
      ? {}
      : { misconceptionId: misconceptionFor(option.semanticClass) }),
  }));
  const correctIndex = options.findIndex((option) => option.key === correctDefinition.key);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error("DSF CP-001 Percentage answer-contract rendering failed");
  }

  const prompt = targetPrompt(problem);
  const baseCondition = "P and Q are percentage rates, each a multiple of 5 from 5% to 50%, inclusive. A value is increased by P% and then decreased by Q%.";
  const stem = `${baseCondition} Decide whether the statements are sufficient to answer: ${prompt}`;
  const explanation = buildExplanation(problem, pair);
  const identity = generationIdentity({
    runtime: DSF_CP001_PERCENTAGE_RUNTIME_VERSION,
    seed,
    qlId: ql.qlId,
    solveMode: problem.solveMode,
    statementI: pair.statementI.id,
    statementII: pair.statementII.id,
    classification: pair.evaluation.classification,
  });

  return Object.freeze({
    packageId: "DSF-001",
    checkpointId: "DSF-CP-001",
    qlId: "DSF-QL-001",
    runtimeVersion: DSF_CP001_PERCENTAGE_RUNTIME_VERSION,
    seed,
    locale: "en-IN",
    difficulty: difficultyFor(problem, pair),
    domainFamily: "QUANT",
    sourceChapterId: "PCT-001",
    sourceCapability: "PCT-001/math::{percentOf,roundTo,formatPercent,formatRatio}",
    solveModeId: problem.solveMode,
    targetKind: targetKind(problem),
    answerContractId: "DS_STANDARD_5",
    taskDirection: "DATA_SUFFICIENCY",
    answerSemantic: "SUFFICIENCY_CLASS",
    baseCondition,
    stem,
    questionPrompt: prompt,
    statements: [
      {
        id: "I",
        statementRuleId: pair.statementI.id,
        statementFamily: pair.statementI.family,
        text: pair.statementI.text,
      },
      {
        id: "II",
        statementRuleId: pair.statementII.id,
        statementFamily: pair.statementII.family,
        text: pair.statementII.text,
      },
    ],
    options,
    correctIndex,
    canonicalAnswer: pair.evaluation.classification,
    explanation,
    proof: {
      allowedRates: problem.allowedRates,
      baseWorldCount: worlds.length,
      statementIWorldCount: worldsI.length,
      statementIIWorldCount: worldsII.length,
      togetherWorldCount: worldsTogether.length,
      statementITargetAnswers: pair.evaluation.statementI.normalizedTargetAnswers,
      statementIITargetAnswers: pair.evaluation.statementII.normalizedTargetAnswers,
      togetherTargetAnswers: pair.evaluation.together.normalizedTargetAnswers,
      statementIExampleWorlds: worldsI.slice(0, 6).map(worldLabel),
      statementIIExampleWorlds: worldsII.slice(0, 6).map(worldLabel),
      togetherExampleWorlds: worldsTogether.slice(0, 6).map(worldLabel),
      minimalSufficientSets: pair.evaluation.minimalSufficientSets,
    },
    sourceAncestry: [
      "PCT-001",
      "PCT-001/math::{percentOf,roundTo,formatPercent,formatRatio}",
    ],
    generationIdentity: identity,
    validation: { ok: true, errors: [] },
    lifecycle: {
      contentStatus: "ENGLISH_REVIEW_CANDIDATE",
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  });
}

export function generateDsfCp001PercentageBatch(
  seeds: readonly number[],
): readonly DsfCp001PercentageQuestion[] {
  return seeds.map(generateDsfCp001PercentageQuestion);
}
