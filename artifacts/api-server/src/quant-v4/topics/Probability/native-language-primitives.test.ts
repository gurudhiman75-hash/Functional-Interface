import assert from "node:assert/strict";
import {
  PROBABILITY_NATIVE_NUMBER_POLICY,
  PROBABILITY_NATIVE_TERM_IDS,
  assertProbabilityNativeTextValid,
  auditProbabilityNativeText,
  getProbabilityNativeTerm,
  isProbabilityMathOrNumericOption,
  listUnresolvedProbabilityPlaceholders,
  localizeProbabilityOption,
  localizeProbabilityPrimitiveToken,
  preserveProbabilityNativeNumericDisplay,
} from "./native-language-primitives";

function assertThrowsMessage(fn: () => unknown, expected: RegExp): void {
  assert.throws(fn, expected);
}

assert(
  PROBABILITY_NATIVE_TERM_IDS.length >= 70,
  `Expected a broad ML-02 vocabulary, found ${PROBABILITY_NATIVE_TERM_IDS.length} terms.`,
);

for (const termId of PROBABILITY_NATIVE_TERM_IDS) {
  const hi = getProbabilityNativeTerm(termId, "hi");
  const pa = getProbabilityNativeTerm(termId, "pa");
  const hiAudit = auditProbabilityNativeText(hi, "hi");
  const paAudit = auditProbabilityNativeText(pa, "pa");
  assert(hiAudit.valid, `${termId}/hi failed native script audit: ${JSON.stringify(hiAudit)}`);
  assert(paAudit.valid, `${termId}/pa failed native script audit: ${JSON.stringify(paAudit)}`);
}

assert.equal(localizeProbabilityPrimitiveToken("red", "hi"), "लाल");
assert.equal(localizeProbabilityPrimitiveToken("Red", "pa"), "ਲਾਲ");
assert.equal(localizeProbabilityPrimitiveToken("without replacement", "hi"), "पुनःस्थापन के बिना");
assert.equal(localizeProbabilityPrimitiveToken("cricket", "pa"), "ਕ੍ਰਿਕਟ");
assertThrowsMessage(
  () => localizeProbabilityPrimitiveToken("mystery-object", "hi"),
  /Unsupported Probability native primitive token/,
);

const numericOptions = [
  "0",
  "42",
  "1/3",
  "25%",
  "2:3",
  "\\frac{2}{5}",
  "\\(\\frac{3}{7}\\)",
  "$1/2$",
];
for (const option of numericOptions) {
  assert(isProbabilityMathOrNumericOption(option), `${option} should be recognised as math/numeric.`);
  assert.equal(localizeProbabilityOption(option, "hi"), option, `${option}/hi must be byte-preserved.`);
  assert.equal(localizeProbabilityOption(option, "pa"), option, `${option}/pa must be byte-preserved.`);
  assert.equal(preserveProbabilityNativeNumericDisplay(option), option);
}

assert.equal(localizeProbabilityOption("None of these", "hi"), "इनमें से कोई नहीं");
assert.equal(localizeProbabilityOption("Cannot be determined", "pa"), "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ");
assert.equal(localizeProbabilityOption("Both A and B", "hi"), "A और B दोनों");
assert.equal(localizeProbabilityOption("Same probability", "pa"), "ਇੱਕੋ ਸੰਭਾਵਨਾ");
assertThrowsMessage(
  () => localizeProbabilityOption("An unreviewed English sentence", "pa"),
  /fail-closed for unknown prose/,
);
assertThrowsMessage(
  () => preserveProbabilityNativeNumericDisplay("one half"),
  /not an approved numeric\/math form/,
);

assert.deepEqual(
  listUnresolvedProbabilityPlaceholders(
    "अनुकूल परिणाम = \\(\\frac{a}{b}\\), लेकिन {colour} और ${drawCount} अभी बंधे नहीं हैं।",
  ),
  ["colour", "drawCount"],
  "MathJax braces must not be mistaken for prose placeholders.",
);
assert.deepEqual(
  listUnresolvedProbabilityPlaceholders("\\[\\frac{n!}{r!(n-r)!}\\]"),
  [],
  "Pure MathJax must not create placeholder failures.",
);

assertProbabilityNativeTextValid("अनुकूल परिणामों की संख्या 3 है।", "hi");
assertProbabilityNativeTextValid("ਅਨੁਕੂਲ ਨਤੀਜਿਆਂ ਦੀ ਗਿਣਤੀ 3 ਹੈ।", "pa");
assertProbabilityNativeTextValid("A और B दोनों", "hi");
assertProbabilityNativeTextValid("3/5", "hi", { allowMathOnly: true });
assertProbabilityNativeTextValid("\\(\\frac{3}{5}\\)", "pa", { allowMathOnly: true });

const englishFallbackAudit = auditProbabilityNativeText("The probability is 1/2.", "hi");
assert.equal(englishFallbackAudit.valid, false, "English fallback prose must fail the Hindi audit.");
assert(englishFallbackAudit.disallowedLatinTokens.includes("probability"));

const wrongScriptAudit = auditProbabilityNativeText("ਸੰਭਾਵਨਾ", "hi");
assert.equal(wrongScriptAudit.valid, false, "Punjabi script must fail the Hindi audit.");
assert.equal(wrongScriptAudit.hasWrongNativeScript, true);

const unresolvedAudit = auditProbabilityNativeText("प्रायिकता {value} है।", "hi");
assert.equal(unresolvedAudit.valid, false, "Unresolved placeholders must fail the native audit.");
assert.deepEqual(unresolvedAudit.unresolvedPlaceholders, ["value"]);

assert.equal(PROBABILITY_NATIVE_NUMBER_POLICY.digits, "ASCII_0_9");
assert.equal(PROBABILITY_NATIVE_NUMBER_POLICY.fractionStyle, "PRESERVE_SOURCE_FRACTION");
assert.equal(PROBABILITY_NATIVE_NUMBER_POLICY.mathJaxStyle, "PRESERVE_SOURCE_MATHJAX");

console.log(
  JSON.stringify(
    {
      status: "PASS",
      checkpoint: "ML-02",
      termCount: PROBABILITY_NATIVE_TERM_IDS.length,
      numericOptionSamples: numericOptions.length,
      policies: PROBABILITY_NATIVE_NUMBER_POLICY,
    },
    null,
    2,
  ),
);
