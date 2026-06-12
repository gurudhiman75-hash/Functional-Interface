import { renderExplanation } from "./library";
import type { NsClass001Explanation, NsClass001Parameters, NsClass001ReasoningGraph, NsClass001SolverResult } from "./types";

export function renderNsClass001Explanation(parameters: NsClass001Parameters, solver: NsClass001SolverResult, graph: NsClass001ReasoningGraph): NsClass001Explanation {
  const rendered = renderExplanation(parameters.canonicalProblemId, parameters.explanationId, solver.answer);
  return {
    graphId: graph.graphId,
    familyId: rendered.familyId,
    styleId: parameters.explanationId,
    lines: rendered.lines,
    propertyWorkingLatex: solver.propertyWorkingLatex,
  };
}
