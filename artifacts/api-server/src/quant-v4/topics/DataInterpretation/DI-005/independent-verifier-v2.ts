import { ratioDisplay } from "../DI-001/exact";
import type { Di005V2Question, Di005V2QuestionSet } from "./pie-v2-types";

function formatQuotient(numerator: number, denominator: number): string {
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  const hundredths = (n * 100n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  if (fraction === 0) return String(whole);
  if (fraction % 10 === 0) return `${whole}.${fraction / 10}`;
  return `${whole}.${String(fraction).padStart(2, "0")}`;
}

function formatPercent(numerator: number, denominator: number): string {
  return `${formatQuotient(numerator * 100, denominator)}%`;
}

function index(question: Di005V2Question, key: string) {
  const value = question.evidence[key];
  if (typeof value !== "number" || !Number.isInteger(value)) throw new Error(`DI-005 V2 verifier missing integer evidence ${key}.`);
  return value;
}

export function independentlySolveDi005V2(set: Di005V2QuestionSet, question: Di005V2Question): string {
  const slices = set.stimulus.slices;
  const total = set.stimulus.totalValue;
  const countFor = (sliceIndex: number) => (total * slices[sliceIndex]!.percent) / 100;

  switch (question.kind) {
    case "DIRECT_SECTOR_PERCENT": {
      const slice = slices[index(question, "categoryIndex")]!;
      return `${slice.percent}%`;
    }
    case "LARGEST_SECTOR_IDENTIFICATION": {
      return slices.reduce((best, slice) => slice.percent > best.percent ? slice : best, slices[0]!).category;
    }
    case "SMALLEST_SECTOR_IDENTIFICATION": {
      return slices.reduce((best, slice) => slice.percent < best.percent ? slice : best, slices[0]!).category;
    }
    case "MISSING_SECTOR_PERCENT": {
      const hidden = slices[set.stimulus.hiddenPercentIndex]!;
      const visible = slices.reduce((sum, slice, sliceIndex) => sliceIndex === set.stimulus.hiddenPercentIndex ? sum : sum + slice.percent, 0);
      return `${100 - visible}%` === `${hidden.percent}%` ? `${hidden.percent}%` : `${100 - visible}%`;
    }
    case "SECTOR_ANGLE_DEGREES": {
      const slice = slices[index(question, "categoryIndex")]!;
      return `${slice.percent * 3.6}°`;
    }
    case "SECTOR_COUNT_FROM_TOTAL": {
      return String(countFor(index(question, "categoryIndex")));
    }
    case "COMBINED_SECTOR_PERCENT": {
      const first = slices[index(question, "firstIndex")]!;
      const second = slices[index(question, "secondIndex")]!;
      return `${first.percent + second.percent}%`;
    }
    case "DIFFERENCE_IN_COUNTS": {
      const first = countFor(index(question, "firstIndex"));
      const second = countFor(index(question, "secondIndex"));
      return String(Math.abs(first - second));
    }
    case "RATIO_OF_TWO_SECTORS": {
      const first = slices[index(question, "firstIndex")]!;
      const second = slices[index(question, "secondIndex")]!;
      return ratioDisplay(first.percent, second.percent);
    }
    case "RELATIVE_SECTOR_PERCENT_EXCESS": {
      const larger = slices[index(question, "largerIndex")]!;
      const smaller = slices[index(question, "smallerIndex")]!;
      return formatPercent(larger.percent - smaller.percent, smaller.percent);
    }
    case "COMBINED_SECTOR_ANGLE": {
      const first = slices[index(question, "firstIndex")]!;
      const second = slices[index(question, "secondIndex")]!;
      return `${(first.percent + second.percent) * 3.6}°`;
    }
    case "REMAINDER_AFTER_TWO_SECTORS_COUNT": {
      const first = slices[index(question, "firstIndex")]!;
      const second = slices[index(question, "secondIndex")]!;
      return String((total * (100 - first.percent - second.percent)) / 100);
    }
  }
}

export function verifyDi005V2Question(set: Di005V2QuestionSet, question: Di005V2Question) {
  const expected = independentlySolveDi005V2(set, question);
  return {
    valid: expected === question.answer && question.options[question.correctIndex] === question.answer,
    expected,
    actual: question.answer,
  } as const;
}
