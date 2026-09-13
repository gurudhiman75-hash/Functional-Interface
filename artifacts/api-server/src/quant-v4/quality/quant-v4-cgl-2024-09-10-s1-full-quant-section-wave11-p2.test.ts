import assert from "node:assert/strict";

import {
  QUANT_V4_CGL_2024_09_10_S1_FULL_QUANT_SECTION_WAVE11_AUTHORITY,
  QUANT_V4_CGL_2024_09_10_S1_FULL_QUANT_SECTION_WAVE11_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2024_09_10_S1_FULL_QUANT_SECTION_WAVE11_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2024-09-10-s1-full-quant-section-wave11-p2";
import { buildQuantV4WholeSectionFrequencyProfile } from "./quant-v4-whole-section-frequency-calibration-p2";

const observations = QUANT_V4_CGL_2024_09_10_S1_FULL_QUANT_SECTION_WAVE11_COUNTABLE_PYQ_OBSERVATIONS;
const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-10-S1";

assert.equal(QUANT_V4_CGL_2024_09_10_S1_FULL_QUANT_SECTION_WAVE11_AUTHORITY, "QUANT-V4-CGL-2024-09-10-S1-FULL-QUANT-SECTION-WAVE11-P2");
assert.equal(observations.length, 25);
assert.deepEqual(observations.map((observation) => Number(observation.questionRef?.match(/Q(\d+)$/u)?.[1])), Array.from({ length: 25 }, (_, index) => index + 1));
assert.ok(observations.every((observation) => observation.paperId === PAPER_ID));
assert.ok(observations.every((observation) => observation.heldDate === "2024-09-10"));
assert.ok(observations.every((observation) => observation.shift === "Shift 1"));
assert.ok(observations.every((observation) => observation.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((observation) => observation.packageId && observation.packageId !== "UNMAPPED_PACKAGE"));
assert.equal(QUANT_V4_CGL_2024_09_10_S1_FULL_QUANT_SECTION_WAVE11_SOURCE_LIMITATIONS.newObservationCount, 25);
assert.equal(QUANT_V4_CGL_2024_09_10_S1_FULL_QUANT_SECTION_WAVE11_SOURCE_LIMITATIONS.completeSectionQuestionCount, 25);
assert.equal(QUANT_V4_CGL_2024_09_10_S1_FULL_QUANT_SECTION_WAVE11_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2024_09_10_S1_FULL_QUANT_SECTION_WAVE11_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

// Source-math spot checks stay wave-local so future registry growth cannot break this test.
assert.equal(11 + 13, 24); // Q8: collinear points because XY + YZ = XZ.
assert.equal(1500 * 0.07, 105); // Q10: gap between 65% and 58% discounts.
assert.ok(Math.abs(10 * Math.cos(Math.PI / 6) - 5 * Math.sqrt(3)) < 1e-12); // Q11.
assert.equal(3 * 1 + 5 * 5 + 7 * 10, 98); // Q13 weighted coin-ratio block.
assert.equal(99_969 % 47, 0); // Q14.
assert.equal((22 / 7) * 7 * (25 + 7), 704); // Q15 cone TSA.
assert.equal(5480 * 0.95 + 9800 * 0.98, 14_810); // Q17.
assert.equal((1 / 6) / (5 / 6) * 100, 20); // Q18.
assert.equal(12 ** 2 - 2, 142); // Q19.
assert.equal(750 / (4.5 * 5 / 18), 600); // Q22.
assert.equal(1 / ((1 / 3) * (1 / 40 + 1 / 50 + 1 / 60)), 48.64864864864865); // Q23 equal-distance average speed.
assert.equal(30 / 40 + 12 / 80 + 12 / 120, 1); // Q24.

const contributionCounts = observations.reduce<Record<string, number>>((counts, observation) => {
  counts[observation.packageId ?? "UNMAPPED_PACKAGE"] = (counts[observation.packageId ?? "UNMAPPED_PACKAGE"] ?? 0) + 1;
  return counts;
}, {});
assert.deepEqual(contributionCounts, {
  "RAP-003": 1,
  "DI-001": 2,
  "RAP-002": 1,
  "GEO-001": 1,
  "GEO-002": 2,
  "TRG-001": 3,
  "INT-001": 1,
  "NUM-001": 2,
  "PNL-001": 3,
  "DI-003": 1,
  "RAP-001": 1,
  "MEN-002": 1,
  "ALG-001": 2,
  "MEN-001": 1,
  "TSD-001": 2,
  "TMW-001": 1,
});

const localProfile = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations,
  sections: [{ sectionId: "SSC-CGL-T1-2024-09-10-S1-QUANT", examId: "SSC_CGL_TIER_I", paperId: PAPER_ID, heldDate: "2024-09-10", shift: "Shift 1", questionStart: 1, questionEnd: 25, expectedQuestionCount: 25 }],
  policy: { minCompleteSections: 1, minDistinctYears: 1, minPackageCoverage: 1, requireDatedSectionIdentity: true, productionPromotionAuthorized: false },
});
assert.equal(localProfile.completeSectionCount, 1);
assert.equal(localProfile.completeQuestionCount, 25);
assert.equal(localProfile.nonWholeSectionCountableQuestionCount, 0);
assert.equal(localProfile.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.deepEqual([...localProfile.blockers], []);
assert.equal(localProfile.productionPromotionAuthorized, false);

console.log(JSON.stringify({ status: "PASS_QUANT_V4_CGL_2024_09_10_S1_FULL_QUANT_SECTION_WAVE11_P2", observations: observations.length, packages: Object.keys(contributionCounts).length, complete: localProfile.sectionSnapshots[0]?.complete }));
