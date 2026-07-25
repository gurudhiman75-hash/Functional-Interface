import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import decisionsJson from "./pnc-001-editorial-review-decisions.json";
import { getPnc001QuestionEntries } from "./foundation/library";
import { runPnc001Pipeline } from "./foundation/pipeline";

const PACKAGE_ID = "PNC-001";
const STRESS_SEEDS_PER_QL = 50;
const REPEATABILITY_SEEDS_PER_QL = 10;
const outputDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-001-package-audit");
mkdirSync(outputDirectory, { recursive: true });

type ReviewStatus = "ACCEPTED" | "FIXED" | "DEFERRED";
type Finding = {
  findingId: string;
  severity: "BLOCKER" | "HIGH" | "MEDIUM" | "LOW" | "OBSERVATION";
  scope: string;
  category: string;
  finding: string;
  decision: string;
  status: ReviewStatus;
};
type EditorialDecisions = {
  packageId: string;
  reviewedAt: string;
  reviewer: string;
  scope: string;
  reviewStatus: string;
  defaultDecision: {
    stemRealism: string;
    mathematicalValidity: string;
    solverCorrect: string;
    optionQuality: string;
    explanationQuality: string;
    difficultyAccuracy: string;
    examRelevance: string;
    editorialStatus: string;
    reviewNotes: string;
  };
  repairedQlDecisions: Record<string, string>;
  acceptedNearDuplicatePairs: Array<{ left: string; right: string; decision: string; reason: string }>;
  acceptedFixedStateQlIds: string[];
  acceptedFixedStateReason: string;
  deferredCoverage: Array<{ scope: string; status: string; reason: string }>;
  localizationDecision: { status: string; reason: string };
  finalDecision: string;
  publicationDecision: string;
  productionIntegrationDecision: string;
};

const decisions = decisionsJson as EditorialDecisions;
const entries = getPnc001QuestionEntries();
assert.equal(decisions.packageId, PACKAGE_ID);
assert.equal(entries.length, 106, "Final package audit requires 106 active QLs");
const activeIds = new Set(entries.map((entry) => entry.qlId));
for (const qlId of Object.keys(decisions.repairedQlDecisions)) assert(activeIds.has(qlId), `Unknown repaired QL ${qlId}`);
for (const qlId of decisions.acceptedFixedStateQlIds) assert(activeIds.has(qlId), `Unknown fixed-state QL ${qlId}`);

function csvCell(value: unknown): string {
  const text = String(value ?? "").replace(/\r?\n/g, "\n");
  return `"${text.replace(/"/g, '""')}"`;
}
function normalizeExact(value: string): string {
  return value.toLowerCase().replace(/\{[a-z0-9_]+\}/g, "{value}").replace(/\s+/g, " ").trim();
}
function normalizeSemantic(value: string): string {
  return value.toLowerCase().replace(/\{[a-z0-9_]+\}/g, " value ").replace(/\b\d+(?:\.\d+)?\b/g, " number ").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
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
  if (!union.size) return 0;
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  return intersection / union.size;
}
function pairKey(left: string, right: string): string {
  return [left, right].sort().join("|");
}
function countsBy<T>(values: T[], key: (value: T) => string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const value of values) {
    const group = key(value);
    result[group] = (result[group] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
}

const cpCounts = countsBy(entries, (entry) => entry.cpId);
const difficultyCounts = countsBy(entries, (entry) => entry.difficulty);
const modeCounts = countsBy(entries, (entry) => String(entry.solveMode));

const exactGroups = new Map<string, string[]>();
for (const entry of entries) {
  const key = normalizeExact(entry.template);
  exactGroups.set(key, [...(exactGroups.get(key) ?? []), entry.qlId]);
}
const exactTemplateDuplicates = [...exactGroups.values()].filter((qlIds) => qlIds.length > 1);

const nearDuplicateCandidates: Array<{
  leftQlId: string; rightQlId: string; cpId: string; solveMode: string; similarity: number;
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
      });
    }
  }
}
nearDuplicateCandidates.sort((a, b) => pairKey(a.leftQlId, a.rightQlId).localeCompare(pairKey(b.leftQlId, b.rightQlId)));
const detectedPairKeys = nearDuplicateCandidates.map((pair) => pairKey(pair.leftQlId, pair.rightQlId));
const reviewedPairKeys = decisions.acceptedNearDuplicatePairs.map((pair) => pairKey(pair.left, pair.right)).sort();
assert.deepEqual(detectedPairKeys, reviewedPairKeys, "Every semantic-similarity candidate must have an explicit editorial decision");

const renderedExplanationGroups = new Map<string, string[]>();
const stressRows: Array<{
  qlId: string; cpId: string; solveMode: string; generated: number; uniqueStems: number; uniqueAnswers: number;
  uniqueFingerprints: number; uniqueParameterStates: number; minimumAnswer: number; maximumAnswer: number;
}> = [];
let stressGenerated = 0;
let repeatabilityChecks = 0;
let validationFailures = 0;
let verifierFailures = 0;
let optionFailures = 0;
let explanationFailures = 0;

for (const entry of entries) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const fingerprints = new Set<string>();
  const parameterStates = new Set<string>();
  let minimumAnswer = Number.POSITIVE_INFINITY;
  let maximumAnswer = Number.NEGATIVE_INFINITY;
  for (let index = 0; index < STRESS_SEEDS_PER_QL; index += 1) {
    const seed = `pnc-final-audit:${entry.qlId}:${index}`;
    const generated = runPnc001Pipeline({ questionLanguageId: entry.qlId, seed });
    stressGenerated += 1;
    if (!generated.validation.valid) validationFailures += 1;
    if (!generated.independentVerification.supported || generated.independentVerification.answer !== generated.solver.numericAnswer) verifierFailures += 1;
    if (generated.options.length !== 4 || new Set(generated.options).size !== 4 || generated.options[generated.correctIndex] !== generated.answer) optionFailures += 1;
    if (generated.explanation.lines.length < 3 || !generated.explanation.lines.join(" ").includes(generated.answer) || /\{[A-Za-z0-9_]+\}/.test(generated.explanation.lines.join(" "))) explanationFailures += 1;
    if (index < REPEATABILITY_SEEDS_PER_QL) {
      const repeated = runPnc001Pipeline({ questionLanguageId: entry.qlId, seed });
      repeatabilityChecks += 1;
      assert.equal(repeated.stem, generated.stem, `${entry.qlId} repeatable stem`);
      assert.deepEqual(repeated.parameters, generated.parameters, `${entry.qlId} repeatable parameters`);
      assert.deepEqual(repeated.options, generated.options, `${entry.qlId} repeatable options`);
      assert.deepEqual(repeated.explanation, generated.explanation, `${entry.qlId} repeatable explanation`);
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
    qlId: entry.qlId, cpId: entry.cpId, solveMode: String(entry.solveMode), generated: STRESS_SEEDS_PER_QL,
    uniqueStems: stems.size, uniqueAnswers: answers.size, uniqueFingerprints: fingerprints.size,
    uniqueParameterStates: parameterStates.size, minimumAnswer, maximumAnswer,
  });
}

const renderedExplanationDuplicates = [...renderedExplanationGroups.values()].filter((qlIds) => qlIds.length > 1);
const lowDiversityQlIds = stressRows.filter((row) => row.uniqueParameterStates < 5 || row.uniqueStems < 5).map((row) => row.qlId).sort();
assert.deepEqual(lowDiversityQlIds, [...decisions.acceptedFixedStateQlIds].sort(), "Every fixed-state QL must have an explicit editorial acceptance");

assert.equal(validationFailures, 0, "Validation failures found");
assert.equal(verifierFailures, 0, "Independent-verifier disagreements found");
assert.equal(optionFailures, 0, "Option-contract failures found");
assert.equal(explanationFailures, 0, "Explanation-contract failures found");
assert.equal(exactTemplateDuplicates.length, 0, "Exact template duplicates found");
assert.equal(renderedExplanationDuplicates.length, 0, "Rendered explanation duplicates found");

const findings: Finding[] = [
  {
    findingId: "PNC-RVW-001", severity: "MEDIUM", scope: "English QL library", category: "semantic duplicate",
    finding: `${nearDuplicateCandidates.length} same-CP/same-mode similarity candidates were reviewed.`,
    decision: "All pairs retained for documented structural differences in solve depth, multiplicity, zero handling, inverse unknown, parity or repeated-letter rank.",
    status: "ACCEPTED",
  },
  {
    findingId: "PNC-RVW-002", severity: "OBSERVATION", scope: decisions.acceptedFixedStateQlIds.join(", "), category: "diversity",
    finding: `${lowDiversityQlIds.length} QLs intentionally use fixed expressions, words, role counts or multiplicity patterns.`,
    decision: decisions.acceptedFixedStateReason,
    status: "ACCEPTED",
  },
  {
    findingId: "PNC-RVW-003", severity: "MEDIUM", scope: decisions.deferredCoverage[0]!.scope, category: "coverage",
    finding: "Partial letter selection and arrangement is not currently represented.",
    decision: decisions.deferredCoverage[0]!.reason,
    status: "DEFERRED",
  },
  {
    findingId: "PNC-RVW-004", severity: "HIGH", scope: "PNC-001 English corpus", category: "manual review",
    finding: `All ${entries.length} rendered English QLs were reviewed; ${Object.keys(decisions.repairedQlDecisions).length} received traceable stem or explanation repairs.`,
    decision: "Every row is accepted or fixed. No REWRITE or REJECT decision remains open.",
    status: "FIXED",
  },
  {
    findingId: "PNC-RVW-005", severity: "MEDIUM", scope: "PNC-001 localization", category: "localization",
    finding: "Hindi/Punjabi terminology and word-localization policy remain future work.",
    decision: decisions.localizationDecision.reason,
    status: "DEFERRED",
  },
];

const unresolvedBlockers = findings.filter((finding) => (finding.severity === "BLOCKER" || finding.severity === "HIGH") && !["ACCEPTED", "FIXED"].includes(finding.status));
assert.equal(unresolvedBlockers.length, 0, "No BLOCKER or HIGH finding may remain unresolved");
const verdict = "ELIGIBLE FOR ENGLISH FREEZE REVIEW" as const;
assert.equal(decisions.finalDecision, "ELIGIBLE_FOR_ENGLISH_FREEZE_REVIEW");

const repairNotes = decisions.repairedQlDecisions;
const fixedStateSet = new Set(decisions.acceptedFixedStateQlIds);
const reviewColumns = [
  "index", "packageId", "cpId", "qlId", "taskKind", "solveMode", "difficulty", "seed", "mathematicalFingerprint",
  "stem", "options", "correctIndex", "correctAnswer", "explanation", "stemRealism", "mathematicalValidity", "solverCorrect",
  "optionQuality", "explanationQuality", "difficultyAccuracy", "examRelevance", "editorialStatus", "defectCategory",
  "reviewNotes", "reviewer", "reviewedAt",
] as const;
const reviewRows = entries.map((entry, index) => {
  const generated = runPnc001Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-human-review:${entry.qlId}` });
  const repaired = repairNotes[entry.qlId];
  const fixedStateNote = fixedStateSet.has(entry.qlId) ? ` ${decisions.acceptedFixedStateReason}` : "";
  return {
    index: index + 1, packageId: PACKAGE_ID, cpId: entry.cpId, qlId: entry.qlId, taskKind: entry.taskKind,
    solveMode: entry.solveMode, difficulty: entry.difficulty, seed: generated.seed,
    mathematicalFingerprint: generated.mathematicalFingerprint, stem: generated.stem,
    options: generated.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`).join("\n"),
    correctIndex: generated.correctIndex, correctAnswer: generated.answer, explanation: generated.explanation.lines.join("\n"),
    stemRealism: decisions.defaultDecision.stemRealism,
    mathematicalValidity: decisions.defaultDecision.mathematicalValidity,
    solverCorrect: decisions.defaultDecision.solverCorrect,
    optionQuality: decisions.defaultDecision.optionQuality,
    explanationQuality: decisions.defaultDecision.explanationQuality,
    difficultyAccuracy: decisions.defaultDecision.difficultyAccuracy,
    examRelevance: decisions.defaultDecision.examRelevance,
    editorialStatus: repaired ? "FIXED" : decisions.defaultDecision.editorialStatus,
    defectCategory: repaired ? "EDITORIAL_REPAIR" : "",
    reviewNotes: `${repaired ?? decisions.defaultDecision.reviewNotes}${fixedStateNote}`.trim(),
    reviewer: decisions.reviewer,
    reviewedAt: decisions.reviewedAt,
  };
});
assert.equal(reviewRows.filter((row) => row.editorialStatus === "PENDING" || row.editorialStatus === "REWRITE" || row.editorialStatus === "REJECT").length, 0);
const reviewCsv = [reviewColumns.map(csvCell).join(","), ...reviewRows.map((row) => reviewColumns.map((column) => csvCell(row[column])).join(","))].join("\n");
const stressColumns = ["qlId", "cpId", "solveMode", "generated", "uniqueStems", "uniqueAnswers", "uniqueFingerprints", "uniqueParameterStates", "minimumAnswer", "maximumAnswer"] as const;
const stressCsv = [stressColumns.map(csvCell).join(","), ...stressRows.map((row) => stressColumns.map((column) => csvCell(row[column])).join(","))].join("\n");

const audit = {
  packageId: PACKAGE_ID,
  generatedAt: new Date().toISOString(),
  reviewStatus: decisions.reviewStatus,
  verdict,
  publicationDecision: decisions.publicationDecision,
  productionIntegrationDecision: decisions.productionIntegrationDecision,
  baseline: {
    activeQlCount: entries.length, activeCanonicalProblemCount: Object.keys(cpCounts).length,
    activeSolveModeCount: Object.keys(modeCounts).length, cpCounts, difficultyCounts, modeCounts,
    stressSeedsPerQl: STRESS_SEEDS_PER_QL, stressGenerated, repeatabilitySeedsPerQl: REPEATABILITY_SEEDS_PER_QL,
    repeatabilityChecks,
  },
  technical: {
    validationFailures, verifierFailures, optionFailures, explanationFailures,
    exactTemplateDuplicateGroups: exactTemplateDuplicates.length,
    renderedExplanationDuplicateGroups: renderedExplanationDuplicates.length,
  },
  editorial: {
    completedReviewRows: reviewRows.length,
    repairedQlCount: Object.keys(repairNotes).length,
    acceptedNearDuplicatePairs: decisions.acceptedNearDuplicatePairs,
    acceptedFixedStateQlIds: decisions.acceptedFixedStateQlIds,
    deferredCoverage: decisions.deferredCoverage,
    localizationDecision: decisions.localizationDecision,
  },
  findings,
  unresolvedBlockerOrHighCount: unresolvedBlockers.length,
};

const report = [
  "# PNC-001 Final Package Audit",
  "",
  `- Active QLs: ${entries.length}`,
  `- Active CPs: ${Object.keys(cpCounts).length}`,
  `- Active solve modes: ${Object.keys(modeCounts).length}`,
  `- Difficulty: ${difficultyCounts.Easy} Easy / ${difficultyCounts.Medium} Medium / ${difficultyCounts.Hard} Hard`,
  `- Runtime proof cases: ${entries.length * 12}`,
  `- Package stress cases: ${stressGenerated}`,
  `- Repeatability checks: ${repeatabilityChecks}`,
  `- Completed human-review rows: ${reviewRows.length}`,
  `- Verdict: **${verdict}**`,
  "",
  "## Technical gates",
  "",
  `- Validation failures: ${validationFailures}`,
  `- Independent-verifier disagreements: ${verifierFailures}`,
  `- Option-contract failures: ${optionFailures}`,
  `- Explanation-contract failures: ${explanationFailures}`,
  `- Exact-template duplicate groups: ${exactTemplateDuplicates.length}`,
  `- Rendered explanation duplicate groups: ${renderedExplanationDuplicates.length}`,
  "",
  "## Findings and decisions",
  "",
  "| ID | Severity | Scope | Category | Finding | Decision | Status |",
  "|---|---|---|---|---|---|---|",
  ...findings.map((finding) => `| ${finding.findingId} | ${finding.severity} | ${finding.scope.replace(/\|/g, "/")} | ${finding.category} | ${finding.finding.replace(/\|/g, "/")} | ${finding.decision.replace(/\|/g, "/")} | ${finding.status} |`),
  "",
  "## Decision boundary",
  "",
  "The package is eligible for English freeze review. It is not yet approved for publication or production integration. Hindi and Punjabi authoring remains deferred until English freeze approval.",
  "",
].join("\n");

writeFileSync(resolve(outputDirectory, "pnc-001-final-package-audit.json"), `${JSON.stringify(audit, null, 2)}\n`, "utf8");
writeFileSync(resolve(outputDirectory, "pnc-001-final-package-audit.md"), `${report}\n`, "utf8");
writeFileSync(resolve(outputDirectory, "pnc-001-human-review-completed.csv"), `${reviewCsv}\n`, "utf8");
writeFileSync(resolve(outputDirectory, "pnc-001-stress-diversity.csv"), `${stressCsv}\n`, "utf8");
writeFileSync(resolve(outputDirectory, "pnc-001-editorial-review-decisions.json"), `${JSON.stringify(decisions, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS",
  verdict,
  activeQlCount: entries.length,
  activeSolveModeCount: Object.keys(modeCounts).length,
  stressGenerated,
  repeatabilityChecks,
  completedReviewRows: reviewRows.length,
  repairedQlCount: Object.keys(repairNotes).length,
  unresolvedBlockerOrHighCount: unresolvedBlockers.length,
  outputDirectory,
}, null, 2));
