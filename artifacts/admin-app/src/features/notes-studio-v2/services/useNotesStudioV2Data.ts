import { useEffect, useState } from 'react';
import { isHttpMode } from '@/services/ServiceContainer';
import {
  NOTES_STUDIO_CONTRADICTIONS,
  NOTES_STUDIO_CORPUS,
  NOTES_STUDIO_FACTS,
  NOTES_STUDIO_PERIODS,
  NOTES_STUDIO_STYLE_SPEC,
} from '../data/fixtures';
import type { Period } from '../domain/types';
import { httpNotesStudioV2Repository } from './repository';
import type { NotesStudioV2Workspace } from './api';

interface LoadState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  source: 'http' | 'mock';
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
  const source = isHttpMode() ? 'http' : 'mock';

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const request = source === 'http'
      ? httpNotesStudioV2Repository.listPeriods()
      : Promise.resolve(NOTES_STUDIO_PERIODS);
    request.then((result) => {
      if (!active) return;
      setData(result);
      setLoading(false);
    }).catch((cause: unknown) => {
      if (!active) return;
      setError(errorMessage(cause));
      setLoading(false);
    });
    return () => { active = false; };
  }, [revision, source]);

  return {
    data,
    loading,
    error,
    source,
    reload: () => setRevision((value) => value + 1),
  };
}

function mockWorkspace(periodId: string): NotesStudioV2Workspace | null {
  const period = NOTES_STUDIO_PERIODS.find((item) => item.id === periodId);
  if (!period) return null;
  return {
    period,
    corpus: NOTES_STUDIO_CORPUS.filter((doc) => doc.periodId === periodId),
    facts: NOTES_STUDIO_FACTS.filter((fact) => fact.periodId === periodId),
    contradictions: NOTES_STUDIO_CONTRADICTIONS.filter((group) => group.periodId === periodId),
    styleSpec: NOTES_STUDIO_STYLE_SPEC,
    notes: [],
    noteVersions: [],
  };
}

export function useNotesStudioV2Workspace(periodId?: string): LoadState<NotesStudioV2Workspace> {
  const [data, setData] = useState<NotesStudioV2Workspace | null>(null);
  const [loading, setLoading] = useState(Boolean(periodId));
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const source = isHttpMode() ? 'http' : 'mock';

  useEffect(() => {
    let active = true;
    if (!periodId) {
      setData(null);
      setLoading(false);
      return () => { active = false; };
    }
    setLoading(true);
    setError(null);
    const request = source === 'http'
      ? httpNotesStudioV2Repository.getWorkspace(periodId)
      : Promise.resolve(mockWorkspace(periodId));
    request.then((result) => {
      if (!active) return;
      if (!result) {
        setError('Period not found.');
        setData(null);
      } else {
        setData(result);
      }
      setLoading(false);
    }).catch((cause: unknown) => {
      if (!active) return;
      setError(errorMessage(cause));
      setData(null);
      setLoading(false);
    });
    return () => { active = false; };
  }, [periodId, revision, source]);

  return {
    data,
    loading,
    error,
    source,
    reload: () => setRevision((value) => value + 1),
  };
}
