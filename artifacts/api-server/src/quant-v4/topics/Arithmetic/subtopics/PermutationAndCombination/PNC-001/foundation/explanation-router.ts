import { renderPnc001Explanation } from "./explanation-renderer";
import { renderPnc001Cp006Explanation } from "./explanation-renderer-cp006";
import { renderPnc001DictionaryRankExplanation } from "./explanation-renderer-dictionary-rank";
import type { Pnc001Explanation, Pnc001Parameters, Pnc001ReasoningEvidence, Pnc001SolverResult } from "./types";

export function renderPnc001RoutedExplanation(
  parameters: Pnc001Parameters,
  solver: Pnc001SolverResult,
  reasoning: Pnc001ReasoningEvidence,
): Pnc001Explanation {
  if (String(parameters.solveMode) === "findDictionaryRankOfWord") {
    return renderPnc001DictionaryRankExplanation(parameters, solver, reasoning);
  }
  return parameters.canonicalProblemId === "PNC-CP-006"
    ? renderPnc001Cp006Explanation(parameters, solver, reasoning)
    : renderPnc001Explanation(parameters, solver, reasoning);
}