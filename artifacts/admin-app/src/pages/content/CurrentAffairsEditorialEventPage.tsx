import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, ExternalLink, Languages, Loader2, RefreshCw, Save, ShieldCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  getCurrentAffairsEditorialEvent,
  saveCurrentAffairsEditorialEnglish,
  saveCurrentAffairsEditorialLocalization,
  type CurrentAffairsEditorialDetail,
} from '@/features/current-affairs/editorial-api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

type Draft = { title: string; summary: string; oneLiner: string; reason: string };
const emptyDraft: Draft = { title: '', summary: '', oneLiner: '', reason: '' };

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function CurrentAffairsEditorialEventPage() {
  const { eventId = '' } = useParams();
  const { hasPermission } = useAdminPermissions();
  const canUpdate = hasPermission('content.questions.update');
  const [data, setData] = useState<CurrentAffairsEditorialDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [english, setEnglish] = useState<Draft>(emptyDraft);
  const [hindi, setHindi] = useState<Draft>(emptyDraft);
  const [punjabi, setPunjabi] = useState<Draft>(emptyDraft);

  const hydrateDrafts = useCallback((detail: CurrentAffairsEditorialDetail) => {
    const hi = detail.localizations.find((item) => item.languageCode === 'hi');
    const pa = detail.localizations.find((item) => item.languageCode === 'pa');
    setEnglish({ title: detail.event.learnerTitle ?? detail.event.canonicalTitle ?? '', summary: detail.event.learnerSummary ?? detail.event.canonicalSummary ?? '', oneLiner: detail.event.learnerOneLiner ?? '', reason: '' });
    setHindi({ title: hi?.localizedTitle ?? '', summary: hi?.localizedSummary ?? '', oneLiner: hi?.localizedOneLiner ?? '', reason: '' });
    setPunjabi({ title: pa?.localizedTitle ?? '', summary: pa?.localizedSummary ?? '', oneLiner: pa?.localizedOneLiner ?? '', reason: '' });
  }, []);

  const refresh = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const next = await getCurrentAffairsEditorialEvent(eventId);
      setData(next);
      hydrateDrafts(next);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Current Affairs event editorial workspace.');
    } finally {
      setLoading(false);
    }
  }, [eventId, hydrateDrafts]);

  useEffect(() => { void refresh(); }, [refresh]);

  const baseWritable = Boolean(canUpdate && data?.gates.eventVerified && data.gates.hasVerifiedFacts && !data.gates.hasOpenConflict);
  const localizationWritable = Boolean(baseWritable && data?.gates.authoringCurrent && ['ready', 'manual'].includes(data?.event.authoringStatus ?? ''));

  const saveEnglish = async () => {
    if (!eventId || !baseWritable) return;
    setSaving('en');
    try {
      await saveCurrentAffairsEditorialEnglish(eventId, english);
      showToast.success('English editorial revision saved', 'A new source-independent Current Affairs authoring version was created.');
      await refresh();
    } catch (caught) {
      showToast.error('Unable to save English revision', caught instanceof Error ? caught.message : 'Request failed.');
    } finally {
      setSaving(null);
    }
  };

  const saveLocalization = async (languageCode: 'hi' | 'pa', draft: Draft) => {
    if (!eventId || !localizationWritable) return;
    setSaving(languageCode);
    try {
      await saveCurrentAffairsEditorialLocalization(eventId, languageCode, draft);
      showToast.success(`${languageCode === 'hi' ? 'Hindi' : 'Punjabi'} revision saved`, 'Canonical-fact parity and target-script gates passed.');
      await refresh();
    } catch (caught) {
      showToast.error('Unable to save localization', caught instanceof Error ? caught.message : 'Request failed.');
    } finally {
      setSaving(null);
    }
  };

  const openConflicts = useMemo(() => data?.conflicts.filter((item) => item.status === 'open') ?? [], [data]);

  if (loading && !data) return <div className="flex min-h-[360px] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading verified event evidence…</div>;

  if (!data) {
    return <div className="space-y-4"><Button variant="ghost" size="sm" asChild><Link to="/content/current-affairs"><ArrowLeft className="mr-2 h-4 w-4" />Editorial queue</Link></Button><Card><CardContent className="p-6 text-sm text-destructive">{error ?? 'Event not available.'}</CardContent></Card></div>;
  }

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" asChild><Link to="/content/current-affairs"><ArrowLeft className="mr-2 h-4 w-4" />Editorial queue</Link></Button>
      <PageHeader title={`${data.event.publicCode} · Event Editorial`} description={`${data.event.eventDate} · ${data.event.category} · Edit learner wording only from the verified fact set below.`} icon={<ShieldCheck className="h-5 w-5" />} actions={<Button variant="outline" onClick={() => void refresh()} disabled={loading || Boolean(saving)}><RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />Refresh</Button>} />

      {error ? <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">{error}</div> : null}
      {!canUpdate ? <GateMessage text="You have read-only access. content.questions.update is required to save editorial revisions." /> : null}
      {data.gates.hasOpenConflict ? <GateMessage destructive text="Editing is blocked while this event has an open fact conflict." /> : null}
      {!data.gates.hasVerifiedFacts ? <GateMessage destructive text="Editing is blocked because this event has no verified canonical facts." /> : null}

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader><CardTitle className="text-base">Verified event context</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><div className="flex flex-wrap gap-2"><Badge variant="outline">{titleCase(data.event.eventStatus)}</Badge><Badge variant="outline">Authoring {titleCase(data.event.authoringStatus)}</Badge><Badge variant="outline">Confidence {Math.round((data.event.verificationConfidence ?? 0) * 100)}%</Badge></div><h2 className="mt-3 text-lg font-semibold">{data.event.canonicalTitle}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{data.event.canonicalSummary}</p></div>
            <div className="space-y-2"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Canonical facts</p>{data.facts.map((fact) => <div key={fact.id} className={cn('rounded-lg border p-3 text-sm', fact.isVerified ? '' : 'opacity-60')}><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-medium">{titleCase(fact.factKey)}</span>{fact.isVerified ? <Badge variant="outline" className="border-success/30 bg-success/10 text-success"><CheckCircle2 className="mr-1 h-3 w-3" />Verified</Badge> : <Badge variant="outline">Unverified</Badge>}</div><p className="mt-1">{fact.factValue}</p><p className="mt-1 text-xs text-muted-foreground">Support {fact.supportCount} · primary {fact.primarySupportCount} · confidence {Math.round((fact.confidence ?? 0) * 100)}%</p></div>)}</div>
            {openConflicts.length > 0 ? <div className="space-y-2"><p className="text-xs font-semibold uppercase tracking-wide text-destructive">Open conflicts</p>{openConflicts.map((conflict) => <div key={conflict.id} className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><AlertTriangle className="mr-2 inline h-4 w-4" />{titleCase(conflict.factKey)} requires resolution before editorial changes.</div>)}</div> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Evidence sources</CardTitle></CardHeader>
          <CardContent className="space-y-2">{data.sources.map((source) => <div key={`${source.sourceKey}-${source.sourceUrl}`} className="rounded-lg border p-3 text-sm"><div className="flex items-start justify-between gap-2"><div><p className="font-medium">{source.sourceName}</p><p className="mt-1 text-xs text-muted-foreground">{source.sourceTitle}</p></div>{source.isPrimaryEvidence ? <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Primary</Badge> : null}</div><a href={source.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center text-xs text-primary hover:underline">Open source <ExternalLink className="ml-1 h-3 w-3" /></a></div>)}</CardContent>
        </Card>
      </div>

      <EditorialCard title="English learner wording" languageLabel="EN" draft={english} setDraft={setEnglish} writable={baseWritable} saving={saving === 'en'} onSave={() => void saveEnglish()} />
      <div className="grid gap-4 xl:grid-cols-2">
        <EditorialCard title="Hindi localization" languageLabel="HI" draft={hindi} setDraft={setHindi} writable={localizationWritable} saving={saving === 'hi'} onSave={() => void saveLocalization('hi', hindi)} />
        <EditorialCard title="Punjabi localization" languageLabel="PA" draft={punjabi} setDraft={setPunjabi} writable={localizationWritable} saving={saving === 'pa'} onSave={() => void saveLocalization('pa', punjabi)} />
      </div>
      {!localizationWritable && baseWritable ? <GateMessage text="Hindi/Punjabi editing becomes available after the current English authoring version is ready or manually accepted." /> : null}
    </div>
  );
}

function EditorialCard({ title, languageLabel, draft, setDraft, writable, saving, onSave }: { title: string; languageLabel: string; draft: Draft; setDraft: (next: Draft) => void; writable: boolean; saving: boolean; onSave: () => void }) {
  return <Card><CardHeader><CardTitle className="flex items-center justify-between text-base"><span className="flex items-center gap-2"><Languages className="h-4 w-4" />{title}</span><Badge variant="outline">{languageLabel}</Badge></CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-1.5"><Label>Title</Label><Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} disabled={!writable || saving} /></div><div className="space-y-1.5"><Label>Summary</Label><Textarea rows={7} value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} disabled={!writable || saving} /></div><div className="space-y-1.5"><Label>One-liner</Label><Textarea rows={2} value={draft.oneLiner} onChange={(event) => setDraft({ ...draft, oneLiner: event.target.value })} disabled={!writable || saving} /></div><div className="space-y-1.5"><Label>Editorial reason</Label><Textarea rows={2} value={draft.reason} onChange={(event) => setDraft({ ...draft, reason: event.target.value })} placeholder="Required for every manual revision" disabled={!writable || saving} /></div><Button onClick={onSave} disabled={!writable || saving || draft.reason.trim().length < 8}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save revision</Button></CardContent></Card>;
}

function GateMessage({ text, destructive = false }: { text: string; destructive?: boolean }) {
  return <div className={cn('rounded-lg border px-4 py-3 text-sm', destructive ? 'border-destructive/30 bg-destructive/5 text-destructive' : 'border-warning/30 bg-warning/10 text-warning')}>{destructive ? <AlertTriangle className="mr-2 inline h-4 w-4" /> : null}{text}</div>;
}

export default CurrentAffairsEditorialEventPage;
