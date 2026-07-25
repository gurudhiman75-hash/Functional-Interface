import type { NumberTreatment } from "./types";

export type NumericRuleId =
  | "NUM_ADD_CONSTANT"
  | "NUM_SUBTRACT_CONSTANT"
  | "NUM_MULTIPLY_CONSTANT"
  | "NUM_DIVIDE_CONSTANT"
  | "NUM_MULTIPLY_THEN_ADD"
  | "NUM_MULTIPLY_THEN_SUBTRACT"
  | "NUM_SQUARE"
  | "NUM_SQUARE_PLUS"
  | "NUM_SQUARE_MINUS"
  | "NUM_CUBE"
  | "NUM_DIGIT_SUM"
  | "NUM_DIGIT_PRODUCT"
  | "NUM_DIGIT_DIFFERENCE"
  | "NUM_REVERSE_DIGITS"
  | "NUM_SUM_OF_DIGIT_SQUARES";

export interface NumericRuleSpec {
  id: NumericRuleId;
  numberTreatment: NumberTreatment;
  parameters: Readonly<Record<string, number>>;
}

function digits(value: number): number[] {
  if (!Number.isInteger(value) || value < 0) throw new Error("Digit rules require a non-negative integer.");
  return String(value).split("").map(Number);
}

export function applyNumericRule(input: number, spec: NumericRuleSpec): number {
  const p = spec.parameters;
  switch (spec.id) {
    case "NUM_ADD_CONSTANT": return input + (p.constant ?? 0);
    case "NUM_SUBTRACT_CONSTANT": return input - (p.constant ?? 0);
    case "NUM_MULTIPLY_CONSTANT": return input * (p.factor ?? 1);
    case "NUM_DIVIDE_CONSTANT": {
      const divisor = p.divisor ?? 1;
      if (divisor === 0 || input % divisor !== 0) throw new Error("Division rule must produce an integer.");
      return input / divisor;
    }
    case "NUM_MULTIPLY_THEN_ADD": return input * (p.factor ?? 1) + (p.constant ?? 0);
    case "NUM_MULTIPLY_THEN_SUBTRACT": return input * (p.factor ?? 1) - (p.constant ?? 0);
    case "NUM_SQUARE": return input ** 2;
    case "NUM_SQUARE_PLUS": return input ** 2 + (p.constant ?? 0);
    case "NUM_SQUARE_MINUS": return input ** 2 - (p.constant ?? 0);
    case "NUM_CUBE": return input ** 3;
    case "NUM_DIGIT_SUM": return digits(input).reduce((sum, digit) => sum + digit, 0);
    case "NUM_DIGIT_PRODUCT": return digits(input).reduce((product, digit) => product * digit, 1);
    case "NUM_DIGIT_DIFFERENCE": {
      const valueDigits = digits(input);
      if (valueDigits.length !== 2) throw new Error("Digit difference requires a two-digit number.");
      return Math.abs(valueDigits[0] - valueDigits[1]);
    }
    case "NUM_REVERSE_DIGITS": return Number([...digits(input)].reverse().join(""));
    case "NUM_SUM_OF_DIGIT_SQUARES": return digits(input).reduce((sum, digit) => sum + digit ** 2, 0);
  }
}

export function matchingNumericRules(
  source: number,
  target: number,
  candidates: readonly NumericRuleSpec[],
): readonly NumericRuleSpec[] {
  return candidates.filter((candidate) => {
    try {
      return applyNumericRule(source, candidate) === target;
    } catch {
      return false;
    }
  });
}

export function assertUnambiguousNumericPair(
  source: number,
  target: number,
  intended: NumericRuleSpec,
  competingRules: readonly NumericRuleSpec[],
): void {
  if (applyNumericRule(source, intended) !== target) {
    throw new Error(`Intended rule ${intended.id} does not map ${source} to ${target}.`);
  }
  const matches = matchingNumericRules(source, target, [intended, ...competingRules]);
  const uniqueIds = new Set(matches.map((rule) => `${rule.id}:${JSON.stringify(rule.parameters)}`));
  if (uniqueIds.size !== 1) {
    throw new Error(`Ambiguous numeric pair ${source}:${target}; ${uniqueIds.size} registered rules match.`);
  }
}
