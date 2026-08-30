import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Eye, Loader2, Recycle, RefreshCw, Search, ShieldCheck } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type AuthoringJob = {
  id: string;
  title: string;
  sourceLanguage: string;
  state: string;
  brief?: {
    topicLabel?: string;
    taxonomyCode?: string;
    taxonomyNodeId?: string;
  };
};

type LibrarySource = {
  id: string;
  sourceType: string;
  sourceUri: string;
  title: string;
  publisher: string;
  mimeType?: string | null;
  contentHash?: string;
  rightsBasis: string;
  retentionMode: string;
  extractionStatus: string;
  failureReason?: string | null;
  capturedAt?: string;
  updatedAt?: string;
  retainedCharCount: number;
  usageCount: number;
  approvedUsageCount: number;
  generationReady: boolean;
};

type SourceRecommendation = LibrarySource & {
  score: number;
  reason: string;
  exactTaxonomyUses: number;
  sameTaxonomyCodeUses: number;
  sameTopicUses: number;
  approvedUses: number;
  priorJobs: Array<{ id: string; title: string; state: string }>;
};

type SourcePreview = LibrarySource & {
  preview: string;
  previewAvailable: boolean;
};

function prettyState(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function sourceHost(value: string) {
  try {
    const url = new URL(value);
    return url.hostname;
  } catch {
    return value.startsWith('urn:sha256:') ? 'Uploaded PDF' : value;
  }
}

function sourceBadge(source: Pick<LibrarySource, 'generationReady' | 'retentionMode'>) {
  if (source.generationReady) return <Badge>Generation-ready</Badge>;
  if (source.retentionMode === 'metadata_only') return <Badge variant="outline">Provenance only</Badge>;
  return <Badge variant="outline">Not generation-ready</Badge>;
}

export function NotesStudioSourceLibraryPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [query, setQuery] = useState('');
  const [library, setLibrary] = useState<LibrarySource[]>([]);
  const [recommendations, setRecommendations] = useState<SourceRecommendation[]>([]);
  const [preview, setPreview] = useState<SourcePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? null,
    [jobs, selectedJobId],
  );
  const frozen = selectedJob ? ['approved', 'materialized'].includes(selectedJob.state) : false;

  const loadLibrary = async (search = query) => {
    const params = new URLSearchParams({ limit: '75' });
    if (search.trim()) params.set('q', search.trim());
    const result = await adminRequest<{ sources: LibrarySource[] }>(`/admin/notes-studio/source-library?${params.toString()}`);
    setLibrary(result.sources ?? []);
  };

  const loadRecommendations = async (jobId: string) => {
    if (!jobId) {
      setRecommendations([]);
      return;
    }
    const result = await adminRequest<{ recommendations: SourceRecommendation[] }>(`/admin/notes-studio/jobs/${jobId}/source-recommendations`);
    setRecommendations(result.recommendations ?? []);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [jobResult, libraryResult] = await Promise.all([
        adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs'),
        adminRequest<{ sources: LibrarySource[] }>('/admin/notes-studio/source-library?limit=75'),
      ]);
      const nextJobs = jobResult.jobs ?? [];
      setJobs(nextJobs);
      setLibrary(libraryResult.sources ?? []);
      setSelectedJobId((current) => current && nextJobs.some((job) => job.id === current) ? current : nextJobs[0]?.id ?? '');
    } catch (error) {
      showToast.error('Unable to load source library', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);
  useEffect(() => {
    setPreview(null);
    if (!selectedJobId) {
      setRecommendations([]);
      return;
    }
    void loadRecommendations(selectedJobId).catch((error) => {
      setRecommendations([]);
      showToast.error('Unable to load source recommendations', error instanceof Error ? error.message : 'Request failed.');
    });
  }, [selectedJobId]);

  const runSearch = async () => {
    setLoading(true);
    try {
      await loadLibrary(query);
    } catch (error) {
      showToast.error('Unable to search source library', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const reuseSource = async (source: LibrarySource) => {
    if (!selectedJobId) {
      showToast.warning('Choose an authoring job', 'Select the job that should reuse this governed source.');
      return;
    }
    setWorkingId(source.id);
    try {
      const result = await adminRequest<{ reused: boolean; duplicate: boolean }>(`/admin/notes-studio/jobs/${selectedJobId}/sources/${source.id}/reuse`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      await Promise.all([loadRecommendations(selectedJobId), loadLibrary(query)]);
      showToast.success(
        result.reused ? 'Governed source reused' : 'Source already attached',
        result.reused ? 'The existing source record is now included in this job without copying or refetching its source body.' : 'No duplicate source-pack link was created.',
      );
    } catch (error) {
      showToast.error('Unable to reuse source', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingId(null);
    }
  };

  const openPreview = async (source: LibrarySource) => {
    setWorkingId(source.id);
    try {
      const result = await adminRequest<{ source: SourcePreview }>(`/admin/notes-studio/sources/${source.id}/preview`);
      setPreview(result.source);
    } catch (error) {
      showToast.error('Unable to load source preview', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingId(null);
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Source Library"
      description="Reuse governed Notes Studio sources, rank prior successful sources against the current taxonomy target, and avoid duplicate uploads or refetches."
      icon={<BookOpen className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void load()} disabled={loading || Boolean(workingId)}>
        {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}Refresh
      </Button>}
    />

    <Card>
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(260px,420px)_1fr]">
        <div className="space-y-1.5">
          <Label>Target authoring job</Label>
          <Select value={selectedJobId || undefined} onValueChange={setSelectedJobId}>
            <SelectTrigger><SelectValue placeholder="Choose a Notes Studio job" /></SelectTrigger>
            <SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>)}</SelectContent>
          </Select>
          {selectedJob && <div className="text-xs text-muted-foreground">
            {selectedJob.brief?.taxonomyCode || selectedJob.brief?.topicLabel || 'No taxonomy label'} · {prettyState(selectedJob.state)}
          </div>}
        </div>
        <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3 text-sm">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <div className="font-medium">Reuse preserves governance</div>
            <p className="mt-1 text-muted-foreground">The library never returns raw source bodies. Reuse links the existing governed source record to a new job, preserves its rights and retention mode, and never accepts evidence or starts generation automatically.</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <div className="grid gap-5 xl:grid-cols-2">
      <Card>
        <CardHeader><div className="flex items-center justify-between gap-3"><CardTitle className="text-base">Recommended for this job</CardTitle><Badge variant="outline">{recommendations.length}</Badge></div></CardHeader>
        <CardContent className="space-y-3">
          {!selectedJob && <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">Choose an authoring job to rank sources from prior governed Notes Studio usage.</div>}
          {selectedJob && recommendations.length === 0 && <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">No prior governed source has a strong taxonomy/topic match yet. Use library search or attach a new source in Brief & Sources.</div>}
          {recommendations.map((source) => <div key={source.id} className="rounded-lg border p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0"><div className="font-medium">{source.title}</div><div className="mt-0.5 text-xs text-muted-foreground">{source.publisher || sourceHost(source.sourceUri)}</div></div>
              <div className="flex gap-1.5">{sourceBadge(source)}<Badge variant="outline">Score {source.score}</Badge></div>
            </div>
            <div className="mt-2 text-sm">{source.reason}</div>
            <div className="mt-1 text-xs text-muted-foreground">{source.approvedUses} approved use(s) · {source.priorJobs.length} prior job(s) shown · {source.rightsBasis.replaceAll('_', ' ')}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => void openPreview(source)} disabled={workingId === source.id}><Eye className="mr-1.5 h-3.5 w-3.5" />Preview</Button>
              {canEdit && <Button size="sm" onClick={() => void reuseSource(source)} disabled={workingId === source.id || frozen}>{workingId === source.id ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Recycle className="mr-1.5 h-3.5 w-3.5" />}Reuse source</Button>}
            </div>
          </div>)}
          {frozen && <div className="rounded-lg border border-amber-200 p-3 text-sm text-muted-foreground">This job is approved/materialized and its source pack is frozen. Create a successor revision before reusing another source.</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Search governed source library</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2"><Input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void runSearch(); }} placeholder="Search title, publisher or source URL" /><Button variant="outline" onClick={() => void runSearch()} disabled={loading}><Search className="h-4 w-4" /></Button></div>
          <div className="max-h-[620px] space-y-2 overflow-auto pr-1">
            {library.length === 0 && <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">No governed sources matched this search.</div>}
            {library.map((source) => <div key={source.id} className="rounded-lg border p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0"><div className="font-medium">{source.title}</div><div className="mt-0.5 text-xs text-muted-foreground">{source.publisher || sourceHost(source.sourceUri)}</div></div>
                {sourceBadge(source)}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{source.usageCount} use(s) · {source.approvedUsageCount} approved use(s) · {source.rightsBasis.replaceAll('_', ' ')}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => void openPreview(source)} disabled={workingId === source.id}><Eye className="mr-1.5 h-3.5 w-3.5" />Preview</Button>
                {canEdit && selectedJob && <Button size="sm" onClick={() => void reuseSource(source)} disabled={workingId === source.id || frozen}>{workingId === source.id ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Recycle className="mr-1.5 h-3.5 w-3.5" />}Reuse</Button>}
              </div>
            </div>)}
          </div>
        </CardContent>
      </Card>
    </div>

    {preview && <Card className="border-primary/30">
      <CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-base">{preview.title}</CardTitle><div className="mt-1 text-xs text-muted-foreground">{preview.publisher || sourceHost(preview.sourceUri)} · {preview.rightsBasis.replaceAll('_', ' ')}</div></div>{sourceBadge(preview)}</div></CardHeader>
      <CardContent>
        {preview.previewAvailable ? <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/40 p-4 text-xs leading-relaxed">{preview.preview}</pre> : <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No retained text is available. This source can still serve as provenance when its retention policy is metadata-only.</div>}
        <div className="mt-3 flex justify-end"><Button variant="outline" onClick={() => setPreview(null)}>Close preview</Button></div>
      </CardContent>
    </Card>}
  </div>;
}

export default NotesStudioSourceLibraryPage;
