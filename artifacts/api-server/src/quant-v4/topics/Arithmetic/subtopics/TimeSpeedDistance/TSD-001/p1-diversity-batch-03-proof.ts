import { generateCanonicalReviewRecords } from "./canonical-review-schema";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const TARGETS = [
  ["unknownSegmentSpeedFromAverage", "p1-b03:unknown-speed:126", "126 km/h"],
  ["unknownSegmentTimeFromAverage", "p1-b03:unknown-time:1.5", "1.5 hours"],
  ["unknownSegmentDistanceFromAverage", "p1-b03:unknown-distance:120", "120 km"],
  ["unknownRoundTripLegSpeedFromAverage", "p1-b03:roundtrip-speed:84", "84 km/h"],
  ["oneWayDistanceFromRoundTripData", "p1-b03:one-way-distance:144", "144 km"],
  ["roundTripLegTimeSum", "p1-b03:roundtrip-time:5", "5 hours"],
  ["requiredRemainingSpeedForTargetAverage", "p1-b03:target-average:84", "84 km/h"],
] as const;

function normalizedTemplate(stem: string): string {
  return stem.toLowerCase()
    .replace(/\d+(?:\.\d+)?/g, "<n>")
    .replace(/\b(courier|transport log|service vehicle|survey vehicle|technician|maintenance team|driver)\b/g, "<context>")
    .replace(/\s+/g, " ").trim();
}

const rows = generateCanonicalReviewRecords();
assert(rows.length === 125, "Batch 03 must expose 125 canonical review records");
assert(new Set(rows.map((row) => row.solveMode)).size === 38, "Batch 03 changed the learner authority boundary");
assert(rows.every((row) => row.validation.valid), "Invalid record entered Batch 03");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL assigned during Batch 03");
assert(rows.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN"), "Batch 03 accidentally refroze English");

const supplementalRows = TARGETS.map(([mode, seed, expectedAnswer]) => {
  const row = rows.find((candidate) => candidate.solveMode === mode && candidate.seed === seed);
  assert(row, `${mode}: Batch 03 supplement is missing`);
  assert(row.answerText === expectedAnswer, `${mode}: expected ${expectedAnswer}, received ${row.answerText}`);
  assert(row.options.length === 4 && new Set(row.options).size === 4, `${mode}: option uniqueness failed`);
  assert(row.options[row.correctIndex] === row.answerText, `${mode}: answer key mismatch`);
  assert(row.explanation.steps.length >= 5, `${mode}: explanation is incomplete`);
  assert(row.explanation.optionAnalysis.length === 4, `${mode}: option analysis is incomplete`);
  assert(row.explanation.optionAnalysis.every((entry) => entry.reason.includes(entry.text)), `${mode}: option reason is not value-specific`);
  return row;
});

for (const [mode] of TARGETS) {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  assert(modeRows.length === 4, `${mode}: expected three inherited rows plus one Batch 03 supplement`);
  assert(new Set(modeRows.map((row) => row.answerText)).size >= 3, `${mode}: answer pool remains too repetitive`);
  assert(new Set(modeRows.map((row) => normalizedTemplate(row.stem))).size >= 2, `${mode}: no material stem-template expansion`);
  assert(new Set(modeRows.map((row) => row.sourceTrace.mathematicalFingerprint)).size === modeRows.length, `${mode}: mathematical state repeated`);
}

const printedNumbers = supplementalRows.flatMap((row) => row.stem.match(/\d+(?:\.\d+)?/g) ?? []);
const canonicalFamilyUses = printedNumbers.filter((value) => value === "30" || value === "40" || value === "60").length;
assert(canonicalFamilyUses === 0, "Batch 03 supplements reused the concentrated 30/40/60 family");
assert(new Set(supplementalRows.map((row) => row.questionLanguageId)).size === supplementalRows.length, "Batch 03 language IDs are not unique");
assert(new Set(supplementalRows.map((row) => row.representation)).size === supplementalRows.length, "Batch 03 representations are not unique");

console.log(JSON.stringify({
  status: "PASS",
  phase: "P1_DIVERSITY_BATCH_03",
  canonicalRecords: rows.length,
  targetedAuthorities: TARGETS.length,
  supplementalRows: supplementalRows.length,
  supplementalAnswers: supplementalRows.map((row) => row.answerText),
  supplementalPrintedNumbers: printedNumbers.length,
  supplemental304060Uses: canonicalFamilyUses,
  permanentQlIdsAssigned: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
