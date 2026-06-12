import { selectExplanationByEsId } from "./explanation-selector";
import type { NsSurd001Parameters } from "./parameter-generator";
import type { NsSurd001ReasoningGraph } from "./reasoning-graph";
import type { NsSurd001SolverResult } from "./solver";

export interface NsSurd001RenderedExplanation {
  graphId: string;
  explanationId: string;
  lines: readonly string[];
  answerLatex: string;
}

export function renderNsSurd001Explanation(
  parameters: NsSurd001Parameters,
  solver: NsSurd001SolverResult,
  graph: NsSurd001ReasoningGraph,
): NsSurd001RenderedExplanation {
  const item = selectExplanationByEsId(parameters.explanationId);
  return {
    graphId: graph.graphId,
    explanationId: item.id,
    lines: [item.explanation],
    answerLatex: solver.answerLatex,
  };
}
