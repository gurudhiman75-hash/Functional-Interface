import assert from "node:assert/strict";

import {
  buildRnkCp006EqualityEditorialV4Final,
  RNK_CP006_EQUALITY_EDITORIAL_V4_FINAL_VERSION,
} from "./cp006-equality-ranking-editorial-v4-final";
import {
  RNK_CP006_EDITORIAL_SOURCE_FORMS,
} from "./cp006-equality-ranking-editorial-v2";

const questions = buildRnkCp006EqualityEditorialV4Final();

assert.equal(questions.length, 144);

const countsByForm = Object.fromEntries(
  RNK_CP006_EDITORIAL_SOURCE_FORMS.map((form) => [form, 0]),
) as Record<(typeof RNK_CP006_EDITORIAL_SOURCE_FORMS)[number], number>;
const answerPositionsByForm = Object.fromEntries(
  RNK_CP006_EDITORIAL_SOURCE_FORMS.map((form) => [form, [0, 0, 0, 0]]),
) as Record<(typeof RNK_CP006_EDITORIAL_SOURCE_FORMS)[number], number[]>;
const fingerprints = new Set<string>();
let localPairQuestions = 0;
let fullChainPairQuestions = 0;
let duplicateExplanationLines = 0;

for (const question of questions) {
  assert.equal(question.editorialVersion, RNK_CP006_EQUALITY_EDITORIAL_V4_FINAL_VERSION);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.answer);
  assert.equal(question.reasoningProfile.equalityBridgeRequired, true);
  assert.equal(question.reasoningProfile.directEqualityLookup, false);

  const uniqueExplanationLines = new Set(question.explanation);
  if (uniqueExplanationLines.size !== question.explanation.length) {
    duplicateExplanationLines += question.explanation.length - uniqueExplanationLines.size;
  }
  assert.equal(
    uniqueExplanationLines.size,
    question.explanation.length,
    `${question.sourceForm} seed ${question.seed}: duplicate explanation line`,
  );

  if (
    question.sourceForm === "PAIR_RELATION_THROUGH_EQUALITY" &&
    question.reasoningProfile.pairSpan === "LOCAL_BRIDGE"
  ) {
    assert.equal(question.explanation.length, 1);
    assert.match(question.explanation[0]!, /Therefore,/);
    localPairQuestions += 1;
  }

  if (
    question.sourceForm === "PAIR_RELATION_THROUGH_EQUALITY" &&
    question.reasoningProfile.pairSpan === "FULL_CHAIN"
  ) {
    assert.equal(question.explanation.length, 3);
    assert.ok(
      question.explanation.some((line) =>
        line.includes(question.state.orderedGroups.map((group) => group.join(" = ")).join(" > ")),
      ),
    );
    fullChainPairQuestions += 1;
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

  assert.equal(question.lifecycle.permanentQlAllocated, false);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.questionBank, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);

  countsByForm[question.sourceForm] += 1;
  answerPositionsByForm[question.sourceForm][question.correctIndex] += 1;
  assert.equal(fingerprints.has(question.mathematicalFingerprint), false);
  fingerprints.add(question.mathematicalFingerprint);
}

for (const form of RNK_CP006_EDITORIAL_SOURCE_FORMS) {
  assert.equal(countsByForm[form], 48);
  assert.deepEqual(answerPositionsByForm[form], [12, 12, 12, 12]);
}
assert.equal(localPairQuestions, 24);
assert.equal(fullChainPairQuestions, 24);
assert.equal(duplicateExplanationLines, 0);
assert.equal(fingerprints.size, 144);

console.log(JSON.stringify({
  status: "PASS",
  editorialVersion: RNK_CP006_EQUALITY_EDITORIAL_V4_FINAL_VERSION,
  questionsChecked: questions.length,
  countsByForm,
  answerPositionsByForm,
  localPairQuestions,
  fullChainPairQuestions,
  duplicateExplanationLines,
  uniqueFingerprints: fingerprints.size,
  permanentQlAllocated: false,
  nextAvailableQl: "RNK-QL-039",
}, null, 2));
