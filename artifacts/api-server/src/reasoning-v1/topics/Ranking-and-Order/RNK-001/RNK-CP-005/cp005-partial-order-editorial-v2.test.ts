import assert from "node:assert/strict";

import {
  buildRnkCp005EditorialV2Corpus,
  RNK_CP005_AUTHORITY_CANDIDATE_IDS,
  RNK_CP005_EDITORIAL_V2_REJECTED_SOURCE_FORMS,
  RNK_CP005_EDITORIAL_V2_SOURCE_FORMS,
  RNK_CP005_PARTIAL_ORDER_EDITORIAL_V2_VERSION,
} from "./cp005-partial-order-editorial-v2";
import {
  buildRnkCp005PartialOrderState,
  enumerateRnkCp005ValidOrders,
} from "./cp005-partial-order-runtime";

const corpus = buildRnkCp005EditorialV2Corpus(24);
assert.equal(corpus.length, RNK_CP005_EDITORIAL_V2_SOURCE_FORMS.length * 24);
assert.equal(
  RNK_CP005_PARTIAL_ORDER_EDITORIAL_V2_VERSION,
  "RNK_CP005_PARTIAL_ORDER_EDITORIAL_V2",
);
assert.deepEqual(RNK_CP005_EDITORIAL_V2_REJECTED_SOURCE_FORMS, [
  "ORDER_UNIQUENESS_STATUS",
]);
assert.deepEqual(RNK_CP005_AUTHORITY_CANDIDATE_IDS, [
  "RELATION_TRUTH_STATUS",
  "RELATIVE_RANK_DETERMINACY",
  "POSSIBLE_RANK_BOUND",
  "EXACT_RANK_DETERMINACY",
]);

const answerPositions = [0, 0, 0, 0];
const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
const fingerprints = new Set<string>();
const sourceFormCounts = Object.fromEntries(
  RNK_CP005_EDITORIAL_V2_SOURCE_FORMS.map((prototypeId) => [prototypeId, 0]),
) as Record<string, number>;
const authorityCounts = Object.fromEntries(
  RNK_CP005_AUTHORITY_CANDIDATE_IDS.map((authorityId) => [authorityId, 0]),
) as Record<string, number>;
const bannedArrangementLanguage = /\b(sit|sitting|seat|seating|facing|neighbour|neighbor|adjacent|immediate left|immediate right|extreme left|extreme right)\b/i;
const ambiguousRankLanguage = /\b(lower merit rank|lower score rank|lower rank than)\b/i;
const leakedEnumerationCount = /\b\d+ valid ranking(?:s)?\b/i;

function relationFrequency(
  orders: readonly (readonly string[])[],
  first: string,
  second: string,
): number {
  return orders.filter((order) => order.indexOf(first) < order.indexOf(second)).length;
}

function relationClass(
  orders: readonly (readonly string[])[],
  first: string,
  second: string,
): "DEFINITE" | "VARIABLE" | "IMPOSSIBLE" {
  const frequency = relationFrequency(orders, first, second);
  if (frequency === 0) return "IMPOSSIBLE";
  if (frequency === orders.length) return "DEFINITE";
  return "VARIABLE";
}

function parseRelation(label: string): { first: string; second: string } | undefined {
  const match = label.match(/^(.+?) ranks above (.+?)\.$/i);
  if (!match) return undefined;
  return { first: match[1]!.trim(), second: match[2]!.trim() };
}

function mandatoryAbove(
  orders: readonly (readonly string[])[],
  entities: readonly string[],
  target: string,
): readonly string[] {
  return entities.filter(
    (entity) =>
      entity !== target && relationClass(orders, entity, target) === "DEFINITE",
  );
}

function mandatoryBelow(
  orders: readonly (readonly string[])[],
  entities: readonly string[],
  target: string,
): readonly string[] {
  return entities.filter(
    (entity) =>
      entity !== target && relationClass(orders, target, entity) === "DEFINITE",
  );
}

for (const question of corpus) {
  sourceFormCounts[question.prototypeId] += 1;
  authorityCounts[question.authorityCandidateId] += 1;
  difficultyCounts[question.difficulty] += 1;
  answerPositions[question.correctIndex] += 1;

  assert.equal(question.options.length, 4, `${question.discoveryId} option count`);
  assert.equal(
    question.options.filter((option) => option.truth).length,
    1,
    `${question.discoveryId} exactly one correct option`,
  );
  assert.equal(question.options[question.correctIndex]?.truth, true);
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
    ...question.options.map((option) => option.explanation),
  ].join(" ");
  assert.equal(bannedArrangementLanguage.test(learnerText), false);
  assert.equal(ambiguousRankLanguage.test(learnerText), false);
  assert.equal(leakedEnumerationCount.test(learnerText), false);
  assert.equal(/RNK-QL-0?36|permanent QL/i.test(learnerText), false);

  const state = buildRnkCp005PartialOrderState(question.seed);

  if (
    question.prototypeId === "DEFINITELY_TRUE_RELATION" ||
    question.prototypeId === "POSSIBLE_RELATION" ||
    question.prototypeId === "IMPOSSIBLE_RELATION"
  ) {
    const relations = question.options.map((option) => {
      const parsed = parseRelation(option.label);
      assert.ok(parsed, `${question.discoveryId} relation option format`);
      return parsed;
    });
    const orderedPairs = new Set(
      relations.map((relation) => `${relation.first}>${relation.second}`),
    );
    const unorderedPairs = new Set(
      relations.map((relation) =>
        [relation.first, relation.second].sort().join("|"),
      ),
    );
    const peopleCounts = new Map<string, number>();
    for (const relation of relations) {
      peopleCounts.set(
        relation.first,
        (peopleCounts.get(relation.first) ?? 0) + 1,
      );
      peopleCounts.set(
        relation.second,
        (peopleCounts.get(relation.second) ?? 0) + 1,
      );
    }
    assert.equal(orderedPairs.size, 4, `${question.discoveryId} distinct ordered pairs`);
    assert.equal(unorderedPairs.size, 4, `${question.discoveryId} distinct pair coverage`);
    assert.ok(peopleCounts.size >= 4, `${question.discoveryId} people coverage`);
    assert.ok(
      [...peopleCounts.values()].every((count) => count <= 2),
      `${question.discoveryId} one-person option fixation`,
    );

    const correct = relations[question.correctIndex]!;
    const fixedOnlyOrders = enumerateRnkCp005ValidOrders(
      state.entities,
      [],
      state.fixedRanks,
    );
    if (question.prototypeId === "DEFINITELY_TRUE_RELATION") {
      assert.equal(
        relationClass(state.validOrders, correct.first, correct.second),
        "DEFINITE",
      );
      assert.notEqual(
        relationClass(fixedOnlyOrders, correct.first, correct.second),
        "DEFINITE",
        `${question.discoveryId} anchor-only must-be-true conclusion`,
      );
      assert.equal(
        state.edges.some(
          (edge) =>
            edge.higher === correct.first && edge.lower === correct.second,
        ),
        false,
        `${question.discoveryId} repeated direct clue`,
      );
    } else if (question.prototypeId === "POSSIBLE_RELATION") {
      assert.equal(
        relationClass(state.validOrders, correct.first, correct.second),
        "VARIABLE",
      );
    } else {
      assert.equal(
        relationClass(state.validOrders, correct.first, correct.second),
        "IMPOSSIBLE",
      );
      assert.notEqual(
        relationClass(fixedOnlyOrders, correct.first, correct.second),
        "IMPOSSIBLE",
        `${question.discoveryId} anchor-only impossible conclusion`,
      );
      assert.equal(
        state.edges.some(
          (edge) =>
            edge.higher === correct.second && edge.lower === correct.first,
        ),
        false,
        `${question.discoveryId} merely reversed a direct clue`,
      );
    }
  }

  if (
    question.prototypeId === "MINIMUM_POSSIBLE_RANK" ||
    question.prototypeId === "MAXIMUM_POSSIBLE_RANK"
  ) {
    const target = question.stem.match(/possible rank of (.+?)\?$/i)?.[1];
    assert.ok(target, `${question.discoveryId} rank-bound target`);
    const compulsory =
      question.prototypeId === "MINIMUM_POSSIBLE_RANK"
        ? mandatoryAbove(state.validOrders, state.entities, target)
        : mandatoryBelow(state.validOrders, state.entities, target);
    assert.ok(
      compulsory.length >= 2,
      `${question.discoveryId} trivial rank-bound target`,
    );
    assert.equal(
      state.fixedRanks.some((item) => item.entity === target),
      false,
      `${question.discoveryId} fixed-rank target`,
    );
    for (const person of compulsory) {
      assert.ok(
        question.explanation.join(" ").includes(person),
        `${question.discoveryId} omitted compulsory person ${person}`,
      );
    }
    assert.ok(
      question.explanation.some((line) =>
        /cannot rank (?:higher|lower) than/i.test(line),
      ),
      `${question.discoveryId} missing bound impossibility proof`,
    );
    assert.ok(
      question.explanation.some((line) => /attainable/i.test(line)),
      `${question.discoveryId} missing bound witness proof`,
    );
  }

  if (question.prototypeId === "DEFINITE_RANK_OR_INDETERMINATE") {
    const target = question.stem.match(/rank of (.+?)\?$/i)?.[1];
    assert.ok(target);
    assert.equal(
      state.fixedRanks.some((item) => item.entity === target),
      false,
      `${question.discoveryId} fixed-rank exact target`,
    );
    const ranks = [
      ...new Set(
        state.validOrders.map((order) => order.indexOf(target) + 1),
      ),
    ];
    if (ranks.length === 1) {
      const above = mandatoryAbove(state.validOrders, state.entities, target);
      const below = mandatoryBelow(state.validOrders, state.entities, target);
      assert.ok(above.length >= 2 && below.length >= 2);
      assert.equal(above.length + below.length, state.entities.length - 1);
      for (const person of [...above, ...below]) {
        assert.ok(question.explanation.join(" ").includes(person));
      }
      assert.equal(/for example:/i.test(question.explanation.join(" ")), false);
    } else {
      assert.ok(question.explanation.length >= 3);
      assert.ok(/cannot be determined uniquely/i.test(question.answer));
    }
  }

  assert.equal(fingerprints.has(question.mathematicalFingerprint), false);
  fingerprints.add(question.mathematicalFingerprint);
}

for (const prototypeId of RNK_CP005_EDITORIAL_V2_SOURCE_FORMS) {
  assert.equal(sourceFormCounts[prototypeId], 24);
}
assert.deepEqual(authorityCounts, {
  RELATION_TRUTH_STATUS: 72,
  RELATIVE_RANK_DETERMINACY: 24,
  POSSIBLE_RANK_BOUND: 48,
  EXACT_RANK_DETERMINACY: 24,
});
assert.deepEqual(answerPositions, [42, 42, 42, 42]);
assert.equal(fingerprints.size, corpus.length);
assert.ok(difficultyCounts.EASY > 0, "V2 should contain genuine easy questions");
assert.ok(difficultyCounts.MEDIUM > 0, "V2 should contain medium questions");
assert.ok(difficultyCounts.HARD > 0, "V2 should contain hard questions");
assert.ok(
  difficultyCounts.HARD < corpus.length * 0.7,
  "V2 difficulty must not be predominantly inflated to Hard",
);

const exactRankQuestions = corpus.filter(
  (question) => question.prototypeId === "DEFINITE_RANK_OR_INDETERMINATE",
);
assert.equal(
  exactRankQuestions.filter((question) =>
    /cannot be determined uniquely/i.test(question.answer),
  ).length,
  12,
);
assert.equal(
  exactRankQuestions.filter((question) =>
    !/cannot be determined uniquely/i.test(question.answer),
  ).length,
  12,
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      editorialVersion: RNK_CP005_PARTIAL_ORDER_EDITORIAL_V2_VERSION,
      sourceForms: sourceFormCounts,
      authorityCandidates: authorityCounts,
      questionsChecked: corpus.length,
      answerPositions,
      difficultyCounts,
      uniqueFingerprints: fingerprints.size,
      onePersonOptionFixationAllowed: false,
      permanentQlAllocated: false,
    },
    null,
    2,
  ),
);
