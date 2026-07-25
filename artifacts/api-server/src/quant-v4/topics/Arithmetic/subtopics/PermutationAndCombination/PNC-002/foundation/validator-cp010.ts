import {
  getPnc002ConstraintProfile,
  getPnc002QuestionEntry,
  getPnc002VariableRanges,
} from "./library";
import type {
  Pnc002QuestionPackage,
  Pnc002SolverEvidence,
  Pnc002ValidationCheck,
  Pnc002ValidationResult,
} from "./types";

function check(name: string, passed: boolean, message: string): Pnc002ValidationCheck {
  return { name, passed, message };
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

const CP010_OPERATIONS = new Set<Pnc002SolverEvidence["operation"]>([
  "ROUND_TABLE_DISTINCT",
  "CIRCULAR_BLOCK_TOGETHER",
  "CIRCULAR_BLOCK_APART",
  "CIRCULAR_MULTIPLE_BLOCKS",
  "CIRCULAR_BLOCK_WITH_EXTERNAL_PAIR_APART",
  "CIRCULAR_TWO_BLOCKS_NOT_ADJACENT",
  "CIRCULAR_AT_LEAST_ONE_PAIR",
  "CIRCULAR_NEITHER_PAIR",
  "CIRCULAR_PERSON_BETWEEN_NEIGHBORS",
  "CIRCULAR_OPPOSITE_PAIR",
  "CLOCKWISE_ADJACENT_PAIR",
  "CLOCKWISE_EXACT_GAP",
  "CLOCKWISE_AT_LEAST_GAP",
  "CLOCKWISE_AT_MOST_GAP",
  "PRESCRIBED_CLOCKWISE_ORDER",
  "CIRCULAR_ALTERNATION",
  "CIRCULAR_NO_TWO_CATEGORY_ADJACENT",
  "CIRCULAR_INVERSE",
  "ROTATION_ONLY_ORNAMENTS",
  "DIHEDRAL_DISTINCT_ORNAMENTS",
  "DIHEDRAL_PAIR_TOGETHER",
]);

export function validatePnc002Cp010QuestionPackage(
  pkg: Pnc002QuestionPackage,
): Pnc002ValidationResult {
  const checks: Pnc002ValidationCheck[] = [];
  const entry = getPnc002QuestionEntry(pkg.questionLanguageId);
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const e = pkg.solver.evidence;

  checks.push(check("package-id", pkg.packageId === "PNC-002" && pkg.archetypeId === "PNC-002", "Package IDs must be PNC-002"));
  checks.push(check("cp-id", pkg.canonicalProblemId === "PNC-CP-010", "Circular validator accepts CP-010 only"));
  checks.push(check("language", pkg.language === "en", "Current CP-010 runtime is English only"));
  checks.push(check("registry-cp", entry.cpId === pkg.canonicalProblemId, "QL and CP must agree"));
  checks.push(check("registry-mode", entry.solveMode === pkg.solveMode, "QL and solve mode must agree"));
  checks.push(check("registry-task", entry.taskKind === "circularArrangement" && pkg.taskKind === "circularArrangement", "CP-010 QLs must use circularArrangement"));
  checks.push(check("registry-difficulty", entry.difficulty === pkg.difficultyBand, "QL and difficulty must agree"));
  checks.push(check("constraint-profile", Boolean(getPnc002ConstraintProfile(entry.constraintProfile)), "Constraint profile must exist"));
  checks.push(check("circular-domain", e.totalObjects >= 3, "Circular systems require at least three objects"));
  checks.push(check("operation", CP010_OPERATIONS.has(e.operation), "CP-010 must expose an approved circular evidence operation"));
  checks.push(check("solver-answer", Number.isInteger(pkg.solver.numericAnswer) && pkg.solver.numericAnswer > 0, "Solver answer must be a positive integer"));
  checks.push(check("answer-string", pkg.answer === String(pkg.solver.numericAnswer), "Displayed answer must match solver"));
  checks.push(check("answer-ceiling", pkg.solver.numericAnswer <= ceiling, "Answer must remain under the configured ceiling"));
  checks.push(check("independent-verification", pkg.independentVerification.supported && pkg.independentVerification.answer === pkg.solver.numericAnswer, "Independent circular enumeration must agree"));
  checks.push(check("four-options", pkg.options.length === 4, "Exactly four options are required"));
  checks.push(check("unique-options", new Set(pkg.options).size === 4, "Options must be unique"));
  checks.push(check("positive-options", pkg.options.every((option) => Number.isInteger(Number(option)) && Number(option) > 0), "Options must be positive integers"));
  checks.push(check("correct-index", pkg.options[pkg.correctIndex] === pkg.answer, "Correct index must point to the answer"));

  if (pkg.solveMode === "countOppositePair") {
    checks.push(check("opposite-even", e.totalObjects % 2 === 0 && e.oppositeSeatOffset === e.totalObjects / 2, "Opposite-seat mode requires an even table"));
  }
  if (pkg.solveMode === "countDihedralDistinctOrnaments" || pkg.solveMode === "countDihedralPairTogether") {
    checks.push(check("reflection-contract", e.reflectionSymmetryDivisor === 2, "Dihedral modes must record reflection equivalence"));
  }
  if (pkg.solveMode === "countRotationOnlyOrnaments") {
    checks.push(check("rotation-only-contract", e.reflectionSymmetryDivisor === 1, "Rotation-only ornaments must not divide by reflection"));
  }
  if (pkg.solveMode === "countCircularNoTwoCategoryAdjacent") {
    checks.push(check("gap-capacity", (e.smallCount ?? 0) <= (e.largeCount ?? 0), "Separated circular members cannot exceed available gaps"));
  }

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
