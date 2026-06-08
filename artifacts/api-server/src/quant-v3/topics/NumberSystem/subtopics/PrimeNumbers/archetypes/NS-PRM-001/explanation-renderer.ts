import { renderExplanationLanguage } from "./library";
import type { NsPrm001Explanation, NsPrm001Parameters, NsPrm001ReasoningGraph } from "./types";

export function renderNsPrm001ExplanationFromGraph(
  parameters: NsPrm001Parameters,
  reasoningGraph: NsPrm001ReasoningGraph,
  styleId: string,
): NsPrm001Explanation {
  const answerNode = reasoningGraph.nodes.find((node) => node.id === reasoningGraph.answerNodeId);
  const answer = answerNode?.outputs.answer;
  if (typeof answer !== "number" && typeof answer !== "string") throw new Error("NS-PRM-001 graph answer is missing.");
  const rendered = renderExplanationLanguage({
    canonicalProblemId: parameters.canonicalProblemId,
    styleId,
    answer,
    values: {
      number: parameters.number,
      lowerBound: parameters.lowerBound,
      upperBound: parameters.upperBound,
      position: parameters.position,
    },
  });

  return {
    graphId: reasoningGraph.graphId,
    familyId: rendered.familyId,
    styleId,
    lines: rendered.lines,
  };
}

export const renderNsPrm001Cp001Explanation = renderNsPrm001ExplanationFromGraph;
export const renderNsPrm001Cp002Explanation = renderNsPrm001ExplanationFromGraph;
export const renderNsPrm001Cp003Explanation = renderNsPrm001ExplanationFromGraph;
export const renderNsPrm001Cp004Explanation = renderNsPrm001ExplanationFromGraph;
export const renderNsPrm001Cp005Explanation = renderNsPrm001ExplanationFromGraph;
export const renderNsPrm001Cp006Explanation = renderNsPrm001ExplanationFromGraph;
export const renderNsPrm001Cp007Explanation = renderNsPrm001ExplanationFromGraph;
export const renderNsPrm001Cp008Explanation = renderNsPrm001ExplanationFromGraph;
