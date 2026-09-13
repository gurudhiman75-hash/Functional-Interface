import assert from "node:assert/strict";

import {
  QUANT_V4_CGL_2024_09_17_S1_FULL_QUANT_SECTION_WAVE12_AUTHORITY,
  QUANT_V4_CGL_2024_09_17_S1_FULL_QUANT_SECTION_WAVE12_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2024_09_17_S1_FULL_QUANT_SECTION_WAVE12_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2024-09-17-s1-full-quant-section-wave12-p2";
import { buildQuantV4WholeSectionFrequencyProfile } from "./quant-v4-whole-section-frequency-calibration-p2";

const observations = QUANT_V4_CGL_2024_09_17_S1_FULL_QUANT_SECTION_WAVE12_COUNTABLE_PYQ_OBSERVATIONS;
const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-17-S1";

assert.equal(QUANT_V4_CGL_2024_09_17_S1_FULL_QUANT_SECTION_WAVE12_AUTHORITY, "QUANT-V4-CGL-2024-09-17-S1-FULL-QUANT-SECTION-WAVE12-P2");
assert.equal(observations.length, 25);
assert.deepEqual(observations.map((observation) => Number(observation.questionRef?.match(/Q(\d+)$/u)?.[1])), Array.from({ length: 25 }, (_, index) => index + 1));
assert.ok(observations.every((observation) => observation.paperId === PAPER_ID));
assert.ok(observations.every((observation) => observation.heldDate === "2024-09-17"));
assert.ok(observations.every((observation) => observation.shift === "Shift 1"));
assert.ok(observations.every((observation) => observation.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((observation) => observation.packageId && observation.packageId !== "UNMAPPED_PACKAGE"));
assert.equal(QUANT_V4_CGL_2024_09_17_S1_FULL_QUANT_SECTION_WAVE12_SOURCE_LIMITATIONS.newObservationCount, 25);
assert.equal(QUANT_V4_CGL_2024_09_17_S1_FULL_QUANT_SECTION_WAVE12_SOURCE_LIMITATIONS.completeSectionQuestionCount, 25);
assert.equal(QUANT_V4_CGL_2024_09_17_S1_FULL_QUANT_SECTION_WAVE12_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2024_09_17_S1_FULL_QUANT_SECTION_WAVE12_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

// Wave-local source math checks; no mutable global totals are asserted here.
assert.equal(1.2 * 0.7, 0.84); // Q4: 16% loss.
assert.equal((48 * 95) / 6, 760); // Q5: average of first 47 squares.
assert.equal(9 ** 3 + 3 * 9, 756); // Q6: reciprocal cubic difference.
assert.equal((22 / 7) * 7 ** 2 * 25 / 1000, 3.85); // Q7 litres.
assert.equal((7200 * 16 * 3) / (9600 * 4), 9); // Q9 unknown SI rate.
assert.equal((12 + 20) + 48, 80); // Q11 revised collection total.
assert.equal((16 * 360) / 64, 90); // Q12 central angle.
assert.equal((8 * 8), 64); // Q14 meeting point distance from P.
assert.equal(5 / 7, 15 / 21); // Q15 coefficient ratio for no solution gives k=5.
assert.equal(180 - 40, 140); // Q16 central angle between radii to tangent points.
assert.equal(44.8 / 1.12, 40); // Q19 original cost per kg.
assert.equal((5 * 40 * 1.05) / 4, 52.5); // Q19 revised selling price after one-fifth spoilage.
assert.equal((2 + 4 + 9 + 8 + 7 + 6), 36); // Q20 fixed digit sum; k must make the total divisible by 3.
assert.equal(1.2 * 0.82, 0.984); // Q25 payroll multiplier = 1.6% decrease.

const contributionCounts = observations.reduce<Record<string, number>>((counts, observation) => {
  counts[observation.packageId ?? "UNMAPPED_PACKAGE"] = (counts[observation.packageId ?? "UNMAPPED_PACKAGE"] ?? 0) + 1;
  return counts;
}, {});
assert.deepEqual(contributionCounts, {
  "TRG-001": 3,
  "DI-005": 1,
  "RAP-002": 1,
  "PNL-001": 3,
  "AVG-001": 1,
  "ALG-001": 1,
  "MEN-002": 1,
  "GEO-001": 1,
  "INT-001": 1,
  "RAP-001": 1,
  "MEN-001": 2,
  SAP: 1,
  "TSD-001": 1,
  "ALG-002": 1,
  "GEO-002": 1,
  "TMW-001": 1,
  "DI-001": 1,
  "NUM-001": 1,
  "DI-003": 1,
  "PCT-001": 1,
});

const localProfile = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations,
  sections: [{ sectionId: "SSC-CGL-T1-2024-09-17-S1-QUANT", examId: "SSC_CGL_TIER_I", paperId: PAPER_ID, heldDate: "2024-09-17", shift: "Shift 1", questionStart: 1, questionEnd: 25, expectedQuestionCount: 25 }],
  policy: { minCompleteSections: 1, minDistinctYears: 1, minPackageCoverage: 1, requireDatedSectionIdentity: true, productionPromotionAuthorized: false },
});
assert.equal(localProfile.completeSectionCount, 1);
assert.equal(localProfile.completeQuestionCount, 25);
assert.equal(localProfile.nonWholeSectionCountableQuestionCount, 0);
assert.equal(localProfile.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.deepEqual([...localProfile.blockers], []);
assert.equal(localProfile.productionPromotionAuthorized, false);

console.log(JSON.stringify({ status: "PASS_QUANT_V4_CGL_2024_09_17_S1_FULL_QUANT_SECTION_WAVE12_P2", observations: observations.length, packages: Object.keys(contributionCounts).length, complete: localProfile.sectionSnapshots[0]?.complete }));
