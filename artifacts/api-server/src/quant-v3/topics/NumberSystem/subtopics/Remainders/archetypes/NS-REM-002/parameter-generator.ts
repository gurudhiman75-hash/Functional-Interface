import { getDifficultyBandConfig, getTopology } from "./library";
import {
  NS_REM_002_ARCHETYPE_ID,
  NS_REM_002_CP_001,
  NS_REM_002_CP_002,
  NS_REM_002_CP_003,
  NS_REM_002_CP_004,
  NS_REM_002_CP_005,
  NS_REM_002_CP_006,
  NS_REM_002_CP_007,
  NS_REM_002_CP_008,
  NS_REM_002_CP_009,
  NS_REM_002_REASONING_PATTERN_ID,
  type NsRem002CanonicalProblemId,
  type NsRem002DifficultyBand,
  type NsRem002Parameters,
} from "./types";

export interface NsRem002ParameterInput {
  seed?: string;
  difficultyBand?: NsRem002DifficultyBand;
  divisor?: number;
  quotient?: number;
  remainder?: number;
  dividend?: number;
  lowerBound?: number;
  upperBound?: number;
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

export function generateCp001Parameters(input: NsRem002ParameterInput = {}) {
  return generateParameters(NS_REM_002_CP_001, input);
}
export function generateCp002Parameters(input: NsRem002ParameterInput = {}) {
  return generateParameters(NS_REM_002_CP_002, input);
}
export function generateCp003Parameters(input: NsRem002ParameterInput = {}) {
  return generateParameters(NS_REM_002_CP_003, input);
}
export function generateCp004Parameters(input: NsRem002ParameterInput = {}) {
  return generateParameters(NS_REM_002_CP_004, input);
}
export function generateCp005Parameters(input: NsRem002ParameterInput = {}) {
  return generateParameters(NS_REM_002_CP_005, input);
}
export function generateCp006Parameters(input: NsRem002ParameterInput = {}) {
  return generateParameters(NS_REM_002_CP_006, input);
}
export function generateCp007Parameters(input: NsRem002ParameterInput = {}) {
  return generateParameters(NS_REM_002_CP_007, input);
}
export function generateCp008Parameters(input: NsRem002ParameterInput = {}) {
  return generateParameters(NS_REM_002_CP_008, input);
}
export function generateCp009Parameters(input: NsRem002ParameterInput = {}) {
  return generateParameters(NS_REM_002_CP_009, input);
}

function generateParameters(canonicalProblemId: NsRem002CanonicalProblemId, input: NsRem002ParameterInput): NsRem002Parameters {
  const seed = input.seed ?? `NS-REM-002:${canonicalProblemId}`;
  const difficultyBand = input.difficultyBand ?? selectDifficultyBand(seed);
  const band = getDifficultyBandConfig(difficultyBand);
  const divisor = input.divisor ?? selectInRange(`${seed}:divisor`, band.divisorRange.min, band.divisorRange.max);
  const quotient = input.quotient ?? selectInRange(`${seed}:quotient`, band.quotientRange.min, band.quotientRange.max);
  const remainder = input.remainder ?? selectInRange(`${seed}:remainder`, 0, divisor - 1);
  const dividend = input.dividend ?? divisor * quotient + remainder;
  const lowerBound = input.lowerBound ?? selectInRange(`${seed}:lowerBound`, band.lowerBoundRange.min, band.lowerBoundRange.max);
  const upperBoundSeedValue = input.upperBound ?? selectInRange(`${seed}:upperBound`, band.upperBoundRange.min, band.upperBoundRange.max);
  const upperBound = boundedUpper(canonicalProblemId, upperBoundSeedValue, lowerBound, divisor, remainder);
  const base = baseParameters(canonicalProblemId, difficultyBand, seed);

  switch (canonicalProblemId) {
    case NS_REM_002_CP_001:
    case NS_REM_002_CP_009:
      return {
        ...base,
        divisor,
        quotient,
        remainder,
      };
    case NS_REM_002_CP_002:
      return {
        ...base,
        divisor,
        remainder,
        lowerBound,
      };
    case NS_REM_002_CP_003:
      return {
        ...base,
        divisor,
        remainder,
        upperBound,
      };
    case NS_REM_002_CP_004:
    case NS_REM_002_CP_005:
      return {
        ...base,
        divisor,
        remainder,
        lowerBound,
        upperBound,
      };
    case NS_REM_002_CP_006:
      return {
        ...base,
        dividend,
        quotient,
        remainder,
      };
    case NS_REM_002_CP_007:
      return {
        ...base,
        dividend,
        divisor,
        remainder,
      };
    case NS_REM_002_CP_008:
      return {
        ...base,
        dividend,
        divisor,
        quotient,
      };
  }
}

function baseParameters(canonicalProblemId: NsRem002CanonicalProblemId, difficultyBand: NsRem002DifficultyBand, seed: string) {
  return {
    archetypeId: NS_REM_002_ARCHETYPE_ID,
    canonicalProblemId,
    questionId: `NS-REM-002:${canonicalProblemId}:${seed}`,
    reasoningPatternId: NS_REM_002_REASONING_PATTERN_ID,
    sourceTrace: {
      sourceId: "NS-REM-002-FULL-IMPLEMENTATION",
      sourceType: "approved-library-package" as const,
      note: "Approved CP-001 through CP-009 implementation.",
    },
    topology: getTopology(canonicalProblemId),
    difficultyBand,
  };
}

function selectDifficultyBand(seed: string): NsRem002DifficultyBand {
  const bucket = stableBucket(`${seed}:difficulty`, 100);
  if (bucket < 40) return "Easy";
  if (bucket < 80) return "Medium";
  return "Hard";
}

function selectInRange(seed: string, min: number, max: number) {
  return min + stableBucket(seed, max - min + 1);
}

function boundedUpper(
  canonicalProblemId: NsRem002CanonicalProblemId,
  upperBoundSeedValue: number,
  lowerBound: number,
  divisor: number,
  remainder: number,
) {
  if (canonicalProblemId === NS_REM_002_CP_003) {
    return Math.max(upperBoundSeedValue, remainder + 1);
  }
  if (canonicalProblemId === NS_REM_002_CP_004 || canonicalProblemId === NS_REM_002_CP_005) {
    return Math.max(upperBoundSeedValue, lowerBound + divisor);
  }
  return Math.max(upperBoundSeedValue, lowerBound + 10);
}
