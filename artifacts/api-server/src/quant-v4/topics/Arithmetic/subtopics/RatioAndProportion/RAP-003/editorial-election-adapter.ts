import { renderRap003ElectionExplanation } from "./editorial-election";
import type { Rap003Explanation, Rap003Parameters, Rap003SolverResult } from "./types";

/**
 * The solver libraries use a few newer variable names than the first editorial
 * election renderer. Add only aliases backed by real values; never add an
 * undefined key because student-facing validation treats it as a hard failure.
 */
export function renderRap003ElectionExplanationWithSolverVariables(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  const variables = { ...parameters.variables };
  const aliases: Array<[string, string]> = [
    ["voteRatioA", "candidateRatioA"],
    ["voteRatioB", "candidateRatioB"],
    ["voteRatioC", "candidateRatioC"],
    ["validVotes", "totalValidVotes"],
    ["shareRatioA", "candidateRatioA"],
    ["shareRatioB", "candidateRatioB"],
    ["yesRatio", "candidateRatioA"],
    ["noRatio", "candidateRatioB"],
  ];

  for (const [alias, source] of aliases) {
    if (variables[alias] === undefined && variables[source] !== undefined) {
      variables[alias] = variables[source]!;
    }
  }

  return renderRap003ElectionExplanation(
    { ...parameters, variables },
    solver,
    explanation,
  );
}
