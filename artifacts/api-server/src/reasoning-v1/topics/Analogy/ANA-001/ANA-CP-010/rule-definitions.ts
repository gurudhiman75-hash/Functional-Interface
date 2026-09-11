export type AnaCp010NumericRuleId =
  | "NUM_HIGHER_FIXED_POWER"
  | "NUM_EXACT_SQUARE_ROOT"
  | "NUM_CUBE_ROOT_ADJUST"
  | "NUM_CUBE_SUBTRACT"
  | "NUM_DIGIT_QUOTIENT"
  | "NUM_THREE_DIGIT_SUM"
  | "NUM_THREE_DIGIT_PRODUCT";

export interface AnaCp010NumericContext {
  exponent?: 4 | 5;
  adjust?: -2 | -1 | 1 | 2;
  constant?: 1 | 2 | 4 | 5;
}

export interface AnaCp010NumericRule {
  id: AnaCp010NumericRuleId;
  label: string;
  priority: 2 | 3 | 4 | 5;
  contexts: readonly AnaCp010NumericContext[];
  candidateInputs: readonly number[];
  apply(input: number, context: AnaCp010NumericContext): number | null;
  explain(input: number, output: number, context: AnaCp010NumericContext): string;
}

function digits3(input: number): readonly [number, number, number] | null {
  if (!Number.isInteger(input) || input < 100 || input > 999) return null;
  return [Math.floor(input / 100), Math.floor(input / 10) % 10, input % 10] as const;
}

function twoDigits(input: number): readonly [number, number] | null {
  if (!Number.isInteger(input) || input < 10 || input > 99) return null;
  return [Math.floor(input / 10), input % 10] as const;
}

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, index) => start + index);
const squareInputs = range(8, 32).map((value) => value * value);
const cubeInputs = range(5, 16).map((value) => value * value * value);
const threeDigitNoZero = range(123, 987).filter((value) => !String(value).includes("0"));
const exactDigitQuotients = range(21, 99).filter((value) => {
  const [a, b] = twoDigits(value)!;
  if (b === 0 || a < b || a % b !== 0) return false;

  // Admit only instances that can support at least three genuinely different
  // digit-operation misconceptions. This keeps option quality deterministic
  // without falling back to arbitrary near-value distractors.
  const correct = a / b;
  const misconceptionValues = [Math.abs(a - b), a + b, a * b, Math.floor(b / a), a, b]
    .filter((candidate) => Number.isInteger(candidate) && candidate > 0 && candidate !== correct);
  return new Set(misconceptionValues).size >= 3;
});

export const ANA_CP010_NUMERIC_RULES: readonly AnaCp010NumericRule[] = [
  {
    id: "NUM_HIGHER_FIXED_POWER",
    label: "raise the number to the same higher power",
    priority: 4,
    contexts: [{ exponent: 4 }, { exponent: 5 }],
    candidateInputs: range(2, 7),
    apply: (input, context) => input ** context.exponent!,
    explain: (input, output, context) => `${input}^${context.exponent} = ${output}`,
  },
  {
    id: "NUM_EXACT_SQUARE_ROOT",
    label: "take the exact square root",
    priority: 3,
    contexts: [{}],
    candidateInputs: squareInputs,
    apply: (input) => {
      const root = Math.sqrt(input);
      return Number.isInteger(root) ? root : null;
    },
    explain: (input, output) => `sqrt(${input}) = ${output}`,
  },
  {
    id: "NUM_CUBE_ROOT_ADJUST",
    label: "take the exact cube root and apply the same small adjustment",
    priority: 5,
    contexts: [{ adjust: -2 }, { adjust: -1 }, { adjust: 1 }, { adjust: 2 }],
    candidateInputs: cubeInputs,
    apply: (input, context) => {
      const root = Math.round(Math.cbrt(input));
      if (root ** 3 !== input) return null;
      const output = root + context.adjust!;
      return output > 0 ? output : null;
    },
    explain: (input, output, context) => `cuberoot(${input}) ${context.adjust! < 0 ? "-" : "+"} ${Math.abs(context.adjust!)} = ${output}`,
  },
  {
    id: "NUM_CUBE_SUBTRACT",
    label: "cube the number and subtract the same constant",
    priority: 5,
    contexts: [{ constant: 1 }, { constant: 2 }, { constant: 4 }, { constant: 5 }],
    candidateInputs: range(3, 14),
    apply: (input, context) => input ** 3 - context.constant!,
    explain: (input, output, context) => `${input}^3 - ${context.constant} = ${output}`,
  },
  {
    id: "NUM_DIGIT_QUOTIENT",
    label: "divide the tens digit by the units digit",
    priority: 3,
    contexts: [{}],
    candidateInputs: exactDigitQuotients,
    apply: (input) => {
      const pair = twoDigits(input);
      if (!pair || pair[1] === 0 || pair[0] % pair[1] !== 0) return null;
      return pair[0] / pair[1];
    },
    explain: (input, output) => {
      const [a, b] = twoDigits(input)!;
      return `${input} -> ${a} / ${b} = ${output}`;
    },
  },
  {
    id: "NUM_THREE_DIGIT_SUM",
    label: "add all three digits",
    priority: 2,
    contexts: [{}],
    candidateInputs: threeDigitNoZero,
    apply: (input) => {
      const digits = digits3(input);
      return digits ? digits[0] + digits[1] + digits[2] : null;
    },
    explain: (input, output) => {
      const [a, b, c] = digits3(input)!;
      return `${input} -> ${a} + ${b} + ${c} = ${output}`;
    },
  },
  {
    id: "NUM_THREE_DIGIT_PRODUCT",
    label: "multiply all three digits",
    priority: 3,
    contexts: [{}],
    candidateInputs: threeDigitNoZero,
    apply: (input) => {
      const digits = digits3(input);
      return digits ? digits[0] * digits[1] * digits[2] : null;
    },
    explain: (input, output) => {
      const [a, b, c] = digits3(input)!;
      return `${input} -> ${a} x ${b} x ${c} = ${output}`;
    },
  },
] as const;

export function anaCp010NumericRuleById(ruleId: AnaCp010NumericRuleId): AnaCp010NumericRule {
  const rule = ANA_CP010_NUMERIC_RULES.find((entry) => entry.id === ruleId);
  if (!rule) throw new Error(`Unknown ANA-CP-010 numeric rule: ${ruleId}`);
  return rule;
}
