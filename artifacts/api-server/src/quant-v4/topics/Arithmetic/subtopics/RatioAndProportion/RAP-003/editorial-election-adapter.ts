import { renderRap003ElectionExplanation } from "./editorial-election";
import type { Rap003Explanation, Rap003Parameters, Rap003SolverResult } from "./types";

/**
 * The RAP-003 solver and parameter generator use candidateRatioA/B/C, while the
 * first editorial election renderer used voteRatioA/B/C. Keep the renderer's
 * prose logic isolated, but provide the exact solver variables so no NaN can
 * enter a visible explanation.
 */
export function renderRap003ElectionExplanationWithSolverVariables(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  const variables = {
    ...parameters.variables,
    voteRatioA: parameters.variables.voteRatioA ?? parameters.variables.candidateRatioA,
    voteRatioB: parameters.variables.voteRatioB ?? parameters.variables.candidateRatioB,
    voteRatioC: parameters.variables.voteRatioC ?? parameters.variables.candidateRatioC,
  };

  return renderRap003ElectionExplanation(
    { ...parameters, variables },
    solver,
    explanation,
  );
}
