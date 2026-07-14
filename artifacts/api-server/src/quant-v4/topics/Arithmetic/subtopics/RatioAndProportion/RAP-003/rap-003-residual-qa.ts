import { strict as assert } from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { generateQuestion, listQuantV4Packages } from "../../../../../generation-engine";
import taskRegistry from "./task-registry.library.json";
import { getRap003QuestionLanguageIds } from "./library";
import { RAP_003_CP_IDS } from "./types";

const SAMPLE_COUNT = 1500;

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

const generatedBatches = await Promise.all([
  generateQuietly({ packageId: "RAP-003", language: "en", count: 1000, seed: "rap-003-residual-qa:batch-1" }),
  generateQuietly({ packageId: "RAP-003", language: "en", count: 500, seed: "rap-003-residual-qa:batch-2" }),
]);
const generated = {
  questions: generatedBatches.flatMap((batch) => batch.questions),
  questionPackages: generatedBatches.flatMap((batch) => batch.questionPackages),
};

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
const difficultyDistribution = new Map<string, number>();
const normalizedStemGroups = new Map<string, number[]>();
const stemQlGroups = new Map<string, Set<string>>();
const explanationShells = new Map<string, Set<string>>();
const unrealisticAgeExamples: Array<Record<string, unknown>> = [];

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
let genericExplanationCount = 0;
let shortExplanationCount = 0;
let missingMethodReasonCount = 0;
let missingIntermediateStepCount = 0;
let zeroDenominatorCount = 0;
let invalidPercentageCount = 0;
let invalidElectionCount = 0;
let invalidPopulationGridCount = 0;
let invalidMixtureTargetCount = 0;
let invalidReplacementCount = 0;
let invalidGeometryRootCount = 0;

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
  const stemQlIds = stemQlGroups.get(normalizedStem) ?? new Set<string>();
  stemQlIds.add(pkg.questionLanguageId);
  stemQlGroups.set(normalizedStem, stemQlIds);

  increment(cpDistribution, pkg.canonicalProblemId);
  increment(qlDistribution, pkg.questionLanguageId);
  increment(taskKindDistribution, pkg.parameters.taskKind);
  increment(answerTypeDistribution, pkg.parameters.answerType);
  increment(difficultyDistribution, pkg.difficultyBand);

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
  if (hasUnrealisticAge(pkg)) {
    unrealisticAgeCount += 1;
    if (unrealisticAgeExamples.length < 10) {
      unrealisticAgeExamples.push({
        questionNumber: index + 1,
        qlId: pkg.questionLanguageId,
        taskKind: pkg.parameters.taskKind,
        seed: pkg.seed,
        variables: pkg.parameters.variables,
        workingValues: pkg.solver.workingValues,
        validation: pkg.validation,
      });
    }
  }
  if (/\b(literate|illiterate)\s+(male|female)\b/i.test(combinedVisibleText)) populationGrammarIssueCount += 1;
  if (INTERNAL_PATTERNS.some((pattern) => pattern.test(explanation))) genericInternalExplanationCount += 1;
  if (/apply (?:the )?formula|use the method|calculation\s*=|answer\s*=/i.test(explanation)) genericExplanationCount += 1;
  if (pkg.explanation.lines.length < (pkg.difficultyBand === "Easy" ? 5 : 7)) shortExplanationCount += 1;
  if (!/(why|because|method:)/i.test(explanation)) missingMethodReasonCount += 1;
  if (!pkg.explanation.lines.slice(1, -1).some((line: string) => /\d|\$\$|equation|unit|ratio|value/i.test(line))) missingIntermediateStepCount += 1;
  const explanationShell = normalizeText(explanation);
  const shellTasks = explanationShells.get(explanationShell) ?? new Set<string>();
  shellTasks.add(pkg.parameters.taskKind);
  explanationShells.set(explanationShell, shellTasks);
  if ((question as any).metadata?.language !== "en") metadataLanguageMismatchCount += 1;
  if (pkg.validation?.valid !== true) validationFailureCount += 1;

  const numericEntries = Object.entries(pkg.parameters.variables).filter(([, value]) => typeof value === "number") as [string, number][];
  if (numericEntries.some(([key, value]) => /denominator/i.test(key) && value === 0)) zeroDenominatorCount += 1;
  if (numericEntries.some(([key, value]) => /percent/i.test(key) && (value < 0 || value > 100))) invalidPercentageCount += 1;
  if (/^(election|marketShare|surveyResponse)/.test(pkg.parameters.taskKind) && numericEntries.some(([key, value]) => /(turnout|valid|invalid).*percent/i.test(key) && (value < 0 || value > 100))) invalidElectionCount += 1;
  if (pkg.parameters.taskKind.startsWith("population") && pkg.validation?.valid !== true) invalidPopulationGridCount += 1;
  if (pkg.parameters.taskKind.startsWith("alloy") && pkg.parameters.variables.targetPercent !== undefined && pkg.parameters.variables.percentA !== undefined && pkg.parameters.variables.percentB !== undefined) {
    const target = Number(pkg.parameters.variables.targetPercent);
    const low = Math.min(Number(pkg.parameters.variables.percentA), Number(pkg.parameters.variables.percentB));
    const high = Math.max(Number(pkg.parameters.variables.percentA), Number(pkg.parameters.variables.percentB));
    if (target < low || target > high) invalidMixtureTargetCount += 1;
  }
  if (pkg.parameters.taskKind.startsWith("replacement")) {
    const initial = Number(pkg.parameters.variables.initialVolume);
    const removed = Number(pkg.parameters.variables.removedVolume);
    const rounds = Number(pkg.parameters.variables.replacementCount);
    if ((Number.isFinite(initial) && Number.isFinite(removed) && removed >= initial) || (Number.isFinite(rounds) && (!Number.isInteger(rounds) || rounds <= 0))) invalidReplacementCount += 1;
  }
  if (/geometricSideRatioFromArea|geometricSurfaceAreaRatioFromVolume|mapScaleLengthFromArea/.test(pkg.parameters.taskKind) && pkg.validation?.valid !== true) invalidGeometryRootCount += 1;

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
const exactDuplicateStemGroupCount = [...stemQlGroups.entries()].filter(([stem, qlIds]) => (normalizedStemGroups.get(stem)?.length ?? 0) > 1 && qlIds.size > 1).length;
const exactDuplicateStemExamples = [...stemQlGroups.entries()]
  .filter(([stem, qlIds]) => (normalizedStemGroups.get(stem)?.length ?? 0) > 1 && qlIds.size > 1)
  .slice(0, 10)
  .map(([stem, qlIds]) => ({ stem, qlIds: [...qlIds], questions: normalizedStemGroups.get(stem) }));
const sameQlRepeatedStemGroupCount = duplicateStemGroupCount - exactDuplicateStemGroupCount;
const activeQlIds = RAP_003_CP_IDS.flatMap((cpId) => getRap003QuestionLanguageIds(cpId));
const activeTaskKinds = new Set(activeQlIds.map((qlId) => (taskRegistry.entries as any)[qlId]?.taskKind).filter(Boolean));
const unusedQlCount = activeQlIds.filter((qlId) => !qlDistribution.has(qlId)).length;
const unusedTaskKindCount = [...activeTaskKinds].filter((taskKind) => !taskKindDistribution.has(taskKind)).length;
const unreachableRegistryEntryCount = Object.keys(taskRegistry.entries).filter((qlId) => !activeQlIds.includes(qlId)).length;
const repeatedExplanationShellCount = [...explanationShells.values()].filter((taskKinds) => taskKinds.size > 1).length;
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
  difficultyDistribution: Object.fromEntries([...difficultyDistribution].sort()),
  unusedQlCount,
  unusedTaskKindCount,
  unreachableRegistryEntryCount,
  duplicateStemGroupCount,
  exactDuplicateStemGroupCount,
  exactDuplicateStemExamples,
  sameQlRepeatedStemGroupCount,
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
  unrealisticAgeExamples,
  populationGrammarIssueCount,
  genericInternalExplanationCount,
  genericExplanationCount,
  shortExplanationCount,
  missingMethodReasonCount,
  missingIntermediateStepCount,
  repeatedExplanationShellCount,
  zeroDenominatorCount,
  invalidPercentageCount,
  invalidAgeCount: fractionalAgeAnswerCount,
  invalidElectionCount,
  invalidPopulationGridCount,
  invalidMixtureTargetCount,
  invalidReplacementCount,
  invalidGeometryRootCount,
  unsupportedLanguageExposureCount,
};

console.log(JSON.stringify(summary, null, 2));

const reportPath = path.resolve("src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-003/rap-003-residual-qa-report.md");
fs.writeFileSync(reportPath, [
  "# RAP-003 Residual QA Report", "", "Reviewed commit: `8450deef2e06cc9e031b6d3221b7e54d226199b1`",
  `Reviewed date: \`${new Date().toISOString().slice(0, 10)}\``, "", "## Current Results", "", "```json",
  JSON.stringify(summary, null, 2), "```", "", "## Duplicate Classification", "",
  `- Cross-QL exact duplicate stem groups: \`${exactDuplicateStemGroupCount}\` (blocker).`,
  `- Same-QL repeated parameter draws: \`${sameQlRepeatedStemGroupCount}\` groups (generator-diversity debt; manually classified, not duplicate QLs).`, "",
  "Hindi/Punjabi publication remains blocked pending separate human localization and editorial QA.", "",
].join("\n"));

assert.equal(summary.questionCount, SAMPLE_COUNT);
assert.equal(unusedQlCount, 0, "Unused QLs must be zero.");
assert.equal(unusedTaskKindCount, 0, "Unused task kinds must be zero.");
assert.equal(unreachableRegistryEntryCount, 0, "Unreachable registry entries must be zero.");
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
assert.equal(genericExplanationCount, 0, "Generic explanations must be zero.");
assert.equal(missingMethodReasonCount, 0, "Missing method reasons must be zero.");
assert.equal(missingIntermediateStepCount, 0, "Missing intermediate steps must be zero.");
assert.equal(zeroDenominatorCount, 0, "Zero denominators must be zero.");
assert.equal(invalidPercentageCount, 0, "Invalid percentages must be zero.");
assert.equal(invalidElectionCount, 0, "Invalid election cases must be zero.");
assert.equal(invalidPopulationGridCount, 0, "Invalid population grids must be zero.");
assert.equal(invalidMixtureTargetCount, 0, "Invalid mixture targets must be zero.");
assert.equal(invalidReplacementCount, 0, "Invalid replacement cases must be zero.");
assert.equal(invalidGeometryRootCount, 0, "Invalid geometry roots must be zero.");
assert.equal(unsupportedLanguageExposureCount, 0, "Unsupported language exposure must be zero.");
assert.equal(crossPackageDuplicateWithRap002Count, 0, "Exact cross-package duplicate stems with RAP-002 must be zero.");
assert.equal(exactDuplicateStemGroupCount, 0, "Exact duplicate stems across distinct QLs must be zero.");

console.log("RAP-003 residual QA passed.");
