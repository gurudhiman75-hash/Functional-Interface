import assert from "node:assert/strict";
import { ANA_CP010_QLS } from "./question-language.en";
import { generateLocalizedAnaCp010 } from "./localized-runtime";

const locales = ["en-IN", "hi-IN", "pa-IN"] as const;

for (const ql of ANA_CP010_QLS) {
  for (let seed = 0; seed < 40; seed += 1) {
    const generated = locales.map((locale) => generateLocalizedAnaCp010(ql.qlId, seed, locale));
    const [english, hindi, punjabi] = generated;
    assert.equal(english.qlId, ql.qlId);
    assert.equal(hindi.qlId, ql.qlId);
    assert.equal(punjabi.qlId, ql.qlId);
    assert.equal(english.correctIndex, hindi.correctIndex);
    assert.equal(english.correctIndex, punjabi.correctIndex);
    assert.equal(english.options.length, 4);
    assert.equal(hindi.options.length, 4);
    assert.equal(punjabi.options.length, 4);
    assert.ok(english.stem.length > 20);
    assert.ok(hindi.stem.length > 20);
    assert.ok(punjabi.stem.length > 20);
    assert.ok(!punjabi.stem.includes("ਸਾਦ੍ਰਿਸ਼ਤਾ"));
    assert.ok(!punjabi.stem.includes("ਸਾਦਰਿਸ਼ਤਾ"));
    assert.ok(!punjabi.stem.includes("ਪਦ"));

    if (english.kind === "SEMANTIC") {
      assert.equal(hindi.kind, "SEMANTIC");
      assert.equal(punjabi.kind, "SEMANTIC");
      if (hindi.kind !== "SEMANTIC" || punjabi.kind !== "SEMANTIC") throw new Error("Semantic locale kind mismatch.");
      assert.equal(english.relationId, hindi.relationId);
      assert.equal(english.relationId, punjabi.relationId);
      assert.equal(english.sourceFactId, hindi.sourceFactId);
      assert.equal(english.targetFactId, punjabi.targetFactId);
    } else {
      assert.equal(hindi.kind, english.kind);
      assert.equal(punjabi.kind, english.kind);
      assert.deepEqual(hindi.options, english.options);
      assert.deepEqual(punjabi.options, english.options);
    }
  }
}

console.log("ANA-CP-010 localized parity proof passed.", {
  qlCount: ANA_CP010_QLS.length,
  locales,
});
