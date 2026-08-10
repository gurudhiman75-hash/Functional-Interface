import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Database, Eye, Loader2, ShieldAlert, Waypoints } from 'lucide-react';

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
import type {
  ReasoningReviewDifficulty,
  ReasoningReviewLanguage,
  ReasoningReviewQuestion,
} from '@/features/question-studio/reasoning-review-api';
import {
  createSeriesReviewRun,
  getSeriesReviewPackage,
  getSeriesReviewStatus,
  previewSeriesReview,
  type SeriesReviewPackage,
  type SeriesReviewStatus,
} from '@/features/question-studio/series-review-api';

const ALL = 'all';
const LANGUAGE_LABELS: Record<ReasoningReviewLanguage, string> = {
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

function SeriesQuestionCard({ question }: { question: ReasoningReviewQuestion }) {
  return (
    <Card className="border-primary/15 bg-background">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{question.qlId}</Badge>
          <Badge variant="secondary">{question.difficultyBand}</Badge>
          <Badge variant="outline">{LANGUAGE_LABELS[question.language]}</Badge>
          {question.validation.valid && (
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <CheckCircle2 className="h-3 w-3" /> Frozen authority validated
            </Badge>
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
        <details className="rounded-lg border p-3">
          <summary className="cursor-pointer font-semibold">Full frozen explanation</summary>
          <ol className="mt-3 space-y-2 leading-6 text-muted-foreground">
            {question.explanation.steps.map((step, index) => (
              <li key={`${question.questionId}-step-${index}`}>{index + 1}. {step}</li>
            ))}
          </ol>
          {question.explanation.conclusion && (
            <p className="mt-3"><strong>Answer:</strong> {question.explanation.conclusion}</p>
          )}
        </details>
      </CardContent>
    </Card>
  );
}

export function QuestionStudioSeriesReviewPanel() {
  const [pkg, setPkg] = useState<SeriesReviewPackage | null>(null);
  const [status, setStatus] = useState<SeriesReviewStatus | null>(null);
  const [language, setLanguage] = useState<ReasoningReviewLanguage>('en');
  const [qlId, setQlId] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<ReasoningReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<'preview' | 'run' | null>(null);

  const refreshStatus = async () => {
    const next = await getSeriesReviewStatus();
    setStatus(next);
    return next;
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([getSeriesReviewPackage(), getSeriesReviewStatus()])
      .then(([packageResponse, statusResponse]) => {
        if (!active) return;
        setPkg(packageResponse.package);
        setStatus(statusResponse);
      })
      .catch((error) => {
        showToast.error(
          'Series package unavailable',
          error instanceof Error ? error.message : 'Unable to load the Series review package.',
        );
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const request = useMemo(() => ({
    language,
    qlId: qlId === ALL ? undefined : qlId,
    difficulty: difficulty === ALL ? undefined : difficulty as ReasoningReviewDifficulty,
    count: Math.min(50, Math.max(1, count)),
    seed: seed.trim() || undefined,
  }), [count, difficulty, language, qlId, seed]);

  const handlePreview = async () => {
    setWorking('preview');
    try {
      const result = await previewSeriesReview({ ...request, count: Math.min(20, request.count) });
      setQuestions(result.questions);
      showToast.success('Series preview loaded', `${result.questions.length} frozen question(s) validated.`);
    } catch (error) {
      showToast.error('Preview failed', error instanceof Error ? error.message : 'Unable to preview Series questions.');
    } finally {
      setWorking(null);
    }
  };

  const handleCreateRun = async () => {
    setWorking('run');
    try {
      const result = await createSeriesReviewRun(request);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshStatus();
      showToast.success(
        'Series review run created',
        `${result.publicCode} contains ${result.itemCount} review-only question(s).`,
      );
    } catch (error) {
      showToast.error('Run creation failed', error instanceof Error ? error.message : 'Unable to create the Series review run.');
    } finally {
      setWorking(null);
    }
  };

  return (
    <Card className="border-warning/25 bg-warning/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Waypoints className="h-4 w-4" /> Series · SER-001
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <ShieldAlert className="h-3 w-3" /> Review-only lifecycle
            </Badge>
            <Badge variant="outline">140 templates · 13 QLs · 3 languages</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Generate the frozen English, Hindi or Punjabi Series corpus into the normal Question Studio review queue. Editorial approval is allowed, but Question Bank conversion, mock-test eligibility and public publication remain explicitly locked.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {status && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Frozen templates" value={status.frozenTemplateCount} />
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
            A Series item may be marked approved after editorial review, but that approval deliberately skips Question Bank conversion. The chapter remains ineligible for tests and student publication until a separate product release is explicitly authorised.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading Series review package…
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Field label="Language">
              <Select value={language} onValueChange={(value) => setLanguage(value as ReasoningReviewLanguage)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(pkg?.supportedLanguages ?? ['en']).map((entry) => (
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
            <Field label="Optional deterministic seed">
              <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="series-review-01" />
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
              <SeriesQuestionCard key={question.questionId} question={question} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
