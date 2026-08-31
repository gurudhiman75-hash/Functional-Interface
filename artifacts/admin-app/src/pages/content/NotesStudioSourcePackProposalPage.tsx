import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, RefreshCw, Sparkles, WandSparkles } from 'lucide-react';

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
  brief?: { topicLabel?: string; taxonomyCode?: string; sourcePackTemplate?: string };
};

type Requirement = {
  code: string;
  label: string;
  minCount: number;
  currentCount: number;
  satisfied: boolean;
};

type ProposalItem = {
  requirementCode: string;
  sourceId: string;
  title: string;
  publisher: string;
  suggestedRole: string;
  generationReady: boolean;
  referenceReviewRequired: boolean;
  satisfiesRequirementNow: boolean;
  evidencePath: 'retained_ready' | 'reference_review_required' | 'provenance_only';
  score: number;
  reason: string;
};

type PendingReferenceReview = {
  sourceId: string;
  title: string;
  publisher: string;
  sourceRole: string;
};

type ProposalResponse = {
  job: { id: string; title: string; state: string; sourcePackTemplate: string };
  policy: {
    templateKey: string;
    name: string;
    description: string;
    ready: boolean;
    requirements: Requirement[];
    missing: Requirement[];
  };
  proposal: {
    items: ProposalItem[];
    unresolved: Array<{ requirementCode: string; label: string; missingCount: number; pendingReferenceReviewCount?: number }>;
    complete: boolean;
    automaticAttachment: boolean;
    requiresExplicitEditorApply: boolean;
    historicalReferenceEvidenceTransferred: boolean;
  };
  candidateCount: number;
  pendingReferenceReviews: PendingReferenceReview[];
  rawSourceBodiesReturned: boolean;
  externalNetworkSearch: boolean;
  automaticAttachment: boolean;
  historicalReferenceEvidenceTransferred: boolean;
};

function pretty(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function NotesStudioSourcePackProposalPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [proposal, setProposal] = useState<ProposalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) ?? null, [jobs, selectedJobId]);
  const editableState = proposal ? ['brief', 'sources_ready'].includes(proposal.job.state) : false;
  const stagedReferenceCount = proposal?.proposal.items.filter((item) => item.referenceReviewRequired).length ?? 0;
  const pendingAttachedReferenceCount = proposal?.pendingReferenceReviews.length ?? 0;

  const loadProposal = async (jobId: string) => {
    if (!jobId) {
      setProposal(null);
      return;
    }
    setProposal(await adminRequest<ProposalResponse>(`/admin/notes-studio/jobs/${jobId}/source-pack-proposal`));
  };

  const load = async () => {
    setLoading(true);
    try {
      const result = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
      const nextJobs = result.jobs ?? [];
      setJobs(nextJobs);
      const nextId = selectedJobId && nextJobs.some((job) => job.id === selectedJobId) ? selectedJobId : nextJobs[0]?.id ?? '';
      setSelectedJobId(nextId);
      await loadProposal(nextId);
    } catch (error) {
      showToast.error('Unable to load source-pack proposals', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);
  useEffect(() => {
    if (!selectedJobId) return;
    void loadProposal(selectedJobId).catch((error) => {
      setProposal(null);
      showToast.error('Unable to build source-pack proposal', error instanceof Error ? error.message : 'Request failed.');
    });
  }, [selectedJobId]);

  const applyProposal = async () => {
    if (!selectedJobId || !proposal || proposal.proposal.items.length === 0) return;
    setWorking(true);
    try {
      const result = await adminRequest<{ appliedCount: number; referenceReviewRequiredCount: number }>(`/admin/notes-studio/jobs/${selectedJobId}/source-pack-proposal/apply`, {
        method: 'POST',
        body: JSON.stringify({ editorApproved: true }),
      });
      await Promise.all([loadProposal(selectedJobId), adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs').then((value) => setJobs(value.jobs ?? []))]);
      showToast.success(
        'Governed proposal applied',
        result.referenceReviewRequiredCount > 0
          ? `${result.appliedCount} source${result.appliedCount === 1 ? '' : 's'} attached; ${result.referenceReviewRequiredCount} require fresh review in Reference Evidence before they satisfy evidence-ready policy roles.`
          : `${result.appliedCount} source${result.appliedCount === 1 ? '' : 's'} attached with their proposed research roles.`,
      );
    } catch (error) {
      showToast.error('Unable to apply source-pack proposal', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Source-pack proposals"
      description="Compose missing Source Policy roles from already-governed sources used successfully on related Notes Studio jobs. Review first; attachment is always an explicit editor action."
      icon={<WandSparkles className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void load()} disabled={loading || working}>
        {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}Refresh
      </Button>}
    />

    <Card>
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="space-y-1.5">
          <div className="text-sm font-medium">Authoring job</div>
          <Select value={selectedJobId || undefined} onValueChange={setSelectedJobId}>
            <SelectTrigger><SelectValue placeholder="Choose a Notes Studio job" /></SelectTrigger>
            <SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>)}</SelectContent>
          </Select>
          {selectedJob && <div className="text-xs text-muted-foreground">{selectedJob.brief?.taxonomyCode || selectedJob.brief?.topicLabel || 'No taxonomy label'} · {pretty(selectedJob.state)}</div>}
        </div>
        <Button onClick={() => void applyProposal()} disabled={!canEdit || !editableState || working || !proposal?.proposal.items.length}>
          {working ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}Apply reviewed proposal
        </Button>
      </CardContent>
    </Card>

    {proposal && <>
      <Card className={proposal.policy.ready ? 'border-emerald-200' : proposal.proposal.complete ? 'border-blue-200' : stagedReferenceCount > 0 || pendingAttachedReferenceCount > 0 ? 'border-violet-300' : 'border-amber-300'}>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              {proposal.policy.ready && <CheckCircle2 className="h-4 w-4" />}
              {proposal.policy.ready
                ? 'Source Policy already satisfied'
                : proposal.proposal.complete
                  ? 'Complete governed proposal available'
                  : stagedReferenceCount > 0 || pendingAttachedReferenceCount > 0
                    ? 'Reference review required before policy completion'
                    : 'Partial proposal only'}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {proposal.policy.name} · {proposal.candidateCount} eligible governed candidate{proposal.candidateCount === 1 ? '' : 's'} considered.
              {pendingAttachedReferenceCount > 0 ? ` ${pendingAttachedReferenceCount} attached reference source${pendingAttachedReferenceCount === 1 ? '' : 's'} await fresh review.` : ''}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">External search: off</Badge>
            <Badge variant="outline">Auto-attach: off</Badge>
            <Badge variant="outline">Historical evidence transfer: off</Badge>
          </div>
        </CardContent>
      </Card>

      {proposal.pendingReferenceReviews.length > 0 && <Card className="border-violet-200">
        <CardHeader><CardTitle className="text-base">Attached sources awaiting Reference Evidence review</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {proposal.pendingReferenceReviews.map((item) => <div key={item.sourceId} className="rounded-lg border p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div><div className="font-medium">{item.title}</div><div className="mt-0.5 text-xs text-muted-foreground">{item.publisher || 'Publisher not recorded'}</div></div>
              <Badge variant="outline">{pretty(item.sourceRole)}</Badge>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Open Reference Evidence, review this source for the current job, and record a fresh bounded factual paraphrase with an exact locator. Prior-job reference notes are not copied.</div>
          </div>)}
        </CardContent>
      </Card>}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Proposed additions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {proposal.proposal.items.length === 0 && <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">{proposal.policy.ready ? 'Nothing to add: the current pack already satisfies Source Policy.' : proposal.pendingReferenceReviews.length > 0 ? 'The relevant governed reference source is already attached. Complete its fresh review in Reference Evidence.' : 'No prior governed source has both the required topic relevance and a proven prior role for the missing requirement.'}</div>}
            {proposal.proposal.items.map((item) => <div key={`${item.requirementCode}:${item.sourceId}`} className="rounded-lg border p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div><div className="font-medium">{item.title}</div><div className="mt-0.5 text-xs text-muted-foreground">{item.publisher || 'Publisher not recorded'}</div></div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant={item.generationReady ? 'default' : 'outline'}>{pretty(item.suggestedRole)}</Badge>
                  {item.referenceReviewRequired && <Badge variant="secondary">Fresh reference review</Badge>}
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{item.satisfiesRequirementNow ? 'Fills' : 'Stages'}: {pretty(item.requirementCode)} · score {Math.round(item.score)} · {item.reason}</div>
              {item.referenceReviewRequired && <div className="mt-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">This source was reviewed successfully in prior Notes Studio work, but that evidence does not transfer. Attaching it only stages the source; a fresh editor reference note is required for this job.</div>}
            </div>)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Unresolved requirements</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {proposal.proposal.unresolved.length === 0 && <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">No unresolved proposal requirement.</div>}
            {proposal.proposal.unresolved.map((item) => <div key={item.requirementCode} className="rounded-lg border p-3">
              <div className="font-medium">{item.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Still needs {item.missingCount} evidence-ready source{item.missingCount === 1 ? '' : 's'}.
                {item.pendingReferenceReviewCount ? ` ${item.pendingReferenceReviewCount} staged governed reference source${item.pendingReferenceReviewCount === 1 ? '' : 's'} can satisfy this after fresh Reference Evidence review.` : ' Use Source Library or Brief & Sources to add/review an appropriate governed source manually.'}
              </div>
            </div>)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Governance boundary:</strong> proposals only reuse existing `content.source_documents` records and only suggest roles proven by prior Notes Studio usage. A previously reviewed reference-only source may be staged, but prior-job reference evidence is never transferred. Applying a proposal records an editor-approved audit event; it does not fetch URLs, copy source bodies, build evidence, draft sections, approve or publish content.
        </CardContent>
      </Card>
    </>}
  </div>;
}

export default NotesStudioSourcePackProposalPage;
