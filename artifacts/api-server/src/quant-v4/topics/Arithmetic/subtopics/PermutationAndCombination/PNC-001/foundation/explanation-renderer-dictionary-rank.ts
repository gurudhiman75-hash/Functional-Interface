import { getPnc001QlSpecificExplanation, renderPnc001Template } from "./library";
import type { Pnc001Explanation, Pnc001Parameters, Pnc001ReasoningEvidence, Pnc001SolverResult } from "./types";

export function renderPnc001DictionaryRankExplanation(
  parameters: Pnc001Parameters,
  solver: Pnc001SolverResult,
  _reasoning: Pnc001ReasoningEvidence,
): Pnc001Explanation {
  const template = getPnc001QlSpecificExplanation(parameters.questionLanguageId);
  const evidence = solver.evidence;
  const variables: Record<string, string | number> = {
    answer: solver.answer,
    sourceWord: evidence.dictionarySourceWord ?? "",
    targetWord: evidence.dictionaryTargetWord ?? "",
    precedingCount: evidence.dictionaryPrecedingCount ?? solver.numericAnswer - 1,
    calculation: solver.equation,
  };
  return {
    explanationId: parameters.explanationId,
    lines: template.lines.map((line) => renderPnc001Template(line, variables)),
  };
}