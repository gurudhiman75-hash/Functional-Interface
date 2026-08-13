import assert from "node:assert/strict";

import {
  generateRnkCp007DerivedQuantityQuestion,
  RNK_CP007_SCALED_MODES,
  type RnkCp007ScaledMode,
} from "./cp007-derived-quantity-discovery-v1";
import {
  exactRankSet,
  invariantEntityAtRank,
  inverseExactRankContractHolds,
  RNK_CP007_PARTIAL_ORDER_POSITION_ADAPTER_VERSION,
} from "./cp007-partial-order-position-adapter-v1";

function requestedRank(mode: RnkCp007ScaledMode): number {
  if (mode === "HEAVIEST_OBJECT") return 1;
  if (mode === "FOURTH_FROM_TOP") return 4;
  if (mode === "SECOND_FROM_BOTTOM") return 5;
  return 6;
}

let questionsChecked = 0;
let inverseContractsChecked = 0;
const modeCounts = new Map<string, number>();

for (const mode of RNK_CP007_SCALED_MODES) {
  for (let seed = 0; seed < 32; seed += 1) {
    const question = generateRnkCp007DerivedQuantityQuestion(mode, seed, (seed % 4) as 0 | 1 | 2 | 3);
    assert.equal(question.sourceForm, "SCALED_OBJECT_ORDER");
    const state = question.scaledState!;
    assert.ok(state.witnessOrders.length >= 2);
    assert.ok(new Set(state.witnessOrders.map((order) => order.join(">"))).size >= 2);

    const rank = requestedRank(mode);
    const occupant = invariantEntityAtRank(state.witnessOrders, rank);
    assert.equal(occupant, question.answer);
    assert.deepEqual(exactRankSet(state.witnessOrders, question.answer), [rank]);
    assert.equal(inverseExactRankContractHolds(state.witnessOrders, rank, question.answer), true);

    modeCounts.set(mode, (modeCounts.get(mode) ?? 0) + 1);
    questionsChecked += 1;
    inverseContractsChecked += 1;
  }
}

// Source Q68 witness orders from Aggarwal / SSC MTS 2021.
// H > K > J > F > G > L OR H > J > K > F > G > L.
// G is invariant at rank 5 (second from the bottom) although J/K may swap.
const q68Orders = [
  ["H", "K", "J", "F", "G", "L"],
  ["H", "J", "K", "F", "G", "L"],
] as const;
assert.equal(invariantEntityAtRank(q68Orders, 5), "G");
assert.deepEqual(exactRankSet(q68Orders, "G"), [5]);
assert.equal(inverseExactRankContractHolds(q68Orders, 5, "G"), true);

console.log(JSON.stringify({
  status: "PASS",
  adapterVersion: RNK_CP007_PARTIAL_ORDER_POSITION_ADAPTER_VERSION,
  questionsChecked,
  inverseContractsChecked,
  modeCounts: Object.fromEntries(modeCounts),
  sourceFixture: "Aggarwal Q68 / SSC MTS 2021",
  ownershipConclusion: "RNK-QL-038_INVERSE_PRESENTATION_EXTENSION",
  newQlRequiredForDerivedQuantity: false,
}, null, 2));
