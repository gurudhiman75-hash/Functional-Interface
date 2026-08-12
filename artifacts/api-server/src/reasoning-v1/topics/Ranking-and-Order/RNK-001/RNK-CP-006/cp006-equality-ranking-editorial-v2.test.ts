import assert from "node:assert/strict";

import {
  buildRnkCp006EqualityEditorialV2,
  RNK_CP006_EDITORIAL_SOURCE_FORMS,
  RNK_CP006_EQUALITY_EDITORIAL_VERSION,
  type RnkCp006EditorialQuestion,
  type RnkCp006EditorialState,
} from "./cp006-equality-ranking-editorial-v2";

const questions = buildRnkCp006EqualityEditorialV2();

assert.equal(questions.length, 144);
assert.deepEqual(RNK_CP006_EDITORIAL_SOURCE_FORMS, [
  "PAIR_RELATION_THROUGH_EQUALITY",
  "ENDPOINT_ENTITY_THROUGH_EQUALITY",
  "COMPLETE_WEAK_ORDER",
]);

function groupIndex(state: RnkCp006EditorialState, entity: string): number {
  return state.orderedGroups.findIndex((group) => group.includes(entity));
}

function canonicalOrder(state: RnkCp006EditorialState): string {
  return state.orderedGroups.map((group) => group.join(" = ")).join(" > ");
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

interface ParsedClues {
  readonly strictEdges: readonly Readonly<{ higher: string; lower: string }>[];
  readonly equalityPairs: readonly (readonly [string, string])[];
}

function parseClues(question: RnkCp006EditorialQuestion): ParsedClues {
  const strictEdges: { higher: string; lower: string }[] = [];
  const equalityPairs: [string, string][] = [];
  for (const clue of question.clues) {
    let recognized = false;
    for (const first of question.state.entities) {
      for (const second of question.state.entities) {
        if (first === second) continue;
        if (strictForms(question.state, first, second).includes(clue)) {
          strictEdges.push({ higher: first, lower: second });
          recognized = true;
        }
        if (equalityForms(question.state, first, second).includes(clue)) {
          const normalized = [first, second].sort() as [string, string];
          if (!equalityPairs.some((pair) => pair[0] === normalized[0] && pair[1] === normalized[1])) {
            equalityPairs.push(normalized);
          }
          recognized = true;
        }
      }
    }
    assert.equal(recognized, true, `${question.sourceForm} seed ${question.seed}: unrecognized clue ${clue}`);
  }
  return { strictEdges, equalityPairs };
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

function parseWeakOrder(option: string): readonly (readonly string[])[] {
  return option.split(" > ").map((group) => group.split(" = "));
}

function sameWeakOrder(state: RnkCp006EditorialState, option: string): boolean {
  const parsed = parseWeakOrder(option);
  if (parsed.length !== state.orderedGroups.length) return false;
  if (parsed.flat().length !== state.entities.length) return false;
  if (new Set(parsed.flat()).size !== state.entities.length) return false;
  for (let index = 0; index < parsed.length; index += 1) {
    const actual = [...parsed[index]!].sort();
    const expected = [...state.orderedGroups[index]!].sort();
    if (actual.length !== expected.length) return false;
    if (!actual.every((entity, i) => entity === expected[i])) return false;
  }
  return true;
}

function independentOptionTruth(question: RnkCp006EditorialQuestion): boolean[] {
  if (question.sourceForm === "PAIR_RELATION_THROUGH_EQUALITY") {
    const match = question.stem.match(/^What is the relation between (.+) and (.+)\?$/);
    assert.ok(match);
    const first = match![1]!;
    const second = match![2]!;
    const firstGroup = groupIndex(question.state, first);
    const secondGroup = groupIndex(question.state, second);
    assert.notEqual(firstGroup, -1);
    assert.notEqual(secondGroup, -1);
    assert.notEqual(firstGroup, secondGroup, "editorial pair query must not be direct equality lookup");
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

const countsByForm = Object.fromEntries(
  RNK_CP006_EDITORIAL_SOURCE_FORMS.map((form) => [form, 0]),
) as Record<(typeof RNK_CP006_EDITORIAL_SOURCE_FORMS)[number], number>;
const answerPositionsByForm = Object.fromEntries(
  RNK_CP006_EDITORIAL_SOURCE_FORMS.map((form) => [form, [0, 0, 0, 0]]),
) as Record<(typeof RNK_CP006_EDITORIAL_SOURCE_FORMS)[number], number[]>;
const contextsByForm = Object.fromEntries(
  RNK_CP006_EDITORIAL_SOURCE_FORMS.map((form) => [form, new Set<string>()]),
) as Record<(typeof RNK_CP006_EDITORIAL_SOURCE_FORMS)[number], Set<string>>;
const fingerprints = new Set<string>();
const difficultyCounts = { MEDIUM: 0, HARD: 0 };
const pairSpanCounts = { LOCAL_BRIDGE: 0, FULL_CHAIN: 0 };
const pairDirectionCounts = { FIRST_HIGHER: 0, SECOND_HIGHER: 0 };
const endpointDirectionCounts = { HIGHEST: 0, LOWEST: 0 };
let bridgeEssentialChecks = 0;
let independentlyChecked = 0;
let completeDistractorsRejected = 0;

for (const question of questions) {
  assert.equal(question.checkpointId, "RNK-CP-006");
  assert.equal(question.editorialVersion, RNK_CP006_EQUALITY_EDITORIAL_VERSION);
  assert.equal(question.reasoningProfile.equalityBridgeRequired, true);
  assert.equal(question.reasoningProfile.directEqualityLookup, false);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4, `${question.sourceForm} seed ${question.seed}: duplicate option`);
  assert.equal(question.options[question.correctIndex], question.answer);
  assert.equal(/EQUAL_PAIR_IDENTIFICATION/.test(question.sourceForm), false);

  const state = question.state;
  const flattened = state.orderedGroups.flat();
  assert.deepEqual(new Set(flattened), new Set(state.entities));
  assert.equal(flattened.length, state.entities.length);
  const tieGroups = state.orderedGroups.filter((group) => group.length === 2);
  assert.equal(tieGroups.length, 1);
  assert.equal(state.orderedGroups[state.tieGroupIndex]!.length, 2);
  assert.ok(state.tieGroupIndex > 0 && state.tieGroupIndex < state.orderedGroups.length - 1);

  const bridge = state.equalityBridge;
  assert.notEqual(bridge.entryTieMember, bridge.exitTieMember);
  const tie = state.orderedGroups[state.tieGroupIndex]!;
  assert.ok(tie.includes(bridge.entryTieMember));
  assert.ok(tie.includes(bridge.exitTieMember));
  assert.equal(bridge.aboveEntity, state.orderedGroups[state.tieGroupIndex - 1]![0]);
  assert.equal(bridge.belowEntity, state.orderedGroups[state.tieGroupIndex + 1]![0]);

  const parsed = parseClues(question);
  assert.equal(parsed.equalityPairs.length, 1);
  assert.equal(parsed.strictEdges.length, state.orderedGroups.length - 1);
  assert.ok(parsed.strictEdges.some((edge) => edge.higher === bridge.aboveEntity && edge.lower === bridge.entryTieMember));
  assert.ok(parsed.strictEdges.some((edge) => edge.higher === bridge.exitTieMember && edge.lower === bridge.belowEntity));
  assert.equal(parsed.strictEdges.some((edge) => edge.higher === bridge.aboveEntity && edge.lower === bridge.exitTieMember), false);
  assert.equal(parsed.strictEdges.some((edge) => edge.higher === bridge.entryTieMember && edge.lower === bridge.belowEntity), false);

  const top = state.orderedGroups[0]![0]!;
  const bottom = state.orderedGroups[state.orderedGroups.length - 1]![0]!;
  assert.equal(
    hasPath(state.entities, parsed.strictEdges, top, bottom),
    false,
    `${question.sourceForm} seed ${question.seed}: strict clues alone unexpectedly cross the equality level`,
  );
  const withEquality = [
    ...parsed.strictEdges,
    { higher: tie[0]!, lower: tie[1]! },
    { higher: tie[1]!, lower: tie[0]! },
  ];
  assert.equal(
    hasPath(state.entities, withEquality, top, bottom),
    true,
    `${question.sourceForm} seed ${question.seed}: equality clue does not repair the chain`,
  );
  bridgeEssentialChecks += 1;

  const independent = independentOptionTruth(question);
  assert.equal(independent.filter(Boolean).length, 1, `${question.sourceForm} seed ${question.seed}: option ambiguity`);
  assert.equal(independent[question.correctIndex], true, `${question.sourceForm} seed ${question.seed}: stored key mismatch`);
  independentlyChecked += 1;
  if (question.sourceForm === "COMPLETE_WEAK_ORDER") {
    completeDistractorsRejected += independent.filter((value) => !value).length;
    assert.equal(question.answer, canonicalOrder(state));
  }

  if (question.sourceForm === "PAIR_RELATION_THROUGH_EQUALITY") {
    const span = question.reasoningProfile.pairSpan!;
    pairSpanCounts[span] += 1;
    if (/^The relation/.test(question.answer) || /tied at the same level/.test(question.answer)) {
      assert.fail(`pair editorial answer must be strict, not equality/unknown: ${question.answer}`);
    }
    const match = question.stem.match(/^What is the relation between (.+) and (.+)\?$/)!;
    const first = match[1]!;
    const second = match[2]!;
    const firstIsHigher = groupIndex(state, first) < groupIndex(state, second);
    pairDirectionCounts[firstIsHigher ? "FIRST_HIGHER" : "SECOND_HIGHER"] += 1;
  }
  if (question.sourceForm === "ENDPOINT_ENTITY_THROUGH_EQUALITY") {
    endpointDirectionCounts[/highest/i.test(question.stem) ? "HIGHEST" : "LOWEST"] += 1;
  }

  const learnerText = [question.stem, ...question.clues, ...question.options, ...question.explanation].join(" ");
  assert.equal(/cannot be compared|uncomparable|incomparable/i.test(learnerText), false);
  assert.equal(/competition ranking|dense ranking|fractional ranking|next rank after|rank immediately after/i.test(learnerText), false);
  assert.equal(/\b(sit|sitting|seat|seating|facing|clockwise|anticlockwise|immediate left|immediate right)\b/i.test(learnerText), false);
  assert.ok(question.explanation.some((line) => /equality|equal|=/.test(line)), `${question.sourceForm}: explanation omits equality bridge`);

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
assert.equal(fingerprints.size, 144);
assert.equal(completeDistractorsRejected, 144);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      editorialVersion: RNK_CP006_EQUALITY_EDITORIAL_VERSION,
      questionsChecked: questions.length,
      independentlyChecked,
      countsByForm,
      answerPositionsByForm,
      contextsPerForm: Object.fromEntries(
        RNK_CP006_EDITORIAL_SOURCE_FORMS.map((form) => [form, [...contextsByForm[form]].sort()]),
      ),
      difficultyCounts,
      pairSpanCounts,
      pairDirectionCounts,
      endpointDirectionCounts,
      bridgeEssentialChecks,
      completeDistractorsRejected,
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
    },
    null,
    2,
  ),
);
