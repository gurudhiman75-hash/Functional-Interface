import assert from "node:assert/strict";

import {
  buildRnkCp005EditorialV3ReleaseCorpus,
  buildRnkCp005EditorialV3State,
  classifyRnkCp005EditorialV3Relation,
  RNK_CP005_EDITORIAL_V3_SOURCE_FORMS,
  RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_RELEASE_VERSION,
  RNK_CP005_V3_TOPOLOGIES,
  shortestRnkCp005EditorialV3Path,
  type RnkCp005EditorialV3Question,
  type RnkCp005EditorialV3State,
} from "./cp005-partial-order-editorial-v3-release";
import { enumerateRnkCp005ValidOrders } from "./cp005-partial-order-runtime";

const corpus = buildRnkCp005EditorialV3ReleaseCorpus(24);
assert.equal(corpus.length, 168);
assert.equal(
  RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_RELEASE_VERSION,
  "RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_RELEASE",
);

const answerPositions = [0, 0, 0, 0];
const sourceCounts = Object.fromEntries(
  RNK_CP005_EDITORIAL_V3_SOURCE_FORMS.map((id) => [id, 0]),
) as Record<string, number>;
const authorityCounts = {
  RELATION_TRUTH_STATUS: 0,
  POSSIBLE_RANK_BOUND: 0,
  EXACT_RANK_DETERMINACY: 0,
};
const topologyCounts = Object.fromEntries(
  RNK_CP005_V3_TOPOLOGIES.map((id) => [id, 0]),
) as Record<string, number>;
const topologiesBySource = new Map<string, Set<string>>(
  RNK_CP005_EDITORIAL_V3_SOURCE_FORMS.map((id) => [id, new Set<string>()]),
);
const pairModes = { FIRST_ABOVE: 0, SECOND_ABOVE: 0, INDETERMINATE: 0 };
const pairGapKinds = new Set<string>();
const fingerprints = new Set<string>();
const seeds = new Set<string>();
const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };

function directEdge(
  state: RnkCp005EditorialV3State,
  first: string,
  second: string,
): boolean {
  return state.edges.some(
    (edge) => edge.higher === first && edge.lower === second,
  );
}

function parseRelation(label: string): { first: string; second: string } | undefined {
  const match = label.match(/^(.+?) ranks above (.+?)\.$/i);
  return match
    ? { first: match[1]!.trim(), second: match[2]!.trim() }
    : undefined;
}

function parsePairStem(stem: string): { first: string; second: string } | undefined {
  const match = stem.match(/relative ranks of (.+?) and (.+?)\?$/i);
  return match
    ? { first: match[1]!.trim(), second: match[2]!.trim() }
    : undefined;
}

function parseTarget(stem: string): string | undefined {
  return stem.match(/(?:possible rank of|rank of) (.+?)\?$/i)?.[1]?.trim();
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

function containsVariablePair(
  state: RnkCp005EditorialV3State,
  names: readonly string[],
): boolean {
  for (let i = 0; i < names.length; i += 1) {
    for (let j = i + 1; j < names.length; j += 1) {
      if (
        classifyRnkCp005EditorialV3Relation(state, names[i]!, names[j]!) ===
        "VARIABLE"
      ) {
        return true;
      }
    }
  }
  return false;
}

function hasDerivedCompulsory(
  state: RnkCp005EditorialV3State,
  target: string,
  direction: "ABOVE" | "BELOW" | "EITHER",
): boolean {
  return state.entities.some((other) => {
    if (other === target) return false;
    const above =
      classifyRnkCp005EditorialV3Relation(state, other, target) === "DEFINITE" &&
      !directEdge(state, other, target);
    const below =
      classifyRnkCp005EditorialV3Relation(state, target, other) === "DEFINITE" &&
      !directEdge(state, target, other);
    if (direction === "ABOVE") return above;
    if (direction === "BELOW") return below;
    return above || below;
  });
}

function validateGenericRelation(
  question: RnkCp005EditorialV3Question,
  state: RnkCp005EditorialV3State,
): void {
  const parsed = question.options.map((option) => {
    const pair = parseRelation(option.label);
    assert.ok(pair, `${question.discoveryId}: relation option did not parse`);
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

  assert.equal(new Set(parsed.map((x) => `${x.first}>${x.second}`)).size, 4);
  assert.equal(
    new Set(parsed.map((x) => [x.first, x.second].sort().join("|"))).size,
    4,
  );
  const personCounts = new Map<string, number>();
  for (const relation of parsed) {
    for (const person of [relation.first, relation.second]) {
      personCounts.set(person, (personCounts.get(person) ?? 0) + 1);
    }
  }
  assert.ok(personCounts.size >= 4);
  assert.ok([...personCounts.values()].every((count) => count <= 2));

  const correct = parsed.find((item) => item.truth)!;
  const wrong = parsed.filter((item) => !item.truth);
  if (question.prototypeId === "DEFINITELY_TRUE_RELATION") {
    assert.equal(correct.classification, "DEFINITE");
    const path = shortestRnkCp005EditorialV3Path(state, correct.first, correct.second);
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
  } else if (mode === "SECOND_ABOVE") {
    assert.equal(classification, "IMPOSSIBLE");
    assert.equal(question.answer, `${pair.second} must rank above ${pair.first}`);
  } else {
    assert.equal(classification, "VARIABLE");
    assert.equal(question.answer, "Their relative ranks cannot be determined uniquely");
  }

  const gap = question.options.find((option) =>
    /must be consecutive|Exactly \d+ (?:person|people) must be ranked between/i.test(
      option.label,
    ),
  );
  assert.ok(gap);
  assert.equal(gap.truth, false);
  if (/consecutive/i.test(gap.label)) pairGapKinds.add("CONSECUTIVE");
  else if (/Exactly 1 person/i.test(gap.label)) pairGapKinds.add("ONE_BETWEEN");
  else if (/Exactly 2 people/i.test(gap.label)) pairGapKinds.add("TWO_BETWEEN");
  else pairGapKinds.add("THREE_BETWEEN");
}

function validateRankBound(
  question: RnkCp005EditorialV3Question,
  state: RnkCp005EditorialV3State,
): void {
  const target = parseTarget(question.stem);
  assert.ok(target);
  const highest = question.prototypeId === "MINIMUM_POSSIBLE_RANK";
  const compulsory = highest
    ? mandatoryAbove(state, target)
    : mandatoryBelow(state, target);
  assert.ok(compulsory.length >= 3);
  assert.equal(containsVariablePair(state, compulsory), true);
  assert.equal(
    hasDerivedCompulsory(state, target, highest ? "ABOVE" : "BELOW"),
    true,
    `${question.discoveryId}: boundary still reducible to direct-neighbour counting`,
  );
  const ranks = rankSet(state, target);
  assert.ok(ranks.length >= 2);
  assert.equal(
    Number.parseInt(question.answer, 10),
    highest ? ranks[0] : ranks.at(-1),
  );
  assert.match(question.explanation.at(-1) ?? "", /attainable/i);
}

function validateExactRank(
  question: RnkCp005EditorialV3Question,
  state: RnkCp005EditorialV3State,
): void {
  if (/cannot be determined/i.test(question.answer)) return;
  const target = parseTarget(question.stem);
  assert.ok(target);
  assert.equal(
    hasDerivedCompulsory(state, target, "EITHER"),
    true,
    `${question.discoveryId}: definite exact rank uses direct comparisons only`,
  );
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

  const state = buildRnkCp005EditorialV3State(question.seed, question.v3Topology);
  assert.ok(state);
  const replay = enumerateRnkCp005ValidOrders(state.entities, state.edges, []);
  assert.deepEqual(replay, state.validOrders);
  assert.equal(replay.length, question.validOrderCount);
  assert.ok(replay.length >= 2);

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
  } else {
    validateExactRank(question, state);
  }

  const seedKey = `${question.prototypeId}:${question.seed}:${question.v3Topology}`;
  assert.equal(seeds.has(seedKey), false, `${question.discoveryId}: duplicate release state`);
  seeds.add(seedKey);
  assert.equal(fingerprints.has(question.mathematicalFingerprint), false);
  fingerprints.add(question.mathematicalFingerprint);
}

for (const source of RNK_CP005_EDITORIAL_V3_SOURCE_FORMS) {
  assert.equal(sourceCounts[source], 24);
  assert.ok(topologiesBySource.get(source)!.size >= 5);
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
assert.ok(pairGapKinds.size >= 3);
assert.equal(Object.values(topologyCounts).every((count) => count > 0), true);
assert.equal(fingerprints.size, 168);
assert.equal(seeds.size, 168);

const exact = corpus.filter(
  (question) => question.prototypeId === "DEFINITE_RANK_OR_INDETERMINATE",
);
assert.equal(exact.filter((question) => /cannot be determined/i.test(question.answer)).length, 12);
assert.equal(exact.filter((question) => !/cannot be determined/i.test(question.answer)).length, 12);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      editorialVersion: RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_RELEASE_VERSION,
      sourceForms: sourceCounts,
      authorityCandidates: authorityCounts,
      questionsChecked: corpus.length,
      answerPositions,
      difficultyCounts,
      topologyCounts,
      distinctTopologiesPerSource: Object.fromEntries(
        [...topologiesBySource.entries()].map(([source, set]) => [source, set.size]),
      ),
      pairStatusModes: pairModes,
      pairGapDistractorKinds: [...pairGapKinds],
      rankBoundRequiresDerivedCompulsoryRelation: true,
      definiteExactRankRequiresDerivedCompulsoryRelation: true,
      uniqueReleaseStates: seeds.size,
      permanentQlAllocated: false,
    },
    null,
    2,
  ),
);
