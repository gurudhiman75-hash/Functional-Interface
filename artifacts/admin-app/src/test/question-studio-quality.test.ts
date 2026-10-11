import { describe, expect, it } from 'vitest';

import type { QuestionStudioRun } from '@/features/question-studio/api';
import {
  analyzeItemQuality,
  findDuplicateMatches,
  qualityWithDuplicate,
  itemExplanation,
} from '@/features/question-studio/quality';

describe('authored review explanation presentation', () => {
  it('keeps native calculation steps in their authored order', () => {
    expect(itemExplanation({ explanation: { method: 'गति का अंतर', steps: ['दूरी = 60 किमी', 'समय = 2 घंटे'], finalAnswer: 'गति = 30 किमी/घंटा' } }))
      .toBe('गति का अंतर\nदूरी = 60 किमी\nसमय = 2 घंटे\nगति = 30 किमी/घंटा');
    expect(itemExplanation({ explanation: ['ਦੂਰੀ = 60 ਕਿਮੀ', 'ਸਮਾਂ = 2 ਘੰਟੇ', 'ਰਫ਼ਤਾਰ = 30 ਕਿਮੀ/ਘੰਟਾ'] }))
      .toBe('ਦੂਰੀ = 60 ਕਿਮੀ\nਸਮਾਂ = 2 ਘੰਟੇ\nਰਫ਼ਤਾਰ = 30 ਕਿਮੀ/ਘੰਟਾ');
  });
  it('keeps legacy strings and uses an authored conclusion once', () => {
    expect(itemExplanation({ explanation: '  Distance / time = speed.  ' })).toBe('Distance / time = speed.');
    expect(itemExplanation({ explanation: { steps: ['A calculation'], conclusion: 'Final result', finalAnswer: 'Final result' } }))
      .toBe('A calculation\nFinal result');
  });
  it('rejects malformed objects without exposing serialized payloads', () => {
    expect(itemExplanation({ explanation: { steps: [{ secret: 'not learner text' }], method: 12 } })).toBe('');
    expect(itemExplanation({ explanation: [{ invalid: true }, null, 'Valid authored step'] })).toBe('Valid authored step');
  });
});

function runWithStems(...stems: string[]): QuestionStudioRun {
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
    reviewSummary: {
      total: stems.length,
      unreviewed: stems.length,
      needsFix: 0,
      approved: 0,
      rejected: 0,
    },
    items: stems.map((stem, index) => ({
      id: `item-${index + 1}`,
      generationRunId: 'run-1',
      itemNumber: index + 1,
      status: 'unreviewed',
      currentVersionNumber: 1,
      retryReason: null,
      reviewerUserId: null,
      acceptedQuestionId: null,
      acceptedQuestionVersionId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versionId: `version-${index + 1}`,
      payload: {
        stem,
        options: ['100', '120', '140', '160'],
        correctIndex: 1,
        explanation: 'Let the original value be x and solve the percentage equation step by step.',
      },
    })),
  };
}

describe('Question Studio quality analysis', () => {
  it('marks complete questions as approval ready', () => {
    const report = analyzeItemQuality({
      stem: 'A number increases by 20% to become 360. Find its original value.',
      options: ['280', '300', '320', '340'],
      correctIndex: 1,
      explanation: 'Let the original number be x. Then 1.2x = 360, which gives x = 300.',
    });

    expect(report.readyForApproval).toBe(true);
    expect(report.blockerCount).toBe(0);
  });

  it('detects exact duplicate stems and turns them into approval blockers', () => {
    const run = runWithStems(
      'A shopkeeper increases the price by 25 percent. Find the new price when the old price is 400.',
      'A shopkeeper increases the price by 25 percent. Find the new price when the old price is 400.',
    );
    const matches = findDuplicateMatches([run]);
    const duplicate = matches.get('item-1');

    expect(duplicate?.exact).toBe(true);
    const report = qualityWithDuplicate(run.items[0]!, duplicate);
    expect(report.readyForApproval).toBe(false);
    expect(report.issues.some((issue) => issue.code === 'EXACT_DUPLICATE')).toBe(true);
  });

  it('flags near-duplicate exam stems without making them hard blockers', () => {
    const run = runWithStems(
      'A salary is increased by 20 percent and then decreased by 10 percent. Find the net percentage change in salary.',
      'A salary is increased by 20 percent and afterward decreased by 10 percent. Find the net percentage change in salary.',
    );
    const matches = findDuplicateMatches([run]);
    const duplicate = matches.get('item-1');

    expect(duplicate).toBeDefined();
    expect(duplicate?.exact).toBe(false);
    const report = qualityWithDuplicate(run.items[0]!, duplicate);
    expect(report.warningCount).toBeGreaterThan(0);
  });
});
