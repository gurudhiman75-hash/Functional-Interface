import assert from "node:assert/strict";
import {
  DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE,
  DSF_CP019_QUANT_LOCALIZED_WAVE_02_LANES,
  previewDsf001NormalQuestionStudioReview,
} from "../DSF-CP-017/question-studio-review-v1.ts";

const englishLeak = /\b(?:the|is|are|was|were|what|which|how|from|with|and|or|only|statement|sufficient|distance|speed|time|train|boat|stream|water|work|worker|job|pipe|tank|fill|empty|mixture|grade|cost|quantity|mean|ratio|area|volume|radius|diameter|height|length|breadth|perimeter|circumference|equation|value|input|output|target|bound|divisor|remainder|coefficient|constant|solution|first|second|metres|seconds|hours|days|unit|greater|less|least|most)\b/iu;

for (const laneId of DSF_CP019_QUANT_LOCALIZED_WAVE_02_LANES) {
  for (const language of ["hi", "pa"] as const) {
    const seed = `cp019-wave02:${laneId}:${language}`;
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

    assert.equal(localized.questions.length, 8, `${laneId}/${language}: localized batch size`);
    assert.equal(english.questions.length, 8, `${laneId}/en: control batch size`);

    for (let index = 0; index < localized.questions.length; index += 1) {
      const l = localized.questions[index]!;
      const e = english.questions[index]!;
      assert.equal(l.language, language);
      assert.equal(l.locale, language === "hi" ? "hi-IN" : "pa-IN");
      assert.equal(l.laneId, laneId);
      assert.equal(l.canonicalAnswer, e.canonicalAnswer, `${laneId}/${language}: semantic class parity`);
      assert.equal(l.correctIndex, e.correctIndex, `${laneId}/${language}: correct-index parity`);
      assert.notEqual(l.questionId, e.questionId, `${laneId}/${language}: language-aware question id`);
      assert.equal(l.statements.length, 2);
      assert.equal(l.options.length, 5);
      assert.equal(l.optionDetails.filter((option) => option.isCorrect).length, 1);
      assert.ok(l.stem.trim().length >= 10);
      assert.ok(l.explanation.trim().length >= 35);
      assert.doesNotMatch(l.stem, englishLeak, `${laneId}/${language}: English prose in stem`);
      assert.doesNotMatch(l.explanation, englishLeak, `${laneId}/${language}: English prose in explanation`);
      for (const statement of l.statements) {
        assert.ok(statement.text.trim().length >= 4);
        assert.doesNotMatch(statement.text, englishLeak, `${laneId}/${language}: English prose in statement`);
      }
      for (const option of l.options) {
        assert.doesNotMatch(option, englishLeak, `${laneId}/${language}: English prose in option`);
      }
      assert.equal(l.reviewOnly, true);
      assert.equal(l.manualApprovalRequired, true);
      assert.equal(l.questionBankWritable, false);
      assert.equal(l.testEligible, false);
      assert.equal(l.mockTestEligible, false);
      assert.equal(l.publiclyPublishable, false);
      assert.equal(l.automaticStudentPublication, false);
    }
  }
}

assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.canonicalProblems.length, 21);
for (const problem of DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.canonicalProblems) {
  assert.deepEqual(problem.supportedLanguages, ["en", "hi", "pa"], `${problem.id}: all-lane multilingual review support`);
}

const hindiMixed = previewDsf001NormalQuestionStudioReview({
  language: "hi",
  seed: "cp019-wave02:all-lane-hi",
  count: 50,
});
const punjabiMixed = previewDsf001NormalQuestionStudioReview({
  language: "pa",
  seed: "cp019-wave02:all-lane-pa",
  count: 50,
});
assert.ok(new Set(hindiMixed.questions.map((q) => q.laneId)).size >= 12);
assert.ok(new Set(punjabiMixed.questions.map((q) => q.laneId)).size >= 12);
assert.equal(hindiMixed.questions.every((q) => q.language === "hi"), true);
assert.equal(punjabiMixed.questions.every((q) => q.language === "pa"), true);

console.log(JSON.stringify({
  status: "PASS_DSF_CP019_QUANT_LOCALIZATION_WAVE_02",
  wave02Lanes: DSF_CP019_QUANT_LOCALIZED_WAVE_02_LANES.length,
  localizedSamples: DSF_CP019_QUANT_LOCALIZED_WAVE_02_LANES.length * 2 * 8,
  englishControls: DSF_CP019_QUANT_LOCALIZED_WAVE_02_LANES.length * 2 * 8,
  allQuestionStudioLanes: DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.canonicalProblems.length,
  allLaneLanguages: ["en", "hi", "pa"],
  multilingualReviewCoverageComplete: true,
  lifecycle: "REVIEW_ONLY",
  ql002StillDeferred: true,
}, null, 2));
