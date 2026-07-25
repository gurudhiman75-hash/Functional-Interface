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
import {
  getMen001Cp005OverlapNaturalExplanationProfile,
  getMen001Cp005OverlapNaturalExplanationProfileIds,
} from "./natural-explanation-authorship.cp005.overlap";
import type { Men001Parameters, Men001SolverResult } from "./types";

export function authorAllMen001ExplanationLines(
  originalLines: readonly string[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] {
  return parameters.canonicalProblemId === "MEN-CP-005"
    ? parameters.questionLanguageId === "MEN-001-QL-361"
      ? originalLines
      : authorMen001Cp005ExplanationLines(originalLines, parameters, solver)
    : authorMen001ExplanationLines(originalLines, parameters, solver);
}

export function getAllMen001NaturalExplanationProfile(
  questionLanguageId: string,
): Men001NaturalExplanationProfile | undefined {
  return (
    getMen001NaturalExplanationProfile(questionLanguageId) ??
    getMen001Cp005NaturalExplanationProfile(questionLanguageId) ??
    getMen001Cp005OverlapNaturalExplanationProfile(questionLanguageId)
  );
}

export function getAllMen001NaturalExplanationProfileIds() {
  return [
    ...getMen001NaturalExplanationProfileIds(),
    ...getMen001Cp005NaturalExplanationProfileIds(),
    ...getMen001Cp005OverlapNaturalExplanationProfileIds(),
  ];
}
