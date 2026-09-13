import assert from "node:assert/strict";
import { generateCaeReviewedQuestion } from "./reviewed-generator.ts";

const QL = "CAE-QL-008" as const;
const LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const;
const SEED_COUNT = 240;

const operations = new Set<string>();
const causalStates = new Set<string>();
const difficulties = new Set<string>();

for (let seed = 1; seed <= SEED_COUNT; seed += 1) {
  const english = generateCaeReviewedQuestion({ qlId: QL, seed, locale: "en-IN" });
  const optionTexts = english.options.map((option) => option.text.trim());

  assert.equal(english.options.length, 4, `CP008 seed ${seed}: expected four options`);
  assert.equal(new Set(optionTexts).size, 4, `CP008 seed ${seed}: duplicate option text`);
  assert.ok(english.stem.trim().length > 0, `CP008 seed ${seed}: empty stem`);
  assert.ok(english.explanation.trim().length > 0, `CP008 seed ${seed}: empty explanation`);
  assert.ok(english.causalStateId, `CP008 seed ${seed}: missing causalStateId`);
  assert.ok(english.itemVariantId, `CP008 seed ${seed}: missing itemVariantId`);
  assert.ok(english.answerId, `CP008 seed ${seed}: missing answerId`);

  const correct = english.options.filter((option) => option.id === english.answerId);
  assert.equal(correct.length, 1, `CP008 seed ${seed}: expected exactly one keyed answer`);

  const operation = english.reviewTrace?.learnerOperation ?? english.reviewTrace?.operation;
  assert.ok(operation, `CP008 seed ${seed}: missing learner operation trace`);
  operations.add(String(operation));
  causalStates.add(english.causalStateId);
  difficulties.add(english.difficulty);

  for (const locale of LOCALES.slice(1)) {
    const localized = generateCaeReviewedQuestion({ qlId: QL, seed, locale });
    assert.equal(localized.causalStateId, english.causalStateId, `CP008 seed ${seed} ${locale}: causal state drift`);
    assert.equal(localized.answerId, english.answerId, `CP008 seed ${seed} ${locale}: answer drift`);
    assert.equal(localized.answerIndex, english.answerIndex, `CP008 seed ${seed} ${locale}: answer position drift`);
    assert.equal(localized.difficulty, english.difficulty, `CP008 seed ${seed} ${locale}: difficulty drift`);
    assert.deepEqual(localized.options.map((option) => option.id), english.options.map((option) => option.id), `CP008 seed ${seed} ${locale}: semantic option-order drift`);
  }
}

const expectedOperations = new Set([
  "CAUSAL_SEQUENCE",
  "IMMEDIATE_CAUSE",
  "IMMEDIATE_EFFECT",
  "ROOT_CAUSE",
  "REMOTE_EFFECT",
  "BRIDGE_ROLE",
  "INCORRECT_CAUSAL_LINK",
]);

for (const operation of expectedOperations) {
  assert.ok(operations.has(operation), `CP008: learner operation ${operation} was unreachable across ${SEED_COUNT} seeds`);
}
assert.ok(causalStates.size >= 12, `CP008: expected at least 12 causal states, got ${causalStates.size}`);
assert.ok(difficulties.has("MEDIUM"), "CP008: MEDIUM difficulty was unreachable");
assert.ok(difficulties.has("HARD"), "CP008: HARD difficulty was unreachable");

console.log("PASS_CAE_CP008_REVIEWED", {
  seeds: SEED_COUNT,
  operations: [...operations].sort(),
  causalStates: causalStates.size,
  difficulties: [...difficulties].sort(),
});
