import assert from "node:assert/strict";
import {
  adaptRnkCp007DerivedOrderToExistingQl,
  buildRnkCp008Q27Q28CanonicalState,
  classifyRnkCp008NumericSourceSurface,
  generateRnkCp008RelationalSideCountQuestionV1_1,
  generateRnkCp008SharedCaselet,
  routeRnkCp008NumericConstraintRankQuery,
  solveRnkCp008CaseletOrders,
  solveRnkCp008NumericValueConstrainedOrder,
} from "./cp008-adapter-caselet-closure-v1-1";

const q27q28 = solveRnkCp008NumericValueConstrainedOrder(buildRnkCp008Q27Q28CanonicalState());
assert.equal(q27q28.assignments.length, 1);
assert.deepEqual(q27q28.assignments[0], { A: 22, B: 20, C: 21, D: 18, E: 17, F: 19 });
assert.equal(q27q28.uniqueOrdersFromHighest.length, 1);
assert.deepEqual(routeRnkCp008NumericConstraintRankQuery(q27q28, { kind: "COMPLETE_ORDER" }).mappedQlId, "RNK-QL-030");
assert.equal(classifyRnkCp008NumericSourceSurface("EXACT_ENTITY_VALUE").permanentQlAllocated, false);
assert.equal(classifyRnkCp008NumericSourceSurface("VALID_ORDER_COUNT").permanentQlAllocated, false);

for (let seed = 0; seed < 64; seed += 1) {
  const q66 = generateRnkCp008RelationalSideCountQuestionV1_1(seed);
  assert.equal(q66.mappedQlId, "RNK-QL-004");
  assert.ok(q66.stem.includes(`There are ${q66.normalizedState.total} people`));
  assert.equal(q66.options[q66.correctIndex], q66.answer);
  assert.equal(new Set(q66.options).size, 4);

  const caselet = generateRnkCp008SharedCaselet(seed);
  const orders = solveRnkCp008CaseletOrders(caselet.entities, caselet.clues);
  assert.equal(orders.length, 1);
  assert.deepEqual(orders[0], caselet.hiddenOrder);
  assert.deepEqual(caselet.children.map((child) => child.mappedQlId), [
    "RNK-QL-027", "RNK-QL-028", "RNK-QL-031", "RNK-QL-033",
  ]);
  for (const child of caselet.children) {
    assert.equal(child.options[child.correctIndex], child.answer);
    assert.equal(new Set(child.options).size, 4);
  }
}

assert.equal(adaptRnkCp007DerivedOrderToExistingQl("HIGHEST_BALANCE", 11).mappedQlId, "RNK-QL-027");
assert.equal(adaptRnkCp007DerivedOrderToExistingQl("SECOND_HIGHEST_BALANCE", 12).mappedQlId, "RNK-QL-028");
assert.equal(adaptRnkCp007DerivedOrderToExistingQl("TRUE_FINAL_RELATION", 13).mappedQlId, "RNK-QL-034");
assert.equal(adaptRnkCp007DerivedOrderToExistingQl("SECOND_FROM_BOTTOM", 14).mappedQlId, "RNK-QL-038");

console.log(JSON.stringify({
  status: "PASS",
  checkpoint: "RNK-CP-008",
  permanentQlsAllocated: 0,
  nextAvailableQl: "RNK-QL-043",
  q27q28NormalizedOrders: q27q28.uniqueOrdersFromHighest.length,
  q66Seeds: 64,
  sharedCaseletSeeds: 64,
}, null, 2));
