import assert from 'node:assert/strict';

import { buildRnkCp002LocalizedReviewBank } from './cp002-localization-review-v1';
import {
  RNK_CP002_LOCALIZATION_REVIEW_V2_AUTHORITY,
  RNK_CP002_LOCALIZATION_REVIEW_V2_EDITORIAL,
  RNK_CP002_LOCALIZATION_REVIEW_V2_VERSION,
  buildRnkCp002LocalizedReviewBankV2,
  repairRnkCp002DoubleCopula,
  repairRnkCp002ExtremeGenitive,
} from './cp002-localization-review-v2';

const SEEDS_PER_QL = 192;
const hi1 = buildRnkCp002LocalizedReviewBank('hi-IN', SEEDS_PER_QL);
const pa1 = buildRnkCp002LocalizedReviewBank('pa-IN', SEEDS_PER_QL);
const hi = buildRnkCp002LocalizedReviewBankV2('hi-IN', SEEDS_PER_QL);
const pa = buildRnkCp002LocalizedReviewBankV2('pa-IN', SEEDS_PER_QL);

assert.equal(hi.length, 1_536);
assert.equal(pa.length, 1_536);
assert.deepEqual(hi, buildRnkCp002LocalizedReviewBankV2('hi-IN', SEEDS_PER_QL));

assert.equal(
  repairRnkCp002ExtremeGenitive('पंक्ति में व्यक्ति की अधिकतम संख्या कितनी हो सकती है?', 'hi-IN'),
  'पंक्ति में व्यक्तियों की अधिकतम संख्या कितनी हो सकती है?',
);
assert.equal(
  repairRnkCp002ExtremeGenitive('ਕਤਾਰ ਵਿੱਚ ਵਿਅਕਤੀ ਦੀ ਘੱਟ ਤੋਂ ਘੱਟ ਗਿਣਤੀ ਕਿੰਨੀ ਹੋ ਸਕਦੀ ਹੈ?', 'pa-IN'),
  'ਕਤਾਰ ਵਿੱਚ ਵਿਅਕਤੀਆਂ ਦੀ ਘੱਟ ਤੋਂ ਘੱਟ ਗਿਣਤੀ ਕਿੰਨੀ ਹੋ ਸਕਦੀ ਹੈ?',
);
assert.equal(repairRnkCp002DoubleCopula('सही उत्तर नवदीप बाएँ छोर के अधिक निकट है है।', 'hi-IN'), 'सही उत्तर नवदीप बाएँ छोर के अधिक निकट है।');
assert.equal(repairRnkCp002DoubleCopula('ਸਹੀ ਉੱਤਰ ਨਵਦੀਪ ਖੱਬੇ ਸਿਰੇ ਦੇ ਵੱਧ ਨੇੜੇ ਹੈ ਹੈ।', 'pa-IN'), 'ਸਹੀ ਉੱਤਰ ਨਵਦੀਪ ਖੱਬੇ ਸਿਰੇ ਦੇ ਵੱਧ ਨੇੜੇ ਹੈ।');

const badHiExtreme = /(?:अभ्यर्थी|व्यक्ति) की (?:अधिकतम|न्यूनतम) संख्या/u;
const badPaExtreme = /(?:ਉਮੀਦਵਾਰ|ਵਿਅਕਤੀ) ਦੀ (?:ਵੱਧ ਤੋਂ ਵੱਧ|ਘੱਟ ਤੋਂ ਘੱਟ) ਗਿਣਤੀ/u;
const goodHiExtreme = /(?:अभ्यर्थियों|व्यक्तियों) की (?:अधिकतम|न्यूनतम) संख्या/u;
const goodPaExtreme = /(?:ਉਮੀਦਵਾਰਾਂ|ਵਿਅਕਤੀਆਂ) ਦੀ (?:ਵੱਧ ਤੋਂ ਵੱਧ|ਘੱਟ ਤੋਂ ਘੱਟ) ਗਿਣਤੀ/u;
let hiExtremeRepairs = 0;
let paExtremeRepairs = 0;
let hiCopulaRepairs = 0;
let paCopulaRepairs = 0;
let hiQl017 = 0;
let paQl017 = 0;

for (let index = 0; index < hi.length; index += 1) {
  const h1 = hi1[index]!;
  const p1 = pa1[index]!;
  const h2 = hi[index]!;
  const p2 = pa[index]!;

  for (const [before, after] of [[h1, h2], [p1, p2]] as const) {
    assert.equal(after.packageId, before.packageId);
    assert.equal(after.checkpointId, before.checkpointId);
    assert.equal(after.qlId, before.qlId);
    assert.equal(after.permanentQlId, before.permanentQlId);
    assert.equal(after.seed, before.seed);
    assert.equal(after.authorityId, before.authorityId);
    assert.equal(after.contextId, before.contextId);
    assert.equal(after.firstName, before.firstName);
    assert.equal(after.secondName, before.secondName);
    assert.deepEqual(after.displayedEvidence, before.displayedEvidence);
    assert.equal(after.answerSemantic, before.answerSemantic);
    assert.equal(after.answer, before.answer);
    assert.equal(after.correctIndex, before.correctIndex);
    assert.equal(after.difficulty, before.difficulty);
    assert.deepEqual(after.normalizedState, before.normalizedState);
    assert.equal(after.mathematicalFingerprint, before.mathematicalFingerprint);
    assert.equal(after.options.length, before.options.length);
    after.options.forEach((option, optionIndex) => {
      const source = before.options[optionIndex]!;
      assert.equal(option.value, source.value);
      assert.equal(option.label, source.label);
      assert.equal(option.misconceptionId, source.misconceptionId);
      assert.equal(option.explanation, repairRnkCp002DoubleCopula(source.explanation, after.locale));
      assert.equal(option.value === after.answer, optionIndex === after.correctIndex);
      const expectedAnalysis = after.locale === 'hi-IN'
        ? `विकल्प ${optionIndex + 1} (${option.label}): ${option.explanation}`
        : `ਵਿਕਲਪ ${optionIndex + 1} (${option.label}): ${option.explanation}`;
      assert.equal(after.explanation.optionAnalysis[optionIndex], expectedAnalysis);
    });

    assert.equal(after.explanation.keyRule, before.explanation.keyRule);
    assert.deepEqual(after.explanation.stepByStepSolution, before.explanation.stepByStepSolution);
    assert.equal(after.explanation.examSpeedShortcut, before.explanation.examSpeedShortcut);
    assert.equal(after.explanation.conclusion, repairRnkCp002DoubleCopula(before.explanation.conclusion, after.locale));
    assert.equal(after.localizationProof.canonicalSemanticFingerprint, before.localizationProof.canonicalSemanticFingerprint);
    assert.equal(after.reviewMetadata.localization.version, RNK_CP002_LOCALIZATION_REVIEW_V2_VERSION);
    assert.equal(after.reviewMetadata.localization.editorialVersion, RNK_CP002_LOCALIZATION_REVIEW_V2_EDITORIAL);
    assert.equal(after.localizationProof.authority, RNK_CP002_LOCALIZATION_REVIEW_V2_AUTHORITY);
    assert.equal(after.localizationProof.editorialVersion, RNK_CP002_LOCALIZATION_REVIEW_V2_EDITORIAL);
    assert.equal(after.localizationProof.semanticParity, 'EXECUTABLE_PROVED');
    assert.equal(after.localizationProof.multilingualFreezeGranted, false);
    assert.equal(after.localizationProof.productDeliveryUnlocked, false);
    assert.equal(after.lifecycle.hindiPunjabi, 'REVIEW_CANDIDATE');
    assert.equal(after.lifecycle.questionStudioDiscoverable, false);
    assert.equal(after.lifecycle.questionBankStatus, 'NOT_STORED');
    assert.equal(after.lifecycle.testEligibility, 'INELIGIBLE');
    assert.equal(after.lifecycle.publiclyPublishable, false);
    assert.equal(after.lifecycle.productDeliveryUnlocked, false);
  }

  assert.equal(badHiExtreme.test(h2.stem), false, h2.stem);
  assert.equal(badPaExtreme.test(p2.stem), false, p2.stem);
  assert.equal(`${h2.stem}\n${h2.options.map((o) => o.explanation).join('\n')}\n${h2.explanation.optionAnalysis.join('\n')}\n${h2.explanation.conclusion}`.includes('है है।'), false);
  assert.equal(`${p2.stem}\n${p2.options.map((o) => o.explanation).join('\n')}\n${p2.explanation.optionAnalysis.join('\n')}\n${p2.explanation.conclusion}`.includes('ਹੈ ਹੈ।'), false);

  if (h2.qlId === 'RNK-QL-015') {
    assert.match(h2.stem, goodHiExtreme);
    assert.match(p2.stem, goodPaExtreme);
    if (h2.stem !== h1.stem) hiExtremeRepairs += 1;
    if (p2.stem !== p1.stem) paExtremeRepairs += 1;
  } else {
    assert.equal(h2.stem, h1.stem);
    assert.equal(p2.stem, p1.stem);
  }

  if (h2.qlId === 'RNK-QL-017') {
    hiQl017 += 1;
    paQl017 += 1;
    assert.equal(typeof h2.answer, 'string');
    assert.equal(typeof p2.answer, 'string');
    assert.ok(String(h2.answer).endsWith('है') || h2.answer === 'प्रस्तावित कुल संख्या संभव नहीं है');
    assert.ok(String(p2.answer).endsWith('ਹੈ') || p2.answer === 'ਪ੍ਰਸਤਾਵਿਤ ਕੁੱਲ ਗਿਣਤੀ ਸੰਭਵ ਨਹੀਂ ਹੈ');
  }

  if (JSON.stringify(h2.options) !== JSON.stringify(h1.options) || JSON.stringify(h2.explanation) !== JSON.stringify(h1.explanation)) hiCopulaRepairs += 1;
  if (JSON.stringify(p2.options) !== JSON.stringify(p1.options) || JSON.stringify(p2.explanation) !== JSON.stringify(p1.explanation)) paCopulaRepairs += 1;
}

assert.equal(hiExtremeRepairs, SEEDS_PER_QL);
assert.equal(paExtremeRepairs, SEEDS_PER_QL);
assert.equal(hiQl017, SEEDS_PER_QL);
assert.equal(paQl017, SEEDS_PER_QL);
assert.ok(hiCopulaRepairs > 0);
assert.ok(paCopulaRepairs > 0);
assert.equal(hiCopulaRepairs, paCopulaRepairs);
assert.equal(JSON.stringify({ hi, pa }).includes('RNK-QL-043'), false);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_CP002_LOCALIZATION_REVIEW_V2_VERSION,
  editorialVersion: RNK_CP002_LOCALIZATION_REVIEW_V2_EDITORIAL,
  authority: RNK_CP002_LOCALIZATION_REVIEW_V2_AUTHORITY,
  hindiReviewCandidates: hi.length,
  punjabiReviewCandidates: pa.length,
  hindiExtremeGenitiveRepairs: hiExtremeRepairs,
  punjabiExtremeGenitiveRepairs: paExtremeRepairs,
  hindiCopulaRepairRecords: hiCopulaRepairs,
  punjabiCopulaRepairRecords: paCopulaRepairs,
  ql017RecordsPerLocale: hiQl017,
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
}, null, 2));
