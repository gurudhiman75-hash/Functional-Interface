import {
  getPnc002ConstraintProfile,
  getPnc002QuestionEntry,
  getPnc002VariableRanges,
} from "./library";
import {
  countAtLeastGapBetweenPairExact,
  countExactGapBetweenPairExact,
  countIndependentRelativeOrderChainsExact,
  countNoTwoCategoryMembersAdjacentExact,
  countObjectAtEitherEndExact,
  countObjectAtExactPositionExact,
  countObjectExcludedFromEndsExact,
  countPrescribedRelativeOrderExact,
  countSpecifiedObjectsAtBothEndsExact,
  countSpecifiedObjectsInPositionClassExact,
  countStrictAlternationExact,
} from "./solver-cp008";
import type {
  Pnc002QuestionPackage,
  Pnc002ValidationCheck,
  Pnc002ValidationResult,
} from "./types";

function check(name: string, passed: boolean, message: string): Pnc002ValidationCheck { return { name, passed, message }; }
function numberValue(pkg: Pnc002QuestionPackage, key: string): number {
  const value = pkg.parameters.values[key];
  return typeof value === "number" ? value : Number.NaN;
}
function numberArrayValue(pkg: Pnc002QuestionPackage, key: string): number[] {
  const value = pkg.parameters.values[key];
  return Array.isArray(value) ? value : [];
}
const DELIMITED_MATH = /\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$\$[\s\S]*?\$\$|\$[^$\n]+?\$/g;
function stripDelimitedMath(value: string): string { return value.replace(DELIMITED_MATH, " "); }
function countToken(value: string, token: string): number { return value.split(token).length - 1; }
function latexBalanced(value: string): boolean {
  return countToken(value, "\\(") === countToken(value, "\\)") && countToken(value, "\\[") === countToken(value, "\\]");
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

export function validatePnc002Cp008QuestionPackage(pkg: Pnc002QuestionPackage): Pnc002ValidationResult {
  const checks: Pnc002ValidationCheck[] = [];
  const entry = getPnc002QuestionEntry(pkg.questionLanguageId);
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const e = pkg.solver.evidence;
  checks.push(check("package-id", pkg.packageId === "PNC-002" && pkg.archetypeId === "PNC-002", "Package IDs must be PNC-002"));
  checks.push(check("cp-id", pkg.canonicalProblemId === "PNC-CP-008", "CP-008 validator accepts CP-008 only"));
  checks.push(check("language", pkg.language === "en", "Current CP-008 runtime is English only"));
  checks.push(check("registry-cp", entry.cpId === pkg.canonicalProblemId, "QL and CP must agree"));
  checks.push(check("registry-mode", entry.solveMode === pkg.solveMode, "QL and solve mode must agree"));
  checks.push(check("registry-task", entry.taskKind === pkg.taskKind && pkg.taskKind === "linearPositionGapRestriction", "CP-008 must use its position-gap task kind"));
  checks.push(check("registry-difficulty", entry.difficulty === pkg.difficultyBand, "QL and difficulty must agree"));
  checks.push(check("constraint-profile", Boolean(getPnc002ConstraintProfile(entry.constraintProfile)), "Constraint profile must exist"));
  checks.push(check("generated-values", valuesAreValid(pkg), "Generated values must be finite non-negative integers or integer arrays"));

  let expected = pkg.solver.numericAnswer;
  switch (pkg.solveMode) {
    case "countObjectAtExactPosition":
      expected = countObjectAtExactPositionExact(e.totalObjects, ceiling);
      checks.push(check("operation", e.operation === "OBJECT_AT_EXACT_POSITION", "Exact-position mode must expose its operation"));
      checks.push(check("fixed-position-domain", (e.fixedPosition ?? 0) >= 1 && (e.fixedPosition ?? 0) <= e.totalObjects, "Fixed position must lie in the row"));
      break;
    case "countObjectAtEitherEnd":
      expected = countObjectAtEitherEndExact(e.totalObjects, ceiling);
      checks.push(check("operation", e.operation === "OBJECT_AT_EITHER_END", "Either-end mode must expose its operation"));
      checks.push(check("two-end-choices", e.allowedPositionCount === 2, "Either-end mode must expose two allowed positions"));
      break;
    case "countSpecifiedObjectsAtBothEnds":
      expected = countSpecifiedObjectsAtBothEndsExact(e.totalObjects, ceiling);
      checks.push(check("operation", e.operation === "SPECIFIED_OBJECTS_AT_BOTH_ENDS", "Both-ends mode must expose its operation"));
      checks.push(check("end-assignments", e.endAssignmentCount === 2, "Two specified objects must exchange the ends in two ways"));
      break;
    case "countObjectExcludedFromEnds":
      expected = countObjectExcludedFromEndsExact(e.totalObjects, ceiling);
      checks.push(check("operation", e.operation === "OBJECT_EXCLUDED_FROM_ENDS", "Excluded-ends mode must expose its operation"));
      checks.push(check("interior-positions", e.allowedPositionCount === e.totalObjects - 2, "Allowed positions must exclude exactly two ends"));
      break;
    case "countPrescribedRelativeOrder": {
      const chainLength = numberValue(pkg, "chainLength");
      expected = countPrescribedRelativeOrderExact(e.totalObjects, chainLength, ceiling);
      checks.push(check("operation", e.operation === "PRESCRIBED_RELATIVE_ORDER", "Relative-order mode must expose its operation"));
      checks.push(check("relative-divisor", e.relativeOrderDivisor === Array.from({ length: chainLength }, (_, index) => index + 1).reduce((product, factor) => product * factor, 1), "Relative-order divisor must be chainLength!"));
      break;
    }
    case "countIndependentRelativeOrderChains": {
      const chainLengths = numberArrayValue(pkg, "chainLengths");
      expected = countIndependentRelativeOrderChainsExact(e.totalObjects, chainLengths, ceiling);
      checks.push(check("operation", e.operation === "INDEPENDENT_RELATIVE_ORDER_CHAINS", "Independent chains must expose their operation"));
      checks.push(check("two-chains", chainLengths.length === 2 && chainLengths.every((length) => length === 2), "Current independent-chain QL owns two disjoint ordered pairs"));
      break;
    }
    case "countStrictAlternation":
      expected = countStrictAlternationExact(e.largeCount ?? 0, e.smallCount ?? 0, e.orientationCount ?? 0, ceiling);
      checks.push(check("operation", e.operation === "STRICT_ALTERNATION", "Alternation mode must expose its operation"));
      checks.push(check("alternation-domain", Math.abs((e.largeCount ?? 0) - (e.smallCount ?? 0)) <= 1, "Alternating category counts may differ by at most one"));
      checks.push(check("orientation-count", e.orientationCount === (pkg.parameters.scenarioFamily === "equalCategoriesAlternate" ? 2 : 1), "Alternation orientation count must match the scenario"));
      break;
    case "countNoTwoCategoryMembersAdjacent":
      expected = countNoTwoCategoryMembersAdjacentExact(e.largeCount ?? 0, e.smallCount ?? 0, ceiling);
      checks.push(check("operation", e.operation === "NO_TWO_CATEGORY_MEMBERS_ADJACENT", "Gap-placement mode must expose its operation"));
      checks.push(check("gap-slots", e.gapSlotCount === (e.largeCount ?? 0) + 1, "Gap slots must be one more than the arranged base category"));
      checks.push(check("gap-capacity", (e.smallCount ?? 0) <= (e.gapSlotCount ?? 0), "Separated objects must fit into distinct gaps"));
      break;
    case "countExactGapBetweenPair":
      expected = countExactGapBetweenPairExact(e.totalObjects, e.gapCount ?? -1, ceiling);
      checks.push(check("operation", e.operation === "EXACT_GAP_BETWEEN_PAIR", "Exact-gap mode must expose its operation"));
      checks.push(check("ordered-position-pairs", e.orderedPositionPairCount === 2 * (e.totalObjects - (e.gapCount ?? 0) - 1), "Exact gap must expose the correct ordered position-pair count"));
      break;
    case "countAtLeastGapBetweenPair":
      expected = countAtLeastGapBetweenPairExact(e.totalObjects, e.minimumGap ?? -1, ceiling);
      checks.push(check("operation", e.operation === "AT_LEAST_GAP_BETWEEN_PAIR", "At-least-gap mode must expose its operation"));
      checks.push(check("ordered-position-pairs", e.orderedPositionPairCount === (e.totalObjects - (e.minimumGap ?? 0) - 1) * (e.totalObjects - (e.minimumGap ?? 0)), "At-least gap must sum every accepted separation"));
      break;
    case "countSpecifiedObjectsInPositionClass":
      expected = countSpecifiedObjectsInPositionClassExact(e.totalObjects, e.specifiedCount ?? 0, e.requiredInClass ?? 0, e.eligibleClassPositions ?? 0, ceiling);
      checks.push(check("operation", e.operation === "SPECIFIED_OBJECTS_IN_POSITION_CLASS", "Position-class mode must expose its operation"));
      checks.push(check("position-partition", (e.eligibleClassPositions ?? 0) + (e.ineligibleClassPositions ?? 0) === e.totalObjects, "Eligible and ineligible classes must partition all positions"));
      checks.push(check("specified-partition", (e.requiredInClass ?? 0) <= (e.specifiedCount ?? 0), "Required class count cannot exceed specified objects"));
      break;
    case "recoverPositionGapParameter":
      checks.push(check("operation", e.operation === "POSITION_GAP_INVERSE", "Inverse mode must expose its operation"));
      checks.push(check("target", (e.target ?? 0) > 0, "Inverse mode must expose a positive target"));
      checks.push(check("inverse-domain", (e.searchMinimum ?? 1) <= pkg.solver.numericAnswer && pkg.solver.numericAnswer <= (e.searchMaximum ?? 0), "Recovered gap must lie in the stated domain"));
      break;
    default:
      checks.push(check("cp008-mode", false, `Unexpected CP-008 mode ${pkg.solveMode}`));
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
