import { getQuestionLanguageEntries, getTopology } from "./library";
import { largestPowerOfFiveReached, nBucket, trailingZerosFactorial } from "./math";
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
  factorialStructure: string;
  expression: string;
  numeratorTerms: number[];
  denominatorTerms: number[];
}

interface Cp003Fixture {
  targetZeroBucket: NsTrail001TargetZeroBucket;
  targetZeroMagnitude: string;
  zeroCount: number;
}

interface Cp004Fixture {
  baseFactorizationType: NsTrail001PowerType;
  baseFamily: string;
  exponentMagnitude: string;
  base: number;
  exponent: number;
}

interface Cp005Fixture {
  productType: NsTrail001ProductType;
  productStructure: string;
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
  const n = input.n ?? selectFactorialN(seed, difficultyBand);
  return {
    n,
    nBucket: nBucket(n),
    largestPowerOfFiveReached: largestPowerOfFiveReached(n),
    factorialMagnitude: factorialMagnitude(n),
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
      factorialStructure: factorialStructure(numeratorTerms, denominatorTerms),
    } satisfies Partial<NsTrail001Parameters>;
  }
  return buildCp002Fixture(seed);
}

function selectCp003(seed: string, input: NsTrail001ParameterInput) {
  if (typeof input.zeroCount === "number") {
    return { zeroCount: input.zeroCount, targetZeroBucket: targetZeroBucketFor(input.zeroCount), targetZeroMagnitude: targetZeroMagnitudeFor(input.zeroCount) };
  }
  return buildCp003Fixture(seed);
}

function selectCp004(seed: string, input: NsTrail001ParameterInput) {
  if (input.base && input.exponent) {
    return {
      base: input.base,
      exponent: input.exponent,
      baseFactorizationType: classifyPowerType(input.base),
      baseFamily: baseFamily(input.base),
      exponentMagnitude: exponentMagnitude(input.exponent),
    };
  }
  return buildCp004Fixture(seed);
}

function selectCp005(seed: string, input: NsTrail001ParameterInput) {
  if (input.numberA && input.numberB) {
    return {
      numberA: input.numberA,
      numberB: input.numberB,
      productType: classifyProductType(input.numberA, input.numberB),
      productStructure: productStructure(input.numberA, input.numberB),
    };
  }
  return buildCp005Fixture(seed);
}

function targetZeroBucketFor(zeroCount: number): NsTrail001TargetZeroBucket {
  if (zeroCount <= 3) return "solutionExists";
  if (zeroCount <= 5) return "smallZeroCount";
  if (zeroCount <= 50) return "mediumZeroCount";
  return "largeZeroCount";
}

function targetZeroMagnitudeFor(zeroCount: number) {
  if (zeroCount <= 3) return "verySmallZeroCount";
  if (zeroCount <= 24) return "smallZeroCount";
  if (zeroCount <= 124) return "mediumZeroCount";
  if (zeroCount <= 312) return "largeZeroCount";
  return "veryLargeZeroCount";
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

function selectFactorialN(seed: string, difficultyBand: NsTrail001DifficultyBand) {
  const buckets: Record<NsTrail001DifficultyBand, Array<[number, number]>> = {
    Easy: [
      [1, 4],
      [5, 24],
      [25, 124],
    ],
    Medium: [
      [25, 124],
      [125, 624],
      [625, 1500],
    ],
    Hard: [
      [625, 2500],
      [2501, 7500],
      [7501, 20000],
    ],
  };
  const range = buckets[difficultyBand][stableBucket(`${seed}:n-magnitude`, buckets[difficultyBand].length)];
  return range[0] + stableBucket(`${seed}:n-value`, range[1] - range[0] + 1);
}

function factorialMagnitude(n: number) {
  if (n < 5) return "below5";
  if (n < 25) return "between5And24";
  if (n < 125) return "between25And124";
  if (n < 625) return "between125And624";
  return "above625";
}

function buildCp002Fixture(seed: string): Cp002Fixture {
  const family = stableBucket(`${seed}:cp002-family`, 6);
  const offset = stableBucket(`${seed}:cp002-offset`, 90);
  if (family === 0) {
    const n = 40 + offset;
    return { expressionType: "numeratorOnly", factorialStructure: "twoFactorials", expression: `${n}!`, numeratorTerms: [n], denominatorTerms: [] };
  }
  if (family === 1) {
    const denominator = 30 + stableBucket(`${seed}:cp002-den`, 120);
    const numerator = denominator + 45 + stableBucket(`${seed}:cp002-gap`, 180);
    return {
      expressionType: "numeratorDenominator",
      factorialStructure: "largeGapFactorials",
      expression: `${numerator}! / ${denominator}!`,
      numeratorTerms: [numerator],
      denominatorTerms: [denominator],
    };
  }
  if (family === 2) {
    const denominator = 80 + stableBucket(`${seed}:cp002-close-den`, 200);
    const numerator = denominator + 1 + stableBucket(`${seed}:cp002-close-gap`, 8);
    return {
      expressionType: "numeratorDenominator",
      factorialStructure: "closeFactorials",
      expression: `${numerator}! / ${denominator}!`,
      numeratorTerms: [numerator],
      denominatorTerms: [denominator],
    };
  }
  if (family === 3) {
    const a = 120 + stableBucket(`${seed}:cp002-a`, 181);
    const b = 40 + stableBucket(`${seed}:cp002-b`, 90);
    const c = 20 + stableBucket(`${seed}:cp002-c`, 70);
    return {
      expressionType: "cancellationCase",
      factorialStructure: "threeFactorials",
      expression: `${a}! / (${b}! x ${c}!)`,
      numeratorTerms: [a],
      denominatorTerms: [b, c],
    };
  }
  if (family === 4) {
    const a = 200 + stableBucket(`${seed}:cp002-d`, 220);
    const b = a - 20 - stableBucket(`${seed}:cp002-e`, 90);
    return {
      expressionType: "numeratorDenominator",
      factorialStructure: "twoFactorials",
      expression: `${a}! / ${b}!`,
      numeratorTerms: [a],
      denominatorTerms: [b],
    };
  }
  const a = 250 + stableBucket(`${seed}:cp002-f`, 250);
  const b = a - 50 - stableBucket(`${seed}:cp002-g`, 130);
  const c = 25 + stableBucket(`${seed}:cp002-h`, 100);
  return {
    expressionType: "cancellationCase",
    factorialStructure: "largeGapFactorials",
    expression: `${a}! / (${b}! x ${c}!)`,
    numeratorTerms: [a],
    denominatorTerms: [b, c],
  };
}

function factorialStructure(numeratorTerms: readonly number[], denominatorTerms: readonly number[]) {
  const terms = numeratorTerms.length + denominatorTerms.length;
  if (terms >= 3) return "threeFactorials";
  if (terms === 2) {
    const gap = Math.abs((numeratorTerms[0] ?? 0) - (denominatorTerms[0] ?? 0));
    return gap <= 10 ? "closeFactorials" : gap >= 45 ? "largeGapFactorials" : "twoFactorials";
  }
  return "twoFactorials";
}

function buildCp003Fixture(seed: string): Cp003Fixture {
  const ranges: Array<[number, number]> = [
    [5, 24],
    [25, 124],
    [125, 624],
    [625, 2499],
    [2500, 12000],
  ];
  const range = ranges[stableBucket(`${seed}:cp003-magnitude`, ranges.length)];
  const n = range[0] + stableBucket(`${seed}:cp003-n`, range[1] - range[0] + 1);
  const zeroCount = trailingZerosFactorial(n);
  return {
    targetZeroBucket: targetZeroBucketFor(zeroCount),
    targetZeroMagnitude: targetZeroMagnitudeFor(zeroCount),
    zeroCount,
  };
}

function buildCp004Fixture(seed: string): Cp004Fixture {
  const family = stableBucket(`${seed}:cp004-family`, 4);
  const exponentPool = [
    2 + stableBucket(`${seed}:cp004-small-exp`, 9),
    11 + stableBucket(`${seed}:cp004-medium-exp`, 49),
    60 + stableBucket(`${seed}:cp004-large-exp`, 141),
  ];
  const exponent = exponentPool[stableBucket(`${seed}:cp004-exp-family`, exponentPool.length)];
  if (family === 0) {
    const base = 10 ** (1 + stableBucket(`${seed}:cp004-ten`, 6));
    return { baseFactorizationType: classifyPowerType(base), baseFamily: "powerOfTen", exponentMagnitude: exponentMagnitude(exponent), base, exponent };
  }
  if (family === 1) {
    const base = 2 ** (1 + stableBucket(`${seed}:cp004-two`, 14));
    return { baseFactorizationType: classifyPowerType(base), baseFamily: "powerOfTwo", exponentMagnitude: exponentMagnitude(exponent), base, exponent };
  }
  if (family === 2) {
    const base = 5 ** (1 + stableBucket(`${seed}:cp004-five`, 9));
    return { baseFactorizationType: classifyPowerType(base), baseFamily: "powerOfFive", exponentMagnitude: exponentMagnitude(exponent), base, exponent };
  }
  const twos = 1 + stableBucket(`${seed}:cp004-mixed-two`, 8);
  const fives = stableBucket(`${seed}:cp004-mixed-five`, 6);
  const noise = [3, 7, 9, 11, 13, 18, 27, 31][stableBucket(`${seed}:cp004-mixed-noise`, 8)];
  const base = 2 ** twos * 5 ** fives * noise;
  return { baseFactorizationType: classifyPowerType(base), baseFamily: "mixedBase", exponentMagnitude: exponentMagnitude(exponent), base, exponent };
}

function baseFamily(base: number) {
  const factors = countFactor(base, 2) + countFactor(base, 5);
  if (base === 10 ** Math.round(Math.log10(base))) return "powerOfTen";
  if (2 ** Math.round(Math.log2(base)) === base) return "powerOfTwo";
  if (5 ** Math.round(Math.log(base) / Math.log(5)) === base) return "powerOfFive";
  return factors > 0 ? "mixedBase" : "mixedBase";
}

function exponentMagnitude(exponent: number) {
  if (exponent <= 10) return "smallExponent";
  if (exponent <= 39) return "mediumExponent";
  return "largeExponent";
}

function buildCp005Fixture(seed: string): Cp005Fixture {
  const family = stableBucket(`${seed}:cp005-family`, 5);
  if (family === 0) {
    const a = 10 * (2 + stableBucket(`${seed}:cp005-zeros-a`, 80));
    const b = 5 * (4 + stableBucket(`${seed}:cp005-zeros-b`, 120));
    return { productType: classifyProductType(a, b), productStructure: "alreadyHasZeros", numberA: a, numberB: b };
  }
  if (family === 1) {
    const a = 2 ** (3 + stableBucket(`${seed}:cp005-two`, 15));
    const b = 5 ** (3 + stableBucket(`${seed}:cp005-five-side`, 7));
    return { productType: classifyProductType(a, b), productStructure: "oneSideProvidesTwos", numberA: a, numberB: b };
  }
  if (family === 2) {
    const a = 5 ** (3 + stableBucket(`${seed}:cp005-five`, 7));
    const b = 2 ** (4 + stableBucket(`${seed}:cp005-two-side`, 15));
    return { productType: classifyProductType(a, b), productStructure: "oneSideProvidesFives", numberA: a, numberB: b };
  }
  if (family === 3) {
    const a = (2 + stableBucket(`${seed}:cp005-pair-a`, 90)) * 5 ** (1 + stableBucket(`${seed}:cp005-pair-five`, 4));
    const b = (3 + stableBucket(`${seed}:cp005-pair-b`, 120)) * 10;
    return { productType: classifyProductType(a, b), productStructure: "bothSidesProvidePairs", numberA: a, numberB: b };
  }
  const primeNoise = [7, 11, 13, 17, 19, 23, 29][stableBucket(`${seed}:cp005-prime`, 7)];
  const a = primeNoise * (27 + 2 * stableBucket(`${seed}:cp005-noise-a`, 120));
  const b = [7, 11, 13, 17, 19, 23][stableBucket(`${seed}:cp005-noise-b`, 6)] * (3 + stableBucket(`${seed}:cp005-noise-c`, 90));
  return { productType: classifyProductType(a, b), productStructure: "largePrimeNoise", numberA: a, numberB: b };
}

function productStructure(numberA: number, numberB: number) {
  const zerosA = Math.min(countFactor(numberA, 2), countFactor(numberA, 5));
  const zerosB = Math.min(countFactor(numberB, 2), countFactor(numberB, 5));
  if (zerosA > 0 || zerosB > 0) return "alreadyHasZeros";
  if (countFactor(numberA, 2) + countFactor(numberB, 2) > 0 && countFactor(numberA, 5) + countFactor(numberB, 5) > 0) return "bothSidesProvidePairs";
  return "largePrimeNoise";
}

const CP002_FIXTURES: Cp002Fixture[] = [
  { expressionType: "numeratorOnly", factorialStructure: "twoFactorials", expression: "50!", numeratorTerms: [50], denominatorTerms: [] },
  { expressionType: "numeratorDenominator", factorialStructure: "largeGapFactorials", expression: "100! / 25!", numeratorTerms: [100], denominatorTerms: [25] },
  { expressionType: "cancellationCase", factorialStructure: "threeFactorials", expression: "75! / (25! x 10!)", numeratorTerms: [75], denominatorTerms: [25, 10] },
  { expressionType: "numeratorOnly", factorialStructure: "twoFactorials", expression: "125!", numeratorTerms: [125], denominatorTerms: [] },
  { expressionType: "numeratorDenominator", factorialStructure: "largeGapFactorials", expression: "250! / 50!", numeratorTerms: [250], denominatorTerms: [50] },
  { expressionType: "cancellationCase", factorialStructure: "threeFactorials", expression: "150! / (75! x 25!)", numeratorTerms: [150], denominatorTerms: [75, 25] },
];

const CP003_FIXTURES: Cp003Fixture[] = [
  { targetZeroBucket: "solutionExists", targetZeroMagnitude: "verySmallZeroCount", zeroCount: 1 },
  { targetZeroBucket: "smallZeroCount", targetZeroMagnitude: "smallZeroCount", zeroCount: 3 },
  { targetZeroBucket: "mediumZeroCount", targetZeroMagnitude: "mediumZeroCount", zeroCount: 31 },
  { targetZeroBucket: "largeZeroCount", targetZeroMagnitude: "largeZeroCount", zeroCount: 156 },
];

const CP004_FIXTURES: Cp004Fixture[] = [
  { baseFactorizationType: "balancedTwoFive", baseFamily: "powerOfTen", exponentMagnitude: "smallExponent", base: 10, exponent: 3 },
  { baseFactorizationType: "excessTwos", baseFamily: "mixedBase", exponentMagnitude: "smallExponent", base: 40, exponent: 2 },
  { baseFactorizationType: "excessFives", baseFamily: "mixedBase", exponentMagnitude: "smallExponent", base: 250, exponent: 2 },
  { baseFactorizationType: "noTrailingZero", baseFamily: "powerOfTwo", exponentMagnitude: "smallExponent", base: 8, exponent: 5 },
  { baseFactorizationType: "balancedTwoFive", baseFamily: "powerOfTen", exponentMagnitude: "smallExponent", base: 100, exponent: 4 },
  { baseFactorizationType: "excessTwos", baseFamily: "mixedBase", exponentMagnitude: "smallExponent", base: 200, exponent: 3 },
  { baseFactorizationType: "excessFives", baseFamily: "mixedBase", exponentMagnitude: "smallExponent", base: 1250, exponent: 2 },
  { baseFactorizationType: "noTrailingZero", baseFamily: "mixedBase", exponentMagnitude: "smallExponent", base: 27, exponent: 4 },
];

const CP005_FIXTURES: Cp005Fixture[] = [
  { productType: "productCreatesZeros", productStructure: "oneSideProvidesTwos", numberA: 8, numberB: 125 },
  { productType: "productAddsZeros", productStructure: "alreadyHasZeros", numberA: 20, numberB: 50 },
  { productType: "productNoZeroChange", productStructure: "largePrimeNoise", numberA: 12, numberB: 14 },
  { productType: "productCreatesZeros", productStructure: "oneSideProvidesTwos", numberA: 32, numberB: 625 },
  { productType: "productAddsZeros", productStructure: "bothSidesProvidePairs", numberA: 250, numberB: 40 },
  { productType: "productNoZeroChange", productStructure: "largePrimeNoise", numberA: 27, numberB: 49 },
];
