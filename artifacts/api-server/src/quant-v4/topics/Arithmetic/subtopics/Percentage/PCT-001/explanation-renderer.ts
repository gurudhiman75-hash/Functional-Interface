import { getExplanationSteps, renderTemplate } from "./library";
import type { Pct001Explanation, Pct001Parameters, Pct001ReasoningGraph, Pct001SolverResult, Pct001Variables } from "./types";

export function renderPct001Explanation(parameters: Pct001Parameters, solver: Pct001SolverResult, _graph: Pct001ReasoningGraph): Pct001Explanation {
  const values: Pct001Variables = {
    ...parameters.variables,
    ...solver.evidence,
    ...solver.mathJax,
    answer: solver.answer,
  };
  const variantKey = [...`${parameters.questionLanguageId}:${parameters.taskKind}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const lines = getExplanationSteps(parameters.canonicalProblemId, parameters.taskKind, parameters.language, variantKey).map((line) => renderTemplate(line, values));
  return {
    explanationId: parameters.explanationId,
    lines,
  };
}
