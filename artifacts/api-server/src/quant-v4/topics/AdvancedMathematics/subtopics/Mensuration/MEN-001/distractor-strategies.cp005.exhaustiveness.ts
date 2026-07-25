import type { Men001Parameters, Men001SolverResult } from "./types";

type Context = { parameters: Men001Parameters; solver: Men001SolverResult };
type Strategy = (context: Context) => string;

function number(solver: Men001SolverResult, key: string) {
  const candidate = Number(solver.workingValues[key]);
  if (!Number.isFinite(candidate) || candidate <= 0) {
    throw new Error(`MEN-001 CP-005 exhaustiveness distractor requires positive ${key}.`);
  }
  return candidate;
}

function format(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 CP-005 exhaustiveness distractor produced invalid value ${value}.`);
  }
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function numericOption(value: number, solver: Men001SolverResult) {
  return `${format(value)} ${solver.unit}`;
}

function surdOption(coefficient: number, solver: Men001SolverResult) {
  if (!Number.isInteger(coefficient) || coefficient <= 0) {
    throw new Error(`MEN-001 CP-005 exhaustiveness symbolic distractor requires a positive integer coefficient.`);
  }
  const latexUnit = solver.unit === "cm²" ? "\\text{cm}^{2}" : "\\text{m}^{2}";
  return `$$${coefficient}\\sqrt{3}\\,${latexUnit}$$`;
}

export const MEN_001_CP005_EXHAUSTIVENESS_DISTRACTOR_STRATEGIES = {
  "cp005-add-full-rectangle-perimeters": ({ solver }: Context) =>
    numericOption(number(solver, "firstPerimeter") + number(solver, "secondPerimeter"), solver),
  "cp005-subtract-shared-edge-once": ({ solver }: Context) =>
    numericOption(
      number(solver, "firstPerimeter") + number(solver, "secondPerimeter") - number(solver, "sharedEdge"),
      solver,
    ),
  "cp005-subtract-shared-edge-four-times": ({ solver }: Context) =>
    numericOption(
      number(solver, "firstPerimeter") + number(solver, "secondPerimeter") - 4 * number(solver, "sharedEdge"),
      solver,
    ),

  "cp005-count-outer-boundary-only": ({ solver }: Context) =>
    numericOption(number(solver, "outerPerimeter"), solver),
  "cp005-count-inner-boundary-only": ({ solver }: Context) =>
    numericOption(number(solver, "innerCircumference"), solver),
  "cp005-subtract-inner-boundary": ({ solver }: Context) =>
    numericOption(
      Math.abs(number(solver, "outerPerimeter") - number(solver, "innerCircumference")),
      solver,
    ),

  "cp005-divide-hexagon-perimeter-by-five": ({ solver }: Context) =>
    numericOption(number(solver, "perimeter") / 5, solver),
  "cp005-divide-hexagon-perimeter-by-seven": ({ solver }: Context) =>
    numericOption(number(solver, "perimeter") / 7, solver),
  "cp005-divide-hexagon-perimeter-by-three": ({ solver }: Context) =>
    numericOption(number(solver, "perimeter") / 3, solver),

  "cp005-divide-perimeter-by-three-for-hexagon-area": ({ solver }: Context) =>
    surdOption(4 * number(solver, "hexagonAreaCoefficient"), solver),
  "cp005-half-recovered-hexagon-area": ({ solver }: Context) =>
    surdOption(number(solver, "hexagonAreaCoefficient") / 2, solver),
  "cp005-use-one-recovered-equilateral-triangle": ({ solver }: Context) =>
    surdOption(number(solver, "side") ** 2 / 4, solver),

  "cp005-ignore-stadium-curved-boundary": ({ solver }: Context) =>
    numericOption(number(solver, "perimeter") / 2, solver),
  "cp005-report-combined-straight-length": ({ solver }: Context) =>
    numericOption(2 * number(solver, "straightLength"), solver),
  "cp005-halve-stadium-straight-length": ({ solver }: Context) =>
    numericOption(number(solver, "straightLength") / 2, solver),

  "cp005-report-recovered-diameter": ({ solver }: Context) =>
    numericOption(2 * number(solver, "radius"), solver),
  "cp005-report-half-recovered-radius": ({ solver }: Context) =>
    numericOption(number(solver, "radius") / 2, solver),
  "cp005-treat-shaded-area-as-radius-square": ({ solver }: Context) =>
    numericOption(Math.sqrt(number(solver, "area")), solver),
} as const satisfies Record<string, Strategy>;
