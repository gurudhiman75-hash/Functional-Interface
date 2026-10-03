import assert from "node:assert/strict";

import { generateStcV22Question } from "./editorial-v2-2-generator.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";

const locales: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = [0, 7, 31, 63, 127, 255, 383, 511, 767, 1023, 1279, 1535, 1791, 2047] as const;

let checked = 0;

function hasDevanagari(value: string): boolean {
  // U+0964/U+0965 are shared Indic danda punctuation and are valid on
  // Punjabi learner surfaces; flag actual Devanagari letters/marks only.
  return /[\u0900-\u0963\u0970-\u097F]/u.test(value);
}
function hasGurmukhi(value: string): boolean {
  return /[\u0A00-\u0A7F]/u.test(value);
}

for (const qlId of STC_QL_IDS) {
  for (const seed of seeds) {
    const triplet = locales.map((locale) => generateStcV22Question({ qlId, locale, seed }));
    const [en, hi, pa] = triplet;

    assert.equal(en.answerClass, hi.answerClass, `${qlId}/${seed}: EN-HI answer drift`);
    assert.equal(en.answerClass, pa.answerClass, `${qlId}/${seed}: EN-PA answer drift`);
    assert.equal(en.correctIndex, hi.correctIndex, `${qlId}/${seed}: EN-HI correct-index drift`);
    assert.equal(en.correctIndex, pa.correctIndex, `${qlId}/${seed}: EN-PA correct-index drift`);
    assert.equal(en.templateId, hi.templateId);
    assert.equal(en.templateId, pa.templateId);
    assert.equal(en.variantIndex, hi.variantIndex);
    assert.equal(en.variantIndex, pa.variantIndex);

    assert.ok(hasDevanagari(hi.stem), `${qlId}/${seed}: Hindi stem lacks Devanagari`);
    assert.ok(hasGurmukhi(pa.stem), `${qlId}/${seed}: Punjabi stem lacks Gurmukhi`);
    assert.equal(hasGurmukhi(hi.stem + hi.explanation), false, `${qlId}/${seed}: Gurmukhi leaked into Hindi`);
    assert.equal(hasDevanagari(pa.stem + pa.explanation), false, `${qlId}/${seed}: Devanagari leaked into Punjabi`);

    assert.match(hi.explanation, /निष्कर्ष I/u);
    assert.match(hi.explanation, /निष्कर्ष II/u);
    assert.match(pa.explanation, /ਸਿੱਟਾ I/u);
    assert.match(pa.explanation, /ਸਿੱਟਾ II/u);
    assert.ok(pa.options.every((option) => option.includes("ਸਿੱਟ")), `${qlId}/${seed}: Punjabi answer-code terminology drift`);
    assert.doesNotMatch([pa.explanation, ...pa.options].join(" "), /ਅਨੁਸਰਣ/u, `${qlId}/${seed}: literal Punjabi follow/calque returned`);

    for (const q of triplet) {
      assert.ok(q.explanation.length >= 55 && q.explanation.length <= 700, `${qlId}/${q.locale}/${seed}: explanation length outside beginner-friendly range`);
      assert.doesNotMatch(q.explanation, /shortcut|common trap|trap analysis|option elimination|prototype|fingerprint|generator/i);
      assert.equal(q.metadata.repeatedInstructionEmbeddedInStem, false);
      assert.equal(q.conclusions[0] === q.conclusions[1], false, `${qlId}/${q.locale}/${seed}: duplicated conclusions`);
      checked++;
    }
  }
}

console.log(JSON.stringify({
  status: "PASS_STC_001_DEEP_AUDIT_WAVE3",
  qlCount: STC_QL_IDS.length,
  locales,
  seedsPerQl: seeds.length,
  learnerSurfacesChecked: checked,
  semanticParity: "EN_HI_PA",
  punjabiConclusionTerm: "ਸਿੱਟਾ",
  noveltyStatus: "DEFERRED",
}, null, 2));
