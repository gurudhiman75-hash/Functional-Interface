import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileWarning,
  GitCompare,
  RefreshCw,
  ShieldCheck,
  Snowflake,
  TestTube2,
} from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  changeChapterFreeze,
  downloadChapterIntelligenceReport,
  getChapterIntelligenceReport,
  getContentIntelligenceChapters,
  recordDuplicateDecision,
  type ChapterIntelligenceReport,
  type ContentIntelligenceChapterSummary,
  type DuplicateCandidate,
} from '@/features/content-intelligence/api';
import { cn } from '@/lib/utils';

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatDate(value: string | null): string {
  if (!value) return 'Not recorded';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function decisionLabel(value: DuplicateCandidate['decision']['decision']): string {
  if (value === 'intentional_variant') return 'Intentional variant';
  if (value === 'false_positive') return 'False positive';
  if (value === 'duplicate') return 'Confirmed duplicate';
  return 'Unresolved';
}

export function ContentIntelligenceWorkspace() {
  const [chapters, setChapters] = useState<ContentIntelligenceChapterSummary[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [report, setReport] = useState<ChapterIntelligenceReport | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChapters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getContentIntelligenceChapters();
      setChapters(response.chapters);
      setSelectedChapterId((current) => current || response.chapters[0]?.id || '');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load chapter intelligence.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadReport = useCallback(async (chapterNodeId: string) => {
    if (!chapterNodeId) {
      setReport(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setReport(await getChapterIntelligenceReport(chapterNodeId));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to build chapter intelligence.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadChapters(); }, [loadChapters]);
  useEffect(() => { if (selectedChapterId) void loadReport(selectedChapterId); }, [selectedChapterId, loadReport]);

  const selectedSummary = useMemo(
    () => chapters.find((chapter) => chapter.id === selectedChapterId) ?? null,
    [chapters, selectedChapterId],
  );

  const requireReason = () => {
    if (reason.trim().length < 4) {
      setError('Enter an audit reason of at least four characters.');
      return false;
    }
    return true;
  };

  const decide = async (
    candidate: DuplicateCandidate,
    decision: 'duplicate' | 'intentional_variant' | 'false_positive',
    canonicalQuestionId: string | null,
  ) => {
    if (!report || !requireReason()) return;
    setMutating(true);
    setError(null);
    try {
      const updated = await recordDuplicateDecision({
        chapterNodeId: report.chapter.id,
        leftQuestionId: candidate.left.id,
        rightQuestionId: candidate.right.id,
        decision,
        canonicalQuestionId,
        reason: reason.trim(),
      });
      setReport(updated);
      setReason('');
      showToast.success('Duplicate decision recorded', `${candidate.left.publicCode} and ${candidate.right.publicCode} were reviewed.`);
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Unable to record the duplicate decision.');
    } finally {
      setMutating(false);
    }
  };

  const changeFreeze = async () => {
    if (!report || !requireReason()) return;
    const action = report.freeze.recordedState === 'frozen' ? 'reopen' : 'freeze';
    setMutating(true);
    setError(null);
    try {
      const updated = await changeChapterFreeze({
        chapterNodeId: report.chapter.id,
        action,
        reason: reason.trim(),
      });
      setReport(updated);
      setReason('');
      showToast.success(action === 'freeze' ? 'Chapter frozen' : 'Chapter reopened', `${report.chapter.code} governance state was updated.`);
      await loadChapters();
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Unable to change the chapter freeze state.');
    } finally {
      setMutating(false);
    }
  };

  const download = async () => {
    if (!report) return;
    try {
      await downloadChapterIntelligenceReport(report.chapter.id);
      showToast.success('Report downloaded', `${report.chapter.code} freeze-readiness report was exported.`);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Unable to download the report.');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <Label>Chapter or subtopic</Label>
            <Select value={selectedChapterId} onValueChange={setSelectedChapterId}>
              <SelectTrigger className="mt-1 w-full lg:max-w-xl"><SelectValue placeholder="Select a chapter" /></SelectTrigger>
              <SelectContent>
                {chapters.map((chapter) => (
                  <SelectItem key={chapter.id} value={chapter.id}>
                    {chapter.code} · {chapter.name} · {chapter.questionCount} questions
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSummary && <p className="mt-2 text-xs text-muted-foreground">{selectedSummary.nodeType} · target {selectedSummary.targetCoverage ?? 'not configured'} · recorded state {selectedSummary.freezeState}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" disabled={loading || !selectedChapterId} onClick={() => void loadReport(selectedChapterId)}>
              <RefreshCw className={cn('mr-1.5 h-4 w-4', loading && 'animate-spin')} /> Refresh scan
            </Button>
            <Button variant="outline" disabled={!report} onClick={() => void download()}><Download className="mr-1.5 h-4 w-4" /> Export JSON</Button>
          </div>
        </CardContent>
      </Card>

      {error && <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
      {loading && !report && <Card><CardContent className="flex min-h-72 items-center justify-center text-sm text-muted-foreground"><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Building the canonical chapter report…</CardContent></Card>}

      {report && <>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <Metric label="Questions" value={report.metrics.questionCount} />
          <Metric label="Approved" value={report.metrics.approvedQuestionCount} tone={report.metrics.approvedQuestionCount === report.metrics.questionCount ? 'success' : 'warning'} />
          <Metric label="Critical duplicates" value={report.metrics.unresolvedCriticalDuplicateCount} tone={report.metrics.unresolvedCriticalDuplicateCount ? 'danger' : 'success'} />
          <Metric label="Near duplicates" value={report.metrics.unresolvedWarningDuplicateCount} tone={report.metrics.unresolvedWarningDuplicateCount ? 'warning' : 'success'} />
          <Metric label="Placeholders" value={report.metrics.unresolvedPlaceholderCount} tone={report.metrics.unresolvedPlaceholderCount ? 'danger' : 'success'} />
          <Metric label="Open comments" value={report.metrics.openCommentCount} tone={report.metrics.openCommentCount ? 'warning' : 'success'} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div><CardTitle className="flex items-center gap-2 text-base"><GitCompare className="h-4 w-4" />Duplicate intelligence</CardTitle><p className="mt-1 text-xs text-muted-foreground">Exact, number-template and weighted lexical-semantic comparisons within the selected taxonomy subtree.</p></div>
              <Badge variant="outline">{report.duplicateCandidates.length} pairs</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.duplicateCandidates.length === 0 && <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground"><CheckCircle2 className="mx-auto mb-2 h-5 w-5 text-success" />No duplicate candidates exceeded the production thresholds.</div>}
              {report.duplicateCandidates.map((candidate) => (
                <DuplicateCard key={candidate.pairKey} candidate={candidate} disabled={mutating} onDecision={decide} />
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Snowflake className="h-4 w-4" />Chapter freeze</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div><p className="text-sm font-semibold">{report.readiness.ready ? 'Freeze ready' : 'Blocked'}</p><p className="text-xs text-muted-foreground">Report {report.reportHash.slice(0, 12)}</p></div>
                  <Badge className={cn(report.readiness.ready ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')} variant="outline">{report.freeze.state}</Badge>
                </div>
                {report.freeze.state === 'stale' && <div className="rounded-lg border border-warning/40 bg-warning/5 p-3 text-xs text-warning">The chapter was frozen against an older report. Re-review changes before treating it as frozen.</div>}
                <IssueList title="Blocking gates" issues={report.readiness.blockers} empty="Every blocking gate passed." danger />
                <IssueList title="Warnings" issues={report.readiness.warnings} empty="No non-blocking warnings." />
                <div className="rounded-lg border p-3 text-xs">
                  <p className="font-semibold">Language readiness</p>
                  <div className="mt-2 flex flex-wrap gap-2"><Badge variant="outline">English: {report.languageReadiness.english}</Badge><Badge variant="outline">Hindi: not connected</Badge><Badge variant="outline">Punjabi: not connected</Badge></div>
                  <p className="mt-2 text-muted-foreground">{report.languageReadiness.note}</p>
                </div>
                <div><Label>Audit reason</Label><Textarea className="mt-1 min-h-24" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explain the decision, evidence reviewed, or reason for reopening." /></div>
                <Button className="w-full" variant={report.freeze.recordedState === 'frozen' ? 'outline' : 'default'} disabled={mutating || (report.freeze.recordedState !== 'frozen' && !report.readiness.ready)} onClick={() => void changeFreeze()}>
                  {report.freeze.recordedState === 'frozen' ? <><FileWarning className="mr-1.5 h-4 w-4" />Reopen chapter</> : <><ShieldCheck className="mr-1.5 h-4 w-4" />Freeze approved report</>}
                </Button>
                <div className="text-[11px] text-muted-foreground">Last change: {formatDate(report.freeze.changedAt)}{report.freeze.changedByName ? ` by ${report.freeze.changedByName}` : ''}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><TestTube2 className="h-4 w-4" />Operational evidence</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Evidence label="Target coverage" value={report.metrics.targetCoverage == null ? 'Not configured' : `${report.metrics.questionCount}/${report.metrics.targetCoverage}`} />
                <Evidence label="Current test usage" value={`${report.metrics.testUsageCount} placements`} />
                <Evidence label="Scan scope" value={report.metrics.scanTruncated ? 'Truncated and blocking' : `${report.metrics.questionCount} current versions`} />
                <Evidence label="Generated" value={formatDate(report.generatedAt)} />
              </CardContent>
            </Card>
          </div>
        </div>
      </>}
    </div>
  );
}

function DuplicateCard({ candidate, disabled, onDecision }: {
  candidate: DuplicateCandidate;
  disabled: boolean;
  onDecision: (candidate: DuplicateCandidate, decision: 'duplicate' | 'intentional_variant' | 'false_positive', canonicalQuestionId: string | null) => Promise<void>;
}) {
  return <div className={cn('rounded-xl border p-4', candidate.severity === 'critical' ? 'border-destructive/30' : 'border-warning/30')}>
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <Badge variant="outline" className={candidate.severity === 'critical' ? 'text-destructive' : 'text-warning'}>{candidate.severity}</Badge>
      <Badge variant="secondary">{candidate.kind}</Badge>
      <span className="text-xs text-muted-foreground">{formatPercent(candidate.score)} match</span>
      <Badge variant="outline" className="ml-auto">{decisionLabel(candidate.decision.decision)}</Badge>
    </div>
    <div className="grid gap-3 lg:grid-cols-2">
      {[candidate.left, candidate.right].map((question) => <div key={question.id} className="rounded-lg bg-muted/35 p-3">
        <div className="mb-2 flex items-center justify-between gap-2"><Link className="font-mono text-xs font-semibold text-primary hover:underline" to={`/content/questions/${question.id}`}>{question.publicCode}</Link><Badge variant="outline" className="text-[10px]">{question.status}</Badge></div>
        <p className="text-sm leading-relaxed">{question.stem}</p>
        <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{question.explanation}</p>
      </div>)}
    </div>
    <div className="mt-3 flex flex-wrap gap-1">{candidate.signals.map((signal) => <Badge key={signal} variant="outline" className="font-normal">{signal}</Badge>)}</div>
    {candidate.decision.reason && <p className="mt-3 rounded bg-muted/40 p-2 text-xs text-muted-foreground">{candidate.decision.decidedByName}: {candidate.decision.reason}</p>}
    <div className="mt-3 flex flex-wrap gap-2">
      <Button size="sm" disabled={disabled} onClick={() => void onDecision(candidate, 'duplicate', candidate.left.id)}>Keep {candidate.left.publicCode}</Button>
      <Button size="sm" disabled={disabled} onClick={() => void onDecision(candidate, 'duplicate', candidate.right.id)}>Keep {candidate.right.publicCode}</Button>
      <Button size="sm" variant="outline" disabled={disabled} onClick={() => void onDecision(candidate, 'intentional_variant', null)}>Intentional variant</Button>
      <Button size="sm" variant="ghost" disabled={disabled} onClick={() => void onDecision(candidate, 'false_positive', null)}>False positive</Button>
    </div>
  </div>;
}

function Metric({ label, value, tone = 'neutral' }: { label: string; value: number; tone?: 'neutral' | 'success' | 'warning' | 'danger' }) {
  const toneClass = tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : tone === 'danger' ? 'text-destructive' : 'text-foreground';
  return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className={cn('mt-1 text-2xl font-bold', toneClass)}>{value}</p></CardContent></Card>;
}

function IssueList({ title, issues, empty, danger = false }: { title: string; issues: Array<{ code: string; message: string }>; empty: string; danger?: boolean }) {
  return <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>{issues.length === 0 ? <div className="flex gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-xs text-success"><CheckCircle2 className="h-4 w-4 shrink-0" />{empty}</div> : <div className="space-y-2">{issues.map((issue) => <div key={issue.code} className={cn('flex gap-2 rounded-lg border p-3 text-xs', danger ? 'border-destructive/30 bg-destructive/5 text-destructive' : 'border-warning/30 bg-warning/5 text-warning')}><AlertTriangle className="h-4 w-4 shrink-0" /><span>{issue.message}</span></div>)}</div>}</div>;
}

function Evidence({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 border-b pb-2 last:border-0 last:pb-0"><span className="text-muted-foreground">{label}</span><span className="text-right font-medium">{value}</span></div>;
}
