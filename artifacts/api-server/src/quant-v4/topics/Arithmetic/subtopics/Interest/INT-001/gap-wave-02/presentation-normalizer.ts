import { deterministicIndex } from "../foundation/prng";
import {
  divideRational,
  formatDecimalIfTerminating,
  formatMoney,
  formatRational,
  isWholeRational,
  multiplyRational,
  rational,
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
  let result = normaliseArticle(stem);
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
    notice: normaliseArticle(explanation.notice),
    relation: normaliseArticle(explanation.relation),
    steps: explanation.steps.map(normaliseArticle),
    verification: normaliseArticle(explanation.verification),
    conclusion: normaliseArticle(explanation.conclusion),
    commonTrap: normaliseArticle(explanation.commonTrap),
  };
  const request = parameters.request;
  const state = parameters.hiddenState;

  if (request.mode === "AMOUNT_FROM_PRT") {
    next.steps[1] = `The displayed duration is ${naturalDuration(request.timeYears)}.`;
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
    next.steps[0] = `The later-to-earlier amount ratio is ${ratio.numerator}:${ratio.denominator}.`;
    next.verification = `Using ${solution.value.numerator}/${solution.value.denominator}% per annum in both amount factors reproduces the ratio ${ratio.numerator}:${ratio.denominator} exactly.`;
  }
  if (request.mode === "ANNUAL_INTEREST_FROM_TWO_AMOUNTS") {
    next.steps[1] = `The time gap is ${naturalDuration(
      {
        numerator: request.laterTimeYears.numerator * request.earlierTimeYears.denominator
          - request.earlierTimeYears.numerator * request.laterTimeYears.denominator,
        denominator: request.laterTimeYears.denominator * request.earlierTimeYears.denominator,
      },
    )}.`;
  }
  if (request.mode === "AMOUNT_MULTIPLE_FROM_RATE_TIME") {
    next.conclusion = `Therefore, the final amount is ${solution.value.denominator === 1n ? solution.value.numerator : formatRational(solution.value)} times the principal.`;
  }

  return next;
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
        text: normaliseArticle(node.text),
      })),
    },
  };
}
