import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Archive,
  CalendarClock,
  CheckCircle2,
  CopyPlus,
  FilePlus2,
  Layers3,
  Loader2,
  PencilLine,
  Plus,
  RefreshCw,
  Rocket,
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
  assembleBlueprint,
  createBlueprint,
  getBlueprintCatalog,
  getBlueprints,
  transitionBlueprint,
  updateBlueprint,
  type BlueprintVersionInput,
  type PlanningExamVersion,
  type PlanningLanguage,
  type PlanningTaxonomyNode,
  type TestBlueprint,
} from '@/features/test-planning/api';
import {
  blueprintIssues,
  blueprintQuestionCount,
  planningStatusTone,
} from '@/features/test-planning/model';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

interface CatalogState {
  examVersions: PlanningExamVersion[];
  taxonomyNodes: PlanningTaxonomyNode[];
  languages: PlanningLanguage[];
}

interface SectionDraft {
  clientKey: string;
  name: string;
  questionCount: number;
  marks: number;
  durationMinutes: number | null;
  taxonomyNodeIds: string[];
  languageCode: string;
  negativeMarks: number;
  easy: number;
  medium: number;
  hard: number;
}

interface BlueprintDraft {
  id?: string;
  expectedCurrentVersionNumber?: number;
  examVersionId: string;
  code: string;
  name: string;
  durationMinutes: number;
  totalMarks: number;
  status: 'draft' | 'active' | 'deprecated' | 'archived';
  stage: string;
  instructions: string;
  switchSections: boolean;
  markForReview: boolean;
  changeReason: string;
  sections: SectionDraft[];
}

const EMPTY_CATALOG: CatalogState = { examVersions: [], taxonomyNodes: [], languages: [] };

function emptySection(index = 1): SectionDraft {
  return {
    clientKey: `section-${index}`,
    name: '',
    questionCount: 25,
    marks: 50,
    durationMinutes: null,
    taxonomyNodeIds: [],
    languageCode: 'en',
    negativeMarks: 0.5,
    easy: 8,
    medium: 12,
    hard: 5,
  };
}

function emptyDraft(catalog: CatalogState): BlueprintDraft {
  return {
    examVersionId: catalog.examVersions[0]?.id ?? '',
    code: `BP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
    name: '',
    durationMinutes: 60,
    totalMarks: 50,
    status: 'draft',
    stage: '',
    instructions: '',
    switchSections: true,
    markForReview: true,
    changeReason: 'Create exam blueprint',
    sections: [emptySection()],
  };
}

function fromBlueprint(blueprint: TestBlueprint): BlueprintDraft {
  const navigation = blueprint.configuration.navigationRules ?? {};
  return {
    id: blueprint.id,
    expectedCurrentVersionNumber: blueprint.currentVersionNumber,
    examVersionId: blueprint.examVersionId,
    code: blueprint.code,
    name: blueprint.name,
    durationMinutes: blueprint.durationSeconds / 60,
    totalMarks: blueprint.totalMarks,
    status: blueprint.configuration.status,
    stage: blueprint.configuration.stage ?? '',
    instructions: typeof blueprint.instructions.text === 'string' ? blueprint.instructions.text : '',
    switchSections: navigation.switchSections !== false,
    markForReview: navigation.markForReview !== false,
    changeReason: 'Revise exam blueprint',
    sections: blueprint.sections.map((section) => ({
      clientKey: section.clientKey,
      name: section.name,
      questionCount: section.questionCount,
      marks: section.marks,
      durationMinutes: section.durationSeconds == null ? null : section.durationSeconds / 60,
      taxonomyNodeIds: section.selectionRules.taxonomyNodeIds ?? [],
      languageCode: section.selectionRules.languageCode ?? 'en',
      negativeMarks: Number(section.selectionRules.negativeMarks ?? 0),
      easy: Number(section.selectionRules.difficulties?.easy ?? 0),
      medium: Number(section.selectionRules.difficulties?.medium ?? 0),
      hard: Number(section.selectionRules.difficulties?.hard ?? 0),
    })),
  };
}

function toInput(draft: BlueprintDraft): BlueprintVersionInput {
  return {
    expectedCurrentVersionNumber: draft.expectedCurrentVersionNumber,
    examVersionId: draft.examVersionId,
    code: draft.code,
    name: draft.name,
    durationMinutes: draft.durationMinutes,
    totalMarks: draft.totalMarks,
    instructions: { text: draft.instructions },
    configuration: {
      status: draft.status,
      stage: draft.stage,
      navigationRules: {
        switchSections: draft.switchSections,
        markForReview: draft.markForReview,
      },
    },
    changeReason: draft.changeReason,
    sections: draft.sections.map((section) => ({
      clientKey: section.clientKey,
      name: section.name,
      questionCount: section.questionCount,
      marks: section.marks,
      durationMinutes: section.durationMinutes,
      selectionRules: {
        taxonomyNodeIds: section.taxonomyNodeIds,
        languageCode: section.languageCode,
        negativeMarks: section.negativeMarks,
        difficulties: {
          easy: section.easy,
          medium: section.medium,
          hard: section.hard,
        },
      },
    })),
  };
}

function draftIssues(draft: BlueprintDraft): string[] {
  const issues: string[] = [];
  if (!draft.examVersionId) issues.push('Select an exam version.');
  if (draft.name.trim().length < 3) issues.push('Blueprint name is required.');
  if (draft.code.trim().length < 3) issues.push('Blueprint code is required.');
  if (draft.changeReason.trim().length < 3) issues.push('Change reason is required.');
  const marks = draft.sections.reduce((sum, section) => sum + Number(section.marks || 0), 0);
  if (Math.abs(marks - draft.totalMarks) > 0.001) issues.push(`Section marks total ${marks}, expected ${draft.totalMarks}.`);
  const timed = draft.sections.filter((section) => section.durationMinutes != null);
  if (timed.length > 0) {
    const duration = timed.reduce((sum, section) => sum + Number(section.durationMinutes || 0), 0);
    if (duration !== draft.durationMinutes) issues.push(`Section timing totals ${duration} minutes, expected ${draft.durationMinutes}.`);
  }
  draft.sections.forEach((section, index) => {
    if (!section.name.trim()) issues.push(`Section ${index + 1} needs a name.`);
    if (!section.taxonomyNodeIds.length) issues.push(`${section.name || `Section ${index + 1}`} needs a taxonomy target.`);
    if (section.easy + section.medium + section.hard !== section.questionCount) {
      issues.push(`${section.name || `Section ${index + 1}`} difficulty mix must total ${section.questionCount}.`);
    }
  });
  return issues;
}

export function BlueprintWorkspacePage() {
  const navigate = useNavigate();
  const { hasPermission } = useAdminPermissions();
  const [catalog, setCatalog] = useState<CatalogState>(EMPTY_CATALOG);
  const [blueprints, setBlueprints] = useState<TestBlueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [draft, setDraft] = useState<BlueprintDraft | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catalogResponse, listResponse] = await Promise.all([getBlueprintCatalog(), getBlueprints()]);
      setCatalog({
        examVersions: catalogResponse.examVersions,
        taxonomyNodes: catalogResponse.taxonomyNodes,
        languages: catalogResponse.languages,
      });
      setBlueprints(listResponse.blueprints);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Exam Blueprints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return blueprints.filter((blueprint) => {
      if (status !== 'all' && blueprint.configuration.status !== status) return false;
      if (!normalized) return true;
      return [blueprint.code, blueprint.name, blueprint.examName, blueprint.examFamilyName]
        .join(' ').toLowerCase().includes(normalized);
    });
  }, [blueprints, search, status]);

  const save = async () => {
    if (!draft) return;
    const issues = draftIssues(draft);
    if (issues.length > 0) {
      showToast.error('Blueprint validation failed', issues[0]);
      return;
    }
    setMutating(true);
    try {
      if (draft.id) await updateBlueprint(draft.id, toInput(draft));
      else await createBlueprint(toInput(draft));
      setDraft(null);
      await refresh();
      showToast.success(draft.id ? 'Blueprint version created' : 'Blueprint created', 'The canonical blueprint is ready for planning.');
    } catch (caught) {
      showToast.error('Unable to save blueprint', caught instanceof Error ? caught.message : 'Blueprint save failed.');
    } finally {
      setMutating(false);
    }
  };

  const lifecycle = async (blueprint: TestBlueprint, action: 'activate' | 'deprecate' | 'archive' | 'restore') => {
    setMutating(true);
    try {
      await transitionBlueprint(blueprint.id, action, `${action} ${blueprint.code} from blueprint workspace`);
      await refresh();
      showToast.success('Blueprint lifecycle updated', `${blueprint.code} is now ${action === 'restore' ? 'draft' : `${action}d`}.`);
    } catch (caught) {
      showToast.error('Blueprint action failed', caught instanceof Error ? caught.message : 'Unable to update blueprint.');
    } finally {
      setMutating(false);
    }
  };

  const assemble = async (blueprint: TestBlueprint) => {
    setMutating(true);
    try {
      const result = await assembleBlueprint(blueprint.id, { title: `${blueprint.name} Mock Test` });
      showToast.success('Canonical test draft created', `${result.publicCode} contains ${result.questionCount} blueprint-selected questions.`);
      navigate(`/tests/${result.testId}`);
    } catch (caught) {
      const details = (caught as Error & { details?: unknown }).details;
      const detail = Array.isArray(details) ? details.join(' ') : undefined;
      showToast.error('Blueprint assembly failed', detail || (caught instanceof Error ? caught.message : 'Unable to assemble test.'));
    } finally {
      setMutating(false);
    }
  };

  const metrics = useMemo(() => ({
    total: blueprints.length,
    active: blueprints.filter((item) => item.configuration.status === 'active').length,
    sections: blueprints.reduce((sum, item) => sum + item.sections.length, 0),
    questions: blueprints.reduce((sum, item) => sum + blueprintQuestionCount(item), 0),
  }), [blueprints]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Blueprints"
        description="Canonical versioned exam patterns with section, taxonomy, difficulty, language, marks and timing rules."
        icon={<CalendarClock className="h-5 w-5" />}
        actions={(
          <>
            <Badge variant="outline" className="border-success/30 bg-success/5 text-success"><ShieldCheck className="mr-1 h-3.5 w-3.5" /> Immutable versions</Badge>
            <Button variant="outline" disabled={loading || mutating} onClick={() => void refresh()}><RefreshCw className={cn('mr-1.5 h-4 w-4', loading && 'animate-spin')} /> Refresh</Button>
            <Button disabled={!hasPermission('tests.create')} onClick={() => setDraft(emptyDraft(catalog))}><Plus className="mr-1.5 h-4 w-4" /> New blueprint</Button>
          </>
        )}
      />

      {error && <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<Layers3 className="h-4 w-4" />} label="Blueprints" value={metrics.total} />
        <Metric icon={<CheckCircle2 className="h-4 w-4" />} label="Active" value={metrics.active} tone="success" />
        <Metric icon={<CalendarClock className="h-4 w-4" />} label="Sections" value={metrics.sections} tone="info" />
        <Metric icon={<FilePlus2 className="h-4 w-4" />} label="Planned questions" value={metrics.questions} tone="info" />
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 lg:grid-cols-[1fr_210px]">
          <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search blueprint, code or exam" className="pl-9" /></div>
          <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="deprecated">Deprecated</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
        </CardContent>
      </Card>

      {loading ? (
        <Card><CardContent className="flex min-h-72 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading canonical blueprints…</CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center"><CalendarClock className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-3 font-semibold">No blueprints match this view</p><p className="mt-1 text-sm text-muted-foreground">Create the first canonical exam pattern or clear the filters.</p></CardContent></Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((blueprint) => (
            <BlueprintCard
              key={blueprint.id}
              blueprint={blueprint}
              mutating={mutating}
              canUpdate={hasPermission('tests.update')}
              canCreate={hasPermission('tests.create')}
              onEdit={() => setDraft(fromBlueprint(blueprint))}
              onLifecycle={(action) => void lifecycle(blueprint, action)}
              onAssemble={() => void assemble(blueprint)}
            />
          ))}
        </div>
      )}

      {draft && (
        <BlueprintEditor
          draft={draft}
          catalog={catalog}
          mutating={mutating}
          onChange={setDraft}
          onClose={() => setDraft(null)}
          onSave={() => void save()}
        />
      )}
    </div>
  );
}

function BlueprintCard({ blueprint, mutating, canUpdate, canCreate, onEdit, onLifecycle, onAssemble }: {
  blueprint: TestBlueprint;
  mutating: boolean;
  canUpdate: boolean;
  canCreate: boolean;
  onEdit: () => void;
  onLifecycle: (action: 'activate' | 'deprecate' | 'archive' | 'restore') => void;
  onAssemble: () => void;
}) {
  const issues = blueprintIssues(blueprint);
  const status = blueprint.configuration.status;
  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-bold">{blueprint.code}</span><Badge variant="outline">v{blueprint.currentVersionNumber}</Badge><StatusBadge tone={planningStatusTone(status)} dot>{status}</StatusBadge></div><CardTitle className="mt-2 text-base">{blueprint.name}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{blueprint.examName}{blueprint.configuration.stage ? ` · ${blueprint.configuration.stage}` : ''}</p></div>
          <Button size="icon" variant="ghost" disabled={!canUpdate || mutating} onClick={onEdit}><PencilLine className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4">
        <div className="grid grid-cols-4 gap-2 text-center text-xs"><Stat label="Sections" value={blueprint.sections.length} /><Stat label="Questions" value={blueprintQuestionCount(blueprint)} /><Stat label="Marks" value={blueprint.totalMarks} /><Stat label="Minutes" value={Math.round(blueprint.durationSeconds / 60)} /></div>
        <div className="rounded-lg border"><div className="grid grid-cols-[1fr_50px_55px] bg-muted/30 px-3 py-2 text-[10px] font-semibold uppercase text-muted-foreground"><span>Section</span><span className="text-right">Q</span><span className="text-right">Marks</span></div>{blueprint.sections.map((section) => <div key={section.clientKey} className="grid grid-cols-[1fr_50px_55px] border-t px-3 py-2 text-xs"><span className="truncate">{section.name}</span><span className="text-right">{section.questionCount}</span><span className="text-right">{section.marks}</span></div>)}</div>
        {issues.length > 0 ? <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive"><AlertTriangle className="mr-1 inline h-3.5 w-3.5" />{issues[0].message}</div> : <div className="rounded-lg border border-success/30 bg-success/5 p-3 text-xs text-success"><CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />Structurally ready</div>}
        <div className="mt-auto flex flex-wrap gap-2">
          {status === 'active' && <Button size="sm" disabled={!canCreate || mutating} onClick={onAssemble}><Rocket className="mr-1.5 h-3.5 w-3.5" /> Create test draft</Button>}
          {status === 'draft' && <Button size="sm" variant="outline" disabled={!canUpdate || mutating || issues.length > 0} onClick={() => onLifecycle('activate')}><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Activate</Button>}
          {status === 'active' && <Button size="sm" variant="outline" disabled={!canUpdate || mutating} onClick={() => onLifecycle('deprecate')}>Deprecate</Button>}
          {status === 'deprecated' && <Button size="sm" variant="outline" disabled={!canUpdate || mutating} onClick={() => onLifecycle('restore')}><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Restore draft</Button>}
          {status !== 'archived' && <Button size="sm" variant="ghost" className="text-muted-foreground" disabled={!canUpdate || mutating} onClick={() => onLifecycle('archive')}><Archive className="mr-1.5 h-3.5 w-3.5" /> Archive</Button>}
          {status === 'archived' && <Button size="sm" variant="outline" disabled={!canUpdate || mutating} onClick={() => onLifecycle('restore')}>Restore</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

function BlueprintEditor({ draft, catalog, mutating, onChange, onClose, onSave }: {
  draft: BlueprintDraft;
  catalog: CatalogState;
  mutating: boolean;
  onChange: (draft: BlueprintDraft) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const issues = draftIssues(draft);
  const updateSection = (index: number, patch: Partial<SectionDraft>) => onChange({ ...draft, sections: draft.sections.map((section, sectionIndex) => sectionIndex === index ? { ...section, ...patch } : section) });
  const removeSection = (index: number) => onChange({ ...draft, sections: draft.sections.filter((_, sectionIndex) => sectionIndex !== index) });
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto">
        <DialogHeader><DialogTitle>{draft.id ? 'Create blueprint revision' : 'Create exam blueprint'}</DialogTitle><DialogDescription>Every save creates an immutable pattern version. Active blueprints can create canonical test drafts.</DialogDescription></DialogHeader>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Exam version" className="xl:col-span-2"><Select value={draft.examVersionId} onValueChange={(value) => onChange({ ...draft, examVersionId: value })}><SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger><SelectContent>{catalog.examVersions.map((exam) => <SelectItem key={exam.id} value={exam.id}>{exam.familyName} · {exam.examName} · v{exam.versionNumber}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Blueprint code"><Input value={draft.code} disabled={Boolean(draft.id)} onChange={(event) => onChange({ ...draft, code: event.target.value.toUpperCase() })} /></Field>
          <Field label="Status"><Select value={draft.status} onValueChange={(value) => onChange({ ...draft, status: value as BlueprintDraft['status'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="deprecated">Deprecated</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></Field>
          <Field label="Blueprint name" className="md:col-span-2"><Input value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} /></Field>
          <Field label="Stage"><Input value={draft.stage} onChange={(event) => onChange({ ...draft, stage: event.target.value })} placeholder="Tier 1, Prelims, Mains…" /></Field>
          <Field label="Duration (minutes)"><Input type="number" min={1} value={draft.durationMinutes} onChange={(event) => onChange({ ...draft, durationMinutes: Number(event.target.value) || 1 })} /></Field>
          <Field label="Total marks"><Input type="number" min={0.01} step="0.25" value={draft.totalMarks} onChange={(event) => onChange({ ...draft, totalMarks: Number(event.target.value) || 0 })} /></Field>
          <Field label="Change reason" className="md:col-span-2 xl:col-span-3"><Input value={draft.changeReason} onChange={(event) => onChange({ ...draft, changeReason: event.target.value })} /></Field>
          <Field label="Candidate instructions" className="md:col-span-2 xl:col-span-4"><Textarea value={draft.instructions} onChange={(event) => onChange({ ...draft, instructions: event.target.value })} className="min-h-20" /></Field>
        </div>
        <div className="flex flex-wrap gap-5 rounded-lg border bg-muted/20 p-3"><label className="flex items-center gap-2 text-sm"><Checkbox checked={draft.switchSections} onCheckedChange={(checked) => onChange({ ...draft, switchSections: checked === true })} /> Allow section switching</label><label className="flex items-center gap-2 text-sm"><Checkbox checked={draft.markForReview} onCheckedChange={(checked) => onChange({ ...draft, markForReview: checked === true })} /> Allow mark for review</label></div>
        <div className="space-y-4"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Blueprint sections</h3><p className="text-xs text-muted-foreground">Difficulty counts must exactly match each section question count.</p></div><Button variant="outline" size="sm" onClick={() => onChange({ ...draft, sections: [...draft.sections, emptySection(draft.sections.length + 1)] })}><CopyPlus className="mr-1.5 h-4 w-4" /> Add section</Button></div>{draft.sections.map((section, index) => <SectionEditor key={`${section.clientKey}-${index}`} section={section} index={index} catalog={catalog} onChange={(patch) => updateSection(index, patch)} onRemove={() => removeSection(index)} canRemove={draft.sections.length > 1} />)}</div>
        {issues.length > 0 && <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><p className="font-semibold">{issues.length} issue(s) block saving</p><ul className="mt-2 list-disc space-y-1 pl-5 text-xs">{issues.slice(0, 8).map((issue) => <li key={issue}>{issue}</li>)}</ul></div>}
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={mutating || issues.length > 0} onClick={onSave}>{mutating ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />} Save immutable version</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SectionEditor({ section, index, catalog, onChange, onRemove, canRemove }: { section: SectionDraft; index: number; catalog: CatalogState; onChange: (patch: Partial<SectionDraft>) => void; onRemove: () => void; canRemove: boolean }) {
  const [taxonomySearch, setTaxonomySearch] = useState('');
  const filteredNodes = catalog.taxonomyNodes.filter((node) => `${node.name} ${node.code} ${node.nodeType}`.toLowerCase().includes(taxonomySearch.toLowerCase())).slice(0, 100);
  const toggleNode = (id: string, checked: boolean) => onChange({ taxonomyNodeIds: checked ? [...section.taxonomyNodeIds, id] : section.taxonomyNodeIds.filter((nodeId) => nodeId !== id) });
  return (
    <Card><CardHeader className="py-4"><div className="flex items-center justify-between"><CardTitle className="text-sm">Section {index + 1}</CardTitle><Button size="icon" variant="ghost" disabled={!canRemove} onClick={onRemove}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></CardHeader><CardContent className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6"><Field label="Key"><Input value={section.clientKey} onChange={(event) => onChange({ clientKey: event.target.value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-') })} /></Field><Field label="Section name" className="xl:col-span-2"><Input value={section.name} onChange={(event) => onChange({ name: event.target.value })} /></Field><Field label="Questions"><Input type="number" min={1} value={section.questionCount} onChange={(event) => onChange({ questionCount: Number(event.target.value) || 1 })} /></Field><Field label="Marks"><Input type="number" min={0.01} step="0.25" value={section.marks} onChange={(event) => onChange({ marks: Number(event.target.value) || 0 })} /></Field><Field label="Minutes"><Input type="number" min={1} value={section.durationMinutes ?? ''} placeholder="Shared" onChange={(event) => onChange({ durationMinutes: event.target.value ? Number(event.target.value) : null })} /></Field></div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"><Field label="Language"><Select value={section.languageCode} onValueChange={(value) => onChange({ languageCode: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{catalog.languages.map((language) => <SelectItem key={language.id} value={language.code}>{language.name}</SelectItem>)}</SelectContent></Select></Field><Field label="Negative marks"><Input type="number" min={0} step="0.01" value={section.negativeMarks} onChange={(event) => onChange({ negativeMarks: Number(event.target.value) || 0 })} /></Field><Field label="Easy"><Input type="number" min={0} value={section.easy} onChange={(event) => onChange({ easy: Number(event.target.value) || 0 })} /></Field><Field label="Medium"><Input type="number" min={0} value={section.medium} onChange={(event) => onChange({ medium: Number(event.target.value) || 0 })} /></Field><Field label="Hard"><Input type="number" min={0} value={section.hard} onChange={(event) => onChange({ hard: Number(event.target.value) || 0 })} /></Field></div>
      <div><Label className="text-xs">Taxonomy targets</Label><div className="relative mt-1.5"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={taxonomySearch} onChange={(event) => setTaxonomySearch(event.target.value)} placeholder="Search chapter, topic, subject or canonical problem" className="pl-9" /></div><div className="mt-2 max-h-40 overflow-y-auto rounded-lg border p-2"><div className="grid gap-1 md:grid-cols-2 xl:grid-cols-3">{filteredNodes.map((node) => <label key={node.id} className="flex items-start gap-2 rounded-md p-2 text-xs hover:bg-muted/40"><Checkbox checked={section.taxonomyNodeIds.includes(node.id)} onCheckedChange={(checked) => toggleNode(node.id, checked === true)} /><span><span className="font-medium">{node.name}</span><span className="block text-[10px] uppercase text-muted-foreground">{node.nodeType} · {node.code}</span></span></label>)}</div></div><p className="mt-1 text-[11px] text-muted-foreground">{section.taxonomyNodeIds.length} target(s) selected.</p></div>
    </CardContent></Card>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) { return <div className={className}><Label className="mb-1.5 block text-xs">{label}</Label>{children}</div>; }
function Metric({ icon, label, value, tone = 'neutral' }: { icon: ReactNode; label: string; value: number; tone?: 'neutral' | 'info' | 'success' }) { const color = tone === 'success' ? 'text-success' : tone === 'info' ? 'text-info' : 'text-muted-foreground'; return <Card><CardContent className="p-4"><div className={cn('flex items-center gap-2 text-xs', color)}>{icon}{label}</div><p className="mt-2 text-2xl font-bold">{value}</p></CardContent></Card>; }
function Stat({ label, value }: { label: string; value: number | string }) { return <div className="rounded-md border bg-muted/20 px-2 py-2"><p className="font-bold">{value}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p></div>; }
