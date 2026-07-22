import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  getStudentDirectory,
  getStudentProfile,
  runStudentAccountOperation,
  type StudentAccountAction,
  type StudentDirectoryFilters,
  type StudentDirectoryResponse,
  type StudentProfileResponse,
  type StudentStatus,
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

function errorCode(error: unknown): string | null {
  return error && typeof error === 'object' && 'code' in error
    ? String((error as { code?: unknown }).code ?? '') || null
    : null;
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
  const [mutating, setMutating] = useState(false);
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

  const runAction = useCallback(async (
    action: StudentAccountAction,
    reason: string,
    expectedStatus?: StudentStatus,
  ) => {
    if (!studentId) throw new Error('Student ID is required for this operation.');
    setMutating(true);
    setError(null);
    try {
      const result = await runStudentAccountOperation(studentId, action, { reason, expectedStatus });
      setData(await getStudentProfile(studentId));
      return result.operation;
    } catch (caught) {
      if (errorCode(caught) === 'STUDENT_STATE_CHANGED') {
        try {
          setData(await getStudentProfile(studentId));
        } catch {
          setData(null);
        }
      }
      setError(errorMessage(caught, 'Unable to complete the student account operation.'));
      throw caught;
    } finally {
      setMutating(false);
    }
  }, [studentId]);

  return { data, loading, mutating, error, refresh, runAction };
}
