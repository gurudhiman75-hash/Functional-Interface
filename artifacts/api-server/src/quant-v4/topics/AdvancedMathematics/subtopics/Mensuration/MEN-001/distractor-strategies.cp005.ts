import type { Men001Parameters, Men001SolverResult } from "./types";

type Context = { parameters: Men001Parameters; solver: Men001SolverResult };
type Strategy = (context: Context) => string;

function number(solver: Men001SolverResult, key: string) {
  const parsed = Number(solver.workingValues[key]);
  if (!Number.isFinite(parsed)) {
    throw new Error(`MEN-001 CP-005 distractor requires finite ${key}.`);
  }
  return parsed;
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function numericOption(value: number, solver: Men001SolverResult) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 CP-005 distractor produced invalid value ${value}.`);
  }
  if (solver.unit === "°") return `${format(value)}°`;
  if (solver.unit === "₹") return `₹${format(value)}`;
  return `${format(value)} ${solver.unit}`;
}

function primaryArea(solver: Men001SolverResult) {
  for (const key of ["rectangleArea", "outerArea", "squareArea", "circleArea"]) {
    const candidate = Number(solver.workingValues[key]);
    if (Number.isFinite(candidate) && candidate > 0) return candidate;
  }
  throw new Error("MEN-001 CP-005 distractor cannot locate primary area.");
}

function secondaryArea(solver: Men001SolverResult) {
  for (const key of ["semicircleArea", "triangleArea", "componentArea", "cutoutArea", "innerArea"]) {
    const candidate = Number(solver.workingValues[key]);
    if (Number.isFinite(candidate) && candidate > 0) return candidate;
  }
  const rectangleArea = Number(solver.workingValues.rectangleArea);
  const circleArea = Number(solver.workingValues.circleArea);
  const squareArea = Number(solver.workingValues.squareArea);
  if (Number.isFinite(rectangleArea) && Number.isFinite(circleArea)) return circleArea;
  if (Number.isFinite(circleArea) && Number.isFinite(squareArea)) return squareArea;
  if (Number.isFinite(squareArea) && Number.isFinite(circleArea)) return circleArea;
  throw new Error("MEN-001 CP-005 distractor cannot locate secondary area.");
}

function surdOption(coefficient: number, solver: Men001SolverResult) {
  if (!Number.isInteger(coefficient) || coefficient <= 0) {
    throw new Error(`MEN-001 CP-005 symbolic distractor requires positive integer coefficient.`);
  }
  const latexUnit = solver.unit === "cm²" ? "\\text{cm}^{2}" : "\\text{m}^{2}";
  return `$$${coefficient}\\sqrt{3}\\,${latexUnit}$$`;
}

export const MEN_001_CP005_DISTRACTOR_STRATEGIES = {
  "cp005-report-primary-area-only": ({ solver }: Context) =>
    numericOption(primaryArea(solver), solver),
  "cp005-report-secondary-area-only": ({ solver }: Context) =>
    numericOption(secondaryArea(solver), solver),
  "cp005-subtract-secondary-instead-of-add": ({ solver }: Context) =>
    numericOption(Math.abs(primaryArea(solver) - secondaryArea(solver)), solver),

  "cp005-report-outer-area": ({ solver }: Context) =>
    numericOption(primaryArea(solver), solver),
  "cp005-report-removed-area": ({ solver }: Context) =>
    numericOption(secondaryArea(solver), solver),
  "cp005-add-removed-area": ({ solver }: Context) =>
    numericOption(primaryArea(solver) + secondaryArea(solver), solver),

  "cp005-use-half-square-area": ({ solver }: Context) =>
    numericOption(number(solver, "squareArea") / 2, solver),
  "cp005-use-square-minus-circle": ({ solver }: Context) =>
    numericOption(Math.abs(number(solver, "squareArea") - number(solver, "circleArea")), solver),
  "cp005-use-circle-diameter-squared": ({ solver }: Context) =>
    numericOption(number(solver, "diameter") ** 2, solver),

  "cp005-use-smaller-side-as-radius": ({ solver }: Context) =>
    numericOption(number(solver, "smallerSide"), solver),
  "cp005-use-quarter-smaller-side": ({ solver }: Context) =>
    numericOption(number(solver, "smallerSide") / 4, solver),
  "cp005-use-half-larger-side": ({ solver }: Context) =>
    numericOption(Math.max(number(solver, "length"), number(solver, "breadth")) / 2, solver),

  "cp005-double-hexagon-area-coefficient": ({ solver }: Context) =>
    surdOption(2 * number(solver, "hexagonAreaCoefficient"), solver),
  "cp005-half-hexagon-area-coefficient": ({ solver }: Context) =>
    surdOption(number(solver, "hexagonAreaCoefficient") / 2, solver),
  "cp005-use-one-triangle-area-coefficient": ({ solver }: Context) =>
    surdOption(number(solver, "side") ** 2 / 4, solver),

  "cp005-count-five-hexagon-sides": ({ solver }: Context) =>
    numericOption(5 * number(solver, "side"), solver),
  "cp005-count-seven-hexagon-sides": ({ solver }: Context) =>
    numericOption(7 * number(solver, "side"), solver),
  "cp005-count-three-hexagon-sides": ({ solver }: Context) =>
    numericOption(3 * number(solver, "side"), solver),

  "cp005-use-full-rectangle-perimeter": ({ solver }: Context) =>
    numericOption(2 * (number(solver, "length") + number(solver, "breadth")), solver),
  "cp005-use-full-circle-with-rectangle": ({ solver }: Context) =>
    numericOption(
      2 * number(solver, "length") + number(solver, "breadth") + 2 * number(solver, "semicircleArc"),
      solver,
    ),
  "cp005-omit-opposite-breadth": ({ solver }: Context) =>
    numericOption(2 * number(solver, "length") + number(solver, "semicircleArc"), solver),

  "cp005-use-stadium-rectangle-perimeter": ({ solver }: Context) =>
    numericOption(2 * (number(solver, "straightLength") + number(solver, "breadth")), solver),
  "cp005-use-two-full-circles": ({ solver }: Context) =>
    numericOption(2 * number(solver, "straightLength") + 2 * number(solver, "circumference"), solver),
  "cp005-use-one-straight-side": ({ solver }: Context) =>
    numericOption(number(solver, "straightLength") + number(solver, "circumference"), solver),

  "cp005-subtract-cutout-boundary": ({ solver }: Context) =>
    numericOption(
      2 * (number(solver, "outerLength") + number(solver, "outerBreadth")) -
        2 * (number(solver, "cutoutLength") + number(solver, "cutoutBreadth")),
      solver,
    ),
  "cp005-add-cutout-boundary": ({ solver }: Context) =>
    numericOption(
      2 * (number(solver, "outerLength") + number(solver, "outerBreadth")) +
        2 * (number(solver, "cutoutLength") + number(solver, "cutoutBreadth")),
      solver,
    ),
  "cp005-use-cutout-perimeter": ({ solver }: Context) =>
    numericOption(2 * (number(solver, "cutoutLength") + number(solver, "cutoutBreadth")), solver),

  "cp005-ignore-semicircle-in-reverse": ({ solver }: Context) =>
    numericOption(number(solver, "area") / number(solver, "breadth"), solver),
  "cp005-add-semicircle-in-reverse": ({ solver }: Context) =>
    numericOption(
      (number(solver, "area") + number(solver, "semicircleArea")) / number(solver, "breadth"),
      solver,
    ),
  "cp005-divide-by-breadth-plus-radius": ({ solver }: Context) =>
    numericOption(
      number(solver, "area") / (number(solver, "breadth") + number(solver, "radius")),
      solver,
    ),

  "cp005-use-half-recovered-side": ({ solver }: Context) =>
    numericOption(number(solver, "side") / 2, solver),
  "cp005-use-double-recovered-side": ({ solver }: Context) =>
    numericOption(2 * number(solver, "side"), solver),
  "cp005-add-radius-to-side": ({ solver }: Context) =>
    numericOption(number(solver, "side") + number(solver, "radius"), solver),
} as const satisfies Record<string, Strategy>;
