import { deterministicIndex } from "../foundation/prng";
import {
  divideRational,
  formatDecimalIfTerminating,
  formatMoney,
  formatPercent,
  formatRational,
  isWholeRational,
  multiplyRational,
  rational,
  subtractRational,
} from "../foundation/rational";
import type {
  IntCp001Wave2Explanation,
  IntCp001Wave2PrototypeParameters,
  IntCp001Wave2ReasoningGraph,
  IntCp001Wave2SolveResult,
  Rational,
} from "./types";

interface Wave2Presentation {
  stem: string;
  explanation: IntCp001Wave2Explanation;
  reasoningGraph: IntCp001Wave2ReasoningGraph;
}

function exactFactor(value: Rational): string {
  return formatDecimalIfTerminating(value, 6) ?? formatRational(value);
}

function naturalDuration(value: Rational): string {
  if (isWholeRational(value)) {
    return `${value.numerator} ${value.numerator === 1n ? "year" : "years"}`;
  }
  const months = multiplyRational(value, rational(12));
  if (isWholeRational(months)) {
    return `${months.numerator} ${months.numerator === 1n ? "month" : "months"}`;
  }
  return `${formatRational(value)} of a year`;
}

function normaliseArticle(value: string): string {
  return value
    .replace(/\ba education loan\b/giu, "an education loan")
    .replace(/\ba equipment loan\b/giu, "an equipment loan");
}

function normaliseFractionalYearGrammar(value: string): string {
  return value.replace(/(?<!\d )\b(\d+\/\d+) years\b/gu, "$1 of a year");
}

function cleanText(value: string): string {
  return normaliseFractionalYearGrammar(normaliseArticle(value));
}

function ratioStem(parameters: IntCp001Wave2PrototypeParameters): string {
  const ratio = parameters.display.laterToEarlierAmountRatio!;
  const earlier = naturalDuration(parameters.hiddenState.earlierTimeYears);
  const later = naturalDuration(parameters.hiddenState.laterTimeYears);
  const laterPart = ratio.numerator;
  const earlierPart = ratio.denominator;
  const variant = deterministicIndex(
    `${parameters.prototypeId}:${parameters.seed}:ratio-editorial`,
    3,
  );
  return [
    `Under simple interest, the amounts after ${later} and ${earlier} are in the ratio ${laterPart}:${earlierPart}. What is the annual rate?`,
    `For the same principal under simple interest, the amount after ${later} is to the amount after ${earlier} as ${laterPart}:${earlierPart}. What annual rate is implied?`,
    `The amounts of one sum after ${later} and ${earlier} are in the ratio ${laterPart}:${earlierPart} under simple interest. At what rate per annum was it invested?`,
  ][variant]!;
}

function normaliseStem(
  parameters: IntCp001Wave2PrototypeParameters,
  stem: string,
): string {
  let result = cleanText(stem);
  if (parameters.prototypeId === "INT-CP001-W2-PROT-RATE-FROM-TWO-AMOUNT-RATIO") {
    result = ratioStem(parameters);
  }
  result = result.replace(
    /^At (.+), how many times the principal is the final amount\?$/u,
    "At $1, the final amount is how many times the principal?",
  );
  return result;
}

function normaliseExplanation(
  parameters: IntCp001Wave2PrototypeParameters,
  solution: IntCp001Wave2SolveResult,
  explanation: IntCp001Wave2Explanation,
): IntCp001Wave2Explanation {
  const next: IntCp001Wave2Explanation = {
    ...explanation,
    notice: cleanText(explanation.notice),
    relation: cleanText(explanation.relation),
    steps: explanation.steps.map(cleanText),
    verification: cleanText(explanation.verification),
    conclusion: cleanText(explanation.conclusion),
    commonTrap: cleanText(explanation.commonTrap),
  };
  const request = parameters.request;
  const state = parameters.hiddenState;

  if (request.mode === "AMOUNT_FROM_PRT") {
    next.steps[1] = `The displayed duration is ${naturalDuration(request.timeYears)}.`;
    if (parameters.display.displayedDays !== undefined) {
      next.verification = `${formatMoney(state.laterAmount)} − ${formatMoney(state.principal)} = ${formatMoney(state.laterInterest)}, matching the exact interest for ${parameters.display.displayedDays} days on a 365-day basis.`;
    } else if (parameters.display.displayedMonths !== undefined) {
      next.verification = `${formatMoney(state.laterAmount)} − ${formatMoney(state.principal)} = ${formatMoney(state.laterInterest)}, matching the exact interest for ${parameters.display.displayedMonths} months.`;
    }
  }
  if (request.mode === "PRINCIPAL_FROM_INTEREST") {
    const factor = multiplyRational(state.annualRate, request.timeYears);
    next.steps[1] = `Rate–time factor = ${exactFactor(factor)}.`;
  }
  if (request.mode === "PRINCIPAL_FROM_AMOUNT") {
    const multiplier = divideRational(state.laterAmount, state.principal);
    next.steps[1] = `The exact amount multiplier is ${exactFactor(multiplier)}.`;
  }
  if (request.mode === "RATE_FROM_TWO_AMOUNT_RATIO") {
    const ratio = request.laterToEarlierAmountRatio;
    const denominator = subtractRational(
      request.laterTimeYears,
      multiplyRational(ratio, request.earlierTimeYears),
    );
    next.steps[0] = `The later-to-earlier amount ratio is ${ratio.numerator}:${ratio.denominator}.`;
    next.steps[1] = `Here k − 1 = ${formatRational(subtractRational(ratio, rational(1)))} and t₂ − kt₁ = ${denominator.denominator === 1n ? denominator.numerator : `${denominator.numerator}/${denominator.denominator}`}.`;
    next.verification = `Using ${formatPercent(solution.value)} per annum in both amount factors reproduces the ratio ${ratio.numerator}:${ratio.denominator} exactly.`;
  }
  if (request.mode === "ANNUAL_INTEREST_FROM_TWO_AMOUNTS") {
    next.steps[1] = `The time gap is ${naturalDuration(
      subtractRational(request.laterTimeYears, request.earlierTimeYears),
    )}.`;
  }
  if (request.mode === "AMOUNT_MULTIPLE_FROM_RATE_TIME") {
    next.conclusion = `Therefore, the final amount is ${solution.value.denominator === 1n ? solution.value.numerator : formatRational(solution.value)} times the principal.`;
  }

  return {
    ...next,
    notice: cleanText(next.notice),
    relation: cleanText(next.relation),
    steps: next.steps.map(cleanText),
    verification: cleanText(next.verification),
    conclusion: cleanText(next.conclusion),
    commonTrap: cleanText(next.commonTrap),
  };
}

export function normaliseIntCp001Wave2Presentation(
  parameters: IntCp001Wave2PrototypeParameters,
  solution: IntCp001Wave2SolveResult,
  presentation: Wave2Presentation,
): Wave2Presentation {
  return {
    stem: normaliseStem(parameters, presentation.stem),
    explanation: normaliseExplanation(parameters, solution, presentation.explanation),
    reasoningGraph: {
      nodes: presentation.reasoningGraph.nodes.map((node) => ({
        ...node,
        text: cleanText(node.text),
      })),
    },
  };
}
