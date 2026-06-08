import { getStructuralPatterns, validateStructuralInstance } from "./library";
import type { NsRem001CanonicalProblemId } from "./types";

export interface NsRem001StructuralInstance {
  questionId: string;
  patternId: string;
  instanceId: string;
  numberExpression: string;
  knownDigits: readonly number[];
  missingPosition: number;
  numberLength: number;
  candidateDomain: readonly number[];
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

function digitAt(seed: string, position: number, min: number, max: number) {
  const span = max - min + 1;
  return min + stableBucket(`${seed}:digit:${position}`, span);
}

export function generateNsRem001StructuralInstance(input: {
  canonicalProblemId: NsRem001CanonicalProblemId;
  seed?: string;
  attempt?: number;
  patternId?: string;
}): NsRem001StructuralInstance {
  const patterns = getStructuralPatterns();
  const seed = input.seed ?? `NS-REM-001:${input.canonicalProblemId}`;
  const attempt = input.attempt ?? 0;
  const pattern =
    patterns.find((entry) => entry.patternId === input.patternId) ??
    patterns[stableBucket(`${seed}:pattern:${attempt}`, patterns.length)];
  const chars: string[] = [];

  for (let position = 1; position <= pattern.length; position += 1) {
    if (position === pattern.missingPosition) {
      chars.push("x");
      continue;
    }
    const firstPositionMustBeNonZero = position === 1 && pattern.fixedPositionConstraints.some((constraint) => constraint.position === 1);
    chars.push(String(digitAt(`${seed}:${attempt}:${pattern.patternId}`, position, firstPositionMustBeNonZero ? 1 : 0, 9)));
  }

  const numberExpression = chars.join("");
  const validation = validateStructuralInstance({ patternId: pattern.patternId, instance: numberExpression });
  if (!validation.valid) {
    throw new Error(`Generated NS-REM-001 instance failed validation: ${validation.failures.join("; ")}`);
  }

  return {
    questionId: `NS-REM-001:${input.canonicalProblemId}:${seed}:${attempt}`,
    patternId: pattern.patternId,
    instanceId: `NS-REM-001:${pattern.patternId}:${numberExpression}:${attempt}`,
    numberExpression,
    knownDigits: [...numberExpression].filter((char) => char !== "x").map((char) => Number(char)),
    missingPosition: pattern.missingPosition,
    numberLength: pattern.length,
    candidateDomain: pattern.missingPosition === 1 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  };
}

export function createNsRem001FixtureInstance(input: {
  canonicalProblemId: NsRem001CanonicalProblemId;
  numberExpression: string;
}): NsRem001StructuralInstance {
  const missingPosition = input.numberExpression.indexOf("x") + 1;
  const pattern = getStructuralPatterns().find((entry) => entry.length === input.numberExpression.length && entry.missingPosition === missingPosition);

  if (!pattern) {
    throw new Error(`No structural pattern matches fixture instance: ${input.numberExpression}`);
  }

  const validation = validateStructuralInstance({ patternId: pattern.patternId, instance: input.numberExpression });
  if (!validation.valid) {
    throw new Error(`Fixture instance failed validation: ${validation.failures.join("; ")}`);
  }

  return {
    questionId: `NS-REM-001:${input.canonicalProblemId}:FIXTURE:${input.numberExpression}`,
    patternId: pattern.patternId,
    instanceId: `NS-REM-001:${pattern.patternId}:${input.numberExpression}:FIXTURE`,
    numberExpression: input.numberExpression,
    knownDigits: [...input.numberExpression].filter((char) => char !== "x").map((char) => Number(char)),
    missingPosition,
    numberLength: input.numberExpression.length,
    candidateDomain: missingPosition === 1 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  };
}
