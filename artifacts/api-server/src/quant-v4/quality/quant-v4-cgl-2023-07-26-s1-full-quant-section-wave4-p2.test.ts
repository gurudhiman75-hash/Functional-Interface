import assert from "node:assert/strict";

import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY,
  QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2023-07-26-s1-full-quant-section-wave4-p2";

const observations = QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_COUNTABLE_PYQ_OBSERVATIONS;
const PAPER_ID = "SSC-CGL-2023-TIER-I-2023-07-26-S1";
assert.equal(QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY, "QUANT-V4-CGL-2023-07-26-S1-FULL-QUANT-SECTION-WAVE4-P2");
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === PAPER_ID));
assert.ok(observations.every((entry) => entry.heldDate === "2023-07-26" && entry.shift === "Shift 1"));
assert.deepEqual(observations.map((entry) => Number(entry.questionRef?.match(/Q(\d+)$/u)?.[1])), Array.from({ length: 25 }, (_, index) => 51 + index));
assert.equal(new Set(observations.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);
assert.equal(QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

const sectionPackageCounts = Object.fromEntries(
  [...new Set(observations.map((entry) => entry.packageId ?? "UNMAPPED"))].sort().map((packageId) => [packageId, observations.filter((entry) => entry.packageId === packageId).length]),
);
assert.deepEqual(sectionPackageCounts, {
  "ALG-001": 3, "DI-001": 1, "DI-003": 1, "GEO-001": 2, "GEO-002": 2, "INT-001": 1,
  "MAL-001": 1, "MEN-002": 1, "NUM-001": 1, "PCT-002": 1, "PCT-007": 1, "PNL-001": 2,
  SAP: 1, "TMW-001": 2, "TRG-001": 2, "TSD-001": 2, "TSD-002": 1,
});
assert.equal(Object.values(sectionPackageCounts).reduce((sum, count) => sum + count, 0), 25);

assert.equal(11 * (55 - 7) * 5, 3 * 16 * 55);
assert.equal(12 * 9 / 4, 27);
assert.equal(66, 64 + 2);
assert.equal(20 / 2, 10);
assert.equal(15 * 420 - 16 * (14 * 15 / 2), 11 * 420);
assert.equal((22 / 7) * 21 * 60, 3960);
assert.equal(1755 / 39 * (8 - 28 / 4) - 2, 43);
assert.equal(2 - 0.5, 1.5);
assert.equal(Math.min(0.12 * 625, 0.15 * 555, 0.10 * 720, 0.09 * 845), 72);
assert.equal(21 / 125 * 100, 16.8);
assert.equal(0.175 * 880 * 1.25, 192.5);
assert.equal(200 / 16, 12.5);

const paperRows = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.filter((entry) => entry.paperId === PAPER_ID);
assert.equal(paperRows.length, 25);
const registryObservationIds = new Set(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.map((entry) => entry.observationId));
assert.ok(observations.every((entry) => registryObservationIds.has(entry.observationId)));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_P2",
  authority: QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY,
  newObservations: observations.length,
  completeSectionQuestions: paperRows.length,
  sectionPackageCount: Object.keys(sectionPackageCounts).length,
  empiricalWeightingPromoted: false,
}));
