import assert from 'node:assert/strict';

import { RNK_CP003_PERMANENT_QL_IDS, generateRnkCp003PermanentQuestion } from './cp003-permanent-runtime';
import { buildRnkCp003LocalizedReviewBank } from './cp003-localization-review-v1';
import {
  RNK_CP003_LOCALIZATION_REVIEW_V2_AUTHORITY,
  RNK_CP003_LOCALIZATION_REVIEW_V2_EDITORIAL,
  RNK_CP003_LOCALIZATION_REVIEW_V2_VERSION,
  buildRnkCp003LocalizedReviewBankV2,
  localizeRnkCp003PermanentQuestionV2,
  repairRnkCp003EditorialText,
} from './cp003-localization-review-v2';

const SEEDS_PER_QL = 192;
const hi1 = buildRnkCp003LocalizedReviewBank('hi-IN', SEEDS_PER_QL);
const pa1 = buildRnkCp003LocalizedReviewBank('pa-IN', SEEDS_PER_QL);
const hi = buildRnkCp003LocalizedReviewBankV2('hi-IN', SEEDS_PER_QL);
const pa = buildRnkCp003LocalizedReviewBankV2('pa-IN', SEEDS_PER_QL);
const hiReplay = buildRnkCp003LocalizedReviewBankV2('hi-IN', SEEDS_PER_QL);

assert.equal(hi.length, 1_728);
assert.equal(pa.length, 1_728);
assert.deepEqual(hiReplay, hi);

assert.equal(
  repairRnkCp003EditorialText('दोनों अपनी जगह बदल लेते हैं।', 'hi-IN'),
  'दोनों की जगहें आपस में बदल जाती हैं।',
);
assert.equal(
  repairRnkCp003EditorialText('ਦੋਵੇਂ ਆਪਣੀਆਂ ਥਾਵਾਂ ਬਦਲ ਲੈਂਦੇ ਹਨ।', 'pa-IN'),
  'ਦੋਵਾਂ ਦੀਆਂ ਥਾਵਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲ ਜਾਂਦੀਆਂ ਹਨ।',
);
assert.equal(repairRnkCp003EditorialText('2 ਵਿਅਕਤੀ ਸ਼ਾਮਲ ਹੁੰਦੇ ਹੈ', 'pa-IN'), '2 ਵਿਅਕਤੀ ਸ਼ਾਮਲ ਹੁੰਦੇ ਹਨ');
assert.equal(repairRnkCp003EditorialText('3 ਵਿਅਕਤੀ ਬਾਹਰ ਹੋ ਜਾਂਦੇ ਹੈ', 'pa-IN'), '3 ਵਿਅਕਤੀ ਬਾਹਰ ਹੋ ਜਾਂਦੇ ਹਨ');
assert.equal(repairRnkCp003EditorialText('स्थिति आगे की ओर 3 स्थान बदलती है', 'hi-IN'), 'स्थिति आगे की ओर 3 स्थान खिसकती है');
assert.equal(repairRnkCp003EditorialText('ਸਥਿਤੀ ਅੱਗੇ ਵੱਲ 3 ਸਥਾਨ ਬਦਲਦੀ ਹੈ', 'pa-IN'), 'ਸਥਿਤੀ ਅੱਗੇ ਵੱਲ 3 ਸਥਾਨ ਖਿਸਕਦੀ ਹੈ');

const badHindi = /(?:अपनी जगह बदल लेते हैं|ने अपनी जगह बदल ली|स्थान बदलती है|नई दौड़ का अंतिम क्रम में|पर पर चला|पर चला जाता है|पर चला गया|संदर्भ स्थिति \d+ से \d+ पर जाता है)/u;
const badPunjabi = /(?:ਆਪਣੀਆਂ ਥਾਵਾਂ ਬਦਲ ਲੈਂਦੇ ਹਨ|ਨੇ ਆਪਣੀਆਂ ਥਾਵਾਂ ਬਦਲ ਲਈਆਂ|ਸਥਾਨ ਬਦਲਦੀ ਹੈ|ਹੁੰਦੇ ਹੈ|ਜਾਂਦੇ ਹੈ|ਨਵੀਂ ਦੌੜ ਦਾ ਅੰਤਿਮ ਕ੍ਰਮ ਵਿੱਚ|'ਤੇ ਉੱਤੇ ਚਲਾ|ਉੱਤੇ ਚਲਾ ਜਾਂਦਾ ਹੈ|ਉੱਤੇ ਚਲਾ ਗਿਆ|ਹਵਾਲਾ ਸਥਿਤੀ \d+ ਤੋਂ \d+ ਉੱਤੇ ਜਾਂਦਾ ਹੈ)/u;
const residualEnglishWord = /[A-Za-z]{2,}/u;
const devanagari = /[\u0900-\u097F]/u;
const gurmukhi = /[\u0A00-\u0A7F]/u;
let changedHindi = 0;
let changedPunjabi = 0;
let sourceMoveHindi = 0;
let sourceMovePunjabi = 0;
const evidenceKinds = new Set<string>();
const qls = new Set<string>();
const contexts = new Set<string>();

function semanticOptionValue(option: Record<string, unknown>): unknown {
  return Object.prototype.hasOwnProperty.call(option, 'answerKey') ? option.answerKey : option.answer;
}

for (let qlIndex = 0; qlIndex < RNK_CP003_PERMANENT_QL_IDS.length; qlIndex += 1) {
  const qlId = RNK_CP003_PERMANENT_QL_IDS[qlIndex]!;
  for (let seed = 0; seed < SEEDS_PER_QL; seed += 1) {
    const index = qlIndex * SEEDS_PER_QL + seed;
    const canonical = generateRnkCp003PermanentQuestion(qlId, seed) as Record<string, any>;
    const h1 = hi1[index]!;
    const p1 = pa1[index]!;
    const h2 = hi[index]!;
    const p2 = pa[index]!;

    assert.deepEqual(h2, localizeRnkCp003PermanentQuestionV2(canonical, 'hi-IN'));
    assert.deepEqual(p2, localizeRnkCp003PermanentQuestionV2(canonical, 'pa-IN'));

    for (const [before, after] of [[h1, h2], [p1, p2]] as const) {
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
      assert.deepEqual(after.canonicalNames, before.canonicalNames);
      assert.deepEqual(after.localizedNames, before.localizedNames);
      assert.equal(after.localizationProof.canonicalSemanticFingerprint, before.localizationProof.canonicalSemanticFingerprint);

      assert.equal(after.options.length, before.options.length);
      after.options.forEach((option: Record<string, unknown>, optionIndex: number) => {
        const source = before.options[optionIndex]! as Record<string, unknown>;
        assert.equal(semanticOptionValue(option), semanticOptionValue(source));
        assert.equal(option.misconceptionId, source.misconceptionId);
      });
      assert.equal(
        semanticOptionValue(after.options[after.correctIndex] as Record<string, unknown>),
        semanticOptionValue(before.options[before.correctIndex] as Record<string, unknown>),
      );

      assert.equal(after.localizationMetadata.version, RNK_CP003_LOCALIZATION_REVIEW_V2_VERSION);
      assert.equal(after.localizationMetadata.editorialVersion, RNK_CP003_LOCALIZATION_REVIEW_V2_EDITORIAL);
      assert.equal(after.localizationProof.authority, RNK_CP003_LOCALIZATION_REVIEW_V2_AUTHORITY);
      assert.equal(after.localizationProof.editorialVersion, RNK_CP003_LOCALIZATION_REVIEW_V2_EDITORIAL);
      assert.equal(after.localizationProof.semanticParity, 'EXECUTABLE_PROVED');
      assert.equal(after.localizationProof.multilingualFreezeGranted, false);
      assert.equal(after.localizationProof.productDeliveryUnlocked, false);
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
      if (after.locale === 'hi-IN') {
        assert.equal(badHindi.test(learnerText), false, learnerText);
        assert.match(learnerText, devanagari);
      } else {
        assert.equal(badPunjabi.test(learnerText), false, learnerText);
        assert.match(learnerText, gurmukhi);
      }
    }

    if (JSON.stringify(h1) !== JSON.stringify(h2)) changedHindi += 1;
    if (JSON.stringify(p1) !== JSON.stringify(p2)) changedPunjabi += 1;

    const evidenceKind = String((h2.displayedEvidence as Record<string, unknown>).kind);
    if (evidenceKind === 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES' || evidenceKind === 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED') {
      sourceMoveHindi += 1;
      sourceMovePunjabi += 1;
      assert.ok(h2.stem.includes('की स्थिति'));
      assert.ok(p2.stem.includes('ਦੀ ਸਥਿਤੀ'));
      assert.equal(h2.stem.includes('पर पर'), false);
      assert.equal(p2.stem.includes("'ਤੇ ਉੱਤੇ"), false);
    }

    evidenceKinds.add(evidenceKind);
    qls.add(String(h2.permanentQlId));
    contexts.add(String(h2.contextId));
  }
}

assert.equal(changedHindi > 0, true);
assert.equal(changedPunjabi > 0, true);
assert.equal(sourceMoveHindi > 0, true);
assert.equal(sourceMovePunjabi > 0, true);
assert.equal(evidenceKinds.size, 13);
assert.deepEqual([...qls], [...RNK_CP003_PERMANENT_QL_IDS]);
assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE', 'RACE_ORDER'].sort());
assert.equal(JSON.stringify({ hi, pa }).includes('RNK-QL-043'), false);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_CP003_LOCALIZATION_REVIEW_V2_VERSION,
  editorialVersion: RNK_CP003_LOCALIZATION_REVIEW_V2_EDITORIAL,
  authority: RNK_CP003_LOCALIZATION_REVIEW_V2_AUTHORITY,
  permanentQlRange: 'RNK-QL-018..026',
  hindiReviewCandidates: hi.length,
  punjabiReviewCandidates: pa.length,
  changedHindiRecords: changedHindi,
  changedPunjabiRecords: changedPunjabi,
  sourceMoveRecordsPerLocale: sourceMoveHindi,
  evidenceKindCount: evidenceKinds.size,
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
}, null, 2));
