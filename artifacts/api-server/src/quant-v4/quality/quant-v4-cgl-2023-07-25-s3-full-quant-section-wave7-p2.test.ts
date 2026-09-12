import assert from "node:assert/strict";

import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_AUTHORITY,
  QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2023-07-25-s3-full-quant-section-wave7-p2";

const observations = QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_COUNTABLE_PYQ_OBSERVATIONS;
const paperId = "SSC-CGL-2023-TIER-I-2023-07-25-S3";
assert.equal(QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_AUTHORITY, "QUANT-V4-CGL-2023-07-25-S3-FULL-QUANT-SECTION-WAVE7-P2");
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === paperId));
assert.ok(observations.every((entry) => entry.heldDate === "2023-07-25"));
assert.ok(observations.every((entry) => entry.shift === "Shift 3"));
assert.ok(observations.every((entry) => entry.packageId && entry.packageId !== "UNMAPPED_PACKAGE"));
assert.equal(QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

const paperRows = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
  .filter((entry) => entry.paperId === paperId)
  .sort((left, right) => Number(left.questionRef?.match(/Q(\d+)$/u)?.[1]) - Number(right.questionRef?.match(/Q(\d+)$/u)?.[1]));
assert.equal(paperRows.length, 25);
assert.deepEqual(paperRows.map((entry) => Number(entry.questionRef?.match(/Q(\d+)$/u)?.[1])), Array.from({ length: 25 }, (_, index) => index + 51));
assert.equal(new Set(paperRows.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);

assert.equal((12 ** 2 - 4 * 32) ** 0.5, 4);
assert.equal(4 * (12 ** 2 - 32), 448);
assert.equal(0.6 - 0.49, 0.11);
assert.equal(220 / 0.11, 2_000);
assert.equal(0.9 * 1.2 * 500, 540);
assert.equal(32 * 13 / 8, 52);
assert.equal((20.8 - 15.2) / 2, 2.8);
assert.equal(1.3 * 0.7, 0.91);

const registryObservationIds = new Set(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.map((entry) => entry.observationId));
assert.ok(observations.every((entry) => registryObservationIds.has(entry.observationId)));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_P2",
  authority: QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_AUTHORITY,
  newObservations: observations.length,
  completeSectionQuestions: paperRows.length,
  registeredLocally: observations.every((entry) => registryObservationIds.has(entry.observationId)),
  productionPromotionAuthorized: false,
}));
