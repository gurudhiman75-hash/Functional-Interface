import { getPnc002Explanation, renderPnc002Template } from "./library";
import type {
  Pnc002AnyParameters,
  Pnc002Explanation,
  Pnc002ReasoningEvidence,
  Pnc002SolverResult,
} from "./types";

export function renderPnc002Cp008SaturationExplanation(
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
    prescribedObjectCount: e.prescribedObjectCount ?? "",
    remainingObjects: e.remainingObjects ?? "",
    positionSetAssignmentCount: e.positionSetAssignmentCount ?? "",
    maximumGap: e.maximumGap ?? parameters.renderVariables.maximumGap ?? "",
    gapCount: e.gapCount ?? parameters.renderVariables.gapCount ?? "",
    orderedPositionPairCount: e.orderedPositionPairCount ?? "",
    directionalPositionPairCount: e.directionalPositionPairCount ?? "",
    specifiedCount: e.specifiedCount ?? parameters.renderVariables.specifiedCount ?? "",
    minimumInClass: e.minimumInClass ?? parameters.renderVariables.minimumInClass ?? "",
    eligibleClassPositions: e.eligibleClassPositions ?? parameters.renderVariables.eligibleClassPositions ?? "",
    acceptedClassCounts: e.acceptedClassCounts?.join(", ") ?? "",
    verification: reasoning.verification,
  };

  return {
    explanationId: parameters.explanationId,
    lines: authored.lines.map((line) => renderPnc002Template(line, variables)),
  };
}
