import assert from "node:assert/strict";

import { generateSea002Cp007ProductionCaselet } from "../production-caselet-v2.ts";
import {
  localizeSea002Cp007Candidate,
  type Sea002Cp007LocalizedCandidate,
} from "./candidate-localizer-v1.ts";
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

const ENGLISH_BOILERPLATE = [
  "Two parallel rows",
  "Some persons face north",
  "Who sits immediately",
  "Which direction does",
  "Which option correctly gives",
  "Who sits diagonally",
  "Asked:",
  "Answer:",
  "Final arrangement",
] as const;

function assertNoEnglishBoilerplate(candidate: Sea002Cp007LocalizedCandidate) {
  const learnerText = [candidate.stem, candidate.question, candidate.explanation].join("\n");
  for (const phrase of ENGLISH_BOILERPLATE) {
    assert.equal(learnerText.includes(phrase), false, `${candidate.caseletId}/${candidate.locale}: English boilerplate leaked: ${phrase}`);
  }
}

function assertScriptPresence(candidate: Sea002Cp007LocalizedCandidate) {
  const text = [candidate.stem, candidate.question, candidate.options.join(" "), candidate.explanation].join("\n");
  if (candidate.locale === "hi-IN") {
    assert.match(text, /[\u0900-\u097F]/u, `${candidate.caseletId}: Hindi script missing`);
  } else {
    assert.match(text, /[\u0A00-\u0A7F]/u, `${candidate.caseletId}: Gurmukhi script missing`);
  }
}

function assertAuthorityTeaching(candidate: Sea002Cp007LocalizedCandidate) {
  if (candidate.authorityKey === "CP007-AUTH-01" || candidate.authorityKey === "CP007-AUTH-04") {
    assert.match(candidate.explanation, /↑|↓/u, `${candidate.caseletId}: facing must be explicit before left/right use`);
    assert.match(candidate.explanation, /\|/u, `${candidate.caseletId}: final two-row arrangement must be shown`);
  }
  if (candidate.authorityKey === "CP007-AUTH-02") {
    assert.equal(candidate.explanation.includes(" | "), false, `${candidate.caseletId}: AUTH02 should not dump the seating diagram`);
  }
  if (candidate.authorityKey === "CP007-AUTH-03") {
    if (candidate.locale === "hi-IN") {
      assert.ok(candidate.explanation.includes("1) पंक्ति:"));
      assert.ok(candidate.explanation.includes("2) मुख-दिशा:"));
    } else {
      assert.ok(candidate.explanation.includes("1) ਕਤਾਰ:"));
      assert.ok(candidate.explanation.includes("2) ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ:"));
    }
  }
}

function assertLocalizedSemanticOptions(
  candidate: Sea002Cp007LocalizedCandidate,
  englishOptions: readonly string[],
) {
  assert.equal(candidate.options.length, englishOptions.length);
  for (let index = 0; index < englishOptions.length; index += 1) {
    const english = englishOptions[index]!;
    const localized = candidate.options[index]!;
    if (/^[A-Za-z]+$/u.test(english) && !["North", "South"].includes(english)) {
      assert.equal(localized, english, `${candidate.caseletId}: participant-name option must remain unchanged`);
    }
    if (english === "North") assert.notEqual(localized, "North");
    if (english === "South") assert.notEqual(localized, "South");
    if (/^(Upper|Lower) row/u.test(english)) assert.notEqual(localized, english);
  }
}

let localizedCount = 0;
const seenParity = new Set<string>();
for (const authority of AUTHORITIES) {
  for (let sample = 0; sample < 6; sample += 1) {
    const width = authority === "CP007-AUTH-04" ? 4 + (sample % 3) : 3 + (sample % 4);
    const caselet = generateSea002Cp007ProductionCaselet(`cp007-localization-review:${authority}:${sample}`, width, authority);
    const canonical = cp007CanonicalParityFingerprint(caselet);
    seenParity.add(canonical);

    for (const locale of SEA002_CP007_TRANSLATION_TARGET_LOCALES) {
      const candidate = localizeSea002Cp007Candidate(caselet, locale);
      localizedCount += 1;

      assert.equal(candidate.caseletId, caselet.caseletId);
      assert.equal(candidate.authorityKey, caselet.authorityKey);
      assert.equal(candidate.locale, locale);
      assert.equal(candidate.correctIndex, caselet.correctIndex);
      assert.equal(candidate.canonicalParityFingerprint, canonical);
      assert.equal(candidate.answer, candidate.options[candidate.correctIndex]);
      assert.ok(candidate.stem.length > 80);
      assert.ok(candidate.question.length > 10);
      assert.ok(candidate.explanation.length > 80);
      assert.equal(/\bcolumn\b/iu.test([candidate.stem, candidate.question, candidate.explanation].join("\n")), false);

      assertNoEnglishBoilerplate(candidate);
      assertScriptPresence(candidate);
      assertAuthorityTeaching(candidate);
      assertLocalizedSemanticOptions(candidate, caselet.options);

      const rerendered = localizeSea002Cp007Candidate(caselet, locale);
      assert.deepEqual(rerendered, candidate, `${caselet.caseletId}/${locale}: localization must be deterministic`);
    }
  }
}

assert.equal(seenParity.size, 24);
assert.equal(localizedCount, 48);

console.log("PASS_SEA002_CP007_LOCALIZATION_CANDIDATE_V1");
console.log("localized surfaces", localizedCount);
console.log("canonical caselets", seenParity.size);
console.log("locales", SEA002_CP007_TRANSLATION_TARGET_LOCALES.join(","));
console.log("product activation", false);
