import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Languages, Loader2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExplanationDiagrams } from './ExplanationDiagrams';
import {
  getQuestionStudioNativeReviewLocalizations,
  type NativeReviewLocalizations,
  type NativeReviewVariant,
  type QuestionStudioItem,
} from './api';

// Discover language coverage from the registered Question Studio capabilities,
// never from a hardcoded chapter-name allowlist.
const LANGUAGE_NAMES = { hi: 'हिन्दी · Hindi', pa: 'ਪੰਜਾਬੀ · Punjabi' } as const;

function sourceLanguage(item: QuestionStudioItem): string {
  return typeof item.payload?.language === 'string' ? item.payload.language : '';
}

/** The registered language capability is separate from whether a legacy
 * question preserved its exact canonical source identity for safe linking. */
export function hasRegisteredNativeLocales(item: QuestionStudioItem, supportedLanguages: readonly string[]): boolean {
  return supportedLanguages.includes('en') &&
    supportedLanguages.some(language => language === 'hi' || language === 'pa') &&
    sourceLanguage(item) === 'en';
}
export function hasVerifiedNativeLocaleEngine(item: QuestionStudioItem, supportedLanguages: readonly string[]): boolean {
  return hasRegisteredNativeLocales(item, supportedLanguages) &&
    typeof item.payload?.seed === 'string' && Boolean(item.payload.seed) &&
    Boolean(item.payload?.questionLanguageId || item.payload?.qlId) &&
    Boolean(item.payload?.canonicalProblemId || item.payload?.selectedCpId || item.payload?.cpId);
}

function VariantCard({ variant }: { variant: NativeReviewVariant }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const name = LANGUAGE_NAMES[variant.language];
  if (variant.status === 'blocked') return (
    <div className="rounded-xl border border-warning/30 bg-warning/5 p-3" aria-label={name + ' localization blocked'}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold">{name}</span>
        <Badge variant="outline" className="border-warning/40 text-warning">Needs verification</Badge>
      </div>
      <p className="mt-3 flex items-start gap-2 text-xs text-warning">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {variant.reason}
      </p>
    </div>
  );
  return (
    <div className="min-w-0 rounded-xl border bg-background p-3" aria-label={name + ' native localization'}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold">{name}</span>
        <Badge variant="outline" className="border-success/40 text-success">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Answer mapping checked
        </Badge>
      </div>
      <p lang={variant.language} className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{variant.stem}</p>
      <div lang={variant.language} className="mt-3 space-y-1.5">
        {variant.options.map((option, index) => (
          <div key={index} className={'rounded-md border px-2.5 py-2 text-xs ' +
            (index === variant.correctIndex ? 'border-success/40 bg-success/5' : '')}>
            <span className="mr-2 font-mono font-semibold">{String.fromCharCode(65 + index)}.</span>{option}
            {index === variant.correctIndex && <span className="ml-2 text-[10px] text-success">(correct)</span>}
          </div>
        ))}
      </div>
      <Button type="button" size="sm" variant="ghost" className="mt-3 h-8 px-1 text-xs"
        onClick={() => setShowExplanation(value => !value)}>
        {showExplanation ? 'Hide explanation' : 'Show localized explanation'}
      </Button>
      {showExplanation && (
        <div lang={variant.language} className="mt-2 rounded-lg border bg-muted/20 p-3 text-xs leading-relaxed">
          <ExplanationDiagrams explanation={variant.explanation} />
        </div>
      )}
    </div>
  );
}

/**
 * One canonical review item; registered *existing released* language variants.
 * Bounded GET happens only after a reviewer expands the item.
 * This component never approves or writes translations.
 */
export function NativeLocaleReview({ item, supportedLanguages }: { item: QuestionStudioItem; supportedLanguages: readonly string[] }) {
  const available = hasRegisteredNativeLocales(item, supportedLanguages);
  const eligible = hasVerifiedNativeLocaleEngine(item, supportedLanguages);
  const [snapshot, setSnapshot] = useState<NativeReviewLocalizations | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [busy, setBusy] = useState(false);
  const token = item.id + ':' + item.currentVersionNumber;
  useEffect(() => {
    if (!eligible) return;
    let live = true;
    setSnapshot(null);
    setError(null);
    setBusy(true);
    void getQuestionStudioNativeReviewLocalizations(item.id, item.currentVersionNumber)
      .then(result => {
        if (live) {
          if (result.itemId !== item.id || result.version !== item.currentVersionNumber)
            throw new Error('The preview belongs to a different review version.');
          setSnapshot(result);
        }
      })
      .catch(caught => {
        if (live) setError(caught instanceof Error ? caught.message : 'Could not load localized versions.');
      })
      .finally(() => { if (live) setBusy(false); });
    return () => { live = false; };
  }, [eligible, token, retry]);

  const variants = useMemo(() => snapshot?.variants ?? [], [snapshot]);
  if (!available) return null;
  if (!eligible) return <section className="ml-8 mt-3 rounded-xl border border-warning/30 bg-warning/5 p-3 text-xs text-warning lg:ml-16">
    <div className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" /> Native localized versions need source identity</div>
    <p className="mt-1">This chapter declares Hindi/Punjabi support, but this saved question lacks an exact CP, QL or seed. No unrelated language question will be substituted.</p>
  </section>;
  return (
    <section className="ml-8 mt-3 rounded-xl border bg-muted/10 p-3 lg:ml-16"
      aria-label={'Native Hindi and Punjabi versions for review item ' + item.itemNumber}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Languages className="h-4 w-4" /> Native language versions
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            English source above · same CP, QL and seed · answer mapping checked · read-only review previews, not saved or approved translations
          </p>
        </div>
        {snapshot && <Badge variant="outline" className="text-[10px]">
          {variants.filter(variant => variant.status === 'verified').length}/2 localized versions verified
        </Badge>}
      </div>
      {busy && <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground" role="status">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking released Hindi and Punjabi versions…
      </div>}
      {!busy && error && <div className="mt-3 flex items-start justify-between gap-3 rounded-lg border border-warning/30 p-3">
        <p className="text-xs text-warning"><AlertTriangle className="mr-1 inline h-3.5 w-3.5" />{error}</p>
        <Button type="button" size="sm" variant="outline" onClick={() => setRetry(value => value + 1)}>
          <RefreshCw className="mr-1 h-3 w-3" />Retry
        </Button>
      </div>}
      {!busy && snapshot && <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {variants.map(variant => <VariantCard key={variant.language} variant={variant} />)}
      </div>}
    </section>
  );
}
