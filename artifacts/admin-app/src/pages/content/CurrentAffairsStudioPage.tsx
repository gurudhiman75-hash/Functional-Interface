import { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileQuestion,
  Globe2,
  Languages,
  Loader2,
  Newspaper,
  Play,
  RefreshCw,
  Rocket,
  ServerCog,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  approveCurrentAffairsRelease,
  getCurrentAffairsAuthoringQueue,
  getCurrentAffairsAutomationRuns,
  getCurrentAffairsControlCenter,
  getCurrentAffairsLocalizationQueue,
  getCurrentAffairsReleaseHistory,
  getCurrentAffairsReleaseQueue,
  getCurrentAffairsSourceHealth,
  pullCurrentAffairsSource,
  revokeCurrentAffairsRelease,
  type CurrentAffairsAuthoringQueue,
  type CurrentAffairsAutomationRuns,
  type CurrentAffairsControlCenter,
  type CurrentAffairsLocalizationQueue,
  type CurrentAffairsReleaseCandidate,
  type CurrentAffairsReleaseHistory,
  type CurrentAffairsReleaseQueue,
  type CurrentAffairsSourceHealth,
} from '@/features/current-affairs/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

type WorkspaceData = {
  overview: CurrentAffairsControlCenter;
  sourceHealth: CurrentAffairsSourceHealth;
  authoring: CurrentAffairsAuthoringQueue;
  hindi: CurrentAffairsLocalizationQueue;
  punjabi: CurrentAffairsLocalizationQueue;
  releaseQueue: CurrentAffairsReleaseQueue;
  releaseHistory: CurrentAffairsReleaseHistory;
  automation: CurrentAffairsAutomationRuns;
};

function formatTime(value: string | null | undefined) {
  if (!value) return 'Not observed';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function statusTone(status: string) {
  if (['completed', 'published', 'approved', 'healthy', 'ready', 'success'].includes(status)) return 'border-success/30 bg-success/10 text-success';
  if (['failed', 'failure', 'blocked', 'revoked'].includes(status)) return 'border-destructive/30 bg-destructive/10 text-destructive';
  if (['completed_with_errors', 'needs_editorial', 'review', 'attention'].includes(status)) return 'border-warning/30 bg-warning/10 text-warning';
  return 'border-border bg-muted/40 text-muted-foreground';
}

function StatusBadge({ status }: { status: string }) {
  return <Badge variant="outline" className={cn('capitalize', statusTone(status))}>{titleCase(status)}</Badge>;
}

function MetricCard({ label, value, detail, tone = 'neutral' }: {
  label: string;
  value: number | string;
  detail: string;
  tone?: 'neutral' | 'warning' | 'danger' | 'success';
}) {
  const valueClass = tone === 'danger'
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
        <p className={cn('mt-2 text-2xl font-bold', valueClass)}>{value}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function PipelineStep({ label, value, warning = false }: { label: string; value: number; warning?: boolean }) {
  return (
    <div className="min-w-[118px] flex-1 rounded-lg border bg-card p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className={cn('mt-1 text-xl font-bold', warning && value > 0 ? 'text-warning' : 'text-foreground')}>{value}</p>
    </div>
  );
}

function sourceCanPull(source: CurrentAffairsSourceHealth['sources'][number]) {
  return source.isActive && ['feed', 'feed_and_pdf'].includes(source.ingestionMode) && Boolean(source.feedUrl);
}

function releaseLabel(candidate: CurrentAffairsReleaseCandidate) {
  const { key } = candidate;
  const date = key.periodStart === key.periodEnd ? key.periodEnd : `${key.periodStart} → ${key.periodEnd}`;
  return `${titleCase(key.periodType)} · ${key.examFamily.toUpperCase()} · ${date}`;
}

export function CurrentAffairsStudioPage() {
  const { hasPermission } = useAdminPermissions();
  const canUpdate = hasPermission('content.questions.update');
  const canPublish = hasPermission('content.questions.publish');
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutatingKey, setMutatingKey] = useState<string | null>(null);
  const [approvalTarget, setApprovalTarget] = useState<CurrentAffairsReleaseCandidate | null>(null);
  const [approvalReason, setApprovalReason] = useState('');
  const [revocationTarget, setRevocationTarget] = useState<CurrentAffairsReleaseHistory['releases'][number] | null>(null);
  const [revocationReason, setRevocationReason] = useState('');

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [overview, sourceHealth, authoring, hindi, punjabi, releaseQueue, releaseHistory, automation] = await Promise.all([
        getCurrentAffairsControlCenter(),
        getCurrentAffairsSourceHealth(),
        getCurrentAffairsAuthoringQueue('needs_editorial'),
        getCurrentAffairsLocalizationQueue('hi'),
        getCurrentAffairsLocalizationQueue('pa'),
        getCurrentAffairsReleaseQueue(),
        getCurrentAffairsReleaseHistory(),
        getCurrentAffairsAutomationRuns(),
      ]);
      setData({ overview, sourceHealth, authoring, hindi, punjabi, releaseQueue, releaseHistory, automation });
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Current Affairs Studio.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const pullSource = async (sourceKey: string) => {
    setMutatingKey(`pull:${sourceKey}`);
    try {
      await pullCurrentAffairsSource(sourceKey);
      showToast.success('Source pull complete', `${sourceKey} was ingested through the canonical feed route.`);
      await refresh(true);
    } catch (caught) {
      showToast.error('Source pull failed', caught instanceof Error ? caught.message : 'Unable to ingest this source.');
    } finally {
      setMutatingKey(null);
    }
  };

  const approveRelease = async () => {
    if (!approvalTarget) return;
    if (approvalReason.trim().length < 8) {
      showToast.error('Approval reason required', 'Enter at least eight characters for the release audit trail.');
      return;
    }
    setMutatingKey(`approve:${approvalTarget.sourceFingerprint}`);
    try {
      const response = await approveCurrentAffairsRelease(approvalTarget, approvalReason.trim());
      showToast.success('Current Affairs release approved', response.release.publicCode);
      setApprovalTarget(null);
      setApprovalReason('');
      await refresh(true);
    } catch (caught) {
      showToast.error('Release approval blocked', caught instanceof Error ? caught.message : 'Unable to approve this release.');
    } finally {
      setMutatingKey(null);
    }
  };

  const revokeRelease = async () => {
    if (!revocationTarget) return;
    if (revocationReason.trim().length < 8) {
      showToast.error('Revocation reason required', 'Enter at least eight characters for the release audit trail.');
      return;
    }
    setMutatingKey(`revoke:${revocationTarget.id}`);
    try {
      const response = await revokeCurrentAffairsRelease(revocationTarget.id, revocationReason.trim());
      showToast.success('Current Affairs release revoked', response.release.publicCode);
      setRevocationTarget(null);
      setRevocationReason('');
      await refresh(true);
    } catch (caught) {
      showToast.error('Release revocation failed', caught instanceof Error ? caught.message : 'Unable to revoke this release.');
    } finally {
      setMutatingKey(null);
    }
  };

  if (loading && !data) {
    return <div className="flex min-h-[360px] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading Current Affairs Studio…</div>;
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <PageHeader title="Current Affairs Studio" description="Canonical operations for verified Current Affairs." icon={<Newspaper className="h-5 w-5" />} />
        <Card><CardContent className="p-6"><p className="text-sm text-destructive">{error ?? 'Current Affairs Studio is unavailable.'}</p><Button className="mt-4" onClick={() => void refresh()}><RefreshCw className="mr-2 h-4 w-4" />Retry</Button></CardContent></Card>
      </div>
    );
  }

  const { overview } = data;
  const editorialTotal = overview.pipeline.authoringNeedsWork + overview.pipeline.hindiNeedsWork + overview.pipeline.punjabiNeedsWork + overview.pipeline.openConflicts;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Current Affairs Studio"
        description="Operate verified-source discovery, editorial readiness, multilingual releases and learner delivery from one canonical workspace."
        icon={<Newspaper className="h-5 w-5" />}
        actions={(
          <>
            <Button variant="outline" asChild><Link to="/content/learning-resources"><BookOpenCheck className="mr-2 h-4 w-4" />Learning Resources</Link></Button>
            <Button variant="outline" asChild><Link to="/content/questions/generate"><FileQuestion className="mr-2 h-4 w-4" />Question Studio</Link></Button>
            <Button onClick={() => void refresh()} disabled={loading}><RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />Refresh</Button>
          </>
        )}
      />

      {error ? <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">Refresh warning: {error}</div> : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Pipeline health" value={overview.health.level === 'healthy' ? 'Healthy' : 'Attention'} detail={`${overview.health.sourceFailures} source · ${overview.health.openConflicts} conflict · ${overview.health.automationFailures + overview.health.notificationFailures} worker issues`} tone={overview.health.level === 'healthy' ? 'success' : 'warning'} />
        <MetricCard label="Discovery queue" value={overview.pipeline.queuedCandidates} detail={`${overview.pipeline.openClusters} open clusters · ${overview.sources.scheduled} scheduled sources`} tone={overview.pipeline.queuedCandidates > 200 ? 'warning' : 'neutral'} />
        <MetricCard label="Editorial work" value={editorialTotal} detail={`${overview.pipeline.authoringNeedsWork} authoring · ${overview.pipeline.hindiNeedsWork} Hindi · ${overview.pipeline.punjabiNeedsWork} Punjabi`} tone={editorialTotal > 0 ? 'warning' : 'success'} />
        <MetricCard label="Release ready" value={overview.releases.ready} detail={`${overview.releases.blocked} blocked · ${overview.releases.approved} approved`} tone={overview.releases.ready > 0 ? 'success' : 'neutral'} />
        <MetricCard label="Learner delivery" value={overview.learnerDelivery.publishedQuizzes} detail={`${overview.learnerDelivery.learnersWithAttempts} learners · ${overview.learnerDelivery.unreadNotifications} unread notifications`} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="editorial">Editorial</TabsTrigger>
          <TabsTrigger value="releases">Releases</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4 text-primary" />Canonical pipeline</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <PipelineStep label="Queued" value={overview.pipeline.queuedCandidates} />
                <PipelineStep label="Open clusters" value={overview.pipeline.openClusters} />
                <PipelineStep label="Verified" value={overview.pipeline.verifiedEvents} />
                <PipelineStep label="Conflicts" value={overview.pipeline.openConflicts} warning />
                <PipelineStep label="Authoring" value={overview.pipeline.authoringNeedsWork} warning />
                <PipelineStep label="HI + PA" value={overview.pipeline.hindiNeedsWork + overview.pipeline.punjabiNeedsWork} warning />
                <PipelineStep label="Draft packs" value={overview.pipeline.draftCompilations} />
                <PipelineStep label="Ready release" value={overview.releases.ready} />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Globe2 className="h-4 w-4 text-primary" />Source estate</CardTitle></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                <div><p className="text-2xl font-bold">{overview.sources.scheduled}</p><p className="text-xs text-muted-foreground">Scheduled sources</p></div>
                <div><p className="text-2xl font-bold">{overview.sources.primarySources}</p><p className="text-xs text-muted-foreground">Primary sources</p></div>
                <div><p className={cn('text-2xl font-bold', overview.sources.failing > 0 && 'text-destructive')}>{overview.sources.failing}</p><p className="text-xs text-muted-foreground">Failing now</p></div>
                <p className="col-span-full text-xs text-muted-foreground">Last ingestion: {formatTime(overview.sources.lastIngestedAt)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Rocket className="h-4 w-4 text-primary" />Learner release state</CardTitle></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div><p className="text-2xl font-bold">{overview.learnerDelivery.activeQuestionPromotions}</p><p className="text-xs text-muted-foreground">Approved BANK_ONLY promotions</p></div>
                <div><p className="text-2xl font-bold">{overview.learnerDelivery.publishedQuizzes}</p><p className="text-xs text-muted-foreground">Published CA quizzes</p></div>
                <div><p className="text-2xl font-bold">{overview.learnerDelivery.learnersWithAttempts}</p><p className="text-xs text-muted-foreground">Learners with CA attempts</p></div>
                <div><p className="text-2xl font-bold">{overview.learnerDelivery.unreadNotifications}</p><p className="text-xs text-muted-foreground">Unread in-app notifications</p></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-3">
          <div className="flex items-center justify-between"><div><h2 className="font-semibold">Official source health</h2><p className="text-xs text-muted-foreground">Manual pulls are intentionally limited to feed-backed sources; curated listing sources remain scheduler-controlled.</p></div><StatusBadge status={data.sourceHealth.summary.failing > 0 ? 'attention' : 'healthy'} /></div>
          <div className="space-y-2">
            {data.sourceHealth.sources.map((source) => {
              const canPull = sourceCanPull(source) && canUpdate;
              const state = source.lastIngestionStatus || (source.scheduled ? 'scheduled' : 'manual');
              return (
                <Card key={source.id}>
                  <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{source.name}</p><StatusBadge status={state} />{source.isPrimarySource ? <Badge variant="outline">Primary</Badge> : null}{source.scheduled ? <Badge variant="outline">Scheduled</Badge> : null}</div>
                      <p className="mt-1 text-xs text-muted-foreground">{source.sourceKey} · {titleCase(source.ingestionMode)} · trust {Math.round(source.trustScore * 100)}% · {source.queuedCandidateCount} queued</p>
                      <p className="mt-1 text-xs text-muted-foreground">Last ingestion: {formatTime(source.lastIngestedAt)}</p>
                      {source.lastIngestionError ? <p className="mt-2 text-xs text-destructive">{source.lastIngestionError}</p> : null}
                    </div>
                    {sourceCanPull(source) ? (
                      <Button variant="outline" disabled={!canPull || mutatingKey === `pull:${source.sourceKey}`} onClick={() => void pullSource(source.sourceKey)}>
                        {mutatingKey === `pull:${source.sourceKey}` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}Pull now
                      </Button>
                    ) : <span className="text-xs text-muted-foreground">{source.scheduled ? 'Scheduler-managed listing' : 'No manual feed pull'}</span>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="editorial" className="space-y-4">
          <p className="text-xs text-muted-foreground">Open any queue card to inspect verified facts and source evidence, then edit English, Hindi and Punjabi in the fact-anchored workbench.</p>
          <div className="grid gap-4 xl:grid-cols-3">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Newspaper className="h-4 w-4 text-primary" />English authoring · {data.authoring.events.length}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {data.authoring.events.slice(0, 8).map((event) => <Link key={event.id} to={`/content/current-affairs/editorial/${event.id}`} className="block rounded-lg border p-3 transition-colors hover:border-primary/40 hover:bg-accent/40"><div className="flex items-start justify-between gap-2"><p className="text-sm font-medium leading-5">{event.currentTitle || event.primarySourceTitle || event.publicCode}</p><StatusBadge status={event.authoringStatus} /></div><p className="mt-1 text-xs text-muted-foreground">{event.eventDate} · {titleCase(event.category)} · {event.facts.length} verified facts</p>{event.primarySourceTitle ? <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">Source: {event.primarySourceTitle}</p> : null}</Link>)}
                {data.authoring.events.length === 0 ? <p className="text-sm text-muted-foreground">No English authoring items need editorial work.</p> : null}
              </CardContent>
            </Card>
            {([['Hindi', data.hindi], ['Punjabi', data.punjabi]] as const).map(([label, queue]) => (
              <Card key={label}>
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Languages className="h-4 w-4 text-primary" />{label} · {queue.events.length}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {queue.events.slice(0, 8).map((event) => <Link key={`${label}-${event.id}`} to={`/content/current-affairs/editorial/${event.id}`} className="block rounded-lg border p-3 transition-colors hover:border-primary/40 hover:bg-accent/40"><div className="flex items-start justify-between gap-2"><p className="text-sm font-medium leading-5">{event.englishTitle}</p><StatusBadge status={event.localizationStatus} /></div><p className="mt-1 text-xs text-muted-foreground">{event.eventDate} · {titleCase(event.category)} · {event.facts.length} protected facts</p></Link>)}
                  {queue.events.length === 0 ? <p className="text-sm text-muted-foreground">No {label.toLowerCase()} localization items need work.</p> : null}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex flex-wrap gap-2"><Button variant="outline" asChild><Link to="/content/review">Open Content Review <ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button variant="outline" asChild><Link to="/content/learning-resources">Open Learning Resources <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
        </TabsContent>

        <TabsContent value="releases" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4 text-primary" />Release queue · {data.releaseQueue.readyCount} ready / {data.releaseQueue.blockedCount} blocked</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {data.releaseQueue.candidates.map((candidate) => (
                  <div key={candidate.sourceFingerprint} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-medium">{releaseLabel(candidate)}</p><p className="mt-1 text-xs text-muted-foreground">{candidate.compilations.length} language manifests · {candidate.questions.length} quiz items</p></div><StatusBadge status={candidate.readiness.ready ? 'ready' : 'blocked'} /></div>
                    {candidate.readiness.blockers.length > 0 ? <ul className="mt-3 space-y-1 text-xs text-warning">{candidate.readiness.blockers.slice(0, 4).map((blocker) => <li key={blocker} className="flex gap-2"><TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />{blocker}</li>)}</ul> : <p className="mt-3 flex items-center gap-2 text-xs text-success"><CheckCircle2 className="h-3.5 w-3.5" />All CP014 release gates are ready.</p>}
                    {candidate.readiness.ready ? <Button className="mt-3" size="sm" disabled={!canPublish} onClick={() => { setApprovalTarget(candidate); setApprovalReason(''); }}>Approve release</Button> : null}
                  </div>
                ))}
                {data.releaseQueue.candidates.length === 0 ? <p className="text-sm text-muted-foreground">No release candidates are waiting.</p> : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Release action</CardTitle></CardHeader>
              <CardContent>
                {approvalTarget ? <div className="space-y-3"><p className="text-sm font-medium">Approve {releaseLabel(approvalTarget)}</p><p className="text-xs text-muted-foreground">Approval atomically publishes the EN/HI/PA note package through the existing CP014 transaction.</p><Textarea value={approvalReason} onChange={(event) => setApprovalReason(event.target.value)} placeholder="Editorial approval reason (minimum 8 characters)" rows={4} /><div className="flex gap-2"><Button disabled={!canPublish || mutatingKey?.startsWith('approve:')} onClick={() => void approveRelease()}>{mutatingKey?.startsWith('approve:') ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}Approve</Button><Button variant="outline" onClick={() => setApprovalTarget(null)}>Cancel</Button></div></div> : revocationTarget ? <div className="space-y-3"><p className="text-sm font-medium">Revoke {revocationTarget.publicCode}</p><p className="text-xs text-muted-foreground">Revocation withdraws learner notes/quizzes and propagates to Current Affairs question promotions through existing lifecycle guards.</p><Textarea value={revocationReason} onChange={(event) => setRevocationReason(event.target.value)} placeholder="Revocation reason (minimum 8 characters)" rows={4} /><div className="flex gap-2"><Button variant="destructive" disabled={!canPublish || mutatingKey?.startsWith('revoke:')} onClick={() => void revokeRelease()}>{mutatingKey?.startsWith('revoke:') ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}Revoke</Button><Button variant="outline" onClick={() => setRevocationTarget(null)}>Cancel</Button></div></div> : <p className="text-sm text-muted-foreground">Select a ready candidate to approve or an active release below to revoke. No scheduled worker has release authority.</p>}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Release history</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {data.releaseHistory.releases.slice(0, 30).map((release) => <div key={release.id} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{release.publicCode}</p><StatusBadge status={release.status} /></div><p className="mt-1 text-xs text-muted-foreground">{titleCase(release.periodType)} · {release.examFamily.toUpperCase()} · V{release.releaseVersion} · approved {formatTime(release.approvedAt)}</p></div>{release.status === 'approved' ? <Button variant="outline" size="sm" disabled={!canPublish} onClick={() => { setRevocationTarget(release); setRevocationReason(''); setApprovalTarget(null); }}>Revoke</Button> : null}</div>)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ServerCog className="h-4 w-4 text-primary" />Latest scheduled jobs</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {data.automation.runs.slice(0, 30).map((run) => <div key={run.id} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{titleCase(run.jobType)}</p><StatusBadge status={run.status} /></div><p className="mt-1 text-xs text-muted-foreground">{formatTime(run.startedAt)} · {run.successCount} success · {run.failureCount} failed · {run.candidateCreatedCount} candidates · {run.eventVerifiedCount} verified</p>{run.failureReason ? <p className="mt-1 text-xs text-destructive">{run.failureReason}</p> : null}</div></div>)}
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bell className="h-4 w-4 text-primary" />In-app notification worker</CardTitle></CardHeader><CardContent>{overview.automation.latestNotificationRun ? <div className="space-y-2"><StatusBadge status={overview.automation.latestNotificationRun.status} /><p className="text-sm">{overview.automation.latestNotificationRun.deliveredCount} delivered · {overview.automation.latestNotificationRun.suppressedCount} suppressed · {overview.automation.latestNotificationRun.errorCount} errors</p><p className="text-xs text-muted-foreground">Started {formatTime(overview.automation.latestNotificationRun.startedAt)} · evaluated {overview.automation.latestNotificationRun.evaluatedUserCount}/{overview.automation.latestNotificationRun.candidateUserCount} learners</p></div> : <p className="text-sm text-muted-foreground">No notification run observed yet.</p>}</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Clock3 className="h-4 w-4 text-primary" />Operational handoff</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Retry/cancel controls stay in System Health so Current Affairs does not create a second job-control model.</p><Button variant="outline" className="mt-3" asChild><Link to="/analytics/system-health">Open System Health <ExternalLink className="ml-2 h-4 w-4" /></Link></Button></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CurrentAffairsStudioPage;