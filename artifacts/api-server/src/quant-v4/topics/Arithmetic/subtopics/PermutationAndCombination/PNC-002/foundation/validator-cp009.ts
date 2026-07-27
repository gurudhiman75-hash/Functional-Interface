import {
  getPnc002ConstraintProfile,
  getPnc002QuestionEntry,
  getPnc002VariableRanges,
} from "./library";
import {
  countAllOrNoneSpecifiedMembersExact,
  countAtLeastFromTwoCategoriesExact,
  countAtLeastOneFromCategoryExact,
  countAtLeastOneFromEachOfThreeCategoriesExact,
  countAtLeastOneFromEachOfTwoCategoriesExact,
  countAtLeastOneSpecifiedMemberExact,
  countAtMostFromTwoCategoriesExact,
  countAtMostTSpecifiedMembersExact,
  countExactThreeCategoryDistributionExact,
  countExactlyFromTwoCategoriesExact,
  countExactlyTSpecifiedMembersExact,
  countImplicationBetweenSpecifiedMembersExact,
  countNamedCompulsoryWithCategoryQuotaExact,
  countNamedExcludedWithCategoryQuotaExact,
  countNotAllSpecifiedMembersTogetherExact,
  countWithCompulsoryAndExcludedMembersExact,
  countWithCompulsoryMembersExact,
  countWithExcludedMembersExact,
} from "./solver-cp009";
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
function valuesAreValid(pkg: Pnc002QuestionPackage): boolean {
  return Object.values(pkg.parameters.values).every((value) =>
    typeof value === "number"
      ? Number.isInteger(value) && value >= 0
      : Array.isArray(value) && value.every((item) => Number.isInteger(item) && item >= 0),
  );
}

export function validatePnc002Cp009QuestionPackage(pkg: Pnc002QuestionPackage): Pnc002ValidationResult {
  const checks: Pnc002ValidationCheck[] = [];
  const entry = getPnc002QuestionEntry(pkg.questionLanguageId);
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const e = pkg.solver.evidence;
  const totalObjects = e.totalObjects;
  const committeeSize = e.committeeSize ?? numberValue(pkg, "committeeSize");

  checks.push(check("package-id", pkg.packageId === "PNC-002" && pkg.archetypeId === "PNC-002", "Package IDs must be PNC-002"));
  checks.push(check("cp-id", pkg.canonicalProblemId === "PNC-CP-009", "CP-009 validator accepts CP-009 only"));
  checks.push(check("language", pkg.language === "en", "Current CP-009 runtime is English only"));
  checks.push(check("registry-cp", entry.cpId === pkg.canonicalProblemId, "QL and CP must agree"));
  checks.push(check("registry-mode", entry.solveMode === pkg.solveMode, "QL and solve mode must agree"));
  checks.push(check("registry-task", entry.taskKind === pkg.taskKind && pkg.taskKind === "conditionalSelection", "CP-009 must use conditionalSelection"));
  checks.push(check("registry-difficulty", entry.difficulty === pkg.difficultyBand, "QL and difficulty must agree"));
  checks.push(check("constraint-profile", Boolean(getPnc002ConstraintProfile(entry.constraintProfile)), "Constraint profile must exist"));
  checks.push(check("generated-values", valuesAreValid(pkg), "Generated values must be non-negative integers or integer arrays"));
  checks.push(check("selection-domain", Number.isInteger(committeeSize) && committeeSize > 0 && committeeSize <= totalObjects, "Committee size must fit the pool"));

  let expected = pkg.solver.numericAnswer;
  switch (pkg.solveMode) {
    case "countWithCompulsoryMembers": {
      const compulsoryCount = numberValue(pkg, "compulsoryCount");
      expected = countWithCompulsoryMembersExact(totalObjects, committeeSize, compulsoryCount, ceiling);
      checks.push(check("operation", e.operation === "COMPULSORY_MEMBERS", "Compulsory mode must expose its operation"));
      checks.push(check("remaining-selection", e.remainingSelectionCount === committeeSize - compulsoryCount, "Compulsory members reduce the open committee places"));
      break;
    }
    case "countWithExcludedMembers": {
      const excludedCount = numberValue(pkg, "excludedCount");
      expected = countWithExcludedMembersExact(totalObjects, committeeSize, excludedCount, ceiling);
      checks.push(check("operation", e.operation === "EXCLUDED_MEMBERS", "Excluded mode must expose its operation"));
      checks.push(check("remaining-pool", e.remainingEligibleCount === totalObjects - excludedCount, "Excluded members reduce the eligible pool"));
      break;
    }
    case "countWithCompulsoryAndExcludedMembers": {
      const compulsoryCount = numberValue(pkg, "compulsoryCount");
      const excludedCount = numberValue(pkg, "excludedCount");
      expected = countWithCompulsoryAndExcludedMembersExact(totalObjects, committeeSize, compulsoryCount, excludedCount, ceiling);
      checks.push(check("operation", e.operation === "COMPULSORY_AND_EXCLUDED", "Mixed named-member mode must expose its operation"));
      checks.push(check("mixed-pool", e.remainingEligibleCount === totalObjects - compulsoryCount - excludedCount, "Named-member restrictions must adjust the pool exactly"));
      break;
    }
    case "countExactlyFromTwoCategories": {
      const categoryA = numberValue(pkg, "categoryA");
      const categoryB = numberValue(pkg, "categoryB");
      const requiredFromA = numberValue(pkg, "requiredFromA");
      expected = countExactlyFromTwoCategoriesExact(categoryA, categoryB, committeeSize, requiredFromA, ceiling);
      checks.push(check("operation", e.operation === "EXACT_TWO_CATEGORY_QUOTA", "Exact quota mode must expose its operation"));
      checks.push(check("quota-balance", e.requiredFromB === committeeSize - requiredFromA, "Category quotas must fill the committee"));
      break;
    }
    case "countAtLeastFromTwoCategories": {
      const counted = countAtLeastFromTwoCategoriesExact(numberValue(pkg, "categoryA"), numberValue(pkg, "categoryB"), committeeSize, numberValue(pkg, "minimumFromA"), ceiling);
      expected = counted.answer;
      checks.push(check("operation", e.operation === "AT_LEAST_TWO_CATEGORY_QUOTA", "At-least quota mode must expose its operation"));
      checks.push(check("accepted-counts", JSON.stringify(e.acceptedSelectionCounts ?? []) === JSON.stringify(counted.acceptedCounts), "Accepted category counts must match the feasible range"));
      checks.push(check("case-counts", JSON.stringify(e.selectionCaseCounts ?? []) === JSON.stringify(counted.caseCounts), "At-least cases must be solver-owned"));
      break;
    }
    case "countAtMostFromTwoCategories": {
      const counted = countAtMostFromTwoCategoriesExact(numberValue(pkg, "categoryA"), numberValue(pkg, "categoryB"), committeeSize, numberValue(pkg, "maximumFromA"), ceiling);
      expected = counted.answer;
      checks.push(check("operation", e.operation === "AT_MOST_TWO_CATEGORY_QUOTA", "At-most quota mode must expose its operation"));
      checks.push(check("accepted-counts", JSON.stringify(e.acceptedSelectionCounts ?? []) === JSON.stringify(counted.acceptedCounts), "Accepted category counts must match the feasible range"));
      checks.push(check("case-counts", JSON.stringify(e.selectionCaseCounts ?? []) === JSON.stringify(counted.caseCounts), "At-most cases must be solver-owned"));
      break;
    }
    case "countAtLeastOneFromCategory":
      expected = countAtLeastOneFromCategoryExact(numberValue(pkg, "categoryA"), numberValue(pkg, "categoryB"), committeeSize, ceiling);
      checks.push(check("operation", e.operation === "AT_LEAST_ONE_CATEGORY", "Category-complement mode must expose its operation"));
      break;
    case "countAtLeastOneFromEachOfTwoCategories":
      expected = countAtLeastOneFromEachOfTwoCategoriesExact(numberValue(pkg, "categoryA"), numberValue(pkg, "categoryB"), committeeSize, ceiling);
      checks.push(check("operation", e.operation === "AT_LEAST_ONE_EACH_TWO_CATEGORIES", "Two-category participation mode must expose its operation"));
      break;
    case "countExactThreeCategoryDistribution": {
      const sizes = [numberValue(pkg, "categoryA"), numberValue(pkg, "categoryB"), numberValue(pkg, "categoryC")];
      const required = [numberValue(pkg, "requiredA"), numberValue(pkg, "requiredB"), numberValue(pkg, "requiredC")];
      expected = countExactThreeCategoryDistributionExact(sizes, required, ceiling);
      checks.push(check("operation", e.operation === "EXACT_THREE_CATEGORY_DISTRIBUTION", "Exact three-category mode must expose its operation"));
      checks.push(check("distribution-size", required.reduce((sum, value) => sum + value, 0) === committeeSize, "Exact category counts must fill the committee"));
      break;
    }
    case "countAtLeastOneFromEachOfThreeCategories": {
      const counted = countAtLeastOneFromEachOfThreeCategoriesExact([numberValue(pkg, "categoryA"), numberValue(pkg, "categoryB"), numberValue(pkg, "categoryC")], committeeSize, ceiling);
      expected = counted.answer;
      checks.push(check("operation", e.operation === "AT_LEAST_ONE_EACH_THREE_CATEGORIES", "Three-category participation mode must expose its operation"));
      checks.push(check("case-counts", JSON.stringify(e.selectionCaseCounts ?? []) === JSON.stringify(counted.caseCounts), "Every positive distribution must be represented"));
      break;
    }
    case "countExactlyTSpecifiedMembers": {
      const specifiedCount = numberValue(pkg, "specifiedCount");
      const requiredSpecified = numberValue(pkg, "requiredSpecified");
      expected = countExactlyTSpecifiedMembersExact(totalObjects, committeeSize, specifiedCount, requiredSpecified, ceiling);
      checks.push(check("operation", e.operation === "EXACT_SPECIFIED_MEMBERS", "Exact specified-member mode must expose its operation"));
      break;
    }
    case "countAtLeastOneSpecifiedMember":
      expected = countAtLeastOneSpecifiedMemberExact(totalObjects, committeeSize, numberValue(pkg, "specifiedCount"), ceiling);
      checks.push(check("operation", e.operation === "AT_LEAST_ONE_SPECIFIED_MEMBER", "Specified-member complement must expose its operation"));
      break;
    case "countNotAllSpecifiedMembersTogether":
      expected = countNotAllSpecifiedMembersTogetherExact(totalObjects, committeeSize, numberValue(pkg, "specifiedCount"), ceiling);
      checks.push(check("operation", e.operation === "NOT_ALL_SPECIFIED_TOGETHER", "Not-all mode must expose its operation"));
      break;
    case "countAllOrNoneSpecifiedMembers":
      expected = countAllOrNoneSpecifiedMembersExact(totalObjects, committeeSize, numberValue(pkg, "specifiedCount"), ceiling);
      checks.push(check("operation", e.operation === "ALL_OR_NONE_SPECIFIED", "All-or-none mode must expose its operation"));
      checks.push(check("two-cases", (e.selectionCaseCounts ?? []).length === 2, "All-or-none requires exactly two disjoint cases"));
      break;
    case "countImplicationBetweenSpecifiedMembers":
      expected = countImplicationBetweenSpecifiedMembersExact(totalObjects, committeeSize, ceiling);
      checks.push(check("operation", e.operation === "MEMBER_IMPLICATION", "Implication mode must expose its operation"));
      break;
    case "countAtMostTSpecifiedMembers": {
      const counted = countAtMostTSpecifiedMembersExact(totalObjects, committeeSize, numberValue(pkg, "specifiedCount"), numberValue(pkg, "maximumSpecified"), ceiling);
      expected = counted.answer;
      checks.push(check("operation", e.operation === "AT_MOST_SPECIFIED_MEMBERS", "At-most specified-member mode must expose its operation"));
      checks.push(check("case-counts", JSON.stringify(e.selectionCaseCounts ?? []) === JSON.stringify(counted.caseCounts), "Specified-member cases must be exact"));
      break;
    }
    case "countNamedCompulsoryWithCategoryQuota":
      expected = countNamedCompulsoryWithCategoryQuotaExact(numberValue(pkg, "categoryA"), numberValue(pkg, "categoryB"), committeeSize, numberValue(pkg, "requiredFromA"), ceiling);
      checks.push(check("operation", e.operation === "NAMED_COMPULSORY_CATEGORY_QUOTA", "Compulsory quota mode must expose its operation"));
      checks.push(check("compulsory-quota", e.remainingCategoryASelection === numberValue(pkg, "requiredFromA") - 1, "The compulsory member must count toward the quota"));
      break;
    case "countNamedExcludedWithCategoryQuota":
      expected = countNamedExcludedWithCategoryQuotaExact(numberValue(pkg, "categoryA"), numberValue(pkg, "categoryB"), committeeSize, numberValue(pkg, "requiredFromA"), ceiling);
      checks.push(check("operation", e.operation === "NAMED_EXCLUDED_CATEGORY_QUOTA", "Excluded quota mode must expose its operation"));
      break;
    case "recoverConditionalSelectionParameter": {
      const target = numberValue(pkg, "target");
      if (e.recoveredParameter === "totalObjects") {
        expected = pkg.solver.numericAnswer;
        checks.push(check("inverse-target", countWithCompulsoryMembersExact(expected, committeeSize, 1, ceiling) === target, "Recovered pool size must reproduce the target"));
      } else if (e.recoveredParameter === "categorySize") {
        expected = pkg.solver.numericAnswer;
        checks.push(check("inverse-target", countExactlyFromTwoCategoriesExact(expected, numberValue(pkg, "categoryB"), committeeSize, numberValue(pkg, "requiredFromA"), ceiling) === target, "Recovered category size must reproduce the target"));
      } else {
        checks.push(check("inverse-parameter", false, "Conditional inverse must identify its recovered parameter"));
      }
      checks.push(check("operation", e.operation === "CONDITIONAL_SELECTION_INVERSE", "Inverse mode must expose its operation"));
      break;
    }
    default:
      checks.push(check("cp009-mode", false, `Unexpected CP-009 mode ${pkg.solveMode}`));
  }

  checks.push(check("solver-answer", expected === pkg.solver.numericAnswer, "Solver answer must satisfy its exact conditional-selection contract"));
  checks.push(check("answer-string", pkg.answer === String(pkg.solver.numericAnswer) && pkg.solver.answer === pkg.answer, "Displayed answer must match solver"));
  checks.push(check("positive-answer", Number.isInteger(pkg.solver.numericAnswer) && pkg.solver.numericAnswer > 0, "Answer must be a positive integer"));
  checks.push(check("answer-ceiling", pkg.solver.numericAnswer <= ceiling, "Answer must remain within the configured ceiling"));
  checks.push(check("independent-verification", pkg.independentVerification.supported && pkg.independentVerification.answer === pkg.solver.numericAnswer, "Independent subset enumeration must agree"));
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
