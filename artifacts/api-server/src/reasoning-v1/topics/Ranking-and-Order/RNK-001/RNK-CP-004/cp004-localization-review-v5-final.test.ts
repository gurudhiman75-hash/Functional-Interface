import assert from 'node:assert/strict';

import { buildRnkCp004PermanentRuntime } from './cp004-permanent-runtime-v1';
import { localizeRnkCp004PermanentQuestionV5 } from './cp004-localization-review-v5';
import {
  RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_AUTHORITY,
  RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_VERSION,
  buildRnkCp004LocalizedReviewBankV5Final,
  localizeRnkCp004PermanentQuestionV5Final,
} from './cp004-localization-review-v5-final';

const canonical = buildRnkCp004PermanentRuntime();
const hindi = buildRnkCp004LocalizedReviewBankV5Final('hi-IN');
const punjabi = buildRnkCp004LocalizedReviewBankV5Final('pa-IN');
const replay = buildRnkCp004LocalizedReviewBankV5Final('pa-IN');

assert.equal(canonical.length, 1_728);
assert.equal(hindi.length, 1_728);
assert.equal(punjabi.length, 1_728);
assert.deepEqual(replay, punjabi, 'CP004 V5 final must replay deterministically');

const residualEnglishWord = /[A-Za-z]{2,}/u;
let changedHindi = 0;
let changedPunjabi = 0;
const contexts = new Set<string>();

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
  ].join('\n');
}

for (let index = 0; index < canonical.length; index += 1) {
  const source = canonical[index]! as Record<string, any>;
  const hiBase = localizeRnkCp004PermanentQuestionV5(source, 'hi-IN') as Record<string, any>;
  const paBase = localizeRnkCp004PermanentQuestionV5(source, 'pa-IN') as Record<string, any>;
  const hi = hindi[index]! as Record<string, any>;
  const pa = punjabi[index]! as Record<string, any>;

  assert.deepEqual(hi, localizeRnkCp004PermanentQuestionV5Final(source, 'hi-IN'));
  assert.deepEqual(pa, localizeRnkCp004PermanentQuestionV5Final(source, 'pa-IN'));

  for (const [base, final] of [[hiBase, hi], [paBase, pa]] as const) {
    assert.equal(final.packageId, base.packageId);
    assert.equal(final.checkpointId, base.checkpointId);
    assert.equal(final.prototypeId, base.prototypeId);
    assert.equal(final.seed, base.seed);
    assert.deepEqual(final.displayedEvidence, base.displayedEvidence);
    assert.deepEqual(final.reviewMetadata, base.reviewMetadata);
    assert.equal(final.answerKey, base.answerKey);
    assert.equal(final.answerSemantic, base.answerSemantic);
    assert.equal(final.correctIndex, base.correctIndex);
    assert.equal(final.difficulty, base.difficulty);
    assert.equal(final.mathematicalFingerprint, base.mathematicalFingerprint);
    assert.deepEqual(final.lifecycle, base.lifecycle);
    assert.equal(final.answer, base.answer);
    assert.deepEqual(final.options, base.options);
    assert.deepEqual(final.explanation, base.explanation);
    assert.deepEqual(final.visibleExplanation, base.visibleExplanation);
    assert.deepEqual(final.localizationMetadata.editorialDiversity, base.localizationMetadata.editorialDiversity);
    assert.equal(final.localizationMetadata.version, RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_VERSION);
    assert.equal(final.localizationMetadata.finalSurfaceRefinement, 'DISTINCT_THREE_PATTERN_CLUE_SURFACES');
    assert.equal(final.localizationMetadata.v5DiversityContractPreserved, true);
    assert.equal(final.localizationProof.authority, RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_AUTHORITY);
    assert.equal(final.localizationProof.v5LocalizationFingerprint, base.localizationProof.localizationFingerprint);
    assert.equal(final.localizationProof.finalSurfaceRefinementCoverage, 'EXECUTABLE_PROVED');
    assert.equal(final.localizationProof.canonicalSemanticFingerprint, base.localizationProof.canonicalSemanticFingerprint);

    const clueLines = final.stem.split('\n').filter((line: string) => line.startsWith('- '));
    const diversity = final.localizationMetadata.editorialDiversity;
    assert.equal(clueLines.length, diversity.clueVariantIds.length);
    assert.equal(new Set(clueLines).size, clueLines.length);
    assert.ok(diversity.maxConsecutiveSameClueTemplate <= 2);
    if (clueLines.length >= 3) assert.ok(new Set(diversity.clueVariantIds).size >= 2);

    const text = learnerText(final);
    assert.equal(residualEnglishWord.test(text), false, text);
    for (const canonicalName of final.canonicalNames) {
      assert.equal(text.includes(canonicalName), false, text);
    }
  }

  if (hi.stem !== hiBase.stem) changedHindi += 1;
  if (pa.stem !== paBase.stem) changedPunjabi += 1;
  contexts.add(source.reviewMetadata.languageProfile.contextFamily);

  assert.equal(
    hi.localizationProof.canonicalSemanticFingerprint,
    pa.localizationProof.canonicalSemanticFingerprint,
  );
  assert.notEqual(hi.localizationProof.localizationFingerprint, pa.localizationProof.localizationFingerprint);
}

assert.ok(changedHindi > 1_000, 'Final surface refinement should materially affect the V5 bank');
assert.ok(changedPunjabi > 1_000, 'Final surface refinement should materially affect the V5 bank');
assert.equal(contexts.size, 6);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_VERSION,
  authority: RNK_CP004_LOCALIZATION_REVIEW_V5_FINAL_AUTHORITY,
  hindi: hindi.length,
  punjabi: punjabi.length,
  changedHindi,
  changedPunjabi,
  contexts: [...contexts].sort(),
  v5DiversityContractPreserved: true,
  multilingualFreezeGranted: false,
}, null, 2));
