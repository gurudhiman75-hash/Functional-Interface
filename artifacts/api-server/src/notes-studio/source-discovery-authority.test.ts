import assert from 'node:assert/strict';
import test from 'node:test';

import {
  rankDiscoveredSourceUrls,
  sourceDiscoveryAuthorityClass,
  sourceDiscoveryLowPriority,
} from './source-discovery';

test('source discovery treats generic .org and coaching/content hosts as non-institutional', () => {
  assert.equal(sourceDiscoveryAuthorityClass('cwc.gov.in'), 'government_primary');
  assert.equal(sourceDiscoveryAuthorityClass('example.ac.in'), 'institutional_reference');
  assert.equal(sourceDiscoveryAuthorityClass('example.edu'), 'institutional_reference');
  assert.equal(sourceDiscoveryAuthorityClass('unesco.org'), 'institutional_reference');
  assert.equal(sourceDiscoveryAuthorityClass('wikipedia.org'), 'web_reference');
  assert.equal(sourceDiscoveryAuthorityClass('random-nonprofit.org'), 'web_reference');
  assert.equal(sourceDiscoveryAuthorityClass('testbook.com'), 'web_reference');

  assert.equal(sourceDiscoveryLowPriority('wikipedia.org'), true);
  assert.equal(sourceDiscoveryLowPriority('en.wikipedia.org'), true);
  assert.equal(sourceDiscoveryLowPriority('testbook.com'), true);
  assert.equal(sourceDiscoveryLowPriority('youtube.com'), true);
  assert.equal(sourceDiscoveryLowPriority('britannica.com'), false);
});

test('source discovery ranks primary and academic sources ahead of general and low-priority references', () => {
  const ranked = rankDiscoveredSourceUrls([
    'https://testbook.com/punjab-gk/rivers-of-punjab',
    'https://en.wikipedia.org/wiki/Punjab,_India',
    'https://britannica.com/place/Punjab-state-India',
    'https://example.ac.in/punjab-river-study',
    'https://cwc.gov.in/en/ibo/about-basins',
    'https://punjab.gov.in/know-punjab/',
  ]);

  assert.deepEqual(ranked.map((candidate) => [candidate.domain, candidate.authorityClass, candidate.score]), [
    ['cwc.gov.in', 'government_primary', 100],
    ['punjab.gov.in', 'government_primary', 100],
    ['example.ac.in', 'institutional_reference', 70],
    ['britannica.com', 'web_reference', 40],
    ['en.wikipedia.org', 'web_reference', 10],
    ['testbook.com', 'web_reference', 10],
  ]);
});
