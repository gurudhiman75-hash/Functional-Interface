import type { Di003Question, Di003QuestionSet } from "./types";

function gcd(a: number, b: number): number {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right !== 0) {
    const next = left % right;
    left = right;
    right = next;
  }
  return left || 1;
}

function ratio(left: number, right: number): string {
  const divisor = gcd(left, right);
  return `${left / divisor}:${right / divisor}`;
}

function percent(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-003 independent verifier received an invalid percentage fraction.");
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

export function independentlySolveDi003Question(set: Di003QuestionSet, question: Di003Question): string {
  const points = set.stimulus.points;
  const e = question.evidence;

  switch (question.kind) {
    case "CROSS_SERIES_DIFFERENCE": {
      const point = points[e.categoryIndex!]!;
      return String(Math.abs(point.seriesA - point.seriesB));
    }

    case "COMBINED_CATEGORY_RATIO": {
      const first = points[e.firstIndex!]!;
      const second = points[e.secondIndex!]!;
      return ratio(first.seriesA + first.seriesB, second.seriesA + second.seriesB);
    }

    case "PERCENT_CHANGE_WITHIN_SERIES": {
      const from = points[e.fromIndex!]!.seriesA;
      const to = points[e.toIndex!]!.seriesA;
      return percent(to - from, from);
    }

    case "CATEGORY_SHARE_OF_SERIES_TOTAL": {
      const target = points[e.categoryIndex!]!.seriesB;
      const total = points.reduce((sum, point) => sum + point.seriesB, 0);
      return percent(target, total);
    }

    case "TOTAL_SERIES_PERCENT_EXCESS": {
      const totalA = points.reduce((sum, point) => sum + point.seriesA, 0);
      const totalB = points.reduce((sum, point) => sum + point.seriesB, 0);
      return percent(totalA - totalB, totalB);
    }
  }
}

export function independentlyVerifyDi003QuestionSet(set: Di003QuestionSet): boolean {
  if (set.stimulus.kind !== "GROUPED_BAR") return false;
  if (set.stimulus.points.length !== 5 || set.questions.length !== 5) return false;
  if (new Set(set.questions.map((question) => question.kind)).size !== 5) return false;

  return set.questions.every((question) => {
    const expected = independentlySolveDi003Question(set, question);
    return (
      expected === question.answer &&
      question.options.length === set.optionCount &&
      new Set(question.options).size === question.options.length &&
      question.options.filter((option) => option === expected).length === 1 &&
      question.options[question.correctIndex] === expected
    );
  });
}
