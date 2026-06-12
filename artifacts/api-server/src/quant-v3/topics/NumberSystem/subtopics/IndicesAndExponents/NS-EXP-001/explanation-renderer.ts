import { renderExplanation } from "./library";
import type { NsExp001Explanation, NsExp001Parameters, NsExp001ReasoningGraph, NsExp001SolverResult } from "./types";

export function renderNsExp001Explanation(parameters: NsExp001Parameters, solver: NsExp001SolverResult, graph: NsExp001ReasoningGraph): NsExp001Explanation {
  const rendered = renderExplanation(parameters.canonicalProblemId, parameters.explanationId);
  return { graphId: graph.graphId, familyId: rendered.familyId, styleId: parameters.explanationId, lines: rendered.lines, ...mathJaxFromSolver(solver) };
}

function mathJaxFromSolver(solver: NsExp001SolverResult) {
  return {
    sameBaseCompressionLatex: solver.sameBaseCompressionLatex,
    sameBaseEquationLatex: solver.sameBaseEquationLatex,
    baseTransformationLatex: solver.baseTransformationLatex,
    negativeExponentLatex: solver.negativeExponentLatex,
    fractionalExponentLatex: solver.fractionalExponentLatex,
    mixedExponentLatex: solver.mixedExponentLatex,
    comparisonLatex: solver.comparisonLatex,
    substitutionLatex: solver.substitutionLatex,
  };
}
