import assert from "node:assert/strict";
import {
  DSF_CP019_QUANT_LOCALIZED_LANES,
  previewDsf001NormalQuestionStudioReview,
} from "../DSF-CP-017/question-studio-review-v1.ts";

const englishLeak = /\b(?:the|is|are|was|were|what|which|how|from|with|and|or|only|statement|sufficient|price|interest|average|total|years|year|discount|profit|loss|selling|cost|marked|present|age|number|greater|less)\b/iu;

for (const laneId of DSF_CP019_QUANT_LOCALIZED_LANES) {
  for (const language of ["hi", "pa"] as const) {
    const seed = `cp019:${laneId}:${language}`;
    const localized = previewDsf001NormalQuestionStudioReview({
      laneId,
      language,
      seed,
      count: 8,
    });
    const english = previewDsf001NormalQuestionStudioReview({
      laneId,
      language: "en",
      seed,
      count: 8,
    });

    assert.equal(localized.questions.length, 8);
    assert.equal(english.questions.length, 8);

    for (let index = 0; index < localized.questions.length; index += 1) {
      const l = localized.questions[index]!;
      const e = english.questions[index]!;
      assert.equal(l.language, language);
      assert.equal(l.locale, language === "hi" ? "hi-IN" : "pa-IN");
      assert.equal(l.laneId, laneId);
      assert.equal(l.canonicalAnswer, e.canonicalAnswer, `${laneId}/${language}: semantic class parity`);
      assert.equal(l.correctIndex, e.correctIndex, `${laneId}/${language}: correct index parity`);
      assert.notEqual(l.questionId, e.questionId, `${laneId}/${language}: question id must be language-aware`);
      assert.equal(l.statements.length, 2);
      assert.equal(l.options.length, 5);
      assert.equal(l.optionDetails.filter((option) => option.isCorrect).length, 1);
      assert.ok(l.stem.length >= 12);
      assert.ok(l.explanation.length >= 40);
      assert.doesNotMatch(l.stem, englishLeak, `${laneId}/${language}: English prose in stem`);
      assert.doesNotMatch(l.explanation, englishLeak, `${laneId}/${language}: English prose in explanation`);
      for (const statement of l.statements) {
        assert.doesNotMatch(statement.text, englishLeak, `${laneId}/${language}: English prose in statement`);
      }
      for (const option of l.options) {
        assert.doesNotMatch(option, englishLeak, `${laneId}/${language}: English prose in option`);
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

for (const [laneId, language] of [
  ["DSF-QS-TIME-WORK-PIPES", "hi"],
  ["DSF-QS-MENSURATION", "pa"],
] as const) {
  assert.equal(
    previewDsf001NormalQuestionStudioReview({ laneId, language, count: 1 }).questions[0]?.language,
    language,
  );
}

console.log(JSON.stringify({
  status: "PASS_DSF_CP019_QUANT_LOCALIZATION_WAVE_01",
  lanes: DSF_CP019_QUANT_LOCALIZED_LANES,
  languages: ["hi", "pa"],
  localizedSamples: DSF_CP019_QUANT_LOCALIZED_LANES.length * 2 * 8,
  englishControls: DSF_CP019_QUANT_LOCALIZED_LANES.length * 2 * 8,
  semanticParity: true,
  lifecycle: "REVIEW_ONLY",
  remainingQuantLocalizationLanes: 0,
}, null, 2));
