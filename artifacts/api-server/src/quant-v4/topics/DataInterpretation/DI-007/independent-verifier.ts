import { ratioDisplay } from "../DI-001/exact";
import type { Di007Question, Di007QuestionSet } from "./types";

function percent(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-007 independent verifier received an invalid percentage state.");
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

function reconstructBTotal(set: Di007QuestionSet): number {
  const totalA = set.stimulus.points.reduce((sum, point) => sum + point.seriesA, 0);
  const condition = set.stimulus.aggregateCondition;
  switch (condition.mode) {
    case "COLUMN_TOTAL":
      return condition.value!;
    case "COLUMN_AVERAGE":
      return condition.value! * set.stimulus.points.length;
    case "COMBINED_TOTAL":
      return condition.value! - totalA;
    case "TOTAL_RATIO_TO_A": {
      const product = totalA * condition.numerator!;
      if (product % condition.denominator! !== 0) throw new Error("DI-007 independent verifier found a non-integral ratio total.");
      return product / condition.denominator!;
    }
    case "DIFFERENCE_FROM_A_TOTAL":
      return condition.direction === "ABOVE" ? totalA + condition.value! : totalA - condition.value!;
  }
}

function reconstructMissing(set: Di007QuestionSet): number {
  const totalB = reconstructBTotal(set);
  const visibleB = set.stimulus.points.reduce((sum, point, index) => index === set.stimulus.hiddenIndex ? sum : sum + point.seriesB, 0);
  return totalB - visibleB;
}

export function independentlySolveDi007Question(set: Di007QuestionSet, question: Di007Question): string {
  const hiddenIndex = set.stimulus.hiddenIndex;
  const hidden = reconstructMissing(set);
  const point = set.stimulus.points[hiddenIndex]!;
  const totalA = set.stimulus.points.reduce((sum, row) => sum + row.seriesA, 0);
  const totalB = reconstructBTotal(set);

  switch (question.kind) {
    case "RECOVER_MISSING_VALUE":
      return String(hidden);
    case "MISSING_TO_PAIRED_RATIO":
      return ratioDisplay(hidden, point.seriesA);
    case "B_TOTAL_AS_PERCENT_OF_A_TOTAL":
      return percent(totalB, totalA);
    case "HIDDEN_ROW_COMBINED_TOTAL":
      return String(hidden + point.seriesA);
    case "MISSING_SHARE_OF_B_TOTAL":
      return percent(hidden, totalB);
  }
}

export function independentlyVerifyDi007QuestionSet(set: Di007QuestionSet): boolean {
  if (set.stimulus.kind !== "MISSING_TABLE") return false;
  if (set.stimulus.points.length !== 5 || set.questions.length !== 5) return false;
  if (set.stimulus.points.filter((point) => point.displaySeriesB === "?").length !== 1) return false;
  if (reconstructMissing(set) !== set.stimulus.points[set.stimulus.hiddenIndex]!.seriesB) return false;
  if (new Set(set.questions.map((question) => question.kind)).size !== 5) return false;

  return set.questions.every((question) => {
    const expected = independentlySolveDi007Question(set, question);
    return (
      expected === question.answer &&
      question.options.length === 5 &&
      new Set(question.options).size === 5 &&
      question.options.filter((option) => option === expected).length === 1 &&
      question.options[question.correctIndex] === expected
    );
  });
}
