import assert from 'node:assert/strict';
import test from 'node:test';

import { buildSourcePackProposal, type SourcePackProposalCandidate } from './source-pack-proposal';
import type { SourcePackRequirementStatus } from './source-pack-policy';

const requirement = (overrides: Partial<SourcePackRequirementStatus> = {}): SourcePackRequirementStatus => ({
  code: 'core_reference',
  label: 'Generation-ready core reference',
  roles: ['core_reference'],
  minCount: 1,
  generationReadyOnly: true,
  currentCount: 0,
  satisfied: false,
  ...overrides,
});

const candidate = (overrides: Partial<SourcePackProposalCandidate> = {}): SourcePackProposalCandidate => ({
  sourceId: 'source-a',
  title: 'Reference A',
  publisher: 'Publisher A',
  generationReady: true,
  relevanceScore: 100,
  relevanceReason: 'Previously used for the same canonical taxonomy node',
  approvedUses: 1,
  roleUses: { core_reference: 2 },
  contentHash: 'a'.repeat(64),
  sourceIdentity: 'publisher:publisher a',
  ...overrides,
});

test('proposal uses prior role evidence and explicit editor apply boundary', () => {
  const result = buildSourcePackProposal([requirement()], [candidate()]);
  assert.equal(result.complete, true);
  assert.equal(result.items[0]?.suggestedRole, 'core_reference');
  assert.equal(result.automaticAttachment, false);
  assert.equal(result.requiresExplicitEditorApply, true);
});

test('generation-ready requirement excludes provenance-only candidate', () => {
  const result = buildSourcePackProposal([requirement()], [candidate({ generationReady: false })]);
  assert.equal(result.complete, false);
  assert.equal(result.items.length, 0);
  assert.equal(result.unresolved[0]?.missingCount, 1);
});

test('candidate without prior use in an allowed role is not reclassified by guesswork', () => {
  const result = buildSourcePackProposal([requirement()], [candidate({ roleUses: { exam_context: 5 } })]);
  assert.equal(result.complete, false);
  assert.equal(result.items.length, 0);
});

test('proposal prefers stronger relevance and past role use', () => {
  const result = buildSourcePackProposal([requirement()], [
    candidate({ sourceId: 'weaker', title: 'Weaker', relevanceScore: 50, roleUses: { core_reference: 1 }, contentHash: 'b'.repeat(64), sourceIdentity: 'publisher:weaker' }),
    candidate({ sourceId: 'stronger', title: 'Stronger', relevanceScore: 100, roleUses: { core_reference: 3 }, contentHash: 'c'.repeat(64), sourceIdentity: 'publisher:stronger' }),
  ]);
  assert.equal(result.items[0]?.sourceId, 'stronger');
});

test('one source cannot satisfy two missing requirement slots', () => {
  const result = buildSourcePackProposal([
    requirement({ code: 'two_core', minCount: 2 }),
  ], [candidate()]);
  assert.equal(result.items.length, 1);
  assert.equal(result.unresolved[0]?.missingCount, 1);
});

test('integrity-only gap proposes a different publisher and unique content', () => {
  const satisfied = requirement({ currentCount: 2, minCount: 2, satisfied: true });
  const result = buildSourcePackProposal([satisfied], [
    candidate({ sourceId: 'same-publisher', title: 'Same publisher', contentHash: 'b'.repeat(64), sourceIdentity: 'publisher:publisher a', relevanceScore: 200 }),
    candidate({ sourceId: 'independent', title: 'Independent', contentHash: 'c'.repeat(64), sourceIdentity: 'publisher:publisher b', relevanceScore: 100 }),
  ], {
    existingContentHashes: ['a'.repeat(64), 'd'.repeat(64)],
    existingSourceIdentities: ['publisher:publisher a'],
    minUniqueContent: 2,
    minDistinctIdentities: 2,
  });
  assert.equal(result.complete, true);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0]?.sourceId, 'independent');
  assert.equal(result.items[0]?.requirementCode, 'source_integrity');
});

test('duplicate-content candidate cannot resolve unique-content integrity', () => {
  const satisfied = requirement({ currentCount: 1, minCount: 1, satisfied: true });
  const result = buildSourcePackProposal([satisfied], [
    candidate({ sourceId: 'duplicate', contentHash: 'a'.repeat(64), sourceIdentity: 'publisher:b' }),
  ], {
    existingContentHashes: ['a'.repeat(64)],
    existingSourceIdentities: ['publisher:a'],
    minUniqueContent: 2,
    minDistinctIdentities: 1,
  });
  assert.equal(result.complete, false);
  assert.equal(result.items.length, 0);
  assert.equal(result.unresolved[0]?.requirementCode, 'source_integrity_unique_content');
});
