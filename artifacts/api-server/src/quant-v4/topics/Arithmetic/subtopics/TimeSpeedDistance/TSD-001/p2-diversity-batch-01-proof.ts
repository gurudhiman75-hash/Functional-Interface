import { generateCanonicalReviewRecords } from "./canonical-review-schema";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const TARGETS = [
  ["averageSpeedFromSegments", "p2-b01:segmented-average:61:0", "61 km/h", 5],
  ["unknownSegmentDistanceFromAverage", "p2-b01:unknown-distance:126:1", "126 km", 5],
  ["distanceRatioFromAverageAndSpeeds", "p2-b01:distance-ratio:1:2:2", "1:2", 4],
  ["segmentAllocationFromTotalsAndSpeeds", "p2-b01:allocation:second-distance:273:3", "273 km", 6],
  ["unknownSegmentSpeedFromAverage", "p2-b01:unknown-speed:144:4", "144 km/h", 5],
  ["roundTripLegTimeSum", "p2-b01:roundtrip-time:4.5:5", "4.5 hours", 6],
] as const;

function normalizedTemplate(stem: string): string {
  return stem.toLowerCase()
    .replace(/\d+(?:,\d{3})*(?:\.\d+)?(?:\/\d+)?(?::\d+(?:\.\d+)?)?/g, "<n>")
    .replace(/\b(car|bus|rider|cyclist|vehicle|van|courier|freight shuttle|highway patrol unit|express coach|logistics carrier|medical supply van|inspection team)\b/g, "<context>")
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
assert(rows.length === 139, "P2 Batch 01 must expose 139 canonical review records");
assert(new Set(rows.map((row) => row.solveMode)).size === 38, "P2 Batch 01 changed the learner authority boundary");
assert(rows.every((row) => row.validation.valid), "Invalid record entered P2 Batch 01");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL assigned during P2 Batch 01");
assert(rows.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN"), "P2 Batch 01 accidentally refroze English");
assert(rows.every((row) => row.lifecycle.questionBankStatus === "NOT_STORED"), "P2 Batch 01 enabled Question Bank storage");
assert(rows.every((row) => row.lifecycle.testEligibility === "INELIGIBLE"), "P2 Batch 01 enabled test delivery");
assert(rows.every((row) => !row.lifecycle.publiclyPublishable), "P2 Batch 01 enabled public delivery");

const supplementalRows = TARGETS.map(([mode, seed, expectedAnswer]) => {
  const row = rows.find((candidate) => candidate.solveMode === mode && candidate.seed === seed);
  assert(row, `${mode}: P2 supplement ${seed} is missing`);
  assert(row.answerText === expectedAnswer, `${mode}: expected ${expectedAnswer}, received ${row.answerText}`);
  assert(row.options.length === 4 && new Set(row.options).size === 4, `${mode}: option uniqueness failed`);
  assert(row.options[row.correctIndex] === row.answerText, `${mode}: answer key mismatch`);
  assert(row.optionAudit.filter((entry) => entry.isCorrect).length === 1, `${mode}: invalid correct-option count`);
  assert(row.explanation.steps.length >= 5, `${mode}: explanation is incomplete`);
  assert(row.explanation.optionAnalysis.length === 4, `${mode}: option analysis is incomplete`);
  assert(row.explanation.optionAnalysis.every((entry) => entry.reason.includes(entry.text)), `${mode}: option reason is not value-specific`);
  assert(concentratedFamilyUses([row.stem]) === 0, `${mode}: P2 supplement reused the 30/40/60 family`);
  assert(!/^A (?:car|bus)\b/i.test(row.stem), `${mode}: P2 supplement reused a dominant car/bus opening`);
  return row;
});

for (const [mode, , , expectedRows] of TARGETS) {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  const numbers = modeRows.flatMap((row) => printedNumbers(row.stem));
  const familyUses = concentratedFamilyUses(modeRows.map((row) => row.stem));
  assert(modeRows.length === expectedRows, `${mode}: expected ${expectedRows} review states`);
  assert(new Set(modeRows.map((row) => row.answerText)).size >= 4, `${mode}: answer pool remains too repetitive`);
  assert(new Set(modeRows.map((row) => normalizedTemplate(row.stem))).size >= 4, `${mode}: stem-template pool remains too repetitive`);
  assert(new Set(modeRows.map((row) => row.sourceTrace.mathematicalFingerprint)).size === modeRows.length, `${mode}: mathematical state repeated`);
  assert(familyUses / numbers.length <= 0.37, `${mode}: concentrated number-family share remains above 37%`);
}

const dominantOpeningRows = rows.filter((row) => /^A (?:car|bus)\b/i.test(row.stem));
assert(dominantOpeningRows.length === 36, "Unexpected change in retained car/bus opening count");
assert(dominantOpeningRows.length / rows.length < 0.26, "Car/bus opening share did not fall below 26%");

const correctPositions = [0, 1, 2, 3].map((position) =>
  rows.filter((row) => row.correctIndex === position).length);
assert(correctPositions.join(",") === "34,30,40,35", "Global answer-position distribution drifted");
assert(Math.max(...correctPositions) - Math.min(...correctPositions) <= 10, "Global answer-position spread is too wide");

console.log(JSON.stringify({
  status: "PASS",
  phase: "P2_DIVERSITY_BATCH_01",
  canonicalRecords: rows.length,
  targetedAuthorities: TARGETS.length,
  supplementalRows: supplementalRows.length,
  supplementalAnswers: supplementalRows.map((row) => row.answerText),
  newSupplement304060Uses: concentratedFamilyUses(supplementalRows.map((row) => row.stem)),
  retainedCarBusOpenings: dominantOpeningRows.length,
  retainedCarBusOpeningShare: dominantOpeningRows.length / rows.length,
  correctPositions,
  permanentQlIdsAssigned: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
