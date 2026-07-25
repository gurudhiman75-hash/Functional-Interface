import { getPnc002Explanation, renderPnc002Template } from "./library";
import type {
  Pnc002AnyParameters,
  Pnc002Explanation,
  Pnc002ReasoningEvidence,
  Pnc002SolverResult,
} from "./types";

export function renderPnc002Cp010Explanation(
  parameters: Pnc002AnyParameters,
  solver: Pnc002SolverResult,
  reasoning: Pnc002ReasoningEvidence,
): Pnc002Explanation {
  const e = solver.evidence;
  const authored = getPnc002Explanation(parameters.questionLanguageId);
  const variables: Record<string, string | number> = {
    answer: solver.answer,
    equation: `\(${solver.mathJax}\)`,
    calculation: `\(${solver.mathJax}\)`,
    totalObjects: e.totalObjects,
    totalObjectsMinusOne: e.totalObjects - 1,
    totalObjectsMinusTwo: e.totalObjects - 2,
    blockSize: e.blockSizes[0] ?? parameters.renderVariables.blockSize ?? "",
    secondBlockSize: e.blockSizes[1] ?? parameters.renderVariables.secondBlockSize ?? "",
    selectedObjects: e.selectedObjectCount ?? parameters.renderVariables.selectedObjects ?? "",
    selectionCount: e.selectionCount ?? "",
    clockwisePositionChoices: e.clockwisePositionChoices ?? "",
    clockwiseOrderDivisor: e.clockwiseOrderDivisor ?? "",
    largeCount: e.largeCount ?? parameters.renderVariables.largeCount ?? "",
    smallCount: e.smallCount ?? parameters.renderVariables.smallCount ?? "",
    target: e.target ?? parameters.renderVariables.target ?? "",
    rotationalSymmetryDivisor: e.rotationalSymmetryDivisor ?? "",
    reflectionSymmetryDivisor: e.reflectionSymmetryDivisor ?? "",
    verification: reasoning.verification,
  };
  return {
    explanationId: parameters.explanationId,
    lines: authored.lines.map((line) => renderPnc002Template(line, variables)),
  };
}
