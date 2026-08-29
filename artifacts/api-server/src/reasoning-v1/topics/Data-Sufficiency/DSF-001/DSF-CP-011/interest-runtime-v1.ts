import { createHash } from "node:crypto";
import {
  DS_STANDARD_5_EN,
  SUFFICIENCY_CLASSES,
  evaluateFiniteDomainPair,
  optionForClass,
  type SufficiencyClass,
  type TwoStatementSufficiencyEvaluation,
} from "../foundation/index.ts";
import {
  simpleInterest,
  compoundInterest,
  compoundAmount,
  siCiDifference,
} from "../../../../../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/cp006-si-ci-relations-runtime-v1.ts";
import { rat, type Rational } from "../../../../../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/cp003-exam-model.ts";

export const DSF_CP011_INTEREST_RUNTIME_VERSION = "DSF_CP011_INTEREST_RUNTIME_V1" as const;
export const DSF_CP011_INTEREST_SOLVE_MODES = [
  "DSF-SM-INT-SIMPLE-INTEREST",
  "DSF-SM-INT-COMPOUND-INTEREST",
  "DSF-SM-INT-COMPOUND-AMOUNT",
  "DSF-SM-INT-CI-MINUS-SI",
] as const;

export type DsfCp011InterestSolveMode = (typeof DSF_CP011_INTEREST_SOLVE_MODES)[number];
export type DsfCp011InterestDifficulty = "Easy" | "Medium" | "Hard";
export type DsfCp011InterestTargetKind = "SIMPLE_INTEREST" | "COMPOUND_INTEREST" | "COMPOUND_AMOUNT" | "CI_MINUS_SI";

type InterestContextId =
  | "BANK_DEPOSIT"
  | "POST_OFFICE_SCHEME"
  | "COOPERATIVE_DEPOSIT"
  | "SAVINGS_PLAN"
  | "EDUCATION_FUND"
  | "BUSINESS_RESERVE";

type StatementFamily =
  | "PRINCIPAL_EXACT"
  | "RATE_EXACT"
  | "TIME_EXACT"
  | "SIMPLE_INTEREST_EXACT"
  | "COMPOUND_INTEREST_EXACT"
  | "COMPOUND_AMOUNT_EXACT"
  | "DIFFERENCE_EXACT"
  | "PRINCIPAL_RATE_PAIR"
  | "PRINCIPAL_TIME_PAIR"
  | "RATE_TIME_PAIR"
  | "FULL_PARAMETER_TRIPLE"
  | "PRINCIPAL_BOUND"
  | "RATE_BOUND"
  | "TIME_BOUND";

interface InterestContext {
  readonly id: InterestContextId;
  readonly intro: readonly string[];
}

interface InterestWorld {
  readonly principal: number;
  readonly ratePercent: number;
  readonly years: 1 | 2 | 3;
  readonly simpleInterest: Rational;
  readonly compoundInterest: Rational;
  readonly compoundAmount: Rational;
  readonly difference: Rational;
}

interface InterestProblem {
  readonly anchor: InterestWorld;
  readonly solveMode: DsfCp011InterestSolveMode;
  readonly targetKind: DsfCp011InterestTargetKind;
  readonly context: InterestContext;
  readonly surfaceVariant: number;
}

interface InterestStatement {
  readonly id: string;
  readonly family: StatementFamily;
  readonly complexity: 1 | 2 | 3;
  readonly text: string;
  readonly test: (world: InterestWorld) => boolean;
}

interface SynthesizedInterestPair {
  readonly statementI: InterestStatement;
  readonly statementII: InterestStatement;
  readonly evaluation: TwoStatementSufficiencyEvaluation<string>;
  readonly qualityScore: number;
}

const CONTEXTS: readonly InterestContext[] = [
  {
    id: "BANK_DEPOSIT",
    intro: [
      "A sum is placed in a bank deposit at a fixed annual rate.",
      "Consider a bank deposit earning interest at one annual rate.",
      "A depositor places a sum with a bank for a fixed period.",
      "The interest record of a bank deposit is being examined.",
    ],
  },
  {
    id: "POST_OFFICE_SCHEME",
    intro: [
      "A sum is invested in a post-office savings scheme.",
      "Consider a post-office deposit carrying a fixed annual rate.",
      "An investor places money in a post-office scheme for a stated period.",
      "The return on a post-office deposit is under consideration.",
    ],
  },
  {
    id: "COOPERATIVE_DEPOSIT",
    intro: [
      "A cooperative accepts a deposit at a fixed annual rate.",
      "Consider a sum deposited with a cooperative for a fixed period.",
      "The interest on a cooperative deposit is being reviewed.",
      "A member keeps a sum in a cooperative deposit scheme.",
    ],
  },
  {
    id: "SAVINGS_PLAN",
    intro: [
      "A saver puts a sum into a fixed-rate savings plan.",
      "Consider a savings plan with one annual rate for the full period.",
      "A fixed sum remains in a savings plan for several years.",
      "The return from a fixed-rate savings plan is being analysed.",
    ],
  },
  {
    id: "EDUCATION_FUND",
    intro: [
      "A sum is set aside in an education fund at a fixed annual rate.",
      "Consider an education fund earning interest for a fixed period.",
      "Money placed in an education fund grows at one annual rate.",
      "The interest earned by an education fund is being checked.",
    ],
  },
  {
    id: "BUSINESS_RESERVE",
    intro: [
      "A business keeps a reserve sum in an interest-bearing account.",
      "Consider a business reserve invested at a fixed annual rate.",
      "A reserve amount is kept invested for a fixed number of years.",
      "The interest return on a business reserve is being reviewed.",
    ],
  },
] as const;

function hashSeed(seed: number, salt: string): number {
  let hash = 2166136261;
  const text = `${DSF_CP011_INTEREST_RUNTIME_VERSION}:${seed}:${salt}`;
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
  return SUFFICIENCY_CLASSES[Math.abs(seed) % SUFFICIENCY_CLASSES.length]!;
}

function rationalKey(value: Rational): string {
  return `${value.numerator}/${value.denominator}`;
}

function formatMoney(value: Rational): string {
  const hundredthsNumerator = value.numerator * 100n;
  if (hundredthsNumerator % value.denominator !== 0n) return `₹${rationalKey(value)}`;
  const hundredths = hundredthsNumerator / value.denominator;
  const whole = hundredths / 100n;
  const fraction = hundredths < 0n ? -(hundredths % 100n) : hundredths % 100n;
  if (fraction === 0n) return `₹${whole}`;
  if (fraction % 10n === 0n) return `₹${whole}.${fraction / 10n}`;
  return `₹${whole}.${fraction.toString().padStart(2, "0")}`;
}

function sameRational(a: Rational, b: Rational): boolean {
  return a.numerator === b.numerator && a.denominator === b.denominator;
}

function enumerateWorlds(): readonly InterestWorld[] {
  const worlds: InterestWorld[] = [];
  const principals = [10000, 12000, 16000, 20000, 25000, 32000, 40000, 50000, 80000, 100000] as const;
  const rates = [5, 10, 20, 25] as const;
  for (const principal of principals) {
    for (const ratePercent of rates) {
      for (const years of [1, 2, 3] as const) {
        const p = rat(principal);
        const rate = rat(ratePercent);
        worlds.push({
          principal,
          ratePercent,
          years,
          simpleInterest: simpleInterest(p, rate, years),
          compoundInterest: compoundInterest(p, rate, years),
          compoundAmount: compoundAmount(p, rate, years),
          difference: siCiDifference(p, rate, years),
        });
      }
    }
  }
  return worlds;
}

const BASE_WORLDS = enumerateWorlds();
const SOURCE_ANSWER_CACHE = new Map<string, string>();

function sourceAnswer(problem: InterestProblem, world: InterestWorld): string {
  const cacheKey = `${problem.solveMode}|${world.principal}|${world.ratePercent}|${world.years}`;
  const cached = SOURCE_ANSWER_CACHE.get(cacheKey);
  if (cached) return cached;
  const p = rat(world.principal);
  const rate = rat(world.ratePercent);
  let answer: Rational;
  switch (problem.solveMode) {
    case "DSF-SM-INT-SIMPLE-INTEREST": answer = simpleInterest(p, rate, world.years); break;
    case "DSF-SM-INT-COMPOUND-INTEREST": answer = compoundInterest(p, rate, world.years); break;
    case "DSF-SM-INT-COMPOUND-AMOUNT": answer = compoundAmount(p, rate, world.years); break;
    case "DSF-SM-INT-CI-MINUS-SI": answer = siCiDifference(p, rate, world.years); break;
  }
  const normalized = formatMoney(answer);
  SOURCE_ANSWER_CACHE.set(cacheKey, normalized);
  return normalized;
}

const adapter = {
  adapterId: "DSF-ADAPTER-INT-001-CP011-V1",
  domainFamily: "QUANT" as const,
  sourceChapterId: "INT-001",
  enumerateBaseWorlds(_problem: InterestProblem): readonly InterestWorld[] {
    return BASE_WORLDS;
  },
  statementHolds(_problem: InterestProblem, world: InterestWorld, statement: InterestStatement): boolean {
    return statement.test(world);
  },
  evaluateTarget(problem: InterestProblem, world: InterestWorld): string {
    return sourceAnswer(problem, world);
  },
  normalizeAnswer(answer: string): string {
    return answer;
  },
};

function targetForMode(mode: DsfCp011InterestSolveMode): DsfCp011InterestTargetKind {
  switch (mode) {
    case "DSF-SM-INT-SIMPLE-INTEREST": return "SIMPLE_INTEREST";
    case "DSF-SM-INT-COMPOUND-INTEREST": return "COMPOUND_INTEREST";
    case "DSF-SM-INT-COMPOUND-AMOUNT": return "COMPOUND_AMOUNT";
    case "DSF-SM-INT-CI-MINUS-SI": return "CI_MINUS_SI";
  }
}

function buildProblem(seed: number, attempt = 0): InterestProblem {
  const solveMode = DSF_CP011_INTEREST_SOLVE_MODES[Math.abs(seed + attempt * 13) % DSF_CP011_INTEREST_SOLVE_MODES.length]!;
  const random = createRng(seed + attempt * 7919, `problem:${solveMode}`);
  let anchor = pick(random, BASE_WORLDS);
  if (solveMode === "DSF-SM-INT-CI-MINUS-SI" && anchor.years === 1) {
    const candidates = BASE_WORLDS.filter((world) => world.years >= 2);
    anchor = pick(random, candidates);
  }
  const context = CONTEXTS[Math.abs(Math.floor(seed / DSF_CP011_INTEREST_SOLVE_MODES.length) + attempt) % CONTEXTS.length]!;
  const surfaceVariant = Math.abs(Math.floor(seed / (DSF_CP011_INTEREST_SOLVE_MODES.length * CONTEXTS.length)) + attempt) % context.intro.length;
  return { anchor, solveMode, targetKind: targetForMode(solveMode), context, surfaceVariant };
}

function buildStatementPool(problem: InterestProblem): readonly InterestStatement[] {
  const a = problem.anchor;
  const principalLow = Math.max(5000, a.principal - 10000);
  const principalHigh = a.principal + 10000;
  const rateLow = Math.max(0, a.ratePercent - 5);
  const rateHigh = Math.min(30, a.ratePercent + 5);
  return [
    {
      id: `P_EQ_${a.principal}`,
      family: "PRINCIPAL_EXACT",
      complexity: 1,
      text: `The principal is ₹${a.principal}.`,
      test: (world) => world.principal === a.principal,
    },
    {
      id: `R_EQ_${a.ratePercent}`,
      family: "RATE_EXACT",
      complexity: 1,
      text: `The annual rate is ${a.ratePercent}%.`,
      test: (world) => world.ratePercent === a.ratePercent,
    },
    {
      id: `T_EQ_${a.years}`,
      family: "TIME_EXACT",
      complexity: 1,
      text: `The money remains invested for ${a.years} ${a.years === 1 ? "year" : "years"}.`,
      test: (world) => world.years === a.years,
    },
    {
      id: `SI_EQ_${rationalKey(a.simpleInterest)}`,
      family: "SIMPLE_INTEREST_EXACT",
      complexity: 1,
      text: `The simple interest for the full period is ${formatMoney(a.simpleInterest)}.`,
      test: (world) => sameRational(world.simpleInterest, a.simpleInterest),
    },
    {
      id: `CI_EQ_${rationalKey(a.compoundInterest)}`,
      family: "COMPOUND_INTEREST_EXACT",
      complexity: 1,
      text: `With annual compounding, the compound interest for the full period is ${formatMoney(a.compoundInterest)}.`,
      test: (world) => sameRational(world.compoundInterest, a.compoundInterest),
    },
    {
      id: `CA_EQ_${rationalKey(a.compoundAmount)}`,
      family: "COMPOUND_AMOUNT_EXACT",
      complexity: 1,
      text: `With annual compounding, the final amount is ${formatMoney(a.compoundAmount)}.`,
      test: (world) => sameRational(world.compoundAmount, a.compoundAmount),
    },
    {
      id: `D_EQ_${rationalKey(a.difference)}`,
      family: "DIFFERENCE_EXACT",
      complexity: 1,
      text: `For the full period, compound interest exceeds simple interest by ${formatMoney(a.difference)}.`,
      test: (world) => sameRational(world.difference, a.difference),
    },
    {
      id: `P_R_${a.principal}_${a.ratePercent}`,
      family: "PRINCIPAL_RATE_PAIR",
      complexity: 2,
      text: `The principal is ₹${a.principal} and the annual rate is ${a.ratePercent}%.`,
      test: (world) => world.principal === a.principal && world.ratePercent === a.ratePercent,
    },
    {
      id: `P_T_${a.principal}_${a.years}`,
      family: "PRINCIPAL_TIME_PAIR",
      complexity: 2,
      text: `The principal is ₹${a.principal} and the period is ${a.years} ${a.years === 1 ? "year" : "years"}.`,
      test: (world) => world.principal === a.principal && world.years === a.years,
    },
    {
      id: `R_T_${a.ratePercent}_${a.years}`,
      family: "RATE_TIME_PAIR",
      complexity: 2,
      text: `The annual rate is ${a.ratePercent}% and the period is ${a.years} ${a.years === 1 ? "year" : "years"}.`,
      test: (world) => world.ratePercent === a.ratePercent && world.years === a.years,
    },
    {
      id: `P_R_T_${a.principal}_${a.ratePercent}_${a.years}`,
      family: "FULL_PARAMETER_TRIPLE",
      complexity: 3,
      text: `The principal is ₹${a.principal}, the annual rate is ${a.ratePercent}%, and the period is ${a.years} ${a.years === 1 ? "year" : "years"}.`,
      test: (world) => world.principal === a.principal && world.ratePercent === a.ratePercent && world.years === a.years,
    },
    {
      id: `P_GT_${principalLow}`,
      family: "PRINCIPAL_BOUND",
      complexity: 2,
      text: `The principal is greater than ₹${principalLow}.`,
      test: (world) => world.principal > principalLow,
    },
    {
      id: `P_LT_${principalHigh}`,
      family: "PRINCIPAL_BOUND",
      complexity: 2,
      text: `The principal is less than ₹${principalHigh}.`,
      test: (world) => world.principal < principalHigh,
    },
    {
      id: `R_GT_${rateLow}`,
      family: "RATE_BOUND",
      complexity: 2,
      text: `The annual rate is greater than ${rateLow}%.`,
      test: (world) => world.ratePercent > rateLow,
    },
    {
      id: `R_LT_${rateHigh}`,
      family: "RATE_BOUND",
      complexity: 2,
      text: `The annual rate is less than ${rateHigh}%.`,
      test: (world) => world.ratePercent < rateHigh,
    },
    {
      id: `T_${a.years === 1 ? "LE2" : "GE2"}`,
      family: "TIME_BOUND",
      complexity: 2,
      text: a.years === 1 ? "The investment period is less than 3 years." : "The investment period is at least 2 years.",
      test: (world) => a.years === 1 ? world.years < 3 : world.years >= 2,
    },
  ];
}

function survivors(statement: InterestStatement): readonly InterestWorld[] {
  return BASE_WORLDS.filter(statement.test);
}

function pairQuality(first: InterestStatement, second: InterestStatement, evaluation: TwoStatementSufficiencyEvaluation<string>): number {
  const familyBonus = first.family === second.family ? -5 : 6;
  const conjunctionBonus = evaluation.classification === "BOTH_TOGETHER_ONLY" ? 9 : 0;
  const insufficientBonus = evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER" ? 4 : 0;
  const complexityVariety = first.complexity === second.complexity ? 0 : 2;
  const breadth = Math.min(survivors(first).length, 45) + Math.min(survivors(second).length, 45);
  return familyBonus + conjunctionBonus + insufficientBonus + complexityVariety + Math.floor(breadth / 18) - first.complexity - second.complexity;
}

function synthesizePair(problem: InterestProblem, seed: number, targetClass: SufficiencyClass): SynthesizedInterestPair {
  const statements = buildStatementPool(problem);
  const candidates: SynthesizedInterestPair[] = [];
  for (const statementI of statements) {
    for (const statementII of statements) {
      if (statementI.id === statementII.id) continue;
      try {
        const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
        if (evaluation.classification !== targetClass) continue;
        candidates.push({ statementI, statementII, evaluation, qualityScore: pairQuality(statementI, statementII, evaluation) });
      } catch {
        // Empty conjunctions and invariant failures are generation rejects.
      }
    }
  }
  if (candidates.length === 0) throw new Error(`No INT-001 pair for ${targetClass}/${problem.solveMode}`);
  const best = Math.max(...candidates.map((candidate) => candidate.qualityScore));
  const shortlist = candidates.filter((candidate) => candidate.qualityScore >= best - 3);
  return pick(createRng(seed, `pair:${targetClass}:${problem.solveMode}`), shortlist);
}

function targetPrompt(problem: InterestProblem): string {
  switch (problem.targetKind) {
    case "SIMPLE_INTEREST": return "What is the simple interest for the full period?";
    case "COMPOUND_INTEREST": return "What is the compound interest for the full period if interest is compounded annually?";
    case "COMPOUND_AMOUNT": return "What is the final amount if interest is compounded annually?";
    case "CI_MINUS_SI": return "By how much does annual compound interest exceed simple interest over the full period?";
  }
}

function explanationForStatement(label: string, targetAnswers: readonly string[], sufficient: boolean): string {
  if (sufficient) return `${label} fixes the asked value at ${targetAnswers[0]}. Therefore, ${label} alone is sufficient.`;
  const examples = targetAnswers.slice(0, 2);
  if (examples.length >= 2) return `${label} permits at least two different answers, ${examples[0]} and ${examples[1]}. Therefore, ${label} alone is not sufficient.`;
  return `${label} does not fix a unique answer. Therefore, ${label} alone is not sufficient.`;
}

function difficultyFor(pair: SynthesizedInterestPair): DsfCp011InterestDifficulty {
  if (pair.evaluation.classification === "BOTH_TOGETHER_ONLY" || pair.evaluation.classification === "INSUFFICIENT_EVEN_TOGETHER") return "Hard";
  if (pair.evaluation.classification === "STATEMENT_I_ONLY" || pair.evaluation.classification === "STATEMENT_II_ONLY") return "Easy";
  return "Medium";
}

function generationIdentity(seed: number, problem: InterestProblem, pair: SynthesizedInterestPair): string {
  return createHash("sha256")
    .update(`${DSF_CP011_INTEREST_RUNTIME_VERSION}|${seed}|${problem.solveMode}|${problem.context.id}|${pair.statementI.id}|${pair.statementII.id}`)
    .digest("hex")
    .slice(0, 24);
}

export function normalizeDsfCp011InterestSurface(text: string): string {
  return text
    .toLowerCase()
    .replace(/₹\s*/g, "₹")
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/[^a-z#₹%]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function sourceFunctionName(problem: InterestProblem): string {
  switch (problem.solveMode) {
    case "DSF-SM-INT-SIMPLE-INTEREST": return "simpleInterest";
    case "DSF-SM-INT-COMPOUND-INTEREST": return "compoundInterest";
    case "DSF-SM-INT-COMPOUND-AMOUNT": return "compoundAmount";
    case "DSF-SM-INT-CI-MINUS-SI": return "siCiDifference";
  }
}

export function generateDsfCp011InterestQuestion(seed: number) {
  const targetClass = desiredClass(seed);
  let problem: InterestProblem | undefined;
  let pair: SynthesizedInterestPair | undefined;
  let lastError: unknown;
  for (let attempt = 0; attempt < 36; attempt += 1) {
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
  if (!problem || !pair) throw lastError instanceof Error ? lastError : new Error(`Unable to synthesize INT-001 DS question for seed ${seed}`);

  const evaluation = pair.evaluation;
  const prompt = targetPrompt(problem);
  const stem = `${problem.context.intro[problem.surfaceVariant]} ${prompt}`;
  const correct = optionForClass(DS_STANDARD_5_EN, evaluation.classification);
  const togetherExplanation = !evaluation.statementI.sufficient && !evaluation.statementII.sufficient
    ? (evaluation.together.sufficient
      ? `Using both statements together fixes the asked value at ${evaluation.together.normalizedTargetAnswers[0]}. So the two statements together are sufficient.`
      : `Even together, the statements allow different answers such as ${evaluation.together.normalizedTargetAnswers.slice(0, 2).join(" and ")}. So they are still insufficient.`)
    : undefined;
  const sourceFunction = sourceFunctionName(problem);

  return Object.freeze({
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-011" as const,
    qlId: "DSF-QL-001" as const,
    runtimeVersion: DSF_CP011_INTEREST_RUNTIME_VERSION,
    seed,
    locale: "en-IN" as const,
    difficulty: difficultyFor(pair),
    domainFamily: "QUANT" as const,
    sourceChapterId: "INT-001" as const,
    sourceDomain: "SIMPLE_COMPOUND_INTEREST" as const,
    sourceCapability: "INT-001/cp006-si-ci-relations-runtime-v1" as const,
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
      sourceSolver: sourceFunction,
      canonicalArithmeticOwnedByDsf: false as const,
    },
    sourceAncestry: ["INT-001", `INT-001/cp006-si-ci-relations-runtime-v1::${sourceFunction}`] as const,
    generationIdentity: generationIdentity(seed, problem, pair),
    studentSurfaceFingerprint: `${normalizeDsfCp011InterestSurface(stem)}|${problem.solveMode}|${pair.statementI.family}|${pair.statementII.family}`,
    lifecycle: {
      contentStatus: "CP011_EXPANSION_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}

export function generateDsfCp011InterestBatch(seeds: readonly number[]) {
  return seeds.map(generateDsfCp011InterestQuestion);
}
