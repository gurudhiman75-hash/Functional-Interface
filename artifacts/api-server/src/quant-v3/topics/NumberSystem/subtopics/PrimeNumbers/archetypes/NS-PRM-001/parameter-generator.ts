import { getDifficultyBandConfig, getTopology } from "./library";
import { isPrime, primesBetween } from "./math";
import {
  NS_PRM_001_ARCHETYPE_ID,
  NS_PRM_001_CP_001,
  NS_PRM_001_CP_002,
  NS_PRM_001_CP_003,
  NS_PRM_001_CP_004,
  NS_PRM_001_CP_005,
  NS_PRM_001_CP_006,
  NS_PRM_001_CP_007,
  NS_PRM_001_CP_008,
  NS_PRM_001_REASONING_PATTERN_ID,
  type NsPrm001CanonicalProblemId,
  type NsPrm001DifficultyBand,
  type NsPrm001Parameters,
} from "./types";

export interface NsPrm001ParameterInput {
  seed?: string;
  difficultyBand?: NsPrm001DifficultyBand;
  number?: number;
  lowerBound?: number;
  upperBound?: number;
  position?: number;
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

export function generateCp001Parameters(input: NsPrm001ParameterInput = {}) {
  return generateParameters(NS_PRM_001_CP_001, input);
}
export function generateCp002Parameters(input: NsPrm001ParameterInput = {}) {
  return generateParameters(NS_PRM_001_CP_002, input);
}
export function generateCp003Parameters(input: NsPrm001ParameterInput = {}) {
  return generateParameters(NS_PRM_001_CP_003, input);
}
export function generateCp004Parameters(input: NsPrm001ParameterInput = {}) {
  return generateParameters(NS_PRM_001_CP_004, input);
}
export function generateCp005Parameters(input: NsPrm001ParameterInput = {}) {
  return generateParameters(NS_PRM_001_CP_005, input);
}
export function generateCp006Parameters(input: NsPrm001ParameterInput = {}) {
  return generateParameters(NS_PRM_001_CP_006, input);
}
export function generateCp007Parameters(input: NsPrm001ParameterInput = {}) {
  return generateParameters(NS_PRM_001_CP_007, input);
}
export function generateCp008Parameters(input: NsPrm001ParameterInput = {}) {
  return generateParameters(NS_PRM_001_CP_008, input);
}

function generateParameters(canonicalProblemId: NsPrm001CanonicalProblemId, input: NsPrm001ParameterInput): NsPrm001Parameters {
  const seed = input.seed ?? `NS-PRM-001:${canonicalProblemId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficultyBand(seed);
  const base = baseParameters(canonicalProblemId, difficultyBand, seed);
  const band = getDifficultyBandConfig(difficultyBand);

  switch (canonicalProblemId) {
    case NS_PRM_001_CP_001:
      return { ...base, number: input.number ?? selectPrimeCheckNumber(seed, band.numberRange.min, band.numberRange.max) };
    case NS_PRM_001_CP_002:
    case NS_PRM_001_CP_005:
      return { ...base, ...rangeParameters(seed, band, input, false) };
    case NS_PRM_001_CP_003:
    case NS_PRM_001_CP_004:
      return { ...base, ...rangeParameters(seed, band, input, true) };
    case NS_PRM_001_CP_006:
      return { ...base, number: input.number ?? selectInRange(`${seed}:number`, Math.max(2, band.numberRange.min), band.numberRange.max) };
    case NS_PRM_001_CP_007:
      return { ...base, number: input.number ?? selectInRange(`${seed}:number`, Math.max(3, band.numberRange.min), band.numberRange.max) };
    case NS_PRM_001_CP_008:
      return { ...base, position: input.position ?? selectInRange(`${seed}:position`, band.positionRange.min, band.positionRange.max) };
  }
}

function baseParameters(canonicalProblemId: NsPrm001CanonicalProblemId, difficultyBand: NsPrm001DifficultyBand, seed: string) {
  return {
    archetypeId: NS_PRM_001_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: `NS-PRM-001:${canonicalProblemId}:${seed}`,
    reasoningPatternId: NS_PRM_001_REASONING_PATTERN_ID,
    sourceTrace: {
      sourceId: "NS-PRM-001-FULL-IMPLEMENTATION",
      sourceType: "approved-library-package" as const,
      note: "Approved CP-001 through CP-008 implementation.",
    },
    topology: getTopology(canonicalProblemId),
    difficultyBand,
  };
}

function selectDifficultyBand(seed: string): NsPrm001DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectInRange(seed: string, min: number, max: number) {
  return min + stableBucket(seed, max - min + 1);
}

function selectPrimeCheckNumber(seed: string, min: number, max: number) {
  const wantPrime = stableBucket(`${seed}:prime-or-composite`, 2) === 0;
  const candidates: number[] = [];
  for (let value = Math.max(2, min); value <= max; value += 1) {
    if (value !== 1 && isPrime(value) === wantPrime) candidates.push(value);
  }
  if (candidates.length === 0) throw new Error(`No ${wantPrime ? "Prime" : "Composite"} candidate exists in range ${min}-${max}.`);
  return candidates[stableBucket(`${seed}:number`, candidates.length)];
}

function rangeParameters(seed: string, band: ReturnType<typeof getDifficultyBandConfig>, input: NsPrm001ParameterInput, requirePrime: boolean) {
  if (typeof input.lowerBound === "number" && typeof input.upperBound === "number") {
    const rangeWidth = input.upperBound - input.lowerBound;
    if (requirePrime && primesBetween(input.lowerBound, input.upperBound).length === 0) {
      throw new Error("Generated range must contain at least one prime.");
    }
    return { lowerBound: input.lowerBound, upperBound: input.upperBound, rangeWidth };
  }

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const rangeWidth = selectInRange(`${seed}:rangeWidth:${attempt}`, band.rangeWidth.min, band.rangeWidth.max);
    const lowerMax = Math.min(band.lowerBoundRange.max, band.upperBoundRange.max - rangeWidth);
    const lowerMin = band.lowerBoundRange.min;
    const lowerBound = selectInRange(`${seed}:lowerBound:${attempt}`, lowerMin, Math.max(lowerMin, lowerMax));
    const upperBound = lowerBound + rangeWidth;
    if (upperBound < band.upperBoundRange.min || upperBound > band.upperBoundRange.max) continue;
    if (!requirePrime || primesBetween(lowerBound, upperBound).length > 0) return { lowerBound, upperBound, rangeWidth };
  }

  throw new Error("Unable to generate approved NS-PRM-001 range.");
}
