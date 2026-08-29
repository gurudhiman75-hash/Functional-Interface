import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assembleNoteDraft,
  buildSectionGenerationRequest,
  draftInputHash,
  normalizeGeneratedSectionOutput,
  outlineInputHash,
  planOutlineSections,
  sectionInputHash,
} from './section-synthesis';

test('outline planning is deterministic and bounded', () => {
  const targets = [
    { id: 't0', label: 'Fundamental Rights', sourceKind: 'topic', required: true },
    { id: 't1', label: 'Article 14 and equality', sourceKind: 'syllabus_emphasis', required: true },
    { id: 't2', label: 'Article 19 freedoms', sourceKind: 'syllabus_emphasis', required: true },
    { id: 't3', label: 'Writ jurisdiction', sourceKind: 'manual', required: false },
  ];
  const first = planOutlineSections('Fundamental Rights', targets, 3);
  const second = planOutlineSections('Fundamental Rights', [...targets].reverse(), 3);
  assert.deepEqual(first, second);
  assert.equal(first.length, 3);
  assert.equal(first[0]?.targetIds[0], 't0');
});

test('outline input hash changes with evidence or coverage', () => {
  const base = outlineInputHash({
    jobId: 'j1', evidenceRunId: 'r1',
    targets: [{ id: 't1', label: 'Article 14', sourceKind: 'topic', required: true }],
  });
  const changed = outlineInputHash({
    jobId: 'j1', evidenceRunId: 'r2',
    targets: [{ id: 't1', label: 'Article 14', sourceKind: 'topic', required: true }],
  });
  assert.notEqual(base, changed);
});

test('section prompt contains accepted claim payload but no source-excerpt contract', () => {
  const request = buildSectionGenerationRequest({
    noteTitle: 'Indian Polity',
    sectionTitle: 'Article 14',
    objective: 'Explain equality provisions.',
    targetLabels: ['Article 14 and equality'],
    depth: 'standard',
    learnerLevel: 'standard',
    claims: [{ id: 'claim-1', claimText: 'Article 14 guarantees equality before law.', claimType: 'provision' }],
  });
  assert.match(request.input, /claim-1/);
  assert.match(request.input, /Article 14 guarantees equality/);
  assert.doesNotMatch(request.input, /sourceExcerpt|sourceUri|publisher/i);
  assert.match(request.prompt.system, /ONLY the accepted evidence claims/);
});

test('generated section normalization rejects unsupported evidence ids and headings', () => {
  const good = normalizeGeneratedSectionOutput({
    title: 'Article 14: Equality',
    markdown: 'Equality before law and equal protection of laws are core ideas for revision.\n\n- Focus on the constitutional identifier and the distinction between the two expressions.',
    usedClaimIds: ['claim-1'],
    warnings: [],
  }, ['claim-1']);
  assert.ok(good);

  const unknown = normalizeGeneratedSectionOutput({
    title: 'Article 14: Equality',
    markdown: 'Equality before law and equal protection of laws are core ideas for revision.\n\n- This output is deliberately long enough for validation.',
    usedClaimIds: ['claim-2'],
    warnings: [],
  }, ['claim-1']);
  assert.equal(unknown, null);

  const heading = normalizeGeneratedSectionOutput({
    title: 'Article 14: Equality',
    markdown: '## Article 14\n\nEquality before law and equal protection of laws are core ideas for revision and exam preparation.',
    usedClaimIds: ['claim-1'],
    warnings: [],
  }, ['claim-1']);
  assert.equal(heading, null);
});

test('section input hash is stable across claim order but changes with claim text', () => {
  const baseArgs = {
    jobId: 'j1', sectionId: 's1', evidenceRunId: 'r1', targetIds: ['t1'],
  };
  const first = sectionInputHash({
    ...baseArgs,
    claims: [
      { id: 'c2', claimText: 'Second accepted claim.', claimType: 'fact' },
      { id: 'c1', claimText: 'First accepted claim.', claimType: 'fact' },
    ],
  });
  const reordered = sectionInputHash({
    ...baseArgs,
    claims: [
      { id: 'c1', claimText: 'First accepted claim.', claimType: 'fact' },
      { id: 'c2', claimText: 'Second accepted claim.', claimType: 'fact' },
    ],
  });
  const changed = sectionInputHash({
    ...baseArgs,
    claims: [{ id: 'c1', claimText: 'Changed accepted claim.', claimType: 'fact' }],
  });
  assert.equal(first, reordered);
  assert.notEqual(first, changed);
});

test('deterministic assembly wraps section bodies without source metadata', () => {
  const markdown = assembleNoteDraft({
    noteTitle: 'Fundamental Rights',
    sections: [
      { sectionTitle: 'Article 14', markdown: 'Equality before law is a high-yield constitutional concept for exam revision.' },
      { sectionTitle: 'Article 19', markdown: 'Remember the specified freedoms together with the idea of constitutionally permitted restrictions.' },
    ],
  });
  assert.match(markdown, /^# Fundamental Rights/m);
  assert.match(markdown, /^## Article 14/m);
  assert.match(markdown, /^## Article 19/m);
  assert.doesNotMatch(markdown, /source|publisher|evidence id/i);

  const hash1 = draftInputHash({ jobId: 'j1', outlineVersionId: 'o1', sectionVersions: [{ id: 'v2', outputHash: 'b' }, { id: 'v1', outputHash: 'a' }] });
  const hash2 = draftInputHash({ jobId: 'j1', outlineVersionId: 'o1', sectionVersions: [{ id: 'v1', outputHash: 'a' }, { id: 'v2', outputHash: 'b' }] });
  assert.equal(hash1, hash2);
});
