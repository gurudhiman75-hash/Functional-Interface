import assert from "node:assert/strict";

import {
  buildRnkCp005EditorialCorpus,
  RNK_CP005_EDITORIAL_CANDIDATE_IDS,
  RNK_CP005_PARTIAL_ORDER_EDITORIAL_VERSION,
  RNK_CP005_REJECTED_DISCOVERY_IDS,
} from "./cp005-partial-order-editorial";
import { buildRnkCp005PartialOrderState } from "./cp005-partial-order-runtime";

const corpus = buildRnkCp005EditorialCorpus(24);
assert.equal(corpus.length, RNK_CP005_EDITORIAL_CANDIDATE_IDS.length * 24);
assert.equal(RNK_CP005_PARTIAL_ORDER_EDITORIAL_VERSION, "RNK_CP005_PARTIAL_ORDER_EDITORIAL_V1");
assert.deepEqual(RNK_CP005_REJECTED_DISCOVERY_IDS, ["ORDER_UNIQUENESS_STATUS"]);

const answerPositions = [0, 0, 0, 0];
const fingerprints = new Set<string>();
const prototypeCounts = Object.fromEntries(
  RNK_CP005_EDITORIAL_CANDIDATE_IDS.map((prototypeId) => [prototypeId, 0]),
) as Record<string, number>;
const bannedArrangementLanguage = /\b(sit|sitting|seat|seating|facing|neighbour|neighbor|adjacent|immediate left|immediate right|extreme left|extreme right)\b/i;
const verboseRelationPrefix = /^It is (?:definitely true|possible|impossible) that /i;

for (const question of corpus) {
  prototypeCounts[question.prototypeId] += 1;
  assert.equal(question.options.length, 4, `${question.discoveryId} option count`);
  assert.equal(question.options.filter((option) => option.truth).length, 1);
  assert.equal(question.options[question.correctIndex]?.truth, true);
  answerPositions[question.correctIndex] += 1;

  assert.equal(question.lifecycle.permanentQlAllocated, false);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.questionBank, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.prototypeId === "ORDER_UNIQUENESS_STATUS", false);

  const learnerText = [
    question.instruction,
    ...question.clues,
    question.stem,
    ...question.options.map((option) => option.label),
    ...question.explanation,
  ].join(" ");
  assert.equal(bannedArrangementLanguage.test(learnerText), false);
  assert.equal(/RNK-QL-0?36|permanent QL/i.test(learnerText), false);
  assert.equal(question.options.some((option) => verboseRelationPrefix.test(option.label)), false);
  assert.ok(question.explanation.length >= 2 && question.explanation.length <= 3);

  const state = buildRnkCp005PartialOrderState(question.seed);
  if (question.prototypeId === "DEFINITELY_TRUE_RELATION") {
    const match = question.answer.match(/^(.+?) is ranked above (.+)$/i);
    assert.ok(match);
    assert.equal(
      state.edges.some((edge) => edge.higher === match[1] && edge.lower === match[2]),
      false,
      `${question.discoveryId} correct answer merely repeated a clue`,
    );
  }
  if (question.prototypeId === "IMPOSSIBLE_RELATION") {
    const match = question.answer.match(/^(.+?) cannot rank above (.+)$/i);
    assert.ok(match);
    assert.equal(
      state.edges.some((edge) => edge.higher === match[2] && edge.lower === match[1]),
      false,
      `${question.discoveryId} correct answer merely reversed a clue`,
    );
  }
  if (
    question.prototypeId === "DEFINITE_RANK_OR_INDETERMINATE" &&
    !/cannot be determined/i.test(question.answer)
  ) {
    const target = question.stem.match(/rank of (.+?)\?$/i)?.[1];
    assert.ok(target);
    assert.equal(
      state.fixedRanks.some((item) => item.entity === target),
      false,
      `${question.discoveryId} definite rank was directly stated`,
    );
  }

  assert.equal(fingerprints.has(question.mathematicalFingerprint), false);
  fingerprints.add(question.mathematicalFingerprint);
}

for (const prototypeId of RNK_CP005_EDITORIAL_CANDIDATE_IDS) {
  assert.equal(prototypeCounts[prototypeId], 24);
}
assert.deepEqual(answerPositions, [42, 42, 42, 42]);
assert.equal(fingerprints.size, corpus.length);

const definiteRankQuestions = corpus.filter(
  (question) => question.prototypeId === "DEFINITE_RANK_OR_INDETERMINATE",
);
assert.equal(
  definiteRankQuestions.filter((question) => /cannot be determined/i.test(question.answer)).length,
  12,
);
assert.equal(
  definiteRankQuestions.filter((question) => !/cannot be determined/i.test(question.answer)).length,
  12,
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      editorialVersion: RNK_CP005_PARTIAL_ORDER_EDITORIAL_VERSION,
      candidatePrototypes: prototypeCounts,
      rejectedPrototypes: RNK_CP005_REJECTED_DISCOVERY_IDS,
      questionsChecked: corpus.length,
      answerPositions,
      uniqueFingerprints: fingerprints.size,
      permanentQlAllocated: false,
    },
    null,
    2,
  ),
);
