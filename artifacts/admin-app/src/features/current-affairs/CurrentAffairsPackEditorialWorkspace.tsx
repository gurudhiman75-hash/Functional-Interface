import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileCheck2, Languages, Loader2, Pencil, RefreshCw, Save, ShieldCheck } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CurrentAffairsMasterPackApprovalCard } from '@/features/current-affairs/CurrentAffairsMasterPackApprovalCard';
import {
  getCurrentAffairsEditorialEvent,
  saveCurrentAffairsEditorialEnglish,
  saveCurrentAffairsEditorialLocalization,
  type CurrentAffairsEditorialDetail,
} from '@/features/current-affairs/editorial-api';
import { refreshCurrentAffairsPackEditorial } from '@/features/current-affairs/pack-editorial-api';
import {
  getCurrentAffairsDailyMasterPacks,
  getDailyMasterPackApprovalState,
  type DailyMasterPack,
  type DailyMasterPackApprovalState,
  type DailyMasterPackSet,
} from '@/features/current-affairs/production-ops-api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

type PackEvent = {
  id: string;
  publicCode: string;
  title: string;
  summary: string;
  oneLiner: string;
  category: string;
  sectionLabel: string;
  facts: Array<{ key: string; label: string; value: string }>;
};

type Draft = { title: string; summary: string; oneLiner: string };
const emptyDraft: Draft = { title: '', summary: '', oneLiner: '' };

function clean(value: unknown) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function payloadSections(pack: DailyMasterPack | null) {
  const payload = pack?.payload as {
    sections?: Array<{ label?: unknown; category?: unknown; events?: unknown[] }>;
    categories?: Array<{ label?: unknown; category?: unknown; events?: unknown[] }>;
  } | null;
  return payload?.sections ?? payload?.categories ?? [];
}

function packEvents(pack: DailyMasterPack | null): PackEvent[] {
  const seen = new Set<string>();
  const events: PackEvent[] = [];
  for (const section of payloadSections(pack)) {
    for (const raw of Array.isArray(section.events) ? section.events : []) {
      const event = raw as Record<string, unknown>;
      const id = clean(event.id);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const facts = (Array.isArray(event.facts) ? event.facts : []).map((factRaw) => {
        const fact = factRaw as Record<string, unknown>;
        return {
          key: clean(fact.key),
          label: clean(fact.label) || clean(fact.key).replace(/_/g, ' '),
          value: clean(fact.value),
        };
      }).filter((fact) => fact.key && fact.value);
      events.push({
        id,
        publicCode: clean(event.publicCode),
        title: clean(event.title),
        summary: clean(event.summary),
        oneLiner: clean(event.oneLiner),
        category: clean(event.category) || clean(section.category),
        sectionLabel: clean(section.label) || clean(event.category),
        facts,
      });
    }
  }
  return events;
}

function eventIds(pack: DailyMasterPack | null) {
  return packEvents(pack).map((event) => event.id).sort();
}

function exactParity(packs: DailyMasterPackSet) {
  if (!packs.en || !packs.hi || !packs.pa) return false;
  const en = eventIds(packs.en);
  const hi = eventIds(packs.hi);
  const pa = eventIds(packs.pa);
  return en.length > 0 && en.length === hi.length && en.length === pa.length
    && en.every((id, index) => hi[index] === id && pa[index] === id);
}

function editorialQuality(pack: DailyMasterPack | null) {
  const payload = pack?.payload as {
    editorialQuality?: { ready?: unknown; blockers?: unknown; warnings?: unknown };
    membership?: { mode?: unknown; selectedEventCount?: unknown; selectedHeadlineCount?: unknown };
  } | null;
  const quality = payload?.editorialQuality;
  return {
    ready: quality?.ready === true,
    blockers: Array.isArray(quality?.blockers) ? quality?.blockers.map(clean).filter(Boolean) : [],
    warnings: Array.isArray(quality?.warnings) ? quality?.warnings.map(clean).filter(Boolean) : [],
    boundaryMode: clean(payload?.membership?.mode),
    selectedEventCount: Number(payload?.membership?.selectedEventCount ?? 0),
    selectedHeadlineCount: Number(payload?.membership?.selectedHeadlineCount ?? 0),
  };
}

function hydrate(detail: CurrentAffairsEditorialDetail) {
  const hi = detail.localizations.find((item) => item.languageCode === 'hi');
  const pa = detail.localizations.find((item) => item.languageCode === 'pa');
  return {
    en: {
      title: detail.event.learnerTitle ?? detail.event.canonicalTitle ?? '',
      summary: detail.event.learnerSummary ?? detail.event.canonicalSummary ?? '',
      oneLiner: detail.event.learnerOneLiner ?? '',
    },
    hi: {
      title: hi?.localizedTitle ?? '',
      summary: hi?.localizedSummary ?? '',
      oneLiner: hi?.localizedOneLiner ?? '',
    },
    pa: {
      title: pa?.localizedTitle ?? '',
      summary: pa?.localizedSummary ?? '',
      oneLiner: pa?.localizedOneLiner ?? '',
    },
  };
}

export function CurrentAffairsPackEditorialWorkspace({
  date,
  packs,
  onPacksChanged,
}: {
  date: string;
  packs: DailyMasterPackSet;
  onPacksChanged: (packs: DailyMasterPackSet) => void;
}) {
  const { hasPermission } = useAdminPermissions();
  const canUpdate = hasPermission('content.questions.update');
  const [approval, setApproval] = useState<DailyMasterPackApprovalState | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [detail, setDetail] = useState<CurrentAffairsEditorialDetail | null>(null);
  const [english, setEnglish] = useState<Draft>(emptyDraft);
  const [hindi, setHindi] = useState<Draft>(emptyDraft);
  const [punjabi, setPunjabi] = useState<Draft>(emptyDraft);
  const [editorialReason, setEditorialReason] = useState('');
  const [refreshReason, setRefreshReason] = useState('');
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [saving, setSaving] = useState<'en' | 'hi' | 'pa' | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const events = useMemo(() => packEvents(packs.en ?? packs.hi ?? packs.pa), [packs]);
  const parityReady = useMemo(() => exactParity(packs), [packs]);
  const quality = useMemo(() => editorialQuality(packs.en), [packs.en]);
  const activeApproval = approval?.candidate.activeApproval ?? null;
  const packLocked = Boolean(activeApproval || packs.en?.status === 'approved' || packs.hi?.status === 'approved' || packs.pa?.status === 'approved');

  const syncWorkspace = useCallback(async () => {
    try {
      const [nextApproval, nextPacks] = await Promise.all([
        getDailyMasterPackApprovalState(date),
        getCurrentAffairsDailyMasterPacks(date),
      ]);
      setApproval(nextApproval);
      onPacksChanged(nextPacks.masterPacks);
    } catch (caught) {
      showToast.error('Pack workspace refresh failed', caught instanceof Error ? caught.message : 'Unable to refresh Daily Pack approval and artifact state.');
    }
  }, [date, onPacksChanged]);

  useEffect(() => { void syncWorkspace(); }, [syncWorkspace]);

  const loadEvent = useCallback(async (eventId: string, preserveLocalizationDrafts = false) => {
    setSelectedEventId(eventId);
    setLoadingEvent(true);
    try {
      const next = await getCurrentAffairsEditorialEvent(eventId);
      const drafts = hydrate(next);
      setDetail(next);
      setEnglish(drafts.en);
      if (!preserveLocalizationDrafts) {
        setHindi(drafts.hi);
        setPunjabi(drafts.pa);
      }
    } catch (caught) {
      showToast.error('Event editor failed to load', caught instanceof Error ? caught.message : 'Unable to load the governed Current Affairs event editor.');
    } finally {
      setLoadingEvent(false);
    }
  }, []);

  const baseWritable = Boolean(canUpdate && !packLocked && detail?.gates.eventVerified && detail.gates.hasVerifiedFacts && !detail.gates.hasOpenConflict);
  const localizationWritable = Boolean(baseWritable && detail?.gates.authoringCurrent && ['ready', 'manual'].includes(detail?.event.authoringStatus ?? ''));

  const saveEnglish = async () => {
    if (!selectedEventId || !baseWritable || editorialReason.trim().length < 8) return;
    setSaving('en');
    try {
      await saveCurrentAffairsEditorialEnglish(selectedEventId, { ...english, reason: editorialReason.trim() });
      showToast.success('English revision saved', 'A new governed authoring version is current. Re-save Hindi and Punjabi against this version before refreshing the pack.');
      await loadEvent(selectedEventId, true);
    } catch (caught) {
      showToast.error('English revision failed', caught instanceof Error ? caught.message : 'Unable to save English learner wording.');
    } finally {
      setSaving(null);
    }
  };

  const saveLocalization = async (language: 'hi' | 'pa') => {
    if (!selectedEventId || !localizationWritable || editorialReason.trim().length < 8) return;
    const draft = language === 'hi' ? hindi : punjabi;
    setSaving(language);
    try {
      await saveCurrentAffairsEditorialLocalization(selectedEventId, language, { ...draft, reason: editorialReason.trim() });
      showToast.success(`${language === 'hi' ? 'Hindi' : 'Punjabi'} revision saved`, 'Canonical fact parity and target-script gates passed.');
      const next = await getCurrentAffairsEditorialEvent(selectedEventId);
      setDetail(next);
      const drafts = hydrate(next);
      setEnglish(drafts.en);
      setHindi(drafts.hi);
      setPunjabi(drafts.pa);
    } catch (caught) {
      showToast.error(`${language === 'hi' ? 'Hindi' : 'Punjabi'} revision failed`, caught instanceof Error ? caught.message : 'Unable to save localization.');
    } finally {
      setSaving(null);
    }
  };

  const refreshPack = async () => {
    if (!canUpdate || packLocked || refreshReason.trim().length < 8) return;
    setRefreshing(true);
    try {
      const result = await refreshCurrentAffairsPackEditorial(date, refreshReason.trim());
      onPacksChanged(result.masterPacks);
      setApproval((current) => current ? { ...current, candidate: { ...current.candidate, readiness: result.approvalReadiness, activeApproval: result.activeApproval } } : current);
      setRefreshReason('');
      await syncWorkspace();
      const blockerCount = result.approvalReadiness.blockers.length;
      showToast.success(
        'Canonical pack refreshed from editorial state',
        blockerCount === 0
          ? 'Selected membership, EN/HI/PA parity and pack QA were rebuilt without discovery or replay.'
          : `Pack was rebuilt; ${blockerCount} approval blocker(s) remain visible for review.`,
      );
    } catch (caught) {
      showToast.error('Pack refresh withheld', caught instanceof Error ? caught.message : 'Resolve the editorial/localization/parity gate before rebuilding the pack.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Card className="border-primary/25">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2"><Pencil className="h-4 w-4" />Daily Pack Editorial Workspace</span>
          <div className="flex gap-2">
            <Badge variant="outline">{events.length} events</Badge>
            <Badge variant="outline" className={parityReady ? 'border-success/30 bg-success/10 text-success' : 'border-warning/30 bg-warning/10 text-warning'}>{parityReady ? 'EN/HI/PA parity' : 'parity repair needed'}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-2 sm:grid-cols-5">
          {['1 Review', '2 Edit events', '3 Refresh + QA', '4 Approve version', '5 Download version'].map((label, index) => (
            <div key={label} className={cn('rounded-md border px-3 py-2 text-center text-xs font-medium', index < 3 ? 'border-primary/20 bg-primary/5' : '')}>{label}</div>
          ))}
        </div>

        {packLocked ? <div className="rounded-lg border border-success/25 bg-success/5 p-3 text-sm"><p className="font-medium text-success">This approved version is locked, not permanently uneditable.</p><p className="mt-1 text-xs text-muted-foreground">Open an editable revision below. The approved version stays preserved in history; the date returns to review so event wording and the canonical pack can be modified and re-approved as a new version.</p></div> : <div className="rounded-lg border p-3 text-sm"><p className="font-medium">Edit structured event copy, not generated Markdown/PDF.</p><p className="mt-1 text-xs text-muted-foreground">Verified facts are read-only here. English edits create a new authoring version; Hindi and Punjabi must then be saved against that same version. The pack changes only after you press Refresh pack + run QA.</p></div>}

        {packLocked ? <CurrentAffairsMasterPackApprovalCard targetDate={date} onChanged={syncWorkspace} /> : null}

        {!parityReady ? <div className="flex items-start gap-2 rounded-md border border-warning/25 bg-warning/5 p-3 text-sm text-warning"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><p>The stored language packs do not currently have exact event-ID parity. Do not approve them. Editing is still available; the governed refresh below is the repair path.</p></div> : null}

        <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
          <Card>
            <CardHeader><CardTitle className="text-sm">Selected pack events</CardTitle></CardHeader>
            <CardContent className="max-h-[720px] space-y-2 overflow-y-auto">
              {events.map((event, index) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => void loadEvent(event.id)}
                  className={cn('w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50', selectedEventId === event.id && 'border-primary bg-primary/5')}
                >
                  <div className="flex items-start justify-between gap-3"><div><p className="text-xs text-muted-foreground">{index + 1}. {event.sectionLabel} · {event.publicCode}</p><p className="mt-1 text-sm font-medium leading-5">{event.title}</p></div><Pencil className="mt-0.5 h-4 w-4 shrink-0" /></div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{event.oneLiner || event.summary}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center justify-between text-sm"><span>Event wording editor</span>{detail ? <Badge variant="outline">{detail.event.publicCode}</Badge> : null}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {loadingEvent ? <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading verified event context…</div> : !detail ? <p className="py-10 text-center text-sm text-muted-foreground">Choose an event from the left to review or edit its learner wording.</p> : <>
                <div className="rounded-lg border p-3 text-sm"><div className="flex flex-wrap gap-2"><Badge variant="outline">verified</Badge><Badge variant="outline">authoring {detail.event.authoringStatus}</Badge>{detail.gates.hasOpenConflict ? <Badge variant="outline" className="border-destructive/30 text-destructive">open conflict</Badge> : null}</div><p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Verified facts — read only</p><div className="mt-2 space-y-1">{detail.facts.filter((fact) => fact.isVerified).map((fact) => <p key={fact.id} className="text-xs"><span className="font-medium">{fact.factKey.replace(/_/g, ' ')}:</span> {fact.factValue}</p>)}</div></div>

                <LanguageEditor label="English" code="EN" draft={english} setDraft={setEnglish} disabled={!baseWritable || saving !== null} />
                <div className="grid gap-4 lg:grid-cols-2">
                  <LanguageEditor label="Hindi" code="HI" draft={hindi} setDraft={setHindi} disabled={!localizationWritable || saving !== null} />
                  <LanguageEditor label="Punjabi" code="PA" draft={punjabi} setDraft={setPunjabi} disabled={!localizationWritable || saving !== null} />
                </div>

                <div className="space-y-2 border-t pt-4"><Label>Editorial reason</Label><Textarea rows={2} value={editorialReason} onChange={(event) => setEditorialReason(event.target.value)} placeholder="Why are you changing this event? Minimum 8 characters." disabled={packLocked || saving !== null} /><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => void saveEnglish()} disabled={!baseWritable || saving !== null || editorialReason.trim().length < 8}>{saving === 'en' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save English</Button><Button variant="outline" onClick={() => void saveLocalization('hi')} disabled={!localizationWritable || saving !== null || editorialReason.trim().length < 8}>{saving === 'hi' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}Save Hindi</Button><Button variant="outline" onClick={() => void saveLocalization('pa')} disabled={!localizationWritable || saving !== null || editorialReason.trim().length < 8}>{saving === 'pa' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}Save Punjabi</Button></div></div>
              </>}
            </CardContent>
          </Card>
        </div>

        <Card className={quality.ready && parityReady ? 'border-success/25' : 'border-warning/25'}>
          <CardHeader><CardTitle className="flex flex-wrap items-center justify-between gap-2 text-sm"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Pack refresh & QA</span><Badge variant="outline" className={quality.ready && parityReady ? 'border-success/30 bg-success/10 text-success' : 'border-warning/30 bg-warning/10 text-warning'}>{quality.ready && parityReady ? 'QA ready' : 'review needed'}</Badge></CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">This action only rematerializes the canonical pack from the current admin-selected event set and accepted EN/HI/PA authoring. It does <strong>not</strong> run source discovery, replay, verification, publication or Question Bank promotion.</p>
            {quality.boundaryMode !== 'admin_selected' ? <p className="rounded-md border border-warning/20 bg-warning/5 p-2 text-sm text-warning">The stored English payload is not currently marked with the admin-selected canonical boundary. Refreshing here will repair it if all selected event authoring/localizations are ready.</p> : null}
            {quality.blockers.map((blocker) => <p key={blocker} className="rounded-md border border-warning/20 bg-warning/5 p-2 text-sm text-warning">{blocker}</p>)}
            {quality.warnings.map((warning) => <p key={warning} className="text-xs text-warning">{warning}</p>)}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end"><div className="flex-1 space-y-1.5"><Label>Pack refresh reason</Label><Input value={refreshReason} onChange={(event) => setRefreshReason(event.target.value)} placeholder="Example: Reviewed learner wording and localization parity" disabled={!canUpdate || packLocked || refreshing} /></div><Button onClick={() => void refreshPack()} disabled={!canUpdate || packLocked || refreshing || refreshReason.trim().length < 8}>{refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}Refresh pack + run QA</Button></div>
            <div className="grid gap-2 sm:grid-cols-3"><Status label="Exact EN/HI/PA event IDs" ok={parityReady} /><Status label="Selected-boundary payload" ok={quality.boundaryMode === 'admin_selected'} /><Status label="English editorial QA" ok={quality.ready} /></div>
          </CardContent>
        </Card>

        {!packLocked ? <CurrentAffairsMasterPackApprovalCard targetDate={date} onChanged={syncWorkspace} /> : null}

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm"><div className="flex items-center gap-2 font-medium"><FileCheck2 className="h-4 w-4" />Final artifact gate</div><p className="mt-1 text-xs text-muted-foreground">Approval freezes one auditable version; it does not permanently freeze the date. Use Modify approved pack to open a revision, then edit, refresh + QA and approve the next version. Learner publication remains a separate authority.</p></div>
      </CardContent>
    </Card>
  );
}

function LanguageEditor({ label, code, draft, setDraft, disabled }: { label: string; code: string; draft: Draft; setDraft: (draft: Draft) => void; disabled: boolean }) {
  return <div className="space-y-3 rounded-lg border p-3"><div className="flex items-center justify-between"><p className="text-sm font-medium">{label}</p><Badge variant="outline">{code}</Badge></div><div className="space-y-1"><Label>Title</Label><Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} disabled={disabled} /></div><div className="space-y-1"><Label>Summary</Label><Textarea rows={5} value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} disabled={disabled} /></div><div className="space-y-1"><Label>One-liner</Label><Textarea rows={2} value={draft.oneLiner} onChange={(event) => setDraft({ ...draft, oneLiner: event.target.value })} disabled={disabled} /></div></div>;
}

function Status({ label, ok }: { label: string; ok: boolean }) {
  return <div className="flex items-center justify-between rounded-md border px-3 py-2 text-xs"><span>{label}</span>{ok ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}</div>;
}
