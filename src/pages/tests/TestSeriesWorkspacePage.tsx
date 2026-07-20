import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Archive,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock3,
  FileText,
  History,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  Trash2,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type {
  SeriesCatalog,
  SeriesProgressionMode,
  TestSeriesDetail,
  TestSeriesInput,
  TestSeriesItemInput,
} from '@/features/test-series/api';
import { useTestSeries } from '@/features/test-series/useTestSeries';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

type EditorMode = 'view' | 'new' | 'edit';
type EditableItem = TestSeriesItemInput & { clientId: string };

interface EditorDraft {
  examVersionId: string;
  code: string;
  name: string;
  description: string;
  availabilityStartAt: string;
  availabilityEndAt: string;
  progressionMode: SeriesProgressionMode;
  completionThreshold: number | null;
  changeReason: string;
  items: EditableItem[];
}

interface MetricCard {
  label: string;
  value: number;
  icon: LucideIcon;
}

function clientId() {
  return `series-item-${Math.random().toString(36).slice(2, 10)}`;
}

function localDateTime(value: string | null | undefined) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return shifted.toISOString().slice(0, 16);
}

function isoDateTime(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function normalizedCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function blankDraft(catalog: SeriesCatalog): EditorDraft {
  return {
    examVersionId: catalog.examVersions[0]?.id ?? '',
    code: '',
    name: '',
    description: '',
    availabilityStartAt: '',
    availabilityEndAt: '',
    progressionMode: 'open',
    completionThreshold: null,
    changeReason: 'Create a canonical test series',
    items: [],
  };
}

function detailDraft(detail: TestSeriesDetail): EditorDraft {
  return {
    examVersionId: detail.series.examVersionId,
    code: detail.series.code,
    name: detail.series.name,
    description: detail.currentVersion?.description ?? '',
    availabilityStartAt: localDateTime(detail.currentVersion?.availabilityStartAt),
    availabilityEndAt: localDateTime(detail.currentVersion?.availabilityEndAt),
    progressionMode: detail.currentVersion?.progressionMode ?? 'open',
    completionThreshold: detail.currentVersion?.completionThreshold ?? null,
    changeReason: `Editorial update to ${detail.series.code}`,
    items: detail.items.map((item) => ({
      clientId: clientId(),
      testId: item.testId,
      titleOverride: item.titleOverride,
      unlockAt: localDateTime(item.unlockAt),
      minimumScore: item.minimumScore,
      isRequired: item.isRequired,
      configuration: item.configuration,
    })),
  };
}

function statusTone(status: string) {
  if (['qa_approved', 'scheduled', 'live', 'completed'].includes(status)) return 'border-emerald-300 bg-emerald-50 text-emerald-800';
  if (status === 'needs_fix') return 'border-rose-300 bg-rose-50 text-rose-800';
  return 'border-amber-300 bg-amber-50 text-amber-800';
}

export function TestSeriesWorkspacePage() {
  const workspace = useTestSeries();
  const { hasPermission } = useAdminPermissions();
  const canCreate = hasPermission('tests.create');
  const canUpdate = hasPermission('tests.update');
  const [mode, setMode] = useState<EditorMode>('view');
  const [draft, setDraft] = useState<EditorDraft>(() => blankDraft(workspace.catalog));
  const [search, setSearch] = useState('');
  const [readinessFilter, setReadinessFilter] = useState('all');
  const [testToAdd, setTestToAdd] = useState('');
  const [archiveReason, setArchiveReason] = useState('Series is no longer part of the active exam plan');

  useEffect(() => {
    if (mode === 'new' && !draft.examVersionId && workspace.catalog.examVersions[0]) {
      setDraft(blankDraft(workspace.catalog));
    }
  }, [draft.examVersionId, mode, workspace.catalog]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return workspace.series.filter((entry) => {
      if (readinessFilter === 'ready' && !entry.readiness.ready) return false;
      if (readinessFilter === 'blocked' && entry.readiness.ready) return false;
      if (readinessFilter === 'archived' && !entry.deletedAt) return false;
      if (!query) return true;
      return [entry.code, entry.name, entry.examName, entry.examFamilyName]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [readinessFilter, search, workspace.series]);

  const metrics = useMemo(() => ({
    total: workspace.series.length,
    active: workspace.series.filter((entry) => !entry.deletedAt).length,
    ready: workspace.series.filter((entry) => entry.readiness.ready).length,
    tests: workspace.series.reduce((sum, entry) => sum + entry.itemCount, 0),
  }), [workspace.series]);

  const metricCards = useMemo<MetricCard[]>(() => [
    { label: 'Series', value: metrics.total, icon: Settings2 },
    { label: 'Active', value: metrics.active, icon: CheckCircle2 },
    { label: 'Release ready', value: metrics.ready, icon: ShieldCheck },
    { label: 'Ordered tests', value: metrics.tests, icon: FileText },
  ], [metrics]);

  const examTests = useMemo(() => workspace.catalog.tests.filter(
    (test) => test.examVersionId === draft.examVersionId && !draft.items.some((item) => item.testId === test.id),
  ), [draft.examVersionId, draft.items, workspace.catalog.tests]);

  const beginNew = () => {
    setDraft(blankDraft(workspace.catalog));
    setMode('new');
  };

  const beginEdit = () => {
    if (!workspace.detail) return;
    setDraft(detailDraft(workspace.detail));
    setMode('edit');
  };

  const cancelEdit = () => {
    setMode('view');
    if (workspace.detail) setDraft(detailDraft(workspace.detail));
  };

  const addTest = () => {
    if (!testToAdd) return;
    setDraft((current) => ({
      ...current,
      items: [...current.items, {
        clientId: clientId(),
        testId: testToAdd,
        titleOverride: null,
        unlockAt: null,
        minimumScore: current.progressionMode === 'score_gated' ? current.completionThreshold : null,
        isRequired: true,
        configuration: {},
      }],
    }));
    setTestToAdd('');
  };

  const updateItem = (clientKey: string, patch: Partial<EditableItem>) => {
    setDraft((current) => ({
      ...current,
      items: current.items.map((item) => item.clientId === clientKey ? { ...item, ...patch } : item),
    }));
  };

  const removeItem = (clientKey: string) => {
    setDraft((current) => ({ ...current, items: current.items.filter((item) => item.clientId !== clientKey) }));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    setDraft((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.items.length) return current;
      const items = [...current.items];
      [items[index], items[target]] = [items[target]!, items[index]!];
      return { ...current, items };
    });
  };

  const save = async () => {
    const input: TestSeriesInput = {
      expectedCurrentVersionNumber: mode === 'edit'
        ? workspace.detail?.series.currentVersionNumber ?? null
        : null,
      examVersionId: draft.examVersionId,
      code: normalizedCode(draft.code),
      name: draft.name,
      description: draft.description,
      availabilityStartAt: isoDateTime(draft.availabilityStartAt),
      availabilityEndAt: isoDateTime(draft.availabilityEndAt),
      progressionMode: draft.progressionMode,
      completionThreshold: draft.progressionMode === 'score_gated' ? draft.completionThreshold : null,
      configuration: {
        orderedMembership: true,
        releasePolicySource: 'canonical_test_series_version',
      },
      changeReason: draft.changeReason,
      items: draft.items.map(({ clientId: _clientId, unlockAt, ...item }) => ({
        ...item,
        unlockAt: unlockAt ? isoDateTime(String(unlockAt)) : null,
      })),
    };
    try {
      const result = await workspace.save(input, mode === 'edit' ? workspace.selectedId : null);
      setMode('view');
      showToast.success(
        mode === 'edit' ? 'Series version created' : 'Test series created',
        `${result.series.code} version ${result.series.currentVersionNumber} now contains ${result.items.length} tests.`,
      );
    } catch (caught) {
      showToast.error('Series save failed', caught instanceof Error ? caught.message : 'Unable to save test series.');
    }
  };

  const transition = async (action: 'archive' | 'restore') => {
    try {
      await workspace.transition(action, archiveReason);
      showToast.success(`Series ${action}d`, `The series is now ${action === 'archive' ? 'inactive' : 'active'}.`);
    } catch (caught) {
      showToast.error(`Unable to ${action} series`, caught instanceof Error ? caught.message : 'Series transition failed.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Test Series"
        description="Canonical immutable series versions, ordered test membership, release windows and student progression policy."
        actions={(
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => void workspace.refresh()} disabled={workspace.loading}>
              <RefreshCw className={cn('mr-2 h-4 w-4', workspace.loading && 'animate-spin')} />
              Refresh
            </Button>
            {canCreate && <Button onClick={beginNew}><Plus className="mr-2 h-4 w-4" />New series</Button>}
          </div>
        )}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}><CardContent className="flex items-center justify-between p-4">
            <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-2xl font-semibold">{value}</p></div>
            <Icon className="h-5 w-5 text-muted-foreground" />
          </CardContent></Card>
        ))}
      </div>

      {workspace.error && (
        <Card className="border-destructive/40"><CardContent className="flex items-center gap-3 p-4 text-sm text-destructive">
          <XCircle className="h-5 w-5" />{workspace.error}
        </CardContent></Card>
      )}

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader className="space-y-3">
            <CardTitle className="text-base">Production queue</CardTitle>
            <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search series or exam" /></div>
            <Select value={readinessFilter} onValueChange={setReadinessFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All series</SelectItem>
                <SelectItem value="ready">Release ready</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="space-y-2">
            {workspace.loading ? <div className="flex items-center justify-center p-8"><Loader2 className="h-5 w-5 animate-spin" /></div> : filtered.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => { workspace.setSelectedId(entry.id); setMode('view'); }}
                className={cn('w-full rounded-lg border p-3 text-left transition hover:bg-muted/50', workspace.selectedId === entry.id && 'border-primary bg-primary/5')}
              >
                <div className="flex items-start justify-between gap-2"><div><p className="font-medium">{entry.name}</p><p className="text-xs text-muted-foreground">{entry.code} · v{entry.currentVersionNumber}</p></div><Badge variant={entry.readiness.ready ? 'default' : 'outline'}>{entry.readiness.ready ? 'Ready' : `${entry.readiness.blockers.length} blocker${entry.readiness.blockers.length === 1 ? '' : 's'}`}</Badge></div>
                <p className="mt-2 text-xs text-muted-foreground">{entry.examName} · {entry.itemCount} tests · {entry.progressionMode.replace('_', ' ')}</p>
              </button>
            ))}
            {!workspace.loading && filtered.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No series match the current filters.</p>}
          </CardContent>
        </Card>

        <div className="space-y-5">
          {mode !== 'view' ? (
            <SeriesEditor
              draft={draft}
              setDraft={setDraft}
              catalog={workspace.catalog}
              examTests={examTests}
              testToAdd={testToAdd}
              setTestToAdd={setTestToAdd}
              addTest={addTest}
              updateItem={updateItem}
              removeItem={removeItem}
              moveItem={moveItem}
              onCancel={cancelEdit}
              onSave={() => void save()}
              saving={workspace.mutating}
              mode={mode}
            />
          ) : workspace.detailLoading ? (
            <Card><CardContent className="flex min-h-[360px] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></CardContent></Card>
          ) : workspace.detail ? (
            <SeriesDetail
              detail={workspace.detail}
              canUpdate={canUpdate}
              onEdit={beginEdit}
              onNew={beginNew}
              archiveReason={archiveReason}
              setArchiveReason={setArchiveReason}
              onTransition={(action) => void transition(action)}
              mutating={workspace.mutating}
            />
          ) : (
            <Card><CardContent className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-center"><Settings2 className="h-10 w-10 text-muted-foreground" /><p className="font-medium">No test series yet</p><p className="max-w-md text-sm text-muted-foreground">Create a canonical series to organise test releases and progression.</p>{canCreate && <Button onClick={beginNew}><Plus className="mr-2 h-4 w-4" />Create first series</Button>}</CardContent></Card>
          )}
        </div>
      </div>
    </div>
  );
}

function SeriesEditor(props: {
  draft: EditorDraft;
  setDraft: React.Dispatch<React.SetStateAction<EditorDraft>>;
  catalog: SeriesCatalog;
  examTests: SeriesCatalog['tests'];
  testToAdd: string;
  setTestToAdd: (value: string) => void;
  addTest: () => void;
  updateItem: (clientId: string, patch: Partial<EditableItem>) => void;
  removeItem: (clientId: string) => void;
  moveItem: (index: number, direction: -1 | 1) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  mode: EditorMode;
}) {
  const { draft, setDraft } = props;
  return (
    <Card>
      <CardHeader><div className="flex items-center justify-between"><CardTitle>{props.mode === 'new' ? 'Create test series' : 'Create immutable series version'}</CardTitle><div className="flex gap-2"><Button variant="outline" onClick={props.onCancel}>Cancel</Button><Button onClick={props.onSave} disabled={props.saving}>{props.saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save</Button></div></div></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label>Exam version</Label><Select value={draft.examVersionId} onValueChange={(value) => setDraft((current) => ({ ...current, examVersionId: value, items: current.examVersionId === value ? current.items : [] }))}><SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger><SelectContent>{props.catalog.examVersions.map((exam) => <SelectItem key={exam.id} value={exam.id}>{exam.examFamilyName} · {exam.examName}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Series code</Label><Input value={draft.code} onChange={(event) => setDraft((current) => ({ ...current, code: event.target.value }))} placeholder="SSC-CGL-FULL-MOCKS" /></div>
          <div className="space-y-2 md:col-span-2"><Label>Series name</Label><Input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></div>
          <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} rows={3} /></div>
          <div className="space-y-2"><Label>Availability start</Label><Input type="datetime-local" value={draft.availabilityStartAt} onChange={(event) => setDraft((current) => ({ ...current, availabilityStartAt: event.target.value }))} /></div>
          <div className="space-y-2"><Label>Availability end</Label><Input type="datetime-local" value={draft.availabilityEndAt} onChange={(event) => setDraft((current) => ({ ...current, availabilityEndAt: event.target.value }))} /></div>
          <div className="space-y-2"><Label>Progression</Label><Select value={draft.progressionMode} onValueChange={(value) => setDraft((current) => ({ ...current, progressionMode: value as SeriesProgressionMode, completionThreshold: value === 'score_gated' ? current.completionThreshold ?? 40 : null }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="open">Open access</SelectItem><SelectItem value="sequential">Sequential completion</SelectItem><SelectItem value="score_gated">Score gated</SelectItem></SelectContent></Select></div>
          {draft.progressionMode === 'score_gated' && <div className="space-y-2"><Label>Default completion score (%)</Label><Input type="number" min={0} max={100} value={draft.completionThreshold ?? ''} onChange={(event) => setDraft((current) => ({ ...current, completionThreshold: event.target.value === '' ? null : Number(event.target.value) }))} /></div>}
          <div className="space-y-2 md:col-span-2"><Label>Change reason</Label><Input value={draft.changeReason} onChange={(event) => setDraft((current) => ({ ...current, changeReason: event.target.value }))} /></div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-end gap-2"><div className="min-w-[280px] flex-1 space-y-2"><Label>Add canonical test</Label><Select value={props.testToAdd} onValueChange={props.setTestToAdd}><SelectTrigger><SelectValue placeholder="Choose a test from this exam" /></SelectTrigger><SelectContent>{props.examTests.map((test) => <SelectItem key={test.id} value={test.id}>{test.publicCode} · {test.title} · {test.status}</SelectItem>)}</SelectContent></Select></div><Button variant="outline" onClick={props.addTest} disabled={!props.testToAdd}><Plus className="mr-2 h-4 w-4" />Add test</Button></div>
          {draft.items.map((item, index) => {
            const test = props.catalog.tests.find((candidate) => candidate.id === item.testId);
            return <div key={item.clientId} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3"><div><p className="font-medium">{index + 1}. {test?.title ?? item.testId}</p><p className="text-xs text-muted-foreground">{test?.publicCode} · {test?.status}</p></div><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => props.moveItem(index, -1)} disabled={index === 0}><ArrowUp className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => props.moveItem(index, 1)} disabled={index === draft.items.length - 1}><ArrowDown className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => props.removeItem(item.clientId)}><Trash2 className="h-4 w-4" /></Button></div></div>
              <div className="mt-3 grid gap-3 md:grid-cols-3"><div className="space-y-1"><Label>Title override</Label><Input value={item.titleOverride ?? ''} onChange={(event) => props.updateItem(item.clientId, { titleOverride: event.target.value || null })} /></div><div className="space-y-1"><Label>Unlock at</Label><Input type="datetime-local" value={String(item.unlockAt ?? '')} onChange={(event) => props.updateItem(item.clientId, { unlockAt: event.target.value || null })} /></div><div className="space-y-1"><Label>Minimum score (%)</Label><Input type="number" min={0} max={100} value={item.minimumScore ?? ''} onChange={(event) => props.updateItem(item.clientId, { minimumScore: event.target.value === '' ? null : Number(event.target.value) })} /></div></div>
              <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={item.isRequired} onChange={(event) => props.updateItem(item.clientId, { isRequired: event.target.checked })} />Required for series completion</label>
            </div>;
          })}
          {draft.items.length === 0 && <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Add at least one test. Only tests mapped to the selected exam version are available.</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function SeriesDetail(props: {
  detail: TestSeriesDetail;
  canUpdate: boolean;
  onEdit: () => void;
  onNew: () => void;
  archiveReason: string;
  setArchiveReason: (value: string) => void;
  onTransition: (action: 'archive' | 'restore') => void;
  mutating: boolean;
}) {
  const { detail } = props;
  const archived = Boolean(detail.series.deletedAt);
  return <>
    <Card><CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><CardTitle>{detail.series.name}</CardTitle><Badge variant={detail.readiness.ready ? 'default' : 'outline'}>{detail.readiness.ready ? 'Release ready' : 'Blocked'}</Badge>{archived && <Badge variant="secondary">Archived</Badge>}</div><p className="mt-1 text-sm text-muted-foreground">{detail.series.code} · {detail.series.examFamilyName} · {detail.series.examName} · version {detail.series.currentVersionNumber}</p></div><div className="flex gap-2">{props.canUpdate && !archived && <Button variant="outline" onClick={props.onEdit}><Settings2 className="mr-2 h-4 w-4" />Edit</Button>}<Button variant="outline" onClick={props.onNew}><Plus className="mr-2 h-4 w-4" />New</Button></div></div></CardHeader><CardContent className="grid gap-4 md:grid-cols-3"><div><p className="text-xs text-muted-foreground">Progression</p><p className="font-medium capitalize">{detail.currentVersion?.progressionMode.replace('_', ' ')}</p></div><div><p className="text-xs text-muted-foreground">Availability</p><p className="font-medium">{detail.currentVersion?.availabilityStartAt ? new Date(detail.currentVersion.availabilityStartAt).toLocaleString() : 'Open start'} → {detail.currentVersion?.availabilityEndAt ? new Date(detail.currentVersion.availabilityEndAt).toLocaleString() : 'No end'}</p></div><div><p className="text-xs text-muted-foreground">Ordered tests</p><p className="font-medium">{detail.items.length}</p></div><div className="md:col-span-3"><p className="text-xs text-muted-foreground">Description</p><p className="mt-1 text-sm">{detail.currentVersion?.description || 'No description.'}</p></div></CardContent></Card>

    <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-5 w-5" />Release readiness</CardTitle></CardHeader><CardContent className="space-y-2">{detail.readiness.blockers.map((blocker) => <div key={blocker} className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"><XCircle className="h-4 w-4" />{blocker}</div>)}{detail.readiness.warnings.map((warning) => <div key={warning} className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"><Clock3 className="h-4 w-4" />{warning}</div>)}{detail.readiness.ready && <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4" />Every member test is QA approved or released, and the series window is valid.</div>}<Button asChild variant="outline" size="sm"><Link to="/tests/qa">Open Test QA</Link></Button></CardContent></Card>

    <Card><CardHeader><CardTitle className="text-base">Ordered membership</CardTitle></CardHeader><CardContent className="space-y-3">{detail.items.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"><div><p className="font-medium">{item.sortOrder}. {item.titleOverride || item.title}</p><p className="text-xs text-muted-foreground">{item.publicCode} · {item.durationSeconds ? `${Math.round(item.durationSeconds / 60)} min` : 'Duration unavailable'} · {item.totalMarks ?? '—'} marks</p><div className="mt-2 flex flex-wrap gap-2"><Badge variant="outline" className={statusTone(item.status)}>{item.status.replace('_', ' ')}</Badge>{item.isRequired && <Badge variant="secondary">Required</Badge>}{item.minimumScore != null && <Badge variant="outline">Min {item.minimumScore}%</Badge>}{item.unlockAt && <Badge variant="outline">Unlock {new Date(item.unlockAt).toLocaleString()}</Badge>}</div></div><Button asChild size="sm" variant="outline"><Link to={`/tests/${item.testId}`}>Open test</Link></Button></div>)}</CardContent></Card>

    <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><History className="h-5 w-5" />Immutable version history</CardTitle></CardHeader><CardContent className="space-y-2">{detail.versions.map((version) => <div key={version.id} className="flex items-center justify-between rounded-lg border p-3"><div><p className="font-medium">Version {version.versionNumber} · {version.itemCount} tests</p><p className="text-xs text-muted-foreground">{version.changeReason} · {new Date(version.createdAt).toLocaleString()}</p></div>{version.versionNumber === detail.series.currentVersionNumber && <Badge>Current</Badge>}</div>)}</CardContent></Card>

    {props.canUpdate && <Card><CardHeader><CardTitle className="text-base">Lifecycle</CardTitle></CardHeader><CardContent className="flex flex-wrap items-end gap-3"><div className="min-w-[300px] flex-1 space-y-2"><Label>Audit reason</Label><Input value={props.archiveReason} onChange={(event) => props.setArchiveReason(event.target.value)} /></div><Button variant={archived ? 'default' : 'destructive'} onClick={() => props.onTransition(archived ? 'restore' : 'archive')} disabled={props.mutating}>{props.mutating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : archived ? <RotateCcw className="mr-2 h-4 w-4" /> : <Archive className="mr-2 h-4 w-4" />}{archived ? 'Restore series' : 'Archive series'}</Button></CardContent></Card>}
  </>;
}
