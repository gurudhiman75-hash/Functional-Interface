import { describe, expect, it } from 'vitest';

import type { QuestionStudioItem, QuestionStudioRun } from '@/features/question-studio/api';
import {
  buildRegenerationQueue,
  isItemRegeneratable,
} from '@/features/question-studio/regeneration-queue';

function item(
  id: string,
  status: QuestionStudioItem['status'],
  overrides: Partial<QuestionStudioItem> = {},
): QuestionStudioItem {
  return {
    id,
    generationRunId: 'run-1',
    itemNumber: Number(id.replace(/\D/g, '')) || 1,
    status,
    currentVersionNumber: 1,
    retryReason: null,
    reviewerUserId: null,
    acceptedQuestionId: null,
    acceptedQuestionVersionId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versionId: `version-${id}`,
    payload: {
      stem: 'A number is increased by 20 percent and becomes 360. Find the original number.',
      options: ['280', '300', '320', '340'],
      correctIndex: 1,
      explanation: 'Let the original number be x. Then 1.2x equals 360, so x equals 300.',
    },
    ...overrides,
  };
}

function run(items: QuestionStudioItem[]): QuestionStudioRun {
  return {
    id: 'run-1',
    publicCode: 'GEN-TEST',
    status: 'review',
    attemptNumber: 1,
    provider: 'examtree',
    model: 'quant-v4',
    promptTokens: 0,
    completionTokens: 0,
    estimatedCostPaise: 0,
    actualCostPaise: 0,
    budgetLimitPaise: null,
    dueAt: null,
    failureReason: null,
    startedAt: null,
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    requestSnapshot: {},
    recipeVersionId: null,
    items,
  };
}

describe('Question Studio regeneration queue', () => {
  it('surfaces needs-fix and rejected items while leaving clean unreviewed items out', () => {
    const queue = buildRegenerationQueue([run([
      item('item-1', 'needs_fix', { retryReason: 'Incorrect wording' }),
      item('item-2', 'rejected'),
      item('item-3', 'unreviewed'),
    ])]);

    expect(queue).toHaveLength(1);
    expect(queue[0]?.items.map((entry) => entry.item.id)).toEqual(['item-1', 'item-2']);
    expect(queue[0]?.needsFixItemIds).toEqual(['item-1']);
  });

  it('surfaces an unreviewed item when automatic quality checks block approval', () => {
    const blocked = item('item-4', 'unreviewed', {
      payload: {
        stem: 'Find {{value}} percent of the given number.',
        options: ['10', '10', '30', '40'],
        correctIndex: 8,
        explanation: '',
      },
    });

    const queue = buildRegenerationQueue([run([blocked])]);
    expect(queue[0]?.items[0]?.blockerCount).toBeGreaterThan(0);
  });

  it('protects approved and converted items from regeneration', () => {
    expect(isItemRegeneratable(item('item-5', 'approved'))).toBe(false);
    expect(isItemRegeneratable(item('item-6', 'needs_fix', {
      acceptedQuestionId: '22222222-2222-4222-8222-222222222222',
    }))).toBe(false);
  });
});
