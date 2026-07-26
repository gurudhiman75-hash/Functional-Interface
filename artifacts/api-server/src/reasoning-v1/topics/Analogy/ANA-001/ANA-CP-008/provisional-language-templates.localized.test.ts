import assert from "node:assert/strict";
import {
  ANA_CP008_ENGLISH_PROTOTYPES,
  renderDirectEnglishPrototype,
  renderOddPairEnglishPrototype,
} from "./provisional-language-templates.en";
import {
  renderAllLocalizedDirectPrototypes,
  renderAllLocalizedOddPairPrototypes,
  type ProvisionalMixedLocale,
} from "./provisional-language-templates.localized";
import { mixedTokenKey, renderMixedToken, sameMixedToken } from "./foundation/mixed-token";

const DEVANAGARI = /[\u0900-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;
const ENGLISH_INSTRUCTION = /\b(?:choose|select|find|complete|therefore|rule|source|target|answer|correct|wrong|letter|number)\b/i;
const INTERNAL_TEXT = /ANA-QL|ANA-CP|MIXED_|PROTO_|ruleId|contextKey|LANGUAGE_PROTOTYPE|publiclyPublishable/i;
const PLACEHOLDER_TEXT = /\{\{?[^}]+\}?\}|\[[A-Z_]{3,}\]/;
const OVERLY_TECHNICAL_PUNJABI = /ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ|ਸਰੋਤ|ਸੁਤੰਤਰ|ਵਰਣਮਾਲਾ-ਚਾਲ|ਗਿਣਤੀ-ਪਹਿਲਾਂ|ਲੋੜੀਂਦੀ ਗਿਣਤੀ|ਅੱਖਰ ਬਦਲਣ ਨਾਲ|ਇਹੋ ਨਿਯਮ|ਸੰਬੰਧ ਬਣਦਾ ਹੈ/;

function evidenceKey(evidence: { input: Parameters<typeof mixedTokenKey>[0]; output: Parameters<typeof mixedTokenKey>[0] }): string {
  return `${mixedTokenKey(evidence.input)}=>${mixedTokenKey(evidence.output)}`;
}

for (const locale of ["hi-IN", "pa-IN"] as const satisfies readonly ProvisionalMixedLocale[]) {
  const direct = renderAllLocalizedDirectPrototypes(locale);
  const odd = renderAllLocalizedOddPairPrototypes(locale);

  assert.equal(direct.length, ANA_CP008_ENGLISH_PROTOTYPES.length);
  assert.equal(odd.length, ANA_CP008_ENGLISH_PROTOTYPES.length);

  for (const localized of direct) {
    const english = renderDirectEnglishPrototype(localized.prototypeId);
    assert.equal(localized.locale, locale);
    assert.equal(localized.metadata.permanentQlId, null);
    assert.equal(localized.metadata.publiclyPublishable, false);
    assert.equal(localized.metadata.maturity, "LANGUAGE_PROTOTYPE");
    assert.equal(evidenceKey(localized.source), evidenceKey(english.source));
    assert.equal(evidenceKey(localized.target), evidenceKey(english.target));
    assert.ok(sameMixedToken(localized.correctAnswer, english.correctAnswer));
    assert.ok(localized.stem.includes(renderMixedToken(localized.source.input)));
    assert.ok(localized.stem.includes(renderMixedToken(localized.source.output)));
    assert.ok(localized.stem.includes(renderMixedToken(localized.target.input)));
    assert.ok(localized.stem.includes("?"));

    const studentText = [localized.stem, ...Object.values(localized.explanation)].join("\n");
    assert.ok(locale === "hi-IN" ? DEVANAGARI.test(studentText) : GURMUKHI.test(studentText),
      `${localized.prototypeId} must contain the correct native script for ${locale}.`);
    assert.ok(!ENGLISH_INSTRUCTION.test(studentText),
      `${localized.prototypeId} leaks English instructional prose in ${locale}.`);
    assert.ok(!INTERNAL_TEXT.test(studentText),
      `${localized.prototypeId} leaks implementation text in ${locale}.`);
    assert.ok(!PLACEHOLDER_TEXT.test(studentText),
      `${localized.prototypeId} contains an unresolved placeholder in ${locale}.`);
    if (locale === "pa-IN") {
      assert.ok(!OVERLY_TECHNICAL_PUNJABI.test(studentText),
        `${localized.prototypeId} contains avoidable textbook-style Punjabi.`);
    }
    assert.ok(localized.explanation.ruleStatement.length >= 25);
    assert.ok(localized.explanation.sourceDemonstration.includes(renderMixedToken(localized.source.input)));
    assert.ok(localized.explanation.sourceDemonstration.includes(renderMixedToken(localized.source.output)));
    assert.ok(localized.explanation.targetApplication.includes(renderMixedToken(localized.target.input)));
    assert.ok(localized.explanation.targetApplication.includes(renderMixedToken(localized.correctAnswer)));
    assert.ok(localized.explanation.conclusion.includes(renderMixedToken(localized.correctAnswer)));
    assert.ok(localized.explanation.closestTrapRejection.length >= 45);
  }

  for (const localized of odd) {
    const english = renderOddPairEnglishPrototype(localized.prototypeId);
    assert.equal(localized.locale, locale);
    assert.equal(localized.metadata.permanentQlId, null);
    assert.equal(localized.metadata.publiclyPublishable, false);
    assert.equal(localized.correctIndex, english.correctIndex);
    assert.deepEqual(localized.options.map(evidenceKey), english.options.map(evidenceKey));
    assert.equal(localized.options.length, 4);
    assert.equal(new Set(localized.options.map(evidenceKey)).size, 4);
    assert.equal(localized.explanation.validPairDemonstrations.length, 3);

    const oddPair = localized.options[localized.correctIndex];
    assert.ok(localized.explanation.oddPairRejection.includes(renderMixedToken(oddPair.input)));
    assert.ok(localized.explanation.oddPairRejection.includes(renderMixedToken(oddPair.output)));
    assert.ok(localized.explanation.conclusion.includes(renderMixedToken(oddPair.input)));
    assert.ok(localized.explanation.conclusion.includes(renderMixedToken(oddPair.output)));

    const studentText = [
      localized.stem,
      localized.explanation.commonRule,
      ...localized.explanation.validPairDemonstrations,
      localized.explanation.oddPairRejection,
      localized.explanation.conclusion,
    ].join("\n");
    assert.ok(locale === "hi-IN" ? DEVANAGARI.test(studentText) : GURMUKHI.test(studentText));
    assert.ok(!ENGLISH_INSTRUCTION.test(studentText));
    assert.ok(!INTERNAL_TEXT.test(studentText));
    assert.ok(!PLACEHOLDER_TEXT.test(studentText));
    if (locale === "pa-IN") {
      assert.ok(!OVERLY_TECHNICAL_PUNJABI.test(studentText),
        `${localized.prototypeId} contains avoidable textbook-style Punjabi.`);
    }
  }

  if (locale === "pa-IN") {
    assert.ok(new Set(direct.map((entry) => entry.explanation.conclusion)).size >= 3,
      "Punjabi direct conclusions should not use one repeated stock sentence.");
    assert.ok(new Set(odd.map((entry) => entry.explanation.conclusion)).size >= 3,
      "Punjabi odd-pair conclusions should not use one repeated stock sentence.");
  }

  for (const localized of direct.filter((entry) =>
    entry.prototypeId === "PROTO_EXACT_MULTIPLIER_NUMBER_FIRST" ||
    entry.prototypeId === "PROTO_SQUARE_ROOT_SUCCESSOR_NUMBER_FIRST")) {
    assert.match(renderMixedToken(localized.correctAnswer), /^-?\d+[A-Z]{2,6}$/);
    assert.match(
      localized.explanation.targetApplication,
      locale === "hi-IN" ? /संख्या-पहले/ : /ਗਿਣਤੀ ਪਹਿਲਾਂ/,
    );
  }
}

for (const prototype of ANA_CP008_ENGLISH_PROTOTYPES) {
  const hiDirect = renderAllLocalizedDirectPrototypes("hi-IN").find((entry) => entry.prototypeId === prototype.prototypeId);
  const paDirect = renderAllLocalizedDirectPrototypes("pa-IN").find((entry) => entry.prototypeId === prototype.prototypeId);
  assert.ok(hiDirect && paDirect);
  assert.ok(sameMixedToken(hiDirect.correctAnswer, paDirect.correctAnswer));
  assert.notEqual(hiDirect.stem, paDirect.stem);
  assert.notEqual(hiDirect.explanation.ruleStatement, paDirect.explanation.ruleStatement);
}

console.log("ANA-CP-008 Hindi/Punjabi language prototype audit passed.", {
  prototypeFamilies: ANA_CP008_ENGLISH_PROTOTYPES.length,
  locales: 2,
  directSamples: ANA_CP008_ENGLISH_PROTOTYPES.length * 2,
  oddPairSamples: ANA_CP008_ENGLISH_PROTOTYPES.length * 2,
  permanentQlIdsAllocated: 0,
});
