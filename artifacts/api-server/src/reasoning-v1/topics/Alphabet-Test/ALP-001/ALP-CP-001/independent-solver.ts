import { solveAlpInstance } from "../independent-solver";
import type { AlpInstanceData, AlpQuestionLogic, AlpSolverResult } from "../types";

export function solveAlpCp001Instance(ql: AlpQuestionLogic, data: AlpInstanceData): AlpSolverResult {
  if (ql.checkpointId !== "ALP-CP-001") throw new Error(`Expected ALP-CP-001, received ${ql.checkpointId}.`);
  return solveAlpInstance(ql, data);
}
