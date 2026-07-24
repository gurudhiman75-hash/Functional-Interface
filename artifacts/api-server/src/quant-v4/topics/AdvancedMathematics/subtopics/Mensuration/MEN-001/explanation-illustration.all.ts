import {
  buildMen001ExplanationIllustration as buildMen001Cp001Cp002ExplanationIllustration,
  hasMen001ExplanationIllustration as hasMen001Cp001Cp002ExplanationIllustration,
} from "./explanation-illustration";
import {
  buildMen001Cp003ExplanationIllustration,
  hasMen001Cp003ExplanationIllustration,
} from "./explanation-illustration.cp003";
import {
  buildMen001Cp004ExplanationIllustration,
  hasMen001Cp004ExplanationIllustration,
} from "./explanation-illustration.cp004";
import {
  buildMen001Cp004AdditionalExplanationIllustration,
  hasMen001Cp004AdditionalExplanationIllustration,
} from "./explanation-illustration.cp004.additional";
import {
  buildMen001ExhaustivenessExplanationIllustration,
  hasMen001ExhaustivenessExplanationIllustration,
} from "./explanation-illustration.exhaustiveness";
import type {
  Men001ExplanationIllustration,
  Men001Parameters,
  Men001SolverResult,
} from "./types";
import type { Men001SolveMode } from "./solve-mode-registry.all";

export function hasMen001ExplanationIllustration(mode: Men001SolveMode) {
  return (
    hasMen001Cp001Cp002ExplanationIllustration(mode) ||
    hasMen001Cp003ExplanationIllustration(mode) ||
    hasMen001Cp004ExplanationIllustration(mode) ||
    hasMen001Cp004AdditionalExplanationIllustration(mode) ||
    hasMen001ExhaustivenessExplanationIllustration(mode)
  );
}

export function buildMen001ExplanationIllustration(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationIllustration | undefined {
  return (
    buildMen001Cp001Cp002ExplanationIllustration(parameters, solver) ??
    buildMen001Cp003ExplanationIllustration(parameters, solver) ??
    buildMen001Cp004ExplanationIllustration(parameters, solver) ??
    buildMen001Cp004AdditionalExplanationIllustration(parameters, solver) ??
    buildMen001ExhaustivenessExplanationIllustration(parameters, solver)
  );
}
