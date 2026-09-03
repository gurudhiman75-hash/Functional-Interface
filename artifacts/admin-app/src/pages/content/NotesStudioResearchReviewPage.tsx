import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ExternalLink, Loader2, RefreshCw, Sparkles } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type PolicySource = {
  id: string;
  title: string;
  publisher: string;
  sourceUri: string;
  rightsBasis: string;
  retentionMode: string;
  inclusionState: string;
  generationReady: boolean;
  referenceEvidenceCount: number;
  referenceEvidenceReady: boolean;
  evidenceReady: boolean;
};

type PolicyStatus = {
  sources: PolicySource[];
  policy: { ready: boolean; name: string; missing: Array<{ label: string; currentCount: number; minCount: number }> };
};

type ClaimEvidence = { relation: 'supports' | 'contradicts'; inclusionState: 'included' | 'excluded' };
type EvidenceClaim = {
  id: string;
  claimText: string;
  state: 'candidate' | 'accepted' | 'rejected' | 'conflict';
  confidence: number | null;
  evidence: ClaimEvidence[];
};
type EvidenceResult = {
  blocks: Array<{ id: string; inclusionState: 'included' | 'excluded' }>;
  claims: EvidenceClaim[];
  summary: { activeBlockCount: number; candidateClaims: number; acceptedClaims: number; conflictClaims: number };
};

type CoverageResult = {
  summary: { itemCount: number; covered: number; partial: number; blocked: number; uncovered: number };
};

type BatchClaim = { id: string; text: string };
type BatchCoverageItem = { id: string; title: string; priority: string; plannedDepth: string };
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
};

type ReferenceDraft = { locator: string; note: string };

export function NotesStudioResearchReviewPage({ jobId, onJobProgressed }: { jobId: string; onJobProgressed?: () => void }) {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [policy, setPolicy] = useState<PolicyStatus | null>(null);
  const [evidence, setEvidence] = useState<EvidenceResult | null>(null);
  const [coverage, setCoverage] = useState<CoverageResult | null>(null);
  const [referenceDrafts, setReferenceDrafts] = useState<Record<string, ReferenceDraft>>({});
  const [referenceAttested, setReferenceAttested] = useState(false);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [coverageReview, setCoverageReview] = useState<BatchReviewResult | null>(null);
  const [selectedSufficientIds, setSelectedSufficientIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const candidateClaims = useMemo(() => (evidence?.claims ?? []).filter((claim) => claim.state === 'candidate'), [evidence]);
  const acceptedClaims = useMemo(() => (evidence?.claims ?? []).filter((claim) => claim.state === 'accepted'), [evidence]);
  const missingReferenceSources = useMemo(() => (policy?.sources ?? []).filter((source) =>
    source.inclusionState === 'included'
    && source.rightsBasis === 'reference_only'
    && source.retentionMode === 'metadata_only'
    && !source.referenceEvidenceReady
  ), [policy]);
  const coverageById = useMemo(() => new Map((coverageReview?.coverageItems ?? []).map((item) => [item.id, item])), [coverageReview]);
  const claimById = useMemo(() => new Map((coverageReview?.claims ?? []).map((claim) => [claim.id, claim])), [coverageReview]);
  const selectedCoverageReviews = useMemo(() => {
    const chosen = new Set(selectedSufficientIds);
    return (coverageReview?.reviews ?? []).filter((review) => review.assessment === 'sufficient' && chosen.has(review.coverageItemId));
  }, [coverageReview, selectedSufficientIds]);

  const load = async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const [policyResult, evidenceResult, coverageResult] = await Promise.all([
        adminRequest<PolicyStatus>(`/admin/notes-studio/jobs/${jobId}/source-policy`),
        adminRequest<EvidenceResult>(`/admin/notes-studio/jobs/${jobId}/evidence`),
        adminRequest<CoverageResult>(`/admin/notes-studio/jobs/${jobId}/coverage`),
      ]);
      setPolicy(policyResult);
      setEvidence(evidenceResult);
      setCoverage(coverageResult);
      setSelectedCandidateIds((current) => {
        const active = new Set(evidenceResult.claims.filter((claim) => claim.state === 'candidate').map((claim) => claim.id));
        const kept = current.filter((id) => active.has(id));
        return kept.length > 0 ? kept : [...active];
      });
    } catch (error) {
      showToast.error('Unable to load Research Review', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [jobId]);

  const updateReferenceDraft = (sourceId: string, patch: Partial<ReferenceDraft>) => {
    setReferenceDrafts((current) => ({
      ...current,
      [sourceId]: { ...(current[sourceId] ?? { locator: '', note: '' }), ...patch },
    }));
  };

  const saveReferenceNotes = async () => {
    if (!canEdit || !referenceAttested) return;
    const ready = missingReferenceSources.map((source) => ({ source, draft: referenceDrafts[source.id] }))
      .filter(({ draft }) => Boolean(draft && draft.locator.trim().length >= 2 && draft.note.trim().length >= 20));
    if (ready.length === 0) {
      showToast.warning('No complete evidence notes', 'Add an exact locator and factual paraphrase for at least one source.');
      return;
    }
    setWorking(true);
    try {
      for (const { source, draft } of ready) {
        if (!draft) continue;
        await adminRequest(`/admin/notes-studio/jobs/${jobId}/reference-evidence`, {
          method: 'POST',
          body: JSON.stringify({
            sourceId: source.id,
            locatorLabel: draft.locator.trim(),
            noteText: draft.note.trim(),
            paraphrasedByEditor: true,
          }),
        });
      }
      setReferenceDrafts({});
      setReferenceAttested(false);
      await load();
      showToast.success('Reference evidence saved', `${ready.length} reviewed source notes were recorded in one batch.`);
    } catch (error) {
      showToast.error('Unable to save reference evidence', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const prepareClaims = async () => {
    setWorking(true);
    try {
      const result = await adminRequest<{ created: number; duplicatesSkipped: number }>(`/admin/notes-studio/jobs/${jobId}/research-review/prepare-claims`, { method: 'POST' });
      await load();
      showToast.success('Candidate facts prepared', `${result.created} new candidates prepared; ${result.duplicatesSkipped} duplicates skipped.`);
    } catch (error) {
      showToast.error('Unable to prepare candidate facts', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const toggleCandidate = (claimId: string, checked: boolean) => {
    setSelectedCandidateIds((current) => checked ? [...new Set([...current, claimId])] : current.filter((id) => id !== claimId));
  };

  const acceptSelectedClaims = async () => {
    if (selectedCandidateIds.length === 0) {
      showToast.warning('No claims selected', 'Keep the supported candidate facts you want to approve selected.');
      return;
    }
    setWorking(true);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${jobId}/research-review/claims`, {
        method: 'PATCH',
        body: JSON.stringify({ decisions: selectedCandidateIds.map((claimId) => ({ claimId, state: 'accepted' })) }),
      });
      setSelectedCandidateIds([]);
      setCoverageReview(null);
      setSelectedSufficientIds([]);
      await load();
      onJobProgressed?.();
      showToast.success('Research facts approved', `${selectedCandidateIds.length} claims accepted in one editorial action.`);
    } catch (error) {
      showToast.error('Unable to approve research facts', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const reviewCoverage = async () => {
    setWorking(true);
    try {
      const result = await adminRequest<BatchReviewResult>(`/admin/notes-studio/jobs/${jobId}/coverage-proposals/batch-review/generate`, { method: 'POST' });
      setCoverageReview(result);
      setSelectedSufficientIds(result.reviews.filter((review) => review.assessment === 'sufficient').map((review) => review.coverageItemId));
      showToast.success('Coverage review ready', `${result.counts.sufficient} sufficient, ${result.counts.partial} partial, ${result.counts.missing} missing.`);
    } catch (error) {
      showToast.error('Unable to review syllabus coverage', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const approveCoverage = async () => {
    if (selectedCoverageReviews.length === 0) {
      showToast.warning('No sufficient coverage selected', 'Keep at least one clearly sufficient target selected.');
      return;
    }
    setWorking(true);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${jobId}/coverage-proposals/batch-review/apply`, {
        method: 'POST',
        body: JSON.stringify({ reviews: selectedCoverageReviews.map((review) => ({ coverageItemId: review.coverageItemId, claimIds: review.claimIds })) }),
      });
      await load();
      onJobProgressed?.();
      showToast.success('Research coverage approved', `${selectedCoverageReviews.length} sufficient targets confirmed. Remaining targets stay visible as research gaps.`);
    } catch (error) {
      showToast.error('Unable to approve research coverage', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  if (loading && !policy) return <Card><CardContent className="flex items-center gap-2 p-5 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading Research Review…</CardContent></Card>;

  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold">Research Review</h2>
        <p className="mt-1 text-sm text-muted-foreground">One checkpoint for evidence, factual claims and syllabus coverage. Nothing is accepted or published until you approve it.</p>
      </div>
      <Button variant="outline" onClick={() => void load()} disabled={working}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
    </div>

    <div className="grid gap-3 md:grid-cols-4">
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Source pack</div><div className="mt-1 font-semibold">{policy?.policy.ready ? 'Evidence-ready' : 'Needs evidence'}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Candidate facts</div><div className="mt-1 text-xl font-semibold">{candidateClaims.length}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Accepted facts</div><div className="mt-1 text-xl font-semibold">{acceptedClaims.length}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Coverage</div><div className="mt-1 font-semibold">{coverage ? `${coverage.summary.covered}/${coverage.summary.itemCount} confirmed` : '—'}</div></CardContent></Card>
    </div>

    {missingReferenceSources.length > 0 && <Card>
      <CardHeader><CardTitle>1. Add only the missing reference evidence</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Open each source, verify the fact, and write your own short factual paraphrase. Publisher wording is not retained.</p>
        {missingReferenceSources.map((source) => {
          const draft = referenceDrafts[source.id] ?? { locator: '', note: '' };
          return <div key={source.id} className="space-y-3 rounded-lg border p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div><div className="font-medium">{source.title}</div><div className="text-xs text-muted-foreground">{source.publisher || 'Publisher not recorded'}</div></div>
              {source.sourceUri.startsWith('https://') && <a className="inline-flex items-center gap-1 text-xs underline" href={source.sourceUri} target="_blank" rel="noreferrer">Open source <ExternalLink className="h-3 w-3" /></a>}
            </div>
            <Input value={draft.locator} onChange={(event) => updateReferenceDraft(source.id, { locator: event.target.value })} placeholder="Exact section / paragraph locator" maxLength={300} />
            <Textarea value={draft.note} onChange={(event) => updateReferenceDraft(source.id, { note: event.target.value })} placeholder="Factual paraphrase in your own words" maxLength={800} className="min-h-[90px]" />
          </div>;
        })}
        <label className="flex items-start gap-2 rounded-lg border p-3 text-sm">
          <Checkbox checked={referenceAttested} onCheckedChange={(value) => setReferenceAttested(value === true)} />
          <span>I reviewed the cited source/locator for every completed note above and wrote the factual paraphrases independently.</span>
        </label>
        <Button onClick={() => void saveReferenceNotes()} disabled={!canEdit || !referenceAttested || working}>Save completed evidence notes</Button>
      </CardContent>
    </Card>}

    <Card>
      <CardHeader><CardTitle>{missingReferenceSources.length > 0 ? '2' : '1'}. Prepare and approve factual claims</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={policy?.policy.ready ? 'default' : 'secondary'}>{policy?.policy.ready ? 'Source policy ready' : 'Source policy incomplete'}</Badge>
          <Badge variant="outline">{evidence?.summary.activeBlockCount ?? 0} evidence blocks</Badge>
          <Badge variant="outline">{acceptedClaims.length} accepted</Badge>
        </div>
        {!policy?.policy.ready && <div className="rounded-lg border p-3 text-sm text-muted-foreground">Complete the missing evidence above before preparing claims. The model never bypasses the source-policy gate.</div>}
        <Button onClick={() => void prepareClaims()} disabled={!canEdit || !policy?.policy.ready || working}>
          {working ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}Prepare candidate facts
        </Button>

        {candidateClaims.length > 0 && <div className="space-y-2">
          <div className="flex items-center justify-between gap-3"><div className="font-medium">Review candidate facts</div><div className="text-xs text-muted-foreground">{selectedCandidateIds.length}/{candidateClaims.length} selected</div></div>
          {candidateClaims.map((claim) => <label key={claim.id} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
            <Checkbox className="mt-1" checked={selectedCandidateIds.includes(claim.id)} onCheckedChange={(value) => toggleCandidate(claim.id, value === true)} />
            <div className="min-w-0 flex-1"><div className="text-sm font-medium leading-6">{claim.claimText}</div><div className="mt-1 text-xs text-muted-foreground">Model confidence {claim.confidence == null ? '—' : Math.round(claim.confidence * 100) + '%'} · evidence-grounded candidate</div></div>
          </label>)}
          <Button onClick={() => void acceptSelectedClaims()} disabled={!canEdit || selectedCandidateIds.length === 0 || working}><CheckCircle2 className="mr-2 h-4 w-4" />Accept selected facts</Button>
          <p className="text-xs text-muted-foreground">Unselected candidates remain unaccepted; Guided Mode does not silently reject or accept them.</p>
        </div>}
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>{missingReferenceSources.length > 0 ? '3' : '2'}. Review syllabus coverage</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">The coverage model sees accepted claim text plus the coverage plan. It classifies every target as sufficient, partial or missing; you approve the sufficient set once.</p>
        <Button onClick={() => void reviewCoverage()} disabled={!canEdit || acceptedClaims.length === 0 || working}>
          {working ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}Review all coverage
        </Button>

        {coverageReview && <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Sufficient</div><div className="text-xl font-semibold">{coverageReview.counts.sufficient}</div></div>
            <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Partial</div><div className="text-xl font-semibold">{coverageReview.counts.partial}</div></div>
            <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Missing</div><div className="text-xl font-semibold">{coverageReview.counts.missing}</div></div>
          </div>
          {coverageReview.reviews.map((review) => {
            const item = coverageById.get(review.coverageItemId);
            const sufficient = review.assessment === 'sufficient';
            const selected = selectedSufficientIds.includes(review.coverageItemId);
            return <div key={review.coverageItemId} className="rounded-lg border p-3">
              <div className="flex items-start gap-3">
                {sufficient && <Checkbox className="mt-1" checked={selected} onCheckedChange={(value) => setSelectedSufficientIds((current) => value === true ? [...new Set([...current, review.coverageItemId])] : current.filter((id) => id !== review.coverageItemId))} />}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{item?.title ?? review.coverageItemId}</span><Badge variant={sufficient ? 'default' : review.assessment === 'partial' ? 'secondary' : 'outline'}>{review.assessment}</Badge></div>
                  <p className="mt-1 text-sm text-muted-foreground">{review.rationale}</p>
                  {review.claimIds.length > 0 && <div className="mt-2 space-y-1 text-xs">{review.claimIds.map((id) => <div key={id}>• {claimById.get(id)?.text ?? id}</div>)}</div>}
                </div>
              </div>
            </div>;
          })}
          <Button onClick={() => void approveCoverage()} disabled={!canEdit || selectedCoverageReviews.length === 0 || working}><CheckCircle2 className="mr-2 h-4 w-4" />Approve sufficient coverage</Button>
          {(coverageReview.counts.partial > 0 || coverageReview.counts.missing > 0) && <div className="rounded-lg border p-3 text-sm text-muted-foreground">Partial and missing targets remain research gaps. They are not promoted into the draft.</div>}
        </div>}
      </CardContent>
    </Card>
  </div>;
}

export default NotesStudioResearchReviewPage;
