import assert from "node:assert/strict";

import { buildRnkCp007LocalizedReviewBankV3 } from "./cp007-localization-review-v3";
import {
  RNK_CP007_LOCALIZATION_REVIEW_V4_AUTHORITY,
  RNK_CP007_LOCALIZATION_REVIEW_V4_EDITORIAL,
  RNK_CP007_LOCALIZATION_REVIEW_V4_VERSION,
  buildRnkCp007LocalizedReviewBankV4,
  buildRnkCp007MultilingualReviewCandidateV4,
  repairRnkCp007NativeBatchGenitives,
} from "./cp007-localization-review-v4";

const first = buildRnkCp007MultilingualReviewCandidateV4();
const second = buildRnkCp007MultilingualReviewCandidateV4();
assert.deepEqual(first, second);
assert.equal(first.hindi.length, 192);
assert.equal(first.punjabi.length, 192);

const badHindi = /(?:सुबह बैच|शाम बैच)/u;
const badPunjabi = /(?:ਸਵੇਰ ਬੈਚ|ਸ਼ਾਮ ਬੈਚ)/u;
const feminineHindi = /(?:कितने लड़कियाँ|लड़कियाँ कितने हैं)/u;
const femininePunjabi = /(?:ਕਿੰਨੇ ਕੁੜੀਆਂ|ਕੁੜੀਆਂ ਕਿੰਨੇ ਹਨ)/u;
let hiStemChanges = 0;
let paStemChanges = 0;
let hiExplanationChanges = 0;
let paExplanationChanges = 0;
let hiBatchQuestions = 0;
let paBatchQuestions = 0;
let unchangedQuestions = 0;

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const beforeBank = buildRnkCp007LocalizedReviewBankV3(locale);
  const afterBank = buildRnkCp007LocalizedReviewBankV4(locale);
  assert.equal(beforeBank.length, afterBank.length);

  for (let index = 0; index < beforeBank.length; index += 1) {
    const before = beforeBank[index]!;
    const after = afterBank[index]!;
    const beforeText = `${before.stem}\n${before.explanation}`;
    const batchAffected = locale === "hi-IN"
      ? badHindi.test(beforeText)
      : badPunjabi.test(beforeText);

    assert.equal(after.stem, repairRnkCp007NativeBatchGenitives(before.stem, locale));
    assert.equal(after.explanation, repairRnkCp007NativeBatchGenitives(before.explanation, locale));
    assert.deepEqual(after.state, before.state);
    assert.deepEqual(after.evidence, before.evidence);
    assert.deepEqual(after.options, before.options);
    assert.equal(after.answerIndex, before.answerIndex);
    assert.equal(after.answer, before.answer);
    assert.equal(after.mathematicalFingerprint, before.mathematicalFingerprint);
    assert.equal(after.permanentRuntimeFingerprint, before.permanentRuntimeFingerprint);
    assert.equal(after.localizationProof.canonicalSemanticFingerprint, before.localizationProof.canonicalSemanticFingerprint);
    assert.equal(after.localizationProof.canonicalItemId, before.localizationProof.canonicalItemId);

    assert.equal(after.reviewMetadata.localization.version, RNK_CP007_LOCALIZATION_REVIEW_V4_VERSION);
    assert.equal(after.reviewMetadata.localization.editorialVersion, RNK_CP007_LOCALIZATION_REVIEW_V4_EDITORIAL);
    assert.equal(after.localizationProof.authority, RNK_CP007_LOCALIZATION_REVIEW_V4_AUTHORITY);
    assert.equal(after.localizationProof.multilingualFreezeGranted, false);
    assert.equal(after.lifecycle.hindiPunjabi, "REVIEW_CANDIDATE");
    assert.equal(after.lifecycle.questionStudio, "DISABLED");
    assert.equal(after.lifecycle.questionBank, "NOT_STORED");
    assert.equal(after.lifecycle.publiclyPublishable, false);

    const afterText = `${after.stem}\n${after.explanation}`;
    if (locale === "hi-IN") {
      assert.equal(badHindi.test(afterText), false, afterText);
      assert.equal(feminineHindi.test(after.stem), false, after.stem);
      if (before.stem !== after.stem) hiStemChanges += 1;
      if (before.explanation !== after.explanation) hiExplanationChanges += 1;
      if (batchAffected) hiBatchQuestions += 1;
    } else {
      assert.equal(badPunjabi.test(afterText), false, afterText);
      assert.equal(femininePunjabi.test(after.stem), false, after.stem);
      if (before.stem !== after.stem) paStemChanges += 1;
      if (before.explanation !== after.explanation) paExplanationChanges += 1;
      if (batchAffected) paBatchQuestions += 1;
    }

    if (!batchAffected) {
      assert.equal(after.stem, before.stem);
      assert.equal(after.explanation, before.explanation);
      unchangedQuestions += 1;
    }
  }
}

assert.ok(hiBatchQuestions > 0);
assert.ok(paBatchQuestions > 0);
assert.equal(hiBatchQuestions, paBatchQuestions);
assert.ok(hiStemChanges > 0);
assert.ok(paStemChanges > 0);
assert.ok(hiExplanationChanges > 0);
assert.ok(paExplanationChanges > 0);
assert.equal(hiStemChanges, paStemChanges);
assert.equal(hiExplanationChanges, paExplanationChanges);

console.log(JSON.stringify({
  status: "PASS",
  version: RNK_CP007_LOCALIZATION_REVIEW_V4_VERSION,
  hiBatchQuestions,
  paBatchQuestions,
  hiStemChanges,
  paStemChanges,
  hiExplanationChanges,
  paExplanationChanges,
  unchangedQuestions,
  v3FeminineAgreementPreserved: true,
  multilingualFreezeGranted: false,
}, null, 2));
