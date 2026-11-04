import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useQuestionStudio, useQuestionStudioReviewPage } from './useQuestionStudio';
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
