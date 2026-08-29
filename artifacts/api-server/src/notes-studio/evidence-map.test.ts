import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildEvidenceBlocks,
  coverageStatusFromClaimStates,
  noteClaimFingerprint,
  normalizeEvidenceText,
} from './evidence-map';

test('evidence blocks are deterministic, bounded and locator-bearing', () => {
  const source = [
    'Article 14 guarantees equality before law and equal protection of the laws.',
    'Article 15 prohibits discrimination on specified grounds. Article 16 addresses equality of opportunity in public employment.',
    'A'.repeat(1100),
  ].join('\n\n');
  const first = buildEvidenceBlocks(source, { maxBlockChars: 500 });
  const second = buildEvidenceBlocks(source, { maxBlockChars: 500 });

  assert.deepEqual(first, second);
  assert.ok(first.length >= 4);
  assert.ok(first.every((block) => block.excerpt.length <= 500));
  assert.ok(first.every((block) => block.charEnd > block.charStart));
  assert.ok(first.every((block) => /^[0-9a-f]{64}$/.test(block.excerptHash)));
});

test('evidence normalization preserves learner scripts while normalizing whitespace', () => {
  assert.equal(
    normalizeEvidenceText('  Equality\r\n\r\n  समानता   ਬਰਾਬਰੀ  '),
    'Equality\n\n समानता ਬਰਾਬਰੀ',
  );
});

test('claim fingerprint ignores casing and cosmetic whitespace', () => {
  assert.equal(
    noteClaimFingerprint('Article 14 guarantees equality before law.'),
    noteClaimFingerprint('  ARTICLE 14   guarantees equality before law.  '),
  );
});

test('coverage status is deterministic from editorial claim states', () => {
  assert.equal(coverageStatusFromClaimStates([]), 'uncovered');
  assert.equal(coverageStatusFromClaimStates(['rejected']), 'uncovered');
  assert.equal(coverageStatusFromClaimStates(['candidate']), 'partial');
  assert.equal(coverageStatusFromClaimStates(['candidate', 'accepted']), 'covered');
  assert.equal(coverageStatusFromClaimStates(['accepted', 'conflict']), 'blocked');
});
