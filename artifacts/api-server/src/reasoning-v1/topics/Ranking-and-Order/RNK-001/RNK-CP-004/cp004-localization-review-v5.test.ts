import assert from 'node:assert/strict';

import { buildRnkCp004PermanentRuntime } from './cp004-permanent-runtime-v1';
import { localizeRnkCp004PermanentQuestionV4 } from './cp004-localization-review-v4';
import {
  RNK_CP004_LOCALIZATION_REVIEW_V5_AUTHORITY,
  RNK_CP004_LOCALIZATION_REVIEW_V5_VERSION,
  buildRnkCp004LocalizedReviewBankV5,
  localizeRnkCp004PermanentQuestionV5,
} from './cp004-localization-review-v5';

const canonical = buildRnkCp004PermanentRuntime();
const hindi = buildRnkCp004LocalizedReviewBankV5('hi-IN');
const punjabi = buildRnkCp004LocalizedReviewBankV5('pa-IN');
const hindiReplay = buildRnkCp004LocalizedReviewBankV5('hi-IN');

assert.equal(canonical.length, 1_728);
assert.equal(hindi.length, 1_728);
assert.equal(punjabi.length, 1_728);
assert.deepEqual(hindiReplay, hindi, 'CP004 V5 must replay deterministically');

const residualEnglishWord = /[A-Za-z]{2,}/u;
const devanagari = /[\u0900-\u097F]/u;
const gurmukhi = /[\u0A00-\u0A7F]/u;
const introVariants = new Set<number>();
const queryVariants = new Set<number>();
const clueVariants = new Set<number>();
const contexts = new Set<string>();
let changedHindiStems = 0;
let changedPunjabiStems = 0;
let shuffledQuestionCount = 0;
let multiTemplateQuestionCount = 0;
let missingComparisonCount = 0;

function learnerText(question: Record<string, any>): string {
  return [
    question.stem,
    String(question.answer),
    ...question.options.flatMap((option: Record<string, unknown>) => [String(option.label), String(option.explanation)]),
    question.explanation.mentalPicture,
    question.explanation.keyRule,
    ...question.explanation.stepByStepSolution,
    question.explanation.examSpeedShortcut,
    ...question.explanation.optionAnalysis,
    question.explanation.conclusion,
    ...((question.visibleExplanation?.lines ?? []) as readonly string[]),
    ...((question.visibleExplanation?.optionAnalysis ?? []) as readonly string[]),
  ].join('\n');
}

for (let index = 0; index < canonical.length; index += 1) {
  const source = canonical[index]! as Record<string, any>;
  const hi = hindi[index]! as Record<string, any>;
  const pa = punjabi[index]! as Record<string, any>;
  const hiV4 = localizeRnkCp004PermanentQuestionV4(source, 'hi-IN') as Record<string, any>;
  const paV4 = localizeRnkCp004PermanentQuestionV4(source, 'pa-IN') as Record<string, any>;

  assert.deepEqual(hi, localizeRnkCp004PermanentQuestionV5(source, 'hi-IN'));
  assert.deepEqual(pa, localizeRnkCp004PermanentQuestionV5(source, 'pa-IN'));

  for (const [v4, v5] of [[hiV4, hi], [paV4, pa]] as const) {
    assert.equal(v5.packageId, v4.packageId);
    assert.equal(v5.checkpointId, v4.checkpointId);
    assert.equal(v5.prototypeId, v4.prototypeId);
    assert.equal(v5.seed, v4.seed);
    assert.deepEqual(v5.displayedEvidence, v4.displayedEvidence);
    assert.deepEqual(v5.reviewMetadata, v4.reviewMetadata);
    assert.equal(v5.answerKey, v4.answerKey);
    assert.equal(v5.answerSemantic, v4.answerSemantic);
    assert.equal(v5.correctIndex, v4.correctIndex);
    assert.equal(v5.difficulty, v4.difficulty);
    assert.equal(v5.mathematicalFingerprint, v4.mathematicalFingerprint);
    assert.deepEqual(v5.canonicalNames, v4.canonicalNames);
    assert.deepEqual(v5.localizedNames, v4.localizedNames);
    assert.deepEqual(v5.lifecycle, v4.lifecycle);

    // V5 is a stem/editorial-diversity overlay only. All V4 answers,
    // options and pedagogy remain byte-for-byte identical.
    assert.equal(v5.answer, v4.answer);
    assert.deepEqual(v5.options, v4.options);
    assert.deepEqual(v5.explanation, v4.explanation);
    assert.deepEqual(v5.visibleExplanation, v4.visibleExplanation);

    assert.equal(v5.localizationMetadata.version, RNK_CP004_LOCALIZATION_REVIEW_V5_VERSION);
    assert.equal(v5.localizationMetadata.moderateEditorialDiversityOverlay, 'SEEDED_2_INTRO_3_CLUE_2_QUERY_V5');
    assert.equal(v5.localizationMetadata.v4PedagogyBaselinePreserved, true);
    assert.equal(v5.localizationProof.authority, RNK_CP004_LOCALIZATION_REVIEW_V5_AUTHORITY);
    assert.equal(v5.localizationProof.v4LocalizationFingerprint, v4.localizationProof.localizationFingerprint);
    assert.equal(v5.localizationProof.editorialDiversityCoverage, 'EXECUTABLE_PROVED');
    assert.equal(v5.localizationProof.canonicalSemanticFingerprint, v4.localizationProof.canonicalSemanticFingerprint);
    assert.equal(v5.localizationProof.multilingualFreezeGranted, false);
    assert.equal(v5.localizationProof.productDeliveryUnlocked, false);

    const diversity = v5.localizationMetadata.editorialDiversity;
    const canonicalKeys = source.displayedEvidence.clues.map((clue: Record<string, string>) => `${clue.higher}>${clue.lower}`);
    assert.deepEqual([...diversity.canonicalClueOrderKeys].sort(), [...canonicalKeys].sort());
    assert.deepEqual([...diversity.clueOrderKeys].sort(), [...canonicalKeys].sort());
    assert.equal(diversity.clueVariantIds.length, canonicalKeys.length);
    assert.ok(diversity.maxConsecutiveSameClueTemplate <= 2);
    if (canonicalKeys.length > 1) assert.equal(diversity.clueOrderShuffled, true);
    if (canonicalKeys.length >= 3) {
      assert.ok(new Set(diversity.clueVariantIds).size >= 2, '3+ clues must use at least two visible clue phrasings');
      multiTemplateQuestionCount += 1;
    }

    introVariants.add(diversity.introVariant);
    queryVariants.add(diversity.queryVariant);
    diversity.clueVariantIds.forEach((variant: number) => clueVariants.add(variant));

    const text = learnerText(v5);
    assert.equal(residualEnglishWord.test(text), false, text);
    if (v5.locale === 'hi-IN') assert.match(text, devanagari);
    else assert.match(text, gurmukhi);

    for (const canonicalName of v5.canonicalNames) {
      assert.equal(text.includes(canonicalName), false, text);
    }

    const clueLines = v5.stem.split('\n').filter((line: string) => line.startsWith('- '));
    assert.equal(clueLines.length, canonicalKeys.length);
    assert.equal(new Set(clueLines).size, clueLines.length, 'V5 visible clues should not duplicate within a question');

    if (source.displayedEvidence.query.kind === 'MISSING_COMPARISON') {
      assert.ok(
        v5.stem.includes(v5.locale === 'hi-IN'
          ? 'पूरा क्रम अभी निर्धारित नहीं होता'
          : 'ਪੂਰਾ ਕ੍ਰਮ ਹਾਲੇ ਨਿਰਧਾਰਤ ਨਹੀਂ ਹੁੰਦਾ'),
        v5.stem,
      );
    }
  }

  if (hi.stem !== hiV4.stem) changedHindiStems += 1;
  if (pa.stem !== paV4.stem) changedPunjabiStems += 1;
  if (hi.localizationMetadata.editorialDiversity.clueOrderShuffled) shuffledQuestionCount += 1;
  if (source.displayedEvidence.query.kind === 'MISSING_COMPARISON') missingComparisonCount += 1;
  contexts.add(source.reviewMetadata.languageProfile.contextFamily);

  assert.equal(
    hi.localizationProof.canonicalSemanticFingerprint,
    pa.localizationProof.canonicalSemanticFingerprint,
  );
  assert.notEqual(hi.localizationProof.localizationFingerprint, pa.localizationProof.localizationFingerprint);
}

assert.equal(changedHindiStems, 1_728);
assert.equal(changedPunjabiStems, 1_728);
assert.equal(shuffledQuestionCount, 1_728);
assert.ok(multiTemplateQuestionCount > 0);
assert.equal(missingComparisonCount, 192);
assert.deepEqual([...introVariants].sort(), [0, 1]);
assert.deepEqual([...queryVariants].sort(), [0, 1]);
assert.deepEqual([...clueVariants].sort(), [0, 1, 2]);
assert.equal(contexts.size, 6);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_CP004_LOCALIZATION_REVIEW_V5_VERSION,
  authority: RNK_CP004_LOCALIZATION_REVIEW_V5_AUTHORITY,
  hindi: hindi.length,
  punjabi: punjabi.length,
  changedHindiStems,
  changedPunjabiStems,
  shuffledQuestionCount,
  introVariants: [...introVariants].sort(),
  queryVariants: [...queryVariants].sort(),
  clueVariants: [...clueVariants].sort(),
  contexts: [...contexts].sort(),
  missingComparisonCount,
  v4PedagogyBaselinePreserved: true,
  multilingualFreezeGranted: false,
}, null, 2));
