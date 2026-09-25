import type { Di003V2Question, Di003V2QuestionSet, Di003V2Stimulus } from "./grouped-bar-v2-types";

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

function ratio(left: number, right: number) {
  const divisor = gcd(left, right);
  return `${left / divisor}:${right / divisor}`;
}

function percent(numerator: number, denominator: number) {
  return `${Math.round((numerator * 100) / denominator)}%`;
}

function fmt(value: number) {
  return String(Math.round(value));
}

function seriesValue(stimulus: Di003V2Stimulus, seriesId: unknown, index: number) {
  const point = stimulus.points[index];
  if (!point) throw new Error(`DI-003 V2 independent verifier received invalid category index ${index}.`);
  if (seriesId === "SERIES_A") return point.seriesA;
  if (seriesId === "SERIES_B") return point.seriesB;
  throw new Error(`DI-003 V2 independent verifier received invalid series id ${String(seriesId)}.`);
}

export function independentlySolveDi003V2Question(stimulus: Di003V2Stimulus, question: Di003V2Question): string {
  const evidence = question.evidence;
  const points = stimulus.points;
  const totalA = points.reduce((sum, point) => sum + point.seriesA, 0);
  const totalB = points.reduce((sum, point) => sum + point.seriesB, 0);

  switch (question.kind) {
    case "DIRECT_BAR_VALUE":
      return String(seriesValue(stimulus, evidence.seriesId, Number(evidence.categoryIndex)));
    case "HIGHEST_CATEGORY_FOR_SERIES": {
      const seriesId = evidence.seriesId;
      return points.reduce((best, point) => {
        const pointValue = seriesId === "SERIES_A" ? point.seriesA : point.seriesB;
        const bestValue = seriesId === "SERIES_A" ? best.seriesA : best.seriesB;
        return pointValue > bestValue ? point : best;
      }, points[0]!).category;
    }
    case "LOWEST_CATEGORY_FOR_SERIES": {
      const seriesId = evidence.seriesId;
      return points.reduce((best, point) => {
        const pointValue = seriesId === "SERIES_A" ? point.seriesA : point.seriesB;
        const bestValue = seriesId === "SERIES_A" ? best.seriesA : best.seriesB;
        return pointValue < bestValue ? point : best;
      }, points[0]!).category;
    }
    case "CROSS_SERIES_DIFFERENCE": {
      const point = points[Number(evidence.categoryIndex)]!;
      return String(Math.abs(point.seriesA - point.seriesB));
    }
    case "COMBINED_CATEGORY_TOTAL": {
      const point = points[Number(evidence.categoryIndex)]!;
      return String(point.seriesA + point.seriesB);
    }
    case "WITHIN_SERIES_DIFFERENCE": {
      const first = seriesValue(stimulus, evidence.seriesId, Number(evidence.firstIndex));
      const second = seriesValue(stimulus, evidence.seriesId, Number(evidence.secondIndex));
      return String(Math.abs(first - second));
    }
    case "CATEGORY_RATIO_WITHIN_SERIES": {
      const first = seriesValue(stimulus, evidence.seriesId, Number(evidence.firstIndex));
      const second = seriesValue(stimulus, evidence.seriesId, Number(evidence.secondIndex));
      return ratio(first, second);
    }
    case "SERIES_AVERAGE": {
      const values = points.map((point) => evidence.seriesId === "SERIES_A" ? point.seriesA : point.seriesB);
      return fmt(values.reduce((sum, value) => sum + value, 0) / values.length);
    }
    case "COMBINED_CATEGORY_RATIO": {
      const first = points[Number(evidence.firstIndex)]!;
      const second = points[Number(evidence.secondIndex)]!;
      return ratio(first.seriesA + first.seriesB, second.seriesA + second.seriesB);
    }
    case "PERCENT_CHANGE_WITHIN_SERIES": {
      const lower = points[Number(evidence.lowerIndex)]!.seriesA;
      const higher = points[Number(evidence.higherIndex)]!.seriesA;
      return percent(higher - lower, lower);
    }
    case "CATEGORY_SHARE_OF_SERIES_TOTAL": {
      const index = Number(evidence.categoryIndex);
      if (evidence.seriesId === "SERIES_A") return percent(points[index]!.seriesA, totalA);
      return percent(points[index]!.seriesB, totalB);
    }
    case "TOTAL_SERIES_PERCENT_EXCESS":
      return percent(totalA - totalB, totalB);
  }
}

export function independentlyVerifyDi003V2QuestionSet(set: Di003V2QuestionSet) {
  return set.questions.every((question) => independentlySolveDi003V2Question(set.stimulus, question) === question.answer);
}
