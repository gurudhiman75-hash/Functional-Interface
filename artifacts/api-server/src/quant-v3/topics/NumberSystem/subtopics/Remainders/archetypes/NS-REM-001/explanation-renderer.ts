import { renderExplanationLanguage } from "./library";
import type { NsRem001Explanation, NsRem001Parameters, NsRem001ReasoningGraph } from "./types";

function outputNumber(value: unknown) {
  if (typeof value !== "number") throw new Error("Reasoning graph output is missing a numeric value.");
  return value;
}

function outputNumberArray(value: unknown) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "number")) {
    throw new Error("Reasoning graph output is missing a numeric array.");
  }
  return value as number[];
}

export function renderNsRem001ExplanationFromGraph(
  parameters: NsRem001Parameters,
  graph: NsRem001ReasoningGraph,
  styleId: string,
): NsRem001Explanation {
  const explanationNode = graph.nodes.find((node) => node.type === "Explanation Data");
  if (!explanationNode) {
    throw new Error("NS-REM-001 explanation renderer requires explanation data from the reasoning graph.");
  }

  const validSet = outputNumberArray(explanationNode.outputs.validSet);
  const answer = outputNumber(explanationNode.outputs.answer);
  const remainder = outputNumber(explanationNode.outputs.remainder);

  return {
    graphId: graph.graphId,
    styleId,
    lines: renderExplanationLanguage({
      styleId,
      validSet,
      answer,
      targetRemainder: remainder,
    }),
  };
}

export const renderCp001ExplanationFromGraph = renderNsRem001ExplanationFromGraph;
export const renderCp002ExplanationFromGraph = renderNsRem001ExplanationFromGraph;
export const renderCp003ExplanationFromGraph = renderNsRem001ExplanationFromGraph;
export const renderCp004ExplanationFromGraph = renderNsRem001ExplanationFromGraph;
export const renderCp005ExplanationFromGraph = renderNsRem001ExplanationFromGraph;
export const renderCp006ExplanationFromGraph = renderNsRem001ExplanationFromGraph;
export const renderCp007ExplanationFromGraph = renderNsRem001ExplanationFromGraph;
