import assert from "node:assert/strict";
import { ANA_CP004_QLS } from "./question-language.en";
import { generateLocalizedSetAnalogy } from "./localized-runtime";

const locales = ["hi-IN", "pa-IN"] as const;
const layouts = new Map<string, Set<string>>(locales.map((locale) => [locale, new Set()]));
const missingPositions = new Map<string, Set<number>>(locales.map((locale) => [locale, new Set()]));
const answerPositions = new Map<string, number[]>(locales.map((locale) => [locale, [0, 0, 0, 0]]));

for (const locale of locales) {
  for (const ql of ANA_CP004_QLS) {
    for (let seed = 0; seed < 24; seed += 1) {
      const first = generateLocalizedSetAnalogy(ql.qlId, locale, seed);
      const second = generateLocalizedSetAnalogy(ql.qlId, locale, seed);
      assert.deepEqual(first, second, `${locale}/${ql.qlId}/${seed} must be deterministic`);
      assert.equal(first.locale, locale);
      assert.equal(first.options.length, 4);
      assert.equal(new Set(first.options.map((option) => JSON.stringify(option.value))).size, 4);
      assert.equal(first.options.filter((option) => option.errorLabel === null).length, 1);
      assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
      assert.ok(first.stem.length > 8);
      assert.ok(first.explanation.ruleStatement.length > 8);
      assert.ok(first.explanation.sourceDemonstration.length > 3);
      assert.ok(first.explanation.targetApplication.length > 3);
      assert.ok(first.explanation.conclusion.length > 4);
      assert.ok(first.explanation.closestTrapRejection.length > 8);
      if (locale === "hi-IN") {
        assert.match(first.explanation.ruleStatement, /[\u0900-\u097F]/);
        assert.match(first.explanation.conclusion, /[\u0900-\u097F]/);
      } else {
        assert.match(first.explanation.ruleStatement, /[\u0A00-\u0A7F]/);
        assert.match(first.explanation.conclusion, /[\u0A00-\u0A7F]/);
        assert.ok(!JSON.stringify(first).includes("ਪਦ"));
      }
      layouts.get(locale)!.add(first.layout);
      if (first.missingPosition !== null) missingPositions.get(locale)!.add(first.missingPosition);
      answerPositions.get(locale)![first.correctIndex] += 1;
    }
  }
}

for (const locale of locales) {
  assert.equal(layouts.get(locale)!.size, 4, `${locale} must cover all layouts`);
  assert.equal(missingPositions.get(locale)!.size, 3, `${locale} must cover all missing positions`);
  const counts = answerPositions.get(locale)!;
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  assert.ok(min > 0 && max / min < 1.35, `${locale} answer positions are imbalanced: ${counts.join(", ")}`);
}

console.log("ANA-CP-004 localized runtime audit passed.", {
  layouts: Object.fromEntries([...layouts].map(([locale, values]) => [locale, [...values]])),
  missingPositions: Object.fromEntries([...missingPositions].map(([locale, values]) => [locale, [...values]])),
  answerPositions: Object.fromEntries(answerPositions),
});
