import assert from "node:assert/strict";
import {
  generatePhysicsLocalizedCpV1,
  generatePhysicsLocalizedBalancedReviewV1,
  SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_CPS,
  SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_LOCALES,
} from "./sci-physics-localization-generator-v1";

const bannedEnglishWords = /\b(which|what|the|is|are|distance|displacement|speed|velocity|acceleration|force|mass|momentum|friction|pressure|work|energy|temperature|statement|correct|incorrect)\b/i;
const deprecatedPunjabiAcceleration = /ਤ੍ਵਰਨ/u;
const massAsWeightMisuse = /ਸਥਿਰ ਭਾਰ|ਭਾਰ ਅਤੇ ਵੇਗ|ਪ੍ਰਤੀ ਇਕਾਈ ਭਾਰ|ਘਣਤਾ = ਭਾਰ\/|ਕੇਵਲ ਭਾਰ ਤੇ|ਭਾਰ ਬਦਲਦਾ|ਭਾਰ ਵਾਲੀ ਵਸਤੂ|ਕੁੱਲ ਬਲ ਉਸ ਦੇ ਭਾਰ ਦੇ ਬਰਾਬਰ/u;

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
        const learnerText = `${question.stem} ${question.options.join(" ")} ${question.explanation}`;
        assert.match(question.stem + question.explanation, /[\u0A00-\u0A7F]/u, `${question.questionId}: Punjabi script missing`);
        assert.equal(bannedEnglishWords.test(question.stem + " " + question.explanation), false, `${question.questionId}: English leakage in Punjabi`);
        assert.equal(deprecatedPunjabiAcceleration.test(learnerText), false, `${question.questionId}: deprecated Punjabi acceleration term leaked`);
        assert.equal(massAsWeightMisuse.test(learnerText), false, `${question.questionId}: mass/weight terminology conflated`);
      }
    });
    if (locale === "pa" && cpId === "SCI-CP-002") {
      const corpus = questions.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join("\n");
      assert.match(corpus, /ਪੁੰਜ/u, `${cpId}/pa: Punjabi mass term ਪੁੰਜ missing`);
      assert.match(corpus, /ਪ੍ਰਵੇਗ/u, `${cpId}/pa: Punjabi acceleration term ਪ੍ਰਵੇਗ missing`);
      assert.match(corpus, /ਭਾਰ-ਬਲ/u, `${cpId}/pa: genuine weight terminology should remain distinct`);
    }
  }
}
console.log("SCI Physics localization V1 qualification passed: CP001-CP002 × EN/HI/PA");
