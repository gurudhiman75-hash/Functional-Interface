import assert from "node:assert/strict";

import {
  buildRnkCp005EditorialV3State,
  type RnkCp005EditorialV3State,
} from "./cp005-partial-order-editorial-v3-release";
import {
  buildRnkCp005PinnedPermanentRuntimeCandidate,
  RNK_CP005_PINNED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256,
} from "./cp005-permanent-runtime-candidate-pinned-v1";
import {
  buildRnkCp005PermanentRuntime,
  RNK_CP005_ENGLISH_FREEZE_VERSION,
  RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256,
  RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS,
  RNK_CP005_PERMANENT_RUNTIME_VERSION,
  rnkCp005PermanentProjectionSha256,
} from "./cp005-permanent-runtime-v1";

const runtime = buildRnkCp005PermanentRuntime();
const candidate = buildRnkCp005PinnedPermanentRuntimeCandidate();

assert.equal(runtime.length, 576);
assert.equal(candidate.length, 576);
assert.equal(RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS.length, 3);
assert.deepEqual(RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS, [
  { qlId: "RNK-QL-036", authorityId: "RELATION_TRUTH_STATUS" },
  { qlId: "RNK-QL-037", authorityId: "POSSIBLE_RANK_BOUND" },
  { qlId: "RNK-QL-038", authorityId: "EXACT_RANK_DETERMINACY" },
]);
assert.equal(RNK_CP005_PERMANENT_RUNTIME_VERSION, "RNK_CP005_PERMANENT_RUNTIME_V1");
assert.equal(RNK_CP005_ENGLISH_FREEZE_VERSION, "RNK_CP005_ENGLISH_FREEZE_V1");

function relationAlways(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
): boolean {
  return state.validOrders.every(
    (order) => order.indexOf(first) < order.indexOf(second),
  );
}

function relationPossible(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
): boolean {
  return state.validOrders.some(
    (order) => order.indexOf(first) < order.indexOf(second),
  );
}

function relationVariable(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
): boolean {
  return (
    relationPossible(state, first, second) &&
    relationPossible(state, second, first)
  );
}

function parseAbove(label: string): readonly [string, string] | null {
  const match = label.match(/^([A-Za-z]+) ranks above ([A-Za-z]+)\.?$/);
  return match ? [match[1]!, match[2]!] : null;
}

function parsePairStem(stem: string): readonly [string, string] {
  const match = stem.match(/relative ranks of ([A-Za-z]+) and ([A-Za-z]+)\?$/i);
  if (!match) throw new Error(`Could not parse pair stem: ${stem}`);
  return [match[1]!, match[2]!];
}

function parseRankTarget(stem: string): string {
  const match = stem.match(/(?:highest|lowest) possible rank of ([A-Za-z]+)\?$/i)
    ?? stem.match(/rank of ([A-Za-z]+)\?$/i);
  if (!match) throw new Error(`Could not parse rank target: ${stem}`);
  return match[1]!;
}

function parseOrdinal(label: string): number | null {
  const match = label.match(/^(\d+)(?:st|nd|rd|th)$/i);
  return match ? Number(match[1]) : null;
}

function rankSet(
  state: RnkCp005EditorialV3State,
  target: string,
): readonly number[] {
  return [...new Set(
    state.validOrders.map((order) => order.indexOf(target) + 1),
  )].sort((a, b) => a - b);
}

function pairOptionCorrect(
  label: string,
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
): boolean {
  if (new RegExp(`^${first} must rank above ${second}\\.?$`).test(label)) {
    return relationAlways(state, first, second);
  }
  if (new RegExp(`^${second} must rank above ${first}\\.?$`).test(label)) {
    return relationAlways(state, second, first);
  }
  if (/relative ranks cannot be determined uniquely/i.test(label)) {
    return relationVariable(state, first, second);
  }
  if (/must be consecutive in the ranking/i.test(label)) {
    return state.validOrders.every(
      (order) => Math.abs(order.indexOf(first) - order.indexOf(second)) === 1,
    );
  }
  const between = label.match(/^Exactly (\d+) (?:person|people) must be ranked between ([A-Za-z]+) and ([A-Za-z]+)\.?$/i);
  if (between) {
    const count = Number(between[1]);
    const left = between[2]!;
    const right = between[3]!;
    return state.validOrders.every(
      (order) => Math.abs(order.indexOf(left) - order.indexOf(right)) - 1 === count,
    );
  }
  throw new Error(`Unrecognized pair-status option: ${label}`);
}

function optionCorrectBySolver(
  label: string,
  state: RnkCp005EditorialV3State,
  mode: string,
  stem: string,
): boolean {
  if (mode === "MUST" || mode === "COULD" || mode === "CANNOT") {
    const pair = parseAbove(label);
    if (!pair) throw new Error(`Unrecognized relation option: ${label}`);
    if (mode === "MUST") return relationAlways(state, pair[0], pair[1]);
    if (mode === "COULD") return relationPossible(state, pair[0], pair[1]);
    return !relationPossible(state, pair[0], pair[1]);
  }

  if (mode.startsWith("PAIR_")) {
    const [first, second] = parsePairStem(stem);
    return pairOptionCorrect(label, state, first, second);
  }

  if (mode === "HIGHEST_POSSIBLE" || mode === "LOWEST_POSSIBLE") {
    const target = parseRankTarget(stem);
    const ranks = rankSet(state, target);
    const ordinal = parseOrdinal(label);
    if (ordinal === null) throw new Error(`Unrecognized rank option: ${label}`);
    return ordinal === (mode === "HIGHEST_POSSIBLE" ? ranks[0] : ranks.at(-1));
  }

  if (mode === "EXACT_DEFINITE" || mode === "EXACT_INDETERMINATE") {
    const target = parseRankTarget(stem);
    const ranks = rankSet(state, target);
    if (/cannot be determined uniquely/i.test(label)) return ranks.length > 1;
    const ordinal = parseOrdinal(label);
    if (ordinal === null) throw new Error(`Unrecognized exact-rank option: ${label}`);
    return ranks.length === 1 && ranks[0] === ordinal;
  }

  throw new Error(`Unsupported mode: ${mode}`);
}

function explanationChains(text: string): readonly string[][] {
  const chains: string[][] = [];
  const regex = /([A-Z][a-z]+(?: > [A-Z][a-z]+)+)/g;
  for (const match of text.matchAll(regex)) {
    chains.push(match[1]!.split(" > "));
  }
  return chains;
}

function isExactValidOrder(
  state: RnkCp005EditorialV3State,
  chain: readonly string[],
): boolean {
  return state.validOrders.some((order) =>
    order.length === chain.length &&
    order.every((entity, index) => entity === chain[index]));
}

const qlCounts: Record<string, number> = {};
const authorityCounts: Record<string, number> = {};
const answerPositionsByQl: Record<string, number[]> = {};
const modeCounts: Record<string, number> = {};
const permanentFingerprints = new Set<string>();
const learnerFingerprints = new Set<string>();
let independentlyReproved = 0;
let explanationChainsChecked = 0;
let compulsoryProofChainsChecked = 0;
let fullWitnessOrdersChecked = 0;
let rankBoundaryProofsChecked = 0;

for (let index = 0; index < runtime.length; index += 1) {
  const question = runtime[index]!;
  const source = candidate[index]!;
  const profile = question.permanentProfile;
  const candidateProfile = question.candidateRuntimeProfile;
  const state = buildRnkCp005EditorialV3State(question.seed, question.v3Topology);
  assert.ok(state, `${question.discoveryId}: missing state`);
  assert.ok(state.validOrders.length >= 2, `${question.discoveryId}: uncertainty state collapsed`);
  assert.equal(state.validOrders.length, question.validOrderCount);

  // The permanent freeze must preserve the exact reviewed candidate surface.
  assert.equal(question.instruction, source.instruction);
  assert.deepEqual(question.clues, source.clues);
  assert.equal(question.stem, source.stem);
  assert.deepEqual(question.options, source.options);
  assert.equal(question.correctIndex, source.correctIndex);
  assert.equal(question.answer, source.answer);
  assert.deepEqual(question.explanation, source.explanation);
  assert.equal(question.candidateRuntimeFingerprint, source.candidateRuntimeFingerprint);
  assert.equal(question.normalizedLearnerFingerprint, source.normalizedLearnerFingerprint);

  assert.equal(candidateProfile.finalOwnershipApproved, true);
  assert.equal(candidateProfile.englishFreezeApproved, true);
  assert.equal(candidateProfile.permanentQlId, profile.permanentQlId);
  assert.equal(candidateProfile.projectionDigestPinned, true);
  assert.equal(profile.runtimeVersion, RNK_CP005_PERMANENT_RUNTIME_VERSION);
  assert.equal(profile.freezeVersion, RNK_CP005_ENGLISH_FREEZE_VERSION);
  assert.equal(profile.questionsPerAuthority, 192);
  assert.equal(profile.sourceCandidateProjectionSha256,
    RNK_CP005_PINNED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256);
  assert.equal(question.lifecycle.permanentQlAllocated, true);
  assert.equal(question.lifecycle.englishFrozen, true);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.questionBank, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);

  const solverTruth = question.options.map((option) =>
    optionCorrectBySolver(option.label, state, candidateProfile.mode, question.stem));
  assert.equal(
    solverTruth.filter(Boolean).length,
    1,
    `${question.discoveryId}: independent solver found ${solverTruth.filter(Boolean).length} correct options`,
  );
  assert.equal(
    solverTruth[question.correctIndex],
    true,
    `${question.discoveryId}: stored answer disagrees with independent solver`,
  );
  independentlyReproved += 1;

  const learnerText = [
    question.instruction,
    ...question.clues,
    question.stem,
    ...question.options.flatMap((option) => [option.label, option.explanation]),
    ...question.explanation,
  ].join(" ");
  assert.equal(/lower merit rank|lower score rank|score rank/i.test(learnerText), false);
  assert.equal(/valid ranking\(s\)|permutation count|permutations/i.test(learnerText), false);
  assert.equal(
    /\b(sit|sitting|seat|seating|facing|adjacent|immediate left|immediate right|extreme left|extreme right)\b/i.test(learnerText),
    false,
  );
  assert.equal(/RNK-QL-0?(36|37|38)|permanent QL/i.test(learnerText), false);

  const allExplanationText = [
    ...question.explanation,
    ...question.options.map((option) => option.explanation),
  ].join("\n");
  for (const chain of explanationChains(allExplanationText)) {
    const isFullWitness = (
      chain.length === state.entities.length &&
      new Set(chain).size === state.entities.length
    );

    if (isFullWitness) {
      assert.deepEqual(new Set(chain), new Set(state.entities));
      assert.equal(
        isExactValidOrder(state, chain),
        true,
        `${question.discoveryId}: explanation witness is not a valid order: ${chain.join(" > ")}`,
      );
      fullWitnessOrdersChecked += 1;
    } else {
      for (let chainIndex = 0; chainIndex + 1 < chain.length; chainIndex += 1) {
        assert.equal(
          relationAlways(state, chain[chainIndex]!, chain[chainIndex + 1]!),
          true,
          `${question.discoveryId}: explanation proof chain is not compulsory: ${chain.join(" > ")}`,
        );
      }
      compulsoryProofChainsChecked += 1;
    }
    explanationChainsChecked += 1;
  }

  if (candidateProfile.mode === "HIGHEST_POSSIBLE" || candidateProfile.mode === "LOWEST_POSSIBLE") {
    const target = parseRankTarget(question.stem);
    const mandatoryCount = state.entities.filter((entity) => {
      if (entity === target) return false;
      return candidateProfile.mode === "HIGHEST_POSSIBLE"
        ? relationAlways(state, entity, target)
        : relationAlways(state, target, entity);
    }).length;
    const proofLine = question.explanation.find((line) => /At least \d+ people must therefore (?:precede|follow)/i.test(line));
    assert.ok(proofLine, `${question.discoveryId}: rank-bound count proof missing`);
    const statedCount = Number(proofLine!.match(/At least (\d+) people/i)?.[1]);
    assert.equal(statedCount, mandatoryCount, `${question.discoveryId}: rank-bound proof count drift`);
    rankBoundaryProofsChecked += 1;
  }

  qlCounts[profile.permanentQlId] = (qlCounts[profile.permanentQlId] ?? 0) + 1;
  authorityCounts[profile.authorityId] = (authorityCounts[profile.authorityId] ?? 0) + 1;
  modeCounts[candidateProfile.mode] = (modeCounts[candidateProfile.mode] ?? 0) + 1;
  const positions = answerPositionsByQl[profile.permanentQlId] ?? [0, 0, 0, 0];
  positions[question.correctIndex] += 1;
  answerPositionsByQl[profile.permanentQlId] = positions;

  assert.equal(permanentFingerprints.has(question.permanentRuntimeFingerprint), false);
  permanentFingerprints.add(question.permanentRuntimeFingerprint);
  assert.equal(learnerFingerprints.has(question.normalizedLearnerFingerprint), false);
  learnerFingerprints.add(question.normalizedLearnerFingerprint);
}

assert.deepEqual(qlCounts, {
  "RNK-QL-036": 192,
  "RNK-QL-037": 192,
  "RNK-QL-038": 192,
});
assert.deepEqual(authorityCounts, {
  RELATION_TRUTH_STATUS: 192,
  POSSIBLE_RANK_BOUND: 192,
  EXACT_RANK_DETERMINACY: 192,
});
assert.deepEqual(answerPositionsByQl, {
  "RNK-QL-036": [48, 48, 48, 48],
  "RNK-QL-037": [48, 48, 48, 48],
  "RNK-QL-038": [48, 48, 48, 48],
});
assert.deepEqual(modeCounts, {
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
});
assert.equal(independentlyReproved, 576);
assert.equal(permanentFingerprints.size, 576);
assert.equal(learnerFingerprints.size, 576);
assert.equal(rankBoundaryProofsChecked, 192);
assert.ok(explanationChainsChecked > 0);
assert.ok(compulsoryProofChainsChecked > 0);
assert.ok(fullWitnessOrdersChecked > 0);

const projectionSha256 = rnkCp005PermanentProjectionSha256(runtime);
const projectionPinned = RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256 !== "UNPINNED";
if (projectionPinned) {
  assert.equal(projectionSha256, RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256);
  assert.ok(runtime.every((question) => question.permanentProfile.projectionDigestPinned));
} else {
  assert.ok(runtime.every((question) => !question.permanentProfile.projectionDigestPinned));
}

console.log(JSON.stringify({
  status: "PASS",
  runtimeVersion: RNK_CP005_PERMANENT_RUNTIME_VERSION,
  freezeVersion: RNK_CP005_ENGLISH_FREEZE_VERSION,
  questionsChecked: runtime.length,
  independentlyReproved,
  authorityAssignments: RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS,
  qlCounts,
  authorityCounts,
  modeCounts,
  answerPositionsByQl,
  explanationChainsChecked,
  compulsoryProofChainsChecked,
  fullWitnessOrdersChecked,
  rankBoundaryProofsChecked,
  permanentRuntimeFingerprints: permanentFingerprints.size,
  learnerFingerprints: learnerFingerprints.size,
  sourceCandidateProjectionSha256:
    RNK_CP005_PINNED_PERMANENT_RUNTIME_CANDIDATE_PROJECTION_SHA256,
  projectionSha256,
  projectionPinned,
  expectedProjectionSha256: RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256,
  frozenPermanentRange: "RNK-QL-036..038",
  nextAvailableQl: "RNK-QL-039",
  lifecycle: {
    englishFrozen: true,
    questionStudio: "DISABLED",
    questionBank: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publicPublication: false,
  },
}, null, 2));
