import type { NsSurd001Parameters } from "./parameter-generator";
import type { NsSurd001SolverResult } from "./solver";

export interface NsSurd001ReasoningGraph {
  graphId: string;
  canonicalProblemId: string;
  nodes: readonly { id: string; inputs: Record<string, unknown>; outputs: Record<string, unknown> }[];
  edges: readonly { from: string; to: string; relationship: string }[];
  answerNodeId: "answer";
}

export function buildNsSurd001ReasoningGraph(
  parameters: NsSurd001Parameters,
  solver: NsSurd001SolverResult,
): NsSurd001ReasoningGraph {
  return {
    graphId: `${parameters.questionId}:graph`,
    canonicalProblemId: parameters.canonicalProblemId,
    nodes: [
      {
        id: "selectHumanStem",
        inputs: { questionLanguageId: parameters.questionLanguageId },
        outputs: { stem: parameters.stemItem.stem },
      },
      {
        id: "selectHumanExplanation",
        inputs: { explanationId: parameters.explanationId },
        outputs: { explanationId: parameters.explanationId },
      },
      {
        id: "solveCanonicalProblem",
        inputs: { canonicalProblemId: parameters.canonicalProblemId, expression: solver.sourceExpression },
        outputs: { answer: solver.answer },
      },
      {
        id: "answer",
        inputs: { answer: solver.answer },
        outputs: { answerLatex: solver.answerLatex },
      },
    ],
    edges: [
      { from: "selectHumanStem", to: "solveCanonicalProblem", relationship: "provides exact human-authored stem" },
      { from: "selectHumanExplanation", to: "answer", relationship: "links exact human-authored explanation" },
      { from: "solveCanonicalProblem", to: "answer", relationship: "produces answer" },
    ],
    answerNodeId: "answer",
  };
}
