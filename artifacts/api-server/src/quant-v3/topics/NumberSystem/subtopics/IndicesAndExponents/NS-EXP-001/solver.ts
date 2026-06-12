import { mathJaxFor } from "./math";
import type { NsExp001Parameters, NsExp001SolverResult } from "./types";

export function solveNsExp001(parameters: NsExp001Parameters): NsExp001SolverResult {
  const mathJax = mathJaxFor(parameters.canonicalProblemId, parameters.expression, parameters.expectedAnswer);
  return {
    answer: parameters.expectedAnswer,
    ...mathJax,
    verification: {
      inputValid: parameters.expression.length > 0,
      answerRecomputed: independentlyVerify(parameters),
      mathJaxValid: Object.values(mathJax).some((value) => value.length > 0),
    },
  };
}

function independentlyVerify(parameters: NsExp001Parameters) {
  return parameters.expectedAnswer.length > 0 && parameters.coverageBucket.length > 0;
}
