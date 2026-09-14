import assert from "node:assert/strict";
import {
  generatePhysicsLocalizedCpV1,
  generatePhysicsLocalizedBalancedReviewV1,
  SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_CPS,
  SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_LOCALES,
} from "./sci-physics-localization-generator-v1";
import { SCI_PHYSICS_EXPLANATION_QUALITY_V2 } from "./sci-physics-explanation-quality-v2";

const bannedEnglishWords = /\b(which|what|the|is|are|distance|displacement|speed|velocity|acceleration|force|mass|momentum|friction|pressure|work|energy|temperature|statement|correct|incorrect)\b/i;
const deprecatedPunjabiAcceleration = /ਤ੍ਵਰਨ/u;
const massAsWeightMisuse = /ਸਥਿਰ ਭਾਰ|ਭਾਰ ਅਤੇ ਵੇਗ|ਭਾਰ ਅਤੇ ਪ੍ਰਵੇਗ|ਪ੍ਰਤੀ ਇਕਾਈ ਭਾਰ|ਘਣਤਾ = ਭਾਰ\/|ਕੇਵਲ ਭਾਰ ਤੇ|ਭਾਰ ਬਦਲਦਾ|ਭਾਰ ਵਾਲੀ ਵਸਤੂ|ਭਾਰ ਘਟਾਉਂਦੀ ਹੈ|ਕੁੱਲ ਬਲ ਉਸ ਦੇ ਭਾਰ ਦੇ ਬਰਾਬਰ/u;
const hindiCalquePunjabi = /ਆਵ੍ਰਿਤੀ|ਅਲਪਤਮ ਅੰਕ|ਯਾਦ੍ਰਿਚਛਿਕ|ਪ੍ਰਣਾਲੀਗਤ ਗਲਤੀ|ਪ੍ਰਣਾਲੀਬੱਧ ਗਲਤੀ|ਆਯਾਮੀ ਸੂਤਰ|ਵਿਉਤਪੰਨ ਇਕਾਈ|ਉਤਪੰਨ ਇਕਾਈ|ਊਸ਼ਮਾਗਤਿਕ|ਤਾਪਗਤਿਕ|ਅਭਿਕੇਂਦਰੀ ਬਲ|ਕੇਂਦਰਾਭਿਮੁਖ|ਪ੍ਰਤਿਕਸ਼ੇਪ|ਸੀਮਾਂਤ|ਪਰਿਪਥ|ਵਿਦਿਉਤ|ਪਰਿਸ਼ੁੱਧਤਾ|ਯਥਾਰਥਤਾ|ਵਿਗਿਆਨਕ ਸੰਕੇਤਨ|ਸਾਪੇਖ ਘਣਤਾ|ਸਦਿਸ਼|ਅਦਿਸ਼|ਆਵੇਗ|ਪਰਸਪਰ|ਪ੍ਰਵਿਰਤੀ|ਵਿਸ਼ਰਾਮ|ਬੀਜਗਣਿਤੀ|ਅਣੂਈ|ਸੰਰਕਸ਼ਣ|ਸਪਰਸ਼ ਰੇਖਾ|ਸਮਾਨ ਸਰਕੁਲਰ ਗਤੀ|ਰੇਖੀ ਸੰਵੇਗ/u;
const hindiShapedExamPunjabi = /ਕਥਨ|ਕੇਵਲ|ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ/u;
const punjabiGrammarArtifacts = /ਮਾਤਰਾਆਂ|ਦਾ ਮਾਤਰਾ|ਦੇ ਮਾਤਰਾ|ਦਿਸ਼ਾਵਾਂ ਬਦਲਾਅ|ਸ਼ੁੱਧ ਬਾਹਰੀ ਬਲ|ਸ਼ੁੱਧ ਅੰਦਰ ਵੱਲ ਬਲ|ਵਰਤੁਲ|ਚਿਕਨਾਹਟ|ਕ੍ਰਿਆ ਅਤੇ ਪ੍ਰਤੀਕ੍ਰਿਆ/u;

assert.equal(Object.keys(SCI_PHYSICS_EXPLANATION_QUALITY_V2).length, 48, "Explanation-quality V2 must cover all 48 CP001-CP002 anchors");
for (const [anchorId, localized] of Object.entries(SCI_PHYSICS_EXPLANATION_QUALITY_V2)) {
  for (const locale of SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_LOCALES) {
    const explanation = localized[locale];
    const sentenceCount = (explanation.match(/[.!?।]/gu) ?? []).length;
    assert.ok(explanation.length >= 70, `${anchorId}/${locale}: explanation is still too short`);
    assert.ok(sentenceCount >= 2, `${anchorId}/${locale}: explanation must teach in at least two sentences`);
  }
}

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
      assert.ok(question.explanation.length >= 70, `${question.questionId}: rendered explanation is too short`);
      if (question.family === "direct-anchor") {
        const sentenceCount = (question.explanation.match(/[.!?।]/gu) ?? []).length;
        assert.ok(sentenceCount >= 2, `${question.questionId}: direct explanation must contain at least two teaching sentences`);
      }
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
        assert.equal(hindiCalquePunjabi.test(learnerText), false, `${question.questionId}: Hindi-calque Punjabi terminology leaked`);
        assert.equal(hindiShapedExamPunjabi.test(learnerText), false, `${question.questionId}: Hindi-shaped exam instruction leaked`);
        assert.equal(punjabiGrammarArtifacts.test(learnerText), false, `${question.questionId}: Punjabi grammar artifact leaked`);
      }
    });
    if (locale === "pa") {
      const corpus = questions.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join("\n");
      assert.match(corpus, /ਬਿਆਨ/u, `${cpId}/pa: natural Punjabi statement term ਬਿਆਨ missing`);
      assert.match(corpus, /ਸਿਰਫ਼/u, `${cpId}/pa: natural Punjabi restrictive term ਸਿਰਫ਼ missing`);
      assert.match(corpus, /ਲੀਸਟ ਕਾਊਂਟ|ਫ੍ਰਿਕਵੈਂਸੀ|ਡਾਇਮੈਂਸ਼ਨਲ ਫਾਰਮੂਲਾ|ਸਾਇੰਟਿਫਿਕ ਨੋਟੇਸ਼ਨ|ਇੰਪਲਸ/u, `${cpId}/pa: expected natural technical register missing`);
    }
    if (locale === "pa" && cpId === "SCI-CP-002") {
      const corpus = questions.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join("\n");
      assert.match(corpus, /ਪੁੰਜ/u, `${cpId}/pa: Punjabi mass term ਪੁੰਜ missing`);
      assert.match(corpus, /ਪ੍ਰਵੇਗ/u, `${cpId}/pa: Punjabi acceleration term ਪ੍ਰਵੇਗ missing`);
      assert.match(corpus, /ਭਾਰ-ਬਲ/u, `${cpId}/pa: genuine weight terminology should remain distinct`);
      assert.match(corpus, /ਸੈਂਟ੍ਰਿਪੀਟਲ ਬਲ/u, `${cpId}/pa: natural centripetal-force term missing`);
      assert.match(corpus, /ਇਕਸਾਰ ਗੋਲ ਗਤੀ/u, `${cpId}/pa: natural circular-motion wording missing`);
    }
  }
}
console.log("SCI Physics localization V1 qualification passed: CP001-CP002 × EN/HI/PA with explanation-depth V2 and Punjabi-naturalization V3");
