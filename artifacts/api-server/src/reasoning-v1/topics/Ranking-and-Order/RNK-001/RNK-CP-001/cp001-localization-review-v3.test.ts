import assert from 'node:assert/strict';

import {
  RNK_CP001_PERMANENT_QL_IDS,
  generateRnkCp001PermanentQuestion,
} from './cp001-permanent-runtime';
import { buildRnkCp001LocalizedReviewBank } from './cp001-localization-review-v1';
import { buildRnkCp001LocalizedReviewBankV2 } from './cp001-localization-review-v2';
import {
  RNK_CP001_LOCALIZATION_REVIEW_V3_AUTHORITY,
  RNK_CP001_LOCALIZATION_REVIEW_V3_EDITORIAL,
  RNK_CP001_LOCALIZATION_REVIEW_V3_VERSION,
  buildRnkCp001LocalizedReviewBankV3,
  buildRnkCp001LocalizedReviewBankV3FromCanonical,
  localizeRnkCp001PermanentQuestionV3,
  repairRnkCp001BoundaryOrdinalCorruption,
} from './cp001-localization-review-v3';

const SEEDS_PER_QL = 128;
const hiV1 = buildRnkCp001LocalizedReviewBank('hi-IN', SEEDS_PER_QL);
const paV1 = buildRnkCp001LocalizedReviewBank('pa-IN', SEEDS_PER_QL);
const hiV2 = buildRnkCp001LocalizedReviewBankV2('hi-IN', SEEDS_PER_QL);
const paV2 = buildRnkCp001LocalizedReviewBankV2('pa-IN', SEEDS_PER_QL);
const hi = buildRnkCp001LocalizedReviewBankV3('hi-IN', SEEDS_PER_QL);
const pa = buildRnkCp001LocalizedReviewBankV3('pa-IN', SEEDS_PER_QL);

assert.equal(hi.length, 1_152);
assert.equal(pa.length, 1_152);
assert.deepEqual(hi, buildRnkCp001LocalizedReviewBankV3FromCanonical('hi-IN', SEEDS_PER_QL));
assert.deepEqual(pa, buildRnkCp001LocalizedReviewBankV3FromCanonical('pa-IN', SEEDS_PER_QL));

assert.equal(
  repairRnkCp001BoundaryOrdinalCorruption('1पहले स्थान पर 1दूसरे स्थान पर 1तीसरे स्थान पर 1चौथे स्थान पर', 'hi-IN'),
  '11वें स्थान पर 12वें स्थान पर 13वें स्थान पर 14वें स्थान पर',
);
assert.equal(
  repairRnkCp001BoundaryOrdinalCorruption("2ਪਹਿਲੇ ਸਥਾਨ 'ਤੇ 2ਦੂਜੇ ਸਥਾਨ 'ਤੇ 2ਤੀਜੇ ਸਥਾਨ 'ਤੇ 2ਚੌਥੇ ਸਥਾਨ 'ਤੇ", 'pa-IN'),
  "21ਵੇਂ ਸਥਾਨ 'ਤੇ 22ਵੇਂ ਸਥਾਨ 'ਤੇ 23ਵੇਂ ਸਥਾਨ 'ਤੇ 24ਵੇਂ ਸਥਾਨ 'ਤੇ",
);

const malformedHindi = /\d+(?:पहले|दूसरे|तीसरे|चौथे) स्थान/u;
const malformedPunjabi = /\d+(?:ਪਹਿਲੇ|ਦੂਜੇ|ਤੀਜੇ|ਚੌਥੇ) ਸਥਾਨ/u;
const nativeHindi = new Map<number, string>([[1, 'पहले स्थान पर'], [2, 'दूसरे स्थान पर'], [3, 'तीसरे स्थान पर'], [4, 'चौथे स्थान पर']]);
const nativePunjabi = new Map<number, string>([[1, "ਪਹਿਲੇ ਸਥਾਨ 'ਤੇ"], [2, "ਦੂਜੇ ਸਥਾਨ 'ਤੇ"], [3, "ਤੀਜੇ ਸਥਾਨ 'ਤੇ"], [4, "ਚੌਥੇ ਸਥਾਨ 'ਤੇ"]]);
let repairedHindi = 0;
let repairedPunjabi = 0;

function ordinalValues(stem: string, locale: 'hi-IN' | 'pa-IN'): number[] {
  const regex = locale === 'hi-IN' ? /(\d+)वें स्थान पर/gu : /(\d+)ਵੇਂ ਸਥਾਨ 'ਤੇ/gu;
  return [...stem.matchAll(regex)].map((match) => Number(match[1]));
}

for (let qlIndex = 0; qlIndex < RNK_CP001_PERMANENT_QL_IDS.length; qlIndex += 1) {
  const qlId = RNK_CP001_PERMANENT_QL_IDS[qlIndex]!;
  for (let seed = 0; seed < SEEDS_PER_QL; seed += 1) {
    const index = qlIndex * SEEDS_PER_QL + seed;
    const canonical = generateRnkCp001PermanentQuestion(qlId, seed);
    const h1 = hiV1[index]!;
    const p1 = paV1[index]!;
    const h2 = hiV2[index]!;
    const p2 = paV2[index]!;
    const h3 = hi[index]!;
    const p3 = pa[index]!;

    assert.deepEqual(h3, localizeRnkCp001PermanentQuestionV3(canonical, 'hi-IN'));
    assert.deepEqual(p3, localizeRnkCp001PermanentQuestionV3(canonical, 'pa-IN'));

    for (const [before, after] of [[h2, h3], [p2, p3]] as const) {
      assert.deepEqual(after.state, before.state);
      assert.deepEqual(after.displayedEvidence, before.displayedEvidence);
      assert.deepEqual(after.options, before.options);
      assert.equal(after.answer, before.answer);
      assert.equal(after.correctIndex, before.correctIndex);
      assert.equal(after.mathematicalFingerprint, before.mathematicalFingerprint);
      assert.deepEqual(after.explanation, before.explanation);
      assert.equal(after.localizationProof.canonicalSemanticFingerprint, before.localizationProof.canonicalSemanticFingerprint);
      assert.equal(after.reviewMetadata.localization.version, RNK_CP001_LOCALIZATION_REVIEW_V3_VERSION);
      assert.equal(after.reviewMetadata.localization.editorialVersion, RNK_CP001_LOCALIZATION_REVIEW_V3_EDITORIAL);
      assert.equal(after.localizationProof.authority, RNK_CP001_LOCALIZATION_REVIEW_V3_AUTHORITY);
      assert.equal(after.localizationProof.editorialVersion, RNK_CP001_LOCALIZATION_REVIEW_V3_EDITORIAL);
      assert.equal(after.localizationProof.multilingualFreezeGranted, false);
      assert.equal(after.lifecycle.hindiPunjabi, 'REVIEW_CANDIDATE');
      assert.equal(after.lifecycle.publiclyPublishable, false);
      assert.equal(after.lifecycle.productDeliveryUnlocked, false);
    }

    assert.equal(malformedHindi.test(h3.stem), false, h3.stem);
    assert.equal(malformedPunjabi.test(p3.stem), false, p3.stem);

    for (const value of ordinalValues(h1.stem, 'hi-IN')) {
      if (value <= 4) assert.ok(h3.stem.includes(nativeHindi.get(value)!), h3.stem);
      else assert.ok(h3.stem.includes(`${value}वें स्थान पर`), `${value}: ${h3.stem}`);
    }
    for (const value of ordinalValues(p1.stem, 'pa-IN')) {
      if (value <= 4) assert.ok(p3.stem.includes(nativePunjabi.get(value)!), p3.stem);
      else assert.ok(p3.stem.includes(`${value}ਵੇਂ ਸਥਾਨ 'ਤੇ`), `${value}: ${p3.stem}`);
    }

    if (h3.stem !== h2.stem) repairedHindi += 1;
    if (p3.stem !== p2.stem) repairedPunjabi += 1;
  }
}

assert.ok(repairedHindi > 0, 'V3 must repair V2 Hindi substring-corruption cases');
assert.ok(repairedPunjabi > 0, 'V3 must repair V2 Punjabi substring-corruption cases');
assert.equal(repairedHindi, repairedPunjabi);
assert.equal(JSON.stringify({ hi, pa }).includes('RNK-QL-043'), false);

console.log(JSON.stringify({
  status: 'PASS',
  version: RNK_CP001_LOCALIZATION_REVIEW_V3_VERSION,
  editorialVersion: RNK_CP001_LOCALIZATION_REVIEW_V3_EDITORIAL,
  authority: RNK_CP001_LOCALIZATION_REVIEW_V3_AUTHORITY,
  hindiReviewCandidates: hi.length,
  punjabiReviewCandidates: pa.length,
  repairedHindi,
  repairedPunjabi,
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
}, null, 2));
