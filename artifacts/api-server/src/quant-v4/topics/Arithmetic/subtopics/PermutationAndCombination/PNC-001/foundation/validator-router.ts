import { validatePnc001LatexContract } from "./latex-format";
import { validatePnc001QuestionPackage } from "./validator";
import { validatePnc001Cp006QuestionPackage } from "./validator-cp006";
import { validatePnc001DictionaryRankQuestionPackage } from "./validator-dictionary-rank";
import type { Pnc001QuestionPackage, Pnc001ValidationResult } from "./types";

export function validatePnc001RoutedQuestionPackage(pkg: Pnc001QuestionPackage): Pnc001ValidationResult {
  const baseValidation = String(pkg.solveMode) === "findDictionaryRankOfWord"
    ? validatePnc001DictionaryRankQuestionPackage(pkg)
    : pkg.canonicalProblemId === "PNC-CP-006"
      ? validatePnc001Cp006QuestionPackage(pkg)
      : validatePnc001QuestionPackage(pkg);
  const visiblePackage: Pnc001QuestionPackage = {
    ...pkg,
    reasoningEvidence: {
      ...pkg.reasoningEvidence,
      equations: [],
      decisiveCalculation: "",
      verification: "",
    },
  };
  const latexChecks = validatePnc001LatexContract(visiblePackage);
  return {
    valid: baseValidation.valid && latexChecks.every((entry) => entry.passed),
    checks: [...baseValidation.checks, ...latexChecks],
  };
}
