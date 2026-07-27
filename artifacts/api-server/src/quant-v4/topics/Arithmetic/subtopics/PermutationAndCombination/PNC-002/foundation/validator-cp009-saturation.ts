import {
  getPnc002ConstraintProfile,
  getPnc002QuestionEntry,
  getPnc002VariableRanges,
} from "./library";
import {
  countSpecifiedMemberRangeExact,
  countTwoCategoryRangeExact,
} from "./solver-cp009-saturation";
import type {
  Pnc002QuestionPackage,
  Pnc002ValidationCheck,
  Pnc002ValidationResult,
} from "./types";

function check(name: string, passed: boolean, message: string): Pnc002ValidationCheck {
  return { name, passed, message };
}
function numberValue(pkg: Pnc002QuestionPackage, key: string): number {
  const value = pkg.parameters.values[key];
  return typeof value === "number" ? value : Number.NaN;
}
const DELIMITED_MATH = /\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$\$[\s\S]*?\$\$|\$[^$\n]+?\$/g;
function stripDelimitedMath(value: string): string { return value.replace(DELIMITED_MATH, " "); }
function countToken(value: string, token: string): number { return value.split(token).length - 1; }
function latexBalanced(value: string): boolean {
  return countToken(value, "\\(") === countToken(value, "\\)")
    && countToken(value, "\\[") === countToken(value, "\\]");
}
function visibleFormulaIsFormatted(value: string): boolean {
  const plain = stripDelimitedMath(value);
  return !/\b\d+!/.test(plain) && !/[×÷≤≥]/.test(plain) && !/\b[nakrc]\s*=/.test(plain);
}

export function validatePnc002Cp009SaturationQuestionPackage(
  pkg: Pnc002QuestionPackage,
): Pnc002ValidationResult {
  const checks: Pnc002ValidationCheck[] = [];
  const entry = getPnc002QuestionEntry(pkg.questionLanguageId);
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const e = pkg.solver.evidence;
  const committeeSize = e.committeeSize ?? numberValue(pkg, "committeeSize");
  let expected = pkg.solver.numericAnswer;

  checks.push(check("package-id", pkg.packageId === "PNC-002" && pkg.archetypeId === "PNC-002", "Package IDs must be PNC-002"));
  checks.push(check("cp-id", pkg.canonicalProblemId === "PNC-CP-009", "Range validator accepts CP-009 only"));
  checks.push(check("language", pkg.language === "en", "Current CP-009 runtime is English only"));
  checks.push(check("registry-cp", entry.cpId === pkg.canonicalProblemId, "QL and CP must agree"));
  checks.push(check("registry-mode", entry.solveMode === pkg.solveMode, "QL and solve mode must agree"));
  checks.push(check("registry-task", entry.taskKind === "conditionalSelection" && pkg.taskKind === "conditionalSelection", "Range QLs must use conditionalSelection"));
  checks.push(check("registry-difficulty", entry.difficulty === pkg.difficultyBand, "QL and difficulty must agree"));
  checks.push(check("constraint-profile", Boolean(getPnc002ConstraintProfile(entry.constraintProfile)), "Constraint profile must exist"));
  checks.push(check("selection-domain", committeeSize > 0 && committeeSize <= e.totalObjects, "Committee size must fit the pool"));

  if (pkg.solveMode === "countSpecifiedMemberRange") {
    const counted = countSpecifiedMemberRangeExact(
      e.totalObjects,
      committeeSize,
      numberValue(pkg, "specifiedCount"),
      numberValue(pkg, "minimumSpecified"),
      numberValue(pkg, "maximumSpecified"),
      ceiling,
    );
    expected = counted.answer;
    checks.push(check("operation", e.operation === "SPECIFIED_MEMBER_RANGE", "Specified-range mode must expose its operation"));
    checks.push(check("range-order", numberValue(pkg, "minimumSpecified") <= numberValue(pkg, "maximumSpecified"), "Specified-member bounds must be ordered"));
    checks.push(check("accepted-counts", JSON.stringify(e.acceptedSelectionCounts ?? []) === JSON.stringify(counted.acceptedCounts), "Accepted specified counts must match the feasible interval"));
    checks.push(check("case-counts", JSON.stringify(e.selectionCaseCounts ?? []) === JSON.stringify(counted.caseCounts), "Specified-range case totals must be exact"));
  } else if (pkg.solveMode === "countTwoCategoryRange") {
    const counted = countTwoCategoryRangeExact(
      numberValue(pkg, "categoryA"),
      numberValue(pkg, "categoryB"),
      committeeSize,
      numberValue(pkg, "minimumFromA"),
      numberValue(pkg, "maximumFromA"),
      numberValue(pkg, "minimumFromB"),
      ceiling,
    );
    expected = counted.answer;
    checks.push(check("operation", e.operation === "TWO_CATEGORY_RANGE", "Category-range mode must expose its operation"));
    checks.push(check("range-order", numberValue(pkg, "minimumFromA") <= numberValue(pkg, "maximumFromA"), "Category-A bounds must be ordered"));
    checks.push(check("category-partition", (e.categorySizes ?? []).reduce((sum, value) => sum + value, 0) === e.totalObjects, "Category sizes must partition the pool"));
    checks.push(check("accepted-counts", JSON.stringify(e.acceptedSelectionCounts ?? []) === JSON.stringify(counted.acceptedCounts), "Accepted Category-A counts must match all simultaneous bounds"));
    checks.push(check("case-counts", JSON.stringify(e.selectionCaseCounts ?? []) === JSON.stringify(counted.caseCounts), "Category-range case totals must be exact"));
  } else {
    checks.push(check("range-mode", false, `Unexpected range mode ${pkg.solveMode}`));
  }

  checks.push(check("solver-answer", expected === pkg.solver.numericAnswer, "Solver answer must equal the exact range sum"));
  checks.push(check("answer-string", pkg.answer === String(pkg.solver.numericAnswer), "Displayed answer must match solver"));
  checks.push(check("positive-answer", Number.isInteger(pkg.solver.numericAnswer) && pkg.solver.numericAnswer > 0, "Answer must be a positive integer"));
  checks.push(check("answer-ceiling", pkg.solver.numericAnswer <= ceiling, "Answer must remain under the configured ceiling"));
  checks.push(check("independent-verification", pkg.independentVerification.supported && pkg.independentVerification.answer === pkg.solver.numericAnswer, "Independent subset enumeration must agree"));
  checks.push(check("four-options", pkg.options.length === 4, "Exactly four options are required"));
  checks.push(check("unique-options", new Set(pkg.options).size === 4, "Options must be unique"));
  checks.push(check("positive-options", pkg.options.every((option) => Number.isInteger(Number(option)) && Number(option) > 0), "Options must be positive integers"));
  checks.push(check("correct-index", pkg.options[pkg.correctIndex] === pkg.answer, "Correct index must point to the answer"));

  const explanationText = pkg.explanation.lines.join(" ");
  checks.push(check("stem-placeholders", !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(pkg.stem), "Stem must resolve placeholders"));
  checks.push(check("explanation-lines", pkg.explanation.lines.length >= 3, "Explanation must have at least three lines"));
  checks.push(check("explanation-answer", explanationText.includes(pkg.answer), "Explanation must state the answer"));
  checks.push(check("explanation-placeholders", !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(explanationText), "Explanation must resolve placeholders"));
  checks.push(check("reasoning-equation", pkg.reasoningEvidence.equations.includes(`\\(${pkg.solver.mathJax}\\)`), "Reasoning must use solver-owned TeX"));
  const visible = [pkg.stem, ...pkg.options, ...pkg.explanation.lines, ...pkg.reasoningEvidence.equations, pkg.reasoningEvidence.decisiveCalculation];
  checks.push(check("latex-balanced", visible.every(latexBalanced), "Visible LaTeX delimiters must be balanced"));
  checks.push(check("latex-no-raw-formulas", visible.every(visibleFormulaIsFormatted), "Visible formulas must be math-delimited"));
  checks.push(check("not-public", pkg.publiclyPublishable === false, "Runtime proof must remain unpublished"));

  return { valid: checks.every((item) => item.passed), checks };
}
