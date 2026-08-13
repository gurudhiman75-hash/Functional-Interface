import assert from "node:assert/strict";

import {
  generateRnkCp007CategoryCompositionQuestion,
  RNK_CP007_CATEGORY_COMPOSITION_MODES,
  solveRnkCp007CategoryComposition,
} from "./cp007-category-composition-discovery-v1";

const QUESTIONS_PER_MODE = 96;
const questions = RNK_CP007_CATEGORY_COMPOSITION_MODES.flatMap((mode) =>
  Array.from({ length: QUESTIONS_PER_MODE }, (_, seed) =>
    generateRnkCp007CategoryCompositionQuestion(mode, seed, (seed % 4) as 0 | 1 | 2 | 3),
  ),
);

assert.equal(questions.length, 288);
assert.equal(new Set(questions.map((question) => question.mathematicalFingerprint)).size, questions.length);
assert.equal(questions.some((question) => question.reviewMetadata.permanentQlAllocated), false);
assert.equal(questions.some((question) => question.reviewMetadata.quantDominant), false);

const answerPositions = [0, 0, 0, 0];
const modeCounts = new Map<string, number>();
const partitionIds = new Set<string>();
let minAnswer = Number.POSITIVE_INFINITY;
let maxAnswer = Number.NEGATIVE_INFINITY;

for (const question of questions) {
  answerPositions[question.answerIndex] += 1;
  modeCounts.set(question.mode, (modeCounts.get(question.mode) ?? 0) + 1);
  partitionIds.add(question.reviewMetadata.partitionId);
  minAnswer = Math.min(minAnswer, question.answer);
  maxAnswer = Math.max(maxAnswer, question.answer);

  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.answerIndex], question.answer);
  assert.ok(question.answer >= 0);
  assert.ok(question.state.categoryATotal + question.state.categoryBTotal === question.state.total);
  assert.equal(question.state.categoryAAhead + question.state.categoryBAhead, question.state.targetRankFromTop - 1);
  assert.equal(
    question.state.categoryAAhead + question.state.categoryAAfter + (question.state.targetCategory === "A" ? 1 : 0),
    question.state.categoryATotal,
  );
  assert.equal(
    question.state.categoryBAhead + question.state.categoryBAfter + (question.state.targetCategory === "B" ? 1 : 0),
    question.state.categoryBTotal,
  );

  const replay = solveRnkCp007CategoryComposition(
    question.state,
    question.reviewMetadata.requestedCategory,
    question.reviewMetadata.requestedSide,
  );
  assert.equal(replay, question.answer);

  if (question.reviewMetadata.requestedSide === "AHEAD") {
    assert.notEqual(question.reviewMetadata.requestedCategory, question.state.knownAheadCategory);
    assert.notEqual(question.answer, question.state.knownAheadCount);
  }

  assert.equal(/left|right|facing|clockwise|anticlockwise|seat/i.test(question.stem), false);
  assert.equal(/cannot be determined|none of these/i.test(question.stem), false);
}

assert.deepEqual(answerPositions, [72, 72, 72, 72]);
for (const mode of RNK_CP007_CATEGORY_COMPOSITION_MODES) {
  assert.equal(modeCounts.get(mode), QUESTIONS_PER_MODE);
}
assert.ok(partitionIds.size >= 8, `Expected broad partition diversity, found ${partitionIds.size}`);

// Reconstruct source Q65 and Q67 through the same normalized solver contract.
const q65 = {
  total: 150,
  categoryATotal: 100,
  categoryBTotal: 50,
  targetRankFromTop: 25,
  targetCategory: "A" as const,
  knownAheadCategory: "B" as const,
  knownAheadCount: 10,
  categoryAAhead: 14,
  categoryBAhead: 10,
  categoryAAfter: 85,
  categoryBAfter: 40,
};
assert.equal(solveRnkCp007CategoryComposition(q65, "A", "AFTER"), 85);

const q67 = {
  total: 90,
  categoryATotal: 30,
  categoryBTotal: 60,
  targetRankFromTop: 14,
  targetCategory: "A" as const,
  knownAheadCategory: "B" as const,
  knownAheadCount: 10,
  categoryAAhead: 3,
  categoryBAhead: 10,
  categoryAAfter: 26,
  categoryBAfter: 50,
};
assert.equal(solveRnkCp007CategoryComposition(q67, "A", "AFTER"), 26);

console.log(JSON.stringify({
  status: "PASS",
  prototype: "CATEGORY_COMPOSITION_AROUND_RANK",
  questionsChecked: questions.length,
  questionsPerMode: QUESTIONS_PER_MODE,
  answerPositions,
  partitionSchemesRepresented: partitionIds.size,
  uniqueFingerprints: new Set(questions.map((question) => question.mathematicalFingerprint)).size,
  answerRange: [minAnswer, maxAnswer],
  sourceFixturesReplayed: ["Q65", "Q67"],
  permanentQlAllocated: false,
}, null, 2));
