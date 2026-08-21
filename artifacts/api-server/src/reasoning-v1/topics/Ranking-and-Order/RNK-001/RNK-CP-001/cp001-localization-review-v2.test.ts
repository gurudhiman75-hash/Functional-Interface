import assert from 'node:assert/strict';

import {
  RNK_CP001_PERMANENT_QL_IDS,
  generateRnkCp001PermanentQuestion,
} from './cp001-permanent-runtime';
import { buildRnkCp001LocalizedReviewBank } from './cp001-localization-review-v1';
import {
  RNK_CP001_LOCALIZATION_REVIEW_V2_AUTHORITY,
  RNK_CP001_LOCALIZATION_REVIEW_V2_EDITORIAL,
  RNK_CP001_LOCALIZATION_REVIEW_V2_VERSION,
  buildRnkCp001LocalizedReviewBankV2,
  localizeRnkCp001PermanentQuestionV2,
  rnkCp001NativeVisibleGivens,
} from './cp001-localization-review-v2';

const SEEDS_PER_QL = 128;
const hindiV1 = buildRnkCp001LocalizedReviewBank('hi-IN', SEEDS_PER_QL);
const punjabiV1 = buildRnkCp001LocalizedReviewBank('pa-IN', SEEDS_PER_QL);
const hindi = buildRnkCp001LocalizedReviewBankV2('hi-IN', SEEDS_PER_QL);
const punjabi = buildRnkCp001LocalizedReviewBankV2('pa-IN', SEEDS_PER_QL);

assert.equal(hindi.length, 1_152);
assert.equal(punjabi.length, 1_152);
assert.deepEqual(hindi, buildRnkCp001LocalizedReviewBankV2('hi-IN', SEEDS_PER_QL));

const badHindiOrdinals = ['1वें स्थान', '2वें स्थान', '3वें स्थान', '4वें स्थान'];
const badPunjabiOrdinals = ['1ਵੇਂ ਸਥਾਨ', '2ਵੇਂ ਸਥਾਨ', '3ਵੇਂ ਸਥਾਨ', '4ਵੇਂ ਸਥਾਨ'];
const genericHindiContext = 'ऊपर/बाएँ/आगे से स्थान';
const genericPunjabiContext = 'ਉੱਪਰ/ਖੱਬੇ/ਅੱਗੇ ਤੋਂ ਸਥਾਨ';
const badHindiSingular = /(^|[^0-9])1 (?:व्यक्ति|अभ्यर्थी) हैं/u;
const badPunjabiSingular = /(^|[^0-9])1 (?:ਵਿਅਕਤੀ|ਉਮੀਦਵਾਰ) ਹਨ/u;
const badHindiZero = /(^|[^0-9])0 (?:व्यक्ति|अभ्यर्थी) हैं/u;
const badPunjabiZero = /(^|[^0-9])0 (?:ਵਿਅਕਤੀ|ਉਮੀਦਵਾਰ) ਹਨ/u;

let changedHindiStems = 0;
let changedPunjabiStems = 0;
let changedHindiExplanations = 0;
let changedPunjabiExplanations = 0;
const contexts = new Set<string>();
const prototypes = new Set<string>();

for (let qlIndex = 0; qlIndex < RNK_CP001_PERMANENT_QL_IDS.length; qlIndex += 1) {
  const qlId = RNK_CP001_PERMANENT_QL_IDS[qlIndex]!;
  for (let seed = 0; seed < SEEDS_PER_QL; seed += 1) {
    const index = qlIndex * SEEDS_PER_QL + seed;
    const canonical = generateRnkCp001PermanentQuestion(qlId, seed);
    const hi1 = hindiV1[index]!;
    const pa1 = punjabiV1[index]!;
    const hi = hindi[index]!;
    const pa = punjabi[index]!;

    assert.deepEqual(hi, localizeRnkCp001PermanentQuestionV2(canonical, 'hi-IN'));
    assert.deepEqual(pa, localizeRnkCp001PermanentQuestionV2(canonical, 'pa-IN'));

    for (const [before, after] of [[hi1, hi], [pa1, pa]] as const) {
      assert.equal(after.packageId, before.packageId);
      assert.equal(after.checkpointId, before.checkpointId);
      assert.equal(after.qlId, before.qlId);
      assert.equal(after.permanentQlId, before.permanentQlId);
      assert.equal(after.seed, before.seed);
      assert.equal(after.authorityId, before.authorityId);
      assert.deepEqual(after.authorityContract, before.authorityContract);
      assert.deepEqual(after.displayedEvidence, before.displayedEvidence);
      assert.equal(after.answerSemantic, before.answerSemantic);
      assert.equal(after.answer, before.answer);
      assert.deepEqual(after.options, before.options);
      assert.equal(after.correctIndex, before.correctIndex);
      assert.equal(after.difficulty, before.difficulty);
      assert.deepEqual(after.normalizedState, before.normalizedState);
      assert.equal(after.mathematicalFingerprint, before.mathematicalFingerprint);
      assert.equal(after.contextId, before.contextId);
      assert.equal(after.canonicalTargetName, before.canonicalTargetName);
      assert.equal(after.targetName, before.targetName);
      assert.equal(after.explanation.keyRule, before.explanation.keyRule);
      assert.deepEqual(after.explanation.optionAnalysis, before.explanation.optionAnalysis);
      assert.equal(after.explanation.conclusion, before.explanation.conclusion);
      assert.equal(
        after.localizationProof.canonicalSemanticFingerprint,
        before.localizationProof.canonicalSemanticFingerprint,
      );

      assert.equal(after.reviewMetadata.localization.version, RNK_CP001_LOCALIZATION_REVIEW_V2_VERSION);
      assert.equal(after.reviewMetadata.localization.editorialVersion, RNK_CP001_LOCALIZATION_REVIEW_V2_EDITORIAL);
      assert.equal(after.localizationProof.authority, RNK_CP001_LOCALIZATION_REVIEW_V2_AUTHORITY);
      assert.equal(after.localizationProof.editorialVersion, RNK_CP001_LOCALIZATION_REVIEW_V2_EDITORIAL);
      assert.equal(after.localizationProof.semanticParity, 'EXECUTABLE_PROVED');
      assert.equal(after.localizationProof.humanLanguageReviewRequired, true);
      assert.equal(after.localizationProof.multilingualFreezeGranted, false);
      assert.equal(after.lifecycle.hindiPunjabi, 'REVIEW_CANDIDATE');
      assert.equal(after.lifecycle.questionStudioDiscoverable, false);
      assert.equal(after.lifecycle.questionBankStatus, 'NOT_STORED');
      assert.equal(after.lifecycle.publiclyPublishable, false);
      assert.equal(after.lifecycle.productDeliveryUnlocked, false);

      assert.equal(after.explanation.stepByStepSolution.length, 3);
      assert.equal(after.explanation.stepByStepSolution[0], rnkCp001NativeVisibleGivens(after));
      assert.ok(after.explanation.stepByStepSolution[1]!.includes(String(after.answer)));
      assert.ok(after.explanation.stepByStepSolution[2]!.includes(String(after.answer)));
    }

    const hiLearner = [hi.stem, ...hi.explanation.stepByStepSolution, hi.explanation.examSpeedShortcut].join('\n');
    const paLearner = [pa.stem, ...pa.explanation.stepByStepSolution, pa.explanation.examSpeedShortcut].join('\n');

    for (const fragment of badHindiOrdinals) assert.equal(hiLearner.includes(fragment), false, hiLearner);
    for (const fragment of badPunjabiOrdinals) assert.equal(paLearner.includes(fragment), false, paLearner);
    assert.equal(hiLearner.includes(genericHindiContext), false, hiLearner);
    assert.equal(paLearner.includes(genericPunjabiContext), false, paLearner);
    assert.equal(badHindiSingular.test(hi.stem), false, hi.stem);
    assert.equal(badPunjabiSingular.test(pa.stem), false, pa.stem);
    assert.equal(badHindiZero.test(hi.stem), false, hi.stem);
    assert.equal(badPunjabiZero.test(pa.stem), false, pa.stem);
    assert.equal(pa.stem.includes('ਸਥਾਨ ਤੇ'), false, pa.stem);

    if (hi.stem !== hi1.stem) changedHindiStems += 1;
    if (pa.stem !== pa1.stem) changedPunjabiStems += 1;
    if (JSON.stringify(hi.explanation) !== JSON.stringify(hi1.explanation)) changedHindiExplanations += 1;
    if (JSON.stringify(pa.explanation) !== JSON.stringify(pa1.explanation)) changedPunjabiExplanations += 1;

    contexts.add(hi.contextId);
    prototypes.add(hi.reviewMetadata.sourcePrototypeId);
  }
}

assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
assert.equal(prototypes.size, 13);
assert.ok(changedHindiStems > 0);
assert.ok(changedPunjabiStems > 0);
assert.equal(changedHindiExplanations, 1_152);
assert.equal(changedPunjabiExplanations, 1_152);
assert.equal(JSON.stringify({ hindi, punjabi }).includes('RNK-QL-043'), false);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_CP001_LOCALIZATION_REVIEW_V2_VERSION,
  editorialVersion: RNK_CP001_LOCALIZATION_REVIEW_V2_EDITORIAL,
  authority: RNK_CP001_LOCALIZATION_REVIEW_V2_AUTHORITY,
  hindiReviewCandidates: hindi.length,
  punjabiReviewCandidates: punjabi.length,
  changedHindiStems,
  changedPunjabiStems,
  changedHindiExplanations,
  changedPunjabiExplanations,
  contexts: [...contexts].sort(),
  sourcePrototypeCount: prototypes.size,
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
}, null, 2));
