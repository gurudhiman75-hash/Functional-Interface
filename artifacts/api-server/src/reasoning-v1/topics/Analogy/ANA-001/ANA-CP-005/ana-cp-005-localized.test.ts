import assert from "node:assert/strict";
import { generateAlphabetAnalogy } from "./generator";
import { generateLocalizedAlphabetAnalogy, type AlphabetLocale } from "./localized-runtime";
import { ANA_CP005_QLS } from "./question-language.en";

const locales: readonly AlphabetLocale[] = ["hi-IN", "pa-IN"];
const answerPositions: Record<AlphabetLocale, number[]> = {
  "hi-IN": [0, 0, 0, 0],
  "pa-IN": [0, 0, 0, 0],
};
const layouts: Record<AlphabetLocale, Set<string>> = {
  "hi-IN": new Set(),
  "pa-IN": new Set(),
};
const difficulties: Record<AlphabetLocale, Set<string>> = {
  "hi-IN": new Set(),
  "pa-IN": new Set(),
};
let generatedCount = 0;

for (const locale of locales) {
  for (const ql of ANA_CP005_QLS) {
    for (let seed = 0; seed < 40; seed += 1) {
      const english = generateAlphabetAnalogy(ql.qlId, seed);
      const localized = generateLocalizedAlphabetAnalogy(ql.qlId, locale, seed);
      generatedCount += 1;

      assert.equal(localized.locale, locale);
      assert.equal(localized.qlId, english.qlId);
      assert.equal(localized.ruleId, english.ruleId);
      assert.deepEqual(localized.source, english.source);
      assert.deepEqual(localized.target, english.target);
      assert.deepEqual(localized.options, english.options);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.difficulty, english.difficulty);
      assert.equal(localized.layout, english.layout);
      assert.ok(localized.stem.length > 4);
      assert.ok(localized.explanation.ruleStatement.length > 15);
      assert.ok(localized.explanation.sourceDemonstration.includes(localized.source.left));
      assert.ok(localized.explanation.targetApplication.includes(localized.target.left));
      assert.ok(!localized.explanation.ruleStatement.includes("ALPHA_"));

      if (locale === "hi-IN") {
        assert.ok(/[\u0900-\u097F]/.test(localized.explanation.ruleStatement));
        assert.ok(!localized.stem.includes("Select the"));
        assert.ok(!localized.stem.includes("Complete the"));
      } else {
        assert.ok(/[\u0A00-\u0A7F]/.test(localized.explanation.ruleStatement));
        assert.ok(!localized.stem.includes("Select the"));
        assert.ok(!localized.stem.includes("Complete the"));
        assert.ok(!localized.stem.includes("ਪਦ"));
        assert.ok(!localized.explanation.ruleStatement.includes("ਪਦ"));
      }

      layouts[locale].add(localized.layout);
      difficulties[locale].add(localized.difficulty);
      answerPositions[locale][localized.correctIndex] += 1;
    }
  }

  assert.deepEqual([...layouts[locale]].sort(), ["ARROW", "BOXED_PAIRS", "INLINE", "TWO_ROW_TABLE"]);
  assert.deepEqual([...difficulties[locale]].sort(), ["EASY", "HARD", "MEDIUM"]);
  const minPosition = Math.min(...answerPositions[locale]);
  const maxPosition = Math.max(...answerPositions[locale]);
  assert.ok(maxPosition / minPosition < 1.4, `${locale} answer positions are imbalanced.`);
}

console.log("ANA-CP-005 localized runtime audit passed.", {
  generatedCount,
  layouts: Object.fromEntries(locales.map((locale) => [locale, [...layouts[locale]]])),
  difficulties: Object.fromEntries(locales.map((locale) => [locale, [...difficulties[locale]]])),
  answerPositions,
});
