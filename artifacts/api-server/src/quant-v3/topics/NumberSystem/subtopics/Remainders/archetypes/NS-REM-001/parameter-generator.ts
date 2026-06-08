import { createNsRem001FixtureInstance, generateNsRem001StructuralInstance, stableBucket } from "./instance-generator";
import { assertTargetRemainderAllowed, getApprovedDivisors, getDifficultyBand } from "./library";
import {
  NS_REM_001_ARCHETYPE_ID,
  NS_REM_001_CP_001,
  NS_REM_001_CP_002,
  NS_REM_001_CP_003,
  NS_REM_001_CP_004,
  NS_REM_001_CP_005,
  NS_REM_001_CP_006,
  NS_REM_001_CP_007,
  NS_REM_001_REASONING_PATTERN_ID,
  type NsRem001CanonicalProblemId,
  type NsRem001Parameters,
} from "./types";

const EASY_DIVISORS = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const MEDIUM_DIVISORS = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 24, 25];
const HARD_DIVISORS = [27, 30, 36, 40, 45, 50, 60, 72, 75, 90, 99, 100];

export function generateCp001Parameters(input: NsRem001ParameterInput = {}) {
  return generateParameters(NS_REM_001_CP_001, input);
}

export function generateCp002Parameters(input: NsRem001ParameterInput = {}) {
  return generateParameters(NS_REM_001_CP_002, input);
}

export function generateCp003Parameters(input: NsRem001ParameterInput = {}) {
  return generateParameters(NS_REM_001_CP_003, input);
}

export function generateCp004Parameters(input: NsRem001ParameterInput = {}) {
  return generateParameters(NS_REM_001_CP_004, input);
}

export function generateCp005Parameters(input: NsRem001ParameterInput = {}) {
  return generateParameters(NS_REM_001_CP_005, input);
}

export function generateCp006Parameters(input: NsRem001ParameterInput = {}) {
  return generateParameters(NS_REM_001_CP_006, input);
}

export function generateCp007Parameters(input: NsRem001ParameterInput = {}) {
  return generateParameters(NS_REM_001_CP_007, input);
}

export interface NsRem001ParameterInput {
  seed?: string;
  numberExpression?: string;
  divisor?: number;
  targetRemainder?: number;
}

function generateParameters(canonicalProblemId: NsRem001CanonicalProblemId, input: NsRem001ParameterInput): NsRem001Parameters {
  const seed = input.seed ?? `NS-REM-001:${canonicalProblemId}`;

  for (let attempt = 0; attempt < 2000; attempt += 1) {
    const instance = input.numberExpression
      ? createNsRem001FixtureInstance({ canonicalProblemId, numberExpression: input.numberExpression })
      : generateNsRem001StructuralInstance({ canonicalProblemId, seed, attempt });
    const divisor = input.divisor ?? selectDivisor(seed, attempt, instance.numberLength);
    const targetRemainder = input.targetRemainder ?? stableBucket(`${seed}:remainder:${attempt}`, divisor);
    assertTargetRemainderAllowed(divisor, targetRemainder);
    const validValues = instance.candidateDomain.filter((candidate) => {
      const resolvedNumber = Number(instance.numberExpression.replace("x", String(candidate)));
      return resolvedNumber % divisor === targetRemainder;
    });

    if (canonicalProblemId === NS_REM_001_CP_001 && validValues.length !== 1) continue;
    if (canonicalProblemId !== NS_REM_001_CP_001 && validValues.length < 1) continue;

    return {
      archetypeId: NS_REM_001_ARCHETYPE_ID,
      canonicalProblemId,
      questionId: instance.questionId,
      patternId: instance.patternId,
      instanceId: instance.instanceId,
      reasoningPatternId: NS_REM_001_REASONING_PATTERN_ID,
      sourceTrace: {
        sourceId: "NS-REM-001-FULL-IMPLEMENTATION-PHASE",
        sourceType: "approved-implementation-phase",
        note: "Approved NS-REM-001 CP-001 through CP-007 implementation.",
      },
      numberExpression: instance.numberExpression,
      missingDigitSymbol: "x",
      knownDigits: instance.knownDigits,
      missingPosition: instance.missingPosition,
      numberLength: instance.numberLength,
      divisor,
      targetRemainder,
      candidateDomain: instance.candidateDomain,
      difficultyBand: getDifficultyBand(instance.numberLength, divisor),
    };
  }

  throw new Error(`No NS-REM-001 ${canonicalProblemId} parameter set satisfied the approved generation constraints.`);
}

function selectDivisor(seed: string, attempt: number, numberLength: number) {
  const bucket = stableBucket(`${seed}:difficulty:${attempt}`, 100);
  const bandDivisors = bucket < 40 ? EASY_DIVISORS : bucket < 80 ? MEDIUM_DIVISORS : HARD_DIVISORS;
  const compatibleByLength = bandDivisors.filter((divisor) => {
    const band = getDifficultyBand(numberLength, divisor);
    return bucket < 40 ? band === "Easy" : bucket < 80 ? band === "Medium" : band === "Hard";
  });
  const candidates = compatibleByLength.length > 0 ? compatibleByLength : getApprovedDivisors();
  return candidates[stableBucket(`${seed}:divisor:${attempt}`, candidates.length)];
}
