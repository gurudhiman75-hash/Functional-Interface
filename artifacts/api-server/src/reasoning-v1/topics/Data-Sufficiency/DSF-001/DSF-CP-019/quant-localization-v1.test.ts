import assert from "node:assert/strict";
import {
  DSF_CP019_QUANT_LOCALIZED_LANES,
  previewDsf001NormalQuestionStudioReview,
} from "../DSF-CP-017/question-studio-review-v1.ts";

const obviousEnglish = /\b(?:what|which|how|there|the|is|are|and|or|average|total|number|cost|price|interest|time|distance|speed|mixture|area|volume|statement|sufficient|greater|less|exactly|years?|workers?|students?)\b/iu;

for (const laneId of DSF_CP019_QUANT_LOCALIZED_LANES) {
  for (const language of ["hi", "pa"] as const) {
    const seed = `cp019:${laneId}:${language}`;
    const localized = previewDsf001NormalQuestionStudioReview({ laneId, language, seed, count: 3 });
    const english = previewDsf001NormalQuestionStudioReview({ laneId, language: "en", seed, count: 3 });

    assert.equal(localized.questions.length, 3);
    assert.equal(english.questions.length, 3);

    for (let index = 0; index < 3; index += 1) {
      const l = localized.questions[index]!;
      const e = english.questions[index]!;
      assert.equal(l.language, language);
      assert.equal(l.locale, language === "hi" ? "hi-IN" : "pa-IN");
      assert.equal(l.laneId, laneId);
      assert.equal(l.canonicalAnswer, e.canonicalAnswer, `${laneId}/${language}: semantic parity`);
      assert.equal(l.correctIndex, e.correctIndex, `${laneId}/${language}: correct-index parity`);
      assert.notEqual(l.questionId, e.questionId, `${laneId}/${language}: language-aware ID`);
      assert.equal(l.statements.length, 2);
      assert.equal(l.options.length, 5);
      assert.equal(l.optionDetails.filter((option) => option.isCorrect).length, 1);
      assert.ok(l.stem.length >= 8);
      assert.ok(l.explanation.length >= 30);
      assert.doesNotMatch(l.stem, obviousEnglish, `${laneId}/${language}: English prose in stem`);
      assert.doesNotMatch(l.questionPrompt, obviousEnglish, `${laneId}/${language}: English prose in prompt`);
      assert.doesNotMatch(l.explanation, obviousEnglish, `${laneId}/${language}: English prose in explanation`);
      for (const statement of l.statements) assert.doesNotMatch(statement.text, obviousEnglish, `${laneId}/${language}: English prose in statement`);
      for (const option of l.options) assert.doesNotMatch(option, obviousEnglish, `${laneId}/${language}: English prose in option`);
      assert.equal(l.reviewOnly, true);
      assert.equal(l.questionBankWritable, false);
      assert.equal(l.testEligible, false);
      assert.equal(l.mockTestEligible, false);
      assert.equal(l.publiclyPublishable, false);
      assert.equal(l.automaticStudentPublication, false);
    }
  }
}

const mixedHi = previewDsf001NormalQuestionStudioReview({ language: "hi", seed: "cp019:mixed-hi", count: 30 });
const mixedPa = previewDsf001NormalQuestionStudioReview({ language: "pa", seed: "cp019:mixed-pa", count: 30 });
assert.ok(new Set(mixedHi.questions.map((q) => q.laneId)).size >= 12);
assert.ok(new Set(mixedPa.questions.map((q) => q.laneId)).size >= 12);

console.log(JSON.stringify({
  status: "PASS_DSF_CP019_QUANT_HI_PA_LOCALIZATION_REVIEW_V1",
  quantLocalizedLanes: DSF_CP019_QUANT_LOCALIZED_LANES.length,
  localizedLanguages: ["hi", "pa"],
  directLocalizedSamples: DSF_CP019_QUANT_LOCALIZED_LANES.length * 2 * 3,
  mixedSamples: 60,
  semanticParity: true,
  ql001TwoStatementSurfaceFullyTrilingual: true,
  lifecycle: "REVIEW_ONLY",
}, null, 2));
