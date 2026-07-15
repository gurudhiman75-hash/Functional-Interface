import { useCallback, useEffect, useState } from 'react';
import {
  createGenerationRun,
  getQuestionStudioCapabilities,
  getQuestionStudioDashboard,
  updateGenerationItems,
  type CreateGenerationRunInput,
  type GenerationItemStatus,
  type QuestionStudioCapabilities,
  type QuestionStudioDashboard,
} from './api';

const EMPTY_DASHBOARD: QuestionStudioDashboard = {
  runs: [],
  recipes: [],
  generatedAt: '',
};

const EMPTY_CAPABILITIES: QuestionStudioCapabilities = {
  generationSystem: 'quant-v4',
  packages: [],
  difficulties: ['Easy', 'Medium', 'Hard'],
  languages: ['en'],
  maxBatchSize: 50,
};

export function useQuestionStudio() {
  const [dashboard, setDashboard] = useState<QuestionStudioDashboard>(EMPTY_DASHBOARD);
  const [capabilities, setCapabilities] = useState<QuestionStudioCapabilities>(EMPTY_CAPABILITIES);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextDashboard, nextCapabilities] = await Promise.all([
        getQuestionStudioDashboard(),
        getQuestionStudioCapabilities(),
      ]);
      setDashboard(nextDashboard);
      setCapabilities(nextCapabilities);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Question Studio.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const generate = useCallback(async (input: CreateGenerationRunInput) => {
    setGenerating(true);
    setError(null);
    try {
      const result = await createGenerationRun(input);
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
      const result = await updateGenerationItems(input);
      await refresh();
      return result;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unable to update generated items.';
      setError(message);
      throw caught;
    } finally {
      setUpdating(false);
    }
  }, [refresh]);

  return {
    dashboard,
    capabilities,
    loading,
    generating,
    updating,
    error,
    refresh,
    generate,
    updateItems,
  };
}
