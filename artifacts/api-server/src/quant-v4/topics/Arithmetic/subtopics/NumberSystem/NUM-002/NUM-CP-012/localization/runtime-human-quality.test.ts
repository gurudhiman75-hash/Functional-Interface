import assert from "node:assert/strict";

import { NUM_CP012_PERMANENT_QL_IDS } from "../permanent-allocation.ts";
import { generateNumCp012Permanent } from "../permanent-runtime.ts";
import { generateNumCp012Localized } from "./runtime.ts";
import type { NumCp012LocalizedLanguage } from "./types.ts";

function words(value: string) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function nativeCount(value: string, language: NumCp012LocalizedLanguage) {
  const pattern = language === "hi" ? /[\u0900-\u097F]/gu : /[\u0A00-\u0A7F]/gu;
  return value.match(pattern)?.length ?? 0;
}

function hasDevanagariLetterOrMark(value: string) {
  // U+0964/U+0965 are shared Indic danda punctuation and are legitimate in
  // Punjabi prose despite living in the Devanagari Unicode block. Exclude
  // those punctuation code points while still rejecting actual Devanagari
  // letters, vowel signs and marks.
  return [...value].some((character) => {
    const code = character.codePointAt(0)!;
    return code >= 0x0900 && code <= 0x097f && code !== 0x0964 && code !== 0x0965;
  });
}

const languages: readonly NumCp012LocalizedLanguage[] = ["hi", "pa"];
let packages = 0;
let humanTextChecks = 0;
let leakageChecks = 0;
const nativeMinimums = { hi: Number.POSITIVE_INFINITY, pa: Number.POSITIVE_INFINITY };

for (const qlId of NUM_CP012_PERMANENT_QL_IDS) {
  for (const language of languages) {
    for (let seed = 1; seed <= 35; seed += 1) {
      const en = generateNumCp012Permanent(qlId, seed);
      const q = generateNumCp012Localized(qlId, seed, language);
      const label = `${qlId}/${language}/${seed}`;
      const learnerText = [q.stem, q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
      const native = nativeCount(learnerText, language);
      nativeMinimums[language] = Math.min(nativeMinimums[language], native);

      assert.notEqual(q.stem, en.stem, `${label}: English stem leaked unchanged`);
      assert.ok(native >= 35, `${label}: localized text has too little native-script content (${native})`);
      assert.ok(words(learnerText) >= 22, `${label}: localized learner text too thin (${words(learnerText)} tokens)`);
      assert.ok(words(learnerText) <= 185, `${label}: localized learner text too long (${words(learnerText)} tokens)`);
      assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 3, `${label}: explanation steps outside concise 2..3 range`);
      humanTextChecks += 1;

      assert.doesNotMatch(
        learnerText,
        /prototype|generator|hidden state|fingerprint|authority package|source ancestry|lifecycle|question studio|question bank/iu,
        `${label}: implementation vocabulary leak`,
      );
      assert.doesNotMatch(
        learnerText,
        /least positive integer|which of the following|find the exact|greatest divisor|closed interval|nearest perfect|no integer root/iu,
        `${label}: untranslated English instructional phrase leaked`,
      );
      if (language === "hi") {
        assert.doesNotMatch(learnerText, /[\u0A00-\u0A7F]/u, `${label}: Gurmukhi leaked into Hindi`);
      } else {
        assert.equal(hasDevanagariLetterOrMark(learnerText), false, `${label}: Devanagari letters/marks leaked into Punjabi`);
      }
      leakageChecks += 1;

      assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: correct option binding drift`);
      assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: final answer binding drift`);
      packages += 1;
    }
  }
}

assert.equal(packages, 11 * 2 * 35);
assert.equal(humanTextChecks, packages);
assert.equal(leakageChecks, packages);

console.log(JSON.stringify({
  status: "PASS_NUM_CP012_HI_PA_HUMAN_QUALITY",
  authorities: NUM_CP012_PERMANENT_QL_IDS.length,
  languages,
  packages,
  humanTextChecks,
  leakageChecks,
  sharedIndicDandaAllowedInPunjabi: true,
  minimumNativeCharacters: nativeMinimums,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
