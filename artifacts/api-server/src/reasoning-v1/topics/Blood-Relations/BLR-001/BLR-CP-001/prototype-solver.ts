import { graphFromStructuredPrompt, solveRelationFromGraph } from "../foundation/graph-closure";
import type { BlrStructuredPrompt, RelationSolution } from "../foundation/types";

export interface BlrCp001SolverResult extends RelationSolution {
  graphPersonCount: number;
  graphEdgeCount: number;
}

export function solveBlrCp001Prompt(prompt: BlrStructuredPrompt): BlrCp001SolverResult {
  const graph = graphFromStructuredPrompt(prompt);
  const solution = solveRelationFromGraph(graph, prompt.query.subjectId, prompt.query.referenceId);
  return {
    ...solution,
    graphPersonCount: graph.persons.length,
    graphEdgeCount: graph.parentEdges.length + graph.spouseEdges.length + graph.siblingEdges.length,
  };
}
