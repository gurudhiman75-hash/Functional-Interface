import type { Men001Parameters, Men001SolverResult } from "./types";

type Context = { parameters: Men001Parameters; solver: Men001SolverResult };
type Strategy = (context: Context) => string;

function number(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`MEN-001 CP-004 additional distractor requires a finite number.`);
  }
  return parsed;
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function option(value: number, solver: Men001SolverResult) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 CP-004 additional distractor produced invalid value ${value}.`);
  }
  return solver.unit === "₹" ? `₹${format(value)}` : `${format(value)} ${solver.unit}`;
}

export const MEN_001_CP004_ADDITIONAL_DISTRACTOR_STRATEGIES = {
  "report-full-floor-as-uncovered": ({ solver }: Context) =>
    option(number(solver.workingValues.outerArea), solver),
  "report-mat-area-as-uncovered": ({ solver }: Context) =>
    option(number(solver.workingValues.innerArea), solver),
  "subtract-mat-length-only": ({ solver }: Context) =>
    option(
      (number(solver.workingValues.outerLength) - number(solver.workingValues.innerLength)) *
        number(solver.workingValues.outerBreadth),
      solver,
    ),

  "paint-entire-wall-including-door": ({ solver }: Context) =>
    option(
      number(solver.workingValues.outerArea) * number(solver.workingValues.ratePerSquareMetre),
      solver,
    ),
  "paint-door-area-only": ({ solver }: Context) =>
    option(
      number(solver.workingValues.innerArea) * number(solver.workingValues.ratePerSquareMetre),
      solver,
    ),
  "subtract-door-area-after-costing-wall": ({ solver }: Context) =>
    option(
      number(solver.workingValues.outerArea) * number(solver.workingValues.ratePerSquareMetre) -
        number(solver.workingValues.innerArea),
      solver,
    ),

  "cost-one-fencing-round-only": ({ solver }: Context) =>
    option(
      number(solver.workingValues.perimeter) * number(solver.workingValues.ratePerMetre),
      solver,
    ),
  "report-multiple-round-wire-as-cost": ({ solver }: Context) =>
    option(number(solver.workingValues.wireLength), solver),
  "cost-one-extra-fencing-round": ({ solver }: Context) =>
    option(
      number(solver.workingValues.perimeter) *
        (number(solver.workingValues.rounds) + 1) *
        number(solver.workingValues.ratePerMetre),
      solver,
    ),
} as const satisfies Record<string, Strategy>;
