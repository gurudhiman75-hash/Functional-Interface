import { strict as assert } from "node:assert";
import { generateQuestion, listQuantV4Packages } from "../../../../../generation-engine";

const SAMPLE_COUNT = 500;

const GRAMMAR_PATTERNS = [
  /\bnumber of .* are\b/i,
  /\bratio of .* are\b/i,
  /\btotal number of .* are\b/i,
  /\b(literate|illiterate)\s+(male|female)\b/i,
];

const SEMANTIC_PATTERNS = [
  /father is (?:[1-2]?\d) years old/i,
  /mother is (?:[1-2]?\d) years old/i,
  /\byears ago, their ages were in the ratio\b[\s\S]*\b\$\$-\d/i,
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
  /\bUse the method\b/i,
  /\bApply formula\b/i,
  /\bCalculation\s*=\s*Answer\b/i,
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
    .replace(/\\%/g, "%")
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\s+/g, "");
}

function hasUnresolvedPlaceholder(value: string) {
  const withoutLatexCommandArgs = value.replace(/\\[A-Za-z]+\{[^}]*\}/g, "");
  return /\{[A-Za-z][A-Za-z0-9_]*\}/.test(withoutLatexCommandArgs);
}

function answerBody(value: string) {
  return value.replace(/^\$\$\s*/, "").replace(/\s*\$\$$/, "").trim();
}

function isIntegerLike(value: unknown) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && Number.isInteger(numeric);
}

function hasUnrealisticAge(pkg: any) {
  if (!String(pkg.parameters?.taskKind ?? "").startsWith("age")) return false;
  const presentA = Number(pkg.solver?.workingValues?.presentAgeA ?? pkg.parameters?.variables?.presentAgeA);
  const presentB = Number(pkg.solver?.workingValues?.presentAgeB ?? pkg.parameters?.variables?.presentAgeB);
  if (![presentA, presentB].every((value) => Number.isInteger(value) && value > 0)) return true;
  const personA = String(pkg.parameters?.variables?.personA ?? "").toLowerCase();
  const personB = String(pkg.parameters?.variables?.personB ?? "").toLowerCase();
  const relationSpecific = /\b(father|mother|parent|teacher)\b/.test(personA) || /\b(son|daughter|student)\b/.test(personB);
  if (presentA > 95 || presentB > 95) return true;
  if (relationSpecific && (presentA < 30 || presentB > 25 || presentA - presentB < 18)) return true;
  if (pkg.parameters?.taskKind === "agePresentFromPastRatio") {
    const shift = Number(pkg.parameters?.variables?.shiftYears);
    return presentA - shift <= 0 || presentB - shift <= 0;
  }
  return false;
}

function visibleText(question: any, pkg: any) {
  return [
    question?.stem ?? question?.text ?? pkg?.stem ?? "",
    question?.answer ?? pkg?.answer ?? "",
    question?.explanation ?? pkg?.explanation?.lines?.join("\n") ?? "",
  ].join("\n");
}

async function generateQuietly(request: Parameters<typeof generateQuestion>[0]) {
  const originalInfo = console.info;
  console.info = () => undefined;
  try {
    return await generateQuestion(request);
  } finally {
    console.info = originalInfo;
  }
}

const rap003Discovery = listQuantV4Packages().find((pkg) => pkg.packageId === "RAP-003");
const unsupportedLanguageExposureCount =
  rap003Discovery?.supportedLanguages?.length === 1 && rap003Discovery.supportedLanguages[0] === "en"
    ? 0
    : 1;

const generated = await generateQuietly({
  packageId: "RAP-003",
  language: "en",
  count: SAMPLE_COUNT,
  seed: "rap-003-residual-qa",
});

const rap002Generated = await generateQuietly({
  packageId: "RAP-002",
  language: "en",
  count: SAMPLE_COUNT,
  seed: "rap-003-cross-package-rap-002-residual-qa",
});
const rap002Stems = new Set(
  rap002Generated.questions.map((question: any, index: number) =>
    normalizeText(question?.stem ?? question?.text ?? rap002Generated.questionPackages[index]?.stem ?? ""),
  ),
);

const cpDistribution = new Map<string, number>();
const qlDistribution = new Map<string, number>();
const taskKindDistribution = new Map<string, number>();
const answerTypeDistribution = new Map<string, number>();
const normalizedStemGroups = new Map<string, number[]>();

let crossPackageDuplicateWithRap002Count = 0;
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
let percentageFormatIssueCount = 0;
let fractionalCountAnswerCount = 0;
let fractionalAgeAnswerCount = 0;
let negativeValueCount = 0;
let unrealisticAgeCount = 0;
let populationGrammarIssueCount = 0;
let genericInternalExplanationCount = 0;

for (const [index, question] of generated.questions.entries()) {
  const pkg = generated.questionPackages[index]!;
  const stem = String((question as any).stem ?? (question as any).text ?? pkg.stem ?? "");
  const answer = String((question as any).answer ?? pkg.answer ?? "");
  const explanation = String((question as any).explanation ?? pkg.explanation?.lines?.join("\n") ?? "");
  const combinedVisibleText = visibleText(question, pkg);
  const normalizedStem = normalizeText(stem);
  const existingStemGroup = normalizedStemGroups.get(normalizedStem) ?? [];
  existingStemGroup.push(index + 1);
  normalizedStemGroups.set(normalizedStem, existingStemGroup);

  increment(cpDistribution, pkg.canonicalProblemId);
  increment(qlDistribution, pkg.questionLanguageId);
  increment(taskKindDistribution, pkg.parameters.taskKind);
  increment(answerTypeDistribution, pkg.parameters.answerType);

  if (rap002Stems.has(normalizedStem)) crossPackageDuplicateWithRap002Count += 1;
  if (GRAMMAR_PATTERNS.some((pattern) => pattern.test(combinedVisibleText))) grammarIssueCount += 1;
  if (SEMANTIC_PATTERNS.some((pattern) => pattern.test(combinedVisibleText))) semanticCompatibilityIssueCount += 1;
  if (hasUnresolvedPlaceholder(combinedVisibleText)) unresolvedPlaceholderCount += 1;
  if (INTERNAL_PATTERNS.slice(0, 5).some((pattern) => pattern.test(combinedVisibleText))) nanUndefinedNullCount += 1;
  if (!/^\$\$[\s\S]*\$\$$/.test(answer.trim())) invalidAnswerFormatCount += 1;
  if (pkg.parameters.answerType === "PERCENT" && !/%/.test(answerBody(answer))) percentageFormatIssueCount += 1;
  if (pkg.parameters.answerType === "COUNT" && !isIntegerLike(pkg.solver.answerValue)) fractionalCountAnswerCount += 1;
  if (pkg.parameters.answerType === "AGE" && !isIntegerLike(pkg.solver.answerValue)) fractionalAgeAnswerCount += 1;
  if (Object.values(pkg.parameters.variables).some((value) => typeof value === "number" && (!Number.isFinite(value) || value <= 0))) negativeValueCount += 1;
  if (hasUnrealisticAge(pkg)) unrealisticAgeCount += 1;
  if (/\b(literate|illiterate)\s+(male|female)\b/i.test(combinedVisibleText)) populationGrammarIssueCount += 1;
  if (INTERNAL_PATTERNS.some((pattern) => pattern.test(explanation))) genericInternalExplanationCount += 1;
  if ((question as any).metadata?.language !== "en") metadataLanguageMismatchCount += 1;
  if (pkg.validation?.valid !== true) validationFailureCount += 1;

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
}

for (const language of ["hi", "pa"] as const) {
  try {
    await generateQuietly({
      packageId: "RAP-003",
      language,
      count: 1,
      seed: `rap-003-residual-qa-${language}-block`,
    });
    genericInternalExplanationCount += 0;
    throw new Error(`${language} unexpectedly generated`);
  } catch (error) {
    if (!/English generation only|English only/i.test(String((error as Error).message))) {
      throw error;
    }
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
  taskKindDistribution: Object.fromEntries([...taskKindDistribution].sort()),
  answerTypeDistribution: Object.fromEntries([...answerTypeDistribution].sort()),
  duplicateStemGroupCount,
  duplicateStemQuestionCount,
  duplicateStemExamples,
  crossPackageDuplicateWithRap002Count,
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
  percentageFormatIssueCount,
  fractionalCountAnswerCount,
  fractionalAgeAnswerCount,
  negativeValueCount,
  unrealisticAgeCount,
  populationGrammarIssueCount,
  genericInternalExplanationCount,
  unsupportedLanguageExposureCount,
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
assert.equal(percentageFormatIssueCount, 0, "Percentage answer format issues must be zero.");
assert.equal(fractionalCountAnswerCount, 0, "Fractional COUNT answers must be zero.");
assert.equal(fractionalAgeAnswerCount, 0, "Fractional AGE answers must be zero.");
assert.equal(negativeValueCount, 0, "Negative/non-positive numeric values must be zero.");
assert.equal(unrealisticAgeCount, 0, "Unrealistic age cases must be zero.");
assert.equal(populationGrammarIssueCount, 0, "Population grammar issues must be zero.");
assert.equal(genericInternalExplanationCount, 0, "Generic/internal explanation leakage must be zero.");
assert.equal(unsupportedLanguageExposureCount, 0, "Unsupported language exposure must be zero.");
assert.equal(crossPackageDuplicateWithRap002Count, 0, "Exact cross-package duplicate stems with RAP-002 must be zero.");
assert.equal(duplicateStemGroupCount, 0, "Duplicate stem groups must be zero.");

console.log("RAP-003 residual QA passed.");
