import assert from "node:assert/strict";
import { generateIntCp007EnglishFrozenQuestion } from "./cp007-scheme-equivalence-english-v8-frozen";
import {
  INT_CP007_LOCALIZED_LOCALES,
  INT_CP007_LOCALIZED_VERSION,
  INT_CP007_LOCALIZED_V2_SUPERSEDES,
  containsDeprecatedPunjabiCompoundInterestTerm,
  generateIntCp007LocalizedReviewQuestion,
} from "./cp007-scheme-equivalence-localized-v2";
import { INT_CP007_QL_IDS } from "./cp007-scheme-equivalence-runtime-v3-final";

function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function learnerText(question: any): string {
  return [question.presentation.markdown, question.presentation.prompt, ...question.options.map((o: any) => o.text), question.explanation.keyIdea, ...question.explanation.steps, question.explanation.finalAnswer, question.explanation.commonMistake].join("\n");
}

const mathSegments = (text: string): string[] => text.match(/\$[^$]+\$/gu) ?? [];
const stripMath = (text: string): string => text.replace(/\$[^$]+\$/gu, " ");
const bannedEnglishLearnerWords = Object.freeze([
  "Scheme ", "Plan ", "simple interest", "compound interest", "growth factor", "maturity amount",
  "present principal", "future value", "Common mistake", "Cannot be determined", "undefined", "null",
]);

let localizedQuestions = 0;
let deterministicChecks = 0;
let mathematicalStateChecks = 0;
let optionSemanticChecks = 0;
let answerChecks = 0;
let lifecycleChecks = 0;
let nativeScriptChecks = 0;
let terminologyChecks = 0;
let mathReuseChecks = 0;
let deepFreezeChecks = 0;

assert.equal(INT_CP007_LOCALIZED_V2_SUPERSEDES, "INT-CP-007-HI-PA-v1-native-review");

for (const qlId of INT_CP007_QL_IDS) {
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp007-localized-v2-${qlId}-${index}`;
    const english = generateIntCp007EnglishFrozenQuestion(qlId, seed) as any;
    const englishMath = new Set(mathSegments(learnerText(english)));

    for (const locale of INT_CP007_LOCALIZED_LOCALES) {
      const localized = generateIntCp007LocalizedReviewQuestion(qlId, seed, locale) as any;
      const replay = generateIntCp007LocalizedReviewQuestion(qlId, seed, locale) as any;
      const text = learnerText(localized);
      const proseOnly = stripMath(text);

      assert.equal(stableJson(replay), stableJson(localized), `${qlId}/${seed}/${locale}: replay is not deterministic`);
      deterministicChecks += 1;

      assert.equal(stableJson(localized.mathematicalState), stableJson(english.mathematicalState), `${qlId}/${seed}/${locale}: mathematical state drift`);
      assert.equal(localized.correctIndex, english.correctIndex, `${qlId}/${seed}/${locale}: correct position drift`);
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
      assert.equal(localized.correctAnswer, localized.options[localized.correctIndex].text, `${qlId}/${seed}/${locale}: correct answer/options mismatch`);
      assert.equal(localized.explanation.finalAnswer, localized.correctAnswer, `${qlId}/${seed}/${locale}: final answer mismatch`);
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

      for (const segment of mathSegments(text)) {
        assert.ok(englishMath.has(segment) || segment === "$x$" || segment === "$P$", `${qlId}/${seed}/${locale}: localized math changed or invented: ${segment}`);
        mathReuseChecks += 1;
      }
      assert.ok(!text.includes("$undefined$"), `${qlId}/${seed}/${locale}: undefined math leaked`);
      assert.ok(!text.includes("undefined"), `${qlId}/${seed}/${locale}: undefined text leaked`);
      assert.ok(!text.includes("  "), `${qlId}/${seed}/${locale}: doubled whitespace`);

      for (const banned of bannedEnglishLearnerWords) assert.ok(!proseOnly.includes(banned), `${qlId}/${seed}/${locale}: English learner phrase leaked: ${banned}`);
      if (locale === "hi-IN") {
        assert.match(proseOnly, /[\u0900-\u097F]/u, `${qlId}/${seed}: Hindi content lacks Devanagari`);
        assert.ok(!/[\u0A00-\u0A7F]/u.test(proseOnly), `${qlId}/${seed}: Gurmukhi leaked into Hindi`);
        if ((english.presentation.markdown + english.explanation.steps.join(" ")).includes("compound interest")) {
          assert.ok(proseOnly.includes("चक्रवृद्धि ब्याज"), `${qlId}/${seed}: Hindi compound-interest state missing चक्रवृद्धि ब्याज`);
        }
      } else {
        assert.match(proseOnly, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi content lacks Gurmukhi`);
        assert.ok(!/[\u0900-\u097F]/u.test(proseOnly), `${qlId}/${seed}: Devanagari leaked into Punjabi`);
        assert.ok(!containsDeprecatedPunjabiCompoundInterestTerm(proseOnly), `${qlId}/${seed}: deprecated Punjabi compound-interest term leaked`);
        if ((english.presentation.markdown + english.explanation.steps.join(" ")).includes("compound interest")) {
          assert.ok(proseOnly.includes("ਮਿਸ਼ਰਤ ਵਿਆਜ"), `${qlId}/${seed}: Punjabi compound-interest state missing ਮਿਸ਼ਰਤ ਵਿਆਜ`);
        }
        terminologyChecks += 1;
      }
      nativeScriptChecks += bannedEnglishLearnerWords.length + 3;

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
  supersedes: INT_CP007_LOCALIZED_V2_SUPERSEDES,
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
  mathReuseChecks,
  deepFreezeChecks,
  permanentIdentityFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP007_LOCALIZED_V2_AUDIT");
