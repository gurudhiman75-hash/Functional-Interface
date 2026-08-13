import assert from "node:assert/strict";

import {
  buildRnkCp006EqualityEditorialV4Release,
  RNK_CP006_EQUALITY_EDITORIAL_V4_RELEASE_VERSION,
  type RnkCp006EditorialV4Question,
} from "./cp006-equality-ranking-editorial-v4-release";
import { RNK_CP006_EDITORIAL_SOURCE_FORMS } from "./cp006-equality-ranking-editorial-v2";

const questions = buildRnkCp006EqualityEditorialV4Release();

function groupIndex(question: RnkCp006EditorialV4Question, entity: string): number {
  return question.state.orderedGroups.findIndex((group) => group.includes(entity));
}

function pairNames(question: RnkCp006EditorialV4Question): readonly [string, string] {
  for (const first of question.state.entities) {
    for (const second of question.state.entities) {
      if (first === second) continue;
      if (question.stem.includes(first) && question.stem.includes(second)) {
        return question.stem.indexOf(first) < question.stem.indexOf(second)
          ? [first, second]
          : [second, first];
      }
    }
  }
  throw new Error(`CP006 seed ${question.seed}: pair names not found in V4 stem`);
}

function expectedPairAnswer(
  question: RnkCp006EditorialV4Question,
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

function endpointAnswer(question: RnkCp006EditorialV4Question): string {
  const asksLow = /shortest|lowest marks|slowest|most junior|ranked lowest/i.test(question.stem);
  return asksLow
    ? question.state.orderedGroups[question.state.orderedGroups.length - 1]![0]!
    : question.state.orderedGroups[0]![0]!;
}

function parseOrder(value: string): readonly (readonly string[])[] {
  return value.split(" > ").map((part) => part.split(" = "));
}

function sameWeakOrder(question: RnkCp006EditorialV4Question, option: string): boolean {
  const parsed = parseOrder(option);
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

function canonicalOrder(question: RnkCp006EditorialV4Question): string {
  return question.state.orderedGroups.map((group) => group.join(" = ")).join(" > ");
}

function equalityPair(option: string): string | null {
  const group = parseOrder(option).find((part) => part.length > 1);
  if (!group) return null;
  return [...group].sort().join("|");
}

function expectedEqualityPair(question: RnkCp006EditorialV4Question): string {
  return [...question.state.orderedGroups[question.state.tieGroupIndex]!].sort().join("|");
}

function classifyCompleteDistractor(
  question: RnkCp006EditorialV4Question,
  option: string,
): "SPLIT_TIE" | "FALSE_EQUALITY" | "STRICT_ORDER" {
  const pair = equalityPair(option);
  if (pair === null) return "SPLIT_TIE";
  if (pair !== expectedEqualityPair(question)) return "FALSE_EQUALITY";
  return "STRICT_ORDER";
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
const fingerprints = new Set<string>();
const completeDistractorKinds = {
  SPLIT_TIE: 0,
  FALSE_EQUALITY: 0,
  STRICT_ORDER: 0,
};
let independentlyChecked = 0;
let fullChainExplanationsChecked = 0;
let contextNativeExplanationsChecked = 0;
let performanceWordingChecks = 0;

for (const question of questions) {
  assert.equal(question.editorialVersion, RNK_CP006_EQUALITY_EDITORIAL_V4_RELEASE_VERSION);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4, `${question.sourceForm} seed ${question.seed}: duplicate option`);
  assert.equal(question.options[question.correctIndex], question.answer);
  assert.equal(question.reasoningProfile.equalityBridgeRequired, true);
  assert.equal(question.reasoningProfile.directEqualityLookup, false);

  const tie = question.state.orderedGroups[question.state.tieGroupIndex]!;
  assert.equal(tie.length, 2);
  assert.notEqual(question.state.equalityBridge.entryTieMember, question.state.equalityBridge.exitTieMember);

  let truth: boolean[];
  if (question.sourceForm === "PAIR_RELATION_THROUGH_EQUALITY") {
    const [first, second] = pairNames(question);
    assert.notEqual(groupIndex(question, first), groupIndex(question, second));
    const expected = expectedPairAnswer(question, first, second);
    truth = question.options.map((option) => option === expected);
    if (question.reasoningProfile.pairSpan === "FULL_CHAIN") {
      assert.ok(
        question.explanation.some((line) => line.includes(canonicalOrder(question))),
        `${question.seed}: full-chain pair explanation must show the derived complete order`,
      );
      fullChainExplanationsChecked += 1;
    }
  } else if (question.sourceForm === "ENDPOINT_ENTITY_THROUGH_EQUALITY") {
    const expected = endpointAnswer(question);
    truth = question.options.map((option) => option === expected);
    assert.ok(
      question.explanation.some((line) => line.includes(canonicalOrder(question))),
      `${question.seed}: endpoint explanation must show the derived complete order`,
    );
  } else {
    truth = question.options.map((option) => sameWeakOrder(question, option));
    assert.equal(question.answer, canonicalOrder(question));
    const wrongOptions = question.options.filter((_, index) => index !== question.correctIndex);
    const localKinds = wrongOptions.map((option) => classifyCompleteDistractor(question, option));
    assert.deepEqual(
      new Set(localKinds),
      new Set(["SPLIT_TIE", "FALSE_EQUALITY", "STRICT_ORDER"]),
      `${question.seed}: complete-order distractors must cover three misconception classes`,
    );
    for (const kind of localKinds) completeDistractorKinds[kind] += 1;
    assert.ok(
      question.explanation.some((line) => line.includes(canonicalOrder(question))),
      `${question.seed}: complete-order explanation must show the final order`,
    );
  }
  assert.equal(truth.filter(Boolean).length, 1, `${question.sourceForm} seed ${question.seed}: ambiguous options`);
  assert.equal(truth[question.correctIndex], true, `${question.sourceForm} seed ${question.seed}: key mismatch`);
  independentlyChecked += 1;

  const explanationText = question.explanation.join(" ");
  switch (question.context) {
    case "HEIGHT":
      assert.match(explanationText, /taller|tallest|shortest|equal/i);
      break;
    case "SCORES":
      assert.match(explanationText, /marks|score|equal/i);
      break;
    case "SPEED":
      assert.match(explanationText, /faster|fastest|slowest|equal/i);
      break;
    case "SENIORITY":
      assert.match(explanationText, /senior|junior|same seniority/i);
      break;
    case "PERFORMANCE":
      assert.match(explanationText, /ranked|performance|same level/i);
      break;
  }
  contextNativeExplanationsChecked += 1;

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
  assert.doesNotMatch(learnerText, /competition ranking|dense ranking|fractional ranking|next rank after|rank immediately after/i);
  assert.doesNotMatch(learnerText, /\b(sit|sitting|seat|seating|facing|clockwise|anticlockwise|immediate left|immediate right)\b/i);
  if (question.context === "PERFORMANCE") {
    assert.match(learnerText, /performance review|performance order|ranked/i);
    performanceWordingChecks += 1;
  }

  assert.equal(question.lifecycle.permanentQlAllocated, false);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.questionBank, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);

  countsByForm[question.sourceForm] += 1;
  answerPositionsByForm[question.sourceForm][question.correctIndex] += 1;
  contextsByForm[question.sourceForm].add(question.context);
  assert.equal(fingerprints.has(question.mathematicalFingerprint), false, `duplicate fingerprint: ${question.mathematicalFingerprint}`);
  fingerprints.add(question.mathematicalFingerprint);
}

for (const form of RNK_CP006_EDITORIAL_SOURCE_FORMS) {
  assert.equal(countsByForm[form], 48);
  assert.deepEqual(answerPositionsByForm[form], [12, 12, 12, 12]);
  assert.equal(contextsByForm[form].size, 5);
}
assert.deepEqual(completeDistractorKinds, {
  SPLIT_TIE: 48,
  FALSE_EQUALITY: 48,
  STRICT_ORDER: 48,
});
assert.equal(fullChainExplanationsChecked, 24);
assert.equal(contextNativeExplanationsChecked, 144);
assert.ok(performanceWordingChecks > 0);
assert.equal(fingerprints.size, 144);

console.log(JSON.stringify({
  status: "PASS",
  editorialVersion: RNK_CP006_EQUALITY_EDITORIAL_V4_RELEASE_VERSION,
  questionsChecked: questions.length,
  independentlyChecked,
  countsByForm,
  answerPositionsByForm,
  contextsPerForm: Object.fromEntries(
    RNK_CP006_EDITORIAL_SOURCE_FORMS.map((form) => [form, [...contextsByForm[form]].sort()]),
  ),
  fullChainExplanationsChecked,
  contextNativeExplanationsChecked,
  performanceWordingChecks,
  completeDistractorKinds,
  uniqueFingerprints: fingerprints.size,
  equalityBridgeRequired: true,
  directEqualityLookupRejected: true,
  numericTieConventionAllocated: false,
  permanentQlAllocated: false,
  nextAvailableQl: "RNK-QL-039",
}, null, 2));
