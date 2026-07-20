import { describe, expect, it } from 'vitest';

import type { ContentReviewItem } from '@/features/content-review/api';
import { changedReviewFields } from '@/features/content-review/item-model';
import {
  DEFAULT_REVIEW_FILTERS,
  filterContentReviewItems,
  parseSavedReviewViews,
  reviewItemAgeBand,
  sortReviewQueue,
} from '@/features/content-review/queue-model';

function generatedItem(overrides: Partial<ContentReviewItem> = {}): ContentReviewItem {
  return {
    key: 'generation_item:11111111-1111-4111-8111-111111111111',
    entityType: 'generation_item',
    entityId: '11111111-1111-4111-8111-111111111111',
    source: 'Question Studio',
    publicCode: 'GEN-TEST',
    status: 'unreviewed',
    versionNumber: 2,
    physicalReviewerUserId: null,
    retryReason: null,
    createdAt: '2026-07-15T00:00:00.000Z',
    updatedAt: '2026-07-19T00:00:00.000Z',
    dueAt: null,
    requestSnapshot: { exam: 'SSC CGL' },
    versionId: '22222222-2222-4222-8222-222222222222',
    currentPayload: {
      stem: 'A number increases by 20 percent to become 360. Find the original number.',
      explanation: 'Let the original number be x. Then 1.2x = 360, so x = 300.',
      options: ['280', '300', '320', '340'],
      correctIndex: 1,
      topic: 'Arithmetic',
      subtopic: 'Percentage',
    },
    previousVersionId: '33333333-3333-4333-8333-333333333333',
    previousVersionNumber: 1,
    previousPayload: {
      stem: 'Find the original number when it becomes 360 after a 20 percent increase.',
      explanation: 'Use the percentage relation.',
      options: ['280', '300', '320', '340'],
      correctIndex: 1,
    },
    collaboration: {
      assignment: {
        reviewerUserId: null,
        reviewerName: null,
        assignedAt: null,
        assignedByUserId: null,
        assignedByName: null,
        reason: null,
      },
      comments: [],
      openCommentCount: 0,
    },
    ...overrides,
  } as ContentReviewItem;
}

describe('Content Review queue model', () => {
  it('classifies review age and prioritises overdue work', () => {
    const now = new Date('2026-07-20T12:00:00.000Z').getTime();
    const fresh = generatedItem({ key: 'fresh', updatedAt: '2026-07-20T10:00:00.000Z' });
    const overdue = generatedItem({ key: 'overdue', updatedAt: '2026-07-15T10:00:00.000Z' });

    expect(reviewItemAgeBand(fresh, now)).toBe('fresh');
    expect(reviewItemAgeBand(overdue, now)).toBe('overdue');
    expect(sortReviewQueue([fresh, overdue], now)[0]?.key).toBe('overdue');
  });

  it('filters by ownership and open comments', () => {
    const mine = generatedItem({
      key: 'mine',
      collaboration: {
        assignment: {
          reviewerUserId: 'user-1',
          reviewerName: 'Reviewer',
          assignedAt: null,
          assignedByUserId: null,
          assignedByName: null,
          reason: null,
        },
        comments: [],
        openCommentCount: 1,
      },
    });
    const other = generatedItem({ key: 'other' });
    const result = filterContentReviewItems(
      [mine, other],
      { ...DEFAULT_REVIEW_FILTERS, assignment: 'mine', openCommentsOnly: true },
      'user-1',
    );
    expect(result.map((item) => item.key)).toEqual(['mine']);
  });

  it('detects fields changed between immutable versions', () => {
    expect(changedReviewFields(generatedItem())).toEqual(expect.arrayContaining(['Stem', 'Explanation']));
  });

  it('ignores malformed saved views', () => {
    const parsed = parseSavedReviewViews(JSON.stringify([
      { id: 'valid', name: 'My overdue queue', filters: { age: 'overdue' } },
      { id: '', name: 'Invalid', filters: {} },
    ]));
    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.filters.age).toBe('overdue');
  });
});
