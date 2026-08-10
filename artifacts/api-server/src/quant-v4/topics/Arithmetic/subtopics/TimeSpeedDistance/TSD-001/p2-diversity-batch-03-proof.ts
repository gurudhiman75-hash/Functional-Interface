import { generateCanonicalReviewRecords } from "./canonical-review-schema";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const TARGET_ROWS = [
  ["unknownDistanceShareFromAverageSpeed", "p2-b03:distance-share:20:2", "20%"],
  ["unknownDistanceShareFromAverageSpeed", "p2-b03:distance-share:80:12", "80%"],
  ["unknownRoundTripLegSpeedFromAverage", "p2-b03:return-speed:108:6", "108 km/h"],
  ["unknownRoundTripLegSpeedFromAverage", "p2-b03:return-speed:126:11", "126 km/h"],
  ["oneWayDistanceFromRoundTripData", "p2-b03:one-way-distance:135:3", "135 km"],
  ["unknownTimeShareFromAverageSpeed", "p2-b03:time-share:75:7", "75%"],
  ["timeRatioFromAverageAndSpeeds", "p2-b03:time-ratio:2:3:3", "2:3"],
  ["unknownSegmentTimeFromAverage", "p2-b03:unknown-time:2.5:7", "2.5 hours"],
] as const;

const AUTHORITY_GATES = [
  ["unknownDistanceShareFromAverageSpeed", 5, 5, 5, 0.30],
  ["unknownRoundTripLegSpeedFromAverage", 6, 5, 6, 1 / 3],
  ["oneWayDistanceFromRoundTripData", 5, 4, 5, 0.27],
  ["unknownTimeShareFromAverageSpeed", 5, 4, 5, 0.25],
  ["timeRatioFromAverageAndSpeeds", 5, 4, 5, 0.20],
  ["unknownSegmentTimeFromAverage", 5, 4, 5, 0.10],
] as const;

function normalizedTemplate(stem: string): string {
  return stem.toLowerCase()
    .replace(/\d+(?:,\d{3})*(?:\.\d+)?(?:\/\d+)?(?::\d+(?:\.\d+)?)?/g, "<n>")
    .replace(/\b(car|bus|rider|cyclist|vehicle|van|courier|traveller|truck|field engineer|survey crew|maintenance unit|test fleet|distribution vehicle|research vehicle|refrigerated carrier|endurance support vehicle|delivery van|service vehicle|machine carrier|transport log|technician)\b/g, "<context>")
    .replace(/\s+/g, " ").trim();
}

function printedNumbers(stem: string): readonly string[] {
  return stem.match(/\d+(?:\.\d+)?/g) ?? [];
}

function concentratedFamilyUses(stems: readonly string[]): number {
  return stems.flatMap(printedNumbers)
    .filter((value) => value === "30" || value === "40" || value === "60").length;
}

const rows = generateCanonicalReviewRecords();
assert(rows.length === 153, "P2 Batch 03 must expose 153 canonical records");
assert(new Set(rows.map((row) => row.solveMode)).size === 38, "P2 Batch 03 changed learner authority ownership");
assert(rows.every((row) => row.validation.valid), "Invalid row entered P2 Batch 03");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL assigned during P2 Batch 03");
assert(rows.every((row) => row.lifecycle.reviewStatus === "EDITORIAL_REVIEW_REQUIRED"), "P2 Batch 03 changed review status");
assert(rows.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN"), "P2 Batch 03 accidentally refroze English");
assert(rows.every((row) => row.lifecycle.questionBankStatus === "NOT_STORED"), "P2 Batch 03 enabled Question Bank storage");
assert(rows.every((row) => row.lifecycle.testEligibility === "INELIGIBLE"), "P2 Batch 03 enabled test delivery");
assert(rows.every((row) => !row.lifecycle.publiclyPublishable), "P2 Batch 03 enabled public delivery");

const supplements = rows.filter((row) => row.sourceTrace.mathematicalFingerprint.startsWith("P2-BATCH-03|"));
assert(supplements.length === TARGET_ROWS.length, "P2 Batch 03 must add exactly eight supplements");
assert(new Set(supplements.map((row) => row.questionLanguageId)).size === supplements.length, "P2 Batch 03 language IDs are not unique");
assert(new Set(supplements.map((row) => row.representation)).size === supplements.length, "P2 Batch 03 representations are not unique");
assert(new Set(supplements.map((row) => row.sourceTrace.mathematicalFingerprint)).size === supplements.length, "P2 Batch 03 mathematical states are not unique");

const checkedRows = TARGET_ROWS.map(([mode, seed, expectedAnswer]) => {
  const row = supplements.find((candidate) => candidate.solveMode === mode && candidate.seed === seed);
  assert(row, `${mode}: P2 Batch 03 supplement ${seed} is missing`);
  assert(row.answerText === expectedAnswer, `${mode}: expected ${expectedAnswer}, received ${row.answerText}`);
  assert(row.options.length === 4 && new Set(row.options).size === 4, `${mode}: option uniqueness failed`);
  assert(row.options[row.correctIndex] === row.answerText, `${mode}: answer key mismatch`);
  assert(row.optionAudit.filter((entry) => entry.isCorrect).length === 1, `${mode}: invalid correct-option count`);
  assert(row.explanation.steps.length >= 5, `${mode}: explanation is incomplete`);
  assert(row.explanation.optionAnalysis.length === 4, `${mode}: option analysis is incomplete`);
  assert(row.explanation.optionAnalysis.every((entry) => entry.reason.includes(entry.text)), `${mode}: option reason is not value-specific`);
  assert(concentratedFamilyUses([row.stem, row.answerText]) === 0, `${mode}: P2 Batch 03 reused the 30/40/60 family`);
  assert(!/^(?:A|An|The)\s+(?:car|bus)\b/i.test(row.stem), `${mode}: P2 Batch 03 reused a dominant car/bus opening`);
  return row;
});

for (const [mode, expectedRows, minimumAnswers, minimumTemplates, maximumFamilyShare] of AUTHORITY_GATES) {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  const numbers = modeRows.flatMap((row) => printedNumbers(row.stem));
  const familyUses = concentratedFamilyUses(modeRows.map((row) => row.stem));
  assert(modeRows.length === expectedRows, `${mode}: expected ${expectedRows} review states after P2 Batch 03`);
  assert(new Set(modeRows.map((row) => row.answerText)).size >= minimumAnswers, `${mode}: answer pool remains too repetitive`);
  assert(new Set(modeRows.map((row) => normalizedTemplate(row.stem))).size >= minimumTemplates, `${mode}: stem-template pool remains too repetitive`);
  assert(new Set(modeRows.map((row) => row.sourceTrace.mathematicalFingerprint)).size === modeRows.length, `${mode}: mathematical state repeated`);
  assert(familyUses / numbers.length <= maximumFamilyShare + Number.EPSILON, `${mode}: concentrated number-family share remains too high`);
}

const dominantOpenings = rows.filter((row) => /^(?:A|An|The)\s+(?:car|bus)\b/i.test(row.stem));
assert(dominantOpenings.length <= 36, "P2 Batch 03 increased car/bus openings");
assert(dominantOpenings.length / rows.length < 0.24, "Car/bus opening share did not fall below 24%");

const correctPositions = [0, 1, 2, 3].map((position) => rows.filter((row) => row.correctIndex === position).length);
assert(correctPositions.join(",") === "37,37,41,38", "P2 Batch 03 answer-position distribution drifted");
assert(Math.max(...correctPositions) - Math.min(...correctPositions) <= 5, "P2 Batch 03 answer-position spread is too wide");

console.log(JSON.stringify({
  status: "PASS",
  phase: "P2_DIVERSITY_BATCH_03",
  canonicalRecords: rows.length,
  targetedAuthorities: AUTHORITY_GATES.length,
  supplementalRows: checkedRows.length,
  supplementalAnswers: checkedRows.map((row) => row.answerText),
  newSupplement304060Uses: concentratedFamilyUses(checkedRows.flatMap((row) => [row.stem, row.answerText])),
  retainedCarBusOpenings: dominantOpenings.length,
  retainedCarBusOpeningShare: dominantOpenings.length / rows.length,
  correctPositions,
  permanentQlIdsAssigned: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));