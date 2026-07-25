import {
  getPnc002Explanation,
  renderPnc002Template,
} from "./library";
import type {
  Pnc002Explanation,
  Pnc002Parameters,
  Pnc002ReasoningEvidence,
  Pnc002SolverResult,
} from "./types";

export function renderPnc002Explanation(
  parameters: Pnc002Parameters,
  solver: Pnc002SolverResult,
  _reasoning: Pnc002ReasoningEvidence,
): Pnc002Explanation {
  const template = getPnc002Explanation(parameters.questionLanguageId);
  const evidence = solver.evidence;
  const variables: Record<string, string | number> = {
    answer: solver.answer,
    equation: `\\(${solver.mathJax}\\)`,
    totalObjects: evidence.totalObjects,
    blockSize: evidence.blockSizes[0] ?? 0,
    blockSizes: evidence.blockSizes.join(", "),
    unitCount: evidence.unitCount,
    internalMultiplier: evidence.internalArrangementMultiplier,
    target: evidence.target ?? 0,
  };
  return {
    explanationId: parameters.explanationId,
    lines: template.lines.map((line) => renderPnc002Template(line, variables)),
  };
}
