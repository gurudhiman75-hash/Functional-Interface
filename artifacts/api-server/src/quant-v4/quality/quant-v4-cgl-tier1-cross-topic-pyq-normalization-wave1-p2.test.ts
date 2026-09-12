import assert from "node:assert/strict";

import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_TIER1_CROSS_TOPIC_WAVE1_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_TIER1_CROSS_TOPIC_WAVE1_PYQ_MIGRATION_AUTHORITY,
  QUANT_V4_CGL_TIER1_CROSS_TOPIC_WAVE1_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-tier1-cross-topic-wave1-p2";

const observations = QUANT_V4_CGL_TIER1_CROSS_TOPIC_WAVE1_COUNTABLE_PYQ_OBSERVATIONS;
assert.equal(QUANT_V4_CGL_TIER1_CROSS_TOPIC_WAVE1_PYQ_MIGRATION_AUTHORITY, "QUANT-V4-CGL-TIER1-CROSS-TOPIC-PYQ-NORMALIZATION-WAVE1-P2");
assert.equal(observations.length, 2);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.heldDate && entry.shift && entry.paperId && entry.questionRef));
assert.equal(new Set(observations.map((entry) => entry.paperId)).size, 2);
assert.deepEqual(QUANT_V4_CGL_TIER1_CROSS_TOPIC_WAVE1_SOURCE_LIMITATIONS.packageCounts, { "PNL-001": 1, "TMW-001": 1 });
assert.equal(QUANT_V4_CGL_TIER1_CROSS_TOPIC_WAVE1_SOURCE_LIMITATIONS.paperIdentityResolved, true);
assert.equal(QUANT_V4_CGL_TIER1_CROSS_TOPIC_WAVE1_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, false);

const pnl = observations.find((entry) => entry.packageId === "PNL-001");
assert.ok(pnl);
assert.equal(pnl.heldDate, "2024-09-09");
assert.equal(pnl.shift, "Shift 1");
assert.equal(pnl.paperId, "SSC-CGL-2024-TIER-I-2024-09-09-S1");
assert.ok(pnl.subtopic.includes("PNL-CP-005"));
assert.ok(pnl.subtopic.includes("PNL-QL-121"));
assert.equal(13000 / 870, 1300 / 87);
assert.ok(Math.abs((130 / 870) * 100 - 14.942528735632184) < 1e-12);

const tmw = observations.find((entry) => entry.packageId === "TMW-001");
assert.ok(tmw);
assert.equal(tmw.heldDate, "2023-07-27");
assert.equal(tmw.shift, "Shift 2");
assert.equal(tmw.paperId, "SSC-CGL-2023-TIER-I-2023-07-27-S2");
assert.ok(tmw.subtopic.includes("TMW-CP-002"));
assert.equal(4 + 3 + 2, 9);
assert.equal(36 / 9, 4);

const registryObservationIds = new Set(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.map((entry) => entry.observationId));
assert.ok(observations.every((entry) => registryObservationIds.has(entry.observationId)));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_TIER1_CROSS_TOPIC_PYQ_NORMALIZATION_WAVE1_P2",
  authority: QUANT_V4_CGL_TIER1_CROSS_TOPIC_WAVE1_PYQ_MIGRATION_AUTHORITY,
  wave1ObservationCount: observations.length,
  registeredLocally: observations.every((entry) => registryObservationIds.has(entry.observationId)),
  empiricalWeightingPromoted: false,
}));
