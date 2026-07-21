import { useCallback, useEffect, useState } from 'react';

import {
  downloadAuditCsv,
  getAuditEvent,
  getAuditEvents,
  type AuditEventDetail,
  type AuditEventPage,
  type AuditFilters,
} from './api';

const EMPTY: AuditEventPage = {
  events: [],
  page: 1,
  pageSize: 50,
  total: 0,
  facets: { actions: [], entityTypes: [], roles: [], actors: [] },
  generatedAt: '',
};

export function useAuditEvents() {
  const [filters, setFilters] = useState<AuditFilters>({ page: 1, pageSize: 50 });
  const [data, setData] = useState<AuditEventPage>(EMPTY);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AuditEventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getAuditEvents(filters));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load audit events.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { void refresh(); }, [refresh]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    setError(null);
    void getAuditEvent(selectedId)
      .then((next) => { if (!cancelled) setDetail(next); })
      .catch((caught) => { if (!cancelled) setError(caught instanceof Error ? caught.message : 'Unable to load audit detail.'); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });
    return () => { cancelled = true; };
  }, [selectedId]);

  const updateFilters = useCallback((patch: Partial<AuditFilters>) => {
    setFilters((current) => ({ ...current, ...patch, page: patch.page ?? 1 }));
  }, []);

  const clearFilters = useCallback(() => setFilters({ page: 1, pageSize: filters.pageSize ?? 50 }), [filters.pageSize]);

  const exportCsv = useCallback(async () => {
    setExporting(true);
    setError(null);
    try {
      await downloadAuditCsv(filters);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to export audit events.');
      throw caught;
    } finally {
      setExporting(false);
    }
  }, [filters]);

  return {
    ...data,
    filters,
    updateFilters,
    clearFilters,
    selectedId,
    setSelectedId,
    detail,
    loading,
    detailLoading,
    exporting,
    error,
    refresh,
    exportCsv,
  };
}
