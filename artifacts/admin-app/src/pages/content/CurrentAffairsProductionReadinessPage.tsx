import { useCallback, useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock3, Download, ExternalLink, Loader2, Newspaper, Play, RefreshCw, RotateCcw, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrentAffairsMasterPackApprovalCard } from '@/features/current-affairs/CurrentAffairsMasterPackApprovalCard';
import {
  downloadCurrentAffairsMasterPackArtifact,
  generateYesterdayCurrentAffairs,
  getCurrentAffairsDailyMasterPacks,
  getCurrentAffairsProductionReadiness,
  getCurrentAffairsRecoveryRuns,
  runCurrentAffairsProductionRecovery,
  type CurrentAffairsMasterPackArtifact,
  type CurrentAffairsProductionReadiness,
  type CurrentAffairsRecoveryRuns,
  type DailyMasterPackLanguage,
  type DailyMasterPackSet,
  type GenerateYesterdayCurrentAffairsResult,
} from '@/features/current-affairs/production-ops-api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

const MASTER_PACK_LANGUAGES: Array<{ code: DailyMasterPackLanguage; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
];

function emptyMasterPacks(): DailyMasterPackSet {
  return { en: null, hi: null, pa: null };
}

function fmt(value: string | null | undefined) {
  if (!value) return 'Not observed';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function fmtBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function titleCase(value: string | null | undefined) {
  return (value ?? 'other').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
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
  const [masterPacks, setMasterPacks] = useState<DailyMasterPackSet>(emptyMasterPacks);
  const [selectedMasterLanguage, setSelectedMasterLanguage] = useState<DailyMasterPackLanguage>('en');
  const [lastGeneration, setLastGeneration] = useState<GenerateYesterdayCurrentAffairsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [nextReadiness, nextRuns, nextMasterPacks] = await Promise.all([
        getCurrentAffairsProductionReadiness(),
        getCurrentAffairsRecoveryRuns(),
        getCurrentAffairsDailyMasterPacks(),
      ]);
      setReadiness(nextReadiness);
      setRuns(nextRuns);
      setMasterPacks(nextMasterPacks.masterPacks);
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
        const prep = result.officialCandidatePreparation;
        const diagnostic = prep && (prep.candidateUpdated > 0 || prep.clusterUpdated > 0)
          ? `Reclassified ${prep.candidateUpdated} official candidates and ${prep.clusterUpdated} open clusters. `
          : '';
        showToast.error(
          'Generation completed with blockers',
          `${diagnostic}${result.summary.blockers[0] ?? 'Some exam-family drafts could not be materialized from verified source evidence.'}`,
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

  const downloadMasterPack = async (artifact: CurrentAffairsMasterPackArtifact) => {
    if (!readiness) return;
    const masterPack = masterPacks[selectedMasterLanguage];
    if (!masterPack) return;
    const downloadKey = `${selectedMasterLanguage}:${artifact}`;
    setDownloading(downloadKey);
    try {
      const result = await downloadCurrentAffairsMasterPackArtifact(
        readiness.targetDate,
        artifact,
        selectedMasterLanguage,
      );
      showToast.success(
        artifact === 'pdf' ? 'Current Affairs PDF downloaded' : 'Current Affairs text downloaded',
        `${result.filename} · ${fmtBytes(result.bytes)} · canonical master pack ${masterPack.publicCode}.`,
      );
    } catch (caught) {
      showToast.error(
        artifact === 'pdf' ? 'PDF download failed' : 'Text download failed',
        caught instanceof Error ? caught.message : `Unable to download Current Affairs ${artifact}.`,
      );
    } finally {
      setDownloading(null);
    }
  };

  if (loading && !readiness) {
    return <div className="flex min-h-[360px] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading Current Affairs production state…</div>;
  }

  if (!readiness) {
    return <div className="space-y-4"><PageHeader title="CA Production Readiness" description="Current Affairs production state is unavailable." icon={<Activity className="h-5 w-5" />} /><Card><CardContent className="p-6 text-sm text-destructive">{error ?? 'Unable to load readiness.'}</CardContent></Card></div>;
  }

  const { evaluation } = readiness;
  const inventory = readiness.targetInventory;
  const masterPack = masterPacks[selectedMasterLanguage];
  const materializedMasterPackCount = Object.values(masterPacks).filter(Boolean).length;
  return (
    <div className="space-y-5">
      <PageHeader
        title="CA Production Readiness"
        description={`Operating day ${readiness.targetDate} · readiness deadline ${fmt(readiness.deadlineIso)}`}
        icon={<Activity className="h-5 w-5" />}
        actions={<>{canRun ? <Button onClick={() => void generateYesterday()} disabled={generating || recovering}>{generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}Generate Yesterday Now</Button> : null}{canRun ? <Button variant="outline" onClick={() => void recover()} disabled={generating || recovering}><RotateCcw className={cn('mr-2 h-4 w-4', recovering && 'animate-spin')} />Bounded recovery</Button> : null}<Button variant="outline" onClick={() => void refresh()} disabled={loading || generating}><RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />Refresh</Button></>}
      />

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="font-semibold">Yesterday should exist on demand.</p><p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">Generate Yesterday Now refreshes official sources, performs exact-day historical recovery and broad rights-safe discovery, enriches primary facts, reruns clustering and strict verification, and materializes SSC, Banking and Punjab EN/HI/PA drafts plus parity-locked canonical daily master packs. Trusted-news sources remain discovery-only and never replace official verification.</p></div><Button variant="outline" asChild><Link to="/content/learning-resources">Open Learning Resources</Link></Button></CardContent>
      </Card>

      <Card className={masterPacks.en ? 'border-primary/25' : 'border-warning/30'}>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
            <span>Canonical Daily Master Packs · {readiness.targetDate}</span>
            <Badge variant="outline">{materializedMasterPackCount}/3 materialized</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {MASTER_PACK_LANGUAGES.map((language) => {
              const pack = masterPacks[language.code];
              return <Button key={language.code} size="sm" variant={selectedMasterLanguage === language.code ? 'default' : 'outline'} onClick={() => setSelectedMasterLanguage(language.code)}><span>{language.label}</span><Badge variant="outline" className={cn('ml-2', pack ? 'border-success/30 bg-success/10 text-success' : 'border-warning/30 bg-warning/10 text-warning')}>{pack ? 'ready' : 'withheld'}</Badge></Button>;
            })}
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1 text-sm">
              {masterPack ? <><p><span className="font-semibold">{masterPack.eventCount}</span> verified exam-relevant events · <span className="font-semibold">{masterPack.categoryCount}</span> sections · {masterPack.language.toUpperCase()}</p><p className="text-muted-foreground">{masterPack.publicCode} · generated {fmt(masterPack.generatedAt)}. The localized packs are created only when their event IDs exactly match the English canonical set.</p><p className="text-xs text-muted-foreground">Markdown and PDF render from this same stored payload. Hindi/Punjabi PDF rendering uses pinned Noto fonts that are checksum-verified at build/runtime and checked against every required Devanagari/Gurmukhi glyph before rendering.</p></> : <p className="text-warning">{selectedMasterLanguage === 'en' ? 'No English canonical master pack exists yet. Run Generate Yesterday Now after source discovery and verification complete.' : `${selectedMasterLanguage === 'hi' ? 'Hindi' : 'Punjabi'} master pack is withheld until every English canonical event has an accepted matching localization. Run localization recovery, then Generate Yesterday Now again.`}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => void downloadMasterPack('text')} disabled={!masterPack || downloading !== null}>{downloading === `${selectedMasterLanguage}:text` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}Download Markdown</Button>
              <Button onClick={() => void downloadMasterPack('pdf')} disabled={!masterPack || downloading !== null} title="Localized PDFs fail closed if the pinned server font or a required glyph is unavailable.">{downloading === `${selectedMasterLanguage}:pdf` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}Download PDF</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CurrentAffairsMasterPackApprovalCard targetDate={readiness.targetDate} />

      {generating ? <Card><CardContent className="flex items-center gap-3 p-5 text-sm"><Loader2 className="h-5 w-5 animate-spin text-primary" /><div><p className="font-medium">Generating {readiness.targetDate}…</p><p className="text-muted-foreground">Official sources → historical backfill → open-news discovery → facts → verification → notes → translations → review questions → EN/HI/PA parity-locked canonical master packs.</p></div></CardContent></Card> : null}

      {lastGeneration ? <Card className={lastGeneration.summary.allEnglishDraftsPresent ? 'border-success/30' : 'border-warning/30'}><CardHeader><CardTitle className="text-base">Last on-demand result · {lastGeneration.targetDate}</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6"><Metric label="Candidates" value={lastGeneration.after.candidateCount} /><Metric label="Verified events" value={lastGeneration.summary.verifiedEvents} /><Metric label="Needs review" value={lastGeneration.summary.reviewEvents} /><Metric label="English packs" value={`${lastGeneration.summary.englishDraftCount}/3`} /><Metric label="HI + PA packs" value={`${lastGeneration.summary.localizedDraftCount}/6`} /><Metric label="Master packs" value={`${(lastGeneration.summary.masterPackEventCount > 0 ? 1 : 0) + (lastGeneration.summary.localizedMasterPackCount ?? 0)}/3`} /></div>{lastGeneration.officialCandidatePreparation ? <p className="text-xs text-muted-foreground">Official reclassification: {lastGeneration.officialCandidatePreparation.candidateUpdated} candidate(s), {lastGeneration.officialCandidatePreparation.clusterUpdated} open cluster(s) updated before intelligence.</p> : null}{lastGeneration.summary.localizedMasterPacksParityReady === false ? <p className="text-xs text-warning">One or more localized canonical master packs were withheld because exact event-ID parity with English was not yet available.</p> : null}{lastGeneration.summary.blockers.length > 0 ? <p className="text-sm text-warning">{lastGeneration.summary.blockers[0]}</p> : null}</CardContent></Card> : null}

      <Card className={cn('border-2', statusTone(evaluation.color))}>
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex items-center gap-2"><Badge variant="outline" className={cn('uppercase', statusTone(evaluation.color))}>{evaluation.color}</Badge><span className="text-sm font-semibold">Is {readiness.targetDate} ready?</span></div><p className="mt-2 text-2xl font-bold">{evaluation.learnerReady ? 'Learner ready' : evaluation.releaseReady ? 'Ready for editorial release' : evaluation.draftReady ? 'Drafts ready · editorial pending' : 'Not ready'}</p><p className="mt-1 text-sm text-muted-foreground">Core official family coverage {evaluation.sourceCoveragePercent}% · {readiness.sourceCoverage.freshSuccessfulPrimarySources}/{readiness.sourceCoverage.scheduledPrimarySources} families healthy · {readiness.pipeline.queuedCandidates} queued · {readiness.pipeline.openConflicts} conflicts</p></div><div className="text-sm text-muted-foreground"><Clock3 className="mr-2 inline h-4 w-4" />Checked {fmt(readiness.generatedAt)}</div></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Target-date pipeline · {readiness.targetDate}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            <Metric label="Candidates" value={inventory.candidateCount} />
            <Metric label="Official candidates" value={inventory.primaryCandidateCount} />
            <Metric label="Open clusters" value={inventory.openClusterCount} />
            <Metric label="Still uncategorized" value={inventory.openOtherClusterCount} />
            <Metric label="Events" value={inventory.eventCount} />
            <Metric label="Verified" value={inventory.verifiedEventCount} />
            <Metric label="Needs review" value={inventory.reviewEventCount} />
            <Metric label="Authoring ready" value={inventory.authoringReadyCount} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="SSC eligible" value={inventory.familyEligible.ssc} />
            <Metric label="Banking eligible" value={inventory.familyEligible.banking} />
            <Metric label="Punjab eligible" value={inventory.familyEligible.punjab} />
          </div>
          {inventory.candidateCount === 0 ? <p className="rounded-md border border-destructive/20 bg-destructive/5 p-2 text-sm text-destructive">No source candidates are dated {readiness.targetDate}; the next issue is historical source discovery rather than pack generation.</p> : inventory.openOtherClusterCount > 0 ? <p className="rounded-md border border-warning/20 bg-warning/5 p-2 text-sm text-warning">{inventory.openOtherClusterCount} target-date cluster(s) are still uncategorized and cannot auto-promote.</p> : inventory.verifiedEventCount > 0 && inventory.authoringReadyCount === 0 ? <p className="rounded-md border border-warning/20 bg-warning/5 p-2 text-sm text-warning">Verified events exist, but none has reached learner-authoring readiness.</p> : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">{readiness.families.map((family) => <Card key={family.family}><CardHeader><CardTitle className="flex items-center justify-between text-base"><span className="uppercase">{family.family}</span><Badge variant="outline">{family.eventCount} events</Badge></CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><CheckRow label="English draft" ok={family.englishDraftPresent} /><CheckRow label="Hindi draft" ok={family.hindiDraftPresent} /><CheckRow label="Punjabi draft" ok={family.punjabiDraftPresent} /><CheckRow label={`Questions approved ${family.approvedEnglishQuestions}/${family.totalEnglishQuestions}`} ok={family.totalEnglishQuestions === 0 || family.approvedEnglishQuestions === family.totalEnglishQuestions} /><CheckRow label="Release ready" ok={family.releaseReady} /><CheckRow label="Learner quiz published" ok={family.learnerQuizPublished} />{family.blockers.slice(0, 2).map((blocker) => <p key={blocker} className="text-xs text-warning">• {blocker}</p>)}</CardContent></Card>)}</div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4" />Core official source families</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {readiness.sourceCoverage.sourceFamilies.map((family) => <div key={family.sourceFamily} className="rounded-lg border p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-medium">{titleCase(family.sourceFamily)}</p><p className="text-xs text-muted-foreground">{titleCase(family.coverageDomain)} · {family.freshSuccessfulEndpointCount}/{family.endpointCount} endpoints healthy</p></div><div className="flex gap-2">{family.degraded ? <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">degraded</Badge> : null}<Badge variant="outline" className={family.healthy ? 'border-success/30 bg-success/10 text-success' : 'border-destructive/30 bg-destructive/10 text-destructive'}>{family.healthy ? 'healthy' : 'unavailable'}</Badge></div></div></div>)}
            <div className="space-y-2 border-t pt-3">{readiness.sourceCoverage.sources.map((source) => <div key={source.sourceKey} className="flex items-start justify-between gap-3 rounded-lg border p-3 text-sm"><div><p className="font-medium">{source.name}</p><p className="text-xs text-muted-foreground">{titleCase(source.sourceFamily)} · Last ingestion: {fmt(source.lastIngestedAt)}</p>{source.error ? <p className="mt-1 text-xs text-destructive">{source.error}</p> : null}</div><Badge variant="outline" className={source.fresh && source.status === 'success' ? 'border-success/30 bg-success/10 text-success' : 'border-warning/30 bg-warning/10 text-warning'}>{source.fresh && source.status === 'success' ? 'fresh' : source.status ?? 'stale'}</Badge></div>)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Blockers & recent recovery</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">{evaluation.blockers.length === 0 ? <p className="text-success">No hard readiness blockers.</p> : evaluation.blockers.map((blocker) => <p key={blocker} className="rounded-md border border-destructive/20 bg-destructive/5 p-2 text-destructive">{blocker}</p>)}{evaluation.warnings.map((warning) => <p key={warning} className="rounded-md border border-warning/20 bg-warning/5 p-2 text-warning">{warning}</p>)}{(runs?.runs ?? []).slice(0, 5).map((run) => <div key={run.id} className="flex items-center justify-between border-t pt-2 text-xs"><span>{run.targetDate} · {run.triggerMode}</span><span>{run.status}</span></div>)}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Newspaper className="h-4 w-4" />Trusted-news discovery registry</CardTitle></CardHeader>
        <CardContent><p className="mb-3 text-sm text-muted-foreground">These sources can help discover and corroborate Punjab stories, but they do not count toward official coverage and cannot become primary verification evidence. Automated RSS use remains disabled where commercial-use rights are not established.</p><div className="grid gap-3 lg:grid-cols-3">{readiness.sourceCoverage.discoverySources.map((source) => <div key={source.sourceKey} className="rounded-lg border p-3 text-sm"><div className="flex items-start justify-between gap-2"><div><p className="font-medium">{source.name}</p><p className="mt-1 text-xs text-muted-foreground">{titleCase(source.coverageDomain)} · {titleCase(source.contentPolicy)}</p></div><Badge variant="outline">{source.ingestionMode === 'manual' ? 'registered' : source.status ?? 'discovery'}</Badge></div><p className="mt-2 text-xs text-muted-foreground">{titleCase(source.automationStatus ?? 'manual')}</p>{source.baseUrl ? <a href={source.baseUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center text-xs text-primary hover:underline">Open source <ExternalLink className="ml-1 h-3 w-3" /></a> : null}</div>)}</div></CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>;
}

function CheckRow({ label, ok }: { label: string; ok: boolean }) {
  return <div className="flex items-center justify-between rounded-md border px-3 py-2"><span>{label}</span><ReadyMark ok={ok} /></div>;
}
