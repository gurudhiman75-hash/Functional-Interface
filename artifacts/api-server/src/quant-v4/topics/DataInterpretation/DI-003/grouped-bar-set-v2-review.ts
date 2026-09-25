import { generateDi003GroupedBarV2Set } from "./grouped-bar-set-v2";
import type { Di003V2Option, Di003V2Question, Di003V2QuestionSet } from "./grouped-bar-v2-types";

const PROHIBITED_PERCENT_MISCONCEPTIONS = new Set([
  "ABSOLUTE_CHANGE_AS_PERCENT",
  "REVERSE_PART_WHOLE",
  "ABSOLUTE_TOTAL_DIFFERENCE_AS_PERCENT",
]);

function formatPercent(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-003 V3 review hardening received an invalid percentage fraction.");
  }
  return `${Math.round((numerator * 100) / denominator)}%`;
}

function parsePercent(value: string) {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)%$/u);
  return match ? Number(match[1]) : null;
}

function preferredReplacement(set: Di003V2QuestionSet, question: Di003V2Question): Di003V2Option | null {
  const points = set.stimulus.points;
  const totalA = points.reduce((sum, point) => sum + point.seriesA, 0);
  const totalB = points.reduce((sum, point) => sum + point.seriesB, 0);

  if (question.kind === "PERCENT_CHANGE_WITHIN_SERIES") {
    const lower = points[Number(question.evidence.lowerIndex)]!.seriesA;
    const higher = points[Number(question.evidence.higherIndex)]!.seriesA;
    return {
      text: formatPercent(higher - lower, lower + higher),
      misconceptionId: "PAIR_SUM_AS_BASE",
      derivation: "Uses the sum of the two compared bars as the percentage base.",
    };
  }

  if (question.kind === "CATEGORY_SHARE_OF_SERIES_TOTAL") {
    const point = points[Number(question.evidence.categoryIndex)]!;
    return {
      text: formatPercent(point.seriesA + point.seriesB, totalA + totalB),
      misconceptionId: "CATEGORY_SHARE_OF_ALL",
      derivation: "Finds the named category's share of both series combined instead of the requested series total.",
    };
  }

  if (question.kind === "TOTAL_SERIES_PERCENT_EXCESS") {
    return {
      text: formatPercent(totalB, totalA),
      misconceptionId: "REVERSE_TOTAL_SHARE",
      derivation: `Finds ${set.stimulus.series[1].label} as a percentage of ${set.stimulus.series[0].label} instead of the percentage excess.`,
    };
  }

  return null;
}

function nearbyReplacement(answer: string, occupied: ReadonlySet<string>, shareBounded: boolean): Di003V2Option {
  const answerValue = parsePercent(answer);
  if (answerValue === null) throw new Error(`DI-003 V2 review hardening expected a percentage answer, received ${answer}.`);
  const deltas = [5, -5, 10, -10, 15, -15, 20, -20];
  for (const delta of deltas) {
    const candidateValue = Math.round(answerValue + delta);
    if (candidateValue <= 0) continue;
    if (shareBounded && candidateValue >= 100) continue;
    const candidate = `${candidateValue}%`;
    if (!occupied.has(candidate)) {
      return {
        text: candidate,
        misconceptionId: "NEARBY_PERCENTAGE_ERROR",
        derivation: "Uses a nearby percentage that can result from a small denominator or arithmetic error.",
      };
    }
  }
  throw new Error(`DI-003 V2 review hardening could not build a plausible replacement for ${answer}.`);
}

function hardenQuestion(set: Di003V2QuestionSet, question: Di003V2Question): Di003V2Question {
  const badIndex = question.optionMetadata.findIndex((option) => PROHIBITED_PERCENT_MISCONCEPTIONS.has(option.misconceptionId));
  if (badIndex < 0) return question;
  if (badIndex === question.correctIndex) throw new Error(`${question.questionId} marked a prohibited distractor as correct.`);

  const occupied = new Set(question.options.filter((_option, index) => index !== badIndex));
  let replacement = preferredReplacement(set, question);
  if (!replacement || occupied.has(replacement.text)) {
    replacement = nearbyReplacement(question.answer, occupied, question.kind === "CATEGORY_SHARE_OF_SERIES_TOTAL");
  }

  const options = [...question.options];
  const optionMetadata = question.optionMetadata.map((option) => ({ ...option }));
  options[badIndex] = replacement.text;
  optionMetadata[badIndex] = replacement;

  if (new Set(options).size !== options.length) throw new Error(`${question.questionId} percentage hardening produced duplicate options.`);
  if (options[question.correctIndex] !== question.answer) throw new Error(`${question.questionId} percentage hardening changed answer binding.`);
  if (question.kind === "CATEGORY_SHARE_OF_SERIES_TOTAL") {
    for (const option of options) {
      const value = parsePercent(option);
      if (value === null || value <= 0 || value > 100) throw new Error(`${question.questionId} contains an impossible share option: ${option}.`);
    }
  }

  return { ...question, options, optionMetadata };
}

/**
 * Human-review authority for DI-003 V2.
 *
 * The base V2 generator owns semantic state and arithmetic. This layer hardens
 * percentage distractors so review artifacts never rely on obviously impossible
 * choices such as turning a raw unit difference into a percentage or reversing
 * a part/whole share above 100%.
 */
export function generateDi003GroupedBarV2ReviewSet(input: { seed: string; examProfile: "SSC_CGL_TIER_I" | "BANKING_PRELIMS" }): Di003V2QuestionSet {
  const base = generateDi003GroupedBarV2Set(input);
  const questions = base.questions.map((question) => hardenQuestion(base, question));
  for (const question of questions) {
    if (question.optionMetadata.some((option) => PROHIBITED_PERCENT_MISCONCEPTIONS.has(option.misconceptionId))) {
      throw new Error(`${question.questionId} retained a prohibited percentage distractor.`);
    }
  }
  return { ...base, questions };
}

export const DI003_V2_PROHIBITED_PERCENT_MISCONCEPTIONS = [...PROHIBITED_PERCENT_MISCONCEPTIONS] as const;
