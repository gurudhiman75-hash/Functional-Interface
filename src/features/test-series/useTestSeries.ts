import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  createTestSeries,
  getSeriesCatalog,
  getTestSeries,
  getTestSeriesDetail,
  transitionTestSeries,
  updateTestSeries,
  type SeriesCatalog,
  type TestSeriesDetail,
  type TestSeriesInput,
  type TestSeriesSummary,
} from './api';

const EMPTY_CATALOG: SeriesCatalog = {
  examVersions: [],
  tests: [],
  generatedAt: '',
};

export function useTestSeries() {
  const [catalog, setCatalog] = useState<SeriesCatalog>(EMPTY_CATALOG);
  const [series, setSeries] = useState<TestSeriesSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<TestSeriesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextCatalog, nextList] = await Promise.all([
        getSeriesCatalog(),
        getTestSeries(),
      ]);
      setCatalog(nextCatalog);
      setSeries(nextList.series);
      setSelectedId((current) => {
        if (current && nextList.series.some((entry) => entry.id === current)) return current;
        return nextList.series[0]?.id ?? null;
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load test series.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    setError(null);
    void getTestSeriesDetail(selectedId)
      .then((next) => {
        if (!cancelled) setDetail(next);
      })
      .catch((caught) => {
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'Unable to load series detail.');
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedId]);

  const save = useCallback(async (input: TestSeriesInput, seriesId?: string | null) => {
    setMutating(true);
    setError(null);
    try {
      const next = seriesId
        ? await updateTestSeries(seriesId, input)
        : await createTestSeries(input);
      setDetail(next);
      setSelectedId(next.series.id);
      await refresh();
      return next;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unable to save test series.';
      setError(message);
      throw caught;
    } finally {
      setMutating(false);
    }
  }, [refresh]);

  const transition = useCallback(async (action: 'archive' | 'restore', reason: string) => {
    if (!selectedId) throw new Error('Select a test series first.');
    setMutating(true);
    setError(null);
    try {
      const next = await transitionTestSeries(selectedId, action, reason);
      setDetail(next);
      await refresh();
      return next;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : `Unable to ${action} test series.`;
      setError(message);
      throw caught;
    } finally {
      setMutating(false);
    }
  }, [refresh, selectedId]);

  const selectedSummary = useMemo(
    () => series.find((entry) => entry.id === selectedId) ?? null,
    [selectedId, series],
  );

  return {
    catalog,
    series,
    selectedId,
    setSelectedId,
    selectedSummary,
    detail,
    loading,
    detailLoading,
    mutating,
    error,
    refresh,
    save,
    transition,
  };
}
