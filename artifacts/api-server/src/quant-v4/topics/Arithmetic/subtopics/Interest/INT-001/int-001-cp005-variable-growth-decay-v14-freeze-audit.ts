import assert from "node:assert/strict";
import {
  INT_CP005_V14_FREEZE_ID,
  generateIntCp005V14FrozenQuestion,
} from "./cp005-variable-growth-decay-v14-frozen";
import {
  INT_CP005_QL_IDS,
  INT_CP005_RUNTIME_VERSION_V14,
  generateIntCp005QuestionV14,
  verifyIntCp005Answer,
  type IntCp005Locale,
} from "./cp005-variable-growth-decay-runtime-v14";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
let questions = 0;
let learnerIdentityChecks = 0;
let mathematicalIdentityChecks = 0;
let optionIdentityChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let verifierChecks = 0;
let semanticChecks = 0;
let mutationGuards = 0;

function assertDeepFrozen(value: unknown, seen = new WeakSet<object>()): void {
  if (!value || typeof value !== "object") return;
  const objectValue = value as object;
  if (seen.has(objectValue)) return;
  seen.add(objectValue);
  assert(Object.isFrozen(objectValue), "freeze audit found a mutable object");
  deepFreezeChecks += 1;
  for (const key of Reflect.ownKeys(objectValue)) {
    assertDeepFrozen((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
}

assert.equal(INT_CP005_V14_FREEZE_ID, "INT-CP-005-EN-HI-PA-v14-frozen");
assert.equal(INT_CP005_RUNTIME_VERSION_V14, "INT-CP-005-VARIABLE-GROWTH-DECAY-v14");

for (const qlId of INT_CP005_QL_IDS) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp005-v14-freeze-${qlId}-${index}`;
    for (const locale of LOCALES) {
      const source = generateIntCp005QuestionV14(qlId, seed, locale);
      const frozen = generateIntCp005V14FrozenQuestion(qlId, seed, locale);
      questions += 1;

      assert.equal(frozen.freezeId, INT_CP005_V14_FREEZE_ID);
      assert.equal(frozen.runtimeVersion, source.runtimeVersion);
      assert.equal(frozen.seed, source.seed);
      assert.equal(frozen.locale, source.locale);
      assert.equal(frozen.language, source.language);
      assert.equal(frozen.qlId, source.qlId);
      learnerIdentityChecks += 6;

      assert.deepEqual(frozen.presentation, source.presentation, `${qlId}/${seed}/${locale}: presentation drift at freeze`);
      assert.deepEqual(frozen.options, source.options, `${qlId}/${seed}/${locale}: option learner surface drift at freeze`);
      assert.equal(frozen.correctAnswer, source.correctAnswer, `${qlId}/${seed}/${locale}: correctAnswer drift at freeze`);
      assert.deepEqual(frozen.explanation, source.explanation, `${qlId}/${seed}/${locale}: explanation drift at freeze`);
      assert.equal(frozen.answerSemantic, source.answerSemantic, `${qlId}/${seed}/${locale}: answer semantic drift at freeze`);
      learnerIdentityChecks += 5;

      assert.deepEqual(frozen.mathematicalState, source.mathematicalState, `${qlId}/${seed}/${locale}: mathematical state drift at freeze`);
      assert.equal(frozen.mathematicalFingerprint, source.mathematicalFingerprint, `${qlId}/${seed}/${locale}: mathematical fingerprint drift at freeze`);
      assert.deepEqual(frozen.solution, source.solution, `${qlId}/${seed}/${locale}: solution drift at freeze`);
      assert.equal(frozen.correctIndex, source.correctIndex, `${qlId}/${seed}/${locale}: correct index drift at freeze`);
      mathematicalIdentityChecks += 4;

      assert.equal(frozen.options.length, 4);
      frozen.options.forEach((option, optionIndex) => {
        const sourceOption = source.options[optionIndex]!;
        assert.deepEqual(option.value, sourceOption.value, `${qlId}/${seed}/${locale}: option value drift at ${optionIndex}`);
        assert.equal(option.misconceptionId, sourceOption.misconceptionId, `${qlId}/${seed}/${locale}: misconception drift at ${optionIndex}`);
        assert.equal(option.isCorrect, sourceOption.isCorrect, `${qlId}/${seed}/${locale}: correctness ownership drift at ${optionIndex}`);
        assert.equal(verifyIntCp005Answer(frozen.mathematicalState, option.value), optionIndex === frozen.correctIndex, `${qlId}/${seed}/${locale}: frozen option verifier ownership failure`);
        optionIdentityChecks += 3;
        verifierChecks += 1;
      });

      if (qlId === "INT-QL-086" || qlId === "INT-QL-088") {
        assert.equal(frozen.answerSemantic, "CONTEXT_VALUE", `${qlId}/${seed}/${locale}: frozen context-value semantic mismatch`);
        semanticChecks += 1;
      }

      assert.equal(frozen.enabled, false);
      assert.equal(frozen.stagingStatus, "NOT_STAGED");
      assert.equal(frozen.registrationStatus, "NOT_REGISTERED");
      assert.equal(frozen.questionStudioDiscoverable, false);
      assert.equal(frozen.questionBankStatus, "NOT_STORED");
      assert.equal(frozen.testEligibility, "INELIGIBLE");
      assert.equal(frozen.publiclyPublishable, false);
      assert.equal(frozen.lifecycle.enabled, false);
      assert.equal(frozen.lifecycle.stagingStatus, "NOT_STAGED");
      assert.equal(frozen.lifecycle.registrationStatus, "NOT_REGISTERED");
      assert.equal(frozen.lifecycle.questionStudioDiscoverable, false);
      assert.equal(frozen.lifecycle.questionBankStatus, "NOT_STORED");
      assert.equal(frozen.lifecycle.testEligibility, "INELIGIBLE");
      assert.equal(frozen.lifecycle.publiclyPublishable, false);
      lifecycleChecks += 14;

      assertDeepFrozen(frozen);
    }
  }
}

const mutationSample = generateIntCp005V14FrozenQuestion("INT-QL-086", "int-cp005-v14-freeze-mutation", "hi-IN");
assert.throws(() => {
  (mutationSample.options as unknown as { push(value: unknown): void }).push({});
});
mutationGuards += 1;
assert.throws(() => {
  (mutationSample.presentation as unknown as { prompt: string }).prompt = "mutated";
});
mutationGuards += 1;

console.log(JSON.stringify({
  freezeId: INT_CP005_V14_FREEZE_ID,
  questions,
  perLocale: questions / 3,
  learnerIdentityChecks,
  mathematicalIdentityChecks,
  optionIdentityChecks,
  verifierChecks,
  semanticChecks,
  lifecycleChecks,
  deepFreezeChecks,
  mutationGuards,
}, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V14_FREEZE");
