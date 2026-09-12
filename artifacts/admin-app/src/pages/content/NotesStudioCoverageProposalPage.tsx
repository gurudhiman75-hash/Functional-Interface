import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, RefreshCw, Sparkles } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type AuthoringJob = {
  id: string;
  title: string;
  state: string;
  sourceLanguage: string;
};

type CoverageResult = {
  summary: {
    itemCount: number;
    covered: number;
    partial: number;
    blocked: number;
    uncovered: number;
  };
};

type BatchClaim = { id: string; text: string };

type BatchCoverageItem = {
  id: string;
  title: string;
  syllabusRef: string;
  priority: string;
  plannedDepth: string;
  examRationale: string;
  linkedClaimIds: string[];
};

type BatchReview = {
  coverageItemId: string;
  assessment: 'sufficient' | 'partial' | 'missing';
  claimIds: string[];
  confidence: number;
  rationale: string;
};

type BatchReviewResult = {
  reviews: BatchReview[];
  claims: BatchClaim[];
  coverageItems: BatchCoverageItem[];
  counts: { sufficient: number; partial: number; missing: number };
  model: string;
  promptVersion: string;
  rawSourceTextSent: false;
  acceptedClaimsOnly: true;
  automaticApplication: false;
  automaticCoverageDecision: false;
};

type BatchApplyResult = {
  approved: number;
  createdLinks: number;
  jobState: { state?: string } | string | null;
};

function prettyState(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function assessmentBadge(assessment: BatchReview['assessment']) {
  if (assessment === 'sufficient') return 'default' as const;
  if (assessment === 'partial') return 'secondary' as const;
  return 'outline' as const;
}

export function NotesStudioCoverageProposalPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [coverage, setCoverage] = useState<CoverageResult | null>(null);
  const [reviewResult, setReviewResult] = useState<BatchReviewResult | null>(null);
  const [selectedSufficientIds, setSelectedSufficientIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;
  const editable = Boolean(selectedJob && ['evidence_ready', 'outline_ready'].includes(selectedJob.state));
  const claimById = useMemo(() => new Map((reviewResult?.claims ?? []).map((claim) => [claim.id, claim])), [reviewResult]);
  const coverageById = useMemo(() => new Map((reviewResult?.coverageItems ?? []).map((item) => [item.id, item])), [reviewResult]);
  const selectedReviews = useMemo(() => {
    const selected = new Set(selectedSufficientIds);
    return (reviewResult?.reviews ?? []).filter((review) => review.assessment === 'sufficient' && selected.has(review.coverageItemId));
  }, [reviewResult, selectedSufficientIds]);

  const loadJobs = async () => {
    const result = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
    const next = result.jobs ?? [];
    setJobs(next);
    setSelectedJobId((current) => current && next.some((job) => job.id === current) ? current : next[0]?.id ?? '');
  };

  const loadCoverage = async (jobId: string) => {
    if (!jobId) {
      setCoverage(null);
      return;
    }
    setCoverage(await adminRequest<CoverageResult>(`/admin/notes-studio/jobs/${jobId}/coverage`));
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
    setReviewResult(null);
    setSelectedSufficientIds([]);
    if (!selectedJobId) return;
    setLoading(true);
    void loadCoverage(selectedJobId)
      .catch((error) => showToast.error('Unable to load coverage', error instanceof Error ? error.message : 'Request failed.'))
      .finally(() => setLoading(false));
  }, [selectedJobId]);

  const refresh = async () => {
    setWorking(true);
    try {
      await Promise.all([loadJobs(), selectedJobId ? loadCoverage(selectedJobId) : Promise.resolve()]);
    } catch (error) {
      showToast.error('Unable to refresh coverage review', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const reviewCoverage = async () => {
    if (!selectedJobId) return;
    setWorking(true);
    try {
      const result = await adminRequest<BatchReviewResult>(
        `/admin/notes-studio/jobs/${selectedJobId}/coverage-proposals/batch-review/generate`,
        { method: 'POST' },
      );
      setReviewResult(result);
      setSelectedSufficientIds(result.reviews.filter((review) => review.assessment === 'sufficient').map((review) => review.coverageItemId));
      showToast.success(
        'Coverage review ready',
        `${result.counts.sufficient} sufficient, ${result.counts.partial} partial and ${result.counts.missing} missing. Sufficient targets are preselected.`,
      );
    } catch (error) {
      showToast.error('Unable to review coverage', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const toggleSufficient = (coverageItemId: string, checked: boolean) => {
    setSelectedSufficientIds((current) => checked
      ? [...new Set([...current, coverageItemId])]
      : current.filter((id) => id !== coverageItemId));
  };

  const approveSufficient = async () => {
    if (!selectedJobId || selectedReviews.length === 0) {
      showToast.warning('No sufficient targets selected', 'Run coverage review and keep at least one sufficient target selected.');
      return;
    }
    setWorking(true);
    try {
      const result = await adminRequest<BatchApplyResult>(
        `/admin/notes-studio/jobs/${selectedJobId}/coverage-proposals/batch-review/apply`,
        {
          method: 'POST',
          body: JSON.stringify({
            reviews: selectedReviews.map((review) => ({ coverageItemId: review.coverageItemId, claimIds: review.claimIds })),
          }),
        },
      );
      setReviewResult(null);
      setSelectedSufficientIds([]);
      await Promise.all([loadJobs(), loadCoverage(selectedJobId)]);
      showToast.success(
        'Coverage approved',
        `${result.approved} sufficient targets confirmed in one batch. Partial and missing targets remain research gaps.`,
      );
    } catch (error) {
      showToast.error('Unable to approve coverage', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  return <div className="space-y-4">
    <PageHeader
      title="Coverage review"
      description="Two-click review: assess every syllabus target together, then approve the clearly sufficient targets in one batch. Partial and missing targets automatically remain research gaps."
      actions={<Button variant="outline" onClick={() => void refresh()} disabled={working}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>}
    />

    <Card>
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(280px,440px)_1fr] lg:items-end">
        <div className="space-y-1.5">
          <Label>Authoring job</Label>
          <Select value={selectedJobId} onValueChange={setSelectedJobId} disabled={loading || working}>
            <SelectTrigger><SelectValue placeholder="Choose a Notes Studio job" /></SelectTrigger>
            <SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title} · {prettyState(job.state)}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedJob && <Badge variant="outline">{prettyState(selectedJob.state)}</Badge>}
          {coverage && <Badge variant="outline">{coverage.summary.covered}/{coverage.summary.itemCount} covered</Badge>}
          {coverage && coverage.summary.partial > 0 && <Badge variant="secondary">{coverage.summary.partial} partial</Badge>}
          {coverage && coverage.summary.uncovered > 0 && <Badge variant="outline">{coverage.summary.uncovered} uncovered</Badge>}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>1. Review coverage</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">The model sees only editor-accepted claim text and the syllabus coverage plan. It does not receive raw source pages and cannot accept claims or publish notes.</p>
        {selectedJob && !editable && <div className="rounded-md border p-3 text-sm text-muted-foreground">Coverage review is frozen after drafting begins. Use the normal successor-revision flow for later changes.</div>}
        <Button onClick={() => void reviewCoverage()} disabled={!canEdit || !editable || working}>
          {working ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Review all coverage
        </Button>
      </CardContent>
    </Card>

    {reviewResult && <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Sufficient</div><div className="mt-1 text-2xl font-bold">{reviewResult.counts.sufficient}</div><div className="text-xs text-muted-foreground">preselected for approval</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Partial</div><div className="mt-1 text-2xl font-bold">{reviewResult.counts.partial}</div><div className="text-xs text-muted-foreground">stays in gap research</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Missing</div><div className="mt-1 text-2xl font-bold">{reviewResult.counts.missing}</div><div className="text-xs text-muted-foreground">needs new evidence</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Review result</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {reviewResult.reviews.map((review) => {
            const item = coverageById.get(review.coverageItemId);
            const selected = selectedSufficientIds.includes(review.coverageItemId);
            return <div key={review.coverageItemId} className="rounded-lg border p-4">
              <div className="flex items-start gap-3">
                {review.assessment === 'sufficient' && <Checkbox className="mt-1" checked={selected} onCheckedChange={(value) => toggleSufficient(review.coverageItemId, value === true)} />}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{item?.title ?? review.coverageItemId}</span>
                    <Badge variant={assessmentBadge(review.assessment)}>{review.assessment}</Badge>
                    <Badge variant="outline">{Math.round(review.confidence * 100)}%</Badge>
                    {item?.plannedDepth && <Badge variant="outline">{item.plannedDepth}</Badge>}
                  </div>
                  {item?.syllabusRef && <p className="mt-1 text-xs text-muted-foreground">{item.syllabusRef}</p>}
                  <p className="mt-2 text-sm text-muted-foreground">{review.rationale}</p>
                  {review.claimIds.length > 0 && <div className="mt-2 space-y-1">
                    {review.claimIds.slice(0, 3).map((claimId) => <p key={claimId} className="text-xs"><span className="text-muted-foreground">•</span> {claimById.get(claimId)?.text ?? claimId}</p>)}
                    {review.claimIds.length > 3 && <p className="text-xs text-muted-foreground">+ {review.claimIds.length - 3} more accepted claims</p>}
                  </div>}
                </div>
              </div>
            </div>;
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>2. Approve sufficient coverage</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">One editor action applies the recommended claim links and confirms only the selected sufficient targets. Partial/missing targets are untouched.</p>
          <Button onClick={() => void approveSufficient()} disabled={!canEdit || working || selectedReviews.length === 0}>
            {working ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
            Approve {selectedReviews.length} sufficient target{selectedReviews.length === 1 ? '' : 's'}
          </Button>
        </CardContent>
      </Card>
    </>}
  </div>;
}

export default NotesStudioCoverageProposalPage;
