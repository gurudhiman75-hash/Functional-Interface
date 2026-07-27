import { getPnc002Explanation, renderPnc002Template } from "./library";
import type {
  Pnc002AnyParameters,
  Pnc002Explanation,
  Pnc002ReasoningEvidence,
  Pnc002SolverResult,
} from "./types";

export function renderPnc002Cp009Explanation(
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
    committeeSize: e.committeeSize ?? parameters.renderVariables.committeeSize ?? "",
    compulsoryCount: e.compulsoryCount ?? "",
    excludedCount: e.excludedCount ?? "",
    remainingEligibleCount: e.remainingEligibleCount ?? "",
    remainingSelectionCount: e.remainingSelectionCount ?? "",
    requiredFromA: e.requiredFromA ?? parameters.renderVariables.requiredFromA ?? "",
    requiredFromB: e.requiredFromB ?? "",
    minimumFromA: e.minimumFromA ?? parameters.renderVariables.minimumFromA ?? "",
    maximumFromA: e.maximumFromA ?? parameters.renderVariables.maximumFromA ?? "",
    requiredA: parameters.renderVariables.requiredA ?? "",
    requiredB: parameters.renderVariables.requiredB ?? "",
    requiredC: parameters.renderVariables.requiredC ?? "",
    specifiedCount: e.specifiedCount ?? parameters.renderVariables.specifiedCount ?? "",
    requiredSpecified: e.requiredSpecified ?? parameters.renderVariables.requiredSpecified ?? "",
    maximumSpecified: e.maximumSpecified ?? parameters.renderVariables.maximumSpecified ?? "",
    remainingCategoryASelection: e.remainingCategoryASelection ?? "",
    target: e.target ?? parameters.renderVariables.target ?? "",
    verification: reasoning.verification,
  };
  return {
    explanationId: parameters.explanationId,
    lines: authored.lines.map((line) => renderPnc002Template(line, variables)),
  };
}
