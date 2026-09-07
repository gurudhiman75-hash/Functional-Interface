import type { Di004Question, Di004QuestionSet } from "./types";

function percent(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-004 independent verifier received an invalid percentage state.");
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

function average(sum: number, count: number): string {
  if (!Number.isSafeInteger(sum) || !Number.isSafeInteger(count) || sum <= 0 || count <= 0) {
    throw new Error("DI-004 independent verifier received an invalid average state.");
  }
  const n = BigInt(sum);
  const d = BigInt(count);
  const hundredths = (n * 100n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  if (fraction === 0) return String(whole);
  if (fraction % 10 === 0) return `${whole}.${fraction / 10}`;
  return `${whole}.${String(fraction).padStart(2, "0")}`;
}

export function independentlySolveDi004Question(set: Di004QuestionSet, question: Di004Question): string {
  const points = set.stimulus.points;
  const e = question.evidence;

  switch (question.kind) {
    case "FIRST_OVERTAKE_PERIOD": {
      for (let index = 1; index < points.length; index += 1) {
        if (
          points[index - 1]!.seriesA < points[index - 1]!.seriesB &&
          points[index]!.seriesA > points[index]!.seriesB
        ) {
          return points[index]!.period;
        }
      }
      throw new Error("DI-004 independent verifier could not locate an overtake.");
    }

    case "CLOSEST_LINES_PERIOD": {
      let bestIndex = 0;
      let bestGap = Number.POSITIVE_INFINITY;
      for (let index = 0; index < points.length; index += 1) {
        const gap = Math.abs(points[index]!.seriesA - points[index]!.seriesB);
        if (gap < bestGap) {
          bestGap = gap;
          bestIndex = index;
        }
      }
      return points[bestIndex]!.period;
    }

    case "CONSECUTIVE_PERCENT_INCREASE_A": {
      const from = points[e.fromIndex!]!.seriesA;
      const to = points[e.toIndex!]!.seriesA;
      return percent(to - from, from);
    }

    case "THREE_PERIOD_AVERAGE_B": {
      const start = e.startIndex!;
      const sum = points[start]!.seriesB + points[start + 1]!.seriesB + points[start + 2]!.seriesB;
      return average(sum, 3);
    }

    case "B_RANGE_PERCENT_INCREASE": {
      const values = points.map((point) => point.seriesB);
      const low = Math.min(...values);
      const high = Math.max(...values);
      return percent(high - low, low);
    }
  }
}

export function independentlyVerifyDi004QuestionSet(set: Di004QuestionSet): boolean {
  if (set.stimulus.kind !== "LINE") return false;
  if (set.stimulus.points.length !== 6 || set.questions.length !== 5) return false;
  if (new Set(set.questions.map((question) => question.kind)).size !== 5) return false;

  return set.questions.every((question) => {
    const expected = independentlySolveDi004Question(set, question);
    return (
      expected === question.answer &&
      question.options.length === set.optionCount &&
      new Set(question.options).size === question.options.length &&
      question.options.filter((option) => option === expected).length === 1 &&
      question.options[question.correctIndex] === expected
    );
  });
}
