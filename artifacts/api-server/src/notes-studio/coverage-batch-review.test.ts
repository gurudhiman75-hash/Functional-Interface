import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildCoverageBatchReviewInstruction,
  coverageBatchReviewInputFingerprint,
  validateCoverageBatchReviewOutput,
  type CoverageBatchReviewInput,
} from './coverage-batch-review';

const input: CoverageBatchReviewInput = {
  jobId: 'job-1',
  noteTitle: 'Punjab River System',
  languageCode: 'en',
  claims: [
    { id: 'c1', text: 'Present-day Indian Punjab is crossed by the Sutlej, Ravi and Beas.' },
    { id: 'c2', text: 'Pong Dam is constructed across the Beas.' },
  ],
  coverageItems: [
    {
      id: 'i1',
      title: 'Present-day Indian Punjab — Ravi, Beas and Sutlej',
      syllabusRef: 'Punjab Geography → River System → Present-day Punjab',
      priority: 'required',
      plannedDepth: 'standard',
      examRationale: 'Important distinction from the historic five-river concept.',
      linkedClaimIds: [],
    },
    {
      id: 'i2',
      title: 'Beas — course and significance',
      syllabusRef: 'Punjab Geography → River System → Beas',
      priority: 'required',
      plannedDepth: 'deep',
      examRationale: 'Major Punjab river and important project linkage.',
      linkedClaimIds: [],
    },
  ],
};

test('batch coverage review prompt makes sufficiency stricter than keyword overlap', () => {
  const prompt = buildCoverageBatchReviewInstruction(input);
  assert.match(prompt, /NOT to judge factual truth/i);
  assert.match(prompt, /generic association, shared keyword, or one narrow fact is not sufficient/i);
  assert.match(prompt, /deep target/i);
  assert.match(prompt, /editor explicitly approves sufficient targets/i);
});

test('batch coverage review fingerprint is deterministic', () => {
  assert.equal(coverageBatchReviewInputFingerprint(input), coverageBatchReviewInputFingerprint({ ...input }));
});

test('batch coverage review validates every coverage item exactly once and preserves order', () => {
  const result = validateCoverageBatchReviewOutput({
    reviews: [
      { coverageItemId: 'i2', assessment: 'partial', claimIds: ['c2'], confidence: 0.94, rationale: 'Project fact is relevant but does not cover the full course and significance target.' },
      { coverageItemId: 'i1', assessment: 'sufficient', claimIds: ['c1'], confidence: 0.98, rationale: 'The accepted claim directly states the present-day three-river distinction.' },
    ],
  }, new Set(['c1', 'c2']), ['i1', 'i2']);
  assert.deepEqual(result.reviews.map((review) => review.coverageItemId), ['i1', 'i2']);
  assert.equal(result.reviews[0]?.assessment, 'sufficient');
  assert.equal(result.reviews[1]?.assessment, 'partial');
});

test('batch coverage review rejects sufficient targets without supporting claim IDs', () => {
  assert.throws(() => validateCoverageBatchReviewOutput({
    reviews: [
      { coverageItemId: 'i1', assessment: 'sufficient', claimIds: [], confidence: 0.9, rationale: 'Enough.' },
      { coverageItemId: 'i2', assessment: 'missing', claimIds: [], confidence: 0.9, rationale: 'No accepted claim.' },
    ],
  }, new Set(['c1', 'c2']), ['i1', 'i2']), /requires at least one relevant claim/);
});
