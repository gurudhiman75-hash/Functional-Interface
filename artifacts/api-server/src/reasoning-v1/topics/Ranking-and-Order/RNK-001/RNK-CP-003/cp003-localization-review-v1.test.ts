import assert from 'node:assert/strict';

import {
  RNK_CP003_PERMANENT_QL_IDS,
  generateRnkCp003PermanentQuestion,
} from './cp003-permanent-runtime';
import {
  RNK_CP003_LOCALIZATION_REVIEW_AUTHORITY,
  RNK_CP003_LOCALIZATION_REVIEW_VERSION,
  buildRnkCp003LocalizedReviewBank,
  localizeRnkCp003PermanentQuestion,
  rnkCp003CanonicalSemanticFingerprint,
} from './cp003-localization-review-v1';

const SEEDS_PER_QL = 192;
const hindi = buildRnkCp003LocalizedReviewBank('hi-IN', SEEDS_PER_QL);
const punjabi = buildRnkCp003LocalizedReviewBank('pa-IN', SEEDS_PER_QL);
const hindiReplay = buildRnkCp003LocalizedReviewBank('hi-IN', SEEDS_PER_QL);

assert.equal(hindi.length, 1_728);
assert.equal(punjabi.length, 1_728);
assert.deepEqual(hindiReplay, hindi, 'CP003 Hindi localization must replay deterministically');

const devanagari = /[\u0900-\u097F]/u;
const gurmukhi = /[\u0A00-\u0A7F]/u;
const residualEnglishWord = /[A-Za-z]{2,}/u;
const englishOrdinal = /\b\d+(?:st|nd|rd|th)\b/u;
const contexts = new Set<string>();
const qls = new Set<string>();
const prototypes = new Set<string>();
const evidenceKinds = new Set<string>();
const canonicalFingerprints = new Set<string>();
const hindiFingerprints = new Set<string>();
const punjabiFingerprints = new Set<string>();
const answerPositions = [0, 0, 0, 0];
let pairQuestions = 0;
let sourceWaveQuestions = 0;

function optionValue(option: Record<string, unknown>): unknown {
  return Object.prototype.hasOwnProperty.call(option, 'answerKey') ? option.answerKey : option.answer;
}

for (let qlIndex = 0; qlIndex < RNK_CP003_PERMANENT_QL_IDS.length; qlIndex += 1) {
  const qlId = RNK_CP003_PERMANENT_QL_IDS[qlIndex]!;
  for (let seed = 0; seed < SEEDS_PER_QL; seed += 1) {
    const index = qlIndex * SEEDS_PER_QL + seed;
    const canonical = generateRnkCp003PermanentQuestion(qlId, seed) as Record<string, any>;
    const hi = hindi[index]!;
    const pa = punjabi[index]!;

    assert.deepEqual(hi, localizeRnkCp003PermanentQuestion(canonical, 'hi-IN'));
    assert.deepEqual(pa, localizeRnkCp003PermanentQuestion(canonical, 'pa-IN'));

    for (const localized of [hi, pa]) {
      assert.equal(localized.packageId, canonical.packageId);
      assert.equal(localized.checkpointId, canonical.checkpointId);
      assert.equal(localized.permanentQlId, canonical.permanentQlId);
      assert.equal(localized.prototypeId, canonical.prototypeId);
      assert.equal(localized.seed, canonical.seed);
      assert.equal(localized.contextId, canonical.contextId);
      assert.deepEqual(localized.displayedEvidence, canonical.displayedEvidence);
      assert.equal(localized.correctIndex, canonical.correctIndex);
      assert.equal(localized.difficulty, canonical.difficulty);
      assert.equal(localized.mathematicalFingerprint, canonical.mathematicalFingerprint);
      assert.equal(localized.answerKey, canonical.answerKey);
      assert.equal(localized.answerSemantic, canonical.answerSemantic);

      assert.equal(localized.options.length, canonical.options.length);
      localized.options.forEach((option: Record<string, unknown>, optionIndex: number) => {
        const source = canonical.options[optionIndex]! as Record<string, unknown>;
        assert.equal(optionValue(option), optionValue(source));
        assert.equal(option.misconceptionId, source.misconceptionId);
      });
      assert.equal(
        optionValue(localized.options[localized.correctIndex] as Record<string, unknown>),
        optionValue(canonical.options[canonical.correctIndex] as Record<string, unknown>),
      );

      assert.equal(localized.localizationMetadata.version, RNK_CP003_LOCALIZATION_REVIEW_VERSION);
      assert.equal(localized.localizationMetadata.locale, localized.locale);
      assert.equal(localized.localizationMetadata.learnerTextLocalized, true);
      assert.equal(localized.localizationMetadata.structuredEvidenceRendered, true);
      assert.equal(localized.localizationMetadata.canonicalOutcomePreserved, true);
      assert.equal(localized.localizationMetadata.humanLanguageReviewRequired, true);

      assert.equal(localized.lifecycle.permanentQlAllocated, true);
      assert.equal(localized.lifecycle.englishFrozen, true);
      assert.equal(localized.lifecycle.hindiPunjabi, 'REVIEW_CANDIDATE');
      assert.equal(localized.lifecycle.humanLanguageReviewRequired, true);
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
      assert.equal(localized.lifecycle.questionBankStatus, 'NOT_STORED');
      assert.equal(localized.lifecycle.testEligibility, 'INELIGIBLE');
      assert.equal(localized.lifecycle.publiclyPublishable, false);
      assert.equal(localized.lifecycle.productDeliveryUnlocked, false);

      assert.equal(localized.localizationProof.authority, RNK_CP003_LOCALIZATION_REVIEW_AUTHORITY);
      assert.equal(localized.localizationProof.permanentQlId, canonical.permanentQlId);
      assert.equal(localized.localizationProof.semanticParity, 'EXECUTABLE_PROVED');
      assert.equal(localized.localizationProof.learnerSurfaceSource, 'STRUCTURED_DISPLAYED_EVIDENCE');
      assert.equal(localized.localizationProof.canonicalOutcomeSource, 'FROZEN_PERMANENT_RUNTIME');
      assert.equal(localized.localizationProof.humanLanguageReviewRequired, true);
      assert.equal(localized.localizationProof.multilingualFreezeGranted, false);
      assert.equal(localized.localizationProof.productDeliveryUnlocked, false);
      assert.equal(
        localized.localizationProof.canonicalSemanticFingerprint,
        rnkCp003CanonicalSemanticFingerprint(canonical),
      );

      const learnerText = [
        localized.stem,
        String(localized.answer),
        ...localized.options.flatMap((option: Record<string, unknown>) => [String(option.label), String(option.explanation)]),
        localized.explanation.keyRule,
        ...localized.explanation.stepByStepSolution,
        localized.explanation.examSpeedShortcut,
        ...localized.explanation.optionAnalysis,
        localized.explanation.conclusion,
      ].join('\n');

      assert.equal(residualEnglishWord.test(learnerText), false, learnerText);
      assert.equal(englishOrdinal.test(learnerText), false, learnerText);
      assert.equal(/[{}]/u.test(learnerText), false, learnerText);
      for (const canonicalName of localized.canonicalNames) {
        assert.equal(learnerText.includes(canonicalName), false, learnerText);
      }
      if (localized.locale === 'hi-IN') assert.match(learnerText, devanagari);
      else assert.match(learnerText, gurmukhi);
    }

    assert.equal(hi.locale, 'hi-IN');
    assert.equal(pa.locale, 'pa-IN');
    assert.deepEqual(hi.canonicalNames, pa.canonicalNames);
    assert.equal(
      hi.localizationProof.canonicalSemanticFingerprint,
      pa.localizationProof.canonicalSemanticFingerprint,
    );
    assert.notEqual(hi.localizationProof.localizationFingerprint, pa.localizationProof.localizationFingerprint);

    if (canonical.answerSemantic === 'RANK_PAIR') {
      pairQuestions += 1;
      assert.equal(typeof hi.answer, 'string');
      assert.equal(typeof pa.answer, 'string');
      for (const name of hi.localizedNames) assert.ok(String(hi.answer).includes(name));
      for (const name of pa.localizedNames) assert.ok(String(pa.answer).includes(name));
    } else {
      assert.equal(hi.answer, canonical.answer);
      assert.equal(pa.answer, canonical.answer);
    }

    if (String(canonical.prototypeId).includes('ANOTHER-PERSON') || String(canonical.prototypeId).includes('MEMBERSHIP-CHANGE')) {
      sourceWaveQuestions += 1;
    }

    contexts.add(String(hi.contextId));
    qls.add(String(hi.permanentQlId));
    prototypes.add(String(hi.prototypeId));
    evidenceKinds.add(String((hi.displayedEvidence as Record<string, unknown>).kind));
    canonicalFingerprints.add(hi.localizationProof.canonicalSemanticFingerprint);
    hindiFingerprints.add(hi.localizationProof.localizationFingerprint);
    punjabiFingerprints.add(pa.localizationProof.localizationFingerprint);
    answerPositions[hi.correctIndex] += 1;
  }
}

assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE', 'RACE_ORDER'].sort());
assert.deepEqual([...qls], [...RNK_CP003_PERMANENT_QL_IDS]);
assert.equal(prototypes.size, 13);
assert.equal(evidenceKinds.size, 13);
assert.equal(canonicalFingerprints.size, 1_728);
assert.equal(hindiFingerprints.size, 1_728);
assert.equal(punjabiFingerprints.size, 1_728);
assert.ok(answerPositions.every((count) => count > 0));
assert.ok(pairQuestions > 0);
assert.ok(sourceWaveQuestions > 0);
assert.equal(JSON.stringify({ hindi, punjabi }).includes('RNK-QL-043'), false);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_CP003_LOCALIZATION_REVIEW_VERSION,
  authority: RNK_CP003_LOCALIZATION_REVIEW_AUTHORITY,
  permanentQlRange: 'RNK-QL-018..026',
  permanentQlCount: RNK_CP003_PERMANENT_QL_IDS.length,
  seedsPerQl: SEEDS_PER_QL,
  hindiReviewCandidates: hindi.length,
  punjabiReviewCandidates: punjabi.length,
  totalLocalizedReviewCandidates: hindi.length + punjabi.length,
  sourcePrototypeCount: prototypes.size,
  evidenceKindCount: evidenceKinds.size,
  contexts: [...contexts].sort(),
  answerPositions,
  pairQuestions,
  sourceWaveQuestions,
  nextAvailableQl: 'RNK-QL-043',
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
  questionStudioDiscoverable: false,
  questionBankStatus: 'NOT_STORED',
  publicPublication: false,
}, null, 2));
