import assert from "node:assert/strict";
import { generateLocalizedAnalogy } from "./localization/runtime";

const scripts = {
  "hi-IN": /[\u0900-\u097F]/,
  "pa-IN": /[\u0A00-\u0A7F]/,
} as const;

for (const locale of ["hi-IN", "pa-IN"] as const) {
  for (let ordinal = 1; ordinal <= 60; ordinal += 1) {
    const qlId = `ANA-QL-${String(ordinal).padStart(3, "0")}`;
    for (const seed of [0, 1, 17, 101]) {
      const first = generateLocalizedAnalogy(qlId, locale, seed);
      const second = generateLocalizedAnalogy(qlId, locale, seed);
      assert.deepEqual(first, second, `${qlId}/${locale}/${seed} must be deterministic`);
      assert.equal(first.options.length, 4);
      assert.equal(first.options.filter((option) => option.errorLabel === null).length, 1);
      assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
      assert.match(first.stem, scripts[locale]);
      assert.match(first.explanation.ruleStatement, scripts[locale]);
      assert.match(first.explanation.sourceDemonstration, scripts[locale]);
      assert.match(first.explanation.targetApplication, scripts[locale]);
      assert.match(first.explanation.conclusion, scripts[locale]);
      assert.match(first.explanation.closestTrapRejection, scripts[locale]);

      const renderedOptions = first.options.flatMap((option) =>
        Array.isArray(option.value) ? option.value : [option.value],
      );
      for (const value of renderedOptions) assert.match(value, scripts[locale]);

      const optionKeys = first.options.map((option) =>
        Array.isArray(option.value) ? option.value.join("::") : option.value,
      );
      assert.equal(new Set(optionKeys).size, 4);
    }
  }
}

console.log("ANA-001 localized runtime audit passed for 480 generated questions.");
