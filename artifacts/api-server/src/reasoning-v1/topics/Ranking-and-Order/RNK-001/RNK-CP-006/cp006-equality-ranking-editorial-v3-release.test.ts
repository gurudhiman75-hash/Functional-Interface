import assert from "node:assert/strict";

import {
  buildRnkCp006EqualityEditorialV3Release,
  RNK_CP006_EQUALITY_EDITORIAL_V3_RELEASE_VERSION,
  type RnkCp006EditorialV3Question,
} from "./cp006-equality-ranking-editorial-v3-release";
import { RNK_CP006_EDITORIAL_SOURCE_FORMS } from "./cp006-equality-ranking-editorial-v2";

const questions = buildRnkCp006EqualityEditorialV3Release();

function groupIndex(question: RnkCp006EditorialV3Question, entity: string): number {
  return question.state.orderedGroups.findIndex((group) => group.includes(entity));
}

function pairNames(question: RnkCp006EditorialV3Question): readonly [string, string] {
  for (const first of question.state.entities) {
    for (const second of question.state.entities) {
      if (first === second) continue;
      if (question.stem.includes(first) && question.stem.includes(second)) {
        const firstPosition = question.stem.indexOf(first);
        const secondPosition = question.stem.indexOf(second);
        return firstPosition < secondPosition ? [first, second] : [second, first];
      }
    }
  }
  throw new Error(`CP006 seed ${question.seed}: pair names not found in stem`);
}

function expectedPairAnswer(
  question: RnkCp006EditorialV3Question,
  first: string,
  second: string,
): string {
  const firstHigher = groupIndex(question, first) < groupIndex(question, second);
  const higher = firstHigher ? first : second;
  const lower = firstHigher ? second : first;
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

function endpointAnswer(question: RnkCp006EditorialV3Question): string {
  const lowestStem = /shortest|lowest marks|slowest|most junior|ranked lowest/i.test(question.stem);
  return lowestStem
    ? question.state.orderedGroups[question.state.orderedGroups.length - 1]![0]!
    : question.state.orderedGroups[0]![0]!;
}

function sameWeakOrder(question: RnkCp006EditorialV3Question, option: string): boolean {
  const parsed = option.split(" > ").map((part) => part.split(" = "));
  if (parsed.length !== question.state.orderedGroups.length) return false;
  if (parsed.flat().length !== question.state.entities.length) return false;
  if (new Set(parsed.flat()).size !== question.state.entities.length) return false;
  for (let index = 0; index < parsed.length; index += 1) {
    const actual = [...parsed[index]!].sort();
    const expected = [...question.state.orderedGroups[index]!].sort();
    if (actual.length !== expected.length) return false;
    if (!actual.every((entity, entityIndex) => entity === expected[entityIndex])) return false;
  }
  return true;
}

function assertContextNative(question: RnkCp006EditorialV3Question): void {
  const learnerText = [question.stem, ...question.options].join(" ");
  if (question.sourceForm === "PAIR_RELATION_THROUGH_EQUALITY") {
    switch (question.context) {
      case "HEIGHT":
        assert.match(learnerText, /heights|taller|equally tall/i);
        assert.doesNotMatch(learnerText, /ranked higher/i);
        break;
      case "SCORES":
        assert.match(learnerText, /scores|more marks|equal marks/i);
        assert.doesNotMatch(learnerText, /ranked higher/i);
        break;
      case "SPEED":
        assert.match(learnerText, /speeds|faster|equally fast/i);
        assert.doesNotMatch(learnerText, /ranked higher/i);
        break;
      case "SENIORITY":
        assert.match(learnerText, /seniority|senior to|same seniority/i);
        assert.doesNotMatch(learnerText, /ranked higher/i);
        break;
      case "PERFORMANCE":
        assert.match(learnerText, /performance|ranked above|performance level/i);
        break;
    }
  }

  if (question.sourceForm === "ENDPOINT_ENTITY_THROUGH_EQUALITY") {
    switch (question.context) {
      case "HEIGHT":
        assert.match(question.stem, /tallest|shortest/i);
        break;
      case "SCORES":
        assert.match(question.stem, /highest marks|lowest marks/i);
        break;
      case "SPEED":
        assert.match(question.stem, /fastest|slowest/i);
        break;
      case "SENIORITY":
        assert.match(question.stem, /most senior|most junior/i);
        break;
      case "PERFORMANCE":
        assert.match(question.stem, /ranked highest|ranked lowest/i);
        break;
    }
  }

  if (question.sourceForm === "COMPLETE_WEAK_ORDER") {
    assert.match(question.stem, /=/);
    switch (question.context) {
      case "HEIGHT":
        assert.match(question.stem, /tallest to shortest|equal height/i);
        break;
      case "SCORES":
        assert.match(question.stem, /highest to lowest score|equal scores/i);
        break;
      case "SPEED":
        assert.match(question.stem, /fastest to slowest|equal speed/i);
        break;
      case "SENIORITY":
        assert.match(question.stem, /most senior to most junior|same seniority/i);
        break;
      case "PERFORMANCE":
        assert.match(question.stem, /highest to lowest performance|same performance/i);
        break;
    }
  }
}

assert.equal(questions.length, 144);

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
let independentlyChecked = 0;
let contextNativeChecks = 0;
let completeDistractorsRejected = 0;

for (const question of questions) {
  assert.equal(question.editorialVersion, RNK_CP006_EQUALITY_EDITORIAL_V3_RELEASE_VERSION);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.answer);
  assert.equal(question.reasoningProfile.equalityBridgeRequired, true);
  assert.equal(question.reasoningProfile.directEqualityLookup, false);

  const bridge = question.state.equalityBridge;
  assert.notEqual(bridge.entryTieMember, bridge.exitTieMember);
  assert.ok(question.state.orderedGroups[question.state.tieGroupIndex]!.includes(bridge.entryTieMember));
  assert.ok(question.state.orderedGroups[question.state.tieGroupIndex]!.includes(bridge.exitTieMember));

  let truth: boolean[];
  if (question.sourceForm === "PAIR_RELATION_THROUGH_EQUALITY") {
    const [first, second] = pairNames(question);
    assert.notEqual(groupIndex(question, first), groupIndex(question, second));
    const expected = expectedPairAnswer(question, first, second);
    truth = question.options.map((option) => option === expected);
  } else if (question.sourceForm === "ENDPOINT_ENTITY_THROUGH_EQUALITY") {
    const expected = endpointAnswer(question);
    truth = question.options.map((option) => option === expected);
  } else {
    truth = question.options.map((option) => sameWeakOrder(question, option));
    completeDistractorsRejected += truth.filter((value) => !value).length;
  }
  assert.equal(truth.filter(Boolean).length, 1, `${question.sourceForm} seed ${question.seed}: ambiguous options`);
  assert.equal(truth[question.correctIndex], true, `${question.sourceForm} seed ${question.seed}: key mismatch`);
  independentlyChecked += 1;

  assertContextNative(question);
  contextNativeChecks += 1;

  const learnerText = [
    question.stem,
    ...question.clues,
    ...question.options,
    ...question.explanation,
  ].join(" ");
  assert.doesNotMatch(learnerText, /uncomparable|incomparable|cannot be compared/i);
  assert.doesNotMatch(learnerText, /competition ranking|dense ranking|fractional ranking|next rank after|rank immediately after/i);
  assert.doesNotMatch(learnerText, /\b(sit|sitting|seat|seating|facing|clockwise|anticlockwise|immediate left|immediate right)\b/i);

  assert.equal(question.lifecycle.permanentQlAllocated, false);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.questionBank, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);

  countsByForm[question.sourceForm] += 1;
  answerPositionsByForm[question.sourceForm][question.correctIndex] += 1;
  contextsByForm[question.sourceForm].add(question.context);
  assert.equal(fingerprints.has(question.mathematicalFingerprint), false);
  fingerprints.add(question.mathematicalFingerprint);
}

for (const form of RNK_CP006_EDITORIAL_SOURCE_FORMS) {
  assert.equal(countsByForm[form], 48);
  assert.deepEqual(answerPositionsByForm[form], [12, 12, 12, 12]);
  assert.equal(contextsByForm[form].size, 5);
}
assert.equal(fingerprints.size, 144);
assert.equal(completeDistractorsRejected, 144);

console.log(JSON.stringify({
  status: "PASS",
  editorialVersion: RNK_CP006_EQUALITY_EDITORIAL_V3_RELEASE_VERSION,
  questionsChecked: questions.length,
  independentlyChecked,
  contextNativeChecks,
  countsByForm,
  answerPositionsByForm,
  contextsPerForm: Object.fromEntries(
    RNK_CP006_EDITORIAL_SOURCE_FORMS.map((form) => [form, [...contextsByForm[form]].sort()]),
  ),
  completeDistractorsRejected,
  uniqueFingerprints: fingerprints.size,
  equalityBridgeRequired: true,
  directEqualityLookupRejected: true,
  numericTieConventionAllocated: false,
  permanentQlAllocated: false,
  nextAvailableQl: "RNK-QL-039",
}, null, 2));
