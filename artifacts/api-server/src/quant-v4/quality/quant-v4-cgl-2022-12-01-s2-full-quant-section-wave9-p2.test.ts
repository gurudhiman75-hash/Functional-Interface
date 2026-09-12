import assert from "node:assert/strict";

import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_2022_12_01_S2_FULL_QUANT_SECTION_WAVE9_AUTHORITY,
  QUANT_V4_CGL_2022_12_01_S2_FULL_QUANT_SECTION_WAVE9_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2022_12_01_S2_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2022-12-01-s2-full-quant-section-wave9-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
} from "./quant-v4-whole-section-frequency-calibration-p2";

const observations = QUANT_V4_CGL_2022_12_01_S2_FULL_QUANT_SECTION_WAVE9_COUNTABLE_PYQ_OBSERVATIONS;
const paperId = "SSC-CGL-2022-TIER-I-2022-12-01-S2";

assert.equal(QUANT_V4_CGL_2022_12_01_S2_FULL_QUANT_SECTION_WAVE9_AUTHORITY, "QUANT-V4-CGL-2022-12-01-S2-FULL-QUANT-SECTION-WAVE9-P2");
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === paperId));
assert.ok(observations.every((entry) => entry.heldDate === "2022-12-01"));
assert.ok(observations.every((entry) => entry.shift === "Shift 2"));
assert.ok(observations.every((entry) => entry.packageId && entry.packageId !== "UNMAPPED_PACKAGE"));
assert.equal(QUANT_V4_CGL_2022_12_01_S2_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2022_12_01_S2_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS.stabilityExpansionEvidence, true);
assert.equal(QUANT_V4_CGL_2022_12_01_S2_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

const paperRows = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
  .filter((entry) => entry.paperId === paperId)
  .sort((left, right) => Number(left.questionRef?.match(/Q(\d+)$/u)?.[1]) - Number(right.questionRef?.match(/Q(\d+)$/u)?.[1]));
assert.equal(paperRows.length, 25);
assert.deepEqual(paperRows.map((entry) => Number(entry.questionRef?.match(/Q(\d+)$/u)?.[1])), Array.from({ length: 25 }, (_, index) => index + 51));
assert.equal(new Set(paperRows.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);

// Wave-local source-math checks. These do not pin moving global registry totals.
assert.equal(48 ** 2 - 2, 2302); // Q52 reciprocal fourth power.
assert.equal(384 / 48, 8); // Q57 HCF.
assert.ok(Math.abs((1.10 * 1.05 * 1.15 - 1) * 100 - 32.825) < 1e-12); // Q58 successive rise.
assert.equal((25 * 19 - 18 - 19 + 14 + 15) / 25, 18.68); // Q60 corrected average.
assert.equal(9 + 5 - 4 + 0 - 6, 4); // Q61 exponent sum.
assert.equal(1200 / 0.15 + 1200, 9200); // Q64 selling price.
assert.equal(360 / 0.5, 720); // Q65 principal.
assert.equal(Math.sqrt(10 ** 2 + 24 ** 2), 26); // Q75 tangent geometry.

const profile = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
const snapshot = profile.sectionSnapshots.find((entry) => entry.paperId === paperId);
assert.ok(snapshot);
assert.equal(snapshot.complete, true);
assert.equal(snapshot.questionCount, 25);
assert.equal(profile.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.equal(profile.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(profile), false);
assert.ok(profile.packageWeights.some((entry) => entry.packageId === "SRI-001"));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2022_12_01_S2_FULL_QUANT_SECTION_WAVE9_P2",
  authority: QUANT_V4_CGL_2022_12_01_S2_FULL_QUANT_SECTION_WAVE9_AUTHORITY,
  newObservations: observations.length,
  paperComplete: snapshot.complete,
  evidenceStatus: profile.evidenceStatus,
  productionPromotionAuthorized: profile.productionPromotionAuthorized,
}));
