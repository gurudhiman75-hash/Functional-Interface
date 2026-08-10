import { generateCanonicalReviewRecords } from "./canonical-review-schema";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const TARGETS = [
  ["speedFromDistanceAndTime", "p1-b04:direct-speed:100", "12 m/s"],
  ["requiredUniformSpeedForDeadline", "p1-b04:deadline-speed:100", "48 km/h"],
  ["unknownTimeShareFromAverageSpeed", "p1-b04:time-share:37.5:0", "37.5%"],
  ["timeRatioFromAverageAndSpeeds", "p1-b04:time-ratio:5:3:1", "5:3"],
  ["averageSpeedFromSegments", "p1-b04:average-speed:equal-time:63:2", "63 km/h"],
  ["segmentAllocationFromTotalsAndSpeeds", "p1-b04:allocation:first-distance:67.5:3", "67.5 km"],
  ["compareSegmentedJourneyPlans", "p1-b04:compare-plans:two-ledgers:4", "Plan B"],
] as const;

const EXPECTED_ROW_COUNTS = new Map<string, number>([
  ["speedFromDistanceAndTime", 4],
  ["requiredUniformSpeedForDeadline", 4],
  ["unknownTimeShareFromAverageSpeed", 4],
  ["timeRatioFromAverageAndSpeeds", 4],
  ["averageSpeedFromSegments", 5],
  ["segmentAllocationFromTotalsAndSpeeds", 6],
  ["compareSegmentedJourneyPlans", 4],
]);

function normalizedTemplate(stem: string): string {
  return stem.toLowerCase()
    .replace(/\d+(?:,\d{3})*(?:\.\d+)?(?:\/\d+)?(?::\d+(?:\.\d+)?)?/g, "<n>")
    .replace(/\b(am|pm)\b/g, "<meridiem>")
    .replace(/\b(test vehicle|field inspection vehicle|service vehicle|machine carrier|field survey vehicle|transport vehicle|vehicle|car|bus|driver|carrier)\b/g, "<actor>")
    .replace(/\s+/g, " ").trim();
}

const rows = generateCanonicalReviewRecords();
assert(rows.length >= 139, "Batch 04 compatibility gate lost canonical review records");
assert(new Set(rows.map((row) => row.solveMode)).size === 38, "Batch 04 changed the learner authority boundary");
assert(rows.every((row) => row.validation.valid), "Invalid record entered Batch 04");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL assigned during Batch 04");
assert(rows.every((row) => row.lifecycle.reviewStatus === "EDITORIAL_REVIEW_REQUIRED"), "Review lifecycle changed during Batch 04");
assert(rows.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN"), "Batch 04 accidentally refroze English");
assert(rows.every((row) => row.lifecycle.questionBankStatus === "NOT_STORED"), "Batch 04 enabled Question Bank storage");
assert(rows.every((row) => row.lifecycle.testEligibility === "INELIGIBLE"), "Batch 04 enabled test delivery");
assert(rows.every((row) => !row.lifecycle.publiclyPublishable), "Batch 04 enabled public delivery");

const supplementalRows = TARGETS.map(([mode, seed, expectedAnswer]) => {
  const row = rows.find((candidate) => candidate.solveMode === mode && candidate.seed === seed);
  assert(row, `${mode}: Batch 04 supplement ${seed} is missing`);
  assert(row.answerText === expectedAnswer, `${mode}: expected ${expectedAnswer}, received ${row.answerText}`);
  assert(row.options.length === 4 && new Set(row.options).size === 4, `${mode}: option uniqueness failed`);
  assert(row.options[row.correctIndex] === row.answerText, `${mode}: answer key mismatch`);
  assert(row.optionAudit.filter((entry) => entry.isCorrect).length === 1, `${mode}: invalid correct-option count`);
  assert(row.explanation.steps.length >= 5, `${mode}: explanation is incomplete`);
  assert(row.explanation.optionAnalysis.length === 4, `${mode}: option analysis is incomplete`);
  assert(row.explanation.optionAnalysis.every((entry) => entry.reason.includes(entry.text)), `${mode}: option reason is not value-specific`);
  return row;
});

for (const [mode] of TARGETS) {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  assert(modeRows.length >= (EXPECTED_ROW_COUNTS.get(mode) ?? 0), `${mode}: Batch 04 review states were lost`);
  assert(new Set(modeRows.map((row) => row.answerText)).size >= 3, `${mode}: answer pool remains too repetitive`);
  assert(new Set(modeRows.map((row) => normalizedTemplate(row.stem))).size >= 2, `${mode}: material stem-template diversity is missing`);
  assert(new Set(modeRows.map((row) => row.sourceTrace.mathematicalFingerprint)).size === modeRows.length, `${mode}: mathematical state repeated`);
}

const planRows = rows.filter((row) => row.solveMode === "compareSegmentedJourneyPlans");
const planTemplateCount = new Set(planRows.map((row) => normalizedTemplate(row.stem))).size;
assert(new Set(planRows.map((row) => row.answerText)).size === 3, "Plan-comparison answer coverage regressed");
assert(planTemplateCount >= 3, "Plan-comparison stem structures remain too repetitive");

const fixedCp002Rows = supplementalRows.filter((row) => row.checkpointId === "TSD-CP-002");
const printedNumbers = fixedCp002Rows.flatMap((row) => row.stem.match(/\d+(?:\.\d+)?/g) ?? []);
const concentratedUses = printedNumbers.filter((value) => value === "30" || value === "40" || value === "60").length;
assert(concentratedUses === 0, "Batch 04 fixed CP-002 supplements reused the concentrated 30/40/60 family");
assert(new Set(supplementalRows.map((row) => row.questionLanguageId)).size === supplementalRows.length, "Batch 04 questionLanguageId values are not unique");
assert(new Set(supplementalRows.map((row) => row.representation)).size === supplementalRows.length, "Batch 04 supplement representation IDs are not unique");

console.log(JSON.stringify({
  status: "PASS",
  phase: "P1_DIVERSITY_BATCH_04_COMPATIBILITY",
  canonicalRecords: rows.length,
  targetedAuthorities: TARGETS.length,
  supplementalRows: supplementalRows.length,
  supplementalAnswers: supplementalRows.map((row) => row.answerText),
  planComparisonTemplates: planTemplateCount,
  fixedCp002PrintedNumbers: printedNumbers.length,
  fixedCp002304060Uses: concentratedUses,
  permanentQlIdsAssigned: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
