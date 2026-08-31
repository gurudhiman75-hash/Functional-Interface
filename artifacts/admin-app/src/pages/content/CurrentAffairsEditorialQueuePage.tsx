import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileQuestion, Languages, Loader2, Newspaper, RefreshCw, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getCurrentAffairsEditorialQueue,
  getCurrentAffairsQuestionEditorialQueue,
  type CurrentAffairsEditorialQueue,
  type CurrentAffairsQuestionEditorialQueue,
} from '@/features/current-affairs/editorial-api';
import { cn } from '@/lib/utils';

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status: string) {
  if (['ready', 'manual', 'approved'].includes(status)) return 'border-success/30 bg-success/10 text-success';
  if (['needs_editorial', 'pending', 'unreviewed', 'missing'].includes(status)) return 'border-warning/30 bg-warning/10 text-warning';
  return 'border-border bg-muted/40 text-muted-foreground';
}

export function CurrentAffairsEditorialQueuePage() {
  const [events, setEvents] = useState<CurrentAffairsEditorialQueue | null>(null);
  const [questions, setQuestions] = useState<CurrentAffairsQuestionEditorialQueue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [nextEvents, nextQuestions] = await Promise.all([
        getCurrentAffairsEditorialQueue(300),
        getCurrentAffairsQuestionEditorialQueue(300),
      ]);
      setEvents(nextEvents);
      setQuestions(nextQuestions);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Current Affairs editorial queues.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  if (loading && !events && !questions) {
    return <div className="flex min-h-[360px] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading Current Affairs editorial review…</div>;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Current Affairs Editorial Review"
        description="Review verified event wording and BANK_ONLY Current Affairs questions. This workspace has no release, Question Bank promotion, notification or learner-publication controls."
        icon={<ShieldCheck className="h-5 w-5" />}
        actions={<div className="flex flex-wrap gap-2"><Button variant="outline" asChild><Link to="/content/current-affairs/production-readiness">Production readiness</Link></Button><Button variant="outline" onClick={() => void refresh()} disabled={loading}><RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />Refresh</Button></div>}
      />

      {error ? <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">{error}</div> : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <Metric label="Events" value={events?.counts.total ?? 0} />
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
