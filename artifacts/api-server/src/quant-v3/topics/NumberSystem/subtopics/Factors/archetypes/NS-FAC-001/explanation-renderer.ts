import { renderExplanationLanguage } from "./library";
import type { NsFac001Explanation, NsFac001Parameters, NsFac001ReasoningGraph } from "./types";

export function renderNsFac001ExplanationFromGraph(
  parameters: NsFac001Parameters,
  reasoningGraph: NsFac001ReasoningGraph,
  styleId: string,
): NsFac001Explanation {
  const answer = reasoningGraph.nodes.find((node) => node.id === reasoningGraph.answerNodeId)?.outputs.answer;
  if (typeof answer !== "number" && typeof answer !== "string") throw new Error("NS-FAC-001 graph answer is missing.");
  const rendered = renderExplanationLanguage({
    canonicalProblemId: parameters.canonicalProblemId,
    styleId,
    answer,
    values: {
      k: parameters.k,
      position: parameters.position,
      ordinalDisplay: parameters.ordinalDisplay,
      primeFactorizationLatex: reasoningGraph.primeFactorizationLatex,
      factorCountFormulaLatex: reasoningGraph.factorCountFormulaLatex,
      factorSumFormulaLatex: reasoningGraph.factorSumFormulaLatex,
      factorProductFormulaLatex: reasoningGraph.factorProductFormulaLatex,
      factorListLatex: reasoningGraph.factorListLatex,
      factorsIncreasingLatex: reasoningGraph.factorsIncreasingLatex,
      factorsDecreasingLatex: reasoningGraph.factorsDecreasingLatex,
      kPrimeFactorizationLatex: reasoningGraph.kPrimeFactorizationLatex,
      divisibleFactorConstraintLatex: reasoningGraph.divisibleFactorConstraintLatex,
      complementFormulaLatex: reasoningGraph.complementFormulaLatex,
      selectedPositionFormulaLatex: reasoningGraph.selectedPositionFormulaLatex,
      greatestProperFactorFormulaLatex: reasoningGraph.greatestProperFactorFormulaLatex,
      perfectSquareRuleLatex: reasoningGraph.perfectSquareRuleLatex,
    },
  });
  return {
    graphId: reasoningGraph.graphId,
    familyId: rendered.familyId,
    styleId,
    lines: rendered.lines,
    primeFactorizationLatex: reasoningGraph.primeFactorizationLatex,
    factorCountFormulaLatex: reasoningGraph.factorCountFormulaLatex,
    factorSumFormulaLatex: reasoningGraph.factorSumFormulaLatex,
    factorProductFormulaLatex: reasoningGraph.factorProductFormulaLatex,
    factorListLatex: reasoningGraph.factorListLatex,
    factorsIncreasingLatex: reasoningGraph.factorsIncreasingLatex,
    factorsDecreasingLatex: reasoningGraph.factorsDecreasingLatex,
    kPrimeFactorizationLatex: reasoningGraph.kPrimeFactorizationLatex,
    divisibleFactorConstraintLatex: reasoningGraph.divisibleFactorConstraintLatex,
    complementFormulaLatex: reasoningGraph.complementFormulaLatex,
    selectedPositionFormulaLatex: reasoningGraph.selectedPositionFormulaLatex,
    greatestProperFactorFormulaLatex: reasoningGraph.greatestProperFactorFormulaLatex,
    perfectSquareRuleLatex: reasoningGraph.perfectSquareRuleLatex,
  };
}

export const renderNsFac001Cp001Explanation = renderNsFac001ExplanationFromGraph;
export const renderNsFac001Cp002Explanation = renderNsFac001ExplanationFromGraph;
export const renderNsFac001Cp003Explanation = renderNsFac001ExplanationFromGraph;
export const renderNsFac001Cp004Explanation = renderNsFac001ExplanationFromGraph;
export const renderNsFac001Cp005Explanation = renderNsFac001ExplanationFromGraph;
export const renderNsFac001Cp006Explanation = renderNsFac001ExplanationFromGraph;
export const renderNsFac001Cp007Explanation = renderNsFac001ExplanationFromGraph;
export const renderNsFac001Cp008Explanation = renderNsFac001ExplanationFromGraph;
export const renderNsFac001Cp009Explanation = renderNsFac001ExplanationFromGraph;
