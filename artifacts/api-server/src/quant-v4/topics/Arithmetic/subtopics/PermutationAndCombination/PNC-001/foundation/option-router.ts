import { buildPnc001Options } from "./option-generator";
import { buildPnc001Cp006Options } from "./option-generator-cp006";
import { buildPnc001DictionaryRankOptions } from "./option-generator-dictionary-rank";
import type { Pnc001Parameters, Pnc001SolverResult } from "./types";

export function buildPnc001RoutedOptions(
  parameters: Pnc001Parameters,
  solver: Pnc001SolverResult,
): { options: string[]; correctIndex: number } {
  if (String(parameters.solveMode) === "findDictionaryRankOfWord") return buildPnc001DictionaryRankOptions(parameters, solver);
  return parameters.canonicalProblemId === "PNC-CP-006"
    ? buildPnc001Cp006Options(parameters, solver)
    : buildPnc001Options(parameters, solver);
}