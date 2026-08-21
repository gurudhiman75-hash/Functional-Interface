import assert from "node:assert/strict";

import { buildRnkCp007LocalizedReviewBankV2 } from "./cp007-localization-review-v2";
import {
  RNK_CP007_LOCALIZATION_REVIEW_V3_AUTHORITY,
  RNK_CP007_LOCALIZATION_REVIEW_V3_EDITORIAL,
  RNK_CP007_LOCALIZATION_REVIEW_V3_VERSION,
  buildRnkCp007LocalizedReviewBankV3,
  buildRnkCp007MultilingualReviewCandidateV3,
  repairRnkCp007NativeCountAgreement,
} from "./cp007-localization-review-v3";

const first = buildRnkCp007MultilingualReviewCandidateV3();
const second = buildRnkCp007MultilingualReviewCandidateV3();
assert.deepEqual(first, second);
assert.equal(first.hindi.length, 192);
assert.equal(first.punjabi.length, 192);

const badHindi = /(?:कितने लड़कियाँ|लड़कियाँ कितने हैं)/u;
const badPunjabi = /(?:ਕਿੰਨੇ ਕੁੜੀਆਂ|ਕੁੜੀਆਂ ਕਿੰਨੇ ਹਨ)/u;
let hiChanges = 0;
let paChanges = 0;
let hiProtected = 0;
let paProtected = 0;

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const beforeBank = buildRnkCp007LocalizedReviewBankV2(locale);
  const afterBank = buildRnkCp007LocalizedReviewBankV3(locale);
  assert.equal(beforeBank.length, afterBank.length);

  for (let index = 0; index < beforeBank.length; index += 1) {
    const before = beforeBank[index]!;
    const after = afterBank[index]!;

    assert.equal(after.stem, repairRnkCp007NativeCountAgreement(before.stem, locale));
    assert.deepEqual(after.state, before.state);
    assert.deepEqual(after.evidence, before.evidence);
    assert.deepEqual(after.options, before.options);
    assert.equal(after.answerIndex, before.answerIndex);
    assert.equal(after.answer, before.answer);
    assert.equal(after.explanation, before.explanation);
    assert.equal(after.mathematicalFingerprint, before.mathematicalFingerprint);
    assert.equal(after.permanentRuntimeFingerprint, before.permanentRuntimeFingerprint);
    assert.equal(after.localizationProof.canonicalSemanticFingerprint, before.localizationProof.canonicalSemanticFingerprint);
    assert.equal(after.localizationProof.canonicalItemId, before.localizationProof.canonicalItemId);

    assert.equal(after.reviewMetadata.localization.version, RNK_CP007_LOCALIZATION_REVIEW_V3_VERSION);
    assert.equal(after.reviewMetadata.localization.editorialVersion, RNK_CP007_LOCALIZATION_REVIEW_V3_EDITORIAL);
    assert.equal(after.localizationProof.authority, RNK_CP007_LOCALIZATION_REVIEW_V3_AUTHORITY);
    assert.equal(after.localizationProof.multilingualFreezeGranted, false);
    assert.equal(after.lifecycle.hindiPunjabi, "REVIEW_CANDIDATE");
    assert.equal(after.lifecycle.questionStudio, "DISABLED");
    assert.equal(after.lifecycle.questionBank, "NOT_STORED");
    assert.equal(after.lifecycle.publiclyPublishable, false);

    if (locale === "hi-IN") {
      assert.equal(badHindi.test(after.stem), false, after.stem);
      if (before.stem !== after.stem) hiChanges += 1;
    } else {
      assert.equal(badPunjabi.test(after.stem), false, after.stem);
      if (before.stem !== after.stem) paChanges += 1;
    }

    if (after.reviewMetadata.partitionId === "boys-girls" && after.reviewMetadata.requestedCategory === "B") {
      const style = after.reviewMetadata.surfaceProfile.style;
      if (locale === "hi-IN") {
        hiProtected += 1;
        if (style === "ORDER_OF_MERIT") assert.match(after.stem, /लड़कियों की संख्या ज्ञात कीजिए।/u);
        else assert.match(after.stem, /कितनी लड़कियाँ हैं\?/u);
      } else {
        paProtected += 1;
        if (style === "ORDER_OF_MERIT") assert.match(after.stem, /ਕੁੜੀਆਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।/u);
        else assert.match(after.stem, /ਕਿੰਨੀਆਂ ਕੁੜੀਆਂ ਹਨ\?/u);
      }
    }
  }
}

assert.ok(hiChanges > 0);
assert.ok(paChanges > 0);
assert.equal(hiChanges, paChanges);
assert.ok(hiProtected > 0);
assert.equal(hiProtected, paProtected);

console.log(JSON.stringify({
  status: "PASS",
  version: RNK_CP007_LOCALIZATION_REVIEW_V3_VERSION,
  hiChanges,
  paChanges,
  hiProtected,
  paProtected,
  multilingualFreezeGranted: false,
}, null, 2));
