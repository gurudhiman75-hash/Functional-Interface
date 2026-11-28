import assert from "node:assert/strict";
import { MENSURATION_QUESTION_STUDIO_PATTERNS } from "../../mensuration-question-studio-selection-v2";
import { generateMensurationLocalizedQuestionV1 } from "../mensuration-localization-runtime-v1";
import { MENSURATION_NATIVE_STEM_TEMPLATES_V1 } from "./mensuration-native-stem-templates-v1";
import { MENSURATION_NATIVE_STEM_TEMPLATES_MEN002_V1 } from "./mensuration-native-stem-templates-men002-v1";
import { extractMensurationStemSlotsV1, localizeMensurationSlotWordsV1, renderMensurationNativeStemV1 } from "./mensuration-native-stem-v1";

const SEEDS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ALL = { ...MENSURATION_NATIVE_STEM_TEMPLATES_V1, ...MENSURATION_NATIVE_STEM_TEMPLATES_MEN002_V1 };

// Flip to true once every Mensuration pattern has native templates: any stem that falls back to the
// old word-swapping path then fails the test.
const REQUIRE_FULL_COVERAGE = false;
const GURMUKHI = new RegExp("[\\u0A00-\\u0A7F]");
const DEVANAGARI = new RegExp("[\\u0900-\\u0963\\u0966-\\u097F]");

function latinWords(text: string) {
  const outsideMath = text.replace(/\$[^$]*\$/g, " ");
  return (outsideMath.match(/[A-Za-z]{2,}/g) ?? []).filter((word) => !/^(cm|mm|km|kg)$/i.test(word));
}

// 1. Every template must use each number of its English stem, and must not invent extra slots.
for (const [key, [hi, pa]] of Object.entries(ALL)) {
  const count = key.includes("|")
    ? new Set([...key.split("|").slice(1).join("|").matchAll(/\{(\d+)\}/g)].map((m) => m[1])).size
    : Number(key.split("#")[1]);
  for (const [lang, template] of [["hi", hi], ["pa", pa]] as const) {
    const used = new Set([...template.matchAll(/\{(\d+)\}/g)].map((m) => Number(m[1])));
    for (let i = 1; i <= count; i += 1) assert.ok(used.has(i), `${key} ${lang}: slot {${i}} unused`);
    for (const slot of used) assert.ok(slot >= 1 && slot <= count, `${key} ${lang}: slot {${slot}} out of range`);
    assert.ok(lang === "hi" ? DEVANAGARI.test(template) && !GURMUKHI.test(template) : GURMUKHI.test(template) && !DEVANAGARI.test(template), `${key} ${lang}: wrong script`);
  }
}

// 2. Live generator output: native stems are used, numbers are preserved, nothing English is left.
let checked = 0;
let native = 0;
let uncovered = 0;
for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS as Array<{ patternId: string }>) {
  for (const seed of SEEDS) {
    const en = generateMensurationLocalizedQuestionV1({ patternId: pattern.patternId, seed, language: "en" });
    const slots = extractMensurationStemSlotsV1(en.stem);
    for (const language of ["hi", "pa"] as const) {
      const rendered = renderMensurationNativeStemV1(pattern.patternId, en.stem, language);
      if (rendered === null) {
        uncovered += 1;
        if (REQUIRE_FULL_COVERAGE) assert.fail(`${pattern.patternId}/${seed}/${language}: no native template for "${en.stem}"`);
        continue;
      }
      native += 1;
      const q = generateMensurationLocalizedQuestionV1({ patternId: pattern.patternId, seed, language });
      assert.equal(q.stem, rendered, `${pattern.patternId}/${seed}/${language}: runtime did not use native stem`);
      for (const slot of slots) assert.ok(q.stem.includes(localizeMensurationSlotWordsV1(slot, language)), `${pattern.patternId}/${seed}/${language}: lost "${slot}" in "${q.stem}"`);
      assert.deepEqual(latinWords(q.stem), [], `${pattern.patternId}/${seed}/${language}: Latin words in "${q.stem}"`);
      assert.ok(language === "hi" ? !GURMUKHI.test(q.stem) : !DEVANAGARI.test(q.stem), `${pattern.patternId}/${language}: wrong script`);
      assert.ok(!/\{\d+\}/.test(q.stem), `${pattern.patternId}/${language}: unfilled slot`);
      checked += 1;
    }
  }
}
assert.ok(native > 0, "no native stems were exercised");
console.log(`mensuration native HI/PA stems: ${Object.keys(ALL).length} templates, ${checked} generated stems verified, ${uncovered} still on the old path`);
