import assert from "node:assert/strict";

import {
  buildRnkCp005DiscoveryCorpus,
  buildRnkCp005PartialOrderState,
  enumerateRnkCp005ValidOrders,
  RNK_CP005_PARTIAL_ORDER_DISCOVERY_VERSION,
  RNK_CP005_PROTOTYPE_IDS,
} from "./cp005-partial-order-runtime";

const corpus = buildRnkCp005DiscoveryCorpus(32);
assert.equal(corpus.length, RNK_CP005_PROTOTYPE_IDS.length * 32);
assert.equal(RNK_CP005_PARTIAL_ORDER_DISCOVERY_VERSION, "RNK_CP005_PARTIAL_ORDER_DISCOVERY_V1");

const prototypeCounts = Object.fromEntries(
  RNK_CP005_PROTOTYPE_IDS.map((prototypeId) => [
    prototypeId,
    corpus.filter((question) => question.prototypeId === prototypeId).length,
  ]),
);
for (const prototypeId of RNK_CP005_PROTOTYPE_IDS) {
  assert.equal(prototypeCounts[prototypeId], 32, `${prototypeId} discovery count`);
}

const answerPositions = [0, 0, 0, 0];
const contexts = new Set<string>();
const fingerprints = new Set<string>();
const topologies = new Set<string>();
const bannedArrangementLanguage = /\b(sit|sitting|seat|seating|facing|neighbour|neighbor|adjacent|immediate left|immediate right|extreme left|extreme right)\b/i;

for (const question of corpus) {
  const state = buildRnkCp005PartialOrderState(question.seed);
  const replay = enumerateRnkCp005ValidOrders(state.entities, state.edges, state.fixedRanks);

  assert.ok(replay.length >= 2, `${question.discoveryId} must retain genuine uncertainty`);
  assert.equal(replay.length, question.validOrderCount, `${question.discoveryId} valid-order replay`);
  assert.equal(question.options.length, 4, `${question.discoveryId} option count`);
  assert.equal(
    question.options.filter((option) => option.truth).length,
    1,
    `${question.discoveryId} must have one true option`,
  );
  assert.equal(question.options[question.correctIndex]?.truth, true, `${question.discoveryId} correct replay`);
  assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3);
  answerPositions[question.correctIndex] += 1;

  assert.equal(question.lifecycle.permanentQlAllocated, false);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.questionBank, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);

  const learnerText = [
    question.instruction,
    ...question.clues,
    question.stem,
    ...question.options.map((option) => option.label),
    ...question.explanation,
  ].join(" ");
  assert.equal(
    bannedArrangementLanguage.test(learnerText),
    false,
    `${question.discoveryId} leaked arrangement language`,
  );
  assert.equal(/RNK-QL-0?36|permanent QL/i.test(learnerText), false);
  assert.ok(question.explanation.some((line) => line.includes("valid")));
  assert.ok(question.exampleValidOrders.length >= 2);

  contexts.add(question.context);
  topologies.add(state.topology);
  assert.equal(fingerprints.has(question.mathematicalFingerprint), false, `${question.discoveryId} duplicate fingerprint`);
  fingerprints.add(question.mathematicalFingerprint);
}

assert.deepEqual(answerPositions, [64, 64, 64, 64], "answer positions must be exactly balanced");
assert.deepEqual(
  [...contexts].sort(),
  ["EXAM_SCORE_ORDER", "INTERVIEW_SHORTLIST", "MERIT_LIST", "PERFORMANCE_REVIEW", "RACE_RESULT"].sort(),
);
assert.deepEqual(
  [...topologies].sort(),
  ["ANCHORED_PARTIAL", "BRANCHED", "DIAMOND", "TWO_CHAINS"].sort(),
);

const uncertaintyQuestions = corpus.filter(
  (question) => question.prototypeId === "PAIR_RELATION_CANNOT_BE_DETERMINED",
);
assert.ok(uncertaintyQuestions.every((question) => /cannot be determined/i.test(question.answer)));

const rankBoundQuestions = corpus.filter((question) =>
  ["MINIMUM_POSSIBLE_RANK", "MAXIMUM_POSSIBLE_RANK"].includes(question.prototypeId),
);
assert.ok(rankBoundQuestions.every((question) => /^\d+(st|nd|rd|th)$/.test(question.answer)));

console.log(
  JSON.stringify(
    {
      status: "PASS",
      discoveryVersion: RNK_CP005_PARTIAL_ORDER_DISCOVERY_VERSION,
      prototypes: prototypeCounts,
      questionsChecked: corpus.length,
      contexts: [...contexts],
      topologies: [...topologies],
      answerPositions,
      uniqueFingerprints: fingerprints.size,
      permanentQlAllocated: false,
    },
    null,
    2,
  ),
);
