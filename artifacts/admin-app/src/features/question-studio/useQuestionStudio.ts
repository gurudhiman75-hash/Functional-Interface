import { useCallback, useEffect, useState } from 'react';
import {
  TSD_CP009_SELECTOR_PACKAGE_ID,
  TSD_CP010_SELECTOR_PACKAGE_ID,
  createGenerationRun,
  createTsdCp009GenerationRun,
  createTsdCp010GenerationRun,
  getQuestionStudioCapabilities,
  getQuestionStudioDashboard,
  getTsdCp009QuestionStudioPackage,
  getTsdCp010QuestionStudioPackage,
  reviseGenerationItem,
  updateGenerationItems,
  type CreateGenerationRunInput,
  type GenerationItemStatus,
  type QuestionStudioCapabilities,
  type QuestionStudioDashboard,
  type ReviseGenerationItemInput,
  type TsdCp009QuestionStudioPackageResponse,
  type TsdCp010QuestionStudioPackageResponse,
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

function withTsdCp009ReviewPackage(
  capabilities: QuestionStudioCapabilities,
  response: TsdCp009QuestionStudioPackageResponse | null,
): QuestionStudioCapabilities {
  if (!response) return capabilities;
  const reviewPackage = {
    packageId: TSD_CP009_SELECTOR_PACKAGE_ID,
    topic: 'Arithmetic',
    subtopic: 'Time, Speed & Distance',
    label: 'TSD-CP-009 · Motion in a Medium · Review only (Easy/Medium)',
    enabled: true,
    cpIds: ['TSD-CP-009'],
    supportedLanguages: [...response.supportedLanguages],
    supportedDifficulties: response.supportedDifficulties.map((entry) =>
      entry.charAt(0).toUpperCase() + entry.slice(1).toLowerCase()),
    runtimeMode: response.package.runtimeMode,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
    selectorKind: 'tsd-cp009-review' as const,
  };
  const packages = capabilities.packages
    .filter((entry) => entry.packageId !== TSD_CP009_SELECTOR_PACKAGE_ID)
    .concat(reviewPackage)
    .sort((left, right) => left.packageId.localeCompare(right.packageId));
  return { ...capabilities, packages };
}

function withTsdCp010ReviewPackage(
  capabilities: QuestionStudioCapabilities,
  response: TsdCp010QuestionStudioPackageResponse | null,
): QuestionStudioCapabilities {
  if (!response) return capabilities;
  const reviewPackage = {
    packageId: TSD_CP010_SELECTOR_PACKAGE_ID,
    topic: 'Arithmetic',
    subtopic: 'Time, Speed & Distance',
    label: 'TSD-CP-010 · Races & Finish Relationships · Review only (Easy/Medium)',
    enabled: true,
    cpIds: ['TSD-CP-010'],
    supportedLanguages: [...response.supportedLanguages],
    supportedDifficulties: response.supportedDifficulties.map((entry) =>
      entry.charAt(0).toUpperCase() + entry.slice(1).toLowerCase()),
    runtimeMode: response.package.runtimeMode,
    questionBankStatus: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publiclyPublishable: false,
    selectorKind: 'tsd-cp010-review' as const,
  };
  const packages = capabilities.packages
    .filter((entry) => entry.packageId !== TSD_CP010_SELECTOR_PACKAGE_ID)
    .concat(reviewPackage)
    .sort((left, right) => left.packageId.localeCompare(right.packageId));
  return { ...capabilities, packages };
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
      const [nextDashboard, nextCapabilities, tsdCp009Package, tsdCp010Package] = await Promise.all([
        getQuestionStudioDashboard(),
        getQuestionStudioCapabilities(),
        getTsdCp009QuestionStudioPackage().catch(() => null),
        getTsdCp010QuestionStudioPackage().catch(() => null),
      ]);
      setDashboard(nextDashboard);
      const mixed = withMixedDifficulty(nextCapabilities);
      const withCp009 = withTsdCp009ReviewPackage(mixed, tsdCp009Package);
      setCapabilities(withTsdCp010ReviewPackage(withCp009, tsdCp010Package));
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
      const result = input.packageId === TSD_CP009_SELECTOR_PACKAGE_ID
        ? await createTsdCp009GenerationRun(input)
        : input.packageId === TSD_CP010_SELECTOR_PACKAGE_ID
          ? await createTsdCp010GenerationRun(input)
          : await createGenerationRun(input);
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
