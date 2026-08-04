import {
  TSD_CANONICAL_REVIEW_SCHEMA_VERSION,
  generateCanonicalReviewRecords,
  type TsdCanonicalValue,
} from "./canonical-review-schema";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isObject(value: TsdCanonicalValue): value is { readonly [key: string]: TsdCanonicalValue } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function inspectCanonicalValue(
  value: TsdCanonicalValue,
  path: string,
  rationalPaths: string[],
): void {
  if (typeof value === "string") {
    assert(!/^-?\d+n$/.test(value), `${path}: JavaScript BigInt literal leaked into canonical review`);
    return;
  }
  if (value === null || typeof value === "boolean" || typeof value === "number") return;
  if (Array.isArray(value)) {
    value.forEach((child, index) => inspectCanonicalValue(child, `${path}[${index}]`, rationalPaths));
    return;
  }
  if (!isObject(value)) throw new Error(`${path}: unsupported canonical value`);

  const keys = Object.keys(value).sort();
  const isRational = keys.length === 2 && keys[0] === "denominator" && keys[1] === "numerator";
  if (isRational) {
    const numerator = value.numerator;
    const denominator = value.denominator;
    assert(typeof numerator === "string" && /^-?\d+$/.test(numerator), `${path}: invalid canonical rational numerator`);
    assert(typeof denominator === "string" && /^-?\d+$/.test(denominator), `${path}: invalid canonical rational denominator`);
    assert(denominator !== "0", `${path}: zero canonical rational denominator`);
    rationalPaths.push(path);
    return;
  }

  assert(!keys.includes("n") && !keys.includes("d"), `${path}: compact CP-002 rational keys leaked into canonical review`);
  for (const [key, child] of Object.entries(value)) {
    inspectCanonicalValue(child, `${path}.${key}`, rationalPaths);
  }
}

const rows = generateCanonicalReviewRecords();
assert(rows.length === 116, "Canonical review must contain all 116 final-authority pool records");
assert(new Set(rows.map((row) => row.questionLanguageId)).size === rows.length, "Canonical questionLanguageId values are not unique");
assert(new Set(rows.map((row) => row.solveMode)).size === 38, "Canonical review must expose 38 final learner solve modes");
assert(rows.every((row) => row.schemaVersion === TSD_CANONICAL_REVIEW_SCHEMA_VERSION), "Canonical schema version mismatch");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL assigned before final editorial review");
assert(rows.every((row) => row.validation.valid && row.validation.errors.length === 0), "Invalid source record entered canonical review");
assert(rows.every((row) => row.lifecycle.reviewStatus === "EDITORIAL_REVIEW_REQUIRED"), "Canonical review status is not reopened");
assert(rows.every((row) => row.lifecycle.englishDecision === "NEEDS_REVISION"), "Canonical English decision is not NEEDS_REVISION");
assert(rows.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN"), "Canonical English freeze status is stale");
assert(rows.every((row) => row.lifecycle.questionBankStatus === "NOT_STORED"), "Canonical Question Bank lock failed");
assert(rows.every((row) => row.lifecycle.testEligibility === "INELIGIBLE"), "Canonical test lock failed");
assert(rows.every((row) => !row.lifecycle.publiclyPublishable), "Canonical public-delivery lock failed");
assert(rows.every((row) => row.difficulty.status === "EDITORIAL_CALIBRATION_REQUIRED"), "Canonical difficulty status is not provisional");
assert(rows.every((row) => row.options.length === 4 && row.optionAudit.length === 4), "Canonical option contract is incomplete");
assert(rows.every((row) => row.answerText === row.options[row.correctIndex]), "Canonical answer key mismatch");
assert(rows.every((row) => row.optionAudit.filter((entry) => entry.isCorrect).length === 1), "Canonical option audit has an invalid correct count");
assert(rows.every((row) => row.explanation.steps.length >= 5), "Canonical explanation is incomplete");
assert(rows.every((row) => row.explanation.optionAnalysis.length === 4), "Canonical option analysis is incomplete");

const expectedTopLevelKeys = [
  "answerText",
  "chapterArchetypeId",
  "chapterId",
  "checkpointId",
  "correctIndex",
  "difficulty",
  "explanation",
  "input",
  "language",
  "lifecycle",
  "optionAudit",
  "options",
  "permanentQlId",
  "provisionalAuthorityId",
  "questionLanguageId",
  "representation",
  "schemaVersion",
  "seed",
  "solution",
  "solveMode",
  "sourceTrace",
  "stem",
  "stemMathJax",
  "validation",
].sort();
for (const row of rows) {
  assert(JSON.stringify(Object.keys(row).sort()) === JSON.stringify(expectedTopLevelKeys), `${row.questionLanguageId}: canonical top-level field drift`);
  assert(!("mode" in row.input) && !("solveMode" in row.input), `${row.questionLanguageId}: duplicate solve-mode field remains inside input`);
  assert(row.solveMode.trim().length > 0, `${row.questionLanguageId}: canonical solveMode is empty`);
  assert(row.sourceTrace.runtimeSolveMode.trim().length > 0, `${row.questionLanguageId}: runtime solve-mode trace is missing`);
  assert(row.sourceTrace.mathematicalFingerprint.trim().length > 0, `${row.questionLanguageId}: mathematical fingerprint trace is missing`);
  assert(row.explanation.concept.trim().length > 0, `${row.questionLanguageId}: canonical concept is missing`);
  assert(!row.explanation.concept.startsWith("📌"), `${row.questionLanguageId}: renderer icon leaked into canonical concept data`);
  assert(row.explanation.shortcut === null || !row.explanation.shortcut.startsWith("⚡"), `${row.questionLanguageId}: renderer icon leaked into canonical shortcut data`);
  assert(row.explanation.optionAnalysis.every((entry) => !/^[✅⚠️]/.test(entry.reason)), `${row.questionLanguageId}: renderer icon leaked into canonical option reason`);
  assert(row.optionAudit.every((entry) => entry.wrongWorking === null && entry.applicability === null), `${row.questionLanguageId}: current misconception trace placeholder contract changed unexpectedly`);
}

const cp001Rows = rows.filter((row) => row.checkpointId === "TSD-CP-001");
const cp002Rows = rows.filter((row) => row.checkpointId === "TSD-CP-002");
assert(cp001Rows.length === 72, "Final CP-001 canonical row count must include the three rehomed effective-average rows");
assert(cp002Rows.length === 44, "Final CP-002 canonical row count must exclude QL-033 and include five supplements");
const rehomedRows = rows.filter((row) => row.representation === "OVERALL_AVERAGE_AS_EFFECTIVE_SPEED");
assert(rehomedRows.length === 3, "Expected three rehomed effective-average rows");
assert(rehomedRows.every((row) => row.checkpointId === "TSD-CP-001" && row.sourceTrace.sourceCheckpointId === "TSD-CP-002"), "Rehomed source/final checkpoint trace is incorrect");

const rationalPaths: string[] = [];
for (const row of rows) {
  inspectCanonicalValue(row.input, `${row.questionLanguageId}.input`, rationalPaths);
  inspectCanonicalValue(row.solution, `${row.questionLanguageId}.solution`, rationalPaths);
}
assert(rationalPaths.length > 300, "Canonical review did not expose the expected normalized rational values");

const serialized = JSON.stringify(rows);
assert(!/"(?:numerator|denominator)":"-?\d+n"/.test(serialized), "BigInt suffix leaked into canonical rational serialization");
assert(!/"n":|"d":/.test(serialized), "Compact CP-002 rational schema leaked into canonical serialization");
assert(!/"canonicalProblemId":|"archetypeId":/.test(serialized), "Deprecated ambiguous ID field leaked into canonical review");
assert(!/"concept":.*"givens":.*"working":/s.test(serialized), "Parallel legacy explanation models leaked into canonical review");

console.log(JSON.stringify({
  status: "PASS",
  phase: "CANONICAL_REVIEW_SCHEMA",
  schemaVersion: TSD_CANONICAL_REVIEW_SCHEMA_VERSION,
  records: rows.length,
  finalLearnerSolveModes: new Set(rows.map((row) => row.solveMode)).size,
  cp001FinalRows: cp001Rows.length,
  cp002FinalRows: cp002Rows.length,
  rehomedEffectiveAverageRows: rehomedRows.length,
  normalizedRationalOccurrences: rationalPaths.length,
  duplicateSolveModeFields: 0,
  javascriptBigIntLiteralLeaks: 0,
  compactRationalSchemaLeaks: 0,
  parallelExplanationModelLeaks: 0,
  permanentQlIdsAssigned: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
