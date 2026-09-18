import { ratioDisplay } from "../DI-001/exact";
import type { Di006V2Question, Di006V2QuestionSet } from "./caselet-v2-types";

function formatQuotient(numerator: number, denominator: number): string {
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  const hundredths = (n * 100n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  if (fraction === 0) return String(whole);
  if (fraction % 10 === 0) return String(whole) + "." + String(fraction / 10);
  return String(whole) + "." + String(fraction).padStart(2, "0");
}

function formatPercent(numerator: number, denominator: number): string {
  return formatQuotient(numerator * 100, denominator) + "%";
}

function index(question: Di006V2Question, key: string) {
  const value = question.evidence[key];
  if (typeof value !== "number" || !Number.isInteger(value)) throw new Error("DI-006 V2 verifier missing integer evidence " + key + ".");
  return value;
}

function solveCounts(set: Di006V2QuestionSet): number[] {
  const stimulus = set.stimulus;
  const counts = Array<number>(stimulus.categories.length).fill(Number.NaN);
  counts[stimulus.directIndex] = stimulus.directValue;
  for (const relation of stimulus.relations) {
    const source = counts[relation.sourceIndex];
    if (!Number.isFinite(source)) throw new Error("DI-006 V2 verifier found unresolved relation source.");
    const product = source * relation.numerator;
    if (product % relation.denominator !== 0) throw new Error("DI-006 V2 verifier found non-integral relation.");
    counts[relation.targetIndex] = product / relation.denominator;
  }
  const subtotal = counts.reduce((sum, value, categoryIndex) => categoryIndex === stimulus.remainderIndex ? sum : sum + value, 0);
  counts[stimulus.remainderIndex] = stimulus.totalValue - subtotal;
  return counts;
}

export function independentlySolveDi006V2(set: Di006V2QuestionSet, question: Di006V2Question): string {
  const counts = solveCounts(set);
  const total = set.stimulus.totalValue;

  switch (question.kind) {
    case "DIRECT_STATED_VALUE":
    case "SINGLE_RELATION_VALUE":
    case "CHAINED_RELATION_VALUE":
    case "REMAINDER_FROM_TOTAL":
      return String(counts[index(question, "categoryIndex")]!);
    case "DIFFERENCE_BETWEEN_VALUES": {
      const first = counts[index(question, "firstIndex")]!;
      const second = counts[index(question, "secondIndex")]!;
      return String(Math.abs(first - second));
    }
    case "COMBINED_TWO_VALUES": {
      return String(counts[index(question, "firstIndex")]! + counts[index(question, "secondIndex")]!);
    }
    case "RATIO_OF_TWO_VALUES":
    case "REMAINDER_TO_DERIVED_RATIO": {
      return ratioDisplay(counts[index(question, "firstIndex")]!, counts[index(question, "secondIndex")]!);
    }
    case "SHARE_OF_TOTAL": {
      return formatPercent(counts[index(question, "categoryIndex")]!, total);
    }
    case "AVERAGE_OF_TWO_VALUES": {
      return formatQuotient(counts[index(question, "firstIndex")]! + counts[index(question, "secondIndex")]!, 2);
    }
    case "COMBINED_DERIVED_SHARE": {
      const combined = counts[index(question, "firstIndex")]! + counts[index(question, "secondIndex")]!;
      return formatPercent(combined, total);
    }
    case "RELATIVE_PERCENT_EXCESS": {
      const larger = counts[index(question, "largerIndex")]!;
      const smaller = counts[index(question, "smallerIndex")]!;
      return formatPercent(larger - smaller, smaller);
    }
  }
}

export function verifyDi006V2Question(set: Di006V2QuestionSet, question: Di006V2Question) {
  const expected = independentlySolveDi006V2(set, question);
  return {
    valid: expected === question.answer && question.options[question.correctIndex] === question.answer,
    expected,
    actual: question.answer,
  } as const;
}
