import type { GeneratedUniformDigitPrototypeQuestion } from "./uniform-digit-types";

function repair(value: string): string {
  return value.replace(/\b1 places\b/gu, "1 place");
}

export function normaliseUniformDigitGrammar(
  question: GeneratedUniformDigitPrototypeQuestion,
): GeneratedUniformDigitPrototypeQuestion {
  return {
    ...question,
    stem: repair(question.stem),
    explanation: {
      referenceAid: question.explanation.referenceAid?.map(repair),
      quickMethod: question.explanation.quickMethod ? repair(question.explanation.quickMethod) : undefined,
      ruleStatement: repair(question.explanation.ruleStatement),
      sourceDemonstration: question.explanation.sourceDemonstration.map(repair),
      targetApplication: question.explanation.targetApplication.map(repair),
      conclusion: repair(question.explanation.conclusion),
      commonTrapAlert: question.explanation.commonTrapAlert
        ? repair(question.explanation.commonTrapAlert)
        : undefined,
      closestTrapRejection: question.explanation.closestTrapRejection
        ? repair(question.explanation.closestTrapRejection)
        : undefined,
    },
  };
}
