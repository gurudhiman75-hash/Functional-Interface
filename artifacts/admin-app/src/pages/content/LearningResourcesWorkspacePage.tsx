import { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  BookOpen,
  FileText,
  Loader2,
  Newspaper,
  Pencil,
  Plus,
  RefreshCw,
  Rocket,
  Search,
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

const ALL = 'all';
const categories = [
  { value: 'current_affairs', label: 'Current affairs' },
  { value: 'notes', label: 'Notes' },
  { value: 'formula_sheet', label: 'Formula sheet' },
] as const;
const formats = [
  { value: 'article', label: 'Article' },
  { value: 'pdf', label: 'PDF / document' },
] as const;

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
type EditorLanguage = { id: string; code: string; name: string; nativeName: string | null };
type EditorExam = {
  id: string;
  code: string;
  name: string;
  familyId: string;
  familyCode: string;
  familyName: string;
};
type EditorOptions = { languages: EditorLanguage[]; exams: EditorExam[]; maxExamTargets: number };
type ResourceDraft = {
  publicCode: string;
  category: string;
  format: string;
  title: string;
  summary: string;
  languageCode: string;
  contentDate: string;
  expiresAt: string;
  bodyMarkdown: string;
  contentUrl: string;
  examIds: string[];
};

function emptyDraft(languageCode = 'en'): ResourceDraft {
  return {
    publicCode: '',
    category: 'current_affairs',
    format: 'article',
    title: '',
    summary: '',
    languageCode,
    contentDate: '',
    expiresAt: '',
    bodyMarkdown: '',
    contentUrl: '',
    examIds: [],
  };
}

function localDateTimeInput(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function draftFromDetail(resource: ResourceDetail): ResourceDraft {
  return {
    publicCode: resource.publicCode,
    category: resource.category,
    format: resource.format,
    title: resource.title,
    summary: resource.summary ?? '',
    languageCode: resource.languageCode,
    contentDate: resource.contentDate?.slice(0, 10) ?? '',
    expiresAt: localDateTimeInput(resource.expiresAt),
    bodyMarkdown: resource.bodyMarkdown ?? '',
    contentUrl: resource.contentUrl ?? '',
    examIds: resource.examIds ?? [],
  };
}

function payloadFromDraft(draft: ResourceDraft) {
  return {
    publicCode: draft.publicCode.trim().toUpperCase(),
    category: draft.category,
    format: draft.format,
    title: draft.title.trim(),
    summary: draft.summary.trim(),
    languageCode: draft.languageCode,
    contentDate: draft.contentDate || null,
    expiresAt: draft.expiresAt ? new Date(draft.expiresAt).toISOString() : null,
    bodyMarkdown: draft.bodyMarkdown.trim() || null,
    contentUrl: draft.contentUrl.trim() || null,
    examIds: draft.examIds,
  };
}

function statusClass(status: ResourceStatus) {
  if (status === 'published') return 'border-success/30 bg-success/5 text-success';
  if (status === 'draft') return 'border-warning/30 bg-warning/5 text-warning';
  return 'border-border bg-muted/30 text-muted-foreground';
}

function categoryLabel(value: string) {
  return categories.find((item) => item.value === value)?.label ?? value;
}

export function LearningResourcesWorkspacePage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const canPublish = hasPermission('content.questions.publish');
  const [resources, setResources] = useState<ResourceSummary[]>([]);
  const [options, setOptions] = useState<EditorOptions>({ languages: [], exams: [], maxExamTargets: 12 });
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<ResourceDraft>(emptyDraft());

  const load = async () => {
    setLoading(true);
    try {
      const [resourceResult, optionResult] = await Promise.all([
        adminRequest<{ resources: ResourceSummary[] }>('/admin/learning-resources'),
        adminRequest<EditorOptions>('/admin/learning-resource-editor/options'),
      ]);
      setResources(resourceResult.resources ?? []);
      setOptions(optionResult);
      if (!editorOpen && optionResult.languages.length > 0) {
        const english = optionResult.languages.find((item) => item.code.toLowerCase() === 'en');
        setDraft((current) => current.languageCode ? current : emptyDraft(english?.code ?? optionResult.languages[0].code));
      }
    } catch (error) {
      showToast.error('Unable to load learning resources', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return resources.filter((resource) => {
      if (statusFilter !== ALL && resource.status !== statusFilter) return false;
      if (categoryFilter !== ALL && resource.category !== categoryFilter) return false;
      if (!term) return true;
      return [resource.publicCode, resource.title, resource.summary, resource.languageCode]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [categoryFilter, resources, search, statusFilter]);

  const examGroups = useMemo(() => {
    const groups = new Map<string, EditorExam[]>();
    for (const exam of options.exams) {
      const list = groups.get(exam.familyName) ?? [];
      list.push(exam);
      groups.set(exam.familyName, list);
    }
    return [...groups.entries()];
  }, [options.exams]);

  const openCreate = () => {
    const english = options.languages.find((item) => item.code.toLowerCase() === 'en');
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
      showToast.error('Unable to open draft', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const toggleExam = (examId: string, selected: boolean) => {
    setDraft((current) => {
      if (!selected) return { ...current, examIds: current.examIds.filter((id) => id !== examId) };
      if (current.examIds.includes(examId)) return current;
      if (current.examIds.length >= options.maxExamTargets) {
        showToast.warning('Exam target limit reached', `Choose up to ${options.maxExamTargets} exams for one resource.`);
        return current;
      }
      return { ...current, examIds: [...current.examIds, examId] };
    });
  };

  const saveDraft = async () => {
    const payload = payloadFromDraft(draft);
    if (payload.title.length < 3) {
      showToast.warning('Title required', 'Enter a clear learner-facing title.');
      return;
    }
    if (!payload.bodyMarkdown && !payload.contentUrl) {
      showToast.warning('Content required', 'Provide article content or an HTTPS document URL.');
      return;
    }
    if (draft.format === 'pdf' && !payload.contentUrl) {
      showToast.warning('PDF URL required', 'PDF resources require an HTTPS document URL.');
      return;
    }
    setWorking(true);
    try {
      if (editingId) {
        await adminRequest(`/admin/learning-resources/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        showToast.success('Draft updated', 'The learner resource remains unpublished until you explicitly publish it.');
      } else {
        await adminRequest('/admin/learning-resources', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showToast.success('Draft created', 'Review the draft before publishing it to learners.');
      }
      setEditorOpen(false);
      setEditingId(null);
      await load();
    } catch (error) {
      showToast.error('Unable to save draft', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const publish = async (resource: ResourceSummary) => {
    if (!window.confirm(`Publish “${resource.title}” to learners now? Published resources are frozen.`)) return;
    setWorking(true);
    try {
      await adminRequest(`/admin/learning-resources/${resource.id}/publish`, { method: 'POST' });
      showToast.success('Resource published', 'Eligible learners can now discover it in Learn.');
      await load();
    } catch (error) {
      showToast.error('Unable to publish resource', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const archive = async (resource: ResourceSummary) => {
    if (!window.confirm(`Archive “${resource.title}”? It will stop appearing in Learn.`)) return;
    setWorking(true);
    try {
      await adminRequest(`/admin/learning-resources/${resource.id}/archive`, { method: 'POST' });
      showToast.success('Resource archived', 'The resource is no longer visible to learners.');
      await load();
    } catch (error) {
      showToast.error('Unable to archive resource', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Learning Resources"
      description="Create learner-facing current affairs, notes and formula sheets. Drafts stay private until an explicit publish action."
      icon={<BookOpen className="h-5 w-5" />}
      actions={<div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => void load()} disabled={loading || working}>
          <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
        </Button>
        {canEdit && <Button onClick={openCreate} disabled={loading || working}>
          <Plus className="mr-1.5 h-4 w-4" />New draft
        </Button>}
      </div>}
    />

    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_190px]">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search code, title or summary" className="pl-9" />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All states</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All categories</SelectItem>
          {categories.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>

    {editorOpen && <Card className="border-primary/30">
      <CardHeader className="pb-3"><CardTitle>{editingId ? 'Edit draft' : 'Create draft'}</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5"><Label htmlFor="resource-code">Public code</Label><Input id="resource-code" value={draft.publicCode} disabled={Boolean(editingId)} onChange={(event) => setDraft((current) => ({ ...current, publicCode: event.target.value.toUpperCase() }))} placeholder="CA_2026_08_21" /></div>
          <div className="space-y-1.5"><Label>Category</Label><Select value={draft.category} onValueChange={(value) => setDraft((current) => ({ ...current, category: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Format</Label><Select value={draft.format} onValueChange={(value) => setDraft((current) => ({ ...current, format: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{formats.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Language</Label><Select value={draft.languageCode} onValueChange={(value) => setDraft((current) => ({ ...current, languageCode: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{options.languages.map((item) => <SelectItem key={item.id} value={item.code}>{item.name} ({item.code.toUpperCase()})</SelectItem>)}</SelectContent></Select></div>
        </div>

        <div className="space-y-1.5"><Label htmlFor="resource-title">Learner-facing title</Label><Input id="resource-title" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Daily current affairs — 21 August 2026" /></div>
        <div className="space-y-1.5"><Label htmlFor="resource-summary">Short summary</Label><Textarea id="resource-summary" rows={2} value={draft.summary} onChange={(event) => setDraft((current) => ({ ...current, summary: event.target.value }))} placeholder="What this resource covers and why it matters for revision." /></div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5"><Label htmlFor="resource-date">Content date</Label><Input id="resource-date" type="date" value={draft.contentDate} onChange={(event) => setDraft((current) => ({ ...current, contentDate: event.target.value }))} /></div>
          <div className="space-y-1.5"><Label htmlFor="resource-expiry">Optional expiry</Label><Input id="resource-expiry" type="datetime-local" value={draft.expiresAt} onChange={(event) => setDraft((current) => ({ ...current, expiresAt: event.target.value }))} /></div>
          <div className="space-y-1.5 md:col-span-2 lg:col-span-1"><Label htmlFor="resource-url">HTTPS document URL</Label><Input id="resource-url" type="url" value={draft.contentUrl} onChange={(event) => setDraft((current) => ({ ...current, contentUrl: event.target.value }))} placeholder="https://…" /></div>
        </div>

        <div className="space-y-1.5"><Label htmlFor="resource-body">Article content (Markdown)</Label><Textarea id="resource-body" rows={12} value={draft.bodyMarkdown} onChange={(event) => setDraft((current) => ({ ...current, bodyMarkdown: event.target.value }))} placeholder="Use concise learner-facing Markdown. PDF-only resources may leave this empty." className="font-mono text-sm" /></div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><Label>Exam targeting</Label><p className="text-xs text-muted-foreground">No exam selected means the resource is general. Choose up to {options.maxExamTargets} exams.</p></div>
            <Badge variant="outline">{draft.examIds.length}/{options.maxExamTargets} selected</Badge>
          </div>
          <div className="max-h-72 space-y-4 overflow-auto rounded-lg border p-3">
            {examGroups.map(([family, exams]) => <div key={family} className="space-y-2">
              <p className="text-sm font-semibold">{family}</p>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">{exams.map((exam) => {
                const checked = draft.examIds.includes(exam.id);
                return <label key={exam.id} className="flex cursor-pointer items-start gap-2 rounded-md border p-2.5 text-sm hover:bg-muted/30">
                  <Checkbox checked={checked} onCheckedChange={(value) => toggleExam(exam.id, value === true)} />
                  <span><span className="font-medium">{exam.name}</span><span className="block text-xs text-muted-foreground">{exam.code}</span></span>
                </label>;
              })}</div>
            </div>)}
            {examGroups.length === 0 && <p className="text-sm text-muted-foreground">No active canonical exams are available for targeting.</p>}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={() => { setEditorOpen(false); setEditingId(null); }} disabled={working}>Cancel</Button>
          <Button onClick={() => void saveDraft()} disabled={working}>
            {working && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}Save draft
          </Button>
        </div>
      </CardContent>
    </Card>}

    <div className="grid gap-3">
      {loading && resources.length === 0 && <Card><CardContent className="flex items-center justify-center gap-2 py-14 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading learning resources…</CardContent></Card>}
      {!loading && filtered.length === 0 && <Card><CardContent className="py-14 text-center text-muted-foreground">No learning resources match these filters.</CardContent></Card>}
      {filtered.map((resource) => <Card key={resource.id}>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={statusClass(resource.status)}>{resource.status}</Badge>
                <Badge variant="outline">{categoryLabel(resource.category)}</Badge>
                <Badge variant="outline">{resource.format.toUpperCase()}</Badge>
                <Badge variant="outline">{resource.languageCode.toUpperCase()}</Badge>
                <span className="text-xs text-muted-foreground">{resource.publicCode}</span>
              </div>
              <h3 className="font-semibold">{resource.title}</h3>
              {resource.summary && <p className="max-w-4xl text-sm text-muted-foreground">{resource.summary}</p>}
              <p className="text-xs text-muted-foreground">
                {resource.examTargetCount > 0 ? `${resource.examTargetCount} exam target${resource.examTargetCount === 1 ? '' : 's'}` : 'General · all exams'}
                {resource.contentDate ? ` · content ${resource.contentDate.slice(0, 10)}` : ''}
                {resource.publishedAt ? ` · published ${new Date(resource.publishedAt).toLocaleString()}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {resource.status === 'draft' && canEdit && <Button variant="outline" size="sm" onClick={() => void openEdit(resource)} disabled={working}><Pencil className="mr-1.5 h-4 w-4" />Edit</Button>}
              {resource.status === 'draft' && canPublish && <Button size="sm" onClick={() => void publish(resource)} disabled={working}><Rocket className="mr-1.5 h-4 w-4" />Publish</Button>}
              {resource.status !== 'archived' && canPublish && <Button variant="outline" size="sm" onClick={() => void archive(resource)} disabled={working}><Archive className="mr-1.5 h-4 w-4" />Archive</Button>}
            </div>
          </div>
        </CardContent>
      </Card>)}
    </div>

    <Card className="border-dashed"><CardContent className="grid gap-3 py-5 text-sm text-muted-foreground md:grid-cols-3">
      <div className="flex gap-2"><Newspaper className="mt-0.5 h-4 w-4 shrink-0" /><span>Current-affairs entries can use a content date and optional expiry for time-bounded revision material.</span></div>
      <div className="flex gap-2"><FileText className="mt-0.5 h-4 w-4 shrink-0" /><span>PDF/document resources accept HTTPS links only; unsafe schemes are rejected by the server.</span></div>
      <div className="flex gap-2"><BookOpen className="mt-0.5 h-4 w-4 shrink-0" /><span>Published resources are frozen. Corrections should be made as a replacement draft, preserving audit history.</span></div>
    </CardContent></Card>
  </div>;
}

export default LearningResourcesWorkspacePage;
