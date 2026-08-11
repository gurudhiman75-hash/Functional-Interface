import assert from "node:assert/strict";

import {
  buildRnkCp005EditorialV3FinalCorpus,
  buildRnkCp005EditorialV3State,
  classifyRnkCp005EditorialV3Relation,
  RNK_CP005_EDITORIAL_V3_REJECTED_SOURCE_FORMS,
  RNK_CP005_EDITORIAL_V3_SOURCE_FORMS,
  RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_FINAL_VERSION,
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS,
  RNK_CP005_V3_TOPOLOGIES,
  shortestRnkCp005EditorialV3Path,
  type RnkCp005EditorialV3Question,
  type RnkCp005EditorialV3State,
} from "./cp005-partial-order-editorial-v3-final";
import { enumerateRnkCp005ValidOrders } from "./cp005-partial-order-runtime";

const corpus = buildRnkCp005EditorialV3FinalCorpus(24);
assert.equal(corpus.length, 168);
assert.equal(
  RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_FINAL_VERSION,
  "RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_FINAL",
);
assert.deepEqual(RNK_CP005_EDITORIAL_V3_REJECTED_SOURCE_FORMS, [
  "ORDER_UNIQUENESS_STATUS",
]);
assert.deepEqual(RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS, [
  "RELATION_TRUTH_STATUS",
  "POSSIBLE_RANK_BOUND",
  "EXACT_RANK_DETERMINACY",
]);

const answerPositions = [0, 0, 0, 0];
const sourceCounts = Object.fromEntries(
  RNK_CP005_EDITORIAL_V3_SOURCE_FORMS.map((sourceForm) => [sourceForm, 0]),
) as Record<string, number>;
const authorityCounts = Object.fromEntries(
  RNK_CP005_V3_AUTHORITY_CANDIDATE_IDS.map((authorityId) => [authorityId, 0]),
) as Record<string, number>;
const topologyCounts = Object.fromEntries(
  RNK_CP005_V3_TOPOLOGIES.map((topology) => [topology, 0]),
) as Record<string, number>;
const topologiesBySource = new Map<string, Set<string>>(
  RNK_CP005_EDITORIAL_V3_SOURCE_FORMS.map((sourceForm) => [
    sourceForm,
    new Set<string>(),
  ]),
);
const fingerprints = new Set<string>();
const pairModes = {
  FIRST_ABOVE: 0,
  SECOND_ABOVE: 0,
  INDETERMINATE: 0,
};
const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };

function parseRelationOption(label: string): { first: string; second: string } | undefined {
  const match = label.match(/^(.+?) ranks above (.+?)\.$/i);
  if (!match) return undefined;
  return { first: match[1]!.trim(), second: match[2]!.trim() };
}

function parsePairStem(stem: string): { first: string; second: string } | undefined {
  const match = stem.match(/relative ranks of (.+?) and (.+?)\?$/i);
  if (!match) return undefined;
  return { first: match[1]!.trim(), second: match[2]!.trim() };
}

function directEdge(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
): boolean {
  return state.edges.some(
    (edge) => edge.higher === first && edge.lower === second,
  );
}

function rankSet(
  state: RnkCp005EditorialV3State,
  entity: string,
): readonly number[] {
  return [...new Set(
    state.validOrders.map((order) => order.indexOf(entity) + 1),
  )].sort((a, b) => a - b);
}

function mandatoryAbove(
  state: RnkCp005EditorialV3State,
  entity: string,
): readonly string[] {
  return state.entities.filter(
    (other) =>
      other !== entity &&
      classifyRnkCp005EditorialV3Relation(state, other, entity) === "DEFINITE",
  );
}

function mandatoryBelow(
  state: RnkCp005EditorialV3State,
  entity: string,
): readonly string[] {
  return state.entities.filter(
    (other) =>
      other !== entity &&
      classifyRnkCp005EditorialV3Relation(state, entity, other) === "DEFINITE",
  );
}

function containsIncomparablePair(
  state: RnkCp005EditorialV3State,
  entities: readonly string[],
): boolean {
  for (let index = 0; index < entities.length; index += 1) {
    for (let other = index + 1; other < entities.length; other += 1) {
      if (
        classifyRnkCp005EditorialV3Relation(
          state,
          entities[index]!,
          entities[other]!,
        ) === "VARIABLE"
      ) {
        return true;
      }
    }
  }
  return false;
}

function validateGenericRelation(
  question: RnkCp005EditorialV3Question,
  state: RnkCp005EditorialV3State,
): void {
  const relations = question.options.map((option) => {
    const pair = parseRelationOption(option.label);
    assert.ok(pair);
    return {
      ...pair,
      truth: option.truth,
      classification: classifyRnkCp005EditorialV3Relation(
        state,
        pair.first,
        pair.second,
      ),
    };
  });

  assert.equal(
    new Set(relations.map((item) => `${item.first}>${item.second}`)).size,
    4,
  );
  assert.equal(
    new Set(relations.map((item) => [item.first, item.second].sort().join("|"))).size,
    4,
  );
  const personCounts = new Map<string, number>();
  for (const relation of relations) {
    for (const person of [relation.first, relation.second]) {
      personCounts.set(person, (personCounts.get(person) ?? 0) + 1);
    }
  }
  assert.ok(personCounts.size >= 4);
  assert.ok([...personCounts.values()].every((count) => count <= 2));

  const correct = relations.find((item) => item.truth)!;
  const wrong = relations.filter((item) => !item.truth);

  if (question.prototypeId === "DEFINITELY_TRUE_RELATION") {
    assert.equal(correct.classification, "DEFINITE");
    const path = shortestRnkCp005EditorialV3Path(
      state,
      correct.first,
      correct.second,
    );
    assert.ok(path && path.length >= 3);
    assert.equal(directEdge(state, correct.first, correct.second), false);
    assert.ok(wrong.filter((item) => item.classification === "VARIABLE").length >= 2);
  } else if (question.prototypeId === "POSSIBLE_RELATION") {
    assert.equal(correct.classification, "VARIABLE");
    for (const item of wrong) {
      assert.equal(item.classification, "IMPOSSIBLE");
      const reversePath = shortestRnkCp005EditorialV3Path(
        state,
        item.second,
        item.first,
      );
      assert.ok(reversePath && reversePath.length >= 3);
      assert.equal(directEdge(state, item.second, item.first), false);
    }
  } else {
    assert.equal(correct.classification, "IMPOSSIBLE");
    const reversePath = shortestRnkCp005EditorialV3Path(
      state,
      correct.second,
      correct.first,
    );
    assert.ok(reversePath && reversePath.length >= 3);
    assert.equal(directEdge(state, correct.second, correct.first), false);
    assert.ok(wrong.every((item) => item.classification === "VARIABLE"));
  }
}

function validatePairStatus(
  question: RnkCp005EditorialV3Question,
  state: RnkCp005EditorialV3State,
): void {
  const pair = parsePairStem(question.stem);
  assert.ok(pair);
  const mode = question.pairStatusMode;
  assert.ok(mode);
  pairModes[mode] += 1;
  const classification = classifyRnkCp005EditorialV3Relation(
    state,
    pair.first,
    pair.second,
  );

  if (mode === "FIRST_ABOVE") {
    assert.equal(classification, "DEFINITE");
    assert.equal(question.answer, `${pair.first} must rank above ${pair.second}`);
    const path = shortestRnkCp005EditorialV3Path(state, pair.first, pair.second);
    assert.ok(path && path.length >= 3);
    assert.equal(directEdge(state, pair.first, pair.second), false);
  } else if (mode === "SECOND_ABOVE") {
    assert.equal(classification, "IMPOSSIBLE");
    assert.equal(question.answer, `${pair.second} must rank above ${pair.first}`);
    const path = shortestRnkCp005EditorialV3Path(state, pair.second, pair.first);
    assert.ok(path && path.length >= 3);
    assert.equal(directEdge(state, pair.second, pair.first), false);
  } else {
    assert.equal(classification, "VARIABLE");
    assert.equal(question.answer, "Their relative ranks cannot be determined uniquely");
  }
}

function validateRankBound(
  question: RnkCp005EditorialV3Question,
  state: RnkCp005EditorialV3State,
): void {
  const match = question.stem.match(/possible rank of (.+?)\?$/i);
  assert.ok(match);
  const target = match[1]!.trim();
  const highest = question.prototypeId === "MINIMUM_POSSIBLE_RANK";
  const compulsory = highest
    ? mandatoryAbove(state, target)
    : mandatoryBelow(state, target);
  assert.ok(compulsory.length >= 3);
  assert.equal(containsIncomparablePair(state, compulsory), true);
  const ranks = rankSet(state, target);
  assert.ok(ranks.length >= 2);
  assert.equal(
    Number.parseInt(question.answer, 10),
    highest ? ranks[0] : ranks.at(-1),
  );
  assert.equal(/must all rank/i.test(question.explanation.join(" ")), false);
}

for (const question of corpus) {
  sourceCounts[question.prototypeId] += 1;
  authorityCounts[question.authorityCandidateId] += 1;
  topologyCounts[question.v3Topology] += 1;
  topologiesBySource.get(question.prototypeId)!.add(question.v3Topology);
  answerPositions[question.correctIndex] += 1;
  difficultyCounts[question.difficulty] += 1;

  assert.equal(question.options.length, 4);
  assert.equal(question.options.filter((option) => option.truth).length, 1);
  assert.equal(question.options[question.correctIndex]?.truth, true);
  assert.equal(question.lifecycle.permanentQlAllocated, false);
  assert.equal(question.lifecycle.questionStudio, "DISABLED");
  assert.equal(question.lifecycle.questionBank, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.ok(question.validOrderCount >= 2);

  const state = buildRnkCp005EditorialV3State(
    question.seed,
    question.v3Topology,
  );
  assert.ok(state);
  const replay = enumerateRnkCp005ValidOrders(state.entities, state.edges, []);
  assert.deepEqual(replay, state.validOrders);
  assert.equal(replay.length, question.validOrderCount);

  const learnerText = [
    question.instruction,
    ...question.clues,
    question.stem,
    ...question.options.map((option) => option.label),
    ...question.explanation,
  ].join(" ");
  assert.equal(
    /\b(sit|sitting|seat|seating|facing|neighbour|neighbor|adjacent|immediate left|immediate right|extreme left|extreme right)\b/i.test(learnerText),
    false,
  );
  assert.equal(/lower merit rank|lower score rank/i.test(learnerText), false);
  assert.equal(/valid ranking\(s\)|\d+ of \d+ valid rankings/i.test(learnerText), false);
  assert.equal(/RNK-QL-0?36|permanent QL/i.test(learnerText), false);

  if (
    question.prototypeId === "DEFINITELY_TRUE_RELATION" ||
    question.prototypeId === "POSSIBLE_RELATION" ||
    question.prototypeId === "IMPOSSIBLE_RELATION"
  ) {
    validateGenericRelation(question, state);
  } else if (question.prototypeId === "PAIR_RELATION_CANNOT_BE_DETERMINED") {
    validatePairStatus(question, state);
  } else if (
    question.prototypeId === "MINIMUM_POSSIBLE_RANK" ||
    question.prototypeId === "MAXIMUM_POSSIBLE_RANK"
  ) {
    validateRankBound(question, state);
  }

  assert.equal(fingerprints.has(question.mathematicalFingerprint), false);
  fingerprints.add(question.mathematicalFingerprint);
}

for (const sourceForm of RNK_CP005_EDITORIAL_V3_SOURCE_FORMS) {
  assert.equal(sourceCounts[sourceForm], 24);
  assert.ok(
    topologiesBySource.get(sourceForm)!.size >= 5,
    `${sourceForm} must span at least five V3 topologies`,
  );
}
assert.deepEqual(answerPositions, [42, 42, 42, 42]);
assert.deepEqual(authorityCounts, {
  RELATION_TRUTH_STATUS: 96,
  POSSIBLE_RANK_BOUND: 48,
  EXACT_RANK_DETERMINACY: 24,
});
assert.deepEqual(pairModes, {
  FIRST_ABOVE: 8,
  SECOND_ABOVE: 8,
  INDETERMINATE: 8,
});
assert.equal(Object.values(topologyCounts).every((count) => count > 0), true);
assert.equal(fingerprints.size, 168);

const exactQuestions = corpus.filter(
  (question) => question.prototypeId === "DEFINITE_RANK_OR_INDETERMINATE",
);
assert.equal(
  exactQuestions.filter((question) => /cannot be determined/i.test(question.answer)).length,
  12,
);
assert.equal(
  exactQuestions.filter((question) => !/cannot be determined/i.test(question.answer)).length,
  12,
);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      editorialVersion: RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_FINAL_VERSION,
      sourceForms: sourceCounts,
      authorityCandidates: authorityCounts,
      questionsChecked: corpus.length,
      answerPositions,
      difficultyCounts,
      topologyCounts,
      distinctTopologiesPerSource: Object.fromEntries(
        [...topologiesBySource.entries()].map(([sourceForm, topologies]) => [
          sourceForm,
          topologies.size,
        ]),
      ),
      pairStatusModes: pairModes,
      semanticDistractorContract: {
        mustWrongOptions: "at least two possible-but-not-definite",
        couldWrongOptions: "three inferred-impossible; no direct clue reversal",
        cannotWrongOptions: "three possible-but-not-definite",
      },
      permanentQlAllocated: false,
    },
    null,
    2,
  ),
);
