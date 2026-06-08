import { getTopology } from "./library";
import {
  HIGHLY_COMPOSITE_NUMBERS,
  buildFactorModel,
  isPrime,
  ordinalDisplay,
} from "./math";
import {
  NS_FAC_001_ARCHETYPE_ID,
  NS_FAC_001_CP_001,
  NS_FAC_001_CP_002,
  NS_FAC_001_CP_003,
  NS_FAC_001_CP_004,
  NS_FAC_001_CP_005,
  NS_FAC_001_CP_006,
  NS_FAC_001_CP_007,
  NS_FAC_001_CP_008,
  NS_FAC_001_CP_009,
  type NsFac001CanonicalProblemId,
  type NsFac001DifficultyBand,
  type NsFac001Parameters,
} from "./types";

export interface NsFac001ParameterInput {
  seed?: string;
  difficultyBand?: NsFac001DifficultyBand;
  number?: number;
  k?: number;
  position?: number;
}

type NumberShape = "prime_input" | "composite_input" | "prime_power" | "mixed_prime" | "perfect_square" | "non_perfect_square" | "highly_composite";
type EdgePosition = "first" | "second" | "middle" | "penultimate" | "last" | "general";

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

export function generateCp001Parameters(input: NsFac001ParameterInput = {}) {
  return generateParameters(NS_FAC_001_CP_001, input);
}
export function generateCp002Parameters(input: NsFac001ParameterInput = {}) {
  return generateParameters(NS_FAC_001_CP_002, input);
}
export function generateCp003Parameters(input: NsFac001ParameterInput = {}) {
  return generateParameters(NS_FAC_001_CP_003, input);
}
export function generateCp004Parameters(input: NsFac001ParameterInput = {}) {
  return generateParameters(NS_FAC_001_CP_004, input);
}
export function generateCp005Parameters(input: NsFac001ParameterInput = {}) {
  return generateParameters(NS_FAC_001_CP_005, input);
}
export function generateCp006Parameters(input: NsFac001ParameterInput = {}) {
  return generateParameters(NS_FAC_001_CP_006, input);
}
export function generateCp007Parameters(input: NsFac001ParameterInput = {}) {
  return generateParameters(NS_FAC_001_CP_007, input);
}
export function generateCp008Parameters(input: NsFac001ParameterInput = {}) {
  return generateParameters(NS_FAC_001_CP_008, input);
}
export function generateCp009Parameters(input: NsFac001ParameterInput = {}) {
  return generateParameters(NS_FAC_001_CP_009, input);
}

function generateParameters(canonicalProblemId: NsFac001CanonicalProblemId, input: NsFac001ParameterInput): NsFac001Parameters {
  const seed = input.seed ?? `NS-FAC-001:${canonicalProblemId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficultyBand(seed);
  const number = input.number ?? selectNumber(seed, difficultyBand, canonicalProblemId);
  const factorModel = buildFactorModel(number);
  const base = baseParameters(canonicalProblemId, difficultyBand, seed, number);

  if (canonicalProblemId === NS_FAC_001_CP_006 || canonicalProblemId === NS_FAC_001_CP_007) {
    const k = input.k ?? selectK(seed, factorModel.factorList);
    return { ...base, k };
  }

  if (canonicalProblemId === NS_FAC_001_CP_008 || canonicalProblemId === NS_FAC_001_CP_009) {
    const position = input.position ?? selectPosition(seed, factorModel.factorCount);
    return { ...base, position, ordinalDisplay: ordinalDisplay(position) };
  }

  return base;
}

function baseParameters(
  canonicalProblemId: NsFac001CanonicalProblemId,
  difficultyBand: NsFac001DifficultyBand,
  seed: string,
  number: number,
): NsFac001Parameters {
  return {
    archetypeId: NS_FAC_001_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: `NS-FAC-001:${canonicalProblemId}:${seed}`,
    sourceTrace: {
      sourceId: "NS-FAC-001-FULL-IMPLEMENTATION",
      sourceType: "approved-library-package",
      note: "Approved CP-001 through CP-009 implementation.",
    },
    topology: getTopology(canonicalProblemId),
    difficultyBand,
    number,
  };
}

function selectDifficultyBand(seed: string): NsFac001DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectNumber(seed: string, difficultyBand: NsFac001DifficultyBand, canonicalProblemId: NsFac001CanonicalProblemId) {
  const shapes: NumberShape[] = ["prime_input", "composite_input", "prime_power", "mixed_prime", "perfect_square", "non_perfect_square", "highly_composite"];
  const shape = shapes[stableBucket(`${seed}:shape`, shapes.length)];
  const pool = candidatePool(difficultyBand, canonicalProblemId, shape);
  return pool[stableBucket(`${seed}:number`, pool.length)];
}

function selectK(seed: string, factors: readonly number[]) {
  const bucket = stableBucket(`${seed}:k-bucket`, 3);
  const nonTrivialFactors = factors.filter((factor) => factor > 1);
  const candidates = nonTrivialFactors.filter((factor) => {
    if (bucket === 0) return factor <= 20;
    if (bucket === 1) return factor >= 21 && factor <= 200;
    return factor >= 201;
  });
  const source = candidates.length > 0 ? candidates : nonTrivialFactors;
  return source[stableBucket(`${seed}:k`, source.length)];
}

function selectPosition(seed: string, factorCount: number) {
  const classes: EdgePosition[] = ["first", "second", "middle", "penultimate", "last", "general"];
  const edge = classes[stableBucket(`${seed}:edge-position`, classes.length)];
  switch (edge) {
    case "first":
      return 1;
    case "second":
      return Math.min(2, factorCount);
    case "middle":
      return Math.max(1, Math.ceil(factorCount / 2));
    case "penultimate":
      return Math.max(1, factorCount - 1);
    case "last":
      return factorCount;
    case "general":
      return 1 + stableBucket(`${seed}:position`, factorCount);
  }
}

function candidatePool(difficultyBand: NsFac001DifficultyBand, canonicalProblemId: NsFac001CanonicalProblemId, shape: NumberShape) {
  const pools = POOLS[difficultyBand];
  if (shape === "highly_composite") return pools.highly_composite;
  if ((canonicalProblemId === NS_FAC_001_CP_008 || canonicalProblemId === NS_FAC_001_CP_009) && shape === "prime_input") {
    return pools.prime_input;
  }
  return pools[shape];
}

const POOLS: Record<NsFac001DifficultyBand, Record<NumberShape, number[]>> = {
  Easy: {
    prime_input: [2, 3, 5, 13, 97, 149, 199, 293].filter(isPrime),
    composite_input: [18, 24, 36, 48, 72, 84, 96, 108, 144, 180, 240, 300],
    prime_power: [4, 8, 16, 27, 32, 64, 81, 125, 128, 243, 256],
    mixed_prime: [18, 30, 42, 60, 84, 90, 120, 180, 240],
    perfect_square: [4, 9, 16, 36, 64, 81, 100, 144, 196, 225, 256],
    non_perfect_square: [18, 20, 24, 30, 42, 66, 70, 84, 90, 110],
    highly_composite: [60, 120, 180, 240],
  },
  Medium: {
    prime_input: [307, 401, 997, 1223, 1999, 5003, 7919, 9949].filter(isPrime),
    composite_input: [360, 420, 504, 720, 840, 1260, 1680, 2520, 5040, 7560, 9240],
    prime_power: [512, 729, 1024, 2187, 3125, 4096, 6561, 8192],
    mixed_prime: [330, 462, 660, 990, 1320, 2310, 2730, 4620, 6930],
    perfect_square: [324, 400, 576, 900, 1296, 2025, 3600, 4900, 8100],
    non_perfect_square: [390, 546, 770, 1001, 1540, 3003, 6006, 9009],
    highly_composite: [360, 720, 840],
  },
  Hard: {
    prime_input: [10007, 20011, 40009, 50021, 75011, 99991].filter(isPrime),
    composite_input: [10080, 15120, 27720, 45360, 55440, 83160, 110880, 166320, 180180],
    prime_power: [16384, 19683, 32768, 59049, 65536, 131072],
    mixed_prime: [10010, 15015, 30030, 60060, 90090, 120120, 180180],
    perfect_square: [10201, 12321, 15625, 20164, 50176, 104976, 160000],
    non_perfect_square: [10080, 12012, 30030, 51051, 70070, 111111, 180180],
    highly_composite: [360, 720, 840],
  },
};
