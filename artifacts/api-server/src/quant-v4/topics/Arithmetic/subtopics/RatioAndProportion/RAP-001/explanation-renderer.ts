import { getExplanationSteps, renderTemplate } from "./library";
import type { Rap001Explanation, Rap001Parameters, Rap001ReasoningGraph, Rap001SolverResult, Rap001Variables } from "./types";

export function renderRap001Explanation(parameters: Rap001Parameters, solver: Rap001SolverResult, _graph: Rap001ReasoningGraph): Rap001Explanation {
  const values: Rap001Variables = {
    ...parameters.variables,
    ...solver.workingValues,
    ...solver.evidence,
    ...solver.mathJax,
    answer: solver.answer,
  };
  return {
    explanationId: parameters.explanationId,
    lines: getExplanationSteps(parameters.canonicalProblemId, parameters.language).map((line) => renderTemplate(line, values)),
  };
}
