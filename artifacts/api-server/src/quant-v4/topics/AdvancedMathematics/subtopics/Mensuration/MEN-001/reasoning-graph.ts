import { getMen001SolveModeDefinition } from "./solve-mode-registry.all";
import type {
  Men001Parameters,
  Men001ReasoningGraph,
  Men001SolverResult,
} from "./types";

export function buildMen001ReasoningGraph(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ReasoningGraph {
  const definition = getMen001SolveModeDefinition(parameters.solveMode);
  return {
    graphId: `MEN-001:${parameters.questionLanguageId}:${parameters.seed}`,
    nodes: [
      {
        nodeId: "identify-state",
        operation: "IDENTIFY_PLANE_MEASUREMENT_STATE",
        description: "Identify the supplied shape measurements, their units and the requested output dimension.",
        inputs: parameters.renderVariables,
        outputs: {
          canonicalProblemId: parameters.canonicalProblemId,
          solveMode: parameters.solveMode,
          answerDimension: parameters.answerDimension,
          unitPolicy: parameters.unitPolicy,
        },
      },
      {
        nodeId: "select-relation",
        operation: "SELECT_MEASUREMENT_RELATION",
        description: definition.reasoningDescription,
        inputs: { solveMode: parameters.solveMode },
        outputs: { equation: solver.equation },
      },
      {
        nodeId: "evaluate-exactly",
        operation: "EVALUATE_EXACT_MEASURE",
        description: "Substitute the generated values, preserve exact form and attach the dimensionally correct unit.",
        inputs: solver.workingValues,
        outputs: {
          answer: solver.answer,
          unit: solver.unit,
          answerDimension: solver.answerDimension,
        },
      },
    ],
  };
}
