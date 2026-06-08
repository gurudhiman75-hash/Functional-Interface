import { getQuestionLanguageEntries, getTopology } from "./library";
import { largestPowerOfFiveReached, nBucket } from "./math";
import {
  NS_TRAIL_001_ARCHETYPE_ID,
  NS_TRAIL_001_CP_001,
  NS_TRAIL_001_CP_002,
  NS_TRAIL_001_CP_003,
  NS_TRAIL_001_CP_004,
  NS_TRAIL_001_CP_005,
  type NsTrail001CanonicalProblemId,
  type NsTrail001DifficultyBand,
  type NsTrail001ExpressionType,
  type NsTrail001Parameters,
  type NsTrail001PowerType,
  type NsTrail001ProductType,
  type NsTrail001TargetZeroBucket,
} from "./types";

export interface NsTrail001ParameterInput {
  seed?: string;
  difficultyBand?: NsTrail001DifficultyBand;
  questionLanguageId?: string;
  n?: number;
  expression?: string;
  numeratorTerms?: number[];
  denominatorTerms?: number[];
  zeroCount?: number;
  base?: number;
  exponent?: number;
  numberA?: number;
  numberB?: number;
}

interface Cp002Fixture {
  expressionType: NsTrail001ExpressionType;
  expression: string;
  numeratorTerms: number[];
  denominatorTerms: number[];
}

interface Cp003Fixture {
  targetZeroBucket: NsTrail001TargetZeroBucket;
  zeroCount: number;
}

interface Cp004Fixture {
  baseFactorizationType: NsTrail001PowerType;
  base: number;
  exponent: number;
}

interface Cp005Fixture {
  productType: NsTrail001ProductType;
  numberA: number;
  numberB: number;
}

export function hashSeed(seed: string) {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function stableBucket(seed: string, modulo: number) {
  if (modulo <= 0) return 0;
  return hashSeed(seed) % modulo;
}

export function generateCp001Parameters(input: NsTrail001ParameterInput = {}) {
  return generateParameters(NS_TRAIL_001_CP_001, input);
}
export function generateCp002Parameters(input: NsTrail001ParameterInput = {}) {
  return generateParameters(NS_TRAIL_001_CP_002, input);
}
export function generateCp003Parameters(input: NsTrail001ParameterInput = {}) {
  return generateParameters(NS_TRAIL_001_CP_003, input);
}
export function generateCp004Parameters(input: NsTrail001ParameterInput = {}) {
  return generateParameters(NS_TRAIL_001_CP_004, input);
}
export function generateCp005Parameters(input: NsTrail001ParameterInput = {}) {
  return generateParameters(NS_TRAIL_001_CP_005, input);
}

export function generateParameters(canonicalProblemId: NsTrail001CanonicalProblemId, input: NsTrail001ParameterInput = {}): NsTrail001Parameters {
  const seed = input.seed ?? `NS-TRAIL-001:${canonicalProblemId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficultyBand(seed);
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(canonicalProblemId, seed);
  const base = baseParameters(canonicalProblemId, difficultyBand, seed, questionLanguageId);

  if (canonicalProblemId === NS_TRAIL_001_CP_001) return { ...base, ...selectCp001(seed, difficultyBand, input) };
  if (canonicalProblemId === NS_TRAIL_001_CP_002) return { ...base, ...selectCp002(seed, input) };
  if (canonicalProblemId === NS_TRAIL_001_CP_003) return { ...base, ...selectCp003(seed, input) };
  if (canonicalProblemId === NS_TRAIL_001_CP_004) return { ...base, ...selectCp004(seed, input) };
  return { ...base, ...selectCp005(seed, input) };
}

function baseParameters(
  canonicalProblemId: NsTrail001CanonicalProblemId,
  difficultyBand: NsTrail001DifficultyBand,
  seed: string,
  questionLanguageId: string,
): Omit<NsTrail001Parameters, "n"> {
  return {
    archetypeId: NS_TRAIL_001_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: `NS-TRAIL-001:${canonicalProblemId}:${seed}`,
    sourceTrace: {
      sourceId: "NS-TRAIL-001-FULL-IMPLEMENTATION",
      sourceType: "approved-library-package",
      note: "Approved CP-001 through CP-005 implementation with human-owned educational language.",
    },
    topology: getTopology(canonicalProblemId),
    difficultyBand,
    questionLanguageId,
  };
}

function selectDifficultyBand(seed: string): NsTrail001DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectQuestionLanguageId(canonicalProblemId: NsTrail001CanonicalProblemId, seed: string) {
  const entries = getQuestionLanguageEntries(canonicalProblemId);
  return entries[stableBucket(`${seed}:ql`, entries.length)].id;
}

function selectCp001(seed: string, difficultyBand: NsTrail001DifficultyBand, input: NsTrail001ParameterInput) {
  const fixturePools: Record<NsTrail001DifficultyBand, number[]> = {
    Easy: [10, 20, 25, 50],
    Medium: [75, 100, 125, 250, 500],
    Hard: [625, 1000, 1250, 2500, 5000],
  };
  const pool = fixturePools[difficultyBand];
  const n = input.n ?? pool[stableBucket(`${seed}:n`, pool.length)];
  return {
    n,
    nBucket: nBucket(n),
    largestPowerOfFiveReached: largestPowerOfFiveReached(n),
  };
}

function selectCp002(seed: string, input: NsTrail001ParameterInput) {
  if (input.expression && input.numeratorTerms) {
    const numeratorTerms = input.numeratorTerms;
    const denominatorTerms = input.denominatorTerms ?? [];
    return {
      expression: input.expression,
      numeratorTerms,
      denominatorTerms,
      expressionType: denominatorTerms.length === 0 ? "numeratorOnly" : denominatorTerms.length === 1 ? "numeratorDenominator" : "cancellationCase",
    } satisfies Partial<NsTrail001Parameters>;
  }
  const fixture = CP002_FIXTURES[stableBucket(`${seed}:cp002`, CP002_FIXTURES.length)];
  return fixture;
}

function selectCp003(seed: string, input: NsTrail001ParameterInput) {
  if (typeof input.zeroCount === "number") {
    return { zeroCount: input.zeroCount, targetZeroBucket: targetZeroBucketFor(input.zeroCount) };
  }
  return CP003_FIXTURES[stableBucket(`${seed}:cp003`, CP003_FIXTURES.length)];
}

function selectCp004(seed: string, input: NsTrail001ParameterInput) {
  if (input.base && input.exponent) {
    return {
      base: input.base,
      exponent: input.exponent,
      baseFactorizationType: classifyPowerType(input.base),
    };
  }
  return CP004_FIXTURES[stableBucket(`${seed}:cp004`, CP004_FIXTURES.length)];
}

function selectCp005(seed: string, input: NsTrail001ParameterInput) {
  if (input.numberA && input.numberB) {
    return {
      numberA: input.numberA,
      numberB: input.numberB,
      productType: classifyProductType(input.numberA, input.numberB),
    };
  }
  return CP005_FIXTURES[stableBucket(`${seed}:cp005`, CP005_FIXTURES.length)];
}

function targetZeroBucketFor(zeroCount: number): NsTrail001TargetZeroBucket {
  if (zeroCount <= 5) return "smallZeroCount";
  if (zeroCount <= 50) return "mediumZeroCount";
  return "largeZeroCount";
}

function classifyPowerType(base: number): NsTrail001PowerType {
  const twos = countFactor(base, 2);
  const fives = countFactor(base, 5);
  if (twos > 0 && fives > 0 && twos === fives) return "balancedTwoFive";
  if (twos > fives && fives > 0) return "excessTwos";
  if (fives > twos && twos > 0) return "excessFives";
  return "noTrailingZero";
}

function classifyProductType(numberA: number, numberB: number): NsTrail001ProductType {
  const zerosA = Math.min(countFactor(numberA, 2), countFactor(numberA, 5));
  const zerosB = Math.min(countFactor(numberB, 2), countFactor(numberB, 5));
  const zerosProduct = Math.min(countFactor(numberA, 2) + countFactor(numberB, 2), countFactor(numberA, 5) + countFactor(numberB, 5));
  if (zerosProduct === 0) return "productNoZeroChange";
  if (zerosA + zerosB === 0) return "productCreatesZeros";
  return "productAddsZeros";
}

function countFactor(value: number, prime: number) {
  let count = 0;
  let current = value;
  while (current % prime === 0) {
    count += 1;
    current /= prime;
  }
  return count;
}

const CP002_FIXTURES: Cp002Fixture[] = [
  { expressionType: "numeratorOnly", expression: "50!", numeratorTerms: [50], denominatorTerms: [] },
  { expressionType: "numeratorDenominator", expression: "100! / 25!", numeratorTerms: [100], denominatorTerms: [25] },
  { expressionType: "cancellationCase", expression: "75! / (25! x 10!)", numeratorTerms: [75], denominatorTerms: [25, 10] },
  { expressionType: "numeratorOnly", expression: "125!", numeratorTerms: [125], denominatorTerms: [] },
  { expressionType: "numeratorDenominator", expression: "250! / 50!", numeratorTerms: [250], denominatorTerms: [50] },
  { expressionType: "cancellationCase", expression: "150! / (75! x 25!)", numeratorTerms: [150], denominatorTerms: [75, 25] },
];

const CP003_FIXTURES: Cp003Fixture[] = [
  { targetZeroBucket: "solutionExists", zeroCount: 1 },
  { targetZeroBucket: "smallZeroCount", zeroCount: 3 },
  { targetZeroBucket: "mediumZeroCount", zeroCount: 31 },
  { targetZeroBucket: "largeZeroCount", zeroCount: 156 },
];

const CP004_FIXTURES: Cp004Fixture[] = [
  { baseFactorizationType: "balancedTwoFive", base: 10, exponent: 3 },
  { baseFactorizationType: "excessTwos", base: 40, exponent: 2 },
  { baseFactorizationType: "excessFives", base: 250, exponent: 2 },
  { baseFactorizationType: "noTrailingZero", base: 8, exponent: 5 },
  { baseFactorizationType: "balancedTwoFive", base: 100, exponent: 4 },
  { baseFactorizationType: "excessTwos", base: 200, exponent: 3 },
  { baseFactorizationType: "excessFives", base: 1250, exponent: 2 },
  { baseFactorizationType: "noTrailingZero", base: 27, exponent: 4 },
];

const CP005_FIXTURES: Cp005Fixture[] = [
  { productType: "productCreatesZeros", numberA: 8, numberB: 125 },
  { productType: "productAddsZeros", numberA: 20, numberB: 50 },
  { productType: "productNoZeroChange", numberA: 12, numberB: 14 },
  { productType: "productCreatesZeros", numberA: 32, numberB: 625 },
  { productType: "productAddsZeros", numberA: 250, numberB: 40 },
  { productType: "productNoZeroChange", numberA: 27, numberB: 49 },
];
