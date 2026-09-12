import type { NumericRuleContext } from "./rule-definitions";

export interface NumericMisconceptionExtension {
  value: number;
  errorLabel: string;
}

function add(
  out: NumericMisconceptionExtension[],
  value: number | null | undefined,
  errorLabel: string,
  correct: number,
): void {
  if (value === null || value === undefined || !Number.isInteger(value) || value <= 0 || value === correct) return;
  if (out.some((entry) => entry.value === value)) return;
  out.push({ value, errorLabel });
}

/**
 * Secondary misconception reservoir used only when the compact primary model
 * cannot provide three distinct distractors for a particular generated state.
 * Every candidate corresponds to a recognisable wrong operation; none are
 * arbitrary correct-answer +/- delta fillers.
 */
export function numericMisconceptionExtensions(
  ruleId: string,
  context: NumericRuleContext,
  input: number,
  correct: number,
): NumericMisconceptionExtension[] {
  const out: NumericMisconceptionExtension[] = [];
  const k = context.k;
  const m = context.m;
  const a = Math.floor(input / 10);
  const b = input % 10;

  switch (ruleId) {
    case "NUM_ADD_K":
      add(out, k === undefined ? null : input + 2 * k, "ADDED_CONSTANT_TWICE", correct);
      add(out, k === undefined ? null : input * k, "MULTIPLIED_BY_CONSTANT_INSTEAD", correct);
      add(out, k === undefined ? null : input - k, "SUBTRACTED_CONSTANT_INSTEAD", correct);
      break;
    case "NUM_MULTIPLY_K":
      add(out, k === undefined ? null : input, "LEFT_INPUT_UNCHANGED", correct);
      add(out, k === undefined ? null : input * k + k, "ADDED_MULTIPLIER_AFTER_MULTIPLYING", correct);
      add(out, k === undefined ? null : input + k, "ADDED_INSTEAD_OF_MULTIPLIED", correct);
      break;
    case "NUM_DIVIDE_K":
      add(out, k === undefined ? null : input - k, "SUBTRACTED_DIVISOR_INSTEAD_OF_DIVIDING", correct);
      add(out, k === undefined ? null : input + k, "ADDED_DIVISOR_INSTEAD_OF_DIVIDING", correct);
      add(out, k === undefined ? null : correct + k, "ADDED_DIVISOR_AFTER_DIVIDING", correct);
      add(out, input, "LEFT_INPUT_UNCHANGED", correct);
      break;
    case "NUM_DIVIDE_ADD":
      add(out, m === undefined || k === undefined ? null : input * m + k, "MULTIPLIED_INSTEAD_OF_DIVIDED", correct);
      add(out, m === undefined || k === undefined ? null : input + m + k, "ADDED_DIVISOR_INSTEAD_OF_DIVIDING", correct);
      if (m !== undefined && k !== undefined && input % m === 0) {
        add(out, input / m + k + 1, "FINAL_CONSTANT_ONE_TOO_LARGE", correct);
        add(out, input / m + Math.max(1, k - 1), "FINAL_CONSTANT_ONE_TOO_SMALL", correct);
      }
      break;
    case "NUM_DIVIDE_SUBTRACT":
      add(out, m === undefined || k === undefined ? null : input * m - k, "MULTIPLIED_INSTEAD_OF_DIVIDED", correct);
      add(out, m === undefined || k === undefined ? null : input - m - k, "SUBTRACTED_DIVISOR_INSTEAD_OF_DIVIDING", correct);
      if (m !== undefined && k !== undefined && input % m === 0) {
        add(out, input / m - (k + 1), "FINAL_CONSTANT_ONE_TOO_LARGE", correct);
        add(out, input / m - Math.max(1, k - 1), "FINAL_CONSTANT_ONE_TOO_SMALL", correct);
      }
      break;
    case "NUM_SQUARE":
      add(out, input ** 3, "CUBED_INSTEAD_OF_SQUARED", correct);
      add(out, 2 * input, "DOUBLED_INSTEAD_OF_SQUARED", correct);
      add(out, (input + 1) ** 2, "SQUARED_THE_SUCCESSOR", correct);
      break;
    case "NUM_SQUARE_SUBTRACT":
      add(out, k === undefined ? null : input * input - (k + 1), "SUBTRACTED_ONE_EXTRA", correct);
      add(out, k === undefined || k <= 1 ? null : input * input - (k - 1), "SUBTRACTED_ONE_LESS", correct);
      add(out, input * input + (k ?? 0), "USED_WRONG_FINAL_SIGN", correct);
      break;
    case "NUM_CUBE":
      add(out, input ** 3 - input, "SUBTRACTED_INPUT_AFTER_CUBING", correct);
      add(out, input * (input + 1), "USED_SUCCESSOR_PRODUCT_INSTEAD", correct);
      add(out, 2 * input ** 2, "DOUBLED_THE_SQUARE_INSTEAD", correct);
      break;
    case "NUM_CUBE_ADD":
      add(out, k === undefined ? null : input ** 3 - k, "USED_WRONG_FINAL_SIGN", correct);
      add(out, input ** 3 + input, "ADDED_INPUT_INSTEAD_OF_CONSTANT", correct);
      add(out, k === undefined ? null : input ** 3 + k + 1, "FINAL_CONSTANT_ONE_TOO_LARGE", correct);
      break;
    case "NUM_DOUBLE_SQUARE":
      add(out, input ** 3, "CUBED_INSTEAD_OF_DOUBLE_THEN_SQUARE", correct);
      add(out, 2 * input, "DOUBLED_BUT_FORGOT_TO_SQUARE", correct);
      add(out, (input + 1) ** 2, "SQUARED_THE_SUCCESSOR_INSTEAD", correct);
      break;
    case "NUM_HALF_SQUARE":
      add(out, input / 2, "HALVED_BUT_FORGOT_TO_SQUARE", correct);
      add(out, input % 2 === 0 ? (input / 2 + 1) ** 2 : null, "HALF_VALUE_OFF_BY_ONE_BEFORE_SQUARING", correct);
      add(out, input ** 2, "FORGOT_TO_HALVE", correct);
      break;
    case "DIGIT_SUM":
      add(out, a, "USED_TENS_DIGIT_ONLY", correct);
      add(out, b, "USED_UNITS_DIGIT_ONLY", correct);
      add(out, a * b, "MULTIPLIED_DIGITS_INSTEAD", correct);
      add(out, 10 * b + a, "REVERSED_DIGITS_INSTEAD", correct);
      break;
    case "DIGIT_PRODUCT":
      add(out, a, "USED_TENS_DIGIT_ONLY", correct);
      add(out, b, "USED_UNITS_DIGIT_ONLY", correct);
      add(out, a * b + b, "ADDED_UNITS_AFTER_PRODUCT", correct);
      add(out, a + b, "ADDED_DIGITS_INSTEAD", correct);
      break;
    case "DIGIT_ABS_DIFF":
      add(out, a, "USED_TENS_DIGIT_ONLY", correct);
      add(out, b, "USED_UNITS_DIGIT_ONLY", correct);
      add(out, a + b, "ADDED_DIGITS_INSTEAD", correct);
      add(out, a * b, "MULTIPLIED_DIGITS_INSTEAD", correct);
      break;
    case "DIGIT_SUM_SQUARES":
      add(out, a * b, "MULTIPLIED_DIGITS_INSTEAD_OF_SQUARING", correct);
      add(out, a * a + b, "SQUARED_ONLY_TENS_DIGIT", correct);
      add(out, a + b * b, "SQUARED_ONLY_UNITS_DIGIT", correct);
      add(out, (a - b) ** 2, "SQUARED_THE_DIGIT_DIFFERENCE", correct);
      break;
    case "DIGIT_PRODUCT_PLUS_SUM":
      add(out, (a + 1) * (b + 1), "MULTIPLIED_INCREMENTED_DIGITS", correct);
      add(out, a * a + b * b, "ADDED_DIGIT_SQUARES_INSTEAD", correct);
      add(out, a * b + Math.abs(a - b), "ADDED_DIGIT_DIFFERENCE_TO_PRODUCT", correct);
      break;
    case "DIGIT_REVERSE":
      add(out, a + b, "ADDED_DIGITS_INSTEAD_OF_REVERSING", correct);
      add(out, a * b, "MULTIPLIED_DIGITS_INSTEAD_OF_REVERSING", correct);
      add(out, Math.abs(a - b), "SUBTRACTED_DIGITS_INSTEAD_OF_REVERSING", correct);
      add(out, input, "KEPT_ORIGINAL_DIGIT_ORDER", correct);
      break;
    case "DIGIT_POSITIONAL":
      add(out, a * b + a + b, "ADDED_BOTH_DIGITS_AFTER_PRODUCT", correct);
      add(out, 10 * a + b, "KEPT_ORIGINAL_TWO_DIGIT_NUMBER", correct);
      add(out, 10 * b + a, "REVERSED_DIGITS_INSTEAD", correct);
      add(out, a * a + b * b, "ADDED_DIGIT_SQUARES_INSTEAD", correct);
      break;
  }

  return out;
}
