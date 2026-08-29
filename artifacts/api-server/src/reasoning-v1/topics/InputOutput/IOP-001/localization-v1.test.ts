import assert from "node:assert/strict";
import { generateIopEnglishReviewCaselet } from "./english-review-generator.ts";
import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import {
  generateIopLocalizedReviewCaselet,
  IOP_LOCALIZATION_RULE_COUNT,
  type IopLocalizedLocale,
} from "./localization-v1.ts";

const locales: readonly IopLocalizedLocale[] = ["hi-IN", "pa-IN"] as const;
const nativeScript: Readonly<Record<IopLocalizedLocale, RegExp>> = {
  "hi-IN": /[\u0900-\u097F]/,
  "pa-IN": /[\u0A00-\u0A7F]/,
};
const bannedBoilerplate = [
  /Which of the following/i,
  /We need/i,
  /From the worked illustration/i,
  /Therefore, the correct answer/i,
  /Applying the same rule/i,
  /sourceMode/i,
  /semanticFingerprint/i,
  /oracle/i,
  /prototype/i,
];

assert.equal(IOP_ENGLISH_SOURCE_MODES.length, 19);
assert.equal(IOP_LOCALIZATION_RULE_COUNT, 19, "Every frozen English source mode must have one human-authored localization rule");

let localizedCaselets = 0;
let localizedQuestions = 0;
let minimumExplanationLength = Number.POSITIVE_INFINITY;
let maximumQuestionLength = 0;
const localeModeCoverage = new Set<string>();
const questionKinds = new Set<string>();

for (const mode of IOP_ENGLISH_SOURCE_MODES) {
  for (let sample = 0; sample < 3; sample += 1) {
    const seed = `IOP-L10N-V1-${mode.sourceModeId}-${sample}`;
    const english = generateIopEnglishReviewCaselet(seed, mode.qlId, mode.sourceModeId);

    for (const locale of locales) {
      const localized = generateIopLocalizedReviewCaselet(seed, mode.qlId, mode.sourceModeId, locale);
      const replay = generateIopLocalizedReviewCaselet(seed, mode.qlId, mode.sourceModeId, locale);
      assert.deepEqual(localized, replay, `${mode.sourceModeId}/${locale} is not deterministic`);

      localizedCaselets += 1;
      localeModeCoverage.add(`${locale}:${mode.sourceModeId}`);

      assert.equal(localized.qlId, english.qlId);
      assert.equal(localized.sourceModeId, english.sourceModeId);
      assert.equal(localized.seed, english.seed);
      assert.equal(localized.difficulty, english.difficulty);
      assert.equal(localized.examProfile, english.examProfile);
      assert.deepEqual(localized.demonstration, english.demonstration, `${mode.sourceModeId}/${locale} changed the worked machine trace`);
      assert.deepEqual(localized.target, english.target, `${mode.sourceModeId}/${locale} changed the target trace`);
      assert.deepEqual(localized.sourceEvidenceIds, english.sourceEvidenceIds);
      assert.deepEqual(localized.safeguards, english.safeguards);
      assert.equal(localized.canonicalEnglishDirections, english.directions);
      assert.equal(localized.canonicalEnglishRuleExplanation, english.ruleExplanation);
      assert.ok(nativeScript[locale].test(localized.directions), `${mode.sourceModeId}/${locale} directions lack native script`);
      assert.ok(nativeScript[locale].test(localized.ruleExplanation), `${mode.sourceModeId}/${locale} rule lacks native script`);

      assert.equal(localized.lifecycle.maturity, "LOCALIZATION_REVIEW_CANDIDATE");
      assert.equal(localized.lifecycle.englishFreeze, true);
      assert.equal(localized.lifecycle.hindiPunjabiStatus, "REVIEW_CANDIDATE_V1");
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
      assert.equal(localized.lifecycle.questionBankWritable, false);
      assert.equal(localized.lifecycle.testEligible, false);
      assert.equal(localized.lifecycle.publiclyPublishable, false);

      for (let index = 0; index < english.children.length; index += 1) {
        const enChild = english.children[index]!;
        const child = localized.children[index]!;
        localizedQuestions += 1;
        questionKinds.add(child.kind);
        minimumExplanationLength = Math.min(minimumExplanationLength, child.explanation.length);
        maximumQuestionLength = Math.max(maximumQuestionLength, child.text.length);

        assert.equal(child.questionOrder, enChild.questionOrder);
        assert.equal(child.kind, enChild.kind);
        assert.deepEqual(child.evidence, enChild.evidence, `${mode.sourceModeId}/${locale}/${child.kind} changed query evidence`);
        assert.equal(child.answerIndex, enChild.answerIndex, `${mode.sourceModeId}/${locale}/${child.kind} changed correct option index`);
        assert.equal(child.canonicalEnglishText, enChild.text);
        assert.equal(child.canonicalEnglishAnswerDisplay, enChild.answerDisplay);
        assert.equal(child.canonicalEnglishExplanation, enChild.explanation);
        assert.equal(child.options.length, 4);
        assert.equal(child.options.filter((option) => option.isCorrect).length, 1);
        assert.equal(child.answerDisplay, child.options[child.answerIndex]!.display);
        assert.ok(nativeScript[locale].test(child.text), `${mode.sourceModeId}/${locale}/${child.kind} question lacks native script`);
        assert.ok(nativeScript[locale].test(child.explanation), `${mode.sourceModeId}/${locale}/${child.kind} explanation lacks native script`);
        assert.ok(child.explanation.includes(child.answerDisplay), `${mode.sourceModeId}/${locale}/${child.kind} explanation omits localized answer`);
        assert.ok(child.explanation.length >= 120, `${mode.sourceModeId}/${locale}/${child.kind} explanation is too thin`);
        assert.ok(child.text.length <= 360, `${mode.sourceModeId}/${locale}/${child.kind} question is too long for exam-style wording`);

        for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
          const enOption = enChild.options[optionIndex]!;
          const option = child.options[optionIndex]!;
          assert.equal(option.semanticFingerprint, enOption.semanticFingerprint);
          assert.equal(option.isCorrect, enOption.isCorrect);
          assert.equal(option.misconception, enOption.misconception);
          assert.equal(option.canonicalEnglishDisplay, enOption.display);
        }

        for (const pattern of bannedBoilerplate) {
          assert.ok(!pattern.test(child.text), `${mode.sourceModeId}/${locale}/${child.kind} retained English/technical question boilerplate ${pattern}`);
          assert.ok(!pattern.test(child.explanation), `${mode.sourceModeId}/${locale}/${child.kind} retained English/technical explanation boilerplate ${pattern}`);
        }
      }
    }
  }
}

assert.equal(localeModeCoverage.size, IOP_ENGLISH_SOURCE_MODES.length * locales.length, "Localization did not cover every source mode in both languages");
assert.equal(questionKinds.size, 8, "Localization proof did not reach all eight solve modes");

console.log("PASS_IOP_001_LOCALIZATION_V1");
console.log(`locales ${locales.join(",")}`);
console.log(`source modes ${IOP_ENGLISH_SOURCE_MODES.length}`);
console.log(`localized mode-language pairs ${localeModeCoverage.size}`);
console.log(`localized caselets audited ${localizedCaselets}`);
console.log(`localized questions audited ${localizedQuestions}`);
console.log(`solve modes ${questionKinds.size}`);
console.log(`minimum explanation length ${minimumExplanationLength}`);
console.log(`maximum question length ${maximumQuestionLength}`);
console.log("English freeze preserved true");
console.log("Question Studio false");
