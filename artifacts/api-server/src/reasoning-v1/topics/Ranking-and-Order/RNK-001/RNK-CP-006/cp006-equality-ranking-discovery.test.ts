import assert from "node:assert/strict";

import {
  buildRnkCp006EqualityDiscovery,
  RNK_CP006_DISCOVERY_PROTOTYPES,
  RNK_CP006_EQUALITY_DISCOVERY_VERSION,
  type RnkCp006Question,
  type RnkCp006State,
} from "./cp006-equality-ranking-discovery";

const questions = buildRnkCp006EqualityDiscovery();

assert.equal(questions.length, 128);
assert.equal(RNK_CP006_DISCOVERY_PROTOTYPES.length, 4);

function groupIndex(state: RnkCp006State, entity: string): number {
  return state.orderedGroups.findIndex((group) => group.includes(entity));
}

function relation(
  state: RnkCp006State,
  first: string,
  second: string,
): "FIRST_HIGHER" | "SECOND_HIGHER" | "EQUAL" {
  const firstIndex = groupIndex(state, first);
  const secondIndex = groupIndex(state, second);
  assert.notEqual(firstIndex, -1);
  assert.notEqual(secondIndex, -1);
  if (firstIndex === secondIndex) return "EQUAL";
  return firstIndex < secondIndex ? "FIRST_HIGHER" : "SECOND_HIGHER";
}

function canonicalOrder(state: RnkCp006State): string {
  return state.orderedGroups.map((group) => group.join(" = ")).join(" > ");
}

function normalizePair(value: string): string {
  return value.split(" and ").sort().join("|");
}

function parseCompleteOrder(value: string): readonly (readonly string[])[] | null {
  if (!value.includes(" > ") && !value.includes(" = ")) return null;
  const groups = value
    .split(" > ")
    .map((part) => part.split(" = ").map((entity) => entity.trim()));
  if (groups.some((group) => group.some((entity) => entity.length === 0))) return null;
  return groups;
}

function isEquivalentWeakOrder(
  state: RnkCp006State,
  option: string,
): boolean {
  const parsed = parseCompleteOrder(option);
  if (!parsed) return false;
  if (parsed.length !== state.orderedGroups.length) return false;
  const seen = parsed.flat();
  if (seen.length !== state.entities.length) return false;
  if (new Set(seen).size !== state.entities.length) return false;
  if (new Set(seen).size !== new Set(state.entities).size) return false;
  for (const entity of state.entities) {
    if (!seen.includes(entity)) return false;
  }
  for (let index = 0; index < parsed.length; index += 1) {
    const expected = [...state.orderedGroups[index]!].sort();
    const actual = [...parsed[index]!].sort();
    if (expected.length !== actual.length) return false;
    if (!expected.every((entity, i) => entity === actual[i])) return false;
  }
  return true;
}

function validateClueTruth(question: RnkCp006Question): void {
  const { state } = question;
  for (const clue of question.clues) {
    let matched = false;
    for (const first of state.entities) {
      for (const second of state.entities) {
        if (first === second) continue;
        const rel = relation(state, first, second);
        const equalityForms = [
          `${first} and ${second} are equally tall.`,
          `${first} and ${second} scored equal marks.`,
          `${first} and ${second} completed the race in the same time.`,
          `${first} and ${second} are at the same seniority level.`,
          `${first} and ${second} received the same performance rank.`,
        ];
        if (equalityForms.includes(clue)) {
          assert.equal(rel, "EQUAL", `${question.prototype}: false equality clue: ${clue}`);
          matched = true;
        }
        const firstHigherForms = [
          `${first} is taller than ${second}.`,
          `${second} is shorter than ${first}.`,
          `${first} scored more marks than ${second}.`,
          `${second} scored fewer marks than ${first}.`,
          `${first} completed the race faster than ${second}.`,
          `${second} took longer than ${first} to complete the race.`,
          `${first} is senior to ${second}.`,
          `${second} is junior to ${first}.`,
          `${first} ranked above ${second} in the performance review.`,
          `${second} ranked below ${first} in the performance review.`,
        ];
        if (firstHigherForms.includes(clue)) {
          assert.equal(rel, "FIRST_HIGHER", `${question.prototype}: false strict clue: ${clue}`);
          matched = true;
        }
      }
    }
    assert.equal(matched, true, `${question.prototype}: unrecognized clue renderer: ${clue}`);
  }
}

function independentlyCorrectOptions(question: RnkCp006Question): boolean[] {
  const { state } = question;
  switch (question.prototype) {
    case "EQUAL_PAIR_IDENTIFICATION": {
      const tie = state.orderedGroups[state.tieGroupIndex]!;
      const expected = normalizePair(`${tie[0]} and ${tie[1]}`);
      return question.options.map((option) => normalizePair(option) === expected);
    }
    case "PAIR_RELATION_WITH_EQUALITY": {
      const match = question.stem.match(/^What is the relation between (.+) and (.+)\?$/);
      assert.ok(match, `pair-relation stem cannot be parsed: ${question.stem}`);
      const first = match![1]!;
      const second = match![2]!;
      const rel = relation(state, first, second);
      const expected = rel === "EQUAL"
        ? `${first} and ${second} are tied at the same position`
        : rel === "FIRST_HIGHER"
          ? `${first} is ranked higher than ${second}`
          : `${second} is ranked higher than ${first}`;
      return question.options.map((option) => option === expected);
    }
    case "ENDPOINT_ENTITY_WITH_INTERNAL_TIE": {
      const askHighest = /highest/i.test(question.stem);
      const expected = askHighest
        ? state.orderedGroups[0]![0]!
        : state.orderedGroups[state.orderedGroups.length - 1]![0]!;
      return question.options.map((option) => option === expected);
    }
    case "COMPLETE_WEAK_ORDER":
      return question.options.map((option) => isEquivalentWeakOrder(state, option));
  }
}

const countsByPrototype = Object.fromEntries(
  RNK_CP006_DISCOVERY_PROTOTYPES.map((prototype) => [prototype, 0]),
) as Record<(typeof RNK_CP006_DISCOVERY_PROTOTYPES)[number], number>;
const answerPositionsByPrototype = Object.fromEntries(
  RNK_CP006_DISCOVERY_PROTOTYPES.map((prototype) => [prototype, [0, 0, 0, 0]]),
) as Record<(typeof RNK_CP006_DISCOVERY_PROTOTYPES)[number], number[]>;
const answerPositions = [0, 0, 0, 0];
const contexts = new Set<string>();
const fingerprints = new Set<string>();
let equalityChecks = 0;
let strictChecks = 0;
let clueChecks = 0;
let completeOrderDistractorsRejected = 0;

for (const question of questions) {
  assert.equal(question.checkpointId, "RNK-CP-006");
  assert.equal(question.discoveryVersion, RNK_CP006_EQUALITY_DISCOVERY_VERSION);
  assert.ok(RNK_CP006_DISCOVERY_PROTOTYPES.includes(question.prototype));

  const { state } = question;
  assert.ok(state.entities.length >= 5 && state.entities.length <= 7);
  assert.equal(new Set(state.entities).size, state.entities.length);
  assert.ok(state.orderedGroups.length >= 4);
  assert.ok(state.tieGroupIndex > 0);
  assert.ok(state.tieGroupIndex < state.orderedGroups.length - 1);

  const flattened = state.orderedGroups.flat();
  assert.equal(flattened.length, state.entities.length);
  assert.equal(new Set(flattened).size, state.entities.length);
  assert.deepEqual(new Set(flattened), new Set(state.entities));

  const tieGroups = state.orderedGroups.filter((group) => group.length > 1);
  assert.equal(tieGroups.length, 1);
  assert.equal(tieGroups[0]!.length, 2);
  assert.equal(state.orderedGroups[state.tieGroupIndex]!.length, 2);
  for (const group of state.orderedGroups) {
    assert.ok(group.length === 1 || group.length === 2);
  }

  const tie = state.orderedGroups[state.tieGroupIndex]!;
  assert.equal(relation(state, tie[0]!, tie[1]!), "EQUAL");
  assert.equal(relation(state, tie[1]!, tie[0]!), "EQUAL");
  equalityChecks += 2;

  for (let higher = 0; higher < state.orderedGroups.length; higher += 1) {
    for (let lower = higher + 1; lower < state.orderedGroups.length; lower += 1) {
      for (const first of state.orderedGroups[higher]!) {
        for (const second of state.orderedGroups[lower]!) {
          assert.equal(relation(state, first, second), "FIRST_HIGHER");
          assert.equal(relation(state, second, first), "SECOND_HIGHER");
          strictChecks += 2;
        }
      }
    }
  }

  validateClueTruth(question);
  clueChecks += question.clues.length;
  assert.equal(question.clues.length, state.orderedGroups.length);

  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4, `${question.prototype}: duplicate option`);
  assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3);
  assert.equal(question.options[question.correctIndex], question.answer);

  const independent = independentlyCorrectOptions(question);
  assert.equal(
    independent.filter(Boolean).length,
    1,
    `${question.prototype} seed ${question.seed}: expected exactly one independently correct option`,
  );
  assert.equal(
    independent[question.correctIndex],
    true,
    `${question.prototype} seed ${question.seed}: correctIndex disagrees with independent state check`,
  );
  if (question.prototype === "COMPLETE_WEAK_ORDER") {
    completeOrderDistractorsRejected += independent.filter((value) => !value).length;
    assert.equal(question.answer, canonicalOrder(state));
  }

  const learnerText = [question.stem, ...question.clues, ...question.options, ...question.explanation].join(" ");
  assert.equal(
    /\b(sit|sitting|seat|seating|facing|immediate left|immediate right|clockwise|anticlockwise)\b/i.test(learnerText),
    false,
    `${question.prototype}: Seating Arrangement leakage`,
  );
  assert.equal(
    /competition ranking|dense ranking|fractional ranking|rank immediately after (?:a )?tie|next rank after (?:a )?tie/i.test(learnerText),
    false,
    `${question.prototype}: unsupported numeric tie convention leaked`,
  );
  assert.equal(/cannot be compared|uncomparable|incomparable/i.test(question.answer), false);

  assert.equal(question.lifecycle.permanentQlAllocated, false);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.questionBank, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);

  countsByPrototype[question.prototype] += 1;
  answerPositionsByPrototype[question.prototype][question.correctIndex] += 1;
  answerPositions[question.correctIndex] += 1;
  contexts.add(question.context);
  assert.equal(fingerprints.has(question.mathematicalFingerprint), false, `duplicate fingerprint: ${question.mathematicalFingerprint}`);
  fingerprints.add(question.mathematicalFingerprint);
}

for (const prototype of RNK_CP006_DISCOVERY_PROTOTYPES) {
  assert.equal(countsByPrototype[prototype], 32);
  assert.deepEqual(answerPositionsByPrototype[prototype], [8, 8, 8, 8]);
}
assert.deepEqual(answerPositions, [32, 32, 32, 32]);
assert.equal(contexts.size, 5);
assert.equal(fingerprints.size, 128);
assert.equal(completeOrderDistractorsRejected, 96);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      discoveryVersion: RNK_CP006_EQUALITY_DISCOVERY_VERSION,
      questionsChecked: questions.length,
      countsByPrototype,
      answerPositionsByPrototype,
      answerPositions,
      contexts: [...contexts].sort(),
      uniqueFingerprints: fingerprints.size,
      equalityChecks,
      strictChecks,
      clueChecks,
      completeOrderDistractorsRejected,
      stateContract: "ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY",
      equalityDistinctFromIncomparability: true,
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
