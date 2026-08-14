import assert from "node:assert/strict";
import {
  INT_CP005_QL_IDS,
  INT_CP005_RUNTIME_VERSION_V12,
  generateIntCp005QuestionV12,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QuestionV12,
} from "./cp005-variable-growth-decay-runtime-v12";
import { generateIntCp005QuestionV11 } from "./cp005-variable-growth-decay-runtime-v11";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
let questions = 0;
let parityChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let contextSemanticChecks = 0;
let lifecycleChecks = 0;

function optionOwnershipKey(question: IntCp005QuestionV12): string {
  return question.options.map((option) => `${option.value.numerator}/${option.value.denominator}:${option.misconceptionId}:${option.isCorrect}`).join("|");
}

assert.equal(INT_CP005_RUNTIME_VERSION_V12, "INT-CP-005-VARIABLE-GROWTH-DECAY-v12");
assert.equal(INT_CP005_QL_IDS.length, 10);

for (const qlId of INT_CP005_QL_IDS) {
  const positions = new Set<number>();
  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp005-v12-audit-${qlId}-${index}`;
    const english = generateIntCp005QuestionV12(qlId, seed, "en-IN");
    assert.deepEqual(generateIntCp005QuestionV12(qlId, seed, "en-IN"), english, `${qlId}/${seed}: replay drift`);
    assert(verifyIntCp005Answer(english.mathematicalState, english.solution), `${qlId}/${seed}: verifier rejected solution`);
    verifierChecks += 1;
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.text)).size, 4, `${qlId}/${seed}: duplicate options`);
    english.options.forEach((option, optionIndex) => {
      assert.equal(verifyIntCp005Answer(english.mathematicalState, option.value), optionIndex === english.correctIndex, `${qlId}/${seed}: option ownership failure`);
      optionChecks += 1;
    });
    positions.add(english.correctIndex);

    for (const locale of LOCALES) {
      const question = locale === "en-IN" ? english : generateIntCp005QuestionV12(qlId, seed, locale);
      const source = generateIntCp005QuestionV11(qlId, seed, locale);
      questions += 1;
      assert.deepEqual(question.mathematicalState, source.mathematicalState, `${qlId}/${seed}/${locale}: state drift`);
      assert.equal(question.mathematicalFingerprint, source.mathematicalFingerprint, `${qlId}/${seed}/${locale}: fingerprint drift`);
      assert.deepEqual(question.solution, source.solution, `${qlId}/${seed}/${locale}: solution drift`);
      assert.equal(question.correctIndex, source.correctIndex, `${qlId}/${seed}/${locale}: correct-index drift`);
      assert.equal(optionOwnershipKey(question), optionOwnershipKey(source as IntCp005QuestionV12), `${qlId}/${seed}/${locale}: option value/misconception ownership drift`);
      parityChecks += 5;

      const context = question.mathematicalState.context;
      const isContextValue = (qlId === "INT-QL-086" || qlId === "INT-QL-088") && (context === "POPULATION" || context === "PRODUCTION");
      if (isContextValue) {
        assert.equal(question.answerSemantic, "CONTEXT_VALUE", `${qlId}/${seed}/${locale}: non-money context still reports MONEY semantic`);
        assert.equal(question.correctAnswer, question.options[question.correctIndex]!.text, `${qlId}/${seed}/${locale}: correct answer text drift`);
        assert.equal(question.explanation.finalAnswer, question.correctAnswer, `${qlId}/${seed}/${locale}: explanation finalAnswer not contextual`);
        for (const option of question.options) {
          assert(!option.text.includes("₹"), `${qlId}/${seed}/${locale}: currency symbol in non-money option`);
          if (context === "POPULATION") {
            assert(locale === "en-IN" ? / people$/u.test(option.text) : locale === "hi-IN" ? / लोग$/u.test(option.text) : / ਲੋਕ$/u.test(option.text), `${qlId}/${seed}/${locale}: population unit missing`);
          } else {
            assert(locale === "en-IN" ? / units$/u.test(option.text) : locale === "hi-IN" ? / इकाइयाँ$/u.test(option.text) : / ਇਕਾਈਆਂ$/u.test(option.text), `${qlId}/${seed}/${locale}: production unit missing`);
          }
          contextSemanticChecks += 1;
        }
      } else if ((qlId === "INT-QL-086" || qlId === "INT-QL-088") && (context === "INVESTMENT" || context === "SALARY")) {
        assert.equal(question.answerSemantic, "MONEY", `${qlId}/${seed}/${locale}: monetary context lost MONEY semantic`);
        assert(question.options.every((option) => option.text.startsWith("₹")), `${qlId}/${seed}/${locale}: monetary context lost currency formatting`);
        contextSemanticChecks += 4;
      }

      assert.equal(question.enabled, false);
      assert.equal(question.stagingStatus, "NOT_STAGED");
      assert.equal(question.registrationStatus, "NOT_REGISTERED");
      assert.equal(question.questionStudioDiscoverable, false);
      assert.equal(question.questionBankStatus, "NOT_STORED");
      assert.equal(question.testEligibility, "INELIGIBLE");
      assert.equal(question.publiclyPublishable, false);
      lifecycleChecks += 7;
    }
  }
  assert.deepEqual([...positions].sort(), [0, 1, 2, 3], `${qlId}: all answer positions not reachable`);
}

console.log(JSON.stringify({ runtimeVersion: INT_CP005_RUNTIME_VERSION_V12, qls: 10, questions, perLocale: questions / 3, parityChecks, verifierChecks, optionChecks, contextSemanticChecks, lifecycleChecks }, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V12");
