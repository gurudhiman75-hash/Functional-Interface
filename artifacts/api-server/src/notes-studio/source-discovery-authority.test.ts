import assert from 'node:assert/strict';
import test from 'node:test';

import {
  rankDiscoveredSourceMetadata,
  rankDiscoveredSourceUrls,
  sourceDiscoveryAnchorTerms,
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
  assert.equal(sourceDiscoveryLowPriority('flipkart.com'), true);
  assert.equal(sourceDiscoveryLowPriority('linkedin.com'), true);
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

test('relevance-aware discovery rejects authoritative but off-topic pages from the live Punjab pilot pattern', () => {
  const focus = 'Present-day Punjab river system Ravi Beas Sutlej tributaries confluences dams barrages canals drainage basin';
  assert.deepEqual(sourceDiscoveryAnchorTerms(focus).slice(0, 6), [
    'punjab',
    'river',
    'system',
    'ravi',
    'beas',
    'sutlej',
  ]);

  const ranked = rankDiscoveredSourceMetadata([
    { url: 'https://appsc.gov.in/Index/common_sub_page/doc41138/Previous_Year_Questions', title: 'Previous Year Questions' },
    { url: 'https://foundation.rajasthan.gov.in/Geography.aspx', title: 'Geography of Rajasthan' },
    { url: 'https://gurdaspur.nic.in/', title: 'District Gurdaspur' },
    { url: 'https://www.haryana.gov.in/geography', title: 'Geography of Haryana' },
    { url: 'https://www.ikp.serp.ap.gov.in/latest/rajasthan-gk-with-tricks-0.html', title: 'Rajasthan GK with tricks' },
    { url: 'https://www.flipkart.com/gk-gs-punjab-book/p/itm123', title: 'Punjab GK book' },
    { url: 'https://punjab.gov.in/know-punjab/', title: 'Know Punjab' },
    { url: 'https://cwc.gov.in/ravi-beas-basin', title: 'Ravi Beas river basin' },
  ], focus);

  assert.deepEqual(ranked.map((candidate) => candidate.domain), [
    'cwc.gov.in',
    'punjab.gov.in',
  ]);
  assert.equal(ranked[0]?.score, 120);
  assert.equal(ranked[1]?.score, 105);
});
