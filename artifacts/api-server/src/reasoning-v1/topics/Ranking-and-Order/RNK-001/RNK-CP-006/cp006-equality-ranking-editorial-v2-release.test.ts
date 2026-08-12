import assert from "node:assert/strict";

import {
  buildRnkCp006EqualityEditorialV2Release,
  RNK_CP006_EQUALITY_EDITORIAL_RELEASE_VERSION,
  type RnkCp006EditorialReleaseQuestion,
} from "./cp006-equality-ranking-editorial-v2-release";
import {
  RNK_CP006_EDITORIAL_SOURCE_FORMS,
  type RnkCp006EditorialState,
} from "./cp006-equality-ranking-editorial-v2";

const questions = buildRnkCp006EqualityEditorialV2Release();

function groupIndex(state: RnkCp006EditorialState, entity: string): number {
  return state.orderedGroups.findIndex((group) => group.includes(entity));
}

function strictForms(
  state: RnkCp006EditorialState,
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

function equalityForms(
  state: RnkCp006EditorialState,
  first: string,
  second: string,
): readonly string[] {
  switch (state.context) {
    case "HEIGHT":
      return [`${first} and ${second} are equally tall.`, `${second} and ${first} are equally tall.`];
    case "SCORES":
      return [`${first} and ${second} scored equal marks.`, `${second} and ${first} scored equal marks.`];
    case "SPEED":
      return [`${first} and ${second} completed the race in the same time.`, `${second} and ${first} completed the race in the same time.`];
    case "SENIORITY":
      return [`${first} and ${second} are at the same seniority level.`, `${second} and ${first} are at the same seniority level.`];
    case "PERFORMANCE":
      return [`${first} and ${second} received the same performance level.`, `${second} and ${first} received the same performance level.`];
  }
}

function hasAny(values: readonly string[], candidates: readonly string[]): boolean {
  return candidates.some((candidate) => values.includes(candidate));
}

function canonicalOrder(state: RnkCp006EditorialState): string {
  return state.orderedGroups.map((group) => group.join(" = ")).join(" > ");
}

function sameWeakOrder(state: RnkCp006EditorialState, value: string): boolean {
  const groups = value.split(" > ").map((group) => group.split(" = "));
  if (groups.length !== state.orderedGroups.length) return false;
  if (groups.flat().length !== state.entities.length) return false;
  if (new Set(groups.flat()).size !== state.entities.length) return false;
  for (let index = 0; index < groups.length; index += 1) {
    const actual = [...groups[index]!].sort();
    const expected = [...state.orderedGroups[index]!].sort();
    if (actual.length !== expected.length) return false;
    if (!actual.every((entity, entityIndex) => entity === expected[entityIndex])) return false;
  }
  return true;
}

function independentlyCorrectOptions(question: RnkCp006EditorialReleaseQuestion): boolean[] {
  if (question.sourceForm === "PAIR_RELATION_THROUGH_EQUALITY") {
    const match = question.stem.match(/^What is the relation between (.+) and (.+)\?$/);
    assert.ok(match, `${question.seed}: pair stem cannot be parsed`);
    const first = match![1]!;
    const second = match![2]!;
    const firstGroup = groupIndex(question.state, first);
    const secondGroup = groupIndex(question.state, second);
    assert.notEqual(firstGroup, -1);
    assert.notEqual(secondGroup, -1);
    assert.notEqual(firstGroup, secondGroup, `${question.seed}: direct equality lookup survived`);
    const expected = firstGroup < secondGroup
      ? `${first} is ranked higher than ${second}`
      : `${second} is ranked higher than ${first}`;
    return question.options.map((option) => option === expected);
  }

  if (question.sourceForm === "ENDPOINT_ENTITY_THROUGH_EQUALITY") {
    const expected = /highest/i.test(question.stem)
      ? question.state.orderedGroups[0]![0]!
      : question.state.orderedGroups[question.state.orderedGroups.length - 1]![0]!;
    return question.options.map((option) => option === expected);
  }

  return question.options.map((option) => sameWeakOrder(question.state, option));
}

assert.equal(questions.length, 144);
assert.equal(RNK_CP006_EDITORIAL_SOURCE_FORMS.length, 3);

const countsByForm = Object.fromEntries(
  RNK_CP006_EDITORIAL_SOURCE_FORMS.map((form) => [form, 0]),
) as Record<(typeof RNK_CP006_EDITORIAL_SOURCE_FORMS)[number], number>;
const answerPositionsByForm = Object.fromEntries(
  RNK_CP006_EDITORIAL_SOURCE_FORMS.map((form) => [form, [0, 0, 0, 0]]),
) as Record<(typeof RNK_CP006_EDITORIAL_SOURCE_FORMS)[number], number[]>;
const contextsByForm = Object.fromEntries(
  RNK_CP006_EDITORIAL_SOURCE_FORMS.map((form) => [form, new Set<string>()]),
) as Record<(typeof RNK_CP006_EDITORIAL_SOURCE_FORMS)[number], Set<string>>;
const pairSpanCounts = { LOCAL_BRIDGE: 0, FULL_CHAIN: 0 };
const pairDirectionCounts = { FIRST_HIGHER: 0, SECOND_HIGHER: 0 };
const endpointDirectionCounts = { HIGHEST: 0, LOWEST: 0 };
const difficultyCounts = { MEDIUM: 0, HARD: 0 };
const fingerprints = new Set<string>();
let bridgeChecks = 0;
let independentlyChecked = 0;
let completeOrderDistractorsRejected = 0;

for (const question of questions) {
  assert.equal(question.editorialVersion, RNK_CP006_EQUALITY_EDITORIAL_RELEASE_VERSION);
  assert.equal(question.checkpointId, "RNK-CP-006");
  assert.equal(question.reasoningProfile.equalityBridgeRequired, true);
  assert.equal(question.reasoningProfile.directEqualityLookup, false);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4, `${question.sourceForm} seed ${question.seed}: duplicate option`);
  assert.equal(question.options[question.correctIndex], question.answer);

  const state = question.state;
  const flattened = state.orderedGroups.flat();
  assert.equal(flattened.length, state.entities.length);
  assert.equal(new Set(flattened).size, state.entities.length);
  assert.deepEqual(new Set(flattened), new Set(state.entities));

  const tieGroups = state.orderedGroups.filter((group) => group.length > 1);
  assert.equal(tieGroups.length, 1);
  assert.equal(tieGroups[0]!.length, 2);
  assert.ok(state.tieGroupIndex > 0 && state.tieGroupIndex < state.orderedGroups.length - 1);

  const bridge = state.equalityBridge;
  assert.notEqual(bridge.entryTieMember, bridge.exitTieMember);
  assert.equal(bridge.aboveEntity, state.orderedGroups[state.tieGroupIndex - 1]![0]);
  assert.equal(bridge.belowEntity, state.orderedGroups[state.tieGroupIndex + 1]![0]);
  assert.ok(state.orderedGroups[state.tieGroupIndex]!.includes(bridge.entryTieMember));
  assert.ok(state.orderedGroups[state.tieGroupIndex]!.includes(bridge.exitTieMember));

  assert.equal(
    hasAny(question.clues, strictForms(state, bridge.aboveEntity, bridge.entryTieMember)),
    true,
    `${question.sourceForm} seed ${question.seed}: entry bridge clue missing`,
  );
  assert.equal(
    hasAny(question.clues, strictForms(state, bridge.exitTieMember, bridge.belowEntity)),
    true,
    `${question.sourceForm} seed ${question.seed}: exit bridge clue missing`,
  );
  assert.equal(
    hasAny(question.clues, equalityForms(state, bridge.entryTieMember, bridge.exitTieMember)),
    true,
    `${question.sourceForm} seed ${question.seed}: equality bridge clue missing`,
  );
  assert.equal(
    hasAny(question.clues, strictForms(state, bridge.aboveEntity, bridge.exitTieMember)),
    false,
    `${question.sourceForm} seed ${question.seed}: equality bridge bypassed on entry`,
  );
  assert.equal(
    hasAny(question.clues, strictForms(state, bridge.entryTieMember, bridge.belowEntity)),
    false,
    `${question.sourceForm} seed ${question.seed}: equality bridge bypassed on exit`,
  );
  bridgeChecks += 1;

  const independent = independentlyCorrectOptions(question);
  assert.equal(independent.filter(Boolean).length, 1, `${question.sourceForm} seed ${question.seed}: expected one correct option`);
  assert.equal(independent[question.correctIndex], true, `${question.sourceForm} seed ${question.seed}: stored key mismatch`);
  independentlyChecked += 1;

  if (question.sourceForm === "PAIR_RELATION_THROUGH_EQUALITY") {
    assert.equal(/tied at the same level|cannot be determined/i.test(question.answer), false);
    pairSpanCounts[question.reasoningProfile.pairSpan!] += 1;
    const match = question.stem.match(/^What is the relation between (.+) and (.+)\?$/)!;
    const firstHigher = groupIndex(state, match[1]!) < groupIndex(state, match[2]!);
    pairDirectionCounts[firstHigher ? "FIRST_HIGHER" : "SECOND_HIGHER"] += 1;
  }

  if (question.sourceForm === "ENDPOINT_ENTITY_THROUGH_EQUALITY") {
    endpointDirectionCounts[/highest/i.test(question.stem) ? "HIGHEST" : "LOWEST"] += 1;
  }

  if (question.sourceForm === "COMPLETE_WEAK_ORDER") {
    assert.equal(question.answer, canonicalOrder(state));
    completeOrderDistractorsRejected += independent.filter((value) => !value).length;
  }

  const learnerText = [
    question.stem,
    ...question.clues,
    ...question.options,
    ...question.explanation,
  ].join(" ");
  assert.equal(/cannot be compared|uncomparable|incomparable/i.test(learnerText), false);
  assert.equal(/competition ranking|dense ranking|fractional ranking|next rank after|rank immediately after/i.test(learnerText), false);
  assert.equal(/\b(sit|sitting|seat|seating|facing|clockwise|anticlockwise|immediate left|immediate right)\b/i.test(learnerText), false);
  assert.ok(question.explanation.some((line) => /equality|equal|=/.test(line)));

  assert.equal(question.lifecycle.permanentQlAllocated, false);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.questionBank, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);

  countsByForm[question.sourceForm] += 1;
  answerPositionsByForm[question.sourceForm][question.correctIndex] += 1;
  contextsByForm[question.sourceForm].add(question.context);
  difficultyCounts[question.difficulty] += 1;
  assert.equal(fingerprints.has(question.mathematicalFingerprint), false, `duplicate fingerprint: ${question.mathematicalFingerprint}`);
  fingerprints.add(question.mathematicalFingerprint);
}

for (const form of RNK_CP006_EDITORIAL_SOURCE_FORMS) {
  assert.equal(countsByForm[form], 48);
  assert.deepEqual(answerPositionsByForm[form], [12, 12, 12, 12]);
  assert.equal(contextsByForm[form].size, 5);
}
assert.deepEqual(pairSpanCounts, { LOCAL_BRIDGE: 24, FULL_CHAIN: 24 });
assert.deepEqual(pairDirectionCounts, { FIRST_HIGHER: 24, SECOND_HIGHER: 24 });
assert.deepEqual(endpointDirectionCounts, { HIGHEST: 24, LOWEST: 24 });
assert.equal(completeOrderDistractorsRejected, 144);
assert.equal(fingerprints.size, 144);

console.log(JSON.stringify({
  status: "PASS",
  editorialVersion: RNK_CP006_EQUALITY_EDITORIAL_RELEASE_VERSION,
  questionsChecked: questions.length,
  independentlyChecked,
  countsByForm,
  answerPositionsByForm,
  contextsPerForm: Object.fromEntries(
    RNK_CP006_EDITORIAL_SOURCE_FORMS.map((form) => [form, [...contextsByForm[form]].sort()]),
  ),
  pairSpanCounts,
  pairDirectionCounts,
  endpointDirectionCounts,
  difficultyCounts,
  bridgeChecks,
  completeOrderDistractorsRejected,
  uniqueFingerprints: fingerprints.size,
  rejectedRawForm: "EQUAL_PAIR_IDENTIFICATION",
  equalityBridgeRequired: true,
  numericTieConventionAllocated: false,
  permanentQlAllocated: false,
  nextAvailableQl: "RNK-QL-039",
  lifecycle: {
    questionStudio: "DISABLED",
    questionBank: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
}, null, 2));
