import assert from "node:assert/strict";

import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_AUTHORITY,
  QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2023-07-26-s2-full-quant-section-wave5-p2";

const observations = QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_COUNTABLE_PYQ_OBSERVATIONS;
const PAPER_ID = "SSC-CGL-2023-TIER-I-2023-07-26-S2";
assert.equal(QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_AUTHORITY, "QUANT-V4-CGL-2023-07-26-S2-FULL-QUANT-SECTION-WAVE5-P2");
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === PAPER_ID));
assert.ok(observations.every((entry) => entry.heldDate === "2023-07-26" && entry.shift === "Shift 2"));
assert.deepEqual(observations.map((entry) => Number(entry.questionRef?.match(/Q(\d+)$/u)?.[1])), Array.from({ length: 25 }, (_, index) => 51 + index));
assert.equal(new Set(observations.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);
assert.equal(QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

const sectionPackageCounts = Object.fromEntries(
  [...new Set(observations.map((entry) => entry.packageId ?? "UNMAPPED"))].sort().map((packageId) => [packageId, observations.filter((entry) => entry.packageId === packageId).length]),
);
assert.deepEqual(sectionPackageCounts, {
  "ALG-001": 3, "AVG-001": 1, "DI-001": 2, "GEO-001": 1, "INT-001": 1, "MEN-001": 1,
  "MEN-002": 2, "NUM-001": 1, "PCT-002": 1, "PNL-001": 1, "RAP-001": 1, SAP: 1,
  "TMW-001": 4, "TRG-001": 3, "TSD-001": 2,
});
assert.equal(Object.values(sectionPackageCounts).reduce((sum, count) => sum + count, 0), 25);

assert.equal(1099 / 7 * 10, 1570);
assert.equal(1440 / 8 / 2, 90);
assert.equal(10 * 15 / (10 + 15), 6);
assert.equal(405 * 2 / 54, 15);
assert.equal(4 * (22 / 7) * 35 * 35, 15400);
assert.equal(60 * (36 / 5), 432);
assert.equal((35 + 2 + 8) % 9, 0);
assert.equal(Math.sqrt(2 * 2 + 4 * 8), 6);
assert.equal(9.2 * (0.36 / 1.2), 2.76);
assert.equal(13 * 13 - 2 * 54, 61);
assert.ok(Math.abs(1 / (1 / 72 - 1 / 120) - 180) < 1e-12);
assert.ok(Math.abs(6400 * 100 / (21000 * 3) - 640 / 63) < 1e-12);
assert.equal(1 / (9 / 84 - 10 / 105), 84);
assert.equal((60 * 46.5 - 35 * 42) / 25, 52.8);
assert.equal((110 * 360) / (56 * (22 / 7)), 225);
assert.equal((1 + 7) / (1 + 11), 2 / 3);
assert.equal(6 - (6 / 2 - 3 + 7 - 2) * ((3 - 2 / 2) * 5 - 6), -14);
assert.equal(50 * 25 * 10 * 1000, 12_500_000);

const paperRows = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.filter((entry) => entry.paperId === PAPER_ID);
assert.equal(paperRows.length, 25);
const registryObservationIds = new Set(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.map((entry) => entry.observationId));
assert.ok(observations.every((entry) => registryObservationIds.has(entry.observationId)));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_P2",
  authority: QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_AUTHORITY,
  newObservations: observations.length,
  completeSectionQuestions: paperRows.length,
  sectionPackageCount: Object.keys(sectionPackageCounts).length,
  empiricalWeightingPromoted: false,
}));
