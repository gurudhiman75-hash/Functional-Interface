import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, ExternalLink, FileQuestion, Loader2, RefreshCw, Save, ShieldCheck } from 'lucide-react';
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
  approveCurrentAffairsQuestionEditorial,
  getCurrentAffairsQuestionEditorialDetail,
  saveCurrentAffairsQuestionEnglish,
  saveCurrentAffairsQuestionLocalization,
  type CurrentAffairsQuestionEditorialDetail,
  type CurrentAffairsQuestionPayload,
} from '@/features/current-affairs/editorial-api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

type QuestionDraft = { stem: string; explanation: string; options: string[]; reason: string };

function payloadDraft(payload: CurrentAffairsQuestionPayload | null): QuestionDraft {
  return {
    stem: String(payload?.stem ?? payload?.text ?? ''),
    explanation: String(payload?.explanation ?? ''),
    options: Array.isArray(payload?.options) ? payload.options.map((item) => String(item)) : [],
    reason: '',
  };
}

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function CurrentAffairsEditorialQuestionPage() {
  const { generationItemId = '' } = useParams();
  const { hasPermission } = useAdminPermissions();
  const canUpdate = hasPermission('content.questions.update');
  const [data, setData] = useState<CurrentAffairsQuestionEditorialDetail | null>(null);
  const [english, setEnglish] = useState<QuestionDraft>(() => payloadDraft(null));
  const [hindi, setHindi] = useState<QuestionDraft>(() => payloadDraft(null));
  const [punjabi, setPunjabi] = useState<QuestionDraft>(() => payloadDraft(null));
  const [approvalReason, setApprovalReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!generationItemId) return;
    setLoading(true);
    try {
      const next = await getCurrentAffairsQuestionEditorialDetail(generationItemId);
      setData(next);
      setEnglish(payloadDraft(next.item.sourcePayload));
      setHindi(payloadDraft(next.item.hindiPayload));
      setPunjabi(payloadDraft(next.item.punjabiPayload));
      setApprovalReason('');
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Current Affairs question editorial detail.');
    } finally {
      setLoading(false);
    }
  }, [generationItemId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const saveEnglish = async () => {
    if (!generationItemId || !canUpdate || !data?.item.readiness.editable) return;
    setWorking('en');
    try {
      await saveCurrentAffairsQuestionEnglish(generationItemId, { stem: english.stem, explanation: english.explanation, reason: english.reason });
      showToast.success('English question revision saved', 'A new BANK_ONLY generation-item version was created for editorial review.');
      await refresh();
    } catch (caught) {
      showToast.error('Unable to save English question', caught instanceof Error ? caught.message : 'Request failed.');
    } finally {
      setWorking(null);
    }
  };

  const saveLocalization = async (languageCode: 'hi' | 'pa', draft: QuestionDraft) => {
    if (!generationItemId || !canUpdate || !data?.item.readiness.editable) return;
    setWorking(languageCode);
    try {
      await saveCurrentAffairsQuestionLocalization(generationItemId, languageCode, {
        stem: draft.stem,
        explanation: draft.explanation,
        options: draft.options,
        reason: draft.reason,
      });
      showToast.success(`${languageCode === 'hi' ? 'Hindi' : 'Punjabi'} question saved`, 'Option order, canonical fact value and target-script gates passed.');
      await refresh();
    } catch (caught) {
      showToast.error('Unable to save question localization', caught instanceof Error ? caught.message : 'Request failed.');
    } finally {
      setWorking(null);
    }
  };

  const approve = async () => {
    if (!generationItemId || !canUpdate || !data?.item.readiness.approvable) return;
    setWorking('approve');
    try {
      await approveCurrentAffairsQuestionEditorial(generationItemId, approvalReason);
      showToast.success('BANK_ONLY question approved', 'Editorial approval is complete. This action does not promote, release or publish the question.');
      await refresh();
    } catch (caught) {
      showToast.error('Unable to approve question', caught instanceof Error ? caught.message : 'Request failed.');
    } finally {
      setWorking(null);
    }
  };

  if (loading && !data) return <div className="flex min-h-[360px] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading BANK_ONLY question evidence…</div>;
  if (!data) return <div className="space-y-4"><Button variant="ghost" size="sm" asChild><Link to="/content/current-affairs"><ArrowLeft className="mr-2 h-4 w-4" />Editorial queue</Link></Button><Card><CardContent className="p-6 text-sm text-destructive">{error ?? 'Question not available.'}</CardContent></Card></div>;

  const item = data.item;
  const writable = Boolean(canUpdate && item.readiness.editable);
  const correctIndex = Number(item.sourcePayload.correctIndex);

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" asChild><Link to="/content/current-affairs"><ArrowLeft className="mr-2 h-4 w-4" />Editorial queue</Link></Button>
      <PageHeader
        title={`${item.eventPublicCode} · Q${item.itemNumber}`}
        description={`${item.eventDate} · ${item.questionFamily} · BANK_ONLY editorial lifecycle. No release or learner-publication authority is exposed here.`}
        icon={<FileQuestion className="h-5 w-5" />}
        actions={<Button variant="outline" onClick={() => void refresh()} disabled={loading || Boolean(working)}><RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />Refresh</Button>}
      />

      {error ? <GateMessage text={error} destructive /> : null}
      {!canUpdate ? <GateMessage text="You have read-only access. content.questions.update is required for question editorial actions." /> : null}
      {item.readiness.blockers.length > 0 ? <div className="space-y-2">{item.readiness.blockers.map((blocker) => <GateMessage key={blocker} text={blocker} destructive={item.hasOpenConflict} />)}</div> : null}

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader><CardTitle className="flex items-center justify-between text-base"><span>Canonical question context</span><div className="flex gap-2"><Badge variant="outline">{titleCase(item.generationItemStatus)}</Badge>{item.readiness.approvable ? <Badge variant="outline" className="border-success/30 bg-success/10 text-success"><CheckCircle2 className="mr-1 h-3 w-3" />Approvable</Badge> : null}</div></CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Verified event</p><p className="mt-1 font-medium">{item.eventTitle}</p><p className="mt-1 text-xs text-muted-foreground">{item.category} · event status {item.eventStatus}</p></div>
            <div className="rounded-lg border p-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Question fact</p><p className="mt-1"><span className="font-medium">{titleCase(item.factKey)}:</span> {item.factValue}</p><p className="mt-1 text-xs text-muted-foreground">Reconciliation {item.factReconciliationStatus ?? 'n/a'} · support {item.factSupportCount ?? 0} · primary {item.factPrimarySupportCount ?? 0}</p></div>
            <div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">English options</p><div className="mt-2 space-y-2">{(item.sourcePayload.options ?? []).map((option, index) => <div key={`${index}-${option}`} className={cn('rounded-md border px-3 py-2', index === correctIndex && 'border-success/30 bg-success/5')}><span className="mr-2 font-semibold">{String.fromCharCode(65 + index)}.</span>{option}{index === correctIndex ? <Badge variant="outline" className="ml-2 border-success/30 bg-success/10 text-success">Correct</Badge> : null}</div>)}</div></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Evidence sources</CardTitle></CardHeader>
          <CardContent className="space-y-2">{data.sources.map((source) => <div key={`${source.sourceKey}-${source.sourceUrl}`} className="rounded-lg border p-3 text-sm"><div className="flex items-start justify-between gap-2"><div><p className="font-medium">{source.sourceName}</p><p className="mt-1 text-xs text-muted-foreground">{source.sourceTitle}</p></div>{source.isPrimaryEvidence ? <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Primary</Badge> : null}</div><a href={source.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center text-xs text-primary hover:underline">Open evidence <ExternalLink className="ml-1 h-3 w-3" /></a></div>)}</CardContent>
        </Card>
      </div>

      <EnglishQuestionEditor draft={english} setDraft={setEnglish} writable={writable} saving={working === 'en'} onSave={() => void saveEnglish()} />
      <div className="grid gap-4 xl:grid-cols-2">
        <LocalizedQuestionEditor label="Hindi" code="HI" draft={hindi} setDraft={setHindi} writable={writable} saving={working === 'hi'} onSave={() => void saveLocalization('hi', hindi)} sourceOptionCount={(item.sourcePayload.options ?? []).length} />
        <LocalizedQuestionEditor label="Punjabi" code="PA" draft={punjabi} setDraft={setPunjabi} writable={writable} saving={working === 'pa'} onSave={() => void saveLocalization('pa', punjabi)} sourceOptionCount={(item.sourcePayload.options ?? []).length} />
      </div>

      <Card className={item.readiness.approvable ? 'border-success/30' : undefined}>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4" />BANK_ONLY editorial approval</CardTitle></CardHeader>
        <CardContent className="space-y-3"><p className="text-sm text-muted-foreground">Approval only accepts this reviewed generation item into its editorial state. It does not promote it to the Question Bank, create a release, notify learners or publish anything.</p><div className="space-y-1.5"><Label>Approval reason</Label><Textarea rows={2} value={approvalReason} onChange={(event) => setApprovalReason(event.target.value)} placeholder="Required editorial rationale" disabled={!item.readiness.approvable || !canUpdate || working === 'approve'} /></div><Button onClick={() => void approve()} disabled={!canUpdate || !item.readiness.approvable || approvalReason.trim().length < 8 || working === 'approve'}>{working === 'approve' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}Approve BANK_ONLY draft</Button></CardContent>
      </Card>
    </div>
  );
}

function EnglishQuestionEditor({ draft, setDraft, writable, saving, onSave }: { draft: QuestionDraft; setDraft: (draft: QuestionDraft) => void; writable: boolean; saving: boolean; onSave: () => void }) {
  return <Card><CardHeader><CardTitle className="text-base">English question revision</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-1.5"><Label>Stem</Label><Textarea rows={4} value={draft.stem} onChange={(event) => setDraft({ ...draft, stem: event.target.value })} disabled={!writable || saving} /></div><div className="space-y-1.5"><Label>Explanation</Label><Textarea rows={6} value={draft.explanation} onChange={(event) => setDraft({ ...draft, explanation: event.target.value })} disabled={!writable || saving} /></div><p className="text-xs text-muted-foreground">English editorial revision intentionally does not edit options or the canonical answer.</p><div className="space-y-1.5"><Label>Editorial reason</Label><Textarea rows={2} value={draft.reason} onChange={(event) => setDraft({ ...draft, reason: event.target.value })} disabled={!writable || saving} /></div><Button onClick={onSave} disabled={!writable || saving || draft.reason.trim().length < 8}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save English revision</Button></CardContent></Card>;
}

function LocalizedQuestionEditor({ label, code, draft, setDraft, writable, saving, onSave, sourceOptionCount }: { label: string; code: string; draft: QuestionDraft; setDraft: (draft: QuestionDraft) => void; writable: boolean; saving: boolean; onSave: () => void; sourceOptionCount: number }) {
  const optionsValid = draft.options.length === sourceOptionCount && draft.options.every((option) => option.trim().length > 0);
  return <Card><CardHeader><CardTitle className="flex items-center justify-between text-base"><span>{label} question</span><Badge variant="outline">{code}</Badge></CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-1.5"><Label>Stem</Label><Textarea rows={4} value={draft.stem} onChange={(event) => setDraft({ ...draft, stem: event.target.value })} disabled={!writable || saving} /></div><div className="space-y-1.5"><Label>Explanation</Label><Textarea rows={5} value={draft.explanation} onChange={(event) => setDraft({ ...draft, explanation: event.target.value })} disabled={!writable || saving} /></div><div className="space-y-2"><Label>Options · preserve count and order</Label>{Array.from({ length: sourceOptionCount }).map((_, index) => <div key={index} className="flex items-center gap-2"><span className="w-6 text-xs font-semibold text-muted-foreground">{String.fromCharCode(65 + index)}</span><Input value={draft.options[index] ?? ''} onChange={(event) => { const options = Array.from({ length: sourceOptionCount }, (_, optionIndex) => draft.options[optionIndex] ?? ''); options[index] = event.target.value; setDraft({ ...draft, options }); }} disabled={!writable || saving} /></div>)}</div><p className="text-xs text-muted-foreground">The server rechecks canonical fact preservation, option order/count, correct index and target-language script. Fact-recall families may require canonical options to remain unchanged.</p><div className="space-y-1.5"><Label>Editorial reason</Label><Textarea rows={2} value={draft.reason} onChange={(event) => setDraft({ ...draft, reason: event.target.value })} disabled={!writable || saving} /></div><Button onClick={onSave} disabled={!writable || saving || !optionsValid || draft.reason.trim().length < 8}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save {label}</Button></CardContent></Card>;
}

function GateMessage({ text, destructive = false }: { text: string; destructive?: boolean }) {
  return <div className={cn('rounded-lg border px-4 py-3 text-sm', destructive ? 'border-destructive/30 bg-destructive/5 text-destructive' : 'border-warning/30 bg-warning/10 text-warning')}>{destructive ? <AlertTriangle className="mr-2 inline h-4 w-4" /> : null}{text}</div>;
}

export default CurrentAffairsEditorialQuestionPage;
