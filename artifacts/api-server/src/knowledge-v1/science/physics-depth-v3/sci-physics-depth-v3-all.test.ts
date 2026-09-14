import assert from "node:assert/strict";
import { auditPhysicsExhaustiveV2 } from "../physics-exhaustive-v2/sci-physics-exhaustive-generator-v2";
import { SCI_PHYSICS_DEPTH_V3_TARGETS } from "./sci-physics-depth-generator-v3";
import { auditPhysicsDepthReviewedV3, generatePhysicsDepthReviewedAllV3 } from "./sci-physics-depth-reviewed-v3";
import { SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3 } from "./sci-physics-depth-wave2-v3";
import { auditPhysicsDepthWave2ReviewedV3, generatePhysicsDepthWave2ReviewedAllV3 } from "./sci-physics-depth-wave2-reviewed-v3";

const v2 = auditPhysicsExhaustiveV2();
assert.equal(v2.valid, true, `Physics V2 regression: ${v2.errors.join("; ")}`);
assert.equal(v2.totalQuestions, 3480);

const wave1 = auditPhysicsDepthReviewedV3();
assert.equal(wave1.valid, true, `Physics V3 Wave 1: ${wave1.errors.join("; ")}`);
assert.equal(wave1.totalQuestions, 528);
assert.deepEqual(wave1.cpCounts, SCI_PHYSICS_DEPTH_V3_TARGETS);

const wave2 = auditPhysicsDepthWave2ReviewedV3();
assert.equal(wave2.valid, true, `Physics V3 Wave 2: ${wave2.errors.join("; ")}`);
assert.equal(wave2.totalQuestions, 584);
assert.deepEqual(wave2.cpCounts, SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3);

const expectedPositions: Record<string, [number,number,number,number]> = {
  "SCI-CP-001": [31,31,31,31],
  "SCI-CP-002": [36,36,36,36],
  "SCI-CP-003": [33,33,33,33],
  "SCI-CP-004": [32,32,32,32],
  "SCI-CP-005": [24,24,24,24],
  "SCI-CP-006": [18,18,18,18],
  "SCI-CP-007": [16,16,16,16],
  "SCI-CP-008": [47,47,47,47],
  "SCI-CP-009": [22,22,22,22],
  "SCI-CP-010": [19,19,19,19],
};
for (const [cpId, positions] of Object.entries(expectedPositions)) {
  const actual = wave1.cpAnswerPositions[cpId] ?? wave2.cpAnswerPositions[cpId];
  assert.deepEqual(actual, positions, `${cpId}: answer-position balance drift`);
}

const allV3 = [...generatePhysicsDepthReviewedAllV3(), ...generatePhysicsDepthWave2ReviewedAllV3()];
assert.equal(allV3.length, 1112);
assert.equal(new Set(allV3.map((q) => q.questionId)).size, 1112, "V3 question IDs must be unique");
assert.equal(new Set(allV3.map((q) => q.semanticKey)).size, 1112, "V3 semantic keys must be unique");
assert.equal(v2.totalQuestions + allV3.length, 4592);

console.log("SCI Physics Depth V3 full qualification passed: 1,112 new solver-backed questions across CP001-CP010; V2+V3 capacity = 4,592");
