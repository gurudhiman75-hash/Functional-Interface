import { useCallback, useEffect, useState } from 'react';

import {
  createTaxonomyNode,
  getTaxonomyWorkspace,
  updateTaxonomyCoverage,
  updateTaxonomyNode,
  type TaxonomyCoverageMutation,
  type TaxonomyNodeMutation,
  type TaxonomyWorkspace,
} from './api';

const EMPTY_WORKSPACE: TaxonomyWorkspace = {
  families: [],
  exams: [],
  nodes: [],
  coverage: [],
  supportedNodeTypes: [],
  generatedAt: '',
};

export function useTaxonomyWorkspace() {
  const [workspace, setWorkspace] = useState<TaxonomyWorkspace>(EMPTY_WORKSPACE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setWorkspace(await getTaxonomyWorkspace());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load taxonomy workspace.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveNode = useCallback(async (input: TaxonomyNodeMutation, nodeId?: string) => {
    setSaving(true);
    setError(null);
    try {
      const result = nodeId
        ? await updateTaxonomyNode(nodeId, input)
        : await createTaxonomyNode(input);
      await refresh();
      return result;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unable to save taxonomy node.';
      setError(message);
      throw caught;
    } finally {
      setSaving(false);
    }
  }, [refresh]);

  const saveCoverage = useCallback(async (input: TaxonomyCoverageMutation) => {
    setSaving(true);
    setError(null);
    try {
      const result = await updateTaxonomyCoverage(input);
      await refresh();
      return result;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unable to save coverage targets.';
      setError(message);
      throw caught;
    } finally {
      setSaving(false);
    }
  }, [refresh]);

  return { workspace, loading, saving, error, refresh, saveNode, saveCoverage };
}
