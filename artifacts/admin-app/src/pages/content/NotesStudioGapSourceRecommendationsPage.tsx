import { useEffect, useMemo, useState } from 'react';
import { Eye, LibraryBig, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminRequest } from '@/lib/admin-request';

type AuthoringJob = {
  id: string;
  title: string;
  state: string;
  brief?: {
    taxonomyCode?: string;
    topicLabel?: string;
  };
};

type Recommendation = {
  id: string;
  title: string;
  publisher: string;
  sourceUri: string;
  sourceType: string;
  rightsBasis: string;
  retentionMode: string;
  extractionStatus: string;
  score: number;
  reason: string;
  coverageSimilarity: number;
  acceptedClaimCount: number;
  priorJobCount: number;
  approvedUseCount: number;
  exactSyllabusRefHits: number;
  sameTaxonomyNodeUses: number;
  sameTaxonomyCodeUses: number;
  identityNovel: boolean;
  recommendedRole: string;
  historicalRoles: string[];
};

type CoverageGap = {
  id: string;
  title: string;
  syllabusRef?: string | null;
  priority: string;
  plannedDepth: string;
  examRationale?: string | null;
  status: 'uncovered' | 'partial' | 'blocked';
  recommendations: Recommendation[];
};

type GapResponse = {
  job: AuthoringJob;
  gaps: CoverageGap[];
  recommendationCount: number;
  rawSourceBodiesReturned: boolean;
  automaticAttachment: boolean;
  automaticEvidenceAcceptance: boolean;
  automaticGeneration: boolean;
  sourcePackMutable: boolean;
  progressedJobAction?: string;
};

type SourcePreview = {
  id: string;
  title: string;
  publisher: string;
  sourceUri: string;
  rightsBasis: string;
  retentionMode: string;
  preview: string;
  previewAvailable: boolean;
};

function pretty(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function statusVariant(status: CoverageGap['status']): 'default' | 'outline' | 'destructive' | 'secondary' {
  if (status === 'blocked') return 'destructive';
  if (status === 'partial') return 'secondary';
  return 'outline';
}

function sourceHost(value: string) {
  try {
    return new URL(value).hostname;
  } catch {
    return value.startsWith('urn:sha256:') ? 'Uploaded PDF' : value;
  }
}

export function NotesStudioGapSourceRecommendationsPage() {
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [data, setData] = useState<GapResponse | null>(null);
  const [preview, setPreview] = useState<SourcePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) ?? null, [jobs, selectedJobId]);

  const loadJobs = async () => {
    const result = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
    const nextJobs = result.jobs ?? [];
    setJobs(nextJobs);
    setSelectedJobId((current) => current && nextJobs.some((job) => job.id === current) ? current : nextJobs[0]?.id ?? '');
  };

  const loadRecommendations = async (jobId: string) => {
    if (!jobId) {
      setData(null);
      return;
    }
    const result = await adminRequest<GapResponse>(`/admin/notes-studio/jobs/${jobId}/gap-source-recommendations`);
    setData(result);
  };

  const load = async () => {
    setLoading(true);
    try {
      await loadJobs();
    } catch (error) {
      showToast.error('Unable to load gap-source workspace', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);
  useEffect(() => {
    setPreview(null);
    if (!selectedJobId) {
      setData(null);
      return;
    }
    setLoading(true);
    void loadRecommendations(selectedJobId)
      .catch((error) => {
        setData(null);
        showToast.error('Unable to build gap-source recommendations', error instanceof Error ? error.message : 'Request failed.');
      })
      .finally(() => setLoading(false));
  }, [selectedJobId]);

  const openPreview = async (source: Recommendation) => {
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
      title="Gap → Source Recommendations"
      description="Find governed sources that previously produced accepted, coverage-linked evidence for similar syllabus gaps. Recommendations never attach sources or change factual authority."
      icon={<LibraryBig className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => selectedJobId ? void loadRecommendations(selectedJobId) : void load()} disabled={loading}>
        {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}Refresh
      </Button>}
    />

    <Card>
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(280px,440px)_1fr]">
        <div className="space-y-1.5">
          <Label>Authoring job</Label>
          <Select value={selectedJobId || undefined} onValueChange={setSelectedJobId}>
            <SelectTrigger><SelectValue placeholder="Choose a Notes Studio job" /></SelectTrigger>
            <SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>)}</SelectContent>
          </Select>
          {selectedJob && <div className="text-xs text-muted-foreground">
            {selectedJob.brief?.taxonomyCode || selectedJob.brief?.topicLabel || 'No taxonomy label'} · {pretty(selectedJob.state)}
          </div>}
        </div>
        <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3 text-sm">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <div className="font-medium">Evidence history, not source guessing</div>
            <p className="mt-1 text-muted-foreground">A source is ranked only when it previously backed accepted claims on related Notes coverage. Duplicate content and non-generation-ready sources are excluded. Raw retained source bodies are never returned here.</p>
          </div>
        </div>
      </CardContent>
    </Card>

    {data && <div className="grid gap-3 md:grid-cols-3">
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Unresolved core gaps</div><div className="mt-1 text-2xl font-semibold">{data.gaps.length}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Governed recommendations</div><div className="mt-1 text-2xl font-semibold">{data.recommendationCount}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Source-pack mutation</div><div className="mt-1 text-sm font-semibold">{data.sourcePackMutable ? 'Pre-evidence: editable' : 'Frozen: successor required'}</div></CardContent></Card>
    </div>}

    {data && !data.sourcePackMutable && <Card className="border-amber-200">
      <CardContent className="p-4 text-sm"><strong>Research handoff:</strong> {data.progressedJobAction}</CardContent>
    </Card>}

    {data && data.gaps.length === 0 && <Card><CardContent className="p-6 text-sm text-muted-foreground">No unresolved required/high coverage items remain for this job.</CardContent></Card>}

    <div className="space-y-4">
      {data?.gaps.map((gap) => <Card key={gap.id}>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><CardTitle className="text-base">{gap.title}</CardTitle><div className="mt-1 text-xs text-muted-foreground">{gap.syllabusRef || 'No syllabus reference'} · {pretty(gap.plannedDepth)}</div></div>
            <div className="flex gap-1.5"><Badge variant={statusVariant(gap.status)}>{pretty(gap.status)}</Badge><Badge variant="outline">{pretty(gap.priority)}</Badge></div>
          </div>
          {gap.examRationale && <p className="text-sm text-muted-foreground">{gap.examRationale}</p>}
        </CardHeader>
        <CardContent className="space-y-3">
          {gap.recommendations.length === 0 && <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No governed source has enough prior accepted-evidence signal for this gap. Use the Coverage-gap research brief to find a new governed source rather than weakening the recommendation threshold.</div>}
          {gap.recommendations.map((source) => <div key={source.id} className="rounded-lg border p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0"><div className="font-medium">{source.title}</div><div className="mt-0.5 text-xs text-muted-foreground">{source.publisher || sourceHost(source.sourceUri)} · {pretty(source.recommendedRole)}</div></div>
              <div className="flex gap-1.5"><Badge>Score {source.score}</Badge>{source.identityNovel && <Badge variant="outline">New identity</Badge>}</div>
            </div>
            <div className="mt-2 text-sm">{source.reason}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {source.acceptedClaimCount} accepted claim(s) · {source.priorJobCount} prior job(s) · {source.approvedUseCount} approved use(s) · similarity {Math.round(source.coverageSimilarity * 100)}%
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => void openPreview(source)} disabled={workingId === source.id}>
                {workingId === source.id ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Eye className="mr-1.5 h-3.5 w-3.5" />}Preview governed source
              </Button>
              <Badge variant="outline">{pretty(source.rightsBasis)}</Badge>
            </div>
          </div>)}
        </CardContent>
      </Card>)}
    </div>

    {preview && <Card>
      <CardHeader><div className="flex items-center justify-between gap-3"><CardTitle className="text-base">Source preview · {preview.title}</CardTitle><Button variant="ghost" size="sm" onClick={() => setPreview(null)}>Close</Button></div></CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground">{preview.publisher || sourceHost(preview.sourceUri)} · {pretty(preview.rightsBasis)} · {pretty(preview.retentionMode)}</div>
        {preview.previewAvailable
          ? <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-lg border bg-muted/20 p-4 text-xs leading-5">{preview.preview}</pre>
          : <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No retained text preview is available for this source.</div>}
      </CardContent>
    </Card>}
  </div>;
}

export default NotesStudioGapSourceRecommendationsPage;
