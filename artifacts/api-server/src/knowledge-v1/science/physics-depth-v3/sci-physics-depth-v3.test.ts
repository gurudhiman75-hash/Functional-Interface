import assert from "node:assert/strict";
import { auditPhysicsExhaustiveV2 } from "../physics-exhaustive-v2/sci-physics-exhaustive-generator-v2";
import {
  SCI_PHYSICS_DEPTH_V3_TARGETS,
} from "./sci-physics-depth-generator-v3";
import { auditPhysicsDepthReviewedV3 } from "./sci-physics-depth-reviewed-v3";

const v2 = auditPhysicsExhaustiveV2();
assert.equal(v2.valid, true, `Physics V2 regression: ${v2.errors.join("; ")}`);
assert.equal(v2.totalQuestions, 3480);

const v3 = auditPhysicsDepthReviewedV3();
assert.equal(v3.valid, true, `Physics Depth V3: ${v3.errors.join("; ")}`);
assert.equal(v3.totalQuestions, 528);
assert.deepEqual(v3.cpCounts, SCI_PHYSICS_DEPTH_V3_TARGETS);
assert.deepEqual(v3.cpAnswerPositions["SCI-CP-001"], [31,31,31,31]);
assert.deepEqual(v3.cpAnswerPositions["SCI-CP-002"], [36,36,36,36]);
assert.deepEqual(v3.cpAnswerPositions["SCI-CP-003"], [33,33,33,33]);
assert.deepEqual(v3.cpAnswerPositions["SCI-CP-004"], [32,32,32,32]);
for (const cpId of Object.keys(SCI_PHYSICS_DEPTH_V3_TARGETS)) {
  assert.ok(v3.cpFamilyCounts[cpId] >= 8, `${cpId}: insufficient family diversity`);
  assert.ok((v3.difficulty[cpId]?.Easy ?? 0) > 0, `${cpId}: missing Easy questions`);
  assert.ok((v3.difficulty[cpId]?.Medium ?? 0) > 0, `${cpId}: missing Medium questions`);
  assert.ok((v3.difficulty[cpId]?.Hard ?? 0) > 0, `${cpId}: missing Hard questions`);
}
assert.equal(v2.totalQuestions + v3.totalQuestions, 4008);
console.log("SCI Physics Depth V3 qualification passed: 528 new solver-backed questions; V2+V3 semantic capacity = 4008");
