import assert from "node:assert/strict";

import {
  QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_COUNTABLE_PYQ_OBSERVATIONS,
} from "./quant-v4-pyq-observations-cgl-2024-09-10-s2-full-quant-section-wave10-p2";
import {
  QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_COUNTABLE_PYQ_OBSERVATIONS,
} from "./quant-v4-pyq-observations-cgl-2024-09-11-s1-full-quant-section-wave11-p2";
import {
  QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_COUNTABLE_PYQ_OBSERVATIONS,
} from "./quant-v4-pyq-observations-cgl-2024-09-12-s1-full-quant-section-wave12-p2";
import {
  QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_COUNTABLE_PYQ_OBSERVATIONS,
} from "./quant-v4-pyq-observations-cgl-2024-09-13-s1-full-quant-section-wave13-p2";
import {
  buildQuantV4SpecializedCalibrationReadiness,
} from "./quant-v4-specialized-profile-calibration-readiness-p3";

const cases = [
  {
    rows: QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_COUNTABLE_PYQ_OBSERVATIONS,
    representation: "TWO_FILL_PIPES_COMBINED_TIME_MCQ",
    cpId: "TMW-CP-009",
  },
  {
    rows: QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_COUNTABLE_PYQ_OBSERVATIONS,
    representation: "TWO_FILL_PIPES_COMBINED_TIME_RATE_RATIO_MCQ",
    cpId: "TMW-CP-009",
  },
  {
    rows: QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_COUNTABLE_PYQ_OBSERVATIONS,
    representation: "PIPES_TWO_INLETS_ONE_OUTLET_CLOSED_BEFORE_FULL_MCQ",
    cpId: "TMW-CP-010",
  },
  {
    rows: QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_COUNTABLE_PYQ_OBSERVATIONS,
    representation: "TWO_PIPES_RATE_MULTIPLE_COMBINED_TIME_MCQ",
    cpId: "TMW-CP-009",
  },
] as const;

for (const item of cases) {
  const row = item.rows.find((entry) =>
    entry.packageId === "TMW-001" && entry.representation === item.representation,
  );
  assert.ok(row, `Missing TMW evidence row for ${item.representation}.`);
  assert.match(
    row.subtopic,
    new RegExp(`^${item.cpId}\\b`, "u"),
    `${item.representation} must retain explicit ${item.cpId} ownership.`,
  );
  assert.ok(row.heldDate && row.shift && row.paperId, `${item.representation} must preserve dated paper identity.`);
}

const readiness = buildQuantV4SpecializedCalibrationReadiness({
  packageId: "TMW-001",
  examProfile: "SSC_CGL_TIER_I",
});

assert.equal(readiness.countableObservationCount, 27);
assert.ok(readiness.canonicalCpMappedObservationCount >= 4);
assert.ok(readiness.canonicalCpCoverage.includes("TMW-CP-009"));
assert.ok(readiness.canonicalCpCoverage.includes("TMW-CP-010"));
assert.ok(readiness.cpMappingCompleteness > 0);
assert.equal(readiness.selectionCalibrationAuthorized, false);
assert.ok(readiness.blockers.includes("CALIBRATION_POLICY_NOT_ADOPTED"));
assert.ok(readiness.blockers.includes("DIFFICULTY_EVIDENCE_NOT_NORMALIZED"));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_TMW_CGL_CP_MAPPING_BACKFILL_P3",
  mappedCases: cases.map((item) => ({ representation: item.representation, cpId: item.cpId })),
  readiness,
}));
