import { getDifficultyBandConfig, getTopology } from "./library";
import { exponentOfPrime, isPrime, primeFactorize } from "./math";
import {
  NS_PF_001_ARCHETYPE_ID,
  NS_PF_001_CP_001,
  NS_PF_001_CP_002,
  NS_PF_001_CP_003,
  NS_PF_001_CP_004,
  NS_PF_001_CP_005,
  NS_PF_001_CP_006,
  NS_PF_001_CP_007,
  type NsPf001CanonicalProblemId,
  type NsPf001DifficultyBand,
  type NsPf001Parameters,
} from "./types";

export interface NsPf001ParameterInput {
  seed?: string;
  difficultyBand?: NsPf001DifficultyBand;
  number?: number;
  prime?: number;
}

type CandidateShape = "prime_input" | "composite_input" | "repeated_prime" | "mixed_prime" | "prime_heavy";

const candidateCache = new Map<string, number[]>();

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

export function generateCp001Parameters(input: NsPf001ParameterInput = {}) {
  return generateParameters(NS_PF_001_CP_001, input);
}
export function generateCp002Parameters(input: NsPf001ParameterInput = {}) {
  return generateParameters(NS_PF_001_CP_002, input);
}
export function generateCp003Parameters(input: NsPf001ParameterInput = {}) {
  return generateParameters(NS_PF_001_CP_003, input);
}
export function generateCp004Parameters(input: NsPf001ParameterInput = {}) {
  return generateParameters(NS_PF_001_CP_004, input);
}
export function generateCp005Parameters(input: NsPf001ParameterInput = {}) {
  return generateParameters(NS_PF_001_CP_005, input);
}
export function generateCp006Parameters(input: NsPf001ParameterInput = {}) {
  return generateParameters(NS_PF_001_CP_006, input);
}
export function generateCp007Parameters(input: NsPf001ParameterInput = {}) {
  return generateParameters(NS_PF_001_CP_007, input);
}

function generateParameters(canonicalProblemId: NsPf001CanonicalProblemId, input: NsPf001ParameterInput): NsPf001Parameters {
  const seed = input.seed ?? `NS-PF-001:${canonicalProblemId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficultyBand(seed);
  const number = input.number ?? selectNumber(seed, difficultyBand);
  const base = baseParameters(canonicalProblemId, difficultyBand, seed, number);

  if (canonicalProblemId === NS_PF_001_CP_006 || canonicalProblemId === NS_PF_001_CP_007) {
    return { ...base, prime: input.prime ?? selectPrimeFactor(seed, number) };
  }

  return base;
}

function baseParameters(
  canonicalProblemId: NsPf001CanonicalProblemId,
  difficultyBand: NsPf001DifficultyBand,
  seed: string,
  number: number,
): NsPf001Parameters {
  return {
    archetypeId: NS_PF_001_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: `NS-PF-001:${canonicalProblemId}:${seed}`,
    sourceTrace: {
      sourceId: "NS-PF-001-FULL-IMPLEMENTATION",
      sourceType: "approved-library-package",
      note: "Approved CP-001 through CP-007 implementation with MathJax factorization support.",
    },
    topology: getTopology(canonicalProblemId),
    difficultyBand,
    number,
  };
}

function selectDifficultyBand(seed: string): NsPf001DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectNumber(seed: string, difficultyBand: NsPf001DifficultyBand) {
  const shapes: CandidateShape[] = ["prime_input", "composite_input", "repeated_prime", "mixed_prime", "prime_heavy"];
  const shape = shapes[stableBucket(`${seed}:shape`, shapes.length)];
  const candidates = getCandidates(difficultyBand, shape);
  return candidates[stableBucket(`${seed}:number`, candidates.length)];
}

function selectPrimeFactor(seed: string, number: number) {
  const factorization = primeFactorize(number);
  const repeatedPreferred = factorization.terms.filter((term) => term.exponent > 1);
  const source = repeatedPreferred.length > 0 && stableBucket(`${seed}:prefer-repeated`, 2) === 0 ? repeatedPreferred : factorization.terms;
  return source[stableBucket(`${seed}:selected-prime`, source.length)].prime;
}

function getCandidates(difficultyBand: NsPf001DifficultyBand, shape: CandidateShape) {
  const cacheKey = `${difficultyBand}:${shape}`;
  const cached = candidateCache.get(cacheKey);
  if (cached) return cached;

  const band = getDifficultyBandConfig(difficultyBand);
  const candidates: number[] = [];
  for (let value = Math.max(2, band.numberRange.min); value <= band.numberRange.max; value += 1) {
    if (matchesShape(value, shape, difficultyBand)) candidates.push(value);
  }
  if (candidates.length === 0) throw new Error(`No NS-PF-001 candidates for ${difficultyBand}:${shape}.`);
  candidateCache.set(cacheKey, candidates);
  return candidates;
}

function matchesShape(value: number, shape: CandidateShape, difficultyBand: NsPf001DifficultyBand) {
  const prime = isPrime(value);
  if (shape === "prime_input") return prime;
  if (prime) return false;
  if (shape === "composite_input") return true;

  const factorization = primeFactorize(value);
  if (shape === "repeated_prime") return factorization.terms.some((term) => term.exponent > 1);
  if (shape === "mixed_prime") return factorization.distinctPrimeFactorCount >= 2;
  if (shape === "prime_heavy") return factorization.largestPrimeFactor >= primeHeavyThreshold(difficultyBand);
  return false;
}

function primeHeavyThreshold(difficultyBand: NsPf001DifficultyBand) {
  if (difficultyBand === "Easy") return 11;
  if (difficultyBand === "Medium") return 37;
  return 101;
}

export function selectedPrimeDividesNumber(number: number, prime: number | undefined) {
  return typeof prime === "number" && isPrime(prime) && exponentOfPrime(primeFactorize(number), prime) > 0;
}
