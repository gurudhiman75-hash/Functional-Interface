import type { Avg001Parameters, Avg001SolverResult } from "./types";

export function buildAvg001MathematicalFingerprint(
  parameters: Avg001Parameters,
  solver: Avg001SolverResult,
) {
  const values = parameters.values;
  return JSON.stringify({
    cpId: parameters.canonicalProblemId,
    solveMode: parameters.solveMode,
    givens: {
      count: values.count,
      average: values.average,
      total: values.total,
      knownCount: values.knownCount,
      knownTotal: values.knownTotal,
    },
    requestedTarget: parameters.answerType,
    exactAnswer: solver.exactAnswer,
    displayPolicy: parameters.displayPolicy,
  });
}
