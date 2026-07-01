import { strict as assert } from "node:assert";
import { TUTOR_AUDIT_CORPUS } from "./tutor-audit-corpus";
import { INDEPENDENT_AUDIT_CORPUS } from "./independent-audit-corpus";
import {
  INDEPENDENT_AUDIT_REPORT,
  produceIndependentAuditReport,
} from "./independent-audit-report";

assert.equal(INDEPENDENT_AUDIT_CORPUS.length, 50);
const oldTuples = new Set(
  TUTOR_AUDIT_CORPUS.map((item) =>
    [
      item.knownRate,
      item.knownValue,
      item.targetRate,
      item.contextLabel,
      item.detailMode,
    ].join("|"),
  ),
);
for (const item of INDEPENDENT_AUDIT_CORPUS) {
  assert.equal(
    oldTuples.has(
      [
        item.knownRate,
        item.knownValue,
        item.targetRate,
        item.contextLabel,
        item.detailMode,
      ].join("|"),
    ),
    false,
    `${item.auditId}: reused a Phase B example`,
  );
}
assert.equal(
  INDEPENDENT_AUDIT_CORPUS.some(
    (item) =>
      item.knownRate === 20 &&
      item.knownValue === 67 &&
      item.targetRate === 35,
  ),
  true,
);
assert.deepEqual(
  new Set(
    INDEPENDENT_AUDIT_CORPUS
      .filter((item) => item.contextKind === "money")
      .map((item) => item.contextLabel),
  ),
  new Set(["salary", "profit", "savings", "income", "expenses"]),
);
assert.deepEqual(
  new Set(
    INDEPENDENT_AUDIT_CORPUS
      .filter((item) => item.contextKind === "count")
      .map((item) => item.contextLabel),
  ),
  new Set(["students", "workers", "books", "trees", "families", "animals"]),
);
assert.deepEqual(
  INDEPENDENT_AUDIT_REPORT,
  produceIndependentAuditReport(),
  "Independent audit must be deterministic.",
);
assert.equal(INDEPENDENT_AUDIT_REPORT.totalExamples, 50);
assert.equal(
  INDEPENDENT_AUDIT_REPORT.dimensionSummaries.some(
    (summary) => summary.dimension === "REPETITION_FATIGUE",
  ),
  true,
);
assert.equal(
  INDEPENDENT_AUDIT_REPORT.dimensionSummaries.some(
    (summary) => summary.dimension === "TUTOR_PERSONALITY",
  ),
  true,
);

console.log(
  `QUAL-001 Phase B.1 independent audit: ` +
    `${INDEPENDENT_AUDIT_REPORT.approvedExamples}/50 approved, ` +
    `${INDEPENDENT_AUDIT_REPORT.criticalFindings.length} critical, ` +
    `${INDEPENDENT_AUDIT_REPORT.majorFindings.length} major, ` +
    `${INDEPENDENT_AUDIT_REPORT.minorFindings.length} minor findings.`,
);

