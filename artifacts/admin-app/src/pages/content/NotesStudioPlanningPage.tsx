import { useEffect, useMemo, useState } from 'react';
import { BookMarked, Layers3, Loader2, Play, RefreshCw, RotateCcw, SkipForward } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type Language = { id: string; code: string; name: string; nativeName: string | null };
type Exam = { id: string; code: string; name: string; familyName: string; currentVersionId: string; currentVersionName: string };
type Root = { examId: string; examVersionId: string; id: string; code: string; nodeType: string; name: string; targetCoverage: number };
type PlanningOptions = {
  languages: Language[];
  exams: Exam[];
  roots: Root[];
  unitTypes: string[];
  depthOptions: string[];
  learnerLevels: string[];
  maxPlanItems: number;
  maxJobCreationBatch: number;
  automaticSourceIngestion: boolean;
  automaticGeneration: boolean;
  automaticPublication: boolean;
};

type PreviewItem = {
  id: string;
  code: string;
  nodeType: string;
  name: string;
  description: string | null;
  depth: number;
  path: string[];
  targetCoverage: number;
};

type Preview = {
  exam: { id: string; code: string; name: string; currentVersionId: string; currentVersionName: string };
  root: { id: string; code: string; nodeType: string; name: string };
  unitTypes: string[];
  leafOnly: boolean;
  eligibleCount: number;
  items: PreviewItem[];
  maxPlanItems: number;
};

type Batch = {
  id: string;
  title: string;
  examId?: string;
  examCode: string;
  examName: string;
  rootTaxonomyCode: string;
  rootTaxonomyName: string;
  sourceLanguage: string;
  depth: string;
  learnerLevel: string;
  status: string;
  itemCount: number;
  plannedCount: number;
  jobCreatedCount: number;
  skippedCount: number;
  approvedOrMaterializedCount: number;
  createdAt: string;
  updatedAt: string;
};

type BatchItem = {
  id: string;
  taxonomyNodeId: string;
  taxonomySnapshot: { code?: string; name?: string; nodeType?: string; description?: string | null };
  targetCoverage: number;
  priority: number;
  position: number;
  itemState: 'planned' | 'job_created' | 'skipped';
  authoringJobId: string | null;
  authoringJobTitle: string | null;
  authoringJobState: string | null;
  targetResourceId: string | null;
  updatedAt: string;
};

type BatchDetail = { batch: Batch; items: BatchItem[] };

type PlanDraft = {
  title: string;
  examId: string;
  rootTaxonomyNodeId: string;
  sourceLanguage: string;
  depth: string;
  learnerLevel: string;
  unitTypes: string[];
  leafOnly: boolean;
};

const initialDraft: PlanDraft = {
  title: '',
  examId: '',
  rootTaxonomyNodeId: '',
  sourceLanguage: 'en',
  depth: 'standard',
  learnerLevel: 'standard',
  unitTypes: ['topic', 'subtopic', 'chapter'],
  leafOnly: true,
};

function pretty(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function NotesStudioPlanningPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [options, setOptions] = useState<PlanningOptions | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [detail, setDetail] = useState<BatchDetail | null>(null);
  const [draft, setDraft] = useState<PlanDraft>(initialDraft);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const availableRoots = useMemo(
    () => (options?.roots ?? []).filter((root) => root.examId === draft.examId),
    [options, draft.examId],
  );

  const load = async () => {
    setLoading(true);
    try {
      const [optionResult, batchResult] = await Promise.all([
        adminRequest<PlanningOptions>('/admin/notes-studio/planning/options'),
        adminRequest<{ batches: Batch[] }>('/admin/notes-studio/planning/batches'),
      ]);
      setOptions(optionResult);
      setBatches(batchResult.batches ?? []);
      setSelectedBatchId((current) => current && batchResult.batches.some((batch) => batch.id === current) ? current : batchResult.batches[0]?.id ?? null);
      setDraft((current) => ({
        ...current,
        examId: current.examId || optionResult.exams[0]?.id || '',
        sourceLanguage: optionResult.languages.some((language) => language.code === current.sourceLanguage)
          ? current.sourceLanguage
          : optionResult.languages[0]?.code || 'en',
      }));
    } catch (error) {
      showToast.error('Unable to load Notes Studio planning', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (batchId: string) => {
    try {
      setDetail(await adminRequest<BatchDetail>(`/admin/notes-studio/planning/batches/${batchId}`));
    } catch (error) {
      showToast.error('Unable to load planning batch', error instanceof Error ? error.message : 'Request failed.');
    }
  };

  useEffect(() => { void load(); }, []);
  useEffect(() => { if (selectedBatchId) void loadDetail(selectedBatchId); else setDetail(null); }, [selectedBatchId]);
  useEffect(() => {
    if (draft.rootTaxonomyNodeId && !availableRoots.some((root) => root.id === draft.rootTaxonomyNodeId)) {
      setDraft((current) => ({ ...current, rootTaxonomyNodeId: '' }));
      setPreview(null);
    }
  }, [availableRoots, draft.rootTaxonomyNodeId]);

  const previewPlan = async () => {
    if (!draft.examId || !draft.rootTaxonomyNodeId) {
      showToast.error('Choose an exam and taxonomy root first.');
      return;
    }
    setWorking(true);
    try {
      const result = await adminRequest<Preview>('/admin/notes-studio/planning/preview', {
        method: 'POST',
        body: {
          examId: draft.examId,
          rootTaxonomyNodeId: draft.rootTaxonomyNodeId,
          unitTypes: draft.unitTypes,
          leafOnly: draft.leafOnly,
        },
      });
      setPreview(result);
      if (result.eligibleCount === 0) showToast.error('No eligible note units were found for this selection.');
    } catch (error) {
      showToast.error('Unable to preview syllabus plan', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const createPlan = async () => {
    if (!preview || preview.eligibleCount === 0) return;
    setWorking(true);
    try {
      const result = await adminRequest<{ batch: Batch }>('/admin/notes-studio/planning/batches', {
        method: 'POST',
        body: draft,
      });
      showToast.success(`Planning batch created with ${result.batch.itemCount} syllabus units.`);
      setPreview(null);
      setDraft((current) => ({ ...initialDraft, examId: current.examId, sourceLanguage: current.sourceLanguage }));
      await load();
      setSelectedBatchId(result.batch.id);
    } catch (error) {
      showToast.error('Unable to create syllabus plan', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const createJobs = async () => {
    if (!detail || detail.batch.plannedCount === 0) return;
    setWorking(true);
    try {
      const result = await adminRequest<{ createdCount: number }>(`/admin/notes-studio/planning/batches/${detail.batch.id}/create-jobs`, {
        method: 'POST',
        body: { limit: Math.min(options?.maxJobCreationBatch ?? 100, 50) },
      });
      showToast.success(`Created ${result.createdCount} brief-state Notes Studio job(s).`);
      await load();
      await loadDetail(detail.batch.id);
    } catch (error) {
      showToast.error('Unable to create authoring jobs', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const updateItem = async (item: BatchItem, action: 'skip' | 'restore') => {
    setWorking(true);
    try {
      await adminRequest(`/admin/notes-studio/planning/items/${item.id}`, { method: 'PATCH', body: { action } });
      if (detail) await loadDetail(detail.batch.id);
      await load();
    } catch (error) {
      showToast.error('Unable to update planning item', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const toggleUnitType = (value: string, checked: boolean) => {
    setPreview(null);
    setDraft((current) => ({
      ...current,
      unitTypes: checked
        ? [...new Set([...current.unitTypes, value])]
        : current.unitTypes.filter((item) => item !== value),
    }));
  };

  return <div className="space-y-5">
    <PageHeader
      title="Syllabus Planning"
      description="Turn canonical exam taxonomy into a bounded Notes Studio authoring backlog before sourcing or generation begins."
      icon={<Layers3 className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void load()} disabled={loading || working}>{loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}Refresh</Button>}
    />

    <Card>
      <CardHeader><CardTitle className="text-base">Create taxonomy-driven plan</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2"><Label>Exam</Label><Select value={draft.examId} onValueChange={(value) => { setDraft((current) => ({ ...current, examId: value, rootTaxonomyNodeId: '' })); setPreview(null); }}><SelectTrigger><SelectValue placeholder="Choose exam" /></SelectTrigger><SelectContent>{(options?.exams ?? []).map((exam) => <SelectItem key={exam.id} value={exam.id}>{exam.familyName} · {exam.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Taxonomy root</Label><Select value={draft.rootTaxonomyNodeId} onValueChange={(value) => { setDraft((current) => ({ ...current, rootTaxonomyNodeId: value })); setPreview(null); }}><SelectTrigger><SelectValue placeholder="Choose mapped syllabus root" /></SelectTrigger><SelectContent>{availableRoots.map((root) => <SelectItem key={`${root.examVersionId}:${root.id}`} value={root.id}>{root.name} · {root.nodeType}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Plan title</Label><Input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Optional — generated from exam + root" /></div>
          <div className="space-y-2"><Label>Source language</Label><Select value={draft.sourceLanguage} onValueChange={(value) => setDraft((current) => ({ ...current, sourceLanguage: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(options?.languages ?? []).map((language) => <SelectItem key={language.id} value={language.code}>{language.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Depth</Label><Select value={draft.depth} onValueChange={(value) => setDraft((current) => ({ ...current, depth: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(options?.depthOptions ?? []).map((value) => <SelectItem key={value} value={value}>{pretty(value)}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Learner level</Label><Select value={draft.learnerLevel} onValueChange={(value) => setDraft((current) => ({ ...current, learnerLevel: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(options?.learnerLevels ?? []).map((value) => <SelectItem key={value} value={value}>{pretty(value)}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium">Note units</div>
          <div className="mt-2 flex flex-wrap gap-4">
            {(options?.unitTypes ?? ['topic', 'subtopic', 'chapter']).map((value) => <label key={value} className="flex items-center gap-2 text-sm"><Checkbox checked={draft.unitTypes.includes(value)} onCheckedChange={(checked) => toggleUnitType(value, checked === true)} />{pretty(value)}</label>)}
            <label className="flex items-center gap-2 text-sm"><Checkbox checked={draft.leafOnly} onCheckedChange={(checked) => { setDraft((current) => ({ ...current, leafOnly: checked === true })); setPreview(null); }} />Deepest selected units only</label>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void previewPlan()} disabled={working || !draft.examId || !draft.rootTaxonomyNodeId || draft.unitTypes.length === 0}><BookMarked className="mr-1.5 h-4 w-4" />Preview plan</Button>
          {preview && <Button variant="secondary" onClick={() => void createPlan()} disabled={!canEdit || working || preview.eligibleCount === 0}>Create governed plan</Button>}
        </div>
        {preview && <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-semibold">{preview.exam.name} · {preview.root.name}</div><div className="text-sm text-muted-foreground">{preview.eligibleCount} note units · max {preview.maxPlanItems} · {preview.leafOnly ? 'deepest units only' : 'all selected levels'}</div></div><Badge variant={preview.eligibleCount > 0 ? 'default' : 'destructive'}>{preview.eligibleCount} units</Badge></div>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">{preview.items.slice(0, 24).map((item) => <div key={item.id} className="rounded-md border bg-background p-3 text-sm"><div className="font-medium">{item.name}</div><div className="mt-1 text-xs text-muted-foreground">{item.code} · {item.nodeType} · target {item.targetCoverage}</div></div>)}</div>
          {preview.items.length > 24 && <div className="mt-2 text-xs text-muted-foreground">+ {preview.items.length - 24} more units in the governed plan.</div>}
        </div>}
      </CardContent>
    </Card>

    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <Card>
        <CardHeader><CardTitle className="text-base">Planning batches</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {batches.length === 0 ? <div className="text-sm text-muted-foreground">No syllabus plans yet.</div> : batches.map((batch) => <button key={batch.id} type="button" onClick={() => setSelectedBatchId(batch.id)} className={`w-full rounded-lg border p-3 text-left ${selectedBatchId === batch.id ? 'border-primary bg-primary/5' : ''}`}><div className="font-medium">{batch.title}</div><div className="mt-1 text-xs text-muted-foreground">{batch.examCode} · {batch.rootTaxonomyCode}</div><div className="mt-2 flex flex-wrap gap-1"><Badge variant="outline">{batch.itemCount} units</Badge><Badge variant="outline">{batch.plannedCount} planned</Badge><Badge variant="outline">{batch.jobCreatedCount} jobs</Badge></div></button>)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Authoring backlog</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {!detail ? <div className="text-sm text-muted-foreground">Select a planning batch.</div> : <>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div><div className="font-semibold">{detail.batch.title}</div><div className="text-sm text-muted-foreground">{detail.batch.examName} · {detail.batch.rootTaxonomyName} · {pretty(detail.batch.depth)}</div></div>
              <Button onClick={() => void createJobs()} disabled={!canEdit || working || detail.batch.status !== 'active' || detail.batch.plannedCount === 0}><Play className="mr-1.5 h-4 w-4" />Create next {Math.min(50, detail.batch.plannedCount)} brief jobs</Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[['Planned', detail.batch.plannedCount], ['Jobs created', detail.batch.jobCreatedCount], ['Skipped', detail.batch.skippedCount], ['Approved / materialized', detail.batch.approvedOrMaterializedCount]].map(([label, value]) => <div key={String(label)} className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 text-xl font-bold">{value}</div></div>)}
            </div>
            <div className="space-y-2">{detail.items.map((item) => <div key={item.id} className="flex flex-col gap-3 rounded-lg border p-3 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="font-medium">{item.taxonomySnapshot.name || 'Taxonomy note unit'}</div><div className="mt-1 text-xs text-muted-foreground">{item.taxonomySnapshot.code} · {item.taxonomySnapshot.nodeType} · target {item.targetCoverage} · priority {item.priority}</div>{item.authoringJobState && <div className="mt-1 text-xs">Authoring job: <Badge variant="outline">{pretty(item.authoringJobState)}</Badge></div>}</div><div className="flex shrink-0 items-center gap-2"><Badge variant={item.itemState === 'job_created' ? 'default' : 'outline'}>{pretty(item.itemState)}</Badge>{canEdit && item.itemState === 'planned' && <Button size="sm" variant="ghost" onClick={() => void updateItem(item, 'skip')} disabled={working}><SkipForward className="mr-1 h-3.5 w-3.5" />Skip</Button>}{canEdit && item.itemState === 'skipped' && <Button size="sm" variant="ghost" onClick={() => void updateItem(item, 'restore')} disabled={working}><RotateCcw className="mr-1 h-3.5 w-3.5" />Restore</Button>}</div></div>)}</div>
          </>}
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardContent className="grid gap-2 p-4 md:grid-cols-3">
        <div className="rounded-lg border p-3 text-sm"><div className="font-medium">Automatic source ingestion</div><div className="mt-1 text-xs text-muted-foreground">OFF — every planned job still starts at Brief.</div></div>
        <div className="rounded-lg border p-3 text-sm"><div className="font-medium">Automatic generation</div><div className="mt-1 text-xs text-muted-foreground">OFF — evidence and coverage gates remain mandatory.</div></div>
        <div className="rounded-lg border p-3 text-sm"><div className="font-medium">Automatic publication</div><div className="mt-1 text-xs text-muted-foreground">OFF — canonical Learning Resources keeps the final publish action.</div></div>
      </CardContent>
    </Card>
  </div>;
}

export default NotesStudioPlanningPage;
