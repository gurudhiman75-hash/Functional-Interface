import type { Men001Parameters, Men001SolverResult } from "./types";

type Context = { parameters: Men001Parameters; solver: Men001SolverResult };
type Strategy = (context: Context) => string;

function number(solver: Men001SolverResult, key: string) {
  const value = Number(solver.workingValues[key]);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 CP-005 square-circle distractor requires positive ${key}.`);
  }
  return value;
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function option(value: number, solver: Men001SolverResult) {
  return `${format(value)} ${solver.unit}`;
}

export const MEN_001_CP005_SHAPE_DISTRACTOR_STRATEGIES = {
  "cp005-report-square-area": ({ solver }: Context) =>
    option(number(solver, "squareArea"), solver),
  "cp005-report-circle-area": ({ solver }: Context) =>
    option(number(solver, "circleArea"), solver),
  "cp005-add-square-and-circle": ({ solver }: Context) =>
    option(number(solver, "squareArea") + number(solver, "circleArea"), solver),
  "cp005-report-square-circle-difference": ({ solver }: Context) =>
    option(Math.abs(number(solver, "squareArea") - number(solver, "circleArea")), solver),
} as const satisfies Record<string, Strategy>;
