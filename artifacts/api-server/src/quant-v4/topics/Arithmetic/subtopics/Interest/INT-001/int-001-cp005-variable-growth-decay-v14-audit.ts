import assert from "node:assert/strict";
import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY_V2,
  INT_CP005_RUNTIME_VERSION_V14,
  generateIntCp005QuestionV14,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QuestionV14,
} from "./cp005-variable-growth-decay-runtime-v14";
import { generateIntCp005QuestionV11 } from "./cp005-variable-growth-decay-runtime-v11";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
let questions = 0;
let parityChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let semanticChecks = 0;
let lifecycleChecks = 0;
let learnerChecks = 0;
const thresholdStates = new Set<string>();
const planStates = new Set<string>();

function ownership(question: IntCp005QuestionV14): string {
  return question.options.map((option) => `${option.value.numerator}/${option.value.denominator}:${option.misconceptionId}:${option.isCorrect}`).join("|");
}

const registryByQl = new Map(INT_CP005_REGISTRY_V2.map((entry) => [entry.qlId, entry]));
assert.equal(INT_CP005_RUNTIME_VERSION_V14, "INT-CP-005-VARIABLE-GROWTH-DECAY-v14");
assert.equal(INT_CP005_QL_IDS.length, 10);
assert.equal(registryByQl.get("INT-QL-086")?.answerSemantic, "CONTEXT_VALUE");
assert.equal(registryByQl.get("INT-QL-088")?.answerSemantic, "CONTEXT_VALUE");

for (const qlId of INT_CP005_QL_IDS) {
  const positions = new Set<number>();
  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp005-v14-audit-${qlId}-${index}`;
    const english = generateIntCp005QuestionV14(qlId, seed, "en-IN");
    assert.deepEqual(generateIntCp005QuestionV14(qlId, seed, "en-IN"), english, `${qlId}/${seed}: replay drift`);
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

    const canonicalOwnership = ownership(english);
    for (const locale of LOCALES) {
      const question = locale === "en-IN" ? english : generateIntCp005QuestionV14(qlId, seed, locale);
      const source = generateIntCp005QuestionV11(qlId, seed, locale);
      questions += 1;
      assert.deepEqual(question.mathematicalState, source.mathematicalState, `${qlId}/${seed}/${locale}: mathematical state drift`);
      assert.equal(question.mathematicalFingerprint, source.mathematicalFingerprint, `${qlId}/${seed}/${locale}: fingerprint drift`);
      assert.deepEqual(question.solution, source.solution, `${qlId}/${seed}/${locale}: solution drift`);
      assert.equal(question.correctIndex, source.correctIndex, `${qlId}/${seed}/${locale}: correct-index drift`);
      assert.equal(ownership(question), ownership(source as IntCp005QuestionV14), `${qlId}/${seed}/${locale}: option value/misconception drift`);
      assert.equal(ownership(question), canonicalOwnership, `${qlId}/${seed}/${locale}: locale option ownership drift`);
      parityChecks += 6;

      if (qlId === "INT-QL-086" || qlId === "INT-QL-088") {
        assert.equal(question.answerSemantic, "CONTEXT_VALUE", `${qlId}/${seed}/${locale}: registry/runtime semantic mismatch`);
        const context = question.mathematicalState.context;
        if (context === "POPULATION") {
          assert(question.options.every((option) => !option.text.includes("₹")), `${qlId}/${seed}/${locale}: population option contains currency`);
          assert(question.options.every((option) => locale === "en-IN" ? / people$/u.test(option.text) : locale === "hi-IN" ? / लोग$/u.test(option.text) : / ਲੋਕ$/u.test(option.text)), `${qlId}/${seed}/${locale}: population unit missing`);
        }
        if (context === "PRODUCTION") {
          assert(question.options.every((option) => !option.text.includes("₹")), `${qlId}/${seed}/${locale}: production option contains currency`);
          assert(question.options.every((option) => locale === "en-IN" ? / units$/u.test(option.text) : locale === "hi-IN" ? / इकाइयाँ$/u.test(option.text) : / ਇਕਾਈਆਂ$/u.test(option.text)), `${qlId}/${seed}/${locale}: production unit missing`);
        }
        if (context === "INVESTMENT" || context === "SALARY") {
          assert(question.options.every((option) => option.text.startsWith("₹")), `${qlId}/${seed}/${locale}: monetary context lost rupee formatting`);
        }
        semanticChecks += 4;
      }

      assert.equal(question.correctAnswer, question.options[question.correctIndex]!.text, `${qlId}/${seed}/${locale}: correctAnswer not option-owned`);
      assert.equal(question.explanation.finalAnswer, question.correctAnswer, `${qlId}/${seed}/${locale}: finalAnswer mismatch`);
      learnerChecks += 2;

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

console.log(JSON.stringify({ runtimeVersion: INT_CP005_RUNTIME_VERSION_V14, qls: 10, questions, perLocale: questions / 3, parityChecks, verifierChecks, optionChecks, semanticChecks, learnerChecks, lifecycleChecks, thresholdStates: thresholdStates.size, planStates: planStates.size }, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V14");
