import structuralPatternLibrary from "./realism-library/structural-pattern-library.json";

export type NsDiv001StructuralPattern = (typeof structuralPatternLibrary.structuralPatterns)[number];

const DIGIT_POOLS: Record<string, readonly number[]> = {
  "0-9": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  "1-9": [1, 2, 3, 4, 5, 6, 7, 8, 9],
};

export const NS_DIV_001_STRUCTURAL_PATTERN_REGISTRY = structuralPatternLibrary;

function isInteger(value: unknown) {
  return typeof value === "number" && Number.isInteger(value);
}

export function validateNsDiv001StructuralPatternLibrary() {
  const failures: string[] = [];
  const ids = new Set<string>();

  for (const pattern of structuralPatternLibrary.structuralPatterns) {
    if (!pattern.patternId || ids.has(pattern.patternId)) {
      failures.push(`Structural pattern has missing or duplicate Pattern ID: ${pattern.patternId}`);
    }
    ids.add(pattern.patternId);
    if (!isInteger(pattern.length) || pattern.length < 3 || pattern.length > 6) {
      failures.push(`Structural pattern has invalid Length: ${pattern.patternId}`);
    }
    if (!isInteger(pattern.missingPosition) || pattern.missingPosition < 1 || pattern.missingPosition > pattern.length) {
      failures.push(`Structural pattern has invalid Missing Position: ${pattern.patternId}`);
    }
    if (!DIGIT_POOLS[pattern.digitPool]) {
      failures.push(`Structural pattern has invalid Digit Pool: ${pattern.patternId}`);
    }
    if (pattern.repetitionPolicy !== "Allowed") {
      failures.push(`Structural pattern has invalid Repetition Policy: ${pattern.patternId}`);
    }
    for (const constraint of pattern.fixedPositionConstraints) {
      if (!isInteger(constraint.position) || constraint.position < 1 || constraint.position > pattern.length) {
        failures.push(`Structural pattern has invalid Fixed Position Constraint position: ${pattern.patternId}`);
      }
      if (constraint.operator !== "!=") {
        failures.push(`Structural pattern has invalid Fixed Position Constraint operator: ${pattern.patternId}`);
      }
      if (!DIGIT_POOLS[pattern.digitPool].includes(constraint.value)) {
        failures.push(`Structural pattern has invalid Fixed Position Constraint value: ${pattern.patternId}`);
      }
    }
  }

  return {
    valid: failures.length === 0,
    failures,
  };
}

export function getNsDiv001StructuralPatterns() {
  return structuralPatternLibrary.structuralPatterns;
}

export function getNsDiv001StructuralPattern(patternId: string) {
  return structuralPatternLibrary.structuralPatterns.find((pattern) => pattern.patternId === patternId);
}

export function assertNsDiv001StructuralPatternAllowed(patternId: string) {
  const pattern = getNsDiv001StructuralPattern(patternId);
  if (!pattern) {
    throw new Error(`Structural pattern is not registered for NS-DIV-001: ${patternId}`);
  }
  return pattern;
}

export function getNsDiv001DigitPool(digitPool: string) {
  const pool = DIGIT_POOLS[digitPool];
  if (!pool) {
    throw new Error(`Digit pool is not registered for NS-DIV-001: ${digitPool}`);
  }
  return pool;
}

export function validateNsDiv001StructuralInstance(input: {
  patternId: string;
  instance: string;
}) {
  const failures: string[] = [];
  const pattern = getNsDiv001StructuralPattern(input.patternId);
  if (!pattern) {
    return {
      valid: false,
      failures: [`Structural pattern is not registered: ${input.patternId}`],
    };
  }
  const chars = [...input.instance];
  const digitPool = getNsDiv001DigitPool(pattern.digitPool);

  if (chars.length !== pattern.length) {
    failures.push("Instance length must match structural pattern Length.");
  }
  if (chars.filter((char) => char === "x").length !== 1) {
    failures.push("Instance must contain exactly one missing digit symbol.");
  }
  if (input.instance.indexOf("x") + 1 !== pattern.missingPosition) {
    failures.push("Instance missing position must match structural pattern Missing Position.");
  }
  chars.forEach((char, index) => {
    if (char === "x") return;
    const digit = Number(char);
    if (!Number.isInteger(digit) || !digitPool.includes(digit)) {
      failures.push(`Instance digit at position ${index + 1} must come from the approved Digit Pool.`);
    }
  });
  for (const constraint of pattern.fixedPositionConstraints) {
    const char = chars[constraint.position - 1];
    if (char !== "x" && Number(char) === constraint.value) {
      failures.push(`Instance violates Fixed Position Constraint at position ${constraint.position}.`);
    }
  }

  return {
    valid: failures.length === 0,
    failures,
  };
}

export function auditNsDiv001InstanceSignals(instance: string) {
  const concreteDigits = [...instance].filter((char) => char !== "x");
  const zeroCount = concreteDigits.filter((char) => char === "0").length;
  const numericDigits = concreteDigits.map((char) => Number(char));
  const uniformDigitNumber = new Set(concreteDigits).size === 1;
  const sequenceHeavyNumber = numericDigits.length > 2 && numericDigits.every((digit, index) => index === 0 || digit === numericDigits[index - 1] + 1);

  return {
    excessiveZeros: zeroCount >= Math.max(2, Math.ceil(concreteDigits.length / 2)),
    uniformDigitNumber,
    sequenceHeavyNumber,
    examLikeVarietySignal: !uniformDigitNumber && !sequenceHeavyNumber,
  };
}
