import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BookOpenCheck, Loader2, RefreshCw, Search, ShieldCheck, Sparkles } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type AuthoringJob = {
  id: string;
  title: string;
  state: string;
  sourceLanguage: string;
};

type AcceptedClaim = { id: string; text: string };

type CoverageGap = {
  id: string;
  title: string;
  syllabusRef: string;
  priority: 'required' | 'high';
  plannedDepth: string;
  examRationale: string;
  status: 'uncovered' | 'partial' | 'blocked';
  acceptedClaims: AcceptedClaim[];
};

type EvidenceNeed = {
  description: string;
  preferredSourceRole: 'primary_authority' | 'core_reference' | 'exam_context' | 'supplemental';
};

type ResearchBrief = {
  coverageItemId: string;
  researchQuestions: string[];
  evidenceNeeds: EvidenceNeed[];
  researchQueries: string[];
};

type ResearchResult = {
  gaps: CoverageGap[];
  briefs: ResearchBrief[];
  totalGapCount: number;
  batchGapCount: number;
  model: string;
  promptVersion: string;
  acceptedClaimTextOnly: true;
  rawSourceTextSent: false;
  factualAnswersRequested: false;
  automaticSourceDiscovery: false;
  automaticClaimCreation: false;
  automaticCoverageMutation: false;
};

function prettyState(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function roleLabel(value: EvidenceNeed['preferredSourceRole']) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function statusVariant(status: CoverageGap['status']): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'blocked') return 'destructive';
  if (status === 'partial') return 'secondary';
  return 'outline';
}

export function NotesStudioCoverageGapResearchPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;
  const editable = Boolean(selectedJob && ['evidence_ready', 'outline_ready'].includes(selectedJob.state));
  const gapById = useMemo(() => new Map((result?.gaps ?? []).map((gap) => [gap.id, gap])), [result]);

  const loadJobs = async () => {
    const response = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
    const next = response.jobs ?? [];
    setJobs(next);
    setSelectedJobId((current) => current && next.some((job) => job.id === current) ? current : next[0]?.id ?? '');
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
  useEffect(() => { setResult(null); }, [selectedJobId]);

  const refresh = async () => {
    setWorking(true);
    try {
      await loadJobs();
      setResult(null);
    } catch (error) {
      showToast.error('Unable to refresh', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const generate = async () => {
    if (!selectedJobId) return;
    setWorking(true);
    try {
      const response = await adminRequest<ResearchResult>(`/admin/notes-studio/jobs/${selectedJobId}/coverage-gap-research/generate`, { method: 'POST' });
      setResult(response);
      showToast.success(
        'Coverage-gap research brief generated',
        `${response.briefs.length} unresolved syllabus targets received research guidance. No factual claims or sources were created.`,
      );
    } catch (error) {
      showToast.error('Unable to generate gap research brief', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  return <div className="space-y-4">
    <PageHeader
      title="Coverage-gap research"
      description="Turn unresolved required/high syllabus coverage into neutral research questions and evidence needs. This workspace plans research; it does not answer questions or create claims."
      actions={<Button variant="outline" onClick={() => void refresh()} disabled={working}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>}
    />

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />Research boundary</CardTitle></CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-5">
        <div><p className="text-xs text-muted-foreground">Target</p><p className="font-medium">Uncovered / partial / blocked core coverage</p></div>
        <div><p className="text-xs text-muted-foreground">Model facts</p><p className="font-medium">Accepted claims only</p></div>
        <div><p className="text-xs text-muted-foreground">Raw source text</p><p className="font-medium">Never sent</p></div>
        <div><p className="text-xs text-muted-foreground">Output</p><p className="font-medium">Questions + evidence needs</p></div>
        <div><p className="text-xs text-muted-foreground">Automation</p><p className="font-medium">No search, source attach, or claim creation</p></div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Target authoring job</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Select value={selectedJobId} onValueChange={setSelectedJobId} disabled={loading || working}>
          <SelectTrigger><SelectValue placeholder="Choose a Notes Studio job" /></SelectTrigger>
          <SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title} · {prettyState(job.state)}</SelectItem>)}</SelectContent>
        </Select>
        {selectedJob && <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{prettyState(selectedJob.state)}</Badge>
          <Badge variant="outline">Language {selectedJob.sourceLanguage}</Badge>
          {result && <Badge variant="secondary">{result.totalGapCount} core gap{result.totalGapCount === 1 ? '' : 's'}</Badge>}
          {result && <Badge variant="outline">Model: {result.model}</Badge>}
        </div>}
        {selectedJob && !editable && <div className="rounded-md border border-warning/30 bg-warning/5 p-3 text-sm">
          <p className="font-medium">Gap research is frozen at this stage.</p>
          <p className="text-muted-foreground">Generate research briefs only during Evidence ready or Outline ready. Once section drafting begins, use a successor revision for new factual research.</p>
        </div>}
        <Button onClick={() => void generate()} disabled={!canEdit || !editable || working}>
          {working ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Generate research brief
        </Button>
      </CardContent>
    </Card>

    {result && <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2"><BookOpenCheck className="h-5 w-5" />Research queue</span>
          <span className="text-sm font-normal text-muted-foreground">Showing {result.batchGapCount}/{result.totalGapCount} core gaps</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {result.briefs.length === 0
          ? <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">No neutral research brief was produced. Inspect the coverage plan manually rather than inventing missing facts.</div>
          : result.briefs.map((brief) => {
            const gap = gapById.get(brief.coverageItemId);
            return <div key={brief.coverageItemId} className="space-y-4 rounded-md border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{gap?.title ?? brief.coverageItemId}</h3>
                {gap && <Badge variant={statusVariant(gap.status)}>{gap.status}</Badge>}
                {gap && <Badge variant="outline">{gap.priority}</Badge>}
                {gap?.plannedDepth && <Badge variant="outline">{gap.plannedDepth}</Badge>}
              </div>
              {gap?.syllabusRef && <p className="text-xs text-muted-foreground">Syllabus: {gap.syllabusRef}</p>}
              {gap?.examRationale && <p className="text-sm text-muted-foreground">{gap.examRationale}</p>}

              {(gap?.acceptedClaims.length ?? 0) > 0 && <div>
                <p className="mb-2 text-sm font-medium">Already accepted facts</p>
                <ul className="space-y-1 text-sm text-muted-foreground">{gap?.acceptedClaims.map((claim) => <li key={claim.id}>• {claim.text}</li>)}</ul>
              </div>}

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium"><AlertTriangle className="h-4 w-4" />Questions to resolve</p>
                  <ol className="space-y-2 text-sm">{brief.researchQuestions.map((question, index) => <li key={`${brief.coverageItemId}-q-${index}`} className="rounded-md bg-muted/30 p-2">{index + 1}. {question}</li>)}</ol>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium"><Search className="h-4 w-4" />Evidence to find</p>
                  <div className="space-y-2">{brief.evidenceNeeds.map((need, index) => <div key={`${brief.coverageItemId}-need-${index}`} className="rounded-md bg-muted/30 p-2 text-sm">
                    <div className="mb-1"><Badge variant="outline">{roleLabel(need.preferredSourceRole)}</Badge></div>
                    <p>{need.description}</p>
                  </div>)}</div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">Suggested search phrases</p>
                <div className="flex flex-wrap gap-2">{brief.researchQueries.map((query) => <Badge key={`${brief.coverageItemId}-${query}`} variant="secondary">{query}</Badge>)}</div>
              </div>
            </div>;
          })}
        <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
          These are research prompts, not answers. Use Source library / Pack proposals / Brief & sources to locate governed evidence, rebuild the evidence index, then create or extract candidate claims for editorial review.
        </div>
      </CardContent>
    </Card>}
  </div>;
}

export default NotesStudioCoverageGapResearchPage;
