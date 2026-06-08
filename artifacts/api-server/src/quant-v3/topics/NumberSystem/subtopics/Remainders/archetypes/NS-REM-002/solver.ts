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
  type NsRem002Parameters,
  type NsRem002SolverResult,
} from "./types";

export function solveNsRem002(parameters: NsRem002Parameters): NsRem002SolverResult {
  if (parameters.archetypeId !== NS_REM_002_ARCHETYPE_ID) {
    throw new Error("NS-REM-002 solver received an unsupported archetype.");
  }

  switch (parameters.canonicalProblemId) {
    case NS_REM_002_CP_001:
    case NS_REM_002_CP_009:
      return solveDirectDividend(parameters);
    case NS_REM_002_CP_002:
      return solveSmallestRemainderNumber(parameters);
    case NS_REM_002_CP_003:
      return solveGreatestRemainderNumber(parameters);
    case NS_REM_002_CP_004:
      return solveRangeCount(parameters);
    case NS_REM_002_CP_005:
      return solveRangeSum(parameters);
    case NS_REM_002_CP_006:
      return solveMissingDivisor(parameters);
    case NS_REM_002_CP_007:
      return solveMissingQuotient(parameters);
    case NS_REM_002_CP_008:
      return solveMissingRemainder(parameters);
  }
}

function solveDirectDividend(parameters: NsRem002Parameters): NsRem002SolverResult {
  const divisor = requireNumber(parameters.divisor, "divisor");
  const quotient = requireNumber(parameters.quotient, "quotient");
  const remainder = requireNumber(parameters.remainder, "remainder");
  const dividend = divisor * quotient + remainder;
  return result(parameters, {
    answer: dividend,
    dividend,
    divisor,
    quotient,
    remainder,
    selectionRule: "Dividend = Divisor * Quotient + Remainder",
  });
}

function solveSmallestRemainderNumber(parameters: NsRem002Parameters): NsRem002SolverResult {
  const divisor = requireNumber(parameters.divisor, "divisor");
  const remainder = requireNumber(parameters.remainder, "remainder");
  const lowerBound = requireNumber(parameters.lowerBound, "lowerBound");
  const start = lowerBound + 1;
  const answer = start + mod(remainder - (start % divisor), divisor);
  return result(parameters, {
    answer,
    divisor,
    remainder,
    lowerBound,
    validNumbers: [answer],
    firstValidNumber: answer,
    lastValidNumber: answer,
    selectionRule: "Smallest number greater than lower bound satisfying remainder condition",
  });
}

function solveGreatestRemainderNumber(parameters: NsRem002Parameters): NsRem002SolverResult {
  const divisor = requireNumber(parameters.divisor, "divisor");
  const remainder = requireNumber(parameters.remainder, "remainder");
  const upperBound = requireNumber(parameters.upperBound, "upperBound");
  const start = upperBound - 1;
  const answer = start - mod((start % divisor) - remainder, divisor);
  return result(parameters, {
    answer,
    divisor,
    remainder,
    upperBound,
    validNumbers: [answer],
    firstValidNumber: answer,
    lastValidNumber: answer,
    selectionRule: "Greatest number less than upper bound satisfying remainder condition",
  });
}

function solveRangeCount(parameters: NsRem002Parameters): NsRem002SolverResult {
  const range = rangeValues(parameters);
  return result(parameters, {
    ...range,
    answer: range.validNumbers.length,
    count: range.validNumbers.length,
    selectionRule: "Count numbers in range satisfying remainder condition",
  });
}

function solveRangeSum(parameters: NsRem002Parameters): NsRem002SolverResult {
  const range = rangeValues(parameters);
  const sum = range.validNumbers.reduce((total, value) => total + value, 0);
  return result(parameters, {
    ...range,
    answer: sum,
    count: range.validNumbers.length,
    sum,
    selectionRule: "Sum numbers in range satisfying remainder condition",
  });
}

function solveMissingDivisor(parameters: NsRem002Parameters): NsRem002SolverResult {
  const dividend = requireNumber(parameters.dividend, "dividend");
  const quotient = requireNumber(parameters.quotient, "quotient");
  const remainder = requireNumber(parameters.remainder, "remainder");
  const divisor = (dividend - remainder) / quotient;
  if (!Number.isInteger(divisor)) throw new Error("Missing divisor must resolve to an integer.");
  return result(parameters, {
    answer: divisor,
    dividend,
    divisor,
    quotient,
    remainder,
    selectionRule: "Divisor = (Dividend - Remainder) / Quotient",
  });
}

function solveMissingQuotient(parameters: NsRem002Parameters): NsRem002SolverResult {
  const dividend = requireNumber(parameters.dividend, "dividend");
  const divisor = requireNumber(parameters.divisor, "divisor");
  const remainder = requireNumber(parameters.remainder, "remainder");
  const quotient = (dividend - remainder) / divisor;
  if (!Number.isInteger(quotient)) throw new Error("Missing quotient must resolve to an integer.");
  return result(parameters, {
    answer: quotient,
    dividend,
    divisor,
    quotient,
    remainder,
    selectionRule: "Quotient = (Dividend - Remainder) / Divisor",
  });
}

function solveMissingRemainder(parameters: NsRem002Parameters): NsRem002SolverResult {
  const dividend = requireNumber(parameters.dividend, "dividend");
  const divisor = requireNumber(parameters.divisor, "divisor");
  const quotient = requireNumber(parameters.quotient, "quotient");
  const remainder = dividend - divisor * quotient;
  return result(parameters, {
    answer: remainder,
    dividend,
    divisor,
    quotient,
    remainder,
    selectionRule: "Remainder = Dividend - Divisor * Quotient",
  });
}

function rangeValues(parameters: NsRem002Parameters) {
  const divisor = requireNumber(parameters.divisor, "divisor");
  const remainder = requireNumber(parameters.remainder, "remainder");
  const lowerBound = requireNumber(parameters.lowerBound, "lowerBound");
  const upperBound = requireNumber(parameters.upperBound, "upperBound");
  const firstValidNumber = lowerBound + mod(remainder - (lowerBound % divisor), divisor);
  const first = firstValidNumber < lowerBound ? firstValidNumber + divisor : firstValidNumber;
  const lastSeed = upperBound;
  const lastValidNumber = lastSeed - mod((lastSeed % divisor) - remainder, divisor);
  const validNumbers = first > lastValidNumber ? [] : Array.from({ length: Math.floor((lastValidNumber - first) / divisor) + 1 }, (_, index) => first + index * divisor);

  if (validNumbers.length < 1) {
    throw new Error("Range CP must produce at least one valid number.");
  }

  return {
    divisor,
    remainder,
    lowerBound,
    upperBound,
    validNumbers,
    firstValidNumber: validNumbers[0],
    lastValidNumber: validNumbers[validNumbers.length - 1],
  };
}

function result(
  parameters: NsRem002Parameters,
  values: {
    answer: number;
    dividend?: number;
    divisor?: number;
    quotient?: number;
    remainder?: number;
    lowerBound?: number;
    upperBound?: number;
    validNumbers?: readonly number[];
    firstValidNumber?: number;
    lastValidNumber?: number;
    count?: number;
    sum?: number;
    selectionRule: string;
  },
): NsRem002SolverResult {
  const divisor = values.divisor;
  const remainder = values.remainder;
  const dividend = values.dividend;
  const quotient = values.quotient;
  const equationConsistent =
    typeof dividend === "number" && typeof divisor === "number" && typeof quotient === "number" && typeof remainder === "number"
      ? dividend === divisor * quotient + remainder
      : true;
  const remainderValid = typeof divisor === "number" && typeof remainder === "number" ? divisor >= 2 && remainder >= 0 && remainder < divisor : true;
  const rangeValid =
    typeof values.lowerBound === "number" && typeof values.upperBound === "number" ? values.upperBound > values.lowerBound && (values.validNumbers?.length ?? 0) > 0 : true;
  const answerRuleSatisfied = answerRuleSatisfiedFor(parameters, values);

  return {
    archetypeId: NS_REM_002_ARCHETYPE_ID,
    canonicalProblemId: parameters.canonicalProblemId,
    reasoningPatternId: NS_REM_002_REASONING_PATTERN_ID,
    topology: parameters.topology,
    answer: values.answer,
    dividend,
    divisor,
    quotient,
    remainder,
    lowerBound: values.lowerBound,
    upperBound: values.upperBound,
    validNumbers: values.validNumbers ?? [],
    firstValidNumber: values.firstValidNumber,
    lastValidNumber: values.lastValidNumber,
    count: values.count,
    sum: values.sum,
    selectionRule: values.selectionRule,
    verification: {
      equationConsistent,
      remainderValid,
      rangeValid,
      answerRuleSatisfied,
    },
  };
}

function answerRuleSatisfiedFor(
  parameters: NsRem002Parameters,
  values: {
    answer: number;
    dividend?: number;
    divisor?: number;
    quotient?: number;
    remainder?: number;
    lowerBound?: number;
    upperBound?: number;
    validNumbers?: readonly number[];
    count?: number;
    sum?: number;
  },
) {
  switch (parameters.canonicalProblemId) {
    case NS_REM_002_CP_001:
    case NS_REM_002_CP_009:
      return values.answer === values.dividend;
    case NS_REM_002_CP_002:
      return values.answer > requireNumber(values.lowerBound, "lowerBound") && values.answer % requireNumber(values.divisor, "divisor") === requireNumber(values.remainder, "remainder");
    case NS_REM_002_CP_003:
      return values.answer < requireNumber(values.upperBound, "upperBound") && values.answer % requireNumber(values.divisor, "divisor") === requireNumber(values.remainder, "remainder");
    case NS_REM_002_CP_004:
      return values.answer === values.validNumbers?.length;
    case NS_REM_002_CP_005:
      return values.answer === values.validNumbers?.reduce((total, value) => total + value, 0);
    case NS_REM_002_CP_006:
      return values.answer === values.divisor;
    case NS_REM_002_CP_007:
      return values.answer === values.quotient;
    case NS_REM_002_CP_008:
      return values.answer === values.remainder;
  }
}

function requireNumber(value: number | undefined, name: string) {
  if (typeof value !== "number" || Number.isNaN(value)) throw new Error(`Missing numeric parameter: ${name}`);
  return value;
}

function mod(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

export const solveCp001 = solveNsRem002;
export const solveCp002 = solveNsRem002;
export const solveCp003 = solveNsRem002;
export const solveCp004 = solveNsRem002;
export const solveCp005 = solveNsRem002;
export const solveCp006 = solveNsRem002;
export const solveCp007 = solveNsRem002;
export const solveCp008 = solveNsRem002;
export const solveCp009 = solveNsRem002;
