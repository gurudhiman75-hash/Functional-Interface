import assert from "node:assert/strict";
import {
  SCI_PHYSICS_EXHAUSTIVE_CP_META_V2,
  SCI_PHYSICS_EXHAUSTIVE_TARGET_CAPACITY_V2,
} from "./sci-physics-exhaustive-domain-v2";
import {
  auditPhysicsExhaustiveV2,
  generatePhysicsExhaustiveCpV2,
  generatePhysicsExhaustiveBalancedReviewV2,
} from "./sci-physics-exhaustive-generator-v2";

const audit = auditPhysicsExhaustiveV2();
assert.equal(audit.valid, true, audit.errors.join("; "));
assert.equal(audit.totalQuestions, 3480);
assert.equal(SCI_PHYSICS_EXHAUSTIVE_CP_META_V2.length, 10);

for (const cp of SCI_PHYSICS_EXHAUSTIVE_CP_META_V2) {
  assert.equal(cp.anchors.length, 24, `${cp.cpId}: semantic-anchor count`);
  assert.equal(audit.cpCounts[cp.cpId], SCI_PHYSICS_EXHAUSTIVE_TARGET_CAPACITY_V2);
  assert.equal(audit.cpDirectCounts[cp.cpId], 24);
  assert.equal(audit.cpCorrectStatementCounts[cp.cpId], 24);
  assert.equal(audit.cpIncorrectStatementCounts[cp.cpId], 24);
  assert.equal(audit.cpStatementCounts[cp.cpId], 276);
  assert.deepEqual(audit.cpAnswerPositions[cp.cpId], [87, 87, 87, 87]);
  assert.ok(audit.cpTopicCounts[cp.cpId] >= 15, `${cp.cpId}: microtopic breadth`);

  const questions = generatePhysicsExhaustiveCpV2(cp.cpId);
  assert.equal(new Set(questions.map((q) => q.questionId)).size, 348);
  assert.ok(questions.every((q) => q.reviewOnly && !q.runtimeRegistered));
  assert.ok(questions.every((q) => q.options.length === 4 && new Set(q.options).size === 4));
  assert.ok(questions.every((q) => q.options[q.correctIndex] === q.canonicalAnswer));

  const balanced = generatePhysicsExhaustiveBalancedReviewV2(cp.cpId);
  assert.equal(balanced.length, 60);
  assert.equal(balanced.filter((q) => q.family === "direct-anchor").length, 24);
  assert.equal(balanced.filter((q) => q.family === "correct-statement").length, 12);
  assert.equal(balanced.filter((q) => q.family === "incorrect-statement").length, 12);
  assert.equal(balanced.filter((q) => q.family === "two-statement-composition").length, 12);
}

console.log("SCI Physics exhaustive V2 qualification passed: 3480 semantic questions across CP001-CP010");
