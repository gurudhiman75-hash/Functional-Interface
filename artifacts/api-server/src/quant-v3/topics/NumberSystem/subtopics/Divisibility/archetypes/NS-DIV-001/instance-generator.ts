import {
  getNsDiv001DigitPool,
  getNsDiv001StructuralPatterns,
  type NsDiv001StructuralPattern,
  validateNsDiv001StructuralInstance,
  auditNsDiv001InstanceSignals,
} from "./structural-pattern-registry";

export interface NsDiv001GeneratedInstance {
  patternId: string;
  instanceId: string;
  questionId: string;
  numberExpression: string;
  missingPosition: number;
  numberLength: number;
  knownDigits: readonly number[];
  candidateDomain: readonly number[];
  auditSignals: ReturnType<typeof auditNsDiv001InstanceSignals>;
}

const ALL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const NON_ZERO_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

function hashSeed(seed: string) {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function nextHash(value: number) {
  return Math.imul(value ^ 0x9e3779b9, 1664525) + 1013904223 >>> 0;
}

function digitForPosition(pattern: NsDiv001StructuralPattern, position: number, hash: number) {
  const pool = getNsDiv001DigitPool(pattern.digitPool);
  const constraint = pattern.fixedPositionConstraints.find((item) => item.position === position);
  const allowedDigits = constraint ? pool.filter((digit) => digit !== constraint.value) : pool;
  return allowedDigits[hash % allowedDigits.length];
}

export function generateNsDiv001StructuralInstance(input: {
  canonicalProblemId: string;
  seed?: string;
  attempt?: number;
  patternId?: string;
}): NsDiv001GeneratedInstance {
  const patterns = getNsDiv001StructuralPatterns();
  const baseHash = hashSeed(`${input.canonicalProblemId}:${input.seed ?? "structural-instance"}:${input.attempt ?? 0}`);
  const pattern = input.patternId
    ? patterns.find((item) => item.patternId === input.patternId)
    : patterns[baseHash % patterns.length];

  if (!pattern) {
    throw new Error(`Structural pattern is not registered for NS-DIV-001: ${input.patternId}`);
  }

  let rollingHash = baseHash;
  const chars = Array.from({ length: pattern.length }, (_, index) => {
    const position = index + 1;
    if (position === pattern.missingPosition) return "x";
    rollingHash = nextHash(rollingHash + position);
    return String(digitForPosition(pattern, position, rollingHash));
  });
  const numberExpression = chars.join("");
  const validation = validateNsDiv001StructuralInstance({
    patternId: pattern.patternId,
    instance: numberExpression,
  });

  if (!validation.valid) {
    throw new Error(`Generated structural instance failed validation: ${validation.failures.join("; ")}`);
  }

  const instanceHash = hashSeed(`${pattern.patternId}:${numberExpression}:${input.canonicalProblemId}:${input.seed ?? ""}:${input.attempt ?? 0}`);
  const instanceId = `NS-DIV-001:${pattern.patternId}:INST-${instanceHash.toString(16).padStart(8, "0")}`;
  const questionId = `${input.canonicalProblemId}:${instanceHash.toString(16).padStart(8, "0")}`;

  return {
    patternId: pattern.patternId,
    instanceId,
    questionId,
    numberExpression,
    missingPosition: pattern.missingPosition,
    numberLength: pattern.length,
    knownDigits: chars.filter((char) => char !== "x").map((char) => Number(char)),
    candidateDomain: pattern.missingPosition === 1 ? NON_ZERO_DIGITS : ALL_DIGITS,
    auditSignals: auditNsDiv001InstanceSignals(numberExpression),
  };
}

export function createNsDiv001FixtureInstance(input: {
  canonicalProblemId: string;
  numberExpression: string;
}) {
  const patternId = `SP-${input.numberExpression.length}-${input.numberExpression.indexOf("x") + 1}`;
  const validation = validateNsDiv001StructuralInstance({
    patternId,
    instance: input.numberExpression,
  });

  if (!validation.valid) {
    throw new Error(`Fixture instance failed structural validation: ${validation.failures.join("; ")}`);
  }

  const instanceHash = hashSeed(`${patternId}:${input.numberExpression}:${input.canonicalProblemId}:fixture`);
  return {
    patternId,
    instanceId: `NS-DIV-001:${patternId}:FIXTURE-${instanceHash.toString(16).padStart(8, "0")}`,
    questionId: `${input.canonicalProblemId}:FIXTURE-${instanceHash.toString(16).padStart(8, "0")}`,
    numberExpression: input.numberExpression,
    missingPosition: input.numberExpression.indexOf("x") + 1,
    numberLength: input.numberExpression.length,
    knownDigits: [...input.numberExpression].filter((char) => char !== "x").map((char) => Number(char)),
    candidateDomain: input.numberExpression.indexOf("x") === 0 ? NON_ZERO_DIGITS : ALL_DIGITS,
    auditSignals: auditNsDiv001InstanceSignals(input.numberExpression),
  };
}
