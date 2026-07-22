import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  getStudentDirectory,
  getStudentProfile,
  type StudentDirectoryFilters,
  type StudentDirectoryResponse,
  type StudentProfileResponse,
} from './api';

const EMPTY_DIRECTORY: StudentDirectoryResponse = {
  students: [],
  page: 1,
  pageSize: 25,
  total: 0,
  stats: { total: 0, active: 0, invited: 0, suspended: 0, disabled: 0, withAttempts: 0, activeSessions: 0 },
  facets: { statuses: ['active', 'invited', 'suspended', 'disabled'], languages: [] },
  generatedAt: '',
};

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useStudentDirectory(filters: StudentDirectoryFilters) {
  const [data, setData] = useState<StudentDirectoryResponse>(EMPTY_DIRECTORY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const signature = useMemo(() => JSON.stringify(filters), [filters]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getStudentDirectory(filters));
    } catch (caught) {
      setError(errorMessage(caught, 'Unable to load canonical students.'));
    } finally {
      setLoading(false);
    }
  }, [signature]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { ...data, loading, error, refresh };
}

export function useStudentProfile(studentId: string | undefined) {
  const [data, setData] = useState<StudentProfileResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(studentId));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!studentId) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setData(await getStudentProfile(studentId));
    } catch (caught) {
      setData(null);
      setError(errorMessage(caught, 'Unable to load the canonical student profile.'));
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { data, loading, error, refresh };
}
