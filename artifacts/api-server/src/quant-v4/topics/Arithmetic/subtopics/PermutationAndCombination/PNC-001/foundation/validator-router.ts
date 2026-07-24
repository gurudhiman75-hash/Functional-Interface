import { validatePnc001QuestionPackage } from "./validator";
import { validatePnc001Cp006QuestionPackage } from "./validator-cp006";
import { validatePnc001DictionaryRankQuestionPackage } from "./validator-dictionary-rank";
import type { Pnc001QuestionPackage, Pnc001ValidationResult } from "./types";

export function validatePnc001RoutedQuestionPackage(pkg: Pnc001QuestionPackage): Pnc001ValidationResult {
  if (pkg.solveMode === "findDictionaryRankOfWord") return validatePnc001DictionaryRankQuestionPackage(pkg);
  return pkg.canonicalProblemId === "PNC-CP-006"
    ? validatePnc001Cp006QuestionPackage(pkg)
    : validatePnc001QuestionPackage(pkg);
}