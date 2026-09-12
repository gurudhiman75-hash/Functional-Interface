import assert from "node:assert/strict";

import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_ALGEBRA_WAVE2_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_ALGEBRA_WAVE2_NON_MIGRATED_SOURCE_IDS,
  QUANT_V4_ALGEBRA_WAVE2_PYQ_MIGRATION_AUTHORITY,
} from "./quant-v4-pyq-observations-algebra-wave2-p2";

const observations = QUANT_V4_ALGEBRA_WAVE2_COUNTABLE_PYQ_OBSERVATIONS;
assert.equal(QUANT_V4_ALGEBRA_WAVE2_PYQ_MIGRATION_AUTHORITY, "QUANT-V4-ALGEBRA-PYQ-NORMALIZATION-WAVE2-P2");
assert.equal(observations.length, 5);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.packageId === "ALG-002"));
assert.ok(observations.every((entry) => entry.evidenceKind === "DIRECT_PYQ"));
assert.ok(observations.every((entry) => entry.heldDate && entry.shift));
assert.ok(observations.every((entry) => entry.paperId && entry.questionRef));
assert.ok(observations.every((entry) => entry.sourceRef.includes("ALG-FINAL-SOURCE-FIXTURE-LEDGER-V2.md")));
assert.equal(new Set(observations.map((entry) => entry.questionRef)).size, 5);
assert.equal(new Set(observations.map((entry) => `${entry.examId}:${entry.paperId}:${entry.questionRef}`)).size, 5);

const byExam = new Map<string, number>();
for (const observation of observations) byExam.set(observation.examId, (byExam.get(observation.examId) ?? 0) + 1);
assert.equal(byExam.get("SSC_CGL_TIER_I"), 4);
assert.equal(byExam.get("SSC_CHSL"), 1);
assert.equal(byExam.size, 2);
assert.equal(observations.filter((entry) => entry.subtopic.includes("ALG-QL-041")).length, 3);
assert.equal(observations.filter((entry) => entry.subtopic.includes("ALG-QL-042")).length, 1);
assert.equal(observations.filter((entry) => entry.subtopic.includes("ALG-QL-043")).length, 1);
assert.deepEqual([...QUANT_V4_ALGEBRA_WAVE2_NON_MIGRATED_SOURCE_IDS], ["ALG-V2-S04", "ALG-V2-S06", "ALG-V2-S08", "ALG-V2-S09"]);

const [x, y, z] = [5, 4, 3];
assert.equal(x + y + z, 12);
assert.equal(x + y - z, 6);
assert.equal(x - y + z, 4);

const registryObservationIds = new Set(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.map((entry) => entry.observationId));
assert.ok(observations.every((entry) => registryObservationIds.has(entry.observationId)));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_ALGEBRA_PYQ_NORMALIZATION_WAVE2_P2",
  authority: QUANT_V4_ALGEBRA_WAVE2_PYQ_MIGRATION_AUTHORITY,
  wave2ObservationCount: observations.length,
  registeredLocally: observations.every((entry) => registryObservationIds.has(entry.observationId)),
  wholeSectionWeightReady: false,
}));
