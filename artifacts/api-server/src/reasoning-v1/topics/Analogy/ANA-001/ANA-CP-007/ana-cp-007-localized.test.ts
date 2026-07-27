import assert from "node:assert/strict";
import { generateWordAnalogy } from "./generator";
import {
  generateLocalizedWordAnalogy,
  type WordLocale,
} from "./localized-runtime";
import { ANA_CP007_QLS } from "./question-language.en";

const locales: readonly WordLocale[] = ["hi-IN", "pa-IN"];
let generatedCount = 0;

for (const locale of locales) {
  const answerPositions = [0, 0, 0, 0];
  const layouts = new Set<string>();
  const rules = new Set<string>();

  for (const ql of ANA_CP007_QLS) {
    for (let seed = 0; seed < 12; seed += 1) {
      const english = generateWordAnalogy(ql.qlId, seed);
      const localized = generateLocalizedWordAnalogy(ql.qlId, locale, seed);
      const repeated = generateLocalizedWordAnalogy(ql.qlId, locale, seed);
      assert.deepEqual(repeated, localized, `${locale} ${ql.qlId} seed ${seed} is not deterministic.`);
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

      assert.ok(localized.stem.length >= 5);
      assert.ok(localized.explanation.ruleStatement.length >= 35);
      assert.ok(localized.explanation.sourceDemonstration.length >= 70);
      assert.ok(localized.explanation.targetApplication.length >= 70);
      assert.ok(localized.explanation.closestTrapRejection.length >= 55);
      assert.ok(localized.explanation.sourceDemonstration.includes(localized.source.input));
      assert.ok(localized.explanation.sourceDemonstration.includes(String(localized.source.output)));
      assert.ok(localized.explanation.targetApplication.includes(localized.target.input));
      assert.ok(localized.explanation.targetApplication.includes(String(localized.target.output)));
      assert.ok(!JSON.stringify(localized.explanation).includes("WORD_"));
      assert.ok(!localized.stem.includes("Select the"));
      assert.ok(!localized.stem.includes("Complete the"));

      if (locale === "hi-IN") {
        assert.ok(/[\u0900-\u097F]/.test(localized.explanation.ruleStatement));
        assert.ok(/[\u0900-\u097F]/.test(localized.explanation.sourceDemonstration));
        assert.ok(/[\u0900-\u097F]/.test(localized.explanation.targetApplication));
        assert.ok(/[\u0900-\u097F]/.test(localized.explanation.closestTrapRejection));
      } else {
        assert.ok(/[\u0A00-\u0A7F]/.test(localized.explanation.ruleStatement));
        assert.ok(/[\u0A00-\u0A7F]/.test(localized.explanation.sourceDemonstration));
        assert.ok(/[\u0A00-\u0A7F]/.test(localized.explanation.targetApplication));
        assert.ok(/[\u0A00-\u0A7F]/.test(localized.explanation.closestTrapRejection));
      }

      answerPositions[localized.correctIndex] += 1;
      layouts.add(localized.layout);
      rules.add(localized.ruleId);
    }
  }

  assert.deepEqual(answerPositions, [42, 42, 42, 42]);
  assert.deepEqual([...layouts].sort(), ["ARROW", "BOXED_PAIRS", "INLINE", "TWO_ROW_TABLE"]);
  assert.equal(rules.size, 7);
}

assert.equal(generatedCount, 336);

console.log("ANA-CP-007 Hindi/Punjabi runtime audit passed.", {
  qlCount: ANA_CP007_QLS.length,
  locales,
  generatedCount,
});
