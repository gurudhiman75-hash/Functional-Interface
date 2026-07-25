import { getFinalMen001NaturalExplanationProfile } from "./natural-explanation-profile-final";
import { writeManualMen001Working } from "./natural-explanation-manual";
import { sentence, shownAnswer } from "./natural-explanation-manual.shared";
import type { Men001Parameters, Men001SolverResult } from "./types";

function conclusionFor(
  template: string,
  solver: Men001SolverResult,
): string {
  const text = template
    .replace("{answer}", shownAnswer(solver))
    .replace(/^\s*(Therefore|Hence|Thus|So),?\s+/i, "")
    .replace(/\s+therefore\s+/i, " ")
    .replace(/\s+hence\s+/i, " ")
    .replace(/\s+thus\s+/i, " ")
    .trim();
  return sentence(text[0] ? text[0].toUpperCase() + text.slice(1) : text);
}

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

  const opening = sentence(profile.opening);
  const working = writeManualMen001Working(parameters, solver);
  const conclusion = conclusionFor(profile.conclusion, solver);
  const qlNumber = Number(parameters.questionLanguageId.split("-").at(-1) ?? 0);
  const variant = Number.isFinite(qlNumber) ? qlNumber % 3 : 2;

  if (working.length === 1 && variant === 0) {
    return [sentence(`${opening} ${working[0]}`), conclusion];
  }
  if (working.length === 1 && variant === 1) {
    return [opening, sentence(`${working[0]} ${conclusion}`)];
  }
  if (working.length > 1 && variant === 0) {
    return [sentence(`${opening} ${working[0]}`), ...working.slice(1), conclusion];
  }

  return [opening, ...working, conclusion];
}
