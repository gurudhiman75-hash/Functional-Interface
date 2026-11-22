import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/test-builder/api', () => ({ transitionLiveTest: vi.fn() }));

import { transitionLiveTest } from '@/features/test-builder/api';
import {
  canPublish, hasUnpublishedChanges, publishAction, runPublishAction, scheduleAction, statusGroup, statusLabel,
} from '@/features/test-builder/lifecycle';

const v1 = 'v1', v2 = 'v2';

describe('test lifecycle helpers', () => {
  it('folds old QA states into four groups', () => {
    expect(['draft', 'content_ready', 'under_qa', 'needs_fix', 'qa_approved'].map((s) => statusGroup(s as never))).toEqual(Array(5).fill('draft'));
    expect(statusGroup('scheduled')).toBe('scheduled');
    expect(statusGroup('completed')).toBe('live');
    expect(statusGroup('archived')).toBe('archived');
  });

  it('flags a live test whose draft differs from the published version', () => {
    expect(hasUnpublishedChanges({ status: 'live', currentDraftVersionId: v2, publishedVersionId: v1 })).toBe(true);
    expect(hasUnpublishedChanges({ status: 'live', currentDraftVersionId: v1, publishedVersionId: v1 })).toBe(false);
    expect(statusLabel({ status: 'live', currentDraftVersionId: v2, publishedVersionId: v1 })).toBe('Live · unpublished changes');
  });

  it('only offers publish where the server allows it', () => {
    expect(canPublish({ status: 'draft', currentDraftVersionId: v1, publishedVersionId: null })).toBe(true);
    expect(canPublish({ status: 'needs_fix', currentDraftVersionId: v1, publishedVersionId: null })).toBe(false);
    expect(canPublish({ status: 'live', currentDraftVersionId: v1, publishedVersionId: v1 })).toBe(false);
    expect(canPublish({ status: 'live', currentDraftVersionId: v2, publishedVersionId: v1 })).toBe(true);
    expect(publishAction('qa_approved')).toBe('publish');
    expect(publishAction('draft')).toBe('approve-publish');
    expect(scheduleAction('draft')).toBe('approve-schedule');
  });

  it('asks once and retries with acknowledgement when students are mid-attempt', async () => {
    const mock = vi.mocked(transitionLiveTest);
    mock.mockReset();
    mock.mockRejectedValueOnce(Object.assign(new Error('busy'), { code: 'TEST_HAS_ACTIVE_ATTEMPTS', details: { activeAttempts: 3 } }));
    mock.mockResolvedValueOnce({ test: {} } as never);
    const confirm = vi.fn(() => true);
    await runPublishAction('t', 'approve-publish', { expectedCurrentDraftVersionId: v2 }, confirm);
    expect(confirm).toHaveBeenCalledWith(3);
    expect(mock.mock.calls[1][2]).toMatchObject({ acknowledgeActiveAttempts: true });
  });

  it('does not retry when the admin cancels', async () => {
    const mock = vi.mocked(transitionLiveTest);
    mock.mockReset();
    mock.mockRejectedValueOnce(Object.assign(new Error('busy'), { code: 'TEST_HAS_ACTIVE_ATTEMPTS', details: { activeAttempts: 1 } }));
    expect(await runPublishAction('t', 'approve-publish', { expectedCurrentDraftVersionId: v2 }, () => false)).toBeNull();
    expect(mock).toHaveBeenCalledTimes(1);
  });
});
