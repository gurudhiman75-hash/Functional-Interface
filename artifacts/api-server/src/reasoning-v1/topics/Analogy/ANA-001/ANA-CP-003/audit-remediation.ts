import type { NumericRuleContext, NumericRuleDefinition } from "./rule-definitions";

export type NumericDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumericMisconceptionCandidate {
  value: number;
  errorLabel: string;
}

function digits(input: number): readonly [number, number] {
  return [Math.floor(input / 10), input % 10] as const;
}

function push(
  out: NumericMisconceptionCandidate[],
  value: number | null | undefined,
  errorLabel: string,
  correct: number,
): void {
  if (value === null || value === undefined || !Number.isInteger(value) || value <= 0 || value === correct) return;
  if (out.some((candidate) => candidate.value === value)) return;
  out.push({ value, errorLabel });
}

/**
 * Builds wrong answers from recognisable learner mistakes rather than from
 * arbitrary distance from the correct value. A small arithmetic fallback is
 * deliberately retained only to guarantee four-option construction.
 */
export function numericMisconceptions(
  ruleId: string,
  context: NumericRuleContext,
  input: number,
  correct: number,
): NumericMisconceptionCandidate[] {
  const out: NumericMisconceptionCandidate[] = [];
  const k = context.k;
  const m = context.m;
  const [a, b] = digits(input);

  switch (ruleId) {
    case "NUM_ADD_K":
      push(out, k === undefined ? null : input - k, "SUBTRACTED_CONSTANT_INSTEAD", correct);
      push(out, k === undefined ? null : input + k - 1, "CONSTANT_OFF_BY_ONE", correct);
      push(out, k === undefined ? null : input + k + 1, "CONSTANT_OFF_BY_ONE", correct);
      break;
    case "NUM_SUBTRACT_K":
      push(out, k === undefined ? null : input + k, "ADDED_CONSTANT_INSTEAD", correct);
      push(out, k === undefined ? null : input - (k - 1), "CONSTANT_OFF_BY_ONE", correct);
      push(out, k === undefined ? null : input - (k + 1), "CONSTANT_OFF_BY_ONE", correct);
      break;
    case "NUM_MULTIPLY_K":
      push(out, k === undefined ? null : input + k, "ADDED_INSTEAD_OF_MULTIPLIED", correct);
      push(out, k === undefined ? null : input * (k - 1), "MULTIPLIER_OFF_BY_ONE", correct);
      push(out, k === undefined ? null : input * (k + 1), "MULTIPLIER_OFF_BY_ONE", correct);
      break;
    case "NUM_DIVIDE_K":
      push(out, k === undefined ? null : input * k, "MULTIPLIED_INSTEAD_OF_DIVIDED", correct);
      if (k !== undefined && k > 2 && input % (k - 1) === 0) push(out, input / (k - 1), "DIVISOR_OFF_BY_ONE", correct);
      if (k !== undefined && input % (k + 1) === 0) push(out, input / (k + 1), "DIVISOR_OFF_BY_ONE", correct);
      break;
    case "NUM_MULTIPLY_ADD":
      push(out, m === undefined || k === undefined ? null : input * m - k, "USED_WRONG_FINAL_SIGN", correct);
      push(out, m === undefined ? null : input * m, "OMITTED_FINAL_CONSTANT", correct);
      push(out, m === undefined || k === undefined ? null : input * (m + 1) + k, "MULTIPLIER_OFF_BY_ONE", correct);
      push(out, m === undefined || k === undefined ? null : input + m + k, "ADDED_INSTEAD_OF_MULTIPLIED", correct);
      break;
    case "NUM_MULTIPLY_SUBTRACT":
      push(out, m === undefined || k === undefined ? null : input * m + k, "USED_WRONG_FINAL_SIGN", correct);
      push(out, m === undefined ? null : input * m, "OMITTED_FINAL_CONSTANT", correct);
      push(out, m === undefined || k === undefined || m <= 1 ? null : input * (m - 1) - k, "MULTIPLIER_OFF_BY_ONE", correct);
      break;
    case "NUM_DIVIDE_ADD":
      if (m !== undefined && input % m === 0) {
        push(out, input / m - (k ?? 0), "USED_WRONG_FINAL_SIGN", correct);
        push(out, input / m, "OMITTED_FINAL_CONSTANT", correct);
      }
      if (m !== undefined && k !== undefined && input % (m + 1) === 0) push(out, input / (m + 1) + k, "DIVISOR_OFF_BY_ONE", correct);
      break;
    case "NUM_DIVIDE_SUBTRACT":
      if (m !== undefined && input % m === 0) {
        push(out, input / m + (k ?? 0), "USED_WRONG_FINAL_SIGN", correct);
        push(out, input / m, "OMITTED_FINAL_CONSTANT", correct);
      }
      if (m !== undefined && m > 2 && k !== undefined && input % (m - 1) === 0) push(out, input / (m - 1) - k, "DIVISOR_OFF_BY_ONE", correct);
      break;
    case "NUM_SQUARE":
      push(out, input * (input + 1), "USED_SUCCESSOR_PRODUCT", correct);
      push(out, input * (input - 1), "USED_PREDECESSOR_PRODUCT", correct);
      push(out, input * input + input, "ADDED_INPUT_AFTER_SQUARING", correct);
      break;
    case "NUM_SQUARE_ADD":
      push(out, k === undefined ? null : input * input - k, "USED_WRONG_FINAL_SIGN", correct);
      push(out, input * input, "OMITTED_FINAL_CONSTANT", correct);
      push(out, k === undefined ? null : (input + k) * (input + k), "SHIFTED_BEFORE_SQUARING", correct);
      break;
    case "NUM_SQUARE_SUBTRACT":
      push(out, k === undefined ? null : input * input + k, "USED_WRONG_FINAL_SIGN", correct);
      push(out, input * input, "OMITTED_FINAL_CONSTANT", correct);
      push(out, k === undefined || input <= k ? null : (input - k) * (input - k), "SHIFTED_BEFORE_SQUARING", correct);
      break;
    case "NUM_CUBE":
      push(out, input * input, "SQUARED_INSTEAD_OF_CUBED", correct);
      push(out, input * input * input + input, "ADDED_INPUT_AFTER_CUBING", correct);
      push(out, input * input * (input - 1), "USED_PREDECESSOR_FACTOR", correct);
      break;
    case "NUM_CUBE_ADD":
      push(out, k === undefined ? null : input * input * input - k, "USED_WRONG_FINAL_SIGN", correct);
      push(out, input * input * input, "OMITTED_FINAL_CONSTANT", correct);
      push(out, k === undefined ? null : input * input + k, "SQUARED_INSTEAD_OF_CUBED", correct);
      break;
    case "NUM_DOUBLE_SQUARE":
      push(out, 2 * input * input, "DOUBLED_AFTER_SQUARING", correct);
      push(out, (input + 2) * (input + 2), "ADDED_TWO_BEFORE_SQUARING", correct);
      push(out, input * input + 2, "ADDED_TWO_AFTER_SQUARING", correct);
      break;
    case "NUM_HALF_SQUARE":
      push(out, input * input, "FORGOT_TO_HALVE", correct);
      push(out, input % 2 === 0 ? (input * input) / 2 : null, "HALVED_AFTER_SQUARING", correct);
      push(out, input > 2 ? (input - 2) * (input - 2) : null, "SUBTRACTED_TWO_BEFORE_SQUARING", correct);
      break;
    case "NUM_TIMES_SUCCESSOR":
      push(out, input * (input - 1), "USED_PREDECESSOR", correct);
      push(out, input * input, "USED_SQUARE", correct);
      push(out, input * (input + 2), "SKIPPED_ONE_SUCCESSOR", correct);
      break;
    case "NUM_TIMES_PREDECESSOR":
      push(out, input * (input + 1), "USED_SUCCESSOR", correct);
      push(out, input * input, "USED_SQUARE", correct);
      push(out, input > 2 ? input * (input - 2) : null, "SKIPPED_ONE_PREDECESSOR", correct);
      break;
    case "DIGIT_SUM":
      push(out, a * b, "MULTIPLIED_DIGITS_INSTEAD", correct);
      push(out, Math.abs(a - b), "SUBTRACTED_DIGITS_INSTEAD", correct);
      push(out, a + b + 1, "DIGIT_SUM_OFF_BY_ONE", correct);
      break;
    case "DIGIT_PRODUCT":
      push(out, a + b, "ADDED_DIGITS_INSTEAD", correct);
      push(out, Math.abs(a - b), "SUBTRACTED_DIGITS_INSTEAD", correct);
      push(out, a * b + a, "ADDED_TENS_AFTER_PRODUCT", correct);
      break;
    case "DIGIT_ABS_DIFF":
      push(out, a + b, "ADDED_DIGITS_INSTEAD", correct);
      push(out, a * b, "MULTIPLIED_DIGITS_INSTEAD", correct);
      push(out, Math.abs(a - b) + 1, "DIGIT_DIFFERENCE_OFF_BY_ONE", correct);
      break;
    case "DIGIT_SUM_SQUARES":
      push(out, (a + b) * (a + b), "SQUARED_THE_DIGIT_SUM", correct);
      push(out, Math.abs(a * a - b * b), "SUBTRACTED_DIGIT_SQUARES", correct);
      push(out, a + b, "ADDED_DIGITS_WITHOUT_SQUARING", correct);
      break;
    case "DIGIT_PRODUCT_PLUS_SUM":
      push(out, a * b, "OMITTED_DIGIT_SUM", correct);
      push(out, a + b, "OMITTED_DIGIT_PRODUCT", correct);
      push(out, a * b + a, "OMITTED_ONES_DIGIT_FROM_SUM", correct);
      push(out, a * b + b, "OMITTED_TENS_DIGIT_FROM_SUM", correct);
      break;
    case "DIGIT_REVERSE":
      push(out, input, "KEPT_ORIGINAL_DIGIT_ORDER", correct);
      push(out, 10 * b + b, "REPEATED_ONES_DIGIT", correct);
      push(out, 10 * a + a, "REPEATED_TENS_DIGIT", correct);
      break;
    case "DIGIT_POSITIONAL":
      push(out, a * b + b, "ADDED_ONES_INSTEAD_OF_TENS", correct);
      push(out, a * b, "OMITTED_TENS_DIGIT", correct);
      push(out, a + b, "ADDED_DIGITS_INSTEAD_OF_POSITIONAL_RULE", correct);
      break;
  }

  // Controlled fallback: used only if the rule-specific model did not yield
  // three distinct positive integers for the particular instance.
  for (const delta of [1, -1, 2, -2, 3, -3]) {
    if (out.length >= 3) break;
    push(out, correct + delta, "ARITHMETIC_OFF_BY_ONE_FALLBACK", correct);
  }
  return out;
}

export function deriveNumericDifficulty(
  rule: NumericRuleDefinition,
  context: NumericRuleContext,
  presentationMode: "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION",
  wrongValues: readonly number[],
  correct: number,
): NumericDifficulty {
  let score = 0;

  // Rule priority represents transformation/inference complexity, not value size.
  if (rule.priority >= 3) score += 1;
  if (rule.priority >= 5) score += 1;
  if (rule.priority >= 7) score += 1;
  if (context.m !== undefined && context.k !== undefined) score += 1;
  if (rule.family === "DIGIT_BASED" && rule.priority >= 4) score += 1;
  if (presentationMode === "EQUIVALENT_PAIR_SELECTION") score += 1;

  const nearest = wrongValues.length
    ? Math.min(...wrongValues.map((value) => Math.abs(value - correct)))
    : Number.POSITIVE_INFINITY;
  if (nearest <= 2) score += 1;

  if (score <= 1) return "EASY";
  if (score <= 3) return "MEDIUM";
  return "HARD";
}
