import { getFinalMen001NaturalExplanationProfile } from "./natural-explanation-profile-final";
import { writeManualMen001Working } from "./natural-explanation-manual";
import { sentence } from "./natural-explanation-manual.shared";
import type { Men001Parameters, Men001SolverResult } from "./types";

export function authorFinalMen001ExplanationLines(
  _originalLines: readonly string[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] {
  const profile = getFinalMen001NaturalExplanationProfile(
    parameters.questionLanguageId,
  );
  if (!profile) {
    throw new Error(
      `MEN-001 requires a natural explanation profile for ${parameters.questionLanguageId}.`,
    );
  }

  return [
    sentence(profile.opening),
    ...writeManualMen001Working(parameters, solver),
  ];
}
