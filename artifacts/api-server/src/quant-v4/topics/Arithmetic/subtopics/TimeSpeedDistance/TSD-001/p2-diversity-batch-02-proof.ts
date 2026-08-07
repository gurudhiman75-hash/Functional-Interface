import { generateCanonicalReviewRecords } from "./canonical-review-schema";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const TARGET_MODES = [
  "referenceTripDistanceAtChangedConditions",
  "referenceTripTimeAtChangedConditions",
  "speedFromMixedUnits",
] as const;

function normalizedTemplate(stem: string): string {
  return stem.toLowerCase()
    .replace(/\d+(?:,\d{3})*(?:\.\d+)?(?:\/\d+)?(?::\d+(?:\.\d+)?)?/g, "<n>")
    .replace(/\b(route-survey vehicle|parcel network|field-mapping unit|logistics route|motion sensor|inspection unit|mobile platform|car|bus)\b/g, "<context>")
    .replace(/\s+/g, " ").trim();
}

function concentratedUses(stem: string): number {
  return (stem.match(/\b(?:30|40|60)\b/g) ?? []).length;
}

const rows = generateCanonicalReviewRecords();
assert(rows.length >= 145, "P2 Batch 02 compatibility lost canonical review records");
assert(new Set(rows.map((row) => row.solveMode)).size === 38, "P2 Batch 02 changed learner authority ownership");
assert(rows.every((row) => row.validation.valid), "Invalid row entered P2 Batch 02");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL assigned during P2 Batch 02");
assert(rows.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN"), "P2 Batch 02 accidentally refroze English");
assert(rows.every((row) => row.lifecycle.questionBankStatus === "NOT_STORED" && row.lifecycle.testEligibility === "INELIGIBLE" && !row.lifecycle.publiclyPublishable), "P2 Batch 02 delivery lock failed");

const supplements = rows.filter((row) => row.sourceTrace.mathematicalFingerprint.startsWith("P2-BATCH-02|"));
assert(supplements.length === 6, "P2 Batch 02 must retain exactly six supplements");
assert(new Set(supplements.map((row) => row.questionLanguageId)).size === 6, "P2 Batch 02 language IDs are not unique");
assert(new Set(supplements.map((row) => row.sourceTrace.mathematicalFingerprint)).size === 6, "P2 Batch 02 mathematical states are not unique");
assert(supplements.every((row) => !/^(?:A|An|The)\s+(?:car|bus)\b/i.test(row.stem)), "P2 Batch 02 reused a dominant car/bus opening");
assert(supplements.every((row) => concentratedUses(row.stem) === 0 && concentratedUses(row.answerText) === 0), "P2 Batch 02 reused the 30/40/60 family");
assert(supplements.every((row) => row.options.length === 4 && new Set(row.options).size === 4), "P2 Batch 02 options are not unique");
assert(supplements.every((row) => row.options[row.correctIndex] === row.answerText), "P2 Batch 02 answer key mismatch");
assert(supplements.every((row) => row.optionAudit.filter((entry) => entry.isCorrect).length === 1), "P2 Batch 02 correct-option count is invalid");
assert(supplements.every((row) => row.explanation.steps.length >= 5 && row.explanation.optionAnalysis.length === 4), "P2 Batch 02 explanation contract is incomplete");

for (const mode of TARGET_MODES) {
  const modeRows = rows.filter((row) => row.solveMode === mode);
  const newRows = supplements.filter((row) => row.solveMode === mode);
  assert(modeRows.length === 5, `${mode}: expected five review states after Batch 02`);
  assert(newRows.length === 2, `${mode}: expected two P2 Batch 02 supplements`);
  assert(new Set(modeRows.map((row) => row.answerText)).size >= 4, `${mode}: answer pool remains too repetitive`);
  assert(new Set(modeRows.map((row) => normalizedTemplate(row.stem))).size >= 5, `${mode}: normalized template pool is not fully diverse`);
}

const dominantOpenings = rows.filter((row) => /^(?:A|An|The)\s+(?:car|bus)\b/i.test(row.stem));
assert(dominantOpenings.length <= 36, "P2 Batch 02 increased car/bus openings");
assert(dominantOpenings.length / rows.length < 0.25, "Car/bus opening share did not remain below 25%");

const correctPositions = [0, 1, 2, 3].map((position) => rows.filter((row) => row.correctIndex === position).length);
assert(Math.max(...correctPositions) - Math.min(...correctPositions) <= 12, "P2 Batch 02 answer-position spread is too wide");

console.log(JSON.stringify({
  status: "PASS",
  phase: "P2_DIVERSITY_BATCH_02_COMPATIBILITY",
  canonicalRecords: rows.length,
  targetedAuthorities: TARGET_MODES.length,
  supplementalRows: supplements.length,
  supplementalAnswers: supplements.map((row) => row.answerText),
  concentratedFamilyUses: supplements.reduce((sum, row) => sum + concentratedUses(row.stem) + concentratedUses(row.answerText), 0),
  retainedCarBusOpenings: dominantOpenings.length,
  retainedCarBusOpeningShare: dominantOpenings.length / rows.length,
  correctPositions,
  permanentQlIdsAssigned: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));