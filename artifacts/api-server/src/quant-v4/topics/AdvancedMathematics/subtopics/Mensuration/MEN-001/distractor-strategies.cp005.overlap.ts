import type { Men001Parameters, Men001SolverResult } from "./types";

type Context = { parameters: Men001Parameters; solver: Men001SolverResult };
type Strategy = (context: Context) => string;

function number(solver: Men001SolverResult, key: string) {
  const value = Number(solver.workingValues[key]);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 CP-005 overlap distractor requires positive ${key}.`);
  }
  return value;
}

function option(value: number, solver: Men001SolverResult) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 CP-005 overlap distractor produced invalid value ${value}.`);
  }
  return `${Number.isInteger(value) ? value : Number(value.toFixed(2))} ${solver.unit}`;
}

export const MEN_001_CP005_OVERLAP_DISTRACTOR_STRATEGIES = {
  "cp005-add-overlap-twice": ({ solver }: Context) =>
    option(number(solver, "rectangleArea") + number(solver, "componentArea"), solver),
  "cp005-subtract-overlap-twice": ({ solver }: Context) =>
    option(
      number(solver, "rectangleArea") +
        number(solver, "componentArea") -
        2 * number(solver, "overlapArea"),
      solver,
    ),
  "cp005-report-overlap-area-only": ({ solver }: Context) =>
    option(number(solver, "overlapArea"), solver),
} as const satisfies Record<string, Strategy>;
