import assert from "node:assert/strict";
import {
  generatePhysicsLocalizedCpV1,
  generatePhysicsLocalizedBalancedReviewV1,
  SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_CPS,
  SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_LOCALES,
} from "./sci-physics-localization-generator-v1";
import { SCI_PHYSICS_EXPLANATION_QUALITY_V2 } from "./sci-physics-explanation-quality-v2";
import { SCI_PHYSICS_EXPLANATION_QUALITY_V3 } from "./sci-physics-explanation-quality-v3";
import { SCI_PHYSICS_EXPLANATION_QUALITY_V4 } from "./sci-physics-explanation-quality-v4";
import { SCI_PHYSICS_EXPLANATION_QUALITY_V5 } from "./sci-physics-explanation-quality-v5";

const bannedEnglishWords = /\b(which|what|the|is|are|distance|displacement|speed|velocity|acceleration|force|mass|momentum|friction|pressure|work|energy|temperature|statement|correct|incorrect)\b/i;
const deprecatedPunjabiAcceleration = /ਤ੍ਵਰਨ/u;
const massAsWeightMisuse = /ਸਥਿਰ ਭਾਰ|ਭਾਰ ਅਤੇ ਵੇਗ|ਭਾਰ ਅਤੇ ਪ੍ਰਵੇਗ|ਪ੍ਰਤੀ ਇਕਾਈ ਭਾਰ|ਘਣਤਾ = ਭਾਰ\/|ਕੇਵਲ ਭਾਰ ਤੇ|ਭਾਰ ਬਦਲਦਾ|ਭਾਰ ਵਾਲੀ ਵਸਤੂ|ਭਾਰ ਘਟਾਉਂਦੀ ਹੈ|ਕੁੱਲ ਬਲ ਉਸ ਦੇ ਭਾਰ ਦੇ ਬਰਾਬਰ/u;
const needlessEnglishizedPunjabi = /ਡਿਰਾਈਵਡ ਇਕਾਈ|ਫ੍ਰਿਕਵੈਂਸੀ|ਲੀਸਟ ਕਾਊਂਟ|ਸਿਸਟਮੈਟਿਕ ਗਲਤੀ|ਰੈਂਡਮ ਗਲਤੀ|ਡਾਇਮੈਂਸ਼ਨਲ ਫਾਰਮੂਲਾ|ਸਾਇੰਟਿਫਿਕ ਨੋਟੇਸ਼ਨ|ਸਿਗਨਿਫਿਕੈਂਟ ਫਿਗਰ|ਪ੍ਰੀਫਿਕਸ|ਰਿਲੇਟਿਵ ਡੈਨਸਿਟੀ|ਵੇਕਟਰ|ਸਕੇਲਰ|ਇੰਪਲਸ|ਸੈਂਟ੍ਰਿਪੀਟਲ ਬਲ|ਸਰਕੁਲਰ ਗਤੀ|ਕਾਇਨੇਟਿਕ ਊਰਜਾ|ਪੋਟੈਂਸ਼ਲ ਊਰਜਾ|ਪਾਜ਼ਿਟਿਵ|ਨੈਗੇਟਿਵ|ਗ੍ਰੈਵਿਟੀ|ਨੈੱਟ ਵਿਸਥਾਪਨ|ਨਾਰਮਲ ਬਲ|ਟਰਮੀਨਲ ਚਾਲ|ਜ਼ੀਰੋ ਐਰਰ|ਸਿਸਟਮ|ਰਿਫ੍ਰੈਕਸ਼ਨ|ਰਿਫਲੈਕਸ਼ਨ|ਰਿਫ੍ਰੈਕਟਿਵ ਇੰਡੈਕਸ|ਰੇਜ਼ਿਸਟੈਂਸ|ਰਜ਼ਿਸਟਿਵਿਟੀ|ਪੋਟੈਂਸ਼ਲ ਡਿਫਰੈਂਸ|ਇਲੈਕਟ੍ਰਿਕ ਕਰੰਟ|ਸੀਰੀਜ਼ ਸਰਕਟ|ਪੈਰਲਲ ਸਰਕਟ/u;
const genuinelyAwkwardPunjabi = /ਮਾਤਰਾਆਂ|ਦਾ ਮਾਤਰਾ|ਦੇ ਮਾਤਰਾ|ਦਿਸ਼ਾਵਾਂ ਬਦਲਾਅ|ਸ਼ੁੱਧ ਬਾਹਰੀ ਬਲ|ਸ਼ੁੱਧ ਅੰਦਰ ਵੱਲ ਬਲ|ਚਿਕਨਾਹਟ|ਕ੍ਰਿਆ ਅਤੇ ਪ੍ਰਤੀਕ੍ਰਿਆ|ਬਣਾਈ ਰੱਖਣ ਦੀ ਇਹ ਰੁਝਾਨ|ਗਹਿਰਾਈ|ਲਾਭਕਾਰੀ ਨਿਕਾਸੀ|ਵੱਡੀ ਅਰਧ-ਵਿਆਸ|ਵੱਡੇ ਪਹੀਏ ਦੀ ਅਰਧ-ਵਿਆਸ|ਬਲ-ਲਗਾਇਆ ਦੋਲਨ|ਘਣਤਾ ਕਿਸ ਪ੍ਰਤੀ ਇਕਾਈ ਪੁੰਜ|ਦਬਾਅ ਕਿਸ ਪ੍ਰਤੀ ਇਕਾਈ ਬਲ|ਪ੍ਰਤਿਧੁਨੀ-ਸਥਾਇਤਾ|ਅਵਸ਼੍ਰਵਣ|ਪਰਾਸ਼੍ਰਵਣ|ਤਾਰਤਾ|ਕਲੀਨੀਕਲ ਥਰਮਾਮੀਟਰ ਦਾ ਮੁੱਖ ਵਰਤੋਂ/u;
const awkwardHindiExamPhrasing = /मशीन की दक्षता उपयोगी निर्गत कार्य और किसके अनुपात|सरल मशीन का वेग अनुपात प्रयास द्वारा चली दूरी और किसके द्वारा चली दूरी|ढलवाँ तल आवश्यक प्रयास को किसे बढ़ाकर|घनत्व किसके प्रति इकाई द्रव्यमान|दाब किसके प्रति इकाई बल|तारता|अनुनादिता/u;

function qualifyExplanationSet(label: string, set: Readonly<Record<string, Readonly<Record<string, string>>>>, expected: number) {
  assert.equal(Object.keys(set).length, expected, `${label}: explanation anchor count drift`);
  for (const [anchorId, localized] of Object.entries(set)) {
    for (const locale of SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_LOCALES) {
      const explanation = localized[locale];
      const sentenceCount = (explanation.match(/[.!?।]/gu) ?? []).length;
      assert.ok(explanation.length >= 70, `${anchorId}/${locale}: explanation is too short`);
      assert.ok(sentenceCount >= 2, `${anchorId}/${locale}: explanation must teach in at least two sentences`);
    }
  }
}

qualifyExplanationSet("V2 CP001-CP002", SCI_PHYSICS_EXPLANATION_QUALITY_V2, 48);
qualifyExplanationSet("V3 CP003-CP004", SCI_PHYSICS_EXPLANATION_QUALITY_V3, 48);
qualifyExplanationSet("V4 CP005-CP006", SCI_PHYSICS_EXPLANATION_QUALITY_V4, 48);
qualifyExplanationSet("V5 CP007-CP008", SCI_PHYSICS_EXPLANATION_QUALITY_V5, 48);
assert.deepEqual(SCI_PHYSICS_LOCALIZATION_V1_SUPPORTED_CPS, [
  "SCI-CP-001", "SCI-CP-002", "SCI-CP-003", "SCI-CP-004",
  "SCI-CP-005", "SCI-CP-006", "SCI-CP-007", "SCI-CP-008",
]);

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
        const learnerText = `${question.stem} ${question.options.join(" ")} ${question.explanation}`;
        assert.match(question.stem + question.explanation, /[\u0900-\u097F]/u, `${question.questionId}: Hindi script missing`);
        assert.equal(bannedEnglishWords.test(question.stem + " " + question.explanation), false, `${question.questionId}: English leakage in Hindi`);
        assert.equal(awkwardHindiExamPhrasing.test(learnerText), false, `${question.questionId}: awkward Hindi exam phrasing leaked`);
      }
      if (locale === "pa") {
        const learnerText = `${question.stem} ${question.options.join(" ")} ${question.explanation}`;
        assert.match(question.stem + question.explanation, /[\u0A00-\u0A7F]/u, `${question.questionId}: Punjabi script missing`);
        assert.equal(bannedEnglishWords.test(question.stem + " " + question.explanation), false, `${question.questionId}: English prose leakage in Punjabi`);
        assert.equal(deprecatedPunjabiAcceleration.test(learnerText), false, `${question.questionId}: deprecated acceleration spelling leaked`);
        assert.equal(massAsWeightMisuse.test(learnerText), false, `${question.questionId}: mass/weight terminology conflated`);
        assert.equal(needlessEnglishizedPunjabi.test(learnerText), false, `${question.questionId}: established Punjabi exam term was unnecessarily Englishized`);
        assert.equal(genuinelyAwkwardPunjabi.test(learnerText), false, `${question.questionId}: Punjabi grammar/editorial artifact leaked`);
      }
    });
    if (locale === "pa") {
      const corpus = questions.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join("\n");
      assert.match(corpus, /ਬਿਆਨ/u, `${cpId}/pa: Punjabi exam instruction ਬਿਆਨ missing`);
      assert.match(corpus, /ਸਿਰਫ਼/u, `${cpId}/pa: Punjabi restrictive term ਸਿਰਫ਼ missing`);
      if (cpId === "SCI-CP-001") {
        assert.match(corpus, /ਵਿਉਤਪੰਨ ਇਕਾਈ/u); assert.match(corpus, /ਆਵਿਰਤੀ/u); assert.match(corpus, /ਸਾਰਥਕ ਅੰਕ/u);
        assert.match(corpus, /ਆਯਾਮੀ ਸੂਤਰ/u); assert.match(corpus, /ਸਾਪੇਖ ਘਣਤਾ/u); assert.match(corpus, /ਸਦਿਸ਼ ਰਾਸ਼ੀ/u); assert.match(corpus, /ਅਦਿਸ਼ ਰਾਸ਼ੀ/u);
      }
      if (cpId === "SCI-CP-002") {
        assert.match(corpus, /ਪੁੰਜ/u); assert.match(corpus, /ਪ੍ਰਵੇਗ/u); assert.match(corpus, /ਭਾਰ-ਬਲ/u); assert.match(corpus, /ਆਵੇਗ/u);
        assert.match(corpus, /ਕੇਂਦਰਗਾਮੀ ਬਲ/u); assert.match(corpus, /ਇਕਸਾਰ ਵਰਤੂਲ ਗਤੀ/u); assert.match(corpus, /ਗਤਿਜ ਊਰਜਾ/u); assert.match(corpus, /ਅਲੱਗ-ਥਲੱਗ ਪ੍ਰਣਾਲੀ/u);
      }
      if (cpId === "SCI-CP-003") {
        assert.match(corpus, /ਯਾਂਤ੍ਰਿਕ ਕੰਮ/u); assert.match(corpus, /ਗਤਿਜ ਊਰਜਾ/u); assert.match(corpus, /ਸਥਿਤਿਜ ਊਰਜਾ/u);
        assert.match(corpus, /ਸ਼ਕਤੀ/u); assert.match(corpus, /ਦੱਖਤਾ/u); assert.match(corpus, /ਯਾਂਤ੍ਰਿਕ ਲਾਭ/u);
      }
      if (cpId === "SCI-CP-004") {
        assert.match(corpus, /ਪੁੰਜ/u); assert.match(corpus, /ਭਾਰ-ਬਲ/u); assert.match(corpus, /ਮੁਕਤ ਪਤਨ/u);
        assert.match(corpus, /ਸਾਪੇਖ ਘਣਤਾ/u); assert.match(corpus, /ਉੱਪਲਾਵਨ ਬਲ/u); assert.match(corpus, /ਸਤਹ ਤਣਾਅ/u); assert.match(corpus, /ਸ਼ਿਆਨਤਾ/u);
      }
      if (cpId === "SCI-CP-005") {
        assert.match(corpus, /ਤਾਪਮਾਨ/u); assert.match(corpus, /ਤਾਪੀ ਸੰਤੁਲਨ/u); assert.match(corpus, /ਚਾਲਨ/u);
        assert.match(corpus, /ਸੰਵਹਨ/u); assert.match(corpus, /ਵਿਕਿਰਣ/u); assert.match(corpus, /ਵਿਸ਼ੇਸ਼ ਤਾਪ/u); assert.match(corpus, /ਗੁਪਤ ਤਾਪ/u);
      }
      if (cpId === "SCI-CP-006") {
        assert.match(corpus, /ਯਾਂਤ੍ਰਿਕ ਤਰੰਗ/u); assert.match(corpus, /ਅਨੁਦੈਰਘੀ/u); assert.match(corpus, /ਆਵਿਰਤੀ/u);
        assert.match(corpus, /ਆਯਾਮ/u); assert.match(corpus, /ਪਿੱਚ/u); assert.match(corpus, /ਤਰੰਗ ਲੰਬਾਈ/u);
        assert.match(corpus, /ਨੀਮ ਧੁਨੀ/u); assert.match(corpus, /ਪਰਾ-ਧੁਨੀ/u); assert.match(corpus, /ਪ੍ਰਤਿਧੁਨੀ/u); assert.match(corpus, /ਗੂੰਜ/u); assert.match(corpus, /ਅਨੁਨਾਦ/u);
      }
      if (cpId === "SCI-CP-007") {
        assert.match(corpus, /ਪਰਾਵਰਤਨ/u); assert.match(corpus, /ਅਪਵਰਤਨ/u); assert.match(corpus, /ਅਪਵਰਤਨਾਂਕ/u);
        assert.match(corpus, /ਪੂਰਨ ਅੰਦਰੂਨੀ ਪਰਾਵਰਤਨ/u); assert.match(corpus, /ਅਵਤਲ ਦਰਪਣ/u); assert.match(corpus, /ਉੱਤਲ ਦਰਪਣ/u);
        assert.match(corpus, /ਅਭਿਸਾਰੀ ਲੈਂਸ/u); assert.match(corpus, /ਅਪਸਾਰੀ ਲੈਂਸ/u); assert.match(corpus, /ਵਰਣ-ਵਿਖੇਪਣ/u); assert.match(corpus, /ਪ੍ਰਕੀਰਨ/u);
      }
      if (cpId === "SCI-CP-008") {
        assert.match(corpus, /ਬਿਜਲਈ ਚਾਰਜ/u); assert.match(corpus, /ਬਿਜਲਈ ਧਾਰਾ/u); assert.match(corpus, /ਵਿਭਵ ਅੰਤਰ/u);
        assert.match(corpus, /ਪ੍ਰਤੀਰੋਧ/u); assert.match(corpus, /ਪ੍ਰਤੀਰੋਧਕਤਾ/u); assert.match(corpus, /ਲੜੀਵਾਰ ਸਰਕਟ/u);
        assert.match(corpus, /ਸਮਾਂਤਰ ਸਰਕਟ/u); assert.match(corpus, /ਬਿਜਲਈ ਸ਼ਕਤੀ/u); assert.match(corpus, /ਕਿਲੋਵਾਟ-ਘੰਟਾ/u); assert.match(corpus, /ਭੂ-ਸੰਪਰਕ/u);
      }
    }
  }
}
console.log("SCI Physics localization V1 qualification passed: CP001-CP008 × EN/HI/PA with explanation depth and native exam-level Hindi/Punjabi");
