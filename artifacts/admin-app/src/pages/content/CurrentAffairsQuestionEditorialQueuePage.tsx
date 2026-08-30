import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, FileQuestion, Loader2, RefreshCw, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  getCurrentAffairsQuestionEditorialQueue,
  type CurrentAffairsQuestionEditorialQueue,
} from '@/features/current-affairs/question-editorial-api';
import { cn } from '@/lib/utils';

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function statusClass(status: string) {
  if (['approved', 'ready', 'manual'].includes(status)) return 'border-success/30 bg-success/10 text-success';
  if (['unreviewed', 'needs_editorial', 'missing'].includes(status)) return 'border-warning/30 bg-warning/10 text-warning';
  return 'border-border bg-muted/40 text-muted-foreground';
}

export function CurrentAffairsQuestionEditorialQueuePage() {
  const [data, setData] = useState<CurrentAffairsQuestionEditorialQueue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setData(await getCurrentAffairsQuestionEditorialQueue(300));
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Current Affairs question review queue.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  if (loading && !data) return <div className="flex min-h-[360px] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading Current Affairs question review…</div>;

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" asChild><Link to="/content/current-affairs"><ArrowLeft className="mr-2 h-4 w-4" />Current Affairs Studio</Link></Button>
      <PageHeader title="Current Affairs Question Review" description="Review BANK_ONLY English Current Affairs questions and their current Hindi/Punjabi parity before CP014 release approval." icon={<FileQuestion className="h-5 w-5" />} actions={<Button variant="outline" onClick={() => void refresh()} disabled={loading}><RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />Refresh</Button>} />
      {error ? <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">{error}</div> : null}
      {data ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Total', data.counts.total],
          ['Unreviewed', data.counts.unreviewed],
          ['Approvable', data.counts.approvable],
          ['Approved', data.counts.approved],
          ['Locked', data.counts.locked],
        ].map(([label, value]) => <Card key={String(label)}><CardContent className="p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></CardContent></Card>)}
      </div> : null}
      <div className="space-y-2">
        {data?.items.map((item) => {
          const stem = String(item.sourcePayload.stem ?? item.sourcePayload.text ?? 'Untitled Current Affairs question');
          return <Link key={item.generationItemId} to={`/content/current-affairs/questions/${item.generationItemId}`} className="block"><Card className="transition-colors hover:border-primary/40 hover:bg-accent/30"><CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{item.eventPublicCode} · Item {item.itemNumber}</p><Badge variant="outline" className={statusClass(item.generationItemStatus)}>{titleCase(item.generationItemStatus)}</Badge><Badge variant="outline">{item.questionFamily}</Badge>{item.readiness.approvable ? <Badge variant="outline" className="border-success/30 bg-success/10 text-success"><CheckCircle2 className="mr-1 h-3 w-3" />Ready</Badge> : null}</div><p className="mt-2 line-clamp-2 text-sm">{stem}</p><p className="mt-2 text-xs text-muted-foreground">{titleCase(item.factKey)}: {item.factValue} · HI {item.hindiStatus ?? 'missing'} · PA {item.punjabiStatus ?? 'missing'} · version {item.sourceVersionNumber}</p>{item.readiness.blockers.length > 0 ? <p className="mt-2 line-clamp-1 text-xs text-warning">{item.readiness.blockers.join(' · ')}</p> : null}</div><div className="flex items-center gap-2 text-xs text-muted-foreground">{item.activeReleaseCode || item.promotionId || item.acceptedQuestionId ? <ShieldAlert className="h-4 w-4 text-warning" /> : null}<span>{item.activeReleaseCode ?? (item.promotionId ? 'Promoted' : item.acceptedQuestionId ? 'Bank accepted' : 'Review lifecycle')}</span></div></CardContent></Card></Link>;
        })}
        {data && data.items.length === 0 ? <Card><CardContent className="p-6 text-sm text-muted-foreground">No Current Affairs Question Studio items are waiting.</CardContent></Card> : null}
      </div>
    </div>
  );
}

export default CurrentAffairsQuestionEditorialQueuePage;
