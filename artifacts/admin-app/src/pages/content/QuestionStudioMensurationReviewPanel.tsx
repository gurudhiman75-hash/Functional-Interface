import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Eye, Loader2, ShieldAlert, Shapes } from 'lucide-react';

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
  createMensurationReviewRun,
  getMensurationReviewPackage,
  getMensurationReviewStatus,
  previewMensurationReview,
  type MensurationReviewDifficulty,
  type MensurationReviewLanguage,
  type MensurationReviewPackage,
  type MensurationReviewQuestion,
  type MensurationReviewStatus,
} from '@/features/question-studio/mensuration-review-api';

const ALL = 'all';
const LANGUAGE_LABELS: Record<MensurationReviewLanguage, string> = {
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

function QuestionCard({ question }: { question: MensurationReviewQuestion }) {
  return (
    <Card className="border-primary/15 bg-background">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{question.qlId}</Badge>
          <Badge variant="secondary">{question.difficultyBand}</Badge>
          <Badge variant="outline">{LANGUAGE_LABELS[question.language]}</Badge>
          {question.validation.valid && (
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <CheckCircle2 className="h-3 w-3" /> Approved frozen source
            </Badge>
          )}
          {question.validation.completeCalculation && <Badge variant="outline">Worked calculation</Badge>}
          {question.language === 'pa' && question.validation.punjabiSurfaceOrthographyLocked && (
            <Badge variant="outline">ਸਤ੍ਹਾ locked</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{question.canonicalItemId}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="whitespace-pre-wrap font-medium leading-6">{question.stem}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {question.optionDetails.map((option) => (
            <div
              key={`${question.questionId}-${option.label}`}
              className={`rounded-lg border p-3 ${option.isCorrect ? 'border-success/40 bg-success/5' : ''}`}
            >
              <p className="font-medium">{option.label}. {option.text}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-success/25 bg-success/5 p-3">
          <strong>Answer:</strong> {question.answer}
        </div>
        <details className="rounded-lg border p-3" open>
          <summary className="cursor-pointer font-semibold">Teaching solution</summary>
          <ol className="mt-3 space-y-2 leading-6 text-muted-foreground">
            {question.explanation.steps.map((step, index) => (
              <li key={`${question.questionId}-step-${index}`}>{index + 1}. {step}</li>
            ))}
          </ol>
        </details>
      </CardContent>
    </Card>
  );
}

export function QuestionStudioMensurationReviewPanel() {
  const [pkg, setPkg] = useState<MensurationReviewPackage | null>(null);
  const [status, setStatus] = useState<MensurationReviewStatus | null>(null);
  const [language, setLanguage] = useState<MensurationReviewLanguage>('en');
  const [qlId, setQlId] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<MensurationReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<'preview' | 'run' | null>(null);

  const refreshStatus = async () => {
    const next = await getMensurationReviewStatus();
    setStatus(next);
    return next;
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([getMensurationReviewPackage(), getMensurationReviewStatus()])
      .then(([packageResponse, statusResponse]) => {
        if (!active) return;
        setPkg(packageResponse.package);
        setStatus(statusResponse);
      })
      .catch((error) => {
        showToast.error(
          'Mensuration package unavailable',
          error instanceof Error ? error.message : 'Unable to load MEN-CP-009 review package.',
        );
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const request = useMemo(() => ({
    language,
    qlId: qlId === ALL ? undefined : qlId,
    difficulty: difficulty === ALL ? undefined : difficulty as MensurationReviewDifficulty,
    count: Math.min(50, Math.max(1, count)),
    seed: seed.trim() || undefined,
  }), [count, difficulty, language, qlId, seed]);

  const handlePreview = async () => {
    setWorking('preview');
    try {
      const result = await previewMensurationReview({ ...request, count: Math.min(20, request.count) });
      setQuestions(result.questions);
      showToast.success('MEN-CP-009 preview loaded', `${result.questions.length} approved frozen question(s) validated.`);
    } catch (error) {
      showToast.error('Preview failed', error instanceof Error ? error.message : 'Unable to preview MEN-CP-009 questions.');
    } finally {
      setWorking(null);
    }
  };

  const handleCreateRun = async () => {
    setWorking('run');
    try {
      const result = await createMensurationReviewRun(request);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshStatus();
      showToast.success('MEN-CP-009 review run created', `${result.publicCode} contains ${result.itemCount} review-only question(s).`);
    } catch (error) {
      showToast.error('Run creation failed', error instanceof Error ? error.message : 'Unable to create MEN-CP-009 review run.');
    } finally {
      setWorking(null);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shapes className="h-4 w-4" /> Mensuration · MEN-002 · CP-009
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1"><ShieldAlert className="h-3 w-3" /> Review only</Badge>
            <Badge variant="outline">28 QLs · EN/HI/PA</Badge>
            <Badge variant="outline">Teaching V4 frozen</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Preview or queue the approved Spheres & Hemispheres teaching runtime in English, Hindi or Punjabi. Explanations retain 4–5 teaching steps, visible middle calculations and explicit π substitution when required. Punjabi surface terminology is frozen to ਸਤ੍ਹਾ. Question Bank, mocks/tests and public delivery remain locked.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {status && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Permanent QLs" value={status.permanentQlCount} />
            <Metric label="Studio items" value={status.generationItemCount} />
            <Metric label="Review-approved" value={status.approvedItemCount} />
            <Metric label="Question Bank" value={status.questionBankCount} />
          </div>
        )}

        <div className="rounded-lg border border-primary/20 bg-background/60 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium"><ShieldAlert className="h-4 w-4" /> Downstream release lock</div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            This registration allows Question Studio preview and review-queue persistence only. Approval here must not convert items into Question Bank records or enable scored tests, mocks or student publication.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading MEN-CP-009 review package…
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Field label="Language">
              <Select value={language} onValueChange={(value) => setLanguage(value as MensurationReviewLanguage)}>
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
                  {(pkg?.qlIds ?? []).map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All difficulties</SelectItem>
                  {(pkg?.supportedDifficulties ?? []).map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Count">
              <Input type="number" min={1} max={50} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} />
            </Field>
            <Field label="Optional seed">
              <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="men-cp009-review-01" />
            </Field>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void handlePreview()} disabled={!pkg || working !== null}>
            {working === 'preview' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />} Preview
          </Button>
          <Button onClick={() => void handleCreateRun()} disabled={!pkg || working !== null}>
            {working === 'run' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create review run
          </Button>
        </div>

        {questions.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">Approved learner preview</h3>
              <Badge variant="outline">{questions.length} question(s)</Badge>
            </div>
            {questions.map((question) => <QuestionCard key={question.questionId} question={question} />)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
