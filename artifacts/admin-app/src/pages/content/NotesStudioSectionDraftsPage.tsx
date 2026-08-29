import { useEffect, useMemo, useState } from 'react';
import { Bot, FileText, Loader2, RefreshCw, Save, Sparkles } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type AuthoringJob = {
  id: string;
  title: string;
  state: string;
  sourceLanguage: string;
};

type CoverageTarget = {
  id: string;
  title: string;
  priority: string;
  plannedDepth: string;
  sortOrder: number;
};

type SectionClaim = { id: string; text: string };

type SectionDraft = {
  id: string;
  coverageItemId: string;
  coverageTitle: string;
  priority: string;
  plannedDepth: string;
  title: string;
  sortOrder: number;
  state: 'draft' | 'needs_editorial' | 'accepted';
  markdown: string;
  inputFingerprint: string;
  outputFingerprint: string;
  promptVersion: string;
  provider: string;
  model: string;
  generationMetadata: Record<string, unknown>;
  claims: SectionClaim[];
};

type SectionsResult = {
  sections: SectionDraft[];
  coverage: CoverageTarget[];
  summary: {
    sectionCount: number;
    needsEditorial: number;
    draftCount: number;
    acceptedCount: number;
    coverageCount: number;
  };
  model: {
    provider: string;
    configured: boolean;
    model: string | null;
    promptVersion: string;
  };
};

const emptyResult: SectionsResult = {
  sections: [],
  coverage: [],
  summary: { sectionCount: 0, needsEditorial: 0, draftCount: 0, acceptedCount: 0, coverageCount: 0 },
  model: { provider: 'openai', configured: false, model: null, promptVersion: 'notes-section-v1' },
};

function pretty(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function NotesStudioSectionDraftsPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [result, setResult] = useState<SectionsResult>(emptyResult);
  const [loading, setLoading] = useState(true);
  const [workingKey, setWorkingKey] = useState('');
  const [edits, setEdits] = useState<Record<string, { title: string; markdown: string }>>({});

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;
  const sectionByCoverage = useMemo(() => new Map(result.sections.map((section) => [section.coverageItemId, section])), [result.sections]);

  const loadJobs = async () => {
    const response = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
    const next = response.jobs ?? [];
    setJobs(next);
    setSelectedJobId((current) => current && next.some((job) => job.id === current) ? current : next[0]?.id ?? '');
  };

  const loadSections = async (jobId: string) => {
    if (!jobId) {
      setResult(emptyResult);
      return;
    }
    const response = await adminRequest<SectionsResult>(`/admin/notes-studio/jobs/${jobId}/sections`);
    setResult(response);
    setEdits(Object.fromEntries(response.sections.map((section) => [section.id, { title: section.title, markdown: section.markdown }])));
  };

  useEffect(() => {
    void loadJobs()
      .catch((error) => showToast.error('Unable to load Notes Studio jobs', error instanceof Error ? error.message : 'Request failed.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;
    setLoading(true);
    void loadSections(selectedJobId)
      .catch((error) => showToast.error('Unable to load section drafts', error instanceof Error ? error.message : 'Request failed.'))
      .finally(() => setLoading(false));
  }, [selectedJobId]);

  const refresh = async () => {
    setLoading(true);
    try {
      await Promise.all([loadJobs(), selectedJobId ? loadSections(selectedJobId) : Promise.resolve()]);
    } catch (error) {
      showToast.error('Unable to refresh sections', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const generate = async (coverageItemId: string) => {
    if (!selectedJobId) return;
    setWorkingKey(`generate:${coverageItemId}`);
    try {
      const response = await adminRequest<SectionsResult>(`/admin/notes-studio/jobs/${selectedJobId}/coverage/${coverageItemId}/section/generate`, { method: 'POST' });
      setResult(response);
      setEdits(Object.fromEntries(response.sections.map((section) => [section.id, { title: section.title, markdown: section.markdown }])));
      await loadJobs();
      showToast.success('Section draft generated', 'The draft is claim-grounded and remains review-only.');
    } catch (error) {
      showToast.error('Unable to generate section', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey('');
    }
  };

  const saveSection = async (section: SectionDraft) => {
    if (!selectedJobId) return;
    const edit = edits[section.id] ?? { title: section.title, markdown: section.markdown };
    setWorkingKey(`save:${section.id}`);
    try {
      const response = await adminRequest<SectionsResult>(`/admin/notes-studio/jobs/${selectedJobId}/sections/${section.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: edit.title, markdown: edit.markdown }),
      });
      setResult(response);
      setEdits(Object.fromEntries(response.sections.map((item) => [item.id, { title: item.title, markdown: item.markdown }])));
      await loadJobs();
      showToast.success('Section saved', 'Manual edits are marked needs_editorial until the QA checkpoint passes.');
    } catch (error) {
      showToast.error('Unable to save section', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey('');
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Section Drafts"
      description="Synthesize one review-only note section per covered syllabus target. Model input is limited to accepted claims; raw source documents are not sent to the section writer."
      icon={<Sparkles className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void refresh()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>}
    />

    <Card>
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(260px,420px)_1fr] lg:items-end">
        <div className="space-y-1.5">
          <Label>Authoring job</Label>
          <Select value={selectedJobId} onValueChange={setSelectedJobId}>
            <SelectTrigger><SelectValue placeholder="Choose an authoring job" /></SelectTrigger>
            <SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {selectedJob && <Badge variant="outline">{pretty(selectedJob.state)}</Badge>}
          <Badge variant={result.model.configured ? 'default' : 'outline'}><Bot className="mr-1 h-3.5 w-3.5" />{result.model.configured ? result.model.model : 'Model not configured'}</Badge>
          <span className="text-xs text-muted-foreground">{result.model.promptVersion}</span>
        </div>
      </CardContent>
    </Card>

    <div className="grid gap-3 sm:grid-cols-3">
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Coverage targets</div><div className="mt-1 text-2xl font-bold">{result.summary.coverageCount}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Drafted sections</div><div className="mt-1 text-2xl font-bold">{result.summary.sectionCount}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Needs editorial</div><div className="mt-1 text-2xl font-bold">{result.summary.needsEditorial}</div></CardContent></Card>
    </div>

    {!selectedJobId ? <Card className="border-dashed"><CardContent className="p-10 text-center text-sm text-muted-foreground">No authoring job selected.</CardContent></Card> : result.coverage.length === 0 ? <Card className="border-dashed"><CardContent className="p-10 text-center text-sm text-muted-foreground">Create the syllabus coverage plan first.</CardContent></Card> : <div className="space-y-4">
      {result.coverage.map((coverage) => {
        const section = sectionByCoverage.get(coverage.id);
        const generating = workingKey === `generate:${coverage.id}`;
        return <Card key={coverage.id}>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><CardTitle className="text-base">{coverage.title}</CardTitle><div className="mt-1 flex gap-2"><Badge variant="outline">{coverage.priority}</Badge><Badge variant="outline">{coverage.plannedDepth}</Badge>{section && <Badge variant="outline">{pretty(section.state)}</Badge>}</div></div>
              {canEdit && <Button onClick={() => void generate(coverage.id)} disabled={Boolean(workingKey) || !result.model.configured || !['outline_ready', 'drafting', 'qa_required'].includes(selectedJob?.state ?? '')}>{generating ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}{section ? 'Regenerate' : 'Generate section'}</Button>}
            </div>
          </CardHeader>
          <CardContent>
            {!section ? <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">This target needs accepted, actively supported claims before synthesis. Generate becomes available when the authoring job is outline-ready.</div> : <div className="space-y-4">
              <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="space-y-1.5"><Label>Section title</Label><Input value={edits[section.id]?.title ?? section.title} onChange={(event) => setEdits((current) => ({ ...current, [section.id]: { title: event.target.value, markdown: current[section.id]?.markdown ?? section.markdown } }))} disabled={!canEdit} /></div>
                <div className="text-xs text-muted-foreground">{section.provider} · {section.model}</div>
              </div>
              <div className="space-y-1.5"><Label>Draft Markdown</Label><Textarea className="min-h-[260px] font-mono text-sm" value={edits[section.id]?.markdown ?? section.markdown} onChange={(event) => setEdits((current) => ({ ...current, [section.id]: { title: current[section.id]?.title ?? section.title, markdown: event.target.value } }))} disabled={!canEdit} /></div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><FileText className="h-3.5 w-3.5" />Claim provenance</div>
                <div className="space-y-1.5">{section.claims.map((claim) => <p key={claim.id} className="text-xs leading-relaxed"><span className="font-mono text-muted-foreground">{claim.id.slice(0, 8)}</span> {claim.text}</p>)}</div>
              </div>
              {canEdit && <div className="flex justify-end"><Button variant="outline" onClick={() => void saveSection(section)} disabled={Boolean(workingKey)}>{workingKey === `save:${section.id}` ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}Save manual edit</Button></div>}
            </div>}
          </CardContent>
        </Card>;
      })}
    </div>}
  </div>;
}

export default NotesStudioSectionDraftsPage;
