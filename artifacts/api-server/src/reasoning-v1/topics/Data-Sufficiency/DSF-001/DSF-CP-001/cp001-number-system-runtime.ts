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
  fillSingleDigit,
  isDivisible,
  numeralToBigInt,
} from "../../../../../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/foundation/divisibility.ts";

export const DSF_CP001_RUNTIME_VERSION = "DSF_CP001_NUMBER_SYSTEM_RUNTIME_V1" as const;
export const DSF_CP001_SOLVE_MODES = [
  "DSF-SM-NUM-MISSING-DIGIT",
  "DSF-SM-NUM-DIGIT-PARITY",
] as const;

export type DsfCp001SolveMode = (typeof DSF_CP001_SOLVE_MODES)[number];
export type DsfCp001Difficulty = "Easy" | "Medium" | "Hard";
export type DsfCp001DigitParity = "EVEN" | "ODD";
export type DsfCp001TargetAnswer = number | DsfCp001DigitParity;

interface NumberSystemWorld {
  readonly digit: number;
  readonly numeral: string;
  readonly value: bigint;
}

interface NumberSystemProblem {
  readonly template: string;
  readonly solveMode: DsfCp001SolveMode;
}

interface StatementDefinition {
  readonly id: string;
  readonly family: "NUMBER_DIVISIBILITY" | "DIGIT_PROPERTY" | "DIGIT_BOUND";
  readonly complexity: 1 | 2 | 3;
  readonly text: string;
  readonly test: (world: NumberSystemWorld) => boolean;
}

interface SynthesizedPair {
  readonly statementI: StatementDefinition;
  readonly statementII: StatementDefinition;
  readonly evaluation: TwoStatementSufficiencyEvaluation<DsfCp001TargetAnswer>;
  readonly qualityScore: number;
}

export interface DsfCp001NumberSystemQuestion {
  readonly packageId: "DSF-001";
  readonly checkpointId: "DSF-CP-001";
  readonly qlId: "DSF-QL-001";
  readonly runtimeVersion: typeof DSF_CP001_RUNTIME_VERSION;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: DsfCp001Difficulty;
  readonly domainFamily: "QUANT";
  readonly sourceChapterId: "NUM-001";
  readonly sourceCapability: "NUM-001/foundation/divisibility";
  readonly solveModeId: DsfCp001SolveMode;
  readonly targetKind: "MISSING_DIGIT" | "DIGIT_PARITY";
  readonly answerContractId: "DS_STANDARD_5";
  readonly taskDirection: "DATA_SUFFICIENCY";
  readonly answerSemantic: "SUFFICIENCY_CLASS";
  readonly stem: string;
  readonly questionPrompt: string;
  readonly statements: readonly [
    { readonly id: "I"; readonly statementRuleId: string; readonly text: string },
    { readonly id: "II"; readonly statementRuleId: string; readonly text: string },
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
    readonly baseDigits: readonly number[];
    readonly statementIDigits: readonly number[];
    readonly statementIIDigits: readonly number[];
    readonly togetherDigits: readonly number[];
    readonly statementITargetAnswers: readonly string[];
    readonly statementIITargetAnswers: readonly string[];
    readonly togetherTargetAnswers: readonly string[];
    readonly minimalSufficientSets: readonly (readonly string[])[];
  };
  readonly sourceAncestry: readonly ["NUM-001", "NUM-001/foundation/divisibility"];
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
  const text = `${DSF_CP001_RUNTIME_VERSION}:${seed}:${salt}`;
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

function buildProblem(seed: number): NumberSystemProblem {
  const random = createRng(seed, "problem");
  const hundreds = 1 + Math.floor(random() * 9);
  const tens = Math.floor(random() * 10);
  const solveMode = random() < 0.78
    ? "DSF-SM-NUM-MISSING-DIGIT"
    : "DSF-SM-NUM-DIGIT-PARITY";
  return { template: `${hundreds}${tens}X`, solveMode };
}

function enumerateWorlds(problem: NumberSystemProblem): readonly NumberSystemWorld[] {
  return Array.from({ length: 10 }, (_, digit) => {
    const numeral = fillSingleDigit(problem.template, digit);
    return { digit, numeral, value: numeralToBigInt(numeral) };
  });
}

const PRIME_DIGITS = new Set([2, 3, 5, 7]);

function statementPool(): readonly StatementDefinition[] {
  const divisors = [2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 11n, 13n, 17n, 19n] as const;
  const statements: StatementDefinition[] = divisors.map((divisor) => ({
    id: `COMPLETED_NUMBER_DIVISIBLE_BY_${divisor}`,
    family: "NUMBER_DIVISIBILITY" as const,
    complexity: divisor <= 9n ? 1 as const : 3 as const,
    text: `The completed number is divisible by ${divisor}.`,
    test: (world: NumberSystemWorld) => isDivisible(world.value, divisor),
  }));

  statements.push(
    {
      id: "DIGIT_EVEN",
      family: "DIGIT_PROPERTY",
      complexity: 1,
      text: "X is an even digit.",
      test: (world) => world.digit % 2 === 0,
    },
    {
      id: "DIGIT_ODD",
      family: "DIGIT_PROPERTY",
      complexity: 1,
      text: "X is an odd digit.",
      test: (world) => world.digit % 2 === 1,
    },
    {
      id: "DIGIT_PRIME",
      family: "DIGIT_PROPERTY",
      complexity: 1,
      text: "X is a prime digit.",
      test: (world) => PRIME_DIGITS.has(world.digit),
    },
    {
      id: "DIGIT_MULTIPLE_OF_3",
      family: "DIGIT_PROPERTY",
      complexity: 1,
      text: "X is a multiple of 3.",
      test: (world) => world.digit % 3 === 0,
    },
    {
      id: "DIGIT_MULTIPLE_OF_4",
      family: "DIGIT_PROPERTY",
      complexity: 1,
      text: "X is a multiple of 4.",
      test: (world) => world.digit % 4 === 0,
    },
  );

  for (const threshold of [3, 4, 5, 6, 7] as const) {
    statements.push({
      id: `DIGIT_LT_${threshold}`,
      family: "DIGIT_BOUND",
      complexity: 1,
      text: `X is less than ${threshold}.`,
      test: (world) => world.digit < threshold,
    });
    statements.push({
      id: `DIGIT_GT_${threshold - 1}`,
      family: "DIGIT_BOUND",
      complexity: 1,
      text: `X is greater than ${threshold - 1}.`,
      test: (world) => world.digit > threshold - 1,
    });
  }

  return statements;
}

const STATEMENT_POOL = statementPool();

const adapter = {
  adapterId: "DSF-ADAPTER-NUMBER-SYSTEM-CP001-V1",
  domainFamily: "QUANT" as const,
  sourceChapterId: "NUM-001",
  enumerateBaseWorlds(problem: NumberSystemProblem): readonly NumberSystemWorld[] {
    return enumerateWorlds(problem);
  },
  statementHolds(_problem: NumberSystemProblem, world: NumberSystemWorld, statement: StatementDefinition): boolean {
    return statement.test(world);
  },
  evaluateTarget(problem: NumberSystemProblem, world: NumberSystemWorld): DsfCp001TargetAnswer {
    if (problem.solveMode === "DSF-SM-NUM-MISSING-DIGIT") return world.digit;
    return world.digit % 2 === 0 ? "EVEN" : "ODD";
  },
  normalizeAnswer(answer: DsfCp001TargetAnswer): string {
    return String(answer);
  },
};

function desiredClass(seed: number): SufficiencyClass {
  return SUFFICIENCY_CLASSES[hashSeed(seed, "class") % SUFFICIENCY_CLASSES.length]!;
}

function statementSurvivors(worlds: readonly NumberSystemWorld[], statement: StatementDefinition): readonly NumberSystemWorld[] {
  return worlds.filter(statement.test);
}

function pairQuality(
  worlds: readonly NumberSystemWorld[],
  first: StatementDefinition,
  second: StatementDefinition,
  evaluation: TwoStatementSufficiencyEvaluation<DsfCp001TargetAnswer>,
): number {
  const firstWorlds = statementSurvivors(worlds, first).length;
  const secondWorlds = statementSurvivors(worlds, second).length;
  const familyBonus = first.family === second.family ? 0 : 4;
  const interactionBonus = evaluation.classification === "BOTH_TOGETHER_ONLY" ? 6 : 0;
  const nonTriviality = Math.min(firstWorlds, 9) + Math.min(secondWorlds, 9);
  return familyBonus + interactionBonus + nonTriviality - first.complexity - second.complexity;
}

function synthesizePair(problem: NumberSystemProblem, seed: number, targetClass: SufficiencyClass): SynthesizedPair {
  const worlds = enumerateWorlds(problem);
  const usable = STATEMENT_POOL.filter((statement) => {
    const count = statementSurvivors(worlds, statement).length;
    return count > 0 && count < worlds.length;
  });

  const candidates: SynthesizedPair[] = [];
  for (const statementI of usable) {
    for (const statementII of usable) {
      if (statementI.id === statementII.id) continue;
      if (statementI.family === statementII.family && statementI.text === statementII.text) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
        if (evaluation.classification !== targetClass) continue;
        candidates.push({
          statementI,
          statementII,
          evaluation,
          qualityScore: pairQuality(worlds, statementI, statementII, evaluation),
        });
      } catch {
        // Empty intersections and other invariant failures are generation rejects.
      }
    }
  }

  if (candidates.length === 0) {
    throw new Error(`${problem.template}/${problem.solveMode}: no statement pair for ${targetClass}`);
  }

  const bestScore = Math.max(...candidates.map((candidate) => candidate.qualityScore));
  const shortlist = candidates.filter((candidate) => candidate.qualityScore >= bestScore - 2);
  return pick(createRng(seed, `pair:${targetClass}:${problem.solveMode}`), shortlist);
}

function difficultyFor(pair: SynthesizedPair, solveMode: DsfCp001SolveMode): DsfCp001Difficulty {
  const complexity = pair.statementI.complexity + pair.statementII.complexity;
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || solveMode === "DSF-SM-NUM-DIGIT-PARITY") {
    return complexity >= 4 ? "Hard" : "Medium";
  }
  if (pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER" || complexity >= 5) return "Hard";
  if (complexity <= 2 && ["STATEMENT_I_ONLY", "STATEMENT_II_ONLY"].includes(pair.evaluation.classification)) return "Easy";
  return "Medium";
}

function targetPrompt(problem: NumberSystemProblem): string {
  if (problem.solveMode === "DSF-SM-NUM-MISSING-DIGIT") return "What is the value of X?";
  return "Is X even or odd?";
}

function targetKind(problem: NumberSystemProblem): "MISSING_DIGIT" | "DIGIT_PARITY" {
  return problem.solveMode === "DSF-SM-NUM-MISSING-DIGIT" ? "MISSING_DIGIT" : "DIGIT_PARITY";
}

function formatAnswers(values: readonly string[]): string {
  return values.length === 1 ? values[0]! : `{${values.join(", ")}}`;
}

function statementExplanation(
  label: "Statement I" | "Statement II",
  digits: readonly number[],
  targetAnswers: readonly string[],
  sufficient: boolean,
): string {
  const digitText = `{${digits.join(", ")}}`;
  if (sufficient) {
    return `${label} leaves possible X values ${digitText}. These all give the same asked answer (${formatAnswers(targetAnswers)}), so ${label} alone is sufficient.`;
  }
  return `${label} leaves possible X values ${digitText}, giving more than one possible asked answer ${formatAnswers(targetAnswers)}. So ${label} alone is not sufficient.`;
}

function buildExplanation(
  pair: SynthesizedPair,
  problem: NumberSystemProblem,
  digitsI: readonly number[],
  digitsII: readonly number[],
  digitsTogether: readonly number[],
): DsfCp001NumberSystemQuestion["explanation"] {
  const evaluation = pair.evaluation;
  const statementI = statementExplanation(
    "Statement I",
    digitsI,
    evaluation.statementI.normalizedTargetAnswers,
    evaluation.statementI.sufficient,
  );
  const statementII = statementExplanation(
    "Statement II",
    digitsII,
    evaluation.statementII.normalizedTargetAnswers,
    evaluation.statementII.sufficient,
  );
  const together = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? (evaluation.together.sufficient
      ? `Using both statements together leaves X = {${digitsTogether.join(", ")}} and fixes the asked answer as ${formatAnswers(evaluation.together.normalizedTargetAnswers)}.`
      : `Even together, X can still be {${digitsTogether.join(", ")}}, producing more than one possible asked answer ${formatAnswers(evaluation.together.normalizedTargetAnswers)}.`)
    : undefined;

  return {
    askedTarget: targetPrompt(problem),
    statementI,
    statementII,
    ...(together ? { together } : {}),
    conclusion: optionForClass(DS_STANDARD_5_EN, evaluation.classification).text,
  };
}

function misconceptionFor(semanticClass: SufficiencyClass): string {
  return `DSF-MC-CHOSE-${semanticClass}`;
}

function generationIdentity(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 24);
}

export function generateDsfCp001NumberSystemQuestion(seed: number): DsfCp001NumberSystemQuestion {
  if (!Number.isSafeInteger(seed)) throw new Error(`DSF CP-001 seed must be a safe integer: ${seed}`);
  const ql = DSF_PERMANENT_QL_REGISTRY[0];
  if (!ql || ql.qlId !== "DSF-QL-001") throw new Error("DSF-QL-001 is not allocated");

  let problem = buildProblem(seed);
  const targetClass = desiredClass(seed);
  let pair: SynthesizedPair | undefined;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      pair = synthesizePair(problem, seed + attempt * 1009, targetClass);
      break;
    } catch {
      const random = createRng(seed + attempt + 1, "retry-problem");
      const hundreds = 1 + Math.floor(random() * 9);
      const tens = Math.floor(random() * 10);
      const solveMode = attempt < 8 ? problem.solveMode : "DSF-SM-NUM-MISSING-DIGIT";
      problem = { template: `${hundreds}${tens}X`, solveMode };
    }
  }
  if (!pair) throw new Error(`DSF CP-001 failed to synthesize seed ${seed}/${targetClass}`);

  const worlds = enumerateWorlds(problem);
  const digitsI = worlds.filter(pair.statementI.test).map((world) => world.digit);
  const digitsII = worlds.filter(pair.statementII.test).map((world) => world.digit);
  const digitsTogether = worlds.filter((world) => pair!.statementI.test(world) && pair!.statementII.test(world)).map((world) => world.digit);
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
    throw new Error("DSF CP-001 answer-contract rendering failed");
  }

  const prompt = targetPrompt(problem);
  const stem = `The number ${problem.template} is a three-digit number, where X is a digit from 0 to 9. Decide whether the statements are sufficient to answer: ${prompt}`;
  const explanation = buildExplanation(pair, problem, digitsI, digitsII, digitsTogether);
  const identity = generationIdentity({
    runtime: DSF_CP001_RUNTIME_VERSION,
    seed,
    qlId: ql.qlId,
    template: problem.template,
    solveMode: problem.solveMode,
    statementI: pair.statementI.id,
    statementII: pair.statementII.id,
    classification: pair.evaluation.classification,
  });

  return Object.freeze({
    packageId: "DSF-001",
    checkpointId: "DSF-CP-001",
    qlId: "DSF-QL-001",
    runtimeVersion: DSF_CP001_RUNTIME_VERSION,
    seed,
    locale: "en-IN",
    difficulty: difficultyFor(pair, problem.solveMode),
    domainFamily: "QUANT",
    sourceChapterId: "NUM-001",
    sourceCapability: "NUM-001/foundation/divisibility",
    solveModeId: problem.solveMode,
    targetKind: targetKind(problem),
    answerContractId: "DS_STANDARD_5",
    taskDirection: "DATA_SUFFICIENCY",
    answerSemantic: "SUFFICIENCY_CLASS",
    stem,
    questionPrompt: prompt,
    statements: [
      { id: "I", statementRuleId: pair.statementI.id, text: pair.statementI.text },
      { id: "II", statementRuleId: pair.statementII.id, text: pair.statementII.text },
    ],
    options,
    correctIndex,
    canonicalAnswer: pair.evaluation.classification,
    explanation,
    proof: {
      baseDigits: worlds.map((world) => world.digit),
      statementIDigits: digitsI,
      statementIIDigits: digitsII,
      togetherDigits: digitsTogether,
      statementITargetAnswers: pair.evaluation.statementI.normalizedTargetAnswers,
      statementIITargetAnswers: pair.evaluation.statementII.normalizedTargetAnswers,
      togetherTargetAnswers: pair.evaluation.together.normalizedTargetAnswers,
      minimalSufficientSets: pair.evaluation.minimalSufficientSets,
    },
    sourceAncestry: ["NUM-001", "NUM-001/foundation/divisibility"],
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

export function generateDsfCp001NumberSystemBatch(seeds: readonly number[]): readonly DsfCp001NumberSystemQuestion[] {
  return seeds.map(generateDsfCp001NumberSystemQuestion);
}
