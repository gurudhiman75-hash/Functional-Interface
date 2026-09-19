import { ratioDisplay } from "../DI-001/exact";
import type { Di007V2Question, Di007V2QuestionSet } from "./missing-v2-types";

function percent(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new Error("DI-007 V2 verifier received an invalid percentage state.");
  }
  const sign = numerator < 0 ? -1n : 1n;
  const n = BigInt(Math.abs(numerator));
  const d = BigInt(denominator);
  const hundredths = (n * 10_000n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  const prefix = sign < 0n ? "-" : "";
  if (fraction === 0) return `${prefix}${whole}%`;
  if (fraction % 10 === 0) return `${prefix}${whole}.${fraction / 10}%`;
  return `${prefix}${whole}.${String(fraction).padStart(2, "0")}%`;
}

function reconstructBTotal(set: Di007V2QuestionSet): number {
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
      if (product % condition.denominator! !== 0) throw new Error("DI-007 V2 verifier found a non-integral ratio total.");
      return product / condition.denominator!;
    }
    case "DIFFERENCE_FROM_A_TOTAL":
      return condition.direction === "ABOVE" ? totalA + condition.value! : totalA - condition.value!;
  }
}

function reconstructMissing(set: Di007V2QuestionSet): number {
  const totalB = reconstructBTotal(set);
  const visibleB = set.stimulus.points.reduce(
    (sum, point, index) => index === set.stimulus.hiddenIndex ? sum : sum + point.seriesB,
    0,
  );
  return totalB - visibleB;
}

function visibleIndex(question: Di007V2Question): number {
  return Number(question.evidence.visibleIndex ?? question.evidence.visibleI ?? -1);
}

export function independentlySolveDi007V2Question(set: Di007V2QuestionSet, question: Di007V2Question): string {
  const hiddenIndex = set.stimulus.hiddenIndex;
  const hiddenPoint = set.stimulus.points[hiddenIndex]!;
  const hidden = reconstructMissing(set);
  const totalA = set.stimulus.points.reduce((sum, point) => sum + point.seriesA, 0);
  const totalB = reconstructBTotal(set);

  switch (question.kind) {
    case "DIRECT_VISIBLE_VALUE": {
      const index = visibleIndex(question);
      return String(set.stimulus.points[index]!.seriesB);
    }
    case "VISIBLE_ROW_DIFFERENCE": {
      const index = visibleIndex(question);
      const point = set.stimulus.points[index]!;
      return String(Math.abs(point.seriesA - point.seriesB));
    }
    case "RECOVER_MISSING_VALUE":
      return String(hidden);
    case "HIDDEN_ROW_COMBINED_TOTAL":
      return String(hiddenPoint.seriesA + hidden);
    case "MISSING_TO_PAIRED_RATIO":
      return ratioDisplay(hidden, hiddenPoint.seriesA);
    case "B_TOTAL_AS_PERCENT_OF_A_TOTAL":
      return percent(totalB, totalA);
    case "MISSING_SHARE_OF_B_TOTAL":
      return percent(hidden, totalB);
    case "VISIBLE_TWO_ROW_B_TOTAL": {
      const left = Number(question.evidence.visibleI);
      const right = Number(question.evidence.visibleJ);
      return String(set.stimulus.points[left]!.seriesB + set.stimulus.points[right]!.seriesB);
    }
    case "MISSING_AS_PERCENT_OF_PAIRED_A":
      return percent(hidden, hiddenPoint.seriesA);
    case "COMBINED_HIDDEN_VISIBLE_SHARE_OF_B_TOTAL": {
      const index = visibleIndex(question);
      return percent(hidden + set.stimulus.points[index]!.seriesB, totalB);
    }
    case "HIDDEN_VS_VISIBLE_B_PERCENT_EXCESS": {
      const index = visibleIndex(question);
      const other = set.stimulus.points[index]!.seriesB;
      const larger = Math.max(hidden, other);
      const smaller = Math.min(hidden, other);
      return percent(larger - smaller, smaller);
    }
    case "HIDDEN_ROW_TO_VISIBLE_ROW_TOTAL_RATIO": {
      const index = visibleIndex(question);
      const other = set.stimulus.points[index]!;
      return ratioDisplay(hiddenPoint.seriesA + hidden, other.seriesA + other.seriesB);
    }
  }
}

export function independentlyVerifyDi007V2Set(set: Di007V2QuestionSet): boolean {
  if (set.stimulus.kind !== "MISSING_TABLE") return false;
  if (set.stimulus.points.length !== 5 || set.questions.length !== 5) return false;
  if (set.stimulus.points.filter((point) => point.displaySeriesB === "?").length !== 1) return false;
  if (reconstructMissing(set) !== set.stimulus.points[set.stimulus.hiddenIndex]!.seriesB) return false;

  const counts = set.questions.reduce<Record<string, number>>((acc, question) => {
    acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1;
    return acc;
  }, {});
  if (counts.Easy !== 1 || counts.Medium !== 2 || counts.Hard !== 2) return false;

  return set.questions.every((question) => {
    const expected = independentlySolveDi007V2Question(set, question);
    return expected === question.answer
      && question.options.length === 5
      && new Set(question.options).size === 5
      && question.options.filter((option) => option === expected).length === 1
      && question.options[question.correctIndex] === expected;
  });
}
