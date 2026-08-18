import assert from "node:assert/strict";
import { generateIntCp007EnglishFrozenQuestion } from "./cp007-scheme-equivalence-english-v8-frozen";
import {
  INT_CP007_LOCALIZED_LOCALES,
  INT_CP007_LOCALIZED_VERSION,
  containsDeprecatedPunjabiCompoundInterestTerm,
  generateIntCp007LocalizedReviewQuestion,
} from "./cp007-scheme-equivalence-localized-v1";
import { INT_CP007_QL_IDS } from "./cp007-scheme-equivalence-runtime-v3-final";

function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function learnerText(question: any): string {
  return [
    question.presentation.markdown,
    question.presentation.prompt,
    ...question.options.map((option: any) => option.text),
    question.explanation.keyIdea,
    ...question.explanation.steps,
    question.explanation.finalAnswer,
    question.explanation.commonMistake,
  ].join("\n");
}

function stripMath(text: string): string {
  return text.replace(/\$[^$]+\$/gu, " ");
}

const bannedEnglishLearnerWords = Object.freeze([
  "Scheme ", "Plan ", "simple interest", "compound interest", "growth factor", "maturity amount",
  "present principal", "future value", "Common mistake", "Cannot be determined",
]);

let localizedQuestions = 0;
let deterministicChecks = 0;
let mathematicalStateChecks = 0;
let optionSemanticChecks = 0;
let answerChecks = 0;
let lifecycleChecks = 0;
let nativeScriptChecks = 0;
let terminologyChecks = 0;
let deepFreezeChecks = 0;

for (const qlId of INT_CP007_QL_IDS) {
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp007-localized-v1-${qlId}-${index}`;
    const english = generateIntCp007EnglishFrozenQuestion(qlId, seed);

    for (const locale of INT_CP007_LOCALIZED_LOCALES) {
      const localized = generateIntCp007LocalizedReviewQuestion(qlId, seed, locale) as any;
      const replay = generateIntCp007LocalizedReviewQuestion(qlId, seed, locale) as any;
      const text = learnerText(localized);
      const proseOnly = stripMath(text);

      assert.equal(stableJson(replay), stableJson(localized), `${qlId}/${seed}/${locale}: localized replay is not deterministic`);
      deterministicChecks += 1;

      assert.equal(stableJson(localized.mathematicalState), stableJson(english.mathematicalState), `${qlId}/${seed}/${locale}: mathematical state drift`);
      assert.equal(localized.correctIndex, english.correctIndex, `${qlId}/${seed}/${locale}: correct option position drift`);
      assert.equal(localized.answerSemantic, english.answerSemantic, `${qlId}/${seed}/${locale}: answer semantic drift`);
      mathematicalStateChecks += 3;

      assert.equal(localized.options.length, english.options.length);
      for (let optionIndex = 0; optionIndex < english.options.length; optionIndex += 1) {
        const before = english.options[optionIndex] as any;
        const after = localized.options[optionIndex] as any;
        assert.equal(stableJson(after.value), stableJson(before.value), `${qlId}/${seed}/${locale}: option value drift at ${optionIndex}`);
        assert.equal(after.misconceptionId, before.misconceptionId, `${qlId}/${seed}/${locale}: misconception drift at ${optionIndex}`);
        optionSemanticChecks += 2;
      }
      assert.equal(localized.correctAnswer, localized.options[localized.correctIndex].text, `${qlId}/${seed}/${locale}: localized correct answer/options mismatch`);
      assert.equal(localized.explanation.finalAnswer, localized.correctAnswer, `${qlId}/${seed}/${locale}: localized explanation final answer mismatch`);
      answerChecks += 2;

      assert.equal(localized.sourceEnglishFreezeId, "INT-CP-007-EN-v8-frozen");
      assert.equal(localized.localizedVersion, INT_CP007_LOCALIZED_VERSION);
      assert.equal(localized.permanentIdentityFrozen, true);
      assert.equal(localized.learnerContentFrozen, false);
      assert.equal(localized.enabled, false);
      assert.equal(localized.stagingStatus, "NOT_STAGED");
      assert.equal(localized.registrationStatus, "NOT_REGISTERED");
      assert.equal(localized.questionStudioDiscoverable, false);
      assert.equal(localized.questionBankStatus, "NOT_STORED");
      assert.equal(localized.testEligibility, "INELIGIBLE");
      assert.equal(localized.publiclyPublishable, false);
      lifecycleChecks += 11;

      for (const banned of bannedEnglishLearnerWords) {
        assert.ok(!proseOnly.includes(banned), `${qlId}/${seed}/${locale}: English learner phrase leaked: ${banned}`);
      }
      if (locale === "hi-IN") {
        assert.match(proseOnly, /[\u0900-\u097F]/u, `${qlId}/${seed}: Hindi learner content has no Devanagari`);
        assert.ok(!/[\u0A00-\u0A7F]/u.test(proseOnly), `${qlId}/${seed}: Gurmukhi leaked into Hindi learner content`);
      } else {
        assert.match(proseOnly, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi learner content has no Gurmukhi`);
        assert.ok(!/[\u0900-\u097F]/u.test(proseOnly), `${qlId}/${seed}: Devanagari leaked into Punjabi learner content`);
        assert.ok(!containsDeprecatedPunjabiCompoundInterestTerm(proseOnly), `${qlId}/${seed}: deprecated Punjabi compound-interest term leaked`);
        if ((english.presentation.markdown + english.explanation.steps.join(" ")).includes("compound interest")) {
          assert.ok(proseOnly.includes("ਮਿਸ਼ਰਤ ਵਿਆਜ"), `${qlId}/${seed}: Punjabi compound-interest state missing ਮਿਸ਼ਰਤ ਵਿਆਜ`);
        }
        terminologyChecks += 1;
      }
      nativeScriptChecks += bannedEnglishLearnerWords.length + 2;

      assert.ok(Object.isFrozen(localized));
      assert.ok(Object.isFrozen(localized.presentation));
      assert.ok(Object.isFrozen(localized.options));
      assert.ok(Object.isFrozen(localized.explanation));
      assert.ok(Object.isFrozen(localized.explanation.steps));
      deepFreezeChecks += 5;
      localizedQuestions += 1;
    }
  }
}

console.log(JSON.stringify({
  localizedVersion: INT_CP007_LOCALIZED_VERSION,
  qls: INT_CP007_QL_IDS.length,
  locales: INT_CP007_LOCALIZED_LOCALES,
  localizedQuestions,
  deterministicChecks,
  mathematicalStateChecks,
  optionSemanticChecks,
  answerChecks,
  lifecycleChecks,
  nativeScriptChecks,
  terminologyChecks,
  deepFreezeChecks,
  permanentIdentityFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP007_LOCALIZED_V1_AUDIT");
