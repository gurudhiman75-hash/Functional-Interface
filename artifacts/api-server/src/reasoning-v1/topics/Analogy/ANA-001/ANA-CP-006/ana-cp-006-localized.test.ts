import assert from "node:assert/strict";
import { generateClusterAnalogy } from "./generator";
import {
  generateLocalizedClusterAnalogy,
  type ClusterLocale,
} from "./localized-runtime";
import { ANA_CP006_QLS } from "./question-language.en";

const locales: readonly ClusterLocale[] = ["hi-IN", "pa-IN"];
const answerPositions: Record<ClusterLocale, number[]> = {
  "hi-IN": [0, 0, 0, 0],
  "pa-IN": [0, 0, 0, 0],
};
const layouts: Record<ClusterLocale, Set<string>> = {
  "hi-IN": new Set(),
  "pa-IN": new Set(),
};
const difficulties: Record<ClusterLocale, Set<string>> = {
  "hi-IN": new Set(),
  "pa-IN": new Set(),
};
const ruleCoverage: Record<ClusterLocale, Set<string>> = {
  "hi-IN": new Set(),
  "pa-IN": new Set(),
};
let generatedCount = 0;

for (const locale of locales) {
  for (const ql of ANA_CP006_QLS) {
    for (let seed = 0; seed < 20; seed += 1) {
      const english = generateClusterAnalogy(ql.qlId, seed);
      const localized = generateLocalizedClusterAnalogy(ql.qlId, locale, seed);
      const repeat = generateLocalizedClusterAnalogy(ql.qlId, locale, seed);
      assert.deepEqual(repeat, localized, `${locale} ${ql.qlId} seed ${seed} is not deterministic.`);
      generatedCount += 1;

      assert.equal(localized.locale, locale);
      assert.equal(localized.checkpointId, english.checkpointId);
      assert.equal(localized.qlId, english.qlId);
      assert.equal(localized.ruleId, english.ruleId);
      assert.equal(localized.presentationMode, english.presentationMode);
      assert.deepEqual(localized.context, english.context);
      assert.deepEqual(localized.source, english.source);
      assert.deepEqual(localized.target, english.target);
      assert.deepEqual(localized.options, english.options);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.difficulty, english.difficulty);
      assert.equal(localized.difficultyScore, english.difficultyScore);
      assert.equal(localized.layout, english.layout);
      assert.deepEqual(localized.metadata, english.metadata);

      assert.ok(localized.stem.length > 4);
      assert.ok(localized.explanation.ruleStatement.length > 15);
      assert.ok(localized.explanation.sourceDemonstration.includes(localized.source.left));
      assert.ok(localized.explanation.sourceDemonstration.includes(localized.source.right));
      assert.ok(localized.explanation.targetApplication.includes(localized.target.left));
      assert.ok(localized.explanation.targetApplication.includes(localized.target.right));
      assert.ok(localized.explanation.closestTrapRejection.length > 20);
      assert.ok(!JSON.stringify(localized.explanation).includes("CLUSTER_"));

      if (locale === "hi-IN") {
        assert.ok(/[\u0900-\u097F]/.test(localized.explanation.ruleStatement));
        assert.ok(/[\u0900-\u097F]/.test(localized.explanation.sourceDemonstration));
        assert.ok(/[\u0900-\u097F]/.test(localized.explanation.targetApplication));
        assert.ok(/[\u0900-\u097F]/.test(localized.explanation.closestTrapRejection));
        assert.ok(!localized.stem.includes("Select the"));
        assert.ok(!localized.stem.includes("Complete the"));
      } else {
        assert.ok(/[\u0A00-\u0A7F]/.test(localized.explanation.ruleStatement));
        assert.ok(/[\u0A00-\u0A7F]/.test(localized.explanation.sourceDemonstration));
        assert.ok(/[\u0A00-\u0A7F]/.test(localized.explanation.targetApplication));
        assert.ok(/[\u0A00-\u0A7F]/.test(localized.explanation.closestTrapRejection));
        assert.ok(!localized.stem.includes("Select the"));
        assert.ok(!localized.stem.includes("Complete the"));
        assert.ok(!localized.stem.includes("ਪਦ"));
        assert.ok(!JSON.stringify(localized.explanation).includes("ਪਦ"));
      }

      layouts[locale].add(localized.layout);
      difficulties[locale].add(localized.difficulty);
      ruleCoverage[locale].add(localized.ruleId);
      answerPositions[locale][localized.correctIndex] += 1;
    }
  }

  assert.deepEqual([...layouts[locale]].sort(), ["ARROW", "BOXED_PAIRS", "INLINE", "TWO_ROW_TABLE"]);
  assert.deepEqual([...difficulties[locale]].sort(), ["EASY", "HARD", "MEDIUM"]);
  assert.equal(ruleCoverage[locale].size, 24);
  assert.deepEqual(answerPositions[locale], [240, 240, 240, 240]);
}

assert.equal(generatedCount, 48 * 20 * 2);

console.log("ANA-CP-006 localized runtime audit passed.", {
  generatedCount,
  layouts: Object.fromEntries(locales.map((locale) => [locale, [...layouts[locale]]])),
  difficulties: Object.fromEntries(locales.map((locale) => [locale, [...difficulties[locale]]])),
  answerPositions,
  ruleCoverage: Object.fromEntries(locales.map((locale) => [locale, ruleCoverage[locale].size])),
});
