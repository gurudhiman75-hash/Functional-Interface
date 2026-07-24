import { getMen001SolveModeDefinition } from "./solve-mode-registry.all";
import type { Men001Parameters, Men001SolverResult } from "./types";

export function solveMen001(parameters: Men001Parameters): Men001SolverResult {
  return getMen001SolveModeDefinition(parameters.solveMode).solve(parameters);
}
