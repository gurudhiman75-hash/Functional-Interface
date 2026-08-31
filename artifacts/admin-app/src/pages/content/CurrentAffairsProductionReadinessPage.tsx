import { useCallback, useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock3, Loader2, Play, RefreshCw, RotateCcw } from 'lucide-react';
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

function statusTone(color: 'green' | 'amber' | 'red') {
  if (color === 'green') return 'border-success/30 bg-success/10 text-success';
  if (color === 'red') return 'border-destructive/30 bg-destructive/10 text-destructive';
  return 'border-warning/30 bg-warning/10 text-warning';
}

function ReadyMark({ ok }: { ok: boolean }) {
  return ok
    ? <CheckCircle2 className="h-4 w-4 text-success" />
    : <AlertTriangle className="h-4 w-4 text-warning" />;
}

export function CurrentAffairsProductionReadinessPage() {
  const { hasPermission } = useAdminPermissions();
  const canRun = hasPermission('jobs.manage');
  const [readiness, setReadiness] = useState<CurrentAffairsProductionReadiness | null>(null);
  const [runs, setRuns] = useState<CurrentAffairsRecoveryRuns | null>(null);
  const [lastGeneration, setLastGeneration] = useState<GenerateYesterdayCurrentAffairsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [recovering, setRecovering] = useState(false);
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
      setError(caught instanceof Error ? caught.message : 'Unable to load Current Affairs readiness.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const generateYesterday = async () => {
    setGenerating(true);
    try {
      const result = await generateYesterdayCurrentAffairs();
      setLastGeneration(result);
      if (result.summary.allEnglishDraftsPresent) {
        showToast.success(
          `Yesterday's Current Affairs is available`,
          `${result.targetDate}: ${result.summary.verifiedEvents} verified events · ${result.summary.englishDraftCount}/3 English packs · ${result.summary.localizedDraftCount}/6 localized packs.`,
        );
      } else {
        showToast.error(
          'Generation completed with blockers',
          result.summary.blockers[0] ?? 'Some exam-family drafts could not be materialized from verified source evidence.',
        );
      }
      await refresh();
    } catch (caught) {
      showToast.error('Generate yesterday failed', caught instanceof Error ? caught.message : 'Unable to generate yesterday.');
    } finally {
      setGenerating(false);
    }
  };

  const recover = async () => {
    setRecovering(true);
    try {
      await runCurrentAffairsProductionRecovery();
      showToast.success('Recovery complete', 'Draft-only Current Affairs recovery finished.');
      await refresh();
    } catch (caught) {
      showToast.error('Recovery failed', caught instanceof Error ? caught.message : 'Unable to run recovery.');
    } finally {
      setRecovering(false);
    }
  };

  if (loading && !readiness) {
    return <div className="flex min-h-[360px] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading Current Affairs production state…</div>;
  }

  if (!readiness) {
    return (
      <div className="space-y-4">
        <PageHeader title="CA Production Readiness" description="Current Affairs production state is unavailable." icon={<Activity className="h-5 w-5" />} />
        <Card><CardContent className="p-6 text-sm text-destructive">{error ?? 'Unable to load readiness.'}</CardContent></Card>
      </div>
    );
  }

  const { evaluation } = readiness;
  return (
    <div className="space-y-5">
      <PageHeader
        title="CA Production Readiness"
        description={`Operating day ${readiness.targetDate} · readiness deadline ${fmt(readiness.deadlineIso)}`}
        icon={<Activity className="h-5 w-5" />}
        actions={(
          <>
            {canRun ? (
              <Button onClick={() => void generateYesterday()} disabled={generating || recovering}>
                {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Generate Yesterday Now
              </Button>
            ) : null}
            {canRun ? (
              <Button variant="outline" onClick={() => void recover()} disabled={generating || recovering}>
                <RotateCcw className={cn('mr-2 h-4 w-4', recovering && 'animate-spin')} />Bounded recovery
              </Button>
            ) : null}
            <Button variant="outline" onClick={() => void refresh()} disabled={loading || generating}>
              <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />Refresh
            </Button>
          </>
        )}
      />

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-semibold">Yesterday should exist on demand.</p>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
              Generate Yesterday Now refreshes official sources, enriches primary facts, reruns clustering and strict verification, and materializes missing SSC, Banking and Punjab EN/HI/PA drafts plus BANK_ONLY review questions. It never publishes automatically.
            </p>
          </div>
          <Button variant="outline" asChild><Link to="/content/learning-resources">Open Learning Resources</Link></Button>
        </CardContent>
      </Card>

      {generating ? (
        <Card><CardContent className="flex items-center gap-3 p-5 text-sm"><Loader2 className="h-5 w-5 animate-spin text-primary" /><div><p className="font-medium">Generating {readiness.targetDate}…</p><p className="text-muted-foreground">Official sources → facts → verification → notes → translations → review questions.</p></div></CardContent></Card>
      ) : null}

      {lastGeneration ? (
        <Card className={lastGeneration.summary.allEnglishDraftsPresent ? 'border-success/30' : 'border-warning/30'}>
          <CardHeader><CardTitle className="text-base">Last on-demand result · {lastGeneration.targetDate}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Metric label="Candidates" value={lastGeneration.after.candidateCount} />
              <Metric label="Verified events" value={lastGeneration.summary.verifiedEvents} />
              <Metric label="Needs review" value={lastGeneration.summary.reviewEvents} />
              <Metric label="English packs" value={`${lastGeneration.summary.englishDraftCount}/3`} />
              <Metric label="HI + PA packs" value={`${lastGeneration.summary.localizedDraftCount}/6`} />
            </div>
            {lastGeneration.summary.blockers.length > 0 ? <p className="text-sm text-warning">{lastGeneration.summary.blockers[0]}</p> : null}
          </CardContent>
        </Card>
      ) : null}

      <Card className={cn('border-2', statusTone(evaluation.color))}>
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2"><Badge variant="outline" className={cn('uppercase', statusTone(evaluation.color))}>{evaluation.color}</Badge><span className="text-sm font-semibold">Is {readiness.targetDate} ready?</span></div>
            <p className="mt-2 text-2xl font-bold">{evaluation.learnerReady ? 'Learner ready' : evaluation.releaseReady ? 'Ready for editorial release' : evaluation.draftReady ? 'Drafts ready · editorial pending' : 'Not ready'}</p>
            <p className="mt-1 text-sm text-muted-foreground">Primary-source coverage {evaluation.sourceCoveragePercent}% · {readiness.pipeline.queuedCandidates} queued · {readiness.pipeline.openConflicts} conflicts</p>
          </div>
          <div className="text-sm text-muted-foreground"><Clock3 className="mr-2 inline h-4 w-4" />Checked {fmt(readiness.generatedAt)}</div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {readiness.families.map((family) => (
          <Card key={family.family}>
            <CardHeader><CardTitle className="flex items-center justify-between text-base"><span className="uppercase">{family.family}</span><Badge variant="outline">{family.eventCount} events</Badge></CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <CheckRow label="English draft" ok={family.englishDraftPresent} />
              <CheckRow label="Hindi draft" ok={family.hindiDraftPresent} />
              <CheckRow label="Punjabi draft" ok={family.punjabiDraftPresent} />
              <CheckRow label={`Questions approved ${family.approvedEnglishQuestions}/${family.totalEnglishQuestions}`} ok={family.totalEnglishQuestions === 0 || family.approvedEnglishQuestions === family.totalEnglishQuestions} />
              <CheckRow label="Release ready" ok={family.releaseReady} />
              <CheckRow label="Learner quiz published" ok={family.learnerQuizPublished} />
              {family.blockers.slice(0, 2).map((blocker) => <p key={blocker} className="text-xs text-warning">• {blocker}</p>)}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Official-source health</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {readiness.sourceCoverage.sources.map((source) => (
              <div key={source.sourceKey} className="flex items-start justify-between gap-3 rounded-lg border p-3 text-sm">
                <div><p className="font-medium">{source.name}</p><p className="text-xs text-muted-foreground">Last ingestion: {fmt(source.lastIngestedAt)}</p>{source.error ? <p className="mt-1 text-xs text-destructive">{source.error}</p> : null}</div>
                <Badge variant="outline" className={source.fresh ? 'border-success/30 bg-success/10 text-success' : 'border-warning/30 bg-warning/10 text-warning'}>{source.fresh ? 'fresh' : source.status ?? 'stale'}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Blockers & recent recovery</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {evaluation.blockers.length === 0 ? <p className="text-success">No hard readiness blockers.</p> : evaluation.blockers.map((blocker) => <p key={blocker} className="rounded-md border border-destructive/20 bg-destructive/5 p-2 text-destructive">{blocker}</p>)}
            {evaluation.warnings.map((warning) => <p key={warning} className="rounded-md border border-warning/20 bg-warning/5 p-2 text-warning">{warning}</p>)}
            {(runs?.runs ?? []).slice(0, 5).map((run) => <div key={run.id} className="flex items-center justify-between border-t pt-2 text-xs"><span>{run.targetDate} · {run.triggerMode}</span><span>{run.status}</span></div>)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>;
}

function CheckRow({ label, ok }: { label: string; ok: boolean }) {
  return <div className="flex items-center justify-between rounded-md border px-3 py-2"><span>{label}</span><ReadyMark ok={ok} /></div>;
}
