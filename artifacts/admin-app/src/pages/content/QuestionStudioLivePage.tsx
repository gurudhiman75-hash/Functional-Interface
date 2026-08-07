import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Database,
  FileCheck2,
  Filter,
  Layers3,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
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
import { Textarea } from '@/components/ui/textarea';
import { EXAMS } from '@/data/exams';
import {
  type GenerationItemStatus,
  type GenerationRunStatus,
  type QuestionStudioItem,
  type QuestionStudioRun,
} from '@/features/question-studio/api';
import { QuestionExplanationDisclosure } from '@/features/question-studio/QuestionExplanationDisclosure';
import { useQuestionStudio } from '@/features/question-studio/useQuestionStudio';
import { cn } from '@/lib/utils';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

const ALL = 'all';

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
};

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

function itemOptions(payload: Record<string, unknown> | null) {
  const options = payload?.options;
  if (!Array.isArray(options)) return [];
  return options
    .map((option) => {
      if (typeof option === 'string') return option.trim();
      if (typeof option === 'object' && option !== null && !Array.isArray(option)) {
        const label = (option as Record<string, unknown>).label;
        return typeof label === 'string' ? label.trim() : '';
      }
      return String(option ?? '').trim();
    })
    .filter(Boolean);
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

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function runSnapshotText(run: QuestionStudioRun, key: string, fallback = '—') {
  const value = run.requestSnapshot?.[key];
  return typeof value === 'string' && value.trim() ? value : fallback;
}

export function QuestionStudioLivePage() {
  const { hasPermission } = useAdminPermissions();
  const canRun = hasPermission('content.generation.run');
  const canReview = hasPermission('content.generation.review');
  const {
    dashboard,
    capabilities,
    loading,
    generating,
    updating,
    error,
    refresh,
    generate,
    updateItems,
  } = useQuestionStudio();

  const [exam, setExam] = useState(EXAMS[0].code);
  const [packageId, setPackageId] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [language, setLanguage] = useState('en');
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [reason, setReason] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [expandedRuns, setExpandedRuns] = useState<Set<string>>(() => new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => new Set());

  const enabledPackages = useMemo(
    () => capabilities.packages.filter((entry) => entry.enabled),
    [capabilities.packages],
  );

  useEffect(() => {
    if (!packageId && enabledPackages[0]) {
      setPackageId(enabledPackages[0].packageId);
    }
  }, [enabledPackages, packageId]);

  const activePackage = enabledPackages.find((entry) => entry.packageId === packageId);
  const supportedLanguages = useMemo(
    () => activePackage?.supportedLanguages.length
      ? activePackage.supportedLanguages
      : ['en'],
    [activePackage],
  );

  useEffect(() => {
    if (!supportedLanguages.includes(language)) {
      setLanguage(supportedLanguages[0] ?? 'en');
    }
  }, [language, supportedLanguages]);

  const allItems = useMemo(
    () => dashboard.runs.flatMap((run) => run.items.map((item) => ({ run, item }))),
    [dashboard.runs],
  );

  const filteredRuns = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return dashboard.runs
      .map((run) => {
        const items = run.items.filter((item) => {
          if (statusFilter !== ALL && item.status !== statusFilter) return false;
          if (!normalizedSearch) return true;
          const haystack = [
            run.publicCode,
            runSnapshotText(run, 'exam', ''),
            runSnapshotText(run, 'subject', ''),
            firstText(item.payload, ['text', 'stem'], ''),
            firstText(item.payload, ['topic'], ''),
            firstText(item.payload, ['subtopic'], ''),
            firstText(item.payload, ['patternId', 'packageId'], ''),
          ].join(' ').toLowerCase();
          return haystack.includes(normalizedSearch);
        });
        return { run, items };
      })
      .filter(({ items }) => items.length > 0 || (!search.trim() && statusFilter === ALL));
  }, [dashboard.runs, search, statusFilter]);

  const visibleItemIds = useMemo(
    () => filteredRuns.flatMap(({ items }) => items.map((item) => item.id)),
    [filteredRuns],
  );

  const stats = useMemo(() => {
    const values = {
      runs: dashboard.runs.length,
      total: allItems.length,
      unreviewed: 0,
      needsFix: 0,
      approved: 0,
      rejected: 0,
      actualCostPaise: 0,
    };
    for (const { item } of allItems) {
      if (item.status === 'unreviewed') values.unreviewed += 1;
      if (item.status === 'needs_fix') values.needsFix += 1;
      if (item.status === 'approved') values.approved += 1;
      if (item.status === 'rejected') values.rejected += 1;
    }
    values.actualCostPaise = dashboard.runs.reduce(
      (total, run) => total + (run.actualCostPaise ?? 0),
      0,
    );
    return values;
  }, [allItems, dashboard.runs]);

  const toggleSelected = (itemId: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(itemId);
      else next.delete(itemId);
      return next;
    });
  };

  const toggleAllVisible = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      for (const itemId of visibleItemIds) {
        if (checked) next.add(itemId);
        else next.delete(itemId);
      }
      return next;
    });
  };

  const toggleRun = (runId: string) => {
    setExpandedRuns((current) => {
      const next = new Set(current);
      if (next.has(runId)) next.delete(runId);
      else next.add(runId);
      return next;
    });
  };

  const toggleItem = (itemId: string) => {
    setExpandedItems((current) => {
      const next = new Set(current);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const handleGenerate = async () => {
    if (!activePackage) {
      showToast.error('Generation package required', 'Select an enabled Quant V4 package.');
      return;
    }
    try {
      const selectedExam = EXAMS.find((entry) => entry.code === exam);
      const result = await generate({
        exam: selectedExam?.name ?? exam,
        subject: 'Quantitative Aptitude',
        difficulty,
        count: Math.min(capabilities.maxBatchSize, Math.max(1, count)),
        packageId: activePackage.packageId,
        topic: activePackage.topic,
        subtopic: activePackage.subtopic,
        language,
        seed: seed.trim() || undefined,
      });
      setExpandedRuns((current) => new Set(current).add(result.id));
      showToast.success('Generation run created', `${result.publicCode} produced ${result.itemCount} review items.`);
    } catch (caught) {
      showToast.error('Generation failed', caught instanceof Error ? caught.message : 'Unable to generate questions.');
    }
  };

  const applyStatus = async (status: GenerationItemStatus) => {
    const ids = [...selectedIds];
    if (ids.length === 0) {
      showToast.info('No items selected', 'Select one or more generated questions first.');
      return;
    }
    if ((status === 'needs_fix' || status === 'rejected') && !reason.trim()) {
      showToast.error('Reason required', 'Describe the issue before marking items needs-fix or rejected.');
      return;
    }

    try {
      const result = await updateItems({
        itemIds: ids,
        status,
        reason: reason.trim() || undefined,
      });
      setSelectedIds(new Set());
      setReason('');
      showToast.success('Review state updated', `${result.updatedCount} item(s) moved to ${formatStatus(status)}.`);
    } catch (caught) {
      showToast.error('Review update failed', caught instanceof Error ? caught.message : 'Unable to update review state.');
    }
  };

  const allVisibleSelected = visibleItemIds.length > 0 && visibleItemIds.every((id) => selectedIds.has(id));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Studio"
        description="Generate Quant V4 questions, review immutable run items, and control their production lifecycle from Neon."
        icon={<Sparkles className="h-5 w-5" />}
        actions={(
          <>
            <Badge variant="outline" className="gap-1.5 border-success/30 bg-success/5 text-success">
              <Database className="h-3.5 w-3.5" /> Live database
            </Badge>
            <Button variant="outline" onClick={() => void refresh()} disabled={loading || generating || updating}>
              <RefreshCw className={cn('mr-1.5 h-4 w-4', loading && 'animate-spin')} /> Refresh
            </Button>
          </>
        )}
      />

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Question Studio could not complete the last request</p>
            <p className="mt-1 text-xs opacity-90">{error}</p>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <Metric label="Generation runs" value={stats.runs} icon={<Layers3 className="h-4 w-4" />} />
        <Metric label="Total items" value={stats.total} icon={<FileCheck2 className="h-4 w-4" />} />
        <Metric label="Awaiting review" value={stats.unreviewed} icon={<Clock3 className="h-4 w-4" />} tone={stats.unreviewed > 0 ? 'info' : 'neutral'} />
        <Metric label="Needs fix" value={stats.needsFix} icon={<AlertTriangle className="h-4 w-4" />} tone={stats.needsFix > 0 ? 'warning' : 'neutral'} />
        <Metric label="Approved" value={stats.approved} icon={<CheckCircle2 className="h-4 w-4" />} tone="success" />
        <Metric label="Recorded cost" value={`₹${(stats.actualCostPaise / 100).toFixed(2)}`} icon={<CircleDollarSign className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" /> Create generation run
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Uses ExamTree Quant V4 and persists the run, item records, immutable payload versions, audit event, and outbox event in one transaction.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <Field label="Exam">
              <Select value={exam} onValueChange={setExam}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXAMS.map((entry) => <SelectItem key={entry.code} value={entry.code}>{entry.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Generation package" className="xl:col-span-2">
              <Select value={packageId} onValueChange={setPackageId}>
                <SelectTrigger><SelectValue placeholder="Select package" /></SelectTrigger>
                <SelectContent>
                  {enabledPackages.map((entry) => (
                    <SelectItem key={entry.packageId} value={entry.packageId}>
                      {entry.packageId} · {entry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {capabilities.difficulties.map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Language">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((entry) => <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry] ?? entry}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Question count">
              <Input
                type="number"
                min={1}
                max={capabilities.maxBatchSize}
                value={count}
                onChange={(event) => setCount(Number(event.target.value) || 1)}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <Field label="Optional deterministic seed">
              <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="Leave blank for a fresh generated seed" />
            </Field>
            <Button onClick={() => void handleGenerate()} disabled={loading || generating || !activePackage || !canRun} className="min-w-44">
              {generating ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
              {generating ? 'Generating…' : 'Generate and persist'}
            </Button>
          </div>

          {activePackage && (
            <div className="rounded-lg border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{activePackage.topic} · {activePackage.subtopic}</span>
              {' '}· {activePackage.cpIds.length} active canonical problem(s) · {capabilities.generationSystem}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
            <div>
              <CardTitle className="text-base">Live review inventory</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Filter generated items, inspect immutable payloads, and apply controlled bulk review decisions.</p>
            </div>
            <Badge variant="outline">{selectedIds.size} selected</Badge>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_190px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search run code, stem, topic, package or exam" className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All item statuses</SelectItem>
                <SelectItem value="unreviewed">Unreviewed</SelectItem>
                <SelectItem value="needs_fix">Needs fix</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
            <Field label="Required reason for needs-fix or rejection">
              <Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="State the validation, accuracy, language, duplication, or policy issue" className="min-h-20" />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void applyStatus('approved')} disabled={updating || selectedIds.size === 0 || !canReview}>
                <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve
              </Button>
              <Button variant="outline" onClick={() => void applyStatus('needs_fix')} disabled={updating || selectedIds.size === 0 || !canReview}>
                <AlertTriangle className="mr-1.5 h-4 w-4" /> Needs fix
              </Button>
              <Button variant="outline" onClick={() => void applyStatus('unreviewed')} disabled={updating || selectedIds.size === 0 || !canReview}>
                <RefreshCw className="mr-1.5 h-4 w-4" /> Return to review
              </Button>
              <Button variant="destructive" onClick={() => void applyStatus('rejected')} disabled={updating || selectedIds.size === 0 || !canReview}>
                <XCircle className="mr-1.5 h-4 w-4" /> Reject
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex items-center gap-3 border-y bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">
            <Checkbox checked={allVisibleSelected} onCheckedChange={(checked) => toggleAllVisible(checked === true)} aria-label="Select all visible generated items" />
            <span>{visibleItemIds.length} visible item(s) across {filteredRuns.length} run(s)</span>
            {updating && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading Question Studio from Neon…
            </div>
          ) : filteredRuns.length === 0 ? (
            <div className="p-12 text-center">
              <Database className="mx-auto h-7 w-7 text-muted-foreground" />
              <p className="mt-3 text-sm font-semibold">No generated items match this view</p>
              <p className="mt-1 text-xs text-muted-foreground">Create a generation run or clear the current filters.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredRuns.map(({ run, items }) => {
                const expanded = expandedRuns.has(run.id);
                const runSelected = items.length > 0 && items.every((item) => selectedIds.has(item.id));
                return (
                  <div key={run.id}>
                    <div className="flex flex-col gap-3 px-4 py-4 xl:flex-row xl:items-center">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={runSelected}
                          onCheckedChange={(checked) => {
                            setSelectedIds((current) => {
                              const next = new Set(current);
                              for (const item of items) {
                                if (checked === true) next.add(item.id);
                                else next.delete(item.id);
                              }
                              return next;
                            });
                          }}
                          aria-label={`Select items in ${run.publicCode}`}
                        />
                        <button
                          type="button"
                          onClick={() => toggleRun(run.id)}
                          className="rounded-md p-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-expanded={expanded}
                          aria-controls={`question-studio-run-${run.id}`}
                          aria-label={`${expanded ? 'Collapse' : 'Expand'} generation run ${run.publicCode}`}
                        >
                          {expanded
                            ? <ChevronDown className="h-4 w-4" aria-hidden="true" />
                            : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
                        </button>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold">{run.publicCode}</span>
                          <StatusBadge tone={runStatusTone(run.status)} dot>{formatStatus(run.status)}</StatusBadge>
                          <Badge variant="secondary" className="text-[10px]">{items.length} visible / {run.items.length} total</Badge>
                          <Badge variant="outline" className="text-[10px]">Attempt {run.attemptNumber}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {runSnapshotText(run, 'exam')} · {runSnapshotText(run, 'subject')} · {runSnapshotText(run, 'difficulty')} · {runSnapshotText(run, 'packageId', runSnapshotText(run, 'patternId'))}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {new Date(run.createdAt).toLocaleString()} · {run.model ?? run.provider ?? 'generator'} · {(run.promptTokens + run.completionTokens).toLocaleString()} tokens
                        </p>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] xl:w-72">
                        <RunCount label="Review" value={run.items.filter((item) => item.status === 'unreviewed').length} />
                        <RunCount label="Needs fix" value={run.items.filter((item) => item.status === 'needs_fix').length} />
                        <RunCount label="Approved" value={run.items.filter((item) => item.status === 'approved').length} />
                        <RunCount label="Rejected" value={run.items.filter((item) => item.status === 'rejected').length} />
                      </div>
                    </div>

                    {expanded && (
                      <div
                        id={`question-studio-run-${run.id}`}
                        className="border-t bg-muted/10"
                        aria-label={`Generated items in ${run.publicCode}`}
                      >
                        {items.map((item) => (
                          <GeneratedItemRow
                            key={item.id}
                            item={item}
                            selected={selectedIds.has(item.id)}
                            expanded={expandedItems.has(item.id)}
                            onSelected={(checked) => toggleSelected(item.id, checked)}
                            onExpanded={() => toggleItem(item.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {dashboard.recipes.length > 0 && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Generation recipes</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Current immutable recipe versions available in the content schema.</p>
            </div>
            <Badge variant="outline">{dashboard.recipes.length}</Badge>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {dashboard.recipes.slice(0, 12).map((recipe) => (
              <div key={recipe.id} className="rounded-xl border bg-muted/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{recipe.name}</p>
                  <Badge variant="secondary">v{recipe.currentVersionNumber}</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{recipe.versionNotes || 'No version notes recorded.'}</p>
                <p className="mt-3 text-[10px] text-muted-foreground">Updated {new Date(recipe.updatedAt).toLocaleString()} · {recipe.visibility}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs">{label}</Label>
      {children}
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
  tone = 'neutral',
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'info';
}) {
  const toneClass = tone === 'success'
    ? 'text-success'
    : tone === 'warning'
      ? 'text-warning'
      : tone === 'info'
        ? 'text-info'
        : 'text-muted-foreground';
  return (
    <Card>
      <CardContent className="p-4">
        <div className={cn('flex items-center gap-2 text-xs', toneClass)}>{icon}{label}</div>
        <p className="mt-2 text-xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function RunCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border bg-background px-2 py-1.5">
      <p className="font-bold text-foreground">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}

function GeneratedItemRow({
  item,
  selected,
  expanded,
  onSelected,
  onExpanded,
}: {
  item: QuestionStudioItem;
  selected: boolean;
  expanded: boolean;
  onSelected: (checked: boolean) => void;
  onExpanded: () => void;
}) {
  const stem = firstText(item.payload, ['text', 'stem'], 'Generated stem unavailable');
  const options = itemOptions(item.payload);
  const correctIndex = Number(item.payload?.correctIndex ?? item.payload?.correct ?? -1);
  const detailsId = `question-studio-item-${item.id}`;

  return (
    <div className="border-b px-4 py-3 last:border-b-0">
      <div className="flex items-start gap-3">
        <Checkbox checked={selected} onCheckedChange={(checked) => onSelected(checked === true)} aria-label={`Select generated item ${item.itemNumber}`} />
        <button
          type="button"
          onClick={onExpanded}
          className="mt-0.5 rounded-md p-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-expanded={expanded}
          aria-controls={detailsId}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} generated item ${item.itemNumber}`}
        >
          {expanded
            ? <ChevronDown className="h-4 w-4" aria-hidden="true" />
            : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground">Item {item.itemNumber} · v{item.currentVersionNumber}</span>
            <StatusBadge tone={itemStatusTone(item.status)}>{formatStatus(item.status)}</StatusBadge>
            <Badge variant="outline" className="text-[10px]">{firstText(item.payload, ['difficulty', 'difficultyLabel'], 'Unrated')}</Badge>
            <Badge variant="outline" className="text-[10px]">{firstText(item.payload, ['patternId', 'packageId'], 'Pattern pending')}</Badge>
          </div>
          <p className="mt-2 max-w-full whitespace-pre-wrap break-words text-sm leading-relaxed [overflow-wrap:anywhere]">{stem}</p>
          {item.retryReason && <p className="mt-2 text-xs text-warning">Review reason: {item.retryReason}</p>}
        </div>
      </div>

      {expanded && (
        <div
          id={detailsId}
          className="mt-3 grid min-w-0 max-w-full gap-4 rounded-lg border bg-background p-3 sm:ml-16 sm:p-4 xl:grid-cols-2"
          aria-label={`Details for generated item ${item.itemNumber}`}
        >
          <div>
            <p className="mb-2 text-xs font-semibold">Answer options</p>
            {options.length > 0 ? (
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className={cn(
                      'max-w-full break-words rounded-md border px-3 py-2 text-xs [overflow-wrap:anywhere]',
                      index === correctIndex && 'border-success/40 bg-success/5 text-success',
                    )}
                  >
                    <span className="mr-2 font-mono font-bold">{String.fromCharCode(65 + index)}.</span>{option}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-muted-foreground">No options in the current payload.</p>}
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold">Explanation</p>
            <QuestionExplanationDisclosure payload={item.payload} />
            <div className="mt-4 grid min-w-0 grid-cols-1 gap-2 text-[10px] text-muted-foreground sm:grid-cols-2">
              <span>Topic: {firstText(item.payload, ['topic'])}</span>
              <span>Subtopic: {firstText(item.payload, ['subtopic'])}</span>
              <span>Language: {firstText(item.payload, ['language'])}</span>
              <span>Seed: {firstText(item.payload, ['seed'])}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
