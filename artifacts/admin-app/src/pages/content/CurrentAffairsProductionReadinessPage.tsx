import { useCallback, useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock3, Loader2, Play, RefreshCw, RotateCcw, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  generateYesterdayCurrentAffairs,
  getCurrentAffairsProductionReadiness,
  getCurrentAffairsRecoveryRuns,
  runCurrentAffairsProductionRecovery,
  type CurrentAffairsProductionReadiness,
  type CurrentAffairsRecoveryRuns,
  type GenerateYesterdayCurrentAffairsResult,
} from '@/features/current-affairs/production-ops-api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

function fmt(value: string | null | undefined) {
  if (!value) return 'Not observed';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function tone(color: 'green' | 'amber' | 'red') {
  if (color === 'green') return 'border-success/30 bg-success/10 text-success';
  if (color === 'red') return 'border-destructive/30 bg-destructive/10 text-destructive';
  return 'border-warning/30 bg-warning/10 text-warning';
}

function Gate({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
      <span>{label}</span>
      {ok ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
    </div>
  );
}

export function CurrentAffairsProductionReadinessPage() {
  const { hasPermission } = useAdminPermissions();
  const canRecover = hasPermission('jobs.manage');
  const [readiness, setReadiness] = useState<CurrentAffairsProductionReadiness | null>(null);
  const [runs, setRuns] = useState<CurrentAffairsRecoveryRuns | null>(null);
  const [loading, setLoading] = useState(true);
  const [recovering, setRecovering] = useState(false);
  const [generatingYesterday, setGeneratingYesterday] = useState(false);
  const [lastGeneration, setLastGeneration] = useState<GenerateYesterdayCurrentAffairsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [nextReadiness, nextRuns] = await Promise.all([
        getCurrentAffairsProductionReadiness(),
        getCurrentAffairsRecoveryRuns(),
      ]);
      setReadiness(nextReadiness);
      setRuns(nextRuns);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load production readiness.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const generateYesterday = async () => {
    setGeneratingYesterday(true);
    try {
      const result = await generateYesterdayCurrentAffairs();
      setLastGeneration(result);
      if (result.summary.allEnglishDraftsPresent) {
        showToast.success(
          `Yesterday's Current Affairs is available`,
          `${result.targetDate}: ${result.summary.verifiedEvents} verified events · ${result.summary.englishDraftCount} English packs · ${result.summary.localizedDraftCount} localized packs.`,
        );
      } else {
        showToast.error(
          `Yesterday could not be fully materialized`,
          result.summary.blockers[0] ?? `No eligible verified events were available for all exam families on ${result.targetDate}.`,
        );
      }
      await refresh();
    } catch (caught) {
      showToast.error('Generate yesterday failed', caught instanceof Error ? caught.message : 'Unable to generate yesterday’s Current Affairs.');
    } finally {
      setGeneratingYesterday(false);
    }
  };

  const recover = async () => {
    setRecovering(true);
    try {
      await runCurrentAffairsProductionRecovery();
      showToast.success('Recovery pass complete', 'Draft-only Current Affairs recovery finished.');
      await refresh();
    } catch (caught) {
      showToast.error('Recovery failed', caught instanceof Error ? caught.message : 'Unable to run recovery.');
    } finally {
      setRecovering(false);
    }
  };

  if (loading && !readiness) {
    return <div className="flex min-h-[360px] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading production readiness…</div>;
  }

  if (!readiness) {
    return <div className="space-y-4"><PageHeader title="Current Affairs Production Readiness" description="Daily operating gate." /><Card><CardContent className="p-6 text-sm text-destructive">{error ?? 'Readiness is unavailable.'}</CardContent></Card></div>;
  }

  const { evaluation } = readiness;
  const checks = evaluation.checks;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Current Affairs Production Readiness"
        description={`Operating day ${readiness.targetDate}. Daily learner-readiness deadline: ${fmt(readiness.deadlineIso)}.`}
        icon={<Activity className="h-5 w-5" />}
        actions={(
          <>
            <Button variant="outline" asChild><Link to="/content/current-affairs">Back to Studio</Link></Button>
            {canRecover ? (
              <Button onClick={() => void generateYesterday()} disabled={generatingYesterday || recovering}>
                {generatingYesterday ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Generate Yesterday Now
              </Button>
            ) : null}
            {canRecover ? <Button variant="outline" onClick={() => void recover()} disabled={recovering || generatingYesterday}><RotateCcw className={cn('mr-2 h-4 w-4', recovering && 'animate-spin')} />Run bounded recovery</Button> : null}
            <Button variant="outline" onClick={() => void refresh()} disabled={loading || generatingYesterday}><RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />Refresh</Button>
          </>
        )}
      />

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-base font-semibold">Need yesterday’s Current Affairs immediately?</p>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
              Generate Yesterday Now refreshes the configured official sources, enriches primary facts, reruns clustering and strict verification,
              then creates any missing SSC, Banking and Punjab EN/HI/PA draft packs and BANK_ONLY review questions for {readiness.targetDate}.
              It never publishes or approves content.
            </p>
          </div>
          <Button variant="outline" asChild><Link to="/content/learning-resources">View Current Affairs drafts</Link></Button>
        </CardContent>
      </Card>

      {generatingYesterday ? (
        <Card>
          <CardContent className="flex items-center gap-3 p-5 text-sm">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div><p className="font-medium">Generating {readiness.targetDate} now…</p><p className="text-muted-foreground">Official sources → primary facts → intelligence → verified events → multilingual drafts → review questions.</p></div>
          </CardContent>
        </Card>
      ) : null}

      {lastGeneration ? (
        <Card className={lastGeneration.summary.allEnglishDraftsPresent ? 'border-success/30' : 'border-warning/30'}>
          <CardHeader><CardTitle className="text-base">Last on-demand generation · {lastGeneration.targetDate}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Candidates</p><p className="mt-1 text-xl font-bold">{lastGeneration.after.candidateCount}</p></div>
              <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Verified events</p><p className="mt-1 text-xl font-bold">{lastGeneration.summary.verifiedEvents}</p></div>
              <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Needs review</p><p className="mt-1 text-xl font-bold">{lastGeneration.summary.reviewEvents}</p></div>
              <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">English packs</p><p className="mt-1 text-xl font-bold">{lastGeneration.summary.englishDraftCount}/3</p></div>
              <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">HI + PA packs</p><p className="mt-1 text-xl font-bold">{lastGeneration.summary.localizedDraftCount}/6</p></div>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {(['ssc', 'banking', 'punjab'] as const).map((family) => {
                const familyArtifacts = lastGeneration.artifacts.filter((item) => item.family === family);
                return (
                  <div key={family} className="rounded-lg border p-3">
                    <p className="font-semibold uppercase">{family}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['en', 'hi', 'pa'] as const).map((language) => {
                        const artifact = familyArtifacts.find((item) => item.language === language);
                        return <Badge key={language} variant="outline" className={artifact ? 'border-success/30 bg-success/10 text-success' : 'border-warning/30 bg-warning/10 text-warning'}>{language.toUpperCase()} {artifact ? 'ready' : 'missing'}</Badge>;
                      })}
                    </div>
                    {familyArtifacts.find((item) => item.language === 'en')?.title ? <p className="mt-2 text-xs text-muted-foreground">{familyArtifacts.find((item) => item.language === 'en')?.title}</p> : null}
                  </div>
                );
              })}
            </div>
            {!lastGeneration.summary.allEnglishDraftsPresent ? <p className="text-sm text-warning">{lastGeneration.summary.blockers[0] ?? 'Some exam-family drafts are still blocked because no eligible verified content is available.'}</p> : null}
          </CardContent>
        </Card>
      ) : null}

      <Card className={cn('border-2', tone(evaluation.color))}>
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn('uppercase', tone(evaluation.color))}>{evaluation.color}</Badge>
              <p className="text-sm font-semibold">Is {readiness.targetDate} Current Affairs ready?</p>
            </div>
            <p className="mt-2 text-2xl font-bold">{evaluation.learnerReady ? 'Yes — learner ready' : evaluation.releaseReady ? 'Editorial release ready' : evaluation.draftReady ? 'Drafts complete, editorial pending' : 'Not ready'}</p>
            <p className="mt-1 text-sm text-muted-foreground">Primary source SLA {evaluation.sourceCoveragePercent}% · {readiness.pipeline.queuedCandidates} queued candidates · {readiness.pipeline.openConflicts} open conflicts</p>
          </div>
          <div className="text-sm text-muted-foreground"><Clock3 className="mr-2 inline h-4 w-4" />Generated {fmt(readiness.generatedAt)}</div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Source & pipeline SLA</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Gate label="≥80% primary-source polling coverage" ok={Boolean(checks.sourceCoverageHealthy)} />
            <Gate label="Critical sources healthy" ok={Boolean(checks.criticalSourcesHealthy)} />
            <Gate label="Feed/listing run ≤4h old" ok={Boolean(checks.feedFresh)} />
            <Gate label="Intelligence run ≤4h old" ok={Boolean(checks.intelligenceFresh)} />
            <Gate label="Queue within operating envelope" ok={Boolean(checks.queueHealthy)} />
            <Gate label="No open factual conflicts" ok={Boolean(checks.conflictFree)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Daily pack gate</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Gate label="SSC/Banking/Punjab English drafts" ok={Boolean(checks.allEnglishDrafts)} />
            <Gate label="Hindi/Punjabi draft parity" ok={Boolean(checks.allLocalizedDrafts)} />
            <Gate label="Question review complete" ok={Boolean(checks.allQuestionReviewsComplete)} />
            <Gate label="All families release-ready" ok={Boolean(checks.allReleaseReady)} />
            <Gate label="All families explicitly released" ok={Boolean(checks.allReleased)} />
            <Gate label="Learner quizzes published" ok={Boolean(checks.allLearnerQuizzesPublished)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Blockers & warnings</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {evaluation.blockers.length === 0 && evaluation.warnings.length === 0 ? <p className="text-success">No operating blockers.</p> : null}
            {evaluation.blockers.map((item) => <div key={item} className="flex gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-2 text-destructive"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />{item}</div>)}
            {evaluation.warnings.map((item) => <div key={item} className="flex gap-2 rounded-md border border-warning/20 bg-warning/5 p-2 text-warning"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{item}</div>)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Exam-family completeness</CardTitle></CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-3">
          {readiness.families.map((family) => (
            <div key={family.family} className="rounded-lg border p-4">
              <div className="flex items-center justify-between"><p className="font-semibold uppercase">{family.family}</p><Badge variant="outline">{family.eventCount} events</Badge></div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className={cn('rounded p-2', family.englishDraftPresent ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')}>EN</div>
                <div className={cn('rounded p-2', family.hindiDraftPresent ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>HI</div>
                <div className={cn('rounded p-2', family.punjabiDraftPresent ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>PA</div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Questions {family.approvedEnglishQuestions}/{family.totalEnglishQuestions} approved · Release {family.approvedRelease ? family.releaseCode ?? 'approved' : family.releaseReady ? 'ready' : 'blocked'} · Quiz {family.learnerQuizPublished ? 'published' : 'not published'}</p>
              {family.blockers.slice(0, 3).map((blocker) => <p key={blocker} className="mt-1 text-xs text-warning">• {blocker}</p>)}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Primary-source coverage</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {readiness.sourceCoverage.sources.map((source) => (
              <div key={source.sourceKey} className="flex items-start justify-between gap-3 rounded-lg border p-3 text-sm">
                <div><p className="font-medium">{source.name}</p><p className="text-xs text-muted-foreground">{source.sourceKey} · last poll {fmt(source.lastIngestedAt)}</p>{source.error ? <p className="mt-1 text-xs text-destructive">{source.error}</p> : null}</div>
                <Badge variant="outline" className={source.fresh && source.status === 'success' ? 'border-success/30 bg-success/10 text-success' : 'border-destructive/30 bg-destructive/10 text-destructive'}>{source.fresh && source.status === 'success' ? 'Fresh' : 'Attention'}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Missing-day detection & recovery</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {readiness.missingDays.length === 0 ? <p className="text-sm text-success">No missing English daily packs in the last seven days where verified relevant events existed.</p> : readiness.missingDays.map((item) => <div key={`${item.day}:${item.family}`} className="rounded-md border border-warning/30 bg-warning/5 px-3 py-2 text-sm text-warning">{item.day} · {item.family.toUpperCase()} English pack missing</div>)}
            <div className="border-t pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent recovery passes</p>
              {(runs?.runs ?? []).slice(0, 6).map((run) => (
                <div key={run.id} className="mb-2 flex items-center justify-between gap-3 text-xs">
                  <span>{fmt(run.startedAt)} · {run.triggerMode}</span>
                  <span>{run.status} · EN {run.englishBackfillCount} · localized {run.localizedBackfillCount}</span>
                </div>
              ))}
              {(runs?.runs ?? []).length === 0 ? <p className="text-xs text-muted-foreground">No recovery passes recorded yet.</p> : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
