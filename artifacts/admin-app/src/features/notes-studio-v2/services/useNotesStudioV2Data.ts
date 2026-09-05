import { useEffect, useState } from 'react';
import type { Period } from '../domain/types';
import { httpNotesStudioV2Repository } from './repository';
import type { NotesStudioV2Workspace } from './api';

interface LoadState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  source: 'http';
  reload: () => void;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unable to load Notes Studio v2 data.';
}

export function useNotesStudioV2Periods(): LoadState<Period[]> {
  const [data, setData] = useState<Period[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const source = 'http' as const;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    httpNotesStudioV2Repository.listPeriods().then((result) => {
      if (!active) return;
      setData(result);
      setLoading(false);
    }).catch((cause: unknown) => {
      if (!active) return;
      setError(errorMessage(cause));
      setLoading(false);
    });
    return () => { active = false; };
  }, [revision]);

  return {
    data,
    loading,
    error,
    source,
    reload: () => setRevision((value) => value + 1),
  };
}

export function useNotesStudioV2Workspace(periodId?: string): LoadState<NotesStudioV2Workspace> {
  const [data, setData] = useState<NotesStudioV2Workspace | null>(null);
  const [loading, setLoading] = useState(Boolean(periodId));
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const source = 'http' as const;

  useEffect(() => {
    let active = true;
    if (!periodId) {
      setData(null);
      setLoading(false);
      return () => { active = false; };
    }
    setLoading(true);
    setError(null);
    httpNotesStudioV2Repository.getWorkspace(periodId).then((result) => {
      if (!active) return;
      setData(result);
      setLoading(false);
    }).catch((cause: unknown) => {
      if (!active) return;
      setError(errorMessage(cause));
      setData(null);
      setLoading(false);
    });
    return () => { active = false; };
  }, [periodId, revision]);

  return {
    data,
    loading,
    error,
    source,
    reload: () => setRevision((value) => value + 1),
  };
}
