import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  HeartPulse,
  Loader2,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  RotateCcw,
  Server,
  ShieldAlert,
  XCircle,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  getOperationalJob,
  getSystemHealthOverview,
  performOperationalJobAction,
  type OperationalErrorEvent,
  type OperationalJob,
  type OperationalJobDetail,
  type SystemHealthLevel,
  type SystemHealthOverview,
} from '@/features/system-health/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

const LEVEL_STYLES: Record<SystemHealthLevel, string> = {
  healthy: 'border-success/30 bg-success/10 text-success',
  degraded: 'border-warning/30 bg-warning/10 text-warning',
  critical: 'border-destructive/30 bg-destructive/10 text-destructive',
  unknown: 'border-border bg-muted text-muted-foreground',
};

function formatTime(value: string | null | undefined): string {
  if (!value) return 'Not observed';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Invalid timestamp' : date.toLocaleString();
}

function formatAge(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) return 'Not observed';
  if (minutes < 1) return 'Less than a minute';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  if (minutes < 1_440) return `${Math.round(minutes / 60)} hr`;
  return `${Math.round(minutes / 1_440)} day`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3_600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3_600)}h ${Math.floor((seconds % 3_600) / 60)}m`;
}

function pretty(value: unknown): string {
  if (value === null || value === undefined) return 'No data';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function LevelBadge({ level }: { level: SystemHealthLevel }) {
  const Icon = level === 'healthy'
    ? CheckCircle2
    : level === 'critical'
      ? XCircle
      : level === 'degraded'
        ? AlertTriangle
        : AlertCircle;
  return (
    <Badge variant="outline" className={cn('gap-1 capitalize', LEVEL_STYLES[level])}>
      <Icon className="h-3.5 w-3.5" />
      {level}
    </Badge>
  );
}

function MetricCard({ label, value, detail, tone = 'neutral' }: {
  label: string;
  value: number | string;
  detail: string;
  tone?: 'neutral' | 'warning' | 'danger' | 'success';
}) {
  const toneClass = tone === 'danger'
    ? 'text-destructive'
    : tone === 'warning'
      ? 'text-warning'
      : tone === 'success'
        ? 'text-success'
        : 'text-foreground';
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={cn('mt-2 text-2xl font-bold', toneClass)}>{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function errorTone(error: OperationalErrorEvent): string {
  return error.severity === 'critical'
    ? 'border-destructive/40 bg-destructive/5'
    : error.severity === 'error'
      ? 'border-destructive/20'
      : 'border-warning/30 bg-warning/5';
}

export function SystemHealthWorkspacePage() {
  const { hasPermission } = useAdminPermissions();
  const canManage = hasPermission('jobs.manage');
  const [overview, setOverview] = useState<SystemHealthOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatus, setJobStatus] = useState('all');
  const [errorSource, setErrorSource] = useState('all');
  const [errorSeverity, setErrorSeverity] = useState('all');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobDetail, setJobDetail] = useState<OperationalJobDetail | null>(null);
  const [jobDetailLoading, setJobDetailLoading] = useState(false);
  const [jobActionReason, setJobActionReason] = useState('');
  const [mutating, setMutating] = useState(false);

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const next = await getSystemHealthOverview();
      setOverview(next);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load System Health.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    const timer = window.setInterval(() => void refresh(true), 30_000);
    return () => window.clearInterval(timer);
  }, [autoRefresh, refresh]);

  const openJob = useCallback(async (job: OperationalJob) => {
    setSelectedJobId(job.id);
    setJobDetail(null);
    setJobActionReason('');
    setJobDetailLoading(true);
    try {
      const response = await getOperationalJob(job.id);
      setJobDetail(response.job);
    } catch (caught) {
      showToast.error('Job detail unavailable', caught instanceof Error ? caught.message : 'Unable to load this job.');
    } finally {
      setJobDetailLoading(false);
    }
  }, []);

  const performAction = async (action: 'retry' | 'cancel') => {
    if (!selectedJobId) return;
    if (jobActionReason.trim().length < 4) {
      showToast.error('Reason required', 'Enter at least four characters for the audit trail.');
      return;
    }
    setMutating(true);
    try {
      const response = await performOperationalJobAction({
        jobId: selectedJobId,
        action,
        reason: jobActionReason.trim(),
      });
      setJobDetail(response.job);
      setJobActionReason('');
      showToast.success(action === 'retry' ? 'Job requeued' : 'Job cancelled', 'The canonical queue and audit history were updated.');
      await refresh(true);
    } catch (caught) {
      showToast.error('Job action failed', caught instanceof Error ? caught.message : 'Unable to update this job.');
    } finally {
      setMutating(false);
    }
  };

  const filteredJobs = useMemo(() => {
    const query = jobSearch.trim().toLowerCase();
    return (overview?.jobs ?? []).filter((job) => {
      if (jobStatus !== 'all' && job.status !== jobStatus) return false;
      if (!query) return true;
      return [job.jobType, job.status, job.ownerName, job.ownerEmail, job.relatedEntityType, job.relatedEntityId, job.lastError]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [jobSearch, jobStatus, overview?.jobs]);

  const filteredErrors = useMemo(() => (overview?.errors ?? []).filter((entry) => (
    (errorSource === 'all' || entry.source === errorSource)
    && (errorSeverity === 'all' || entry.severity === errorSeverity)
  )), [errorSeverity, errorSource, overview?.errors]);

  const jobStatuses = useMemo(() => Array.from(new Set((overview?.jobs ?? []).map((job) => job.status))).sort(), [overview?.jobs]);
  const errorSources = useMemo(() => Array.from(new Set((overview?.errors ?? []).map((entry) => entry.source))).sort(), [overview?.errors]);

  const selectedSummary = overview?.jobs.find((job) => job.id === selectedJobId) ?? null;
  const retryAllowed = selectedSummary?.status === 'failed' || selectedSummary?.status === 'cancelled';
  const cancelAllowed = selectedSummary?.status === 'queued' || selectedSummary?.status === 'retrying';

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Health"
        description="Canonical operational visibility across the API, database, background jobs, Question Studio, validation and the transactional outbox."
        icon={<HeartPulse className="h-5 w-5" />}
        actions={(
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={autoRefresh} onChange={(event) => setAutoRefresh(event.target.checked)} />
              Auto-refresh 30s
            </label>
            <Button variant="outline" disabled={loading} onClick={() => void refresh()}>
              <RefreshCw className={cn('mr-1.5 h-4 w-4', loading && 'animate-spin')} /> Refresh
            </Button>
          </div>
        )}
      />

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {loading && !overview ? (
        <Card><CardContent className="flex min-h-72 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading canonical telemetry…</CardContent></Card>
      ) : overview ? (
        <>
          <Card className={cn('border-2', LEVEL_STYLES[overview.summary.level])}>
            <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2"><LevelBadge level={overview.summary.level} /><span className="text-xs text-muted-foreground">Updated {formatTime(overview.generatedAt)}</span></div>
                <h2 className="mt-3 text-xl font-semibold">{overview.summary.headline}</h2>
                {overview.summary.reasons.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {overview.summary.reasons.map((reason) => <li key={reason}>• {reason}</li>)}
                  </ul>
                ) : <p className="mt-2 text-sm text-muted-foreground">No configured critical or degraded signals are active.</p>}
              </div>
              <div className="grid min-w-64 grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border bg-background/70 p-3"><p className="text-xs text-muted-foreground">Database</p><p className="mt-1 font-semibold">{overview.database.latencyMs} ms</p></div>
                <div className="rounded-lg border bg-background/70 p-3"><p className="text-xs text-muted-foreground">API uptime</p><p className="mt-1 font-semibold">{formatDuration(overview.process.uptimeSeconds)}</p></div>
                <div className="rounded-lg border bg-background/70 p-3"><p className="text-xs text-muted-foreground">Worker</p><p className="mt-1 font-semibold capitalize">{overview.worker.state.replace('_', ' ')}</p></div>
                <div className="rounded-lg border bg-background/70 p-3"><p className="text-xs text-muted-foreground">Environment</p><p className="mt-1 font-semibold capitalize">{overview.process.environment}</p></div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            <MetricCard label="Queued jobs" value={overview.metrics.queuedJobs} detail={`${overview.metrics.runningJobs} running`} tone={overview.metrics.queuedJobs ? 'warning' : 'success'} />
            <MetricCard label="Stale jobs" value={overview.metrics.staleJobs} detail="Heartbeat or claim threshold" tone={overview.metrics.staleJobs ? 'danger' : 'success'} />
            <MetricCard label="Job failures" value={overview.metrics.failedJobs24h} detail="Last 24 hours" tone={overview.metrics.failedJobs24h ? 'danger' : 'success'} />
            <MetricCard label="Generation failures" value={overview.metrics.failedGeneration24h} detail="Last 24 hours" tone={overview.metrics.failedGeneration24h ? 'danger' : 'success'} />
            <MetricCard label="Pending outbox" value={overview.metrics.pendingOutbox} detail={`Oldest ${formatAge(overview.metrics.oldestPendingOutboxAgeMinutes)}`} tone={(overview.metrics.oldestPendingOutboxAgeMinutes ?? 0) > 10 ? 'danger' : overview.metrics.pendingOutbox ? 'warning' : 'success'} />
            <MetricCard label="Errors" value={overview.metrics.errorCount24h} detail="Unified timeline, 24 hours" tone={overview.metrics.errorCount24h ? 'danger' : 'success'} />
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="h-auto flex-wrap justify-start">
              <TabsTrigger value="overview">Components</TabsTrigger>
              <TabsTrigger value="jobs">Jobs ({overview.jobs.length})</TabsTrigger>
              <TabsTrigger value="errors">Errors ({overview.errors.length})</TabsTrigger>
              <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {overview.worker.note && (
                <div className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  <div><p className="font-medium">Worker visibility is limited</p><p className="mt-1 text-muted-foreground">{overview.worker.note}</p></div>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {overview.components.map((component) => {
                  const Icon = component.key === 'database' ? Database : component.key === 'api' ? Server : component.key === 'worker' ? Activity : component.key === 'outbox' ? RefreshCw : HeartPulse;
                  return (
                    <Card key={component.key}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="flex items-center gap-2 text-sm"><Icon className="h-4 w-4" />{component.name}</CardTitle>
                          <LevelBadge level={component.level} />
                        </div>
                      </CardHeader>
                      <CardContent><p className="text-sm text-muted-foreground">{component.summary}</p><p className="mt-3 text-xs text-muted-foreground">Last signal: {formatTime(component.lastSignalAt)}</p></CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4">
              <Card>
                <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_220px]">
                  <Input value={jobSearch} onChange={(event) => setJobSearch(event.target.value)} placeholder="Search type, owner, entity or error…" />
                  <select className="h-10 rounded-md border bg-background px-3 text-sm" value={jobStatus} onChange={(event) => setJobStatus(event.target.value)}>
                    <option value="all">All statuses</option>
                    {jobStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="overflow-x-auto p-0">
                  <table className="w-full min-w-[980px] text-left text-sm">
                    <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">Job</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Progress</th><th className="px-4 py-3">Attempts</th><th className="px-4 py-3">Worker</th><th className="px-4 py-3">Updated</th><th className="px-4 py-3" /></tr></thead>
                    <tbody>
                      {filteredJobs.map((job) => (
                        <tr key={job.id} className="border-b last:border-0">
                          <td className="px-4 py-3"><p className="font-medium">{job.jobType}</p><p className="mt-1 font-mono text-[11px] text-muted-foreground">{job.id}</p>{job.lastError && <p className="mt-1 max-w-sm truncate text-xs text-destructive">{job.lastError}</p>}</td>
                          <td className="px-4 py-3"><div className="flex flex-col items-start gap-1"><Badge variant="outline" className="capitalize">{job.status}</Badge>{job.assessment.stale && <span className="text-xs text-destructive">Stale</span>}</div></td>
                          <td className="px-4 py-3"><div className="w-28"><div className="mb-1 flex justify-between text-xs"><span>{job.progressPercent}%</span></div><Progress value={job.progressPercent} className="h-1.5" /></div></td>
                          <td className="px-4 py-3">{job.attempts} / {job.maxAttempts}</td>
                          <td className="px-4 py-3"><p>{job.lockedBy || 'Unclaimed'}</p><p className="text-xs text-muted-foreground">{formatTime(job.heartbeatAt)}</p></td>
                          <td className="px-4 py-3 text-muted-foreground">{formatTime(job.updatedAt)}</td>
                          <td className="px-4 py-3 text-right"><Button size="sm" variant="outline" onClick={() => void openJob(job)}>Inspect</Button></td>
                        </tr>
                      ))}
                      {filteredJobs.length === 0 && <tr><td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">No canonical jobs match these filters.</td></tr>}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="errors" className="space-y-4">
              <Card><CardContent className="grid gap-3 p-4 sm:grid-cols-2">
                <select className="h-10 rounded-md border bg-background px-3 text-sm" value={errorSource} onChange={(event) => setErrorSource(event.target.value)}><option value="all">All sources</option>{errorSources.map((source) => <option key={source} value={source}>{source.replaceAll('_', ' ')}</option>)}</select>
                <select className="h-10 rounded-md border bg-background px-3 text-sm" value={errorSeverity} onChange={(event) => setErrorSeverity(event.target.value)}><option value="all">All severities</option><option value="critical">Critical</option><option value="error">Error</option><option value="warning">Warning</option></select>
              </CardContent></Card>
              <div className="space-y-3">
                {filteredErrors.map((entry) => (
                  <Card key={entry.id} className={errorTone(entry)}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><Badge variant="outline" className="capitalize">{entry.source.replaceAll('_', ' ')}</Badge><Badge variant={entry.severity === 'warning' ? 'outline' : 'destructive'} className="capitalize">{entry.severity}</Badge></div><h3 className="mt-2 font-semibold">{entry.title}</h3><p className="mt-1 text-sm text-muted-foreground">{entry.message}</p>{entry.entityId && <p className="mt-2 font-mono text-[11px] text-muted-foreground">{entry.entityType}: {entry.entityId}</p>}</div><span className="shrink-0 text-xs text-muted-foreground">{formatTime(entry.occurredAt)}</span></div>
                    </CardContent>
                  </Card>
                ))}
                {filteredErrors.length === 0 && <Card><CardContent className="py-16 text-center text-sm text-muted-foreground">No persisted operational errors match these filters.</CardContent></Card>}
              </div>
            </TabsContent>

            <TabsContent value="pipelines" className="space-y-4">
              <Card><CardHeader><CardTitle className="text-sm">Question generation runs</CardTitle></CardHeader><CardContent className="overflow-x-auto p-0"><table className="w-full min-w-[780px] text-left text-sm"><thead className="border-y bg-muted/40 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Run</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Provider</th><th className="px-4 py-3">Updated</th></tr></thead><tbody>{overview.pipelines.generationRuns.map((run) => <tr key={run.id} className="border-b last:border-0"><td className="px-4 py-3"><p className="font-medium">{run.publicCode}</p>{run.failureReason && <p className="mt-1 max-w-sm truncate text-xs text-destructive">{run.failureReason}</p>}</td><td className="px-4 py-3"><Badge variant="outline" className="capitalize">{run.status}</Badge></td><td className="px-4 py-3">{run.itemCount} total · {run.approvedItemCount} approved</td><td className="px-4 py-3">{run.provider || '—'} / {run.model || '—'}</td><td className="px-4 py-3 text-muted-foreground">{formatTime(run.updatedAt)}</td></tr>)}{overview.pipelines.generationRuns.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No generation runs recorded.</td></tr>}</tbody></table></CardContent></Card>
              <div className="grid gap-4 xl:grid-cols-2">
                <Card><CardHeader><CardTitle className="text-sm">Validation runs</CardTitle></CardHeader><CardContent className="space-y-3">{overview.pipelines.validationRuns.slice(0, 50).map((run) => <div key={run.id} className="rounded-lg border p-3"><div className="flex items-center justify-between gap-3"><div><p className="font-medium">{run.profileKey}</p><p className="text-xs text-muted-foreground">{run.entityType} · {run.engineVersion}</p></div><Badge variant="outline" className="capitalize">{run.result}</Badge></div><p className="mt-2 text-xs text-muted-foreground">{formatTime(run.completedAt || run.startedAt)}</p></div>)}{overview.pipelines.validationRuns.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No canonical validation runs recorded.</p>}</CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm">Transactional outbox</CardTitle></CardHeader><CardContent className="space-y-3">{overview.pipelines.outboxEvents.slice(0, 50).map((event) => <div key={event.id} className="rounded-lg border p-3"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{event.eventType}</p><p className="text-xs text-muted-foreground">{event.aggregateType} · attempts {event.attempts}</p></div><Badge variant={event.publishedAt ? 'outline' : 'destructive'}>{event.publishedAt ? 'Published' : 'Pending'}</Badge></div>{event.lastError && <p className="mt-2 text-xs text-destructive">{event.lastError}</p>}<p className="mt-2 text-xs text-muted-foreground">Occurred {formatTime(event.occurredAt)}</p></div>)}{overview.pipelines.outboxEvents.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No outbox events recorded.</p>}</CardContent></Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : null}

      <Sheet open={Boolean(selectedJobId)} onOpenChange={(open) => { if (!open) { setSelectedJobId(null); setJobDetail(null); setJobActionReason(''); } }}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader><SheetTitle>Background job detail</SheetTitle><SheetDescription>Canonical queue state, attempts, worker logs and redacted payload context.</SheetDescription></SheetHeader>
          {jobDetailLoading ? <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading job detail…</div> : jobDetail ? (
            <div className="mt-6 space-y-5">
              <Card><CardContent className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{jobDetail.jobType}</h3><p className="mt-1 font-mono text-xs text-muted-foreground">{jobDetail.id}</p></div><LevelBadge level={jobDetail.assessment.level} /></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-muted-foreground">Status</p><p className="mt-1 capitalize">{jobDetail.status}</p></div><div><p className="text-xs text-muted-foreground">Priority</p><p className="mt-1 capitalize">{jobDetail.priority}</p></div><div><p className="text-xs text-muted-foreground">Worker</p><p className="mt-1">{jobDetail.lockedBy || 'Unclaimed'}</p></div><div><p className="text-xs text-muted-foreground">Heartbeat</p><p className="mt-1">{formatTime(jobDetail.heartbeatAt)}</p></div></div>{jobDetail.lastError && <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{jobDetail.lastError}</div>}</CardContent></Card>

              {(retryAllowed || cancelAllowed) && (
                <Card><CardHeader><CardTitle className="text-sm">Queue action</CardTitle></CardHeader><CardContent className="space-y-3"><Textarea value={jobActionReason} onChange={(event) => setJobActionReason(event.target.value)} placeholder="Operational reason for the immutable audit trail…" /><div className="flex flex-wrap gap-2">{retryAllowed && <Button disabled={!canManage || mutating} onClick={() => void performAction('retry')}><RotateCcw className="mr-1.5 h-4 w-4" />Retry job</Button>}{cancelAllowed && <Button variant="destructive" disabled={!canManage || mutating} onClick={() => void performAction('cancel')}><PauseCircle className="mr-1.5 h-4 w-4" />Cancel queued job</Button>}</div>{!canManage && <p className="text-xs text-muted-foreground">Your role does not include jobs.manage.</p>}{overview?.worker.state === 'not_observed' && retryAllowed && <p className="text-xs text-warning">The retry will remain durable in the queue until a background worker is connected.</p>}</CardContent></Card>
              )}

              <Card><CardHeader><CardTitle className="text-sm">Attempts ({jobDetail.attempts.length})</CardTitle></CardHeader><CardContent className="space-y-3">{jobDetail.attempts.map((attempt) => <div key={attempt.id} className="rounded-lg border p-3"><div className="flex justify-between gap-3"><div><p className="font-medium">Attempt {attempt.attemptNumber}</p><p className="text-xs text-muted-foreground">Worker {attempt.workerId}</p></div><span className="text-xs text-muted-foreground">{formatTime(attempt.startedAt)}</span></div>{attempt.errorMessage && <p className="mt-2 text-sm text-destructive">{attempt.errorClass ? `${attempt.errorClass}: ` : ''}{attempt.errorMessage}</p>}</div>)}{jobDetail.attempts.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No worker attempts recorded.</p>}</CardContent></Card>

              <Card><CardHeader><CardTitle className="text-sm">Logs ({jobDetail.logs.length})</CardTitle></CardHeader><CardContent className="space-y-3">{jobDetail.logs.slice(0, 100).map((log) => <div key={log.id} className="rounded-lg border p-3"><div className="flex justify-between gap-3"><Badge variant="outline" className="capitalize">{log.level}</Badge><span className="text-xs text-muted-foreground">{formatTime(log.createdAt)}</span></div><p className="mt-2 text-sm">{log.message}</p></div>)}{jobDetail.logs.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No structured worker logs recorded.</p>}</CardContent></Card>

              <details className="rounded-lg border p-3"><summary className="cursor-pointer text-sm font-medium">Redacted payload</summary><pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded bg-muted p-3 text-xs">{pretty(jobDetail.payload)}</pre></details>
              <details className="rounded-lg border p-3"><summary className="cursor-pointer text-sm font-medium">Redacted result</summary><pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded bg-muted p-3 text-xs">{pretty(jobDetail.result)}</pre></details>
            </div>
          ) : <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">Select a job to inspect.</div>}
        </SheetContent>
      </Sheet>
    </div>
  );
}
