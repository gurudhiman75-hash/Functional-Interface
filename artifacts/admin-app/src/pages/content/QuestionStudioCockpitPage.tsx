import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Database,
  ExternalLink,
  FileCheck2,
  Filter,
  Layers3,
  Loader2,
  PencilLine,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { EXAMS } from '@/data/exams';
import {
  type GenerationItemStatus,
  type GenerationPackage,
  type GenerationRunStatus,
  type QuestionStudioItem,
  type QuestionStudioRun,
} from '@/features/question-studio/api';
import {
  analyzeItemQuality,
  findDuplicateMatches,
  itemCorrectIndex,
  itemExplanation,
  itemExplanationSvgs,
  itemFormulaLatex,
  itemOptionSvgs,
  itemOptionValues,
  itemStem,
  itemStimulusSvgs,
  qualityWithDuplicate,
  type DuplicateMatch,
  type ItemQualityReport,
} from '@/features/question-studio/quality';
import { useQuestionStudio, useQuestionStudioReviewPage } from '@/features/question-studio/useQuestionStudio';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

const ALL = 'all';
const LANGUAGE_LABELS: Record<string, string> = { en: 'English', hi: 'Hindi', pa: 'Punjabi' };
const SUBJECT_ORDER = ['Quantitative Aptitude', 'Reasoning Ability', 'English', 'Static GK', 'Punjabi Language'];

function packageSubject(entry: GenerationPackage) {
  return entry.subject.trim();
}

function packageChapter(entry: GenerationPackage) {
  return entry.chapter.trim();
}

function packageCpIds(entry: GenerationPackage) {
  return [...new Set([...(entry.cpIds ?? []), ...(entry.dynamicCandidateCpIds ?? [])])];
}

function cpDisplayLabel(entry: GenerationPackage, cpId: string) {
  const label = entry.cpLabels?.[cpId]?.trim();
  return label && label !== cpId ? label : '';
}

function sortSubjects(values: string[]) {
  return [...values].sort((left, right) => {
    const leftRank = SUBJECT_ORDER.indexOf(left);
    const rightRank = SUBJECT_ORDER.indexOf(right);
    if (leftRank !== -1 || rightRank !== -1) {
      if (leftRank === -1) return 1;
      if (rightRank === -1) return -1;
      if (leftRank !== rightRank) return leftRank - rightRank;
    }
    return left.localeCompare(right);
  });
}

type QualityFilter = 'all' | 'ready' | 'warning' | 'blocked' | 'duplicate';

function asText(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function firstText(payload: Record<string, unknown> | null, keys: string[], fallback = '—') {
  for (const key of keys) {
    const value = asText(payload?.[key]).trim();
    if (value) return value;
  }
  return fallback;
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function runStatusTone(status: GenerationRunStatus) {
  if (status === 'approved') return 'success' as const;
  if (status === 'failed' || status === 'cancelled') return 'destructive' as const;
  if (status === 'review' || status === 'validation' || status === 'partially_approved') return 'warning' as const;
  if (status === 'queued' || status === 'running' || status === 'paused') return 'info' as const;
  return 'neutral' as const;
}

function itemStatusTone(status: GenerationItemStatus) {
  if (status === 'approved') return 'success' as const;
  if (status === 'needs_fix') return 'warning' as const;
  if (status === 'rejected') return 'destructive' as const;
  return 'info' as const;
}

function runSnapshotText(run: QuestionStudioRun, key: string, fallback = '—') {
  const value = run.requestSnapshot?.[key];
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function qualityTone(report: ItemQualityReport) {
  if (report.blockerCount > 0) return 'border-destructive/30 bg-destructive/5 text-destructive';
  if (report.warningCount > 0) return 'border-warning/30 bg-warning/5 text-warning';
  return 'border-success/30 bg-success/5 text-success';
}

function SpatialSvgFigure({ svg, label }: { svg: string; label: string }) {
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return <div className="rounded-lg border bg-white p-2 text-center text-slate-950"><div className="mb-1 text-[10px] font-semibold text-slate-500">{label}</div><img src={src} alt={label} className="mx-auto h-auto w-full max-w-[150px] object-contain" /></div>;
}

export function QuestionStudioCockpitPage() {
  const { hasPermission } = useAdminPermissions();
  const canRun = hasPermission('content.generation.run');
  const canReview = hasPermission('content.generation.review');
  const {
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
  } = useQuestionStudio();

  const [workspaceView, setWorkspaceView] = useState<'generate' | 'review'>('generate');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [exam, setExam] = useState(EXAMS[0]?.code ?? 'SSC_CGL_T1');
  const [packageId, setPackageId] = useState('');
  const [selectedCpIds, setSelectedCpIds] = useState<Set<string>>(() => new Set());
  const [cpSearch, setCpSearch] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [language, setLanguage] = useState('en');
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState('');
  const [search, setSearch] = useState('');
  const [serverSearch, setServerSearch] = useState('');
  const [reviewPageNumber, setReviewPageNumber] = useState(1);
  const [reviewPageSize, setReviewPageSize] = useState(20);
  const [reviewSubjectFilter, setReviewSubjectFilter] = useState(ALL);
  const [reviewChapterFilter, setReviewChapterFilter] = useState(ALL);
  const [reviewPackageFilter, setReviewPackageFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [qualityFilter, setQualityFilter] = useState<QualityFilter>('all');
  const [reason, setReason] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [expandedRuns, setExpandedRuns] = useState<Set<string>>(() => new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => new Set());
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const enabledPackages = useMemo(
    () => capabilities.packages.filter((entry) => entry.enabled),
    [capabilities.packages],
  );

  const subjects = useMemo(
    () => sortSubjects([...new Set(enabledPackages.map(packageSubject))]),
    [enabledPackages],
  );

  const reviewSubjects = subjects;

  const reviewChapters = useMemo(
    () => [...new Set(
      enabledPackages
        .filter((entry) => reviewSubjectFilter === ALL || packageSubject(entry) === reviewSubjectFilter)
        .map(packageChapter),
    )].sort((left, right) => left.localeCompare(right)),
    [enabledPackages, reviewSubjectFilter],
  );

  useEffect(() => {
    if (reviewChapterFilter !== ALL && !reviewChapters.includes(reviewChapterFilter)) {
      setReviewChapterFilter(ALL);
      setReviewPackageFilter(ALL);
      setReviewPageNumber(1);
    }
  }, [reviewChapterFilter, reviewChapters]);

  const reviewPackages = useMemo(
    () => enabledPackages.filter((entry) =>
      (reviewSubjectFilter === ALL || packageSubject(entry) === reviewSubjectFilter)
      && (reviewChapterFilter === ALL || packageChapter(entry) === reviewChapterFilter)),
    [enabledPackages, reviewChapterFilter, reviewSubjectFilter],
  );

  useEffect(() => {
    if (
      reviewPackageFilter !== ALL
      && !reviewPackages.some((entry) => entry.packageId === reviewPackageFilter)
    ) {
      setReviewPackageFilter(ALL);
      setReviewPageNumber(1);
    }
  }, [reviewPackageFilter, reviewPackages]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setServerSearch(search.trim());
      setReviewPageNumber(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const {
    reviewPage,
    loadingReviewPage,
    reviewPageError,
    refreshReviewPage,
  } = useQuestionStudioReviewPage({
    page: reviewPageNumber,
    pageSize: reviewPageSize,
    subject: reviewSubjectFilter === ALL ? undefined : reviewSubjectFilter,
    chapter: reviewChapterFilter === ALL ? undefined : reviewChapterFilter,
    packageId: reviewPackageFilter === ALL ? undefined : reviewPackageFilter,
    status: statusFilter === ALL ? undefined : statusFilter as GenerationItemStatus,
    search: serverSearch || undefined,
  });

  const reviewRuns = reviewPage.runs;

  useEffect(() => {
    if (reviewPage.pagination.page !== reviewPageNumber) {
      setReviewPageNumber(reviewPage.pagination.page);
    }
  }, [reviewPage.pagination.page, reviewPageNumber]);

  useEffect(() => {
    if (!subjects.length) return;
    if (!subject || !subjects.includes(subject)) setSubject(subjects[0]!);
  }, [subject, subjects]);

  const subjectPackages = useMemo(
    () => enabledPackages.filter((entry) => packageSubject(entry) === subject),
    [enabledPackages, subject],
  );

  const chapters = useMemo(
    () => [...new Set(subjectPackages.map(packageChapter))].sort((left, right) => left.localeCompare(right)),
    [subjectPackages],
  );

  useEffect(() => {
    if (!chapters.length) {
      setChapter('');
      return;
    }
    if (!chapter || !chapters.includes(chapter)) setChapter(chapters[0]!);
  }, [chapter, chapters]);

  const chapterPackages = useMemo(
    () => subjectPackages
      .filter((entry) => packageChapter(entry) === chapter)
      .sort((left, right) => {
        const cpDelta = packageCpIds(right).length - packageCpIds(left).length;
        if (cpDelta !== 0) return cpDelta;
        return left.packageId.localeCompare(right.packageId);
      }),
    [chapter, subjectPackages],
  );

  useEffect(() => {
    if (!chapterPackages.length) {
      setPackageId('');
      return;
    }
    if (!packageId || !chapterPackages.some((entry) => entry.packageId === packageId)) {
      setPackageId(chapterPackages[0]!.packageId);
      setSelectedCpIds(new Set());
      setCpSearch('');
    }
  }, [chapterPackages, packageId]);

  const activePackage = chapterPackages.find((entry) => entry.packageId === packageId);
  const availableCpIds = useMemo(
    () => activePackage ? packageCpIds(activePackage) : [],
    [activePackage],
  );

  const visibleCpIds = useMemo(() => {
    const normalizedSearch = cpSearch.trim().toLowerCase();
    if (!normalizedSearch || !activePackage) return availableCpIds;
    return availableCpIds.filter((cpId) => {
      const label = cpDisplayLabel(activePackage, cpId);
      return `${cpId} ${label}`.toLowerCase().includes(normalizedSearch);
    });
  }, [activePackage, availableCpIds, cpSearch]);

  const selectedAfterVisibleCount = useMemo(
    () => new Set([...selectedCpIds, ...visibleCpIds]).size,
    [selectedCpIds, visibleCpIds],
  );

  useEffect(() => {
    setSelectedCpIds((current) => {
      const valid = new Set(availableCpIds);
      return new Set([...current].filter((cpId) => valid.has(cpId)));
    });
  }, [availableCpIds]);

  const supportedLanguages = useMemo(
    () => activePackage?.supportedLanguages.length ? activePackage.supportedLanguages : ['en'],
    [activePackage],
  );
  const difficultyFilterSupported = activePackage?.difficultyFilterSupported !== false;
  const supportedDifficulties = useMemo(
    () => activePackage?.supportedDifficulties?.length
      ? activePackage.supportedDifficulties
      : capabilities.difficulties,
    [activePackage, capabilities.difficulties],
  );

  useEffect(() => {
    if (!supportedLanguages.includes(language)) setLanguage(supportedLanguages[0] ?? 'en');
  }, [language, supportedLanguages]);

  useEffect(() => {
    if (!difficultyFilterSupported) return;
    if (!supportedDifficulties.includes(difficulty)) {
      setDifficulty(supportedDifficulties[0] ?? 'Medium');
    }
  }, [difficulty, difficultyFilterSupported, supportedDifficulties]);

  useEffect(() => {
    if (reviewRuns[0] && expandedRuns.size === 0) {
      setExpandedRuns(new Set([reviewRuns[0].id]));
    }
  }, [reviewRuns, expandedRuns.size]);

  const duplicates = useMemo(() => {
    const combined = findDuplicateMatches(reviewRuns);
    for (const match of reviewPage.duplicateMatches) {
      const current = combined.get(match.itemId);
      if (!current || match.exact || current.similarity < match.similarity) {
        combined.set(match.itemId, match as DuplicateMatch);
      }
    }
    return combined;
  }, [reviewPage.duplicateMatches, reviewRuns]);
  const qualityByItem = useMemo(() => {
    const map = new Map<string, ItemQualityReport>();
    for (const run of reviewRuns) {
      for (const item of run.items) map.set(item.id, qualityWithDuplicate(item, duplicates.get(item.id)));
    }
    return map;
  }, [reviewRuns, duplicates]);

  const allItems = useMemo(
    () => reviewRuns.flatMap((run) => run.items.map((item) => ({ run, item }))),
    [reviewRuns],
  );

  useEffect(() => {
    const valid = new Set(allItems.map(({ item }) => item.id));
    setSelectedIds((current) => new Set([...current].filter((id) => valid.has(id))));
  }, [allItems]);

  const filteredRuns = useMemo(() => {
    return reviewRuns.map((run) => {
      const items = run.items.filter((item) => {
        const quality = qualityByItem.get(item.id) ?? analyzeItemQuality(item.payload);
        const duplicate = duplicates.has(item.id);
        if (qualityFilter === 'ready' && (!quality.readyForApproval || quality.warningCount > 0)) return false;
        if (qualityFilter === 'warning' && (quality.blockerCount > 0 || quality.warningCount === 0)) return false;
        if (qualityFilter === 'blocked' && quality.blockerCount === 0) return false;
        if (qualityFilter === 'duplicate' && !duplicate) return false;
        return true;
      });
      return { run, items };
    }).filter(({ items }) => items.length > 0);
  }, [duplicates, qualityByItem, qualityFilter, reviewRuns]);

  const visibleItemIds = useMemo(
    () => filteredRuns.flatMap(({ items }) => items.map((item) => item.id)),
    [filteredRuns],
  );

  const stats = useMemo(() => {
    const values = { runs: reviewPage.pagination.totalRuns, total: allItems.length, unreviewed: 0, blocked: 0, duplicates: duplicates.size, inQuestionBank: 0 };
    for (const { item } of allItems) {
      if (item.status === 'unreviewed') values.unreviewed += 1;
      if (item.acceptedQuestionId) values.inQuestionBank += 1;
      if ((qualityByItem.get(item.id)?.blockerCount ?? 0) > 0) values.blocked += 1;
    }
    return values;
  }, [allItems, duplicates.size, qualityByItem, reviewPage.pagination.totalRuns]);

  const handleGenerate = async () => {
    if (!activePackage) {
      showToast.error('Generation source required', 'Select a subject and chapter with an enabled generation source.');
      return;
    }
    const cpIds = [...selectedCpIds];
    if (cpIds.length > count) {
      showToast.error(
        'Question count too small',
        `Select at least ${cpIds.length} questions so every chosen CP contributes at least one question.`,
      );
      return;
    }
    try {
      const selectedExam = EXAMS.find((entry) => entry.code === exam);
      const result = await generate({
        exam: selectedExam?.name ?? exam,
        engineId: activePackage.engineId,
        subject: packageSubject(activePackage),
        difficulty: difficultyFilterSupported ? difficulty : 'Mixed',
        count: Math.min(capabilities.maxBatchSize, Math.max(1, count)),
        packageId: activePackage.packageId,
        cpIds: cpIds.length > 0 ? cpIds : undefined,
        topic: activePackage.topic,
        subtopic: activePackage.subtopic,
        language,
        seed: seed.trim() || undefined,
      });
      setExpandedRuns((current) => new Set(current).add(result.id));
      setReviewSubjectFilter(packageSubject(activePackage));
      setReviewChapterFilter(packageChapter(activePackage));
      setReviewPackageFilter(activePackage.packageId);
      setStatusFilter(ALL);
      setQualityFilter('all');
      setSearch('');
      setServerSearch('');
      setReviewPageNumber(1);
      setWorkspaceView('review');
      showToast.success(
        'Generation run created',
        `${result.publicCode} produced ${result.itemCount} review items${cpIds.length > 0 ? ` across ${cpIds.length} selected CPs` : ' using the engine-managed CP mix'}.`,
      );
    } catch (caught) {
      showToast.error('Generation failed', caught instanceof Error ? caught.message : 'Unable to generate questions.');
    }
  };

  const applyStatus = async (status: GenerationItemStatus, explicitIds?: string[]) => {
    const ids = explicitIds ?? [...selectedIds];
    if (ids.length === 0) {
      showToast.info('No items selected', 'Select one or more generated questions first.');
      return;
    }
    const selectedStatusById = new Map(allItems.map(({ item }) => [item.id, item.status]));
    const reopeningApproved = status !== 'approved'
      && ids.some((id) => selectedStatusById.get(id) === 'approved');

    if ((status === 'needs_fix' || status === 'rejected' || reopeningApproved) && !reason.trim()) {
      showToast.error(
        'Reason required',
        reopeningApproved
          ? 'Describe why the approved review-only item is being reopened.'
          : 'Describe the issue before marking items needs-fix or rejected.',
      );
      return;
    }
    if (status === 'approved') {
      const blocked = ids.filter((id) => (qualityByItem.get(id)?.blockerCount ?? 0) > 0);
      if (blocked.length > 0) {
        showToast.error('Quality gate blocked approval', `${blocked.length} selected item(s) still have approval blockers.`);
        return;
      }
    }
    try {
      const result = await updateItems({ itemIds: ids, status, reason: reason.trim() || undefined });
      await refreshReviewPage();
      setSelectedIds((current) => new Set([...current].filter((id) => !ids.includes(id))));
      setReason('');
      const outcomeText = [
        result.convertedCount > 0 ? `${result.convertedCount} added to Question Bank.` : '',
        result.reviewOnlyApprovedCount > 0
          ? `${result.reviewOnlyApprovedCount} approved for editorial review only; no Question Bank write.`
          : '',
      ].filter(Boolean).join(' ');
      showToast.success(
        'Review state updated',
        `${result.updatedCount} item(s) moved to ${formatStatus(status)}.${outcomeText ? ` ${outcomeText}` : ''}`,
      );
    } catch (caught) {
      showToast.error('Review update failed', caught instanceof Error ? caught.message : 'Unable to update review state.');
    }
  };

  const toggleAllVisible = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      visibleItemIds.forEach((id) => checked ? next.add(id) : next.delete(id));
      return next;
    });
  };

  const allVisibleSelected = visibleItemIds.length > 0 && visibleItemIds.every((id) => selectedIds.has(id));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Studio"
        description="Generate, quality-check, revise, approve, and route eligible questions to Question Bank from one production cockpit."
        icon={<Sparkles className="h-5 w-5" />}
        actions={(
          <>
            <Badge variant="outline" className="gap-1.5 border-success/30 bg-success/5 text-success"><Database className="h-3.5 w-3.5" /> Live canonical data</Badge>
            <Button
              variant="outline"
              onClick={() => void Promise.all([refresh(), refreshReviewPage()])}
              disabled={loading || loadingReviewPage || generating || updating || Boolean(revisingItemId)}
            >
              <RefreshCw className={cn('mr-1.5 h-4 w-4', (loading || loadingReviewPage) && 'animate-spin')} /> Refresh
            </Button>
          </>
        )}
      />

      {(error || reviewPageError) && <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="font-semibold">Question Studio could not complete the last request</p><p className="mt-1 text-xs opacity-90">{error || reviewPageError}</p></div></div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <Metric label="Matching runs" value={stats.runs} icon={<Layers3 className="h-4 w-4" />} />
        <Metric label="Items on page" value={stats.total} icon={<FileCheck2 className="h-4 w-4" />} />
        <Metric label="Review on page" value={stats.unreviewed} icon={<RefreshCw className="h-4 w-4" />} tone={stats.unreviewed ? 'info' : 'neutral'} />
        <Metric label="Blockers on page" value={stats.blocked} icon={<ShieldCheck className="h-4 w-4" />} tone={stats.blocked ? 'warning' : 'success'} />
        <Metric label="Duplicates on page" value={stats.duplicates} icon={<CircleAlert className="h-4 w-4" />} tone={stats.duplicates ? 'warning' : 'success'} />
        <Metric label="Bank on page" value={stats.inQuestionBank} icon={<CheckCircle2 className="h-4 w-4" />} tone="success" />
      </div>

      <Tabs value={workspaceView} onValueChange={(value) => setWorkspaceView(value as 'generate' | 'review')} className="space-y-4">
        <TabsList className="h-auto p-1">
          <TabsTrigger value="generate">Generate batch</TabsTrigger>
          <TabsTrigger value="review" className="gap-2">
            Review queue
            {stats.unreviewed > 0 && <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-[10px]">{stats.unreviewed}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-0">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" /> Create generation run</CardTitle><p className="text-xs text-muted-foreground">Choose a subject and chapter, select one or more CPs, then generate a review batch. Package and engine routing stay behind the workflow unless a chapter has multiple question families.</p></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <Field label="Subject" className="xl:col-span-2">
              <Select
                value={subject}
                onValueChange={(value) => {
                  setSubject(value);
                  setChapter('');
                  setPackageId('');
                  setSelectedCpIds(new Set());
                  setCpSearch('');
                }}
              >
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>{subjects.map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Chapter" className="xl:col-span-2">
              <Select
                value={chapter}
                onValueChange={(value) => {
                  setChapter(value);
                  setPackageId('');
                  setSelectedCpIds(new Set());
                  setCpSearch('');
                }}
                disabled={!subject}
              >
                <SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
                <SelectContent>{chapters.map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            {chapterPackages.length > 1 ? (
              <Field label="Question family" className="xl:col-span-2">
                <Select value={packageId} onValueChange={(value) => { setPackageId(value); setSelectedCpIds(new Set()); setCpSearch(''); }}>
                  <SelectTrigger><SelectValue placeholder="Select question family" /></SelectTrigger>
                  <SelectContent>{chapterPackages.map((entry) => (
                    <SelectItem key={entry.packageId} value={entry.packageId}>
                      {entry.label} · {entry.packageId}
                    </SelectItem>
                  ))}</SelectContent>
                </Select>
              </Field>
            ) : (
              <div className="xl:col-span-2 rounded-lg border bg-muted/20 px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Generation source</p>
                <p className="mt-1 text-xs font-medium">
                  {activePackage ? `${activePackage.label} · ${activePackage.packageId}` : 'Choose a chapter'}
                </p>
              </div>
            )}
          </div>

          {activePackage && availableCpIds.length > 0 && (
            <div className="rounded-xl border bg-muted/10">
              <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold">Content patterns (CPs)</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {selectedCpIds.size > 0
                      ? `${selectedCpIds.size} of ${availableCpIds.length} CPs selected`
                      : `No explicit CP filter · chapter mix uses all ${availableCpIds.length} CPs`}
                    {cpSearch.trim() ? ` · ${visibleCpIds.length} shown` : ''}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => setSelectedCpIds(new Set())}>
                    Use chapter mix
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCpIds((current) => new Set([...current, ...visibleCpIds]))}
                    disabled={visibleCpIds.length === 0 || selectedAfterVisibleCount > capabilities.maxBatchSize}
                  >
                    Select visible
                  </Button>
                </div>
              </div>
              <div className="border-b p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={cpSearch}
                    onChange={(event) => setCpSearch(event.target.value)}
                    placeholder="Search CP code or title"
                    className="pl-9"
                  />
                </div>
              </div>
              {visibleCpIds.length > 0 ? (
                <div className="grid max-h-64 gap-2 overflow-y-auto p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleCpIds.map((cpId) => {
                    const checked = selectedCpIds.has(cpId);
                    return (
                      <label key={cpId} className={cn('flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors', checked ? 'border-primary/40 bg-primary/5' : 'bg-background hover:bg-muted/40')}>
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) => setSelectedCpIds((current) => {
                            const next = new Set(current);
                            value === true ? next.add(cpId) : next.delete(cpId);
                            return next;
                          })}
                        />
                        <span className="min-w-0">
                          <span className="block font-mono">{cpId}</span>
                          {cpDisplayLabel(activePackage, cpId) && (
                            <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                              {cpDisplayLabel(activePackage, cpId)}
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No CP matches “{cpSearch.trim()}”.
                </div>
              )}
              {selectedCpIds.size > count && (
                <div className="border-t border-warning/20 bg-warning/5 px-4 py-2 text-[11px] text-warning">
                  Increase question count to at least {selectedCpIds.size} so each selected CP receives a question.
                </div>
              )}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Exam profile"><Select value={exam} onValueChange={setExam}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{EXAMS.map((entry) => <SelectItem key={entry.code} value={entry.code}>{entry.name}</SelectItem>)}</SelectContent></Select></Field>
            {difficultyFilterSupported ? (
              <Field label="Difficulty"><Select value={difficulty} onValueChange={setDifficulty}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{supportedDifficulties.map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent></Select></Field>
            ) : (
              <div className="rounded-lg border bg-muted/20 px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Difficulty</p>
                <p className="mt-1 text-xs font-medium">Engine managed / not classified</p>
              </div>
            )}
            <Field label="Language"><Select value={language} onValueChange={setLanguage}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{supportedLanguages.map((entry) => <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry] ?? entry}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Question count"><Input type="number" min={1} max={capabilities.maxBatchSize} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} /></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <Field label="Optional deterministic seed"><Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="Leave blank for a fresh generated seed" /></Field>
            <Button onClick={() => void handleGenerate()} disabled={loading || generating || !activePackage || !canRun} className="min-w-44">{generating ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}{generating ? 'Generating…' : 'Generate review batch'}</Button>
          </div>
          {activePackage && <div className="rounded-lg border bg-muted/20 px-3 py-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">{packageSubject(activePackage)} · {packageChapter(activePackage)}</span> · {activePackage.packageId} · {selectedCpIds.size > 0 ? `${selectedCpIds.size} selected CP(s)` : `${availableCpIds.length} CP(s), chapter mix`} · {difficultyFilterSupported ? `Difficulty: ${difficulty}` : 'Difficulty: engine managed'} · {activePackage.lifecycleStage ? `Lifecycle: ${activePackage.lifecycleStage.replace(/_/g, ' ')}` : 'Lifecycle: legacy'} · {activePackage.engineId ?? capabilities.defaultGenerationSystem ?? capabilities.generationSystem}</div>}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="review" className="mt-0">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start"><div><CardTitle className="text-base">Review cockpit</CardTitle><p className="mt-1 text-xs text-muted-foreground">Subject, chapter, status and search are filtered server-side. Exact duplicates are checked across the full generated corpus; near-duplicate similarity and other quality signals are evaluated on the current page.</p></div><Badge variant="outline">{selectedIds.size} selected</Badge></div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search run code, stem, CP, topic, package or exam" className="pl-9" />
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <Select value={reviewSubjectFilter} onValueChange={(value) => { setReviewSubjectFilter(value); setReviewChapterFilter(ALL); setReviewPackageFilter(ALL); setReviewPageNumber(1); }}>
              <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent><SelectItem value={ALL}>All subjects</SelectItem>{reviewSubjects.map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={reviewChapterFilter} onValueChange={(value) => { setReviewChapterFilter(value); setReviewPackageFilter(ALL); setReviewPageNumber(1); }}>
              <SelectTrigger><SelectValue placeholder="Chapter" /></SelectTrigger>
              <SelectContent><SelectItem value={ALL}>All chapters</SelectItem>{reviewChapters.map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={reviewPackageFilter} onValueChange={(value) => { setReviewPackageFilter(value); setReviewPageNumber(1); }}>
              <SelectTrigger><SelectValue placeholder="Question family" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All question families</SelectItem>
                {reviewPackages.map((entry) => (
                  <SelectItem key={entry.packageId} value={entry.packageId}>
                    {entry.label} · {entry.packageId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setReviewPageNumber(1); }}><SelectTrigger><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>All statuses</SelectItem><SelectItem value="unreviewed">Unreviewed</SelectItem><SelectItem value="needs_fix">Needs fix</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select>
            <Select value={qualityFilter} onValueChange={(value) => setQualityFilter(value as QualityFilter)}><SelectTrigger><ShieldCheck className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All quality states</SelectItem><SelectItem value="ready">Approval ready</SelectItem><SelectItem value="warning">Warnings only</SelectItem><SelectItem value="blocked">Approval blocked</SelectItem><SelectItem value="duplicate">Duplicate signals</SelectItem></SelectContent></Select>
          </div>
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
            <Field label="Reason for needs-fix or rejection"><Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="State the accuracy, language, duplication, explanation, or policy issue" className="min-h-20" /></Field>
            <div className="flex flex-wrap gap-2"><Button onClick={() => void applyStatus('approved')} disabled={updating || selectedIds.size === 0 || !canReview}><CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve</Button><Button variant="outline" onClick={() => void applyStatus('needs_fix')} disabled={updating || selectedIds.size === 0 || !canReview}><AlertTriangle className="mr-1.5 h-4 w-4" /> Needs fix</Button><Button variant="outline" onClick={() => void applyStatus('unreviewed')} disabled={updating || selectedIds.size === 0 || !canReview}><RefreshCw className="mr-1.5 h-4 w-4" /> Return</Button><Button variant="destructive" onClick={() => void applyStatus('rejected')} disabled={updating || selectedIds.size === 0 || !canReview}><XCircle className="mr-1.5 h-4 w-4" /> Reject</Button></div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center gap-3 border-y bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground"><Checkbox checked={allVisibleSelected} onCheckedChange={(checked) => toggleAllVisible(checked === true)} aria-label="Select all visible generated items" /><span>{visibleItemIds.length} visible item(s) across {filteredRuns.length} run(s)</span>{updating && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}</div>
          {loadingReviewPage ? <div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading review queue…</div> : filteredRuns.length === 0 ? <div className="p-12 text-center"><Database className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-3 text-sm font-semibold">No generated items match this view</p><p className="mt-1 text-xs text-muted-foreground">Create a run or clear the filters.</p></div> : <div className="divide-y">{filteredRuns.map(({ run, items }) => <RunSection key={run.id} run={run} items={items} expanded={expandedRuns.has(run.id)} selectedIds={selectedIds} qualityByItem={qualityByItem} duplicates={duplicates} expandedItems={expandedItems} editingItemId={editingItemId} revisingItemId={revisingItemId} canReview={canReview} onToggle={() => setExpandedRuns((current) => { const next = new Set(current); next.has(run.id) ? next.delete(run.id) : next.add(run.id); return next; })} onToggleItem={(id) => setExpandedItems((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; })} onSelect={(id, checked) => setSelectedIds((current) => { const next = new Set(current); checked ? next.add(id) : next.delete(id); return next; })} onSelectRun={(checked) => setSelectedIds((current) => { const next = new Set(current); items.forEach((item) => checked ? next.add(item.id) : next.delete(item.id)); return next; })} onEdit={setEditingItemId} onDecision={(status, id) => void applyStatus(status, [id])} onRevise={async (input) => { try { await reviseItem(input); await refreshReviewPage(); setEditingItemId(null); showToast.success('Revision saved', 'A new immutable generated-item version is ready for review.'); } catch (caught) { showToast.error('Revision failed', caught instanceof Error ? caught.message : 'Unable to save revision.'); } }} />)}</div>}
        </CardContent>
        <div className="flex flex-col gap-3 border-t px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            Page {reviewPage.pagination.page}{reviewPage.pagination.totalPages > 0 ? ` of ${reviewPage.pagination.totalPages}` : ''} · {reviewPage.pagination.totalRuns} matching run(s)
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={String(reviewPageSize)}
              onValueChange={(value) => {
                setReviewPageSize(Number(value));
                setReviewPageNumber(1);
              }}
            >
              <SelectTrigger className="h-8 w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 runs/page</SelectItem>
                <SelectItem value="20">20 runs/page</SelectItem>
                <SelectItem value="50">50 runs/page</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!reviewPage.pagination.hasPreviousPage || loadingReviewPage}
              onClick={() => setReviewPageNumber((current) => Math.max(1, current - 1))}
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Previous
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!reviewPage.pagination.hasNextPage || loadingReviewPage}
              onClick={() => setReviewPageNumber((current) => current + 1)}
            >
              Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RunSection({ run, items, expanded, selectedIds, qualityByItem, duplicates, expandedItems, editingItemId, revisingItemId, canReview, onToggle, onToggleItem, onSelect, onSelectRun, onEdit, onDecision, onRevise }: { run: QuestionStudioRun; items: QuestionStudioItem[]; expanded: boolean; selectedIds: Set<string>; qualityByItem: Map<string, ItemQualityReport>; duplicates: Map<string, DuplicateMatch>; expandedItems: Set<string>; editingItemId: string | null; revisingItemId: string | null; canReview: boolean; onToggle: () => void; onToggleItem: (id: string) => void; onSelect: (id: string, checked: boolean) => void; onSelectRun: (checked: boolean) => void; onEdit: (id: string | null) => void; onDecision: (status: GenerationItemStatus, id: string) => void; onRevise: (input: { itemId: string; stem: string; explanation: string; options: string[]; correctIndex: number; changeReason: string }) => Promise<void> }) {
  const runSelected = items.length > 0 && items.every((item) => selectedIds.has(item.id));
  const blocked = run.items.filter((item) => (qualityByItem.get(item.id)?.blockerCount ?? 0) > 0).length;
  return <div><div className="flex flex-col gap-3 px-4 py-4 xl:flex-row xl:items-center"><div className="flex items-center gap-3"><Checkbox checked={runSelected} onCheckedChange={(checked) => onSelectRun(checked === true)} aria-label={`Select items in ${run.publicCode}`} /><button type="button" onClick={onToggle} className="rounded-md p-1 hover:bg-muted">{expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</button></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-bold">{run.publicCode}</span><StatusBadge tone={runStatusTone(run.status)} dot>{formatStatus(run.status)}</StatusBadge><Badge variant="secondary" className="text-[10px]">{items.length} item(s) in view</Badge>{blocked > 0 && <Badge variant="outline" className="border-destructive/30 text-destructive">{blocked} blocked</Badge>}</div><p className="mt-1 text-xs text-muted-foreground">{runSnapshotText(run, 'subject')} · {runSnapshotText(run, 'exam')} · {runSnapshotText(run, 'difficulty')} · {runSnapshotText(run, 'packageId', runSnapshotText(run, 'patternId'))}</p><p className="mt-1 text-[10px] text-muted-foreground">{new Date(run.createdAt).toLocaleString()} · {run.model ?? run.provider ?? 'generator'}</p></div><div className="grid grid-cols-4 gap-2 text-center text-[10px] xl:w-72"><RunCount label="Review" value={run.items.filter((item) => item.status === 'unreviewed').length} /><RunCount label="Fix" value={run.items.filter((item) => item.status === 'needs_fix').length} /><RunCount label="Approved" value={run.items.filter((item) => item.status === 'approved').length} /><RunCount label="Rejected" value={run.items.filter((item) => item.status === 'rejected').length} /></div></div>{expanded && <div className="border-t bg-muted/10">{items.map((item) => <ReviewItem key={item.id} item={item} quality={qualityByItem.get(item.id) ?? analyzeItemQuality(item.payload)} duplicate={duplicates.get(item.id)} selected={selectedIds.has(item.id)} expanded={expandedItems.has(item.id)} editing={editingItemId === item.id} revising={revisingItemId === item.id} canReview={canReview} onSelected={(checked) => onSelect(item.id, checked)} onExpanded={() => onToggleItem(item.id)} onEdit={() => onEdit(editingItemId === item.id ? null : item.id)} onDecision={(status) => onDecision(status, item.id)} onRevise={onRevise} />)}</div>}</div>;
}

function ReviewItem({ item, quality, duplicate, selected, expanded, editing, revising, canReview, onSelected, onExpanded, onEdit, onDecision, onRevise }: { item: QuestionStudioItem; quality: ItemQualityReport; duplicate?: DuplicateMatch; selected: boolean; expanded: boolean; editing: boolean; revising: boolean; canReview: boolean; onSelected: (checked: boolean) => void; onExpanded: () => void; onEdit: () => void; onDecision: (status: GenerationItemStatus) => void; onRevise: (input: { itemId: string; stem: string; explanation: string; options: string[]; correctIndex: number; changeReason: string }) => Promise<void> }) {
  const stem = itemStem(item.payload) || 'Generated stem unavailable';
  const cpId = firstText(item.payload, ['selectedCpId', 'canonicalProblemId', 'cpId'], '');
  return <div className="border-b px-4 py-4 last:border-b-0"><div className="flex items-start gap-3"><Checkbox checked={selected} onCheckedChange={(checked) => onSelected(checked === true)} aria-label={`Select generated item ${item.itemNumber}`} /><button type="button" onClick={onExpanded} className="mt-0.5 rounded-md p-1 hover:bg-muted">{expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</button><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[10px] text-muted-foreground">Item {item.itemNumber} · v{item.currentVersionNumber}</span>{cpId && <Badge variant="secondary" className="font-mono text-[10px]">{cpId}</Badge>}<StatusBadge tone={itemStatusTone(item.status)}>{formatStatus(item.status)}</StatusBadge><Badge variant="outline" className={cn('text-[10px]', qualityTone(quality))}>{quality.readyForApproval ? quality.warningCount ? `${quality.score} · warnings` : `${quality.score} · ready` : `${quality.score} · blocked`}</Badge>{duplicate && <Badge variant="outline" className="border-warning/30 text-warning">{duplicate.exact ? 'Exact duplicate' : `${Math.round(duplicate.similarity * 100)}% similar`}</Badge>}{item.acceptedQuestionId && <Badge className="bg-success/10 text-success hover:bg-success/10">In Question Bank</Badge>}</div><p className="mt-2 text-sm leading-relaxed">{stem}</p>{item.retryReason && <p className="mt-2 text-xs text-warning">Review reason: {item.retryReason}</p>}<div className="mt-3 flex flex-wrap gap-2">{item.acceptedQuestionId ? <Button asChild size="sm" variant="outline"><Link to={`/content/questions/${item.acceptedQuestionId}`}><ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open canonical question</Link></Button> : <><Button size="sm" variant="outline" onClick={onEdit} disabled={!canReview}><PencilLine className="mr-1.5 h-3.5 w-3.5" /> {editing ? 'Close editor' : 'Revise'}</Button><Button size="sm" onClick={() => onDecision('approved')} disabled={!canReview || quality.blockerCount > 0}><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Approve</Button><Button size="sm" variant="outline" onClick={() => onDecision('needs_fix')} disabled={!canReview}><AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> Needs fix</Button><Button size="sm" variant="ghost" onClick={() => onDecision('rejected')} disabled={!canReview} className="text-destructive"><XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject</Button></>}</div></div></div>{expanded && <ItemInspection item={item} quality={quality} duplicate={duplicate} />}{editing && !item.acceptedQuestionId && <RevisionEditor item={item} saving={revising} onCancel={onEdit} onSave={onRevise} />}</div>;
}

function ItemInspection({ item, quality, duplicate }: { item: QuestionStudioItem; quality: ItemQualityReport; duplicate?: DuplicateMatch }) {
  const options = itemOptionValues(item.payload);
  const stimulusSvgs = itemStimulusSvgs(item.payload);
  const optionSvgs = itemOptionSvgs(item.payload);
  const correctIndex = itemCorrectIndex(item.payload);
  const visual = optionSvgs.length > 0;
  return <div className="ml-8 mt-4 grid gap-4 rounded-xl border bg-background p-4 lg:ml-16 lg:grid-cols-[1fr_1fr]"><div>{stimulusSvgs.length > 0 && <div className="mb-4"><p className="mb-2 text-xs font-semibold">Question figures</p><div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{stimulusSvgs.map((svg, index) => <SpatialSvgFigure key={`${item.id}-stimulus-${index}`} svg={svg} label={`Figure ${index + 1}`} />)}</div></div>}<p className="mb-2 text-xs font-semibold">Answer options</p>{visual ? <div className="grid gap-2 sm:grid-cols-2">{optionSvgs.map((svg, index) => <div key={`${item.id}-${index}`} className={cn('rounded-lg', index === correctIndex && 'ring-2 ring-success/50')}><SpatialSvgFigure svg={svg} label={`Option ${String.fromCharCode(65 + index)}`} /></div>)}</div> : <div className="space-y-2">{options.map((option, index) => <div key={`${item.id}-${index}`} className={cn('rounded-md border px-3 py-2 text-xs', index === correctIndex && 'border-success/40 bg-success/5 text-success')}><span className="mr-2 font-mono font-bold">{String.fromCharCode(65 + index)}.</span>{option || <span className="italic">Empty option</span>}</div>)}</div>}<p className="mt-4 text-xs font-semibold">Explanation</p><p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">{itemExplanation(item.payload) || 'No explanation recorded.'}</p>{itemFormulaLatex(item.payload) && <div className="math-only mt-2 overflow-x-auto text-xs"><span>{`\\(${itemFormulaLatex(item.payload)}\\)`}</span></div>}{itemExplanationSvgs(item.payload).map((svg, index) => <SpatialSvgFigure key={`${item.id}-solution-${index}`} svg={svg} label={`Solved Venn diagram ${index + 1}`} />)}</div><div><div className={cn('rounded-lg border p-3', qualityTone(quality))}><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold">Production quality gate</p><span className="text-lg font-bold">{quality.score}</span></div><p className="mt-1 text-[11px]">{quality.blockerCount} blocker(s) · {quality.warningCount} warning(s)</p></div><div className="mt-3 space-y-2">{quality.issues.length === 0 ? <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/5 p-3 text-xs text-success"><CheckCircle2 className="h-4 w-4" /> No automatic quality issues detected.</div> : quality.issues.map((issue) => <div key={`${issue.code}-${issue.field}`} className={cn('flex items-start gap-2 rounded-md border p-3 text-xs', issue.severity === 'blocker' ? 'border-destructive/30 bg-destructive/5 text-destructive' : 'border-warning/30 bg-warning/5 text-warning')}><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /><div><p className="font-semibold">{issue.message}</p><p className="mt-0.5 text-[10px] uppercase tracking-wide opacity-70">{issue.field} · {issue.code}</p></div></div>)}</div>{duplicate && <p className="mt-3 text-[11px] text-muted-foreground">Closest match: {duplicate.matchedRunCode} · {Math.round(duplicate.similarity * 100)}% similarity</p>}</div></div>;
}

function RevisionEditor({ item, saving, onCancel, onSave }: { item: QuestionStudioItem; saving: boolean; onCancel: () => void; onSave: (input: { itemId: string; stem: string; explanation: string; options: string[]; correctIndex: number; changeReason: string }) => Promise<void> }) {
  const visualOptions = itemOptionSvgs(item.payload);
  const [stem, setStem] = useState(() => itemStem(item.payload));
  const [explanation, setExplanation] = useState(() => itemExplanation(item.payload));
  const [options, setOptions] = useState(() => { const current = itemOptionValues(item.payload); return current.length >= 2 ? current : ['', '', '', '']; });
  const [correctIndex, setCorrectIndex] = useState(() => Math.max(0, itemCorrectIndex(item.payload)));
  const [changeReason, setChangeReason] = useState('Editorial correction during generated-question review');
  const draftQuality = analyzeItemQuality({ ...(item.payload ?? {}), stem, text: stem, explanation, options, correctIndex });
  const updateOption = (index: number, value: string) => setOptions((current) => current.map((option, optionIndex) => optionIndex === index ? value : option));
  return <div className="ml-8 mt-4 rounded-xl border border-primary/20 bg-primary/[0.03] p-4 lg:ml-16"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">Create immutable revision</p><p className="mt-1 text-xs text-muted-foreground">Saving creates version {item.currentVersionNumber + 1}; the previous payload remains unchanged.</p></div><Button size="icon" variant="ghost" onClick={onCancel}><X className="h-4 w-4" /></Button></div><div className="mt-4 grid gap-4 lg:grid-cols-2"><Field label="Question stem"><Textarea value={stem} onChange={(event) => setStem(event.target.value)} className="min-h-32" /></Field><Field label="Question-specific explanation"><Textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} className="min-h-32" /></Field></div>{visualOptions.length > 0 ? <div className="mt-4"><p className="mb-2 text-xs font-semibold">Correct visual option</p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{visualOptions.map((svg, index) => <button type="button" key={index} onClick={() => setCorrectIndex(index)} className={cn('rounded-lg text-left', correctIndex === index ? 'ring-2 ring-success/60' : 'ring-1 ring-border')}><SpatialSvgFigure svg={svg} label={`Option ${String.fromCharCode(65 + index)}`} /></button>)}</div><p className="mt-2 text-[11px] text-muted-foreground">Spatial figures remain immutable in this editor; regenerate the item if the geometry itself needs correction.</p></div> : <div className="mt-4 grid gap-3 md:grid-cols-2">{options.map((option, index) => <div key={index} className="flex items-center gap-2"><button type="button" onClick={() => setCorrectIndex(index)} className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-xs font-bold', correctIndex === index ? 'border-success bg-success/10 text-success' : 'bg-background text-muted-foreground')}>{String.fromCharCode(65 + index)}</button><Input value={option} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Option ${String.fromCharCode(65 + index)}`} /></div>)}</div>}<div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end"><Field label="Revision reason"><Input value={changeReason} onChange={(event) => setChangeReason(event.target.value)} /></Field><div className="flex flex-wrap gap-2"><Badge variant="outline" className={cn('h-9 px-3', qualityTone(draftQuality))}>{draftQuality.readyForApproval ? `Quality ${draftQuality.score}` : `${draftQuality.blockerCount} blocker(s)`}</Badge><Button variant="outline" onClick={onCancel}>Cancel</Button><Button disabled={saving || !draftQuality.readyForApproval || !changeReason.trim()} onClick={() => void onSave({ itemId: item.id, stem, explanation, options, correctIndex, changeReason })}>{saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />} Save revision</Button></div></div>{draftQuality.issues.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{draftQuality.issues.map((issue) => <Badge key={`${issue.code}-${issue.field}`} variant="outline" className={issue.severity === 'blocker' ? 'border-destructive/30 text-destructive' : 'border-warning/30 text-warning'}>{issue.message}</Badge>)}</div>}</div>;
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) { return <div className={className}><Label className="mb-1.5 block text-xs">{label}</Label>{children}</div>; }
function Metric({ label, value, icon, tone = 'neutral' }: { label: string; value: number | string; icon: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'info' }) { const toneClass = tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : tone === 'info' ? 'text-info' : 'text-muted-foreground'; return <Card><CardContent className="p-4"><div className={cn('flex items-center gap-2 text-xs', toneClass)}>{icon}{label}</div><p className="mt-2 text-xl font-bold">{value}</p></CardContent></Card>; }
function RunCount({ label, value }: { label: string; value: number }) { return <div className="rounded-md border bg-background px-2 py-1.5"><p className="font-bold text-foreground">{value}</p><p className="text-muted-foreground">{label}</p></div>; }
