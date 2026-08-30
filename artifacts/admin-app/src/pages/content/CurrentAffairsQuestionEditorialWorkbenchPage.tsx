import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileQuestion,
  History,
  Languages,
  Loader2,
  RefreshCw,
  Save,
  ShieldCheck,
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
  approveCurrentAffairsQuestion,
  getCurrentAffairsQuestionEditorialDetail,
  saveCurrentAffairsEnglishQuestionRevision,
  saveCurrentAffairsQuestionLocalization,
  type CurrentAffairsQuestionEditorialDetail,
  type QuestionPayload,
} from '@/features/current-affairs/question-editorial-api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

type QuestionDraft = { stem: string; explanation: string; options: string[]; reason: string };

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function formatTime(value: string | null | undefined) {
  if (!value) return 'Not observed';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function statusClass(status: string) {
  if (['approved', 'ready', 'manual', 'verified', 'primary_backed', 'corroborated'].includes(status)) return 'border-success/30 bg-success/10 text-success';
  if (['unreviewed', 'needs_editorial', 'missing', 'review'].includes(status)) return 'border-warning/30 bg-warning/10 text-warning';
  if (['revoked', 'rejected', 'failed'].includes(status)) return 'border-destructive/30 bg-destructive/10 text-destructive';
  return 'border-border bg-muted/40 text-muted-foreground';
}

function StatusBadge({ status }: { status: string }) {
  return <Badge variant="outline" className={cn('capitalize', statusClass(status))}>{titleCase(status)}</Badge>;
}

function payloadOptions(payload: QuestionPayload | null | undefined): string[] {
  return Array.isArray(payload?.options) ? payload.options.map((item) => String(item ?? '')) : [];
}

function draftFromPayload(payload: QuestionPayload | null | undefined, fallbackOptions: string[]): QuestionDraft {
  return {
    stem: String(payload?.stem ?? payload?.text ?? ''),
    explanation: String(payload?.explanation ?? ''),
    options: payloadOptions(payload).length > 0 ? payloadOptions(payload) : [...fallbackOptions],
    reason: '',
  };
}

function OptionList({ options, correctIndex, editable, onChange }: {
  options: string[];
  correctIndex: number;
  editable?: boolean;
  onChange?: (index: number, value: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <div key={index} className={cn('rounded-lg border p-3', index === correctIndex && 'border-success/40 bg-success/5')}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Option {String.fromCharCode(65 + index)}</p>
            {index === correctIndex ? <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Correct index</Badge> : null}
          </div>
          {editable ? <Input value={option} onChange={(event) => onChange?.(index, event.target.value)} /> : <p className="text-sm leading-6">{option}</p>}
        </div>
      ))}
    </div>
  );
}

function LanguageEditor({ language, draft, setDraft, correctIndex, optionsLocked }: {
  language: 'Hindi' | 'Punjabi';
  draft: QuestionDraft;
  setDraft: (next: QuestionDraft) => void;
  correctIndex: number;
  optionsLocked: boolean;
}) {
  return (
    <div className="space-y-4">
      <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{language} stem</label><Textarea rows={5} value={draft.stem} onChange={(event) => setDraft({ ...draft, stem: event.target.value })} /></div>
      <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{language} explanation</label><Textarea rows={7} value={draft.explanation} onChange={(event) => setDraft({ ...draft, explanation: event.target.value })} /></div>
      <div>
        <div className="mb-2 flex items-center justify-between gap-2"><label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Options</label><span className="text-xs text-muted-foreground">{optionsLocked ? 'Canonical fact values are locked' : 'Text editable; order is locked'}</span></div>
        <OptionList
          options={draft.options}
          correctIndex={correctIndex}
          editable={!optionsLocked}
          onChange={(index, value) => setDraft({ ...draft, options: draft.options.map((item, itemIndex) => itemIndex === index ? value : item) })}
        />
      </div>
      <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Editorial reason</label><Textarea rows={3} value={draft.reason} onChange={(event) => setDraft({ ...draft, reason: event.target.value })} placeholder="Explain the translation correction or approval decision (minimum 8 characters)." /></div>
    </div>
  );
}

export function CurrentAffairsQuestionEditorialWorkbenchPage() {
  const { generationItemId = '' } = useParams();
  const { hasPermission } = useAdminPermissions();
  const canUpdate = hasPermission('content.questions.update');
  const [data, setData] = useState<CurrentAffairsQuestionEditorialDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<'en' | 'hi' | 'pa' | 'approve' | null>(null);
  const [englishStem, setEnglishStem] = useState('');
  const [englishExplanation, setEnglishExplanation] = useState('');
  const [englishReason, setEnglishReason] = useState('');
  const [hindi, setHindi] = useState<QuestionDraft>({ stem: '', explanation: '', options: [], reason: '' });
  const [punjabi, setPunjabi] = useState<QuestionDraft>({ stem: '', explanation: '', options: [], reason: '' });
  const [approvalReason, setApprovalReason] = useState('');

  const hydrate = useCallback((next: CurrentAffairsQuestionEditorialDetail) => {
    const source = next.item.sourcePayload;
    const sourceOptions = payloadOptions(source);
    setEnglishStem(String(source.stem ?? source.text ?? ''));
    setEnglishExplanation(String(source.explanation ?? ''));
    setEnglishReason('');
    setHindi(draftFromPayload(next.item.hindiPayload, sourceOptions));
    setPunjabi(draftFromPayload(next.item.punjabiPayload, sourceOptions));
    setApprovalReason('');
  }, []);

  const refresh = useCallback(async (silent = false) => {
    if (!generationItemId) {
      setError('Generation item ID is missing.');
      setLoading(false);
      return;
    }
    if (!silent) setLoading(true);
    try {
      const next = await getCurrentAffairsQuestionEditorialDetail(generationItemId);
      setData(next);
      hydrate(next);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load the Current Affairs question workbench.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [generationItemId, hydrate]);

  useEffect(() => { void refresh(); }, [refresh]);

  const item = data?.item;
  const sourceOptions = useMemo(() => payloadOptions(item?.sourcePayload), [item?.sourcePayload]);
  const correctIndex = Number(item?.sourcePayload.correctIndex ?? -1);
  const ql001OptionsLocked = item?.questionFamily === 'CA-QL-001';
  const editBlocked = !canUpdate || !item?.readiness.editable;

  const saveEnglish = async () => {
    if (englishStem.trim().length < 8 || englishExplanation.trim().length < 12 || englishReason.trim().length < 8) {
      showToast.error('English revision not saved', 'Stem, explanation and an editorial reason are required.');
      return;
    }
    setSaving('en');
    try {
      await saveCurrentAffairsEnglishQuestionRevision(generationItemId, { stem: englishStem.trim(), explanation: englishExplanation.trim(), reason: englishReason.trim() });
      showToast.success('New English question version created', 'Options and correct index stayed frozen. Hindi and Punjabi must now match the new version.');
      await refresh(true);
    } catch (caught) {
      showToast.error('English revision blocked', caught instanceof Error ? caught.message : 'Unable to save English question revision.');
    } finally { setSaving(null); }
  };

  const saveLocalization = async (languageCode: 'hi' | 'pa', draft: QuestionDraft) => {
    if (draft.stem.trim().length < 8 || draft.explanation.trim().length < 12 || draft.reason.trim().length < 8) {
      showToast.error('Localization not saved', 'Stem, explanation and an editorial reason are required.');
      return;
    }
    setSaving(languageCode);
    try {
      await saveCurrentAffairsQuestionLocalization(generationItemId, languageCode, {
        stem: draft.stem.trim(),
        explanation: draft.explanation.trim(),
        options: draft.options.map((option) => option.trim()),
        reason: draft.reason.trim(),
      });
      showToast.success(languageCode === 'hi' ? 'Hindi question saved' : 'Punjabi question saved', 'Canonical fact, option order and correct index parity passed.');
      await refresh(true);
    } catch (caught) {
      showToast.error('Localization blocked', caught instanceof Error ? caught.message : 'Unable to save question localization.');
    } finally { setSaving(null); }
  };

  const approve = async () => {
    if (approvalReason.trim().length < 8) {
      showToast.error('Approval reason required', 'Enter at least eight characters for the audit trail.');
      return;
    }
    setSaving('approve');
    try {
      await approveCurrentAffairsQuestion(generationItemId, approvalReason.trim());
      showToast.success('Current Affairs question approved', 'English/Hindi/Punjabi parity is frozen for the release gate. The question remains BANK_ONLY.');
      await refresh(true);
    } catch (caught) {
      showToast.error('Question approval blocked', caught instanceof Error ? caught.message : 'Unable to approve Current Affairs question.');
    } finally { setSaving(null); }
  };

  if (loading && !data) return <div className="flex min-h-[420px] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading question workbench…</div>;
  if (!data || !item) return <div className="space-y-4"><Button variant="ghost" asChild><Link to="/content/current-affairs"><ArrowLeft className="mr-2 h-4 w-4" />Current Affairs Studio</Link></Button><Card><CardContent className="p-6"><p className="text-sm text-destructive">{error ?? 'Question workbench is unavailable.'}</p><Button className="mt-4" onClick={() => void refresh()}><RefreshCw className="mr-2 h-4 w-4" />Retry</Button></CardContent></Card></div>;

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" asChild><Link to="/content/current-affairs"><ArrowLeft className="mr-2 h-4 w-4" />Current Affairs Studio</Link></Button>
      <PageHeader title={`${item.eventPublicCode} · Item ${item.itemNumber}`} description={`${item.eventDate} · ${titleCase(item.category)} · ${item.questionFamily} · BANK_ONLY Current Affairs question review.`} icon={<FileQuestion className="h-5 w-5" />} actions={<Button variant="outline" onClick={() => void refresh()} disabled={loading}><RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />Reload canonical state</Button>} />
      {error ? <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">Refresh warning: {error}</div> : null}
      {!item.readiness.editable ? <div className="flex gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm text-warning"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="font-semibold">Question is read-only.</p><p className="mt-1 text-xs">{item.readiness.blockers.join(' · ')}</p></div></div> : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">English review</p><div className="mt-2"><StatusBadge status={item.generationItemStatus} /></div><p className="mt-2 text-xs text-muted-foreground">Version {item.sourceVersionNumber}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Hindi</p><div className="mt-2"><StatusBadge status={item.hindiStatus ?? 'missing'} /></div><p className="mt-2 text-xs text-muted-foreground">{item.readiness.checks.hindiCurrent ? 'Current English version' : 'Missing or stale'}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Punjabi</p><div className="mt-2"><StatusBadge status={item.punjabiStatus ?? 'missing'} /></div><p className="mt-2 text-xs text-muted-foreground">{item.readiness.checks.punjabiCurrent ? 'Current English version' : 'Missing or stale'}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Canonical fact</p><p className="mt-2 text-sm font-semibold">{item.factValue}</p><p className="mt-2 text-xs text-muted-foreground">{titleCase(item.factKey)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Release lock</p><p className="mt-2 text-sm font-semibold">{item.activeReleaseCode ?? (item.promotionId ? 'Promoted' : 'Not released')}</p><p className="mt-2 text-xs text-muted-foreground">{item.acceptedQuestionId ? 'Canonical bank accepted' : 'BANK_ONLY'}</p></CardContent></Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-4">
          <Card><CardHeader><CardTitle className="text-base">Answer and distractor evidence</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-xs leading-5 text-muted-foreground">The answer index and English options are frozen in CP024. For fact recall, multilingual options are canonical values and stay unchanged. Event-association translations may change option wording but never option order.</p><OptionList options={sourceOptions} correctIndex={correctIndex} /><div className="rounded-lg border p-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Linked verified fact</p><p className="mt-1 text-sm font-medium">{item.factValue}</p><p className="mt-1 text-xs text-muted-foreground">{item.factReconciliationStatus ?? 'verified'} · confidence {Math.round(Number(item.factConfidence ?? 0) * 100)}% · {item.factSupportCount ?? 0} support / {item.factPrimarySupportCount ?? 0} primary</p></div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Evidence sources</CardTitle></CardHeader><CardContent className="space-y-3">{data.sources.map((source) => <div key={source.sourceUrl} className="rounded-lg border p-3"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold">{source.sourceName}</p>{source.isPrimaryEvidence ? <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Primary</Badge> : null}</div><p className="mt-2 text-sm leading-5">{source.sourceTitle || 'Untitled source evidence'}</p><p className="mt-1 text-xs text-muted-foreground">trust {Math.round(source.trustScore * 100)}% · {formatTime(source.sourcePublishedAt)}</p><a href={source.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Open source <ExternalLink className="h-3 w-3" /></a></div>)}</CardContent></Card>
        </div>

        <Card><CardHeader><CardTitle className="flex items-center justify-between gap-3 text-base"><span className="flex items-center gap-2"><Languages className="h-4 w-4 text-primary" />Question editor</span><Badge variant="outline">Correct index {correctIndex + 1}</Badge></CardTitle></CardHeader><CardContent><Tabs defaultValue="en" className="space-y-4"><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="hi">Hindi</TabsTrigger><TabsTrigger value="pa">Punjabi</TabsTrigger></TabsList>
          <TabsContent value="en" className="space-y-4"><div className="rounded-lg border bg-muted/30 p-3 text-xs leading-5 text-muted-foreground">English edits create a new immutable generation-item version. Options and correct index are evidence-locked. Existing Hindi/Punjabi drafts remain historical and must be reviewed against the new version.</div><div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">English stem</label><Textarea rows={5} value={englishStem} onChange={(event) => setEnglishStem(event.target.value)} /></div><div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">English explanation</label><Textarea rows={7} value={englishExplanation} onChange={(event) => setEnglishExplanation(event.target.value)} /></div><div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Frozen options</label><OptionList options={sourceOptions} correctIndex={correctIndex} /></div><div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Editorial reason</label><Textarea rows={3} value={englishReason} onChange={(event) => setEnglishReason(event.target.value)} placeholder="Explain the wording/explanation correction." /></div><Button disabled={editBlocked || saving !== null} onClick={() => void saveEnglish()}>{saving === 'en' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save new English version</Button></TabsContent>
          <TabsContent value="hi" className="space-y-4"><p className="text-xs text-muted-foreground">Current localization: {item.hindiStatus ?? 'missing'} · {formatTime(item.hindiUpdatedAt)}</p><LanguageEditor language="Hindi" draft={hindi} setDraft={setHindi} correctIndex={correctIndex} optionsLocked={ql001OptionsLocked} /><Button disabled={editBlocked || saving !== null} onClick={() => void saveLocalization('hi', hindi)}>{saving === 'hi' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save Hindi question</Button></TabsContent>
          <TabsContent value="pa" className="space-y-4"><p className="text-xs text-muted-foreground">Current localization: {item.punjabiStatus ?? 'missing'} · {formatTime(item.punjabiUpdatedAt)}</p><LanguageEditor language="Punjabi" draft={punjabi} setDraft={setPunjabi} correctIndex={correctIndex} optionsLocked={ql001OptionsLocked} /><Button disabled={editBlocked || saving !== null} onClick={() => void saveLocalization('pa', punjabi)}>{saving === 'pa' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save Punjabi question</Button></TabsContent>
        </Tabs></CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_.7fr]">
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><History className="h-4 w-4 text-primary" />English version history</CardTitle></CardHeader><CardContent className="space-y-2">{data.versionHistory.map((version) => <div key={version.id} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="text-sm font-semibold">Version {version.versionNumber}</p><p className="mt-1 truncate text-xs text-muted-foreground">{String(version.payload.stem ?? version.payload.text ?? 'No stem')}</p></div><p className="text-xs text-muted-foreground">{formatTime(version.createdAt)}</p></div>)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4 text-primary" />Editorial approval</CardTitle></CardHeader><CardContent className="space-y-3">{item.readiness.approvable ? <p className="flex items-center gap-2 text-sm text-success"><CheckCircle2 className="h-4 w-4" />All EN/HI/PA parity gates are ready.</p> : <div><p className="text-sm font-medium text-warning">Approval blockers</p><ul className="mt-2 space-y-1 text-xs text-muted-foreground">{item.readiness.blockers.map((blocker) => <li key={blocker}>• {blocker}</li>)}</ul></div>}<Textarea rows={4} value={approvalReason} onChange={(event) => setApprovalReason(event.target.value)} placeholder="Approval reason (minimum 8 characters)" /><Button disabled={!canUpdate || !item.readiness.approvable || saving !== null} onClick={() => void approve()}>{saving === 'approve' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}Approve multilingual question</Button><p className="text-xs leading-5 text-muted-foreground">Approval changes only the generation-item review status. It does not promote to the Question Bank, assign taxonomy, unlock tests, or publish publicly.</p></CardContent></Card>
      </div>
    </div>
  );
}

export default CurrentAffairsQuestionEditorialWorkbenchPage;
