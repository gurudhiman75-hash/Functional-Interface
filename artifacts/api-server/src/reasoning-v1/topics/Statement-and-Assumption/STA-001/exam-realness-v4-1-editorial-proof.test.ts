import assert from "node:assert/strict";
import { STA_V41_CONTEXTS } from "./exam-realness-v4-1-contexts.ts";
import {
  STA_V4_PRESENTATION_PROFILES,
  STA_V4_QL_IDS,
  renderStaV41EditorialCandidate,
  renderStaV41EditorialStatement,
} from "./exam-realness-v4-1-editorial-runtime.ts";
import {
  generateStaV4Question,
  renderStaV41LearnerEnglishCandidate,
  renderStaV41LearnerEnglishStatement,
} from "./exam-realness-v4-1-learner-runtime.ts";

const bannedHi = [
  /करना के लिए/u,
  /शिकायतें से/u,
  /कतारें से/u,
  /कतारें का/u,
  /आवेदक में/u,
  /रोगी में/u,
  /यात्री की समीक्षा/u,
  /persuasive/iu,
  /confound/iu,
];
const bannedPa = [
  /ਕਰਨਾ ਲਈ/u,
  /ਅਰਜ਼ੀਦਾਰ ਵਿੱਚ/u,
  /ਮਰੀਜ਼ ਵਿੱਚ/u,
  /ਯਾਤਰੀ ਦੀ ਸਮੀਖਿਆ/u,
  /persuasive/iu,
  /confound/iu,
];
const bannedEn = [
  /[Kk]iosks provides/u,
  /claims is supported/iu,
  /requests for .* is mainly/iu,
  /numbers has/iu,
  /complaints warrants/iu,
  /support requests is/iu,
  /slots is driven/iu,
  /visits matters/iu,
  /prompts's/iu,
  /\bthe problem .* warrants\b/iu,
  /\bthe problem .* is mainly\b/iu,
  /\bthe intervention .* is reasonably\b/iu,
];
const bannedFinalHi = [
  /हस्तक्षेप/u,
  /लक्षित समूह/u,
  /सेवा माध्यम/u,
  /प्रदर्शन माप/u,
  /लक्षित लोग/u,
  /माध्यम “/u,
  /कार्य “/u,
  /तक पहुंचने के लिए .* उचित संबंध/u,
  /असर पड़ने और/u,
  /हासिल करें/u,
  /बताया गया “/u,
];
const bannedFinalPa = [
  /ਦਖ਼ਲ/u,
  /ਲਕਸ਼ਿਤ ਸਮੂਹ/u,
  /ਸੇਵਾ ਮਾਧਿਅਮ/u,
  /ਪ੍ਰਦਰਸ਼ਨ ਮਾਪ/u,
  /ਲਕਸ਼ਿਤ ਲੋਕ/u,
  /ਮਾਧਿਅਮ “/u,
  /ਕੰਮ “/u,
  /ਤੱਕ ਪਹੁੰਚਣ ਲਈ .* ਵਾਜਬ ਸੰਬੰਧ/u,
  /ਅਸਰ ਪੈਣ ਅਤੇ/u,
  /ਹਾਸਲ ਕਰੋ/u,
  /ਦੱਸਿਆ “/u,
];
const bannedGeneratedEn = [
  /Requests for support requests/u,
  /gain fewer repeat visits/u,
  /achieve fewer repeat visits/u,
  /Achieving fewer repeat visits/u,
  /producing fewer repeat visits/u,
  /expected effect of .* is relevant to/u,
];
const bannedGeneratedHi = [
  /कम दोबारा विज़िट/u,
  /कम समय वाले नवीनीकरण दौरे/u,
  /सेवा को “[^”]+” शुरू करना चाहिए/u,
  /अपेक्षित परिणाम “[^”]+” होगा/u,
  /वाला परिणाम मिलेगा/u,
  /प्रचारित “[^”]+” “[^”]+” उत्पन्न करने से संबंधित है/u,
];
const bannedGeneratedPa = [
  /ਘੱਟ ਦੁਬਾਰਾ ਦੌਰੇ/u,
  /ਛੋਟੇ ਨਵੀਨੀਕਰਨ ਦੌਰੇ/u,
  /ਸੇਵਾ ਨੂੰ “[^”]+” ਸ਼ੁਰੂ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ/u,
  /ਉਮੀਦ ਕੀਤਾ ਨਤੀਜਾ “[^”]+” ਹੋਵੇਗਾ/u,
  /ਵਾਲਾ ਨਤੀਜਾ ਮਿਲੇਗਾ/u,
  /ਪ੍ਰਚਾਰਿਤ “[^”]+” “[^”]+” ਪੈਦਾ ਕਰਨ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ/u,
];

function assertEditorialText(
  language: "en" | "hi" | "pa",
  text: string,
  scope: string,
  finalLearnerSurface = false,
): void {
  assert.ok(text.trim().length >= 8, `${scope}: editorial surface too short`);
  const patterns = language === "hi" ? bannedHi : language === "pa" ? bannedPa : bannedEn;
  for (const pattern of patterns) assert.equal(pattern.test(text), false, `${scope}: banned editorial fragment ${pattern} in '${text}'`);
  if (finalLearnerSurface && language === "hi") {
    for (const pattern of bannedFinalHi) assert.equal(pattern.test(text), false, `${scope}: internal/awkward Hindi learner fragment ${pattern} in '${text}'`);
  }
  if (finalLearnerSurface && language === "pa") {
    for (const pattern of bannedFinalPa) assert.equal(pattern.test(text), false, `${scope}: internal/awkward Punjabi learner fragment ${pattern} in '${text}'`);
  }
  if (language === "en" && finalLearnerSurface) {
    const firstLetter = /[A-Za-z]/u.exec(text)?.[0];
    assert.ok(firstLetter, `${scope}: English learner surface has no alphabetic text`);
    assert.equal(firstLetter, firstLetter.toUpperCase(), `${scope}: English learner surface must start with a capital letter: '${text}'`);
  }
}

function assertGeneratedFinalText(language: "en" | "hi" | "pa", text: string, scope: string): void {
  const patterns = language === "en" ? bannedGeneratedEn : language === "hi" ? bannedGeneratedHi : bannedGeneratedPa;
  for (const pattern of patterns) {
    assert.equal(pattern.test(text), false, `${scope}: final generated learner fragment ${pattern} in '${text}'`);
  }
}

for (const context of STA_V41_CONTEXTS) {
  for (const qlId of STA_V4_QL_IDS) {
    for (const language of ["en", "hi", "pa"] as const) {
      for (const index of [0, 1, 2] as const) {
        assertEditorialText(language, renderStaV41EditorialStatement(qlId, index, context, language), `${qlId}/${context.id}/${language}/R2-S${index}`);
      }
      if (language !== "en") {
        for (let candidateIndex = 1; candidateIndex <= 7; candidateIndex += 1) {
          for (const variantIndex of [0, 1] as const) {
            assertEditorialText(language, renderStaV41EditorialCandidate(
              qlId, candidateIndex, variantIndex, context, language, "English semantic authority surface",
            ), `${qlId}/${context.id}/${language}/R2-C${candidateIndex}/V${variantIndex}`);
          }
        }
      }
    }

    for (const statementIndex of [0, 1, 2] as const) {
      assertEditorialText(
        "en",
        renderStaV41LearnerEnglishStatement(qlId, statementIndex, context),
        `${qlId}/${context.id}/en/R5-S${statementIndex}`,
        true,
      );
    }
    for (let candidateIndex = 1; candidateIndex <= 7; candidateIndex += 1) {
      for (const variantIndex of [0, 1] as const) {
        assertEditorialText(
          "en",
          renderStaV41LearnerEnglishCandidate(qlId, candidateIndex, variantIndex, context),
          `${qlId}/${context.id}/en/R5-C${candidateIndex}/V${variantIndex}`,
          true,
        );
      }
    }
  }
}

for (const qlId of STA_V4_QL_IDS) {
  const reachedScenarios = new Set<string>();
  for (const profile of STA_V4_PRESENTATION_PROFILES) {
    for (let sample = 0; sample < 80; sample += 1) {
      const seed = `sta-v41-learner-r5:${qlId}:${profile.profileId}:${sample}`;
      const en = generateStaV4Question({ seed, locale: "en-IN", profileId: profile.profileId, qlId });
      const hi = generateStaV4Question({ seed, locale: "hi-IN", profileId: profile.profileId, qlId });
      const pa = generateStaV4Question({ seed, locale: "pa-IN", profileId: profile.profileId, qlId });
      reachedScenarios.add(en.scenarioId);
      assert.equal(hi.canonicalItemId, en.canonicalItemId, `${seed}: Hindi canonical identity drift`);
      assert.equal(pa.canonicalItemId, en.canonicalItemId, `${seed}: Punjabi canonical identity drift`);
      assert.equal(hi.contentFingerprint, en.contentFingerprint, `${seed}: Hindi fingerprint drift`);
      assert.equal(pa.contentFingerprint, en.contentFingerprint, `${seed}: Punjabi fingerprint drift`);
      assert.deepEqual(hi.answerSet, en.answerSet, `${seed}: Hindi answer-set drift`);
      assert.deepEqual(pa.answerSet, en.answerSet, `${seed}: Punjabi answer-set drift`);
      for (const question of [en, hi, pa]) {
        assertEditorialText(question.language, question.statement, `${seed}/${question.language}/statement`, true);
        assertGeneratedFinalText(question.language, question.statement, `${seed}/${question.language}/statement`);
        for (const candidate of question.candidates) {
          assertEditorialText(question.language, candidate.text, `${seed}/${question.language}/${candidate.candidateId}`, true);
          assertGeneratedFinalText(question.language, candidate.text, `${seed}/${question.language}/${candidate.candidateId}`);
        }
        assertEditorialText(question.language, question.explanation, `${seed}/${question.language}/explanation`, true);
        assertGeneratedFinalText(question.language, question.explanation, `${seed}/${question.language}/explanation`);
      }
    }
  }
  assert.equal(reachedScenarios.size, 18, `${qlId}: final learner sweep did not reach all 18 semantic contexts`);
}

console.log("PASS_STA_001_V4_1_LEARNER_R5");
