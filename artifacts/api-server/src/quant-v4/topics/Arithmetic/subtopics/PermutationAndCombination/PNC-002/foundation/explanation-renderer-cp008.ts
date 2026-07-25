import { getPnc002Explanation, renderPnc002Template } from "./library";
import type {
  Pnc002Explanation,
  Pnc002AnyParameters,
  Pnc002ReasoningEvidence,
  Pnc002SolverResult,
} from "./types";

export function renderPnc002Cp008Explanation(
  parameters: Pnc002AnyParameters,
  solver: Pnc002SolverResult,
  reasoning: Pnc002ReasoningEvidence,
): Pnc002Explanation {
  const e = solver.evidence;
  const authored = getPnc002Explanation(parameters.questionLanguageId);
  const variables: Record<string, string | number> = {
    answer: solver.answer,
    equation: `\\(${solver.mathJax}\\)`,
    calculation: `\\(${solver.mathJax}\\)`,
    totalObjects: e.totalObjects,
    fixedPosition: e.fixedPosition ?? "",
    remainingObjects: e.remainingObjects ?? Math.max(0, e.totalObjects - 1),
    allowedPositionCount: e.allowedPositionCount ?? "",
    chainLength: e.chainLengths?.[0] ?? "",
    largeCount: e.largeCount ?? "",
    smallCount: e.smallCount ?? "",
    orientationCount: e.orientationCount ?? "",
    gapSlotCount: e.gapSlotCount ?? "",
    gapCount: e.gapCount ?? "",
    minimumGap: e.minimumGap ?? "",
    orderedPositionPairCount: e.orderedPositionPairCount ?? "",
    specifiedCount: e.specifiedCount ?? "",
    requiredInClass: e.requiredInClass ?? "",
    eligibleClassPositions: e.eligibleClassPositions ?? "",
    target: e.target ?? parameters.renderVariables.target ?? "",
    verification: reasoning.verification,
  };
  return {
    explanationId: parameters.explanationId,
    lines: authored.lines.map((line) => renderPnc002Template(line, variables)),
  };
}
