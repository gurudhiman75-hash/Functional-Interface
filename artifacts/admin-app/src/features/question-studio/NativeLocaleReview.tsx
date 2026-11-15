import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Languages, Loader2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExplanationDiagrams } from './ExplanationDiagrams';
import { loadNativePreview } from './native-review-preview-cache';
import {
  getQuestionStudioNativeEditorial,
  saveQuestionStudioNativeEditorial,
  decideQuestionStudioNativeEditorial,
  approveQuestionStudioNativeLanguages,
  promoteQuestionStudioNativeEditorial,
  type NativeEditorialDraft,
  type NativeReviewQuestion,
  type NativeReviewLocalizations,
  type NativeReviewVariant,
  type QuestionStudioItem,
} from './api';

// Discover language coverage from the registered Question Studio capabilities,
// never from a hardcoded chapter-name allowlist.
const LANGUAGE_NAMES = { hi: 'हिन्दी · Hindi', pa: 'ਪੰਜਾਬੀ · Punjabi' } as const;
const EDITORIAL_ENABLED = import.meta.env.VITE_QUESTION_STUDIO_NATIVE_EDITORIAL_ENABLED === 'true';

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

function VariantCard({ variant, draft, busy, englishApproved, editorialEnabled, onSave, onDecision }: {
  variant: NativeReviewVariant;
  draft?: NativeEditorialDraft;
  busy: boolean;
  englishApproved: boolean;
  editorialEnabled: boolean;
  onSave: (question: NativeReviewQuestion, reason: string, expectedRevision: number) => Promise<void>;
  onDecision: (decision: 'approved' | 'needs_fix', reason: string, expectedRevision: number) => Promise<void>;
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [editing, setEditing] = useState(false);
  const [working, setWorking] = useState<NativeReviewQuestion | null>(null);
  const [reason, setReason] = useState('');
  const name = LANGUAGE_NAMES[variant.language];
  const visible: NativeReviewQuestion | null = draft ?? (variant.status === 'verified' ? variant : null);
  const update = (change: Partial<NativeReviewQuestion>) => setWorking(previous => ({...(previous ?? visible!), ...change}));
  if (!visible) return (
    <div className="rounded-xl border border-warning/30 bg-warning/5 p-3" aria-label={name + ' localization blocked'}>
      <div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">{name}</span>
        <Badge variant="outline">Needs verification</Badge></div>
      <p className="mt-3 text-xs text-warning"><AlertTriangle className="mr-1 inline h-3.5 w-3.5" />
        {variant.status === 'blocked' ? variant.reason : 'Localization unavailable'}</p>
    </div>
  );
  const q = working ?? visible;
  const reasonValid = reason.trim().length >= 8;
  const approvalReason=reasonValid ? reason.trim() : 'Verified localized question, options, and explanation against canonical English.';
  return (
    <div className="min-w-0 rounded-xl border bg-background p-3" aria-label={name + ' native localization'}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold">{name}</span>
        <Badge variant="outline">{draft ? (
          draft.status === 'approved' ? 'Editorially approved' :
          draft.status === 'needs_fix' ? 'Needs changes' : 'Saved draft'
        ) : 'Generated · answer index checked'}</Badge>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {draft ? `Draft revision ${draft.revision} · linked to this English source version` :
          'Native draft not saved or editorially approved'}
      </p>
      {editing ? (
        <div lang={variant.language} className="mt-3 space-y-3">
          <label className="block text-xs font-medium">Question stem
            <Textarea className="mt-1" value={q.stem} onChange={event => update({stem:event.target.value})} rows={3} />
          </label>
          {q.options.map((option,index) => (
            <label key={index} className="block text-xs font-medium">
              Option {String.fromCharCode(65+index)} {index===visible.correctIndex && '· correct answer'}
              <Input className="mt-1" value={option} onChange={event => update({options:q.options.map((v,i)=>i===index?event.target.value:v)})} />
            </label>
          ))}
          <label className="block text-xs font-medium">Localized explanation
            <Textarea className="mt-1" value={q.explanation} rows={6}
              onChange={event => update({explanation:event.target.value})} />
          </label>
          <p className="text-xs text-muted-foreground">
            Answer position and number of options are locked to English. Check figures, units and grammar manually.
          </p>
        </div>
      ) : (
        <>
          <p lang={variant.language} className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{visible.stem}</p>
          <div lang={variant.language} className="mt-3 space-y-1.5">
            {visible.options.map((option,index) => (
              <div key={index} className={'rounded-md border px-2.5 py-2 text-xs ' +
                (index === visible.correctIndex ? 'border-success/40 bg-success/5' : '')}>
                <span className="mr-2 font-mono font-semibold">{String.fromCharCode(65 + index)}.</span>{option}
                {index === visible.correctIndex && <span className="ml-2 text-[10px] text-success">(correct)</span>}
              </div>
            ))}
          </div>
          <Button type="button" size="sm" variant="ghost" className="mt-3 h-8 px-1 text-xs"
            onClick={() => setShowExplanation(value => !value)}>
            {showExplanation ? 'Hide explanation' : 'Show localized explanation'}
          </Button>
          {showExplanation && <div lang={variant.language} className="mt-2 rounded-lg border bg-muted/20 p-3 text-xs leading-relaxed">
            <ExplanationDiagrams explanation={visible.explanation} />
          </div>}
        </>
      )}
      {editorialEnabled && <div className="mt-3 space-y-2 border-t pt-3">
        <label className="block text-xs font-medium">Editorial reason / notes (minimum 8 characters)
          <Textarea className="mt-1" rows={2} value={reason} onChange={event=>setReason(event.target.value)}
            placeholder="Check Punjabi grammar, mathematical values and explanation..." />
        </label>
        {!englishApproved && !editing && <p className="text-xs text-warning">
          Approve the English source first to unlock language approvals.
        </p>}
        <div className="flex flex-wrap gap-2">
          {editing ? <>
            <Button type="button" size="sm" disabled={busy || !reasonValid || !q.stem.trim() || !q.explanation.trim() ||
                q.options.some(option=>!option.trim())}
              onClick={() => void onSave(q,reason,draft?.revision ?? 0).then(()=>{setEditing(false);setWorking(null);setReason('');}).catch(()=>{})}>
              Save language draft
            </Button>
            <Button type="button" size="sm" variant="outline" disabled={busy}
              onClick={()=>{setEditing(false);setWorking(null);}}>Cancel</Button>
          </> : <>
            <Button type="button" size="sm" variant="outline" disabled={busy}
              onClick={()=>{setWorking({...visible,options:[...visible.options]});setEditing(true);}}>Edit language</Button>
            <Button type="button" size="sm"
              disabled={busy || !englishApproved || draft?.status==='approved' ||
                draft?.status==='needs_fix' || variant.status!=='verified'}
              onClick={()=>void onDecision('approved',approvalReason,draft?.revision ?? 0).then(()=>setReason('')).catch(()=>{})}>
              Approve {variant.language.toUpperCase()}
            </Button>
            <Button type="button" size="sm" variant="outline" disabled={busy || !draft || !reasonValid ||
                variant.status!=='verified'}
              onClick={()=>void onDecision('needs_fix',reason,draft!.revision).then(()=>setReason('')).catch(()=>{})}>
              Needs fix
            </Button>
          </>}
        </div>
      </div>}
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
  const [drafts, setDrafts] = useState<NativeEditorialDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [handoffReason, setHandoffReason] = useState('');
  const [handoffSuccess, setHandoffSuccess] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [languageView, setLanguageView] = useState<'both'|'hi'|'pa'>('both');
  const [busy, setBusy] = useState(false);
  const token = item.id + ':' + item.currentVersionNumber;
  // Native regeneration and saved editorial rows have different latency.
  // Load them independently: a quick draft read must not be hidden behind
  // a slower generator, and switching questions reuses an immutable preview.
  useEffect(() => {
    if (!eligible) return;
    let live=true;
    setSnapshot(null);
    setDrafts([]);
    setError(null);
    setActionError(null);
    setBusy(true);
    const forced=retry>0;
    void loadNativePreview(item.id,item.currentVersionNumber,forced)
      .then(result=>{
        if(!live) return;
        if(result.itemId!==item.id || result.version!==item.currentVersionNumber)
          throw new Error('The preview belongs to a different review version.');
        setSnapshot(result);
      })
      .catch(caught=>{
        if(live) setError(caught instanceof Error?caught.message:'Could not load localized versions.');
      })
      .finally(()=>{if(live)setBusy(false);});
    if(EDITORIAL_ENABLED){
      void getQuestionStudioNativeEditorial(item.id,item.currentVersionNumber)
        .then(editorial=>{
          if(!live)return;
          if(editorial.itemId!==item.id || editorial.version!==item.currentVersionNumber)
            throw new Error('Saved language drafts belong to a different source version.');
          setDrafts(editorial.locales);
        })
        .catch(caught=>{
          if(live)setActionError(caught instanceof Error?caught.message:'Could not load saved edits.');
        });
    }
    return ()=>{live=false;};
  },[eligible,token,retry]);

  async function refreshEditorial() {
    const editorial=await getQuestionStudioNativeEditorial(item.id,item.currentVersionNumber);
    if(editorial.itemId!==item.id || editorial.version!==item.currentVersionNumber)
      throw new Error('Saved edits belong to another source version.');
    setDrafts(editorial.locales);
  }

  async function save(language: 'hi' | 'pa', question: NativeReviewQuestion, reason: string, expectedRevision: number) {
    setSaving(true);setActionError(null);
    try {
      await saveQuestionStudioNativeEditorial(item.id,language,{
        expectedVersion:item.currentVersionNumber,expectedRevision,changeReason:reason,question,
      });
      await refreshEditorial();
    }catch(error){
      const message=error instanceof Error?error.message:'Could not save localized draft.';
      setActionError(message);throw error;
    }finally{setSaving(false);}
  }
  async function decide(language:'hi'|'pa',decision:'approved'|'needs_fix',reason:string,expectedRevision:number) {
    setSaving(true);setActionError(null);
    try {
      if(decision==='approved'){
        await approveQuestionStudioNativeLanguages(item.id,{
          expectedVersion:item.currentVersionNumber,languages:[language],
          revisions:{
            hi:language==='hi'?expectedRevision:(drafts.find(d=>d.language==='hi')?.revision ?? 0),
            pa:language==='pa'?expectedRevision:(drafts.find(d=>d.language==='pa')?.revision ?? 0),
          },
          reason,
        });
      }else{
        await decideQuestionStudioNativeEditorial(item.id,language,{
          expectedVersion:item.currentVersionNumber,expectedRevision,decision,reason,
        });
      }
      await refreshEditorial();
    }catch(error){
      setActionError(error instanceof Error?error.message:'Could not record language decision.');
      throw error;
    }finally{setSaving(false);}
  }
  const remainingLanguages=(['hi','pa'] as const).filter(language=>
    supportedLanguages.includes(language) &&
    !drafts.some(d=>d.language===language && d.status==='approved'));
  const allReadyForApproval=Boolean(snapshot) && item.status==='approved' &&
    remainingLanguages.length>0 &&
    remainingLanguages.every(language=>
      !drafts.some(d=>d.language===language && d.status==='needs_fix') &&
      snapshot.variants.some(v=>v.language===language && v.status==='verified'));
  async function approveRemainingLanguages() {
    if(!allReadyForApproval||saving)return;
    setSaving(true);setActionError(null);
    try{
      await approveQuestionStudioNativeLanguages(item.id,{
        expectedVersion:item.currentVersionNumber,
        languages:remainingLanguages,
        revisions:{
          hi:drafts.find(d=>d.language==='hi')?.revision ?? 0,
          pa:drafts.find(d=>d.language==='pa')?.revision ?? 0,
        },
        reason:'Reviewed all remaining native versions against approved English source.',
      });
      await refreshEditorial();
    }catch(error){
      setActionError(error instanceof Error?error.message:'Could not approve all languages.');
    }finally{setSaving(false);}
  }
  const readyForHandoff = item.status === 'approved' &&
    drafts.some(d => d.language === 'hi' && d.status === 'approved') &&
    drafts.some(d => d.language === 'pa' && d.status === 'approved');
  async function sendToBankReview() {
    const hindi = drafts.find(d=>d.language==='hi');
    const punjabi = drafts.find(d=>d.language==='pa');
    if (!hindi || !punjabi || !readyForHandoff || handoffReason.trim().length < 8) return;
    setSaving(true);setActionError(null);
    try {
      await promoteQuestionStudioNativeEditorial(item.id,{
        expectedVersion:item.currentVersionNumber,
        revisions:{hi:hindi.revision,pa:punjabi.revision},
        reason:handoffReason,
      });
      setHandoffSuccess(true);
    }catch(error){
      setActionError(error instanceof Error ? error.message : 'Could not send to bank review.');
    }finally{setSaving(false);}
  }
  const variants = useMemo(() => {
    if(snapshot) return snapshot.variants;
    if(!EDITORIAL_ENABLED) return [] as NativeReviewVariant[];
    return drafts.map(draft=>({
      language:draft.language,status:'blocked' as const,
      reason:'Generated comparison still loading; editorial draft is available.',
    }));
  },[snapshot,drafts]);
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
            English source above · same CP, QL and seed · {EDITORIAL_ENABLED ? 'edit and approve each language separately; nothing is published automatically' : 'read-only generated previews; no language approval recorded'}
          </p>
        </div>
        {snapshot && <Badge variant="outline" className="text-[10px]">
          {variants.filter(variant => variant.status === 'verified').length}/2 localized versions verified
        </Badge>}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1 rounded-lg border bg-background p-1" role="group" aria-label="Native review language view">
        {([
          ['both','Compare both'],['hi','Hindi only'],['pa','Punjabi only'],
        ] as const).map(([value,label])=><Button key={value} type="button" size="sm"
          variant={languageView===value?'secondary':'ghost'}
          aria-pressed={languageView===value}
          className="h-8 text-xs"
          onClick={()=>setLanguageView(value)}>{label}</Button>)}
      </div>
      {busy && <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground" role="status">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying native languages in parallel; saved edits are available as soon as they load…
      </div>}
      {error && <div className="mt-3 flex items-start justify-between gap-3 rounded-lg border border-warning/30 p-3">
        <p className="text-xs text-warning"><AlertTriangle className="mr-1 inline h-3.5 w-3.5" />{error}</p>
        <Button type="button" size="sm" variant="outline" onClick={() => setRetry(value => value + 1)}>
          <RefreshCw className="mr-1 h-3 w-3" />Retry
        </Button>
      </div>}
      {actionError && <p role="alert" className="mt-2 text-xs text-destructive">{actionError}</p>}
      {EDITORIAL_ENABLED && <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-background p-3">
        <div>
          <p className="text-xs font-semibold">English approval: {item.status==='approved'?'Approved':'Required first'}</p>
          <p className="text-[11px] text-muted-foreground">
            {item.status==='approved'
              ? 'Approve each generated language below, or approve remaining languages in one action.'
              : 'Use Approve on the English question above before approving Hindi or Punjabi.'}
          </p>
        </div>
        <Button size="sm" type="button" disabled={!allReadyForApproval || saving}
          onClick={()=>void approveRemainingLanguages()}>
          <CheckCircle2 className="mr-1 h-4 w-4" />
          Approve remaining languages
        </Button>
      </div>}
      {EDITORIAL_ENABLED && snapshot && <div className="mt-4 border-t pt-3">
        <p className="text-xs font-semibold">Question Bank translation handoff</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Requires approved English and separately reviewed Hindi/Punjabi. Creates translation drafts
          for the canonical bank question; does not approve their publication or student delivery.
        </p>
        {handoffSuccess ? <p role="status" className="mt-2 text-xs text-success">
          Sent to Question Bank translation drafts. Complete the normal translation review to approve release.
        </p> : <>
          <label className="mt-2 block text-xs font-medium">Handoff reason
            <Textarea rows={2} className="mt-1" value={handoffReason}
              onChange={event=>setHandoffReason(event.target.value)}
              placeholder="Both language versions independently reviewed and checked..." />
          </label>
          <Button className="mt-2" size="sm" type="button"
            disabled={!readyForHandoff || handoffReason.trim().length < 8 || saving}
            onClick={()=>void sendToBankReview()}>
            Send approved languages to Question Bank review
          </Button>
          {!readyForHandoff && <p className="mt-1 text-xs text-muted-foreground">
            Approve the English item and both language drafts before handoff.
          </p>}
        </>}
      </div>}
      {(snapshot || drafts.length > 0) && <div className={languageView==='both' ? "mt-3 grid gap-3 lg:grid-cols-2" : "mt-3 max-w-3xl"}>
        {variants.filter(variant=>languageView==='both' || variant.language===languageView).map(variant => <VariantCard key={variant.language} variant={variant}
          draft={drafts.find(draft=>draft.language===variant.language)} busy={saving} englishApproved={item.status==='approved'} editorialEnabled={EDITORIAL_ENABLED}
          onSave={(question,reason,revision)=>save(variant.language,question,reason,revision)}
          onDecision={(decision,reason,revision)=>decide(variant.language,decision,reason,revision)} />)}
      </div>}
    </section>
  );
}
