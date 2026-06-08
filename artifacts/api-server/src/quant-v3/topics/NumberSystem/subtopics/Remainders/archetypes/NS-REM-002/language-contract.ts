import { renderQuestionLanguage } from "./library";
import type { NsRem002Parameters } from "./types";

export function parameterValues(parameters: NsRem002Parameters) {
  return {
    divisor: parameters.divisor,
    quotient: parameters.quotient,
    remainder: parameters.remainder,
    dividend: parameters.dividend,
    lowerBound: parameters.lowerBound,
    upperBound: parameters.upperBound,
  };
}

export function renderApprovedNsRem002Stem(parameters: NsRem002Parameters, questionLanguageId: string) {
  return {
    questionLanguageId,
    stem: renderQuestionLanguage({
      canonicalProblemId: parameters.canonicalProblemId,
      questionLanguageId,
      values: parameterValues(parameters),
    }),
  };
}

export function containsForbiddenRuntimePlaceholder(text: string) {
  return /\{[A-Za-z]+\}/.test(text) || text.includes("PLACEHOLDER");
}
