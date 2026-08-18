import assert from 'node:assert/strict';

import {
  RNK_CP002_PERMANENT_QL_IDS,
  generateRnkCp002PermanentQuestion,
} from './cp002-permanent-runtime';
import {
  RNK_CP002_LOCALIZATION_REVIEW_AUTHORITY,
  RNK_CP002_LOCALIZATION_REVIEW_VERSION,
  buildRnkCp002LocalizedReviewBank,
  localizeRnkCp002PermanentQuestion,
  rnkCp002CanonicalSemanticFingerprint,
} from './cp002-localization-review-v1';

const SEEDS_PER_QL = 192;
const hindi = buildRnkCp002LocalizedReviewBank('hi-IN', SEEDS_PER_QL);
const punjabi = buildRnkCp002LocalizedReviewBank('pa-IN', SEEDS_PER_QL);
const hindiReplay = buildRnkCp002LocalizedReviewBank('hi-IN', SEEDS_PER_QL);

assert.equal(hindi.length, 1_536);
assert.equal(punjabi.length, 1_536);
assert.deepEqual(hindiReplay, hindi, 'CP002 Hindi localization must replay deterministically');

const devanagari = /[\u0900-\u097F]/u;
const gurmukhi = /[\u0A00-\u0A7F]/u;
const residualEnglishWord = /[A-Za-z]{2,}/u;
const canonicalEnglishOutcomes = /Cannot be determined|Both are equally placed|The first person|The second person|Both orders are possible|The proposed total is impossible/u;
const contexts = new Set<string>();
const qls = new Set<string>();
const prototypes = new Set<string>();
const evidenceKinds = new Set<string>();
const canonicalFingerprints = new Set<string>();
const hindiFingerprints = new Set<string>();
const punjabiFingerprints = new Set<string>();
const answerPositions = [0, 0, 0, 0];
const ql016CanonicalAnswers = new Set<string>();
const ql017CanonicalAnswers = new Set<string>();
let hindiIndeterminate = 0;
let punjabiIndeterminate = 0;
let hindiPersonAnswers = 0;
let punjabiPersonAnswers = 0;
let hindiOrderStatusAnswers = 0;
let punjabiOrderStatusAnswers = 0;

function displayedRanks(evidence: (typeof hindi)[number]['displayedEvidence']): readonly number[] {
  switch (evidence.kind) {
    case 'SAME_END_TWO_RANKS': return [evidence.firstRank, evidence.secondRank];
    case 'SECOND_RANK_FROM_RELATIVE_OFFSET': return [evidence.firstRank];
    case 'BETWEEN_FROM_MIXED_END_RANKS': return [evidence.firstRankFromStart, evidence.secondRankFromEnd];
    case 'TOTAL_FROM_MIXED_END_RANKS_KNOWN_ORDER': return [evidence.firstRankFromStart, evidence.secondRankFromEnd];
    case 'EXTREME_TOTAL_FROM_MIXED_END_RANKS_UNKNOWN_ORDER': return [evidence.firstRankFromStart, evidence.secondRankFromEnd];
    case 'POSITION_GAP_MIXED_END': return [evidence.firstRankFromStart, evidence.secondRankFromEnd];
    case 'OFFSET_FROM_SAME_END': return [evidence.firstRank, evidence.secondRank];
    case 'TARGET_RANK_FROM_BETWEEN': return [evidence.referenceRank];
    case 'COMPARE_SAME_END': return [evidence.firstRank, evidence.secondRank];
    case 'COMPARE_MIXED_END': return [evidence.firstRankFromStart, evidence.secondRankFromEnd];
    case 'EXACT_TOTAL_OR_INDETERMINATE': return [evidence.firstRankFromStart, evidence.secondRankFromEnd];
    case 'PROPOSED_TOTAL_ORDER_STATUS': return [evidence.firstRankFromStart, evidence.secondRankFromEnd];
  }
}

function assertNativeDisplayedOrdinals(
  stem: string,
  ranks: readonly number[],
  locale: 'hi-IN' | 'pa-IN',
): void {
  const hiNative = new Map<number, string>([[1, 'पहले स्थान पर'], [2, 'दूसरे स्थान पर'], [3, 'तीसरे स्थान पर'], [4, 'चौथे स्थान पर']]);
  const paNative = new Map<number, string>([[1, "ਪਹਿਲੇ ਸਥਾਨ 'ਤੇ"], [2, "ਦੂਜੇ ਸਥਾਨ 'ਤੇ"], [3, "ਤੀਜੇ ਸਥਾਨ 'ਤੇ"], [4, "ਚੌਥੇ ਸਥਾਨ 'ਤੇ"]]);
  for (const rank of ranks) {
    if (locale === 'hi-IN') {
      assert.ok(stem.includes(rank <= 4 ? hiNative.get(rank)! : `${rank}वें स्थान पर`), `${rank}: ${stem}`);
    } else {
      assert.ok(stem.includes(rank <= 4 ? paNative.get(rank)! : `${rank}ਵੇਂ ਸਥਾਨ 'ਤੇ`), `${rank}: ${stem}`);
    }
  }
}

for (let qlIndex = 0; qlIndex < RNK_CP002_PERMANENT_QL_IDS.length; qlIndex += 1) {
  const qlId = RNK_CP002_PERMANENT_QL_IDS[qlIndex]!;
  for (let seed = 0; seed < SEEDS_PER_QL; seed += 1) {
    const index = qlIndex * SEEDS_PER_QL + seed;
    const canonical = generateRnkCp002PermanentQuestion(qlId, seed);
    const hi = hindi[index]!;
    const pa = punjabi[index]!;

    assert.deepEqual(hi, localizeRnkCp002PermanentQuestion(canonical, 'hi-IN'));
    assert.deepEqual(pa, localizeRnkCp002PermanentQuestion(canonical, 'pa-IN'));

    for (const localized of [hi, pa]) {
      assert.equal(localized.packageId, canonical.packageId);
      assert.equal(localized.checkpointId, canonical.checkpointId);
      assert.equal(localized.qlId, canonical.qlId);
      assert.equal(localized.permanentQlId, canonical.permanentQlId);
      assert.equal(localized.seed, canonical.seed);
      assert.equal(localized.authorityId, canonical.authorityId);
      assert.equal(localized.contextId, canonical.contextId);
      assert.equal(localized.canonicalFirstName, canonical.firstName);
      assert.equal(localized.canonicalSecondName, canonical.secondName);
      assert.deepEqual(localized.displayedEvidence, canonical.displayedEvidence);
      assert.equal(localized.answerSemantic, canonical.answerSemantic);
      assert.equal(localized.correctIndex, canonical.correctIndex);
      assert.equal(localized.difficulty, canonical.difficulty);
      assert.deepEqual(localized.normalizedState, canonical.normalizedState);
      assert.equal(localized.mathematicalFingerprint, canonical.mathematicalFingerprint);

      assert.equal(localized.options.length, canonical.options.length);
      localized.options.forEach((option, optionIndex) => {
        assert.equal(option.misconceptionId, canonical.options[optionIndex]!.misconceptionId);
        assert.equal(option.value === localized.answer, optionIndex === localized.correctIndex);
      });
      assert.equal(localized.options[localized.correctIndex]!.value, localized.answer);

      assert.equal(localized.reviewMetadata.sourcePrototypeId, canonical.reviewMetadata.sourcePrototypeId);
      assert.equal(localized.reviewMetadata.sourceVariantIndex, canonical.reviewMetadata.sourceVariantIndex);
      assert.equal(localized.reviewMetadata.sourceVariantCount, canonical.reviewMetadata.sourceVariantCount);
      assert.equal(localized.reviewMetadata.discoverySeed, canonical.reviewMetadata.discoverySeed);
      assert.deepEqual(localized.reviewMetadata.canonicalOptionValues, canonical.reviewMetadata.canonicalOptionValues);
      assert.equal(localized.reviewMetadata.canonicalAnswer, canonical.reviewMetadata.canonicalAnswer);
      assert.equal(localized.reviewMetadata.englishReviewProjectionVersion, 'RNK_CP002_ENGLISH_REVIEW_V1');
      assert.equal(localized.reviewMetadata.localization.version, RNK_CP002_LOCALIZATION_REVIEW_VERSION);
      assert.equal(localized.reviewMetadata.localization.structuredEvidenceRendered, true);
      assert.equal(localized.reviewMetadata.localization.canonicalOutcomeLocalization, true);
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

      assert.equal(localized.localizationProof.authority, RNK_CP002_LOCALIZATION_REVIEW_AUTHORITY);
      assert.equal(localized.localizationProof.permanentQlId, canonical.permanentQlId);
      assert.equal(localized.localizationProof.semanticParity, 'EXECUTABLE_PROVED');
      assert.equal(localized.localizationProof.learnerSurfaceSource, 'STRUCTURED_DISPLAYED_EVIDENCE');
      assert.equal(localized.localizationProof.canonicalOutcomeSource, 'PERMANENT_REVIEW_METADATA');
      assert.equal(localized.localizationProof.humanLanguageReviewRequired, true);
      assert.equal(localized.localizationProof.multilingualFreezeGranted, false);
      assert.equal(localized.localizationProof.productDeliveryUnlocked, false);
      assert.equal(
        localized.localizationProof.canonicalSemanticFingerprint,
        rnkCp002CanonicalSemanticFingerprint(canonical),
      );

      const learnerText = [
        localized.stem,
        String(localized.answer),
        ...localized.options.flatMap((option) => [option.label, option.explanation]),
        localized.explanation.keyRule,
        ...localized.explanation.stepByStepSolution,
        localized.explanation.examSpeedShortcut,
        ...localized.explanation.optionAnalysis,
        localized.explanation.conclusion,
      ].join('\n');
      assert.equal(residualEnglishWord.test(learnerText), false, learnerText);
      assert.equal(canonicalEnglishOutcomes.test(learnerText), false, learnerText);
      assert.equal(/[{}]/u.test(learnerText), false, learnerText);
      assert.equal(learnerText.includes(canonical.firstName), false, learnerText);
      assert.equal(learnerText.includes(canonical.secondName), false, learnerText);
      if (localized.locale === 'hi-IN') assert.match(learnerText, devanagari);
      else assert.match(learnerText, gurmukhi);

      assertNativeDisplayedOrdinals(localized.stem, displayedRanks(localized.displayedEvidence), localized.locale);
      assert.equal(/\d+(?:पहले|दूसरे|तीसरे|चौथे) स्थान/u.test(localized.stem), false, localized.stem);
      assert.equal(/\d+(?:ਪਹਿਲੇ|ਦੂਜੇ|ਤੀਜੇ|ਚੌਥੇ) ਸਥਾਨ/u.test(localized.stem), false, localized.stem);
    }

    assert.equal(hi.locale, 'hi-IN');
    assert.equal(pa.locale, 'pa-IN');
    assert.equal(hi.contextId, pa.contextId);
    assert.equal(hi.canonicalFirstName, pa.canonicalFirstName);
    assert.equal(hi.canonicalSecondName, pa.canonicalSecondName);
    assert.equal(
      hi.localizationProof.canonicalSemanticFingerprint,
      pa.localizationProof.canonicalSemanticFingerprint,
    );
    assert.notEqual(hi.localizationProof.localizationFingerprint, pa.localizationProof.localizationFingerprint);

    if (qlId === 'RNK-QL-016') {
      ql016CanonicalAnswers.add(String(canonical.reviewMetadata.canonicalAnswer));
      if (String(canonical.reviewMetadata.canonicalAnswer) === 'Cannot be determined') {
        assert.equal(hi.answer, 'निर्धारित नहीं किया जा सकता');
        assert.equal(pa.answer, 'ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ');
        hindiIndeterminate += 1;
        punjabiIndeterminate += 1;
      }
    }
    if (qlId === 'RNK-QL-013') {
      assert.ok(hi.answer === hi.firstName || hi.answer === hi.secondName);
      assert.ok(pa.answer === pa.firstName || pa.answer === pa.secondName);
      hindiPersonAnswers += 1;
      punjabiPersonAnswers += 1;
    }
    if (qlId === 'RNK-QL-017') {
      ql017CanonicalAnswers.add(String(canonical.reviewMetadata.canonicalAnswer));
      assert.equal(typeof hi.answer, 'string');
      assert.equal(typeof pa.answer, 'string');
      hindiOrderStatusAnswers += 1;
      punjabiOrderStatusAnswers += 1;
    }

    contexts.add(hi.contextId);
    qls.add(hi.qlId);
    prototypes.add(hi.reviewMetadata.sourcePrototypeId);
    evidenceKinds.add(hi.displayedEvidence.kind);
    canonicalFingerprints.add(hi.localizationProof.canonicalSemanticFingerprint);
    hindiFingerprints.add(hi.localizationProof.localizationFingerprint);
    punjabiFingerprints.add(pa.localizationProof.localizationFingerprint);
    answerPositions[hi.correctIndex] += 1;
  }
}

assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
assert.deepEqual([...qls], [...RNK_CP002_PERMANENT_QL_IDS]);
assert.equal(prototypes.size, 13);
assert.equal(evidenceKinds.size, 12);
assert.equal(canonicalFingerprints.size, 1_536);
assert.equal(hindiFingerprints.size, 1_536);
assert.equal(punjabiFingerprints.size, 1_536);
assert.ok(answerPositions.every((count) => count > 0));
assert.ok(ql016CanonicalAnswers.has('Cannot be determined'));
assert.ok([...ql016CanonicalAnswers].some((value) => /^\d+$/u.test(value)));
assert.deepEqual(
  [...ql017CanonicalAnswers].sort(),
  [
    'The first person is nearer the start end',
    'The proposed total is impossible',
    'The second person is nearer the start end',
  ].sort(),
);
assert.ok(hindiIndeterminate > 0 && punjabiIndeterminate > 0);
assert.equal(hindiPersonAnswers, SEEDS_PER_QL);
assert.equal(punjabiPersonAnswers, SEEDS_PER_QL);
assert.equal(hindiOrderStatusAnswers, SEEDS_PER_QL);
assert.equal(punjabiOrderStatusAnswers, SEEDS_PER_QL);
assert.equal(JSON.stringify({ hindi, punjabi }).includes('RNK-QL-043'), false);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_CP002_LOCALIZATION_REVIEW_VERSION,
  authority: RNK_CP002_LOCALIZATION_REVIEW_AUTHORITY,
  permanentQlRange: 'RNK-QL-010..017',
  permanentQlCount: RNK_CP002_PERMANENT_QL_IDS.length,
  seedsPerQl: SEEDS_PER_QL,
  hindiReviewCandidates: hindi.length,
  punjabiReviewCandidates: punjabi.length,
  totalLocalizedReviewCandidates: hindi.length + punjabi.length,
  sourcePrototypeCount: prototypes.size,
  evidenceKindCount: evidenceKinds.size,
  contexts: [...contexts].sort(),
  answerPositions,
  ql016CanonicalAnswers: [...ql016CanonicalAnswers].sort(),
  ql017CanonicalAnswers: [...ql017CanonicalAnswers].sort(),
  nextAvailableQl: 'RNK-QL-043',
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
  questionStudioDiscoverable: false,
  questionBankStatus: 'NOT_STORED',
  publicPublication: false,
}, null, 2));
