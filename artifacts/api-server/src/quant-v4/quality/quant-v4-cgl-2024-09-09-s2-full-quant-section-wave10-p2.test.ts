import assert from "node:assert/strict";

import {
  QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_AUTHORITY,
  QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2024-09-09-s2-full-quant-section-wave10-p2";
import { buildQuantV4WholeSectionFrequencyProfile } from "./quant-v4-whole-section-frequency-calibration-p2";

const observations = QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_COUNTABLE_PYQ_OBSERVATIONS;
const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-09-S2";

assert.equal(QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_AUTHORITY, "QUANT-V4-CGL-2024-09-09-S2-FULL-QUANT-SECTION-WAVE10-P2");
assert.equal(observations.length, 25);
assert.deepEqual(observations.map((observation) => Number(observation.questionRef?.match(/Q(\d+)$/u)?.[1])), Array.from({ length: 25 }, (_, index) => index + 1));
assert.ok(observations.every((observation) => observation.paperId === PAPER_ID));
assert.ok(observations.every((observation) => observation.heldDate === "2024-09-09"));
assert.ok(observations.every((observation) => observation.shift === "Shift 2"));
assert.ok(observations.every((observation) => observation.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((observation) => observation.packageId && observation.packageId !== "UNMAPPED_PACKAGE"));

assert.equal(QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS.newObservationCount, 25);
assert.equal(QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS.completeSectionQuestionCount, 25);
assert.equal(QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS.paperIdentityResolved, true);
assert.equal(QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS.officialSscHostedCopy, false);
assert.equal(QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

// Source-math spot checks: these validate normalization notes without depending on mutable registry totals.
assert.equal(1 + (1 / 3) ** 2, 10 / 9); // Q1: sec² = 1 + tan².
assert.equal(8.3 + 9.2 + 6.1, 23.6); // Q3 cubic-identity quotient.
assert.equal(42_000 * 0.8 * 1.3 - 42_000, 1_680); // Q5 sequential loss/gain.
assert.equal(8_000 * 0.12 * 4 - 5_000 * 0.15 * 3, 1_590); // Q7 SI difference.
assert.equal(16 * 22 + 16 * 26 - 31 * 24, 24); // Q9 overlapping averages.
assert.ok(Math.abs(10 ** 2 + 10 ** 2 - (10 * Math.sqrt(2)) ** 2) < 1e-9); // Q13 right-isosceles hypotenuse.
assert.equal((22 / 7) * 8 ** 2 * 14, 2_816); // Q14 cylinder volume.
const oldSaving = 16_000 * 0.2;
const newSaving = 16_000 * 1.2 - 16_000 * 0.8 * 1.1;
assert.equal((newSaving - oldSaving) / oldSaving, 0.6); // Q15 savings increase = 60%.
assert.equal(18 * 5 / 18, 5); // Q17 relative speed in m/s.
assert.equal(1_635 / 5, 327); // Q17 meeting time in seconds.
assert.equal(0.5 * 15.75 * 11, 86.625); // Q19 sector area from radius and arc.
assert.equal(2 * 6, 3 * 4); // Q22 inverse variation.
assert.equal((2 + 8 + 7 + 3 + 5 + 4 + 2 + 9) % 9, 4); // Q23 divisibility/remainder.
assert.ok(Math.abs((21 - 4.9 / 7 + 3.9 * 0.4 + 0.9) - 22.76) < 1e-12); // Q24 BODMAS.

const contributionCounts = observations.reduce<Record<string, number>>((counts, observation) => {
  counts[observation.packageId ?? "UNMAPPED_PACKAGE"] = (counts[observation.packageId ?? "UNMAPPED_PACKAGE"] ?? 0) + 1;
  return counts;
}, {});
assert.deepEqual(contributionCounts, {
  "TRG-001": 2,
  "GEO-001": 3,
  "ALG-001": 3,
  "DI-005": 2,
  "PNL-001": 2,
  "INT-001": 1,
  "GEO-002": 1,
  "AVG-001": 1,
  "DI-001": 1,
  "MEN-002": 1,
  "PCT-001": 1,
  "TSD-001": 1,
  "MEN-001": 1,
  "DI-003": 1,
  "RAP-001": 1,
  "NUM-001": 2,
  "TMW-001": 1,
});

const localProfile = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations,
  sections: [{
    sectionId: "SSC-CGL-T1-2024-09-09-S2-QUANT",
    examId: "SSC_CGL_TIER_I",
    paperId: PAPER_ID,
    heldDate: "2024-09-09",
    shift: "Shift 2",
    questionStart: 1,
    questionEnd: 25,
    expectedQuestionCount: 25,
  }],
  policy: {
    minCompleteSections: 1,
    minDistinctYears: 1,
    minPackageCoverage: 1,
    requireDatedSectionIdentity: true,
    productionPromotionAuthorized: false,
  },
});
assert.equal(localProfile.completeSectionCount, 1);
assert.equal(localProfile.completeQuestionCount, 25);
assert.equal(localProfile.nonWholeSectionCountableQuestionCount, 0);
assert.equal(localProfile.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.deepEqual([...localProfile.blockers], []);
assert.equal(localProfile.productionPromotionAuthorized, false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_P2",
  observations: observations.length,
  packages: Object.keys(contributionCounts).length,
  complete: localProfile.sectionSnapshots[0]?.complete,
}));
