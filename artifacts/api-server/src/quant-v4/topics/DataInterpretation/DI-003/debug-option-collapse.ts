import { ratioDisplay } from "../DI-001/exact";
import { generateDi003GroupedBarSet } from "./index";
import type { Di003Question, Di003QuestionSet, Di003TaskKind } from "./types";

function formatPercent(numerator: number, denominator: number): string {
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  const hundredths = (n * 10_000n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  if (fraction === 0) return `${whole}%`;
  if (fraction % 10 === 0) return `${whole}.${fraction / 10}%`;
  return `${whole}.${String(fraction).padStart(2, "0")}%`;
}

function candidateTexts(set: Di003QuestionSet, question: Di003Question): readonly string[] {
  const points = set.stimulus.points;
  const totalA = points.reduce((sum, point) => sum + point.seriesA, 0);
  const totalB = points.reduce((sum, point) => sum + point.seriesB, 0);

  switch (question.kind) {
    case "CROSS_SERIES_DIFFERENCE": {
      const index = question.evidence.categoryIndex!;
      const point = points[index]!;
      const neighborIndex = index === points.length - 1 ? index - 1 : index + 1;
      const neighbor = points[neighborIndex]!;
      return [
        question.answer,
        String(point.seriesA + point.seriesB),
        String(point.seriesA),
        String(point.seriesB),
        String(totalA),
        String(totalB),
        String(Math.abs(neighbor.seriesA - neighbor.seriesB)),
      ];
    }
    case "COMBINED_CATEGORY_RATIO": {
      const firstIndex = question.evidence.firstIndex!;
      const secondIndex = question.evidence.secondIndex!;
      const first = points[firstIndex]!;
      const second = points[secondIndex]!;
      const firstCombined = first.seriesA + first.seriesB;
      const secondCombined = second.seriesA + second.seriesB;
      return [
        question.answer,
        ratioDisplay(secondCombined, firstCombined),
        ratioDisplay(first.seriesA, second.seriesA),
        ratioDisplay(first.seriesB, second.seriesB),
        ratioDisplay(first.seriesA + second.seriesA, first.seriesB + second.seriesB),
        ratioDisplay(firstCombined, second.seriesA),
        ratioDisplay(first.seriesA, secondCombined),
      ];
    }
    case "PERCENT_CHANGE_WITHIN_SERIES": {
      const fromIndex = question.evidence.fromIndex!;
      const toIndex = question.evidence.toIndex!;
      const from = points[fromIndex]!.seriesA;
      const to = points[toIndex]!.seriesA;
      const difference = to - from;
      const bDifference = Math.abs(points[toIndex]!.seriesB - points[fromIndex]!.seriesB);
      const bLower = Math.min(points[toIndex]!.seriesB, points[fromIndex]!.seriesB);
      return [
        question.answer,
        formatPercent(difference, to),
        formatPercent(to, from),
        `${difference}%`,
        formatPercent(bDifference, bLower),
        formatPercent(difference, totalA),
        formatPercent(difference, from + to),
      ];
    }
    case "CATEGORY_SHARE_OF_SERIES_TOTAL": {
      const index = question.evidence.categoryIndex!;
      const point = points[index]!;
      return [
        question.answer,
        formatPercent(point.seriesA, totalA),
        formatPercent(point.seriesB, totalA),
        formatPercent(point.seriesB, totalA + totalB),
        formatPercent(point.seriesB, totalB - point.seriesB),
        formatPercent(totalB, point.seriesB),
        formatPercent(point.seriesA + point.seriesB, totalA + totalB),
      ];
    }
    case "TOTAL_SERIES_PERCENT_EXCESS": {
      const difference = totalA - totalB;
      return [
        question.answer,
        formatPercent(difference, totalA),
        formatPercent(totalA, totalB),
        formatPercent(difference, totalA + totalB),
        formatPercent(totalB, totalA),
        `${difference}%`,
        formatPercent(difference, (totalA + totalB) / 2),
      ];
    }
  }
}

type Collision = Readonly<{
  seed: string;
  kind: Di003TaskKind;
  uniqueCount: number;
  values: readonly string[];
}>;

const collisions: Collision[] = [];
const counts: Record<Di003TaskKind, number> = {
  CROSS_SERIES_DIFFERENCE: 0,
  COMBINED_CATEGORY_RATIO: 0,
  PERCENT_CHANGE_WITHIN_SERIES: 0,
  CATEGORY_SHARE_OF_SERIES_TOTAL: 0,
  TOTAL_SERIES_PERCENT_EXCESS: 0,
};

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `DI-003-PHASE2-${seedIndex}`;
  const set = generateDi003GroupedBarSet({ seed, examProfile: "SSC_CGL_TIER_I" });
  for (const question of set.questions) {
    const values = candidateTexts(set, question);
    const uniqueCount = new Set(values.map((value) => value.trim().toLowerCase())).size;
    if (uniqueCount < 5) {
      counts[question.kind] += 1;
      collisions.push({ seed, kind: question.kind, uniqueCount, values });
    }
  }
}

console.log(JSON.stringify({ collisionCount: collisions.length, counts, examples: collisions.slice(0, 20) }));
if (collisions.length) {
  throw new Error(`DI-003 has ${collisions.length} Banking five-option collision states.`);
}

console.log("PASS_DI_003_OPTION_COLLAPSE_DEBUG");
