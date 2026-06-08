import { renderExplanationLanguage } from "./library";
import type { NsLcm001Explanation, NsLcm001ReasoningGraph, NsLcm001SolverResult } from "./types";

export function renderNsLcm001Explanation(input: {
  solver: NsLcm001SolverResult;
  reasoningGraph: NsLcm001ReasoningGraph;
  styleId: string;
}): NsLcm001Explanation {
  const rendered = renderExplanationLanguage({
    canonicalProblemId: input.solver.canonicalProblemId,
    styleId: input.styleId,
    answer: input.solver.answer,
    values: {
      targetLcm: input.solver.targetLcm,
      threshold: input.solver.threshold,
      operandFactorizationLatex: input.solver.operandFactorizationLatex,
      primeUnionLatex: input.solver.primeUnionLatex,
      maximumExponentSelectionLatex: input.solver.maximumExponentSelectionLatex,
      lcmLatex: input.solver.lcmLatex,
      synchronizationInterpretationLatex: input.solver.synchronizationInterpretationLatex,
      candidateEvaluationLatex: input.solver.candidateEvaluationLatex,
      rangeCountFormulaLatex: input.solver.rangeCountFormulaLatex,
      thresholdSelectionFormulaLatex: input.solver.thresholdSelectionFormulaLatex,
    },
  });
  return {
    graphId: input.reasoningGraph.graphId,
    familyId: rendered.familyId,
    styleId: input.styleId,
    lines: rendered.lines,
    operandFactorizationLatex: input.solver.operandFactorizationLatex,
    primeUnionLatex: input.solver.primeUnionLatex,
    maximumExponentSelectionLatex: input.solver.maximumExponentSelectionLatex,
    lcmLatex: input.solver.lcmLatex,
    synchronizationInterpretationLatex: input.solver.synchronizationInterpretationLatex,
    candidateEvaluationLatex: input.solver.candidateEvaluationLatex,
    rangeCountFormulaLatex: input.solver.rangeCountFormulaLatex,
    thresholdSelectionFormulaLatex: input.solver.thresholdSelectionFormulaLatex,
  };
}
