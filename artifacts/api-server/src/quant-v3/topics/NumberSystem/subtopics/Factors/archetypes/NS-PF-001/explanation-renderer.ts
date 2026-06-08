import { renderExplanationLanguage } from "./library";
import type { NsPf001Explanation, NsPf001Parameters, NsPf001ReasoningGraph } from "./types";

export function renderNsPf001ExplanationFromGraph(
  parameters: NsPf001Parameters,
  reasoningGraph: NsPf001ReasoningGraph,
  styleId: string,
): NsPf001Explanation {
  const answerNode = reasoningGraph.nodes.find((node) => node.id === reasoningGraph.answerNodeId);
  const answer = answerNode?.outputs.answer;
  if (typeof answer !== "number" && typeof answer !== "string") throw new Error("NS-PF-001 graph answer is missing.");

  const explanationData = reasoningGraph.nodes.find((node) => node.id === "explanation-data")?.outputs ?? {};
  const rendered = renderExplanationLanguage({
    canonicalProblemId: parameters.canonicalProblemId,
    styleId,
    answer,
    values: {
      number: parameters.number,
      prime: parameters.prime,
      exponent: typeof explanationData.exponent === "number" ? explanationData.exponent : undefined,
      factorization: reasoningGraph.factorizationText,
    },
  });

  return {
    graphId: reasoningGraph.graphId,
    familyId: rendered.familyId,
    styleId,
    lines: rendered.lines,
    factorizationText: reasoningGraph.factorizationText,
    factorizationLatex: reasoningGraph.factorizationLatex,
  };
}

export const renderNsPf001Cp001Explanation = renderNsPf001ExplanationFromGraph;
export const renderNsPf001Cp002Explanation = renderNsPf001ExplanationFromGraph;
export const renderNsPf001Cp003Explanation = renderNsPf001ExplanationFromGraph;
export const renderNsPf001Cp004Explanation = renderNsPf001ExplanationFromGraph;
export const renderNsPf001Cp005Explanation = renderNsPf001ExplanationFromGraph;
export const renderNsPf001Cp006Explanation = renderNsPf001ExplanationFromGraph;
export const renderNsPf001Cp007Explanation = renderNsPf001ExplanationFromGraph;
