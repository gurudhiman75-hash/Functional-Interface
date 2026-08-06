import { generateCanonicalReviewRecords, type TsdCanonicalValue } from "./canonical-review-schema";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const TARGET_MODES = [
  "compareDistancesAtEqualTime",
  "compareTimesAtEqualDistance",
  "compareSpeedsAtEqualTime",
  "distanceRatioFromSpeedAndTimeRatios",
  "speedRatioFromDistanceAndTimeRatios",
  "timeRatioFromDistanceAndSpeedRatios",
  "speedByProportion",
] as const;

function normalizedTemplate(stem: string): string {
  return stem.toLowerCase()
    .replace(/\d+(?:,\d{3})*(?:\.\d+)?(?:\/\d+)?(?::\d+(?:\.\d+)?)?/g, "<n>")
    .replace(/\b(cars?|vehicles?|riders?|couriers?|bus|delivery van)\b/g, "<actor>")
    .replace(/\s+/g, " ").trim();
}

function rationalEquals(value: TsdCanonicalValue | undefined, numerator: string, denominator = "1"): boolean {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    && value.numerator === numerator && value.denominator === denominator;
}

const rows = generateCanonicalReviewRecords();
assert(rows.length === 125, "Batch 01 compatibility gate expects the Batch 03-expanded pool");
assert(rows.every((row) => row.validation.valid), "Invalid record entered the P1 pool");
assert(rows.every((row) => row.permanentQlId === null && row.lifecycle.englishFreezeStatus === "UNFROZEN"), "Lifecycle changed");

for (const mode of TARGET_MODES) {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  assert(modeRows.length === 3, `${mode}: expected three Batch 01 rows`);
  assert(new Set(modeRows.map((row) => normalizedTemplate(row.stem))).size === 3, `${mode}: template diversity regressed`);
  assert(new Set(modeRows.map((row) => row.answerText)).size === 3, `${mode}: answer diversity regressed`);
}

const speedRows = rows.filter((row) => row.solveMode === "speedByProportion");
const reference = speedRows.find((row) => rationalEquals(row.input.knownSpeed, "40")
  && rationalEquals(row.input.knownTime, "6")
  && rationalEquals(row.input.targetTime, "4")
  && rationalEquals(row.input.knownDistance, "240"));
assert(reference?.answerText === "60 km/h", "Required 40 × 6, then 240 ÷ 4 reference state was lost");
const working = reference.explanation.steps.join(" ");
assert(working.includes("40 \\times 6") && working.includes("240 \\div 4"), "Reference working regressed");

console.log(JSON.stringify({
  status: "PASS",
  phase: "P1_DIVERSITY_BATCH_01_COMPATIBILITY",
  canonicalRecords: rows.length,
  targetedAuthorities: TARGET_MODES.length,
  preservedReferenceAnswer: reference.answerText,
  permanentQlIdsAssigned: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
