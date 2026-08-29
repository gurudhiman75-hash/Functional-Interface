import assert from 'node:assert/strict';
import test from 'node:test';

import {
  coverageScore,
  coverageTargetsFromBrief,
  evidenceClaimKey,
  evidenceRunInputHash,
  extractEvidenceCandidates,
  normalizeEvidenceText,
  shouldMapClaimToCoverage,
} from './evidence-map';

test('evidence normalization and fingerprints are deterministic', () => {
  assert.equal(normalizeEvidenceText('  Article 14 — Equality! '), 'article 14 - equality');
  assert.equal(evidenceClaimKey('Article 14 — Equality!'), evidenceClaimKey('article 14 - equality'));
});

test('extracts bounded source-grounded candidate claims with location metadata', () => {
  const source = `Fundamental Rights are guaranteed in Part III of the Constitution of India. Article 14 guarantees equality before the law and equal protection of the laws.\n\nArticle 19 protects six specified freedoms for citizens, subject to constitutionally permitted reasonable restrictions. The Constitution came into force on 26 January 1950.`;
  const claims = extractEvidenceCandidates(source);
  assert.ok(claims.length >= 3);
  assert.ok(claims.some((claim) => claim.claimType === 'provision' && /Article 14/.test(claim.claimText)));
  assert.ok(claims.some((claim) => claim.claimType === 'date_fact' && /1950/.test(claim.claimText)));
  assert.ok(claims.every((claim) => claim.excerpt.length <= 600));
  assert.ok(claims.every((claim) => claim.location.charEnd >= claim.location.charStart));
});

test('filters obvious web boilerplate rather than making it evidence', () => {
  const source = `Click here to subscribe to our newsletter and read more about everything available on this website.\n\nArticle 32 provides a constitutional remedy for enforcement of Fundamental Rights before the Supreme Court.`;
  const claims = extractEvidenceCandidates(source);
  assert.equal(claims.some((claim) => /subscribe/i.test(claim.claimText)), false);
  assert.equal(claims.some((claim) => /Article 32/.test(claim.claimText)), true);
});

test('coverage targets are seeded from topic and syllabus emphasis without duplicates', () => {
  const targets = coverageTargetsFromBrief({
    topicLabel: 'Fundamental Rights',
    syllabusEmphasis: 'Article 14 and equality; Article 19 freedoms; Writ jurisdiction\nArticle 19 freedoms',
  });
  assert.equal(targets[0]?.label, 'Fundamental Rights');
  assert.equal(targets.filter((target) => target.label === 'Article 19 freedoms').length, 1);
  assert.equal(targets.every((target) => target.required), true);
});

test('coverage mapping requires meaningful target overlap and preserves numeric tokens', () => {
  const exact = shouldMapClaimToCoverage(
    'Article 14 guarantees equality before law and equal protection of laws.',
    'Article 14 and equality',
  );
  assert.equal(exact.map, true);
  assert.ok(exact.score >= 0.42);

  const wrongArticle = shouldMapClaimToCoverage(
    'Article 19 protects specified freedoms of citizens.',
    'Article 14 and equality',
  );
  assert.equal(wrongArticle.map, false);
  assert.ok(coverageScore('Article 19 protects freedoms.', 'Article 14 and equality') < exact.score);
});

test('evidence run input hash is source-order independent but content-sensitive', () => {
  const first = evidenceRunInputHash({
    jobId: 'job-1',
    brief: { topicLabel: 'Polity' },
    extractorVersion: 'notes-evidence-v1',
    sources: [
      { id: 'b', contentHash: '222' },
      { id: 'a', contentHash: '111' },
    ],
  });
  const reordered = evidenceRunInputHash({
    jobId: 'job-1',
    brief: { topicLabel: 'Polity' },
    extractorVersion: 'notes-evidence-v1',
    sources: [
      { id: 'a', contentHash: '111' },
      { id: 'b', contentHash: '222' },
    ],
  });
  const changed = evidenceRunInputHash({
    jobId: 'job-1',
    brief: { topicLabel: 'Polity' },
    extractorVersion: 'notes-evidence-v1',
    sources: [{ id: 'a', contentHash: '999' }],
  });
  assert.equal(first, reordered);
  assert.notEqual(first, changed);
});
