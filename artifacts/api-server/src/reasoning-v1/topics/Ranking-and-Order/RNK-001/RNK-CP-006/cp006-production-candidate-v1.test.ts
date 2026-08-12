import assert from "node:assert/strict";

import {
  buildRnkCp006ProductionCandidate,
  RNK_CP006_CANDIDATE_AUTHORITY_ASSIGNMENTS,
  RNK_CP006_EXPECTED_CANDIDATE_PROJECTION_SHA256,
  RNK_CP006_PRODUCTION_CANDIDATE_VERSION,
  rnkCp006ProductionCandidateProjectionSha256,
  type RnkCp006CandidateState,
  type RnkCp006ProductionCandidateQuestion,
} from "./cp006-production-candidate-v1";

const questions = buildRnkCp006ProductionCandidate();

assert.equal(questions.length, 576);
assert.equal(RNK_CP006_CANDIDATE_AUTHORITY_ASSIGNMENTS.length, 3);

function groupIndex(state: RnkCp006CandidateState, entity: string): number {
  return state.orderedGroups.findIndex((group) => group.includes(entity));
}

function orderLabel(state: RnkCp006CandidateState): string {
  return state.orderedGroups.map((group) => group.join(" = ")).join(" > ");
}

function hasPath(
  entities: readonly string[],
  edges: readonly Readonly<{ higher: string; lower: string }>[],
  start: string,
  target: string,
): boolean {
  const adjacency = new Map<string, string[]>();
  for (const entity of entities) adjacency.set(entity, []);
  for (const edge of edges) adjacency.get(edge.higher)!.push(edge.lower);
  const stack = [start];
  const seen = new Set<string>();
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === target) return true;
    if (seen.has(current)) continue;
    seen.add(current);
    stack.push(...(adjacency.get(current) ?? []));
  }
  return false;
}

function equalityAwareEdges(state: RnkCp006CandidateState): readonly Readonly<{
  higher: string;
  lower: string;
}>[] {
  const tie = state.orderedGroups[state.tieGroupIndex]!;
  return [
    ...state.strictEdges,
    { higher: tie[0]!, lower: tie[1]! },
    { higher: tie[1]!, lower: tie[0]! },
  ];
}

function topologicalOrders(
  entities: readonly string[],
  edges: readonly Readonly<{ higher: string; lower: string }>[],
): readonly (readonly string[])[] {
  const adjacency = new Map<string, string[]>();
  const indegree = new Map<string, number>();
  for (const entity of entities) {
    adjacency.set(entity, []);
    indegree.set(entity, 0);
  }
  for (const edge of edges) {
    adjacency.get(edge.higher)!.push(edge.lower);
    indegree.set(edge.lower, (indegree.get(edge.lower) ?? 0) + 1);
  }

  const output: string[][] = [];
  const used = new Set<string>();
  const current: string[] = [];

  function visit(): void {
    if (current.length === entities.length) {
      output.push([...current]);
      return;
    }
    const available = entities.filter(
      (entity) => !used.has(entity) && (indegree.get(entity) ?? 0) === 0,
    );
    for (const entity of available) {
      used.add(entity);
      current.push(entity);
      const lowered = adjacency.get(entity) ?? [];
      for (const next of lowered) indegree.set(next, indegree.get(next)! - 1);
      visit();
      for (const next of lowered) indegree.set(next, indegree.get(next)! + 1);
      current.pop();
      used.delete(entity);
    }
  }

  visit();
  return output;
}

function pairNames(question: RnkCp006ProductionCandidateQuestion): readonly [string, string] {
  const mentioned = question.state.entities
    .filter((entity) => question.stem.includes(entity))
    .sort((a, b) => question.stem.indexOf(a) - question.stem.indexOf(b));
  assert.equal(mentioned.length, 2, `${question.authorityId} #${question.authorityOrdinal}: expected two named people in pair stem`);
  return [mentioned[0]!, mentioned[1]!];
}

function expectedPairAnswer(
  question: RnkCp006ProductionCandidateQuestion,
  first: string,
  second: string,
): string {
  const firstIndex = groupIndex(question.state, first);
  const secondIndex = groupIndex(question.state, second);
  assert.notEqual(firstIndex, -1);
  assert.notEqual(secondIndex, -1);
  assert.notEqual(firstIndex, secondIndex, `${question.authorityOrdinal}: direct equality lookup survived`);
  const higher = firstIndex < secondIndex ? first : second;
  const lower = firstIndex < secondIndex ? second : first;
  switch (question.context) {
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

function asksLowEndpoint(question: RnkCp006ProductionCandidateQuestion): boolean {
  return /shortest|lowest marks|slowest|most junior|ranked lowest/i.test(question.stem);
}

function expectedEndpointAnswer(question: RnkCp006ProductionCandidateQuestion): string {
  return asksLowEndpoint(question)
    ? question.state.orderedGroups[question.state.orderedGroups.length - 1]![0]!
    : question.state.orderedGroups[0]![0]!;
}

function parseWeakOrder(value: string): readonly (readonly string[])[] {
  return value.split(" > ").map((group) => group.split(" = "));
}

function sameWeakOrder(
  state: RnkCp006CandidateState,
  option: string,
): boolean {
  const parsed = parseWeakOrder(option);
  if (parsed.length !== state.orderedGroups.length) return false;
  if (parsed.flat().length !== state.entities.length) return false;
  if (new Set(parsed.flat()).size !== state.entities.length) return false;
  for (let index = 0; index < parsed.length; index += 1) {
    const expected = [...state.orderedGroups[index]!].sort();
    const actual = [...parsed[index]!].sort();
    if (expected.length !== actual.length) return false;
    if (!expected.every((entity, entityIndex) => entity === actual[entityIndex])) return false;
  }
  return true;
}

function optionTruth(question: RnkCp006ProductionCandidateQuestion): boolean[] {
  if (question.authorityId === "EQUALITY_AWARE_PAIR_RELATION") {
    const [first, second] = pairNames(question);
    const expected = expectedPairAnswer(question, first, second);
    return question.options.map((option) => option === expected);
  }
  if (question.authorityId === "EQUALITY_AWARE_ENDPOINT") {
    const expected = expectedEndpointAnswer(question);
    return question.options.map((option) => option === expected);
  }
  return question.options.map((option) => sameWeakOrder(question.state, option));
}

function strictForms(
  state: RnkCp006CandidateState,
  higher: string,
  lower: string,
): readonly string[] {
  switch (state.context) {
    case "HEIGHT":
      return [`${higher} is taller than ${lower}.`, `${lower} is shorter than ${higher}.`];
    case "SCORES":
      return [`${higher} scored more marks than ${lower}.`, `${lower} scored fewer marks than ${higher}.`];
    case "SPEED":
      return [`${higher} completed the race faster than ${lower}.`, `${lower} took longer than ${higher} to complete the race.`];
    case "SENIORITY":
      return [`${higher} is senior to ${lower}.`, `${lower} is junior to ${higher}.`];
    case "PERFORMANCE":
      return [`${higher} ranked above ${lower} in the performance review.`, `${lower} ranked below ${higher} in the performance review.`];
  }
}

function equalityForms(state: RnkCp006CandidateState): readonly string[] {
  const tie = state.orderedGroups[state.tieGroupIndex]!;
  const pairs = [
    [tie[0]!, tie[1]!] as const,
    [tie[1]!, tie[0]!] as const,
  ];
  return pairs.map(([first, second]) => {
    switch (state.context) {
      case "HEIGHT":
        return `${first} and ${second} are equally tall.`;
      case "SCORES":
        return `${first} and ${second} scored equal marks.`;
      case "SPEED":
        return `${first} and ${second} completed the race in the same time.`;
      case "SENIORITY":
        return `${first} and ${second} are at the same seniority level.`;
      case "PERFORMANCE":
        return `${first} and ${second} were placed at the same level in the performance review.`;
    }
  });
}

function validateClues(question: RnkCp006ProductionCandidateQuestion): void {
  const equality = equalityForms(question.state);
  let equalityCount = 0;
  const strictSeen = new Set<string>();
  for (const clue of question.clues) {
    if (equality.includes(clue)) {
      equalityCount += 1;
      continue;
    }
    const matchingEdges = question.state.strictEdges.filter((edge) =>
      strictForms(question.state, edge.higher, edge.lower).includes(clue),
    );
    assert.equal(
      matchingEdges.length,
      1,
      `${question.authorityId} #${question.authorityOrdinal}: false or ambiguous rendered clue: ${clue}`,
    );
    strictSeen.add(`${matchingEdges[0]!.higher}>${matchingEdges[0]!.lower}`);
  }
  assert.equal(equalityCount, 1, `${question.authorityOrdinal}: expected exactly one equality clue`);
  assert.equal(strictSeen.size, question.state.strictEdges.length);
  assert.equal(question.clues.length, question.state.strictEdges.length + 1);
}

function validStrictOrder(
  state: RnkCp006CandidateState,
  order: readonly string[],
): boolean {
  if (order.length !== state.entities.length) return false;
  if (new Set(order).size !== state.entities.length) return false;
  for (const edge of state.strictEdges) {
    if (order.indexOf(edge.higher) >= order.indexOf(edge.lower)) return false;
  }
  return true;
}

function equalityPairInOrder(option: string): string | null {
  const tied = parseWeakOrder(option).find((group) => group.length > 1);
  return tied ? [...tied].sort().join("|") : null;
}

function expectedEqualityPair(state: RnkCp006CandidateState): string {
  return [...state.orderedGroups[state.tieGroupIndex]!].sort().join("|");
}

function classifyCompleteDistractor(
  question: RnkCp006ProductionCandidateQuestion,
  option: string,
): "SPLIT_TIE" | "FALSE_EQUALITY" | "STRICT_ORDER" {
  const pair = equalityPairInOrder(option);
  if (pair === null) return "SPLIT_TIE";
  if (pair !== expectedEqualityPair(question.state)) return "FALSE_EQUALITY";
  return "STRICT_ORDER";
}

const authorityCounts = Object.fromEntries(
  RNK_CP006_CANDIDATE_AUTHORITY_ASSIGNMENTS.map((item) => [item.authorityId, 0]),
) as Record<string, number>;
const answerPositionsByAuthority = Object.fromEntries(
  RNK_CP006_CANDIDATE_AUTHORITY_ASSIGNMENTS.map((item) => [item.authorityId, [0, 0, 0, 0]]),
) as Record<string, number[]>;
const contextsByAuthority = Object.fromEntries(
  RNK_CP006_CANDIDATE_AUTHORITY_ASSIGNMENTS.map((item) => [item.authorityId, new Set<string>()]),
) as Record<string, Set<string>>;
const entityCountsByAuthority = Object.fromEntries(
  RNK_CP006_CANDIDATE_AUTHORITY_ASSIGNMENTS.map((item) => [item.authorityId, { 5: 0, 6: 0, 7: 0 }]),
) as Record<string, Record<number, number>>;
const modeCounts: Record<string, number> = {};
const pairDirectionCounts = { FIRST_HIGHER: 0, SECOND_HIGHER: 0 };
const difficultyCounts = { MEDIUM: 0, HARD: 0 };
const completeDistractorKinds = { SPLIT_TIE: 0, FALSE_EQUALITY: 0, STRICT_ORDER: 0 };
const mathematicalStateKeys = new Set<string>();
const learnerFingerprints = new Set<string>();
const runtimeFingerprints = new Set<string>();
let independentlyChecked = 0;
let clueChecks = 0;
let equalityEssentialPairChecks = 0;
let equalityEssentialEndpointChecks = 0;
let equalityEssentialCompleteChecks = 0;
let localPairExplanationChecks = 0;
let fullPairExplanationChecks = 0;
let endpointExplanationChecks = 0;
let completeExplanationChecks = 0;

for (const question of questions) {
  assert.equal(question.checkpointId, "RNK-CP-006");
  assert.equal(question.candidateVersion, RNK_CP006_PRODUCTION_CANDIDATE_VERSION);
  assert.ok(question.authorityOrdinal >= 1 && question.authorityOrdinal <= 192);
  assert.equal(question.state.entities.length >= 5 && question.state.entities.length <= 7, true);
  assert.equal(new Set(question.state.entities).size, question.state.entities.length);

  const flattened = question.state.orderedGroups.flat();
  assert.equal(flattened.length, question.state.entities.length);
  assert.equal(new Set(flattened).size, question.state.entities.length);
  assert.deepEqual(new Set(flattened), new Set(question.state.entities));
  const tieGroups = question.state.orderedGroups.filter((group) => group.length > 1);
  assert.equal(tieGroups.length, 1);
  assert.equal(tieGroups[0]!.length, 2);
  assert.equal(question.state.orderedGroups[question.state.tieGroupIndex]!.length, 2);
  assert.ok(question.state.tieGroupIndex > 0);
  assert.ok(question.state.tieGroupIndex < question.state.orderedGroups.length - 1);

  const bridge = question.state.equalityBridge;
  assert.notEqual(bridge.entryTieMember, bridge.exitTieMember);
  assert.equal(bridge.aboveEntity, question.state.orderedGroups[question.state.tieGroupIndex - 1]![0]);
  assert.equal(bridge.belowEntity, question.state.orderedGroups[question.state.tieGroupIndex + 1]![0]);
  assert.ok(question.state.orderedGroups[question.state.tieGroupIndex]!.includes(bridge.entryTieMember));
  assert.ok(question.state.orderedGroups[question.state.tieGroupIndex]!.includes(bridge.exitTieMember));

  validateClues(question);
  clueChecks += question.clues.length;

  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4, `${question.authorityId} #${question.authorityOrdinal}: duplicate option`);
  assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3);
  assert.equal(question.options[question.correctIndex], question.answer);
  const truth = optionTruth(question);
  assert.equal(
    truth.filter(Boolean).length,
    1,
    `${question.authorityId} #${question.authorityOrdinal}: independent solver found ${truth.filter(Boolean).length} correct options`,
  );
  assert.equal(
    truth[question.correctIndex],
    true,
    `${question.authorityId} #${question.authorityOrdinal}: stored key disagrees with independent solver`,
  );
  independentlyChecked += 1;

  if (question.authorityId === "EQUALITY_AWARE_PAIR_RELATION") {
    const [first, second] = pairNames(question);
    const firstGroup = groupIndex(question.state, first);
    const secondGroup = groupIndex(question.state, second);
    const higher = firstGroup < secondGroup ? first : second;
    const lower = firstGroup < secondGroup ? second : first;
    pairDirectionCounts[firstGroup < secondGroup ? "FIRST_HIGHER" : "SECOND_HIGHER"] += 1;
    assert.equal(
      hasPath(question.state.entities, question.state.strictEdges, higher, lower),
      false,
      `${question.authorityOrdinal}: pair direction is already forced without equality`,
    );
    assert.equal(
      hasPath(question.state.entities, question.state.strictEdges, lower, higher),
      false,
      `${question.authorityOrdinal}: reverse pair direction unexpectedly forced`,
    );
    assert.equal(
      hasPath(question.state.entities, equalityAwareEdges(question.state), higher, lower),
      true,
      `${question.authorityOrdinal}: equality does not repair pair proof`,
    );
    equalityEssentialPairChecks += 1;

    if (question.mode === "PAIR_LOCAL_BRIDGE") {
      assert.equal(question.explanation.length, 1);
      assert.equal(new Set(question.explanation).size, question.explanation.length);
      localPairExplanationChecks += 1;
    } else {
      assert.equal(question.mode, "PAIR_FULL_CHAIN");
      assert.ok(question.explanation.some((line) => line.includes(orderLabel(question.state))));
      assert.equal(new Set(question.explanation).size, question.explanation.length);
      fullPairExplanationChecks += 1;
    }
  }

  if (question.authorityId === "EQUALITY_AWARE_ENDPOINT") {
    const strictOnlyOrders = topologicalOrders(question.state.entities, question.state.strictEdges);
    assert.ok(strictOnlyOrders.length >= 2);
    const endpointSet = new Set(
      strictOnlyOrders.map((order) => asksLowEndpoint(question) ? order[order.length - 1]! : order[0]!),
    );
    assert.ok(
      endpointSet.size >= 2,
      `${question.authorityOrdinal}: endpoint is already unique without equality`,
    );
    assert.equal(
      endpointSet.size === 1 && endpointSet.has(question.answer),
      false,
      `${question.authorityOrdinal}: endpoint answer does not require equality`,
    );
    assert.ok(question.explanation.some((line) => line.includes(orderLabel(question.state))));
    equalityEssentialEndpointChecks += 1;
    endpointExplanationChecks += 1;
  }

  if (question.authorityId === "COMPLETE_WEAK_ORDER") {
    const splitOption = question.options.find((option) => !option.includes(" = "));
    assert.ok(splitOption, `${question.authorityOrdinal}: split-tie distractor missing`);
    const splitOrder = splitOption!.split(" > ");
    assert.equal(
      validStrictOrder(question.state, splitOrder),
      true,
      `${question.authorityOrdinal}: split-tie alternative does not satisfy all strict clues`,
    );
    const wrongOptions = question.options.filter((_, index) => index !== question.correctIndex);
    const kinds = wrongOptions.map((option) => classifyCompleteDistractor(question, option));
    assert.deepEqual(
      new Set(kinds),
      new Set(["SPLIT_TIE", "FALSE_EQUALITY", "STRICT_ORDER"]),
      `${question.authorityOrdinal}: complete-order distractors do not cover all misconception classes`,
    );
    for (const kind of kinds) completeDistractorKinds[kind] += 1;
    assert.equal(question.answer, orderLabel(question.state));
    assert.ok(question.explanation.some((line) => line.includes(orderLabel(question.state))));
    equalityEssentialCompleteChecks += 1;
    completeExplanationChecks += 1;
  }

  const learnerText = [
    ...question.clues,
    question.stem,
    ...question.options,
    ...question.explanation,
  ].join(" ");
  assert.doesNotMatch(learnerText, /`/);
  assert.doesNotMatch(learnerText, /performance positions/i);
  assert.doesNotMatch(learnerText, /received the same performance level/i);
  assert.doesNotMatch(learnerText, /uncomparable|incomparable|cannot be compared/i);
  assert.doesNotMatch(
    learnerText,
    /competition ranking|dense ranking|fractional ranking|next rank after|rank immediately after/i,
  );
  assert.doesNotMatch(
    learnerText,
    /\b(sit|sitting|seat|seating|facing|clockwise|anticlockwise|immediate left|immediate right)\b/i,
  );

  assert.equal(question.candidateProfile.questionsPerAuthority, 192);
  assert.equal(question.candidateProfile.permanentQlId, null);
  assert.equal(question.candidateProfile.finalOwnershipApproved, false);
  assert.equal(question.candidateProfile.englishFreezeApproved, false);
  assert.equal(
    question.candidateProfile.projectionDigestPinned,
    RNK_CP006_EXPECTED_CANDIDATE_PROJECTION_SHA256 !== "UNPINNED",
  );
  assert.equal(question.lifecycle.permanentQlAllocated, false);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.persistence, "DISABLED");
  assert.equal(question.lifecycle.questionBank, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.lifecycle.hindiPunjabi, "NOT_STARTED");

  authorityCounts[question.authorityId] = (authorityCounts[question.authorityId] ?? 0) + 1;
  answerPositionsByAuthority[question.authorityId]![question.correctIndex] += 1;
  contextsByAuthority[question.authorityId]!.add(question.context);
  entityCountsByAuthority[question.authorityId]![question.state.entities.length] += 1;
  modeCounts[question.mode] = (modeCounts[question.mode] ?? 0) + 1;
  difficultyCounts[question.difficulty] += 1;

  assert.equal(
    mathematicalStateKeys.has(question.state.mathematicalStateKey),
    false,
    `duplicate mathematical state: ${question.state.mathematicalStateKey}`,
  );
  mathematicalStateKeys.add(question.state.mathematicalStateKey);
  assert.equal(learnerFingerprints.has(question.learnerFingerprint), false, "duplicate learner fingerprint");
  learnerFingerprints.add(question.learnerFingerprint);
  assert.equal(runtimeFingerprints.has(question.candidateRuntimeFingerprint), false, "duplicate runtime fingerprint");
  runtimeFingerprints.add(question.candidateRuntimeFingerprint);
}

for (const assignment of RNK_CP006_CANDIDATE_AUTHORITY_ASSIGNMENTS) {
  assert.equal(authorityCounts[assignment.authorityId], 192);
  assert.deepEqual(answerPositionsByAuthority[assignment.authorityId], [48, 48, 48, 48]);
  assert.equal(contextsByAuthority[assignment.authorityId]!.size, 5);
  assert.deepEqual(entityCountsByAuthority[assignment.authorityId], { 5: 64, 6: 64, 7: 64 });
}

assert.equal(modeCounts.PAIR_LOCAL_BRIDGE, 96);
assert.equal(modeCounts.PAIR_FULL_CHAIN, 96);
assert.equal(modeCounts.ENDPOINT_HIGHEST, 96);
assert.equal(modeCounts.ENDPOINT_LOWEST, 96);
assert.equal(modeCounts.COMPLETE_WEAK_ORDER, 192);
assert.deepEqual(pairDirectionCounts, { FIRST_HIGHER: 96, SECOND_HIGHER: 96 });
assert.deepEqual(difficultyCounts, { MEDIUM: 416, HARD: 160 });
assert.deepEqual(completeDistractorKinds, {
  SPLIT_TIE: 192,
  FALSE_EQUALITY: 192,
  STRICT_ORDER: 192,
});
assert.equal(mathematicalStateKeys.size, 576);
assert.equal(learnerFingerprints.size, 576);
assert.equal(runtimeFingerprints.size, 576);
assert.equal(equalityEssentialPairChecks, 192);
assert.equal(equalityEssentialEndpointChecks, 192);
assert.equal(equalityEssentialCompleteChecks, 192);
assert.equal(localPairExplanationChecks, 96);
assert.equal(fullPairExplanationChecks, 96);
assert.equal(endpointExplanationChecks, 192);
assert.equal(completeExplanationChecks, 192);

const projectionSha256 = rnkCp006ProductionCandidateProjectionSha256(questions);
const projectionPinned =
  RNK_CP006_EXPECTED_CANDIDATE_PROJECTION_SHA256 !== "UNPINNED" &&
  projectionSha256 === RNK_CP006_EXPECTED_CANDIDATE_PROJECTION_SHA256;
if (RNK_CP006_EXPECTED_CANDIDATE_PROJECTION_SHA256 !== "UNPINNED") {
  assert.equal(projectionPinned, true, "CP006 production candidate projection drifted");
}

console.log(JSON.stringify({
  status: "PASS",
  candidateVersion: RNK_CP006_PRODUCTION_CANDIDATE_VERSION,
  questionsChecked: questions.length,
  independentlyChecked,
  authorityCounts,
  answerPositionsByAuthority,
  contextsPerAuthority: Object.fromEntries(
    Object.entries(contextsByAuthority).map(([authority, contexts]) => [authority, [...contexts].sort()]),
  ),
  entityCountsByAuthority,
  modeCounts,
  pairDirectionCounts,
  difficultyCounts,
  clueChecks,
  equalityEssentialPairChecks,
  equalityEssentialEndpointChecks,
  equalityEssentialCompleteChecks,
  completeDistractorKinds,
  localPairExplanationChecks,
  fullPairExplanationChecks,
  endpointExplanationChecks,
  completeExplanationChecks,
  uniqueMathematicalStateKeys: mathematicalStateKeys.size,
  uniqueLearnerFingerprints: learnerFingerprints.size,
  uniqueRuntimeFingerprints: runtimeFingerprints.size,
  projectionSha256,
  expectedProjectionSha256: RNK_CP006_EXPECTED_CANDIDATE_PROJECTION_SHA256,
  projectionPinned,
  permanentQlAllocated: false,
  nextAvailableQl: "RNK-QL-039",
  lifecycle: {
    questionStudio: "DISABLED",
    persistence: "DISABLED",
    questionBank: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    hindiPunjabi: "NOT_STARTED",
  },
}, null, 2));
