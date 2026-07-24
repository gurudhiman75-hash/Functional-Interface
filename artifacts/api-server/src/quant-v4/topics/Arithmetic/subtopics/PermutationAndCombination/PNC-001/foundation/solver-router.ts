import type { Pnc001IndependentVerification, Pnc001Parameters, Pnc001SolverResult } from "./types";
import { solvePnc001, verifyPnc001Independently } from "./solver";
import { solvePnc001Cp006, verifyPnc001Cp006Independently } from "./solver-cp006";

export function solvePnc001Routed(parameters: Pnc001Parameters): Pnc001SolverResult {
  return parameters.canonicalProblemId === "PNC-CP-006" ? solvePnc001Cp006(parameters) : solvePnc001(parameters);
}
export function verifyPnc001RoutedIndependently(parameters: Pnc001Parameters): Pnc001IndependentVerification {
  return parameters.canonicalProblemId === "PNC-CP-006" ? verifyPnc001Cp006Independently(parameters) : verifyPnc001Independently(parameters);
}
