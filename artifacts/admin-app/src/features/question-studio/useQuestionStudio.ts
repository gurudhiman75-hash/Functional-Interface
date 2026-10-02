import { useCallback, useEffect, useState } from 'react';
import {
  createGenerationRun,
  getQuestionStudioCapabilities,
  getQuestionStudioReviewPage,
  reviseGenerationItem,
  updateGenerationItems,
  type CreateGenerationRunInput,
  type GenerationItemStatus,
  type QuestionStudioCapabilities,
  type QuestionStudioReviewPage,
  type QuestionStudioReviewQuery,
  type ReviseGenerationItemInput,
} from './api';
import { notifyQuestionStudioRefresh, QUESTION_STUDIO_REFRESH_EVENT } from './events';

const EMPTY_REVIEW_PAGE: QuestionStudioReviewPage = {
  runs: [],
  duplicateMatches: [],
  pagination: {
    page: 1,
    pageSize: 20,
    totalRuns: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  },
  filters: {
    subject: null,
    chapter: null,
    packageId: null,
    status: null,
    search: null,
  },
  generatedAt: '',
};

const EMPTY_CAPABILITIES: QuestionStudioCapabilities = {
  generationSystem: 'quant-v4',
  packages: [],
  difficulties: ['Easy', 'Medium', 'Hard', 'Mixed'],
  languages: ['en'],
  maxBatchSize: 50,
};

function withMixedDifficulty(capabilities: QuestionStudioCapabilities): QuestionStudioCapabilities {
  const difficulties = capabilities.difficulties.includes('Mixed')
    ? capabilities.difficulties
    : [...capabilities.difficulties, 'Mixed'];
  return { ...capabilities, difficulties };
}

type BulkReviewResult = Awaited<ReturnType<typeof updateGenerationItems>> & {
  attempted?: number;
  succeeded?: number;
  failed?: number;
  results?: Array<{
    itemId: string;
    ok: boolean;
    code?: string;
    message?: string;
  }>;
};

/**
 * Shared Question Studio state for all registered generation engines.
 * Standard Quant, Reasoning, English and Static GK packages use the same
 * generation/review cockpit; bespoke panels remain available for engines
 * that expose additional chapter-specific controls.
 */
export function useQuestionStudio() {
  const [capabilities, setCapabilities] = useState<QuestionStudioCapabilities>(EMPTY_CAPABILITIES);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [revisingItemId, setRevisingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nextCapabilities = await getQuestionStudioCapabilities();
      setCapabilities(withMixedDifficulty(nextCapabilities));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Question Studio.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const handleRefresh = () => void refresh();
    window.addEventListener(QUESTION_STUDIO_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(QUESTION_STUDIO_REFRESH_EVENT, handleRefresh);
  }, [refresh]);

  const generate = useCallback(async (input: CreateGenerationRunInput) => {
    setGenerating(true);
    setError(null);
    try {
      const result = await createGenerationRun(input);
      setGenerating(false);
      await refresh();
      notifyQuestionStudioRefresh();
      return result;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Question generation failed.';
      setError(message);
      throw caught;
    } finally {
      setGenerating(false);
    }
  }, [refresh]);

  const updateItems = useCallback(async (input: {
    itemIds: string[];
    status: GenerationItemStatus;
    reason?: string;
  }) => {
    setUpdating(true);
    setError(null);
    try {
      const result = await updateGenerationItems(input) as BulkReviewResult;
      await refresh();

      if (Number(result.failed ?? 0) > 0) {
        const failures = (result.results ?? []).filter((entry) => !entry.ok);
        const first = failures[0];
        const message = `${Number(result.succeeded ?? result.updatedCount)} updated, ${Number(result.failed)} failed. ${first?.itemId ?? 'Item'}: ${first?.message ?? 'Review update failed.'}`;
        const partialError = new Error(message);
        Object.assign(partialError, { code: first?.code ?? 'PARTIAL_BULK_FAILURE', result });
        setError(message);
        throw partialError;
      }

      return result;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unable to update generated items.';
      setError(message);
      throw caught;
    } finally {
      setUpdating(false);
    }
  }, [refresh]);

  const reviseItem = useCallback(async (input: ReviseGenerationItemInput) => {
    setRevisingItemId(input.itemId);
    setError(null);
    try {
      const result = await reviseGenerationItem(input);
      await refresh();
      return result;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unable to save generated-item revision.';
      setError(message);
      throw caught;
    } finally {
      setRevisingItemId(null);
    }
  }, [refresh]);

  return {
    capabilities,
    loading,
    generating,
    updating,
    revisingItemId,
    error,
    refresh,
    generate,
    updateItems,
    reviseItem,
  };
}


export function useQuestionStudioReviewPage(query: QuestionStudioReviewQuery) {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 20;
  const subject = query.subject ?? '';
  const chapter = query.chapter ?? '';
  const packageId = query.packageId ?? '';
  const status = query.status;
  const search = query.search ?? '';

  const [reviewPage, setReviewPage] = useState<QuestionStudioReviewPage>(EMPTY_REVIEW_PAGE);
  const [loadingReviewPage, setLoadingReviewPage] = useState(true);
  const [reviewPageError, setReviewPageError] = useState<string | null>(null);

  const refreshReviewPage = useCallback(async () => {
    setLoadingReviewPage(true);
    setReviewPageError(null);
    try {
      const next = await getQuestionStudioReviewPage({
        page,
        pageSize,
        subject: subject || undefined,
        chapter: chapter || undefined,
        packageId: packageId || undefined,
        status,
        search: search || undefined,
      });
      setReviewPage(next);
    } catch (caught) {
      setReviewPageError(caught instanceof Error ? caught.message : 'Unable to load review queue.');
    } finally {
      setLoadingReviewPage(false);
    }
  }, [chapter, packageId, page, pageSize, search, status, subject]);

  useEffect(() => {
    void refreshReviewPage();
  }, [refreshReviewPage]);

  useEffect(() => {
    const handleRefresh = () => void refreshReviewPage();
    window.addEventListener(QUESTION_STUDIO_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(QUESTION_STUDIO_REFRESH_EVENT, handleRefresh);
  }, [refreshReviewPage]);

  return {
    reviewPage,
    loadingReviewPage,
    reviewPageError,
    refreshReviewPage,
  };
}
