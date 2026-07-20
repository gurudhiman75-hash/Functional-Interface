import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Archive,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CopyPlus,
  Database,
  Eye,
  FilePlus2,
  History,
  Loader2,
  Network,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  X,
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
  BlueprintCatalog,
  BlueprintDetail,
  BlueprintInput,
  BlueprintSectionInput,
  BlueprintSummary,
} from '@/features/test-blueprints/api';
import { useTestBlueprints } from '@/features/test-blueprints/useTestBlueprints';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

const ALL = 'all';
type EditorMode = 'view' | 'edit' | 'new';

type EditableSection = BlueprintSectionInput & { clientId: string };

interface EditorDraft {
  examVersionId: string;
  code: string;
  name: string;
  durationMinutes: number;
  totalMarks: number;
  instructionText: string;
  changeReason: string;
  sections: EditableSection[];
}

function clientId() {
  return `section-${Math.random().toString(36).slice(2, 10)}`;
}

function newSection(index: number, languageCode = 'en'): EditableSection {
  return {
    clientId: clientId(),
    sectionKey: `section-${index + 1}`,
    name: `Section ${index + 1}`,
    questionCount: 25,
    marks: 50,
    durationMinutes: 15,
    taxonomyNodeIds: [],
    difficultyTargets: { easy: 8, medium: 12, hard: 5 },
    languageCode,
    negativeMarks: 0.5,
  };
}

function blankDraft(catalog: BlueprintCatalog): EditorDraft {
  const examVersion = catalog.examVersions[0];
  const languageCode = examVersion?.languages[0]?.code ?? 'en';
  return {
    examVersionId: examVersion?.id ?? '',
    code: '',
    name: '',
    durationMinutes: 60,
    totalMarks: 50,
    instructionText: 'Read every question carefully. Follow the section and marking instructions shown in the test.',
    changeReason: 'Create a reusable canonical exam blueprint',
    sections: [newSection(0, languageCode)],
  };
}

function detailDraft(detail: BlueprintDetail): EditorDraft {
  const instructionValue = detail.currentVersion?.instructions?.default;
  return {
    examVersionId: detail.blueprint.examVersionId,
    code: detail.blueprint.code,
    name: detail.blueprint.name,
    durationMinutes: Number(detail.currentVersion?.durationSeconds ?? 3600) / 60,
    totalMarks: Number(detail.currentVersion?.totalMarks ?? 0),
    instructionText: typeof instructionValue === 'string' ? instructionValue : '',
    changeReason: `Editorial update to ${detail.blueprint.code}`,
    sections: detail.sections.map((section) => ({
      clientId: clientId(),
      sectionKey: section.sectionKey,
      name: section.name,
      questionCount: section.questionCount,
      marks: section.marks,
      durationMinutes: section.durationSeconds == null ? null : section.durationSeconds / 60,
      taxonomyNodeIds: section.selectionRules.taxonomyNodeIds ?? [],
      difficultyTargets: {
        easy: Number(section.selectionRules.difficultyTargets?.easy ?? 0),
        medium: Number(section.selectionRules.difficultyTargets?.medium ?? 0),
        hard: Number(section.selectionRules.difficultyTargets?.hard ?? 0),
      },
      languageCode: section.selectionRules.languageCode ?? 'en',
      negativeMarks: Number(section.selectionRules.negativeMarks ?? 0),
    })),
  };
}

function normalizedCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function sectionQuotaTotal(section: EditableSection) {
  return section.difficultyTargets.easy + section.difficultyTargets.medium + section.difficultyTargets.hard;
}

export function ExamBlueprintsWorkspacePage() {
  const navigate = useNavigate();
  const { hasPermission } = useAdminPermissions();
  const canCreate = hasPermission('tests.create');
  const canUpdate = hasPermission('tests.update');
  const workspace = useTestBlueprints();
  const [mode, setMode] = useState<EditorMode>('view');
  const [draft, setDraft] = useState<EditorDraft>(() => blankDraft(workspace.catalog));
  const [search, setSearch] = useState('');
  const [archiveFilter, setArchiveFilter] = useState(ALL);
  const [seed, setSeed] = useState('');
  const [testTitle, setTestTitle] = useState('');
  const [assemblyReason, setAssemblyReason] = useState('Create a draft from the approved blueprint rules');
  const [archiveReason, setArchiveReason] = useState('Blueprint is no longer used for current test production');

  useEffect(() => {
    if (mode === 'new' && !draft.examVersionId && workspace.catalog.examVersions[0]) {
      setDraft(blankDraft(workspace.catalog));
    }
  }, [draft.examVersionId, mode, workspace.catalog]);

  useEffect(() => {
    if (mode !== 'view' || !workspace.detail) return;
    setTestTitle(`${workspace.detail.blueprint.name} Mock Test`);
    setSeed('');
  }, [mode, workspace.detail]);

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return workspace.blueprints.filter((blueprint) => {
      if (archiveFilter === 'active' && blueprint.deletedAt) return false;
      if (archiveFilter === 'archived' && !blueprint.deletedAt) return false;
      if (!normalized) return true;
      return [blueprint.code, blueprint.name, blueprint.examName, blueprint.examFamilyName]
        .join(' ')
        .toLowerCase()
        .includes(normalized);
    });
  }, [archiveFilter, search, workspace.blueprints]);

  const metrics = useMemo(() => ({
    total: workspace.blueprints.length,
    active: workspace.blueprints.filter((entry) => !entry.deletedAt).length,
    capacity: workspace.blueprints.filter((entry) => !entry.deletedAt).reduce((sum, entry) => sum + entry.questionCount, 0),
    archived: workspace.blueprints.filter((entry) => entry.deletedAt).length,
  }), [workspace.blueprints]);

  const beginNew = () => {
    setDraft(blankDraft(workspace.catalog));
    setMode('new');
  };

  const beginEdit = () => {
    if (!workspace.detail) return;
    setDraft(detailDraft(workspace.detail));
    setMode('edit');
  };

  const saveDraft = async () => {
    const expectedCurrentVersionNumber = mode === 'edit'
      ? workspace.detail?.blueprint.currentVersionNumber ?? null
      : null;
    const input: BlueprintInput = {
      expectedCurrentVersionNumber,
      examVersionId: draft.examVersionId,
      code: normalizedCode(draft.code),
      name: draft.name,
      durationMinutes: draft.durationMinutes,
      totalMarks: draft.totalMarks,
      instructions: { default: draft.instructionText },
      configuration: {
        assemblyMode: 'deterministic_question_bank',
        duplicateStemPolicy: 'block_within_test',
      },
      changeReason: draft.changeReason,
      sections: draft.sections.map(({ clientId: _clientId, ...section }) => section),
    };
    try {
      const result = await workspace.save(input, mode === 'edit' ? workspace.selectedId : null);
      setMode('view');
      showToast.success(
        mode === 'edit' ? 'Blueprint version created' : 'Blueprint created',
        `${result.blueprint.code} version ${result.blueprint.currentVersionNumber} is ready for coverage preview.`,
      );
    } catch (caught) {
      showToast.error('Blueprint save failed', caught instanceof Error ? caught.message : 'Unable to save blueprint.');
    }
  };

  const previewCoverage = async () => {
    try {
      const plan = await workspace.runPreview(seed.trim() || undefined);
      setSeed(plan.seed);
      showToast[plan.ready ? 'success' : 'info'](
        plan.ready ? 'Blueprint coverage ready' : 'Coverage shortages found',
        `${plan.selectedCount} of ${plan.requiredCount} required questions are available.`,
      );
    } catch (caught) {
      showToast.error('Coverage preview failed', caught instanceof Error ? caught.message : 'Unable to preview coverage.');
    }
  };

  const assembleTest = async () => {
    try {
      const result = await workspace.assemble({
        title: testTitle,
        seed: seed.trim() || workspace.preview?.seed,
        changeReason: assemblyReason,
      });
      showToast.success('Blueprint-compliant draft created', `${result.publicCode} is ready in Test Builder and Test QA.`);
      navigate(`/tests/${result.testId}`);
    } catch (caught) {
      showToast.error('Assembly failed', caught instanceof Error ? caught.message : 'Unable to assemble the test.');
    }
  };

  const transition = async (action: 'archive' | 'restore') => {
    try {
      await workspace.transition(action, archiveReason);
      showToast.success(`Blueprint ${action}d`, `The blueprint is now ${action === 'archive' ? 'inactive' : 'active'}.`);
    } catch (caught) {
      showToast.error(`Unable to ${action} blueprint`, caught instanceof Error ? caught.message : 'Blueprint action failed.');
    }
  };

  const editorIssues = useMemo(() => {
    const issues: string[] = [];
    if (!draft.examVersionId) issues.push('Select an exam version.');
    if (draft.name.trim().length < 3) issues.push('Blueprint name is required.');
    if (normalizedCode(draft.code).length < 3) issues.push('Blueprint code is required.');
    if (draft.changeReason.trim().length < 3) issues.push('Change reason is required.');
    const marks = draft.sections.reduce((sum, section) => sum + Number(section.marks || 0), 0);
    if (Math.abs(marks - Number(draft.totalMarks || 0)) > 0.001) issues.push(`Section marks total ${marks}; blueprint total is ${draft.totalMarks}.`);
    const allTimed = draft.sections.every((section) => section.durationMinutes != null);
    if (allTimed) {
      const duration = draft.sections.reduce((sum, section) => sum + Number(section.durationMinutes || 0), 0);
      if (Math.abs(duration - Number(draft.durationMinutes || 0)) > 0.001) issues.push(`Section duration totals ${duration}; blueprint duration is ${draft.durationMinutes}.`);
    }
    draft.sections.forEach((section) => {
      if (section.taxonomyNodeIds.length === 0) issues.push(`${section.name || section.sectionKey} needs a taxonomy target.`);
      if (sectionQuotaTotal(section) !== section.questionCount) issues.push(`${section.name || section.sectionKey} difficulty quotas do not match its question count.`);
      if (section.questionCount <= 0) issues.push(`${section.name || section.sectionKey} needs at least one question.`);
      if (section.marks <= 0) issues.push(`${section.name || section.sectionKey} needs positive marks.`);
      if (section.negativeMarks > section.marks / Math.max(1, section.questionCount)) issues.push(`${section.name || section.sectionKey} negative marks exceed marks per question.`);
    });
    return [...new Set(issues)];
  }, [draft]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Blueprints"
        description="Define immutable exam structures, measure Question Bank supply and assemble deterministic, QA-ready test drafts."
        icon={<ClipboardList className="h-5 w-5" />}
        actions={(
          <>
            <Badge variant="outline" className="border-success/30 bg-success/5 text-success"><Database className="mr-1 h-3.5 w-3.5" /> Canonical blueprint tables</Badge>
            <Button variant="outline" onClick={() => void workspace.refresh()} disabled={workspace.loading || workspace.mutating}><RefreshCw className={cn('mr-1.5 h-4 w-4', workspace.loading && 'animate-spin')} /> Refresh</Button>
            <Button onClick={beginNew} disabled={!canCreate || workspace.mutating}><FilePlus2 className="mr-1.5 h-4 w-4" /> New blueprint</Button>
          </>
        )}
      />

      {workspace.error && <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {workspace.error}</div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<ClipboardList className="h-4 w-4" />} label="Blueprints" value={metrics.total} />
        <Metric icon={<CheckCircle2 className="h-4 w-4" />} label="Active" value={metrics.active} tone="success" />
        <Metric icon={<BarChart3 className="h-4 w-4" />} label="Question capacity" value={metrics.capacity} tone="info" />
        <Metric icon={<Archive className="h-4 w-4" />} label="Archived" value={metrics.archived} tone={metrics.archived ? 'warning' : 'neutral'} />
      </div>

      <div className="grid min-h-[760px] gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-3 border-b">
            <CardTitle className="text-base">Blueprint library</CardTitle>
            <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search code, name or exam" className="pl-9" /></div>
            <Select value={archiveFilter} onValueChange={setArchiveFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>All blueprints</SelectItem><SelectItem value="active">Active only</SelectItem><SelectItem value="archived">Archived only</SelectItem></SelectContent></Select>
          </CardHeader>
          <CardContent className="max-h-[690px] space-y-2 overflow-y-auto p-3">
            {workspace.loading ? <div className="flex items-center justify-center gap-2 py-12 text-xs text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading blueprints…</div> : filtered.length === 0 ? <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">No blueprints match this view.</div> : filtered.map((blueprint) => <BlueprintListItem key={blueprint.id} blueprint={blueprint} selected={workspace.selectedId === blueprint.id && mode !== 'new'} onSelect={() => { workspace.setSelectedId(blueprint.id); setMode('view'); }} />)}
          </CardContent>
        </Card>

        {mode === 'new' || mode === 'edit' ? (
          <BlueprintEditor
            mode={mode}
            draft={draft}
            setDraft={setDraft}
            catalog={workspace.catalog}
            issues={editorIssues}
            saving={workspace.mutating}
            onCancel={() => setMode('view')}
            onSave={() => void saveDraft()}
          />
        ) : workspace.detailLoading ? (
          <Card><CardContent className="flex min-h-96 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading blueprint detail…</CardContent></Card>
        ) : workspace.detail ? (
          <BlueprintDetailView
            detail={workspace.detail}
            preview={workspace.preview}
            seed={seed}
            setSeed={setSeed}
            testTitle={testTitle}
            setTestTitle={setTestTitle}
            assemblyReason={assemblyReason}
            setAssemblyReason={setAssemblyReason}
            archiveReason={archiveReason}
            setArchiveReason={setArchiveReason}
            mutating={workspace.mutating}
            canCreate={canCreate}
            canUpdate={canUpdate}
            onEdit={beginEdit}
            onPreview={() => void previewCoverage()}
            onAssemble={() => void assembleTest()}
            onTransition={(action) => void transition(action)}
          />
        ) : (
          <Card><CardContent className="flex min-h-96 flex-col items-center justify-center text-center text-sm text-muted-foreground"><ClipboardList className="h-8 w-8" /><p className="mt-3 font-semibold text-foreground">Create the first exam blueprint</p><p className="mt-1 max-w-md text-xs">Blueprints turn exam patterns into reusable, measurable test-production rules.</p><Button className="mt-4" onClick={beginNew} disabled={!canCreate}><Plus className="mr-1.5 h-4 w-4" /> New blueprint</Button></CardContent></Card>
        )}
      </div>
    </div>
  );
}

function BlueprintListItem({ blueprint, selected, onSelect }: { blueprint: BlueprintSummary; selected: boolean; onSelect: () => void }) {
  return <button type="button" onClick={onSelect} className={cn('w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/40', selected && 'border-primary bg-primary/5')}><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate font-mono text-xs font-bold">{blueprint.code}</p><p className="mt-1 truncate text-sm font-medium">{blueprint.name}</p></div><Badge variant="outline" className={blueprint.deletedAt ? 'border-warning/30 text-warning' : 'border-success/30 text-success'}>{blueprint.deletedAt ? 'Archived' : 'Active'}</Badge></div><p className="mt-2 text-[11px] text-muted-foreground">{blueprint.examName} · v{blueprint.currentVersionNumber}</p><div className="mt-2 flex gap-2 text-[10px] text-muted-foreground"><span>{blueprint.sectionCount} sections</span><span>·</span><span>{blueprint.questionCount} questions</span><span>·</span><span>{blueprint.totalMarks ?? 0} marks</span></div></button>;
}

function BlueprintEditor({ mode, draft, setDraft, catalog, issues, saving, onCancel, onSave }: {
  mode: 'new' | 'edit';
  draft: EditorDraft;
  setDraft: React.Dispatch<React.SetStateAction<EditorDraft>>;
  catalog: BlueprintCatalog;
  issues: string[];
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  const exam = catalog.examVersions.find((entry) => entry.id === draft.examVersionId);
  const taxonomy = catalog.taxonomyNodes.filter((node) => node.examVersionIds.includes(draft.examVersionId));
  const languages = exam?.languages ?? [];
  const updateSection = (clientIdValue: string, patch: Partial<EditableSection>) => setDraft((current) => ({ ...current, sections: current.sections.map((section) => section.clientId === clientIdValue ? { ...section, ...patch } : section) }));
  const removeSection = (clientIdValue: string) => setDraft((current) => ({ ...current, sections: current.sections.filter((section) => section.clientId !== clientIdValue) }));
  const addSection = () => setDraft((current) => ({ ...current, sections: [...current.sections, newSection(current.sections.length, languages[0]?.code ?? 'en')] }));

  return <div className="space-y-4"><Card><CardHeader><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><CardTitle className="text-base">{mode === 'new' ? 'Create exam blueprint' : 'Create immutable blueprint version'}</CardTitle><p className="mt-1 text-xs text-muted-foreground">Each save preserves the previous exam pattern and selection rules.</p></div><Button variant="ghost" size="icon" onClick={onCancel}><X className="h-4 w-4" /></Button></div></CardHeader><CardContent className="space-y-4"><div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4"><Field label="Exam version" className="xl:col-span-2"><Select value={draft.examVersionId} onValueChange={(value) => setDraft((current) => ({ ...current, examVersionId: value, sections: current.sections.map((section) => ({ ...section, taxonomyNodeIds: [], languageCode: catalog.examVersions.find((entry) => entry.id === value)?.languages[0]?.code ?? 'en' })) }))}><SelectTrigger><SelectValue placeholder="Select exam version" /></SelectTrigger><SelectContent>{catalog.examVersions.map((entry) => <SelectItem key={entry.id} value={entry.id}>{entry.examFamilyName} · {entry.examName} · {entry.versionName}</SelectItem>)}</SelectContent></Select></Field><Field label="Blueprint code"><Input value={draft.code} onChange={(event) => setDraft((current) => ({ ...current, code: event.target.value }))} placeholder="SSC-CGL-T1" /></Field><Field label="Blueprint name"><Input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="SSC CGL Tier 1 Full Mock" /></Field><Field label="Duration (minutes)"><Input type="number" min={1} max={600} value={draft.durationMinutes} onChange={(event) => setDraft((current) => ({ ...current, durationMinutes: Number(event.target.value) || 0 }))} /></Field><Field label="Total marks"><Input type="number" min={0.01} value={draft.totalMarks} onChange={(event) => setDraft((current) => ({ ...current, totalMarks: Number(event.target.value) || 0 }))} /></Field><Field label="Change reason" className="xl:col-span-2"><Input value={draft.changeReason} onChange={(event) => setDraft((current) => ({ ...current, changeReason: event.target.value }))} /></Field></div><Field label="Default instructions"><Textarea value={draft.instructionText} onChange={(event) => setDraft((current) => ({ ...current, instructionText: event.target.value }))} className="min-h-24" /></Field></CardContent></Card>

    <div className="space-y-4">{draft.sections.map((section, index) => <SectionEditor key={section.clientId} section={section} index={index} taxonomy={taxonomy} languages={languages} canRemove={draft.sections.length > 1} onChange={(patch) => updateSection(section.clientId, patch)} onRemove={() => removeSection(section.clientId)} />)}</div>

    <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm font-semibold">Blueprint validation</p>{issues.length === 0 ? <p className="mt-1 flex items-center gap-1.5 text-xs text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Structure, marks, timings and quotas are internally consistent.</p> : <div className="mt-2 space-y-1">{issues.slice(0, 6).map((issue) => <p key={issue} className="flex items-start gap-1.5 text-xs text-warning"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {issue}</p>)}</div>}</div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={addSection}><Plus className="mr-1.5 h-4 w-4" /> Add section</Button><Button variant="outline" onClick={onCancel}>Cancel</Button><Button disabled={saving || issues.length > 0} onClick={onSave}>{saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />} Save blueprint</Button></div></div>
  </div>;
}

function SectionEditor({ section, index, taxonomy, languages, canRemove, onChange, onRemove }: {
  section: EditableSection;
  index: number;
  taxonomy: BlueprintCatalog['taxonomyNodes'];
  languages: BlueprintCatalog['examVersions'][number]['languages'];
  canRemove: boolean;
  onChange: (patch: Partial<EditableSection>) => void;
  onRemove: () => void;
}) {
  const [taxonomyToAdd, setTaxonomyToAdd] = useState('');
  const available = taxonomy.filter((node) => !section.taxonomyNodeIds.includes(node.id));
  const selectedNodes = section.taxonomyNodeIds.map((id) => taxonomy.find((node) => node.id === id)).filter(Boolean);
  const addTaxonomy = (value: string) => {
    if (!value) return;
    onChange({ taxonomyNodeIds: [...section.taxonomyNodeIds, value] });
    setTaxonomyToAdd('');
  };
  return <Card><CardHeader className="pb-3"><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-base">{index + 1}. {section.name || section.sectionKey}</CardTitle><p className="mt-1 text-xs text-muted-foreground">Question supply is resolved recursively from the selected taxonomy targets.</p></div><Button size="icon" variant="ghost" className="text-destructive" disabled={!canRemove} onClick={onRemove}><Trash2 className="h-4 w-4" /></Button></div></CardHeader><CardContent className="space-y-4"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Field label="Section name" className="xl:col-span-2"><Input value={section.name} onChange={(event) => onChange({ name: event.target.value })} /></Field><Field label="Section key"><Input value={section.sectionKey} onChange={(event) => onChange({ sectionKey: event.target.value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-') })} /></Field><Field label="Language"><Select value={section.languageCode} onValueChange={(value) => onChange({ languageCode: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{languages.map((language) => <SelectItem key={language.code} value={language.code}>{language.name} · {language.nativeName}</SelectItem>)}</SelectContent></Select></Field><Field label="Questions"><Input type="number" min={1} max={300} value={section.questionCount} onChange={(event) => onChange({ questionCount: Number(event.target.value) || 0 })} /></Field><Field label="Section marks"><Input type="number" min={0.01} value={section.marks} onChange={(event) => onChange({ marks: Number(event.target.value) || 0 })} /></Field><Field label="Duration (minutes)"><Input type="number" min={1} value={section.durationMinutes ?? ''} onChange={(event) => onChange({ durationMinutes: event.target.value === '' ? null : Number(event.target.value) })} /></Field><Field label="Negative marks / question"><Input type="number" min={0} step="0.01" value={section.negativeMarks} onChange={(event) => onChange({ negativeMarks: Number(event.target.value) || 0 })} /></Field></div>
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]"><Field label="Taxonomy targets"><div className="space-y-2"><Select value={taxonomyToAdd} onValueChange={addTaxonomy}><SelectTrigger><Network className="mr-2 h-4 w-4" /><SelectValue placeholder="Add subject, section, topic or chapter" /></SelectTrigger><SelectContent>{available.map((node) => <SelectItem key={node.id} value={node.id}>{node.nodeType} · {node.code} · {node.name}</SelectItem>)}</SelectContent></Select><div className="flex flex-wrap gap-2">{selectedNodes.length === 0 ? <span className="text-xs text-warning">At least one taxonomy target is required.</span> : selectedNodes.map((node) => node && <Badge key={node.id} variant="secondary" className="gap-1.5">{node.code} · {node.name}<button type="button" onClick={() => onChange({ taxonomyNodeIds: section.taxonomyNodeIds.filter((id) => id !== node.id) })}><X className="h-3 w-3" /></button></Badge>)}</div></div></Field><div><Label className="mb-1.5 block text-xs">Difficulty quotas · {sectionQuotaTotal(section)} / {section.questionCount}</Label><div className="grid grid-cols-3 gap-2"><Field label="Easy"><Input type="number" min={0} value={section.difficultyTargets.easy} onChange={(event) => onChange({ difficultyTargets: { ...section.difficultyTargets, easy: Number(event.target.value) || 0 } })} /></Field><Field label="Medium"><Input type="number" min={0} value={section.difficultyTargets.medium} onChange={(event) => onChange({ difficultyTargets: { ...section.difficultyTargets, medium: Number(event.target.value) || 0 } })} /></Field><Field label="Hard"><Input type="number" min={0} value={section.difficultyTargets.hard} onChange={(event) => onChange({ difficultyTargets: { ...section.difficultyTargets, hard: Number(event.target.value) || 0 } })} /></Field></div></div></div>
  </CardContent></Card>;
}

function BlueprintDetailView({ detail, preview, seed, setSeed, testTitle, setTestTitle, assemblyReason, setAssemblyReason, archiveReason, setArchiveReason, mutating, canCreate, canUpdate, onEdit, onPreview, onAssemble, onTransition }: {
  detail: BlueprintDetail;
  preview: ReturnType<typeof useTestBlueprints>['preview'];
  seed: string;
  setSeed: (value: string) => void;
  testTitle: string;
  setTestTitle: (value: string) => void;
  assemblyReason: string;
  setAssemblyReason: (value: string) => void;
  archiveReason: string;
  setArchiveReason: (value: string) => void;
  mutating: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  onEdit: () => void;
  onPreview: () => void;
  onAssemble: () => void;
  onTransition: (action: 'archive' | 'restore') => void;
}) {
  const archived = Boolean(detail.blueprint.deletedAt);
  return <div className="space-y-4"><Card><CardHeader><div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start"><div><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-bold">{detail.blueprint.code}</span><Badge variant="outline" className={archived ? 'border-warning/30 text-warning' : 'border-success/30 text-success'}>{archived ? 'Archived' : 'Active'}</Badge><Badge variant="secondary">Version {detail.blueprint.currentVersionNumber}</Badge></div><h2 className="mt-3 text-xl font-semibold">{detail.blueprint.name}</h2><p className="mt-1 text-xs text-muted-foreground">{detail.blueprint.examFamilyName} · {detail.blueprint.examName} · {detail.blueprint.examVersionName}</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={onEdit} disabled={!canUpdate || archived}><Settings2 className="mr-1.5 h-4 w-4" /> Edit blueprint</Button><Button asChild variant="outline"><Link to="/tests/builder"><ChevronRight className="mr-1.5 h-4 w-4" /> Open Test Builder</Link></Button></div></div></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MiniMetric label="Sections" value={detail.sections.length} /><MiniMetric label="Questions" value={detail.sections.reduce((sum, section) => sum + section.questionCount, 0)} /><MiniMetric label="Marks" value={detail.currentVersion?.totalMarks ?? 0} /><MiniMetric label="Duration" value={`${Number(detail.currentVersion?.durationSeconds ?? 0) / 60} min`} /></div></CardContent></Card>

    <div className="grid gap-4 xl:grid-cols-[1fr_360px]"><Card><CardHeader><CardTitle className="text-base">Current blueprint sections</CardTitle></CardHeader><CardContent className="space-y-3">{detail.sections.map((section) => { const rules = section.selectionRules; const quotas = rules.difficultyTargets ?? {}; return <div key={section.id} className="rounded-xl border p-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p className="font-semibold">{section.sortOrder}. {section.name}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">{section.sectionKey}</p></div><div className="flex flex-wrap gap-2"><Badge variant="outline">{section.questionCount} questions</Badge><Badge variant="outline">{section.marks} marks</Badge><Badge variant="outline">{section.durationSeconds == null ? 'Shared timer' : `${section.durationSeconds / 60} min`}</Badge></div></div><div className="mt-3 grid gap-2 text-xs sm:grid-cols-3"><div className="rounded-md bg-muted/30 p-2"><span className="text-muted-foreground">Difficulty</span><p className="mt-1 font-medium">E {quotas.easy ?? 0} · M {quotas.medium ?? 0} · H {quotas.hard ?? 0}</p></div><div className="rounded-md bg-muted/30 p-2"><span className="text-muted-foreground">Language</span><p className="mt-1 font-medium uppercase">{rules.languageCode ?? 'en'}</p></div><div className="rounded-md bg-muted/30 p-2"><span className="text-muted-foreground">Negative mark</span><p className="mt-1 font-medium">{rules.negativeMarks ?? 0}</p></div></div></div>;})}</CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><History className="h-4 w-4" /> Immutable versions</CardTitle></CardHeader><CardContent className="space-y-2">{detail.versions.map((version) => <div key={version.id} className={cn('rounded-lg border p-3 text-xs', version.versionNumber === detail.blueprint.currentVersionNumber && 'border-primary/30 bg-primary/5')}><div className="flex items-center justify-between"><span className="font-bold">Version {version.versionNumber}</span><span className="text-muted-foreground">{new Date(version.createdAt).toLocaleDateString()}</span></div><p className="mt-2 text-muted-foreground">{version.changeReason}</p><p className="mt-2">{version.sectionCount} sections · {version.questionCount} questions · {version.totalMarks} marks</p></div>)}</CardContent></Card></div>

    {!archived && <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" /> Coverage preview and deterministic assembly</CardTitle><p className="text-xs text-muted-foreground">Preview checks published Question Bank supply, approved translations, taxonomy descendants, difficulty quotas and duplicate stems. No draft is created until every quota is satisfied.</p></CardHeader><CardContent className="space-y-4"><div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end"><Field label="Deterministic seed"><Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="Leave blank to generate a fresh seed" /></Field><Button variant="outline" disabled={mutating} onClick={onPreview}>{mutating ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Eye className="mr-1.5 h-4 w-4" />} Preview coverage</Button></div>{preview && <AssemblyPreview plan={preview} />}<div className="grid gap-4 border-t pt-4 lg:grid-cols-2"><Field label="Draft test title"><Input value={testTitle} onChange={(event) => setTestTitle(event.target.value)} /></Field><Field label="Assembly reason"><Input value={assemblyReason} onChange={(event) => setAssemblyReason(event.target.value)} /></Field></div><div className="flex justify-end"><Button disabled={!canCreate || mutating || !preview?.ready || testTitle.trim().length < 3 || assemblyReason.trim().length < 3} onClick={onAssemble}><CopyPlus className="mr-1.5 h-4 w-4" /> Assemble canonical draft</Button></div></CardContent></Card>}

    <Card><CardHeader><CardTitle className="text-base">Lifecycle</CardTitle></CardHeader><CardContent className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end"><Field label={archived ? 'Restore reason' : 'Archive reason'}><Input value={archiveReason} onChange={(event) => setArchiveReason(event.target.value)} /></Field><Button variant={archived ? 'outline' : 'destructive'} disabled={!canUpdate || mutating || archiveReason.trim().length < 3} onClick={() => onTransition(archived ? 'restore' : 'archive')}>{archived ? <RotateCcw className="mr-1.5 h-4 w-4" /> : <Archive className="mr-1.5 h-4 w-4" />}{archived ? 'Restore blueprint' : 'Archive blueprint'}</Button></CardContent></Card>
  </div>;
}

function AssemblyPreview({ plan }: { plan: NonNullable<ReturnType<typeof useTestBlueprints>['preview']> }) {
  return <div className={cn('rounded-xl border p-4', plan.ready ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5')}><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p className="flex items-center gap-2 text-sm font-semibold">{plan.ready ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}{plan.ready ? 'All blueprint quotas are satisfiable' : 'Question Bank shortages block assembly'}</p><p className="mt-1 text-xs text-muted-foreground">{plan.selectedCount} selected / {plan.requiredCount} required · seed <span className="font-mono">{plan.seed}</span></p></div><Badge variant="outline" className={plan.ready ? 'border-success/30 text-success' : 'border-warning/30 text-warning'}>{plan.ready ? 'Ready' : `${plan.shortages.reduce((sum, shortage) => sum + shortage.missing, 0)} missing`}</Badge></div><div className="mt-4 grid gap-2 md:grid-cols-2">{plan.sections.map((section) => <div key={section.sectionKey} className="rounded-lg border bg-background/70 p-3 text-xs"><div className="flex items-center justify-between"><span className="font-semibold">{section.name}</span><span>{section.questions.length} selected</span></div><p className="mt-1 text-muted-foreground">E {section.questions.filter((q) => q.difficulty === 'easy').length} · M {section.questions.filter((q) => q.difficulty === 'medium').length} · H {section.questions.filter((q) => q.difficulty === 'hard').length}</p></div>)}</div>{plan.shortages.length > 0 && <div className="mt-4 space-y-2">{plan.shortages.map((shortage) => <div key={`${shortage.sectionKey}-${shortage.difficulty}`} className="flex items-center justify-between rounded-md border border-warning/30 bg-background/70 px-3 py-2 text-xs"><span>{shortage.sectionName} · {shortage.difficulty}</span><span className="font-semibold text-warning">{shortage.available} available / {shortage.requested} required</span></div>)}</div>}</div>;
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) { return <div className={className}><Label className="mb-1.5 block text-xs">{label}</Label>{children}</div>; }
function Metric({ icon, label, value, tone = 'neutral' }: { icon: ReactNode; label: string; value: number; tone?: 'neutral' | 'success' | 'info' | 'warning' }) { const toneClass = tone === 'success' ? 'text-success' : tone === 'info' ? 'text-info' : tone === 'warning' ? 'text-warning' : 'text-muted-foreground'; return <Card><CardContent className="p-4"><div className={cn('flex items-center gap-2 text-xs', toneClass)}>{icon}{label}</div><p className="mt-2 text-2xl font-bold">{value}</p></CardContent></Card>; }
function MiniMetric({ label, value }: { label: string; value: string | number }) { return <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-lg font-bold">{value}</p></div>; }
