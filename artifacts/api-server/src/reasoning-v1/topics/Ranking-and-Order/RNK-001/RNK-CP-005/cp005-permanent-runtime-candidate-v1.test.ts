import assert from "node:assert/strict";

import {
  buildRnkCp005EditorialV3State,
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS,
} from "./cp005-partial-order-editorial-v3-release";
import {
  buildRnkCp005PermanentRuntimeCandidate,
  RNK_CP005_EXPECTED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256,
  RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_VERSION,
  rnkCp005PermanentRuntimeCandidateProjectionSha256,
  type RnkCp005PermanentRuntimeCandidateAuthorityId,
  type RnkCp005PermanentRuntimeCandidateMode,
} from "./cp005-permanent-runtime-candidate-v1";

const runtime = buildRnkCp005PermanentRuntimeCandidate();
assert.equal(runtime.length, 576);
assert.equal(RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.length, 3);
assert.equal(
  RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_VERSION,
  "RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_V1",
);

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

const minimumTopologiesByAuthority: Record<
  RnkCp005PermanentRuntimeCandidateAuthorityId,
  number
> = {
  RELATION_TRUTH_STATUS: 8,
  POSSIBLE_RANK_BOUND: 7,
  EXACT_RANK_DETERMINACY: 6,
};

const authorityCounts = Object.fromEntries(
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((id) => [id, 0]),
) as Record<RnkCp005PermanentRuntimeCandidateAuthorityId, number>;
const answerPositionsByAuthority = Object.fromEntries(
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((id) => [id, [0, 0, 0, 0]]),
) as Record<RnkCp005PermanentRuntimeCandidateAuthorityId, number[]>;
const contextsByAuthority = Object.fromEntries(
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((id) => [id, new Set<string>()]),
) as Record<RnkCp005PermanentRuntimeCandidateAuthorityId, Set<string>>;
const topologiesByAuthority = Object.fromEntries(
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((id) => [id, new Set<string>()]),
) as Record<RnkCp005PermanentRuntimeCandidateAuthorityId, Set<string>>;
const modeCounts = Object.fromEntries(
  Object.keys(expectedModeCounts).map((mode) => [mode, 0]),
) as Record<RnkCp005PermanentRuntimeCandidateMode, number>;
const sourceCounts: Record<string, number> = {};
const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
const learnerFingerprints = new Set<string>();
const runtimeFingerprints = new Set<string>();
const mathematicalFingerprints = new Set<string>();
const stateKeys = new Set<string>();
const ordinalsByAuthority = new Map<string, Set<number>>();

for (const question of runtime) {
  const profile = question.candidateRuntimeProfile;
  const authority = profile.authorityCandidateId;

  assert.equal(profile.version, RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_VERSION);
  assert.equal(profile.questionsWithinAuthority, 192);
  assert.equal(profile.finalOwnershipApproved, false);
  assert.equal(profile.permanentQlId, null);
  assert.equal(profile.englishFreezeApproved, false);
  assert.equal(profile.sourceForm, question.prototypeId);
  assert.ok(profile.sourceOrdinal >= 0);
  assert.ok(profile.ordinalWithinAuthority >= 1 && profile.ordinalWithinAuthority <= 192);
  assert.ok(profile.ordinalWithinMode >= 1);

  assert.equal(question.lifecycle.permanentQlAllocated, false);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.questionBank, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.options.length, 4);
  assert.equal(question.options.filter((option) => option.truth).length, 1);
  assert.equal(question.options[question.correctIndex]?.truth, true);

  const state = buildRnkCp005EditorialV3State(question.seed, question.v3Topology);
  assert.ok(state, `${question.discoveryId}: missing partial-order state`);
  assert.ok(state.validOrders.length >= 2, `${question.discoveryId}: unique-order state leaked in`);
  assert.equal(state.validOrders.length, question.validOrderCount);

  const learnerText = [
    question.instruction,
    ...question.clues,
    question.stem,
    ...question.options.map((option) => `${option.label} ${option.explanation}`),
    ...question.explanation,
  ].join(" ");
  assert.equal(/RNK-QL-0?36|permanent QL/i.test(learnerText), false);
  assert.equal(
    /\b(sit|sitting|seat|seating|facing|adjacent|immediate left|immediate right|extreme left|extreme right)\b/i.test(learnerText),
    false,
  );
  assert.equal(/lower merit rank|lower score rank/i.test(learnerText), false);

  authorityCounts[authority] += 1;
  answerPositionsByAuthority[authority]![question.correctIndex] += 1;
  contextsByAuthority[authority].add(question.context);
  topologiesByAuthority[authority].add(question.v3Topology);
  modeCounts[profile.mode] += 1;
  sourceCounts[question.prototypeId] = (sourceCounts[question.prototypeId] ?? 0) + 1;
  difficultyCounts[question.difficulty] += 1;

  assert.equal(learnerFingerprints.has(question.normalizedLearnerFingerprint), false);
  learnerFingerprints.add(question.normalizedLearnerFingerprint);
  assert.equal(runtimeFingerprints.has(question.candidateRuntimeFingerprint), false);
  runtimeFingerprints.add(question.candidateRuntimeFingerprint);
  assert.equal(mathematicalFingerprints.has(question.mathematicalFingerprint), false);
  mathematicalFingerprints.add(question.mathematicalFingerprint);

  const stateKey = `${question.prototypeId}:${question.seed}:${question.v3Topology}:${question.pairStatusMode ?? "NONE"}`;
  assert.equal(stateKeys.has(stateKey), false, `${question.discoveryId}: duplicate selected state`);
  stateKeys.add(stateKey);

  const ordinalSet = ordinalsByAuthority.get(authority) ?? new Set<number>();
  assert.equal(ordinalSet.has(profile.ordinalWithinAuthority), false);
  ordinalSet.add(profile.ordinalWithinAuthority);
  ordinalsByAuthority.set(authority, ordinalSet);
}

for (const authority of RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS) {
  assert.equal(authorityCounts[authority], 192);
  assert.deepEqual(answerPositionsByAuthority[authority], [48, 48, 48, 48]);
  assert.equal(ordinalsByAuthority.get(authority)?.size, 192);
  assert.equal(contextsByAuthority[authority].size, 5);
  assert.ok(
    topologiesByAuthority[authority].size >= minimumTopologiesByAuthority[authority],
    `${authority}: topology coverage fell below V3 validated baseline`,
  );
}
assert.deepEqual(modeCounts, expectedModeCounts);
assert.deepEqual(sourceCounts, {
  DEFINITELY_TRUE_RELATION: 48,
  POSSIBLE_RELATION: 48,
  IMPOSSIBLE_RELATION: 48,
  PAIR_RELATION_CANNOT_BE_DETERMINED: 48,
  MINIMUM_POSSIBLE_RANK: 96,
  MAXIMUM_POSSIBLE_RANK: 96,
  DEFINITE_RANK_OR_INDETERMINATE: 192,
});
assert.equal(learnerFingerprints.size, 576);
assert.equal(runtimeFingerprints.size, 576);
assert.equal(mathematicalFingerprints.size, 576);
assert.equal(stateKeys.size, 576);

const relation = runtime.filter(
  (question) => question.candidateRuntimeProfile.authorityCandidateId === "RELATION_TRUTH_STATUS",
);
assert.equal(relation.filter((question) => question.pairStatusMode === "FIRST_ABOVE").length, 16);
assert.equal(relation.filter((question) => question.pairStatusMode === "SECOND_ABOVE").length, 16);
assert.equal(relation.filter((question) => question.pairStatusMode === "INDETERMINATE").length, 16);

const exact = runtime.filter(
  (question) => question.candidateRuntimeProfile.authorityCandidateId === "EXACT_RANK_DETERMINACY",
);
assert.equal(
  exact.filter((question) => question.candidateRuntimeProfile.mode === "EXACT_DEFINITE").length,
  96,
);
assert.equal(
  exact.filter((question) => question.candidateRuntimeProfile.mode === "EXACT_INDETERMINATE").length,
  96,
);
assert.deepEqual(
  exact
    .filter((question) => question.candidateRuntimeProfile.mode === "EXACT_DEFINITE")
    .reduce((counts, question) => {
      counts[question.correctIndex] += 1;
      return counts;
    }, [0, 0, 0, 0]),
  [48, 0, 48, 0],
);
assert.deepEqual(
  exact
    .filter((question) => question.candidateRuntimeProfile.mode === "EXACT_INDETERMINATE")
    .reduce((counts, question) => {
      counts[question.correctIndex] += 1;
      return counts;
    }, [0, 0, 0, 0]),
  [0, 48, 0, 48],
);

const projectionSha256 = rnkCp005PermanentRuntimeCandidateProjectionSha256(runtime);
assert.match(projectionSha256, /^[a-f0-9]{64}$/);
const projectionPinned =
  RNK_CP005_EXPECTED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256 !== "UNPINNED";
if (projectionPinned) {
  assert.equal(
    projectionSha256,
    RNK_CP005_EXPECTED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256,
  );
  assert.ok(runtime.every((question) => question.candidateRuntimeProfile.projectionDigestPinned));
} else {
  assert.ok(runtime.every((question) => !question.candidateRuntimeProfile.projectionDigestPinned));
}

console.log(
  JSON.stringify(
    {
      status: "PASS",
      version: RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_VERSION,
      questionsChecked: runtime.length,
      authorityCounts,
      modeCounts,
      sourceCounts,
      answerPositionsByAuthority,
      contextsPerAuthority: Object.fromEntries(
        RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((authority) => [
          authority,
          [...contextsByAuthority[authority]].sort(),
        ]),
      ),
      topologiesPerAuthority: Object.fromEntries(
        RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((authority) => [
          authority,
          [...topologiesByAuthority[authority]].sort(),
        ]),
      ),
      minimumTopologiesByAuthority,
      difficultyCounts,
      normalizedLearnerFingerprints: learnerFingerprints.size,
      selectedStateKeys: stateKeys.size,
      projectionSha256,
      projectionPinned,
      expectedProjectionSha256:
        RNK_CP005_EXPECTED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256,
      permanentQlAllocated: false,
      nextAvailableQl: "RNK-QL-036",
    },
    null,
    2,
  ),
);
