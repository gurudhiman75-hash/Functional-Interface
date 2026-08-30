import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  History,
  Languages,
  Loader2,
  Newspaper,
  RefreshCw,
  Save,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  getCurrentAffairsEditorialEvent,
  saveCurrentAffairsEnglishAuthoring,
  saveCurrentAffairsLocalization,
  type CurrentAffairsEditorialWorkbench,
} from '@/features/current-affairs/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

type Draft = { title: string; summary: string; oneLiner: string; reason: string };

const blankDraft: Draft = { title: '', summary: '', oneLiner: '', reason: '' };

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function formatTime(value: string | null | undefined) {
  if (!value) return 'Not observed';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function statusClass(status: string) {
  if (['verified', 'ready', 'manual', 'corroborated', 'primary_backed'].includes(status)) return 'border-success/30 bg-success/10 text-success';
  if (['open', 'needs_editorial', 'pending'].includes(status)) return 'border-warning/30 bg-warning/10 text-warning';
  return 'border-border bg-muted/40 text-muted-foreground';
}

function StatusBadge({ status }: { status: string }) {
  return <Badge variant="outline" className={cn('capitalize', statusClass(status))}>{titleCase(status)}</Badge>;
}

function asReasons(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean).slice(0, 10);
}

function localization(data: CurrentAffairsEditorialWorkbench, languageCode: 'hi' | 'pa') {
  return data.localizations.find((item) => item.languageCode === languageCode) ?? null;
}

function draftFromLocalization(data: CurrentAffairsEditorialWorkbench, languageCode: 'hi' | 'pa'): Draft {
  const item = localization(data, languageCode);
  return {
    title: item?.localizedTitle ?? '',
    summary: item?.localizedSummary ?? '',
    oneLiner: item?.localizedOneLiner ?? '',
    reason: '',
  };
}

function EditorFields({ draft, setDraft, language }: {
  draft: Draft;
  setDraft: (next: Draft) => void;
  language: 'English' | 'Hindi' | 'Punjabi';
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{language} learner title</label>
        <Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} maxLength={language === 'English' ? 240 : 300} />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{language} learner summary</label>
        <Textarea value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} rows={9} maxLength={language === 'English' ? 5000 : 6000} />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">One-line revision cue</label>
        <Textarea value={draft.oneLiner} onChange={(event) => setDraft({ ...draft, oneLiner: event.target.value })} rows={3} maxLength={language === 'English' ? 600 : 1000} />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Editorial reason</label>
        <Textarea value={draft.reason} onChange={(event) => setDraft({ ...draft, reason: event.target.value })} rows={3} maxLength={1000} placeholder="Explain the editorial correction or approval decision (minimum 8 characters)." />
      </div>
    </div>
  );
}

export function CurrentAffairsEditorialWorkbenchPage() {
  const { eventId = '' } = useParams();
  const { hasPermission } = useAdminPermissions();
  const canUpdate = hasPermission('content.questions.update');
  const [data, setData] = useState<CurrentAffairsEditorialWorkbench | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<'en' | 'hi' | 'pa' | null>(null);
  const [english, setEnglish] = useState<Draft>(blankDraft);
  const [hindi, setHindi] = useState<Draft>(blankDraft);
  const [punjabi, setPunjabi] = useState<Draft>(blankDraft);

  const hydrateDrafts = useCallback((next: CurrentAffairsEditorialWorkbench) => {
    setEnglish({
      title: next.event.learnerTitle ?? next.event.canonicalTitle ?? '',
      summary: next.event.learnerSummary ?? next.event.canonicalSummary ?? '',
      oneLiner: next.event.learnerOneLiner ?? '',
      reason: '',
    });
    setHindi(draftFromLocalization(next, 'hi'));
    setPunjabi(draftFromLocalization(next, 'pa'));
  }, []);

  const refresh = useCallback(async (silent = false) => {
    if (!eventId) {
      setError('Current Affairs event ID is missing.');
      setLoading(false);
      return;
    }
    if (!silent) setLoading(true);
    try {
      const next = await getCurrentAffairsEditorialEvent(eventId);
      setData(next);
      hydrateDrafts(next);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load the Current Affairs editorial workbench.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [eventId, hydrateDrafts]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const openConflict = data?.gates.hasOpenConflict ?? false;
  const editBlocked = !canUpdate || !data?.gates.eventVerified || !data?.gates.hasVerifiedFacts || openConflict;
  const verifiedFacts = useMemo(() => data?.facts.filter((fact) => fact.isVerified) ?? [], [data?.facts]);

  const validateDraft = (draft: Draft, languageCode: 'en' | 'hi' | 'pa') => {
    const titleMinimum = languageCode === 'en' ? 12 : 8;
    if (draft.title.trim().length < titleMinimum) return `Title must contain at least ${titleMinimum} characters.`;
    if (draft.summary.trim().length < 20) return 'Summary must contain at least 20 characters.';
    if (draft.reason.trim().length < 8) return 'Editorial reason must contain at least 8 characters.';
    return null;
  };

  const saveEnglish = async () => {
    const validation = validateDraft(english, 'en');
    if (validation) {
      showToast.error('English authoring not saved', validation);
      return;
    }
    setSaving('en');
    try {
      const response = await saveCurrentAffairsEnglishAuthoring(eventId, {
        title: english.title.trim(),
        summary: english.summary.trim(),
        oneLiner: english.oneLiner.trim(),
        reason: english.reason.trim(),
      });
      showToast.success('English learner wording saved', `New immutable authoring version ${response.versionId.slice(0, 8)}… created.`);
      await refresh(true);
    } catch (caught) {
      showToast.error('English authoring blocked', caught instanceof Error ? caught.message : 'Unable to save English learner wording.');
    } finally {
      setSaving(null);
    }
  };

  const saveLocalization = async (languageCode: 'hi' | 'pa', draft: Draft) => {
    const validation = validateDraft(draft, languageCode);
    if (validation) {
      showToast.error(`${languageCode === 'hi' ? 'Hindi' : 'Punjabi'} localization not saved`, validation);
      return;
    }
    setSaving(languageCode);
    try {
      await saveCurrentAffairsLocalization(eventId, languageCode, {
        title: draft.title.trim(),
        summary: draft.summary.trim(),
        oneLiner: draft.oneLiner.trim(),
        reason: draft.reason.trim(),
      });
      showToast.success(`${languageCode === 'hi' ? 'Hindi' : 'Punjabi'} localization saved`, 'Parity and target-script checks passed through the canonical localization runtime.');
      await refresh(true);
    } catch (caught) {
      showToast.error('Localization blocked', caught instanceof Error ? caught.message : 'Unable to save this localization.');
    } finally {
      setSaving(null);
    }
  };

  if (loading && !data) {
    return <div className="flex min-h-[420px] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading editorial workbench…</div>;
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild><Link to="/content/current-affairs"><ArrowLeft className="mr-2 h-4 w-4" />Current Affairs Studio</Link></Button>
        <Card><CardContent className="p-6"><p className="text-sm text-destructive">{error ?? 'Editorial workbench is unavailable.'}</p><Button className="mt-4" onClick={() => void refresh()}><RefreshCw className="mr-2 h-4 w-4" />Retry</Button></CardContent></Card>
      </div>
    );
  }

  const hi = localization(data, 'hi');
  const pa = localization(data, 'pa');
  const authoringReasons = asReasons(data.event.authoringReasons);

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" asChild><Link to="/content/current-affairs"><ArrowLeft className="mr-2 h-4 w-4" />Current Affairs Studio</Link></Button>
      <PageHeader
        title={data.event.publicCode}
        description={`${data.event.eventDate} · ${titleCase(data.event.category)} · Editorial workbench for fact-anchored learner wording.`}
        icon={<Newspaper className="h-5 w-5" />}
        actions={<Button variant="outline" onClick={() => void refresh()} disabled={loading}><RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />Reload canonical state</Button>}
      />

      {error ? <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">Refresh warning: {error}</div> : null}
      {openConflict ? <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="font-semibold">Editorial save is blocked by an open factual conflict.</p><p className="mt-1 text-xs">Resolve the competing canonical fact before changing learner wording. Release remains blocked as well.</p></div></div> : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Event</p><div className="mt-2"><StatusBadge status={data.event.eventStatus} /></div><p className="mt-2 text-xs text-muted-foreground">Verification {Math.round(data.event.verificationConfidence * 100)}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">English</p><div className="mt-2"><StatusBadge status={data.event.authoringStatus} /></div><p className="mt-2 text-xs text-muted-foreground">V{data.event.authoringVersionNumber ?? '—'} · {data.event.authoringMethod ?? 'not authored'}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Hindi</p><div className="mt-2"><StatusBadge status={hi?.status ?? 'missing'} /></div><p className="mt-2 text-xs text-muted-foreground">{hi?.localizationMethod ?? 'Current English version has no Hindi draft'}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Punjabi</p><div className="mt-2"><StatusBadge status={pa?.status ?? 'missing'} /></div><p className="mt-2 text-xs text-muted-foreground">{pa?.localizationMethod ?? 'Current English version has no Punjabi draft'}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Protected facts</p><p className="mt-2 text-2xl font-bold">{verifiedFacts.length}</p><p className="mt-2 text-xs text-muted-foreground">{data.sources.length} evidence source{data.sources.length === 1 ? '' : 's'}</p></CardContent></Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" />Verified fact sheet</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {verifiedFacts.map((fact) => (
                <div key={fact.id} className="rounded-lg border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{titleCase(fact.factKey)}</p><StatusBadge status={fact.reconciliationStatus || 'verified'} /></div>
                  <p className="mt-1 text-sm font-medium leading-6">{fact.factValue}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">confidence {Math.round(fact.confidence * 100)}% · {fact.supportCount} support · {fact.primarySupportCount} primary</p>
                </div>
              ))}
              {verifiedFacts.length === 0 ? <p className="text-sm text-warning">No verified canonical facts are available. Editorial save is disabled.</p> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Evidence sources</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs leading-5 text-muted-foreground">Use these sources to verify facts, not as copy to paraphrase closely. English learner wording remains subject to the source-title similarity gate.</p>
              {data.sources.map((source, index) => (
                <div key={`${source.sourceId}-${source.sourceUrl}`} className="rounded-lg border p-3">
                  <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold">{source.sourceName}</p>{source.isPrimaryEvidence ? <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Primary evidence</Badge> : null}<span className="text-xs text-muted-foreground">#{index + 1}</span></div>
                  <p className="mt-2 text-sm leading-5">{source.sourceTitle || 'Untitled source evidence'}</p>
                  <p className="mt-1 text-xs text-muted-foreground">trust {Math.round(source.trustScore * 100)}% · published {formatTime(source.sourcePublishedAt)}</p>
                  <a className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline" href={source.sourceUrl} target="_blank" rel="noreferrer">Open source <ExternalLink className="h-3 w-3" /></a>
                </div>
              ))}
            </CardContent>
          </Card>

          {data.conflicts.length > 0 ? (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><TriangleAlert className="h-4 w-4 text-warning" />Fact conflicts</CardTitle></CardHeader>
              <CardContent className="space-y-2">{data.conflicts.map((conflict) => <div key={conflict.id} className="rounded-lg border p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-medium">{titleCase(conflict.factKey)}</p><StatusBadge status={conflict.status} /></div>{conflict.preferredValue ? <p className="mt-1 text-xs text-muted-foreground">Preferred: {conflict.preferredValue}</p> : null}{conflict.resolutionReason ? <p className="mt-1 text-xs text-muted-foreground">{conflict.resolutionReason}</p> : null}</div>)}</CardContent>
            </Card>
          ) : null}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-3 text-base"><span className="flex items-center gap-2"><Languages className="h-4 w-4 text-primary" />Learner wording editor</span>{editBlocked ? <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">Read only</Badge> : null}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="en" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="hi">Hindi</TabsTrigger><TabsTrigger value="pa">Punjabi</TabsTrigger></TabsList>
              <TabsContent value="en" className="space-y-4">
                <div className="rounded-lg border bg-muted/30 p-3 text-xs leading-5 text-muted-foreground">
                  Saving English creates a new immutable CP009 authoring version. Hindi and Punjabi are tied to the English version, so any existing translations must be reviewed again after an English change. Source-title similarity must remain below the canonical 0.72 limit.
                </div>
                {data.event.sourceTitleSimilarity !== null ? <p className={cn('text-xs font-medium', data.event.sourceTitleSimilarity >= 0.72 ? 'text-destructive' : 'text-muted-foreground')}>Current source-title similarity: {data.event.sourceTitleSimilarity.toFixed(2)}</p> : null}
                {authoringReasons.length > 0 ? <div className="rounded-lg border p-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current authoring notes</p><ul className="mt-2 space-y-1 text-xs text-muted-foreground">{authoringReasons.map((reason) => <li key={reason}>• {reason}</li>)}</ul></div> : null}
                <EditorFields draft={english} setDraft={setEnglish} language="English" />
                <Button disabled={editBlocked || saving !== null} onClick={() => void saveEnglish()}>{saving === 'en' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save new English version</Button>
              </TabsContent>

              <TabsContent value="hi" className="space-y-4">
                {!data.gates.authoringCurrent ? <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning">A current English authoring version is required before Hindi can be saved.</div> : null}
                {hi ? <div className="flex flex-wrap items-center gap-2"><StatusBadge status={hi.status} /><span className="text-xs text-muted-foreground">updated {formatTime(hi.updatedAt)}</span></div> : <p className="text-xs text-muted-foreground">No Hindi localization exists for the current English version yet.</p>}
                <EditorFields draft={hindi} setDraft={setHindi} language="Hindi" />
                <Button disabled={editBlocked || !data.gates.authoringCurrent || saving !== null} onClick={() => void saveLocalization('hi', hindi)}>{saving === 'hi' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save Hindi localization</Button>
              </TabsContent>

              <TabsContent value="pa" className="space-y-4">
                {!data.gates.authoringCurrent ? <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning">A current English authoring version is required before Punjabi can be saved.</div> : null}
                {pa ? <div className="flex flex-wrap items-center gap-2"><StatusBadge status={pa.status} /><span className="text-xs text-muted-foreground">updated {formatTime(pa.updatedAt)}</span></div> : <p className="text-xs text-muted-foreground">No Punjabi localization exists for the current English version yet.</p>}
                <EditorFields draft={punjabi} setDraft={setPunjabi} language="Punjabi" />
                <Button disabled={editBlocked || !data.gates.authoringCurrent || saving !== null} onClick={() => void saveLocalization('pa', punjabi)}>{saving === 'pa' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save Punjabi localization</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><History className="h-4 w-4 text-primary" />English authoring history</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data.authoringHistory.map((version) => (
            <div key={version.id} className="grid gap-2 rounded-lg border p-3 md:grid-cols-[80px_120px_1fr_auto] md:items-center">
              <p className="text-sm font-semibold">V{version.versionNumber}</p>
              <StatusBadge status={version.status} />
              <div className="min-w-0"><p className="truncate text-sm">{version.learnerTitle || 'No learner output'}</p><p className="text-xs text-muted-foreground">{version.authoringMethod} · {formatTime(version.createdAt)}</p></div>
              <p className="text-xs text-muted-foreground">similarity {version.sourceTitleSimilarity.toFixed(2)}</p>
            </div>
          ))}
          {data.authoringHistory.length === 0 ? <p className="text-sm text-muted-foreground">No English authoring versions exist yet.</p> : null}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-success" />All edits create audited canonical versions; this workbench does not publish learner content or bypass release gates.</div>
    </div>
  );
}

export default CurrentAffairsEditorialWorkbenchPage;
