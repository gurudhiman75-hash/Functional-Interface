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
import { formatRatio } from "../../../../../quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/math.ts";

export const DSF_CP001_RATIO_RUNTIME_VERSION = "DSF_CP001_RATIO_RUNTIME_V1" as const;
export const DSF_CP001_RATIO_SOLVE_MODES = [
  "DSF-SM-RAP-RATIO-AB",
  "DSF-SM-RAP-GREATER-QUANTITY",
] as const;

export type DsfCp001RatioSolveMode = (typeof DSF_CP001_RATIO_SOLVE_MODES)[number];
export type DsfCp001RatioDifficulty = "Easy" | "Medium" | "Hard";
export type DsfCp001RatioTargetKind = "RATIO_AB" | "GREATER_QUANTITY";
export type DsfCp001RatioTargetAnswer = string;

interface RatioWorld {
  readonly a: number;
  readonly b: number;
}

interface RatioProblem {
  readonly minValue: 2;
  readonly maxValue: 18;
  readonly anchorA: number;
  readonly anchorB: number;
  readonly solveMode: DsfCp001RatioSolveMode;
}

type RatioStatementFamily =
  | "SUM"
  | "DIFFERENCE"
  | "RATIO"
  | "EXACT_VALUE"
  | "COMPARISON"
  | "PARITY"
  | "BOUND"
  | "PRODUCT";

interface RatioStatementDefinition {
  readonly id: string;
  readonly family: RatioStatementFamily;
  readonly complexity: 1 | 2 | 3;
  readonly text: string;
  readonly test: (world: RatioWorld) => boolean;
}

interface SynthesizedRatioPair {
  readonly statementI: RatioStatementDefinition;
  readonly statementII: RatioStatementDefinition;
  readonly evaluation: TwoStatementSufficiencyEvaluation<DsfCp001RatioTargetAnswer>;
  readonly qualityScore: number;
}

export interface DsfCp001RatioQuestion {
  readonly packageId: "DSF-001";
  readonly checkpointId: "DSF-CP-001";
  readonly qlId: "DSF-QL-001";
  readonly runtimeVersion: typeof DSF_CP001_RATIO_RUNTIME_VERSION;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: DsfCp001RatioDifficulty;
  readonly domainFamily: "QUANT";
  readonly sourceChapterId: "RAP-001";
  readonly sourceCapability: "RAP-001/math::formatRatio";
  readonly solveModeId: DsfCp001RatioSolveMode;
  readonly targetKind: DsfCp001RatioTargetKind;
  readonly answerContractId: "DS_STANDARD_5";
  readonly taskDirection: "DATA_SUFFICIENCY";
  readonly answerSemantic: "SUFFICIENCY_CLASS";
  readonly baseCondition: string;
  readonly stem: string;
  readonly questionPrompt: string;
  readonly statements: readonly [
    { readonly id: "I"; readonly statementRuleId: string; readonly statementFamily: RatioStatementFamily; readonly text: string },
    { readonly id: "II"; readonly statementRuleId: string; readonly statementFamily: RatioStatementFamily; readonly text: string },
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
  readonly sourceAncestry: readonly ["RAP-001", "RAP-001/math::formatRatio"];
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

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  const text = `${DSF_CP001_RATIO_RUNTIME_VERSION}:${seed}:${salt}`;
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

function buildProblem(seed: number, targetClass: SufficiencyClass, attempt = 0): RatioProblem {
  const random = createRng(seed + attempt * 1009, "problem");
  let anchorA = 5 + Math.floor(random() * 10);
  let anchorB = 5 + Math.floor(random() * 10);
  if (anchorA === anchorB) anchorB = anchorB === 14 ? 13 : anchorB + 1;

  let solveMode: DsfCp001RatioSolveMode;
  if (targetClass === "EACH_STATEMENT_ALONE") {
    solveMode = "DSF-SM-RAP-GREATER-QUANTITY";
  } else if (attempt >= 8) {
    solveMode = attempt % 2 === 0 ? "DSF-SM-RAP-RATIO-AB" : "DSF-SM-RAP-GREATER-QUANTITY";
  } else {
    solveMode = random() < 0.68 ? "DSF-SM-RAP-RATIO-AB" : "DSF-SM-RAP-GREATER-QUANTITY";
  }

  return {
    minValue: 2,
    maxValue: 18,
    anchorA,
    anchorB,
    solveMode,
  };
}

function enumerateWorlds(problem: RatioProblem): readonly RatioWorld[] {
  const worlds: RatioWorld[] = [];
  for (let a = problem.minValue; a <= problem.maxValue; a += 1) {
    for (let b = problem.minValue; b <= problem.maxValue; b += 1) {
      if (a === b) continue;
      worlds.push({ a, b });
    }
  }
  return worlds;
}

function parity(value: number): "even" | "odd" {
  return value % 2 === 0 ? "even" : "odd";
}

function buildStatementPool(problem: RatioProblem): readonly RatioStatementDefinition[] {
  const { anchorA: a, anchorB: b } = problem;
  const sum = a + b;
  const difference = Math.abs(a - b);
  const ratio = formatRatio([a, b]);
  const product = a * b;
  const statements: RatioStatementDefinition[] = [
    {
      id: `SUM_EQUALS_${sum}`,
      family: "SUM",
      complexity: 1,
      text: `A + B = ${sum}.`,
      test: (world) => world.a + world.b === sum,
    },
    {
      id: a > b ? `A_EXCEEDS_B_BY_${difference}` : `B_EXCEEDS_A_BY_${difference}`,
      family: "DIFFERENCE",
      complexity: 1,
      text: a > b ? `A is ${difference} greater than B.` : `B is ${difference} greater than A.`,
      test: a > b
        ? (world) => world.a - world.b === difference
        : (world) => world.b - world.a === difference,
    },
    {
      id: `RATIO_A_TO_B_${ratio.replace(":", "_")}`,
      family: "RATIO",
      complexity: 1,
      text: `A : B = ${ratio.replace(":", " : ")}.`,
      test: (world) => formatRatio([world.a, world.b]) === ratio,
    },
    {
      id: `A_EQUALS_${a}`,
      family: "EXACT_VALUE",
      complexity: 2,
      text: `A = ${a}.`,
      test: (world) => world.a === a,
    },
    {
      id: `B_EQUALS_${b}`,
      family: "EXACT_VALUE",
      complexity: 2,
      text: `B = ${b}.`,
      test: (world) => world.b === b,
    },
    {
      id: a > b ? "A_GREATER_THAN_B" : "B_GREATER_THAN_A",
      family: "COMPARISON",
      complexity: 1,
      text: a > b ? "A is greater than B." : "B is greater than A.",
      test: a > b ? (world) => world.a > world.b : (world) => world.b > world.a,
    },
    {
      id: `A_IS_${parity(a).toUpperCase()}`,
      family: "PARITY",
      complexity: 1,
      text: `A is ${parity(a)}.`,
      test: (world) => world.a % 2 === a % 2,
    },
    {
      id: `B_IS_${parity(b).toUpperCase()}`,
      family: "PARITY",
      complexity: 1,
      text: `B is ${parity(b)}.`,
      test: (world) => world.b % 2 === b % 2,
    },
    {
      id: `A_GREATER_THAN_${Math.max(problem.minValue - 1, a - 2)}`,
      family: "BOUND",
      complexity: 1,
      text: `A is greater than ${Math.max(problem.minValue - 1, a - 2)}.`,
      test: (world) => world.a > Math.max(problem.minValue - 1, a - 2),
    },
    {
      id: `A_LESS_THAN_${Math.min(problem.maxValue + 1, a + 2)}`,
      family: "BOUND",
      complexity: 1,
      text: `A is less than ${Math.min(problem.maxValue + 1, a + 2)}.`,
      test: (world) => world.a < Math.min(problem.maxValue + 1, a + 2),
    },
    {
      id: `B_GREATER_THAN_${Math.max(problem.minValue - 1, b - 2)}`,
      family: "BOUND",
      complexity: 1,
      text: `B is greater than ${Math.max(problem.minValue - 1, b - 2)}.`,
      test: (world) => world.b > Math.max(problem.minValue - 1, b - 2),
    },
    {
      id: `B_LESS_THAN_${Math.min(problem.maxValue + 1, b + 2)}`,
      family: "BOUND",
      complexity: 1,
      text: `B is less than ${Math.min(problem.maxValue + 1, b + 2)}.`,
      test: (world) => world.b < Math.min(problem.maxValue + 1, b + 2),
    },
    {
      id: `PRODUCT_EQUALS_${product}`,
      family: "PRODUCT",
      complexity: 2,
      text: `The product of A and B is ${product}.`,
      test: (world) => world.a * world.b === product,
    },
    {
      id: `SUM_IS_${parity(sum).toUpperCase()}`,
      family: "PARITY",
      complexity: 1,
      text: `A + B is ${parity(sum)}.`,
      test: (world) => (world.a + world.b) % 2 === sum % 2,
    },
  ];

  return statements;
}

const ratioAdapter = {
  adapterId: "DSF-ADAPTER-RATIO-PROPORTION-CP001-V1",
  domainFamily: "QUANT" as const,
  sourceChapterId: "RAP-001",
  enumerateBaseWorlds(problem: RatioProblem): readonly RatioWorld[] {
    return enumerateWorlds(problem);
  },
  statementHolds(_problem: RatioProblem, world: RatioWorld, statement: RatioStatementDefinition): boolean {
    return statement.test(world);
  },
  evaluateTarget(problem: RatioProblem, world: RatioWorld): DsfCp001RatioTargetAnswer {
    if (problem.solveMode === "DSF-SM-RAP-RATIO-AB") return formatRatio([world.a, world.b]);
    return world.a > world.b ? "A" : "B";
  },
  normalizeAnswer(answer: DsfCp001RatioTargetAnswer): string {
    return String(answer);
  },
};

function statementSurvivors(worlds: readonly RatioWorld[], statement: RatioStatementDefinition): readonly RatioWorld[] {
  return worlds.filter(statement.test);
}

function isSubset(left: readonly RatioWorld[], right: readonly RatioWorld[]): boolean {
  const rightKeys = new Set(right.map((world) => `${world.a}:${world.b}`));
  return left.every((world) => rightKeys.has(`${world.a}:${world.b}`));
}

function pairQuality(
  worlds: readonly RatioWorld[],
  first: RatioStatementDefinition,
  second: RatioStatementDefinition,
  evaluation: TwoStatementSufficiencyEvaluation<DsfCp001RatioTargetAnswer>,
): number {
  const firstWorlds = statementSurvivors(worlds, first);
  const secondWorlds = statementSurvivors(worlds, second);
  const familyBonus = first.family === second.family ? -2 : 5;
  const interactionBonus = evaluation.classification === "BOTH_TOGETHER_ONLY" ? 7 : 0;
  const projectionBonus = [evaluation.statementI, evaluation.statementII, evaluation.together]
    .filter((entry) => entry.sufficient && entry.worldCount > 1).length * 3;
  const implicationPenalty = isSubset(firstWorlds, secondWorlds) || isSubset(secondWorlds, firstWorlds) ? 3 : 0;
  const breadth = Math.min(firstWorlds.length, 20) + Math.min(secondWorlds.length, 20);
  return familyBonus + interactionBonus + projectionBonus + Math.floor(breadth / 6)
    - first.complexity - second.complexity - implicationPenalty;
}

function synthesizePair(problem: RatioProblem, seed: number, targetClass: SufficiencyClass): SynthesizedRatioPair {
  const worlds = enumerateWorlds(problem);
  const usable = buildStatementPool(problem).filter((statement) => {
    const count = statementSurvivors(worlds, statement).length;
    return count > 0 && count < worlds.length;
  });

  const candidates: SynthesizedRatioPair[] = [];
  for (const statementI of usable) {
    for (const statementII of usable) {
      if (statementI.id === statementII.id) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(ratioAdapter, problem, statementI, statementII);
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
    throw new Error(`No RAP statement pair for ${problem.solveMode}/${targetClass}`);
  }

  const bestScore = Math.max(...candidates.map((candidate) => candidate.qualityScore));
  const shortlist = candidates.filter((candidate) => candidate.qualityScore >= bestScore - 2);
  return pick(createRng(seed, `pair:${targetClass}:${problem.solveMode}`), shortlist);
}

function targetKind(problem: RatioProblem): DsfCp001RatioTargetKind {
  return problem.solveMode === "DSF-SM-RAP-RATIO-AB" ? "RATIO_AB" : "GREATER_QUANTITY";
}

function targetPrompt(problem: RatioProblem): string {
  return problem.solveMode === "DSF-SM-RAP-RATIO-AB"
    ? "What is the ratio A:B in simplest form?"
    : "Which quantity is greater, A or B?";
}

function difficultyFor(pair: SynthesizedRatioPair, problem: RatioProblem): DsfCp001RatioDifficulty {
  const complexity = pair.statementI.complexity + pair.statementII.complexity;
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY") return complexity >= 4 ? "Hard" : "Medium";
  if (pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  if (problem.solveMode === "DSF-SM-RAP-GREATER-QUANTITY" && complexity <= 2) return "Easy";
  return complexity >= 4 ? "Hard" : "Medium";
}

function formatTargetAnswers(values: readonly string[]): string {
  if (values.length === 0) return "none";
  if (values.length <= 4) return values.join(", ");
  return `${values.slice(0, 4).join(", ")} ...`;
}

function semanticStatementExplanation(
  label: "Statement I" | "Statement II",
  worldCount: number,
  targetAnswers: readonly string[],
  sufficient: boolean,
): string {
  if (sufficient) {
    return `${label} leaves ${worldCount} valid ordered pair(s), all with target answer ${formatTargetAnswers(targetAnswers)}; therefore it is sufficient.`;
  }
  return `${label} leaves ${worldCount} valid ordered pair(s) and multiple target answers (${formatTargetAnswers(targetAnswers)}); therefore it is not sufficient.`;
}

function buildExplanation(pair: SynthesizedRatioPair, problem: RatioProblem): DsfCp001RatioQuestion["explanation"] {
  const evaluation = pair.evaluation;
  const statementI = semanticStatementExplanation(
    "Statement I",
    evaluation.statementI.worldCount,
    evaluation.statementI.normalizedTargetAnswers,
    evaluation.statementI.sufficient,
  );
  const statementII = semanticStatementExplanation(
    "Statement II",
    evaluation.statementII.worldCount,
    evaluation.statementII.normalizedTargetAnswers,
    evaluation.statementII.sufficient,
  );
  const together = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? semanticStatementExplanation(
      "Both statements together",
      evaluation.together.worldCount,
      evaluation.together.normalizedTargetAnswers,
      evaluation.together.sufficient,
    )
    : undefined;

  return {
    askedTarget: targetPrompt(problem),
    statementI,
    statementII,
    ...(together ? { together } : {}),
    conclusion: optionForClass(DS_STANDARD_5_EN, evaluation.classification).text,
  };
}

function worldLabel(world: RatioWorld): string {
  return `(A,B)=(${world.a},${world.b})`;
}

function misconceptionFor(semanticClass: SufficiencyClass): string {
  return `DSF-MC-CHOSE-${semanticClass}`;
}

function generationIdentity(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 24);
}

export function generateDsfCp001RatioQuestion(seed: number): DsfCp001RatioQuestion {
  if (!Number.isSafeInteger(seed)) throw new Error(`DSF CP-001 RAP seed must be a safe integer: ${seed}`);
  const ql = DSF_PERMANENT_QL_REGISTRY[0];
  if (!ql || ql.qlId !== "DSF-QL-001") throw new Error("DSF-QL-001 is not allocated");

  const targetClass = desiredClass(seed);
  let problem: RatioProblem | undefined;
  let pair: SynthesizedRatioPair | undefined;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidateProblem = buildProblem(seed, targetClass, attempt);
    try {
      const candidatePair = synthesizePair(candidateProblem, seed + attempt * 1013, targetClass);
      problem = candidateProblem;
      pair = candidatePair;
      break;
    } catch {
      // Retry with another anchor/solve-mode profile.
    }
  }

  if (!problem || !pair) {
    throw new Error(`DSF CP-001 RAP failed to synthesize seed ${seed}/${targetClass}`);
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
    ...(option.semanticClass === pair!.evaluation.classification ? {} : { misconceptionId: misconceptionFor(option.semanticClass) }),
  }));
  const correctIndex = options.findIndex((option) => option.key === correctDefinition.key);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error("DSF CP-001 RAP answer-contract rendering failed");
  }

  const prompt = targetPrompt(problem);
  const baseCondition = `A and B are distinct positive integers from ${problem.minValue} to ${problem.maxValue}, inclusive.`;
  const stem = `${baseCondition} Decide whether the statements are sufficient to answer: ${prompt}`;
  const explanation = buildExplanation(pair, problem);
  const identity = generationIdentity({
    runtime: DSF_CP001_RATIO_RUNTIME_VERSION,
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
    runtimeVersion: DSF_CP001_RATIO_RUNTIME_VERSION,
    seed,
    locale: "en-IN",
    difficulty: difficultyFor(pair, problem),
    domainFamily: "QUANT",
    sourceChapterId: "RAP-001",
    sourceCapability: "RAP-001/math::formatRatio",
    solveModeId: problem.solveMode,
    targetKind: targetKind(problem),
    answerContractId: "DS_STANDARD_5",
    taskDirection: "DATA_SUFFICIENCY",
    answerSemantic: "SUFFICIENCY_CLASS",
    baseCondition,
    stem,
    questionPrompt: prompt,
    statements: [
      { id: "I", statementRuleId: pair.statementI.id, statementFamily: pair.statementI.family, text: pair.statementI.text },
      { id: "II", statementRuleId: pair.statementII.id, statementFamily: pair.statementII.family, text: pair.statementII.text },
    ],
    options,
    correctIndex,
    canonicalAnswer: pair.evaluation.classification,
    explanation,
    proof: {
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
    sourceAncestry: ["RAP-001", "RAP-001/math::formatRatio"],
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

export function generateDsfCp001RatioBatch(seeds: readonly number[]): readonly DsfCp001RatioQuestion[] {
  return seeds.map(generateDsfCp001RatioQuestion);
}
