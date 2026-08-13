import assert from "node:assert/strict";

import {
  buildRnkCp007CategoryCompositionProductionCandidate,
  RNK_CP007_CATEGORY_COMPOSITION_AUTHORITY_CANDIDATE_ID,
  RNK_CP007_CATEGORY_COMPOSITION_PRODUCTION_CANDIDATE_VERSION,
  rnkCp007CategoryCompositionCandidateProjectionSha256,
} from "./cp007-category-composition-production-candidate-v1";
import {
  RNK_CP007_CATEGORY_COMPOSITION_MODES,
  solveRnkCp007CategoryComposition,
  type RnkCp007CategoryCompositionState,
  type RnkCp007CategoryId,
} from "./cp007-category-composition-editorial-v2";

const questions = buildRnkCp007CategoryCompositionProductionCandidate();
assert.equal(questions.length, 192);
assert.equal(questions.some((question) => question.permanentQlAllocated), false);
assert.equal(questions.some((question) => question.reviewMetadata.permanentQlAllocated), false);
assert.equal(questions.some((question) => question.authorityCandidateId !== RNK_CP007_CATEGORY_COMPOSITION_AUTHORITY_CANDIDATE_ID), false);

function categoryTotal(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return category === "A" ? state.categoryATotal : state.categoryBTotal;
}

function targetAdjustment(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return state.targetCategory === category ? 1 : 0;
}

const answerPositions = [0, 0, 0, 0];
const modeCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const surfaceStyleCounts = new Map<string, number>();
const partitionIds = new Set<string>();
const targetNames = new Set<string>();
const mathematicalFingerprints = new Set<string>();
const learnerSurfaces = new Set<string>();
let structuralDistractorChecks = 0;
let independentSolverChecks = 0;
let evidenceEssentialChecks = 0;
let rankEssentialChecks = 0;
let ratioEssentialChecks = 0;

for (const question of questions) {
  answerPositions[question.answerIndex] += 1;
  modeCounts.set(question.mode, (modeCounts.get(question.mode) ?? 0) + 1);
  difficultyCounts.set(question.difficulty, (difficultyCounts.get(question.difficulty) ?? 0) + 1);
  surfaceStyleCounts.set(
    question.reviewMetadata.surfaceProfile.style,
    (surfaceStyleCounts.get(question.reviewMetadata.surfaceProfile.style) ?? 0) + 1,
  );
  partitionIds.add(question.reviewMetadata.partitionId);
  targetNames.add(question.reviewMetadata.targetName);
  mathematicalFingerprints.add(question.mathematicalFingerprint);
  learnerSurfaces.add(`${question.stem}\n${question.options.join("|")}`);

  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.answerIndex], question.answer);
  assert.notEqual(question.answer, question.evidence.count);
  assert.equal(question.reviewMetadata.editorialProfile.numericEchoRejected, true);
  assert.equal(question.reviewMetadata.editorialProfile.awkwardPartitionRejected, true);
  assert.ok(question.reviewMetadata.editorialProfile.structuralDistractorCount >= 2);
  structuralDistractorChecks += 1;

  const replay = solveRnkCp007CategoryComposition(
    question.state,
    question.reviewMetadata.requestedCategory,
    question.reviewMetadata.requestedSide,
    question.evidence,
  );
  assert.equal(replay, question.answer);
  independentSolverChecks += 1;

  const changedEvidence = solveRnkCp007CategoryComposition(
    question.state,
    question.reviewMetadata.requestedCategory,
    question.reviewMetadata.requestedSide,
    { ...question.evidence, count: question.evidence.count + 1 },
  );
  assert.notEqual(changedEvidence, question.answer);
  evidenceEssentialChecks += 1;

  const changedRankState = { ...question.state, targetRankFromTop: question.state.targetRankFromTop + 1 };
  const changedRank = solveRnkCp007CategoryComposition(
    changedRankState,
    question.reviewMetadata.requestedCategory,
    question.reviewMetadata.requestedSide,
    question.evidence,
  );
  assert.notEqual(changedRank, question.answer);
  rankEssentialChecks += 1;

  const categoryToPerturb = question.reviewMetadata.requestedSide === "AFTER"
    ? question.reviewMetadata.requestedCategory
    : question.evidence.category;
  const changedTotalState: RnkCp007CategoryCompositionState = categoryToPerturb === "A"
    ? { ...question.state, total: question.state.total + 1, categoryATotal: question.state.categoryATotal + 1 }
    : { ...question.state, total: question.state.total + 1, categoryBTotal: question.state.categoryBTotal + 1 };
  const changedTotal = solveRnkCp007CategoryComposition(
    changedTotalState,
    question.reviewMetadata.requestedCategory,
    question.reviewMetadata.requestedSide,
    question.evidence,
  );
  assert.notEqual(changedTotal, question.answer);
  ratioEssentialChecks += 1;

  const maximum = question.reviewMetadata.requestedSide === "AHEAD"
    ? question.state.targetRankFromTop - 1
    : categoryTotal(question.state, question.reviewMetadata.requestedCategory)
      - targetAdjustment(question.state, question.reviewMetadata.requestedCategory);
  for (const option of question.options) assert.ok(option >= 0 && option <= maximum);

  assert.equal(/\b(?:21|31|41)th\b|\b(?:22|32|42)th\b|\b(?:23|33|43)th\b/.test(question.stem), false);
  assert.equal(/left|right|facing|clockwise|anticlockwise|seat/i.test(question.stem), false);
}

assert.deepEqual(answerPositions, [48, 48, 48, 48]);
for (const mode of RNK_CP007_CATEGORY_COMPOSITION_MODES) assert.equal(modeCounts.get(mode), 48);
assert.equal(mathematicalFingerprints.size, 192);
assert.equal(learnerSurfaces.size, 192);
assert.ok(partitionIds.size >= 10, `Expected >=10 partition contexts, found ${partitionIds.size}`);
assert.ok(targetNames.size >= 60, `Expected >=60 target names, found ${targetNames.size}`);
assert.deepEqual(Object.fromEntries(difficultyCounts), { MEDIUM: 144, HARD: 48 });
assert.equal(surfaceStyleCounts.size, 4);
for (const count of surfaceStyleCounts.values()) assert.equal(count, 48);

const projectionSha256 = rnkCp007CategoryCompositionCandidateProjectionSha256(questions);

console.log(JSON.stringify({
  status: "PASS",
  candidateVersion: RNK_CP007_CATEGORY_COMPOSITION_PRODUCTION_CANDIDATE_VERSION,
  authorityCandidateId: RNK_CP007_CATEGORY_COMPOSITION_AUTHORITY_CANDIDATE_ID,
  questionsChecked: questions.length,
  modeCounts: Object.fromEntries(modeCounts),
  answerPositions,
  difficultyCounts: Object.fromEntries(difficultyCounts),
  surfaceStyleCounts: Object.fromEntries(surfaceStyleCounts),
  partitionContexts: partitionIds.size,
  targetNames: targetNames.size,
  uniqueMathematicalFingerprints: mathematicalFingerprints.size,
  uniqueLearnerSurfaces: learnerSurfaces.size,
  structuralDistractorChecks,
  independentSolverChecks,
  evidenceEssentialChecks,
  rankEssentialChecks,
  ratioEssentialChecks,
  projectionSha256,
  projectionPinned: false,
  permanentQlAllocated: false,
  nextAvailableQl: "RNK-QL-042",
}, null, 2));
