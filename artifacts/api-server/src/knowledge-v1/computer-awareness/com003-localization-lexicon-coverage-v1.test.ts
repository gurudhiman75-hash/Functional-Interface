import { strict as assert } from "node:assert";
import { COM003_LOCALIZATION_LEXICON_COVERAGE_V1 } from "./com003-localization-lexicon-coverage-v1";

const a = COM003_LOCALIZATION_LEXICON_COVERAGE_V1;
assert.equal(a.v4EnglishQuestionCount, 228);
assert.equal(a.v16_2EnglishQuestionCount, 228);
assert.equal(a.hindiLocalizedQuestionCount, 228);
assert.equal(a.punjabiLocalizedQuestionCount, 228);
for (const lang of [a.hindi, a.punjabi]) {
  assert.equal(lang.questionsWithAllOptionsCovered + lang.questionsWithMissingOptionTranslation, 228);
  assert.equal(lang.uniqueTargetOptionsCovered + lang.uniqueTargetOptionsMissing, lang.uniqueTargetOptions);
  assert.equal(lang.uniqueTargetAnswersCovered + lang.uniqueTargetAnswersMissing, lang.uniqueTargetAnswers);
}
console.log("[COM003-LOCALIZATION-LEXICON-COVERAGE-V1]", {
  hindi: {
    questionsWithAllOptionsCovered: a.hindi.questionsWithAllOptionsCovered,
    uniqueTargetOptions: a.hindi.uniqueTargetOptions,
    uniqueTargetOptionsCovered: a.hindi.uniqueTargetOptionsCovered,
    uniqueTargetAnswers: a.hindi.uniqueTargetAnswers,
    uniqueTargetAnswersCovered: a.hindi.uniqueTargetAnswersCovered,
    exactStemTranslationReusable: a.hindi.exactStemTranslationReusable,
    exactExplanationTranslationReusable: a.hindi.exactExplanationTranslationReusable,
    ambiguousOptionKeyCount: a.hindi.ambiguousOptionKeyCount,
  },
  punjabi: {
    questionsWithAllOptionsCovered: a.punjabi.questionsWithAllOptionsCovered,
    uniqueTargetOptions: a.punjabi.uniqueTargetOptions,
    uniqueTargetOptionsCovered: a.punjabi.uniqueTargetOptionsCovered,
    uniqueTargetAnswers: a.punjabi.uniqueTargetAnswers,
    uniqueTargetAnswersCovered: a.punjabi.uniqueTargetAnswersCovered,
    exactStemTranslationReusable: a.punjabi.exactStemTranslationReusable,
    exactExplanationTranslationReusable: a.punjabi.exactExplanationTranslationReusable,
    ambiguousOptionKeyCount: a.punjabi.ambiguousOptionKeyCount,
  },
  policy: a.policy,
});
