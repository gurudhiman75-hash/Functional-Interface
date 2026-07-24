import {
  getPnc001ConstraintProfile,
  getPnc001QuestionEntry,
  getPnc001VariableRanges,
} from "./library";
import { factorialExact, factorialQuotientExact } from "./math";
import type {
  Pnc001QuestionPackage,
  Pnc001ValidationCheck,
  Pnc001ValidationResult,
} from "./types";

function check(name: string, passed: boolean, message: string): Pnc001ValidationCheck {
  return { name, passed, message };
}

export function validatePnc001QuestionPackage(pkg: Pnc001QuestionPackage): Pnc001ValidationResult {
  const checks: Pnc001ValidationCheck[] = [];
  const entry = getPnc001QuestionEntry(pkg.questionLanguageId);
  const ranges = getPnc001VariableRanges();

  checks.push(check("package-id", pkg.packageId === "PNC-001" && pkg.archetypeId === "PNC-001", "Package and archetype IDs must be PNC-001"));
  checks.push(check("active-cp", pkg.canonicalProblemId === "PNC-CP-001", "Runtime proof currently exposes only PNC-CP-001"));
  checks.push(check("language", pkg.language === "en", "Runtime proof is English only"));
  checks.push(check("registry-cp", entry.cpId === pkg.canonicalProblemId, "QL and generated CP must agree"));
  checks.push(check("registry-mode", entry.solveMode === pkg.solveMode, "QL and generated solve mode must agree"));
  checks.push(check("registry-difficulty", entry.difficulty === pkg.difficultyBand, "QL and generated difficulty must agree"));
  checks.push(check("constraint-profile", Boolean(getPnc001ConstraintProfile(entry.constraintProfile)), "Constraint profile must exist"));

  const missingVariables = entry.requiredVariables.filter((key) => !Object.prototype.hasOwnProperty.call(pkg.parameters.renderVariables, key));
  checks.push(check("required-variables", missingVariables.length === 0, missingVariables.length ? `Missing: ${missingVariables.join(", ")}` : "All required variables are present"));

  const invalidValues = Object.entries(pkg.parameters.values).filter(([, value]) => !Number.isInteger(value) || value < 0);
  checks.push(check("integer-values", invalidValues.length === 0, invalidValues.length ? `Invalid values: ${invalidValues.map(([key]) => key).join(", ")}` : "All generated values are non-negative integers"));

  const answer = pkg.solver.numericAnswer;
  checks.push(check("positive-answer", Number.isInteger(answer) && answer >= ranges.generation.minimumAnswer, `Answer must be an integer at least ${ranges.generation.minimumAnswer}`));
  checks.push(check("answer-ceiling", answer <= ranges.answerCeiling, `Answer must not exceed ${ranges.answerCeiling}`));
  checks.push(check("answer-string", pkg.answer === String(answer) && pkg.solver.answer === pkg.answer, "Displayed answer must match solver numeric answer"));
  checks.push(check("independent-verification", pkg.independentVerification.supported && pkg.independentVerification.answer === answer, "Independent verifier must agree with solver"));

  checks.push(check("rendered-stem", !/\{[A-Za-z0-9_]+\}/.test(pkg.stem), "Stem must not contain unresolved placeholders"));
  checks.push(check("finite-stem", !/NaN|Infinity|undefined/.test(pkg.stem), "Stem must not contain invalid runtime values"));

  const uniqueOptions = new Set(pkg.options);
  checks.push(check("four-options", pkg.options.length === 4, "Exactly four options are required"));
  checks.push(check("unique-options", uniqueOptions.size === pkg.options.length, "Options must be unique"));
  checks.push(check("correct-index", pkg.correctIndex >= 0 && pkg.correctIndex < pkg.options.length, "Correct index must point to an option"));
  checks.push(check("correct-option", pkg.options[pkg.correctIndex] === pkg.answer, "Correct option must equal the solver answer"));
  checks.push(check("single-correct-option", pkg.options.filter((option) => option === pkg.answer).length === 1, "Correct answer must appear exactly once"));
  checks.push(check("positive-options", pkg.options.every((option) => Number.isInteger(Number(option)) && Number(option) > 0), "All count options must be positive integers"));

  const explanationText = pkg.explanation.lines.join(" ");
  checks.push(check("explanation-answer", explanationText.includes(pkg.answer), "Explanation must state the final answer"));
  checks.push(check("explanation-placeholders", !/\{[A-Za-z0-9_]+\}/.test(explanationText), "Explanation must not contain unresolved placeholders"));
  checks.push(check("reasoning-equation", pkg.reasoningEvidence.equations.includes(pkg.solver.equation), "Reasoning evidence must include the solver equation"));

  if (pkg.solveMode === "recoverMissingStageChoiceCount") {
    const total = pkg.parameters.values.totalChoices!;
    const known = pkg.parameters.values.knownChoices!;
    checks.push(check("exact-recovery", total % known === 0 && total / known === answer, "Recovery must use exact division"));
  }
  if (pkg.solveMode === "countUsingSimpleComplement") {
    const total = pkg.solver.evidence.totalCount!;
    const invalid = pkg.solver.evidence.invalidCount!;
    checks.push(check("valid-complement", invalid > 0 && invalid < total && total - invalid === answer, "Complement count must subtract a proper invalid subset"));
  }
  if (pkg.solveMode === "evaluateFactorialValue") {
    const argument = pkg.solver.evidence.factorialArgument!;
    checks.push(check("factorial-value", factorialExact(argument, ranges.answerCeiling) === answer, "Factorial answer must equal the exact factorial value"));
  }
  if (pkg.solveMode === "evaluateFactorialUnitExpression") {
    const base = pkg.solver.evidence.factorialValue!;
    const expected = pkg.solver.evidence.unitOperation === "ADD" ? base + 1 : base - 1;
    checks.push(check("factorial-unit-expression", expected === answer, "0! or 1! must contribute exactly one"));
  }
  if (pkg.solveMode === "simplifyFactorialQuotient") {
    const upper = pkg.solver.evidence.factorialUpper!;
    const lower = pkg.solver.evidence.factorialLower!;
    checks.push(check("factorial-quotient-order", upper >= lower, "Upper factorial argument must be at least the lower argument"));
    checks.push(check("factorial-quotient-value", factorialQuotientExact(upper, lower, ranges.answerCeiling) === answer, "Factorial quotient must match exact cancellation"));
  }
  if (pkg.solveMode === "recoverFactorialArgument") {
    const matched = pkg.solver.evidence.matchedFactorialArgument!;
    const shift = pkg.solver.evidence.displayedShift ?? 0;
    const target = pkg.solver.evidence.factorialTarget!;
    checks.push(check("factorial-inverse-target", factorialExact(matched, ranges.answerCeiling) === target, "Recovered factorial argument must recreate the target"));
    checks.push(check("factorial-inverse-shift", matched - shift === answer, "Displayed shift must be applied exactly once"));
  }
  if (pkg.solveMode === "recoverFactorialQuotientArgument") {
    const target = pkg.solver.evidence.factorialTarget!;
    checks.push(check("factorial-quotient-inverse", answer >= 2 && answer * (answer - 1) === target, "Recovered n must satisfy n(n - 1) = target"));
  }

  return { valid: checks.every((item) => item.passed), checks };
}