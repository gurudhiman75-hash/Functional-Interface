import assert from "node:assert/strict";
import { generateIopEnglishReviewCaselet } from "./english-review-generator.ts";
import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import { IOP_LOCALIZATION_RULE_COUNT } from "./localization-v1.ts";
import { generateIopLocalizedReviewCaseletV1, type IopLocalizedLocale } from "./localization-v1-final.ts";

const locales: readonly IopLocalizedLocale[] = ["hi-IN", "pa-IN"] as const;
const nativeScript: Readonly<Record<IopLocalizedLocale, RegExp>> = {
  "hi-IN": /[\u0900-\u097F]/,
  "pa-IN": /[\u0A00-\u0A7F]/,
};
const banned = [/Which of the following/i, /We need/i, /From the worked illustration/i, /Therefore, the correct answer/i, /sourceMode/i, /semanticFingerprint/i, /oracle/i, /prototype/i];

assert.equal(IOP_ENGLISH_SOURCE_MODES.length, 19);
assert.equal(IOP_LOCALIZATION_RULE_COUNT, 19);

let caselets = 0;
let questions = 0;
let minimumExplanationLength = Number.POSITIVE_INFINITY;
let maximumQuestionLength = 0;
const coveredModeLocales = new Set<string>();
const solveModes = new Set<string>();

for (const mode of IOP_ENGLISH_SOURCE_MODES) {
  for (let sample = 0; sample < 3; sample += 1) {
    const seed = `IOP-L10N-FINAL-${mode.sourceModeId}-${sample}`;
    const english = generateIopEnglishReviewCaselet(seed, mode.qlId, mode.sourceModeId);
    for (const locale of locales) {
      const localized = generateIopLocalizedReviewCaseletV1(seed, mode.qlId, mode.sourceModeId, locale);
      const replay = generateIopLocalizedReviewCaseletV1(seed, mode.qlId, mode.sourceModeId, locale);
      assert.deepEqual(localized, replay, `${mode.sourceModeId}/${locale} is not deterministic`);
      caselets += 1;
      coveredModeLocales.add(`${locale}:${mode.sourceModeId}`);

      assert.equal(localized.qlId, english.qlId);
      assert.equal(localized.sourceModeId, english.sourceModeId);
      assert.equal(localized.seed, english.seed);
      assert.equal(localized.difficulty, english.difficulty);
      assert.deepEqual(localized.demonstration, english.demonstration, `${mode.sourceModeId}/${locale} changed demonstration trace`);
      assert.deepEqual(localized.target, english.target, `${mode.sourceModeId}/${locale} changed target trace`);
      assert.deepEqual(localized.sourceEvidenceIds, english.sourceEvidenceIds);
      assert.deepEqual(localized.safeguards, english.safeguards);
      assert.ok(nativeScript[locale].test(localized.directions));
      assert.ok(nativeScript[locale].test(localized.ruleExplanation));
      assert.equal(localized.lifecycle.englishFreeze, true);
      assert.equal(localized.lifecycle.hindiPunjabiStatus, "REVIEW_CANDIDATE_V1");
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
      assert.equal(localized.lifecycle.questionBankWritable, false);
      assert.equal(localized.lifecycle.testEligible, false);
      assert.equal(localized.lifecycle.publiclyPublishable, false);

      for (let i = 0; i < 4; i += 1) {
        const enChild = english.children[i]!;
        const child = localized.children[i]!;
        questions += 1;
        solveModes.add(child.kind);
        minimumExplanationLength = Math.min(minimumExplanationLength, child.explanation.length);
        maximumQuestionLength = Math.max(maximumQuestionLength, child.text.length);

        assert.equal(child.kind, enChild.kind);
        assert.deepEqual(child.evidence, enChild.evidence);
        assert.equal(child.answerIndex, enChild.answerIndex);
        assert.equal(child.canonicalEnglishText, enChild.text);
        assert.equal(child.canonicalEnglishAnswerDisplay, enChild.answerDisplay);
        assert.equal(child.canonicalEnglishExplanation, enChild.explanation);
        assert.equal(child.options.length, 4);
        assert.equal(child.options.filter((option) => option.isCorrect).length, 1);
        assert.equal(child.answerDisplay, child.options[child.answerIndex]!.display);
        assert.ok(nativeScript[locale].test(child.text), `${mode.sourceModeId}/${locale}/${child.kind} lacks native-script question text`);
        assert.ok(nativeScript[locale].test(child.explanation), `${mode.sourceModeId}/${locale}/${child.kind} lacks native-script explanation`);
        assert.ok(child.explanation.includes(child.answerDisplay), `${mode.sourceModeId}/${locale}/${child.kind} omits exact answer`);
        assert.ok(child.explanation.length >= 120, `${mode.sourceModeId}/${locale}/${child.kind} explanation is too thin (${child.explanation.length})`);
        assert.ok(child.text.length <= 360, `${mode.sourceModeId}/${locale}/${child.kind} question is too long`);

        for (let j = 0; j < 4; j += 1) {
          const enOption = enChild.options[j]!;
          const option = child.options[j]!;
          assert.equal(option.semanticFingerprint, enOption.semanticFingerprint);
          assert.equal(option.isCorrect, enOption.isCorrect);
          assert.equal(option.misconception, enOption.misconception);
          assert.equal(option.canonicalEnglishDisplay, enOption.display);
        }
        for (const pattern of banned) {
          assert.ok(!pattern.test(child.text), `${mode.sourceModeId}/${locale}/${child.kind} contains banned question boilerplate`);
          assert.ok(!pattern.test(child.explanation), `${mode.sourceModeId}/${locale}/${child.kind} contains banned explanation boilerplate`);
        }
      }
    }
  }
}

assert.equal(coveredModeLocales.size, 38, "Every one of 19 modes must be covered in both languages");
assert.equal(solveModes.size, 8, "All eight solve modes must be covered");

console.log("PASS_IOP_001_LOCALIZATION_FINAL_V1");
console.log(`locales ${locales.join(",")}`);
console.log(`mode-language pairs ${coveredModeLocales.size}`);
console.log(`caselets audited ${caselets}`);
console.log(`questions audited ${questions}`);
console.log(`solve modes ${solveModes.size}`);
console.log(`minimum explanation length ${minimumExplanationLength}`);
console.log(`maximum question length ${maximumQuestionLength}`);
console.log("English freeze preserved true");
console.log("Question Studio false");
