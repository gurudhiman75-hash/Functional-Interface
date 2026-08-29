import { useEffect, useMemo, useState } from 'react';
import {
  Bot,
  CheckCircle2,
  FileStack,
  Loader2,
  Pencil,
  RefreshCw,
  Save,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';

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
  sourceLanguage: string;
  state: string;
  brief: Record<string, unknown>;
  generatableSourceCount: number;
};

type SynthesisCapabilities = {
  provider: 'openai' | 'gemini' | 'claude';
  model: string;
  configured: boolean;
  supportedProviders: Array<'openai' | 'gemini' | 'claude'>;
  outlinePolicyVersion: string;
  promptPolicyVersion: string;
  rawSourceTextSentToModel: boolean;
  sourceExcerptsSentToModel: boolean;
  acceptedClaimsOnly: boolean;
  automaticPublicationEnabled: boolean;
};

type Outline = {
  id: string;
  evidenceRunId: string;
  versionNumber: number;
  inputHash: string;
  policyVersion: string;
  state: string;
  createdAt: string;
};

type SynthesisSection = {
  id: string;
  sectionKey: string;
  title: string;
  objective: string;
  position: number;
  state: string;
  targetIds: string[];
  targetLabels: string[];
  currentVersionId: string | null;
  currentVersionNumber: number | null;
  currentTitle: string | null;
  currentMarkdown: string | null;
  currentStatus: string | null;
  currentProvider: string | null;
  currentModel: string | null;
  currentOutputHash: string | null;
  currentWarnings: string[] | null;
  usedClaimCount: number;
};

type DraftVersion = {
  id: string;
  versionNumber: number;
  markdown: string;
  inputHash: string;
  outputHash: string;
  state: string;
  createdAt: string;
};

type SynthesisPayload = {
  job: { id: string; title: string; state: string; brief: Record<string, unknown> };
  evidenceGate: {
    ready: boolean;
    acceptedCount: number;
    requiredCount: number;
    coveredRequiredCount: number;
    currentEvidenceRunId: string | null;
  };
  outline: Outline | null;
  staleOutline: boolean;
  sections: SynthesisSection[];
  draft: DraftVersion | null;
  idempotent?: boolean;
};

type ManualEditor = {
  sectionId: string;
  title: string;
  markdown: string;
  reason: string;
};

function pretty(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function NotesStudioSynthesisPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [capabilities, setCapabilities] = useState<SynthesisCapabilities | null>(null);
  const [provider, setProvider] = useState<'openai' | 'gemini' | 'claude'>('openai');
  const [synthesis, setSynthesis] = useState<SynthesisPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [workingSectionId, setWorkingSectionId] = useState<string | null>(null);
  const [regenReasons, setRegenReasons] = useState<Record<string, string>>({});
  const [manualEditor, setManualEditor] = useState<ManualEditor | null>(null);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  const loadCapabilities = async (nextProvider?: string) => {
    try {
      const suffix = nextProvider ? `?provider=${encodeURIComponent(nextProvider)}` : '';
      const result = await adminRequest<SynthesisCapabilities>(`/admin/notes-studio/synthesis/capabilities${suffix}`);
      setCapabilities(result);
      setProvider(result.provider);
    } catch (error) {
      setCapabilities(null);
      showToast.error('Unable to load AI provider status', error instanceof Error ? error.message : 'Request failed.');
    }
  };

  const loadJobs = async () => {
    setLoading(true);
    try {
      const result = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
      const nextJobs = result.jobs ?? [];
      setJobs(nextJobs);
      setSelectedJobId((current) => current && nextJobs.some((job) => job.id === current) ? current : nextJobs[0]?.id ?? null);
    } catch (error) {
      showToast.error('Unable to load Notes Studio jobs', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const loadSynthesis = async (jobId: string) => {
    try {
      const result = await adminRequest<SynthesisPayload>(`/admin/notes-studio/jobs/${jobId}/synthesis`);
      setSynthesis(result);
    } catch (error) {
      setSynthesis(null);
      showToast.error('Unable to load synthesis workspace', error instanceof Error ? error.message : 'Request failed.');
    }
  };

  useEffect(() => { void Promise.all([loadJobs(), loadCapabilities()]); }, []);
  useEffect(() => {
    setManualEditor(null);
    setRegenReasons({});
    if (selectedJobId) void loadSynthesis(selectedJobId);
    else setSynthesis(null);
  }, [selectedJobId]);

  const canAssemble = useMemo(() => Boolean(
    synthesis?.outline
    && !synthesis.staleOutline
    && synthesis.sections.length > 0
    && synthesis.sections.every((section) => section.currentVersionId && section.currentStatus !== 'needs_editorial' && section.state !== 'needs_editorial'),
  ), [synthesis]);

  const generateOutline = async () => {
    if (!selectedJobId) return;
    setWorking(true);
    try {
      const result = await adminRequest<SynthesisPayload>(`/admin/notes-studio/jobs/${selectedJobId}/outline/generate`, { method: 'POST' });
      setSynthesis(result);
      await loadJobs();
      showToast.success(result.idempotent ? 'Outline already current' : 'Outline generated', result.idempotent ? 'The current evidence and coverage already match this outline.' : 'Section planning is now frozen against the current evidence run.');
    } catch (error) {
      showToast.error('Unable to generate outline', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const generateSection = async (section: SynthesisSection, options?: { force?: boolean; reason?: string }) => {
    if (!selectedJobId) return null;
    setWorkingSectionId(section.id);
    try {
      const result = await adminRequest<SynthesisPayload>(`/admin/notes-studio/jobs/${selectedJobId}/sections/${section.id}/generate`, {
        method: 'POST',
        body: JSON.stringify({ provider, force: options?.force ?? false, reason: options?.reason ?? '' }),
      });
      setSynthesis(result);
      await loadJobs();
      return result;
    } catch (error) {
      showToast.error(`Unable to generate ${section.title}`, error instanceof Error ? error.message : 'Request failed.');
      return null;
    } finally {
      setWorkingSectionId(null);
    }
  };

  const generateAllMissing = async () => {
    if (!synthesis || working || !capabilities?.configured) return;
    const pending = synthesis.sections.filter((section) => !section.currentVersionId);
    if (pending.length === 0) {
      showToast.info('No missing sections', 'Every outline section already has a version.');
      return;
    }
    setWorking(true);
    try {
      let completed = 0;
      for (const section of pending) {
        const result = await generateSection(section);
        if (!result) break;
        completed += 1;
      }
      if (completed > 0) showToast.success('Batch generation complete', `${completed} missing section${completed === 1 ? '' : 's'} generated.`);
    } finally {
      setWorking(false);
    }
  };

  const saveManual = async () => {
    if (!selectedJobId || !manualEditor) return;
    setWorkingSectionId(manualEditor.sectionId);
    try {
      const result = await adminRequest<SynthesisPayload>(`/admin/notes-studio/jobs/${selectedJobId}/sections/${manualEditor.sectionId}/manual`, {
        method: 'POST',
        body: JSON.stringify({ title: manualEditor.title, markdown: manualEditor.markdown, reason: manualEditor.reason }),
      });
      setSynthesis(result);
      setManualEditor(null);
      await loadJobs();
      showToast.success('Editorial section version saved', 'The previous immutable section version remains in generation history.');
    } catch (error) {
      showToast.error('Unable to save editorial revision', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingSectionId(null);
    }
  };

  const assemble = async () => {
    if (!selectedJobId) return;
    setWorking(true);
    try {
      const result = await adminRequest<SynthesisPayload>(`/admin/notes-studio/jobs/${selectedJobId}/synthesis/assemble`, { method: 'POST' });
      setSynthesis(result);
      await loadJobs();
      showToast.success(result.idempotent ? 'Draft already current' : 'Internal draft assembled', result.idempotent ? 'No section version changed since the current draft.' : 'The immutable draft is ready for the NS-005 quality gate. It is not published.');
    } catch (error) {
      showToast.error('Unable to assemble note draft', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Section Synthesis"
      description="Plan evidence-backed sections, generate original learner copy from accepted claims only, keep immutable section versions and assemble an internal draft for QA."
      icon={<Sparkles className="h-5 w-5" />}
      actions={<div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => void Promise.all([loadJobs(), selectedJobId ? loadSynthesis(selectedJobId) : Promise.resolve()])} disabled={loading || working}>
          <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
        </Button>
        {canEdit && synthesis?.outline && <Button variant="outline" onClick={() => void generateAllMissing()} disabled={working || !capabilities?.configured || synthesis.staleOutline}>
          <Bot className="mr-1.5 h-4 w-4" />Generate all missing
        </Button>}
        {canEdit && <Button onClick={() => void assemble()} disabled={working || !canAssemble}>
          <FileStack className="mr-1.5 h-4 w-4" />Assemble draft
        </Button>}
      </div>}
    />

    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card><CardContent className="p-4"><Label>Authoring job</Label><Select value={selectedJobId ?? ''} onValueChange={setSelectedJobId}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose authoring job" /></SelectTrigger><SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title} · {pretty(job.state)}</SelectItem>)}</SelectContent></Select></CardContent></Card>
      <Card><CardContent className="space-y-2 p-4"><div className="flex items-center justify-between"><div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI provider</div>{capabilities?.configured ? <Badge variant="outline" className="border-success/30 text-success">Configured</Badge> : <Badge variant="outline" className="border-warning/30 text-warning">Unavailable</Badge>}</div><Select value={provider} onValueChange={(value) => { const next = value as 'openai' | 'gemini' | 'claude'; setProvider(next); void loadCapabilities(next); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(capabilities?.supportedProviders ?? ['openai', 'gemini', 'claude']).map((item) => <SelectItem key={item} value={item}>{pretty(item)}</SelectItem>)}</SelectContent></Select><div className="truncate text-xs text-muted-foreground">Model: {capabilities?.model ?? '—'}</div></CardContent></Card>
    </div>

    {capabilities && !capabilities.configured && <Card className="border-warning/30"><CardContent className="flex items-start gap-3 p-4 text-sm"><TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" /><div><div className="font-medium">Section generation is disabled until this provider is configured on the API server.</div><p className="mt-1 text-muted-foreground">Outline planning, evidence review and existing drafts remain usable. No browser-side API key is accepted or stored.</p></div></CardContent></Card>}

    {synthesis && <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Evidence</div><div className="mt-1 text-lg font-bold">{synthesis.evidenceGate.ready ? 'Ready' : 'Blocked'}</div><div className="mt-1 text-xs text-muted-foreground">{synthesis.evidenceGate.acceptedCount} accepted claims</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Outline</div><div className="mt-1 text-lg font-bold">{synthesis.outline ? `v${synthesis.outline.versionNumber}` : 'Not generated'}</div><div className="mt-1 text-xs text-muted-foreground">{synthesis.sections.length} sections</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Generated</div><div className="mt-1 text-lg font-bold">{synthesis.sections.filter((section) => section.currentVersionId).length}/{synthesis.sections.length}</div><div className="mt-1 text-xs text-muted-foreground">section versions available</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Internal draft</div><div className="mt-1 text-lg font-bold">{synthesis.draft ? `v${synthesis.draft.versionNumber}` : 'Not assembled'}</div><div className="mt-1 text-xs text-muted-foreground">Never learner-published here</div></CardContent></Card>
      </div>

      {!synthesis.evidenceGate.ready && <Card className="border-warning/30"><CardContent className="p-4 text-sm"><div className="font-medium text-warning">Evidence gate blocked</div><p className="mt-1 text-muted-foreground">Return to Evidence & coverage. Every required target needs accepted mapped evidence before an outline can be generated.</p></CardContent></Card>}

      {synthesis.staleOutline && <Card className="border-warning/30"><CardContent className="p-4 text-sm"><div className="font-medium text-warning">Outline is stale</div><p className="mt-1 text-muted-foreground">Accepted evidence changed after this outline. Generate a new outline before producing or assembling sections.</p></CardContent></Card>}

      <Card>
        <CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-base">Outline & section versions</CardTitle><p className="mt-1 text-xs text-muted-foreground">Outline planning is deterministic; model calls happen only at section generation.</p></div>{canEdit && <Button variant="outline" onClick={() => void generateOutline()} disabled={working || !synthesis.evidenceGate.ready}>{synthesis.outline ? 'Regenerate current outline' : 'Generate outline'}</Button>}</div></CardHeader>
        <CardContent className="space-y-4">
          {!synthesis.outline && <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No outline version yet. Once evidence is ready, generate the deterministic section plan.</div>}
          {synthesis.sections.map((section) => <div key={section.id} className="rounded-lg border p-4">
            <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start"><div><div className="flex flex-wrap items-center gap-2"><span className="font-semibold">{section.position + 1}. {section.title}</span><Badge variant="outline">{pretty(section.state)}</Badge>{section.currentVersionNumber && <Badge variant="outline">v{section.currentVersionNumber}</Badge>}{section.currentProvider && <Badge variant="outline">{section.currentProvider} · {section.currentModel}</Badge>}</div><p className="mt-1 text-xs text-muted-foreground">{section.objective}</p><div className="mt-2 flex flex-wrap gap-1.5">{section.targetLabels.map((label) => <Badge key={label} variant="secondary">{label}</Badge>)}</div></div><div className="flex shrink-0 flex-wrap gap-2">{canEdit && <Button size="sm" onClick={() => void generateSection(section, section.currentVersionId ? { force: true, reason: regenReasons[section.id] ?? '' } : undefined)} disabled={working || workingSectionId === section.id || !capabilities?.configured || synthesis.staleOutline || Boolean(section.currentVersionId && (regenReasons[section.id] ?? '').trim().length < 3)}>{workingSectionId === section.id ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Bot className="mr-1.5 h-4 w-4" />}{section.currentVersionId ? 'Regenerate' : 'Generate'}</Button>}{canEdit && section.currentVersionId && <Button size="sm" variant="outline" onClick={() => setManualEditor({ sectionId: section.id, title: section.currentTitle ?? section.title, markdown: section.currentMarkdown ?? '', reason: '' })}><Pencil className="mr-1.5 h-4 w-4" />Edit wording</Button>}</div></div>
            {section.currentVersionId && canEdit && <div className="mt-3"><Input value={regenReasons[section.id] ?? ''} onChange={(event) => setRegenReasons((current) => ({ ...current, [section.id]: event.target.value }))} placeholder="Reason required before regenerating this existing section" /></div>}
            {section.currentWarnings && section.currentWarnings.length > 0 && <div className="mt-3 space-y-1 rounded-md border border-warning/30 bg-warning/[0.03] p-3 text-xs text-warning">{section.currentWarnings.map((warning) => <div key={warning}>• {warning}</div>)}</div>}
            {section.currentMarkdown && <div className="mt-3 rounded-md bg-muted/25 p-3"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5" />Current learner-copy candidate · {section.usedClaimCount} cited evidence claim{section.usedClaimCount === 1 ? '' : 's'}</div><pre className="max-h-72 overflow-auto whitespace-pre-wrap text-xs leading-relaxed">{section.currentMarkdown}</pre></div>}
          </div>)}
        </CardContent>
      </Card>

      {manualEditor && <Card className="border-primary/30"><CardHeader><CardTitle className="text-base">Create editorial section version</CardTitle></CardHeader><CardContent className="space-y-3"><div className="space-y-1.5"><Label>Section title</Label><Input value={manualEditor.title} onChange={(event) => setManualEditor((current) => current ? { ...current, title: event.target.value } : current)} /></div><div className="space-y-1.5"><Label>Markdown body</Label><Textarea className="min-h-72 font-mono text-xs" value={manualEditor.markdown} onChange={(event) => setManualEditor((current) => current ? { ...current, markdown: event.target.value } : current)} /></div><div className="space-y-1.5"><Label>Editorial reason</Label><Input value={manualEditor.reason} onChange={(event) => setManualEditor((current) => current ? { ...current, reason: event.target.value } : current)} placeholder="Why this wording revision is needed" /></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setManualEditor(null)}>Cancel</Button><Button onClick={() => void saveManual()} disabled={workingSectionId === manualEditor.sectionId || manualEditor.title.trim().length < 3 || manualEditor.markdown.trim().length < 80 || manualEditor.reason.trim().length < 3}>{workingSectionId === manualEditor.sectionId ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}Save immutable version</Button></div></CardContent></Card>}

      {synthesis.draft && <Card className="border-primary/20"><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-base">Assembled internal draft v{synthesis.draft.versionNumber}</CardTitle><p className="mt-1 text-xs text-muted-foreground">This candidate is waiting for NS-005 factual/originality/coverage QA. It is not a canonical learner resource.</p></div><Badge variant="outline">{synthesis.draft.outputHash.slice(0, 10)}…</Badge></div></CardHeader><CardContent><pre className="max-h-[640px] overflow-auto whitespace-pre-wrap rounded-lg border bg-muted/20 p-4 text-xs leading-relaxed">{synthesis.draft.markdown}</pre></CardContent></Card>}
    </>}
  </div>;
}

export default NotesStudioSynthesisPage;
