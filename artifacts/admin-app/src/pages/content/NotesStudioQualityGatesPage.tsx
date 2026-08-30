import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw, ShieldCheck, XCircle } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type QualityCheck = {
  runId: string;
  code: string;
  label: string;
  status: 'pass' | 'warning' | 'fail';
  blocking: boolean;
  summary: string;
  metrics: Record<string, string | number | boolean | null>;
};

type QualitySection = {
  id: string;
  coverageItemId: string;
  coverageTitle: string;
  priority: string;
  plannedDepth: string;
  title: string;
  state: string;
  outputFingerprint: string;
  latestRunId: string | null;
  qualityStatus: 'passed' | 'failed' | null;
  policyVersion: string | null;
  qualityOutputFingerprint: string | null;
  evidenceFingerprint: string | null;
  warningCount: number | null;
  failCount: number | null;
  qualityRanAt: string | null;
  qualityCurrent: boolean;
  checks: QualityCheck[];
};

type QualityWorkspace = {
  job: AuthoringJob;
  sections: QualitySection[];
  summary: {
    coreCount: number;
    coreDrafted: number;
    corePassed: number;
    sectionCount: number;
    qaPassedSections: number;
    failedSections: number;
    warningCount: number;
    activeConflictCount: number;
    reviewReady: boolean;
  };
};

function pretty(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function statusIcon(status: QualityCheck['status']) {
  if (status === 'pass') return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (status === 'warning') return <AlertTriangle className="h-4 w-4 text-amber-600" />;
  return <XCircle className="h-4 w-4 text-destructive" />;
}

function statusBadge(section: QualitySection) {
  if (!section.latestRunId) return <Badge variant="outline">Not checked</Badge>;
  if (!section.qualityCurrent) return <Badge variant="outline">Stale QA</Badge>;
  if (section.qualityStatus === 'passed') return <Badge>QA passed</Badge>;
  return <Badge variant="destructive">QA failed</Badge>;
}

export function NotesStudioQualityGatesPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [workspace, setWorkspace] = useState<QualityWorkspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [workingKey, setWorkingKey] = useState('');

  const loadJobs = async () => {
    const response = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
    const next = response.jobs ?? [];
    setJobs(next);
    setSelectedJobId((current) => current && next.some((job) => job.id === current) ? current : next[0]?.id ?? '');
  };

  const loadWorkspace = async (jobId: string) => {
    if (!jobId) {
      setWorkspace(null);
      return;
    }
    setWorkspace(await adminRequest<QualityWorkspace>(`/admin/notes-studio/jobs/${jobId}/quality`));
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
      .catch((error) => showToast.error('Unable to load quality gates', error instanceof Error ? error.message : 'Request failed.'))
      .finally(() => setLoading(false));
  }, [selectedJobId]);

  const refresh = async () => {
    setLoading(true);
    try {
      await Promise.all([loadJobs(), selectedJobId ? loadWorkspace(selectedJobId) : Promise.resolve()]);
    } catch (error) {
      showToast.error('Unable to refresh quality gates', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const runOne = async (sectionId: string) => {
    if (!selectedJobId) return;
    setWorkingKey(`section:${sectionId}`);
    try {
      const next = await adminRequest<QualityWorkspace>(`/admin/notes-studio/jobs/${selectedJobId}/sections/${sectionId}/quality/run`, { method: 'POST' });
      setWorkspace(next);
      await loadJobs();
      showToast.success('Quality gates completed', next.summary.reviewReady ? 'All review gates are green; the job is review-ready.' : 'The section QA result has been recorded.');
    } catch (error) {
      showToast.error('Unable to run quality gates', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey('');
    }
  };

  const runAll = async () => {
    if (!selectedJobId) return;
    setWorkingKey('all');
    try {
      const next = await adminRequest<QualityWorkspace>(`/admin/notes-studio/jobs/${selectedJobId}/quality/run-all`, { method: 'POST' });
      setWorkspace(next);
      await loadJobs();
      showToast.success('Quality pass completed', next.summary.reviewReady ? 'All core coverage and section quality gates are green.' : 'Review the failed or warning checks below.');
    } catch (error) {
      showToast.error('Unable to run all quality gates', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey('');
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Quality Gates"
      description="Run deterministic, fingerprint-bound checks before a Notes Studio draft can become review-ready. QA never accepts or publishes learner content."
      icon={<ShieldCheck className="h-5 w-5" />}
      actions={<div className="flex gap-2"><Button variant="outline" onClick={() => void refresh()} disabled={loading || Boolean(workingKey)}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>{canEdit && <Button onClick={() => void runAll()} disabled={!selectedJobId || !workspace?.sections.length || Boolean(workingKey)}>{workingKey === 'all' ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-1.5 h-4 w-4" />}Run all QA</Button>}</div>}
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
        <div className="flex flex-wrap items-center gap-2">
          {workspace && <Badge variant="outline">{pretty(workspace.job.state)}</Badge>}
          {workspace?.summary.reviewReady && <Badge><CheckCircle2 className="mr-1 h-3.5 w-3.5" />Review ready</Badge>}
          {Boolean(workspace?.summary.activeConflictCount) && <Badge variant="destructive"><AlertTriangle className="mr-1 h-3.5 w-3.5" />{workspace?.summary.activeConflictCount} active conflict(s)</Badge>}
        </div>
      </CardContent>
    </Card>

    {workspace && <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Core coverage</div><div className="mt-1 text-2xl font-bold">{workspace.summary.corePassed}/{workspace.summary.coreCount}</div><div className="text-xs text-muted-foreground">QA passed</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">All sections</div><div className="mt-1 text-2xl font-bold">{workspace.summary.qaPassedSections}/{workspace.summary.sectionCount}</div><div className="text-xs text-muted-foreground">Current QA pass</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Failed sections</div><div className="mt-1 text-2xl font-bold">{workspace.summary.failedSections}</div><div className="text-xs text-muted-foreground">Current failed runs</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Warnings</div><div className="mt-1 text-2xl font-bold">{workspace.summary.warningCount}</div><div className="text-xs text-muted-foreground">Non-blocking review flags</div></CardContent></Card>
    </div>}

    {!workspace ? <Card className="border-dashed"><CardContent className="p-10 text-center text-sm text-muted-foreground">Choose an authoring job to inspect QA.</CardContent></Card> : workspace.sections.length === 0 ? <Card className="border-dashed"><CardContent className="p-10 text-center text-sm text-muted-foreground">Draft sections before running NS-005 quality gates.</CardContent></Card> : <div className="space-y-4">
      {workspace.sections.map((section) => <Card key={section.id}>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">{section.title}</CardTitle>
              <div className="mt-2 flex flex-wrap gap-2"><Badge variant="outline">{section.priority}</Badge><Badge variant="outline">{section.plannedDepth}</Badge><Badge variant="outline">{pretty(section.state)}</Badge>{statusBadge(section)}</div>
            </div>
            {canEdit && <Button variant="outline" onClick={() => void runOne(section.id)} disabled={Boolean(workingKey)}>{workingKey === `section:${section.id}` ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-1.5 h-4 w-4" />}Run section QA</Button>}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {!section.latestRunId ? <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">No QA run yet. Checks are tied to the current section fingerprint and current evidence graph.</div> : !section.qualityCurrent ? <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">The latest QA run is stale because the section output changed. Run QA again before review.</div> : <>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {section.checks.map((check) => <div key={check.code} className="rounded-lg border p-3">
                <div className="flex items-start gap-2">{statusIcon(check.status)}<div><div className="text-sm font-semibold">{check.label}</div><div className="mt-1 text-xs leading-relaxed text-muted-foreground">{check.summary}</div></div></div>
                <div className="mt-2 flex flex-wrap gap-1.5">{check.blocking ? <Badge variant="outline">blocking</Badge> : <Badge variant="outline">advisory</Badge>}<Badge variant="outline">{check.status}</Badge></div>
                {Object.keys(check.metrics ?? {}).length > 0 && <div className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{Object.entries(check.metrics).map(([key, value]) => `${key}: ${String(value)}`).join(' · ')}</div>}
              </div>)}
            </div>
            <div className="text-xs text-muted-foreground">Policy {section.policyVersion ?? '—'} · run {section.latestRunId?.slice(0, 8)} · warnings {section.warningCount ?? 0} · failures {section.failCount ?? 0}</div>
          </>}
        </CardContent>
      </Card>)}
    </div>}

    <Card className="border-dashed">
      <CardContent className="p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">NS-005 boundary:</strong> a green run only marks a section <code>qa_passed</code>. It never marks it editorially accepted, never writes a learner resource, and never publishes. Any later section/evidence change invalidates review readiness and requires QA again.
      </CardContent>
    </Card>
  </div>;
}

export default NotesStudioQualityGatesPage;
