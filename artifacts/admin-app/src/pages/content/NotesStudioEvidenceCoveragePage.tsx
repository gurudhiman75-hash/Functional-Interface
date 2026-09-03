import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileSearch,
  Link2,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
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

type AuthoringJob = {
  id: string;
  title: string;
  sourceLanguage: string;
  state: string;
  brief: { topicLabel?: string };
  sourceCount: number;
  includedSourceCount: number;
  generatableSourceCount: number;
};

type EvidenceBlock = {
  id: string;
  sourceDocumentId: string;
  blockIndex: number;
  excerpt: string;
  excerptHash: string;
  charStart: number;
  charEnd: number;
  sourceTitle: string;
  sourcePublisher: string;
  sourceType: string;
  inclusionState: 'included' | 'excluded';
};

type ClaimEvidence = {
  blockId: string;
  relation: 'supports' | 'contradicts';
  sourceDocumentId: string;
  sourceTitle: string;
  excerpt: string;
  inclusionState: 'included' | 'excluded';
};

type EvidenceClaim = {
  id: string;
  claimText: string;
  claimHash: string;
  state: 'candidate' | 'accepted' | 'rejected' | 'conflict';
  confidence: number | null;
  contradictionKey: string | null;
  editorialNote: string;
  evidence: ClaimEvidence[];
};

type EvidenceResult = {
  blocks: EvidenceBlock[];
  claims: EvidenceClaim[];
  summary: {
    blockCount: number;
    activeBlockCount: number;
    claimCount: number;
    candidateClaims: number;
    acceptedClaims: number;
    conflictClaims: number;
  };
};

type CoverageClaim = {
  coverageItemId: string;
  claimId: string;
  claimText: string;
  state: EvidenceClaim['state'];
  hasActiveSupport: boolean;
};

type CoverageItem = {
  id: string;
  title: string;
  syllabusRef: string;
  priority: 'required' | 'high' | 'supporting' | 'exclude';
  plannedDepth: 'brief' | 'standard' | 'deep';
  examRationale: string;
  sortOrder: number;
  status: 'uncovered' | 'partial' | 'covered' | 'blocked';
  coverageReviewState?: 'unreviewed' | 'confirmed';
  coverageReviewCurrent?: boolean;
  coverageReviewedAt?: string | null;
  claims: CoverageClaim[];
};

type CoverageResult = {
  items: CoverageItem[];
  summary: { itemCount: number; covered: number; partial: number; blocked: number; uncovered: number };
  coverageRequiresEditorialConfirmation?: boolean;
};

const emptyEvidence: EvidenceResult = {
  blocks: [],
  claims: [],
  summary: { blockCount: 0, activeBlockCount: 0, claimCount: 0, candidateClaims: 0, acceptedClaims: 0, conflictClaims: 0 },
};

const emptyCoverage: CoverageResult = {
  items: [],
  summary: { itemCount: 0, covered: 0, partial: 0, blocked: 0, uncovered: 0 },
};

function prettyState(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function claimStateClass(state: EvidenceClaim['state']) {
  if (state === 'accepted') return 'border-success/30 bg-success/5 text-success';
  if (state === 'conflict') return 'border-destructive/30 bg-destructive/5 text-destructive';
  if (state === 'rejected') return 'border-border bg-muted/40 text-muted-foreground';
  return 'border-warning/30 bg-warning/5 text-warning';
}

function coverageClass(status: CoverageItem['status']) {
  if (status === 'covered') return 'border-success/30 bg-success/5 text-success';
  if (status === 'blocked') return 'border-destructive/30 bg-destructive/5 text-destructive';
  if (status === 'partial') return 'border-warning/30 bg-warning/5 text-warning';
  return 'border-border bg-muted/40 text-muted-foreground';
}

export function NotesStudioEvidenceCoveragePage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [evidence, setEvidence] = useState<EvidenceResult>(emptyEvidence);
  const [coverage, setCoverage] = useState<CoverageResult>(emptyCoverage);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [claimDraft, setClaimDraft] = useState({ claimText: '', confidence: '', contradictionKey: '' });
  const [coverageDraft, setCoverageDraft] = useState({ title: '', syllabusRef: '', priority: 'required', plannedDepth: 'standard', examRationale: '' });
  const [linkClaimByItem, setLinkClaimByItem] = useState<Record<string, string>>({});

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;
  const activeBlocks = useMemo(() => evidence.blocks.filter((block) => block.inclusionState === 'included'), [evidence.blocks]);
  const linkableClaims = useMemo(() => evidence.claims.filter((claim) => claim.state !== 'rejected'), [evidence.claims]);

  const loadJobs = async () => {
    const result = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
    const next = result.jobs ?? [];
    setJobs(next);
    setSelectedJobId((current) => current && next.some((job) => job.id === current) ? current : next[0]?.id ?? '');
  };

  const loadJobWorkspace = async (jobId: string) => {
    if (!jobId) {
      setEvidence(emptyEvidence);
      setCoverage(emptyCoverage);
      return;
    }
    const [evidenceResult, coverageResult] = await Promise.all([
      adminRequest<EvidenceResult>(`/admin/notes-studio/jobs/${jobId}/evidence`),
      adminRequest<CoverageResult>(`/admin/notes-studio/jobs/${jobId}/coverage`),
    ]);
    setEvidence(evidenceResult);
    setCoverage(coverageResult);
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
    void loadJobWorkspace(selectedJobId)
      .catch((error) => showToast.error('Unable to load evidence workspace', error instanceof Error ? error.message : 'Request failed.'))
      .finally(() => setLoading(false));
  }, [selectedJobId]);

  const refreshAll = async () => {
    setWorking(true);
    try {
      await Promise.all([loadJobs(), selectedJobId ? loadJobWorkspace(selectedJobId) : Promise.resolve()]);
    } catch (error) {
      showToast.error('Unable to refresh evidence workspace', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const rebuildEvidence = async () => {
    if (!selectedJobId) return;
    setWorking(true);
    try {
      const result = await adminRequest<EvidenceResult & { blocksCreated: number; blocksSeen: number }>(`/admin/notes-studio/jobs/${selectedJobId}/evidence/rebuild`, { method: 'POST' });
      setEvidence(result);
      await Promise.all([loadJobs(), loadJobWorkspace(selectedJobId)]);
      showToast.success('Evidence index built', `${result.blocksCreated} new evidence blocks added from ${result.blocksSeen} reviewed source blocks.`);
    } catch (error) {
      showToast.error('Unable to build evidence index', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const toggleBlock = (blockId: string, selected: boolean) => {
    setSelectedBlocks((current) => selected ? [...new Set([...current, blockId])] : current.filter((id) => id !== blockId));
  };

  const createClaim = async () => {
    if (!selectedJobId || claimDraft.claimText.trim().length < 5 || selectedBlocks.length === 0) {
      showToast.warning('Claim needs evidence', 'Write one atomic claim and select at least one supporting source block.');
      return;
    }
    setWorking(true);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${selectedJobId}/claims`, {
        method: 'POST',
        body: JSON.stringify({
          claimText: claimDraft.claimText.trim(),
          confidence: claimDraft.confidence ? Number(claimDraft.confidence) : null,
          contradictionKey: claimDraft.contradictionKey.trim() || null,
          evidence: selectedBlocks.map((blockId) => ({ blockId, relation: 'supports' })),
        }),
      });
      setClaimDraft({ claimText: '', confidence: '', contradictionKey: '' });
      setSelectedBlocks([]);
      await Promise.all([loadJobWorkspace(selectedJobId), loadJobs()]);
      showToast.success('Claim created', 'It remains a candidate until editorial acceptance.');
    } catch (error) {
      showToast.error('Unable to create claim', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const setClaimState = async (claim: EvidenceClaim, state: EvidenceClaim['state']) => {
    if (!selectedJobId) return;
    setWorking(true);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${selectedJobId}/claims/${claim.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ state }),
      });
      await Promise.all([loadJobWorkspace(selectedJobId), loadJobs()]);
    } catch (error) {
      showToast.error('Unable to update claim', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const createCoverageItem = async () => {
    if (!selectedJobId || coverageDraft.title.trim().length < 2) {
      showToast.warning('Coverage target required', 'Name the syllabus concept this note must cover.');
      return;
    }
    setWorking(true);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${selectedJobId}/coverage`, {
        method: 'POST',
        body: JSON.stringify(coverageDraft),
      });
      setCoverageDraft({ title: '', syllabusRef: '', priority: 'required', plannedDepth: 'standard', examRationale: '' });
      await Promise.all([loadJobWorkspace(selectedJobId), loadJobs()]);
    } catch (error) {
      showToast.error('Unable to add coverage target', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const linkClaim = async (item: CoverageItem) => {
    const claimId = linkClaimByItem[item.id];
    if (!selectedJobId || !claimId) return;
    setWorking(true);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${selectedJobId}/coverage/${item.id}/claims/${claimId}`, { method: 'POST' });
      setLinkClaimByItem((current) => ({ ...current, [item.id]: '' }));
      await Promise.all([loadJobWorkspace(selectedJobId), loadJobs()]);
    } catch (error) {
      showToast.error('Unable to link claim', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const unlinkClaim = async (itemId: string, claimId: string) => {
    if (!selectedJobId) return;
    setWorking(true);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${selectedJobId}/coverage/${itemId}/claims/${claimId}`, { method: 'DELETE' });
      await Promise.all([loadJobWorkspace(selectedJobId), loadJobs()]);
    } catch (error) {
      showToast.error('Unable to unlink claim', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const reviewCoverage = async (item: CoverageItem, confirmed: boolean) => {
    if (!selectedJobId) return;
    setWorking(true);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${selectedJobId}/coverage/${item.id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ confirmed }),
      });
      await Promise.all([loadJobWorkspace(selectedJobId), loadJobs()]);
      showToast.success(
        confirmed ? 'Coverage confirmed' : 'Coverage reopened',
        confirmed
          ? 'This target is covered only for the currently linked accepted evidence. Any material link/state change makes the review stale.'
          : 'The target is back in evidence review.',
      );
    } catch (error) {
      showToast.error('Unable to update coverage review', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const deleteCoverageItem = async (item: CoverageItem) => {
    if (!selectedJobId || !window.confirm(`Remove coverage target “${item.title}”?`)) return;
    setWorking(true);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${selectedJobId}/coverage/${item.id}`, { method: 'DELETE' });
      await Promise.all([loadJobWorkspace(selectedJobId), loadJobs()]);
    } catch (error) {
      showToast.error('Unable to remove coverage target', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Evidence & Coverage"
      description="Turn retained source material into bounded evidence, editorially accepted atomic claims, and an explicitly reviewed syllabus-first coverage plan before any note synthesis begins."
      icon={<FileSearch className="h-5 w-5" />}
      actions={<div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => void refreshAll()} disabled={loading || working}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>
        {canEdit && <Button onClick={() => void rebuildEvidence()} disabled={!selectedJobId || working}><ShieldCheck className="mr-1.5 h-4 w-4" />Build evidence index</Button>}
      </div>}
    />

    <Card>
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(260px,420px)_1fr] lg:items-end">
        <div className="space-y-1.5">
          <Label>Authoring job</Label>
          <Select value={selectedJobId} onValueChange={setSelectedJobId}>
            <SelectTrigger><SelectValue placeholder="Choose an authoring job" /></SelectTrigger>
            <SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {selectedJob ? <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="outline">{prettyState(selectedJob.state)}</Badge>
          {selectedJob.brief?.topicLabel && <span className="text-muted-foreground">{selectedJob.brief.topicLabel}</span>}
          <span className="text-muted-foreground">{selectedJob.generatableSourceCount} extractable source{selectedJob.generatableSourceCount === 1 ? '' : 's'}</span>
        </div> : <p className="text-sm text-muted-foreground">Create a brief and source pack first.</p>}
      </CardContent>
    </Card>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Evidence blocks</div><div className="mt-1 text-2xl font-bold">{evidence.summary.activeBlockCount}</div><div className="text-xs text-muted-foreground">active source-grounded units</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Accepted claims</div><div className="mt-1 text-2xl font-bold">{evidence.summary.acceptedClaims}</div><div className="text-xs text-muted-foreground">editorially approved facts</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Coverage</div><div className="mt-1 text-2xl font-bold">{coverage.summary.covered}/{coverage.summary.itemCount}</div><div className="text-xs text-muted-foreground">editor-confirmed targets</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Blocks / conflicts</div><div className="mt-1 text-2xl font-bold">{coverage.summary.blocked + evidence.summary.conflictClaims}</div><div className="text-xs text-muted-foreground">must resolve before synthesis</div></CardContent></Card>
    </div>

    {!selectedJobId ? <Card className="border-dashed"><CardContent className="p-10 text-center text-sm text-muted-foreground">No authoring job selected.</CardContent></Card> : <>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader className="pb-3"><CardTitle>Evidence map</CardTitle><p className="text-sm text-muted-foreground">Select bounded excerpts from included, extractable sources. The original source remains the authority.</p></CardHeader>
          <CardContent className="space-y-4">
            {activeBlocks.length === 0 ? <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No evidence blocks yet. Build the evidence index after adding an extractable source.</div> : <div className="max-h-[440px] space-y-2 overflow-y-auto pr-1">
              {activeBlocks.slice(0, 160).map((block) => <label key={block.id} className="flex cursor-pointer gap-3 rounded-lg border p-3 hover:bg-muted/30">
                <Checkbox checked={selectedBlocks.includes(block.id)} onCheckedChange={(checked) => toggleBlock(block.id, checked === true)} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className="font-medium text-foreground">{block.sourceTitle}</span><span>block {block.blockIndex + 1}</span><span>{block.charStart}-{block.charEnd}</span></div>
                  <p className="mt-1 text-sm leading-relaxed">{block.excerpt}</p>
                </div>
              </label>)}
              {activeBlocks.length > 160 && <p className="py-2 text-center text-xs text-muted-foreground">Showing first 160 of {activeBlocks.length} active blocks.</p>}
            </div>}

            <div className="space-y-3 rounded-lg border bg-muted/10 p-4">
              <div className="flex items-center justify-between"><div className="font-medium">Create atomic claim</div><Badge variant="outline">{selectedBlocks.length} evidence selected</Badge></div>
              <Textarea value={claimDraft.claimText} onChange={(event) => setClaimDraft((current) => ({ ...current, claimText: event.target.value }))} placeholder="One precise factual claim supported by the selected evidence…" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Confidence (optional, 0–1)</Label><Input value={claimDraft.confidence} onChange={(event) => setClaimDraft((current) => ({ ...current, confidence: event.target.value }))} placeholder="0.95" inputMode="decimal" /></div>
                <div className="space-y-1.5"><Label>Contradiction key (optional)</Label><Input value={claimDraft.contradictionKey} onChange={(event) => setClaimDraft((current) => ({ ...current, contradictionKey: event.target.value }))} placeholder="article-14-scope" /></div>
              </div>
              <Button onClick={() => void createClaim()} disabled={!canEdit || working || selectedBlocks.length === 0}><Plus className="mr-1.5 h-4 w-4" />Create candidate claim</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle>Claim review</CardTitle><p className="text-sm text-muted-foreground">Synthesis will use accepted claims only. Conflicts are explicit blockers, never silently resolved.</p></CardHeader>
          <CardContent className="space-y-3">
            {evidence.claims.length === 0 && <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No claims yet.</div>}
            {evidence.claims.map((claim) => <div key={claim.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2"><Badge className={claimStateClass(claim.state)}>{claim.state}</Badge>{claim.confidence != null && <span className="text-xs text-muted-foreground">confidence {claim.confidence.toFixed(3)}</span>}</div>
              <p className="mt-2 text-sm font-medium leading-relaxed">{claim.claimText}</p>
              <div className="mt-2 space-y-1">{claim.evidence.slice(0, 3).map((item) => <div key={`${claim.id}-${item.blockId}`} className="text-xs text-muted-foreground"><span className="font-medium text-foreground">{item.sourceTitle}:</span> {item.excerpt.slice(0, 180)}{item.excerpt.length > 180 ? '…' : ''}</div>)}</div>
              {canEdit && <div className="mt-3 flex flex-wrap gap-2">
                {claim.state === 'accepted'
                  ? <Button size="sm" disabled><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Accepted</Button>
                  : <Button size="sm" variant="outline" onClick={() => void setClaimState(claim, 'accepted')} disabled={working}><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Accept</Button>}
                <Button size="sm" variant="outline" onClick={() => void setClaimState(claim, 'candidate')} disabled={working}>Candidate</Button>
                <Button size="sm" variant="outline" onClick={() => void setClaimState(claim, 'rejected')} disabled={working}>Reject</Button>
                <Button size="sm" variant="outline" onClick={() => void setClaimState(claim, 'conflict')} disabled={working}><AlertTriangle className="mr-1.5 h-3.5 w-3.5" />Conflict</Button>
              </div>}
            </div>)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle>Syllabus coverage plan</CardTitle><p className="text-sm text-muted-foreground">Link accepted evidence, then explicitly confirm sufficiency. A linked claim is partial coverage until an editor confirms that it satisfies the target.</p></CardHeader>
        <CardContent className="space-y-4">
          {canEdit && <div className="grid gap-3 rounded-lg border bg-muted/10 p-4 lg:grid-cols-2 xl:grid-cols-5">
            <div className="space-y-1.5 xl:col-span-2"><Label>Coverage target</Label><Input value={coverageDraft.title} onChange={(event) => setCoverageDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Article 14 — equality before law" /></div>
            <div className="space-y-1.5"><Label>Priority</Label><Select value={coverageDraft.priority} onValueChange={(value) => setCoverageDraft((current) => ({ ...current, priority: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="required">Required</SelectItem><SelectItem value="high">High yield</SelectItem><SelectItem value="supporting">Supporting</SelectItem><SelectItem value="exclude">Exclude</SelectItem></SelectContent></Select></div>
            <div className="space-y-1.5"><Label>Depth</Label><Select value={coverageDraft.plannedDepth} onValueChange={(value) => setCoverageDraft((current) => ({ ...current, plannedDepth: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="brief">Brief</SelectItem><SelectItem value="standard">Standard</SelectItem><SelectItem value="deep">Deep</SelectItem></SelectContent></Select></div>
            <div className="flex items-end"><Button className="w-full" onClick={() => void createCoverageItem()} disabled={working}><Plus className="mr-1.5 h-4 w-4" />Add target</Button></div>
            <div className="space-y-1.5 xl:col-span-2"><Label>Syllabus / taxonomy reference</Label><Input value={coverageDraft.syllabusRef} onChange={(event) => setCoverageDraft((current) => ({ ...current, syllabusRef: event.target.value }))} placeholder="Polity → Fundamental Rights" /></div>
            <div className="space-y-1.5 xl:col-span-3"><Label>Exam rationale</Label><Input value={coverageDraft.examRationale} onChange={(event) => setCoverageDraft((current) => ({ ...current, examRationale: event.target.value }))} placeholder="Frequently tested distinction / PYQ emphasis / prerequisite…" /></div>
          </div>}

          {coverage.items.length === 0 && <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No coverage targets yet.</div>}
          <div className="grid gap-3 lg:grid-cols-2">{coverage.items.map((item) => {
            const hasAcceptedActiveSupport = item.claims.some((claim) => claim.state === 'accepted' && claim.hasActiveSupport);
            const staleReview = item.coverageReviewState === 'confirmed' && item.coverageReviewCurrent === false;
            return <div key={item.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div><div className="font-semibold">{item.title}</div>{item.syllabusRef && <div className="mt-1 text-xs text-muted-foreground">{item.syllabusRef}</div>}</div>
                <div className="flex flex-wrap gap-1.5"><Badge variant="outline">{item.priority}</Badge><Badge variant="outline">{item.plannedDepth}</Badge><Badge className={coverageClass(item.status)}>{item.status}</Badge>{staleReview && <Badge variant="secondary">review stale</Badge>}</div>
              </div>
              {item.examRationale && <p className="mt-2 text-sm text-muted-foreground">{item.examRationale}</p>}
              <div className="mt-3 space-y-1.5">{item.claims.map((claim) => <div key={claim.claimId} className="flex items-start justify-between gap-2 rounded-md bg-muted/30 px-2.5 py-2 text-xs"><span className="min-w-0 flex-1">{claim.claimText}</span>{canEdit && <button type="button" className="text-muted-foreground hover:text-destructive" onClick={() => void unlinkClaim(item.id, claim.claimId)} aria-label="Unlink claim"><Trash2 className="h-3.5 w-3.5" /></button>}</div>)}</div>
              {canEdit && <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Select value={linkClaimByItem[item.id] ?? ''} onValueChange={(value) => setLinkClaimByItem((current) => ({ ...current, [item.id]: value }))}><SelectTrigger className="flex-1"><SelectValue placeholder="Link evidence claim" /></SelectTrigger><SelectContent>{linkableClaims.filter((claim) => !item.claims.some((linked) => linked.claimId === claim.id)).map((claim) => <SelectItem key={claim.id} value={claim.id}>{claim.state}: {claim.claimText.slice(0, 80)}</SelectItem>)}</SelectContent></Select>
                <Button variant="outline" onClick={() => void linkClaim(item)} disabled={!linkClaimByItem[item.id] || working}><Link2 className="mr-1.5 h-3.5 w-3.5" />Link</Button>
                {item.status === 'covered'
                  ? <Button variant="outline" onClick={() => void reviewCoverage(item, false)} disabled={working}>Reopen</Button>
                  : <Button onClick={() => void reviewCoverage(item, true)} disabled={!hasAcceptedActiveSupport || item.status === 'blocked' || working}><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Confirm coverage</Button>}
                <Button variant="outline" size="icon" onClick={() => void deleteCoverageItem(item)} disabled={working} aria-label="Delete coverage target"><Trash2 className="h-4 w-4" /></Button>
              </div>}
              {!hasAcceptedActiveSupport && item.status !== 'blocked' && <p className="mt-2 text-xs text-muted-foreground">Link and accept supporting claims before coverage can be confirmed.</p>}
              {staleReview && <p className="mt-2 text-xs text-warning">The linked accepted evidence changed after the last confirmation. Review the target again.</p>}
            </div>;
          })}</div>
        </CardContent>
      </Card>
    </>}
  </div>;
}

export default NotesStudioEvidenceCoveragePage;