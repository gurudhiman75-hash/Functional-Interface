import assert from "node:assert/strict";
import { STA_V41_CONTEXTS } from "./exam-realness-v4-1-contexts.ts";
import {
  STA_V4_PRESENTATION_PROFILES,
  STA_V4_QL_IDS,
  generateStaV4Question,
  renderStaV41EditorialCandidate,
  renderStaV41EditorialStatement,
} from "./exam-realness-v4-1-editorial-runtime.ts";

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
const bannedEn = [/[Kk]iosks provides/u];

function assertEditorialText(language: "en" | "hi" | "pa", text: string, scope: string): void {
  assert.ok(text.trim().length >= 8, `${scope}: editorial surface too short`);
  const patterns = language === "hi" ? bannedHi : language === "pa" ? bannedPa : bannedEn;
  for (const pattern of patterns) assert.equal(pattern.test(text), false, `${scope}: banned editorial fragment ${pattern} in '${text}'`);
}

for (const context of STA_V41_CONTEXTS) {
  for (const qlId of STA_V4_QL_IDS) {
    for (const language of ["en", "hi", "pa"] as const) {
      for (const index of [0, 1, 2] as const) {
        assertEditorialText(language, renderStaV41EditorialStatement(qlId, index, context, language), `${qlId}/${context.id}/${language}/S${index}`);
      }
      if (language !== "en") {
        for (let candidateIndex = 1; candidateIndex <= 7; candidateIndex += 1) {
          for (const variantIndex of [0, 1] as const) {
            assertEditorialText(language, renderStaV41EditorialCandidate(
              qlId, candidateIndex, variantIndex, context, language, "English semantic authority surface",
            ), `${qlId}/${context.id}/${language}/C${candidateIndex}/V${variantIndex}`);
          }
        }
      }
    }
  }
}

for (const qlId of STA_V4_QL_IDS) {
  for (const profile of STA_V4_PRESENTATION_PROFILES) {
    for (let sample = 0; sample < 20; sample += 1) {
      const seed = `sta-v41-editorial-r2:${qlId}:${profile.profileId}:${sample}`;
      const en = generateStaV4Question({ seed, locale: "en-IN", profileId: profile.profileId, qlId });
      const hi = generateStaV4Question({ seed, locale: "hi-IN", profileId: profile.profileId, qlId });
      const pa = generateStaV4Question({ seed, locale: "pa-IN", profileId: profile.profileId, qlId });
      assert.equal(hi.canonicalItemId, en.canonicalItemId, `${seed}: Hindi canonical identity drift`);
      assert.equal(pa.canonicalItemId, en.canonicalItemId, `${seed}: Punjabi canonical identity drift`);
      assert.equal(hi.contentFingerprint, en.contentFingerprint, `${seed}: Hindi fingerprint drift`);
      assert.equal(pa.contentFingerprint, en.contentFingerprint, `${seed}: Punjabi fingerprint drift`);
      assert.deepEqual(hi.answerSet, en.answerSet, `${seed}: Hindi answer-set drift`);
      assert.deepEqual(pa.answerSet, en.answerSet, `${seed}: Punjabi answer-set drift`);
      for (const question of [en, hi, pa]) {
        assertEditorialText(question.language, question.statement, `${seed}/${question.language}/statement`);
        for (const candidate of question.candidates) assertEditorialText(question.language, candidate.text, `${seed}/${question.language}/${candidate.candidateId}`);
      }
    }
  }
}

console.log("PASS_STA_001_V4_1_EDITORIAL_R2");
