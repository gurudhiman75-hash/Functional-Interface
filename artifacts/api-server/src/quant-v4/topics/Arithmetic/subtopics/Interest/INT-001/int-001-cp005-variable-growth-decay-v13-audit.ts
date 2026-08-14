import assert from "node:assert/strict";
import {
  INT_CP005_QL_IDS,
  INT_CP005_RUNTIME_VERSION_V13,
  generateIntCp005QuestionV13,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QuestionV13,
} from "./cp005-variable-growth-decay-runtime-v13";
import { generateIntCp005QuestionV11 } from "./cp005-variable-growth-decay-runtime-v11";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
let questions = 0;
let verifierChecks = 0;
let optionChecks = 0;
let parityChecks = 0;
let semanticChecks = 0;
let lifecycleChecks = 0;
let learnerChecks = 0;
const thresholdStates = new Set<string>();
const planStates = new Set<string>();

function optionOwnershipKey(question: IntCp005QuestionV13): string {
  return question.options.map((option) => `${option.value.numerator}/${option.value.denominator}:${option.misconceptionId}:${option.isCorrect}`).join("|");
}

function assertContextValueSurface(question: IntCp005QuestionV13): void {
  const context = question.mathematicalState.context;
  const isContextValue = (question.qlId === "INT-QL-086" || question.qlId === "INT-QL-088")
    && (context === "POPULATION" || context === "PRODUCTION");
  const isMoneyContext = (question.qlId === "INT-QL-086" || question.qlId === "INT-QL-088")
    && (context === "INVESTMENT" || context === "SALARY");

  if (isContextValue) {
    assert.equal(question.answerSemantic, "CONTEXT_VALUE", `${question.qlId}/${question.seed}/${question.locale}: context-value semantic missing`);
    for (const option of question.options) {
      assert(!option.text.includes("₹"), `${question.qlId}/${question.seed}/${question.locale}: currency leaked into non-money option`);
      if (context === "POPULATION") {
        assert(question.locale === "en-IN" ? / people$/u.test(option.text) : question.locale === "hi-IN" ? / लोग$/u.test(option.text) : / ਲੋਕ$/u.test(option.text), `${question.qlId}/${question.seed}/${question.locale}: population unit missing`);
      } else {
        assert(question.locale === "en-IN" ? / units$/u.test(option.text) : question.locale === "hi-IN" ? / इकाइयाँ$/u.test(option.text) : / ਇਕਾਈਆਂ$/u.test(option.text), `${question.qlId}/${question.seed}/${question.locale}: production unit missing`);
      }
      semanticChecks += 1;
    }
  }

  if (isMoneyContext) {
    assert.equal(question.answerSemantic, "MONEY", `${question.qlId}/${question.seed}/${question.locale}: money semantic missing`);
    assert(question.options.every((option) => option.text.startsWith("₹")), `${question.qlId}/${question.seed}/${question.locale}: money option lost rupee formatting`);
    semanticChecks += 4;
  }

  assert.equal(question.correctAnswer, question.options[question.correctIndex]!.text, `${question.qlId}/${question.seed}/${question.locale}: correctAnswer not option-owned`);
  assert.equal(question.explanation.finalAnswer, question.correctAnswer, `${question.qlId}/${question.seed}/${question.locale}: explanation finalAnswer mismatch`);
  learnerChecks += 2;
}

assert.equal(INT_CP005_RUNTIME_VERSION_V13, "INT-CP-005-VARIABLE-GROWTH-DECAY-v13");
assert.equal(INT_CP005_QL_IDS.length, 10);

for (const qlId of INT_CP005_QL_IDS) {
  const positions = new Set<number>();
  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp005-v13-audit-${qlId}-${index}`;
    const english = generateIntCp005QuestionV13(qlId, seed, "en-IN");
    assert.deepEqual(generateIntCp005QuestionV13(qlId, seed, "en-IN"), english, `${qlId}/${seed}: replay drift`);
    assert(verifyIntCp005Answer(english.mathematicalState, english.solution), `${qlId}/${seed}: verifier rejected solution`);
    verifierChecks += 1;
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.text)).size, 4, `${qlId}/${seed}: duplicate option text`);
    english.options.forEach((option, optionIndex) => {
      assert.equal(verifyIntCp005Answer(english.mathematicalState, option.value), optionIndex === english.correctIndex, `${qlId}/${seed}: option ownership failure`);
      optionChecks += 1;
    });
    positions.add(english.correctIndex);

    if (english.mathematicalState.qlId === "INT-QL-093") {
      thresholdStates.add(`${english.mathematicalState.direction}:${english.mathematicalState.rate.numerator}/${english.mathematicalState.rate.denominator}:${english.mathematicalState.targetYear}:${english.mathematicalState.initial.numerator}`);
    }
    if (english.mathematicalState.qlId === "INT-QL-095") {
      const r = (value: { numerator: bigint; denominator: bigint }) => `${value.numerator}/${value.denominator}`;
      planStates.add(`${r(english.mathematicalState.initial)}|${english.mathematicalState.planARates.map(r).join(",")}|${english.mathematicalState.planBRates.map(r).join(",")}`);
    }

    const canonicalOptionOwnership = optionOwnershipKey(english);
    for (const locale of LOCALES) {
      const question = locale === "en-IN" ? english : generateIntCp005QuestionV13(qlId, seed, locale);
      const source = generateIntCp005QuestionV11(qlId, seed, locale);
      questions += 1;
      assert.deepEqual(question.mathematicalState, source.mathematicalState, `${qlId}/${seed}/${locale}: V13 changed mathematical state`);
      assert.equal(question.mathematicalFingerprint, source.mathematicalFingerprint, `${qlId}/${seed}/${locale}: V13 changed fingerprint`);
      assert.deepEqual(question.solution, source.solution, `${qlId}/${seed}/${locale}: V13 changed solution`);
      assert.equal(question.correctIndex, source.correctIndex, `${qlId}/${seed}/${locale}: V13 changed correct index`);
      assert.equal(optionOwnershipKey(question), optionOwnershipKey(source as IntCp005QuestionV13), `${qlId}/${seed}/${locale}: V13 changed option values/misconceptions`);
      assert.equal(optionOwnershipKey(question), canonicalOptionOwnership, `${qlId}/${seed}/${locale}: locale option ownership drift`);
      parityChecks += 6;
      assertContextValueSurface(question);

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
  assert.deepEqual([...positions].sort(), [0, 1, 2, 3], `${qlId}: all four answer positions must be reachable`);
}

assert(thresholdStates.size >= 50, `threshold diversity regressed: ${thresholdStates.size}`);
assert(planStates.size >= 60, `plan diversity regressed: ${planStates.size}`);

console.log(JSON.stringify({
  runtimeVersion: INT_CP005_RUNTIME_VERSION_V13,
  qls: INT_CP005_QL_IDS.length,
  questions,
  perLocale: questions / 3,
  verifierChecks,
  optionChecks,
  parityChecks,
  semanticChecks,
  learnerChecks,
  lifecycleChecks,
  thresholdStates: thresholdStates.size,
  planStates: planStates.size,
}, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V13");
