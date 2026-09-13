import assert from "node:assert/strict";

import {
  QUANT_V4_EXTERNAL_SOURCE_AUDIT_V1,
  QUANT_V4_EXTERNAL_SOURCES_V1,
  sourceById,
  summarizeExternalCoverage,
  type QuantExternalCoverageObservation,
} from "./external-source-audit-v1";

assert.equal(QUANT_V4_EXTERNAL_SOURCE_AUDIT_V1.version, "QUANT_V4_EXTERNAL_SOURCE_AUDIT_V1");
assert.ok(QUANT_V4_EXTERNAL_SOURCES_V1.some((source) => source.sourceId === "BOOK-RAKESH-YADAV-MATHS-7300"));
assert.equal(sourceById("BOOK-RAKESH-YADAV-MATHS-7300")?.tier, "B_TARGET_EXAM_BOOK");
assert.equal(sourceById("BOOK-ARUN-SHARMA-QA-CAT-2018")?.countInTargetCoverageDenominator, false);

const sample: readonly QuantExternalCoverageObservation[] = [
  {
    observationId: "obs-1",
    sourceId: "BOOK-RAKESH-YADAV-MATHS-7300",
    sourceLocator: "sample-1",
    packageId: "TRG-001",
    proposedFamily: "STANDARD_VALUE",
    disposition: "DIRECTLY_COVERED",
    mappedQlIds: ["TRG-001-QL-001"],
    confidence: "HIGH",
    notes: "test",
  },
  {
    observationId: "obs-2",
    sourceId: "BOOK-RAKESH-YADAV-MATHS-7300",
    sourceLocator: "sample-2",
    packageId: "TRG-001",
    proposedFamily: "NOVEL_FORM",
    disposition: "MISSING_ARCHETYPE",
    mappedQlIds: [],
    confidence: "HIGH",
    notes: "test",
  },
  {
    observationId: "obs-3",
    sourceId: "BOOK-RAKESH-YADAV-MATHS-7300",
    sourceLocator: "sample-3",
    packageId: "TRG-001",
    proposedFamily: "HEIGHT_DISTANCE",
    disposition: "OWNED_BY_OTHER_PACKAGE",
    mappedQlIds: [],
    confidence: "HIGH",
    notes: "TRG-002",
  },
  {
    observationId: "obs-4",
    sourceId: "BOOK-ARUN-SHARMA-QA-CAT-2018",
    sourceLocator: "sample-4",
    packageId: "TRG-001",
    proposedFamily: "CAT_ONLY",
    disposition: "MISSING_ARCHETYPE",
    mappedQlIds: [],
    confidence: "HIGH",
    notes: "must not lower SSC book score",
  },
];

const summary = summarizeExternalCoverage(sample, "B_TARGET_EXAM_BOOK");
assert.equal(summary.eligible, 2);
assert.equal(summary.covered, 1);
assert.equal(summary.missing, 1);
assert.equal(summary.coverageRate, 0.5);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_EXTERNAL_SOURCE_AUDIT_V1",
  sourceCount: QUANT_V4_EXTERNAL_SOURCES_V1.length,
  sampleSummary: summary,
}));
