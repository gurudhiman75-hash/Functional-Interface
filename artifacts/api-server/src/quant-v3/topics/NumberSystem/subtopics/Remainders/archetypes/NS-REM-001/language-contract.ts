import { renderQuestionLanguage } from "./library";
import type { NsRem001Parameters } from "./types";

export function renderApprovedNsRem001Stem(parameters: NsRem001Parameters, questionLanguageId: string) {
  return {
    questionLanguageId,
    stem: renderQuestionLanguage({
      canonicalProblemId: parameters.canonicalProblemId,
      questionLanguageId,
      numberExpression: parameters.numberExpression,
      divisor: parameters.divisor,
      targetRemainder: parameters.targetRemainder,
    }),
  };
}

export function containsForbiddenRuntimePlaceholder(text: string) {
  return text.includes("PLACEHOLDER") || text.includes("{number}") || text.includes("{remainder}") || text.includes("{divisor}");
}
