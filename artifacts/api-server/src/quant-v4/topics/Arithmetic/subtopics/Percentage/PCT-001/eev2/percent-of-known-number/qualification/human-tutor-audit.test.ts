import { strict as assert } from "node:assert";
import { TUTOR_AUDIT_CORPUS } from "./tutor-audit-corpus";
import { produceTutorAuditReport } from "./tutor-audit-report";

assert.equal(TUTOR_AUDIT_CORPUS.length, 50);
assert.deepEqual(
  new Set(TUTOR_AUDIT_CORPUS.map((item) => item.direction)),
  new Set(["greater", "smaller", "equal"]),
);
assert.deepEqual(
  new Set(TUTOR_AUDIT_CORPUS.map((item) => item.detailMode)),
  new Set(["short", "standard", "detailed"]),
);
assert.deepEqual(
  new Set(
    TUTOR_AUDIT_CORPUS
      .filter((item) => item.contextKind === "count")
      .map((item) => item.contextLabel),
  ),
  new Set([
    "students",
    "employees",
    "books",
    "trees",
    "animals",
    "workers",
    "families",
  ]),
);
assert.deepEqual(
  new Set(
    TUTOR_AUDIT_CORPUS
      .filter((item) => item.contextKind === "money")
      .map((item) => item.contextLabel),
  ),
  new Set(["profit", "salary", "savings", "revenue", "income", "expenses"]),
);
assert.equal(TUTOR_AUDIT_CORPUS.some((item) => item.weakStudent), true);
assert.equal(TUTOR_AUDIT_CORPUS.some((item) => item.size === "large"), true);
assert.equal(
  TUTOR_AUDIT_CORPUS.some(
    (item) => !Number.isInteger(item.knownValue / item.knownRate),
  ),
  true,
);

const first = produceTutorAuditReport();
const second = produceTutorAuditReport();
assert.deepEqual(first, second, "Tutor audit must be deterministic.");
assert.equal(first.totalExamples, 50);
assert.equal(first.criticalFindings.length, 0);
assert.equal(
  first.majorFindings.some(
    (finding) => finding.code === "TECHNICAL_PERCENTAGE_POINT_WORDING",
  ),
  true,
);
assert.equal(
  first.majorFindings.some(
    (finding) => finding.code === "PRECISION_LEAKAGE",
  ),
  true,
);
assert.equal(
  first.minorFindings.some(
    (finding) => finding.code === "REPEATED_KNOWN_RELATION",
  ),
  true,
);
assert.equal(
  first.dimensionSummaries.find(
    (summary) => summary.dimension === "ONE_UNIT_VISIBILITY",
  )!.examplesWithFindings,
  0,
);
assert.equal(
  first.dimensionSummaries.find(
    (summary) => summary.dimension === "ANSWER_CONFIDENCE",
  )!.examplesWithFindings,
  0,
);
assert.equal(first.examplesRequiringImprovement.length > 0, true);

console.log(
  `QUAL-001 Phase B tutor audit completed: ${first.totalExamples} examples, ` +
    `${first.criticalFindings.length} critical, ` +
    `${first.majorFindings.length} major, ` +
    `${first.minorFindings.length} minor findings.`,
);

