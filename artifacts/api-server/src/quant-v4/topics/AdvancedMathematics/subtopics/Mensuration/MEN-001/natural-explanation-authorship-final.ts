import { authorMen001ExplanationLines } from "./natural-explanation-authorship";
import { getFinalMen001NaturalExplanationProfile } from "./natural-explanation-profile-final";
import type { Men001Parameters, Men001SolverResult } from "./types";

const REDUNDANT_NARRATIVE_ENDING = /^(Therefore|Hence|Thus|So|Accordingly|The required|The final|The answer|A square unit|A linear unit|The numerical rate)/i;

function isRedundantEnding(line: string) {
  return !line.includes("=") && REDUNDANT_NARRATIVE_ENDING.test(line);
}

export function authorFinalMen001ExplanationLines(
  originalLines: readonly string[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] {
  const authored = authorMen001ExplanationLines(
    originalLines,
    parameters,
    solver,
  );
  const profile = getFinalMen001NaturalExplanationProfile(
    parameters.questionLanguageId,
  );
  if (!profile) {
    throw new Error(
      `MEN-001 requires a final natural explanation profile for ${parameters.questionLanguageId}.`,
    );
  }
  const opening = profile.opening;
  const conclusion = profile.conclusion.replace("{answer}", solver.answer);
  const working = authored
    .slice(1, -1)
    .filter((line) => !isRedundantEnding(line));

  return [opening, ...working, conclusion];
}
