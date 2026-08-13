import assert from "node:assert/strict";

import {
  generateRnkCp007CategoryCompositionQuestion,
  RNK_CP007_CATEGORY_COMPOSITION_MODES,
  solveRnkCp007CategoryComposition,
  type RnkCp007CategoryCompositionState,
  type RnkCp007CategoryId,
} from "./cp007-category-composition-editorial-v1-1";

const QUESTIONS_PER_MODE = 72;
const questions = RNK_CP007_CATEGORY_COMPOSITION_MODES.flatMap((mode) =>
  Array.from({ length: QUESTIONS_PER_MODE }, (_, seed) =>
    generateRnkCp007CategoryCompositionQuestion(mode, seed, (seed % 4) as 0 | 1 | 2 | 3),
  ),
);

assert.equal(questions.length, 288);
assert.equal(new Set(questions.map((question) => question.mathematicalFingerprint)).size, questions.length);
assert.equal(questions.some((question) => question.reviewMetadata.permanentQlAllocated), false);
assert.equal(questions.some((question) => question.reviewMetadata.quantDominant), false);
assert.equal(questions.some((question) => !question.reviewMetadata.allDisplayedEvidenceEssential), false);

function categoryTotal(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return category === "A" ? state.categoryATotal : state.categoryBTotal;
}

function targetAdjustment(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return state.targetCategory === category ? 1 : 0;
}

function withRank(state: RnkCp007CategoryCompositionState, targetRankFromTop: number): RnkCp007CategoryCompositionState {
  return { ...state, targetRankFromTop };
}

function withCategoryTotal(
  state: RnkCp007CategoryCompositionState,
  category: RnkCp007CategoryId,
  delta: number,
): RnkCp007CategoryCompositionState {
  return category === "A"
    ? { ...state, total: state.total + delta, categoryATotal: state.categoryATotal + delta }
    : { ...state, total: state.total + delta, categoryBTotal: state.categoryBTotal + delta };
}

const answerPositions = [0, 0, 0, 0];
const modeCounts = new Map<string, number>();
const partitionIds = new Set<string>();
let minAnswer = Number.POSITIVE_INFINITY;
let maxAnswer = Number.NEGATIVE_INFINITY;
let evidenceCountEchoes = 0;
let rankEssentialChecks = 0;
let ratioEssentialChecks = 0;
let evidenceEssentialChecks = 0;

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
  assert.equal(question.evidence.category === question.reviewMetadata.requestedCategory, false);
  if (question.evidence.count === question.answer) evidenceCountEchoes += 1;

  assert.equal(question.state.categoryATotal + question.state.categoryBTotal, question.state.total);
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
    question.evidence,
  );
  assert.equal(replay, question.answer);

  const visibleMaximum = question.reviewMetadata.requestedSide === "AHEAD"
    ? question.state.targetRankFromTop - 1
    : categoryTotal(question.state, question.reviewMetadata.requestedCategory)
      - targetAdjustment(question.state, question.reviewMetadata.requestedCategory);
  for (const option of question.options) {
    assert.ok(option >= 0 && option <= visibleMaximum, `${question.mode}/${question.seed}: impossible option ${option}/${visibleMaximum}`);
  }

  const changedRank = solveRnkCp007CategoryComposition(
    withRank(question.state, question.state.targetRankFromTop + 1),
    question.reviewMetadata.requestedCategory,
    question.reviewMetadata.requestedSide,
    question.evidence,
  );
  assert.notEqual(changedRank, question.answer, `${question.mode}/${question.seed}: rank clue is decorative`);
  rankEssentialChecks += 1;

  const totalCategoryToPerturb = question.reviewMetadata.requestedSide === "AFTER"
    ? question.reviewMetadata.requestedCategory
    : question.evidence.category;
  const changedTotal = solveRnkCp007CategoryComposition(
    withCategoryTotal(question.state, totalCategoryToPerturb, 1),
    question.reviewMetadata.requestedCategory,
    question.reviewMetadata.requestedSide,
    question.evidence,
  );
  assert.notEqual(changedTotal, question.answer, `${question.mode}/${question.seed}: ratio/category total is decorative`);
  ratioEssentialChecks += 1;

  const changedEvidence = solveRnkCp007CategoryComposition(
    question.state,
    question.reviewMetadata.requestedCategory,
    question.reviewMetadata.requestedSide,
    { ...question.evidence, count: question.evidence.count + 1 },
  );
  assert.notEqual(changedEvidence, question.answer, `${question.mode}/${question.seed}: subgroup count clue is decorative`);
  evidenceEssentialChecks += 1;

  assert.equal(/\b(?:21|31|41)th\b|\b(?:22|32|42)th\b|\b(?:23|33|43)th\b/.test(question.stem), false);
  assert.equal(/ - 0\b/.test(question.explanation), false);
  assert.equal(/left|right|facing|clockwise|anticlockwise|seat/i.test(question.stem), false);
  assert.equal(/cannot be determined|none of these/i.test(question.stem), false);
}

assert.deepEqual(answerPositions, [72, 72, 72, 72]);
for (const mode of RNK_CP007_CATEGORY_COMPOSITION_MODES) {
  assert.equal(modeCounts.get(mode), QUESTIONS_PER_MODE);
}
assert.equal(partitionIds.size, 12);
assert.equal(evidenceCountEchoes, 0, `Answer/evidence numeric echoes must be zero, found ${evidenceCountEchoes}`);

const q65: RnkCp007CategoryCompositionState = {
  total: 150,
  categoryATotal: 100,
  categoryBTotal: 50,
  targetRankFromTop: 25,
  targetCategory: "A",
  categoryAAhead: 14,
  categoryBAhead: 10,
  categoryAAfter: 85,
  categoryBAfter: 40,
};
assert.equal(
  solveRnkCp007CategoryComposition(q65, "A", "AFTER", { category: "B", side: "AHEAD", count: 10 }),
  85,
);

const q67: RnkCp007CategoryCompositionState = {
  total: 90,
  categoryATotal: 30,
  categoryBTotal: 60,
  targetRankFromTop: 14,
  targetCategory: "A",
  categoryAAhead: 3,
  categoryBAhead: 10,
  categoryAAfter: 26,
  categoryBAfter: 50,
};
assert.equal(
  solveRnkCp007CategoryComposition(q67, "A", "AFTER", { category: "B", side: "AHEAD", count: 10 }),
  26,
);

console.log(JSON.stringify({
  status: "PASS",
  version: "RNK_CP007_CATEGORY_COMPOSITION_EDITORIAL_V1_1_ZERO_ECHO",
  prototype: "CATEGORY_COMPOSITION_AROUND_RANK",
  questionsChecked: questions.length,
  questionsPerMode: QUESTIONS_PER_MODE,
  modeCounts: Object.fromEntries(modeCounts),
  answerPositions,
  partitionSchemesRepresented: partitionIds.size,
  uniqueFingerprints: new Set(questions.map((question) => question.mathematicalFingerprint)).size,
  answerRange: [minAnswer, maxAnswer],
  evidenceCountEchoes,
  rankEssentialChecks,
  ratioEssentialChecks,
  evidenceEssentialChecks,
  sourceFixturesReplayed: ["Q65", "Q67"],
  permanentQlAllocated: false,
}, null, 2));
