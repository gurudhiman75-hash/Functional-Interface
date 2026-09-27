import assert from 'node:assert/strict';

import { reconstructUniqueOrder } from './cp004-foundation';
import { RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID } from './cp004-authority-consolidation-v1';
import { buildRnkCp004PermanentRuntime } from './cp004-permanent-runtime-v1';
import { localizeRnkCp004PermanentQuestionV2 } from './cp004-localization-review-v2';
import {
  RNK_CP004_LOCALIZATION_REVIEW_V3_AUTHORITY,
  RNK_CP004_LOCALIZATION_REVIEW_V3_VERSION,
  buildRnkCp004LocalizedReviewBankV3,
  localizeRnkCp004PermanentQuestionV3,
} from './cp004-localization-review-v3';

const canonical = buildRnkCp004PermanentRuntime();
const hindi = buildRnkCp004LocalizedReviewBankV3('hi-IN');
const punjabi = buildRnkCp004LocalizedReviewBankV3('pa-IN');
const hindiReplay = buildRnkCp004LocalizedReviewBankV3('hi-IN');

assert.equal(canonical.length, 1_728);
assert.equal(hindi.length, 1_728);
assert.equal(punjabi.length, 1_728);
assert.deepEqual(hindiReplay, hindi, 'CP004 V3 Hindi replay must be deterministic');

const residualEnglishWord = /[A-Za-z]{2,}/u;
const devanagari = /[\u0900-\u097F]/u;
const gurmukhi = /[\u0A00-\u0A7F]/u;
const seenPairMisconceptions = new Set<string>();
const hindiFingerprints = new Set<string>();
const punjabiFingerprints = new Set<string>();
let pairQuestions = 0;
let exactDistanceQuestions = 0;
let directionOnlyQuestions = 0;
let changedHindiPairSurfaces = 0;
let changedPunjabiPairSurfaces = 0;

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

function localName(question: Record<string, any>, canonicalName: string): string {
  const index = question.canonicalNames.indexOf(canonicalName);
  assert.ok(index >= 0, `Missing localized name for ${canonicalName}`);
  return question.localizedNames[index]!;
}

for (let index = 0; index < canonical.length; index += 1) {
  const source = canonical[index]! as Record<string, any>;
  const hiV2 = localizeRnkCp004PermanentQuestionV2(source, 'hi-IN');
  const paV2 = localizeRnkCp004PermanentQuestionV2(source, 'pa-IN');
  const hi = hindi[index]! as Record<string, any>;
  const pa = punjabi[index]! as Record<string, any>;

  assert.deepEqual(hi, localizeRnkCp004PermanentQuestionV3(source, 'hi-IN'));
  assert.deepEqual(pa, localizeRnkCp004PermanentQuestionV3(source, 'pa-IN'));

  for (const [v2, v3] of [[hiV2, hi], [paV2, pa]] as const) {
    assert.equal(v3.packageId, v2.packageId);
    assert.equal(v3.checkpointId, v2.checkpointId);
    assert.equal(v3.prototypeId, v2.prototypeId);
    assert.equal(v3.seed, v2.seed);
    assert.deepEqual(v3.displayedEvidence, v2.displayedEvidence);
    assert.deepEqual(v3.reviewMetadata, v2.reviewMetadata);
    assert.equal(v3.answerKey, v2.answerKey);
    assert.equal(v3.answerSemantic, v2.answerSemantic);
    assert.equal(v3.correctIndex, v2.correctIndex);
    assert.equal(v3.difficulty, v2.difficulty);
    assert.equal(v3.mathematicalFingerprint, v2.mathematicalFingerprint);
    assert.deepEqual(v3.canonicalNames, v2.canonicalNames);
    assert.deepEqual(v3.localizedNames, v2.localizedNames);
    assert.deepEqual(v3.lifecycle, v2.lifecycle);
    assert.equal(v3.options.length, v2.options.length);
    v3.options.forEach((option: Record<string, unknown>, optionIndex: number) => {
      const baseline = v2.options[optionIndex]!;
      assert.equal(option.answerKey, baseline.answerKey);
      assert.equal(option.misconceptionId, baseline.misconceptionId);
    });
    assert.equal(v3.answer, v3.options[v3.correctIndex]!.label);
    assert.equal(v3.localizationMetadata.version, RNK_CP004_LOCALIZATION_REVIEW_V3_VERSION);
    assert.equal(
      v3.localizationMetadata.runtimeDistractorContractOverlay,
      'FROZEN_RUNTIME_DISTRACTOR_CONTRACT_V3',
    );
    assert.equal(v3.localizationMetadata.v2EditorialBaselinePreserved, true);
    assert.equal(v3.localizationProof.authority, RNK_CP004_LOCALIZATION_REVIEW_V3_AUTHORITY);
    assert.equal(
      v3.localizationProof.canonicalSemanticFingerprint,
      v2.localizationProof.canonicalSemanticFingerprint,
    );
    assert.equal(
      v3.localizationProof.v2LocalizationFingerprint,
      v2.localizationProof.localizationFingerprint,
    );
    assert.equal(v3.localizationProof.runtimeDistractorContractCoverage, 'EXECUTABLE_PROVED');
    assert.equal(v3.localizationProof.multilingualFreezeGranted, false);
    assert.equal(v3.localizationProof.productDeliveryUnlocked, false);

    const text = learnerText(v3);
    assert.equal(residualEnglishWord.test(text), false, text);
    for (const canonicalName of v3.canonicalNames) {
      assert.equal(text.includes(canonicalName), false, text);
    }
    if (v3.locale === 'hi-IN') assert.match(text, devanagari);
    else assert.match(text, gurmukhi);
  }

  const query = source.displayedEvidence.query;
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    pairQuestions += 1;
    const order = reconstructUniqueOrder(source.displayedEvidence.entities, source.displayedEvidence.clues);
    const firstIndex = order.indexOf(query.first);
    const secondIndex = order.indexOf(query.second);
    const higher = firstIndex < secondIndex ? query.first : query.second;
    const lower = higher === query.first ? query.second : query.first;
    const difference = Math.abs(firstIndex - secondIndex);

    assert.equal(new Set(hi.options.map((option: Record<string, any>) => option.label)).size, 4, learnerText(hi));
    assert.equal(new Set(pa.options.map((option: Record<string, any>) => option.label)).size, 4, learnerText(pa));

    source.options.forEach((option: Record<string, any>, optionIndex: number) => {
      seenPairMisconceptions.add(option.misconceptionId);
      const hiLabel = String(hi.options[optionIndex]!.label);
      const paLabel = String(pa.options[optionIndex]!.label);
      const hiHigher = localName(hi, higher);
      const hiLower = localName(hi, lower);
      const paHigher = localName(pa, higher);
      const paLower = localName(pa, lower);

      if (source.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
        const expectedDistance = option.misconceptionId === 'NUMBER_BETWEEN_CONFUSION'
          ? difference - 1
          : option.misconceptionId === 'INCLUSIVE_COUNT_CONFUSION'
            ? difference + 1
            : difference;
        assert.ok(hiLabel.includes(String(expectedDistance)), hiLabel);
        assert.ok(paLabel.includes(String(expectedDistance)), paLabel);
        if (option.misconceptionId === 'REVERSE_DIRECTION') {
          assert.ok(hiLabel.includes(hiLower), hiLabel);
          assert.ok(paLabel.includes(paLower), paLabel);
        } else {
          assert.ok(hiLabel.includes(hiHigher), hiLabel);
          assert.ok(paLabel.includes(paHigher), paLabel);
        }
      }
    });

    if (source.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
      exactDistanceQuestions += 1;
    } else {
      directionOnlyQuestions += 1;
    }

    if (
      JSON.stringify(hi.options) !== JSON.stringify(hiV2.options)
      || JSON.stringify(hi.explanation) !== JSON.stringify(hiV2.explanation)
    ) changedHindiPairSurfaces += 1;
    if (
      JSON.stringify(pa.options) !== JSON.stringify(paV2.options)
      || JSON.stringify(pa.explanation) !== JSON.stringify(paV2.explanation)
    ) changedPunjabiPairSurfaces += 1;
  }

  assert.equal(
    hi.localizationProof.canonicalSemanticFingerprint,
    pa.localizationProof.canonicalSemanticFingerprint,
  );
  assert.notEqual(hi.localizationProof.localizationFingerprint, pa.localizationProof.localizationFingerprint);
  hindiFingerprints.add(hi.localizationProof.localizationFingerprint);
  punjabiFingerprints.add(pa.localizationProof.localizationFingerprint);
}

assert.equal(pairQuestions, 384);
assert.equal(exactDistanceQuestions, 192);
assert.equal(directionOnlyQuestions, 192);
assert.equal(changedHindiPairSurfaces, 384);
assert.equal(changedPunjabiPairSurfaces, 384);
for (const required of [
  'CORRECT',
  'REVERSE_DIRECTION',
  'SAME_RANK_CONTRADICTION',
  'CANNOT_DETERMINE_CONTRADICTION',
  'NUMBER_BETWEEN_CONFUSION',
  'INCLUSIVE_COUNT_CONFUSION',
]) {
  assert.ok(seenPairMisconceptions.has(required), `Missing frozen pair misconception ${required}`);
}
assert.equal(hindiFingerprints.size, 1_728);
assert.equal(punjabiFingerprints.size, 1_728);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_CP004_LOCALIZATION_REVIEW_V3_VERSION,
  authority: RNK_CP004_LOCALIZATION_REVIEW_V3_AUTHORITY,
  hindi: hindi.length,
  punjabi: punjabi.length,
  pairQuestions,
  exactDistanceQuestions,
  directionOnlyQuestions,
  changedHindiPairSurfaces,
  changedPunjabiPairSurfaces,
  pairMisconceptions: [...seenPairMisconceptions].sort(),
  v1SemanticBaselinePreserved: true,
  v2EditorialBaselinePreserved: true,
  multilingualFreezeGranted: false,
}, null, 2));
