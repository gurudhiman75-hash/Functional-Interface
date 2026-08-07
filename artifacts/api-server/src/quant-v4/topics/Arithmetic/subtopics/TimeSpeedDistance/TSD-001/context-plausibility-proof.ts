import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rows = generateFinalAuthorityReview();
assert(rows.length === 153, `Expected 153 records, received ${rows.length}`);
assert(new Set(rows.map((row) => row.finalAuthorityKey)).size === TSD_FINAL_LEARNER_AUTHORITIES.length, "Learner-authority coverage changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-001").length === 80, "Final CP-001 count changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-002").length === 73, "Final CP-002 count changed");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL allocation was enabled");
assert(rows.every((row) => row.reviewStatus === "EDITORIAL_REVIEW_REQUIRED"), "Review status changed");
assert(rows.every((row) => row.englishFreezeStatus === "UNFROZEN"), "English freeze changed");
assert(rows.every((row) => row.publiclyPublishable === false), "Public delivery was enabled");
assert(rows.every((row) => row.sourceQuestion.validation.valid), "A remediated source question became structurally invalid");

const bannedPatterns = [
  /\bA cyclist covers part of a journey\b/i,
  /\bA cyclist travels at\b/i,
  /\bA rider\b/i,
  /\bA courier covers\b/i,
  /\bA field engineer travels\b/i,
  /\bA survey crew reaches\b/i,
  /\bA machine carrier\b/i,
  /\bA logistics carrier\b/i,
  /\brefrigerated delivery, a carrier covers\b/i,
  /\bcontrolled road trial, a test fleet spends\b/i,
  /\bA maintenance team travels\b/i,
  /\bAn inspection team travels\b/i,
] as const;

for (const row of rows) {
  for (const pattern of bannedPatterns) {
    assert(!pattern.test(row.sourceQuestion.stem), `${row.questionLanguageId}: implausible or awkward actor remains in stem: ${row.sourceQuestion.stem}`);
    assert(!pattern.test(row.sourceQuestion.stemMathJax), `${row.questionLanguageId}: implausible or awkward actor remains in MathJax stem`);
  }
}

const expectedContexts = [
  { phrase: "A motorcycle covers part of a journey", count: 1 },
  { phrase: "A motorcycle travels at", count: 1 },
  { phrase: "A motorcyclist covers", count: 3 },
  { phrase: "A motorcyclist travels", count: 1 },
  { phrase: "A motorcyclist goes", count: 1 },
  { phrase: "A motorcyclist wants", count: 1 },
  { phrase: "During a controlled route test, a courier van covers", count: 1 },
  { phrase: "During a controlled road trial, a test vehicle travels", count: 2 },
  { phrase: "During a controlled road trial, a survey vehicle reaches", count: 1 },
  { phrase: "A transport vehicle moves", count: 1 },
  { phrase: "A logistics vehicle covers", count: 1 },
  { phrase: "During a refrigerated delivery, a delivery van covers", count: 1 },
  { phrase: "During a controlled road trial, a test vehicle spends", count: 1 },
  { phrase: "A maintenance vehicle travels", count: 1 },
  { phrase: "An inspection vehicle travels", count: 1 },
] as const;

let remediatedRows = 0;
for (const expected of expectedContexts) {
  const matched = rows.filter((row) => row.sourceQuestion.stem.includes(expected.phrase));
  assert(matched.length === expected.count, `${expected.phrase}: expected ${expected.count} rows, received ${matched.length}`);
  for (const row of matched) {
    assert(row.sourceQuestion.stemMathJax.includes(expected.phrase), `${row.questionLanguageId}: context differs between plain and MathJax stem`);
  }
  remediatedRows += matched.length;
}
assert(remediatedRows === 18, `Expected 18 context-remediated rows, received ${remediatedRows}`);

const controlledHighSpeedRows = rows.filter((row) => {
  const learnerText = `${row.sourceQuestion.stem} ${row.sourceQuestion.answerText}`;
  return /(?:108|126|144)\s*km\/h/i.test(learnerText)
    && /controlled (?:route|road) (?:test|trial)/i.test(row.sourceQuestion.stem);
});
assert(controlledHighSpeedRows.length >= 4, `Expected controlled framing for four high-speed human-origin scenarios, received ${controlledHighSpeedRows.length}`);

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  finalCp001Rows: rows.filter((row) => row.finalCheckpointId === "TSD-CP-001").length,
  finalCp002Rows: rows.filter((row) => row.finalCheckpointId === "TSD-CP-002").length,
  contextRemediatedRows: remediatedRows,
  controlledHighSpeedRows: controlledHighSpeedRows.length,
  permanentQls: rows.filter((row) => row.permanentQlId !== null).length,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
