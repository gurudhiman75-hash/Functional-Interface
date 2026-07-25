import assert from "node:assert/strict";
import { ANA_CP003_QLS } from "./question-language.en";
import { generateLocalizedNumericAnalogy } from "./localized-runtime";

const locales = ["hi-IN", "pa-IN"] as const;
const answerPositions = new Map<string, number[]>(locales.map((locale) => [locale, [0, 0, 0, 0]]));

assert.equal(ANA_CP003_QLS.length, 48);

for (const locale of locales) {
  for (const ql of ANA_CP003_QLS) {
    for (let seed = 0; seed < 20; seed += 1) {
      const first = generateLocalizedNumericAnalogy(ql.qlId, locale, seed);
      const second = generateLocalizedNumericAnalogy(ql.qlId, locale, seed);
      assert.deepEqual(first, second, `${locale} ${ql.qlId} seed ${seed} is not deterministic`);
      assert.equal(first.locale, locale);
      assert.equal(first.options.length, 4);
      assert.equal(first.options.filter((option) => option.errorLabel === null).length, 1);
      assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
      assert.equal(new Set(first.options.map((option) => JSON.stringify(option.value))).size, 4);
      assert.ok(first.stem.length > 8);
      assert.ok(first.explanation.ruleStatement.length > 8);
      assert.ok(first.explanation.sourceDemonstration.length > 4);
      assert.ok(first.explanation.targetApplication.length > 4);
      assert.ok(first.explanation.conclusion.length > 4);
      assert.ok(first.explanation.closestTrapRejection.length > 8);
      if (locale === "hi-IN") {
        assert.match(first.explanation.ruleStatement, /[\u0900-\u097F]/);
        assert.match(first.explanation.conclusion, /[\u0900-\u097F]/);
      } else {
        assert.match(first.explanation.ruleStatement, /[\u0A00-\u0A7F]/);
        assert.match(first.explanation.conclusion, /[\u0A00-\u0A7F]/);
        assert.ok(!first.explanation.ruleStatement.includes("ਪਦ"));
        assert.ok(!first.explanation.closestTrapRejection.includes("ਪਦ"));
      }
      answerPositions.get(locale)![first.correctIndex] += 1;
    }
  }
}

for (const [locale, counts] of answerPositions) {
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  assert.ok(max / min < 1.25, `${locale} answer positions are imbalanced: ${counts.join(", ")}`);
}

console.log("ANA-CP-003 localized runtime audit passed.", Object.fromEntries(answerPositions));
