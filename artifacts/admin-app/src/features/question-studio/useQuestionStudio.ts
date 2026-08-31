import { useCallback, useEffect, useState } from 'react';
import {
  createGenerationRun,
  getQuestionStudioCapabilities,
  getQuestionStudioDashboard,
  reviseGenerationItem,
  updateGenerationItems,
  type CreateGenerationRunInput,
  type GenerationItemStatus,
  type QuestionStudioCapabilities,
  type QuestionStudioDashboard,
  type QuestionStudioRun,
  type ReviseGenerationItemInput,
} from './api';
import { QUESTION_STUDIO_REFRESH_EVENT } from './events';

const EMPTY_DASHBOARD: QuestionStudioDashboard = {
  runs: [],
  recipes: [],
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

function isLegacyCockpitRun(run: QuestionStudioRun) {
  const engineId = run.requestSnapshot?.engineId;
  return typeof engineId !== 'string' || !engineId.trim() || engineId === 'quant-v4';
}

function legacyCockpitDashboard(dashboard: QuestionStudioDashboard): QuestionStudioDashboard {
  return {
    ...dashboard,
    runs: dashboard.runs.filter(isLegacyCockpitRun),
  };
}

function legacyCockpitCapabilities(capabilities: QuestionStudioCapabilities): QuestionStudioCapabilities {
  return withMixedDifficulty({
    ...capabilities,
    packages: capabilities.packages.filter(
      (entry) => !entry.engineId || entry.engineId === 'quant-v4',
    ),
  });
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
 * Compatibility hook for the existing Quant/Reasoning cockpit and recovery
 * surface. Non-Quant engines use dedicated engine-aware review panels until
 * the generic cockpit is migrated away from Quant-specific assumptions.
 */
export function useQuestionStudio() {
  const [dashboard, setDashboard] = useState<QuestionStudioDashboard>(EMPTY_DASHBOARD);
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
      const [nextDashboard, nextCapabilities] = await Promise.all([
        getQuestionStudioDashboard(),
        getQuestionStudioCapabilities(),
      ]);
      setDashboard(legacyCockpitDashboard(nextDashboard));
      setCapabilities(legacyCockpitCapabilities(nextCapabilities));
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
    dashboard,
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
