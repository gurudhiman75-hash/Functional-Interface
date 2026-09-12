import assert from "node:assert/strict";

import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_AUTHORITY,
  QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2023-07-25-s1-full-quant-section-wave6-p2";

const observations = QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_COUNTABLE_PYQ_OBSERVATIONS;
const paperId = "SSC-CGL-2023-TIER-I-2023-07-25-S1";
assert.equal(QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_AUTHORITY, "QUANT-V4-CGL-2023-07-25-S1-FULL-QUANT-SECTION-WAVE6-P2");
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === paperId));
assert.ok(observations.every((entry) => entry.heldDate === "2023-07-25"));
assert.ok(observations.every((entry) => entry.shift === "Shift 1"));
assert.ok(observations.every((entry) => entry.packageId && entry.packageId !== "UNMAPPED_PACKAGE"));
assert.equal(QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

const paperRows = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
  .filter((entry) => entry.paperId === paperId)
  .sort((left, right) => Number(left.questionRef?.match(/Q(\d+)$/u)?.[1]) - Number(right.questionRef?.match(/Q(\d+)$/u)?.[1]));
assert.equal(paperRows.length, 25);
assert.deepEqual(paperRows.map((entry) => Number(entry.questionRef?.match(/Q(\d+)$/u)?.[1])), Array.from({ length: 25 }, (_, index) => index + 51));
assert.equal(new Set(paperRows.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);

assert.equal(13_500 / 0.25, 54_000);
assert.equal(54_000 * 0.125 * 6, 40_500);
assert.equal(20 * 67 - 19 * 65, 105);
assert.equal(12 ** 3 - 6 ** 3 - 8 ** 3, 10 ** 3);
assert.equal((8 ** 8 + 6) % 7, 0);
assert.equal(39 * 6, 234);
assert.equal(234 * 18 + 39, 4_251);
assert.equal(29 ** 2 - (25 - 4) ** 2, 20 ** 2);
assert.equal(400 * 60, 12 * (18 - 16) * 1000);
assert.equal(150 ** 2 + 80 ** 2, 170 ** 2);
assert.equal(2 * (150 + 80), 460);

const registryObservationIds = new Set(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.map((entry) => entry.observationId));
assert.ok(observations.every((entry) => registryObservationIds.has(entry.observationId)));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_P2",
  authority: QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_AUTHORITY,
  newObservations: observations.length,
  completeSectionQuestions: paperRows.length,
  registeredLocally: observations.every((entry) => registryObservationIds.has(entry.observationId)),
  productionPromotionAuthorized: false,
}));
