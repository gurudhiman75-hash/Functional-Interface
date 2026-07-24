import { getPnc001ConstraintProfile, getPnc001QuestionEntry, getPnc001VariableRanges } from "./library";
import { combinationExact, factorialExact, permutationExact, productExact } from "./math";
import type { Pnc001Cp006SolveMode, Pnc001QuestionPackage, Pnc001ValidationCheck, Pnc001ValidationResult } from "./types";

function check(name: string, passed: boolean, message: string): Pnc001ValidationCheck { return { name, passed, message }; }
function mixedCount(n: number, s: number, k: number, ceiling: number): number {
  return productExact([combinationExact(n, s, ceiling), permutationExact(s, k, ceiling)], ceiling);
}

export function validatePnc001Cp006QuestionPackage(pkg: Pnc001QuestionPackage): Pnc001ValidationResult {
  const checks: Pnc001ValidationCheck[] = [];
  const entry = getPnc001QuestionEntry(pkg.questionLanguageId);
  const ranges = getPnc001VariableRanges();
  const answer = pkg.solver.numericAnswer;
  const evidence = pkg.solver.evidence;
  const mode = pkg.solveMode as unknown as Pnc001Cp006SolveMode;

  checks.push(check("package-id", pkg.packageId === "PNC-001" && pkg.archetypeId === "PNC-001", "Package IDs must be PNC-001"));
  checks.push(check("cp-id", pkg.canonicalProblemId === "PNC-CP-006", "CP-006 validator only accepts PNC-CP-006"));
  checks.push(check("language", pkg.language === "en", "Runtime proof is English only"));
  checks.push(check("registry-cp", entry.cpId === pkg.canonicalProblemId, "QL and CP must agree"));
  checks.push(check("registry-mode", String(entry.solveMode) === mode, "QL and CP-006 mode must agree"));
  checks.push(check("registry-task-kind", String(entry.taskKind) === "selectionRoleAssignment", "CP-006 task kind must be selectionRoleAssignment"));
  checks.push(check("registry-difficulty", entry.difficulty === pkg.difficultyBand, "QL and difficulty must agree"));
  checks.push(check("constraint-profile", Boolean(getPnc001ConstraintProfile(entry.constraintProfile)), "Constraint profile must exist"));
  const missing = entry.requiredVariables.filter((key) => !Object.prototype.hasOwnProperty.call(pkg.parameters.renderVariables, key));
  checks.push(check("required-variables", missing.length === 0, missing.length ? `Missing: ${missing.join(", ")}` : "All required variables present"));
  checks.push(check("integer-values", Object.values(pkg.parameters.values).every((value) => Number.isInteger(value) && value >= 0), "All generated values must be non-negative integers"));
  checks.push(check("positive-answer", Number.isInteger(answer) && answer >= ranges.generation.minimumAnswer, "Answer must be a positive integer"));
  checks.push(check("answer-ceiling", answer <= ranges.answerCeiling, "Answer must remain under ceiling"));
  checks.push(check("answer-string", pkg.answer === String(answer) && pkg.solver.answer === pkg.answer, "Displayed answer must match solver"));
  checks.push(check("independent-verification", pkg.independentVerification.supported && pkg.independentVerification.answer === answer, "Independent verifier must agree"));
  checks.push(check("rendered-stem", !/\{[A-Za-z0-9_]+\}/.test(pkg.stem), "Stem must resolve placeholders"));
  checks.push(check("finite-stem", !/NaN|Infinity|undefined/.test(pkg.stem), "Stem must contain finite values"));
  checks.push(check("four-options", pkg.options.length === 4, "Exactly four options required"));
  checks.push(check("unique-options", new Set(pkg.options).size === 4, "Options must be unique"));
  checks.push(check("correct-option", pkg.options[pkg.correctIndex] === pkg.answer, "Correct index must point to answer"));
  checks.push(check("single-correct-option", pkg.options.filter((option) => option === pkg.answer).length === 1, "Answer must appear once"));
  checks.push(check("positive-options", pkg.options.every((option) => Number.isInteger(Number(option)) && Number(option) > 0), "Options must be positive integers"));
  const explanationText = pkg.explanation.lines.join(" ");
  checks.push(check("explanation-answer", explanationText.includes(pkg.answer), "Explanation must state answer"));
  checks.push(check("explanation-placeholders", !/\{[A-Za-z0-9_]+\}/.test(explanationText), "Explanation must resolve placeholders"));
  checks.push(check("reasoning-equation", pkg.reasoningEvidence.equations.includes(pkg.solver.equation), "Reasoning must include solver equation"));

  const n = evidence.mixedTotalObjects;
  const s = evidence.mixedSelectedObjects;
  const k = evidence.mixedRoleCount;
  if (mode === "selectThenAssignDistinctRoles") {
    checks.push(check("mixed-domain", n !== undefined && s !== undefined && k !== undefined && n > s && s > k && k >= 1, "Direct mixed count requires 1 ≤ k < s < n"));
    if (n !== undefined && s !== undefined && k !== undefined) {
      const selection = combinationExact(n, s, ranges.answerCeiling);
      const roles = permutationExact(s, k, ranges.answerCeiling);
      checks.push(check("mixed-selection-count", evidence.mixedSelectionCount === selection, "Selection evidence must equal nCs"));
      checks.push(check("mixed-role-count", evidence.mixedRoleAssignmentCount === roles, "Role evidence must equal sPk"));
      checks.push(check("mixed-direct-value", productExact([selection, roles], ranges.answerCeiling) === answer, "Mixed answer must multiply selection and role stages"));
    }
  }
  if (mode === "selectThenArrangeAllSelected") {
    checks.push(check("mixed-all-domain", n !== undefined && s !== undefined && n > s && s >= 1 && k === s, "Arrange-all requires k = s < n"));
    if (n !== undefined && s !== undefined) {
      const selection = combinationExact(n, s, ranges.answerCeiling);
      const arrangements = factorialExact(s, ranges.answerCeiling);
      const equivalent = permutationExact(n, s, ranges.answerCeiling);
      checks.push(check("mixed-all-selection", evidence.mixedSelectionCount === selection, "Selection evidence must equal nCs"));
      checks.push(check("mixed-all-arrangements", evidence.mixedRoleAssignmentCount === arrangements, "Full arrangement stage must equal s!"));
      checks.push(check("mixed-all-identity", answer === equivalent && evidence.mixedEquivalentPermutationCount === equivalent, "nCs × s! must equal nPs"));
    }
  }
  if (mode === "findRoleAssignmentMultiplier") {
    checks.push(check("mixed-multiplier-domain", s !== undefined && k !== undefined && s >= k && k >= 1, "Role multiplier requires 1 ≤ k ≤ s"));
    if (s !== undefined && k !== undefined) checks.push(check("mixed-multiplier-value", answer === permutationExact(s, k, ranges.answerCeiling), "Multiplier must equal sPk"));
  }
  if (mode === "recoverSelectionRoleParameter") {
    checks.push(check("mixed-inverse-evidence", n !== undefined && s !== undefined && k !== undefined && evidence.mixedTarget !== undefined && evidence.recoveredMixedParameter !== undefined, "Inverse evidence must identify the matched mixed state"));
    if (n !== undefined && s !== undefined && k !== undefined && evidence.mixedTarget !== undefined) {
      checks.push(check("mixed-inverse-target", mixedCount(n, s, k, ranges.answerCeiling) === evidence.mixedTarget, "Recovered mixed state must recreate target"));
      const minimum = evidence.mixedSearchMinimum ?? 0;
      const maximum = evidence.mixedSearchMaximum ?? -1;
      const matches: number[] = [];
      if (evidence.recoveredMixedParameter === "n") for (let candidate = minimum; candidate <= maximum; candidate += 1) if (mixedCount(candidate, s, k, ranges.answerCeiling) === evidence.mixedTarget) matches.push(candidate);
      if (evidence.recoveredMixedParameter === "selected") for (let candidate = minimum; candidate <= maximum; candidate += 1) if (mixedCount(n, candidate, k, ranges.answerCeiling) === evidence.mixedTarget) matches.push(candidate);
      if (evidence.recoveredMixedParameter === "roles") for (let candidate = minimum; candidate <= maximum; candidate += 1) if (mixedCount(n, s, candidate, ranges.answerCeiling) === evidence.mixedTarget) matches.push(candidate);
      checks.push(check("mixed-inverse-unique", matches.length === 1 && matches[0] === answer, "Inverse domain must contain exactly one matching answer"));
    }
  }
  return { valid: checks.every((item) => item.passed), checks };
}
