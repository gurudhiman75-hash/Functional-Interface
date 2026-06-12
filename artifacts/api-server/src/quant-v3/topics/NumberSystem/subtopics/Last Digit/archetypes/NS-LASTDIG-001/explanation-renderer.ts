import { renderExplanation } from "./library";
import type { NsLastdig001Explanation, NsLastdig001Parameters, NsLastdig001ReasoningGraph, NsLastdig001SolverResult } from "./types";

export function renderNsLastdig001Explanation(parameters: NsLastdig001Parameters, solver: NsLastdig001SolverResult, graph: NsLastdig001ReasoningGraph): NsLastdig001Explanation {
  const rendered = renderExplanation(parameters.canonicalProblemId, parameters.explanationId, {
    answer: solver.answer,
    cycleLatex: solver.cycleLatex,
    cyclePositionLatex: solver.cyclePositionLatex,
    effectiveExponentLatex: solver.effectiveExponentLatex,
    productLastDigitLatex: solver.productLastDigitLatex,
    towerReductionLatex: solver.towerReductionLatex,
  });
  return {
    graphId: graph.graphId,
    familyId: rendered.familyId,
    styleId: parameters.explanationId,
    lines: rendered.lines,
    cycleLatex: solver.cycleLatex,
    cyclePositionLatex: solver.cyclePositionLatex,
    effectiveExponentLatex: solver.effectiveExponentLatex,
    productLastDigitLatex: solver.productLastDigitLatex,
    towerReductionLatex: solver.towerReductionLatex,
  };
}
