import assert from 'node:assert/strict';
import test from 'node:test';

import { MAX_RESEARCH_QUEUE_JOBS, classifyResearchQueueItem, researchQueueLimit, researchQueueRank } from './research-queue';

test('research queue is operationally bounded', () => {
  assert.equal(researchQueueLimit(undefined), 20);
  assert.equal(researchQueueLimit(0), 1);
  assert.equal(researchQueueLimit(10_000), MAX_RESEARCH_QUEUE_JOBS);
});

test('source-policy ready jobs are ready for evidence', () => {
  assert.equal(classifyResearchQueueItem({ policyReady: true, proposedItems: 0, unresolvedRequirements: 0 }), 'ready_for_evidence');
});

test('complete governed proposal is distinguished from partial proposal', () => {
  assert.equal(classifyResearchQueueItem({ policyReady: false, proposedItems: 2, unresolvedRequirements: 0 }), 'proposal_ready');
  assert.equal(classifyResearchQueueItem({ policyReady: false, proposedItems: 1, unresolvedRequirements: 1 }), 'partial_proposal');
});

test('jobs with no governed proposal require manual research', () => {
  assert.equal(classifyResearchQueueItem({ policyReady: false, proposedItems: 0, unresolvedRequirements: 2 }), 'manual_research_required');
});

test('queue rank prioritizes easy governed unlocks before manual research and already-ready work', () => {
  assert.ok(researchQueueRank('proposal_ready') < researchQueueRank('partial_proposal'));
  assert.ok(researchQueueRank('partial_proposal') < researchQueueRank('manual_research_required'));
  assert.ok(researchQueueRank('manual_research_required') < researchQueueRank('ready_for_evidence'));
});
