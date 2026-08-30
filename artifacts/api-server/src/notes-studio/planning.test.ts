import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MAX_NOTE_JOB_CREATION_BATCH,
  MAX_NOTE_PLAN_ITEMS,
  boundedPlanningJobLimit,
  buildPlannedJobBrief,
  normalizePlanningUnitTypes,
  selectPlanningCandidates,
} from './planning';

test('planning unit types default to exam-note units and reject unrelated taxonomy types', () => {
  assert.deepEqual(normalizePlanningUnitTypes(undefined), ['topic', 'subtopic', 'chapter']);
  assert.deepEqual(normalizePlanningUnitTypes(['topic', 'skill', 'chapter', 'topic']), ['topic', 'chapter']);
});

test('leaf-only planning keeps the deepest selected syllabus units', () => {
  const selected = selectPlanningCandidates([
    { id: 'topic', code: 'T', nodeType: 'topic', name: 'Topic', description: null, depth: 1, path: ['root', 'topic'], targetCoverage: 40 },
    { id: 'sub-a', code: 'SA', nodeType: 'subtopic', name: 'Sub A', description: null, depth: 2, path: ['root', 'topic', 'sub-a'], targetCoverage: 20 },
    { id: 'sub-b', code: 'SB', nodeType: 'subtopic', name: 'Sub B', description: null, depth: 2, path: ['root', 'topic', 'sub-b'], targetCoverage: 20 },
  ], { leafOnly: true });
  assert.deepEqual(selected.map((item) => item.id), ['sub-a', 'sub-b']);
});

test('planning selection is bounded and job creation limits cannot exceed the operational cap', () => {
  const candidates = Array.from({ length: MAX_NOTE_PLAN_ITEMS + 20 }, (_, index) => ({
    id: String(index),
    code: `N-${index}`,
    nodeType: 'topic',
    name: `Node ${index}`,
    description: null,
    depth: 1,
    path: ['root', String(index)],
    targetCoverage: 1,
  }));
  assert.equal(selectPlanningCandidates(candidates, { leafOnly: false }).length, MAX_NOTE_PLAN_ITEMS);
  assert.equal(boundedPlanningJobLimit(10_000), MAX_NOTE_JOB_CREATION_BATCH);
  assert.equal(boundedPlanningJobLimit(0), 1);
});

test('planned jobs start with taxonomy provenance and no downstream automation flags', () => {
  const brief = buildPlannedJobBrief({
    taxonomyNodeId: 'node-id',
    taxonomyCode: 'GK-001',
    taxonomyName: 'Indian Geography',
    targetCoverage: 30,
    batchId: 'batch-id',
    itemId: 'item-id',
    batchTitle: 'SSC Static GK',
    examId: 'exam-id',
    depth: 'standard',
    learnerLevel: 'standard',
  });
  assert.equal(brief.taxonomyNodeId, 'node-id');
  assert.equal(brief.planningBatchId, 'batch-id');
  assert.deepEqual(brief.examIds, ['exam-id']);
  assert.equal(brief.authoringPolicyVersion, 'notes-v1');
  assert.equal('automaticGeneration' in brief, false);
  assert.equal('automaticPublication' in brief, false);
});
