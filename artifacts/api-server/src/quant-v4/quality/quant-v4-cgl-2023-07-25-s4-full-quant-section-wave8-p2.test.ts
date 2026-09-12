import assert from "node:assert/strict";

import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_AUTHORITY,
  QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2023-07-25-s4-full-quant-section-wave8-p2";

const observations = QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_COUNTABLE_PYQ_OBSERVATIONS;
const paperId = "SSC-CGL-2023-TIER-I-2023-07-25-S4";
assert.equal(QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_AUTHORITY, "QUANT-V4-CGL-2023-07-25-S4-FULL-QUANT-SECTION-WAVE8-P2");
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === paperId));
assert.ok(observations.every((entry) => entry.heldDate === "2023-07-25"));
assert.ok(observations.every((entry) => entry.shift === "Shift 4"));
assert.ok(observations.every((entry) => entry.packageId && entry.packageId !== "UNMAPPED_PACKAGE"));
assert.equal(QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, true);
assert.equal(QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

const paperRows = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
  .filter((entry) => entry.paperId === paperId)
  .sort((left, right) => Number(left.questionRef?.match(/Q(\d+)$/u)?.[1]) - Number(right.questionRef?.match(/Q(\d+)$/u)?.[1]));
assert.equal(paperRows.length, 25);
assert.deepEqual(paperRows.map((entry) => Number(entry.questionRef?.match(/Q(\d+)$/u)?.[1])), Array.from({ length: 25 }, (_, index) => index + 51));
assert.equal(new Set(paperRows.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);

assert.equal(7 ** 3, 343);
assert.equal(4 * 18 / 12 - 4, 2);
assert.equal((2 * (4 * 6 + 6 * 8 + 8 * 4)) ** 0.5 > 14.4, true);
assert.equal((5_200 - 0.08 * 50_000) / 0.04, 30_000);
assert.equal(2_695 / (1.1 * 1.4), 1_750);
assert.equal((900 * 15 + 700 * 14 - 1_600 * 10) / (1_600 * 10) * 100, 45.625);
assert.equal(10 / 50 * 100, 20);
assert.equal((15_990 - 12_792) / 15_990 * 100, 20);
assert.equal(54_736 % 44, 0);

const registryObservationIds = new Set(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.map((entry) => entry.observationId));
assert.ok(observations.every((entry) => registryObservationIds.has(entry.observationId)));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_P2",
  authority: QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_AUTHORITY,
  newObservations: observations.length,
  completeSectionQuestions: paperRows.length,
  registeredLocally: observations.every((entry) => registryObservationIds.has(entry.observationId)),
  frequencyCalibrationAllowed: true,
  productionPromotionAuthorized: false,
}));
