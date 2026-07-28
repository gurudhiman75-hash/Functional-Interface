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
  getMen001Cp005ExhaustivenessNaturalExplanationProfile,
  getMen001Cp005ExhaustivenessNaturalExplanationProfileIds,
} from "./natural-explanation-authorship.cp005.exhaustiveness";
import {
  getMen001Cp005OverlapNaturalExplanationProfile,
  getMen001Cp005OverlapNaturalExplanationProfileIds,
} from "./natural-explanation-authorship.cp005.overlap";
import {
  getMen001Cp006NaturalExplanationProfile,
  getMen001Cp006NaturalExplanationProfileIds,
} from "./natural-explanation-authorship.cp006";
import type { Men001Parameters, Men001SolverResult } from "./types";

function usesDirectCp005Profile(questionLanguageId: string) {
  const numericId = Number(questionLanguageId.split("-").at(-1) ?? 0);
  return Number.isFinite(numericId) && numericId >= 361;
}

export function authorAllMen001ExplanationLines(
  originalLines: readonly string[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] {
  if (parameters.canonicalProblemId === "MEN-CP-006") {
    return [...originalLines];
  }
  return parameters.canonicalProblemId === "MEN-CP-005"
    ? usesDirectCp005Profile(parameters.questionLanguageId)
      ? [...originalLines]
      : authorMen001Cp005ExplanationLines(originalLines, parameters, solver)
    : authorMen001ExplanationLines(originalLines, parameters, solver);
}

export function getAllMen001NaturalExplanationProfile(
  questionLanguageId: string,
): Men001NaturalExplanationProfile | undefined {
  return (
    getMen001NaturalExplanationProfile(questionLanguageId) ??
    getMen001Cp005NaturalExplanationProfile(questionLanguageId) ??
    getMen001Cp005OverlapNaturalExplanationProfile(questionLanguageId) ??
    getMen001Cp005ExhaustivenessNaturalExplanationProfile(questionLanguageId) ??
    getMen001Cp006NaturalExplanationProfile(questionLanguageId)
  );
}

export function getAllMen001NaturalExplanationProfileIds() {
  return [
    ...getMen001NaturalExplanationProfileIds(),
    ...getMen001Cp005NaturalExplanationProfileIds(),
    ...getMen001Cp005OverlapNaturalExplanationProfileIds(),
    ...getMen001Cp005ExhaustivenessNaturalExplanationProfileIds(),
    ...getMen001Cp006NaturalExplanationProfileIds(),
  ];
}
