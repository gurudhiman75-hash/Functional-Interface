import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  assembleBlueprint,
  createBlueprint,
  getBlueprint,
  getBlueprintCatalog,
  getBlueprints,
  previewBlueprint,
  transitionBlueprint,
  updateBlueprint,
  type BlueprintAssemblyPlan,
  type BlueprintCatalog,
  type BlueprintDetail,
  type BlueprintInput,
  type BlueprintSummary,
} from './api';

const EMPTY_CATALOG: BlueprintCatalog = {
  examVersions: [],
  taxonomyNodes: [],
  generatedAt: '',
};

export function useTestBlueprints() {
  const [catalog, setCatalog] = useState<BlueprintCatalog>(EMPTY_CATALOG);
  const [blueprints, setBlueprints] = useState<BlueprintSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<BlueprintDetail | null>(null);
  const [preview, setPreview] = useState<BlueprintAssemblyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextCatalog, nextList] = await Promise.all([
        getBlueprintCatalog(),
        getBlueprints(),
      ]);
      setCatalog(nextCatalog);
      setBlueprints(nextList.blueprints);
      setSelectedId((current) => {
        if (current && nextList.blueprints.some((entry) => entry.id === current)) return current;
        return nextList.blueprints[0]?.id ?? null;
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load test blueprints.');
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
      setPreview(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    setError(null);
    void getBlueprint(selectedId)
      .then((next) => {
        if (!cancelled) {
          setDetail(next);
          setPreview(null);
        }
      })
      .catch((caught) => {
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'Unable to load blueprint detail.');
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedId]);

  const save = useCallback(async (input: BlueprintInput, blueprintId?: string | null) => {
    setMutating(true);
    setError(null);
    try {
      const next = blueprintId
        ? await updateBlueprint(blueprintId, input)
        : await createBlueprint(input);
      setDetail(next);
      setSelectedId(next.blueprint.id);
      setPreview(null);
      await refresh();
      return next;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unable to save blueprint.';
      setError(message);
      throw caught;
    } finally {
      setMutating(false);
    }
  }, [refresh]);

  const transition = useCallback(async (action: 'archive' | 'restore', reason: string) => {
    if (!selectedId) throw new Error('Select a blueprint first.');
    setMutating(true);
    setError(null);
    try {
      const next = await transitionBlueprint(selectedId, action, reason);
      setDetail(next);
      setPreview(null);
      await refresh();
      return next;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : `Unable to ${action} blueprint.`;
      setError(message);
      throw caught;
    } finally {
      setMutating(false);
    }
  }, [refresh, selectedId]);

  const runPreview = useCallback(async (seed?: string) => {
    if (!selectedId) throw new Error('Select a blueprint first.');
    setMutating(true);
    setError(null);
    try {
      const result = await previewBlueprint(selectedId, seed);
      setPreview(result.plan);
      return result.plan;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unable to preview blueprint coverage.';
      setError(message);
      throw caught;
    } finally {
      setMutating(false);
    }
  }, [selectedId]);

  const assemble = useCallback(async (input: { title: string; seed?: string; changeReason: string }) => {
    if (!selectedId) throw new Error('Select a blueprint first.');
    setMutating(true);
    setError(null);
    try {
      return await assembleBlueprint(selectedId, input);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unable to assemble test from blueprint.';
      setError(message);
      throw caught;
    } finally {
      setMutating(false);
    }
  }, [selectedId]);

  const selectedSummary = useMemo(
    () => blueprints.find((entry) => entry.id === selectedId) ?? null,
    [blueprints, selectedId],
  );

  return {
    catalog,
    blueprints,
    selectedId,
    setSelectedId,
    selectedSummary,
    detail,
    preview,
    loading,
    detailLoading,
    mutating,
    error,
    refresh,
    save,
    transition,
    runPreview,
    assemble,
  };
}
