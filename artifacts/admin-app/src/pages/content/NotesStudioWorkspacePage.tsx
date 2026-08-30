import { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  BookOpenCheck,
  CheckCircle2,
  CircleDashed,
  FileText,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type ResourceStatus = 'draft' | 'published' | 'archived';

type ResourceSummary = {
  id: string;
  publicCode: string;
  category: string;
  format: string;
  title: string;
  summary: string;
  languageCode: string;
  contentDate: string | null;
  status: ResourceStatus;
  publishedAt: string | null;
  expiresAt: string | null;
  updatedAt: string;
  examTargetCount: number;
};

type ResourceDetail = ResourceSummary & {
  bodyMarkdown: string | null;
  contentUrl: string | null;
  createdAt: string;
  examIds: string[];
};

type EditorLanguage = {
  id: string;
  code: string;
  name: string;
  nativeName: string | null;
};

type EditorExam = {
  id: string;
  code: string;
  name: string;
  familyId: string;
  familyCode: string;
  familyName: string;
};

type EditorOptions = {
  languages: EditorLanguage[];
  exams: EditorExam[];
  maxExamTargets: number;
};

type NoteDraft = {
  publicCode: string;
  title: string;
  summary: string;
  languageCode: string;
  bodyMarkdown: string;
  examIds: string[];
};

const pipelineStages = [
  {
    title: 'Source intake',
    detail: 'PDF, web, official material and curated source-pack ingestion.',
    status: 'next',
  },
  {
    title: 'Evidence map',
    detail: 'Extract claims, deduplicate material and retain provenance.',
    status: 'next',
  },
  {
    title: 'Outline + synthesis',
    detail: 'Syllabus-first structure and original Examtree wording.',
    status: 'next',
  },
  {
    title: 'Quality gates',
    detail: 'Factual support, exam relevance, completeness and overlap checks.',
    status: 'next',
  },
  {
    title: 'Canonical publish',
    detail: 'Immutable learner resource with language and exam targeting.',
    status: 'live',
  },
] as const;

function newPublicCode() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  return `NOTE_${date}_${String(now.getTime()).slice(-5)}`;
}

function emptyDraft(languageCode = 'en'): NoteDraft {
  return {
    publicCode: newPublicCode(),
    title: '',
    summary: '',
    languageCode,
    bodyMarkdown: '',
    examIds: [],
  };
}

function draftFromDetail(resource: ResourceDetail): NoteDraft {
  return {
    publicCode: resource.publicCode,
    title: resource.title,
    summary: resource.summary ?? '',
    languageCode: resource.languageCode,
    bodyMarkdown: resource.bodyMarkdown ?? '',
    examIds: resource.examIds ?? [],
  };
}

function statusClass(status: ResourceStatus) {
  if (status === 'published') return 'border-success/30 bg-success/5 text-success';
  if (status === 'draft') return 'border-warning/30 bg-warning/5 text-warning';
  return 'border-border bg-muted/30 text-muted-foreground';
}

function readableDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function NotesStudioWorkspacePage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const canPublish = hasPermission('content.questions.publish');

  const [resources, setResources] = useState<ResourceSummary[]>([]);
  const [options, setOptions] = useState<EditorOptions>({ languages: [], exams: [], maxExamTargets: 12 });
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [search, setSearch] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<NoteDraft>(emptyDraft());

  const load = async () => {
    setLoading(true);
    try {
      const [resourceResult, optionResult] = await Promise.all([
        adminRequest<{ resources: ResourceSummary[] }>('/admin/learning-resources'),
        adminRequest<EditorOptions>('/admin/learning-resource-editor/options'),
      ]);
      setResources((resourceResult.resources ?? []).filter((resource) => resource.category === 'notes'));
      setOptions(optionResult);
    } catch (error) {
      showToast.error('Unable to load Notes Studio', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return resources;
    return resources.filter((resource) =>
      [resource.publicCode, resource.title, resource.summary, resource.languageCode]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [resources, search]);

  const examGroups = useMemo(() => {
    const groups = new Map<string, EditorExam[]>();
    for (const exam of options.exams) {
      const list = groups.get(exam.familyName) ?? [];
      list.push(exam);
      groups.set(exam.familyName, list);
    }
    return [...groups.entries()];
  }, [options.exams]);

  const stats = useMemo(() => {
    const drafts = resources.filter((resource) => resource.status === 'draft').length;
    const published = resources.filter((resource) => resource.status === 'published').length;
    const targeted = resources.reduce((total, resource) => total + resource.examTargetCount, 0);
    return { drafts, published, targeted };
  }, [resources]);

  const openCreate = () => {
    const english = options.languages.find((language) => language.code.toLowerCase() === 'en');
    setEditingId(null);
    setDraft(emptyDraft(english?.code ?? options.languages[0]?.code ?? 'en'));
    setEditorOpen(true);
  };

  const openEdit = async (resource: ResourceSummary) => {
    if (resource.status !== 'draft') return;
    setWorking(true);
    try {
      const result = await adminRequest<{ resource: ResourceDetail }>(`/admin/learning-resource-editor/${resource.id}`);
      setEditingId(resource.id);
      setDraft(draftFromDetail(result.resource));
      setEditorOpen(true);
    } catch (error) {
      showToast.error('Unable to open note draft', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const toggleExam = (examId: string, selected: boolean) => {
    setDraft((current) => {
      if (!selected) return { ...current, examIds: current.examIds.filter((id) => id !== examId) };
      if (current.examIds.includes(examId)) return current;
      if (current.examIds.length >= options.maxExamTargets) {
        showToast.warning('Exam target limit reached', `Choose up to ${options.maxExamTargets} exams for one note.`);
        return current;
      }
      return { ...current, examIds: [...current.examIds, examId] };
    });
  };

  const saveDraft = async () => {
    const payload = {
      publicCode: draft.publicCode.trim().toUpperCase(),
      category: 'notes',
      format: 'article',
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      languageCode: draft.languageCode,
      contentDate: null,
      expiresAt: null,
      bodyMarkdown: draft.bodyMarkdown.trim() || null,
      contentUrl: null,
      examIds: draft.examIds,
    };

    if (payload.title.length < 3) {
      showToast.warning('Title required', 'Enter a clear learner-facing note title.');
      return;
    }
    if (!payload.bodyMarkdown) {
      showToast.warning('Note content required', 'Add the note body before saving the canonical draft.');
      return;
    }

    setWorking(true);
    try {
      if (editingId) {
        await adminRequest(`/admin/learning-resources/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        showToast.success('Note draft updated', 'The note remains private until an explicit publish action.');
      } else {
        await adminRequest('/admin/learning-resources', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showToast.success('Note draft created', 'The note is now stored in the canonical learning-resource model.');
      }
      setEditorOpen(false);
      setEditingId(null);
      await load();
    } catch (error) {
      showToast.error('Unable to save note draft', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const publish = async (resource: ResourceSummary) => {
    if (!window.confirm(`Publish “${resource.title}” to learners now? Published resources are frozen.`)) return;
    setWorking(true);
    try {
      await adminRequest(`/admin/learning-resources/${resource.id}/publish`, { method: 'POST' });
      showToast.success('Note published', 'Eligible learners can now discover this note.');
      await load();
    } catch (error) {
      showToast.error('Unable to publish note', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const archive = async (resource: ResourceSummary) => {
    if (!window.confirm(`Archive “${resource.title}”? It will stop appearing to learners.`)) return;
    setWorking(true);
    try {
      await adminRequest(`/admin/learning-resources/${resource.id}/archive`, { method: 'POST' });
      showToast.success('Note archived', 'The note is no longer learner-visible.');
      await load();
    } catch (error) {
      showToast.error('Unable to archive note', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Notes Studio"
      description="Build exam notes through a source-grounded authoring pipeline, then publish through the canonical learning-resource lifecycle."
      icon={<BookOpenCheck className="h-5 w-5" />}
      actions={<div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => void load()} disabled={loading || working}>
          <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
        </Button>
        {canEdit && <Button onClick={openCreate} disabled={loading || working}>
          <Plus className="mr-1.5 h-4 w-4" />New note
        </Button>}
      </div>}
    />

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card><CardContent className="p-4"><div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Notes</div><div className="mt-1 text-2xl font-bold">{resources.length}</div><div className="text-xs text-muted-foreground">canonical records</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Drafts</div><div className="mt-1 text-2xl font-bold">{stats.drafts}</div><div className="text-xs text-muted-foreground">private authoring state</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Published</div><div className="mt-1 text-2xl font-bold">{stats.published}</div><div className="text-xs text-muted-foreground">immutable learner notes</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Exam mappings</div><div className="mt-1 text-2xl font-bold">{stats.targeted}</div><div className="text-xs text-muted-foreground">total note-to-exam targets</div></CardContent></Card>
    </div>

    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        {editorOpen ? <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>{editingId ? 'Edit canonical note draft' : 'Create canonical note draft'}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">This V1 surface writes directly to the existing learning-resource store. Automated source synthesis will feed the same draft contract.</p>
              </div>
              <Badge className="border-primary/20 bg-primary/5 text-primary">V1 foundation</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="note-code">Public code</Label>
                <Input id="note-code" value={draft.publicCode} disabled={Boolean(editingId)} onChange={(event) => setDraft((current) => ({ ...current, publicCode: event.target.value.toUpperCase() }))} />
              </div>
              <div className="space-y-1.5 lg:col-span-2">
                <Label htmlFor="note-title">Learner-facing title</Label>
                <Input id="note-title" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Indian Constitution: Fundamental Rights — exam-ready notes" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <div className="space-y-1.5">
                <Label>Language</Label>
                <Select value={draft.languageCode} onValueChange={(value) => setDraft((current) => ({ ...current, languageCode: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {options.languages.map((language) => <SelectItem key={language.id} value={language.code}>{language.name} ({language.code.toUpperCase()})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="note-summary">Short summary</Label>
                <Input id="note-summary" value={draft.summary} onChange={(event) => setDraft((current) => ({ ...current, summary: event.target.value }))} placeholder="What this note covers and why it matters for the target exams" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="note-body">Note body (Markdown)</Label>
                <span className="text-xs text-muted-foreground">{draft.bodyMarkdown.length.toLocaleString()} characters</span>
              </div>
              <Textarea id="note-body" value={draft.bodyMarkdown} onChange={(event) => setDraft((current) => ({ ...current, bodyMarkdown: event.target.value }))} className="min-h-[360px] font-mono text-sm" placeholder={'## Overview\n\nWrite or paste the reviewed note draft here.\n\n### Exam focus\n- High-yield facts\n- Concepts\n- Common traps'} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label>Exam targets</Label>
                  <p className="text-xs text-muted-foreground">Target only exams for which the note is genuinely useful.</p>
                </div>
                <Badge variant="outline">{draft.examIds.length}/{options.maxExamTargets}</Badge>
              </div>
              <div className="max-h-64 space-y-3 overflow-y-auto rounded-lg border p-3">
                {examGroups.length === 0 && <p className="text-sm text-muted-foreground">No active exams available.</p>}
                {examGroups.map(([familyName, exams]) => <div key={familyName}>
                  <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{familyName}</div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {exams.map((exam) => <label key={exam.id} className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/40">
                      <Checkbox checked={draft.examIds.includes(exam.id)} onCheckedChange={(checked) => toggleExam(exam.id, checked === true)} />
                      <span className="min-w-0 flex-1 truncate">{exam.name}</span>
                      <span className="text-[10px] uppercase text-muted-foreground">{exam.code}</span>
                    </label>)}
                  </div>
                </div>)}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-success" />Publishing remains explicit and immutable.</div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setEditorOpen(false); setEditingId(null); }} disabled={working}>Cancel</Button>
                <Button onClick={() => void saveDraft()} disabled={working || !canEdit}>
                  {working ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <FileText className="mr-1.5 h-4 w-4" />}
                  Save draft
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> : <Card className="border-dashed">
          <CardContent className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sparkles className="h-5 w-5" /></div>
            <h2 className="mt-4 text-lg font-semibold">Start from the canonical draft contract</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">Today you can create, edit, target and publish Notes from this studio. The automation layer will generate into this exact draft shape, so we do not need to rebuild publishing later.</p>
            {canEdit && <Button className="mt-4" onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />Create first note</Button>}
          </CardContent>
        </Card>}

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Notes library</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Only `notes` learning resources are shown here.</p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search code, title or summary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading && <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading notes…</div>}
            {!loading && filtered.length === 0 && <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No matching notes yet.</div>}
            {!loading && filtered.map((resource) => <div key={resource.id} className="flex flex-col gap-3 rounded-lg border p-4 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{resource.publicCode}</span>
                  <Badge className={statusClass(resource.status)}>{resource.status}</Badge>
                  <Badge variant="outline">{resource.languageCode.toUpperCase()}</Badge>
                  {resource.examTargetCount > 0 && <Badge variant="outline">{resource.examTargetCount} exams</Badge>}
                </div>
                <div className="mt-2 font-semibold">{resource.title}</div>
                {resource.summary && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{resource.summary}</p>}
                <p className="mt-2 text-xs text-muted-foreground">Updated {readableDate(resource.updatedAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {resource.status === 'draft' && canEdit && <Button variant="outline" size="sm" onClick={() => void openEdit(resource)} disabled={working}><Pencil className="mr-1.5 h-3.5 w-3.5" />Edit</Button>}
                {resource.status === 'draft' && canPublish && <Button size="sm" onClick={() => void publish(resource)} disabled={working}><Rocket className="mr-1.5 h-3.5 w-3.5" />Publish</Button>}
                {resource.status !== 'archived' && canPublish && <Button variant="outline" size="sm" onClick={() => void archive(resource)} disabled={working}><Archive className="mr-1.5 h-3.5 w-3.5" />Archive</Button>}
              </div>
            </div>)}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle>Automation pipeline</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {pipelineStages.map((stage, index) => <div key={stage.title} className="relative flex gap-3 pb-5 last:pb-0">
              {index < pipelineStages.length - 1 && <div className="absolute left-[9px] top-5 h-[calc(100%-4px)] w-px bg-border" />}
              <div className="relative z-10 mt-0.5">
                {stage.status === 'live' ? <CheckCircle2 className="h-5 w-5 text-success" /> : <CircleDashed className="h-5 w-5 text-warning" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{stage.title}</span>
                  <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase ${stage.status === 'live' ? 'border-success/25 bg-success/10 text-success' : 'border-warning/25 bg-warning/10 text-warning'}`}>{stage.status === 'live' ? 'live' : 'next'}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stage.detail}</p>
              </div>
            </div>)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle>Authoring rules</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><p><span className="font-medium">Source-grounded:</span> every factual claim must remain traceable to the source pack.</p></div>
            <div className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><p><span className="font-medium">Original wording:</span> synthesize across material; do not reproduce source prose.</p></div>
            <div className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><p><span className="font-medium">Exam-first:</span> optimize for syllabus coverage, PYQ patterns and recall.</p></div>
            <div className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><p><span className="font-medium">Freeze English first:</span> localization starts after the canonical source note is reviewed.</p></div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>;
}

export default NotesStudioWorkspacePage;
