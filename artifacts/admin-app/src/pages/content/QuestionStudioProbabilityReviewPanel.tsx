import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Database, Eye, Loader2, Sigma, ShieldAlert } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QUESTION_STUDIO_REFRESH_EVENT } from '@/features/question-studio/events';
import {
  createProbabilityReviewRun,
  getProbabilityReviewPackage,
  getProbabilityReviewStatus,
  previewProbabilityReview,
  type ProbabilityReviewDifficulty,
  type ProbabilityReviewLanguage,
  type ProbabilityReviewPackage,
  type ProbabilityReviewPackageId,
  type ProbabilityReviewQuestion,
  type ProbabilityReviewStatus,
} from '@/features/question-studio/probability-review-api';

const ALL = 'all';
const LANGUAGE_LABELS: Record<ProbabilityReviewLanguage, string> = { hi: 'Hindi', pa: 'Punjabi' };

type ProbabilityEvidenceStatus = ProbabilityReviewStatus & {
  uniqueApprovedSurfaceCount?: number;
  duplicateApprovedItemCount?: number;
  hindiApprovedQlCount?: number;
  punjabiApprovedQlCount?: number;
  databaseEvidenceComplete?: boolean;
};

function Metric({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-lg border bg-background p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

function ProbabilityQuestionCard({ question }: { question: ProbabilityReviewQuestion }) {
  return (
    <Card className="border-primary/15 bg-background">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{question.packageId}</Badge>
          <Badge variant="outline">{question.qlId}</Badge>
          <Badge variant="secondary">{question.difficultyBand}</Badge>
          <Badge variant="outline">{LANGUAGE_LABELS[question.language]}</Badge>
          {question.validation.valid && <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10"><CheckCircle2 className="h-3 w-3" /> ML-05 parity valid</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">{question.canonicalProblemId} · {question.canonicalItemId}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="whitespace-pre-wrap font-medium leading-6">{question.stem}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {question.optionDetails.map((option) => (
            <div key={`${question.questionId}-${option.label}`} className={`rounded-lg border p-3 ${option.isCorrect ? 'border-success/40 bg-success/5' : ''}`}>
              <p className="font-medium">{option.label}. {option.text}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-success/25 bg-success/5 p-3"><strong>English-authority answer:</strong> {question.answer}</div>
        <details className="rounded-lg border p-3" open>
          <summary className="cursor-pointer font-semibold">Native explanation under review</summary>
          {question.explanation.whatAsked && <p className="mt-3 leading-6 text-muted-foreground">{question.explanation.whatAsked}</p>}
          <ol className="mt-3 space-y-2 leading-6 text-muted-foreground">
            {question.explanation.steps.map((step, index) => <li key={`${question.questionId}-step-${index}`}>{index + 1}. {step}</li>)}
          </ol>
        </details>
        <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
          <p>Math fingerprint: <span className="font-mono">{question.validation.mathematicalFingerprint}</span></p>
          <p>Parameter fingerprint: <span className="font-mono">{question.validation.parameterFingerprint}</span></p>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuestionStudioProbabilityReviewPanel() {
  const [pkg, setPkg] = useState<ProbabilityReviewPackage | null>(null);
  const [status, setStatus] = useState<ProbabilityReviewStatus | null>(null);
  const [language, setLanguage] = useState<ProbabilityReviewLanguage>('hi');
  const [packageId, setPackageId] = useState(ALL);
  const [qlId, setQlId] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<ProbabilityReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<'preview' | 'run' | null>(null);
  const evidenceStatus = status as ProbabilityEvidenceStatus | null;

  const refreshStatus = async () => {
    const next = await getProbabilityReviewStatus();
    setStatus(next);
    return next;
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([getProbabilityReviewPackage(), getProbabilityReviewStatus()])
      .then(([packageResponse, statusResponse]) => {
        if (!active) return;
        setPkg(packageResponse.package);
        setStatus(statusResponse);
      })
      .catch((error) => showToast.error('Probability review unavailable', error instanceof Error ? error.message : 'Unable to load Probability native review.'))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const request = useMemo(() => ({
    language,
    packageId: packageId === ALL ? undefined : packageId as ProbabilityReviewPackageId,
    qlId: qlId === ALL ? undefined : qlId,
    difficulty: difficulty === ALL ? undefined : difficulty as ProbabilityReviewDifficulty,
    count: Math.min(50, Math.max(1, count)),
    seed: seed.trim() || undefined,
  }), [count, difficulty, language, packageId, qlId, seed]);

  const handlePreview = async () => {
    setWorking('preview');
    try {
      const result = await previewProbabilityReview({ ...request, count: Math.min(20, request.count) });
      setQuestions(result.questions);
      showToast.success('Probability preview loaded', `${result.questions.length} native parity question(s) ready for review.`);
    } catch (error) {
      showToast.error('Preview failed', error instanceof Error ? error.message : 'Unable to preview Probability native questions.');
    } finally { setWorking(null); }
  };

  const handleCreateRun = async () => {
    setWorking('run');
    try {
      const result = await createProbabilityReviewRun(request);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshStatus();
      showToast.success('Probability review run created', `${result.publicCode} contains ${result.itemCount} review-only question(s).`);
    } catch (error) {
      showToast.error('Run creation failed', error instanceof Error ? error.message : 'Unable to create Probability native review run.');
    } finally { setWorking(null); }
  };

  return (
    <Card className="border-warning/25 bg-warning/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base"><Sigma className="h-4 w-4" /> Probability · ML-06 native review</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1"><ShieldAlert className="h-3 w-3" /> Review only</Badge>
            <Badge variant="outline">216 QLs · 432 native surfaces</Badge>
            <Badge variant="outline">Hindi/Punjabi</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">Review the exact ML-05 Hindi/Punjabi surfaces while English remains the mathematical, option and answer-key authority. Review approval does not unlock Question Bank, scored mocks or public/student publication.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {status && evidenceStatus && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric label="Unique approval evidence" value={`${evidenceStatus.uniqueApprovedSurfaceCount ?? 0}/${status.nativeReviewSurfaceCount}`} />
              <Metric label="Hindi QLs reviewed" value={`${evidenceStatus.hindiApprovedQlCount ?? 0}/${status.permanentQlCount}`} />
              <Metric label="Punjabi QLs reviewed" value={`${evidenceStatus.punjabiApprovedQlCount ?? 0}/${status.permanentQlCount}`} />
              <Metric label="Committed freeze approvals" value={`${status.releaseFreeze.approvedDecisionCount}/${status.releaseFreeze.requiredDecisionCount}`} />
              <Metric label="Studio items generated" value={status.generationItemCount} />
              <Metric label="Raw approved items" value={status.approvedItemCount} />
              <Metric label="Duplicate approval evidence" value={evidenceStatus.duplicateApprovedItemCount ?? 0} />
              <Metric label="Question Bank links" value={status.questionBankCount} />
            </div>

            <div className={`rounded-lg border bg-background/60 p-3 text-sm ${evidenceStatus.databaseEvidenceComplete ? 'border-success/30' : 'border-warning/30'}`}>
              <div className="flex items-center gap-2 font-medium">
                {evidenceStatus.databaseEvidenceComplete
                  ? <CheckCircle2 className="h-4 w-4 text-success" />
                  : <ShieldAlert className="h-4 w-4" />}
                {evidenceStatus.databaseEvidenceComplete ? 'Database review evidence complete' : 'Human-review evidence incomplete'}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Unique evidence counts each QL-language pair only once, so repeated review runs cannot inflate progress. Raw approvals: {status.approvedItemCount}; unique surfaces: {evidenceStatus.uniqueApprovedSurfaceCount ?? 0}; duplicates: {evidenceStatus.duplicateApprovedItemCount ?? 0}. The committed ML-06 freeze remains a separate release authority and still requires explicit validated decisions before any native delivery can be enabled.
              </p>
            </div>
          </>
        )}

        {loading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading Probability review package…</div> : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <Field label="Language"><Select value={language} onValueChange={(value) => setLanguage(value as ProbabilityReviewLanguage)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(pkg?.supportedLanguages ?? ['hi', 'pa']).map((entry) => <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Package"><Select value={packageId} onValueChange={(value) => { setPackageId(value); setQlId(ALL); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>Both</SelectItem>{(pkg?.packageIds ?? ['PRB-001', 'PRB-002']).map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="QL"><Select value={qlId} onValueChange={setQlId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>All QLs</SelectItem>{(pkg?.qlIds ?? []).map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Difficulty"><Select value={difficulty} onValueChange={setDifficulty}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>All difficulties</SelectItem>{(pkg?.supportedDifficulties ?? []).map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Count"><Input type="number" min={1} max={50} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} /></Field>
            <Field label="Optional deterministic seed"><Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="probability-ml06-review-01" /></Field>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void handlePreview()} disabled={!pkg || working !== null}>{working === 'preview' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />} Preview</Button>
          <Button onClick={() => void handleCreateRun()} disabled={!pkg || working !== null}>{working === 'run' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />} Create review run</Button>
        </div>

        {questions.length > 0 && <div className="space-y-4 border-t pt-5">{questions.map((question) => <ProbabilityQuestionCard key={question.questionId} question={question} />)}</div>}
      </CardContent>
    </Card>
  );
}
