import { solveAlpInstance } from "../independent-solver";
import type { AlpInstanceData, AlpQuestionLogic, AlpSolverResult } from "../types";

export function solveAlpCp003Instance(ql: AlpQuestionLogic, data: AlpInstanceData): AlpSolverResult {
  if (ql.checkpointId !== "ALP-CP-003") throw new Error(`Expected ALP-CP-003, received ${ql.checkpointId}.`);
  return solveAlpInstance(ql, data);
}
