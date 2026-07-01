import { strict as assert } from "node:assert";
import { buildCsvPilotReport } from "./csv-pilot-report";
import {
  CSV_001_QUESTION_COUNT,
  generateCsvPilot,
} from "./csv-pilot";

const first = await generateCsvPilot();
const second = await generateCsvPilot();
assert.deepEqual(first, second, "CSV-001 generation must be deterministic.");
assert.equal(
  first.accepted.length + first.rejected.length,
  CSV_001_QUESTION_COUNT,
);
assert.equal(first.accepted.length, 193);
assert.equal(first.rejected.length, 7);

const report = buildCsvPilotReport(first);
assert.equal(report.questionCount, 193);
assert.equal(report.qlDistribution.length, 5);
assert.equal(report.difficultyDistribution.length, 3);
assert.equal(report.directionDistribution.length, 3);
assert.equal(report.numericDistribution.length, 2);
assert.equal(report.contextDistribution.length, 24);
assert.equal(report.successTarget.passed, false);
assert.equal(report.successTarget.exactlyTwoHundred, false);
assert.equal(report.successTarget.zeroPolicyViolations, false);
assert.ok(
  report.policyRejectionReasons.some(
    (entry) => entry.code === "EDU_UNEXPLAINED_JUMP" && entry.count === 5,
  ),
);
assert.ok(
  report.policyRejectionReasons.some(
    (entry) => entry.code === "EDU_WRONG_ANSWER" && entry.count === 2,
  ),
);

for (const record of first.accepted) {
  assert.equal(record.status, "PENDING_REVIEW");
  assert.equal(record.approval, "");
  assert.equal(record.reviewerNotes, "");
  assert.ok(record.questionText.length > 0);
  assert.ok(record.explanationText.length > 0);
  assert.equal(record.validationFailureCodes.length, 0);
}

console.log(
  `CSV-001: ${report.acceptedQuestions}/200 accepted; ` +
    `${report.rejectedQuestions} rejected; coverage=${report.successTarget.balancedCoverage}.`,
);
