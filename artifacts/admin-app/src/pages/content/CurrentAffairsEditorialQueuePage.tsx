import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileQuestion, Languages, Loader2, Newspaper, RefreshCw, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  getCurrentAffairsEditorialQueue,
  getCurrentAffairsHeadlineReview,
  getCurrentAffairsQuestionEditorialQueue,
  setCurrentAffairsHeadlineSelection,
  type CurrentAffairsEditorialQueue,
  type CurrentAffairsEditorialQueueItem,
  type CurrentAffairsHeadlineReview,
  type CurrentAffairsHeadlineReviewItem,
  type CurrentAffairsQuestionEditorialQueue,
} from '@/features/current-affairs/editorial-api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status: string) {
  if (['ready', 'manual', 'approved', 'verified', 'clustered'].includes(status)) return 'border-success/30 bg-success/10 text-success';
  if (['needs_editorial', 'pending', 'unreviewed', 'missing', 'queued', 'review', 'candidate'].includes(status)) return 'border-warning/30 bg-warning/10 text-warning';
  if (['rejected', 'error'].includes(status)) return 'border-destructive/30 bg-destructive/10 text-destructive';
  return 'border-border bg-muted/40 text-muted-foreground';
}

function indiaYesterday() {
  return new Date(Date.now() + 330 * 60_000 - 86_400_000).toISOString().slice(0, 10);
}

function scoreTone(score: number) {
  if (score >= 75) return 'border-success/30 bg-success/10 text-success';
  if (score >= 60) return 'border-primary/30 bg-primary/10 text-primary';
  if (score >= 45) return 'border-warning/30 bg-warning/10 text-warning';
  return 'border-border bg-muted/40 text-muted-foreground';
}

function priorityTone(priority: CurrentAffairsHeadlineReviewItem['priorityTier']) {
  if (priority === 'critical') return 'border-destructive/30 bg-destructive/10 text-destructive';
  if (priority === 'high') return 'border-primary/30 bg-primary/10 text-primary';
  if (priority === 'routine') return 'border-border bg-muted/40 text-muted-foreground';
  return 'border-warning/30 bg-warning/10 text-warning';
}

function examScore(item: CurrentAffairsHeadlineReviewItem, family: string) {
  return item.examScores.find((score) => score.examFamily === family)?.score ?? 0;
}

type HeadlineFilter = 'all' | 'selected' | 'high_score' | 'selected_pending';

function isReadyStatus(status: string | null | undefined) {
  return ['ready', 'manual', 'approved'].includes(String(status ?? ''));
}

function currentAffairsPipeline(item: CurrentAffairsHeadlineReviewItem, event?: CurrentAffairsEditorialQueueItem) {
  if (!item.manualSelected) {
    return { label: 'Not selected by admin', tone: 'border-border bg-muted/40 text-muted-foreground' };
  }
  if (!item.linkedEventId) {
    return { label: 'Selected · review event linking', tone: 'border-warning/30 bg-warning/10 text-warning' };
  }
  if (item.linkedEventStatus === 'rejected' || item.linkedEventStatus === 'error') {
    return { label: 'Selected · verification blocked', tone: 'border-destructive/30 bg-destructive/10 text-destructive' };
  }
  if (item.linkedEventStatus !== 'verified') {
    return { label: 'Selected · verification required', tone: 'border-warning/30 bg-warning/10 text-warning' };
  }
  if (!event) {
    return { label: 'Verified · editorial state loading', tone: 'border-success/30 bg-success/10 text-success' };
  }
  if (event.hasOpenConflict) {
    return { label: 'Verified · factual conflict needs resolution', tone: 'border-destructive/30 bg-destructive/10 text-destructive' };
  }
  if (!isReadyStatus(event.authoringStatus)) {
    return { label: `Verified · English ${titleCase(event.authoringStatus)}`, tone: 'border-warning/30 bg-warning/10 text-warning' };
  }
  const hindiReady = isReadyStatus(event.hindiStatus);
  const punjabiReady = isReadyStatus(event.punjabiStatus);
  if (!hindiReady || !punjabiReady) {
    const pending = [!hindiReady ? 'HI' : null, !punjabiReady ? 'PA' : null].filter(Boolean).join(' + ');
    return { label: `Verified · English ready · ${pending} pending`, tone: 'border-warning/30 bg-warning/10 text-warning' };
  }
  return { label: 'Verified · English / Hindi / Punjabi ready', tone: 'border-success/30 bg-success/10 text-success' };
}

export function CurrentAffairsEditorialQueuePage() {
  const { hasPermission } = useAdminPermissions();
  const canSelect = hasPermission('content.questions.update');
  const [headlineDate, setHeadlineDate] = useState(indiaYesterday());
  const [headlineFilter, setHeadlineFilter] = useState<HeadlineFilter>('all');
  const [headlines, setHeadlines] = useState<CurrentAffairsHeadlineReview | null>(null);
  const [events, setEvents] = useState<CurrentAffairsEditorialQueue | null>(null);
  const [questions, setQuestions] = useState<CurrentAffairsQuestionEditorialQueue | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingCandidateId, setSavingCandidateId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [nextHeadlines, nextEvents, nextQuestions] = await Promise.all([
        getCurrentAffairsHeadlineReview(headlineDate, 1200),
        getCurrentAffairsEditorialQueue(300),
        getCurrentAffairsQuestionEditorialQueue(300),
      ]);
      setHeadlines(nextHeadlines);
      setEvents(nextEvents);
      setQuestions(nextQuestions);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Current Affairs editorial queues.');
    } finally {
      setLoading(false);
    }
  }, [headlineDate]);

  useEffect(() => { void refresh(); }, [refresh]);

  const eventById = useMemo(
    () => new Map((events?.items ?? []).map((event) => [event.id, event])),
    [events],
  );

  const headlineGroups = useMemo(() => {
    const grouped = new Map<string, CurrentAffairsHeadlineReviewItem[]>();
    for (const item of headlines?.items ?? []) {
      const event = item.linkedEventId ? eventById.get(item.linkedEventId) : undefined;
      const pipeline = currentAffairsPipeline(item, event);
      const visible = headlineFilter === 'all'
        || (headlineFilter === 'selected' && item.manualSelected)
        || (headlineFilter === 'high_score' && item.relevanceScore >= 65)
        || (headlineFilter === 'selected_pending' && item.manualSelected && !pipeline.label.includes('English / Hindi / Punjabi ready'));
      if (!visible) continue;
      const bucket = grouped.get(item.category) ?? [];
      bucket.push(item);
      grouped.set(item.category, bucket);
    }
    return [...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [eventById, headlineFilter, headlines]);

  const toggleHeadline = useCallback(async (item: CurrentAffairsHeadlineReviewItem) => {
    setSavingCandidateId(item.candidateId);
    try {
      const selected = !item.manualSelected;
      const reason = selected
        ? 'Admin selected this headline as important in Current Affairs review.'
        : 'Admin removed the manual importance override in Current Affairs review.';
      await setCurrentAffairsHeadlineSelection(item.candidateId, selected, reason);
      setHeadlines((current) => {
        if (!current) return current;
        const wasSelected = current.items.find((candidate) => candidate.candidateId === item.candidateId)?.manualSelected ?? false;
        const delta = Number(selected) - Number(wasSelected);
        return {
          ...current,
          items: current.items.map((candidate) => candidate.candidateId === item.candidateId ? {
            ...candidate,
            manualSelected: selected,
            selectionReason: selected ? reason : null,
            selectionAt: selected ? new Date().toISOString() : null,
          } : candidate),
          counts: { ...current.counts, selected: Math.max(0, current.counts.selected + delta) },
        };
      });
      showToast.success(
        selected ? 'Headline selected' : 'Manual selection removed',
        selected
          ? 'Current Affairs selection accepted. The headline now enters review/verification; selection does not bypass factual or multilingual gates.'
          : 'The manual importance override was removed; no verified or published content was deleted.',
      );
      await refresh();
    } catch (caught) {
      showToast.error('Unable to update headline selection', caught instanceof Error ? caught.message : 'Unknown error');
    } finally {
      setSavingCandidateId(null);
    }
  }, [refresh]);

  if (loading && !headlines && !events && !questions) {
    return <div className="flex min-h-[360px] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading Current Affairs editorial review…</div>;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Current Affairs Editorial Review"
        description="Review every discovered Current Affairs headline, use relevance as advice, and explicitly select the affairs you want the pipeline to process. Verification, conflicts, EN/HI/PA parity and final approval remain mandatory."
        icon={<ShieldCheck className="h-5 w-5" />}
        actions={<div className="flex flex-wrap gap-2"><Button variant="outline" asChild><Link to="/content/current-affairs/production-readiness">Production readiness</Link></Button><Button variant="outline" onClick={() => void refresh()} disabled={loading}><RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />Refresh</Button></div>}
      />

      {error ? <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">{error}</div> : null}

      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base"><Newspaper className="h-4 w-4" />Headline selection</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Every captured headline for the selected India-calendar date stays visible, including auto-withheld candidates. Use the prominent Select headline button to mark an affair important.</p>
            </div>
            <div className="flex items-center gap-2">
              <Input type="date" value={headlineDate} onChange={(event) => setHeadlineDate(event.target.value)} className="w-[160px]" />
              <Button variant="outline" onClick={() => void refresh()} disabled={loading}>Load</Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline">{headlines?.counts.total ?? 0} discovered</Badge>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">{headlines?.counts.selected ?? 0} manually selected</Badge>
            <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">{headlines?.counts.autoWithheld ?? 0} auto withheld but visible</Badge>
            <Badge variant="outline">{headlines?.counts.linkedEvents ?? 0} linked to events</Badge>
            <Badge variant="outline">{headlines?.counts.critical ?? 0} critical · {headlines?.counts.high ?? 0} high</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {([
              ['all', 'All headlines'],
              ['selected', 'Selected only'],
              ['high_score', 'High score 65+'],
              ['selected_pending', 'Selected pending'],
            ] as Array<[HeadlineFilter, string]>).map(([value, label]) => (
              <Button key={value} type="button" size="sm" variant={headlineFilter === value ? 'default' : 'outline'} onClick={() => setHeadlineFilter(value)} className="cursor-pointer">
                {label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {headlineGroups.map(([category, items]) => (
            <section key={category} className="space-y-2">
              <div className="flex items-center gap-2 border-b pb-2"><span className="text-sm font-semibold">{titleCase(category)}</span><Badge variant="outline">{items.length}</Badge></div>
              <div className="space-y-2">
                {items.map((item) => {
                  const event = item.linkedEventId ? eventById.get(item.linkedEventId) : undefined;
                  const pipeline = currentAffairsPipeline(item, event);
                  const saving = savingCandidateId === item.candidateId;
                  return (
                    <div key={item.candidateId} className={cn('rounded-lg border p-4 transition-colors', item.manualSelected && 'border-primary/40 bg-primary/[0.03]')}>
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className={scoreTone(item.relevanceScore)}>Relevance {item.relevanceScore}</Badge>
                            <Badge variant="outline" className={priorityTone(item.priorityTier)}>{titleCase(item.priorityTier)}</Badge>
                            <Badge variant="outline" className={statusClass(item.candidateStatus)}>{titleCase(item.candidateStatus)}</Badge>
                            {!item.autoEligible ? <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive"><AlertTriangle className="mr-1 h-3 w-3" />Auto withheld</Badge> : null}
                            {item.manualSelected ? <Badge variant="outline" className="border-success/30 bg-success/10 text-success"><CheckCircle2 className="mr-1 h-3 w-3" />Admin selected</Badge> : null}
                          </div>
                          <p className="mt-2 text-sm font-semibold leading-6">{item.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{item.sourceName} · trust {Math.round(item.sourceTrustScore * 100)}%{item.isPrimarySource ? ' · primary source' : ''}{item.linkedEventCode ? ` · ${item.linkedEventCode} (${item.linkedEventStatus})` : ''}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="outline" className={scoreTone(examScore(item, 'ssc'))}>SSC {examScore(item, 'ssc')}</Badge>
                            <Badge variant="outline" className={scoreTone(examScore(item, 'banking'))}>Banking {examScore(item, 'banking')}</Badge>
                            <Badge variant="outline" className={scoreTone(examScore(item, 'punjab'))}>Punjab {examScore(item, 'punjab')}</Badge>
                            <Badge variant="outline">Discovery {item.discoveryScore}</Badge>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Current Affairs pipeline</span>
                            <Badge variant="outline" className={pipeline.tone}><ShieldCheck className="mr-1 h-3 w-3" />{pipeline.label}</Badge>
                            {event && item.linkedEventStatus === 'verified' ? <>
                              <Badge variant="outline" className={statusClass(event.authoringStatus)}>EN {titleCase(event.authoringStatus)}</Badge>
                              <Badge variant="outline" className={statusClass(event.hindiStatus)}>HI {titleCase(event.hindiStatus)}</Badge>
                              <Badge variant="outline" className={statusClass(event.punjabiStatus)}>PA {titleCase(event.punjabiStatus)}</Badge>
                            </> : null}
                          </div>
                          {item.priorityReasons.length > 0 ? <p className="mt-2 text-xs text-muted-foreground">Signal: {item.priorityReasons.join(' · ')}</p> : null}
                          {item.rejectionReason ? <p className="mt-1 text-xs text-destructive">Automated triage note: {item.rejectionReason}</p> : null}
                        </div>
                        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:min-w-[210px]">
                          <div className="flex flex-wrap justify-end gap-2">
                            {item.sourceUrl ? <Button size="sm" variant="outline" asChild><a href={item.sourceUrl} target="_blank" rel="noreferrer">Source</a></Button> : null}
                            {item.linkedEventId ? <Button size="sm" variant="outline" asChild><Link to={`/content/current-affairs/events/${item.linkedEventId}`}>Open event</Link></Button> : null}
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            aria-pressed={item.manualSelected}
                            title={!canSelect ? 'Your role cannot change Current Affairs headline selection.' : item.manualSelected ? 'Click to remove this manual Current Affairs selection.' : 'Click to select this Current Affairs headline as important.'}
                            variant={item.manualSelected ? 'outline' : 'default'}
                            disabled={!canSelect || saving}
                            onClick={() => void toggleHeadline(item)}
                            className={cn(
                              'min-h-10 w-full font-semibold shadow-sm',
                              canSelect && 'cursor-pointer',
                              item.manualSelected
                                ? 'border-success/40 bg-success/10 text-success hover:bg-success/20'
                                : 'ring-1 ring-primary/20 hover:shadow-md',
                            )}
                          >
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : item.manualSelected ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Star className="mr-2 h-4 w-4" />}
                            {saving ? 'Saving selection…' : item.manualSelected ? 'Selected — click to undo' : 'Select headline'}
                          </Button>
                          <p className="text-right text-[11px] leading-4 text-muted-foreground">
                            {item.manualSelected ? 'Manual importance override is active. Verification still decides factual readiness.' : 'This is an editorial choice; the relevance score will not block your selection.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
          {headlines && headlines.items.length > 0 && headlineGroups.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No headlines match this Current Affairs filter.</p> : null}
          {headlines && headlines.items.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No discovery headlines were captured for {headlineDate}. Generate/replay the date first, then review the resulting headline inventory here.</p> : null}
          {!canSelect ? <p className="text-xs text-muted-foreground">Your admin role can review scores but does not have permission to change headline selection.</p> : null}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <Metric label="Verified events" value={events?.counts.total ?? 0} />
        <Metric label="Event needs review" value={events?.counts.needsEditorial ?? 0} />
        <Metric label="Event conflicts" value={events?.counts.conflicts ?? 0} />
        <Metric label="Event ready" value={events?.counts.ready ?? 0} />
        <Metric label="Questions" value={questions?.counts.total ?? 0} />
        <Metric label="Unreviewed" value={questions?.counts.unreviewed ?? 0} />
        <Metric label="Approvable" value={questions?.counts.approvable ?? 0} />
        <Metric label="Approved" value={questions?.counts.approved ?? 0} />
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Newspaper className="h-4 w-4" />Verified event wording</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {(events?.items ?? []).map((item) => (
            <Link key={item.id} to={`/content/current-affairs/events/${item.id}`} className="block">
              <div className="rounded-lg border p-4 transition-colors hover:border-primary/40 hover:bg-accent/30">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><span className="font-semibold">{item.publicCode}</span><Badge variant="outline" className={statusClass(item.authoringStatus)}>{titleCase(item.authoringStatus)}</Badge><Badge variant="outline">{item.category}</Badge>{item.hasOpenConflict ? <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive"><AlertTriangle className="mr-1 h-3 w-3" />Conflict</Badge> : null}</div>
                    <p className="mt-2 text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.eventDate} · {item.verifiedFactCount} verified facts · {item.primarySourceName ?? item.primarySourceKey ?? 'Source unavailable'}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs"><Badge variant="outline" className={statusClass(item.hindiStatus)}><Languages className="mr-1 h-3 w-3" />HI {titleCase(item.hindiStatus)}</Badge><Badge variant="outline" className={statusClass(item.punjabiStatus)}>PA {titleCase(item.punjabiStatus)}</Badge></div>
                </div>
              </div>
            </Link>
          ))}
          {events && events.items.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">No verified Current Affairs events are waiting in the editorial surface.</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileQuestion className="h-4 w-4" />BANK_ONLY question review</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {(questions?.items ?? []).map((item) => {
            const stem = String(item.sourcePayload.stem ?? item.sourcePayload.text ?? 'Untitled Current Affairs question');
            return (
              <Link key={item.generationItemId} to={`/content/current-affairs/questions/${item.generationItemId}`} className="block">
                <div className="rounded-lg border p-4 transition-colors hover:border-primary/40 hover:bg-accent/30">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-semibold">{item.eventPublicCode} · Q{item.itemNumber}</span><Badge variant="outline" className={statusClass(item.generationItemStatus)}>{titleCase(item.generationItemStatus)}</Badge><Badge variant="outline">{item.questionFamily}</Badge>{item.readiness.approvable ? <Badge variant="outline" className="border-success/30 bg-success/10 text-success"><CheckCircle2 className="mr-1 h-3 w-3" />Approvable</Badge> : null}</div><p className="mt-2 line-clamp-2 text-sm">{stem}</p><p className="mt-1 text-xs text-muted-foreground">{titleCase(item.factKey)}: {item.factValue} · HI {item.hindiStatus ?? 'missing'} · PA {item.punjabiStatus ?? 'missing'}</p>{item.readiness.blockers.length > 0 ? <p className="mt-2 line-clamp-1 text-xs text-warning">{item.readiness.blockers.join(' · ')}</p> : null}</div>
                    <div className="text-xs text-muted-foreground">{item.activeReleaseCode ?? (item.promotionId ? 'Already promoted' : item.acceptedQuestionId ? 'Bank accepted' : 'Editorial lifecycle')}</div>
                  </div>
                </div>
              </Link>
            );
          })}
          {questions && questions.items.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">No BANK_ONLY Current Affairs questions are waiting.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <Card><CardContent className="p-4"><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></CardContent></Card>;
}

export default CurrentAffairsEditorialQueuePage;
