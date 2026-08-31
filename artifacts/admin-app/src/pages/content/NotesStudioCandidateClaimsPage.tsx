import { useEffect, useMemo, useState } from 'react';
import { Bot, CheckCircle2, FileSearch, Loader2, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
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

type EvidenceBlock = {
  id: string;
  sourceDocumentId: string;
  blockIndex: number;
  excerpt: string;
  sourceTitle: string;
  sourcePublisher: string;
  inclusionState: 'included' | 'excluded';
  locator?: {
    kind?: string;
    locatorLabel?: string;
    publisherTextRetained?: boolean;
  };
};

type EvidenceClaim = {
  id: string;
  claimText: string;
  state: 'candidate' | 'accepted' | 'rejected' | 'conflict';
};

type EvidenceResult = {
  blocks: EvidenceBlock[];
  claims: EvidenceClaim[];
  summary: {
    candidateClaims: number;
    acceptedClaims: number;
    conflictClaims: number;
  };
};

type PolicyResult = {
  policy: {
    key: string;
    name: string;
    ready: boolean;
    missing: Array<{ label: string }>;
    integrity: { findings: Array<{ label: string }> };
  };
};

type ExtractionResult = {
  generated: number;
  created: number;
  duplicatesSkipped: number;
  model: string;
  promptVersion: string;
  selectedRetainedEvidenceCount: number;
  selectedReferenceEvidenceCount: number;
  automaticAcceptance: false;
  automaticCoverageLinking: false;
  automaticSectionGeneration: false;
};

const MAX_BLOCKS = 40;

function prettyState(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function isReferenceEvidence(block: EvidenceBlock) {
  return block.locator?.kind === 'editor_reference_note';
}

export function NotesStudioCandidateClaimsPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [evidence, setEvidence] = useState<EvidenceResult | null>(null);
  const [policy, setPolicy] = useState<PolicyResult | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;
  const activeBlocks = useMemo(() => (evidence?.blocks ?? []).filter((block) => block.inclusionState === 'included'), [evidence]);
  const filteredBlocks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return activeBlocks;
    return activeBlocks.filter((block) => [block.sourceTitle, block.sourcePublisher, block.excerpt, block.locator?.locatorLabel]
      .some((value) => String(value ?? '').toLowerCase().includes(normalized)));
  }, [activeBlocks, query]);

  const loadJobs = async () => {
    const result = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
    const next = result.jobs ?? [];
    setJobs(next);
    setSelectedJobId((current) => current && next.some((job) => job.id === current) ? current : next[0]?.id ?? '');
  };

  const loadWorkspace = async (jobId: string) => {
    if (!jobId) {
      setEvidence(null);
      setPolicy(null);
      setSelectedBlocks([]);
      return;
    }
    const [evidenceResult, policyResult] = await Promise.all([
      adminRequest<EvidenceResult>(`/admin/notes-studio/jobs/${jobId}/evidence`),
      adminRequest<PolicyResult>(`/admin/notes-studio/jobs/${jobId}/source-policy`),
    ]);
    setEvidence(evidenceResult);
    setPolicy(policyResult);
    setSelectedBlocks((current) => current.filter((id) => evidenceResult.blocks.some((block) => block.id === id && block.inclusionState === 'included')));
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
    if (!selectedJobId) return;
    setLoading(true);
    void loadWorkspace(selectedJobId)
      .catch((error) => showToast.error('Unable to load candidate extraction workspace', error instanceof Error ? error.message : 'Request failed.'))
      .finally(() => setLoading(false));
  }, [selectedJobId]);

  const toggleBlock = (blockId: string, checked: boolean) => {
    setSelectedBlocks((current) => {
      if (!checked) return current.filter((id) => id !== blockId);
      if (current.includes(blockId)) return current;
      if (current.length >= MAX_BLOCKS) {
        showToast.warning('Evidence selection is bounded', `Choose at most ${MAX_BLOCKS} blocks per extraction run.`);
        return current;
      }
      return [...current, blockId];
    });
  };

  const selectVisible = () => {
    const next = filteredBlocks.slice(0, MAX_BLOCKS).map((block) => block.id);
    setSelectedBlocks(next);
  };

  const extract = async () => {
    if (!selectedJobId || selectedBlocks.length < 1) {
      showToast.warning('Select evidence', 'Choose at least one evidence block before extracting candidate claims.');
      return;
    }
    setWorking(true);
    try {
      const result = await adminRequest<ExtractionResult>(`/admin/notes-studio/jobs/${selectedJobId}/candidate-claims/extract`, {
        method: 'POST',
        body: JSON.stringify({ blockIds: selectedBlocks }),
      });
      await Promise.all([loadWorkspace(selectedJobId), loadJobs()]);
      setSelectedBlocks([]);
      showToast.success(
        'Candidate claims extracted',
        `${result.created} new candidate claims created; ${result.duplicatesSkipped} duplicates skipped. Input used ${result.selectedRetainedEvidenceCount} retained and ${result.selectedReferenceEvidenceCount} reference-evidence block(s). Nothing was accepted automatically.`,
      );
    } catch (error) {
      showToast.error('Unable to extract candidate claims', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

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

  const ready = Boolean(selectedJob?.state === 'evidence_ready' && policy?.policy.ready && activeBlocks.length > 0);
  const policyGaps = [...(policy?.policy.missing ?? []), ...(policy?.policy.integrity.findings ?? [])];

  return <div className="space-y-4">
    <PageHeader
      title="Candidate claim extraction"
      description="Turn editor-selected governed evidence blocks into provenance-bound candidate facts. Retained excerpts and reviewed reference notes remain explicitly distinguishable; every proposal still requires editorial review."
      actions={<Button variant="outline" onClick={() => void refresh()} disabled={working}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>}
    />

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />Trust boundary</CardTitle></CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-4">
        <div><p className="text-xs text-muted-foreground">Input</p><p className="font-medium">Selected evidence blocks only</p></div>
        <div><p className="text-xs text-muted-foreground">Maximum</p><p className="font-medium">40 blocks per run</p></div>
        <div><p className="text-xs text-muted-foreground">Persistence</p><p className="font-medium">Candidate claims only</p></div>
        <div><p className="text-xs text-muted-foreground">Automation</p><p className="font-medium">No acceptance / coverage / sections</p></div>
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
          <Badge variant={policy?.policy.ready ? 'default' : 'secondary'}>{policy?.policy.ready ? `${policy.policy.name} ready` : 'Source policy blocked'}</Badge>
          <Badge variant="outline">{activeBlocks.length} active blocks</Badge>
          <Badge variant="outline">{evidence?.summary.candidateClaims ?? 0} candidates</Badge>
          <Badge variant="outline">{evidence?.summary.acceptedClaims ?? 0} accepted</Badge>
          {(evidence?.summary.conflictClaims ?? 0) > 0 && <Badge variant="destructive">{evidence?.summary.conflictClaims} conflicts</Badge>}
        </div>}
        {!ready && selectedJob && <div className="rounded-md border border-warning/30 bg-warning/5 p-3 text-sm">
          <p className="font-medium">Extraction is not ready.</p>
          <p className="text-muted-foreground">
            {selectedJob.state !== 'evidence_ready'
              ? 'The job must be in Evidence ready state.'
              : policyGaps.length > 0
                ? `Resolve source-policy gaps: ${policyGaps.map((item) => item.label).join(', ')}.`
                : 'Create retained evidence or reviewed reference evidence first.'}
          </p>
        </div>}
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><FileSearch className="h-5 w-5" />Evidence selection</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter by source, locator or evidence text" />
          <Button variant="outline" onClick={selectVisible} disabled={!ready || filteredBlocks.length === 0}>Select first {Math.min(MAX_BLOCKS, filteredBlocks.length)}</Button>
          <Button variant="ghost" onClick={() => setSelectedBlocks([])} disabled={selectedBlocks.length === 0}>Clear</Button>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>{selectedBlocks.length}/{MAX_BLOCKS} selected</span>
          <Button onClick={() => void extract()} disabled={!canEdit || !ready || working || selectedBlocks.length === 0}>
            {working ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Extract candidate claims
          </Button>
        </div>
        {loading ? <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading evidence…</div>
          : filteredBlocks.length === 0 ? <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">No active evidence blocks match this view.</div>
            : <div className="grid gap-2 lg:grid-cols-2">{filteredBlocks.map((block) => {
              const checked = selectedBlocks.includes(block.id);
              const referenceEvidence = isReferenceEvidence(block);
              return <Label key={block.id} className="flex cursor-pointer items-start gap-3 rounded-md border p-3 font-normal">
                <Checkbox checked={checked} onCheckedChange={(value) => toggleBlock(block.id, value === true)} disabled={!ready || (!checked && selectedBlocks.length >= MAX_BLOCKS)} />
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{block.sourceTitle}</span>
                    <Badge variant="outline">{referenceEvidence ? 'Reference note' : `Block ${block.blockIndex + 1}`}</Badge>
                    {referenceEvidence && <Badge variant="secondary">Publisher text not retained</Badge>}
                  </div>
                  {block.sourcePublisher && <p className="text-xs text-muted-foreground">{block.sourcePublisher}</p>}
                  {referenceEvidence && block.locator?.locatorLabel && <p className="text-xs text-muted-foreground">Locator: {block.locator.locatorLabel}</p>}
                  <p className="line-clamp-5 text-sm leading-6">{block.excerpt}</p>
                </div>
              </Label>;
            })}</div>}
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" />Editorial handoff</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />Each generated fact is persisted with exact supporting evidence-block mappings.</p>
        <p>Review, reject, mark conflicts, and accept candidate claims in the existing <strong className="text-foreground">Evidence & coverage</strong> tab. Candidate extraction cannot link coverage targets or unlock section drafting by itself.</p>
      </CardContent>
    </Card>
  </div>;
}

export default NotesStudioCandidateClaimsPage;
