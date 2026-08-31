import { useEffect, useMemo, useState } from 'react';
import {
  BookOpenCheck,
  Eye,
  FileUp,
  Globe2,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
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

type EditorLanguage = { id: string; code: string; name: string; nativeName: string | null };
type EditorExam = { id: string; code: string; name: string; familyId: string; familyCode: string; familyName: string };
type EditorOptions = { languages: EditorLanguage[]; exams: EditorExam[]; maxExamTargets: number };

type AuthoringJob = {
  id: string;
  title: string;
  sourceLanguage: string;
  state: string;
  brief: {
    topicLabel?: string;
    depth?: string;
    learnerLevel?: string;
    syllabusEmphasis?: string;
    examIds?: string[];
  };
  targetResourceId: string | null;
  createdAt: string;
  updatedAt: string;
  sourceCount: number;
  includedSourceCount: number;
  generatableSourceCount: number;
};

type SourceItem = {
  id: string;
  sourceType: string;
  sourceUri: string;
  title: string;
  publisher: string;
  mimeType: string | null;
  contentHash: string;
  rightsBasis: string;
  retentionMode: string;
  extractionStatus: string;
  extractionMetadata: Record<string, unknown>;
  inclusionState: 'included' | 'excluded';
  relevanceScore: number | null;
  position: number;
  addedAt: string;
};

type SourcePreview = SourceItem & {
  preview: string;
  previewAvailable: boolean;
  capturedAt: string;
};

type JobDraft = {
  title: string;
  topicLabel: string;
  sourceLanguage: string;
  depth: string;
  learnerLevel: string;
  syllabusEmphasis: string;
  examIds: string[];
};

const rightsOptions = [
  { value: 'user_supplied', label: 'User supplied / owned' },
  { value: 'licensed', label: 'Licensed' },
  { value: 'public_domain', label: 'Public domain' },
  { value: 'publisher_authorized', label: 'Publisher authorized' },
  { value: 'reference_only', label: 'Reference only — metadata retained' },
] as const;

const emptyJobDraft: JobDraft = {
  title: '',
  topicLabel: '',
  sourceLanguage: 'en',
  depth: 'standard',
  learnerLevel: 'standard',
  syllabusEmphasis: '',
  examIds: [],
};

const nativeSelectClassName = 'h-10 w-full touch-manipulation rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

function prettyState(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function readableDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function NotesStudioSourcePackPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [options, setOptions] = useState<EditorOptions>({ languages: [], exams: [], maxExamTargets: 12 });
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [jobDraft, setJobDraft] = useState<JobDraft>(emptyJobDraft);
  const [urlSource, setUrlSource] = useState({ url: '', title: '', publisher: '', rightsBasis: 'reference_only' });
  const [pdfMeta, setPdfMeta] = useState({ title: '', publisher: '', originUrl: '', rightsBasis: 'user_supplied' });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<SourcePreview | null>(null);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  const examGroups = useMemo(() => {
    const groups = new Map<string, EditorExam[]>();
    for (const exam of options.exams) {
      const list = groups.get(exam.familyName) ?? [];
      list.push(exam);
      groups.set(exam.familyName, list);
    }
    return [...groups.entries()];
  }, [options.exams]);

  const load = async () => {
    setLoading(true);
    try {
      const [jobResult, optionResult] = await Promise.all([
        adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs'),
        adminRequest<EditorOptions>('/admin/learning-resource-editor/options'),
      ]);
      const nextJobs = jobResult.jobs ?? [];
      setJobs(nextJobs);
      setOptions(optionResult);
      setSelectedJobId((current) => current && nextJobs.some((job) => job.id === current) ? current : nextJobs[0]?.id ?? null);
      if (jobDraft.sourceLanguage === 'en' && !optionResult.languages.some((language) => language.code === 'en')) {
        setJobDraft((current) => ({ ...current, sourceLanguage: optionResult.languages[0]?.code ?? 'en' }));
      }
    } catch (error) {
      showToast.error('Unable to load Notes Studio authoring', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const loadSources = async (jobId: string) => {
    try {
      const result = await adminRequest<{ sources: SourceItem[] }>(`/admin/notes-studio/jobs/${jobId}/sources`);
      setSources(result.sources ?? []);
    } catch (error) {
      setSources([]);
      showToast.error('Unable to load source pack', error instanceof Error ? error.message : 'Request failed.');
    }
  };

  useEffect(() => { void load(); }, []);
  useEffect(() => {
    setPreview(null);
    if (selectedJobId) void loadSources(selectedJobId);
    else setSources([]);
  }, [selectedJobId]);

  const toggleJobExam = (examId: string, selected: boolean) => {
    setJobDraft((current) => {
      if (!selected) return { ...current, examIds: current.examIds.filter((id) => id !== examId) };
      if (current.examIds.includes(examId)) return current;
      if (current.examIds.length >= options.maxExamTargets) {
        showToast.warning('Exam target limit reached', `Choose up to ${options.maxExamTargets} exams.`);
        return current;
      }
      return { ...current, examIds: [...current.examIds, examId] };
    });
  };

  const createJob = async () => {
    if (jobDraft.title.trim().length < 3) {
      showToast.warning('Job title required', 'Name the note or authoring task before building a source pack.');
      return;
    }
    setWorking(true);
    try {
      const result = await adminRequest<{ job: AuthoringJob }>('/admin/notes-studio/jobs', {
        method: 'POST',
        body: JSON.stringify(jobDraft),
      });
      setCreateOpen(false);
      setJobDraft({ ...emptyJobDraft, sourceLanguage: jobDraft.sourceLanguage });
      await load();
      setSelectedJobId(result.job.id);
      showToast.success('Authoring job created', 'Attach multiple trustworthy sources before evidence extraction.');
    } catch (error) {
      showToast.error('Unable to create authoring job', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const attachUrl = async () => {
    if (!selectedJobId || !urlSource.url.trim()) return;
    setWorking(true);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${selectedJobId}/sources/url`, {
        method: 'POST',
        body: JSON.stringify(urlSource),
      });
      setUrlSource({ url: '', title: '', publisher: '', rightsBasis: urlSource.rightsBasis });
      await Promise.all([load(), loadSources(selectedJobId)]);
      showToast.success('URL source attached', 'The source is now part of this authoring job’s provenance pack.');
    } catch (error) {
      showToast.error('Unable to attach URL source', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const attachPdf = async () => {
    if (!selectedJobId || !pdfFile) {
      showToast.warning('Choose a PDF', 'Select the PDF you want to add to this source pack.');
      return;
    }
    setWorking(true);
    try {
      const params = new URLSearchParams({
        fileName: pdfFile.name,
        rightsBasis: pdfMeta.rightsBasis,
      });
      if (pdfMeta.title.trim()) params.set('title', pdfMeta.title.trim());
      if (pdfMeta.publisher.trim()) params.set('publisher', pdfMeta.publisher.trim());
      if (pdfMeta.originUrl.trim()) params.set('originUrl', pdfMeta.originUrl.trim());
      await adminRequest(`/admin/notes-studio/jobs/${selectedJobId}/sources/pdf?${params.toString()}`, {
        method: 'POST',
        body: await pdfFile.arrayBuffer(),
        headers: { 'Content-Type': 'application/pdf' },
      });
      setPdfFile(null);
      setPdfMeta({ title: '', publisher: '', originUrl: '', rightsBasis: pdfMeta.rightsBasis });
      const input = document.getElementById('notes-source-pdf') as HTMLInputElement | null;
      if (input) input.value = '';
      await Promise.all([load(), loadSources(selectedJobId)]);
      showToast.success('PDF source attached', 'Text extraction completed without storing the raw PDF file.');
    } catch (error) {
      showToast.error('Unable to attach PDF source', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const toggleSource = async (source: SourceItem) => {
    if (!selectedJobId) return;
    const next = source.inclusionState === 'included' ? 'excluded' : 'included';
    setWorking(true);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${selectedJobId}/sources/${source.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ inclusionState: next }),
      });
      await Promise.all([load(), loadSources(selectedJobId)]);
    } catch (error) {
      showToast.error('Unable to update source', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const openPreview = async (source: SourceItem) => {
    setWorking(true);
    try {
      const result = await adminRequest<{ source: SourcePreview }>(`/admin/notes-studio/sources/${source.id}/preview`);
      setPreview(result.source);
    } catch (error) {
      showToast.error('Unable to load source preview', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Notes Studio"
      description="Create syllabus-first authoring jobs, assemble rights-aware source packs, inspect extracted text and keep learner publication separately gated."
      icon={<BookOpenCheck className="h-5 w-5" />}
      actions={<div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => void load()} disabled={loading || working}>
          <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
        </Button>
        {canEdit && <Button onClick={() => setCreateOpen((value) => !value)} disabled={loading || working}>
          <Plus className="mr-1.5 h-4 w-4" />New authoring job
        </Button>}
      </div>}
    />

    <div className="grid gap-3 sm:grid-cols-3">
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Authoring jobs</div><div className="mt-1 text-2xl font-bold">{jobs.length}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Attached sources</div><div className="mt-1 text-2xl font-bold">{jobs.reduce((sum, job) => sum + job.sourceCount, 0)}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Generation-ready sources</div><div className="mt-1 text-2xl font-bold">{jobs.reduce((sum, job) => sum + job.generatableSourceCount, 0)}</div></CardContent></Card>
    </div>

    {createOpen && <Card className="border-primary/30">
      <CardHeader><CardTitle>Create syllabus-first authoring job</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1.5"><Label>Internal job title</Label><Input value={jobDraft.title} onChange={(event) => setJobDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Indian Polity — Fundamental Rights" /></div>
          <div className="space-y-1.5"><Label>Canonical topic / syllabus target</Label><Input value={jobDraft.topicLabel} onChange={(event) => setJobDraft((current) => ({ ...current, topicLabel: event.target.value }))} placeholder="Polity → Fundamental Rights" /></div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="notes-job-source-language">Source language</Label>
            <select
              id="notes-job-source-language"
              className={nativeSelectClassName}
              value={jobDraft.sourceLanguage}
              onChange={(event) => setJobDraft((current) => ({ ...current, sourceLanguage: event.target.value }))}
            >
              {options.languages.length === 0
                ? <option value="en">English</option>
                : options.languages.map((language) => <option key={language.id} value={language.code}>{language.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes-job-depth">Depth</Label>
            <select
              id="notes-job-depth"
              className={nativeSelectClassName}
              value={jobDraft.depth}
              onChange={(event) => setJobDraft((current) => ({ ...current, depth: event.target.value }))}
            >
              <option value="quick_revision">Quick revision</option>
              <option value="standard">Standard</option>
              <option value="comprehensive">Comprehensive</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes-job-learner-level">Learner level</Label>
            <select
              id="notes-job-learner-level"
              className={nativeSelectClassName}
              value={jobDraft.learnerLevel}
              onChange={(event) => setJobDraft((current) => ({ ...current, learnerLevel: event.target.value }))}
            >
              <option value="foundation">Foundation</option>
              <option value="standard">Standard</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        <div className="space-y-1.5"><Label>Syllabus / PYQ emphasis</Label><Textarea value={jobDraft.syllabusEmphasis} onChange={(event) => setJobDraft((current) => ({ ...current, syllabusEmphasis: event.target.value }))} placeholder="Emphasize articles, writ jurisdiction, restrictions, amendment-related traps and frequently confused pairs." /></div>
        <div className="space-y-2"><Label>Exam targets <span className="text-muted-foreground">({jobDraft.examIds.length}/{options.maxExamTargets})</span></Label><div className="max-h-56 overflow-auto rounded-lg border p-3">{examGroups.map(([family, exams]) => <div key={family} className="mb-3 last:mb-0"><div className="mb-1 text-xs font-semibold text-muted-foreground">{family}</div><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{exams.map((exam) => <label key={exam.id} className="flex items-center gap-2 text-sm"><Checkbox checked={jobDraft.examIds.includes(exam.id)} onCheckedChange={(checked) => toggleJobExam(exam.id, Boolean(checked))} />{exam.name}</label>)}</div></div>)}</div></div>
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={() => void createJob()} disabled={working}>{working && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}Create job</Button></div>
      </CardContent>
    </Card>}

    <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
      <Card>
        <CardHeader><CardTitle className="text-base">Authoring jobs</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {jobs.length === 0 && <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">No source-pack jobs yet. Create one before attaching research material.</div>}
          {jobs.map((job) => <button type="button" key={job.id} onClick={() => setSelectedJobId(job.id)} className={`w-full rounded-lg border p-3 text-left transition ${selectedJobId === job.id ? 'border-primary bg-primary/[0.04]' : 'hover:bg-muted/40'}`}>
            <div className="flex items-start justify-between gap-2"><div className="font-medium">{job.title}</div><Badge variant="outline">{prettyState(job.state)}</Badge></div>
            <div className="mt-1 text-xs text-muted-foreground">{job.brief?.topicLabel || 'Topic not yet mapped'} · {job.sourceLanguage.toUpperCase()}</div>
            <div className="mt-2 text-xs text-muted-foreground">{job.sourceCount} sources · {job.generatableSourceCount} generation-ready</div>
          </button>)}
        </CardContent>
      </Card>

      <div className="space-y-5">
        {!selectedJob && <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Choose or create an authoring job to build its source pack.</CardContent></Card>}
        {selectedJob && <>
          <Card>
            <CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle>{selectedJob.title}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{selectedJob.brief?.topicLabel || 'Unmapped topic'} · {selectedJob.brief?.depth || 'standard'} · updated {readableDate(selectedJob.updatedAt)}</p></div><Badge className={selectedJob.generatableSourceCount > 0 ? 'border-success/30 bg-success/5 text-success' : 'border-warning/30 bg-warning/5 text-warning'}>{selectedJob.generatableSourceCount > 0 ? 'Source pack ready' : 'Needs retained source'}</Badge></div></CardHeader>
            <CardContent><div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3 text-sm"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><div className="font-medium">Rights-aware retention</div><p className="mt-1 text-muted-foreground">Licensed, public-domain, publisher-authorized and user-supplied material may retain extracted text. Reference-only web material stores provenance metadata but is blocked from later generation input.</p></div></div></CardContent>
          </Card>

          {canEdit && <div className="grid gap-4 lg:grid-cols-2">
            <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Globe2 className="h-4 w-4" />Attach URL</CardTitle></CardHeader><CardContent className="space-y-3"><Input value={urlSource.url} onChange={(event) => setUrlSource((current) => ({ ...current, url: event.target.value }))} placeholder="https://official-source.gov/page" /><div className="grid gap-3 sm:grid-cols-2"><Input value={urlSource.title} onChange={(event) => setUrlSource((current) => ({ ...current, title: event.target.value }))} placeholder="Optional source title" /><Input value={urlSource.publisher} onChange={(event) => setUrlSource((current) => ({ ...current, publisher: event.target.value }))} placeholder="Publisher / authority" /></div><Select value={urlSource.rightsBasis} onValueChange={(value) => setUrlSource((current) => ({ ...current, rightsBasis: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{rightsOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select><Button className="w-full" onClick={() => void attachUrl()} disabled={working || !urlSource.url.trim()}>{working ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Globe2 className="mr-1.5 h-4 w-4" />}Attach web source</Button></CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileUp className="h-4 w-4" />Attach PDF</CardTitle></CardHeader><CardContent className="space-y-3"><Input id="notes-source-pdf" type="file" accept="application/pdf" onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)} /><div className="grid gap-3 sm:grid-cols-2"><Input value={pdfMeta.title} onChange={(event) => setPdfMeta((current) => ({ ...current, title: event.target.value }))} placeholder="Optional source title" /><Input value={pdfMeta.publisher} onChange={(event) => setPdfMeta((current) => ({ ...current, publisher: event.target.value }))} placeholder="Publisher / author" /></div><Input value={pdfMeta.originUrl} onChange={(event) => setPdfMeta((current) => ({ ...current, originUrl: event.target.value }))} placeholder="Optional original HTTPS URL" /><Select value={pdfMeta.rightsBasis} onValueChange={(value) => setPdfMeta((current) => ({ ...current, rightsBasis: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{rightsOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select><Button className="w-full" onClick={() => void attachPdf()} disabled={working || !pdfFile}>{working ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <FileUp className="mr-1.5 h-4 w-4" />}Extract and attach PDF</Button><p className="text-xs text-muted-foreground">The uploaded PDF bytes are processed transiently and are not stored by NS-002.</p></CardContent></Card>
          </div>}

          <Card>
            <CardHeader><CardTitle className="text-base">Source pack ({sources.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {sources.length === 0 && <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Attach at least one strong source. Multi-source synthesis will be introduced in the next authoring checkpoints.</div>}
              {sources.map((source) => <div key={source.id} className="rounded-lg border p-4"><div className="flex flex-col justify-between gap-3 md:flex-row md:items-start"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><div className="font-medium">{source.title}</div><Badge variant="outline">{source.sourceType === 'uploaded_pdf' ? 'PDF' : 'Web'}</Badge><Badge variant="outline" className={source.retentionMode === 'extracted_text' ? 'border-success/30 text-success' : 'border-warning/30 text-warning'}>{source.retentionMode === 'extracted_text' ? 'Text retained' : 'Metadata only'}</Badge>{source.inclusionState === 'excluded' && <Badge variant="outline">Excluded</Badge>}</div><div className="mt-1 truncate text-xs text-muted-foreground">{source.publisher || 'Publisher not specified'} · {source.rightsBasis.replaceAll('_', ' ')} · {source.contentHash.slice(0, 12)}…</div></div><div className="flex shrink-0 gap-2"><Button size="sm" variant="outline" onClick={() => void openPreview(source)} disabled={working}><Eye className="mr-1.5 h-4 w-4" />Preview</Button>{canEdit && <Button size="sm" variant="outline" onClick={() => void toggleSource(source)} disabled={working}>{source.inclusionState === 'included' ? 'Exclude' : 'Include'}</Button>}</div></div></div>)}
            </CardContent>
          </Card>

          {preview && <Card className="border-primary/20"><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-base">Source preview — {preview.title}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{preview.retentionMode === 'extracted_text' ? 'Preview from retained extracted text.' : 'Reference-only source: extracted text was not retained.'}</p></div><Button size="sm" variant="ghost" onClick={() => setPreview(null)}>Close</Button></div></CardHeader><CardContent>{preview.previewAvailable ? <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-lg border bg-muted/20 p-4 text-xs leading-relaxed">{preview.preview}</pre> : <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">No retained text preview is available for this source.</div>}</CardContent></Card>}
        </>}
      </div>
    </div>
  </div>;
}

export default NotesStudioSourcePackPage;