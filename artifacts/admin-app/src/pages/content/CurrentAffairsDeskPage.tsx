import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, Loader2, Newspaper, RefreshCw, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  autoPickCurrentAffairsHeadlines,
  getDailyPackPublication,
  publishDailyPack,
  withdrawDailyPack,
  type DailyPackPublication,
} from '@/features/current-affairs/desk-api';
import { getCurrentAffairsHeadlineReview, type CurrentAffairsHeadlineReview } from '@/features/current-affairs/editorial-api';
import {
  approveDailyMasterPack,
  getCurrentAffairsDailyMasterPacks,
  getDailyMasterPackApprovalState,
  revokeDailyMasterPackApproval,
  type DailyMasterPackApprovalState,
  type DailyMasterPackLanguage,
  type DailyMasterPackSet,
} from '@/features/current-affairs/production-ops-api';
import { processCurrentAffairsSelected, type CurrentAffairsSelectedProcessingResult } from '@/features/current-affairs/selected-processing-api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

const LANGUAGES: Array<{ code: DailyMasterPackLanguage; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
];

type DeskData = {
  headlines: CurrentAffairsHeadlineReview;
  packs: DailyMasterPackSet;
  approval: DailyMasterPackApprovalState;
  publication: DailyPackPublication;
};

function yesterdayInIndia() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date(Date.now() - 86_400_000));
}

const readable = (value: string) => value.replace(/_/g, ' ');

function Step({ number, title, done, summary, children }: { number: number; title: string; done: boolean; summary: string; children: ReactNode }) {
  return (
    <Card className={done ? 'border-success/30' : undefined}>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {done ? <CheckCircle2 className="h-4 w-4 text-success" aria-label="Done" /> : number}
          </span>
          <div>
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{summary}</p>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export function CurrentAffairsDeskPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const canPublish = hasPermission('content.questions.publish');
  const [date, setDate] = useState(yesterdayInIndia);
  const [data, setData] = useState<DeskData | null>(null);
  const [processed, setProcessed] = useState<CurrentAffairsSelectedProcessingResult | null>(null);
  const [language, setLanguage] = useState<DailyMasterPackLanguage>('en');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const latest = useRef(0);

  const refresh = useCallback(async () => {
    const request = ++latest.current;
    try {
      const [headlines, packs, approval, publication] = await Promise.all([
        getCurrentAffairsHeadlineReview(date),
        getCurrentAffairsDailyMasterPacks(date),
        getDailyMasterPackApprovalState(date),
        getDailyPackPublication(date),
      ]);
      // A slower response for a previously chosen date must not replace this one.
      if (request !== latest.current) return;
      setData({ headlines, packs: packs.masterPacks, approval, publication });
      setError(null);
    } catch (caught) {
      if (request === latest.current) setError(caught instanceof Error ? caught.message : 'Unable to load this date.');
    }
  }, [date]);

  useEffect(() => { setData(null); setProcessed(null); void refresh(); }, [refresh]);

  const run = async (key: string, action: () => Promise<string>) => {
    setBusy(key);
    try {
      showToast.success(await action());
    } catch (caught) {
      showToast.error('Action failed', caught instanceof Error ? caught.message : 'Unknown error');
    } finally {
      await refresh();
      setBusy(null);
    }
  };

  const selected = data?.headlines.counts.selected ?? 0;
  const approval = data?.approval.candidate.activeApproval ?? null;
  const approvalReady = data?.approval.candidate.readiness.ready ?? false;
  const published = data?.publication.publication ?? null;
  const blockedItems = processed?.targetDate === date ? processed.items.filter((item) => !item.ready) : [];
  const prepared = Boolean(approval) || approvalReady;
  const pack = data?.packs[language] ?? null;
  const spinner = (key: string, icon: ReactNode) => busy === key ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : icon;
  const locked = !canEdit || busy !== null || !data;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Daily Current Affairs"
        description="Pick the stories, prepare three languages, then publish to students."
        icon={<Newspaper className="h-5 w-5" />}
        actions={<>
          <Input type="date" aria-label="News date" value={date} max={yesterdayInIndia()} disabled={busy !== null} onChange={(event) => event.target.value && setDate(event.target.value)} className="w-[160px]" />
          <Button variant="outline" size="icon" aria-label="Refresh" disabled={busy !== null} onClick={() => void refresh()}><RefreshCw className="h-4 w-4" /></Button>
        </>}
      />

      {error ? <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}
      {!data && !error ? <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading…</p> : null}
      {data && !canEdit ? <p className="text-sm text-muted-foreground">You have read-only access.</p> : null}

      {data ? <>
        <Step number={1} title="Pick stories" done={selected > 0} summary={`${selected} picked from ${data.headlines.counts.total} headlines`}>
          <div className="flex flex-wrap gap-2">
            <Button disabled={locked || Boolean(approval)} onClick={() => void run('pick', async () => {
              const result = await autoPickCurrentAffairsHeadlines(date);
              return result.pickedCount ? `Picked ${result.pickedCount} stories` : 'No new verifiable stories to pick';
            })}>{spinner('pick', <Sparkles className="mr-2 h-4 w-4" />)}Auto-pick top stories</Button>
            <Button variant="outline" asChild><Link to="/content/current-affairs/headlines">Choose or remove stories</Link></Button>
          </div>
        </Step>

        <Step number={2} title="Prepare packs" done={prepared} summary={prepared ? 'English, Hindi and Punjabi passed the checks' : 'Verifies facts and builds English, Hindi and Punjabi'}>
          <Button disabled={locked || selected === 0 || Boolean(approval)} onClick={() => void run('prepare', async () => {
            const result = await processCurrentAffairsSelected(date);
            setProcessed(result);
            return `${result.summary.ready} ready, ${result.summary.blocked} need attention`;
          })}>{spinner('prepare', null)}Prepare {selected} picked {selected === 1 ? 'story' : 'stories'}</Button>
          {blockedItems.length ? <ul className="space-y-2">{blockedItems.map((item) => (
            <li key={item.eventId ?? item.selectedCandidateIds[0]} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-warning/30 bg-warning/5 p-3 text-sm">
              <span className="min-w-0"><span className="font-medium">{item.title}</span><span className="block text-xs text-muted-foreground">{item.blockers.map(readable).join(', ')}</span></span>
              {item.eventId ? <Button size="sm" variant="outline" asChild><Link to={`/content/current-affairs/events/${item.eventId}`}>Fix</Link></Button> : null}
            </li>
          ))}</ul> : null}
        </Step>

        <Step number={3} title="Review and publish" done={Boolean(published)} summary={published ? `Live for students since ${new Date(published.publishedAt).toLocaleString('en-IN')}` : approval ? 'Approved, not yet visible to students' : 'Read the pack before approving'}>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Preview language">
            {LANGUAGES.map((item) => <Button key={item.code} size="sm" variant={language === item.code ? 'default' : 'outline'} aria-pressed={language === item.code} onClick={() => setLanguage(item.code)}>{item.label}</Button>)}
          </div>
          {pack ? <div>
            <Badge variant="outline">{pack.eventCount} stories</Badge>
            <pre lang={language} className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded-md border bg-muted/30 p-3 font-sans text-sm leading-6">{pack.bodyMarkdown}</pre>
          </div> : <p className="text-sm text-muted-foreground">No pack for this language yet.</p>}

          {!approval && data.approval.candidate.readiness.blockers.length ? <ul className="list-disc space-y-1 pl-5 text-sm text-warning">
            {data.approval.candidate.readiness.blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
          </ul> : null}
          {approval && !published && !data.publication.readiness.ready ? <ul className="list-disc pl-5 text-sm text-warning">
            {data.publication.readiness.blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
          </ul> : null}

          <div className="flex flex-wrap gap-2 border-t pt-4">
            {!approval ? <Button disabled={locked || !approvalReady} onClick={() => void run('approve', async () => {
              await approveDailyMasterPack(date, 'Reviewed and approved from the daily desk.');
              return 'Pack approved';
            })}>{spinner('approve', <CheckCircle2 className="mr-2 h-4 w-4" />)}Approve all three languages</Button> : null}
            {approval && !published ? <>
              <Button disabled={locked || !canPublish || !data.publication.readiness.ready} onClick={() => {
                if (!window.confirm(`Publish the ${date} pack to all students?`)) return;
                void run('publish', async () => { await publishDailyPack(date); return 'Published to students'; });
              }}>{spinner('publish', <Send className="mr-2 h-4 w-4" />)}Publish to students</Button>
              <Button variant="outline" disabled={locked} onClick={() => {
                const reason = window.prompt('What needs to change? (at least 8 characters)');
                if (reason) void run('reopen', async () => { await revokeDailyMasterPackApproval(approval.id, reason); return 'Reopened for editing'; });
              }}>Reopen for editing</Button>
            </> : null}
            {published ? <Button variant="outline" disabled={locked || !canPublish} onClick={() => {
              const reason = window.prompt('Why are you withdrawing this pack? (at least 8 characters)');
              if (reason) void run('withdraw', async () => { await withdrawDailyPack(date, reason); return 'Withdrawn from students'; });
            }}>{spinner('withdraw', null)}Withdraw</Button> : null}
          </div>
        </Step>
      </> : null}

      <p className="text-sm text-muted-foreground"><Link className="underline" to="/content/current-affairs/production-readiness">Pipeline health, past packs and downloads</Link></p>
    </div>
  );
}
