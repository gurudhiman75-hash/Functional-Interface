import assert from "node:assert/strict";

import {
  buildRnkCp007PercentagePresentationBank,
} from "./cp007-percentage-presentation-adapter-v1";
import {
  RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_V2_VERSION,
  buildRnkCp007PercentagePresentationBankV2,
} from "./cp007-percentage-presentation-adapter-v2";

for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
  const v1 = buildRnkCp007PercentagePresentationBank(locale);
  const v2 = buildRnkCp007PercentagePresentationBankV2(locale);
  const replay = buildRnkCp007PercentagePresentationBankV2(locale);
  assert.equal(v2.length, v1.length);
  assert.deepEqual(replay, v2, `${locale} percentage V2 must replay deterministically`);

  for (let index = 0; index < v2.length; index += 1) {
    const before = v1[index]! as Record<string, any>;
    const after = v2[index]! as Record<string, any>;
    assert.deepEqual(after.state, before.state);
    assert.deepEqual(after.evidence, before.evidence);
    assert.deepEqual(after.options, before.options);
    assert.equal(after.answerIndex, before.answerIndex);
    assert.equal(after.answer, before.answer);
    assert.equal(after.mathematicalFingerprint, before.mathematicalFingerprint);
    assert.equal(after.permanentRuntimeFingerprint, before.permanentRuntimeFingerprint);
    assert.deepEqual(after.lifecycle, before.lifecycle);
    assert.equal(after.permanentProfile.permanentQlId, "RNK-QL-042");
    assert.equal(after.percentagePresentation.version, RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_V2_VERSION);
    assert.equal(after.percentagePresentation.v1AdapterFingerprint, before.percentagePresentation.adapterFingerprint);
    assert.equal(after.percentagePresentation.nativeGrammarOverlay, true);
    assert.equal(after.percentagePresentation.mathematicalAuthorityChanged, false);
    assert.equal(after.percentagePresentation.newQlAllocated, false);
    assert.equal(after.percentagePresentation.examProfileDeliveryOnly, true);
  }
}

const english = buildRnkCp007PercentagePresentationBankV2("en-IN");
const hindi = buildRnkCp007PercentagePresentationBankV2("hi-IN");
const punjabi = buildRnkCp007PercentagePresentationBankV2("pa-IN");

const englishText = (english as readonly Record<string, any>[])
  .map((question) => `${question.stem}\n${question.explanation}`)
  .join("\n");
assert.doesNotMatch(englishText, /\.\s+(?:boys|girls) are/u);
assert.doesNotMatch(englishText, /\.\s+(?:boys|girls) (?:ahead|behind)\s*=/u);

const hindiText = (hindi as readonly Record<string, any>[])
  .map((question) => `${question.stem}\n${question.explanation}`)
  .join("\n");
assert.doesNotMatch(hindiText, /जो लड़कियाँ में से है/u);
assert.doesNotMatch(hindiText, /जो लड़के में से है/u);
assert.doesNotMatch(hindiText, /कितने लड़कियाँ/u);
assert.doesNotMatch(hindiText, /(?:लड़कियाँ|लड़के) पहले से आगे दिए गए हैं/u);
assert.doesNotMatch(hindiText, /आगे (?:लड़कियाँ|लड़के) =/u);
assert.doesNotMatch(hindiText, /पीछे (?:लड़कियाँ|लड़के) =/u);
assert.doesNotMatch(hindiText, /(?:लड़कियाँ|लड़के) (?:आगे|पीछे)\s*=/u);
assert.match(hindiText, /जो लड़कियों में से एक है/u);
assert.match(hindiText, /कितनी लड़कियाँ/u);

const punjabiText = (punjabi as readonly Record<string, any>[])
  .map((question) => `${question.stem}\n${question.explanation}`)
  .join("\n");
assert.doesNotMatch(punjabiText, /ਜੋ ਮੁੰਡੇ ਵਿੱਚੋਂ ਹੈ/u);
assert.doesNotMatch(punjabiText, /ਕਿੰਨੇ ਕੁੜੀਆਂ/u);
assert.doesNotMatch(punjabiText, /(?:ਕੁੜੀਆਂ|ਮੁੰਡੇ) ਪਹਿਲਾਂ ਹੀ ਅੱਗੇ ਦਿੱਤੇ ਹਨ/u);
assert.doesNotMatch(punjabiText, /ਅੱਗੇ (?:ਕੁੜੀਆਂ|ਮੁੰਡੇ) =/u);
assert.doesNotMatch(punjabiText, /ਪਿੱਛੇ (?:ਕੁੜੀਆਂ|ਮੁੰਡੇ) =/u);
assert.doesNotMatch(punjabiText, /(?:ਕੁੜੀਆਂ|ਮੁੰਡੇ) (?:ਅੱਗੇ|ਪਿੱਛੇ)\s*=/u);
assert.match(punjabiText, /ਜੋ ਕੁੜੀਆਂ ਵਿੱਚੋਂ ਇੱਕ ਹੈ/u);
assert.match(punjabiText, /ਕਿੰਨੀਆਂ ਕੁੜੀਆਂ/u);

console.log(JSON.stringify({
  status: "PASS",
  version: RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_V2_VERSION,
  eligibleQuestionsPerLocale: english.length,
  nativeGrammarOverlay: true,
  residualCategorySideFragments: false,
  frozenMathematicsPreserved: true,
  newQlAllocated: false,
}, null, 2));
