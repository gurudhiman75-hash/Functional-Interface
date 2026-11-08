import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applyReviewResultsToRuns, useQuestionStudio, useQuestionStudioReviewPage } from './useQuestionStudio';
import { getQuestionStudioCapabilities, getQuestionStudioReviewPage, reviseGenerationItem, updateGenerationItems } from './api';

vi.mock('./api', () => ({
  getQuestionStudioCapabilities: vi.fn(), getQuestionStudioReviewPage: vi.fn(),
  reviseGenerationItem: vi.fn(), updateGenerationItems: vi.fn(), createGenerationRun: vi.fn(),
}));
const emptyPage = (search: string) => ({ runs: [], duplicateMatches: [], pagination: { page: 1, pageSize: 20, totalRuns: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false }, filters: { subject: null, chapter: null, packageId: null, status: null, search }, generatedAt: '' });
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getQuestionStudioCapabilities).mockResolvedValue({ generationSystem: 'quant-v4', packages: [], difficulties: ['Easy'], languages: ['en', 'hi', 'pa'], maxBatchSize: 50 });
});

describe('review queue refresh', () => {
  it('ignores an old filter response that arrives after the new response', async () => {
    const old = deferred<ReturnType<typeof emptyPage>>();
    vi.mocked(getQuestionStudioReviewPage).mockReturnValueOnce(old.promise).mockResolvedValueOnce(emptyPage('new'));
    const { result, rerender } = renderHook(({ search }) => useQuestionStudioReviewPage({ search }), { initialProps: { search: 'old' } });
    rerender({ search: 'new' });
    await waitFor(() => expect(result.current.reviewPage.filters.search).toBe('new'));
    await act(async () => old.resolve(emptyPage('old')));
    expect(result.current.reviewPage.filters.search).toBe('new');
    expect(result.current.loadingReviewPage).toBe(false);
  });

  it('uses the latest filters even when refresh was captured before a save', async () => {
    vi.mocked(getQuestionStudioReviewPage).mockImplementation(async (query) => emptyPage(query?.search ?? ''));
    const { result, rerender } = renderHook(({ search }) => useQuestionStudioReviewPage({ search }), { initialProps: { search: 'old' } });
    await waitFor(() => expect(result.current.loadingReviewPage).toBe(false));
    const refreshAtSaveStart = result.current.refreshReviewPage;
    rerender({ search: 'new' });
    await waitFor(() => expect(result.current.reviewPage.filters.search).toBe('new'));
    await act(async () => { await refreshAtSaveStart(); });
    expect(getQuestionStudioReviewPage).toHaveBeenLastCalledWith(expect.objectContaining({ search: 'new' }));
    expect(result.current.reviewPage.filters.search).toBe('new');
  });

  it('keeps the current page available while a refresh is pending', async () => {
    const next = deferred<ReturnType<typeof emptyPage>>();
    vi.mocked(getQuestionStudioReviewPage).mockResolvedValueOnce(emptyPage('saved')).mockReturnValueOnce(next.promise);
    const { result } = renderHook(() => useQuestionStudioReviewPage({}));
    await waitFor(() => expect(result.current.loadingReviewPage).toBe(false));
    let refresh!: Promise<void>;
    act(() => { refresh = result.current.refreshReviewPage(); });
    expect(result.current.reviewPage.filters.search).toBe('saved');
    await act(async () => { next.resolve(emptyPage('updated')); await refresh; });
    expect(result.current.reviewPage.filters.search).toBe('updated');
  });
});

describe('review mutations', () => {
  it('does not reload capabilities after saving a revision or status', async () => {
    vi.mocked(reviseGenerationItem).mockResolvedValue({ kind: 'updated', item: { id: 'item', generationRunId: 'run', itemNumber: 1, currentVersionNumber: 2, status: 'unreviewed', versionId: 'v2', payload: {} }, quality: {} } as Awaited<ReturnType<typeof reviseGenerationItem>>);
    vi.mocked(updateGenerationItems).mockResolvedValue({ items: [], updatedCount: 1, converted: [], convertedCount: 0, reviewOnlyApprovedCount: 1 });
    const { result } = renderHook(() => useQuestionStudio());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.reviseItem({ itemId: 'item', expectedVersionNumber: 1, stem: 'Question', explanation: 'Explanation', options: ['A', 'B'], correctIndex: 0, changeReason: 'Correction' });
      await result.current.updateItems({ itemIds: ['item'], expectedStatuses: { item: 'unreviewed' }, status: 'approved' });
    });
    expect(getQuestionStudioCapabilities).toHaveBeenCalledTimes(1);
  });
});

describe('in-place review updates', () => {
  it('updates only committed items and preserves unchanged sibling questions', () => {
    const run = {
      id: 'run-a',
      reviewSummary: { total: 2, unreviewed: 2, needsFix: 0, approved: 0, rejected: 0 },
      items: [
        { id: 'a', status: 'unreviewed', acceptedQuestionId: null, acceptedQuestionVersionId: null },
        { id: 'b', status: 'unreviewed', acceptedQuestionId: null, acceptedQuestionVersionId: null },
      ],
    } as unknown as Parameters<typeof applyReviewResultsToRuns>[0][number];
    const output = applyReviewResultsToRuns([run], [{
      id: 'a', generationRunId: 'run-a', status: 'approved', conversionSkippedReason: null,
      convertedQuestion: { questionId: 'bank-a', questionVersionId: 'version-a' },
    }]);
    expect(output[0].items[0]).toMatchObject({
      id: 'a', status: 'approved', acceptedQuestionId: 'bank-a',
    });
    expect(output[0].items[1]).toBe(run.items[1]);
    expect(output[0].reviewSummary).toEqual({
      total: 2, unreviewed: 1, needsFix: 0, approved: 1, rejected: 0,
    });
  });

  it('never updates an item absent from the confirmed response', () => {
    const run = {
      id: 'run-a',
      reviewSummary: { total: 1, unreviewed: 1, needsFix: 0, approved: 0, rejected: 0 },
      items: [{ id: 'a', status: 'unreviewed', acceptedQuestionId: null, acceptedQuestionVersionId: null }],
    } as unknown as Parameters<typeof applyReviewResultsToRuns>[0][number];
    expect(applyReviewResultsToRuns([run], [{
      id: 'not-committed', generationRunId: 'run-a', status: 'rejected',
      conversionSkippedReason: null, convertedQuestion: null,
    }])[0]).toEqual(run);
  });
});
