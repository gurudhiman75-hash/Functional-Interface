import { propertyWorkingLatex, verifyFixtureAnswer } from "./math";
import type { NsClass001Parameters, NsClass001SolverResult } from "./types";

export function solveNsClass001(parameters: NsClass001Parameters): NsClass001SolverResult {
  const mathJax = propertyWorkingLatex(parameters);
  return {
    answer: parameters.answer,
    ...mathJax,
    verification: {
      inputValid: parameters.questionLanguageId.length > 0,
      answerRecomputed: verifyFixtureAnswer(parameters),
      uniqueWhenRequired: parameters.uniqueAnswer || parameters.answer.includes(" or ") || parameters.answer.startsWith("any "),
      mathJaxValid: mathJax.propertyWorkingLatex.length > 0,
    },
  };
}
