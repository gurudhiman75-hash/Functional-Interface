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

const POOL_EXPANSION_MODES = [
  "unknownDistanceShareFromAverageSpeed",
  "distanceRatioFromAverageAndSpeeds",
] as const;

function normalizedTemplate(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/\d+(?:,\d{3})*(?:\.\d+)?(?:\/\d+)?(?::\d+(?:\.\d+)?)?/g, "<n>")
    .replace(/\b(am|pm)\b/g, "<meridiem>")
    .replace(
      /\b(bus|train|courier|runner|cyclist|athlete|trainee|night coach|express coach|delivery van|delivery vehicle)\b/g,
      "<actor>",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function rationalEquals(
  value: TsdCanonicalValue | undefined,
  numerator: string,
  denominator = "1",
): boolean {
  return typeof value === "object"
    && value !== null
    && !Array.isArray(value)
    && value.numerator === numerator
    && value.denominator === denominator;
}

const rows = generateCanonicalReviewRecords();
assert(rows.length === 118, "P1 Batch 02 must expose the expanded 118-record canonical pool");
assert(new Set(rows.map((row) => row.solveMode)).size === 38, "P1 Batch 02 changed the 38-authority learner boundary");
assert(rows.every((row) => row.validation.valid), "Invalid record entered P1 Batch 02");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL assigned during P1 Batch 02");
assert(rows.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN"), "P1 Batch 02 accidentally refroze English");

const stemMetrics = STEM_DIVERSITY_MODES.map((mode) => {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  assert(modeRows.length === 3, `${mode}: expected exactly three review rows`);

  const diagnostics = modeRows.map((row) => ({
    questionLanguageId: row.questionLanguageId,
    seed: row.seed,
    stem: row.stem,
    answerText: row.answerText,
    normalizedTemplate: normalizedTemplate(row.stem),
  }));
  const templates = new Set(diagnostics.map((row) => row.normalizedTemplate));
  const answers = new Set(modeRows.map((row) => row.answerText));

  assert(
    templates.size === 3,
    `${mode}: expected three materially different stem structures; rows=${JSON.stringify(diagnostics)}`,
  );
  assert(new Set(modeRows.map((row) => row.stem)).size === 3, `${mode}: duplicate visible stem remains`);
  assert(
    answers.size === 3,
    `${mode}: expected three distinct answers; rows=${JSON.stringify(diagnostics)}`,
  );

  return Object.freeze({
    solveMode: mode,
    rows: modeRows.length,
    normalizedTemplates: templates.size,
    uniqueAnswers: answers.size,
    seeds: Object.freeze(modeRows.map((row) => row.seed)),
  });
});

const poolMetrics = POOL_EXPANSION_MODES.map((mode) => {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  const answers = new Set(modeRows.map((row) => row.answerText));
  const states = new Set(modeRows.map((row) => row.sourceTrace.mathematicalFingerprint));

  assert(modeRows.length === 3, `${mode}: split authority must now have three review states`);
  assert(answers.size === 3, `${mode}: split authority must have three distinct answers`);
  assert(states.size === 3, `${mode}: split authority has a repeated mathematical state`);
  assert(modeRows.every((row) => row.options.length === 4), `${mode}: incomplete option set`);
  assert(
    modeRows.every((row) => new Set(row.options).size === 4),
    `${mode}: text-duplicate options remain`,
  );
  assert(
    modeRows.every((row) => row.options[row.correctIndex] === row.answerText),
    `${mode}: answer key mismatch`,
  );

  return Object.freeze({
    solveMode: mode,
    rows: modeRows.length,
    uniqueAnswers: answers.size,
    mathematicalStates: states.size,
    answers: Object.freeze(modeRows.map((row) => row.answerText)),
    representations: Object.freeze(modeRows.map((row) => row.representation)),
  });
});

const distanceShareSupplement = rows.find((row) =>
  row.solveMode === "unknownDistanceShareFromAverageSpeed"
  && row.seed === "supplement:distance-share:0"
);
assert(distanceShareSupplement, "Batch 02 distance-share supplement is missing");
assert(distanceShareSupplement.answerText === "60%", "Distance-share supplement must answer 60%");
assert(
  rationalEquals(distanceShareSupplement.input.firstSpeedKmph, "45")
  && rationalEquals(distanceShareSupplement.input.secondSpeedKmph, "95")
  && rationalEquals(distanceShareSupplement.input.overallAverageKmph, "57"),
  "Distance-share supplement input state drifted",
);

const distanceRatioSupplement = rows.find((row) =>
  row.solveMode === "distanceRatioFromAverageAndSpeeds"
  && row.seed === "supplement:distance-ratio:1"
);
assert(distanceRatioSupplement, "Batch 02 distance-ratio supplement is missing");
assert(distanceRatioSupplement.answerText === "4:3", "Distance-ratio supplement must answer 4:3");
assert(
  rationalEquals(distanceRatioSupplement.input.firstSpeedKmph, "55")
  && rationalEquals(distanceRatioSupplement.input.secondSpeedKmph, "90")
  && rationalEquals(distanceRatioSupplement.input.overallAverageKmph, "66"),
  "Distance-ratio supplement input state drifted",
);

const supplementalRows = [distanceShareSupplement, distanceRatioSupplement];
const printedNumbers = supplementalRows.flatMap((row) => row.stem.match(/\d+(?:\.\d+)?/g) ?? []);
const overusedFamilyUses = printedNumbers.filter(
  (value) => value === "30" || value === "40" || value === "60",
).length;
assert(overusedFamilyUses === 0, "Batch 02 supplements reused the over-concentrated 30/40/60 number family");

console.log(JSON.stringify({
  status: "PASS",
  phase: "P1_DIVERSITY_BATCH_02",
  canonicalRecords: rows.length,
  finalLearnerSolveModes: new Set(rows.map((row) => row.solveMode)).size,
  diversifiedStemAuthorities: STEM_DIVERSITY_MODES.length,
  diversifiedStemRows: STEM_DIVERSITY_MODES.length * 3,
  expandedPoolAuthorities: POOL_EXPANSION_MODES.length,
  expandedPoolRows: POOL_EXPANSION_MODES.length * 3,
  stemMetrics,
  poolMetrics,
  supplementalAnswers: supplementalRows.map((row) => row.answerText),
  supplementalPrintedNumbers: printedNumbers.length,
  supplemental304060Uses: overusedFamilyUses,
  permanentQlIdsAssigned: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
