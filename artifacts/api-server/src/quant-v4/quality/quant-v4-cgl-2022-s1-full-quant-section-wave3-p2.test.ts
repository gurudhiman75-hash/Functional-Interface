import assert from "node:assert/strict";

import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_AUTHORITY,
  QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2022-12-01-s1-full-quant-section-wave3-p2";

const PAPER_ID = "SSC-CGL-2022-TIER-I-2022-12-01-S1";
const observations = QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_COUNTABLE_PYQ_OBSERVATIONS;
assert.equal(QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_AUTHORITY, "QUANT-V4-CGL-2022-12-01-S1-FULL-QUANT-SECTION-WAVE3-P2");
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === PAPER_ID));
assert.ok(observations.every((entry) => entry.heldDate === "2022-12-01"));
assert.ok(observations.every((entry) => entry.shift === "Shift 1"));
assert.equal(QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_SOURCE_LIMITATIONS.completeSectionQuestionCount, 25);
assert.equal(QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_SOURCE_LIMITATIONS.exactPaperDuplicatesReused, 0);
assert.equal(QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, false);

function qnum(questionRef: string | undefined): number {
  return Number(questionRef?.match(/Q(\d+)$/u)?.[1] ?? -1);
}
const section = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
  .filter((entry) => entry.examId === "SSC_CGL_TIER_I" && entry.paperId === PAPER_ID)
  .sort((a, b) => qnum(a.questionRef) - qnum(b.questionRef));
assert.equal(section.length, 25);
assert.deepEqual(section.map((entry) => qnum(entry.questionRef)), Array.from({ length: 25 }, (_, i) => 51 + i));
assert.equal(new Set(section.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);

const packageCounts = Object.fromEntries(
  [...section.reduce((m, entry) => {
    const packageId = String(entry.packageId);
    m.set(packageId, (m.get(packageId) ?? 0) + 1);
    return m;
  }, new Map<string, number>()).entries()].sort(([a], [b]) => a.localeCompare(b)),
);
assert.deepEqual(packageCounts, {
  "ALG-001": 3, "AVG-001": 1, "DI-001": 2, "DI-003": 1, "DI-005": 1, "GEO-001": 1,
  "GEO-002": 2, "INT-001": 1, "MEN-001": 1, "MEN-002": 1, "NUM-001": 2, "PCT-002": 1,
  "PNL-001": 2, "RAP-001": 1, "TMW-001": 1, "TRG-001": 3, "TSD-001": 1,
});
assert.equal(Object.values(packageCounts).reduce((sum, count) => sum + count, 0), 25);
assert.equal(Object.keys(packageCounts).length, 17);

assert.equal(90 % 12, 6);
assert.equal(Math.sqrt(169 * 144), 156);
assert.ok(Math.abs((1.08 * 1.05 - 1) * 100 - 13.4) < 1e-12);
assert.equal((1225 * 100) / (2500 * 8), 6.125);
assert.equal((210 + 160 + 218) / 3, 196);
assert.equal((27 * 47 - 25 * 42 + 157) / 2, 188);
assert.equal(2 + (2 / 3) * 15, 12);
assert.equal(100 - (27 + 18 + 7 + 14), 34);
assert.equal((352 - 198) / (2 * (22 / 7)), 24.5);
assert.equal(Math.sqrt(12 ** 2 + 10 ** 2 - 2 * 12 * 10 * 0.5), Math.sqrt(124));
assert.ok(Math.abs(3840 * (0.30 - (1 - 0.75 * 0.95)) - 48) < 1e-9);

const registryObservationIds = new Set(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.map((entry) => entry.observationId));
assert.ok(observations.every((entry) => registryObservationIds.has(entry.observationId)));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_P2",
  authority: QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_AUTHORITY,
  completeSectionQuestions: section.length,
  completeSectionPackages: Object.keys(packageCounts).length,
  registeredLocally: observations.every((entry) => registryObservationIds.has(entry.observationId)),
  empiricalWeightingPromoted: false,
}));
