import { getMen001QuestionEntry } from "./library";
import type {
  Men001Explanation,
  Men001Parameters,
  Men001ReasoningGraph,
  Men001SolverResult,
} from "./types";

export function renderMen001Explanation(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
  _graph: Men001ReasoningGraph,
): Men001Explanation {
  const entry = getMen001QuestionEntry(parameters.questionLanguageId);
  const values = solver.workingValues;
  let lines: string[] = [];

  switch (parameters.solveMode) {
    case "findTriangleAreaBaseHeight":
      lines = [
        "The base and the perpendicular height are given, so the direct triangle-area relation applies.",
        "Area of a triangle = 1/2 × base × height.",
        `Substituting the values gives 1/2 × ${values.base} × ${values.height}.`,
        `This equals ${values.area}.`,
        `Therefore, the area of the triangle is ${solver.answer}.`,
        "The square unit is necessary because area measures a two-dimensional region.",
      ];
      break;
    case "findMissingHeightFromAreaAndBase":
      lines = [
        "The area and base are known, while the perpendicular height is required.",
        "Starting with A = 1/2 × b × h, multiply by 2 and divide by the base.",
        `Thus, h = (2 × ${values.area}) / ${values.base}.`,
        `The calculated height is ${values.height} cm.`,
        `Therefore, the required perpendicular height is ${solver.answer}.`,
        "A length unit is used here because the unknown is a height, not an area.",
      ];
      break;
    case "findTriangleAreaHeron":
      lines = [
        "All three sides are known, so Heron's formula is the suitable method.",
        `First find the semiperimeter: s = (${values.sideA} + ${values.sideB} + ${values.sideC}) / 2 = ${values.semiperimeter}.`,
        "Heron's formula is A = √[s(s − a)(s − b)(s − c)].",
        `The expression under the square root becomes ${values.radicand}.`,
        `Its square root is ${values.area}.`,
        `Therefore, the area of the triangular plot is ${solver.answer}.`,
        "The side lengths also satisfy triangle inequality, so the generated triangle is valid.",
      ];
      break;
    case "findRightTriangleAreaFromLegs":
      lines = [
        "In a right-angled triangle, the two perpendicular sides act as the base and height.",
        "Therefore, area = 1/2 × product of the perpendicular sides.",
        `Substituting gives 1/2 × ${values.legA} × ${values.legB}.`,
        `This equals ${values.area}.`,
        `Hence, the area of the right-angled triangle is ${solver.answer}.`,
        "The hypotenuse is not needed for this calculation.",
      ];
      break;
    case "findEquilateralTriangleArea":
      lines = [
        "All three sides are equal, so the exact equilateral-triangle area formula applies.",
        "Area = (√3/4) × side².",
        `Substituting side ${values.side} cm gives (√3/4) × ${values.side}².`,
        `The rational coefficient simplifies to ${values.coefficient}.`,
        `Therefore, the exact area is ${solver.answer}.`,
        "The surd is kept exact because the question does not request a decimal approximation.",
      ];
      break;
  }

  if (lines.length === 0) {
    throw new Error(`No MEN-001 explanation strategy for ${parameters.solveMode}.`);
  }
  return { strategyId: entry.explanationStrategyId, lines };
}
