import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Link2, Loader2, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

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

type ClaimEvidence = {
  relation: 'supports' | 'contradicts';
  inclusionState: 'included' | 'excluded';
};

type EvidenceClaim = {
  id: string;
  claimText: string;
  state: 'candidate' | 'accepted' | 'rejected' | 'conflict';
  evidence: ClaimEvidence[];
};

type EvidenceResult = {
  claims: EvidenceClaim[];
};

type CoverageClaim = {
  claimId: string;
};

type CoverageItem = {
  id: string;
  title: string;
  syllabusRef: string;
  priority: 'required' | 'high' | 'supporting' | 'exclude';
  plannedDepth: 'brief' | 'standard' | 'deep';
  examRationale: string;
  claims: CoverageClaim[];
};

type CoverageResult = {
  items: CoverageItem[];
};

type ProposalClaim = {
  id: string;
  text: string;
};

type ProposalCoverage = {
  id: string;
  title: string;
  syllabusRef: string;
  priority: string;
  plannedDepth: string;
  examRationale: string;
};

type CoverageProposal = {
  claimId: string;
  coverageItemIds: string[];
  confidence: number;
  rationale: string;
};

type ProposalResult = {
  proposals: CoverageProposal[];
  claims: ProposalClaim[];
  coverageItems: ProposalCoverage[];
  totalUnmappedClaims: number;
  batchClaimCount: number;
  model: string;
  promptVersion: string;
  rawSourceTextSent: false;
  acceptedClaimsOnly: true;
  automaticApplication: false;
};

type ApplyResult = {
  reviewed: number;
  created: number;
  duplicatesSkipped: number;
  jobState: string | null;
  editorApplied: true;
  modelAutomaticallyApplied: false;
  claimStateChanged: false;
};

type Mapping = { claimId: string; coverageItemId: string };

function prettyState(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function mappingKey(mapping: Mapping) {
  return `${mapping.claimId}:${mapping.coverageItemId}`;
}

export function NotesStudioCoverageProposalPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [evidence, setEvidence] = useState<EvidenceResult | null>(null);
  const [coverage, setCoverage] = useState<CoverageResult | null>(null);
  const [proposalResult, setProposalResult] = useState<ProposalResult | null>(null);
  const [selectedMappingKeys, setSelectedMappingKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;
  const acceptedSupportedClaims = useMemo(() => (evidence?.claims ?? []).filter((claim) =>
    claim.state === 'accepted' && claim.evidence.some((item) => item.relation === 'supports' && item.inclusionState === 'included'),
  ), [evidence]);
  const linkedClaimIds = useMemo(() => new Set((coverage?.items ?? []).flatMap((item) => item.claims.map((claim) => claim.claimId))), [coverage]);
  const currentUnmappedCount = acceptedSupportedClaims.filter((claim) => !linkedClaimIds.has(claim.id)).length;
  const editable = Boolean(selectedJob && ['evidence_ready', 'outline_ready'].includes(selectedJob.state));

  const claimById = useMemo(() => new Map((proposalResult?.claims ?? []).map((claim) => [claim.id, claim])), [proposalResult]);
  const coverageById = useMemo(() => new Map((proposalResult?.coverageItems ?? []).map((item) => [item.id, item])), [proposalResult]);
  const allMappings = useMemo<Mapping[]>(() => (proposalResult?.proposals ?? []).flatMap((proposal) =>
    proposal.coverageItemIds.map((coverageItemId) => ({ claimId: proposal.claimId, coverageItemId })),
  ), [proposalResult]);

  const loadJobs = async () => {
    const result = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
    const next = result.jobs ?? [];
    setJobs(next);
    setSelectedJobId((current) => current && next.some((job) => job.id === current) ? current : next[0]?.id ?? '');
  };

  const loadWorkspace = async (jobId: string) => {
    if (!jobId) {
      setEvidence(null);
      setCoverage(null);
      return;
    }
    const [evidenceResult, coverageResult] = await Promise.all([
      adminRequest<EvidenceResult>(`/admin/notes-studio/jobs/${jobId}/evidence`),
      adminRequest<CoverageResult>(`/admin/notes-studio/jobs/${jobId}/coverage`),
    ]);
    setEvidence(evidenceResult);
    setCoverage(coverageResult);
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
    setProposalResult(null);
    setSelectedMappingKeys([]);
    if (!selectedJobId) return;
    setLoading(true);
    void loadWorkspace(selectedJobId)
      .catch((error) => showToast.error('Unable to load coverage mapping workspace', error instanceof Error ? error.message : 'Request failed.'))
      .finally(() => setLoading(false));
  }, [selectedJobId]);

  const refresh = async () => {
    setWorking(true);
    try {
      await Promise.all([loadJobs(), selectedJobId ? loadWorkspace(selectedJobId) : Promise.resolve()]);
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
      const result = await adminRequest<ProposalResult>(`/admin/notes-studio/jobs/${selectedJobId}/coverage-proposals/generate`, { method: 'POST' });
      setProposalResult(result);
      setSelectedMappingKeys([]);
      showToast.success(
        'Coverage proposals generated',
        `${result.proposals.length} accepted claims received mapping suggestions. Review each link before applying.`,
      );
    } catch (error) {
      showToast.error('Unable to generate coverage proposals', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const toggleMapping = (mapping: Mapping, checked: boolean) => {
    const key = mappingKey(mapping);
    setSelectedMappingKeys((current) => checked
      ? [...new Set([...current, key])]
      : current.filter((item) => item !== key));
  };

  const apply = async () => {
    if (!selectedJobId || selectedMappingKeys.length === 0) {
      showToast.warning('Choose reviewed links', 'Select at least one proposed claim-to-coverage link before applying.');
      return;
    }
    const selected = new Set(selectedMappingKeys);
    const mappings = allMappings.filter((mapping) => selected.has(mappingKey(mapping)));
    setWorking(true);
    try {
      const result = await adminRequest<ApplyResult>(`/admin/notes-studio/jobs/${selectedJobId}/coverage-proposals/apply`, {
        method: 'POST',
        body: JSON.stringify({ mappings }),
      });
      setProposalResult(null);
      setSelectedMappingKeys([]);
      await Promise.all([loadJobs(), loadWorkspace(selectedJobId)]);
      showToast.success(
        'Reviewed coverage links applied',
        `${result.created} links created; ${result.duplicatesSkipped} duplicates skipped. Claim states were not changed.`,
      );
    } catch (error) {
      showToast.error('Unable to apply coverage proposals', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  return <div className="space-y-4">
    <PageHeader
      title="Coverage proposals"
      description="Suggest syllabus placement for accepted, source-supported claims. Suggestions are advisory until an editor explicitly applies individual links."
      actions={<Button variant="outline" onClick={() => void refresh()} disabled={working}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>}
    />

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />Mapping boundary</CardTitle></CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-4">
        <div><p className="text-xs text-muted-foreground">Model input</p><p className="font-medium">Accepted claims + coverage plan</p></div>
        <div><p className="text-xs text-muted-foreground">Raw source text</p><p className="font-medium">Never sent</p></div>
        <div><p className="text-xs text-muted-foreground">Proposal write</p><p className="font-medium">Stateless / advisory</p></div>
        <div><p className="text-xs text-muted-foreground">Application</p><p className="font-medium">Explicit editor action only</p></div>
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
          <Badge variant="outline">{acceptedSupportedClaims.length} accepted + supported</Badge>
          <Badge variant={currentUnmappedCount > 0 ? 'secondary' : 'default'}>{currentUnmappedCount} currently unmapped</Badge>
          <Badge variant="outline">{coverage?.items.filter((item) => item.priority !== 'exclude').length ?? 0} active coverage targets</Badge>
        </div>}
        {selectedJob && !editable && <div className="rounded-md border border-warning/30 bg-warning/5 p-3 text-sm">
          <p className="font-medium">Coverage mapping is frozen for this lifecycle stage.</p>
          <p className="text-muted-foreground">Generate/apply proposals only in Evidence ready or Outline ready. Once drafting starts, use the successor-revision workflow for new research or coverage changes.</p>
        </div>}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void generate()} disabled={!canEdit || !editable || currentUnmappedCount === 0 || working}>
            {working ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate proposals
          </Button>
          {proposalResult && <Badge variant="outline">Model: {proposalResult.model}</Badge>}
        </div>
      </CardContent>
    </Card>

    {proposalResult && <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2"><Link2 className="h-5 w-5" />Review proposed links</span>
          <span className="text-sm font-normal text-muted-foreground">{selectedMappingKeys.length}/{allMappings.length} selected</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedMappingKeys(allMappings.map(mappingKey))} disabled={allMappings.length === 0}>Select all proposals</Button>
          <Button variant="ghost" size="sm" onClick={() => setSelectedMappingKeys([])} disabled={selectedMappingKeys.length === 0}>Clear selection</Button>
          <Badge variant="outline">Batch {proposalResult.batchClaimCount}/{proposalResult.totalUnmappedClaims} unmapped claims</Badge>
        </div>

        {proposalResult.proposals.length === 0
          ? <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">The model found no clear syllabus mappings in this batch. Review the claims and coverage plan manually rather than forcing weak links.</div>
          : <div className="space-y-3">{proposalResult.proposals.map((proposal) => {
            const claim = claimById.get(proposal.claimId);
            return <div key={proposal.claimId} className="rounded-md border p-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline">Confidence {Math.round(proposal.confidence * 100)}%</Badge>
                <span className="text-xs text-muted-foreground">{proposal.rationale}</span>
              </div>
              <p className="mb-3 font-medium leading-6">{claim?.text ?? proposal.claimId}</p>
              <div className="space-y-2">{proposal.coverageItemIds.map((coverageItemId) => {
                const coverageItem = coverageById.get(coverageItemId);
                const mapping = { claimId: proposal.claimId, coverageItemId };
                const checked = selectedMappingKeys.includes(mappingKey(mapping));
                return <Label key={coverageItemId} className="flex cursor-pointer items-start gap-3 rounded-md bg-muted/30 p-3 font-normal">
                  <Checkbox checked={checked} onCheckedChange={(value) => toggleMapping(mapping, value === true)} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{coverageItem?.title ?? coverageItemId}</span>
                      {coverageItem?.priority && <Badge variant="outline">{coverageItem.priority}</Badge>}
                      {coverageItem?.plannedDepth && <Badge variant="outline">{coverageItem.plannedDepth}</Badge>}
                    </div>
                    {coverageItem?.syllabusRef && <p className="mt-1 text-xs text-muted-foreground">{coverageItem.syllabusRef}</p>}
                    {coverageItem?.examRationale && <p className="mt-1 text-sm text-muted-foreground">{coverageItem.examRationale}</p>}
                  </div>
                </Label>;
              })}</div>
            </div>;
          })}</div>}

        <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">Applying writes only reviewed claim↔coverage links. It does not change claim state or generate learner prose.</p>
          <Button onClick={() => void apply()} disabled={!canEdit || working || selectedMappingKeys.length === 0}>
            {working ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
            Apply reviewed links
          </Button>
        </div>
      </CardContent>
    </Card>}
  </div>;
}

export default NotesStudioCoverageProposalPage;
