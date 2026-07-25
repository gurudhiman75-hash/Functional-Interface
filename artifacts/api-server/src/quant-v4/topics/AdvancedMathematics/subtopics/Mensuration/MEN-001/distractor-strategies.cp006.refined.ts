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

export const MEN_001_CP006_REFINED_DISTRACTOR_STRATEGIES = {
  "cp006-map-area-divide-by-square-scale": ({ solver }: Context) =>
    `${format(positive(solver, "actualArea") / 10)} ${solver.unit}`,
} as const satisfies Record<string, Strategy>;
