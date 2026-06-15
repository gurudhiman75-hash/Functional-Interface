import { getExplanationSteps, renderTemplate } from "./library";
import type { Pct002Explanation, Pct002Parameters, Pct002ReasoningGraph, Pct002SolverResult, Pct002Variables } from "./types";

export function renderPct002Explanation(parameters: Pct002Parameters, solver: Pct002SolverResult, _graph: Pct002ReasoningGraph): Pct002Explanation {
  const values: Pct002Variables = {
    ...parameters.variables,
    ...solver.evidence,
    ...solver.mathJax,
    answer: solver.answer,
  };
  return {
    explanationId: parameters.explanationId,
    lines: getExplanationSteps(parameters.canonicalProblemId, parameters.language).map((line) => renderTemplate(line, values)),
  };
}
