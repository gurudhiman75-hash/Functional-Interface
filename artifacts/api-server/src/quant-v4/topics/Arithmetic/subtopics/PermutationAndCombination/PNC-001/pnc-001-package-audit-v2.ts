import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getPnc001QuestionEntries } from "./foundation/library";
import { runPnc001Pipeline } from "./foundation/pipeline";

const PACKAGE_ID = "PNC-001";
const STRESS_SEEDS_PER_QL = 50;
const REPEATABILITY_SEEDS_PER_QL = 10;
const outputDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-001-package-audit");
mkdirSync(outputDirectory, { recursive: true });

function csvCell(value: unknown): string {
  const text = String(value ?? "").replace(/\r?\n/g, "\n");
  return `"${text.replace(/"/g, '""')}"`;
}

function normalizeExact(value: string): string {
  return value
    .toLowerCase()
    .replace(/\{[a-z0-9_]+\}/g, "{value}")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSemantic(value: string): string {
  return value
    .toLowerCase()
    .replace(/\{[a-z0-9_]+\}/g, " value ")
    .replace(/\b\d+(?:\.\d+)?\b/g, " number ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const stopWords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "each", "every", "find", "for", "from",
  "has", "have", "how", "if", "in", "into", "is", "it", "many", "may", "number", "of", "one", "or",
  "the", "there", "these", "this", "to", "value", "ways", "what", "when", "which", "with",
]);

function tokenSet(value: string): Set<string> {
  return new Set(normalizeSemantic(value).split(" ").filter((token) => token.length > 2 && !stopWords.has(token)));
}

function jaccard(left: Set<string>, right: Set<string>): number {
  const union = new Set([...left, ...right]);
  if (union.size === 0) return 0;
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  return intersection / union.size;
}

function countsBy<T>(values: T[], key: (value: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) {
    const group = key(value);
    counts[group] = (counts[group] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

type Severity = "BLOCKER" | "HIGH" | "MEDIUM" | "LOW" | "OBSERVATION";
type Finding = {
  findingId: string;
  severity: Severity;
  scope: string;
  category: string;
  finding: string;
  requiredAction: string;
  status: "OPEN" | "FIXED" | "ACCEPTED" | "DEFERRED";
};

const entries = getPnc001QuestionEntries();
assert.equal(entries.length, 104, "Audit baseline must contain 104 active QLs");

const cpCounts = countsBy(entries, (entry) => entry.cpId);
const modeCounts = countsBy(entries, (entry) => String(entry.solveMode));
const scenarioCounts = countsBy(entries, (entry) => `${entry.cpId}|${entry.scenarioFamily}`);

const exactGroups = new Map<string, string[]>();
for (const entry of entries) {
  const key = normalizeExact(entry.template);
  exactGroups.set(key, [...(exactGroups.get(key) ?? []), entry.qlId]);
}
const exactTemplateDuplicates = [...exactGroups.entries()]
  .filter(([, qlIds]) => qlIds.length > 1)
  .map(([template, qlIds]) => ({ template, qlIds }));

const nearDuplicateCandidates: Array<{
  leftQlId: string;
  rightQlId: string;
  cpId: string;
  solveMode: string;
  similarity: number;
  leftTemplate: string;
  rightTemplate: string;
}> = [];
for (let leftIndex = 0; leftIndex < entries.length; leftIndex += 1) {
  const left = entries[leftIndex]!;
  for (let rightIndex = leftIndex + 1; rightIndex < entries.length; rightIndex += 1) {
    const right = entries[rightIndex]!;
    if (left.cpId !== right.cpId || String(left.solveMode) !== String(right.solveMode)) continue;
    const similarity = jaccard(tokenSet(left.template), tokenSet(right.template));
    if (similarity >= 0.62) {
      nearDuplicateCandidates.push({
        leftQlId: left.qlId,
        rightQlId: right.qlId,
        cpId: left.cpId,
        solveMode: String(left.solveMode),
        similarity: Number(similarity.toFixed(3)),
        leftTemplate: left.template,
        rightTemplate: right.template,
      });
    }
  }
}
nearDuplicateCandidates.sort((a, b) => b.similarity - a.similarity || a.leftQlId.localeCompare(b.leftQlId));

const ownershipFlags: Array<{ severity: Severity; qlId: string; cpId: string; reason: string; template: string }> = [];
for (const entry of entries) {
  const original = entry.template.toLowerCase();
  if (entry.cpId === "PNC-CP-002" && /leading\s+zero|divisib|\beven\b|\bodd\b|\bdigits?\b/.test(original)) {
    ownershipFlags.push({
      severity: "HIGH",
      qlId: entry.qlId,
      cpId: entry.cpId,
      reason: "CP-002 contains number-specific semantics owned by CP-004.",
      template: entry.template,
    });
  }
  if (entry.cpId === "PNC-CP-003" && /\bchair(person)?\b|\bcaptain\b|\boffices?\b|\bmedals?\b|\branked?\b/.test(original)) {
    ownershipFlags.push({
      severity: "HIGH",
      qlId: entry.qlId,
      cpId: entry.cpId,
      reason: "CP-003 appears to assign an ordered role inside unordered-selection ownership.",
      template: entry.template,
    });
  }
}

const contextConcentration = Object.entries(cpCounts).map(([cpId, total]) => {
  const families = Object.entries(scenarioCounts)
    .filter(([key]) => key.startsWith(`${cpId}|`))
    .map(([key, count]) => ({ scenarioFamily: key.slice(cpId.length + 1), count, share: Number((count / total).toFixed(3)) }))
    .sort((a, b) => b.count - a.count || a.scenarioFamily.localeCompare(b.scenarioFamily));
  return { cpId, total, largestFamily: families[0] ?? null, families };
});

const stressRows: Array<{
  qlId: string;
  cpId: string;
  solveMode: string;
  generated: number;
  uniqueStems: number;
  uniqueAnswers: number;
  uniqueFingerprints: number;
  uniqueParameterStates: number;
  minimumAnswer: number;
  maximumAnswer: number;
}> = [];
let stressGenerated = 0;
let repeatabilityChecks = 0;
let validationFailures = 0;
let verifierFailures = 0;
let optionFailures = 0;
let explanationFailures = 0;
const renderedExplanationGroups = new Map<string, string[]>();

for (const entry of entries) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const fingerprints = new Set<string>();
  const parameterStates = new Set<string>();
  let minimumAnswer = Number.POSITIVE_INFINITY;
  let maximumAnswer = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < STRESS_SEEDS_PER_QL; index += 1) {
    const seed = `pnc-package-audit-v2:${entry.qlId}:${index}`;
    const generated = runPnc001Pipeline({ questionLanguageId: entry.qlId, seed });
    stressGenerated += 1;

    if (!generated.validation.valid) validationFailures += 1;
    if (generated.independentVerification.answer !== generated.solver.numericAnswer) verifierFailures += 1;
    if (new Set(generated.options).size !== 4 || generated.options[generated.correctIndex] !== generated.answer) optionFailures += 1;
    if (generated.explanation.lines.length < 3 || !generated.explanation.lines.join(" ").includes(generated.answer)) explanationFailures += 1;

    if (index < REPEATABILITY_SEEDS_PER_QL) {
      const repeated = runPnc001Pipeline({ questionLanguageId: entry.qlId, seed });
      repeatabilityChecks += 1;
      assert.equal(repeated.stem, generated.stem, `${entry.qlId} repeatability stem`);
      assert.deepEqual(repeated.options, generated.options, `${entry.qlId} repeatability options`);
      assert.equal(repeated.answer, generated.answer, `${entry.qlId} repeatability answer`);
      assert.deepEqual(repeated.explanation, generated.explanation, `${entry.qlId} repeatability explanation`);
    }

    stems.add(generated.stem);
    answers.add(generated.answer);
    fingerprints.add(generated.mathematicalFingerprint);
    parameterStates.add(JSON.stringify(generated.parameters.values));
    minimumAnswer = Math.min(minimumAnswer, generated.solver.numericAnswer);
    maximumAnswer = Math.max(maximumAnswer, generated.solver.numericAnswer);

    if (index === 0) {
      const normalized = normalizeSemantic(generated.explanation.lines.join(" "));
      renderedExplanationGroups.set(normalized, [...(renderedExplanationGroups.get(normalized) ?? []), entry.qlId]);
    }
  }

  stressRows.push({
    qlId: entry.qlId,
    cpId: entry.cpId,
    solveMode: String(entry.solveMode),
    generated: STRESS_SEEDS_PER_QL,
    uniqueStems: stems.size,
    uniqueAnswers: answers.size,
    uniqueFingerprints: fingerprints.size,
    uniqueParameterStates: parameterStates.size,
    minimumAnswer,
    maximumAnswer,
  });
}

const renderedExplanationDuplicates = [...renderedExplanationGroups.entries()]
  .filter(([, qlIds]) => qlIds.length > 1)
  .map(([explanation, qlIds]) => ({ explanation, qlIds }));
const lowDiversityRows = stressRows.filter((row) => row.uniqueParameterStates < 5 || row.uniqueStems < 5);

const findings: Finding[] = [];
function addFinding(severity: Severity, scope: string, category: string, finding: string, requiredAction: string): void {
  findings.push({
    findingId: `PNC-RVW-${String(findings.length + 1).padStart(3, "0")}`,
    severity,
    scope,
    category,
    finding,
    requiredAction,
    status: "OPEN",
  });
}

if (validationFailures || verifierFailures || optionFailures || explanationFailures) {
  addFinding(
    "BLOCKER",
    "PNC-001 runtime",
    "runtime",
    `Stress failures: validation=${validationFailures}, verifier=${verifierFailures}, options=${optionFailures}, explanations=${explanationFailures}.`,
    "Repair every failing seed and rerun the complete package audit.",
  );
}
for (const flag of ownershipFlags) addFinding(flag.severity, flag.qlId, "ownership", flag.reason, "Rewrite or reclassify the QL.");
if (exactTemplateDuplicates.length > 0) {
  addFinding("HIGH", "English QL library", "duplicate", `${exactTemplateDuplicates.length} literal-normalized exact-template group(s) remain.`, "Remove or materially differentiate exact duplicates.");
}
if (nearDuplicateCandidates.length > 0) {
  addFinding("MEDIUM", "English QL library", "semantic duplicate", `${nearDuplicateCandidates.length} same-CP/same-mode similarity candidate(s) require human review.`, "Retain only pairs with a documented structural, difficulty, context or localization distinction.");
}
if (lowDiversityRows.length > 0) {
  addFinding("OBSERVATION", lowDiversityRows.map((row) => row.qlId).join(", "), "diversity", `${lowDiversityRows.length} QL(s) generated fewer than five states over 50 seeds; many are intentionally fixed-word or fixed-expression families.`, "Classify each during human review; widen only where fixedness is not pedagogically intended.");
}

const cp005Modes = new Set(entries.filter((entry) => entry.cpId === "PNC-CP-005").map((entry) => String(entry.solveMode)));
const cp005HasDictionaryRank = [...cp005Modes].some((mode) => /rank|dictionary/i.test(mode));
const cp005HasPartialLetterSelection = [...cp005Modes].some((mode) => /select.*letter|partial.*multiset/i.test(mode));
if (!cp005HasDictionaryRank) {
  addFinding(
    "HIGH",
    "PNC-CP-005",
    "coverage",
    "Dictionary-order/rank word arrangements are absent although CP-005 ownership admits curated dictionary-rank questions and SSC reference material contains this family.",
    "Implement a bounded dictionary-rank contract with independent enumeration and admit only evidence-backed QLs.",
  );
}
if (!cp005HasPartialLetterSelection) {
  addFinding(
    "MEDIUM",
    "PNC-CP-005",
    "coverage",
    "Selecting and arranging a subset of letters where repeated-letter identity changes the count is not represented.",
    "Compare against CP-006; add a CP-005 contract only if multiset identity materially changes solver and validator behavior.",
  );
}

for (const row of contextConcentration) {
  if (row.total >= 8 && row.largestFamily && row.largestFamily.share > 0.45) {
    addFinding("MEDIUM", row.cpId, "editorial", `${row.largestFamily.scenarioFamily} accounts for ${(row.largestFamily.share * 100).toFixed(1)}% of the CP.`, "Review concentration and diversify only when it adds real exam or localization value.");
  }
}
if (renderedExplanationDuplicates.length > 0) {
  addFinding("HIGH", "English explanations", "explanation", `${renderedExplanationDuplicates.length} rendered explanation duplicate group(s) remain.`, "Rewrite the affected QL-specific narratives.");
}
addFinding("HIGH", "PNC-001 English corpus", "manual review", "Automated proof does not constitute completed human review of all active QLs.", "Complete the generated 104-row review CSV and close all REWRITE/REJECT rows before English freeze.");
addFinding("MEDIUM", "PNC-001 localization", "localization", "Hindi/Punjabi terminology and CP-005 word-localization policy are not human-approved.", "Freeze English first, then approve terminology and word-handling policy.");

const blockingFindings = findings.filter((finding) => finding.severity === "BLOCKER" || finding.severity === "HIGH");
const verdict = blockingFindings.length > 0 ? "REPAIR REQUIRED" : "ELIGIBLE FOR ENGLISH FREEZE REVIEW";

const audit = {
  packageId: PACKAGE_ID,
  generatedAt: new Date().toISOString(),
  baseline: { activeQlCount: entries.length, cpCounts, modeCounts, stressSeedsPerQl: STRESS_SEEDS_PER_QL, stressGenerated, repeatabilityChecks },
  technical: { validationFailures, verifierFailures, optionFailures, explanationFailures, exactTemplateDuplicates, renderedExplanationDuplicates },
  editorial: { scenarioCounts, contextConcentration, nearDuplicateCandidates, lowDiversityRows, ownershipFlags },
  coverage: { cp005HasDictionaryRank, cp005HasPartialLetterSelection },
  findings,
  blockingFindingCount: blockingFindings.length,
  verdict,
};

const report = [
  "# PNC-001 Package-Wide Audit Results",
  "",
  `- Generated: ${audit.generatedAt}`,
  `- Active QLs: ${entries.length}`,
  `- Stress cases: ${stressGenerated} (${STRESS_SEEDS_PER_QL} per QL)`,
  `- Repeatability checks: ${repeatabilityChecks}`,
  `- Verdict: **${verdict}**`,
  "",
  "## Technical evidence",
  "",
  `- Validation failures: ${validationFailures}`,
  `- Independent-verifier disagreements: ${verifierFailures}`,
  `- Option-contract failures: ${optionFailures}`,
  `- Explanation-contract failures: ${explanationFailures}`,
  `- Literal-normalized exact-template duplicate groups: ${exactTemplateDuplicates.length}`,
  `- Rendered explanation duplicate groups: ${renderedExplanationDuplicates.length}`,
  "",
  "## Editorial and coverage signals",
  "",
  `- Near-duplicate candidates: ${nearDuplicateCandidates.length}`,
  `- Low-diversity observations: ${lowDiversityRows.length}`,
  `- Ownership flags: ${ownershipFlags.length}`,
  `- CP-005 dictionary-rank contract present: ${cp005HasDictionaryRank ? "Yes" : "No"}`,
  `- CP-005 partial-letter-selection contract present: ${cp005HasPartialLetterSelection ? "Yes" : "No"}`,
  "",
  "## Findings",
  "",
  "| ID | Severity | Scope | Category | Finding | Required action | Status |",
  "|---|---|---|---|---|---|---|",
  ...findings.map((finding) => `| ${finding.findingId} | ${finding.severity} | ${finding.scope.replace(/\|/g, "/")} | ${finding.category} | ${finding.finding.replace(/\|/g, "/")} | ${finding.requiredAction.replace(/\|/g, "/")} | ${finding.status} |`),
  "",
  "## Freeze decision",
  "",
  `**${verdict}**`,
  "",
  "Technical automation is clean only when this job passes. English freeze additionally requires closure of all HIGH findings and the full human-review CSV.",
  "",
].join("\n");

const reviewColumns = [
  "index", "packageId", "cpId", "qlId", "taskKind", "solveMode", "difficulty", "seed", "mathematicalFingerprint",
  "stem", "options", "correctIndex", "correctAnswer", "explanation", "stemRealism", "mathematicalValidity", "solverCorrect",
  "optionQuality", "explanationQuality", "difficultyAccuracy", "examRelevance", "editorialStatus", "defectCategory",
  "reviewNotes", "reviewer", "reviewedAt",
] as const;
const reviewRows = entries.map((entry, index) => {
  const generated = runPnc001Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-human-review:${entry.qlId}` });
  return {
    index: index + 1,
    packageId: PACKAGE_ID,
    cpId: entry.cpId,
    qlId: entry.qlId,
    taskKind: entry.taskKind,
    solveMode: entry.solveMode,
    difficulty: entry.difficulty,
    seed: generated.seed,
    mathematicalFingerprint: generated.mathematicalFingerprint,
    stem: generated.stem,
    options: generated.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`).join("\n"),
    correctIndex: generated.correctIndex,
    correctAnswer: generated.answer,
    explanation: generated.explanation.lines.join("\n"),
    stemRealism: "",
    mathematicalValidity: "",
    solverCorrect: "",
    optionQuality: "",
    explanationQuality: "",
    difficultyAccuracy: "",
    examRelevance: "",
    editorialStatus: "PENDING",
    defectCategory: "",
    reviewNotes: "",
    reviewer: "",
    reviewedAt: "",
  };
});
const reviewCsv = [reviewColumns.map(csvCell).join(","), ...reviewRows.map((row) => reviewColumns.map((column) => csvCell(row[column])).join(","))].join("\n");
const stressColumns = ["qlId", "cpId", "solveMode", "generated", "uniqueStems", "uniqueAnswers", "uniqueFingerprints", "uniqueParameterStates", "minimumAnswer", "maximumAnswer"] as const;
const stressCsv = [stressColumns.map(csvCell).join(","), ...stressRows.map((row) => stressColumns.map((column) => csvCell(row[column])).join(","))].join("\n");

writeFileSync(resolve(outputDirectory, "pnc-001-package-audit.json"), `${JSON.stringify(audit, null, 2)}\n`, "utf8");
writeFileSync(resolve(outputDirectory, "pnc-001-package-audit.md"), `${report}\n`, "utf8");
writeFileSync(resolve(outputDirectory, "pnc-001-human-review.csv"), `${reviewCsv}\n`, "utf8");
writeFileSync(resolve(outputDirectory, "pnc-001-stress-diversity.csv"), `${stressCsv}\n`, "utf8");

assert.equal(validationFailures, 0, "Validation failures found");
assert.equal(verifierFailures, 0, "Independent-verifier disagreements found");
assert.equal(optionFailures, 0, "Option-contract failures found");
assert.equal(explanationFailures, 0, "Explanation-contract failures found");
assert.equal(exactTemplateDuplicates.length, 0, "Literal-normalized exact-template duplicates found");
assert.equal(renderedExplanationDuplicates.length, 0, "Rendered explanation duplicates found");

console.log(JSON.stringify({ status: "PASS_WITH_REVIEW_FINDINGS", verdict, stressGenerated, repeatabilityChecks, findings: findings.length, blockingFindings: blockingFindings.length, outputDirectory }, null, 2));
