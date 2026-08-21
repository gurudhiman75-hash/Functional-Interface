import assert from 'node:assert/strict';

import {
  RNK_CP001_PERMANENT_QL_IDS,
  generateRnkCp001PermanentQuestion,
} from './cp001-permanent-runtime';
import {
  RNK_CP001_LOCALIZATION_REVIEW_AUTHORITY,
  RNK_CP001_LOCALIZATION_REVIEW_VERSION,
  buildRnkCp001LocalizedReviewBank,
  localizeRnkCp001PermanentQuestion,
  rnkCp001CanonicalSemanticFingerprint,
} from './cp001-localization-review-v1';

const SEEDS_PER_QL = 128;
const hindi = buildRnkCp001LocalizedReviewBank('hi-IN', SEEDS_PER_QL);
const punjabi = buildRnkCp001LocalizedReviewBank('pa-IN', SEEDS_PER_QL);
const hindiReplay = buildRnkCp001LocalizedReviewBank('hi-IN', SEEDS_PER_QL);

assert.equal(hindi.length, 1_152);
assert.equal(punjabi.length, 1_152);
assert.deepEqual(hindiReplay, hindi, 'CP001 Hindi localization must replay deterministically');

const devanagari = /[\u0900-\u097F]/u;
const gurmukhi = /[\u0A00-\u0A7F]/u;
const residualEnglishWord = /[A-Za-z]{2,}/u;
const contexts = new Set<string>();
const qls = new Set<string>();
const prototypes = new Set<string>();
const canonicalFingerprints = new Set<string>();
const hindiFingerprints = new Set<string>();
const punjabiFingerprints = new Set<string>();
const answerPositions = [0, 0, 0, 0];

for (let qlIndex = 0; qlIndex < RNK_CP001_PERMANENT_QL_IDS.length; qlIndex += 1) {
  const qlId = RNK_CP001_PERMANENT_QL_IDS[qlIndex]!;
  for (let seed = 0; seed < SEEDS_PER_QL; seed += 1) {
    const index = qlIndex * SEEDS_PER_QL + seed;
    const canonical = generateRnkCp001PermanentQuestion(qlId, seed);
    const hi = hindi[index]!;
    const pa = punjabi[index]!;

    assert.deepEqual(hi, localizeRnkCp001PermanentQuestion(canonical, 'hi-IN'));
    assert.deepEqual(pa, localizeRnkCp001PermanentQuestion(canonical, 'pa-IN'));

    for (const localized of [hi, pa]) {
      assert.equal(localized.packageId, canonical.packageId);
      assert.equal(localized.checkpointId, canonical.checkpointId);
      assert.equal(localized.qlId, canonical.qlId);
      assert.equal(localized.permanentQlId, canonical.permanentQlId);
      assert.equal(localized.seed, canonical.seed);
      assert.equal(localized.authorityId, canonical.authorityId);
      assert.deepEqual(localized.authorityContract, canonical.authorityContract);
      assert.deepEqual(localized.displayedEvidence, canonical.displayedEvidence);
      assert.equal(localized.answerSemantic, canonical.answerSemantic);
      assert.equal(localized.answer, canonical.answer);
      assert.equal(localized.correctIndex, canonical.correctIndex);
      assert.equal(localized.difficulty, canonical.difficulty);
      assert.deepEqual(localized.normalizedState, canonical.normalizedState);
      assert.equal(localized.mathematicalFingerprint, canonical.mathematicalFingerprint);
      assert.equal(localized.canonicalLocale, 'en-IN');

      assert.equal(localized.options.length, canonical.options.length);
      localized.options.forEach((option, optionIndex) => {
        const sourceOption = canonical.options[optionIndex]!;
        assert.equal(option.value, sourceOption.value);
        assert.equal(option.label, sourceOption.label);
        assert.equal(option.misconceptionId, sourceOption.misconceptionId);
        assert.equal(option.value === canonical.answer, optionIndex === canonical.correctIndex);
      });

      assert.equal(localized.reviewMetadata.sourcePrototypeId, canonical.reviewMetadata.sourcePrototypeId);
      assert.equal(localized.reviewMetadata.sourceVariantIndex, canonical.reviewMetadata.sourceVariantIndex);
      assert.equal(localized.reviewMetadata.sourceVariantCount, canonical.reviewMetadata.sourceVariantCount);
      assert.equal(localized.reviewMetadata.discoverySeed, canonical.reviewMetadata.discoverySeed);
      assert.equal(localized.reviewMetadata.englishReviewProjectionVersion, 'RNK_CP001_ENGLISH_REVIEW_V1');
      assert.equal(localized.reviewMetadata.localization.version, RNK_CP001_LOCALIZATION_REVIEW_VERSION);
      assert.equal(localized.reviewMetadata.localization.humanLanguageReviewRequired, true);

      assert.equal(localized.lifecycle.permanentQlAllocated, true);
      assert.equal(localized.lifecycle.englishFrozen, true);
      assert.equal(localized.lifecycle.hindiPunjabi, 'REVIEW_CANDIDATE');
      assert.equal(localized.lifecycle.humanLanguageReviewRequired, true);
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
      assert.equal(localized.lifecycle.questionBankStatus, 'NOT_STORED');
      assert.equal(localized.lifecycle.testEligibility, 'INELIGIBLE');
      assert.equal(localized.lifecycle.publiclyPublishable, false);
      assert.equal(localized.lifecycle.productDeliveryUnlocked, false);

      assert.equal(localized.localizationProof.authority, RNK_CP001_LOCALIZATION_REVIEW_AUTHORITY);
      assert.equal(localized.localizationProof.permanentQlId, canonical.qlId);
      assert.equal(localized.localizationProof.semanticParity, 'EXECUTABLE_PROVED');
      assert.equal(localized.localizationProof.humanLanguageReviewRequired, true);
      assert.equal(localized.localizationProof.multilingualFreezeGranted, false);
      assert.equal(localized.localizationProof.productDeliveryUnlocked, false);
      assert.equal(
        localized.localizationProof.canonicalSemanticFingerprint,
        rnkCp001CanonicalSemanticFingerprint(canonical),
      );

      const learnerText = [
        localized.stem,
        ...localized.options.map((option) => option.explanation),
        localized.explanation.keyRule,
        ...localized.explanation.stepByStepSolution,
        localized.explanation.examSpeedShortcut,
        ...localized.explanation.optionAnalysis,
        localized.explanation.conclusion,
      ].join('\n');
      assert.equal(residualEnglishWord.test(learnerText), false, learnerText);
      assert.equal(/[{}]/u.test(learnerText), false, learnerText);
      if (localized.locale === 'hi-IN') assert.match(learnerText, devanagari);
      else assert.match(learnerText, gurmukhi);
    }

    assert.equal(hi.locale, 'hi-IN');
    assert.equal(pa.locale, 'pa-IN');
    assert.equal(hi.contextId, pa.contextId);
    assert.equal(hi.canonicalTargetName, pa.canonicalTargetName);
    assert.equal(
      hi.localizationProof.canonicalSemanticFingerprint,
      pa.localizationProof.canonicalSemanticFingerprint,
    );
    assert.notEqual(hi.localizationProof.localizationFingerprint, pa.localizationProof.localizationFingerprint);

    contexts.add(hi.contextId);
    qls.add(hi.qlId);
    prototypes.add(hi.reviewMetadata.sourcePrototypeId);
    canonicalFingerprints.add(hi.localizationProof.canonicalSemanticFingerprint);
    hindiFingerprints.add(hi.localizationProof.localizationFingerprint);
    punjabiFingerprints.add(pa.localizationProof.localizationFingerprint);
    answerPositions[hi.correctIndex] += 1;
  }
}

assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
assert.deepEqual([...qls], [...RNK_CP001_PERMANENT_QL_IDS]);
assert.equal(prototypes.size, 13);
assert.equal(canonicalFingerprints.size, 1_152);
assert.equal(hindiFingerprints.size, 1_152);
assert.equal(punjabiFingerprints.size, 1_152);
assert.ok(answerPositions.every((count) => count > 0));
assert.equal(JSON.stringify({ hindi, punjabi }).includes('RNK-QL-043'), false);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_CP001_LOCALIZATION_REVIEW_VERSION,
  authority: RNK_CP001_LOCALIZATION_REVIEW_AUTHORITY,
  permanentQlRange: 'RNK-QL-001..009',
  permanentQlCount: RNK_CP001_PERMANENT_QL_IDS.length,
  seedsPerQl: SEEDS_PER_QL,
  hindiReviewCandidates: hindi.length,
  punjabiReviewCandidates: punjabi.length,
  totalLocalizedReviewCandidates: hindi.length + punjabi.length,
  contexts: [...contexts].sort(),
  sourcePrototypeCount: prototypes.size,
  answerPositions,
  nextAvailableQl: 'RNK-QL-043',
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
  questionStudioDiscoverable: false,
  questionBankStatus: 'NOT_STORED',
  publicPublication: false,
}, null, 2));
