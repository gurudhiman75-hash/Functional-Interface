import type { Men001Parameters, Men001SolverResult } from "./types";

type Context = { parameters: Men001Parameters; solver: Men001SolverResult };
type Strategy = (context: Context) => string;

function number(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`MEN-001 refined rate distractor requires a positive finite value.`);
  }
  return parsed;
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function option(value: number, solver: Men001SolverResult) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`MEN-001 refined rate distractor produced invalid value ${value}.`);
  }
  if (solver.unit === "₹/m²") return `₹${format(value)}/m²`;
  if (solver.unit === "₹/m") return `₹${format(value)}/m`;
  throw new Error(`MEN-001 refined rate distractor received incompatible unit ${solver.unit}.`);
}

export const MEN_001_EXHAUSTIVENESS_REFINED_DISTRACTOR_STRATEGIES = {
  "ex-double-rate-by-halving-measure": ({ solver }: Context) => {
    const measure = number(solver.workingValues.area ?? solver.workingValues.perimeter);
    return option(number(solver.workingValues.cost) / (measure / 2), solver);
  },
  "ex-report-area-as-rate": ({ solver }: Context) =>
    option(number(solver.workingValues.area), solver),
  "ex-divide-fence-cost-by-three-sides": ({ solver }: Context) =>
    option(
      number(solver.workingValues.cost) /
        (2 * number(solver.workingValues.length) + number(solver.workingValues.breadth)),
      solver,
    ),
} as const satisfies Record<string, Strategy>;
