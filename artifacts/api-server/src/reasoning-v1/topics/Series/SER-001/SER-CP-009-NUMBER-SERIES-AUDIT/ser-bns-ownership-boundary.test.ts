import assert from "node:assert/strict";

import { generateBns001Question } from "../../../../../quant-v4/topics/SpeedMathematics/BankingNumberSeries/BNS-001";
import { generateSerCp009NumberSeries } from "./number-series-final";
import { SER_CP009_NUMBER_SERIES_QL_IDS } from "./number-series";

// SER-001 may use arithmetic grammars that resemble banking number-series
// primitives, but it owns only the SSC-style Reasoning presentation/lifecycle.
for (const qlId of SER_CP009_NUMBER_SERIES_QL_IDS) {
  const question = generateSerCp009NumberSeries(qlId, 1709, "en-IN");
  assert.equal(question.packageId, "SER-001");
  assert.equal(question.checkpointId, "SER-CP-009");
  assert.equal(question.examProfile, "SSC_REASONING");
  assert.equal(question.optionCount, 4);
  assert.equal(question.options.length, 4);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.permanentQlId, null);
  assert.equal(question.questionStudioDiscoverable, false);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
}

// BNS-001 remains a separate Speed Mathematics package for Banking Prelims.
for (const patternKind of [
  "ARITHMETIC_DIFFERENCE",
  "PROGRESSIVE_DIFFERENCE",
  "GEOMETRIC_MULTIPLICATION",
  "MULTIPLY_AND_ADD",
  "INTERLEAVED_ARITHMETIC",
] as const) {
  const question = generateBns001Question({
    seed: `SER-BNS-BOUNDARY-${patternKind}`,
    patternKind,
    taskKind: "MISSING_TERM",
  });
  assert.equal(question.packageId, "BNS-001");
  assert.equal(question.examProfile, "BANKING_PRELIMS");
  assert.equal(question.optionCount, 5);
  assert.equal(question.options.length, 5);
  assert.equal(question.traceability.ownership, "SPEED_MATHEMATICS_BANKING_NUMBER_SERIES");
  assert.equal(question.traceability.reasoningLetterSeriesOwnership, false);
  assert.equal(question.traceability.questionStudioDiscoverable, false);
  assert.equal(question.traceability.questionBankStatus, "NOT_STORED");
  assert.equal(question.traceability.testEligibility, "INELIGIBLE");
  assert.equal(question.traceability.publiclyPublishable, false);
}

console.log(JSON.stringify({
  status: "SER_BNS_OWNERSHIP_BOUNDARY_PASS",
  series: {
    packageId: "SER-001",
    checkpointId: "SER-CP-009",
    examProfile: "SSC_REASONING",
    optionCount: 4,
    provisionalQlCount: SER_CP009_NUMBER_SERIES_QL_IDS.length,
    lifecycle: "REVIEW_ONLY",
  },
  banking: {
    packageId: "BNS-001",
    examProfile: "BANKING_PRELIMS",
    optionCount: 5,
    ownership: "SPEED_MATHEMATICS_BANKING_NUMBER_SERIES",
  },
}, null, 2));
