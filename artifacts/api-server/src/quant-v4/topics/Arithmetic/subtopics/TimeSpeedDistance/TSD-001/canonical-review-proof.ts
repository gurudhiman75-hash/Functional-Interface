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

function inspectValue(value: TsdCanonicalValue, path: string, rationalPaths: string[]): void {
  if (typeof value === "string") {
    assert(!/^-?\d+n$/.test(value), `${path}: JavaScript BigInt literal leaked`);
    return;
  }
  if (value === null || typeof value === "boolean" || typeof value === "number") return;
  if (Array.isArray(value)) {
    value.forEach((child, index) => inspectValue(child, `${path}[${index}]`, rationalPaths));
    return;
  }
  assert(isObject(value), `${path}: unsupported canonical value`);
  const keys = Object.keys(value).sort();
  if (keys.length === 2 && keys[0] === "denominator" && keys[1] === "numerator") {
    assert(typeof value.numerator === "string" && /^-?\d+$/.test(value.numerator), `${path}: invalid numerator`);
    assert(typeof value.denominator === "string" && /^-?\d+$/.test(value.denominator), `${path}: invalid denominator`);
    assert(value.denominator !== "0", `${path}: zero denominator`);
    rationalPaths.push(path);
    return;
  }
  assert(!keys.includes("n") && !keys.includes("d"), `${path}: compact rational keys leaked`);
  for (const [key, child] of Object.entries(value)) inspectValue(child, `${path}.${key}`, rationalPaths);
}

const rows = generateCanonicalReviewRecords();
assert(rows.length === 145, "Canonical review must contain 145 records after P2 Batch 02");
assert(new Set(rows.map((row) => row.questionLanguageId)).size === rows.length, "questionLanguageId values are not unique");
assert(new Set(rows.map((row) => row.solveMode)).size === 38, "Final learner authority count changed");
assert(rows.every((row) => row.schemaVersion === TSD_CANONICAL_REVIEW_SCHEMA_VERSION), "Schema version mismatch");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL assigned before approval");
const invalidRows = rows.filter((row) => !row.validation.valid || row.validation.errors.length > 0);
assert(invalidRows.length === 0, `Invalid source records: ${invalidRows.map((row) => `${row.seed} => ${row.validation.errors.join(" | ")}`).join("; ")}`);
assert(rows.every((row) => row.lifecycle.reviewStatus === "EDITORIAL_REVIEW_REQUIRED"), "Review lifecycle changed");
assert(rows.every((row) => row.lifecycle.englishDecision === "NEEDS_REVISION" && row.lifecycle.englishFreezeStatus === "UNFROZEN"), "English was accidentally refrozen");
assert(rows.every((row) => row.lifecycle.questionBankStatus === "NOT_STORED" && row.lifecycle.testEligibility === "INELIGIBLE" && !row.lifecycle.publiclyPublishable), "Delivery lock failed");
assert(rows.every((row) => row.options.length === 4 && row.optionAudit.length === 4), "Option contract is incomplete");
assert(rows.every((row) => row.answerText === row.options[row.correctIndex]), "Answer key mismatch");
assert(rows.every((row) => row.optionAudit.filter((entry) => entry.isCorrect).length === 1), "Correct-option count is invalid");
assert(rows.every((row) => row.explanation.steps.length >= 5 && row.explanation.optionAnalysis.length === 4), "Explanation contract is incomplete");

for (const row of rows) {
  assert(!("mode" in row.input) && !("solveMode" in row.input), `${row.questionLanguageId}: duplicate mode inside input`);
  assert(!("mode" in row.solution) && !("solveMode" in row.solution), `${row.questionLanguageId}: duplicate mode inside solution`);
  assert(row.explanation.concept.trim().length > 0, `${row.questionLanguageId}: concept missing`);
  assert(row.sourceTrace.runtimeSolveMode.trim().length > 0, `${row.questionLanguageId}: runtime trace missing`);
  assert(row.sourceTrace.mathematicalFingerprint.trim().length > 0, `${row.questionLanguageId}: fingerprint missing`);
}

const cp001Rows = rows.filter((row) => row.checkpointId === "TSD-CP-001");
const cp002Rows = rows.filter((row) => row.checkpointId === "TSD-CP-002");
assert(cp001Rows.length === 80, "Unexpected CP-001 canonical count after P2 Batch 02");
assert(cp002Rows.length === 65, "Unexpected CP-002 canonical count after P2 Batch 02");
assert(rows.filter((row) => row.representation === "OVERALL_AVERAGE_AS_EFFECTIVE_SPEED").length === 3, "Effective-average rehoming changed");

const rationalPaths: string[] = [];
for (const row of rows) {
  inspectValue(row.input, `${row.questionLanguageId}.input`, rationalPaths);
  inspectValue(row.solution, `${row.questionLanguageId}.solution`, rationalPaths);
}
assert(rationalPaths.length > 495, "Expected normalized rational coverage is missing after P2 Batch 02");

const serialized = JSON.stringify(rows);
assert(!/"(?:numerator|denominator)":"-?\d+n"/.test(serialized), "BigInt suffix leaked");
assert(!/"n":|"d":/.test(serialized), "Compact rational schema leaked");
assert(!/"canonicalProblemId":|"archetypeId":/.test(serialized), "Deprecated ID field leaked");

console.log(JSON.stringify({
  status: "PASS",
  phase: "CANONICAL_REVIEW_SCHEMA_P2_BATCH_02",
  schemaVersion: TSD_CANONICAL_REVIEW_SCHEMA_VERSION,
  records: rows.length,
  finalLearnerSolveModes: new Set(rows.map((row) => row.solveMode)).size,
  cp001FinalRows: cp001Rows.length,
  cp002FinalRows: cp002Rows.length,
  normalizedRationalOccurrences: rationalPaths.length,
  permanentQlIdsAssigned: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
