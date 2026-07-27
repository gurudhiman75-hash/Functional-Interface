import assert from "node:assert/strict";
import { generateLocalizedMixedAnalogy } from "./localized-runtime";
import { ANA_CP008_QLS } from "./question-language.en";
import { generateMixedAnalogy } from "./runtime";

const DEVANAGARI = /[\u0900-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;
const ENGLISH_INSTRUCTION = /\b(?:choose|select|find|complete|therefore|rule|source|target|answer|correct|wrong|letter|number)\b/i;
const INTERNAL_TEXT = /ANA-QL|ANA-CP|MIXED_|PROTO_|ruleId|contextKey|RUNTIME_PROOF|publiclyPublishable/i;
const PLACEHOLDER_TEXT = /\{\{[^}]+\}\}|\[[A-Z_]{3,}\]/;
const AVOIDABLE_PUNJABI = /ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ|ਸਰੋਤ|ਸੁਤੰਤਰ|ਵਰਣਮਾਲਾ-ਚਾਲ|ਗਿਣਤੀ-ਪਹਿਲਾਂ|ਪ੍ਰੋਟੋਟਾਈਪ|ਸਿੱਧੀ ਪੂਰਤੀ|ਲਕਸ਼ ਜੋੜਾ|ਸਾਂਝਾ ਨਿਯਮ|Latin script/;

let localizedQuestions = 0;

for (const ql of ANA_CP008_QLS) {
  const english = generateMixedAnalogy(ql.qlId, 2);
  for (const locale of ["hi-IN", "pa-IN"] as const) {
    const localized = generateLocalizedMixedAnalogy(ql.qlId, 2, locale);
    localizedQuestions += 1;

    assert.equal(localized.qlId, english.qlId);
    assert.equal(localized.prototypeId, english.prototypeId);
    assert.equal(localized.ruleId, english.ruleId);
    assert.equal(localized.presentationMode, english.presentationMode);
    assert.equal(localized.contextKey, english.contextKey);
    assert.equal(localized.difficulty, english.difficulty);
    assert.equal(localized.correctIndex, english.correctIndex);
    assert.deepEqual(localized.options, english.options);
    assert.equal(localized.locale, locale);
    assert.equal(localized.metadata.publiclyPublishable, false);

    const visible = `${localized.stem}\n${JSON.stringify(localized.explanation)}`;
    assert.ok(locale === "hi-IN" ? DEVANAGARI.test(visible) : GURMUKHI.test(visible));
    assert.ok(!ENGLISH_INSTRUCTION.test(visible), `${ql.qlId} ${locale} contains English instruction text.`);
    assert.ok(!INTERNAL_TEXT.test(visible), `${ql.qlId} ${locale} leaks internal metadata.`);
    assert.ok(!PLACEHOLDER_TEXT.test(visible), `${ql.qlId} ${locale} contains a placeholder.`);
    if (locale === "pa-IN") {
      assert.ok(!AVOIDABLE_PUNJABI.test(visible), `${ql.qlId} Punjabi contains avoidable technical wording.`);
    }

    if (localized.presentationMode === "DIRECT_COMPLETION" && english.presentationMode === "DIRECT_COMPLETION") {
      assert.deepEqual(localized.source, english.source);
      assert.deepEqual(localized.target, english.target);
      assert.ok(localized.explanation.ruleStatement.length >= 15);
      assert.ok(localized.explanation.sourceDemonstration.length >= 15);
      assert.ok(localized.explanation.targetApplication.length >= 15);
      assert.ok(localized.explanation.closestTrapRejection.length >= 15);
    } else if (localized.presentationMode === "ODD_PAIR_SELECTION" && english.presentationMode === "ODD_PAIR_SELECTION") {
      assert.deepEqual(localized.validPairs, english.validPairs);
      assert.deepEqual(localized.oddPair, english.oddPair);
      assert.deepEqual(localized.expectedOddOutput, english.expectedOddOutput);
      assert.equal(localized.explanation.validPairDemonstrations.length, 3);
      assert.ok(localized.explanation.oddPairRejection.length >= 15);
    } else {
      assert.fail(`${ql.qlId} lost presentation-mode parity in ${locale}.`);
    }
  }
}

assert.equal(localizedQuestions, 56);

console.log("ANA-CP-008 Hindi/Punjabi runtime audit passed.", {
  qls: ANA_CP008_QLS.length,
  locales: 2,
  localizedQuestions,
});
