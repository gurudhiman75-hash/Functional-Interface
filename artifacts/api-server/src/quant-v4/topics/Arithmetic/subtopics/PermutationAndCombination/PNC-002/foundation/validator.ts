import {
  getPnc002ConstraintProfile,
  getPnc002QuestionEntry,
  getPnc002VariableRanges,
} from "./library";
import {
  countBlockWithExternalPairApartExact,
  countBlockWithOutsiderNotAdjacentExact,
  countMultipleBlocksTogetherExact,
  countNotAllSpecifiedBlocksTogetherExact,
  countOneBlockTogetherOtherNotTogetherExact,
  countSingleBlockNotTogetherExact,
  countSingleBlockTogetherExact,
  countTwoBlocksTogetherNotAdjacentExact,
} from "./solver";
import {
  factorialExact,
  productExact,
} from "./math";
import type {
  Pnc002QuestionPackage,
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
  return !/\b\d+!/.test(plain)
    && !/[×÷≤≥]/.test(plain)
    && !/\b[nk]\s*=/.test(plain);
}
function valuesAreValid(pkg: Pnc002QuestionPackage): boolean {
  return Object.values(pkg.parameters.values).every((value) =>
    typeof value === "number"
      ? Number.isInteger(value) && value >= 0
      : Array.isArray(value) && value.every((item) => Number.isInteger(item) && item >= 2),
  );
}

export function validatePnc002QuestionPackage(pkg: Pnc002QuestionPackage): Pnc002ValidationResult {
  const checks: Pnc002ValidationCheck[] = [];
  const entry = getPnc002QuestionEntry(pkg.questionLanguageId);
  const ranges = getPnc002VariableRanges();
  const evidence = pkg.solver.evidence;
  const groupedObjectCount = evidence.blockSizes.reduce((sum, size) => sum + size, 0);
  const expectedUnitCount = evidence.totalObjects - groupedObjectCount + evidence.blockSizes.length;
  const expectedInternalCounts = evidence.blockSizes.map((size) => factorialExact(size, ranges.answerCeiling));
  const expectedInternalMultiplier = productExact(expectedInternalCounts, ranges.answerCeiling);

  checks.push(check("package-id", pkg.packageId === "PNC-002" && pkg.archetypeId === "PNC-002", "Package IDs must be PNC-002"));
  checks.push(check("cp-id", pkg.canonicalProblemId === "PNC-CP-007", "Current runtime accepts CP-007 only"));
  checks.push(check("language", pkg.language === "en", "Current runtime proof is English only"));
  checks.push(check("registry-cp", entry.cpId === pkg.canonicalProblemId, "QL and CP must agree"));
  checks.push(check("registry-mode", entry.solveMode === pkg.solveMode, "QL and solve mode must agree"));
  checks.push(check("registry-task-kind", entry.taskKind === pkg.taskKind, "QL and task kind must agree"));
  checks.push(check("registry-difficulty", entry.difficulty === pkg.difficultyBand, "QL and difficulty must agree"));
  checks.push(check("constraint-profile", Boolean(getPnc002ConstraintProfile(entry.constraintProfile)), "Constraint profile must exist"));
  checks.push(check("generated-values", valuesAreValid(pkg), "Generated values must be finite non-negative integers or valid block-size arrays"));
  checks.push(check("grouped-object-count", groupedObjectCount === evidence.groupedObjectCount, "Grouped-object evidence must equal the sum of block sizes"));
  checks.push(check("disjoint-block-domain", groupedObjectCount <= evidence.totalObjects, "Specified disjoint blocks must fit inside the total objects"));
  checks.push(check("unit-count", evidence.unitCount === expectedUnitCount, "Unit count must compress every block correctly"));
  checks.push(check("external-arrangements", evidence.externalArrangementCount === factorialExact(expectedUnitCount, ranges.answerCeiling), "External arrangements must equal unitCount!"));
  checks.push(check("internal-counts", JSON.stringify(evidence.internalArrangementCounts) === JSON.stringify(expectedInternalCounts), "Each block must expose its full internal factorial"));
  checks.push(check("internal-multiplier", evidence.internalArrangementMultiplier === expectedInternalMultiplier, "Internal block arrangements must multiply"));

  let expectedAnswer = pkg.solver.numericAnswer;
  switch (pkg.solveMode) {
    case "countSingleBlockTogether":
      expectedAnswer = countSingleBlockTogetherExact(evidence.totalObjects, evidence.blockSizes[0]!, ranges.answerCeiling);
      checks.push(check("together-operation", evidence.operation === "SINGLE_BLOCK_TOGETHER", "Together mode must expose single-block operation"));
      break;
    case "countSingleBlockNotTogether":
      expectedAnswer = countSingleBlockNotTogetherExact(evidence.totalObjects, evidence.blockSizes[0]!, ranges.answerCeiling);
      checks.push(check("complement-operation", evidence.operation === "SINGLE_BLOCK_COMPLEMENT", "Apart mode must expose complement operation"));
      checks.push(check("unrestricted-count", evidence.unrestrictedCount === factorialExact(evidence.totalObjects, ranges.answerCeiling), "Complement must begin from every unrestricted arrangement"));
      checks.push(check("forbidden-count", evidence.forbiddenTogetherCount === countSingleBlockTogetherExact(evidence.totalObjects, evidence.blockSizes[0]!, ranges.answerCeiling), "Forbidden count must be the corresponding block count"));
      break;
    case "countMultipleBlocksTogether":
      expectedAnswer = countMultipleBlocksTogetherExact(evidence.totalObjects, evidence.blockSizes, ranges.answerCeiling);
      checks.push(check("multiple-operation", evidence.operation === "MULTIPLE_BLOCKS", "Multiple-block mode must expose multiple-block operation"));
      checks.push(check("multiple-block-count", evidence.blockSizes.length >= 2, "Multiple-block mode requires at least two disjoint blocks"));
      break;
    case "countBlockWithExternalPairApart":
      expectedAnswer = countBlockWithExternalPairApartExact(evidence.totalObjects, evidence.blockSizes[0]!, ranges.answerCeiling);
      checks.push(check("mixed-operation", evidence.operation === "BLOCK_WITH_EXTERNAL_PAIR_APART", "Mixed restriction must expose block-and-apart operation"));
      checks.push(check("external-pair-domain", evidence.blockSizes[0]! + 2 <= evidence.totalObjects, "External pair must be disjoint from required block"));
      checks.push(check("unit-complement", (evidence.validUnitArrangementCount ?? -1) + (evidence.adjacentExternalPairCount ?? -1) === evidence.externalArrangementCount, "Valid and adjacent unit arrangements must partition the unit space"));
      break;
    case "countTwoBlocksTogetherNotAdjacent":
      expectedAnswer = countTwoBlocksTogetherNotAdjacentExact(evidence.totalObjects, evidence.blockSizes, ranges.answerCeiling);
      checks.push(check("separated-block-operation", evidence.operation === "TWO_BLOCKS_TOGETHER_NOT_ADJACENT", "Separated blocks must expose their own operation"));
      checks.push(check("exactly-two-blocks", evidence.blockSizes.length === 2, "Separated-block mode requires exactly two blocks"));
      checks.push(check("separated-unit-partition", (evidence.validUnitArrangementCount ?? -1) + (evidence.forbiddenAdjacentUnitCount ?? -1) === evidence.externalArrangementCount, "Separated and touching block-unit arrangements must partition the unit space"));
      break;
    case "countBlockWithOutsiderNotAdjacent":
      expectedAnswer = countBlockWithOutsiderNotAdjacentExact(evidence.totalObjects, evidence.blockSizes[0]!, ranges.answerCeiling);
      checks.push(check("block-outsider-operation", evidence.operation === "BLOCK_WITH_OUTSIDER_NOT_ADJACENT", "Block/outsider restriction must expose its own operation"));
      checks.push(check("outsider-domain", evidence.blockSizes[0]! + 2 <= evidence.totalObjects, "Named outsider and at least one other object must remain outside the block"));
      checks.push(check("outsider-unit-partition", (evidence.validUnitArrangementCount ?? -1) + (evidence.forbiddenAdjacentUnitCount ?? -1) === evidence.externalArrangementCount, "Allowed and block-adjacent outsider placements must partition the unit space"));
      break;
    case "countOneBlockTogetherOtherNotTogether":
      expectedAnswer = countOneBlockTogetherOtherNotTogetherExact(evidence.totalObjects, evidence.blockSizes, ranges.answerCeiling);
      checks.push(check("one-block-other-broken-operation", evidence.operation === "ONE_BLOCK_TOGETHER_OTHER_BROKEN", "Mixed together/broken mode must expose its own operation"));
      checks.push(check("mixed-two-groups", evidence.blockSizes.length === 2, "Mixed together/broken mode requires two disjoint groups"));
      checks.push(check("primary-count", evidence.primaryRestrictionCount === countSingleBlockTogetherExact(evidence.totalObjects, evidence.blockSizes[0]!, ranges.answerCeiling), "Primary count must keep only the first group together"));
      checks.push(check("simultaneous-count", evidence.allSpecifiedBlocksTogetherCount === countMultipleBlocksTogetherExact(evidence.totalObjects, evidence.blockSizes, ranges.answerCeiling), "Forbidden count must keep both groups together"));
      checks.push(check("mixed-complement", (evidence.allSpecifiedBlocksTogetherCount ?? -1) + pkg.solver.numericAnswer === evidence.primaryRestrictionCount, "Valid and both-together cases must partition the primary restriction"));
      break;
    case "countNotAllSpecifiedBlocksTogether":
      expectedAnswer = countNotAllSpecifiedBlocksTogetherExact(evidence.totalObjects, evidence.blockSizes, ranges.answerCeiling);
      checks.push(check("not-all-operation", evidence.operation === "NOT_ALL_BLOCKS_TOGETHER", "Multiple-block complement must expose its own operation"));
      checks.push(check("not-all-unrestricted", evidence.unrestrictedCount === factorialExact(evidence.totalObjects, ranges.answerCeiling), "Not-all mode must begin from all arrangements"));
      checks.push(check("not-all-forbidden", evidence.allSpecifiedBlocksTogetherCount === countMultipleBlocksTogetherExact(evidence.totalObjects, evidence.blockSizes, ranges.answerCeiling), "Forbidden count must require all specified blocks simultaneously"));
      checks.push(check("not-all-partition", (evidence.allSpecifiedBlocksTogetherCount ?? -1) + pkg.solver.numericAnswer === evidence.unrestrictedCount, "Valid and all-block cases must partition the unrestricted space"));
      break;
    case "recoverBlockRestrictionParameter":
      checks.push(check("inverse-operation", evidence.operation === "BLOCK_INVERSE", "Inverse mode must expose inverse operation"));
      checks.push(check("inverse-target", evidence.target !== undefined && evidence.target > 0, "Inverse mode must expose a positive target"));
      checks.push(check("inverse-domain", evidence.searchMinimum !== undefined && evidence.searchMaximum !== undefined && evidence.searchMinimum <= pkg.solver.numericAnswer && pkg.solver.numericAnswer <= evidence.searchMaximum, "Recovered value must lie in the stated domain"));
      break;
  }

  checks.push(check("solver-answer", expectedAnswer === pkg.solver.numericAnswer, "Solver answer must satisfy the solve-mode invariant"));
  checks.push(check("answer-string", pkg.answer === String(pkg.solver.numericAnswer) && pkg.solver.answer === pkg.answer, "Displayed answer must match solver"));
  checks.push(check("positive-answer", Number.isInteger(pkg.solver.numericAnswer) && pkg.solver.numericAnswer > 0, "Answer must be a positive integer"));
  checks.push(check("answer-ceiling", pkg.solver.numericAnswer <= ranges.answerCeiling, "Answer must remain within the configured ceiling"));
  checks.push(check("independent-verification", pkg.independentVerification.supported && pkg.independentVerification.answer === pkg.solver.numericAnswer, "Independent enumeration must agree with solver"));

  checks.push(check("four-options", pkg.options.length === 4, "Exactly four options are required"));
  checks.push(check("unique-options", new Set(pkg.options).size === 4, "Options must be unique"));
  checks.push(check("positive-options", pkg.options.every((option) => Number.isInteger(Number(option)) && Number(option) > 0), "Options must be positive integers"));
  checks.push(check("correct-index", pkg.options[pkg.correctIndex] === pkg.answer, "Correct index must point to answer"));
  checks.push(check("single-correct-option", pkg.options.filter((option) => option === pkg.answer).length === 1, "Answer must appear exactly once"));

  const explanationText = pkg.explanation.lines.join(" ");
  checks.push(check("stem-placeholders", !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(pkg.stem), "Stem must resolve every placeholder"));
  checks.push(check("explanation-lines", pkg.explanation.lines.length >= 3, "Explanation must have at least three meaningful lines"));
  checks.push(check("explanation-answer", explanationText.includes(pkg.answer), "Explanation must state the final answer"));
  checks.push(check("explanation-placeholders", !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(explanationText), "Explanation must resolve every placeholder"));
  checks.push(check("reasoning-equation", pkg.reasoningEvidence.equations.includes(`\\(${pkg.solver.mathJax}\\)`), "Reasoning must include solver-owned TeX calculation"));

  const visibleText = [pkg.stem, ...pkg.options, ...pkg.explanation.lines, ...pkg.reasoningEvidence.equations, pkg.reasoningEvidence.decisiveCalculation];
  checks.push(check("latex-balanced", visibleText.every(latexBalanced), "All user-facing LaTeX delimiters must be balanced"));
  checks.push(check("latex-no-raw-formulas", visibleText.every(visibleFormulaIsFormatted), "Visible factorials, operators and symbolic equations must be inside MathJax delimiters"));
  const solverHasDelimiters = ["$", "\\(", "\\)", "\\[", "\\]"].some((token) => pkg.solver.mathJax.includes(token));
  checks.push(check("latex-solver-source", Boolean(pkg.solver.mathJax.trim()) && !solverHasDelimiters, "Solver must expose delimiter-free TeX authority"));
  checks.push(check("not-public", pkg.publiclyPublishable === false, "Runtime-proof package must remain unpublished"));

  return { valid: checks.every((item) => item.passed), checks };
}
