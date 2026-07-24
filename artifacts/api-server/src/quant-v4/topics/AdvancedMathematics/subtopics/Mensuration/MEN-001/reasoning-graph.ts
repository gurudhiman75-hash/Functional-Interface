import type {
  Men001Parameters,
  Men001ReasoningGraph,
  Men001SolverResult,
} from "./types";

export function buildMen001ReasoningGraph(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ReasoningGraph {
  const formulaDescription =
    parameters.solveMode === "findTriangleAreaHeron"
      ? "Use Heron's formula because all three sides are known."
      : parameters.solveMode === "findEquilateralTriangleArea"
        ? "Use the exact equilateral-triangle area formula."
        : parameters.solveMode === "findMissingHeightFromAreaAndBase"
          ? "Rearrange the base-height area relation to isolate the height."
          : "Use one-half times base times perpendicular height.";

  return {
    graphId: `MEN-001:${parameters.questionLanguageId}:${parameters.seed}`,
    nodes: [
      {
        nodeId: "identify-state",
        operation: "IDENTIFY_TRIANGLE_STATE",
        description: "Identify the supplied triangle measurements and the requested dimension.",
        inputs: parameters.renderVariables,
        outputs: {
          solveMode: parameters.solveMode,
          answerDimension: parameters.answerDimension,
        },
      },
      {
        nodeId: "select-relation",
        operation: "SELECT_MEASUREMENT_RELATION",
        description: formulaDescription,
        inputs: { solveMode: parameters.solveMode },
        outputs: { equation: solver.equation },
      },
      {
        nodeId: "evaluate-exactly",
        operation: "EVALUATE_EXACT_MEASURE",
        description: "Substitute the generated values, preserve exact form and attach the correct unit.",
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
