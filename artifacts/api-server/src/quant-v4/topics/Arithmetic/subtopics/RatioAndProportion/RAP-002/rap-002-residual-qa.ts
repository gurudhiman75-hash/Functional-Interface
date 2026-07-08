import { strict as assert } from "node:assert";
import { generateQuestion } from "../../../../../generation-engine";

const SAMPLE_COUNT = 500;

const GRAMMAR_PATTERNS = [
  /number of .* are/i,
  /ratio of .* are/i,
  /total number of .* are/i,
];

const SEMANTIC_PATTERNS = [
  /workers in sales/i,
  /workers in expenses/i,
  /workers in profit/i,
  /workers in investment/i,
  /speeds? of profit/i,
  /speeds? of investment/i,
  /number of workers in profit/i,
  /number of workers in investment/i,
];

const INTERNAL_PATTERNS = [
  /\bundefined\b/i,
  /\bnull\b/i,
  /\bNaN\b/,
  /\bInfinity\b/,
  /\[object Object\]/i,
  /\btaskKind\b/i,
  /\bcanonicalProblemId\b/i,
  /\bquestionLanguageId\b/i,
  /\bselected pair\b/i,
];

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function normalizeText(value: unknown) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normalizeOption(value: unknown) {
  return normalizeText(value)
    .replace(/^\$\$|\$\$$/g, "")
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\s+/g, "");
}

function hasUnresolvedPlaceholder(value: string) {
  const withoutLatexCommandArgs = value.replace(/\\[A-Za-z]+\{[^}]*\}/g, "");
  return /\{[A-Za-z][A-Za-z0-9_]*\}/.test(withoutLatexCommandArgs);
}

function comparableValuesFromCalculation(value: string) {
  return [...value.matchAll(/=(-?\d+(?:\.\d+)?)/g)].map((match) => Number(match[1]));
}

const originalInfo = console.info;
console.info = () => undefined;
const generated = await generateQuestion({
  packageId: "RAP-002",
  language: "en",
  count: SAMPLE_COUNT,
  seed: "rap-002-residual-qa",
});
console.info = originalInfo;

const cpDistribution = new Map<string, number>();
const qlDistribution = new Map<string, number>();
const taskDistribution = new Map<string, number>();
const logicAnswerDistribution = new Map<string, number>();
const equivalenceAnswerDistribution = new Map<string, number>();
const normalizedStemGroups = new Map<string, number[]>();

let grammarIssueCount = 0;
let semanticCompatibilityIssueCount = 0;
let unresolvedPlaceholderCount = 0;
let nanUndefinedNullCount = 0;
let invalidCorrectIndexCount = 0;
let duplicateNormalizedOptionCount = 0;
let weakOptionCount = 0;
let metadataLanguageMismatchCount = 0;
let validationFailureCount = 0;
let invalidAnswerFormatCount = 0;
let genericInternalExplanationCount = 0;
let chainInequalityTieRiskCount = 0;
let extendedTargetMismatchCount = 0;

for (const [index, question] of generated.questions.entries()) {
  const pkg = generated.questionPackages[index]!;
  const stem = String((question as any).stem ?? (question as any).text ?? pkg.stem ?? "");
  const answer = String((question as any).answer ?? pkg.answer ?? "");
  const explanation = String((question as any).explanation ?? pkg.explanation?.lines?.join("\n") ?? "");
  const combinedVisibleText = `${stem}\n${answer}\n${explanation}`;
  const normalizedStem = normalizeText(stem);
  const existingStemGroup = normalizedStemGroups.get(normalizedStem) ?? [];
  existingStemGroup.push(index + 1);
  normalizedStemGroups.set(normalizedStem, existingStemGroup);

  increment(cpDistribution, pkg.canonicalProblemId);
  increment(qlDistribution, pkg.questionLanguageId);
  increment(taskDistribution, pkg.parameters.taskKind);
  if (pkg.parameters.answerType === "LOGIC") {
    increment(logicAnswerDistribution, String(pkg.solver.answerValue));
  }
  if (pkg.parameters.taskKind === "chainEquivalence") {
    increment(equivalenceAnswerDistribution, String(pkg.solver.answerValue));
  }

  if (GRAMMAR_PATTERNS.some((pattern) => pattern.test(combinedVisibleText))) grammarIssueCount += 1;
  if (SEMANTIC_PATTERNS.some((pattern) => pattern.test(combinedVisibleText))) semanticCompatibilityIssueCount += 1;
  if (hasUnresolvedPlaceholder(combinedVisibleText)) unresolvedPlaceholderCount += 1;
  if (INTERNAL_PATTERNS.some((pattern) => pattern.test(combinedVisibleText))) nanUndefinedNullCount += 1;
  if (!/^\$\$[\s\S]*\$\$$/.test(answer.trim())) invalidAnswerFormatCount += 1;
  if ((question as any).metadata?.language !== "en") metadataLanguageMismatchCount += 1;
  if (pkg.validation?.valid !== true) validationFailureCount += 1;
  if (INTERNAL_PATTERNS.some((pattern) => pattern.test(explanation))) genericInternalExplanationCount += 1;

  const options = Array.isArray((question as any).options) ? (question as any).options : [];
  const correctIndex = (question as any).correctIndex;
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
    invalidCorrectIndexCount += 1;
  }
  const normalizedOptions = options.map(normalizeOption);
  if (new Set(normalizedOptions).size !== normalizedOptions.length) duplicateNormalizedOptionCount += 1;
  if (options.length !== 4 || normalizedOptions.some((option) => option.length === 0 || /undefined|null|nan|infinity/i.test(option))) {
    weakOptionCount += 1;
  }

  if (pkg.parameters.taskKind === "chainInequality") {
    const values = comparableValuesFromCalculation(String(pkg.solver.mathJax.calculationLatex ?? ""));
    if (values.length >= 2 && values[0] === values[1]) {
      chainInequalityTieRiskCount += 1;
    }
  }
  if (
    (pkg.questionLanguageId === "RAP-QL-205" && pkg.parameters.variables.targetPair !== "AD")
    || (pkg.questionLanguageId === "RAP-QL-206" && pkg.parameters.variables.targetPair !== "BD")
    || (pkg.questionLanguageId === "RAP-QL-207" && pkg.parameters.variables.targetPair !== "AC")
  ) {
    extendedTargetMismatchCount += 1;
  }
}

const duplicateStemGroups = [...normalizedStemGroups.values()].filter((group) => group.length > 1);
const duplicateStemGroupCount = duplicateStemGroups.length;
const duplicateStemQuestionCount = duplicateStemGroups.reduce((sum, group) => sum + group.length, 0);
const duplicateStemExamples = [...normalizedStemGroups.entries()]
  .filter(([, group]) => group.length > 1)
  .slice(0, 5)
  .map(([stem, group]) => ({ stem, questions: group }));

const summary = {
  questionCount: generated.questions.length,
  cpDistribution: Object.fromEntries([...cpDistribution].sort()),
  qlDistribution: Object.fromEntries([...qlDistribution].sort()),
  taskDistribution: Object.fromEntries([...taskDistribution].sort()),
  duplicateStemGroupCount,
  duplicateStemQuestionCount,
  duplicateStemExamples,
  grammarIssueCount,
  semanticCompatibilityIssueCount,
  unresolvedPlaceholderCount,
  nanUndefinedNullCount,
  invalidCorrectIndexCount,
  duplicateNormalizedOptionCount,
  weakOptionCount,
  metadataLanguageMismatchCount,
  validationFailureCount,
  invalidAnswerFormatCount,
  genericInternalExplanationCount,
  chainInequalityTieRiskCount,
  extendedTargetMismatchCount,
  logicAnswerDistribution: Object.fromEntries([...logicAnswerDistribution].sort()),
  equivalenceAnswerDistribution: Object.fromEntries([...equivalenceAnswerDistribution].sort()),
};

console.log(JSON.stringify(summary, null, 2));

assert.equal(summary.questionCount, SAMPLE_COUNT);
assert.equal(grammarIssueCount, 0, "Grammar blockers must be zero.");
assert.equal(semanticCompatibilityIssueCount, 0, "Semantic compatibility blockers must be zero.");
assert.equal(unresolvedPlaceholderCount, 0, "Unresolved placeholders must be zero.");
assert.equal(nanUndefinedNullCount, 0, "NaN/undefined/null/Infinity leakage must be zero.");
assert.equal(invalidCorrectIndexCount, 0, "Invalid correctIndex count must be zero.");
assert.equal(duplicateNormalizedOptionCount, 0, "Duplicate normalized options must be zero.");
assert.equal(weakOptionCount, 0, "Weak options must be zero.");
assert.equal(metadataLanguageMismatchCount, 0, "metadata.language mismatches must be zero.");
assert.equal(validationFailureCount, 0, "Validation failures must be zero.");
assert.equal(invalidAnswerFormatCount, 0, "Invalid answer formats must be zero.");
assert.equal(genericInternalExplanationCount, 0, "Generic/internal explanation leakage must be zero.");
assert.equal(chainInequalityTieRiskCount, 0, "chainInequality tie-risk must be zero.");
assert.equal(extendedTargetMismatchCount, 0, "Extended-chain fixed QL target mismatches must be zero.");
assert.equal(duplicateStemGroupCount, 0, "Duplicate stem groups must be zero.");
assert.ok(equivalenceAnswerDistribution.get("Equivalent")! > 0, "Equivalence tasks must include Equivalent answers.");
assert.ok(equivalenceAnswerDistribution.get("Not equivalent")! > 0, "Equivalence tasks must include Not equivalent answers.");

console.log("RAP-002 residual QA passed.");
