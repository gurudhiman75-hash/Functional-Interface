import { getPnc001ExplanationStrategy, renderPnc001Template } from "./library";
import type { Pnc001Cp006SolveMode, Pnc001Explanation, Pnc001Parameters, Pnc001ReasoningEvidence, Pnc001SolverResult } from "./types";

export function renderPnc001Cp006Explanation(
  parameters: Pnc001Parameters,
  solver: Pnc001SolverResult,
  _reasoning: Pnc001ReasoningEvidence,
): Pnc001Explanation {
  const strategy = getPnc001ExplanationStrategy(parameters.explanationId);
  const mode = parameters.solveMode as unknown as Pnc001Cp006SolveMode;
  if (String(strategy.solveMode) !== mode) throw new Error(`PNC-001 explanation ${parameters.explanationId} does not support ${mode}`);
  const evidence = solver.evidence;
  const totalObjects = evidence.mixedTotalObjects ?? parameters.values.totalObjects ?? 0;
  const selectedObjects = evidence.mixedSelectedObjects ?? parameters.values.selectedObjects ?? 0;
  const roleCount = evidence.mixedRoleCount ?? parameters.values.roleCount ?? 0;
  const minimum = evidence.mixedSearchMinimum ?? 0;
  const maximum = evidence.mixedSearchMaximum ?? 0;
  const recoveredSymbol = evidence.recoveredMixedParameter === "n" ? "n"
    : evidence.recoveredMixedParameter === "selected" ? "s" : "k";
  const inverseDomain = `${minimum} ≤ ${recoveredSymbol} ≤ ${maximum}`;
  const matchedMixedEquation = `${totalObjects}C${selectedObjects} × ${selectedObjects}P${roleCount} = ${evidence.mixedTarget ?? solver.numericAnswer}`;
  const variables: Record<string, string | number> = {
    ...parameters.renderVariables,
    answer: solver.answer,
    totalObjects,
    selectedObjects,
    roleCount,
    selectionCount: evidence.mixedSelectionCount ?? 1,
    roleAssignmentCount: evidence.mixedRoleAssignmentCount ?? solver.numericAnswer,
    inverseDomain,
    matchedMixedEquation,
  };
  return {
    explanationId: parameters.explanationId,
    lines: [strategy.concept, ...strategy.lines.map((line) => renderPnc001Template(line, variables))],
  };
}
