import { getExplanationSteps } from "./library";
import type { Pct001Explanation, Pct001Parameters, Pct001ReasoningGraph, Pct001SolverResult } from "./types";

export function renderPct001Explanation(parameters: Pct001Parameters, solver: Pct001SolverResult, _graph: Pct001ReasoningGraph): Pct001Explanation {
  const lines = [...getExplanationSteps(parameters.canonicalProblemId, parameters.language), `Answer: ${solver.answer}`];
  return {
    explanationId: parameters.explanationId,
    lines,
  };
}
