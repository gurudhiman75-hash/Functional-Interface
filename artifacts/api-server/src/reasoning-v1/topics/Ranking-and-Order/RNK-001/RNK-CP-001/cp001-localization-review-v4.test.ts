import assert from 'node:assert/strict';

import { buildRnkCp001LocalizedReviewBankV3 } from './cp001-localization-review-v3';
import {
  RNK_CP001_LOCALIZATION_REVIEW_V4_AUTHORITY,
  RNK_CP001_LOCALIZATION_REVIEW_V4_EDITORIAL,
  RNK_CP001_LOCALIZATION_REVIEW_V4_VERSION,
  buildRnkCp001LocalizedReviewBankV4,
  naturalizeRnkCp001VisibleCountLabels,
} from './cp001-localization-review-v4';

const SEEDS_PER_QL = 128;
const hi3 = buildRnkCp001LocalizedReviewBankV3('hi-IN', SEEDS_PER_QL);
const pa3 = buildRnkCp001LocalizedReviewBankV3('pa-IN', SEEDS_PER_QL);
const hi = buildRnkCp001LocalizedReviewBankV4('hi-IN', SEEDS_PER_QL);
const pa = buildRnkCp001LocalizedReviewBankV4('pa-IN', SEEDS_PER_QL);

assert.equal(hi.length, 1_152);
assert.equal(pa.length, 1_152);
assert.deepEqual(hi, buildRnkCp001LocalizedReviewBankV4('hi-IN', SEEDS_PER_QL));

assert.equal(
  naturalizeRnkCp001VisibleCountLabels('दिए गए तथ्य: बाएँ व्यक्ति = 4, दाएँ व्यक्ति = 7।', 'hi-IN'),
  'दिए गए तथ्य: बाएँ व्यक्तियों की संख्या = 4, दाएँ व्यक्तियों की संख्या = 7।',
);
assert.equal(
  naturalizeRnkCp001VisibleCountLabels('ਦਿੱਤੇ ਤੱਥ: ਉੱਪਰ ਉਮੀਦਵਾਰ = 3, ਹੇਠਾਂ ਉਮੀਦਵਾਰ = 8।', 'pa-IN'),
  'ਦਿੱਤੇ ਤੱਥ: ਉੱਪਰ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ = 3, ਹੇਠਾਂ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ = 8।',
);

const awkwardHindi = /(?:ऊपर|नीचे) अभ्यर्थी =|(?:बाएँ|दाएँ|आगे|पीछे) व्यक्ति =/u;
const awkwardPunjabi = /(?:ਉੱਪਰ|ਹੇਠਾਂ) ਉਮੀਦਵਾਰ =|(?:ਖੱਬੇ|ਸੱਜੇ|ਅੱਗੇ|ਪਿੱਛੇ) ਵਿਅਕਤੀ =/u;
let changedHi = 0;
let changedPa = 0;

for (let index = 0; index < hi.length; index += 1) {
  const h3 = hi3[index]!;
  const p3 = pa3[index]!;
  const h4 = hi[index]!;
  const p4 = pa[index]!;

  for (const [before, after] of [[h3, h4], [p3, p4]] as const) {
    assert.equal(after.stem, before.stem);
    assert.deepEqual(after.options, before.options);
    assert.equal(after.answer, before.answer);
    assert.equal(after.correctIndex, before.correctIndex);
    assert.deepEqual(after.displayedEvidence, before.displayedEvidence);
    assert.deepEqual(after.normalizedState, before.normalizedState);
    assert.equal(after.mathematicalFingerprint, before.mathematicalFingerprint);
    assert.equal(after.explanation.keyRule, before.explanation.keyRule);
    assert.equal(after.explanation.stepByStepSolution[1], before.explanation.stepByStepSolution[1]);
    assert.equal(after.explanation.stepByStepSolution[2], before.explanation.stepByStepSolution[2]);
    assert.equal(after.explanation.examSpeedShortcut, before.explanation.examSpeedShortcut);
    assert.deepEqual(after.explanation.optionAnalysis, before.explanation.optionAnalysis);
    assert.equal(after.explanation.conclusion, before.explanation.conclusion);
    assert.equal(after.localizationProof.canonicalSemanticFingerprint, before.localizationProof.canonicalSemanticFingerprint);
    assert.equal(after.reviewMetadata.localization.version, RNK_CP001_LOCALIZATION_REVIEW_V4_VERSION);
    assert.equal(after.reviewMetadata.localization.editorialVersion, RNK_CP001_LOCALIZATION_REVIEW_V4_EDITORIAL);
    assert.equal(after.localizationProof.authority, RNK_CP001_LOCALIZATION_REVIEW_V4_AUTHORITY);
    assert.equal(after.localizationProof.editorialVersion, RNK_CP001_LOCALIZATION_REVIEW_V4_EDITORIAL);
    assert.equal(after.localizationProof.multilingualFreezeGranted, false);
    assert.equal(after.lifecycle.hindiPunjabi, 'REVIEW_CANDIDATE');
    assert.equal(after.lifecycle.publiclyPublishable, false);
    assert.equal(after.lifecycle.productDeliveryUnlocked, false);
  }

  assert.equal(awkwardHindi.test(h4.explanation.stepByStepSolution[0]!), false, h4.explanation.stepByStepSolution[0]);
  assert.equal(awkwardPunjabi.test(p4.explanation.stepByStepSolution[0]!), false, p4.explanation.stepByStepSolution[0]);
  assert.equal(
    h4.explanation.stepByStepSolution[0],
    naturalizeRnkCp001VisibleCountLabels(h3.explanation.stepByStepSolution[0]!, 'hi-IN'),
  );
  assert.equal(
    p4.explanation.stepByStepSolution[0],
    naturalizeRnkCp001VisibleCountLabels(p3.explanation.stepByStepSolution[0]!, 'pa-IN'),
  );

  if (h4.explanation.stepByStepSolution[0] !== h3.explanation.stepByStepSolution[0]) changedHi += 1;
  if (p4.explanation.stepByStepSolution[0] !== p3.explanation.stepByStepSolution[0]) changedPa += 1;
}

assert.ok(changedHi > 0);
assert.ok(changedPa > 0);
assert.equal(changedHi, changedPa);
assert.equal(JSON.stringify({ hi, pa }).includes('RNK-QL-043'), false);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_CP001_LOCALIZATION_REVIEW_V4_VERSION,
  editorialVersion: RNK_CP001_LOCALIZATION_REVIEW_V4_EDITORIAL,
  authority: RNK_CP001_LOCALIZATION_REVIEW_V4_AUTHORITY,
  hindiReviewCandidates: hi.length,
  punjabiReviewCandidates: pa.length,
  naturalizedHindiVisibleCountSummaries: changedHi,
  naturalizedPunjabiVisibleCountSummaries: changedPa,
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
}, null, 2));
