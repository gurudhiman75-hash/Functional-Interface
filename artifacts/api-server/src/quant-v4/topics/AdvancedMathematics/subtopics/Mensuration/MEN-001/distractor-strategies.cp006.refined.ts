import type { Men001Parameters, Men001SolverResult } from "./types";

type Context = { parameters: Men001Parameters; solver: Men001SolverResult };
type Strategy = (context: Context) => string;

function positive(solver: Men001SolverResult, key: string) {
  const value = Number(solver.workingValues[key]);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 CP-006 refined distractor requires positive ${key}.`);
  }
  return value;
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function option(value: number, solver: Men001SolverResult) {
  return `${format(value)} ${solver.unit}`;
}

export const MEN_001_CP006_REFINED_DISTRACTOR_STRATEGIES = {
  "cp006-map-actual-length-divide-by-scale": ({ solver }: Context) =>
    option(positive(solver, "actualLength") / 100, solver),
  "cp006-map-length-divide-by-square-scale": ({ solver }: Context) =>
    option(positive(solver, "distance") / 100, solver),
  "cp006-map-area-divide-by-square-scale": ({ solver }: Context) =>
    option(positive(solver, "actualArea") / 10, solver),
} as const satisfies Record<string, Strategy>;
