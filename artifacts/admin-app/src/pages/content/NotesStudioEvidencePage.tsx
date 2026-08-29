import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  CircleDashed,
  FileSearch,
  Link2,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

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
  brief: { topicLabel?: string; depth?: string; learnerLevel?: string; syllabusEmphasis?: string; examIds?: string[] };
  sourceCount: number;
  includedSourceCount: number;
  generatableSourceCount: number;
  updatedAt: string;
};

type EvidenceRun = {
  id: string;
  inputHash: string;
  extractorVersion: string;
  sourceCount: number;
  claimCount: number;
  supportCount: number;
  coverageTargetCount: number;
  coverageMappedCount: number;
  startedAt: string;
  finishedAt: string | null;
};

type CoverageTarget = {
  id: string;
  targetKey: string;
  label: string;
  sourceKind: string;
  required: boolean;
  position: number;
  mappedClaimCount: number;
  acceptedClaimCount: number;
  bestScore: number;
};

type EvidenceClaim = {
  id: string;
  normalizedKey: string;
  claimText: string;
  claimType: string;
  evidenceState: 'candidate' | 'accepted' | 'rejected';
  extractionMethod: string;
  confidence: number;
  reviewedAt: string | null;
  sourceCount: number;
  coverageLabels: string[];
};

type EvidenceSupport = {
  id: string;
  claimId: string;
  sourceId: string;
  sourceTitle: string;
  relation: string;
  excerpt: string;
  location: { paragraphIndex?: number; sentenceIndex?: number; charStart?: number; charEnd?: number };
};

type EvidencePayload = {
  job: { id: string; title: string; state: string; brief: Record<string, unknown> };
  latestRun: EvidenceRun | null;
  summary: {
    claimCount: number;
    acceptedCount: number;
    candidateCount: number;
    rejectedCount: number;
    targetCount: number;
    requiredCount: number;
    coveredRequiredCount: number;
    evidenceReady: boolean;
  };
  coverageTargets: CoverageTarget[];
  claims: EvidenceClaim[];
  supports: EvidenceSupport[];
  idempotent?: boolean;
};

const ALL = 'all';

function pretty(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function stateTone(state: EvidenceClaim['evidenceState']) {
  if (state === 'accepted') return 'border-success/30 bg-success/5 text-success';
  if (state === 'rejected') return 'border-destructive/30 bg-destructive/5 text-destructive';
  return 'border-warning/30 bg-warning/5 text-warning';
}

export function NotesStudioEvidencePage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<EvidencePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState(ALL);
  const [newTarget, setNewTarget] = useState('');
  const [mappingTargets, setMappingTargets] = useState<Record<string, string>>({});

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  const loadJobs = async () => {
    setLoading(true);
    try {
      const result = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
      const nextJobs = result.jobs ?? [];
      setJobs(nextJobs);
      setSelectedJobId((current) => current && nextJobs.some((job) => job.id === current) ? current : nextJobs[0]?.id ?? null);
    } catch (error) {
      showToast.error('Unable to load authoring jobs', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const loadEvidence = async (jobId: string) => {
    try {
      const result = await adminRequest<EvidencePayload>(`/admin/notes-studio/jobs/${jobId}/evidence`);
      setEvidence(result);
    } catch (error) {
      setEvidence(null);
      showToast.error('Unable to load evidence map', error instanceof Error ? error.message : 'Request failed.');
    }
  };

  useEffect(() => { void loadJobs(); }, []);
  useEffect(() => {
    setMappingTargets({});
    if (selectedJobId) void loadEvidence(selectedJobId);
    else setEvidence(null);
  }, [selectedJobId]);

  const supportsByClaim = useMemo(() => {
    const map = new Map<string, EvidenceSupport[]>();
    for (const support of evidence?.supports ?? []) {
      const list = map.get(support.claimId) ?? [];
      list.push(support);
      map.set(support.claimId, list);
    }
    return map;
  }, [evidence?.supports]);

  const filteredClaims = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (evidence?.claims ?? []).filter((claim) => {
      if (stateFilter !== ALL && claim.evidenceState !== stateFilter) return false;
      if (!term) return true;
      return [claim.claimText, claim.claimType, ...(claim.coverageLabels ?? [])].join(' ').toLowerCase().includes(term);
    });
  }, [evidence?.claims, search, stateFilter]);

  const extractEvidence = async () => {
    if (!selectedJobId) return;
    setWorking(true);
    try {
      const result = await adminRequest<EvidencePayload>(`/admin/notes-studio/jobs/${selectedJobId}/evidence/extract`, { method: 'POST' });
      setEvidence(result);
      await loadJobs();
      showToast.success(
        result.idempotent ? 'Evidence already current' : 'Evidence map extracted',
        result.idempotent ? 'The source pack and brief match the latest immutable evidence run.' : 'Candidate claims and coverage mappings were rebuilt from the current retained source pack.',
      );
    } catch (error) {
      showToast.error('Unable to extract evidence', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const reviewClaim = async (claim: EvidenceClaim, evidenceState: EvidenceClaim['evidenceState']) => {
    if (!selectedJobId) return;
    setWorking(true);
    try {
      const result = await adminRequest<EvidencePayload>(`/admin/notes-studio/jobs/${selectedJobId}/evidence/claims/${claim.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ evidenceState }),
      });
      setEvidence(result);
      await loadJobs();
    } catch (error) {
      showToast.error('Unable to review evidence claim', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const addCoverageTarget = async () => {
    if (!selectedJobId || newTarget.trim().length < 3) return;
    setWorking(true);
    try {
      const result = await adminRequest<EvidencePayload>(`/admin/notes-studio/jobs/${selectedJobId}/coverage-targets`, {
        method: 'POST',
        body: JSON.stringify({ label: newTarget.trim(), required: true }),
      });
      setEvidence(result);
      setNewTarget('');
      await loadJobs();
    } catch (error) {
      showToast.error('Unable to add coverage target', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const toggleRequired = async (target: CoverageTarget) => {
    if (!selectedJobId) return;
    setWorking(true);
    try {
      const result = await adminRequest<EvidencePayload>(`/admin/notes-studio/jobs/${selectedJobId}/coverage-targets/${target.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ required: !target.required }),
      });
      setEvidence(result);
      await loadJobs();
    } catch (error) {
      showToast.error('Unable to update coverage target', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const mapClaim = async (claim: EvidenceClaim) => {
    if (!selectedJobId) return;
    const targetId = mappingTargets[claim.id];
    if (!targetId) return;
    setWorking(true);
    try {
      const result = await adminRequest<EvidencePayload>(`/admin/notes-studio/jobs/${selectedJobId}/coverage-targets/${targetId}/claims/${claim.id}`, { method: 'POST' });
      setEvidence(result);
      setMappingTargets((current) => ({ ...current, [claim.id]: '' }));
      await loadJobs();
    } catch (error) {
      showToast.error('Unable to map claim to coverage', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Evidence & Coverage"
      description="Extract source-grounded candidate claims, inspect exact provenance, review evidence and block synthesis until required syllabus coverage has accepted support."
      icon={<FileSearch className="h-5 w-5" />}
      actions={<div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => void loadJobs()} disabled={loading || working}>
          <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
        </Button>
        {canEdit && <Button onClick={() => void extractEvidence()} disabled={working || !selectedJob || selectedJob.generatableSourceCount === 0}>
          {working ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <FileSearch className="mr-1.5 h-4 w-4" />}
          {evidence?.latestRun ? 'Re-extract evidence' : 'Extract evidence'}
        </Button>}
      </div>}
    />

    <Card>
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="space-y-1.5">
          <Label>Authoring job</Label>
          <Select value={selectedJobId ?? ''} onValueChange={setSelectedJobId}>
            <SelectTrigger><SelectValue placeholder="Choose authoring job" /></SelectTrigger>
            <SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title} · {job.generatableSourceCount} ready sources</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {selectedJob && <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <Badge variant="outline">{pretty(selectedJob.state)}</Badge>
          <Badge variant="outline">{selectedJob.generatableSourceCount} retained sources</Badge>
          <Badge variant="outline">{selectedJob.sourceLanguage.toUpperCase()}</Badge>
        </div>}
      </CardContent>
    </Card>

    {!selectedJob && <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Create an authoring job and attach retained sources before building evidence.</CardContent></Card>}

    {selectedJob && evidence && <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Claims</div><div className="mt-1 text-2xl font-bold">{evidence.summary.claimCount}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Accepted</div><div className="mt-1 text-2xl font-bold">{evidence.summary.acceptedCount}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Review queue</div><div className="mt-1 text-2xl font-bold">{evidence.summary.candidateCount}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Required coverage</div><div className="mt-1 text-2xl font-bold">{evidence.summary.coveredRequiredCount}/{evidence.summary.requiredCount}</div></CardContent></Card>
        <Card className={evidence.summary.evidenceReady ? 'border-success/30' : 'border-warning/30'}><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Evidence gate</div><div className={`mt-1 text-lg font-bold ${evidence.summary.evidenceReady ? 'text-success' : 'text-warning'}`}>{evidence.summary.evidenceReady ? 'Ready' : 'Blocked'}</div></CardContent></Card>
      </div>

      <Card className={evidence.summary.evidenceReady ? 'border-success/30' : 'border-warning/30'}>
        <CardContent className="flex items-start gap-3 p-4 text-sm">
          {evidence.summary.evidenceReady ? <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" /> : <CircleDashed className="mt-0.5 h-5 w-5 shrink-0 text-warning" />}
          <div><div className="font-medium">{evidence.summary.evidenceReady ? 'Evidence gate satisfied' : 'Synthesis remains locked'}</div><p className="mt-1 text-muted-foreground">{evidence.summary.evidenceReady ? 'Every required coverage target has at least one accepted source-grounded claim. NS-004 may consume accepted evidence only.' : 'Accept trustworthy candidate claims and close required coverage gaps. Single-source candidates are never auto-accepted in this checkpoint.'}</p></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center"><div><CardTitle className="text-base">Coverage matrix</CardTitle><p className="mt-1 text-xs text-muted-foreground">Seeded from the topic and syllabus emphasis; editors can add missing targets or mark a target optional.</p></div>{canEdit && <div className="flex w-full gap-2 lg:w-auto"><Input value={newTarget} onChange={(event) => setNewTarget(event.target.value)} placeholder="Add coverage target" className="lg:w-72" /><Button variant="outline" onClick={() => void addCoverageTarget()} disabled={working || newTarget.trim().length < 3}><Plus className="mr-1.5 h-4 w-4" />Add</Button></div>}</div></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {evidence.coverageTargets.length === 0 && <div className="col-span-full rounded-lg border border-dashed p-5 text-sm text-muted-foreground">No coverage targets yet. Re-extract evidence to seed the topic brief, or add a target manually.</div>}
          {evidence.coverageTargets.map((target) => {
            const covered = target.acceptedClaimCount > 0;
            return <div key={target.id} className={`rounded-lg border p-3 ${target.required && !covered ? 'border-warning/30 bg-warning/[0.03]' : ''}`}>
              <div className="flex items-start justify-between gap-2"><div className="font-medium">{target.label}</div>{covered ? <CheckCircle2 className="h-4 w-4 shrink-0 text-success" /> : <CircleDashed className="h-4 w-4 shrink-0 text-muted-foreground" />}</div>
              <div className="mt-2 flex flex-wrap gap-2"><Badge variant="outline">{target.sourceKind === 'syllabus_emphasis' ? 'Syllabus' : pretty(target.sourceKind)}</Badge><Badge variant="outline">{target.acceptedClaimCount} accepted</Badge><Badge variant="outline">{target.mappedClaimCount} mapped</Badge>{target.required ? <Badge variant="outline" className="border-warning/30 text-warning">Required</Badge> : <Badge variant="outline">Optional</Badge>}</div>
              {canEdit && <Button size="sm" variant="ghost" className="mt-2 h-7 px-2 text-xs" onClick={() => void toggleRequired(target)} disabled={working}>{target.required ? 'Make optional' : 'Make required'}</Button>}
            </div>;
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end"><div><CardTitle className="text-base">Evidence claims</CardTitle><p className="mt-1 text-xs text-muted-foreground">Automatic claims are source sentences with bounded excerpts and exact source links; they are not learner wording.</p></div><div className="grid gap-2 sm:grid-cols-[260px_170px]"><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search claims or coverage" /><Select value={stateFilter} onValueChange={setStateFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>All states</SelectItem><SelectItem value="candidate">Candidate</SelectItem><SelectItem value="accepted">Accepted</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select></div></div></CardHeader>
        <CardContent className="space-y-3">
          {!evidence.latestRun && <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No immutable evidence run exists yet. Extract evidence from the current retained source pack.</div>}
          {evidence.latestRun && <div className="rounded-lg border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">Run {evidence.latestRun.id.slice(0, 8)} · {evidence.latestRun.sourceCount} sources · {evidence.latestRun.supportCount} provenance links · extractor {evidence.latestRun.extractorVersion}</div>}
          {filteredClaims.slice(0, 250).map((claim) => {
            const supports = supportsByClaim.get(claim.id) ?? [];
            return <div key={claim.id} className="rounded-lg border p-4">
              <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><Badge variant="outline" className={stateTone(claim.evidenceState)}>{pretty(claim.evidenceState)}</Badge><Badge variant="outline">{pretty(claim.claimType)}</Badge><Badge variant="outline">{claim.sourceCount} source{claim.sourceCount === 1 ? '' : 's'}</Badge>{claim.sourceCount >= 2 && <Badge variant="outline" className="border-success/30 text-success">Corroborated text</Badge>}</div><p className="mt-2 text-sm leading-relaxed">{claim.claimText}</p>{claim.coverageLabels.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{claim.coverageLabels.map((label) => <Badge key={label} variant="secondary">{label}</Badge>)}</div>}</div>{canEdit && <div className="flex shrink-0 flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => void reviewClaim(claim, 'accepted')} disabled={working || claim.evidenceState === 'accepted'}><CheckCircle2 className="mr-1.5 h-4 w-4" />Accept</Button><Button size="sm" variant="outline" onClick={() => void reviewClaim(claim, 'rejected')} disabled={working || claim.evidenceState === 'rejected'}><XCircle className="mr-1.5 h-4 w-4" />Reject</Button>{claim.evidenceState !== 'candidate' && <Button size="sm" variant="ghost" onClick={() => void reviewClaim(claim, 'candidate')} disabled={working}>Reset</Button>}</div>}</div>

              {canEdit && evidence.coverageTargets.length > 0 && <div className="mt-3 flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center"><Select value={mappingTargets[claim.id] ?? ''} onValueChange={(value) => setMappingTargets((current) => ({ ...current, [claim.id]: value }))}><SelectTrigger className="sm:w-80"><SelectValue placeholder="Map to coverage target…" /></SelectTrigger><SelectContent>{evidence.coverageTargets.map((target) => <SelectItem key={target.id} value={target.id}>{target.label}</SelectItem>)}</SelectContent></Select><Button size="sm" variant="outline" onClick={() => void mapClaim(claim)} disabled={working || !mappingTargets[claim.id]}><Link2 className="mr-1.5 h-4 w-4" />Map</Button></div>}

              <details className="mt-3 border-t pt-3"><summary className="cursor-pointer text-xs font-medium text-muted-foreground">Show provenance ({supports.length})</summary><div className="mt-2 space-y-2">{supports.map((support) => <div key={support.id} className="rounded-md bg-muted/30 p-3 text-xs"><div className="font-medium">{support.sourceTitle}</div><p className="mt-1 whitespace-pre-wrap leading-relaxed text-muted-foreground">{support.excerpt}</p><div className="mt-1 text-[11px] text-muted-foreground">Paragraph {Number(support.location?.paragraphIndex ?? 0) + 1} · sentence {Number(support.location?.sentenceIndex ?? 0) + 1}</div></div>)}</div></details>
            </div>;
          })}
          {filteredClaims.length > 250 && <div className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground">Showing the first 250 of {filteredClaims.length} matching claims. Narrow the search or state filter to review more.</div>}
          {evidence.latestRun && filteredClaims.length === 0 && <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">No claims match the current filter.</div>}
        </CardContent>
      </Card>
    </>}
  </div>;
}

export default NotesStudioEvidencePage;
