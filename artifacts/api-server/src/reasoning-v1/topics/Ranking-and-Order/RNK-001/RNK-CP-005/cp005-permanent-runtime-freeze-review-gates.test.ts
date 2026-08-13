import assert from "node:assert/strict";

import {
  buildRnkCp005EditorialV3State,
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS,
} from "./cp005-partial-order-editorial-v3-release";
import {
  rnkCp005PermanentRuntimeCandidateProjectionSha256,
  type RnkCp005PermanentRuntimeCandidateAuthorityId,
  type RnkCp005PermanentRuntimeCandidateMode,
} from "./cp005-permanent-runtime-candidate-v1";
import {
  buildRnkCp005PinnedPermanentRuntimeCandidate,
  RNK_CP005_PINNED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256,
} from "./cp005-permanent-runtime-candidate-pinned-v1";

const runtime = buildRnkCp005PinnedPermanentRuntimeCandidate();
assert.equal(runtime.length, 576);
assert.equal(RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.length, 3);

const expectedModeCounts: Record<RnkCp005PermanentRuntimeCandidateMode, number> = {
  MUST: 48,
  COULD: 48,
  CANNOT: 48,
  PAIR_FIRST_ABOVE: 16,
  PAIR_SECOND_ABOVE: 16,
  PAIR_INDETERMINATE: 16,
  HIGHEST_POSSIBLE: 96,
  LOWEST_POSSIBLE: 96,
  EXACT_DEFINITE: 96,
  EXACT_INDETERMINATE: 96,
};
const minimumTopologies: Record<RnkCp005PermanentRuntimeCandidateAuthorityId, number> = {
  RELATION_TRUTH_STATUS: 8,
  POSSIBLE_RANK_BOUND: 7,
  EXACT_RANK_DETERMINACY: 6,
};

const authorityCounts = Object.fromEntries(
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((authority) => [authority, 0]),
) as Record<RnkCp005PermanentRuntimeCandidateAuthorityId, number>;
const answerPositions = Object.fromEntries(
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((authority) => [authority, [0, 0, 0, 0]]),
) as Record<RnkCp005PermanentRuntimeCandidateAuthorityId, number[]>;
const contexts = Object.fromEntries(
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((authority) => [authority, new Set<string>()]),
) as Record<RnkCp005PermanentRuntimeCandidateAuthorityId, Set<string>>;
const topologies = Object.fromEntries(
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((authority) => [authority, new Set<string>()]),
) as Record<RnkCp005PermanentRuntimeCandidateAuthorityId, Set<string>>;
const modeCounts = Object.fromEntries(
  Object.keys(expectedModeCounts).map((mode) => [mode, 0]),
) as Record<RnkCp005PermanentRuntimeCandidateMode, number>;
const learnerFingerprints = new Set<string>();
const runtimeFingerprints = new Set<string>();
const stateKeys = new Set<string>();
const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };

for (const question of runtime) {
  const profile = question.candidateRuntimeProfile;
  const authority = profile.authorityCandidateId;

  assert.equal(profile.projectionDigestPinned, true);
  assert.equal(profile.finalOwnershipApproved, false);
  assert.equal(profile.permanentQlId, null);
  assert.equal(profile.englishFreezeApproved, false);
  assert.equal(profile.questionsWithinAuthority, 192);
  assert.equal(profile.sourceForm, question.prototypeId);

  assert.equal(question.lifecycle.permanentQlAllocated, false);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.questionBank, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.options.length, 4);
  assert.equal(question.options.filter((option) => option.truth).length, 1);
  assert.equal(question.options[question.correctIndex]?.truth, true);

  const state = buildRnkCp005EditorialV3State(question.seed, question.v3Topology);
  assert.ok(state);
  assert.ok(state.validOrders.length >= 2);
  assert.equal(state.validOrders.length, question.validOrderCount);

  const learnerText = [
    question.instruction,
    ...question.clues,
    question.stem,
    ...question.options.map((option) => `${option.label} ${option.explanation}`),
    ...question.explanation,
  ].join(" ");
  assert.equal(/RNK-QL-0?36|RNK-QL-0?37|RNK-QL-0?38|permanent QL/i.test(learnerText), false);
  assert.equal(/lower merit rank|lower score rank/i.test(learnerText), false);
  assert.equal(
    /\b(sit|sitting|seat|seating|facing|adjacent|immediate left|immediate right|extreme left|extreme right)\b/i.test(learnerText),
    false,
  );

  authorityCounts[authority] += 1;
  answerPositions[authority]![question.correctIndex] += 1;
  contexts[authority].add(question.context);
  topologies[authority].add(question.v3Topology);
  modeCounts[profile.mode] += 1;
  difficultyCounts[question.difficulty] += 1;

  assert.equal(learnerFingerprints.has(question.normalizedLearnerFingerprint), false);
  learnerFingerprints.add(question.normalizedLearnerFingerprint);
  assert.equal(runtimeFingerprints.has(question.candidateRuntimeFingerprint), false);
  runtimeFingerprints.add(question.candidateRuntimeFingerprint);
  const stateKey = `${question.prototypeId}:${question.seed}:${question.v3Topology}:${question.pairStatusMode ?? "NONE"}`;
  assert.equal(stateKeys.has(stateKey), false);
  stateKeys.add(stateKey);
}

for (const authority of RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS) {
  assert.equal(authorityCounts[authority], 192);
  assert.deepEqual(answerPositions[authority], [48, 48, 48, 48]);
  assert.equal(contexts[authority].size, 5);
  assert.ok(topologies[authority].size >= minimumTopologies[authority]);
}
assert.deepEqual(modeCounts, expectedModeCounts);
assert.equal(learnerFingerprints.size, 576);
assert.equal(runtimeFingerprints.size, 576);
assert.equal(stateKeys.size, 576);
assert.deepEqual(difficultyCounts, { EASY: 0, MEDIUM: 496, HARD: 80 });

const exactDefinitePositions = [0, 0, 0, 0];
const exactIndeterminatePositions = [0, 0, 0, 0];
for (const question of runtime) {
  if (question.candidateRuntimeProfile.mode === "EXACT_DEFINITE") {
    exactDefinitePositions[question.correctIndex] += 1;
  }
  if (question.candidateRuntimeProfile.mode === "EXACT_INDETERMINATE") {
    exactIndeterminatePositions[question.correctIndex] += 1;
  }
}
assert.deepEqual(exactDefinitePositions, [48, 0, 48, 0]);
assert.deepEqual(exactIndeterminatePositions, [0, 48, 0, 48]);

const projectionSha256 = rnkCp005PermanentRuntimeCandidateProjectionSha256(runtime);
assert.equal(
  projectionSha256,
  RNK_CP005_PINNED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256,
);

console.log(JSON.stringify({
  status: "PASS",
  checkpointId: "RNK-CP-005",
  candidateRuntimeQuestions: runtime.length,
  authorityCounts,
  modeCounts,
  answerPositions,
  contextsPerAuthority: Object.fromEntries(
    RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((authority) => [authority, [...contexts[authority]].sort()]),
  ),
  topologiesPerAuthority: Object.fromEntries(
    RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((authority) => [authority, [...topologies[authority]].sort()]),
  ),
  difficultyCounts,
  projectionSha256,
  projectionDigestPinned: true,
  finalOwnershipApproved: false,
  englishFreezeApproved: false,
  permanentQlAllocated: false,
  nextAvailableQl: "RNK-QL-036",
}, null, 2));
