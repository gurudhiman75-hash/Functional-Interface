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
  const v = solver.workingValues;
  let lines: string[];

  switch (parameters.solveMode) {
    case "findTriangleAreaBaseHeight":
      lines = [
        "The stated height is perpendicular to the base, so it can be used directly in the triangle-area formula.",
        "Area of a triangle = 1/2 × base × perpendicular height.",
        `Substituting the measurements gives 1/2 × ${v.base} × ${v.height}.`,
        `The numerical area is ${v.area}.`,
        `Therefore, the required area is ${solver.answer}.`,
        `A square unit is used because the result measures a two-dimensional region.`,
      ];
      break;
    case "findMissingHeightFromAreaAndBase":
      lines = [
        "The area and base are known, while the corresponding perpendicular height is required.",
        "Start with A = 1/2 × b × h and isolate h.",
        `Thus, h = (2 × ${v.area}) / ${v.base}.`,
        `This gives h = ${v.height}.`,
        `Therefore, the perpendicular height is ${solver.answer}.`,
        "The answer uses a linear unit because height is a length.",
      ];
      break;
    case "findMissingBaseFromAreaAndHeight":
      lines = [
        "The area and perpendicular height are known, so the base can be recovered from the same area relation.",
        "From A = 1/2 × b × h, we get b = 2A/h.",
        `Substituting gives b = (2 × ${v.area}) / ${v.height}.`,
        `The base is therefore ${v.base}.`,
        `Hence, the required base is ${solver.answer}.`,
        "A length unit, not a square unit, is required for the base.",
      ];
      break;
    case "findTriangleAreaHeron":
      lines = [
        "All three side lengths are given, so Heron's formula is the suitable measurement method.",
        `The semiperimeter is s = (${v.sideA} + ${v.sideB} + ${v.sideC})/2 = ${v.semiperimeter}.`,
        "Use A = √[s(s − a)(s − b)(s − c)].",
        `The expression under the square root is ${v.radicand}.`,
        `Its positive square root is ${v.area}.`,
        `Therefore, the area is ${solver.answer}.`,
      ];
      break;
    case "findRightTriangleAreaFromLegs":
      lines = [
        "The two given sides are perpendicular, so they serve as the base and height.",
        "Area = 1/2 × product of the perpendicular sides.",
        `Substituting gives 1/2 × ${v.legA} × ${v.legB}.`,
        `The value is ${v.area}.`,
        `Hence, the area of the right triangle is ${solver.answer}.`,
        "The hypotenuse is not needed for this calculation.",
      ];
      break;
    case "findEquilateralTriangleArea":
      lines = [
        "All sides are equal, so the exact equilateral-triangle area formula applies.",
        "Area = (√3/4) × side².",
        `Substituting side ${v.side} gives (√3/4) × ${v.side}².`,
        `The rational coefficient simplifies to ${v.coefficient}.`,
        `Therefore, the exact area is ${solver.answer}.`,
        "The √3 term is retained because no decimal approximation is requested.",
      ];
      break;
    case "findEquilateralPerimeterFromArea":
      lines = [
        "For an equilateral triangle, area = (√3/4) × side².",
        `Comparing ${v.areaCoefficient}√3 with (√3/4)a² gives a²/4 = ${v.areaCoefficient}.`,
        `Hence, the side length is 2√${v.areaCoefficient} = ${v.side}.`,
        "The perimeter of an equilateral triangle is three times its side.",
        `Thus, P = 3 × ${v.side} = ${v.perimeter}.`,
        `Therefore, the required perimeter is ${solver.answer}.`,
      ];
      break;
    case "findEquilateralSideFromPerimeter":
      lines = [
        "An equilateral triangle has three equal sides.",
        "Therefore, each side equals the perimeter divided by 3.",
        `Side = ${v.perimeter}/3.`,
        `This gives side = ${v.side}.`,
        `Hence, the length of each side is ${solver.answer}.`,
      ];
      break;
    case "findIsoscelesTriangleArea":
      lines = [
        "The altitude from the vertex of an isosceles triangle bisects its base.",
        `Half of the base is ${v.halfBase}, forming a right triangle with hypotenuse ${v.equalSide}.`,
        `By Pythagoras, height = √(${v.equalSide}² − ${v.halfBase}²) = ${v.height}.`,
        "Now use area = 1/2 × base × height.",
        `Area = 1/2 × ${v.base} × ${v.height} = ${v.area}.`,
        `Therefore, the area is ${solver.answer}.`,
      ];
      break;
    case "findIsoscelesHeight":
      lines = [
        "The perpendicular from the vertex bisects the base of an isosceles triangle.",
        `So each half of the base is ${v.halfBase}.`,
        `Using Pythagoras, h² = ${v.equalSide}² − ${v.halfBase}².`,
        `Thus, h = ${v.height}.`,
        `Therefore, the perpendicular height is ${solver.answer}.`,
      ];
      break;
    case "findTriangleAreaFromSideRatioAndPerimeter":
      lines = [
        "First convert the side ratio into actual side lengths using the perimeter.",
        `The sum of the ratio terms is ${Number(v.ratioA) + Number(v.ratioB) + Number(v.ratioC)}.`,
        `Hence, one ratio unit equals ${v.perimeter}/(${v.ratioA}+${v.ratioB}+${v.ratioC}) = ${v.scale}.`,
        `The three sides are ${v.sideA}, ${v.sideB} and ${v.sideC}.`,
        `Applying Heron's formula gives area ${v.area}.`,
        `Therefore, the required area is ${solver.answer}.`,
      ];
      break;
    case "findLargestTriangleSideFromRatioAndPerimeter":
    case "findSmallestTriangleSideFromRatioAndPerimeter": {
      const target = parameters.solveMode === "findLargestTriangleSideFromRatioAndPerimeter" ? "largest" : "smallest";
      lines = [
        "The perimeter fixes the common multiplier of the three ratio terms.",
        `The ratio sum is ${Number(v.ratioA) + Number(v.ratioB) + Number(v.ratioC)}.`,
        `One ratio unit is ${v.perimeter}/(${v.ratioA}+${v.ratioB}+${v.ratioC}) = ${v.scale}.`,
        `The actual sides are ${v.sideA}, ${v.sideB} and ${v.sideC}.`,
        `The ${target} of these is ${v.targetSide}.`,
        `Therefore, the required side is ${solver.answer}.`,
      ];
      break;
    }
    case "findTriangularPlotCost":
      lines = [
        "The total charge depends on the area of the triangular plot.",
        "First calculate area = 1/2 × base × perpendicular height.",
        `Area = 1/2 × ${v.base} × ${v.height} = ${v.area} m².`,
        `Multiply this area by the rate ₹${v.ratePerSquareMetre} per m².`,
        `Total cost = ${v.area} × ${v.ratePerSquareMetre} = ₹${v.cost}.`,
        `Therefore, the levelling cost is ${solver.answer}.`,
      ];
      break;
  }

  return { strategyId: entry.explanationStrategyId, lines };
}
