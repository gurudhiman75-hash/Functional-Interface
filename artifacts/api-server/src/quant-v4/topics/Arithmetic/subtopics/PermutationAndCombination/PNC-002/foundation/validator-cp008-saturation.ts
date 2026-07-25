import {
  getPnc002ConstraintProfile,
  getPnc002QuestionEntry,
  getPnc002VariableRanges,
} from "./library";
import { factorialExact } from "./math";
import {
  countAtLeastSpecifiedObjectsInPositionClassExact,
  countAtMostGapBetweenPairExact,
  countDirectionalExactGapBetweenPairExact,
  countObjectsAtPrescribedPositionsExact,
  countSpecifiedSetInPositionSetExact,
} from "./solver-cp008-saturation";
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
  return !/\b\d+!/.test(plain) && !/[×÷≤≥]/.test(plain) && !/\b[dnkr]\s*=/.test(plain);
}
function valuesAreValid(pkg: Pnc002QuestionPackage): boolean {
  return Object.values(pkg.parameters.values).every((value) =>
    typeof value === "number"
      ? Number.isInteger(value) && value >= 0
      : Array.isArray(value) && value.every((item) => Number.isInteger(item) && item >= 1),
  );
}

export function validatePnc002Cp008SaturationQuestionPackage(
  pkg: Pnc002QuestionPackage,
): Pnc002ValidationResult {
  const checks: Pnc002ValidationCheck[] = [];
  const entry = getPnc002QuestionEntry(pkg.questionLanguageId);
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const e = pkg.solver.evidence;

  checks.push(check("package-id", pkg.packageId === "PNC-002" && pkg.archetypeId === "PNC-002", "Package IDs must be PNC-002"));
  checks.push(check("cp-id", pkg.canonicalProblemId === "PNC-CP-008", "Saturation validator accepts CP-008 only"));
  checks.push(check("language", pkg.language === "en", "Current CP-008 runtime is English only"));
  checks.push(check("registry-cp", entry.cpId === pkg.canonicalProblemId, "QL and CP must agree"));
  checks.push(check("registry-mode", entry.solveMode === pkg.solveMode, "QL and solve mode must agree"));
  checks.push(check("registry-task", entry.taskKind === pkg.taskKind && pkg.taskKind === "linearPositionGapRestriction", "CP-008 must use its position-gap task kind"));
  checks.push(check("registry-difficulty", entry.difficulty === pkg.difficultyBand, "QL and difficulty must agree"));
  checks.push(check("constraint-profile", Boolean(getPnc002ConstraintProfile(entry.constraintProfile)), "Constraint profile must exist"));
  checks.push(check("generated-values", valuesAreValid(pkg), "Generated values must be finite non-negative integers or integer arrays"));

  let expected = pkg.solver.numericAnswer;
  switch (pkg.solveMode) {
    case "countObjectsAtPrescribedPositions": {
      const prescribedObjectCount = numberValue(pkg, "prescribedObjectCount");
      expected = countObjectsAtPrescribedPositionsExact(e.totalObjects, prescribedObjectCount, ceiling);
      checks.push(check("operation", e.operation === "OBJECTS_AT_PRESCRIBED_POSITIONS", "Prescribed-position mode must expose its operation"));
      checks.push(check("prescribed-count", prescribedObjectCount === 3, "Current QL fixes three named objects"));
      checks.push(check("remaining-partition", e.remainingObjects === e.totalObjects - prescribedObjectCount, "Remaining objects must fill exactly the unprescribed positions"));
      break;
    }
    case "countSpecifiedSetInPositionSet": {
      const prescribedObjectCount = numberValue(pkg, "prescribedObjectCount");
      expected = countSpecifiedSetInPositionSetExact(e.totalObjects, prescribedObjectCount, ceiling);
      checks.push(check("operation", e.operation === "SPECIFIED_SET_IN_POSITION_SET", "Position-set mode must expose its operation"));
      checks.push(check("position-set-assignments", e.positionSetAssignmentCount === factorialExact(prescribedObjectCount, ceiling), "Specified objects must permute across the named positions"));
      checks.push(check("remaining-partition", e.remainingObjects === e.totalObjects - prescribedObjectCount, "Ordinary objects must fill the remaining positions"));
      break;
    }
    case "countAtMostGapBetweenPair": {
      const maximumGap = numberValue(pkg, "maximumGap");
      expected = countAtMostGapBetweenPairExact(e.totalObjects, maximumGap, ceiling);
      checks.push(check("operation", e.operation === "AT_MOST_GAP_BETWEEN_PAIR", "At-most-gap mode must expose its operation"));
      checks.push(check("ordered-position-pairs", e.orderedPositionPairCount === (maximumGap + 1) * (2 * e.totalObjects - maximumGap - 2), "At-most gap must sum every accepted separation"));
      checks.push(check("maximum-gap-domain", maximumGap >= 0 && maximumGap <= e.totalObjects - 2, "Maximum gap must fit in the row"));
      break;
    }
    case "countDirectionalExactGapBetweenPair": {
      const gapCount = numberValue(pkg, "gapCount");
      expected = countDirectionalExactGapBetweenPairExact(e.totalObjects, gapCount, ceiling);
      checks.push(check("operation", e.operation === "DIRECTIONAL_EXACT_GAP", "Directional-gap mode must expose its operation"));
      checks.push(check("directional-position-pairs", e.directionalPositionPairCount === e.totalObjects - gapCount - 1, "A-before-B removes the reverse orientation"));
      checks.push(check("gap-domain", gapCount >= 0 && gapCount <= e.totalObjects - 2, "Exact gap must fit in the row"));
      break;
    }
    case "countAtLeastSpecifiedObjectsInPositionClass": {
      const specifiedCount = numberValue(pkg, "specifiedCount");
      const minimumInClass = numberValue(pkg, "minimumInClass");
      const eligibleClassPositions = numberValue(pkg, "eligibleClassPositions");
      const counted = countAtLeastSpecifiedObjectsInPositionClassExact(
        e.totalObjects,
        specifiedCount,
        minimumInClass,
        eligibleClassPositions,
        ceiling,
      );
      expected = counted.answer;
      checks.push(check("operation", e.operation === "AT_LEAST_SPECIFIED_IN_POSITION_CLASS", "At-least position-class mode must expose its operation"));
      checks.push(check("position-partition", eligibleClassPositions + (e.ineligibleClassPositions ?? 0) === e.totalObjects, "Odd and even positions must partition the row"));
      checks.push(check("accepted-cases", JSON.stringify(e.acceptedClassCounts ?? []) === JSON.stringify(counted.acceptedClassCounts), "Accepted class counts must match the feasible at-least cases"));
      checks.push(check("case-counts", JSON.stringify(e.positionClassCaseCounts ?? []) === JSON.stringify(counted.caseCounts), "Case totals must be solver-owned and exact"));
      checks.push(check("minimum-domain", minimumInClass >= 0 && minimumInClass <= specifiedCount, "Minimum class count cannot exceed the specified set"));
      break;
    }
    default:
      checks.push(check("cp008-saturation-mode", false, `Unexpected CP-008 saturation mode ${pkg.solveMode}`));
  }

  checks.push(check("solver-answer", expected === pkg.solver.numericAnswer, "Solver answer must satisfy its exact mode formula"));
  checks.push(check("answer-string", pkg.answer === String(pkg.solver.numericAnswer) && pkg.solver.answer === pkg.answer, "Displayed answer must match solver"));
  checks.push(check("positive-answer", Number.isInteger(pkg.solver.numericAnswer) && pkg.solver.numericAnswer > 0, "Answer must be a positive integer"));
  checks.push(check("answer-ceiling", pkg.solver.numericAnswer <= ceiling, "Answer must remain within the configured ceiling"));
  checks.push(check("independent-verification", pkg.independentVerification.supported && pkg.independentVerification.answer === pkg.solver.numericAnswer, "Independent permutation enumeration must agree"));
  checks.push(check("four-options", pkg.options.length === 4, "Exactly four options are required"));
  checks.push(check("unique-options", new Set(pkg.options).size === 4, "Options must be unique"));
  checks.push(check("positive-options", pkg.options.every((option) => Number.isInteger(Number(option)) && Number(option) > 0), "Options must be positive integers"));
  checks.push(check("correct-index", pkg.options[pkg.correctIndex] === pkg.answer, "Correct index must point to answer"));
  checks.push(check("single-correct-option", pkg.options.filter((option) => option === pkg.answer).length === 1, "Answer must occur exactly once"));

  const explanationText = pkg.explanation.lines.join(" ");
  checks.push(check("stem-placeholders", !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(pkg.stem), "Stem must resolve placeholders"));
  checks.push(check("explanation-lines", pkg.explanation.lines.length >= 3, "Explanation must have at least three lines"));
  checks.push(check("explanation-answer", explanationText.includes(pkg.answer), "Explanation must state the answer"));
  checks.push(check("explanation-placeholders", !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(explanationText), "Explanation must resolve placeholders"));
  checks.push(check("reasoning-equation", pkg.reasoningEvidence.equations.includes(`\\(${pkg.solver.mathJax}\\)`), "Reasoning must use solver-owned TeX"));
  const visible = [pkg.stem, ...pkg.options, ...pkg.explanation.lines, ...pkg.reasoningEvidence.equations, pkg.reasoningEvidence.decisiveCalculation];
  checks.push(check("latex-balanced", visible.every(latexBalanced), "Visible LaTeX delimiters must be balanced"));
  checks.push(check("latex-no-raw-formulas", visible.every(visibleFormulaIsFormatted), "Visible mathematical expressions must be delimited"));
  const solverHasDelimiters = ["$", "\\(", "\\)", "\\[", "\\]"].some((token) => pkg.solver.mathJax.includes(token));
  checks.push(check("latex-solver-source", Boolean(pkg.solver.mathJax.trim()) && !solverHasDelimiters, "Solver must expose delimiter-free TeX"));
  checks.push(check("not-public", pkg.publiclyPublishable === false, "Runtime proof must remain unpublished"));

  return { valid: checks.every((item) => item.passed), checks };
}
