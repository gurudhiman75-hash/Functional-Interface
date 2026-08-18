import assert from 'node:assert/strict';

import { buildRnkCp004PermanentRuntime } from './cp004-permanent-runtime-v1';
import { localizeRnkCp004PermanentQuestionV5Final } from './cp004-localization-review-v5-final';
import {
  RNK_CP004_LOCALIZATION_REVIEW_V6_AUTHORITY,
  RNK_CP004_LOCALIZATION_REVIEW_V6_VERSION,
  buildRnkCp004LocalizedReviewBankV6,
  localizeRnkCp004PermanentQuestionV6,
} from './cp004-localization-review-v6';

const canonical = buildRnkCp004PermanentRuntime();
const hindi = buildRnkCp004LocalizedReviewBankV6('hi-IN');
const punjabi = buildRnkCp004LocalizedReviewBankV6('pa-IN');
const replay = buildRnkCp004LocalizedReviewBankV6('pa-IN');

assert.equal(canonical.length, 1_728);
assert.equal(hindi.length, 1_728);
assert.equal(punjabi.length, 1_728);
assert.deepEqual(replay, punjabi, 'CP004 V6 must replay deterministically');

let remediatedHindi = 0;
let remediatedPunjabi = 0;
let preservedHindi = 0;
let preservedPunjabi = 0;
const forbiddenHindi = /इस विकल्प में .*जबकि सही उत्तर/u;
const forbiddenPunjabi = /ਇਸ ਚੋਣ ਵਿੱਚ .*ਜਦਕਿ ਸਹੀ ਜਵਾਬ/u;

for (let index = 0; index < canonical.length; index += 1) {
  const source = canonical[index]! as Record<string, any>;
  const hi = hindi[index]! as Record<string, any>;
  const pa = punjabi[index]! as Record<string, any>;
  const hiV5 = localizeRnkCp004PermanentQuestionV5Final(source, 'hi-IN') as Record<string, any>;
  const paV5 = localizeRnkCp004PermanentQuestionV5Final(source, 'pa-IN') as Record<string, any>;
  const qlId = source.reviewMetadata.permanentProfile.permanentQlId as string;
  const target = qlId === 'RNK-QL-027' || qlId === 'RNK-QL-028';

  assert.deepEqual(hi, localizeRnkCp004PermanentQuestionV6(source, 'hi-IN'));
  assert.deepEqual(pa, localizeRnkCp004PermanentQuestionV6(source, 'pa-IN'));

  for (const [v5, v6] of [[hiV5, hi], [paV5, pa]] as const) {
    assert.equal(v6.packageId, v5.packageId);
    assert.equal(v6.checkpointId, v5.checkpointId);
    assert.equal(v6.prototypeId, v5.prototypeId);
    assert.equal(v6.seed, v5.seed);
    assert.equal(v6.stem, v5.stem);
    assert.equal(v6.answer, v5.answer);
    assert.equal(v6.answerKey, v5.answerKey);
    assert.equal(v6.correctIndex, v5.correctIndex);
    assert.equal(v6.mathematicalFingerprint, v5.mathematicalFingerprint);
    assert.deepEqual(v6.displayedEvidence, v5.displayedEvidence);
    assert.deepEqual(v6.reviewMetadata, v5.reviewMetadata);
    assert.deepEqual(v6.lifecycle, v5.lifecycle);
    assert.equal(v6.localizationMetadata.version, RNK_CP004_LOCALIZATION_REVIEW_V6_VERSION);
    assert.equal(v6.localizationMetadata.v5FinalSurfacePreserved, true);
    assert.equal(v6.localizationMetadata.ql027028PedagogyRemediated, target);
    assert.equal(v6.localizationProof.authority, RNK_CP004_LOCALIZATION_REVIEW_V6_AUTHORITY);
    assert.equal(v6.localizationProof.v5FinalLocalizationFingerprint, v5.localizationProof.localizationFingerprint);
    assert.equal(v6.localizationProof.canonicalSemanticFingerprint, v5.localizationProof.canonicalSemanticFingerprint);

    v6.options.forEach((option: Record<string, any>, optionIndex: number) => {
      assert.equal(option.answerKey, v5.options[optionIndex]!.answerKey);
      assert.equal(option.label, v5.options[optionIndex]!.label);
      assert.equal(option.misconceptionId, v5.options[optionIndex]!.misconceptionId);
    });

    if (target) {
      assert.equal(v6.localizationProof.optionPedagogyCoverage, 'EXECUTABLE_PROVED');
      assert.notDeepEqual(v6.options.map((option: Record<string, any>) => option.explanation), v5.options.map((option: Record<string, any>) => option.explanation));
      assert.notDeepEqual(v6.explanation.optionAnalysis, v5.explanation.optionAnalysis);
      assert.deepEqual(v6.visibleExplanation.optionAnalysis, v6.explanation.optionAnalysis);
    } else {
      assert.equal(v6.localizationProof.optionPedagogyCoverage, 'NOT_APPLICABLE');
      assert.deepEqual(v6.options, v5.options);
      assert.deepEqual(v6.explanation, v5.explanation);
      assert.deepEqual(v6.visibleExplanation, v5.visibleExplanation);
    }
  }

  if (target) {
    remediatedHindi += 1;
    remediatedPunjabi += 1;
    assert.equal(forbiddenHindi.test(hi.explanation.optionAnalysis.join('\n')), false);
    assert.equal(forbiddenPunjabi.test(pa.explanation.optionAnalysis.join('\n')), false);
    assert.ok(hi.explanation.optionAnalysis.some((line: string) => /स्थान|ऊपर|नीचे/u.test(line)));
    assert.ok(pa.explanation.optionAnalysis.some((line: string) => /ਸਥਾਨ|ਉੱਪਰ|ਹੇਠ/u.test(line)));
  } else {
    preservedHindi += 1;
    preservedPunjabi += 1;
  }

  assert.equal(
    hi.localizationProof.canonicalSemanticFingerprint,
    pa.localizationProof.canonicalSemanticFingerprint,
  );
  assert.notEqual(hi.localizationProof.localizationFingerprint, pa.localizationProof.localizationFingerprint);
}

assert.equal(remediatedHindi, 384);
assert.equal(remediatedPunjabi, 384);
assert.equal(preservedHindi, 1_344);
assert.equal(preservedPunjabi, 1_344);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_CP004_LOCALIZATION_REVIEW_V6_VERSION,
  authority: RNK_CP004_LOCALIZATION_REVIEW_V6_AUTHORITY,
  remediatedHindi,
  remediatedPunjabi,
  preservedHindi,
  preservedPunjabi,
  multilingualFreezeGranted: false,
}, null, 2));
