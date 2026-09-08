import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Archive, CalendarDays, Download, FolderOpen, Loader2, RefreshCw } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  downloadCurrentAffairsMasterPackArtifact,
  getCurrentAffairsDailyMasterPackArchive,
  getCurrentAffairsDailyMasterPacks,
  type CurrentAffairsMasterPackArtifact,
  type DailyMasterPack,
  type DailyMasterPackArchive,
  type DailyMasterPackArchiveEntry,
  type DailyMasterPackLanguage,
  type DailyMasterPackSet,
} from '@/features/current-affairs/production-ops-api';
import { cn } from '@/lib/utils';

const LANGUAGES: Array<{ code: DailyMasterPackLanguage; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
];

function emptyPacks(): DailyMasterPackSet {
  return { en: null, hi: null, pa: null };
}

function displayDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
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

function archiveCountParity(entry: DailyMasterPackArchiveEntry) {
  const counts = LANGUAGES
    .map(({ code }) => entry.languages[code]?.eventCount)
    .filter((value): value is number => typeof value === 'number');
  return entry.languageCount === 3 && counts.length === 3 && new Set(counts).size === 1;
}

function packEventIds(pack: DailyMasterPack | null) {
  const payload = pack?.payload as { categories?: Array<{ events?: Array<{ id?: unknown }> }> } | null;
  const ids = (payload?.categories ?? [])
    .flatMap((category) => category.events ?? [])
    .map((event) => String(event.id ?? '').trim())
    .filter(Boolean);
  return [...new Set(ids)].sort();
}

function exactPackParity(packs: DailyMasterPackSet) {
  if (!packs.en || !packs.hi || !packs.pa) return false;
  const en = packEventIds(packs.en);
  const hi = packEventIds(packs.hi);
  const pa = packEventIds(packs.pa);
  return en.length > 0
    && en.length === hi.length
    && en.length === pa.length
    && en.every((id, index) => hi[index] === id && pa[index] === id);
}

export function CurrentAffairsPastDailyPacksCard({ currentDate }: { currentDate?: string }) {
  const [archive, setArchive] = useState<DailyMasterPackArchive | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [manualDate, setManualDate] = useState('');
  const [packs, setPacks] = useState<DailyMasterPackSet>(emptyPacks);
  const [language, setLanguage] = useState<DailyMasterPackLanguage>('en');
  const [loadingArchive, setLoadingArchive] = useState(true);
  const [opening, setOpening] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [openError, setOpenError] = useState<string | null>(null);

  const visibleDates = useMemo(
    () => (archive?.dates ?? []).filter((entry) => entry.contentDate !== currentDate),
    [archive, currentDate],
  );

  const loadArchive = useCallback(async () => {
    setLoadingArchive(true);
    try {
      const next = await getCurrentAffairsDailyMasterPackArchive(90);
      setArchive(next);
      const first = next.dates.find((entry) => entry.contentDate !== currentDate) ?? next.dates[0];
      setManualDate((existing) => existing || first?.contentDate || '');
    } catch (caught) {
      showToast.error('Past Daily Packs failed to load', caught instanceof Error ? caught.message : 'Unable to load stored Current Affairs pack dates.');
    } finally {
      setLoadingArchive(false);
    }
  }, [currentDate]);

  const openStoredDate = useCallback(async (date: string) => {
    if (!date) return;
    setOpening(true);
    setOpenError(null);
    try {
      const result = await getCurrentAffairsDailyMasterPacks(date);
      setSelectedDate(result.targetDate);
      setManualDate(result.targetDate);
      setPacks(result.masterPacks);
      const available = LANGUAGES.find(({ code }) => result.masterPacks[code]);
      if (available && !result.masterPacks[language]) setLanguage(available.code);
      if (!Object.values(result.masterPacks).some(Boolean)) {
        setOpenError(`No stored canonical Daily Master Pack exists for ${result.targetDate}.`);
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unable to open the stored Current Affairs pack.';
      setOpenError(message);
      showToast.error('Stored pack failed to open', message);
    } finally {
      setOpening(false);
    }
  }, [language]);

  useEffect(() => { void loadArchive(); }, [loadArchive]);

  const selectedPack: DailyMasterPack | null = packs[language];
  const materializedCount = Object.values(packs).filter(Boolean).length;
  const selectedParityReady = selectedDate ? exactPackParity(packs) : false;

  const download = async (artifact: CurrentAffairsMasterPackArtifact) => {
    if (!selectedDate || !selectedPack) return;
    const key = `${selectedDate}:${language}:${artifact}`;
    setDownloading(key);
    try {
      const result = await downloadCurrentAffairsMasterPackArtifact(selectedDate, artifact, language);
      showToast.success(
        artifact === 'pdf' ? 'Current Affairs PDF downloaded' : 'Current Affairs text downloaded',
        `${result.filename} · ${fmtBytes(result.bytes)} · stored canonical pack ${selectedPack.publicCode}.`,
      );
    } catch (caught) {
      showToast.error(
        artifact === 'pdf' ? 'PDF download failed' : 'Markdown download failed',
        caught instanceof Error ? caught.message : `Unable to download Current Affairs ${artifact}.`,
      );
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2"><Archive className="h-4 w-4" />Past Daily Packs</span>
          <Badge variant="outline">read-only archive</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-success/25 bg-success/5 p-3 text-sm">
          <p className="font-medium">Open and download an existing date without replaying it.</p>
          <p className="mt-1 text-xs text-muted-foreground">Opening a stored pack only reads the canonical EN/HI/PA records. It does not run source discovery, verification, authoring, localization, replay, generation, publication or Question Bank promotion.</p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex w-full max-w-md items-end gap-2">
            <div className="flex-1 space-y-1.5">
              <label htmlFor="ca-past-pack-date" className="text-sm font-medium">Open a stored date</label>
              <Input id="ca-past-pack-date" type="date" value={manualDate} onChange={(event) => setManualDate(event.target.value)} disabled={opening} />
            </div>
            <Button onClick={() => void openStoredDate(manualDate)} disabled={!manualDate || opening}>
              {opening ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FolderOpen className="mr-2 h-4 w-4" />}
              Open pack
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => void loadArchive()} disabled={loadingArchive}>
            <RefreshCw className={cn('mr-2 h-4 w-4', loadingArchive && 'animate-spin')} />Refresh dates
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium"><CalendarDays className="h-4 w-4" />Recent stored dates</div>
          {loadingArchive && !archive ? <div className="flex items-center gap-2 rounded-lg border p-3 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading stored pack dates…</div> : visibleDates.length === 0 ? <p className="rounded-lg border p-3 text-sm text-muted-foreground">No past canonical Daily Master Packs are stored yet.</p> : <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleDates.slice(0, 24).map((entry) => {
              const parityReady = archiveCountParity(entry);
              return <Button
                key={entry.contentDate}
                variant={selectedDate === entry.contentDate ? 'default' : 'outline'}
                className="h-auto justify-between px-3 py-2"
                onClick={() => void openStoredDate(entry.contentDate)}
                disabled={opening}
              >
                <span className="text-left"><span className="block font-medium">{displayDate(entry.contentDate)}</span><span className="block text-[11px] opacity-75">updated {fmt(entry.latestGeneratedAt)}</span></span>
                <span className="ml-2 flex flex-col items-end gap-1"><Badge variant="outline">{entry.languageCount}/3</Badge>{!parityReady ? <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">mismatch</Badge> : null}</span>
              </Button>;
            })}
          </div>}
        </div>

        {selectedDate ? <div className="space-y-4 rounded-lg border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold">Stored canonical pack · {displayDate(selectedDate)}</p>
              <p className="text-xs text-muted-foreground">{materializedCount}/3 languages materialized. No replay was run to open this view.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((item) => {
                const pack = packs[item.code];
                return <Button key={item.code} size="sm" variant={language === item.code ? 'default' : 'outline'} onClick={() => setLanguage(item.code)}>
                  {item.label}
                  <Badge variant="outline" className={cn('ml-2', pack ? 'border-success/30 bg-success/10 text-success' : 'border-warning/30 bg-warning/10 text-warning')}>{pack ? 'stored' : 'missing'}</Badge>
                </Button>;
              })}
            </div>
          </div>

          {openError ? <p className="rounded-md border border-warning/20 bg-warning/5 p-2 text-sm text-warning">{openError}</p> : null}
          {!openError && !selectedParityReady ? <div className="flex items-start gap-2 rounded-md border border-warning/25 bg-warning/5 p-3 text-sm text-warning"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><p>EN/HI/PA event-ID parity is not intact for this stored date. Treat it as needing repair; do not approve or publish the pack until parity is restored.</p></div> : null}

          {selectedPack ? <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">{selectedPack.eventCount}</span> events · <span className="font-semibold">{selectedPack.categoryCount}</span> sections · {selectedPack.language.toUpperCase()}</p>
              <p className="text-muted-foreground">{selectedPack.publicCode} · pack status {selectedPack.status} · learning resource {selectedPack.learningResourceStatus}</p>
              <p className="text-xs text-muted-foreground">Generated {fmt(selectedPack.generatedAt)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => void download('text')} disabled={downloading !== null}>
                {downloading === `${selectedDate}:${language}:text` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}Download Markdown
              </Button>
              <Button onClick={() => void download('pdf')} disabled={downloading !== null}>
                {downloading === `${selectedDate}:${language}:pdf` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}Download PDF
              </Button>
            </div>
          </div> : !openError ? <p className="text-sm text-warning">The selected language is not stored for this date.</p> : null}
        </div> : null}
      </CardContent>
    </Card>
  );
}
