import { strict as assert } from "node:assert";
import {
  CONFIRMATION_CORPUS,
  CONFIRMATION_FATIGUE_CORPUS,
  confirmationSignature,
} from "./confirmation-corpus";
import {
  CONFIRMATION_REPORT,
  produceConfirmationReport,
} from "./confirmation-report";
import { RED_TEAM_CORPUS } from "./red-team-corpus";

assert.equal(CONFIRMATION_CORPUS.length, 300);
assert.equal(CONFIRMATION_FATIGUE_CORPUS.length, 500);
assert.equal(
  new Set(CONFIRMATION_CORPUS.map((item) => item.confirmationId)).size,
  300,
);
assert.equal(
  new Set(CONFIRMATION_FATIGUE_CORPUS.map((item) => item.confirmationId)).size,
  500,
);

const confirmationSignatures = CONFIRMATION_CORPUS.map(confirmationSignature);
assert.equal(
  new Set(confirmationSignatures).size,
  confirmationSignatures.length,
  "The confirmation corpus must not contain duplicate case signatures.",
);

const phaseCSignatures = new Set(
  RED_TEAM_CORPUS.map((item) =>
    confirmationSignature({
      knownRate: item.knownRate,
      knownValue: item.knownValue,
      targetRate: item.targetRate,
      detailMode: item.detailMode,
      contextLabel: item.contextLabel,
      semanticUnit: item.semanticUnit,
    }),
  ),
);
for (const signature of confirmationSignatures) {
  assert.equal(
    phaseCSignatures.has(signature),
    false,
    `Phase C case reused in confirmation corpus: ${signature}`,
  );
}

assert.deepEqual(
  CONFIRMATION_REPORT,
  produceConfirmationReport(),
  "The confirmation qualification must be deterministic.",
);
assert.equal(CONFIRMATION_REPORT.totalExamples, 300);
assert.equal(CONFIRMATION_REPORT.fatigueStudy.totalExplanations, 500);
assert.equal(CONFIRMATION_REPORT.dimensionSummaries.length, 15);
assert.equal(CONFIRMATION_REPORT.categorySummaries.length, 10);
assert.ok(
  CONFIRMATION_REPORT.categorySummaries.every(
    (summary) => summary.totalExamples === 30,
  ),
);
assert.ok(
  CONFIRMATION_REPORT.criticalFindings.every((finding) =>
    [
      "MISSING_ONE_UNIT_REASONING",
      "FORMULA_FIRST",
      "ANSWER_JUMP",
      "WRONG_ANSWER",
    ].includes(finding.code),
  ),
);

console.log(
  `QUAL-001 Phase C.1 confirmation: ` +
    `${CONFIRMATION_REPORT.approvedExamples}/300 approved, ` +
    `${CONFIRMATION_REPORT.criticalFindings.length} critical, ` +
    `${CONFIRMATION_REPORT.majorFindings.length} major, ` +
    `${CONFIRMATION_REPORT.minorFindings.length} minor; ` +
    `fatigue ${CONFIRMATION_REPORT.fatigueStudy.acceptable ? "acceptable" : "failed"}.`,
);

