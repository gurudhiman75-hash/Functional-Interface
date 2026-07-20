import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  Archive,
  ArrowDown,
  ArrowUp,
  Box,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  PencilLine,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  createTestSeries,
  getSeriesCatalog,
  getTestSeries,
  transitionTestSeries,
  updateTestSeries,
  type PlanningExamVersion,
  type SeriesCatalogTest,
  type TestSeries,
  type TestSeriesInput,
} from '@/features/test-planning/api';
import { moveSeriesItem, planningStatusTone, seriesIssues } from '@/features/test-planning/model';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

interface SeriesCatalog {
  examVersions: PlanningExamVersion[];
  tests: SeriesCatalogTest[];
}

interface SeriesItemDraft {
  testId: string;
  accessMode: 'free' | 'included' | 'premium';
  unlockAfterPrevious: boolean;
}

interface SeriesDraft {
  id?: string;
  expectedCurrentVersionNumber?: number;
  examVersionId: string;
  code: string;
  name: string;
  status: 'draft' | 'active' | 'deprecated' | 'archived';
  description: string;
  validityDays: number | null;
  requireSequentialCompletion: boolean;
  minimumScorePercent: number;
  changeReason: string;
  items: SeriesItemDraft[];
}

const EMPTY_CATALOG: SeriesCatalog = { examVersions: [], tests: [] };

function emptyDraft(catalog: SeriesCatalog): SeriesDraft {
  return {
    examVersionId: catalog.examVersions[0]?.id ?? '',
    code: `SER-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
    name: '',
    status: 'draft',
    description: '',
    validityDays: 365,
    requireSequentialCompletion: false,
    minimumScorePercent: 0,
    changeReason: 'Create Test Series',
    items: [],
  };
}

function fromSeries(series: TestSeries): SeriesDraft {
  return {
    id: series.id,
    expectedCurrentVersionNumber: series.currentVersionNumber,
    examVersionId: series.examVersionId,
    code: series.code,
    name: series.name,
    status: series.status,
    description: series.description ?? '',
    validityDays: series.validityDays,
    requireSequentialCompletion: series.progressionRules.requireSequentialCompletion === true,
    minimumScorePercent: Number(series.progressionRules.minimumScorePercent ?? 0),
    changeReason: 'Revise Test Series',
    items: series.items.map((item) => ({
      testId: item.testId,
      accessMode: item.accessMode,
      unlockAfterPrevious: item.availability.unlockAfterPrevious === true,
    })),
  };
}

function toInput(draft: SeriesDraft): TestSeriesInput {
  return {
    expectedCurrentVersionNumber: draft.expectedCurrentVersionNumber,
    examVersionId: draft.examVersionId,
    code: draft.code,
    name: draft.name,
    status: draft.status,
    description: draft.description,
    validityDays: draft.validityDays,
    progressionRules: {
      requireSequentialCompletion: draft.requireSequentialCompletion,
      minimumScorePercent: draft.minimumScorePercent,
    },
    settings: {},
    changeReason: draft.changeReason,
    items: draft.items.map((item) => ({
      testId: item.testId,
      accessMode: item.accessMode,
      availability: { unlockAfterPrevious: item.unlockAfterPrevious },
    })),
  };
}

function draftIssues(draft: SeriesDraft, catalog: SeriesCatalog): string[] {
  const issues: string[] = [];
  if (!draft.examVersionId) issues.push('Select an exam version.');
  if (draft.code.trim().length < 3) issues.push('Series code is required.');
  if (draft.name.trim().length < 3) issues.push('Series name is required.');
  if (draft.changeReason.trim().length < 3) issues.push('Change reason is required.');
  if (draft.minimumScorePercent < 0 || draft.minimumScorePercent > 100) issues.push('Minimum score must be between 0 and 100.');
  if (draft.status === 'active' && draft.items.length === 0) issues.push('Active series must contain at least one test.');
  const ids = new Set<string>();
  for (const item of draft.items) {
    if (ids.has(item.testId)) issues.push('A test appears more than once.');
    ids.add(item.testId);
    const test = catalog.tests.find((candidate) => candidate.id === item.testId);
    if (!test) issues.push('A selected test no longer exists.');
    else if (test.examVersionId !== draft.examVersionId) issues.push(`${test.publicCode} belongs to another exam version.`);
    else if (draft.status === 'active' && !['qa_approved', 'scheduled', 'live', 'completed'].includes(test.status)) {
      issues.push(`${test.publicCode} is ${test.status.replace(/_/g, ' ')} and is not ready for an active series.`);
    }
  }
  return Array.from(new Set(issues));
}

export function TestSeriesWorkspacePage() {
  const { hasPermission } = useAdminPermissions();
  const [catalog, setCatalog] = useState<SeriesCatalog>(EMPTY_CATALOG);
  const [series, setSeries] = useState<TestSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [draft, setDraft] = useState<SeriesDraft | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catalogResponse, seriesResponse] = await Promise.all([getSeriesCatalog(), getTestSeries()]);
      setCatalog({ examVersions: catalogResponse.examVersions, tests: catalogResponse.tests });
      setSeries(seriesResponse.series);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Test Series.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return series.filter((item) => {
      if (status !== 'all' && item.status !== status) return false;
      if (!normalized) return true;
      return [item.code, item.name, item.examName, item.examFamilyName]
        .join(' ').toLowerCase().includes(normalized);
    });
  }, [search, series, status]);

  const save = async () => {
    if (!draft) return;
    const issues = draftIssues(draft, catalog);
    if (issues.length > 0) {
      showToast.error('Series validation failed', issues[0]);
      return;
    }
    setMutating(true);
    try {
      if (draft.id) await updateTestSeries(draft.id, toInput(draft));
      else await createTestSeries(toInput(draft));
      setDraft(null);
      await refresh();
      showToast.success(draft.id ? 'Series version created' : 'Test Series created', 'Ordered membership is saved canonically.');
    } catch (caught) {
      showToast.error('Unable to save Test Series', caught instanceof Error ? caught.message : 'Series save failed.');
    } finally {
      setMutating(false);
    }
  };

  const lifecycle = async (item: TestSeries, action: 'activate' | 'deprecate' | 'archive' | 'restore') => {
    setMutating(true);
    try {
      await transitionTestSeries(item.id, action, `${action} ${item.code} from Test Series workspace`);
      await refresh();
      showToast.success('Test Series lifecycle updated', `${item.code} was updated.`);
    } catch (caught) {
      showToast.error('Series action failed', caught instanceof Error ? caught.message : 'Unable to update series.');
    } finally {
      setMutating(false);
    }
  };

  const metrics = useMemo(() => ({
    total: series.length,
    active: series.filter((item) => item.status === 'active').length,
    tests: series.reduce((sum, item) => sum + item.items.length, 0),
    free: series.reduce((sum, item) => sum + item.items.filter((test) => test.accessMode === 'free').length, 0),
  }), [series]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Test Series"
        description="Canonical ordered test collections with access, validity, progression and release-readiness rules."
        icon={<Box className="h-5 w-5" />}
        actions={(
          <>
            <Badge variant="outline" className="border-success/30 bg-success/5 text-success"><ShieldCheck className="mr-1 h-3.5 w-3.5" /> Versioned membership</Badge>
            <Button variant="outline" disabled={loading || mutating} onClick={() => void refresh()}><RefreshCw className={cn('mr-1.5 h-4 w-4', loading && 'animate-spin')} /> Refresh</Button>
            <Button disabled={!hasPermission('tests.create')} onClick={() => setDraft(emptyDraft(catalog))}><Plus className="mr-1.5 h-4 w-4" /> New series</Button>
          </>
        )}
      />

      {error && <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<Box className="h-4 w-4" />} label="Series" value={metrics.total} />
        <Metric icon={<CheckCircle2 className="h-4 w-4" />} label="Active" value={metrics.active} tone="success" />
        <Metric icon={<FileText className="h-4 w-4" />} label="Memberships" value={metrics.tests} tone="info" />
        <Metric icon={<ShieldCheck className="h-4 w-4" />} label="Free tests" value={metrics.free} tone="info" />
      </div>

      <Card><CardContent className="grid gap-3 p-4 lg:grid-cols-[1fr_210px]"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search series, code or exam" className="pl-9" /></div><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="deprecated">Deprecated</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></CardContent></Card>

      {loading ? (
        <Card><CardContent className="flex min-h-72 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading canonical Test Series…</CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center"><Box className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-3 font-semibold">No Test Series match this view</p><p className="mt-1 text-sm text-muted-foreground">Create an ordered collection or clear the filters.</p></CardContent></Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((item) => <SeriesCard key={item.id} series={item} mutating={mutating} canUpdate={hasPermission('tests.update')} onEdit={() => setDraft(fromSeries(item))} onLifecycle={(action) => void lifecycle(item, action)} />)}
        </div>
      )}

      {draft && <SeriesEditor draft={draft} catalog={catalog} mutating={mutating} onChange={setDraft} onClose={() => setDraft(null)} onSave={() => void save()} />}
    </div>
  );
}

function SeriesCard({ series, mutating, canUpdate, onEdit, onLifecycle }: { series: TestSeries; mutating: boolean; canUpdate: boolean; onEdit: () => void; onLifecycle: (action: 'activate' | 'deprecate' | 'archive' | 'restore') => void }) {
  const issues = seriesIssues(series);
  return (
    <Card className="flex flex-col"><CardHeader><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-bold">{series.code}</span><Badge variant="outline">v{series.currentVersionNumber}</Badge><StatusBadge tone={planningStatusTone(series.status)} dot>{series.status}</StatusBadge></div><CardTitle className="mt-2 text-base">{series.name}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{series.examName} · {series.validityDays ? `${series.validityDays} days` : 'No expiry'}</p></div><Button size="icon" variant="ghost" disabled={!canUpdate || mutating} onClick={onEdit}><PencilLine className="h-4 w-4" /></Button></div></CardHeader><CardContent className="flex flex-1 flex-col space-y-4">
      <p className="line-clamp-2 text-sm text-muted-foreground">{series.description || 'No series description.'}</p>
      <div className="grid grid-cols-3 gap-2 text-center text-xs"><Stat label="Tests" value={series.items.length} /><Stat label="Free" value={series.items.filter((item) => item.accessMode === 'free').length} /><Stat label="Premium" value={series.items.filter((item) => item.accessMode === 'premium').length} /></div>
      <div className="max-h-52 overflow-y-auto rounded-lg border">{series.items.length === 0 ? <div className="p-4 text-center text-xs text-muted-foreground">No tests added.</div> : series.items.map((item) => <div key={item.testId} className="flex items-center justify-between gap-3 border-b px-3 py-2 last:border-b-0"><div className="min-w-0"><p className="truncate text-xs font-medium">{item.title || item.publicCode}</p><p className="text-[10px] text-muted-foreground">{item.publicCode} · {item.status.replace(/_/g, ' ')}</p></div><Badge variant="outline" className="shrink-0 text-[10px]">{item.accessMode}</Badge></div>)}</div>
      {issues.length > 0 ? <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive"><AlertTriangle className="mr-1 inline h-3.5 w-3.5" />{issues[0].message}</div> : <div className="rounded-lg border border-success/30 bg-success/5 p-3 text-xs text-success"><CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />Series membership is release-ready</div>}
      <div className="mt-auto flex flex-wrap gap-2">{series.status === 'draft' && <Button size="sm" variant="outline" disabled={!canUpdate || mutating || issues.length > 0} onClick={() => onLifecycle('activate')}>Activate</Button>}{series.status === 'active' && <Button size="sm" variant="outline" disabled={!canUpdate || mutating} onClick={() => onLifecycle('deprecate')}>Deprecate</Button>}{series.status === 'deprecated' && <Button size="sm" variant="outline" disabled={!canUpdate || mutating} onClick={() => onLifecycle('restore')}>Restore draft</Button>}{series.status !== 'archived' && <Button size="sm" variant="ghost" disabled={!canUpdate || mutating} onClick={() => onLifecycle('archive')}><Archive className="mr-1.5 h-3.5 w-3.5" /> Archive</Button>}{series.status === 'archived' && <Button size="sm" variant="outline" disabled={!canUpdate || mutating} onClick={() => onLifecycle('restore')}>Restore</Button>}</div>
    </CardContent></Card>
  );
}

function SeriesEditor({ draft, catalog, mutating, onChange, onClose, onSave }: { draft: SeriesDraft; catalog: SeriesCatalog; mutating: boolean; onChange: (draft: SeriesDraft) => void; onClose: () => void; onSave: () => void }) {
  const [testSearch, setTestSearch] = useState('');
  const issues = draftIssues(draft, catalog);
  const availableTests = catalog.tests.filter((test) => test.examVersionId === draft.examVersionId && !draft.items.some((item) => item.testId === test.id) && `${test.publicCode} ${test.title ?? ''} ${test.status}`.toLowerCase().includes(testSearch.toLowerCase())).slice(0, 100);
  const addTest = (testId: string) => onChange({ ...draft, items: [...draft.items, { testId, accessMode: 'included', unlockAfterPrevious: draft.requireSequentialCompletion && draft.items.length > 0 }] });
  const updateItem = (index: number, patch: Partial<SeriesItemDraft>) => onChange({ ...draft, items: draft.items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) });
  const removeItem = (index: number) => onChange({ ...draft, items: draft.items.filter((_, itemIndex) => itemIndex !== index) });
  const move = (index: number, direction: -1 | 1) => onChange({ ...draft, items: moveSeriesItem(draft.items, index, direction) });
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto"><DialogHeader><DialogTitle>{draft.id ? 'Create Test Series revision' : 'Create Test Series'}</DialogTitle><DialogDescription>Membership order, access and progression are frozen into every immutable series version.</DialogDescription></DialogHeader>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Field label="Exam version" className="xl:col-span-2"><Select value={draft.examVersionId} onValueChange={(value) => onChange({ ...draft, examVersionId: value, items: [] })}><SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger><SelectContent>{catalog.examVersions.map((exam) => <SelectItem key={exam.id} value={exam.id}>{exam.familyName} · {exam.examName} · v{exam.versionNumber}</SelectItem>)}</SelectContent></Select></Field><Field label="Series code"><Input value={draft.code} disabled={Boolean(draft.id)} onChange={(event) => onChange({ ...draft, code: event.target.value.toUpperCase() })} /></Field><Field label="Status"><Select value={draft.status} onValueChange={(value) => onChange({ ...draft, status: value as SeriesDraft['status'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="deprecated">Deprecated</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></Field><Field label="Series name" className="md:col-span-2"><Input value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} /></Field><Field label="Validity days"><Input type="number" min={1} value={draft.validityDays ?? ''} placeholder="No expiry" onChange={(event) => onChange({ ...draft, validityDays: event.target.value ? Number(event.target.value) : null })} /></Field><Field label="Minimum score %"><Input type="number" min={0} max={100} value={draft.minimumScorePercent} onChange={(event) => onChange({ ...draft, minimumScorePercent: Number(event.target.value) || 0 })} /></Field><Field label="Description" className="md:col-span-2 xl:col-span-4"><Textarea value={draft.description} onChange={(event) => onChange({ ...draft, description: event.target.value })} className="min-h-20" /></Field><Field label="Change reason" className="md:col-span-2 xl:col-span-4"><Input value={draft.changeReason} onChange={(event) => onChange({ ...draft, changeReason: event.target.value })} /></Field></div>
      <label className="flex items-center gap-2 rounded-lg border bg-muted/20 p-3 text-sm"><Checkbox checked={draft.requireSequentialCompletion} onCheckedChange={(checked) => onChange({ ...draft, requireSequentialCompletion: checked === true })} /> Require sequential completion</label>
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]"><Card><CardHeader><CardTitle className="text-sm">Available tests</CardTitle></CardHeader><CardContent><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={testSearch} onChange={(event) => setTestSearch(event.target.value)} placeholder="Search test code, title or status" className="pl-9" /></div><div className="mt-3 max-h-96 overflow-y-auto rounded-lg border">{availableTests.length === 0 ? <div className="p-5 text-center text-xs text-muted-foreground">No available tests match.</div> : availableTests.map((test) => <div key={test.id} className="flex items-center justify-between gap-3 border-b p-3 last:border-b-0"><div className="min-w-0"><p className="truncate text-xs font-medium">{test.title || test.publicCode}</p><p className="text-[10px] text-muted-foreground">{test.publicCode} · {test.status.replace(/_/g, ' ')} · {test.questionCount} questions</p></div><Button size="sm" variant="outline" onClick={() => addTest(test.id)}><Plus className="mr-1 h-3.5 w-3.5" /> Add</Button></div>)}</div></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-sm">Ordered series membership ({draft.items.length})</CardTitle></CardHeader><CardContent><div className="max-h-[450px] overflow-y-auto rounded-lg border">{draft.items.length === 0 ? <div className="p-6 text-center text-xs text-muted-foreground">Add tests from the catalog.</div> : draft.items.map((item, index) => { const test = catalog.tests.find((candidate) => candidate.id === item.testId); return <div key={item.testId} className="border-b p-3 last:border-b-0"><div className="flex items-start gap-3"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold">{index + 1}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{test?.title || test?.publicCode || item.testId}</p><p className="text-[10px] text-muted-foreground">{test?.publicCode} · {test?.status?.replace(/_/g, ' ')}</p><div className="mt-2 grid gap-2 sm:grid-cols-[150px_1fr_auto]"><Select value={item.accessMode} onValueChange={(value) => updateItem(index, { accessMode: value as SeriesItemDraft['accessMode'] })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="free">Free</SelectItem><SelectItem value="included">Included</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent></Select><label className="flex items-center gap-2 text-xs"><Checkbox checked={item.unlockAfterPrevious} onCheckedChange={(checked) => updateItem(index, { unlockAfterPrevious: checked === true })} /> Unlock after previous</label><div className="flex gap-1"><Button size="icon" variant="ghost" className="h-8 w-8" disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp className="h-3.5 w-3.5" /></Button><Button size="icon" variant="ghost" className="h-8 w-8" disabled={index === draft.items.length - 1} onClick={() => move(index, 1)}><ArrowDown className="h-3.5 w-3.5" /></Button><Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => removeItem(index)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></div></div></div></div></div>; })}</div></CardContent></Card></div>
      {issues.length > 0 && <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><p className="font-semibold">{issues.length} issue(s) block saving</p><ul className="mt-2 list-disc space-y-1 pl-5 text-xs">{issues.slice(0, 8).map((issue) => <li key={issue}>{issue}</li>)}</ul></div>}
      <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={mutating || issues.length > 0} onClick={onSave}>{mutating ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />} Save immutable version</Button></DialogFooter>
    </DialogContent></Dialog>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) { return <div className={className}><Label className="mb-1.5 block text-xs">{label}</Label>{children}</div>; }
function Metric({ icon, label, value, tone = 'neutral' }: { icon: ReactNode; label: string; value: number; tone?: 'neutral' | 'info' | 'success' }) { const color = tone === 'success' ? 'text-success' : tone === 'info' ? 'text-info' : 'text-muted-foreground'; return <Card><CardContent className="p-4"><div className={cn('flex items-center gap-2 text-xs', color)}>{icon}{label}</div><p className="mt-2 text-2xl font-bold">{value}</p></CardContent></Card>; }
function Stat({ label, value }: { label: string; value: number | string }) { return <div className="rounded-md border bg-muted/20 px-2 py-2"><p className="font-bold">{value}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p></div>; }
