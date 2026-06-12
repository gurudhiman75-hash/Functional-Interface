import { renderApprovedExplanation } from "./explanation-selector";
import type { Simpl001Parameters } from "./parameter-generator";
import type { Simpl001ReasoningGraph } from "./reasoning-graph";
import type { Simpl001SolverResult } from "./solver";

export interface Simpl001RenderedExplanation {
  graphId: string;
  explanationId: string;
  text: string;
  lines: string[];
  answerLatex: string;
}

export function renderSimpl001Explanation(
  parameters: Simpl001Parameters,
  solver: Simpl001SolverResult,
  graph: Simpl001ReasoningGraph,
): Simpl001RenderedExplanation {
  const text = renderApprovedExplanation(parameters.explanationId, {
    answer: solver.answer,
  });
  return {
    graphId: graph.graphId,
    explanationId: parameters.explanationId,
    text,
    lines: text.split(/\n+/).filter(Boolean),
    answerLatex: solver.answerLatex,
  };
}
