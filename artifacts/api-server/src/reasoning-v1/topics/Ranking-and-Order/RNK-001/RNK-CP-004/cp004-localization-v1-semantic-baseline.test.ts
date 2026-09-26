import assert from 'node:assert/strict';

import {
  buildRnkCp004PermanentRuntime,
} from './cp004-permanent-runtime-v1';
import {
  RNK_CP004_LOCALIZATION_REVIEW_AUTHORITY,
  RNK_CP004_LOCALIZATION_REVIEW_VERSION,
  buildRnkCp004LocalizedReviewBank,
  localizeRnkCp004PermanentQuestion,
  rnkCp004CanonicalSemanticFingerprint,
} from './cp004-localization-review-v1';

const canonical = buildRnkCp004PermanentRuntime();
const hindi = buildRnkCp004LocalizedReviewBank('hi-IN');
const punjabi = buildRnkCp004LocalizedReviewBank('pa-IN');
const hindiReplay = buildRnkCp004LocalizedReviewBank('hi-IN');

assert.equal(canonical.length, 1_728);
assert.equal(hindi.length, 1_728);
assert.equal(punjabi.length, 1_728);
assert.deepEqual(hindiReplay, hindi, 'CP004 V1 semantic baseline must replay deterministically');

const qls = new Set<string>();
const authorities = new Set<string>();
const prototypes = new Set<string>();
const contexts = new Set<string>();
const variants = new Set<string>();
const hindiFingerprints = new Set<string>();
const punjabiFingerprints = new Set<string>();

for (let index = 0; index < canonical.length; index += 1) {
  const source = canonical[index]! as Record<string, any>;
  const hi = hindi[index]!;
  const pa = punjabi[index]!;

  assert.deepEqual(hi, localizeRnkCp004PermanentQuestion(source, 'hi-IN'));
  assert.deepEqual(pa, localizeRnkCp004PermanentQuestion(source, 'pa-IN'));

  for (const localized of [hi, pa]) {
    assert.equal(localized.packageId, source.packageId);
    assert.equal(localized.checkpointId, source.checkpointId);
    assert.equal(localized.prototypeId, source.prototypeId);
    assert.equal(localized.seed, source.seed);
    assert.deepEqual(localized.displayedEvidence, source.displayedEvidence);
    assert.deepEqual(localized.reviewMetadata, source.reviewMetadata);
    assert.equal(localized.answerKey, source.answerKey);
    assert.equal(localized.answerSemantic, source.answerSemantic);
    assert.equal(localized.correctIndex, source.correctIndex);
    assert.equal(localized.difficulty, source.difficulty);
    assert.equal(localized.mathematicalFingerprint, source.mathematicalFingerprint);
    assert.equal(localized.options.length, source.options.length);
    localized.options.forEach((option: Record<string, unknown>, optionIndex: number) => {
      const baseline = source.options[optionIndex]!;
      assert.equal(option.answerKey, baseline.answerKey);
      assert.equal(option.misconceptionId, baseline.misconceptionId);
    });
    assert.equal(localized.answer, localized.options[localized.correctIndex]!.label);
    assert.equal(localized.localizationMetadata.version, RNK_CP004_LOCALIZATION_REVIEW_VERSION);
    assert.equal(localized.localizationMetadata.structuredEvidenceRendered, true);
    assert.equal(localized.localizationMetadata.canonicalOutcomePreserved, true);
    assert.equal(localized.localizationMetadata.sourceInversePreserved, true);
    assert.equal(localized.localizationProof.authority, RNK_CP004_LOCALIZATION_REVIEW_AUTHORITY);
    assert.equal(
      localized.localizationProof.canonicalSemanticFingerprint,
      rnkCp004CanonicalSemanticFingerprint(source),
    );
    assert.equal(localized.localizationProof.semanticParity, 'EXECUTABLE_PROVED');
    assert.equal(localized.localizationProof.multilingualFreezeGranted, false);
    assert.equal(localized.localizationProof.productDeliveryUnlocked, false);
    assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
    assert.equal(localized.lifecycle.questionBankStatus, 'NOT_STORED');
    assert.equal(localized.lifecycle.testEligibility, 'INELIGIBLE');
    assert.equal(localized.lifecycle.publiclyPublishable, false);
    assert.equal(localized.lifecycle.productDeliveryUnlocked, false);
  }

  assert.equal(
    hi.localizationProof.canonicalSemanticFingerprint,
    pa.localizationProof.canonicalSemanticFingerprint,
  );
  assert.notEqual(hi.localizationProof.localizationFingerprint, pa.localizationProof.localizationFingerprint);

  const profile = source.reviewMetadata.permanentProfile;
  qls.add(profile.permanentQlId);
  authorities.add(profile.authorityId);
  prototypes.add(source.prototypeId);
  contexts.add(source.reviewMetadata.languageProfile.contextFamily);
  variants.add(source.reviewMetadata.sourceInverseProfile.variant);
  hindiFingerprints.add(hi.localizationProof.localizationFingerprint);
  punjabiFingerprints.add(pa.localizationProof.localizationFingerprint);
}

assert.equal(qls.size, 9);
assert.equal(authorities.size, 9);
assert.equal(prototypes.size, 11);
assert.equal(contexts.size, 6);
assert.deepEqual(
  [...variants].sort(),
  ['CANONICAL', 'ENTITY_AT_RANK_FROM_BOTTOM', 'ORDER_LOWEST_TO_HIGHEST', 'RANK_FROM_BOTTOM'].sort(),
);
assert.equal(hindiFingerprints.size, 1_728);
assert.equal(punjabiFingerprints.size, 1_728);

console.log(JSON.stringify({
  status: 'PASS',
  layer: 'V1_SEMANTIC_BASELINE',
  hindi: hindi.length,
  punjabi: punjabi.length,
  qls: qls.size,
  authorities: authorities.size,
  prototypes: prototypes.size,
  contexts: contexts.size,
  variants: [...variants].sort(),
  learnerLanguageApprovalClaimed: false,
  multilingualFreezeGranted: false,
}, null, 2));
