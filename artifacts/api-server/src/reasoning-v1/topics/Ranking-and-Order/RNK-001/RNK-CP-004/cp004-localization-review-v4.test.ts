import assert from 'node:assert/strict';

import type { RnkCp004Comparison } from './cp004-foundation';
import { buildRnkCp004PermanentRuntime } from './cp004-permanent-runtime-v1';
import { localizeRnkCp004PermanentQuestionV3 } from './cp004-localization-review-v3';
import {
  RNK_CP004_LOCALIZATION_REVIEW_V4_AUTHORITY,
  RNK_CP004_LOCALIZATION_REVIEW_V4_VERSION,
  buildRnkCp004LocalizedReviewBankV4,
  localizeRnkCp004PermanentQuestionV4,
} from './cp004-localization-review-v4';

const canonical = buildRnkCp004PermanentRuntime();
const hindi = buildRnkCp004LocalizedReviewBankV4('hi-IN');
const punjabi = buildRnkCp004LocalizedReviewBankV4('pa-IN');
const hindiReplay = buildRnkCp004LocalizedReviewBankV4('hi-IN');

assert.equal(canonical.length, 1_728);
assert.equal(hindi.length, 1_728);
assert.equal(punjabi.length, 1_728);
assert.deepEqual(hindiReplay, hindi, 'CP004 V4 Hindi replay must be deterministic');

const residualEnglishWord = /[A-Za-z]{2,}/u;
let missingQuestions = 0;
let changedHindiMissing = 0;
let changedPunjabiMissing = 0;
let unchangedHindiNonMissing = 0;
let unchangedPunjabiNonMissing = 0;
const hindiFingerprints = new Set<string>();
const punjabiFingerprints = new Set<string>();

function learnerProjection(question: Record<string, any>) {
  return {
    stem: question.stem,
    answer: question.answer,
    options: question.options.map((option: Record<string, any>) => ({
      label: option.label,
      explanation: option.explanation,
    })),
    explanation: question.explanation,
    visibleExplanation: question.visibleExplanation,
  };
}

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

function componentCount(source: Record<string, any>): number {
  const entities = [...source.displayedEvidence.entities] as string[];
  const clues = source.displayedEvidence.clues as readonly RnkCp004Comparison[];
  const neighbours = new Map<string, Set<string>>(entities.map((entity) => [entity, new Set<string>()]));
  for (const clue of clues) {
    neighbours.get(clue.higher)!.add(clue.lower);
    neighbours.get(clue.lower)!.add(clue.higher);
  }
  const seen = new Set<string>();
  let components = 0;
  for (const start of entities) {
    if (seen.has(start)) continue;
    components += 1;
    const stack = [start];
    seen.add(start);
    while (stack.length > 0) {
      const current = stack.pop()!;
      for (const next of neighbours.get(current) ?? []) {
        if (!seen.has(next)) {
          seen.add(next);
          stack.push(next);
        }
      }
    }
  }
  return components;
}

for (let index = 0; index < canonical.length; index += 1) {
  const source = canonical[index]! as Record<string, any>;
  const hiV3 = localizeRnkCp004PermanentQuestionV3(source, 'hi-IN');
  const paV3 = localizeRnkCp004PermanentQuestionV3(source, 'pa-IN');
  const hi = hindi[index]! as Record<string, any>;
  const pa = punjabi[index]! as Record<string, any>;

  assert.deepEqual(hi, localizeRnkCp004PermanentQuestionV4(source, 'hi-IN'));
  assert.deepEqual(pa, localizeRnkCp004PermanentQuestionV4(source, 'pa-IN'));

  for (const [v3, v4] of [[hiV3, hi], [paV3, pa]] as const) {
    assert.equal(v4.packageId, v3.packageId);
    assert.equal(v4.checkpointId, v3.checkpointId);
    assert.equal(v4.prototypeId, v3.prototypeId);
    assert.equal(v4.seed, v3.seed);
    assert.deepEqual(v4.displayedEvidence, v3.displayedEvidence);
    assert.deepEqual(v4.reviewMetadata, v3.reviewMetadata);
    assert.equal(v4.answerKey, v3.answerKey);
    assert.equal(v4.answerSemantic, v3.answerSemantic);
    assert.equal(v4.correctIndex, v3.correctIndex);
    assert.equal(v4.difficulty, v3.difficulty);
    assert.equal(v4.mathematicalFingerprint, v3.mathematicalFingerprint);
    assert.deepEqual(v4.canonicalNames, v3.canonicalNames);
    assert.deepEqual(v4.localizedNames, v3.localizedNames);
    assert.deepEqual(v4.lifecycle, v3.lifecycle);
    assert.equal(v4.options.length, v3.options.length);
    v4.options.forEach((option: Record<string, unknown>, optionIndex: number) => {
      const baseline = v3.options[optionIndex]!;
      assert.equal(option.answerKey, baseline.answerKey);
      assert.equal(option.misconceptionId, baseline.misconceptionId);
      assert.equal(option.label, baseline.label);
    });
    assert.equal(v4.answer, v4.options[v4.correctIndex]!.label);
    assert.equal(v4.localizationMetadata.version, RNK_CP004_LOCALIZATION_REVIEW_V4_VERSION);
    assert.equal(v4.localizationMetadata.missingComparisonPedagogyOverlay, 'TWO_BLOCK_BRIDGE_REASONING_V4');
    assert.equal(v4.localizationMetadata.v3RuntimeContractBaselinePreserved, true);
    assert.equal(v4.localizationProof.authority, RNK_CP004_LOCALIZATION_REVIEW_V4_AUTHORITY);
    assert.equal(
      v4.localizationProof.canonicalSemanticFingerprint,
      v3.localizationProof.canonicalSemanticFingerprint,
    );
    assert.equal(v4.localizationProof.v3LocalizationFingerprint, v3.localizationProof.localizationFingerprint);
    assert.equal(v4.localizationProof.missingComparisonPedagogyCoverage, 'EXECUTABLE_PROVED');
    assert.equal(v4.localizationProof.multilingualFreezeGranted, false);
    assert.equal(v4.localizationProof.productDeliveryUnlocked, false);
    assert.equal(residualEnglishWord.test(learnerText(v4)), false, learnerText(v4));
  }

  if (source.displayedEvidence.query.kind === 'MISSING_COMPARISON') {
    missingQuestions += 1;
    assert.equal(componentCount(source), 2, `Missing-comparison source should expose exactly two blocks at index ${index}`);
    assert.notDeepEqual(learnerProjection(hi), learnerProjection(hiV3));
    assert.notDeepEqual(learnerProjection(pa), learnerProjection(paV3));
    changedHindiMissing += 1;
    changedPunjabiMissing += 1;

    assert.ok(hi.stem.includes('नीचे दी गई तुलनाएँ अभी पूरा क्रम निर्धारित नहीं करतीं।'), hi.stem);
    assert.ok(pa.stem.includes('ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਹਾਲੇ ਪੂਰਾ ਕ੍ਰਮ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕਰਦੀਆਂ।'), pa.stem);
    assert.equal(hi.stem.includes('नीचे दी गई तुलनाओं से पूरा क्रम तय करें।'), false, hi.stem);
    assert.equal(pa.stem.includes('ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਪੂਰਾ ਕ੍ਰਮ ਬਣਾਓ।'), false, pa.stem);
    assert.ok(hi.explanation.stepByStepSolution[0]!.includes('दो अलग क्रम-खंड'), hi.explanation.stepByStepSolution.join('\n'));
    assert.ok(pa.explanation.stepByStepSolution[0]!.includes('ਦੋ ਵੱਖਰੇ ਕ੍ਰਮ-ਖੰਡ'), pa.explanation.stepByStepSolution.join('\n'));
    assert.ok(hi.explanation.stepByStepSolution[1]!.includes('आपसी स्थिति अभी तय नहीं है'), hi.explanation.stepByStepSolution.join('\n'));
    assert.ok(pa.explanation.stepByStepSolution[1]!.includes('ਆਪਸੀ ਸਥਿਤੀ ਹਾਲੇ ਤੈਅ ਨਹੀਂ ਹੈ'), pa.explanation.stepByStepSolution.join('\n'));
    assert.ok(hi.explanation.stepByStepSolution[2]!.includes(String(hi.answer)), hi.explanation.stepByStepSolution.join('\n'));
    assert.ok(pa.explanation.stepByStepSolution[2]!.includes(String(pa.answer)), pa.explanation.stepByStepSolution.join('\n'));
    assert.equal(
      hi.explanation.stepByStepSolution.some((line: string) => line.startsWith('दी गई तुलनाओं को जोड़ने पर ऊपर से नीचे क्रम है:')),
      false,
      hi.explanation.stepByStepSolution.join('\n'),
    );
    assert.equal(
      pa.explanation.stepByStepSolution.some((line: string) => line.startsWith('ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਜੋੜਨ ਉੱਤੇ ਉੱਪਰ ਤੋਂ ਹੇਠਾਂ ਕ੍ਰਮ ਹੈ:')),
      false,
      pa.explanation.stepByStepSolution.join('\n'),
    );
  } else {
    assert.deepEqual(learnerProjection(hi), learnerProjection(hiV3));
    assert.deepEqual(learnerProjection(pa), learnerProjection(paV3));
    unchangedHindiNonMissing += 1;
    unchangedPunjabiNonMissing += 1;
  }

  assert.equal(
    hi.localizationProof.canonicalSemanticFingerprint,
    pa.localizationProof.canonicalSemanticFingerprint,
  );
  assert.notEqual(hi.localizationProof.localizationFingerprint, pa.localizationProof.localizationFingerprint);
  hindiFingerprints.add(hi.localizationProof.localizationFingerprint);
  punjabiFingerprints.add(pa.localizationProof.localizationFingerprint);
}

assert.equal(missingQuestions, 192);
assert.equal(changedHindiMissing, 192);
assert.equal(changedPunjabiMissing, 192);
assert.equal(unchangedHindiNonMissing, 1_536);
assert.equal(unchangedPunjabiNonMissing, 1_536);
assert.equal(hindiFingerprints.size, 1_728);
assert.equal(punjabiFingerprints.size, 1_728);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_CP004_LOCALIZATION_REVIEW_V4_VERSION,
  authority: RNK_CP004_LOCALIZATION_REVIEW_V4_AUTHORITY,
  hindi: hindi.length,
  punjabi: punjabi.length,
  missingQuestions,
  changedHindiMissing,
  changedPunjabiMissing,
  unchangedHindiNonMissing,
  unchangedPunjabiNonMissing,
  v1SemanticBaselinePreserved: true,
  v2EditorialBaselinePreserved: true,
  v3RuntimeContractBaselinePreserved: true,
  multilingualFreezeGranted: false,
}, null, 2));
