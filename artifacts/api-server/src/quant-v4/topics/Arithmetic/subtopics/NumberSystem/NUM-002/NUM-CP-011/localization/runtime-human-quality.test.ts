import assert from "node:assert/strict";

import { NUM_CP011_PERMANENT_QL_IDS, type NumCp011PermanentQlId } from "../permanent-allocation.ts";
import { generateNumCp011Localized } from "./runtime.ts";
import type { NumCp011LocalizedLanguage } from "./types.ts";

const languages: readonly NumCp011LocalizedLanguage[] = ["hi", "pa"];
const script = {
  hi: /[\u0900-\u097F]/gu,
  pa: /[\u0A00-\u0A7F]/gu,
} as const;
const obviousEnglishLeak = /\b(?:what is|find the|how many|when written|trailing zeroes|least positive integer|the exponent|therefore|the answer|all requirements|first crossing|correct set|complete groups)\b/iu;
const implementationLeak = /\b(?:prototype|generator|hidden state|fingerprint|source ancestry|lifecycle|temporary prototype)\b/iu;

function tokens(value: string) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

let packages = 0;
let nativeDensityChecks = 0;
let wordingChecks = 0;
let explanationChecks = 0;
let noSolutionFixtures = 0;

for (const qlId of NUM_CP011_PERMANENT_QL_IDS) {
  for (let seed = 1; seed <= 60; seed += 1) {
    for (const language of languages) {
      const q = generateNumCp011Localized(qlId as NumCp011PermanentQlId, seed, language);
      const label = `${qlId}/${seed}/${language}`;
      const learnerText = [q.stem, q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
      const nativeChars = learnerText.match(script[language])?.length ?? 0;

      assert.ok(nativeChars >= 35, `${label}: native-script density too low (${nativeChars})`);
      assert.doesNotMatch(learnerText, obviousEnglishLeak, `${label}: obvious English learner prose leak`);
      assert.doesNotMatch(learnerText, implementationLeak, `${label}: implementation vocabulary leak`);
      nativeDensityChecks += 1;
      wordingChecks += 1;

      assert.ok(q.stem.endsWith("?") || q.stem.endsWith("।"), `${label}: malformed learner stem ending`);
      assert.ok(q.explanation.coreConcept.length >= 25, `${label}: concept too thin`);
      assert.ok(q.explanation.strategy.length >= 20, `${label}: strategy too thin`);
      assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation needs 2..4 steps`);
      assert.ok(tokens(learnerText) >= 24, `${label}: learner explanation too terse`);
      assert.ok(tokens(learnerText) <= 170, `${label}: learner explanation too verbose`);
      assert.ok(q.explanation.steps.every((step) => step.length >= 12), `${label}: thin explanation step`);
      explanationChecks += 1;

      if (q.temporaryPrototypeId === "NUM-CP011-PROT-008" && q.canonicalAnswer === "No positive integer n") {
        const expected = language === "hi" ? "कोई धनात्मक पूर्णांक n नहीं" : "ਕੋਈ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਨਹੀਂ";
        assert.equal(q.options[q.correctIndex]?.value, expected, `${label}: no-solution answer not localized`);
        assert.ok(learnerText.includes(language === "hi" ? "कोई सटीक हल नहीं" : "ਕੋਈ ਸਹੀ ਹੱਲ ਨਹੀਂ"), `${label}: no-solution explanation not human localized`);
        noSolutionFixtures += 1;
      }

      assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio opened during localization`);
      assert.equal(q.lifecycle.questionBankWritable, false, `${label}: bank write opened during localization`);
      assert.equal(q.lifecycle.testEligible, false, `${label}: test eligibility opened during localization`);
      assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened during localization`);
      packages += 1;
    }
  }
}

assert.equal(packages, 13 * 60 * 2, "Human-quality sweep size drift");
assert.equal(nativeDensityChecks, packages);
assert.equal(wordingChecks, packages);
assert.equal(explanationChecks, packages);
assert.ok(noSolutionFixtures >= 8, `Expected repeated attainable no-solution localization fixtures, got ${noSolutionFixtures}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_HI_PA_HUMAN_QUALITY",
  packages,
  nativeDensityChecks,
  wordingChecks,
  explanationChecks,
  noSolutionFixtures,
  downstreamActivations: 0,
}, null, 2));
