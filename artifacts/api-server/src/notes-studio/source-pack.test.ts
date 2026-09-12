import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assertPublicHttpsUrl,
  canSourceSupportGeneration,
  extractReadableWebText,
  extractWebTitle,
  noteSourceContentHash,
  referenceOnlyUrlContentHash,
  retentionModeForRights,
  sourcePreview,
} from './source-pack';

test('rights policy retains text only for an authorized basis', () => {
  assert.equal(retentionModeForRights('user_supplied'), 'extracted_text');
  assert.equal(retentionModeForRights('licensed'), 'extracted_text');
  assert.equal(retentionModeForRights('public_domain'), 'extracted_text');
  assert.equal(retentionModeForRights('publisher_authorized'), 'extracted_text');
  assert.equal(retentionModeForRights('reference_only'), 'metadata_only');
});

test('public HTTPS validation rejects private-network URLs', () => {
  assert.equal(assertPublicHttpsUrl('https://example.com/a#fragment'), 'https://example.com/a');
  assert.throws(() => assertPublicHttpsUrl('http://example.com/a'), /HTTPS/);
  assert.throws(() => assertPublicHttpsUrl('https://127.0.0.1/a'), /private-network/);
  assert.throws(() => assertPublicHttpsUrl('https://192.168.1.2/a'), /private-network/);
});

test('reference-only URL fingerprints are deterministic without fetching publisher text', () => {
  const a = referenceOnlyUrlContentHash('https://example.com/source#section');
  const b = referenceOnlyUrlContentHash('https://example.com/source');
  const c = referenceOnlyUrlContentHash('https://example.com/other');
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.match(a, /^[0-9a-f]{64}$/);
});

test('web extraction removes scripts and preserves readable blocks', () => {
  const html = `<!doctype html><html><head><title>Indian Polity &amp; Constitution</title><style>.x{}</style></head><body><h1>Fundamental Rights</h1><script>alert('bad')</script><p>Article 14 guarantees equality before law.</p><p>Article 19 protects specified freedoms.</p></body></html>`;
  assert.equal(extractWebTitle(html), 'Indian Polity & Constitution');
  const text = extractReadableWebText(html);
  assert.match(text, /Fundamental Rights/);
  assert.match(text, /Article 14 guarantees equality before law/);
  assert.match(text, /Article 19 protects specified freedoms/);
  assert.doesNotMatch(text, /alert/);
  assert.doesNotMatch(text, /\.x/);
});

test('hashing and preview are deterministic and bounded', () => {
  assert.equal(noteSourceContentHash('same'), noteSourceContentHash('same'));
  assert.notEqual(noteSourceContentHash('same'), noteSourceContentHash('different'));
  assert.equal(sourcePreview('abcdefghij', 6), 'abcde…');
});

test('only processed retained text can support generation', () => {
  assert.equal(canSourceSupportGeneration({ retentionMode: 'extracted_text', extractionStatus: 'processed', charCount: 1000 }), true);
  assert.equal(canSourceSupportGeneration({ retentionMode: 'metadata_only', extractionStatus: 'metadata_only', charCount: 1000 }), false);
  assert.equal(canSourceSupportGeneration({ retentionMode: 'extracted_text', extractionStatus: 'failed', charCount: 1000 }), false);
  assert.equal(canSourceSupportGeneration({ retentionMode: 'extracted_text', extractionStatus: 'processed', charCount: 50 }), false);
});
