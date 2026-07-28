import { solveAlpInstance } from "../independent-solver";
import type { AlpInstanceData, AlpQuestionLogic, AlpSolverResult } from "../types";

export function solveAlpCp002Instance(ql: AlpQuestionLogic, data: AlpInstanceData): AlpSolverResult {
  if (ql.checkpointId !== "ALP-CP-002") throw new Error(`Expected ALP-CP-002, received ${ql.checkpointId}.`);
  return solveAlpInstance(ql, data);
}
