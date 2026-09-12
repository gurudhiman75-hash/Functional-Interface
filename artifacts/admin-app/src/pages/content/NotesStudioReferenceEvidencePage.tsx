import { useEffect, useMemo, useState } from 'react';
import { BookMarked, ExternalLink, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';

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

type AuthoringJob = { id: string; title: string; state: string; brief?: { topicLabel?: string } };
type SourceItem = {
  id: string;
  title: string;
  publisher: string;
  sourceUri: string;
  rightsBasis: string;
  retentionMode: string;
  inclusionState: string;
};
type EvidenceBlock = {
  id: string;
  sourceDocumentId: string;
  excerpt: string;
  locator?: { kind?: string; sourceUri?: string; locatorLabel?: string; editorAuthoredParaphrase?: boolean; publisherTextRetained?: boolean };
  sourceTitle: string;
  sourcePublisher: string;
};
type EvidenceResponse = { blocks: EvidenceBlock[] };

const editableStates = new Set(['brief', 'sources_ready', 'evidence_ready', 'outline_ready']);

function pretty(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function NotesStudioReferenceEvidencePage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [blocks, setBlocks] = useState<EvidenceBlock[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [locatorLabel, setLocatorLabel] = useState('');
  const [noteText, setNoteText] = useState('');
  const [attested, setAttested] = useState(false);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) ?? null, [jobs, selectedJobId]);
  const eligibleSources = useMemo(() => sources.filter((source) =>
    source.inclusionState === 'included' && source.rightsBasis === 'reference_only' && source.retentionMode === 'metadata_only'
  ), [sources]);
  const referenceBlocks = useMemo(() => blocks.filter((block) => block.locator?.kind === 'editor_reference_note'), [blocks]);
  const editable = Boolean(selectedJob && editableStates.has(selectedJob.state));

  const loadJobs = async () => {
    const result = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
    const next = result.jobs ?? [];
    setJobs(next);
    setSelectedJobId((current) => current && next.some((job) => job.id === current) ? current : next[0]?.id ?? '');
  };

  const loadJobData = async (jobId: string) => {
    if (!jobId) {
      setSources([]);
      setBlocks([]);
      return;
    }
    const [sourceResult, evidenceResult] = await Promise.all([
      adminRequest<{ sources: SourceItem[] }>(`/admin/notes-studio/jobs/${jobId}/sources`),
      adminRequest<EvidenceResponse>(`/admin/notes-studio/jobs/${jobId}/evidence`),
    ]);
    const nextSources = sourceResult.sources ?? [];
    setSources(nextSources);
    setBlocks(evidenceResult.blocks ?? []);
    setSelectedSourceId((current) => current && nextSources.some((source) => source.id === current) ? current : nextSources.find((source) =>
      source.inclusionState === 'included' && source.rightsBasis === 'reference_only' && source.retentionMode === 'metadata_only'
    )?.id ?? '');
  };

  const load = async () => {
    setLoading(true);
    try {
      await loadJobs();
    } catch (error) {
      showToast.error('Unable to load Notes Studio jobs', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);
  useEffect(() => {
    setLocatorLabel('');
    setNoteText('');
    setAttested(false);
    void loadJobData(selectedJobId).catch((error) => {
      setSources([]);
      setBlocks([]);
      showToast.error('Unable to load reference evidence', error instanceof Error ? error.message : 'Request failed.');
    });
  }, [selectedJobId]);

  const refresh = async () => {
    setWorking(true);
    try {
      await Promise.all([loadJobs(), loadJobData(selectedJobId)]);
    } catch (error) {
      showToast.error('Unable to refresh reference evidence', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const createReferenceEvidence = async () => {
    if (!selectedJobId || !selectedSourceId || !editable || !attested) return;
    if (locatorLabel.trim().length < 2 || noteText.trim().length < 20) {
      showToast.warning('Reference note incomplete', 'Add the exact page/section locator and a factual paraphrase of at least 20 characters.');
      return;
    }
    setWorking(true);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${selectedJobId}/reference-evidence`, {
        method: 'POST',
        body: JSON.stringify({
          sourceId: selectedSourceId,
          locatorLabel,
          noteText,
          paraphrasedByEditor: true,
        }),
      });
      setLocatorLabel('');
      setNoteText('');
      setAttested(false);
      await loadJobData(selectedJobId);
      showToast.success('Reference evidence recorded', 'Only your factual paraphrase was retained; publisher wording was not stored.');
    } catch (error) {
      showToast.error('Unable to record reference evidence', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Reference Evidence"
      description="Use official or authoritative sources as factual references when their wording cannot be retained. Record your own bounded paraphrase and exact locator; publisher text stays metadata-only."
      icon={<BookMarked className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void refresh()} disabled={loading || working}>
        <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
      </Button>}
    />

    <Card>
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(280px,440px)_1fr] lg:items-end">
        <div className="space-y-1.5">
          <Label>Authoring job</Label>
          <Select value={selectedJobId || undefined} onValueChange={setSelectedJobId}>
            <SelectTrigger><SelectValue placeholder="Choose a Notes Studio job" /></SelectTrigger>
            <SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {selectedJob && <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="outline">{pretty(selectedJob.state)}</Badge>
          <Badge variant={editable ? 'default' : 'secondary'}>{editable ? 'Reference evidence editable' : 'Evidence frozen'}</Badge>
          {selectedJob.brief?.topicLabel && <span className="text-muted-foreground">{selectedJob.brief.topicLabel}</span>}
        </div>}
      </CardContent>
    </Card>

    <Card className="border-amber-200">
      <CardContent className="p-4 text-sm">
        <strong>Rights boundary:</strong> this workflow is for sources stored as <code>reference_only</code>. It does not grant reproduction permission or make a legal determination. Do not paste source wording. Open the source, verify the fact, then write the factual proposition independently in your own words.
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Create reviewed reference evidence</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Reference-only source</Label>
          <Select value={selectedSourceId || undefined} onValueChange={setSelectedSourceId} disabled={!editable || eligibleSources.length === 0}>
            <SelectTrigger><SelectValue placeholder="Choose an included reference-only source" /></SelectTrigger>
            <SelectContent>{eligibleSources.map((source) => <SelectItem key={source.id} value={source.id}>{source.title}</SelectItem>)}</SelectContent>
          </Select>
          {eligibleSources.length === 0 && <p className="text-xs text-muted-foreground">No included metadata-only reference sources are attached to this job.</p>}
        </div>

        {selectedSourceId && (() => {
          const source = eligibleSources.find((item) => item.id === selectedSourceId);
          return source ? <div className="rounded-lg border p-3 text-sm">
            <div className="font-medium">{source.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{source.publisher || 'Publisher not recorded'} · reference only</div>
            {source.sourceUri.startsWith('https://') && <a className="mt-2 inline-flex items-center gap-1 text-xs underline" href={source.sourceUri} target="_blank" rel="noreferrer">Open source for review <ExternalLink className="h-3 w-3" /></a>}
          </div> : null;
        })()}

        <div className="space-y-1.5">
          <Label>Exact locator</Label>
          <Input value={locatorLabel} onChange={(event) => setLocatorLabel(event.target.value)} placeholder="Example: Know Punjab → Geography paragraph on the five rivers" maxLength={300} />
        </div>
        <div className="space-y-1.5">
          <Label>Factual paraphrase</Label>
          <Textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} className="min-h-[140px]" maxLength={800} placeholder="State only the factual proposition you verified, in your own words. Do not paste or lightly rewrite the publisher's sentence." />
          <div className="text-right text-xs text-muted-foreground">{noteText.length}/800</div>
        </div>
        <label className="flex items-start gap-2 rounded-lg border p-3 text-sm">
          <Checkbox checked={attested} onCheckedChange={(value) => setAttested(value === true)} />
          <span>I reviewed the cited source/locator and wrote this factual note independently as a paraphrase. I did not paste publisher wording.</span>
        </label>
        {canEdit && <Button onClick={() => void createReferenceEvidence()} disabled={!editable || !selectedSourceId || !attested || working}>
          {working ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-1.5 h-4 w-4" />}Record reference evidence
        </Button>}
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Reviewed reference notes ({referenceBlocks.length})</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {referenceBlocks.length === 0 && <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">No editor reference evidence has been recorded for this job.</div>}
        {referenceBlocks.map((block) => <div key={block.id} className="rounded-lg border p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div><div className="font-medium">{block.sourceTitle}</div><div className="text-xs text-muted-foreground">{block.sourcePublisher || 'Publisher not recorded'} · {block.locator?.locatorLabel || 'Locator not recorded'}</div></div>
            <Badge variant="outline">Editor paraphrase</Badge>
          </div>
          <p className="mt-3 text-sm">{block.excerpt}</p>
        </div>)}
      </CardContent>
    </Card>
  </div>;
}

export default NotesStudioReferenceEvidencePage;
