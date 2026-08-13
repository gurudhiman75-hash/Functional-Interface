import assert from "node:assert/strict";

import {
  generateRnkCp007DerivedQuantityQuestion,
  invariantScaledRankEntity,
  RNK_CP007_SCALED_MODES,
  RNK_CP007_TRANSFER_MODES,
  solveRnkCp007TransferState,
  type RnkCp007DerivedQuantityMode,
} from "./cp007-derived-quantity-discovery-v1";

const modes: readonly RnkCp007DerivedQuantityMode[] = [
  ...RNK_CP007_TRANSFER_MODES,
  ...RNK_CP007_SCALED_MODES,
];
const QUESTIONS_PER_MODE = 32;
const questions = modes.flatMap((mode) =>
  Array.from({ length: QUESTIONS_PER_MODE }, (_, seed) =>
    generateRnkCp007DerivedQuantityQuestion(mode, seed, (seed % 4) as 0 | 1 | 2 | 3),
  ),
);

assert.equal(questions.length, 256);
assert.equal(new Set(questions.map((question) => question.mathematicalFingerprint)).size, questions.length);
assert.equal(questions.some((question) => question.reviewMetadata.permanentQlAllocated), false);
assert.equal(questions.some((question) => question.reviewMetadata.quantDominant), false);
assert.equal(questions.some((question) => question.reviewMetadata.finalTask !== "ORDER_OR_RANK"), false);

const answerPositions = [0, 0, 0, 0];
const sourceCounts = new Map<string, number>();
const modeCounts = new Map<string, number>();
let partialOrderQuestions = 0;
let uniqueValueQuestions = 0;
let transferStatesWithRepeatedFinalBalance = 0;
let scaledStatesWithoutOrderVariation = 0;

for (const question of questions) {
  answerPositions[question.answerIndex] += 1;
  sourceCounts.set(question.sourceForm, (sourceCounts.get(question.sourceForm) ?? 0) + 1);
  modeCounts.set(question.mode, (modeCounts.get(question.mode) ?? 0) + 1);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.answerIndex], question.answer);
  assert.equal(/left|right|facing|clockwise|anticlockwise|seat/i.test(question.stem), false);

  if (question.sourceForm === "TRANSFER_BALANCE_ORDER") {
    const state = question.transferState!;
    const replay = solveRnkCp007TransferState(state.initialBalance, state.operations);
    assert.deepEqual(replay, state.finalBalances);
    assert.equal(replay.reduce((sum, value) => sum + value, 0), state.initialBalance * 4);
    if (new Set(replay).size !== 4) transferStatesWithRepeatedFinalBalance += 1;
    assert.equal(question.reviewMetadata.stateUniqueness, "UNIQUE_VALUES");
    assert.equal(question.reviewMetadata.arithmeticOperationCount, 3);
    uniqueValueQuestions += 1;
  } else {
    const state = question.scaledState!;
    const distinctWitnesses = new Set(state.witnessOrders.map((order) => order.join(">")));
    if (distinctWitnesses.size < 2) scaledStatesWithoutOrderVariation += 1;
    assert.ok(distinctWitnesses.size >= 2);
    for (const order of state.witnessOrders) assert.equal(new Set(order).size, 6);

    const requestedRank = question.mode === "HEAVIEST_OBJECT" ? 1
      : question.mode === "FOURTH_FROM_TOP" ? 4
      : question.mode === "SECOND_FROM_BOTTOM" ? 5
      : 6;
    assert.equal(invariantScaledRankEntity(state, requestedRank), question.answer);
    assert.equal(question.reviewMetadata.stateUniqueness, "PARTIAL_ORDER_WITH_QUERY_INVARIANT");
    assert.equal(question.reviewMetadata.arithmeticOperationCount, 5);
    partialOrderQuestions += 1;
  }
}

assert.deepEqual(answerPositions, [64, 64, 64, 64]);
assert.equal(sourceCounts.get("TRANSFER_BALANCE_ORDER"), 128);
assert.equal(sourceCounts.get("SCALED_OBJECT_ORDER"), 128);
for (const mode of modes) assert.equal(modeCounts.get(mode), QUESTIONS_PER_MODE);
assert.equal(transferStatesWithRepeatedFinalBalance, 0);
assert.equal(scaledStatesWithoutOrderVariation, 0);
assert.equal(uniqueValueQuestions, 128);
assert.equal(partialOrderQuestions, 128);

// Source-form contract replays.
const q35Replay = solveRnkCp007TransferState(100, [
  { from: 0, to: 1, amount: 20 },
  { from: 1, to: 2, amount: 10 },
  { from: 3, to: 2, amount: 30 },
]);
assert.deepEqual(q35Replay, [80, 110, 140, 70]);

// Q68 normalized coefficients: A=1, B=1.5, C=0.75, D=0.5,
// E>1.25 and H=2E. B/E may swap, but H, A, C, D keep invariant slots.
const q68Witness1 = [
  ["H", 2 * 1.3], ["B", 1.5], ["E", 1.3], ["A", 1], ["C", 0.75], ["D", 0.5],
].sort((x, y) => (y[1] as number) - (x[1] as number)).map(([id]) => id);
const q68Witness2 = [
  ["H", 2 * 1.8], ["B", 1.5], ["E", 1.8], ["A", 1], ["C", 0.75], ["D", 0.5],
].sort((x, y) => (y[1] as number) - (x[1] as number)).map(([id]) => id);
assert.deepEqual(q68Witness1, ["H", "B", "E", "A", "C", "D"]);
assert.deepEqual(q68Witness2, ["H", "E", "B", "A", "C", "D"]);
assert.equal(q68Witness1.at(-2), "C");
assert.equal(q68Witness2.at(-2), "C");

console.log(JSON.stringify({
  status: "PASS",
  prototype: "DERIVED_QUANTITY_ORDER",
  questionsChecked: questions.length,
  sourceForms: Object.fromEntries(sourceCounts),
  modeCounts: Object.fromEntries(modeCounts),
  answerPositions,
  uniqueFingerprints: new Set(questions.map((question) => question.mathematicalFingerprint)).size,
  uniqueValueQuestions,
  partialOrderWithInvariantQueryQuestions: partialOrderQuestions,
  sourceFixturesReplayed: ["Q35", "Q68"],
  permanentQlAllocated: false,
}, null, 2));
