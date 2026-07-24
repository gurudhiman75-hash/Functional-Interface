import { buildPnc001ReasoningEvidence } from "./reasoning-graph";
import { buildPnc001Cp006ReasoningEvidence } from "./reasoning-graph-cp006";
import type { Pnc001IndependentVerification, Pnc001Parameters, Pnc001ReasoningEvidence, Pnc001SolverResult } from "./types";

export function buildPnc001RoutedReasoningEvidence(
  parameters: Pnc001Parameters,
  solver: Pnc001SolverResult,
  verification: Pnc001IndependentVerification,
): Pnc001ReasoningEvidence {
  return parameters.canonicalProblemId === "PNC-CP-006"
    ? buildPnc001Cp006ReasoningEvidence(parameters, solver, verification)
    : buildPnc001ReasoningEvidence(parameters, solver, verification);
}
