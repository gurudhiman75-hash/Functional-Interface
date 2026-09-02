import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Database, Eye, Landmark, Layers3, Loader2, ShieldAlert } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QUESTION_STUDIO_REFRESH_EVENT } from '@/features/question-studio/events';
import {
  createInterestReviewRun,
  getInterestReviewPackage,
  getInterestReviewStatus,
  previewInterestReview,
  type InterestReviewCheckpointId,
  type InterestReviewLanguage,
  type InterestReviewPackage,
  type InterestReviewQuestion,
  type InterestReviewStatus,
} from '@/features/question-studio/interest-review-api';

const ALL = 'all';
const LANGUAGE_LABELS: Record<InterestReviewLanguage, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
};

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

function InterestQuestionCard({ question }: { question: InterestReviewQuestion }) {
  return (
    <Card className="border-primary/15 bg-background">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{question.checkpointId}</Badge>
          <Badge variant="outline">{question.qlId}</Badge>
          <Badge variant="secondary">{question.difficultyBand}</Badge>
          <Badge variant="outline">{LANGUAGE_LABELS[question.language]}</Badge>
          <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
            <CheckCircle2 className="h-3 w-3" /> Frozen authority
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{question.questionId}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="whitespace-pre-wrap font-medium leading-6">{question.stem}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {question.options.map((option, index) => (
            <div
              key={`${question.questionId}-option-${index}`}
              className={`rounded-lg border p-3 ${index === question.correctIndex ? 'border-success/40 bg-success/5' : ''}`}
            >
              <p className="font-medium">{String.fromCharCode(65 + index)}. {option}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-success/25 bg-success/5 p-3">
          <strong>Answer:</strong> {question.answer}
        </div>
        <details className="rounded-lg border p-3" open>
          <summary className="cursor-pointer font-semibold">Direct calculation solution</summary>
          <ol className="mt-3 space-y-2 leading-6 text-muted-foreground">
            {question.explanationLines.map((step, index) => (
              <li key={`${question.questionId}-step-${index}`}>{index + 1}. {step}</li>
            ))}
          </ol>
        </details>
      </CardContent>
    </Card>
  );
}

export function QuestionStudioInterestReviewPanel() {
  const [pkg, setPkg] = useState<InterestReviewPackage | null>(null);
  const [status, setStatus] = useState<InterestReviewStatus | null>(null);
  const [language, setLanguage] = useState<InterestReviewLanguage>('en');
  const [checkpointId, setCheckpointId] = useState<InterestReviewCheckpointId | typeof ALL>(ALL);
  const [qlId, setQlId] = useState(ALL);
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<InterestReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<'preview' | 'run' | null>(null);

  const refreshStatus = async () => {
    const next = await getInterestReviewStatus();
    setStatus(next);
    return next;
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([getInterestReviewPackage(), getInterestReviewStatus()])
      .then(([packageResponse, statusResponse]) => {
        if (!active) return;
        setPkg(packageResponse.package);
        setStatus(statusResponse);
      })
      .catch((error) => {
        showToast.error(
          'Interest package unavailable',
          error instanceof Error ? error.message : 'Unable to load the Interest chapter review package.',
        );
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visibleQls = useMemo(() => {
    if (!pkg) return [] as string[];
    if (checkpointId === ALL) return pkg.permanentQlIds;
    return pkg.checkpoints.find((entry) => entry.checkpointId === checkpointId)?.qlIds ?? [];
  }, [checkpointId, pkg]);

  useEffect(() => {
    if (qlId !== ALL && !visibleQls.includes(qlId)) setQlId(ALL);
  }, [qlId, visibleQls]);

  const request = useMemo(() => ({
    language,
    checkpointId: checkpointId === ALL ? undefined : checkpointId,
    qlId: qlId === ALL ? undefined : qlId,
    count: Math.min(50, Math.max(1, count)),
    seed: seed.trim() || undefined,
  }), [checkpointId, count, language, qlId, seed]);

  const handlePreview = async () => {
    setWorking('preview');
    try {
      const result = await previewInterestReview({ ...request, count: Math.min(20, request.count) });
      setQuestions(result.questions);
      showToast.success('Interest preview loaded', `${result.questions.length} frozen question(s) validated.`);
    } catch (error) {
      showToast.error('Preview failed', error instanceof Error ? error.message : 'Unable to preview Interest questions.');
    } finally {
      setWorking(null);
    }
  };

  const handleCreateRun = async () => {
    setWorking('run');
    try {
      const result = await createInterestReviewRun(request);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshStatus();
      showToast.success(
        'Interest review run created',
        `${result.publicCode} contains ${result.itemCount} review-only question(s).`,
      );
    } catch (error) {
      showToast.error('Run creation failed', error instanceof Error ? error.message : 'Unable to create the Interest chapter review run.');
    } finally {
      setWorking(null);
    }
  };

  return (
    <Card className="border-warning/25 bg-warning/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Landmark className="h-4 w-4" /> Interest · INT-001 · Complete chapter
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <ShieldAlert className="h-3 w-3" /> Review-only registration
            </Badge>
            <Badge variant="outline">133 QLs · EN/HI/PA</Badge>
            <Badge variant="outline" className="gap-1"><Layers3 className="h-3 w-3" /> 10 checkpoints</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Generate from the complete certified Interest authority. Every permanent QL is available in English, Hindi and Punjabi, including QL132–134 under their logical CP007/CP010 ownership. Solutions use the direct-calculation presentation standard.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {status && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Metric label="Permanent QLs" value={status.permanentQlCount} />
            <Metric label="Checkpoints" value={status.checkpointCount} />
            <Metric label="Studio items" value={status.generationItemCount} />
            <Metric label="Review-approved" value={status.approvedItemCount} />
            <Metric label="Question Bank" value={status.questionBankCount} />
          </div>
        )}

        <div className="rounded-lg border border-warning/30 bg-background/60 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlert className="h-4 w-4" /> Downstream release lock
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Question Studio review persistence is enabled. Question Bank conversion, scored-test eligibility, mock delivery and public/student publication remain disabled until a separate release checkpoint is explicitly opened.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading the complete Interest review package…
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Field label="Checkpoint">
              <Select value={checkpointId} onValueChange={(value) => setCheckpointId(value as InterestReviewCheckpointId | typeof ALL)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All checkpoints</SelectItem>
                  {(pkg?.checkpoints ?? []).map((entry) => (
                    <SelectItem key={entry.checkpointId} value={entry.checkpointId}>
                      {entry.checkpointId} · {entry.label} ({entry.permanentQlCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Language">
              <Select value={language} onValueChange={(value) => setLanguage(value as InterestReviewLanguage)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(pkg?.supportedLanguages ?? ['en', 'hi', 'pa']).map((entry) => (
                    <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="QL">
              <Select value={qlId} onValueChange={setQlId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All QLs</SelectItem>
                  {visibleQls.map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Count">
              <Input type="number" min={1} max={50} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} />
            </Field>
            <Field label="Optional deterministic seed">
              <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="interest-review-01" />
            </Field>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void handlePreview()} disabled={!pkg || working !== null}>
            {working === 'preview' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />} Preview
          </Button>
          <Button onClick={() => void handleCreateRun()} disabled={!pkg || working !== null}>
            {working === 'run' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />} Create review run
          </Button>
        </div>

        {questions.length > 0 && (
          <div className="space-y-4 border-t pt-5">
            {questions.map((question) => (
              <InterestQuestionCard key={question.questionId} question={question} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
