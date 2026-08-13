import assert from "node:assert/strict";

import {
  RNK_CP007_CATEGORY_COMPOSITION_PINNED_CANDIDATE_PROJECTION_SHA256,
} from "./cp007-category-composition-production-candidate-pinned-v1";
import {
  solveRnkCp007CategoryComposition,
  type RnkCp007CategoryCompositionState,
  type RnkCp007CategoryId,
} from "./cp007-category-composition-editorial-v2";
import {
  buildRnkCp007PermanentRuntime,
  RNK_CP007_ENGLISH_FREEZE_VERSION,
  RNK_CP007_EXPECTED_PERMANENT_PROJECTION_SHA256,
  RNK_CP007_PERMANENT_AUTHORITY_ID,
  RNK_CP007_PERMANENT_QL_ID,
  RNK_CP007_PERMANENT_RUNTIME_VERSION,
  rnkCp007PermanentProjectionSha256,
} from "./cp007-permanent-runtime-v1";

const runtime = buildRnkCp007PermanentRuntime();
assert.equal(runtime.length, 192);
assert.equal(RNK_CP007_PERMANENT_QL_ID, "RNK-QL-042");
assert.equal(RNK_CP007_PERMANENT_AUTHORITY_ID, "CATEGORY_COMPOSITION_AROUND_RANK");

function categoryTotal(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return category === "A" ? state.categoryATotal : state.categoryBTotal;
}

function targetAdjustment(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return state.targetCategory === category ? 1 : 0;
}

const answerPositions = [0, 0, 0, 0];
const modeCounts: Record<string, number> = {};
const difficultyCounts: Record<string, number> = {};
const surfaceStyleCounts: Record<string, number> = {};
const partitionIds = new Set<string>();
const targetNames = new Set<string>();
const mathematicalFingerprints = new Set<string>();
const permanentFingerprints = new Set<string>();
const learnerSurfaces = new Set<string>();
let independentlyReproved = 0;
let evidenceEssentialChecks = 0;
let rankEssentialChecks = 0;
let ratioEssentialChecks = 0;
let structuralDistractorChecks = 0;

for (const question of runtime) {
  const profile = question.permanentProfile;
  assert.equal(question.permanentQlAllocated, true);
  assert.equal(question.candidateProjectionPinned, true);
  assert.equal(profile.runtimeVersion, RNK_CP007_PERMANENT_RUNTIME_VERSION);
  assert.equal(profile.freezeVersion, RNK_CP007_ENGLISH_FREEZE_VERSION);
  assert.equal(profile.permanentQlId, RNK_CP007_PERMANENT_QL_ID);
  assert.equal(profile.authorityId, RNK_CP007_PERMANENT_AUTHORITY_ID);
  assert.equal(profile.questionsInAuthority, 192);
  assert.equal(profile.candidateProjectionPinned, true);
  assert.equal(
    profile.sourceCandidateProjectionSha256,
    RNK_CP007_CATEGORY_COMPOSITION_PINNED_CANDIDATE_PROJECTION_SHA256,
  );

  assert.equal(question.lifecycle.permanentQlAllocated, true);
  assert.equal(question.lifecycle.englishFrozen, true);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.persistence, "DISABLED");
  assert.equal(question.lifecycle.questionBank, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.lifecycle.hindiPunjabi, "NOT_STARTED");

  const expected = solveRnkCp007CategoryComposition(
    question.state,
    question.reviewMetadata.requestedCategory,
    question.reviewMetadata.requestedSide,
    question.evidence,
  );
  assert.equal(question.answer, expected);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.answerIndex], expected);
  assert.equal(question.options.filter((option) => option === expected).length, 1);
  independentlyReproved += 1;

  const changedEvidence = solveRnkCp007CategoryComposition(
    question.state,
    question.reviewMetadata.requestedCategory,
    question.reviewMetadata.requestedSide,
    { ...question.evidence, count: question.evidence.count + 1 },
  );
  assert.notEqual(changedEvidence, question.answer);
  evidenceEssentialChecks += 1;

  const changedRank = solveRnkCp007CategoryComposition(
    { ...question.state, targetRankFromTop: question.state.targetRankFromTop + 1 },
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

  assert.ok(question.reviewMetadata.editorialProfile.structuralDistractorCount >= 2);
  assert.equal(question.reviewMetadata.editorialProfile.numericEchoRejected, true);
  assert.equal(question.reviewMetadata.editorialProfile.awkwardPartitionRejected, true);
  assert.notEqual(question.answer, question.evidence.count);
  structuralDistractorChecks += 1;

  const maximum = question.reviewMetadata.requestedSide === "AHEAD"
    ? question.state.targetRankFromTop - 1
    : categoryTotal(question.state, question.reviewMetadata.requestedCategory)
      - targetAdjustment(question.state, question.reviewMetadata.requestedCategory);
  for (const option of question.options) assert.ok(option >= 0 && option <= maximum);

  const learnerText = `${question.stem} ${question.options.join(" ")} ${question.explanation}`;
  assert.equal(/\b(sit|sitting|seat|seating|facing|clockwise|anticlockwise|immediate left|immediate right)\b/i.test(learnerText), false);
  assert.equal(/belongs to the|:[A-Za-z][^ ]*\s*=|\.\s+(?:morning-batch|evening-batch|first-year|second-year)/i.test(learnerText), false);
  assert.equal(/\b(?:21|31|41)th\b|\b(?:22|32|42)th\b|\b(?:23|33|43)th\b/.test(question.stem), false);
  assert.equal(/RNK-QL-|permanent QL|candidateOrdinal|mathematicalFingerprint/i.test(learnerText), false);

  answerPositions[question.answerIndex] += 1;
  modeCounts[question.mode] = (modeCounts[question.mode] ?? 0) + 1;
  difficultyCounts[question.difficulty] = (difficultyCounts[question.difficulty] ?? 0) + 1;
  const style = question.reviewMetadata.surfaceProfile.style;
  surfaceStyleCounts[style] = (surfaceStyleCounts[style] ?? 0) + 1;
  partitionIds.add(question.reviewMetadata.partitionId);
  targetNames.add(question.reviewMetadata.targetName);

  assert.equal(mathematicalFingerprints.has(question.mathematicalFingerprint), false);
  mathematicalFingerprints.add(question.mathematicalFingerprint);
  assert.equal(permanentFingerprints.has(question.permanentRuntimeFingerprint), false);
  permanentFingerprints.add(question.permanentRuntimeFingerprint);
  const learnerSurface = `${question.stem}\n${question.options.join("|")}`;
  assert.equal(learnerSurfaces.has(learnerSurface), false);
  learnerSurfaces.add(learnerSurface);
}

assert.deepEqual(answerPositions, [48, 48, 48, 48]);
assert.deepEqual(modeCounts, {
  TARGET_CATEGORY_AFTER: 48,
  OTHER_CATEGORY_AFTER: 48,
  TARGET_CATEGORY_AHEAD_FROM_OTHER_AFTER: 48,
  OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER: 48,
});
assert.deepEqual(difficultyCounts, { MEDIUM: 144, HARD: 48 });
assert.deepEqual(surfaceStyleCounts, {
  RANKED_LIST: 48,
  ORDER_OF_MERIT: 48,
  COMPACT_RATIO: 48,
  CANONICAL: 48,
});
assert.equal(partitionIds.size, 11);
assert.ok(targetNames.size >= 80);
assert.equal(mathematicalFingerprints.size, 192);
assert.equal(permanentFingerprints.size, 192);
assert.equal(learnerSurfaces.size, 192);
assert.equal(independentlyReproved, 192);
assert.equal(evidenceEssentialChecks, 192);
assert.equal(rankEssentialChecks, 192);
assert.equal(ratioEssentialChecks, 192);
assert.equal(structuralDistractorChecks, 192);

const projectionSha256 = rnkCp007PermanentProjectionSha256(runtime);
const projectionPinned = RNK_CP007_EXPECTED_PERMANENT_PROJECTION_SHA256 !== "UNPINNED";
if (projectionPinned) {
  assert.equal(projectionSha256, RNK_CP007_EXPECTED_PERMANENT_PROJECTION_SHA256);
}

console.log(JSON.stringify({
  status: "PASS",
  runtimeVersion: RNK_CP007_PERMANENT_RUNTIME_VERSION,
  freezeVersion: RNK_CP007_ENGLISH_FREEZE_VERSION,
  qlId: RNK_CP007_PERMANENT_QL_ID,
  authorityId: RNK_CP007_PERMANENT_AUTHORITY_ID,
  questionsChecked: runtime.length,
  independentlyReproved,
  evidenceEssentialChecks,
  rankEssentialChecks,
  ratioEssentialChecks,
  structuralDistractorChecks,
  answerPositions,
  modeCounts,
  difficultyCounts,
  surfaceStyleCounts,
  partitionContexts: partitionIds.size,
  targetNames: targetNames.size,
  uniqueMathematicalFingerprints: mathematicalFingerprints.size,
  uniquePermanentFingerprints: permanentFingerprints.size,
  uniqueLearnerSurfaces: learnerSurfaces.size,
  sourceCandidateProjectionSha256: RNK_CP007_CATEGORY_COMPOSITION_PINNED_CANDIDATE_PROJECTION_SHA256,
  projectionSha256,
  expectedProjectionSha256: RNK_CP007_EXPECTED_PERMANENT_PROJECTION_SHA256,
  projectionPinned,
  frozenPermanentRange: "RNK-QL-042",
  nextAvailableQl: "RNK-QL-043",
  lifecycle: {
    englishFrozen: true,
    questionStudio: "DISABLED",
    persistence: "DISABLED",
    questionBank: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publicPublication: false,
    hindiPunjabi: "NOT_STARTED",
  },
}, null, 2));
