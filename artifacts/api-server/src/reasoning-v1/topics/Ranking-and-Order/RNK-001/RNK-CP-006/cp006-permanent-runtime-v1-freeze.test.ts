import assert from "node:assert/strict";

import { RNK_CP006_PINNED_PRODUCTION_CANDIDATE_PROJECTION_SHA256 } from "./cp006-production-candidate-pinned-v1";
import type {
  RnkCp006CandidateState,
  RnkCp006ProductionCandidateQuestion,
} from "./cp006-production-candidate-v1";
import {
  buildRnkCp006PermanentRuntime,
  RNK_CP006_ENGLISH_FREEZE_VERSION,
  RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256,
  RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS,
  RNK_CP006_PERMANENT_RUNTIME_VERSION,
  rnkCp006PermanentProjectionSha256,
} from "./cp006-permanent-runtime-v1";

const runtime = buildRnkCp006PermanentRuntime();
assert.equal(runtime.length, 576);
assert.deepEqual(RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS, [
  { qlId: "RNK-QL-039", authorityId: "EQUALITY_AWARE_PAIR_RELATION" },
  { qlId: "RNK-QL-040", authorityId: "EQUALITY_AWARE_ENDPOINT" },
  { qlId: "RNK-QL-041", authorityId: "COMPLETE_WEAK_ORDER" },
]);
assert.equal(RNK_CP006_PERMANENT_RUNTIME_VERSION, "RNK_CP006_PERMANENT_RUNTIME_V1");
assert.equal(RNK_CP006_ENGLISH_FREEZE_VERSION, "RNK_CP006_ENGLISH_FREEZE_V1");

function orderLabel(groups: readonly (readonly string[])[]): string {
  return groups.map((group) => group.join(" = ")).join(" > ");
}

function groupIndex(state: RnkCp006CandidateState, entity: string): number {
  const index = state.orderedGroups.findIndex((group) => group.includes(entity));
  if (index < 0) throw new Error(`Entity ${entity} not found in state`);
  return index;
}

function pathExists(
  state: RnkCp006CandidateState,
  from: string,
  to: string,
  includeEquality: boolean,
): boolean {
  const adjacency = new Map<string, string[]>();
  for (const entity of state.entities) adjacency.set(entity, []);
  for (const edge of state.strictEdges) adjacency.get(edge.higher)!.push(edge.lower);
  if (includeEquality) {
    const tie = state.orderedGroups[state.tieGroupIndex]!;
    adjacency.get(tie[0]!)!.push(tie[1]!);
    adjacency.get(tie[1]!)!.push(tie[0]!);
  }

  const queue = [from];
  const seen = new Set<string>([from]);
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === to) return true;
    for (const next of adjacency.get(current) ?? []) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return false;
}

function pairNames(question: RnkCp006ProductionCandidateQuestion): readonly [string, string] {
  const found = question.state.entities
    .filter((entity) => question.stem.includes(entity))
    .sort((a, b) => question.stem.indexOf(a) - question.stem.indexOf(b));
  assert.equal(found.length, 2, `${question.authorityId}#${question.authorityOrdinal}: pair target parse`);
  return [found[0]!, found[1]!];
}

function pairLabel(
  context: RnkCp006ProductionCandidateQuestion["context"],
  first: string,
  second: string,
  firstHigher: boolean,
): string {
  const higher = firstHigher ? first : second;
  const lower = firstHigher ? second : first;
  switch (context) {
    case "HEIGHT":
      return `${higher} is taller than ${lower}`;
    case "SCORES":
      return `${higher} scored more marks than ${lower}`;
    case "SPEED":
      return `${higher} is faster than ${lower}`;
    case "SENIORITY":
      return `${higher} is senior to ${lower}`;
    case "PERFORMANCE":
      return `${higher} is ranked above ${lower}`;
  }
}

function independentlyExpectedAnswer(question: RnkCp006ProductionCandidateQuestion): string {
  if (question.mode === "PAIR_LOCAL_BRIDGE" || question.mode === "PAIR_FULL_CHAIN") {
    const [first, second] = pairNames(question);
    const firstIndex = groupIndex(question.state, first);
    const secondIndex = groupIndex(question.state, second);
    assert.notEqual(firstIndex, secondIndex, `${question.authorityId}#${question.authorityOrdinal}: target pair tied`);
    return pairLabel(question.context, first, second, firstIndex < secondIndex);
  }

  if (question.mode === "ENDPOINT_HIGHEST") {
    return question.state.orderedGroups[0]![0]!;
  }
  if (question.mode === "ENDPOINT_LOWEST") {
    return question.state.orderedGroups.at(-1)![0]!;
  }
  if (question.mode === "COMPLETE_WEAK_ORDER") {
    return orderLabel(question.state.orderedGroups);
  }
  throw new Error(`Unsupported mode ${(question as { mode: string }).mode}`);
}

function assertEqualityIsNecessary(question: RnkCp006ProductionCandidateQuestion): void {
  const state = question.state;
  const bridge = state.equalityBridge;
  assert.equal(
    pathExists(state, bridge.aboveEntity, bridge.belowEntity, false),
    false,
    `${question.authorityId}#${question.authorityOrdinal}: strict clues bypass equality bridge`,
  );
  assert.equal(
    pathExists(state, bridge.aboveEntity, bridge.belowEntity, true),
    true,
    `${question.authorityId}#${question.authorityOrdinal}: equality does not complete bridge`,
  );

  if (question.mode === "PAIR_LOCAL_BRIDGE" || question.mode === "PAIR_FULL_CHAIN") {
    const [first, second] = pairNames(question);
    const firstHigher = groupIndex(state, first) < groupIndex(state, second);
    const higher = firstHigher ? first : second;
    const lower = firstHigher ? second : first;
    assert.equal(
      pathExists(state, higher, lower, false),
      false,
      `${question.authorityId}#${question.authorityOrdinal}: pair answer survives without equality`,
    );
    assert.equal(pathExists(state, higher, lower, true), true);
    return;
  }

  if (question.mode === "ENDPOINT_HIGHEST") {
    const answer = state.orderedGroups[0]![0]!;
    assert.equal(
      state.entities.every((entity) => entity === answer || pathExists(state, answer, entity, false)),
      false,
      `${question.authorityId}#${question.authorityOrdinal}: highest endpoint is provable without equality`,
    );
    assert.equal(
      state.entities.every((entity) => entity === answer || pathExists(state, answer, entity, true)),
      true,
    );
    return;
  }

  if (question.mode === "ENDPOINT_LOWEST") {
    const answer = state.orderedGroups.at(-1)![0]!;
    assert.equal(
      state.entities.every((entity) => entity === answer || pathExists(state, entity, answer, false)),
      false,
      `${question.authorityId}#${question.authorityOrdinal}: lowest endpoint is provable without equality`,
    );
    assert.equal(
      state.entities.every((entity) => entity === answer || pathExists(state, entity, answer, true)),
      true,
    );
  }
}

const qlCounts: Record<string, number> = {};
const authorityCounts: Record<string, number> = {};
const modeCounts: Record<string, number> = {};
const difficultyCounts: Record<string, number> = {};
const answerPositionsByQl: Record<string, number[]> = {};
const contextsByQl: Record<string, Set<string>> = {};
const entityCountsByQl: Record<string, Set<number>> = {};
const permanentFingerprints = new Set<string>();
const learnerFingerprints = new Set<string>();
const stateKeys = new Set<string>();
let independentlyReproved = 0;
let equalityEssentialChecks = 0;
let completeDistractorsChecked = 0;

for (const question of runtime) {
  const profile = question.permanentProfile;
  assert.equal(question.candidateProfile.finalOwnershipApproved, true);
  assert.equal(question.candidateProfile.englishFreezeApproved, true);
  assert.equal(question.candidateProfile.permanentQlId, profile.permanentQlId);
  assert.equal(question.candidateProfile.projectionDigestPinned, true);
  assert.equal(profile.runtimeVersion, RNK_CP006_PERMANENT_RUNTIME_VERSION);
  assert.equal(profile.freezeVersion, RNK_CP006_ENGLISH_FREEZE_VERSION);
  assert.equal(profile.questionsPerAuthority, 192);
  assert.equal(
    profile.sourceCandidateProjectionSha256,
    RNK_CP006_PINNED_PRODUCTION_CANDIDATE_PROJECTION_SHA256,
  );

  assert.equal(question.lifecycle.permanentQlAllocated, true);
  assert.equal(question.lifecycle.englishFrozen, true);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.persistence, "DISABLED");
  assert.equal(question.lifecycle.questionBank, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.lifecycle.hindiPunjabi, "NOT_STARTED");

  const expected = independentlyExpectedAnswer(question);
  assert.equal(
    question.answer,
    expected,
    `${profile.permanentQlId}#${profile.permanentOrdinalWithinAuthority}: answer disagrees with independent weak-order solve`,
  );
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], expected);
  assert.equal(question.options.filter((option) => option === expected).length, 1);
  independentlyReproved += 1;

  assertEqualityIsNecessary(question);
  equalityEssentialChecks += 1;

  if (question.mode === "COMPLETE_WEAK_ORDER") {
    assert.equal(question.options.filter((option) => option === expected).length, 1);
    assert.equal(question.options.filter((option) => option.includes(" = ")).length >= 2, true);
    completeDistractorsChecked += 3;
  }

  const learnerText = [
    ...question.clues,
    question.stem,
    ...question.options,
    ...question.explanation,
  ].join(" ");
  assert.equal(/\b(sit|sitting|seat|seating|facing|adjacent|immediate left|immediate right|extreme left|extreme right)\b/i.test(learnerText), false);
  assert.equal(/RNK-QL-|permanent QL|candidateRuntimeFingerprint|authorityOrdinal/i.test(learnerText), false);
  assert.equal(/\b\d+(?:st|nd|rd|th)\b/i.test(learnerText), false);
  assert.equal(/what rank comes next|next rank after|competition ranking|dense ranking|fractional ranking/i.test(learnerText), false);

  qlCounts[profile.permanentQlId] = (qlCounts[profile.permanentQlId] ?? 0) + 1;
  authorityCounts[profile.authorityId] = (authorityCounts[profile.authorityId] ?? 0) + 1;
  modeCounts[question.mode] = (modeCounts[question.mode] ?? 0) + 1;
  difficultyCounts[question.difficulty] = (difficultyCounts[question.difficulty] ?? 0) + 1;
  const answerPositions = answerPositionsByQl[profile.permanentQlId] ?? [0, 0, 0, 0];
  answerPositions[question.correctIndex] += 1;
  answerPositionsByQl[profile.permanentQlId] = answerPositions;
  (contextsByQl[profile.permanentQlId] ??= new Set()).add(question.context);
  (entityCountsByQl[profile.permanentQlId] ??= new Set()).add(question.state.entities.length);

  assert.equal(permanentFingerprints.has(question.permanentRuntimeFingerprint), false);
  permanentFingerprints.add(question.permanentRuntimeFingerprint);
  assert.equal(learnerFingerprints.has(question.learnerFingerprint), false);
  learnerFingerprints.add(question.learnerFingerprint);
  assert.equal(stateKeys.has(question.state.mathematicalStateKey), false);
  stateKeys.add(question.state.mathematicalStateKey);
}

assert.deepEqual(qlCounts, {
  "RNK-QL-039": 192,
  "RNK-QL-040": 192,
  "RNK-QL-041": 192,
});
assert.deepEqual(authorityCounts, {
  EQUALITY_AWARE_PAIR_RELATION: 192,
  EQUALITY_AWARE_ENDPOINT: 192,
  COMPLETE_WEAK_ORDER: 192,
});
assert.deepEqual(answerPositionsByQl, {
  "RNK-QL-039": [48, 48, 48, 48],
  "RNK-QL-040": [48, 48, 48, 48],
  "RNK-QL-041": [48, 48, 48, 48],
});
assert.deepEqual(modeCounts, {
  PAIR_LOCAL_BRIDGE: 96,
  PAIR_FULL_CHAIN: 96,
  ENDPOINT_HIGHEST: 96,
  ENDPOINT_LOWEST: 96,
  COMPLETE_WEAK_ORDER: 192,
});
assert.deepEqual(difficultyCounts, {
  MEDIUM: 416,
  HARD: 160,
});
for (const qlId of Object.keys(qlCounts)) {
  assert.equal(contextsByQl[qlId]?.size, 5);
  assert.deepEqual([...entityCountsByQl[qlId]!.values()].sort(), [5, 6, 7]);
}
assert.equal(independentlyReproved, 576);
assert.equal(equalityEssentialChecks, 576);
assert.equal(completeDistractorsChecked, 576);
assert.equal(permanentFingerprints.size, 576);
assert.equal(learnerFingerprints.size, 576);
assert.equal(stateKeys.size, 576);

const projectionSha256 = rnkCp006PermanentProjectionSha256(runtime);
const projectionPinned = RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256 !== "UNPINNED";
if (projectionPinned) {
  assert.equal(projectionSha256, RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256);
  assert.ok(runtime.every((question) => question.permanentProfile.projectionDigestPinned));
} else {
  assert.ok(runtime.every((question) => !question.permanentProfile.projectionDigestPinned));
}

console.log(JSON.stringify({
  status: "PASS",
  runtimeVersion: RNK_CP006_PERMANENT_RUNTIME_VERSION,
  freezeVersion: RNK_CP006_ENGLISH_FREEZE_VERSION,
  questionsChecked: runtime.length,
  independentlyReproved,
  equalityEssentialChecks,
  completeDistractorsChecked,
  authorityAssignments: RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS,
  qlCounts,
  answerPositionsByQl,
  modeCounts,
  difficultyCounts,
  contextsPerQl: Object.fromEntries(
    Object.entries(contextsByQl).map(([qlId, contexts]) => [qlId, [...contexts].sort()]),
  ),
  entityCountsPerQl: Object.fromEntries(
    Object.entries(entityCountsByQl).map(([qlId, counts]) => [qlId, [...counts].sort()]),
  ),
  uniqueMathematicalStateKeys: stateKeys.size,
  uniqueLearnerFingerprints: learnerFingerprints.size,
  uniquePermanentFingerprints: permanentFingerprints.size,
  sourceCandidateProjectionSha256:
    RNK_CP006_PINNED_PRODUCTION_CANDIDATE_PROJECTION_SHA256,
  permanentProjectionSha256: projectionSha256,
  expectedPermanentProjectionSha256:
    RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256,
  projectionPinned,
  nextAvailableQl: "RNK-QL-042",
  lifecycle: {
    questionStudio: "DISABLED",
    persistence: "DISABLED",
    questionBank: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    hindiPunjabi: "NOT_STARTED",
  },
}, null, 2));
