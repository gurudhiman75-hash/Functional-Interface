import assert from 'node:assert/strict';

import { RNK_CP003_PERMANENT_QL_IDS, generateRnkCp003PermanentQuestion } from './cp003-permanent-runtime';
import { buildRnkCp003LocalizedReviewBankV2 } from './cp003-localization-review-v2';
import {
  RNK_CP003_LOCALIZATION_REVIEW_V3_AUTHORITY,
  RNK_CP003_LOCALIZATION_REVIEW_V3_EDITORIAL,
  RNK_CP003_LOCALIZATION_REVIEW_V3_VERSION,
  buildRnkCp003LocalizedReviewBankV3,
  localizeRnkCp003PermanentQuestionV3,
} from './cp003-localization-review-v3';

const SEEDS_PER_QL = 192;
const hi2 = buildRnkCp003LocalizedReviewBankV2('hi-IN', SEEDS_PER_QL);
const pa2 = buildRnkCp003LocalizedReviewBankV2('pa-IN', SEEDS_PER_QL);
const hi = buildRnkCp003LocalizedReviewBankV3('hi-IN', SEEDS_PER_QL);
const pa = buildRnkCp003LocalizedReviewBankV3('pa-IN', SEEDS_PER_QL);
const hiReplay = buildRnkCp003LocalizedReviewBankV3('hi-IN', SEEDS_PER_QL);

assert.equal(hi.length, 1_728);
assert.equal(pa.length, 1_728);
assert.deepEqual(hiReplay, hi);

const badHindi = /(?:दौड़ का अंतिम क्रम में|स्थान पर से|पर वाली जगह पर|कितने व्यक्ति को|नई दौड़ का अंतिम क्रम में|पर पर चला)/u;
const badPunjabi = /(?:ਦੌੜ ਦਾ ਅੰਤਿਮ ਕ੍ਰਮ ਵਿੱਚ|ਸਥਾਨ 'ਤੇ ਤੋਂ|'ਤੇ ਵਾਲੀ ਥਾਂ ਉੱਤੇ|ਕਿੰਨੇ ਵਿਅਕਤੀ ਨੂੰ|ਨਵੀਂ ਦੌੜ ਦਾ ਅੰਤਿਮ ਕ੍ਰਮ ਵਿੱਚ|'ਤੇ ਉੱਤੇ ਚਲਾ)/u;
const residualEnglishWord = /[A-Za-z]{2,}/u;
const evidenceKinds = new Set<string>();
const qls = new Set<string>();
const contexts = new Set<string>();
let changedHindi = 0;
let changedPunjabi = 0;

function optionValue(option: Record<string, unknown>): unknown {
  return Object.prototype.hasOwnProperty.call(option, 'answerKey') ? option.answerKey : option.answer;
}

for (let qlIndex = 0; qlIndex < RNK_CP003_PERMANENT_QL_IDS.length; qlIndex += 1) {
  const qlId = RNK_CP003_PERMANENT_QL_IDS[qlIndex]!;
  for (let seed = 0; seed < SEEDS_PER_QL; seed += 1) {
    const index = qlIndex * SEEDS_PER_QL + seed;
    const canonical = generateRnkCp003PermanentQuestion(qlId, seed) as Record<string, any>;
    const beforeHi = hi2[index]!;
    const beforePa = pa2[index]!;
    const afterHi = hi[index]!;
    const afterPa = pa[index]!;

    assert.deepEqual(afterHi, localizeRnkCp003PermanentQuestionV3(canonical, 'hi-IN'));
    assert.deepEqual(afterPa, localizeRnkCp003PermanentQuestionV3(canonical, 'pa-IN'));

    for (const [before, after, bad] of [
      [beforeHi, afterHi, badHindi],
      [beforePa, afterPa, badPunjabi],
    ] as const) {
      assert.equal(after.packageId, before.packageId);
      assert.equal(after.checkpointId, before.checkpointId);
      assert.equal(after.permanentQlId, before.permanentQlId);
      assert.equal(after.prototypeId, before.prototypeId);
      assert.equal(after.seed, before.seed);
      assert.equal(after.contextId, before.contextId);
      assert.deepEqual(after.displayedEvidence, before.displayedEvidence);
      assert.equal(after.answerSemantic, before.answerSemantic);
      assert.equal(after.answerKey, before.answerKey);
      assert.equal(after.answer, before.answer);
      assert.equal(after.correctIndex, before.correctIndex);
      assert.equal(after.difficulty, before.difficulty);
      assert.equal(after.mathematicalFingerprint, before.mathematicalFingerprint);
      assert.equal(after.localizationProof.canonicalSemanticFingerprint, before.localizationProof.canonicalSemanticFingerprint);
      assert.equal(after.options.length, before.options.length);
      after.options.forEach((option: Record<string, unknown>, optionIndex: number) => {
        const source = before.options[optionIndex]! as Record<string, unknown>;
        assert.equal(optionValue(option), optionValue(source));
        assert.equal(option.misconceptionId, source.misconceptionId);
      });

      assert.equal(after.localizationMetadata.version, RNK_CP003_LOCALIZATION_REVIEW_V3_VERSION);
      assert.equal(after.localizationMetadata.editorialVersion, RNK_CP003_LOCALIZATION_REVIEW_V3_EDITORIAL);
      assert.equal(after.localizationProof.authority, RNK_CP003_LOCALIZATION_REVIEW_V3_AUTHORITY);
      assert.equal(after.localizationProof.editorialVersion, RNK_CP003_LOCALIZATION_REVIEW_V3_EDITORIAL);
      assert.equal(after.localizationProof.semanticParity, 'EXECUTABLE_PROVED');
      assert.equal(after.localizationProof.multilingualFreezeGranted, false);
      assert.equal(after.lifecycle.hindiPunjabi, 'REVIEW_CANDIDATE');
      assert.equal(after.lifecycle.questionStudioDiscoverable, false);
      assert.equal(after.lifecycle.questionBankStatus, 'NOT_STORED');
      assert.equal(after.lifecycle.testEligibility, 'INELIGIBLE');
      assert.equal(after.lifecycle.publiclyPublishable, false);
      assert.equal(after.lifecycle.productDeliveryUnlocked, false);

      const learnerText = [
        after.stem,
        String(after.answer),
        ...after.options.flatMap((option: Record<string, unknown>) => [String(option.label), String(option.explanation)]),
        after.explanation.keyRule,
        ...after.explanation.stepByStepSolution,
        after.explanation.examSpeedShortcut,
        ...after.explanation.optionAnalysis,
        after.explanation.conclusion,
      ].join('\n');
      assert.equal(residualEnglishWord.test(learnerText), false, learnerText);
      assert.equal(bad.test(learnerText), false, learnerText);
    }

    if (JSON.stringify(beforeHi) !== JSON.stringify(afterHi)) changedHindi += 1;
    if (JSON.stringify(beforePa) !== JSON.stringify(afterPa)) changedPunjabi += 1;
    evidenceKinds.add(String((afterHi.displayedEvidence as Record<string, unknown>).kind));
    qls.add(String(afterHi.permanentQlId));
    contexts.add(String(afterHi.contextId));
  }
}

assert.ok(changedHindi > 0);
assert.ok(changedPunjabi > 0);
assert.equal(evidenceKinds.size, 13);
assert.deepEqual([...qls], [...RNK_CP003_PERMANENT_QL_IDS]);
assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE', 'RACE_ORDER'].sort());
assert.equal(JSON.stringify({ hi, pa }).includes('RNK-QL-043'), false);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_CP003_LOCALIZATION_REVIEW_V3_VERSION,
  editorialVersion: RNK_CP003_LOCALIZATION_REVIEW_V3_EDITORIAL,
  authority: RNK_CP003_LOCALIZATION_REVIEW_V3_AUTHORITY,
  permanentQlRange: 'RNK-QL-018..026',
  hindiReviewCandidates: hi.length,
  punjabiReviewCandidates: pa.length,
  changedHindiRecords: changedHindi,
  changedPunjabiRecords: changedPunjabi,
  evidenceKindCount: evidenceKinds.size,
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
}, null, 2));
