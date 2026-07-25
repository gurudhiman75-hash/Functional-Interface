import { getPnc002Explanation, renderPnc002Template } from "./library";
import type {
  Pnc002AnyParameters,
  Pnc002Explanation,
  Pnc002ReasoningEvidence,
  Pnc002SolverResult,
} from "./types";

export function renderPnc002Cp009SaturationExplanation(
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
    specifiedCount: e.specifiedCount ?? parameters.renderVariables.specifiedCount ?? "",
    minimumSpecified: e.minimumSpecified ?? parameters.renderVariables.minimumSpecified ?? "",
    maximumSpecified: e.maximumSpecified ?? parameters.renderVariables.maximumSpecified ?? "",
    minimumFromA: e.minimumFromA ?? parameters.renderVariables.minimumFromA ?? "",
    maximumFromA: e.maximumFromA ?? parameters.renderVariables.maximumFromA ?? "",
    minimumFromB: e.minimumFromB ?? parameters.renderVariables.minimumFromB ?? "",
    verification: reasoning.verification,
  };
  return {
    explanationId: parameters.explanationId,
    lines: authored.lines.map((line) => renderPnc002Template(line, variables)),
  };
}
