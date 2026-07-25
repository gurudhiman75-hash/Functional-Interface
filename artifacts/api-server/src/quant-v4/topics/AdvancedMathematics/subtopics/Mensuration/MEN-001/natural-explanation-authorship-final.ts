import { authorMen001ExplanationLines } from "./natural-explanation-authorship";
import { getFinalMen001NaturalExplanationProfile } from "./natural-explanation-profile-final";
import type { Men001Parameters, Men001SolverResult } from "./types";

const REDUNDANT_NARRATIVE_ENDING = /^(Therefore|Hence|Thus|So|Accordingly|The required|The final|The answer|A square unit|A linear unit|The numerical rate)/i;

const SHORT_CASE_BRIDGES: Record<string, string> = {
  "MEN-001-QL-013":
    "Keeping √3 in symbolic form preserves the exact area instead of replacing it with a rounded decimal.",
  "MEN-001-QL-014":
    "The exact surd form is retained because no approximation has been requested for the park’s area.",
  "MEN-001-QL-016":
    "This equal division is valid because an equilateral frame has no side longer or shorter than the others.",
  "MEN-001-QL-110":
    "Only the positive square root is meaningful because a physical side length cannot be negative.",
  "MEN-001-QL-332":
    "Dividing the full charge by the covered area gives the charge attached to one square metre.",
  "MEN-001-QL-333":
    "The perimeter is the total number of metres over which the stated fencing cost is spread.",
};

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
  const bridge = SHORT_CASE_BRIDGES[parameters.questionLanguageId];

  return [
    opening,
    ...working,
    ...(bridge ? [bridge] : []),
    conclusion,
  ];
}
