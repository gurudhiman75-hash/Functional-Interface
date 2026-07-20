import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  getLiveTest,
  getLiveTests,
  transitionLiveTest,
  type LiveTestDetail,
  type LiveTestSummary,
  type TestLifecycleAction,
} from '@/features/test-builder/api';
import {
  addTestQaComment,
  assignTestQa,
  getTestQaComparison,
  getTestQaWorkspace,
  resolveTestQaComment,
  type TestQaComparisonResponse,
  type TestQaWorkspaceResponse,
} from './api';
import { buildTestQaQueue } from './model';

const EMPTY_WORKSPACE: TestQaWorkspaceResponse = {
  reviewers: [],
  currentAdminUserId: null,
  collaboration: [],
  generatedAt: '',
};

export function useTestQaWorkspace() {
  const [tests, setTests] = useState<LiveTestSummary[]>([]);
  const [workspace, setWorkspace] = useState<TestQaWorkspaceResponse>(EMPTY_WORKSPACE);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [detail, setDetail] = useState<LiveTestDetail | null>(null);
  const [comparison, setComparison] = useState<TestQaComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queue = useMemo(
    () => buildTestQaQueue(tests, workspace.collaboration),
    [tests, workspace.collaboration],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [testResponse, qaResponse] = await Promise.all([
        getLiveTests(),
        getTestQaWorkspace(),
      ]);
      setTests(testResponse.tests);
      setWorkspace(qaResponse);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Test QA.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (selectedTestId && queue.some((test) => test.id === selectedTestId)) return;
    setSelectedTestId(queue[0]?.id ?? null);
  }, [queue, selectedTestId]);

  const loadDetail = useCallback(async (testId: string) => {
    setDetailLoading(true);
    setError(null);
    setComparison(null);
    try {
      setDetail(await getLiveTest(testId));
    } catch (caught) {
      setDetail(null);
      setError(caught instanceof Error ? caught.message : 'Unable to load test QA detail.');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTestId) void loadDetail(selectedTestId);
    else setDetail(null);
  }, [loadDetail, selectedTestId]);

  const refreshWorkspaceOnly = useCallback(async () => {
    const response = await getTestQaWorkspace();
    setWorkspace(response);
  }, []);

  const assign = useCallback(async (input: Parameters<typeof assignTestQa>[0]) => {
    setMutating(true);
    setError(null);
    try {
      const result = await assignTestQa(input);
      await refreshWorkspaceOnly();
      return result;
    } finally {
      setMutating(false);
    }
  }, [refreshWorkspaceOnly]);

  const comment = useCallback(async (input: Parameters<typeof addTestQaComment>[0]) => {
    setMutating(true);
    setError(null);
    try {
      const result = await addTestQaComment(input);
      await refreshWorkspaceOnly();
      return result;
    } finally {
      setMutating(false);
    }
  }, [refreshWorkspaceOnly]);

  const resolveComment = useCallback(async (commentId: string, resolved: boolean, reason?: string) => {
    setMutating(true);
    setError(null);
    try {
      const result = await resolveTestQaComment(commentId, resolved, reason);
      await refreshWorkspaceOnly();
      return result;
    } finally {
      setMutating(false);
    }
  }, [refreshWorkspaceOnly]);

  const transition = useCallback(async (
    action: TestLifecycleAction,
    input: { reason?: string; scheduledAt?: string; closesAt?: string },
  ) => {
    if (!selectedTestId || !detail?.test.currentDraftVersionId) {
      throw new Error('Select a test with a current draft version.');
    }
    setMutating(true);
    setError(null);
    try {
      const next = await transitionLiveTest(selectedTestId, action, {
        expectedCurrentDraftVersionId: detail.test.currentDraftVersionId,
        ...input,
      });
      setDetail(next);
      const [testResponse, qaResponse] = await Promise.all([getLiveTests(), getTestQaWorkspace()]);
      setTests(testResponse.tests);
      setWorkspace(qaResponse);
      return next;
    } finally {
      setMutating(false);
    }
  }, [detail?.test.currentDraftVersionId, selectedTestId]);

  const loadComparison = useCallback(async () => {
    if (!selectedTestId) return null;
    setComparisonLoading(true);
    setError(null);
    try {
      const next = await getTestQaComparison(selectedTestId);
      setComparison(next);
      return next;
    } finally {
      setComparisonLoading(false);
    }
  }, [selectedTestId]);

  const selectedSummary = queue.find((test) => test.id === selectedTestId) ?? null;
  const collaboration = selectedSummary?.collaboration ?? null;

  return {
    tests,
    workspace,
    queue,
    selectedTestId,
    setSelectedTestId,
    selectedSummary,
    collaboration,
    detail,
    comparison,
    loading,
    detailLoading,
    comparisonLoading,
    mutating,
    error,
    refresh,
    loadDetail,
    loadComparison,
    assign,
    comment,
    resolveComment,
    transition,
  };
}
