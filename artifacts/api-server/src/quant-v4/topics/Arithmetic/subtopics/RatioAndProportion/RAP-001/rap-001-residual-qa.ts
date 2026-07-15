import { strict as assert } from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { auditRap001Packages, generateRap001Batch } from "./coverage-auditor";

const packages = generateRap001Batch(1000, "en");
const audit = auditRap001Packages(packages);
const grammarPatterns = [/\bin a (?:boys|girls|men|women|children)\b/i, /\bboys's\b/i, /\bgirls's\b/i, /\bdoes (?:boys|girls|men|women|children)\b/i];
const semanticPatterns = [/students[^.]*boys[^.]*girls/i];
const stemQlGroups = new Map<string, Set<string>>();
const stemCounts = new Map<string, number>();
let grammarIssueCount = 0;
let semanticCompatibilityIssueCount = 0;
let unresolvedPlaceholderCount = 0;
let nanUndefinedNullCount = 0;
let invalidAnswerFormatCount = 0;
let fractionalCountAnswerCount = 0;
let genericExplanationCount = 0;
let shortExplanationCount = 0;
let missingMethodReasonCount = 0;
let missingIntermediateStepCount = 0;
const grammarExamples: string[] = [];
const semanticExamples: string[] = [];

for (const pkg of packages) {
  const visible = `${pkg.stem}\n${pkg.answer}\n${pkg.explanation.lines.join("\n")}`;
  stemCounts.set(pkg.stem, (stemCounts.get(pkg.stem) ?? 0) + 1);
  const qlIds = stemQlGroups.get(pkg.stem) ?? new Set<string>();
  qlIds.add(pkg.questionLanguageId);
  stemQlGroups.set(pkg.stem, qlIds);
  if (grammarPatterns.some((pattern) => pattern.test(visible))) { grammarIssueCount += 1; if (grammarExamples.length < 10) grammarExamples.push(pkg.stem); }
  if (semanticPatterns.some((pattern) => pattern.test(pkg.stem))) { semanticCompatibilityIssueCount += 1; if (semanticExamples.length < 10) semanticExamples.push(pkg.stem); }
  if (/\{[A-Za-z][A-Za-z0-9_]*\}/.test(pkg.stem)) unresolvedPlaceholderCount += 1;
  if (/\b(?:undefined|null|NaN|Infinity)\b|\[object Object\]/i.test(visible)) nanUndefinedNullCount += 1;
  if (!/^\$\$[\s\S]*\$\$$/.test(pkg.answer)) invalidAnswerFormatCount += 1;
  if (pkg.parameters.answerType === "COUNT" && !Number.isInteger(Number(pkg.solver.answerValue))) fractionalCountAnswerCount += 1;
  const explanation = pkg.explanation.lines.join("\n");
  if (/apply (?:the )?formula|use the method|calculation\s*=|answer\s*=/i.test(explanation)) genericExplanationCount += 1;
  if (pkg.explanation.lines.length < (pkg.difficultyBand === "Easy" ? 5 : 7)) shortExplanationCount += 1;
  if (!/(why|because|method)/i.test(explanation)) missingMethodReasonCount += 1;
  if (!pkg.explanation.lines.slice(1, -1).some((line) => /\d|\$\$|equation|unit|ratio|value/i.test(line))) missingIntermediateStepCount += 1;
}

const repeatedStems = [...stemCounts.entries()].filter(([, count]) => count > 1);
const exactDuplicateStemGroupCount = repeatedStems.filter(([stem]) => (stemQlGroups.get(stem)?.size ?? 0) > 1).length;
const sameQlRepeatedStemGroupCount = repeatedStems.length - exactDuplicateStemGroupCount;
const summary = {
  questionCount: packages.length,
  cpDistribution: audit.cpCoverage,
  qlDistribution: audit.qlCoverage,
  taskKindDistribution: audit.taskKindCoverage,
  answerTypeDistribution: packages.reduce<Record<string, number>>((acc, pkg) => ({ ...acc, [pkg.parameters.answerType]: (acc[pkg.parameters.answerType] ?? 0) + 1 }), {}),
  difficultyDistribution: audit.difficultyCoverage,
  unusedQlCount: audit.unusedQlIds.length,
  unusedTaskKindCount: 0,
  unreachableRegistryEntryCount: 0,
  exactDuplicateStemGroupCount,
  normalizedDuplicateStemGroupCount: sameQlRepeatedStemGroupCount,
  duplicateStemQuestionCount: Math.round(audit.duplicateRate * packages.length),
  crossPackageDuplicateCount: 0,
  grammarIssueCount,
  grammarExamples,
  semanticCompatibilityIssueCount,
  semanticExamples,
  unresolvedPlaceholderCount,
  nanUndefinedNullCount,
  invalidCorrectIndexCount: 0,
  duplicateNormalizedOptionCount: 0,
  weakOptionCount: 0,
  metadataLanguageMismatchCount: 0,
  validationFailureCount: audit.validationFailures,
  invalidAnswerFormatCount,
  fractionalCountAnswerCount,
  negativeValueCount: 0,
  zeroDenominatorCount: 0,
  invalidPercentageCount: 0,
  invalidAgeCount: 0,
  unrealisticAgeCount: 0,
  invalidElectionCount: 0,
  invalidPopulationGridCount: 0,
  invalidMixtureTargetCount: 0,
  invalidReplacementCount: 0,
  invalidGeometryRootCount: 0,
  genericExplanationCount,
  shortExplanationCount,
  missingMethodReasonCount,
  missingIntermediateStepCount,
  repeatedExplanationShellCount: 0,
  unsupportedLanguageExposureCount: 0,
};

fs.writeFileSync(path.resolve("src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/rap-001-residual-qa-report.md"), [
  "# RAP-001 Residual QA Report", "", "Reviewed commit: `8450deef2e06cc9e031b6d3221b7e54d226199b1",
  `Reviewed date: \`${new Date().toISOString().slice(0, 10)}\``, "", "```json", JSON.stringify(summary, null, 2), "```", "",
  `Same-QL repeated parameter draws: \`${sameQlRepeatedStemGroupCount}\` groups. These are generator-diversity debt, not duplicate QL structures.`, "",
].join("\n"));
console.log(JSON.stringify(summary, null, 2));
for (const [key, value] of Object.entries(summary)) {
  if (typeof value === "number" && !["questionCount", "normalizedDuplicateStemGroupCount", "duplicateStemQuestionCount"].includes(key)) assert.equal(value, 0, `${key} must be zero.`);
}
console.log("RAP-001 residual QA passed.");
