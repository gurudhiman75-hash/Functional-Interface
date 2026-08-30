import { useEffect, useState } from 'react';
import { CheckCircle2, Languages, Loader2, LockKeyhole, PackageCheck, RefreshCw } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type Job = { id: string; title: string; state: string; sourceLanguage: string };
type ApprovedVersion = {
  id: string;
  versionNumber: number;
  sourceLanguage: string;
  learnerTitle: string;
  learnerSummary: string;
  contentHash: string;
  approvalFingerprint: string;
  approvedAt: string;
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
  sourceContentHash: string;
  contentHash: string;
  quality: {
    ready?: boolean;
    expectedScriptPresent?: boolean;
    headingCountMatches?: boolean;
    missingUrls?: string[];
    shared?: { score?: number; errorCount?: number; warningCount?: number };
  };
  materializedResourceId: string | null;
  publicCode: string | null;
  resourceStatus: string | null;
};
type Workspace = {
  job: Job;
  approval: { eligible: boolean; sectionCount: number; qaPassedCount: number; activeConflictCount: number };
  approvedVersion: ApprovedVersion | null;
  localizations: Localization[];
  publicationBoundary: { materializationCreatesDraftOnly: boolean; automaticPublicationEnabled: boolean; localizationLanguages: string[] };
};
type LocalDraft = { title: string; summary: string; bodyMarkdown: string };

const languageLabels = { hi: 'Hindi', pa: 'Punjabi' } as const;

function pretty(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function NotesStudioApprovalLocalizationPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const canPublish = hasPermission('content.questions.publish');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [learnerTitle, setLearnerTitle] = useState('');
  const [learnerSummary, setLearnerSummary] = useState('');
  const [drafts, setDrafts] = useState<Record<'hi' | 'pa', LocalDraft>>({
    hi: { title: '', summary: '', bodyMarkdown: '' },
    pa: { title: '', summary: '', bodyMarkdown: '' },
  });
  const [loading, setLoading] = useState(true);
  const [workingKey, setWorkingKey] = useState('');

  const loadJobs = async () => {
    const response = await adminRequest<{ jobs: Job[] }>('/admin/notes-studio/jobs');
    const next = response.jobs ?? [];
    setJobs(next);
    setSelectedJobId((current) => current && next.some((job) => job.id === current) ? current : next[0]?.id ?? '');
  };

  const applyWorkspace = (next: Workspace) => {
    setWorkspace(next);
    setLearnerTitle(next.approvedVersion?.learnerTitle ?? next.job.title);
    setLearnerSummary(next.approvedVersion?.learnerSummary ?? '');
    setDrafts((current) => {
      const copy = { ...current };
      for (const code of ['hi', 'pa'] as const) {
        const localized = next.localizations.find((item) => item.languageCode === code);
        copy[code] = localized
          ? { title: localized.title, summary: localized.summary, bodyMarkdown: localized.bodyMarkdown }
          : { title: '', summary: '', bodyMarkdown: '' };
      }
      return copy;
    });
  };

  const loadWorkspace = async (jobId: string) => {
    if (!jobId) {
      setWorkspace(null);
      return;
    }
    applyWorkspace(await adminRequest<Workspace>(`/admin/notes-studio/jobs/${jobId}/approval`));
  };

  useEffect(() => {
    void loadJobs()
      .catch((error) => showToast.error('Unable to load Notes Studio jobs', error instanceof Error ? error.message : 'Request failed.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;
    setLoading(true);
    void loadWorkspace(selectedJobId)
      .catch((error) => showToast.error('Unable to load approval workspace', error instanceof Error ? error.message : 'Request failed.'))
      .finally(() => setLoading(false));
  }, [selectedJobId]);

  const refresh = async () => {
    setLoading(true);
    try {
      await loadJobs();
      if (selectedJobId) await loadWorkspace(selectedJobId);
    } catch (error) {
      showToast.error('Unable to refresh approval workspace', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const approve = async () => {
    if (!selectedJobId) return;
    setWorkingKey('approve');
    try {
      const next = await adminRequest<Workspace>(`/admin/notes-studio/jobs/${selectedJobId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ learnerTitle, learnerSummary }),
      });
      applyWorkspace(next);
      await loadJobs();
      showToast.success('Version approved', 'The source-language learner note is now frozen as an immutable approved version.');
    } catch (error) {
      showToast.error('Unable to approve note', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey('');
    }
  };

  const materializeSource = async () => {
    if (!selectedJobId) return;
    setWorkingKey('materialize-source');
    try {
      const next = await adminRequest<Workspace>(`/admin/notes-studio/jobs/${selectedJobId}/materialize`, { method: 'POST' });
      applyWorkspace(next);
      await loadJobs();
      showToast.success('Canonical draft created', 'The approved note was materialized as a draft learning resource; it was not published.');
    } catch (error) {
      showToast.error('Unable to materialize note', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey('');
    }
  };

  const generateLocalization = async (languageCode: 'hi' | 'pa') => {
    const versionId = workspace?.approvedVersion?.id;
    if (!versionId) return;
    setWorkingKey(`generate-${languageCode}`);
    try {
      const next = await adminRequest<Workspace>(`/admin/notes-studio/approved-versions/${versionId}/localizations/${languageCode}/generate`, { method: 'POST' });
      applyWorkspace(next);
      showToast.success(`${languageLabels[languageCode]} localization generated`, 'Parity gates were applied against the immutable approved source version.');
    } catch (error) {
      showToast.error('Unable to generate localization', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey('');
    }
  };

  const saveManualLocalization = async (languageCode: 'hi' | 'pa') => {
    const versionId = workspace?.approvedVersion?.id;
    if (!versionId) return;
    setWorkingKey(`save-${languageCode}`);
    try {
      const next = await adminRequest<Workspace>(`/admin/notes-studio/approved-versions/${versionId}/localizations/${languageCode}/manual`, {
        method: 'POST',
        body: JSON.stringify(drafts[languageCode]),
      });
      applyWorkspace(next);
      showToast.success(`${languageLabels[languageCode]} localization checked`, 'Manual content was saved with deterministic parity checks.');
    } catch (error) {
      showToast.error('Unable to save localization', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey('');
    }
  };

  const materializeLocalization = async (languageCode: 'hi' | 'pa') => {
    const versionId = workspace?.approvedVersion?.id;
    if (!versionId) return;
    setWorkingKey(`materialize-${languageCode}`);
    try {
      const next = await adminRequest<Workspace>(`/admin/notes-studio/approved-versions/${versionId}/localizations/${languageCode}/materialize`, { method: 'POST' });
      applyWorkspace(next);
      showToast.success(`${languageLabels[languageCode]} draft created`, 'The localization was materialized as a canonical draft and remains unpublished.');
    } catch (error) {
      showToast.error('Unable to materialize localization', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey('');
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Approval & Localization"
      description="Freeze QA-passed source-language notes, materialize canonical drafts, then create version-bound Hindi and Punjabi learner variants. Nothing here auto-publishes."
      icon={<LockKeyhole className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void refresh()} disabled={loading || Boolean(workingKey)}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>}
    />

    <Card>
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(280px,440px)_1fr] lg:items-end">
        <div className="space-y-1.5"><Label>Authoring job</Label><Select value={selectedJobId} onValueChange={setSelectedJobId}><SelectTrigger><SelectValue placeholder="Choose an authoring job" /></SelectTrigger><SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>)}</SelectContent></Select></div>
        <div className="flex flex-wrap gap-2">{workspace && <Badge variant="outline">{pretty(workspace.job.state)}</Badge>}{workspace?.approval.eligible && <Badge><CheckCircle2 className="mr-1 h-3.5 w-3.5" />Approval eligible</Badge>}{workspace?.approvedVersion && <Badge variant="outline">Frozen v{workspace.approvedVersion.versionNumber}</Badge>}</div>
      </CardContent>
    </Card>

    {workspace && !workspace.approvedVersion && <Card>
      <CardHeader><CardTitle className="text-base">Editorial approval</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Sections</div><div className="mt-1 text-xl font-bold">{workspace.approval.sectionCount}</div></div><div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">QA passed</div><div className="mt-1 text-xl font-bold">{workspace.approval.qaPassedCount}</div></div><div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Active conflicts</div><div className="mt-1 text-xl font-bold">{workspace.approval.activeConflictCount}</div></div></div>
        <div className="space-y-1.5"><Label>Learner-facing title</Label><Input value={learnerTitle} onChange={(event) => setLearnerTitle(event.target.value)} disabled={!canPublish} /></div>
        <div className="space-y-1.5"><Label>Learner summary</Label><Textarea value={learnerSummary} onChange={(event) => setLearnerSummary(event.target.value)} rows={3} disabled={!canPublish} /></div>
        <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed p-4"><div className="text-sm text-muted-foreground">Approval freezes the exact section outputs, QA-run IDs, evidence fingerprints, brief and exam targets. Later mutations require a new authoring job/version.</div>{canPublish && <Button onClick={() => void approve()} disabled={!workspace.approval.eligible || learnerTitle.trim().length < 3 || !learnerSummary.trim() || Boolean(workingKey)}>{workingKey === 'approve' ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-1.5 h-4 w-4" />}Approve & freeze</Button>}</div>
      </CardContent>
    </Card>}

    {workspace?.approvedVersion && <Card>
      <CardHeader><CardTitle className="text-base">Immutable source-language version</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Version</div><div className="mt-1 font-semibold">v{workspace.approvedVersion.versionNumber}</div></div><div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Language</div><div className="mt-1 font-semibold">{workspace.approvedVersion.sourceLanguage}</div></div><div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Content hash</div><div className="mt-1 font-mono text-xs">{workspace.approvedVersion.contentHash.slice(0, 18)}…</div></div><div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Canonical resource</div><div className="mt-1 font-semibold">{workspace.approvedVersion.publicCode ?? 'Not materialized'}</div></div></div>
        <div><div className="font-semibold">{workspace.approvedVersion.learnerTitle}</div><div className="mt-1 text-sm text-muted-foreground">{workspace.approvedVersion.learnerSummary}</div></div>
        {!workspace.approvedVersion.resourceId && canPublish && <Button onClick={() => void materializeSource()} disabled={Boolean(workingKey)}>{workingKey === 'materialize-source' ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <PackageCheck className="mr-1.5 h-4 w-4" />}Create canonical draft</Button>}
        {workspace.approvedVersion.resourceId && <div className="rounded-lg border border-emerald-200 p-3 text-sm"><strong>Canonical draft created.</strong> Status: {workspace.approvedVersion.resourceStatus}. Publication still requires the existing Learning Resources publish action.</div>}
      </CardContent>
    </Card>}

    {workspace?.approvedVersion && <div className="grid gap-4 xl:grid-cols-2">
      {(['hi', 'pa'] as const).map((languageCode) => {
        const localized = workspace.localizations.find((item) => item.languageCode === languageCode);
        const frozen = localized?.state === 'materialized';
        return <Card key={languageCode}>
          <CardHeader><div className="flex items-center justify-between gap-2"><CardTitle className="flex items-center gap-2 text-base"><Languages className="h-4 w-4" />{languageLabels[languageCode]}</CardTitle><Badge variant={localized?.state === 'ready' || frozen ? 'default' : 'outline'}>{localized ? pretty(localized.state) : 'Not generated'}</Badge></div></CardHeader>
          <CardContent className="space-y-3">
            {localized && <div className="grid grid-cols-3 gap-2 text-xs"><div className="rounded border p-2">Score <strong>{localized.quality?.shared?.score ?? '—'}</strong></div><div className="rounded border p-2">Errors <strong>{localized.quality?.shared?.errorCount ?? '—'}</strong></div><div className="rounded border p-2">Warnings <strong>{localized.quality?.shared?.warningCount ?? '—'}</strong></div></div>}
            <div className="space-y-1"><Label>Localized title</Label><Input value={drafts[languageCode].title} onChange={(event) => setDrafts((current) => ({ ...current, [languageCode]: { ...current[languageCode], title: event.target.value } }))} disabled={!canEdit || frozen} /></div>
            <div className="space-y-1"><Label>Localized summary</Label><Textarea rows={3} value={drafts[languageCode].summary} onChange={(event) => setDrafts((current) => ({ ...current, [languageCode]: { ...current[languageCode], summary: event.target.value } }))} disabled={!canEdit || frozen} /></div>
            <div className="space-y-1"><Label>Localized Markdown</Label><Textarea rows={12} className="font-mono text-xs" value={drafts[languageCode].bodyMarkdown} onChange={(event) => setDrafts((current) => ({ ...current, [languageCode]: { ...current[languageCode], bodyMarkdown: event.target.value } }))} disabled={!canEdit || frozen} /></div>
            {localized && !localized.quality?.ready && <div className="rounded-lg border border-amber-300 p-3 text-xs text-amber-900">Parity is not green yet. Check protected numbers/values, target script, heading count and source URLs before materialization.</div>}
            <div className="flex flex-wrap gap-2">{canEdit && !frozen && <><Button variant="outline" onClick={() => void generateLocalization(languageCode)} disabled={Boolean(workingKey)}>{workingKey === `generate-${languageCode}` ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Languages className="mr-1.5 h-4 w-4" />}Generate from frozen source</Button><Button variant="outline" onClick={() => void saveManualLocalization(languageCode)} disabled={Boolean(workingKey)}>Save & run parity</Button></>}{canPublish && localized?.state === 'ready' && workspace.approvedVersion?.resourceId && <Button onClick={() => void materializeLocalization(languageCode)} disabled={Boolean(workingKey)}>{workingKey === `materialize-${languageCode}` ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <PackageCheck className="mr-1.5 h-4 w-4" />}Create localized draft</Button>}</div>
            {frozen && <div className="rounded-lg border p-3 text-sm">Materialized as <strong>{localized?.publicCode}</strong> ({localized?.resourceStatus}). This localization is now frozen.</div>}
          </CardContent>
        </Card>;
      })}
    </div>}

    <Card className="border-dashed"><CardContent className="p-4 text-sm text-muted-foreground"><strong className="text-foreground">NS-006 publication boundary:</strong> approval freezes authoring; materialization only creates <code>draft</code> learning resources. Hindi/Punjabi generation uses the immutable approved learner version—not evidence or raw research sources—and localized drafts still require the ordinary explicit publish permission/action.</CardContent></Card>
  </div>;
}

export default NotesStudioApprovalLocalizationPage;
