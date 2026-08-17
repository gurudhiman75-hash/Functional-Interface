import assert from "node:assert/strict";
import {
  INT_CP005_QL_IDS,
  INT_CP005_RUNTIME_VERSION_V11,
  generateIntCp005QuestionV11,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QuestionV11,
} from "./cp005-variable-growth-decay-runtime-v11";
import { generateIntCp005QuestionV10 } from "./cp005-variable-growth-decay-runtime-v10";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
let questions = 0;
let sourceParityChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let localizationChecks = 0;

function optionKey(question: IntCp005QuestionV11): string {
  return question.options.map((option) => `${option.value.numerator}/${option.value.denominator}:${option.misconceptionId}:${option.isCorrect}`).join("|");
}

assert.equal(INT_CP005_RUNTIME_VERSION_V11, "INT-CP-005-VARIABLE-GROWTH-DECAY-v11");
assert.equal(INT_CP005_QL_IDS.length, 10);

for (const qlId of INT_CP005_QL_IDS) {
  const positions = new Set<number>();
  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp005-v11-audit-${qlId}-${index}`;
    const english = generateIntCp005QuestionV11(qlId, seed, "en-IN");
    assert.deepEqual(generateIntCp005QuestionV11(qlId, seed, "en-IN"), english, `${qlId}/${seed}: replay drift`);
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
      const question = locale === "en-IN" ? english : generateIntCp005QuestionV11(qlId, seed, locale);
      const source = generateIntCp005QuestionV10(qlId, seed, locale);
      questions += 1;
      assert.deepEqual(question.mathematicalState, source.mathematicalState, `${qlId}/${seed}/${locale}: V11 changed mathematical state`);
      assert.equal(question.mathematicalFingerprint, source.mathematicalFingerprint, `${qlId}/${seed}/${locale}: V11 changed fingerprint`);
      assert.deepEqual(question.solution, source.solution, `${qlId}/${seed}/${locale}: V11 changed solution`);
      assert.equal(question.correctIndex, source.correctIndex, `${qlId}/${seed}/${locale}: V11 changed correct index`);
      assert.equal(optionKey(question), optionKey(source as IntCp005QuestionV11), `${qlId}/${seed}/${locale}: V11 changed option/misconception ownership`);
      sourceParityChecks += 5;

      if (qlId === "INT-QL-089") {
        if (locale === "hi-IN") {
          assert(!/known factors/iu.test(question.explanation.commonMistake), `${qlId}/${seed}: English phrase survived Hindi common mistake`);
          assert(/ज्ञात वृद्धि-गुणकों/u.test(question.explanation.commonMistake), `${qlId}/${seed}: Hindi known-factor phrase missing`);
        }
        if (locale === "pa-IN") {
          assert(!/known factors/iu.test(question.explanation.commonMistake), `${qlId}/${seed}: English phrase survived Punjabi common mistake`);
          assert(/ਜਾਣੇ ਹੋਏ ਵਾਧਾ-ਗੁਣਕਾਂ/u.test(question.explanation.commonMistake), `${qlId}/${seed}: Punjabi known-factor phrase missing`);
        }
        localizationChecks += 2;
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

console.log(JSON.stringify({ runtimeVersion: INT_CP005_RUNTIME_VERSION_V11, qls: 10, questions, perLocale: questions / 3, sourceParityChecks, verifierChecks, optionChecks, lifecycleChecks, localizationChecks }, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V11");
