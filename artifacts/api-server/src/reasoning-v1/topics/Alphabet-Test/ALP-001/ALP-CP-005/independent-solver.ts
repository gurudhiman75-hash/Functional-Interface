import { solveAlpInstance } from "../independent-solver";
import type { AlpInstanceData, AlpQuestionLogic, AlpSolverResult } from "../types";

export function solveAlpCp005Instance(ql: AlpQuestionLogic, data: AlpInstanceData): AlpSolverResult {
  if (ql.checkpointId !== "ALP-CP-005") throw new Error(`Expected ALP-CP-005, received ${ql.checkpointId}.`);
  return solveAlpInstance(ql, data);
}
