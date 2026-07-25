import {
  authorMen001ExplanationLines,
  getMen001NaturalExplanationProfile,
  getMen001NaturalExplanationProfileIds,
  type Men001NaturalExplanationProfile,
} from "./natural-explanation-authorship";
import {
  authorMen001Cp005ExplanationLines,
  getMen001Cp005NaturalExplanationProfile,
  getMen001Cp005NaturalExplanationProfileIds,
} from "./natural-explanation-authorship.cp005";
import type { Men001Parameters, Men001SolverResult } from "./types";

export function authorAllMen001ExplanationLines(
  originalLines: readonly string[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] {
  return parameters.canonicalProblemId === "MEN-CP-005"
    ? authorMen001Cp005ExplanationLines(originalLines, parameters, solver)
    : authorMen001ExplanationLines(originalLines, parameters, solver);
}

export function getAllMen001NaturalExplanationProfile(
  questionLanguageId: string,
): Men001NaturalExplanationProfile | undefined {
  return (
    getMen001NaturalExplanationProfile(questionLanguageId) ??
    getMen001Cp005NaturalExplanationProfile(questionLanguageId)
  );
}

export function getAllMen001NaturalExplanationProfileIds() {
  return [
    ...getMen001NaturalExplanationProfileIds(),
    ...getMen001Cp005NaturalExplanationProfileIds(),
  ];
}
