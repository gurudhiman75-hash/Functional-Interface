import { ratioDisplay } from "../DI-001/exact";
import type { Di005Question, Di005QuestionSet } from "./types";

function percent(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-005 independent verifier received an invalid percentage state.");
  }
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  const hundredths = (n * 10_000n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  if (fraction === 0) return `${whole}%`;
  if (fraction % 10 === 0) return `${whole}.${fraction / 10}%`;
  return `${whole}.${String(fraction).padStart(2, "0")}%`;
}

export function independentlySolveDi005Question(set: Di005QuestionSet, question: Di005Question): string {
  const slices = set.stimulus.slices;
  const e = question.evidence;

  switch (question.kind) {
    case "MISSING_SECTOR_PERCENT": {
      const visibleTotal = slices.reduce((sum, slice, index) => index === set.stimulus.hiddenPercentIndex ? sum : sum + slice.percent, 0);
      return `${100 - visibleTotal}%`;
    }
    case "SECTOR_ANGLE_DEGREES": {
      const slice = slices[e.categoryIndex!]!;
      return `${(slice.percent * 360) / 100}°`;
    }
    case "SECTOR_COUNT_FROM_TOTAL": {
      const slice = slices[e.categoryIndex!]!;
      return String((set.stimulus.totalStudents * slice.percent) / 100);
    }
    case "RATIO_OF_TWO_SECTORS": {
      const first = slices[e.firstIndex!]!;
      const second = slices[e.secondIndex!]!;
      return ratioDisplay(first.percent, second.percent);
    }
    case "RELATIVE_SECTOR_PERCENT_EXCESS": {
      const larger = slices[e.largerIndex!]!;
      const smaller = slices[e.smallerIndex!]!;
      return percent(larger.percent - smaller.percent, smaller.percent);
    }
  }
}

export function independentlyVerifyDi005QuestionSet(set: Di005QuestionSet): boolean {
  if (set.stimulus.kind !== "PIE") return false;
  if (set.stimulus.slices.length !== 5 || set.questions.length !== 5) return false;
  if (set.stimulus.slices.reduce((sum, slice) => sum + slice.percent, 0) !== 100) return false;
  if (set.stimulus.slices.reduce((sum, slice) => sum + slice.angleDegrees, 0) !== 360) return false;
  if (new Set(set.questions.map((question) => question.kind)).size !== 5) return false;

  return set.questions.every((question) => {
    const expected = independentlySolveDi005Question(set, question);
    return (
      expected === question.answer &&
      question.options.length === set.optionCount &&
      new Set(question.options).size === question.options.length &&
      question.options.filter((option) => option === expected).length === 1 &&
      question.options[question.correctIndex] === expected
    );
  });
}
