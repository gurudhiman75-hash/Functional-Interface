import { solveAlpInstance } from "../independent-solver";
import type { AlpInstanceData, AlpQuestionLogic, AlpSolverResult } from "../types";

export function solveAlpCp004Instance(ql: AlpQuestionLogic, data: AlpInstanceData): AlpSolverResult {
  if (ql.checkpointId !== "ALP-CP-004") throw new Error(`Expected ALP-CP-004, received ${ql.checkpointId}.`);
  return solveAlpInstance(ql, data);
}
