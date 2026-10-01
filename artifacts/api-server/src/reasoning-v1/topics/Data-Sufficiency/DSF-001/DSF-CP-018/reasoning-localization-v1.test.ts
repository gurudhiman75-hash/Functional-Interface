import assert from "node:assert/strict";
import {
  DSF_CP018_REASONING_LOCALIZED_LANES,
  previewDsf001NormalQuestionStudioReview,
} from "../DSF-CP-017/question-studio-review-v1.ts";

const englishLeak = /\b(?:the|is|are|was|were|what|which|how|from|with|and|or|only|statement|sufficient|person|people|day|rank|starting|opposite|resulting|number|target|between|before|after)\b/iu;

for (const laneId of DSF_CP018_REASONING_LOCALIZED_LANES) {
  for (const language of ["hi", "pa"] as const) {
    const seed = `cp018:${laneId}:${language}`;
    const localized = previewDsf001NormalQuestionStudioReview({
      laneId,
      language,
      seed,
      count: 5,
    });
    const english = previewDsf001NormalQuestionStudioReview({
      laneId,
      language: "en",
      seed,
      count: 5,
    });

    assert.equal(localized.questions.length, 5, `${laneId}/${language}: five localized questions`);
    assert.equal(english.questions.length, 5, `${laneId}/en: five English controls`);

    for (let index = 0; index < localized.questions.length; index += 1) {
      const l = localized.questions[index]!;
      const e = english.questions[index]!;
      assert.equal(l.language, language);
      assert.equal(l.locale, language === "hi" ? "hi-IN" : "pa-IN");
      assert.equal(l.laneId, laneId);
      assert.equal(l.canonicalAnswer, e.canonicalAnswer, `${laneId}/${language}: semantic class parity`);
      assert.equal(l.correctIndex, e.correctIndex, `${laneId}/${language}: correct-index parity`);
      assert.notEqual(l.questionId, e.questionId, `${laneId}/${language}: language-aware question id`);
      assert.equal(l.options.length, 5);
      assert.equal(l.optionDetails.filter((option) => option.isCorrect).length, 1);
      assert.equal(l.statements.length, 2);
      assert.ok(l.stem.length >= 8);
      assert.ok(l.explanation.length >= 30);
      assert.doesNotMatch(l.stem, englishLeak, `${laneId}/${language}: English prose leaked into stem`);
      assert.doesNotMatch(l.explanation, englishLeak, `${laneId}/${language}: English prose leaked into explanation`);
      for (const statement of l.statements) {
        assert.doesNotMatch(statement.text, englishLeak, `${laneId}/${language}: English prose leaked into statement`);
      }
      for (const option of l.options) {
        assert.doesNotMatch(option, englishLeak, `${laneId}/${language}: English prose leaked into option`);
      }
      assert.equal(l.reviewOnly, true);
      assert.equal(l.questionBankWritable, false);
      assert.equal(l.testEligible, false);
      assert.equal(l.mockTestEligible, false);
      assert.equal(l.publiclyPublishable, false);
      assert.equal(l.automaticStudentPublication, false);
    }
  }
}

assert.throws(
  () => previewDsf001NormalQuestionStudioReview({
    laneId: "DSF-QS-AVERAGE",
    language: "hi",
    count: 1,
  }),
  /not yet localized|English-only/iu,
);

assert.throws(
  () => previewDsf001NormalQuestionStudioReview({
    laneId: "DSF-QS-MENSURATION",
    language: "pa",
    count: 1,
  }),
  /not yet localized|English-only/iu,
);

console.log(JSON.stringify({
  status: "PASS_DSF_CP018_REASONING_HI_PA_LOCALIZATION_REVIEW_V1",
  localizedReasoningLanes: DSF_CP018_REASONING_LOCALIZED_LANES.length,
  localizedLanguages: ["hi", "pa"],
  sampleCount: DSF_CP018_REASONING_LOCALIZED_LANES.length * 2 * 5,
  semanticParity: true,
  lifecycle: "REVIEW_ONLY",
  remainingQuantExpansionLocalization: 10,
}, null, 2));
