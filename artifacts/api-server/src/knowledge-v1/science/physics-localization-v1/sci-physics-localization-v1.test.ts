import assert from "node:assert/strict";
import {
  generatePhysicsLocalizedCpV1,
  generatePhysicsLocalizedBalancedReviewV1,
  SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_CPS,
  SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_LOCALES,
} from "./sci-physics-localization-generator-v1";

const bannedEnglishWords = /\b(which|what|the|is|are|distance|displacement|speed|velocity|acceleration|force|mass|momentum|friction|pressure|work|energy|temperature|statement|correct|incorrect)\b/i;

for (const cpId of SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_CPS) {
  const english = generatePhysicsLocalizedCpV1(cpId, "en");
  assert.equal(english.length, 348, `${cpId}: English capacity drift`);
  for (const locale of SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_LOCALES) {
    const questions = generatePhysicsLocalizedCpV1(cpId, locale);
    assert.equal(questions.length, 348, `${cpId}/${locale}: capacity drift`);
    assert.equal(new Set(questions.map((q) => q.questionId)).size, 348, `${cpId}/${locale}: duplicate ids`);
    assert.equal(generatePhysicsLocalizedBalancedReviewV1(cpId, locale).length, 60, `${cpId}/${locale}: review size drift`);
    questions.forEach((question, index) => {
      const base = english[index];
      assert.equal(question.cpId, base.cpId, `${question.questionId}: CP parity`);
      assert.equal(question.family, base.family, `${question.questionId}: family parity`);
      assert.equal(question.difficulty, base.difficulty, `${question.questionId}: difficulty parity`);
      assert.deepEqual(question.anchorIds, base.anchorIds, `${question.questionId}: anchor parity`);
      assert.deepEqual(question.sourceIds, base.sourceIds, `${question.questionId}: source parity`);
      assert.equal(question.correctIndex, base.correctIndex, `${question.questionId}: answer-position parity`);
      assert.equal(question.options.length, 4, `${question.questionId}: option count`);
      assert.equal(new Set(question.options).size, 4, `${question.questionId}: duplicate options`);
      assert.equal(question.options[question.correctIndex], question.canonicalAnswer, `${question.questionId}: answer key`);
      assert.equal(question.reviewOnly, true, `${question.questionId}: review lock`);
      assert.equal(question.runtimeRegistered, false, `${question.questionId}: runtime lock`);
      if (locale === "hi") {
        assert.match(question.stem + question.explanation, /[\u0900-\u097F]/u, `${question.questionId}: Hindi script missing`);
        assert.equal(bannedEnglishWords.test(question.stem + " " + question.explanation), false, `${question.questionId}: English leakage in Hindi`);
      }
      if (locale === "pa") {
        assert.match(question.stem + question.explanation, /[\u0A00-\u0A7F]/u, `${question.questionId}: Punjabi script missing`);
        assert.equal(bannedEnglishWords.test(question.stem + " " + question.explanation), false, `${question.questionId}: English leakage in Punjabi`);
      }
    });
  }
}
console.log("SCI Physics localization V1 qualification passed: CP001-CP002 × EN/HI/PA");
