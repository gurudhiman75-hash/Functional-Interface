import type {
  Men001Parameters,
  Men001ReasoningGraph,
  Men001SolverResult,
} from "./types";

const RELATION_DESCRIPTION: Record<Men001Parameters["solveMode"], string> = {
  findTriangleAreaBaseHeight: "Use one-half times base times perpendicular height.",
  findMissingHeightFromAreaAndBase: "Rearrange the triangle-area relation to isolate the height.",
  findMissingBaseFromAreaAndHeight: "Rearrange the triangle-area relation to isolate the base.",
  findTriangleAreaHeron: "Use Heron's formula because all three side lengths are known.",
  findRightTriangleAreaFromLegs: "Treat the perpendicular legs as the base and height.",
  findEquilateralTriangleArea: "Use the exact equilateral-triangle area formula.",
  findEquilateralPerimeterFromArea: "Recover the side from exact equilateral area, then multiply by three.",
  findEquilateralSideFromPerimeter: "Divide the perimeter equally among the three sides.",
  findIsoscelesTriangleArea: "Bisect the base, recover the altitude by Pythagoras, then find area.",
  findIsoscelesHeight: "Bisect the base and use the resulting right triangle to recover the altitude.",
  findTriangleAreaFromSideRatioAndPerimeter: "Convert the ratio into actual sides before applying Heron's formula.",
  findLargestTriangleSideFromRatioAndPerimeter: "Find the ratio scale factor and select the largest actual side.",
  findSmallestTriangleSideFromRatioAndPerimeter: "Find the ratio scale factor and select the smallest actual side.",
  findTriangularPlotCost: "Find the triangular area and multiply it by the rate per square metre.",
};

export function buildMen001ReasoningGraph(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ReasoningGraph {
  return {
    graphId: `MEN-001:${parameters.questionLanguageId}:${parameters.seed}`,
    nodes: [
      {
        nodeId: "identify-state",
        operation: "IDENTIFY_TRIANGLE_STATE",
        description: "Identify the supplied triangle measurements, their units and the requested output dimension.",
        inputs: parameters.renderVariables,
        outputs: {
          solveMode: parameters.solveMode,
          answerDimension: parameters.answerDimension,
          unitPolicy: parameters.unitPolicy,
        },
      },
      {
        nodeId: "select-relation",
        operation: "SELECT_MEASUREMENT_RELATION",
        description: RELATION_DESCRIPTION[parameters.solveMode],
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
