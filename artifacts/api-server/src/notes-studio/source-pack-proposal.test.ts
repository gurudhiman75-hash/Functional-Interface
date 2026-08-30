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
    candidate({ sourceId: 'weaker', title: 'Weaker', relevanceScore: 50, roleUses: { core_reference: 1 } }),
    candidate({ sourceId: 'stronger', title: 'Stronger', relevanceScore: 100, roleUses: { core_reference: 3 } }),
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
