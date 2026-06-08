import { renderExplanationLanguage } from "./library";
import type { NsRem002Explanation, NsRem002Parameters, NsRem002ReasoningGraph } from "./types";

function outputNumber(value: unknown) {
  if (typeof value !== "number") throw new Error("Reasoning graph output is missing a numeric answer.");
  return value;
}

export function renderNsRem002ExplanationFromGraph(
  parameters: NsRem002Parameters,
  graph: NsRem002ReasoningGraph,
  styleId: string,
): NsRem002Explanation {
  const explanationNode = graph.nodes.find((node) => node.type === "Explanation Data");
  if (!explanationNode) throw new Error("NS-REM-002 explanation renderer requires explanation data from the reasoning graph.");
  const answer = outputNumber(explanationNode.outputs.answer);
  const rendered = renderExplanationLanguage({
    canonicalProblemId: parameters.canonicalProblemId,
    styleId,
    answer,
  });

  return {
    graphId: graph.graphId,
    familyId: rendered.familyId,
    styleId,
    lines: rendered.lines,
  };
}

export const renderCp001ExplanationFromGraph = renderNsRem002ExplanationFromGraph;
export const renderCp002ExplanationFromGraph = renderNsRem002ExplanationFromGraph;
export const renderCp003ExplanationFromGraph = renderNsRem002ExplanationFromGraph;
export const renderCp004ExplanationFromGraph = renderNsRem002ExplanationFromGraph;
export const renderCp005ExplanationFromGraph = renderNsRem002ExplanationFromGraph;
export const renderCp006ExplanationFromGraph = renderNsRem002ExplanationFromGraph;
export const renderCp007ExplanationFromGraph = renderNsRem002ExplanationFromGraph;
export const renderCp008ExplanationFromGraph = renderNsRem002ExplanationFromGraph;
export const renderCp009ExplanationFromGraph = renderNsRem002ExplanationFromGraph;
