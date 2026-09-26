import assert from 'node:assert/strict';

import {
  RNK_OPTION_DELIVERY_CAPABILITY,
  auditRnkExamModeMix,
  rnkChapterPracticeAllows,
  rnkExamRealismTier,
} from './rnk-001-exam-delivery-policy-v1';

assert.equal(rnkExamRealismTier('RNK-QL-001'), 'CORE');
assert.equal(rnkExamRealismTier('RNK-QL-026'), 'CORE');
assert.equal(rnkExamRealismTier('RNK-QL-027'), 'SECONDARY');
assert.equal(rnkExamRealismTier('RNK-QL-035'), 'SECONDARY');
assert.equal(rnkExamRealismTier('RNK-QL-036'), 'ADVANCED');
assert.equal(rnkExamRealismTier('RNK-QL-041'), 'ADVANCED');
assert.equal(rnkExamRealismTier('RNK-QL-042'), 'SOURCE_SPECIFIC');

const allQls = Array.from({ length: 42 }, (_, index) => `RNK-QL-${String(index + 1).padStart(3, '0')}`);
assert.equal(allQls.every(rnkChapterPracticeAllows), true, 'chapter practice must retain all 42 frozen QLs');

const uniformExamMix = auditRnkExamModeMix(allQls);
assert.equal(uniformExamMix.passesExamRealismGuard, false, 'uniform 42-QL sampling must not be accepted as exam-real delivery');
assert.ok(uniformExamMix.violations.includes('CORE_SHARE_TOO_LOW'));
assert.ok(uniformExamMix.violations.includes('ADVANCED_SHARE_TOO_HIGH'));

const representativeExamMix = auditRnkExamModeMix([
  ...Array.from({ length: 75 }, (_, index) => `RNK-QL-${String((index % 26) + 1).padStart(3, '0')}`),
  ...Array.from({ length: 20 }, (_, index) => `RNK-QL-${String((index % 9) + 27).padStart(3, '0')}`),
  ...Array.from({ length: 4 }, (_, index) => `RNK-QL-${String((index % 6) + 36).padStart(3, '0')}`),
  'RNK-QL-042',
]);
assert.equal(representativeExamMix.passesExamRealismGuard, true);

assert.equal(RNK_OPTION_DELIVERY_CAPABILITY.SSC.preferredOptionCount, 4);
assert.equal(RNK_OPTION_DELIVERY_CAPABILITY.PUNJAB_STATE.preferredOptionCount, 4);
assert.equal(RNK_OPTION_DELIVERY_CAPABILITY.BANKING.preferredOptionCount, 5);
assert.deepEqual(RNK_OPTION_DELIVERY_CAPABILITY.BANKING.supportedOptionCounts, [4, 5]);

console.log(JSON.stringify({
  status: 'PASS',
  uniformExamMix,
  representativeExamMix,
  optionDelivery: RNK_OPTION_DELIVERY_CAPABILITY,
}, null, 2));
