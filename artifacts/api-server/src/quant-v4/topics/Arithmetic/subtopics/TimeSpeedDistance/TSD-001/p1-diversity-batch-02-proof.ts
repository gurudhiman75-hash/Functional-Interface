import { generateCanonicalReviewRecords, type TsdCanonicalValue } from "./canonical-review-schema";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const STEM_DIVERSITY_MODES = [
  "arrivalClockTime",
  "departureClockTime",
  "elapsedClockTime",
  "speedFromPace",
  "paceFromSpeed",
  "distanceFromPaceAndTime",
] as const;
const POOL_EXPANSION_MODES = ["unknownDistanceShareFromAverageSpeed", "distanceRatioFromAverageAndSpeeds"] as const;

function normalizedTemplate(stem: string): string {
  return stem.toLowerCase()
    .replace(/\d+(?:,\d{3})*(?:\.\d+)?(?:\/\d+)?(?::\d+(?:\.\d+)?)?/g, "<n>")
    .replace(/\b(am|pm)\b/g, "<meridiem>")
    .replace(/\b(bus|train|courier|runner|cyclist|athlete|trainee|night coach|express coach|delivery van|delivery vehicle)\b/g, "<actor>")
    .replace(/\s+/g, " ").trim();
}

function rationalEquals(value: TsdCanonicalValue | undefined, numerator: string, denominator = "1"): boolean {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    && value.numerator === numerator && value.denominator === denominator;
}

const rows = generateCanonicalReviewRecords();
assert(rows.length === 139, "Batch 02 compatibility gate expects the P2 Batch 01-expanded pool");
assert(new Set(rows.map((row) => row.solveMode)).size === 38, "Learner authority boundary changed");
assert(rows.every((row) => row.validation.valid), "Invalid record entered the combined P1 pool");
assert(rows.every((row) => row.permanentQlId === null && row.lifecycle.englishFreezeStatus === "UNFROZEN"), "Lifecycle lock changed");

for (const mode of STEM_DIVERSITY_MODES) {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  assert(modeRows.length === 3, `${mode}: expected three Batch 02 rows`);
  assert(new Set(modeRows.map((row) => normalizedTemplate(row.stem))).size === 3, `${mode}: stem diversity regressed`);
  assert(new Set(modeRows.map((row) => row.answerText)).size === 3, `${mode}: answer diversity regressed`);
}

for (const mode of POOL_EXPANSION_MODES) {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  const expectedRows = mode === "distanceRatioFromAverageAndSpeeds" ? 4 : 3;
  assert(modeRows.length === expectedRows, `${mode}: expected ${expectedRows} split-pool states`);
  assert(new Set(modeRows.map((row) => row.answerText)).size >= 3, `${mode}: answer diversity regressed`);
  assert(new Set(modeRows.map((row) => row.sourceTrace.mathematicalFingerprint)).size === modeRows.length, `${mode}: mathematical state repeated`);
}

const distanceShareSupplement = rows.find((row) => row.seed === "supplement:distance-share:0");
assert(distanceShareSupplement?.answerText === "60%", "Distance-share supplement drifted");
assert(rationalEquals(distanceShareSupplement.input.firstSpeedKmph, "45")
  && rationalEquals(distanceShareSupplement.input.secondSpeedKmph, "95")
  && rationalEquals(distanceShareSupplement.input.overallAverageKmph, "57"), "Distance-share supplement input drifted");

const distanceRatioSupplement = rows.find((row) => row.seed === "supplement:distance-ratio:1");
assert(distanceRatioSupplement?.answerText === "4:3", "Distance-ratio supplement drifted");
assert(rationalEquals(distanceRatioSupplement.input.firstSpeedKmph, "55")
  && rationalEquals(distanceRatioSupplement.input.secondSpeedKmph, "90")
  && rationalEquals(distanceRatioSupplement.input.overallAverageKmph, "66"), "Distance-ratio supplement input drifted");

const printedNumbers = [distanceShareSupplement, distanceRatioSupplement].flatMap((row) => row?.stem.match(/\d+(?:\.\d+)?/g) ?? []);
assert(printedNumbers.filter((value) => value === "30" || value === "40" || value === "60").length === 0, "Batch 02 supplements reused the 30/40/60 family");

console.log(JSON.stringify({
  status: "PASS",
  phase: "P1_DIVERSITY_BATCH_02_COMPATIBILITY",
  canonicalRecords: rows.length,
  finalLearnerSolveModes: new Set(rows.map((row) => row.solveMode)).size,
  diversifiedStemAuthorities: STEM_DIVERSITY_MODES.length,
  expandedPoolAuthorities: POOL_EXPANSION_MODES.length,
  permanentQlIdsAssigned: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
