import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Languages, Loader2, LockKeyhole, PackageCheck, Send, ShieldCheck, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type Job = { id: string; title: string; state: string; sourceLanguage: string };
type Section = { id: string; title: string; markdown: string; state: string; sortOrder: number };
type SectionsResult = { sections: Section[] };
type ApprovedVersion = {
  id: string;
  versionNumber: number;
  sourceLanguage: string;
  learnerTitle: string;
  learnerSummary: string;
  contentHash: string;
  resourceId: string | null;
  publicCode: string | null;
  resourceStatus: string | null;
};
type Localization = {
  id: string;
  languageCode: 'hi' | 'pa';
  state: 'needs_editorial' | 'ready' | 'materialized';
  title: string;
  summary: string;
  bodyMarkdown: string;
  quality?: { ready?: boolean; shared?: { score?: number; errorCount?: number; warningCount?: number } };
  materializedResourceId: string | null;
  publicCode: string | null;
  resourceStatus: string | null;
};
type ApprovalWorkspace = {
  job: Job;
  approval: { eligible: boolean; sectionCount: number; qaPassedCount: number; activeConflictCount: number };
  approvedVersion: ApprovedVersion | null;
  localizations: Localization[];
  publicationBoundary: { materializationCreatesDraftOnly: boolean; automaticPublicationEnabled: boolean };
};
type ReleaseVariant = {
  key: 'source' | 'hi' | 'pa';
  languageCode: string;
  localizationState: string | null;
  materialized: boolean;
  resourceId: string | null;
  publicCode: string | null;
  resourceStatus: string | null;
  title: string;
  summary: string;
  bodyMarkdown: string;
  integrityMatchesFrozenVersion: boolean;
  handoffId: string | null;
  readyForHandoff: boolean;
};
type ReleaseWorkspace = {
  version: { id: string; jobId: string; versionNumber: number; learnerTitle: string; learnerSummary: string; contentHash: string };
  variants: ReleaseVariant[];
  publicationBoundary: { handoffPublishesResource: boolean; automaticPublicationEnabled: boolean; publishSurface: string };
};

const languageLabel: Record<'hi' | 'pa', string> = { hi: 'Hindi', pa: 'Punjabi' };

function pretty(value: string | null | undefined) {
  if (!value) return '—';
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function LearnerPreview({ body }: { body: string }) {
  if (!body.trim()) return <div className="text-sm text-muted-foreground">No learner copy is available yet.</div>;
  return <div className="max-h-[520px] overflow-auto rounded-lg border bg-background p-4 text-sm leading-6">
    {body.split('\n').map((line, index) => {
      const value = line.trim();
      if (!value) return <div key={index} className="h-2" />;
      if (value.startsWith('### ')) return <h4 key={index} className="mt-3 font-semibold">{value.slice(4)}</h4>;
      if (value.startsWith('## ')) return <h3 key={index} className="mt-4 text-base font-semibold">{value.slice(3)}</h3>;
      if (value.startsWith('# ')) return <h2 key={index} className="mt-4 text-lg font-semibold">{value.slice(2)}</h2>;
      if (/^[-*]\s+/.test(value)) return <div key={index} className="pl-3">• {value.replace(/^[-*]\s+/, '')}</div>;
      return <p key={index}>{line}</p>;
    })}
  </div>;
}

export function NotesStudioFinalReviewPage({
  jobId,
  onJobProgressed,
  onOpenAdvanced,
}: {
  jobId: string;
  onJobProgressed?: () => void;
  onOpenAdvanced?: (tab: string) => void;
}) {
  const { hasPermission } = useAdminPermissions();
  const canPublish = hasPermission('content.questions.publish');
  const [approval, setApproval] = useState<ApprovalWorkspace | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [release, setRelease] = useState<ReleaseWorkspace | null>(null);
  const [learnerTitle, setLearnerTitle] = useState('');
  const [learnerSummary, setLearnerSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [workingKey, setWorkingKey] = useState('');

  const sourceVariant = release?.variants.find((variant) => variant.key === 'source') ?? null;
  const readyForRelease = useMemo(
    () => (release?.variants ?? []).filter((variant) => variant.readyForHandoff && !variant.handoffId),
    [release],
  );
  const handedOff = useMemo(() => (release?.variants ?? []).filter((variant) => Boolean(variant.handoffId)), [release]);
  const localizationExceptions = (approval?.localizations ?? []).filter((item) => item.state === 'needs_editorial');

  const applyApproval = (next: ApprovalWorkspace) => {
    setApproval(next);
    setLearnerTitle((current) => current || next.approvedVersion?.learnerTitle || next.job.title);
    setLearnerSummary((current) => current || next.approvedVersion?.learnerSummary || `Exam-focused revision notes on ${next.job.title}.`);
  };

  const loadRelease = async (versionId: string) => {
    const next = await adminRequest<ReleaseWorkspace>(`/admin/notes-studio/approved-versions/${versionId}/release`);
    setRelease(next);
    return next;
  };

  const load = async () => {
    setLoading(true);
    try {
      const [approvalResult, sectionResult] = await Promise.all([
        adminRequest<ApprovalWorkspace>(`/admin/notes-studio/jobs/${jobId}/approval`),
        adminRequest<SectionsResult>(`/admin/notes-studio/jobs/${jobId}/sections`),
      ]);
      applyApproval(approvalResult);
      setSections(sectionResult.sections ?? []);
      if (approvalResult.approvedVersion?.id) await loadRelease(approvalResult.approvedVersion.id);
      else setRelease(null);
    } catch (error) {
      showToast.error('Unable to load Final Review', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [jobId]);

  const prepareReleaseDrafts = async (start: ApprovalWorkspace) => {
    let next = start;
    const versionId = next.approvedVersion?.id;
    if (!versionId) return next;

    if (!next.approvedVersion?.resourceId) {
      next = await adminRequest<ApprovalWorkspace>(`/admin/notes-studio/jobs/${jobId}/materialize`, { method: 'POST' });
      applyApproval(next);
      onJobProgressed?.();
    }

    for (const languageCode of ['hi', 'pa'] as const) {
      let localization = next.localizations.find((item) => item.languageCode === languageCode);
      if (!localization) {
        next = await adminRequest<ApprovalWorkspace>(
          `/admin/notes-studio/approved-versions/${versionId}/localizations/${languageCode}/generate`,
          { method: 'POST' },
        );
        applyApproval(next);
        localization = next.localizations.find((item) => item.languageCode === languageCode);
      }
      if (localization?.state === 'ready' && !localization.materializedResourceId) {
        next = await adminRequest<ApprovalWorkspace>(
          `/admin/notes-studio/approved-versions/${versionId}/localizations/${languageCode}/materialize`,
          { method: 'POST' },
        );
        applyApproval(next);
      }
    }

    await loadRelease(versionId);
    return next;
  };

  const approve = async () => {
    if (!approval || !jobId) return;
    setWorkingKey('approve');
    try {
      const approved = await adminRequest<ApprovalWorkspace>(`/admin/notes-studio/jobs/${jobId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ learnerTitle, learnerSummary }),
      });
      applyApproval(approved);
      onJobProgressed?.();
      try {
        await prepareReleaseDrafts(approved);
        showToast.success('Approved and release drafts prepared', 'The approved source version is frozen and canonical learner drafts were prepared. Nothing was published.');
      } catch (prepError) {
        showToast.warning('Approved; release preparation needs attention', prepError instanceof Error ? prepError.message : 'The approved version is safe, but some learner drafts could not be prepared.');
        await load();
      }
    } catch (error) {
      showToast.error('Unable to approve note', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey('');
    }
  };

  const retryPreparation = async () => {
    if (!approval?.approvedVersion) return;
    setWorkingKey('prepare');
    try {
      await prepareReleaseDrafts(approval);
      showToast.success('Release drafts prepared', 'Ready variants are canonical drafts only. Nothing was published.');
    } catch (error) {
      showToast.error('Unable to prepare every release draft', error instanceof Error ? error.message : 'Request failed.');
      await load();
    } finally {
      setWorkingKey('');
    }
  };

  const releaseReady = async () => {
    const versionId = approval?.approvedVersion?.id;
    if (!versionId || readyForRelease.length === 0) return;
    setWorkingKey('release');
    try {
      let next = release;
      for (const variant of readyForRelease) {
        next = await adminRequest<ReleaseWorkspace>(
          `/admin/notes-studio/approved-versions/${versionId}/handoff/${variant.key}`,
          { method: 'POST' },
        );
      }
      if (next) setRelease(next);
      showToast.success('Released to publishing workflow', `${readyForRelease.length} frozen learner draft(s) were handed off. No learner resource was published automatically.`);
    } catch (error) {
      showToast.error('Unable to release learner drafts', error instanceof Error ? error.message : 'Request failed.');
      await loadRelease(versionId);
    } finally {
      setWorkingKey('');
    }
  };

  if (loading && !approval) return <Card><CardContent className="p-8 text-sm text-muted-foreground">Loading Final Review…</CardContent></Card>;
  if (!approval) return null;

  const previewBody = approval.approvedVersion
    ? sourceVariant?.bodyMarkdown ?? sections.map((section) => `## ${section.title}\n\n${section.markdown}`).join('\n\n')
    : sections.map((section) => `## ${section.title}\n\n${section.markdown}`).join('\n\n');

  return <div className="space-y-4">
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Final Review</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Review the complete learner note, approve the immutable version, then explicitly release verified drafts to the publishing workflow.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{pretty(approval.job.state)}</Badge>
            {approval.approval.eligible && !approval.approvedVersion && <Badge><ShieldCheck className="mr-1 h-3.5 w-3.5" />Approval ready</Badge>}
            {approval.approvedVersion && <Badge><LockKeyhole className="mr-1 h-3.5 w-3.5" />Frozen v{approval.approvedVersion.versionNumber}</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Sections</div><div className="mt-1 text-xl font-bold">{approval.approval.sectionCount}</div></div>
          <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">QA passed</div><div className="mt-1 text-xl font-bold">{approval.approval.qaPassedCount}</div></div>
          <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Active conflicts</div><div className="mt-1 text-xl font-bold">{approval.approval.activeConflictCount}</div></div>
        </div>

        {!approval.approvedVersion && <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-1.5"><Label>Learner title</Label><Input value={learnerTitle} onChange={(event) => setLearnerTitle(event.target.value)} disabled={!canPublish || Boolean(workingKey)} /></div>
          <div className="space-y-1.5"><Label>Learner summary</Label><Textarea rows={2} value={learnerSummary} onChange={(event) => setLearnerSummary(event.target.value)} disabled={!canPublish || Boolean(workingKey)} /></div>
        </div>}

        <LearnerPreview body={previewBody} />

        {!approval.approvedVersion && <div className="flex flex-col gap-3 rounded-lg border border-dashed p-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">Approval freezes the exact QA-passed note. After approval, Guided Mode may prepare canonical source/Hindi/Punjabi drafts, but it still cannot publish them.</div>
          {canPublish && <Button onClick={() => void approve()} disabled={!approval.approval.eligible || learnerTitle.trim().length < 3 || !learnerSummary.trim() || Boolean(workingKey)}>
            {workingKey === 'approve' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />}Approve & freeze
          </Button>}
        </div>}
      </CardContent>
    </Card>

    {approval.approvedVersion && <Card>
      <CardHeader><CardTitle className="text-base">Release preparation</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Source draft</div><div className="mt-1 font-semibold">{approval.approvedVersion.resourceId ? `Ready · ${approval.approvedVersion.publicCode ?? 'canonical'}` : 'Not prepared'}</div></div>
          {(['hi', 'pa'] as const).map((code) => {
            const item = approval.localizations.find((localization) => localization.languageCode === code);
            return <div key={code} className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-2"><div className="text-xs text-muted-foreground">{languageLabel[code]}</div><Languages className="h-3.5 w-3.5 text-muted-foreground" /></div>
              <div className="mt-1 font-semibold">{item ? pretty(item.state) : 'Not prepared'}</div>
              {item?.quality?.shared && <div className="mt-1 text-xs text-muted-foreground">score {item.quality.shared.score ?? '—'} · errors {item.quality.shared.errorCount ?? '—'}</div>}
            </div>;
          })}
        </div>

        {localizationExceptions.length > 0 && <div className="flex flex-col gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 md:flex-row md:items-center md:justify-between">
          <div><strong>Localization needs editorial repair.</strong> {localizationExceptions.map((item) => languageLabel[item.languageCode]).join(' and ')} did not clear the parity gate, so those variants were not materialized or released.</div>
          {onOpenAdvanced && <Button variant="outline" onClick={() => onOpenAdvanced('approval')}>Open localization editor</Button>}
        </div>}

        {(!approval.approvedVersion.resourceId || approval.localizations.some((item) => item.state === 'ready' && !item.materializedResourceId) || approval.localizations.length < 2) && canPublish && <Button variant="outline" onClick={() => void retryPreparation()} disabled={Boolean(workingKey)}>
          {workingKey === 'prepare' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PackageCheck className="mr-2 h-4 w-4" />}Prepare missing release drafts
        </Button>}

        <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground"><strong className="text-foreground">Boundary:</strong> canonical materialization creates draft learner resources only. Automatic publication is disabled.</div>
      </CardContent>
    </Card>}

    {release && <Card>
      <CardHeader><CardTitle className="text-base">Explicit release</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {release.variants.map((variant) => <div key={variant.key} className="rounded-lg border p-3">
            <div className="flex items-start justify-between gap-2"><div><div className="font-semibold">{variant.key === 'source' ? 'Source language' : languageLabel[variant.key]}</div><div className="mt-0.5 text-xs text-muted-foreground">{variant.publicCode ?? pretty(variant.localizationState)}</div></div>{variant.integrityMatchesFrozenVersion ? <ShieldCheck className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4 text-destructive" />}</div>
            <div className="mt-2 flex flex-wrap gap-1.5">{variant.materialized && <Badge variant="outline">canonical draft</Badge>}{variant.readyForHandoff && !variant.handoffId && <Badge variant="secondary">ready to release</Badge>}{variant.handoffId && <Badge><CheckCircle2 className="mr-1 h-3 w-3" />released</Badge>}</div>
          </div>)}
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-dashed p-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">Release records a frozen handoff to Learning Resources. It does <strong className="text-foreground">not</strong> publish any learner resource.</div>
          {canPublish && <Button onClick={() => void releaseReady()} disabled={readyForRelease.length === 0 || Boolean(workingKey)}>
            {workingKey === 'release' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Release ready drafts ({readyForRelease.length})
          </Button>}
        </div>

        {handedOff.length > 0 && <div className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm"><strong>{handedOff.length} learner draft(s) released to the publishing workflow.</strong> Final publication remains a separate Learning Resources action.</div>
          <Button asChild variant="outline"><Link to="/content/learning-resources">Open Learning Resources</Link></Button>
        </div>}
      </CardContent>
    </Card>}

    {approval.approvedVersion && !sourceVariant?.materialized && <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">The frozen source version is safe. Prepare its canonical draft before release.</div>}
  </div>;
}

export default NotesStudioFinalReviewPage;
