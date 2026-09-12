import type { AnaCp010NumericContext, AnaCp010NumericRuleId } from "./rule-definitions";
import type { AnaCp010SetRuleId } from "./question-language.en";

function digits3(input: number): readonly [number, number, number] | null {
  if (!Number.isInteger(input) || input < 100 || input > 999) return null;
  return [Math.floor(input / 100), Math.floor(input / 10) % 10, input % 10] as const;
}

export function independentlySolveAnaCp010Numeric(
  ruleId: AnaCp010NumericRuleId,
  input: number,
  context: AnaCp010NumericContext,
): number | null {
  switch (ruleId) {
    case "NUM_HIGHER_FIXED_POWER":
      return input ** context.exponent!;
    case "NUM_EXACT_SQUARE_ROOT": {
      const root = Math.sqrt(input);
      return Number.isInteger(root) ? root : null;
    }
    case "NUM_CUBE_ROOT_ADJUST": {
      const root = Math.round(Math.cbrt(input));
      if (root ** 3 !== input) return null;
      const value = root + context.adjust!;
      return value > 0 ? value : null;
    }
    case "NUM_CUBE_SUBTRACT":
      return input ** 3 - context.constant!;
    case "NUM_DIGIT_QUOTIENT": {
      if (!Number.isInteger(input) || input < 10 || input > 99) return null;
      const a = Math.floor(input / 10);
      const b = input % 10;
      return b !== 0 && a % b === 0 ? a / b : null;
    }
    case "NUM_THREE_DIGIT_SUM": {
      const digits = digits3(input);
      return digits ? digits[0] + digits[1] + digits[2] : null;
    }
    case "NUM_THREE_DIGIT_PRODUCT": {
      const digits = digits3(input);
      return digits ? digits[0] * digits[1] * digits[2] : null;
    }
  }
}

function isPrime(value: number): boolean {
  if (!Number.isInteger(value) || value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}

export function independentlyValidateAnaCp010Set(ruleId: AnaCp010SetRuleId, values: readonly number[]): boolean {
  if (values.length !== 3 || new Set(values).size !== 3) return false;
  if (ruleId === "SET_ALL_PRIME") return values.every(isPrime);
  if (values.some((value) => value <= 0)) return false;
  return values[1] % values[0] === 0
    && values[2] % values[1] === 0
    && values[1] / values[0] === values[2] / values[1]
    && values[1] / values[0] > 1;
}
