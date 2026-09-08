import assert from 'node:assert/strict';
import test from 'node:test';

import { splitRangeForStructuredRetry } from './resumable-pdf-extraction';

test('adaptive structured retry splits a 12-page durable checkpoint into 6-page halves', () => {
  assert.deepEqual(splitRangeForStructuredRetry(289, 300, 3), [
    { startPage: 289, endPage: 294 },
    { startPage: 295, endPage: 300 },
  ]);
});

test('adaptive structured retry splits a failed 6-page half into 3-page groups', () => {
  assert.deepEqual(splitRangeForStructuredRetry(289, 294, 3), [
    { startPage: 289, endPage: 291 },
    { startPage: 292, endPage: 294 },
  ]);
});

test('adaptive structured retry stops at the minimum page group', () => {
  assert.equal(splitRangeForStructuredRetry(289, 291, 3), null);
  assert.equal(splitRangeForStructuredRetry(289, 289, 3), null);
});

test('adaptive structured retry keeps every page exactly once for odd ranges', () => {
  assert.deepEqual(splitRangeForStructuredRetry(1, 5, 1), [
    { startPage: 1, endPage: 3 },
    { startPage: 4, endPage: 5 },
  ]);
});
