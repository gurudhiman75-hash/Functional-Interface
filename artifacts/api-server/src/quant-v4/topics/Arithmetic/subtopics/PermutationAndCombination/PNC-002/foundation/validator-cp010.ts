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
function latexCommandsWellFormed(value: string): boolean {
  return !/[\u0000-\u001F\u007F]/.test(value)
    && !/(^|[^\\])left\s*[([{]/.test(value)
    && !/(^|[^\\])right\s*[)\]}]/.test(value)
    && countToken(value, "\\left") === countToken(value, "\\right");
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
  "CIRCULAR_EXACTLY_ONE_PAIR",
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
  "CIRCULAR_SELECTION_ROTATION_ONLY",
  "CIRCULAR_SELECTION_DIHEDRAL",
  "CIRCULAR_DISTINCT_NEIGHBOR_SETS",
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
  if (
    pkg.solveMode === "countDihedralDistinctOrnaments"
    || pkg.solveMode === "countDihedralPairTogether"
    || pkg.solveMode === "countCircularSelectionDihedral"
    || pkg.solveMode === "countCircularDistinctNeighborSets"
  ) {
    checks.push(check("reflection-contract", e.reflectionSymmetryDivisor === 2, "Reflection-equivalent modes must record divisor two"));
  }
  if (pkg.solveMode === "countRotationOnlyOrnaments" || pkg.solveMode === "countCircularSelectionRotationOnly") {
    checks.push(check("rotation-only-contract", e.reflectionSymmetryDivisor === 1, "Rotation-only modes must not divide by reflection"));
  }
  if (pkg.solveMode === "countCircularNoTwoCategoryAdjacent") {
    checks.push(check("gap-capacity", (e.smallCount ?? 0) <= (e.largeCount ?? 0), "Separated circular members cannot exceed available gaps"));
  }
  if (pkg.solveMode === "countCircularExactlyOnePairTogether") {
    checks.push(check(
      "exclusive-pair-contract",
      e.operation === "CIRCULAR_EXACTLY_ONE_PAIR"
        && e.blockSizes.length === 2
        && e.blockSizes.every((size) => size === 2)
        && (e.primaryRestrictionCount ?? 0) > (e.allSpecifiedBlocksTogetherCount ?? 0)
        && (e.allSpecifiedBlocksTogetherCount ?? 0) > 0,
      "Exactly-one-pair mode must expose two disjoint pair blocks and both one-pair and overlap counts",
    ));
  }
  if (pkg.solveMode === "countCircularSelectionRotationOnly" || pkg.solveMode === "countCircularSelectionDihedral") {
    checks.push(check(
      "circular-selection-contract",
      (e.selectedObjectCount ?? 0) >= 3
        && (e.selectedObjectCount ?? 0) < e.totalObjects
        && (e.selectionCount ?? 0) > 0
        && (e.selectedCircularArrangementCount ?? 0) > 0
        && e.rotationalSymmetryDivisor === e.selectedObjectCount,
      "Circular subset modes must expose a proper selected subset, selection count and selected-cycle count",
    ));
  }
  if (pkg.solveMode === "countCircularDistinctNeighborSets") {
    checks.push(check(
      "neighbor-set-contract",
      e.operation === "CIRCULAR_DISTINCT_NEIGHBOR_SETS"
        && e.reflectionSymmetryDivisor === 2
        && e.rotationalSymmetryDivisor === e.totalObjects,
      "Neighbour-set equivalence must remove rotation and merge reversed cycles",
    ));
  }

  const explanationText = pkg.explanation.lines.join(" ");
  checks.push(check("stem-placeholders", !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(pkg.stem), "Stem must resolve placeholders"));
  checks.push(check("explanation-lines", pkg.explanation.lines.length >= 3, "Explanation must have at least three lines"));
  checks.push(check("explanation-answer", explanationText.includes(pkg.answer), "Explanation must state the answer"));
  checks.push(check("explanation-placeholders", !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(explanationText), "Explanation must resolve placeholders"));
  checks.push(check("reasoning-equation", pkg.reasoningEvidence.equations.includes(`\\(${pkg.solver.mathJax}\\)`), "Reasoning must use solver-owned TeX"));
  const visible = [pkg.stem, ...pkg.options, ...pkg.explanation.lines, ...pkg.reasoningEvidence.equations, pkg.reasoningEvidence.decisiveCalculation];
  const malformedLatexCommands = visible.filter((value) => !latexCommandsWellFormed(value));
  const rawFormulaFailures = visible.filter((value) => !visibleFormulaIsFormatted(value));
  checks.push(check("latex-balanced", visible.every(latexBalanced), "Visible LaTeX delimiters must be balanced"));
  checks.push(check("latex-commands", malformedLatexCommands.length === 0, `Visible TeX commands must be escaped, paired and free of control characters: ${JSON.stringify(malformedLatexCommands)}`));
  checks.push(check("latex-no-raw-formulas", rawFormulaFailures.length === 0, `Visible formulas must be math-delimited: ${JSON.stringify(rawFormulaFailures)}`));
  checks.push(check("not-public", pkg.publiclyPublishable === false, "Runtime proof must remain unpublished"));

  return { valid: checks.every((item) => item.passed), checks };
}
