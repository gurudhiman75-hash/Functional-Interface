import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  REASONING_V1_NOVELTY_INVENTORY_V1,
  reasoningNoveltyInventorySummaryV1,
} from '../shared/reasoning-novelty-inventory-v1';

const EXPECTED_TOPIC_DIRECTORIES = [
  'Alphabet-Test',
  'Analogy',
  'Blood-Relations',
  'Calendar',
  'Cause-and-Effect',
  'Classification',
  'Clocks',
  'Coding-Decoding',
  'Course-of-Action',
  'Data-Sufficiency',
  'Direction-Sense',
  'InputOutput',
  'Logic-Puzzles',
  'Mathematical-Operations',
  'Missing-Number',
  'Non-Verbal-Reasoning',
  'Ranking-and-Order',
  'SeatingArrangement',
  'Series',
  'Statement-and-Arguments',
  'Statement-and-Assumption',
  'Statement-and-Conclusion',
  'Statement-and-Inference',
  'Syllogism',
  'Word-Dictionary-Order',
  'Word-Formation',
] as const;

test('novelty inventory covers every Reasoning V1 topic directory exactly once', () => {
  const actual = REASONING_V1_NOVELTY_INVENTORY_V1.map((entry) => entry.topicDirectory);
  assert.equal(actual.length, EXPECTED_TOPIC_DIRECTORIES.length);
  assert.equal(new Set(actual).size, actual.length);
  assert.deepEqual([...actual].sort(), [...EXPECTED_TOPIC_DIRECTORIES].sort());
});

test('only explicitly approved controlled-novel runtime receives current target credit', () => {
  const credited = REASONING_V1_NOVELTY_INVENTORY_V1
    .filter((entry) => entry.countsTowardControlledNovelTargetNow)
    .map((entry) => entry.topicDirectory);
  assert.deepEqual(credited, ['Non-Verbal-Reasoning']);
});

test('RNK and Clock discovery lanes stay uncredited until human review', () => {
  for (const topicDirectory of ['Ranking-and-Order', 'Clocks']) {
    const entry = REASONING_V1_NOVELTY_INVENTORY_V1.find(
      (candidate) => candidate.topicDirectory === topicDirectory,
    );
    assert.ok(entry);
    assert.equal(entry?.status, 'CONTROLLED_NOVEL_DISCOVERY_PENDING_HUMAN_REVIEW');
    assert.equal(entry?.countsTowardControlledNovelTargetNow, false);
  }
});

test('inventory summary is internally consistent', () => {
  const summary = reasoningNoveltyInventorySummaryV1();
  assert.equal(summary.topicCount, EXPECTED_TOPIC_DIRECTORIES.length);
  assert.deepEqual(summary.controlledNovelTargetCreditedTopics, ['Non-Verbal-Reasoning']);
  assert.equal(
    Object.values(summary.byStatus).reduce((sum, value) => sum + Number(value), 0),
    EXPECTED_TOPIC_DIRECTORIES.length,
  );
});
