import { ratioDisplay } from "../DI-001/exact";
import type { Di004V2Question, Di004V2QuestionSet } from "./line-v2-types";

function nearestWholePercent(numerator: number, denominator: number) {
  return Math.round((numerator * 100) / denominator);
}

export function independentlySolveDi004V2Question(set: Di004V2QuestionSet, question: Di004V2Question): string {
  const points = set.stimulus.points;
  const valuesA = points.map((point) => point.seriesA);
  const valuesB = points.map((point) => point.seriesB);
  const e = question.evidence;

  switch (question.kind) {
    case "CROSS_SERIES_DIFFERENCE": {
      const index = Number(e.targetIndex);
      return String(Math.abs(valuesA[index]! - valuesB[index]!));
    }
    case "COMBINED_PERIOD_TOTAL": {
      const index = Number(e.targetIndex);
      return String(valuesA[index]! + valuesB[index]!);
    }
    case "FIRST_OVERTAKE_PERIOD": {
      for (let index = 1; index < points.length; index += 1) {
        if (valuesA[index - 1]! < valuesB[index - 1]! && valuesA[index]! > valuesB[index]!) {
          return points[index]!.period;
        }
      }
      throw new Error("DI-004 V2 verifier could not locate an overtake.");
    }
    case "CLOSEST_LINES_PERIOD": {
      const gaps = points.map((_, index) => Math.abs(valuesA[index]! - valuesB[index]!));
      const min = Math.min(...gaps);
      return points[gaps.indexOf(min)]!.period;
    }
    case "THREE_PERIOD_AVERAGE": {
      const start = Number(e.startIndex);
      const values = String(e.seriesCode) === "A" ? valuesA : valuesB;
      return String(Math.round((values[start]! + values[start + 1]! + values[start + 2]!) / 3));
    }
    case "CONSECUTIVE_PERCENT_INCREASE": {
      const fromIndex = Number(e.fromIndex);
      const toIndex = Number(e.toIndex);
      const values = String(e.seriesCode) === "A" ? valuesA : valuesB;
      return `${nearestWholePercent(values[toIndex]! - values[fromIndex]!, values[fromIndex]!)}%`;
    }
    case "TWO_PERIOD_SERIES_RATIO": {
      const first = Number(e.firstIndex);
      const second = Number(e.secondIndex);
      return ratioDisplay(valuesA[first]! + valuesA[second]!, valuesB[first]! + valuesB[second]!);
    }
    case "TWO_PERIOD_COMBINED_TOTAL": {
      const first = Number(e.firstIndex);
      const second = Number(e.secondIndex);
      return String(valuesA[first]! + valuesB[first]! + valuesA[second]! + valuesB[second]!);
    }
    case "TOTAL_SERIES_RATIO": {
      return ratioDisplay(
        valuesA.reduce((sum, value) => sum + value, 0),
        valuesB.reduce((sum, value) => sum + value, 0),
      );
    }
    case "COMBINED_PERIOD_PERCENT_EXCESS": {
      const larger = Number(e.largerIndex);
      const smaller = Number(e.smallerIndex);
      const largeTotal = valuesA[larger]! + valuesB[larger]!;
      const smallTotal = valuesA[smaller]! + valuesB[smaller]!;
      return `${nearestWholePercent(largeTotal - smallTotal, smallTotal)}%`;
    }
    case "TOTAL_SERIES_PERCENT_EXCESS": {
      const totalA = valuesA.reduce((sum, value) => sum + value, 0);
      const totalB = valuesB.reduce((sum, value) => sum + value, 0);
      const larger = Math.max(totalA, totalB);
      const smaller = Math.min(totalA, totalB);
      return `${nearestWholePercent(larger - smaller, smaller)}%`;
    }
    case "THREE_VS_THREE_RATIO": {
      const left = [Number(e.a1), Number(e.a2), Number(e.a3)].reduce((sum, index) => sum + valuesA[index]!, 0);
      const right = [Number(e.b1), Number(e.b2), Number(e.b3)].reduce((sum, index) => sum + valuesB[index]!, 0);
      return ratioDisplay(left, right);
    }
  }
}

export function independentlyVerifyDi004V2Set(set: Di004V2QuestionSet) {
  const results = set.questions.map((question) => {
    const expected = independentlySolveDi004V2Question(set, question);
    return {
      valid: expected === question.answer
        && question.options.length === set.optionCount
        && new Set(question.options).size === set.optionCount
        && question.options[question.correctIndex] === expected,
      expected,
      actual: question.answer,
    };
  });
  return { valid: results.every((result) => result.valid), results } as const;
}
