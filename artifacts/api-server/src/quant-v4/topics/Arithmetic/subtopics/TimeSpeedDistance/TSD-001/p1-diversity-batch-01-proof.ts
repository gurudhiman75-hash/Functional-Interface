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
  return stem
    .toLowerCase()
    .replace(/\d+(?:,\d{3})*(?:\.\d+)?(?:\/\d+)?(?::\d+(?:\.\d+)?)?/g, "<n>")
    .replace(/\b(cars?|vehicles?|riders?|couriers?|bus|delivery van)\b/g, "<actor>")
    .replace(/\s+/g, " ")
    .trim();
}

function rationalEquals(value: TsdCanonicalValue | undefined, numerator: string, denominator = "1"): boolean {
  return typeof value === "object"
    && value !== null
    && !Array.isArray(value)
    && value.numerator === numerator
    && value.denominator === denominator;
}

const rows = generateCanonicalReviewRecords();
assert(rows.length === 116, "P1 batch must preserve the 116-record canonical pool");
assert(rows.every((row) => row.validation.valid), "Invalid record entered the P1 diversity review");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL assigned during P1 diversity work");
assert(rows.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN"), "P1 batch accidentally refroze English");

const metrics = TARGET_MODES.map((mode) => {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  assert(modeRows.length === 3, `${mode}: expected exactly three current review rows`);
  const rowDiagnostics = modeRows.map((row) => ({
    questionLanguageId: row.questionLanguageId,
    seed: row.seed,
    stem: row.stem,
    answerText: row.answerText,
    normalizedTemplate: normalizedTemplate(row.stem),
  }));
  const templates = new Set(rowDiagnostics.map((row) => row.normalizedTemplate));
  const answers = new Set(modeRows.map((row) => row.answerText));
  assert(
    templates.size === 3,
    `${mode}: expected three materially different normalized stem templates, received ${templates.size}; rows=${JSON.stringify(rowDiagnostics)}`,
  );
  assert(new Set(modeRows.map((row) => row.stem)).size === 3, `${mode}: duplicate visible stem remains`);
  assert(
    answers.size === 3,
    `${mode}: expected three distinct answers, received ${answers.size}; rows=${JSON.stringify(rowDiagnostics)}`,
  );
  return Object.freeze({
    solveMode: mode,
    rows: modeRows.length,
    normalizedTemplates: templates.size,
    uniqueAnswers: answers.size,
    answers: Object.freeze(modeRows.map((row) => row.answerText)),
    seeds: Object.freeze(modeRows.map((row) => row.seed)),
  });
});

const speedRows = rows.filter((row) => row.solveMode === "speedByProportion");
const reference = speedRows.find((row) =>
  rationalEquals(row.input.knownSpeed, "40")
  && rationalEquals(row.input.knownTime, "6")
  && rationalEquals(row.input.targetTime, "4")
  && rationalEquals(row.input.knownDistance, "240"),
);
assert(reference, "The required 40 km/h × 6 hours = 240 km reference state was lost");
assert(reference.answerText === "60 km/h", "The preserved reference state no longer answers 60 km/h");
const referenceWorking = reference.explanation.steps.join(" ");
assert(referenceWorking.includes("40 \\times 6"), "Reference explanation no longer reconstructs 40 × 6");
assert(referenceWorking.includes("240 \\div 4"), "Reference explanation no longer computes 240 ÷ 4");

const targetedRows = rows.filter((row) => TARGET_MODES.includes(row.solveMode as (typeof TARGET_MODES)[number]));
const printedNumbers = targetedRows.flatMap((row) => row.stem.match(/\d+(?:\.\d+)?/g) ?? []);
const canonicalFamilyUses = printedNumbers.filter((value) => value === "30" || value === "40" || value === "60").length;

console.log(JSON.stringify({
  status: "PASS",
  phase: "P1_DIVERSITY_BATCH_01",
  canonicalRecordsPreserved: rows.length,
  targetedAuthorities: TARGET_MODES.length,
  targetedRows: targetedRows.length,
  authorityMetrics: metrics,
  speedByProportionAnswers: speedRows.map((row) => row.answerText),
  preservedReferenceQuestionLanguageId: reference.questionLanguageId,
  preservedReferenceAnswer: reference.answerText,
  targetedPrintedNumbers: printedNumbers.length,
  targeted304060Uses: canonicalFamilyUses,
  permanentQlIdsAssigned: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
