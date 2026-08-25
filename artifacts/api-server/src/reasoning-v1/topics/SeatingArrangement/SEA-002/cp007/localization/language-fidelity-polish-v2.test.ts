import assert from "node:assert/strict";

import { generateSea002Cp007ProductionCaselet } from "../production-caselet-v2.ts";
import { localizeSea002Cp007CandidateV2 } from "./language-fidelity-polish-v2.ts";
import {
  cp007CanonicalParityFingerprint,
  SEA002_CP007_TRANSLATION_TARGET_LOCALES,
} from "./readiness.ts";

const AUTHORITIES = [
  "CP007-AUTH-01",
  "CP007-AUTH-02",
  "CP007-AUTH-03",
  "CP007-AUTH-04",
] as const;

const FORBIDDEN_MECHANICAL_FORMS = [
  "बैठता/बैठती",
  "बैठा/बैठी",
  "करता/करती",
  "ਬੈਠਦਾ/ਬੈਠਦੀ",
  "ਕਰਦਾ/ਕਰਦੀ",
] as const;

let surfaces = 0;
for (const authority of AUTHORITIES) {
  for (let sample = 0; sample < 6; sample += 1) {
    const width = authority === "CP007-AUTH-04" ? 4 + (sample % 3) : 3 + (sample % 4);
    const caselet = generateSea002Cp007ProductionCaselet(`cp007-localization-review:${authority}:${sample}`, width, authority);
    const canonical = cp007CanonicalParityFingerprint(caselet);

    for (const locale of SEA002_CP007_TRANSLATION_TARGET_LOCALES) {
      const candidate = localizeSea002Cp007CandidateV2(caselet, locale);
      surfaces += 1;
      const learnerText = [candidate.stem, candidate.question, candidate.explanation].join("\n");

      assert.equal(candidate.canonicalParityFingerprint, canonical);
      assert.equal(candidate.correctIndex, caselet.correctIndex);
      assert.equal(candidate.answer, candidate.options[candidate.correctIndex]);
      for (const forbidden of FORBIDDEN_MECHANICAL_FORMS) {
        assert.equal(learnerText.includes(forbidden), false, `${caselet.caseletId}/${locale}: mechanical gender slash remains: ${forbidden}`);
      }

      if (locale === "hi-IN") {
        assert.match(candidate.stem, /का मुख (उत्तर|दक्षिण) की ओर है/u);
        if (authority === "CP007-AUTH-02") assert.match(candidate.question, /का मुख किस दिशा की ओर है\?/u);
        if (authority === "CP007-AUTH-01") assert.match(candidate.question, /के ठीक (बाईं ओर|दाईं ओर) कौन है\?/u);
        if (authority === "CP007-AUTH-04") assert.match(candidate.question, /तिरछे कौन है\?/u);
        assert.equal(candidate.question.includes("ओर तुरंत"), false);
        assert.equal(candidate.explanation.includes("ओर तुरंत कौन"), false);
        assert.equal(candidate.explanation.includes("के दूसरी पंक्ति में"), false);
        assert.equal(candidate.explanation.includes("के समान पंक्ति में"), false);
      } else {
        assert.match(candidate.stem, /ਦਾ ਮੂੰਹ (ਉੱਤਰ|ਦੱਖਣ) ਵੱਲ ਹੈ/u);
        if (authority === "CP007-AUTH-02") assert.match(candidate.question, /ਦਾ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ\?/u);
        if (authority === "CP007-AUTH-01") assert.match(candidate.question, /ਦੇ ਬਿਲਕੁਲ (ਖੱਬੇ ਪਾਸੇ|ਸੱਜੇ ਪਾਸੇ) ਕੌਣ ਹੈ\?/u);
        if (authority === "CP007-AUTH-04") assert.match(candidate.question, /ਤਿਰਛੇ ਕੌਣ ਹੈ\?/u);
        assert.equal(candidate.question.includes("ਪਾਸੇ ਤੁਰੰਤ"), false);
        assert.equal(candidate.explanation.includes("ਪਾਸੇ ਤੁਰੰਤ ਕੌਣ"), false);
      }

      const rerendered = localizeSea002Cp007CandidateV2(caselet, locale);
      assert.deepEqual(rerendered, candidate, `${caselet.caseletId}/${locale}: V2 editorial overlay must be deterministic`);
    }
  }
}

assert.equal(surfaces, 48);
console.log("PASS_SEA002_CP007_LOCALIZATION_LANGUAGE_FIDELITY_V2");
console.log("editorially polished surfaces", surfaces);
console.log("mechanical gender slash residue", 0);
console.log("unnatural immediate-query residue", 0);
console.log("structural parity changed", false);
console.log("product activation", false);
