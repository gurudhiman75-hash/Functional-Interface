import assert from "node:assert/strict";

import {
  RNK_CP008_LIFECYCLE,
  RNK_CP008_NEXT_AVAILABLE_QL,
  RNK_CP008_PERMANENT_QLS_ALLOCATED,
  adaptRnkCp007DerivedOrderToExistingQl,
  buildRnkCp008Q27Q28CanonicalState,
  classifyRnkCp008NumericSourceSurface,
  generateRnkCp008SharedCaselet,
  solveRnkCp008CaseletOrders,
  solveRnkCp008NumericValueConstrainedOrder,
} from "./cp008-adapter-caselet-closure-v1";
import {
  generateRnkCp008RelationalSideCountQuestionV1_1,
  routeRnkCp008NumericConstraintRankQueryV1_1,
} from "./cp008-adapter-caselet-closure-v1_1";

assert.equal(RNK_CP008_PERMANENT_QLS_ALLOCATED, 0);
assert.equal(RNK_CP008_NEXT_AVAILABLE_QL, "RNK-QL-043");
assert.equal(RNK_CP008_LIFECYCLE.questionStudio, "DISABLED");
assert.equal(RNK_CP008_LIFECYCLE.persistence, "DISABLED");
assert.equal(RNK_CP008_LIFECYCLE.publiclyPublishable, false);

// Q27-Q28: exact source reconstruction is a unique bounded numeric model.
const q27q28 = solveRnkCp008NumericValueConstrainedOrder(
  buildRnkCp008Q27Q28CanonicalState(),
);
assert.equal(q27q28.assignments.length, 1);
assert.deepEqual(q27q28.assignments[0], {
  A: 22,
  B: 20,
  C: 21,
  D: 18,
  E: 17,
  F: 19,
});
assert.equal(q27q28.uniqueOrdersFromHighest.length, 1);
assert.deepEqual(q27q28.uniqueOrdersFromHighest[0], ["A", "C", "B", "F", "D", "E"]);
assert.equal(
  routeRnkCp008NumericConstraintRankQueryV1_1(q27q28, { kind: "COMPLETE_ORDER" }).mappedQlId,
  "RNK-QL-030",
);
assert.equal(
  routeRnkCp008NumericConstraintRankQueryV1_1(q27q28, { kind: "ENTITY_AT_POSITION", rankFromTop: 4 }).answer,
  "F",
);
assert.equal(
  routeRnkCp008NumericConstraintRankQueryV1_1(q27q28, { kind: "RANK_OF_ENTITY", entity: "F" }).answer,
  4,
);
assert.equal(
  classifyRnkCp008NumericSourceSurface("EXACT_ENTITY_VALUE").disposition,
  "REDIRECT_MIXED_NUMERIC_CONSTRAINT",
);
assert.equal(
  classifyRnkCp008NumericSourceSurface("VALID_ORDER_COUNT").disposition,
  "REDIRECT_MIXED_NUMERIC_CONSTRAINT",
);

// Multi-order numeric states keep pair-truth ownership in QL036, not QL038.
const ambiguousNumeric = solveRnkCp008NumericValueConstrainedOrder({
  entities: ["A", "B", "C"],
  minValue: 1,
  maxValue: 3,
  higherValueMeansHigherRank: true,
  constraints: [{ kind: "GREATER_THAN", left: "A", right: "B" }],
});
assert.ok(ambiguousNumeric.uniqueOrdersFromHighest.length > 1);
const invariantPair = routeRnkCp008NumericConstraintRankQueryV1_1(
  ambiguousNumeric,
  { kind: "RELATIVE_ORDER", first: "A", second: "B" },
);
assert.equal(invariantPair.mappedQlId, "RNK-QL-036");
assert.equal(invariantPair.answer, "FIRST_ABOVE");

// Q66 family: learner-visible total makes the algebraic preprocessing sufficient.
for (let seed = 0; seed < 96; seed += 1) {
  const question = generateRnkCp008RelationalSideCountQuestionV1_1(seed);
  const s = question.normalizedState;
  assert.ok(question.stem.includes(`queue of ${s.total} people`));
  assert.equal(s.sourceFront, s.multiplier * s.sourceBehind);
  assert.equal(s.total, s.sourceFront + s.sourceBehind + 1);
  assert.equal(s.targetFront, s.sourceBehind);
  assert.equal(question.answer, s.total - s.targetFront - 1);
  assert.equal(question.mappedQlId, "RNK-QL-004");
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.answer);
}

// Q35 / Q68 discovery is explicitly adapter-owned by frozen authorities.
assert.equal(adaptRnkCp007DerivedOrderToExistingQl("HIGHEST_BALANCE", 17).mappedQlId, "RNK-QL-027");
assert.equal(adaptRnkCp007DerivedOrderToExistingQl("LOWEST_BALANCE", 19).mappedQlId, "RNK-QL-027");
assert.equal(adaptRnkCp007DerivedOrderToExistingQl("SECOND_HIGHEST_BALANCE", 23).mappedQlId, "RNK-QL-028");
assert.equal(adaptRnkCp007DerivedOrderToExistingQl("TRUE_FINAL_RELATION", 29).mappedQlId, "RNK-QL-034");
assert.equal(adaptRnkCp007DerivedOrderToExistingQl("SECOND_FROM_BOTTOM", 31).mappedQlId, "RNK-QL-038");
assert.equal(adaptRnkCp007DerivedOrderToExistingQl("FOURTH_FROM_TOP", 37).mappedQlId, "RNK-QL-038");

// Shared passages are delivery infrastructure: each child retains existing QL ownership.
const allowedCaseletQls = new Set(["RNK-QL-027", "RNK-QL-028", "RNK-QL-031", "RNK-QL-033"]);
for (let seed = 0; seed < 64; seed += 1) {
  const caselet = generateRnkCp008SharedCaselet(seed);
  const solved = solveRnkCp008CaseletOrders(caselet.entities, caselet.clues);
  assert.equal(solved.length, 1);
  assert.deepEqual(solved[0], caselet.hiddenOrder);
  assert.equal(caselet.permanentQlAllocated, false);
  assert.equal(caselet.children.length, 4);
  for (const child of caselet.children) {
    assert.ok(allowedCaseletQls.has(child.mappedQlId));
    assert.equal(new Set(child.options).size, 4);
    assert.equal(child.options[child.correctIndex], child.answer);
  }
}

console.log(JSON.stringify({
  status: "PASS",
  checkpoint: "RNK-CP-008",
  permanentQlsAllocated: RNK_CP008_PERMANENT_QLS_ALLOCATED,
  nextAvailableQl: RNK_CP008_NEXT_AVAILABLE_QL,
  q27q28Assignments: q27q28.assignments.length,
  ambiguousNumericOrders: ambiguousNumeric.uniqueOrdersFromHighest.length,
  ambiguousPairMappedQl: invariantPair.mappedQlId,
  relationalSideCountSeeds: 96,
  sharedCaseletSeeds: 64,
  questionStudio: RNK_CP008_LIFECYCLE.questionStudio,
  publicPublication: RNK_CP008_LIFECYCLE.publiclyPublishable,
}, null, 2));
