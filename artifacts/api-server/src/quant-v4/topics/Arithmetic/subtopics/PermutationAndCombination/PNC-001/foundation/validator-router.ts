import { validatePnc001QuestionPackage } from "./validator";
import { validatePnc001Cp006QuestionPackage } from "./validator-cp006";
import type { Pnc001QuestionPackage, Pnc001ValidationResult } from "./types";

export function validatePnc001RoutedQuestionPackage(pkg: Pnc001QuestionPackage): Pnc001ValidationResult {
  return pkg.canonicalProblemId === "PNC-CP-006"
    ? validatePnc001Cp006QuestionPackage(pkg)
    : validatePnc001QuestionPackage(pkg);
}
